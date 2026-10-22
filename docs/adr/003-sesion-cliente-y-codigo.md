# ADR-003: Autenticación del cliente con Supabase Auth (teléfono verificado por OTP) y reglas del código

- **Estado:** **Aceptado (2026-10-22).** Sustituye lo decidido en D-025 del 21 oct 2026 (identidad y sesión propias, «por confirmar»). Aprobado por Aarón el 22 oct 2026 y registrado como D-031. Las reglas del código de D-024 siguen vigentes, con los límites recalculados en la sección 2.8.
- **Fecha:** 22 oct 2026
- **Decidió:** Aarón López Sosa (fundador)
- **Autor:** `lealtab-arquitecto`
- **Restricciones vigentes:**
  - D-005: entrada del dueño con correo + código o contraseña.
  - D-010: cuenta compartida por negocio, sin PIN ni staff.
  - D-011 y D-024: código por WhatsApp (principal) y SMS (respaldo) con SMS Masivos y el hook de Supabase (ADR-004).
  - D-013 y D-019: una sola app; `identidad` por teléfono y `cliente_negocio` por negocio, cada uno con su nombre.
  - D-018 y RNF-STK-10: sin cookies de analítica ni recursos de terceros.
  - D-023 y ADR-002: Supabase Auth; todo cambio de base es una migración.
  - D-026: borrar la cuenta desde C5 con efecto inmediato.
  - D-031: el cliente usa Supabase Auth con teléfono verificado desde el registro.
  - ADR-001 §7: `install_token` de iOS.
- **Estado de las pruebas:** varias piezas no están comprobadas con la documentación oficial. Están en la sección 3 y **bloquean la construcción** de lo que dependa de ellas. Este ADR no afirma que funcionen.

## 1. Contexto

D-031 revierte a D-025: en lugar de una sesión propia, el cliente se autentica con Supabase Auth con su teléfono verificado por un código desde el registro en C1. Motivo de Aarón: un solo sistema de autenticación.

Lo que se verificó en la documentación de Supabase (consultada el 21 oct 2026):

