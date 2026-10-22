# ADR-003: Identidad y sesión del cliente, y reglas del código de recuperación

- **Estado:** **Aceptado (2026-10-21).** Aprobado por Aarón el 21 oct 2026 (PQ-22 g, h y e). Registrado como D-025 (sesión e identidad del cliente) y D-024 (reglas del código) en `docs/decisiones.md`.
- **Fecha:** 21 oct 2026
- **Decidió:** Aarón López Sosa (fundador)
- **Autor:** `lealtab-arquitecto`
- **Restricciones vigentes:**
  - D-005: entrada del dueño con correo + código o contraseña.
  - D-010: cuenta compartida por negocio, sin PIN ni staff.
  - D-011: código de recuperación por WhatsApp, con respaldo SMS (aclaración del 21 oct 2026).
  - D-013 y D-019: una sola app, `identidad` por teléfono y `cliente_negocio` por negocio.
  - D-018: sin cookies de analítica.
  - D-023 y ADR-002: Supabase Auth para el dueño; el hook de SMS para el código.
  - ADR-001 §5.2 punto 6 y §7: confirmación sin costo del segundo negocio y `install_token` en iOS.
- **Detalle técnico:** `docs/fase-7/propuestas/pq-arquitectura.md` §8. Si choca con `aprobaciones-2026-10-21.md`, manda este ADR, que sigue ese archivo.

## 1. Contexto

ADR-002 deja «Por definir» cómo se relaciona la `identidad` (teléfono E.164, D-019) con Supabase Auth y cómo se confirma un segundo negocio sin costo. Lo que obliga:

- D-023 y RNF-STK-04 asignan Supabase Auth al **dueño**.
- El cliente se registra sin contraseña y sin código (C1), y en iOS su sesión pasa al contenedor de la app instalada con un `install_token` de un solo uso (RNF-PWA-05).
- Supabase **no permite acuñar una sesión** para un teléfono sin pasar por un código. Tampoco cuenta intentos por código: solo limita la verificación por IP (30 cada 5 min), y el registro anónimo tiene 30 altas por hora por IP, que una cafetería con un solo Wi-Fi rebasaría ([límites](https://supabase.com/docs/guides/auth/rate-limits), consultado el 21 oct 2026).
- RF-APP-04 (código en cada segundo negocio sin sesión) choca con RF-APP-05 y ADR-001 §5.2 punto 6 («por confirmar», sin código).

### Opciones consideradas

| | Descripción | Resultado |
|---|---|---|
| G1 | El cliente es usuario de Supabase Auth (`identidad.id = auth.users.id`) | Descartada: ni C1 sin código ni el canje del `install_token` encajan, y el límite de altas por IP afecta a los mostradores |
| **G2** | `identidad` y sesión propias; Supabase Auth solo como motor del código | **Elegida** |
| G3 | Código propio, sin Supabase Auth | Respaldo si falla la prueba técnica (§3); contradice D-023 y obligaría a enmendarla |

Para el segundo negocio sin sesión: **A** (código por WhatsApp en cada alta) frente a **B** (confirmación sin costo, ADR-001). Se elige B.

## 2. Decisión

1. **Identidad y sesión propias.**
   - `identidad`: `id`, `whatsapp` (E.164, único), `verificado`, `verificado_ts`, `auth_user_id` (opcional, usuario «sombra»). **Sin nombre** (D-019).
   - `sesion_cliente`: `id`, `identidad_id`, `token_hash`, `origen` (`registro`, `install_token`, `recuperacion`), `creada_ts`, `ultimo_uso_ts`, `expira_ts` (hasta 400 días, renovable al usar; `[SUPUESTO]`: el máximo que aceptan los navegadores).
   - La sesión es una cookie `HttpOnly`, `Secure`, `SameSite=Lax`, **`Path=/c/`**, con un token aleatorio de 256 bits. En la base solo se guarda su hash.
2. **Acceso a datos del cliente.** `identidad`, `sesion_cliente`, `cliente_negocio` y `tarjeta_cliente` tienen RLS activo **sin políticas** para `anon` y `authenticated` (todo denegado). Solo el rol de servicio las toca, mediante funciones `SECURITY DEFINER` en un esquema aparte que reciben el token de sesión y devuelven únicamente datos de esa identidad. Las rutas `/c/api/*` son el único camino. «Mis tarjetas» filtra por la identidad de la sesión; cada negocio ve solo su `cliente_negocio` (RF-CLI-08).
3. **Supabase Auth, solo como motor del código de recuperación.**
   - Un envoltorio del servidor (`/c/api/recuperar/solicitar` y `/c/api/recuperar/verificar`) llama a `signInWithOtp` y `verifyOtp` con el teléfono. El navegador nunca llama a Supabase Auth.
   - Se crea un usuario «sombra» con solo teléfono. Una vez verificado el código, **la sesión de Supabase se descarta** (sin persistencia ni cookies de Supabase para el cliente) y el servidor emite la cookie propia.
   - El envoltorio reenvía la IP real con `Sb-Forwarded-For`.
4. **Un usuario sombra no es un dueño.** Los usuarios con teléfono en `auth.users` no tienen fila en `dueno_negocio`, y todas las políticas de negocio exigen esa pertenencia. Hay una prueba obligatoria: un token de Supabase de un usuario sombra no lee ni una fila de negocio.
5. **Segundo negocio sin sesión: gana RF-APP-05 sobre RF-APP-04.**
   - Si el WhatsApp ya existe y no hay sesión en ese navegador, la tarjeta nace `por_confirmar` y **no se manda código**.
   - Una tarjeta `por_confirmar` no aparece en «Mis tarjetas» ni da acceso a ningún dato de la identidad.
   - Con sesión válida en ese navegador, la tarjeta queda `activa` con un toque, sin código.
   - El código por WhatsApp o SMS solo existe en `/c/recuperar` (cambio de teléfono). La pantalla ofrece «Ya usé LealTab en otro teléfono» hacia ahí.
   - Se reemplaza el texto de RF-APP-04.
6. **Reglas del código (RF-APP-15).**

   | Regla | Valor |
   |---|---|
   | Longitud | 6 dígitos |
   | Vigencia | 10 min |
   | Intentos fallidos por código | 5; el quinto lo invalida |
   | Espera entre envíos | 60 s |
   | Envíos por teléfono | 3 por hora y 10 al día |
   | Bloqueo tras 5 fallos | 15 min por teléfono |
   | Tope global diario | `[SUPUESTO]` 200 envíos, con aviso por correo a Aarón; el valor se ajusta con el piloto |
   | Respuesta | No revela si el teléfono tiene tarjetas: «Si ese número tiene tarjetas, te enviamos un código» |
   | Alcance | Solo números de México de 10 dígitos (RF-APP-03) |

   El control vive en el envoltorio porque Supabase no cuenta intentos por código. La plantilla de WhatsApp es fija y no muestra la vigencia, así que el límite real lo aplica el envoltorio.
7. **Revocación de sesiones al recuperar.** Cuando una identidad se verifica por código (`verificado` pasa a `true`, o se recupera desde otro teléfono), se **revocan todas las sesiones anteriores** de esa identidad. Así el dueño real del número desplaza a quien registró su teléfono antes (secuestro previo).
8. **Sin verificación por el cajero en el piloto.** La recuperación no depende de N5. El respaldo del código es el SMS (ADR-004).
9. **Los sellos nunca dependen del código.** El cajero puede registrar buscando por WhatsApp (RF-SEL-02).

Textos que se derivan (para que el coordinador los lleve al PRD):

> **RNF-STK-04.** Supabase Auth autentica al dueño. El cliente no es usuario de sesión de Supabase: su `identidad` y sus sesiones están en tablas propias, con una cookie `HttpOnly` de primera parte. Supabase Auth solo es el motor del código de recuperación; la sesión que ese flujo crea se descarta y se emite la cookie propia.
>
> **RF-APP-04.** Si el WhatsApp ya está registrado y no hay sesión en ese navegador (R1), la tarjeta se crea «por confirmar» (RF-APP-05) sin enviar código.

## 3. Por definir

- **Prueba técnica del hook (compartida con ADR-004):** que `signInWithOtp` con teléfono dispare el hook sin proveedor nativo habilitado. Si falla, la salida es G3 (código propio, tabla con hash e intentos) y **se enmienda D-023**.
- **Aviso de privacidad y consulta legal (D-017, PQ-18):** cómo se declaran las cookies de sesión (primera parte, no de analítica) y si el abogado pide otra cosa sobre la sesión de «Mis tarjetas». Si concluye otro rumbo, se vuelve a la opción H del ADR-001.
- **Pantallas pendientes (no es de este ADR):** estado «tarjeta por confirmar» en C0 con «Aceptar» y «No soy yo» (borra el `cliente_negocio`), y R1 sin la promesa de código.
- **Plazo legal de borrado de cuenta** (PQ-04): fuera de este ADR.

## 4. Consecuencias

- **El cliente no depende de la sesión de Supabase** ni de sus límites por IP. El registro sin código (C1) y el canje del `install_token` funcionan sin acuñar sesiones de Supabase.
- **Hay un usuario sombra por identidad** en `auth.users` (solo teléfono). Exige la prueba de aislamiento del punto 4.
- **Cookie de sesión propia.** Es de primera parte y necesaria, no de analítica. D-018 y RNF-STK-10 («sin cookies») se leen como «sin cookies de analítica ni de terceros»; el aviso debe decirlo así (PQ-18).
- **Fuga aceptada (un bit).** Si `/c/{slug}/registro` contesta distinto a un teléfono nuevo y a uno existente, un negocio puede averiguar si un teléfono usa LealTab. Se mitiga con límite de intentos por IP y por teléfono; se lleva a la consulta legal. No revela en qué otros negocios está.
- **Quién da el primer sello de una tarjeta `por_confirmar`.** El cajero ve el estado al buscar por WhatsApp (RF-SEL-02) y el cliente la acepta desde su app. Si MET-08 sale en 20 % o más (tarjetas que nunca se confirman), se evalúa ofrecer «Confirmar con código» como opción.
- **Costo.** Quitar el código del alta del segundo negocio elimina un mensaje por alta y la dependencia del proveedor en el momento más sensible del registro (R-18).
- **Si falla la prueba del hook**, se pasa a G3 con una enmienda a D-023; el modelo de `identidad` y `sesion_cliente` no cambia.