- **Login por teléfono.** `signInWithOtp({ phone })` envía un código de 6 dígitos y `verifyOtp({ phone, token, type: 'sms' })` devuelve la sesión con access y refresh token ([phone-login](https://supabase.com/docs/guides/auth/phone-login)). La página dice a la vez «verifica en 60 segundos» y «expira en 1 hora», y no da un máximo. En una instalación propia el valor se llama `SMS_OTP_EXP` (segundos) y se reportan rangos de 60 a 600 s en el panel, pero esos rangos vienen de fuentes de terceros ([self-hosted phone](https://supabase.com/docs/guides/self-hosting/self-hosted-phone-mfa)). **Hay que confirmar en el panel de nuestro proyecto que 10 min (600 s) es alcanzable.**
- **Hook de SMS.** Recibe `user` y `sms.otp` (6 dígitos); 200 vacío es éxito ([docs](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook)). La página **no dice** si hace falta un proveedor nativo habilitado, ni el tiempo máximo del hook, ni qué métodos del cliente lo disparan. Lectura del código de Supabase Auth (`internal/api/phone.go`, rama `master`): si el hook está habilitado se invoca el hook y **no se consulta ningún proveedor**; si no, se pide el proveedor al enviar. El hook se invoca **antes** de guardar el hash del código y dentro de la transacción ([código](https://github.com/supabase/auth/blob/master/internal/api/phone.go)). Falta confirmar que el endpoint `/otp` no exija el interruptor del proveedor de teléfono; **es la prueba 1 de la sección 3.**
- **Límites** ([rate-limits](https://supabase.com/docs/guides/auth/rate-limits)): SMS enviados, **30 por hora por proyecto** (configurable); altas e inicios (`/otp`, `/user`, etc.), 30 por 5 min **por IP** (configurable); `/verify`, 30 por 5 min por IP (configurable); `/token`, 150 por 5 min por IP (configurable); ventana de 60 s por usuario para pedir otro código; inicio anónimo, 30 por hora por IP. La documentación **no describe un tope de intentos fallidos por código**; no se afirma que exista.
- **Sesiones** ([sessions](https://supabase.com/docs/guides/auth/sessions)): el refresh token rota y se usa una vez; se tolera su reuso durante **10 s** y si el token reusado ya tiene hijo activo se devuelve el activo; fuera de eso se toma como robo y **se termina la sesión completa**. El plazo máximo de la sesión y el de inactividad son de planes de pago (Pro o superior).
- **Cierre de sesión** ([signOut](https://supabase.com/docs/reference/javascript/auth-signout)): `scope` `global`, `local` u `others` (cierra las demás y conserva la actual). **Un access token ya emitido sigue válido hasta que vence**; la página no ofrece una forma de revocarlo antes.
- **Borrado** ([deleteUser](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser)): requiere la llave `service_role`, solo en servidor. La página no dice qué pasa con las sesiones ni con las llaves foráneas.
- **RLS** ([RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)): `app_metadata` no lo edita el usuario y sirve para autorización; `user_metadata` sí lo edita el usuario y no se usa nunca. Un JWT puede estar desactualizado hasta que se refresque. Conviene nombrar siempre el rol con `to`.
- **Claims** ([custom access token hook](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook)): un hook puede agregar o cambiar claims y rechazar un inicio de sesión. La página no dice de qué planes es.
- **`Sb-Forwarded-For`.** Existe un cambio en el servidor de Auth que usa ese encabezado para la IP y los límites, **apagado por defecto** y con un interruptor de configuración (PR #2295 de supabase/auth, hallado en una búsqueda web). No se sabe si el proyecto alojado lo tiene encendido ni si se puede pedir. **No se confía en él hasta probarlo.**

### Lo que no se puede hacer con Supabase

- **Acuñar una sesión para un usuario sin código.** No hay una llamada documentada de administración que cree una sesión para un teléfono. Esto afecta al `install_token` de iOS (sección 2.3).
- **Limitar los intentos por código.** Supabase solo limita `/verify` por IP. Cualquiera con la llave pública (`anon`) puede llamar a Auth directamente y saltarse nuestro servidor, así que el tope de 5 intentos por código **solo se puede imponer en el flujo normal**, no a quien llama a Supabase por fuera (sección 2.8).
- **Revocar un access token antes de que venza.** La defensa es que las políticas de RLS dependan de filas (membresía), no solo del token (sección 2.6).

## 2. Decisión

### 2.1 Cliente como usuario de Supabase Auth

- Cada cliente es un usuario de `auth.users` con **teléfono verificado**. La `identidad` queda ligada con `identidad.auth_user_id` (único, no nulo, `ON DELETE CASCADE` desde `auth.users`).
- `identidad`: `id`, `whatsapp` (E.164, único), `auth_user_id`, `verificado_ts`, `creada_ts`. **Sin nombre** (D-019). `verificado` es siempre verdadero: no existe una identidad sin código.
- `cliente_negocio`: `id`, `identidad_id`, `negocio_id`, `nombre`, `acepto_aviso_ts`, `alta_ts`. **Sin `estado`**: desaparece `por_confirmar`. Uno por identidad y negocio. Lo que pasa tras el borrado de la cuenta sigue en PQ-04.
- **Se eliminan** la tabla `sesion_cliente`, la cookie propia con `Path=/c/` y el usuario «sombra».
- Supabase guarda el teléfono sin el signo `+`. La comparación con `identidad.whatsapp` se hace normalizando; una prueba lo cubre.

### 2.2 Registro, entrada y segundo negocio (C1)

**Primer negocio (sin sesión en ese navegador):**

1. En `/c/{slug}/` (C1) el cliente escribe nombre, WhatsApp (10 dígitos, RF-APP-03) y acepta el aviso.
2. El navegador llama a `POST /c/api/auth/codigo` (ruta de Next.js). El servidor llama a `signInWithOtp({ phone, options: { shouldCreateUser: true } })` **sin `channel`**. La respuesta es siempre la misma («Te enviamos un código»), exista o no el teléfono.
3. Supabase llama al hook `/api/hooks/send-sms` (ADR-004), que valida límites y envía por SMS Masivos.
4. El cliente escribe los 6 dígitos. `POST /c/api/auth/verificar` llama a `verifyOtp` y, si sale bien, el servidor escribe la cookie de sesión (sección 2.4).
5. En una sola transacción (función `SECURITY DEFINER` invocada por el servidor), con el nombre y el consentimiento que se guardaron del paso 1 (en el estado del formulario del navegador, no en la base):
   - crea la `identidad` si no existe (si existe, la reutiliza: es el caso de quien ya usa LealTab y entra desde otro navegador);
   - crea el `cliente_negocio` del negocio (si ya existía, no lo duplica);
   - crea la `tarjeta_cliente` y aplica el sello de bienvenida si está activo y el `cliente_negocio` es nuevo.
6. Se muestra C3.

**Segundo negocio con sesión en ese navegador:** no pide código. Pide el nombre para ese negocio (D-019) y el consentimiento del aviso de ese negocio. La tarjeta queda activa.

**Segundo negocio sin sesión** (otro navegador, otro teléfono, PWA sin instalar): el mismo flujo del primer negocio. Al verificar entra, y «Mis tarjetas» muestra todas las de su identidad (recuperación). **Cierra PQ-22 (h): se usa el código; ya no existe la confirmación sin costo.**

**Cambio de teléfono (`/c/recuperar`):** el mismo camino que el registro sin sesión, escrito con el teléfono nuevo. Para llegar a las tarjetas del número viejo, el cliente usa el número viejo; si ya no lo tiene, empieza una cuenta nueva (sin recuperar nada). Al verificar, `signOut({ scope: 'others' })` revoca las demás sesiones del usuario: así el dueño real del número desplaza a quien lo registró antes. Los access tokens de esas sesiones siguen válidos hasta 1 hora, pero la RLS por membresía (2.6) no depende de ellos para dejar entrar a otro.

**Dato que el negocio no puede deducir:** la respuesta de los pasos 2 y 4 y lo que ve el negocio son iguales para un teléfono nuevo o existente. El dueño nunca ve la `identidad` (2.6). Se mantiene RF-CLI-08.

### 2.3 PWA y `install_token`

- **Android (Chrome):** la PWA instalada comparte las cookies con Chrome (ADR-001 §7, punto 5). Sin transferencia. **Se confirma en la prueba de RNF-PWA-07.**
- **iOS:** la PWA nace sin las cookies de Safari. El `install_token` sigue: aleatorio de 128 bits o más, de un solo uso, ligado a la identidad, con vigencia de 24 h, y se guarda solo su hash. Va en `start_url` del manifest como en ADR-001 §7.
- **El canje por una sesión de Supabase es el punto débil.** Se evaluaron tres mecanismos:

  | | Mecanismo | Resultado |
  |---|---|---|
  | **A** | El servidor guarda una **sesión distinta** para la PWA: asigna al usuario un correo técnico (`<uuid>@cliente.lealtab.invalid`, con `email_confirm`), pide `auth.admin.generateLink({ type: 'magiclink' })` y canjea el `hashed_token` con `verifyOtp({ token_hash, type: 'magiclink' })`. Cada dispositivo tiene su sesión | **Candidata.** La documentación de `generateLink` solo describe enlaces de correo y **no confirma** que devuelva `hashed_token` ni que se canjee así; es una práctica conocida que hay que probar. Costos: el usuario del cliente tendría un correo técnico (se distingue del dueño por `app_metadata.rol`) y habría que impedir que ese correo reciba códigos de entrada |
  | **B** | La PWA pide un **código nuevo** al abrirse por primera vez | **Alternativa y respaldo.** Funciona seguro, sin pruebas. Cuesta un mensaje más por cada iPhone que instala (MXN 0.77 a 0.90) y una fricción más en el momento de instalar |
  | C | El servidor entrega a la PWA el access y el refresh token de la sesión de Safari | **Descartado.** El refresh token rota: si Safari y la PWA lo usan, uno de los dos lo reutiliza fuera de los 10 s tolerados y Supabase termina la sesión completa. Los dos dispositivos se quedan sin sesión |

- **Prueba obligatoria antes de construir:** mecanismo A en iPhone con iOS 18 y 26. Si falla, se usa B. Esto es la **PQ-31**. MET-06 mide la transferencia.
- Reglas de cualquiera de los mecanismos: el canje es un `POST` del servidor, el token se quita de la URL con `history.replaceState`, se marca usado al canjear aunque falle el segundo paso, y una vez canjeado no abre sesión.

### 2.4 Cookies y sesión

- **El navegador nunca llama a Supabase Auth** ni usa `supabase-js` para la sesión del cliente. Todo pasa por rutas del servidor. Motivos: RNF-STK-10 (sin conexiones a terceros desde el navegador), y que una cookie escrita por JavaScript en Safari puede caducar a los 7 días (ADR-001 H9), mientras que la que escribe el servidor con `Set-Cookie` es de primera parte `[SUPUESTO: confirmar que ITP no la acorta; es la prueba de iOS de RNF-PWA-07]`.
- Cookies de sesión de Supabase escritas por el servidor con `@supabase/ssr` (`createServerClient`), con `HttpOnly`, `Secure`, `SameSite=Lax` y `Max-Age` de hasta 400 días (el máximo que aceptan los navegadores `[SUPUESTO]`):

  | Quién | Nombre de la cookie | Path |
  |---|---|---|
  | Cliente | `lt-cliente` | `/c` |
  | Dueño | `lt-dueno` | `/panel` |

  Con nombres y rutas distintos, un dueño que prueba la tarjeta en su propio navegador no pisa ni mezcla las dos sesiones, y la cookie del cliente nunca viaja a `/panel/` ni a la landing. `@supabase/ssr` no marca `HttpOnly` por defecto: hay que fijarlo y comprobar que `setAll` lo respeta (prueba 4).
- Se renueva en el `proxy` de Next.js (consultar la guía de Next 16.4 en `web/node_modules/next/dist/docs/` al construir). Las peticiones paralelas que renuevan el mismo token se cubren con los 10 s de tolerancia; las pruebas incluyen el service worker y las páginas que cargan varias peticiones.
- Plazos de sesión: Supabase no caduca el refresh token por sí mismo; el plazo máximo y el de inactividad exigen plan Pro, que ya es el supuesto de PQ-29. En el piloto no se fijan.
- Esto cambia la lectura de D-018: «sin cookies» significa «sin cookies de analítica ni de terceros»; la sesión es una cookie necesaria de primera parte. El aviso debe decirlo así (PQ-18).

### 2.5 Dueño y cliente en el mismo `auth.users`

- `app_metadata.rol` vale `dueno` o `cliente`. Lo escribe **solo el servidor** con la API de administración (`updateUserById`), nunca desde el navegador ni desde `user_metadata`.
- **Cuándo se escribe:** `verifyOtp` crea al usuario y abre la sesión antes de que el servidor pueda escribir el rol. La primera sesión no tiene rol y **no tiene acceso a nada** (negar por defecto). Justo después, el servidor escribe `rol = 'cliente'` y refresca la sesión para que el JWT lo lleve. Para el dueño, igual, al crear su negocio en N2. Una alternativa más sólida, **por probar**, es un *custom access token hook* que derive el claim de las tablas `identidad` y `dueno_negocio` en cada emisión de token (la página no dice de qué planes es).
- **El rol no es la barrera principal.** Cualquiera con la llave pública puede crear un usuario con correo o con teléfono directamente en Supabase. Por eso un usuario sin fila en `dueno_negocio` o en `identidad` no ve nada, tenga el claim que tenga. El claim es una segunda capa.
- **Exclusión mutua:** una restricción impide que un mismo `auth.users.id` esté en `identidad` y en `dueno_negocio`. El servidor se niega a crear una de las dos si existe la otra.

### 2.6 Esquema y RLS por rol

Principios:

- Todas las tablas con RLS activo. `anon` sin acceso a nada, salvo la vista pública del negocio (`negocio_publico`: nombre, logo, color, meta de sellos, recompensa y límite, solo para negocios activos o en prueba), que C1 necesita antes de registrarse.
- **Dos familias de políticas**, siempre con `to authenticated`: dueño y cliente. Cada política de una familia exige, en la misma condición, el rol de esa familia en `app_metadata` **y** la membresía por filas (no se usan políticas restrictivas globales, porque se aplicarían también a la otra familia en tablas que ven las dos):

```sql
-- Dueño: membresía por filas y claim, en la misma política.
create policy dueno_lee on tarjeta_cliente to authenticated
  using (
    (select auth.jwt() -> 'app_metadata' ->> 'rol') = 'dueno'
    and negocio_id in (select negocio_id from dueno_negocio
                       where user_id = (select auth.uid()))
  );

-- Cliente: pertenencia por identidad y claim.
create policy cliente_lee_suyas on tarjeta_cliente to authenticated
  using (
    (select auth.jwt() -> 'app_metadata' ->> 'rol') = 'cliente'
    and cliente_negocio_id in (
      select cn.id from cliente_negocio cn
      join identidad i on i.id = cn.identidad_id
      where i.auth_user_id = (select auth.uid()))
  );
```

El ejemplo es ilustrativo; la migración lo define y lo revisa `security-review`.

| Tabla | Dueño | Cliente |
|---|---|---|
| `negocio`, `tarjeta_config`, `dispositivo`, `evento`, `por_revisar`, `canje` | Lee y escribe lo de sus negocios (`dueno_negocio`); `alta_ts`, `tanda` y `version_producto` los escribe solo el servidor | Nada (usa `negocio_publico` y las funciones de abajo) |
| `identidad` | **Nada.** No existe política para el dueño | Lee su fila. Sin `insert`, `update` ni `delete`: solo las funciones del servidor |
| `cliente_negocio` | **Nada directo.** Lee a sus clientes por la vista `cliente_del_negocio` (`id` de `cliente_negocio`, nombre, WhatsApp, alta), verificando la membresía en la propia vista; **no expone `identidad_id`**, para que dos negocios no puedan cruzar un identificador | Lee sus filas (por `auth_user_id`). Escribe solo por función |
| `tarjeta_cliente` | Lee las de su negocio, sin la llave | Lee las suyas |
| `tarjeta_llave` (nueva: `tarjeta_id`, `llave_hmac`; sale de `tarjeta_cliente`) | **Nada.** El dueño no necesita la llave: el servidor valida el HMAC | Lee la suya (la necesita para generar el QR sin conexión). Los dos son `authenticated` y no se pueden separar con permisos de columna, por eso es otra tabla |
| `envio_codigo`, `codigo_intento`, `install_token` | Nada | Nada (solo el rol de servicio) |

- **Escrituras del cliente** (registro, sello de bienvenida, canje del `install_token`, borrado) solo por funciones `SECURITY DEFINER` en un esquema no expuesto, con el `search_path` fijado, que reciben el `auth.uid()` del llamador y devuelven datos de esa identidad.
- **Prueba obligatoria:** con un JWT de cliente no se lee ni una fila de otro cliente, ni de `identidad` ajena, ni nada de `negocio` fuera de `negocio_publico`; con un JWT de dueño no se lee `identidad` ni `tarjeta_llave`, ni nada de otro negocio; con un JWT de un usuario creado a mano (correo o teléfono) sin filas, no se lee nada. Todas con llamadas directas a la API REST de Supabase, no solo desde la app.
- La RLS por filas vuelve inocuo un access token viejo: tras borrar la cuenta o desplazar a una sesión, el usuario ya no tiene fila de la que colgar.

### 2.7 Borrar la cuenta (C5, D-026)

1. Función `SECURITY DEFINER`: borra la `identidad` (con `ON DELETE CASCADE`, sus `cliente_negocio` y `tarjeta_cliente`). Qué pasa con los eventos de sellos sigue en PQ-04.
2. El servidor llama a `auth.admin.deleteUser(auth_user_id)` con `service_role`.
3. El servidor borra la cookie `lt-cliente` y la pantalla limpia el almacenamiento local.
4. Si el paso 2 falla, queda un usuario con teléfono y sin `identidad`: no ve nada, pero guarda el teléfono. Se registra en una tabla de pendientes y un reintento lo cierra. La documentación no aclara qué pasa con las sesiones del usuario borrado: la prueba lo comprueba. El mismo teléfono puede registrarse de nuevo como cuenta nueva.

### 2.8 Reglas del código y límites (cierra la parte de ADR-003 de D-024)

| Regla | Valor | Dónde se impone |
|---|---|---|
| Longitud | 6 dígitos | Supabase (fija) |
| Vigencia | 10 min | Ajuste de Supabase (a confirmar, sección 1) |
| Intentos fallidos por código | 5; el quinto invalida el código | Nuestro servidor (`codigo_intento`); **no se puede imponer a quien llama a Supabase directo** |
| Bloqueo tras 5 fallos | 15 min por teléfono | Nuestro servidor, mismo límite |
| Espera entre envíos | 60 s | Supabase (ventana por usuario) y el hook |
| Envíos por teléfono | **3 por hora y 10 al día** | El hook (punto de paso obligado) |
| Envíos por IP | 10 por hora (aprobado 22 oct 2026) | Nuestro servidor, con la IP real |
| Tope global diario | **400** (aprobado 22 oct 2026), con aviso por correo a Aarón a los 200 | El hook |
| Tope global por hora de Supabase | Subir de 30 a 100 (aprobado 22 oct 2026) | Ajuste de Supabase |
| Alcance | Solo móviles de México de 10 dígitos; el hook rechaza otro prefijo | El hook y el servidor |

**Cómo se recalculó:**

- **Por teléfono: 3 por hora y 10 al día se quedan igual.** Un registro legítimo usa 1 código, y con reintentos, cambio a SMS o equivocaciones, 3. Un cliente que repite el flujo otro día en otro navegador usa otro más. 10 al día cubre varios casos seguidos y sigue protegiendo al dueño del número de un envío masivo. El registro no obliga a subirlo: lo que cambia es el volumen total, no el uso por persona.
- **Tope global: de 200 a 400 al día (aprobado 22 oct 2026).** Con 10 a 14 negocios y unos 200 clientes cada uno (2,000 a 2,800 altas), el día de arranque de un local puede traer 40 a 60 altas, y con tres locales el mismo día y 30 % de reenvíos pasa de 200. Con 400 y a MXN 0.90 el peor día de ataque cuesta unos MXN 360. Se ajusta con los datos del piloto.
- **El límite por hora de Supabase (30) hay que subirlo**: se rebasa con 31 registros en una hora, algo normal en una cafetería llena. Es configurable según la documentación; hay que comprobar que nuestro plan lo permite (prueba 3).
- **El límite por IP de Supabase afecta a todo el tráfico del servidor.** Si las llamadas salen desde Vercel, Supabase ve pocas IP y sus topes (30 por 5 min en `/otp` y `/verify`, 150 por 5 min en `/token`) se compartirían entre todos los clientes. Hay que subirlos mucho (son configurables) o confirmar `Sb-Forwarded-For` (prueba 3). Los topes por IP reales los aplica nuestro servidor.
- **`envio_codigo` sigue haciendo falta**, pero ya no es solo el registro de recuperaciones: guarda cada envío (fecha, teléfono, canal, resultado, `request_id`, propósito `registro`, `recuperacion` o `install`, IP con hash) y de ahí salen los conteos del hook y las alertas del ADR-004. Los límites de Supabase por sí solos no bastan porque no cubren por teléfono por hora ni por día, ni el tope global. Se conserva `[SUPUESTO]` 30 días.
- **Riesgo aceptado, por revisar en `security-review`:** el tope de 5 intentos no cubre a quien verifica directo contra Supabase. Allí solo rige el límite por IP de `/verify`: un código de 10^6 posibilidades vive 10 min, así que un atacante con muchas IP podría acertar el código de un teléfono que conoce. Lo que se gana es una tarjeta de sellos. Las mitigaciones por considerar son acortar la vigencia, un captcha (no se adopta: carga recursos de terceros, D-018) o una validación en el hook de acceso.

### 2.9 Lo que sigue igual

- Los sellos nunca dependen del código: el cajero puede buscar por WhatsApp (RF-SEL-02).
- Sin verificación por el cajero en el piloto (D-024).

## 3. Por definir

Pruebas obligatorias **antes de construir** lo que dependa de ellas:

1. **Hook sin proveedor nativo (PQ-30, compartida con ADR-004).** Que `signInWithOtp({ phone })` llegue al hook con el interruptor del proveedor de teléfono encendido pero sin proveedor configurado (o con uno de relleno). **Si Supabase no lo permite**, las salidas son: (a) configurar Twilio como proveedor nominal con credenciales de relleno y dejar que el hook intercepte, si la prueba muestra que el hook tiene prioridad; (b) código propio sin Supabase Auth, lo que contradice a D-031 y D-023 y se lleva a Aarón. No se elige ninguna sin la prueba.
2. **`install_token` de iOS con sesión de Supabase (PQ-31).** Mecanismo A (correo técnico, `generateLink`, `verifyOtp` con `token_hash`) y rotación del refresh token en la PWA, en iOS 18 y 26. Si falla, mecanismo B (código nuevo).
3. **Límites de Supabase.** Que el proyecto permita subir el límite de SMS por hora y los de `/otp`, `/verify` y `/token` por IP; si `Sb-Forwarded-For` está disponible; y la vigencia de 10 min del código de teléfono.
4. **Cookies del servidor.** Que `@supabase/ssr` escriba cookies `HttpOnly` con nombre y `Path` propios, que dueño y cliente convivan en un navegador, y que Safari no las acorte.
5. **Revisión de seguridad (`security-review`).** Que el rol en `app_metadata`, la exclusión mutua, las vistas y las políticas de 2.6 aguanten las llamadas directas a la API, y el riesgo de intentos de 2.8.
6. **Enumeración.** Que `signInWithOtp` y `verifyOtp` no cambien su respuesta ni su tiempo entre teléfonos nuevos y existentes.
7. **Teléfono en `auth.users`.** Normalización contra `identidad.whatsapp`.
8. **Plazo legal de borrado** (PQ-04), **aviso de privacidad y consulta legal** (D-017, PQ-18): ahora el teléfono verificado vive también en Supabase (EE. UU.); y cómo se declara la cookie de sesión.
9. **Pantallas y eventos pendientes** (no son de este ADR): C1 en dos pasos, R1, C0 sin «por confirmar»; eventos de códigos pedidos, verificados y fallidos, y qué pasa con los eventos que citan `por_confirmar`.

## 4. Consecuencias

- **Un solo sistema de autenticación.** El dueño y el cliente comparten `auth.users`; el costo es separarlos con cuidado (2.5 y 2.6) y que la seguridad dependa de unas políticas bien probadas.
- **Cae el código propio:** sin `sesion_cliente`, sin cookie propia, sin usuario sombra, sin estado «por confirmar» ni MET-08.
- **Todo registro nuevo cuesta un mensaje y depende del proveedor.** Si SMS Masivos cae o se agota el saldo, **no se registran clientes nuevos** (R-18). Quien ya tiene sesión sigue entrando y los sellos no se afectan.
- **C1 pasa de uno a dos pasos**; MET-03 puede bajar. El segundo negocio con sesión sigue en un paso.
- **Costo del piloto** (`[SUPUESTO]`; a MXN 18.5 por USD, antes de IVA, con SMS como peor caso porque el WhatsApp no tiene precio publicado, PQ-30):

  | Concepto | Cálculo | Resultado |
  |---|---|---|
  | Altas | 10 a 14 negocios × 200 = 2,000 a 2,800 | |
  | Envíos con reintentos y recuperaciones | × 1.3 `[SUPUESTO]` | 2,600 a 3,640 |
  | Costo a MXN 0.90 | | MXN 2,340 a 3,276 |
  | Costo a MXN 0.77 (recargas de 1,000 o más) | | MXN 2,002 a 2,803 |
  | Equivalente | | USD 108 a 177, **una sola vez, repartido a lo largo del piloto** |

  Es un costo variable por cliente nuevo (alrededor de MXN 1.00 a 1.20 con reintentos), **mucho mayor que lo que estimaba ADR-004 solo para recuperaciones** (unos MXN 380). Se suma al supuesto de USD 20 a 50 al mes de infraestructura (RNF-REN-06) y se mide con MET-03. Si cada iPhone que instala usa el mecanismo B, suma un mensaje más por instalación.
- **El negocio ya no puede deducir** si un teléfono usa LealTab: la respuesta es la misma.
- **Datos:** el teléfono verificado queda en `auth.users` (Supabase, `us-east-1` `[SUPUESTO]`) además de `identidad`. Entra en el aviso y la consulta legal.
- **Un token de acceso viejo vive hasta 1 hora** tras cerrar sesiones; lo cubre la RLS por membresía.
- **Si falla la prueba 1,** D-031 no se puede construir como está y vuelve a Aarón con las salidas de la sección 3.

## 5. Alternativas descartadas

- **Inicio de sesión anónimo de Supabase.** Limita las altas a 30 por hora por IP, y el wifi de un local las agotaría (ver el límite en la sección 1). Tampoco verifica el teléfono.
- **Login social para el cliente** (Google o Apple). No elimina el OTP (el teléfono sigue siendo el identificador, D-019), obliga a compartir datos con un tercero (D-018, RNF-PRI-01) y el OAuth dentro de una PWA de iOS es frágil. Queda como candidato de la v1 solo para el dueño, sin decidir.
- **Mantener la sesión propia (D-025 original).** Sesión y tablas propias, usuario sombra, «por confirmar». Era más barata (sin código en el registro) pero no unificaba la autenticación. Aarón la sustituyó por D-031.
- **Código propio sin Supabase Auth.** Contradice a D-023; solo se reconsidera si falla la prueba 1.
- **Verificación opcional (sesión sin código y teléfono por verificar después).** No se evaluó: D-031 pide el teléfono verificado desde el registro.

## 6. Fuentes (consultadas el 21 oct 2026)

- https://supabase.com/docs/guides/auth/phone-login
- https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook
- https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook
- https://supabase.com/docs/guides/auth/rate-limits
- https://supabase.com/docs/guides/auth/sessions
- https://supabase.com/docs/guides/local-development/cli/config
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/reference/javascript/auth-signout
- https://supabase.com/docs/reference/javascript/auth-admin-deleteuser
- https://supabase.com/docs/reference/javascript/auth-admin-generatelink
- https://supabase.com/docs/guides/self-hosting/self-hosted-phone-mfa
- https://github.com/supabase/auth/blob/master/internal/api/phone.go
- Precios de SMS Masivos: https://www.smsmasivos.com.mx/precios-sms-masivos
