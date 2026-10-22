# Propuestas de diseño para cerrar PQ-10, PQ-12, PQ-19, PQ-20 y PQ-06

- **Estado:** propuesta. **Nada de esto está aprobado.** Aarón decide; después `lealtab-coordinador` registra las D- y actualiza el PRD.
- **Fecha:** 21 oct 2026 · **Fase:** 7 (Desarrollo del MVP + piloto 0) · **Autor:** `lealtab-product-designer`
- **No toca:** `brand/`, el PRD, `docs/decisiones.md`, `docs/adr/` ni `web/`. Todo cambio a esos archivos se propone aquí, con su texto.
- **Borradores de wireframe (HTML):**
  - `docs/fase-7/propuestas/diseno/n1-cuenta-contrasena.html` (PQ-10)
  - `docs/fase-7/propuestas/diseno/c5-mis-datos.html` (PQ-12)
  - Usan `brand/04-design-system/tokens.css` por ruta relativa, sin colores nuevos. **PNG pendiente:** en esta sesión no hubo navegador; el orquestador puede generarlos con el mismo procedimiento de la pieza 06.
- **Convenciones:** `[SUPUESTO]` = dato no verificado. **Por definir** = lo que las fuentes no resuelven. Cada decisión cita su evidencia. Los textos de interfaz son borradores para `lealtab-copywriter`.
- **Honestidad sobre lo externo:** no pude consultar la web en esta sesión. Lo que digo de Supabase Auth, NIST y OWASP viene de mi conocimiento previo, con la URL donde se verifica, y va marcado `[SUPUESTO: verificar]`. No lo tomes como hecho hasta que `lealtab-arquitecto` lo confirme.

## Qué bloquea cada PQ en la Fase 7

| PQ | Qué bloquea | Quién lo construye |
|---|---|---|
| PQ-10 | N1 completo (entrar y restablecer) | Desarrollador (panel) + arquitecto (Auth) |
| PQ-12 | C5 y el borrado de cuenta | Desarrollador (cliente) + arquitecto (borrado) |
| PQ-19 | Botón «Corregir sellos» de N7 y el cambio de número de sellos (RF-TAR-06) | Desarrollador + arquitecto (evento `correccion`, `meta_ciclo`) |
| PQ-20 | Consultas de N0, N6 y la ficha de N7 | Arquitecto + analista |
| PQ-06 | Una línea y una hoja de términos en C3 | Desarrollador (cliente) |

---

## PQ-10 · N1 con contraseña opcional y restablecimiento por correo

**Requisitos:** RF-ALT-02, RF-ALT-02b, RF-ALT-03 · **Decisión:** D-005 (actualizado 2026-10-21) · **Stack:** ADR-002 (Supabase Auth) · **Evidencia visual:** `alta/n1-cuenta.html` y L1 en `estados/b-cliente-y-acceso.html` (código de 6 dígitos que dura 10 minutos).

**Contexto.** N1 aprobado solo tiene el alta con código por correo. D-005 agrega la contraseña opcional con restablecimiento por correo. Faltan los estados de entrada, las reglas de la contraseña, la vigencia del restablecimiento y el bloqueo por intentos fallidos.

### Lo que da Supabase Auth de serie y lo que sería trabajo propio

Todo `[SUPUESTO: verificar]` por `lealtab-arquitecto`. Sin esto el diseño no se debe dar por construible.

| Tema | De serie en Supabase Auth (según mi conocimiento) | Trabajo propio si el diseño lo exige |
|---|---|---|
| Código por correo | Sí. La plantilla puede mostrar el código de 6 dígitos (`{{ .Token }}`) y se verifica con `verifyOtp`. [Plantillas](https://supabase.com/docs/guides/auth/auth-email-templates) | — |
| Vigencia del código | Un solo valor para todos los códigos y enlaces por correo (inicio de sesión, confirmación y recuperación), configurable. [Correo](https://supabase.com/docs/guides/auth/auth-email) | Si queremos vigencias distintas, no hay opción de serie. **Por eso propongo 10 min para ambos.** |
| Contraseña mínima y reglas de composición | Largo mínimo configurable (el valor por defecto es bajo) y reglas opcionales de mayúsculas, números y símbolos. [Contraseñas](https://supabase.com/docs/guides/auth/passwords) | — |
| Contraseñas filtradas | Revisión contra bases filtradas, según el plan (creo que desde Pro). [Seguridad de contraseñas](https://supabase.com/docs/guides/auth/password-security) | Si el plan no la incluye, queda fuera del MVP. No es requisito de diseño. |
| Límite de envíos y reintentos | Límites por IP en inicio de sesión y verificación, y un intervalo mínimo entre envíos de código al mismo usuario (60 s). [Límites](https://supabase.com/docs/guides/auth/rate-limits) | — |
| **Bloqueo por cuenta tras N contraseñas fallidas** | **No lo encontré de serie.** Existe un hook de verificación de contraseña, pero no sé a qué plan pertenece. [Hook](https://supabase.com/docs/guides/auth/auth-hooks/password-verification-hook) | Contador propio (tabla de intentos y una ruta del servidor que envuelva el inicio de sesión) o el hook, si el plan lo permite. Si ninguno entra, queda el límite por IP con los mismos textos (ver «Recomendación»). |
| Cerrar otras sesiones | `signOut` con alcance «otras». [Referencia](https://supabase.com/docs/reference/javascript/auth-signout) | — |
| **Envío de correos en producción** | El correo integrado es de pruebas y muy limitado. Para el piloto hace falta SMTP propio. [SMTP](https://supabase.com/docs/guides/auth/auth-smtp) | Elegir proveedor de correo. **Propongo una PQ nueva (PQ-28).** |

### Opciones y recomendación

**1. Dónde se crea la contraseña.**
- A. Campo siempre visible en el alta. Descartada: suma un campo al formulario y presiona la meta de MET-01 (alta en menos de 5 min); además contradice «opcional» (RF-ALT-02).
- **B (recomendada). Sección plegada «Crear también una contraseña (opcional)» en N1·1, y una fila «Acceso» en N8 → Tus datos** para crearla o cambiarla después. El alta no cambia para quien no la quiere.
- C. Solo en N8. Más simple, pero pierde a quien quiere dejarla puesta desde el primer minuto. Es el respaldo si la sección plegada estorba en las pruebas del alta.

**2. Restablecer: enlace o código.**
- Enlace. Descartada: depende de abrirlo en el mismo navegador que lo pidió `[SUPUESTO: verificar el flujo PKCE de Supabase]`, y el dueño suele leer el correo en otro teléfono.
- **Código de 6 dígitos (recomendada).** Es el mismo patrón que ya aprobó L1, funciona entre dispositivos y la pantalla es la misma que la de entrar con código.

**3. Vigencia.** **10 minutos**, igual que el código de entrada (D-005). Una hora sería más cómoda, pero Supabase tiene un solo valor para todos los códigos por correo, y subirlo cambiaría D-005. Si caduca, se pide otro (patrón L1).

**4. Reglas de la contraseña.** Mínimo **8** caracteres, máximo **72** `[SUPUESTO: límite de bcrypt, verificar]`, **sin reglas de composición** ni caducidad periódica, se puede pegar y mostrar. Base: NIST SP 800-63B (largo mínimo sin reglas de composición) y OWASP Authentication Cheat Sheet (permitir pegar, verificar contra contraseñas comunes). [NIST](https://pages.nist.gov/800-63-4/sp800-63b.html), [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) `[SUPUESTO: verificar]`.

**5. Intentos fallidos.**
- A. Solo el límite por IP de Supabase. Simple, pero el atacante lento no se frena y el dueño ve errores técnicos.
- **B (recomendada). 5 fallos seguidos de contraseña para el mismo correo pausan solo la contraseña 15 minutos; el código por correo sigue disponible.** Así un atacante no puede dejar al dueño fuera de su panel. Un acceso correcto reinicia el contador. Los 5 y los 15 son `[SUPUESTO]`: valores usuales, sin dato propio. Si el arquitecto no puede construir el contador, se entrega A con los mismos textos de la pantalla N1·7.
- Mensajes **genéricos** («Correo o contraseña incorrectos»; «Si ese correo tiene cuenta…») para no revelar quién está registrado. Desde el 3.er error se dice cuántos intentos quedan: ayuda al dueño y el costo para un atacante es bajo `[SUPUESTO]`.
- Código por correo: tras 5 códigos incorrectos el código deja de servir y se pide otro `[SUPUESTO: verificar si Supabase lo hace]`.
- Reenvío del código: cada 60 s (coincide con el intervalo de serie).

**6. Sesión tras restablecer.** Entra con sesión iniciada. **Las otras sesiones no se cierran por defecto**, porque una de ellas es el mostrador y D-015 pide que siga funcionando; hay una casilla «Cerrar sesión en mis otros dispositivos» para quien sospecha de un robo.

**7. Correo sin cuenta.** Alta con un correo que ya existe y «olvidé mi contraseña» con un correo que no existe responden igual: «Si ese correo tiene cuenta, te enviamos un código». Es el trato neutro; el costo es un mensaje menos directo. Si el arquitecto lo prefiere explícito, es un cambio de copy, no de estructura.

### Estados (ver el HTML)

| Id | Estado | Nota |
|---|---|---|
| N1·1 | Crear cuenta, contraseña plegada | Agrega «¿Ya tienes cuenta? Entrar» y la sección plegada al N1 aprobado |
| N1·1b | Contraseña desplegada con error de largo | «Error: usa al menos 8 caracteres» |
| N1·2 | Entrar con código (vacío) | Pestañas «Con código» y «Con contraseña» |
| N1·3 | Escribe el código | Cuenta regresiva de 60 s para pedir otro |
| N1·4 | Código incorrecto | El vencido es el L1 aprobado |
| N1·5 | Entrar con contraseña (foco) | «Mostrar» alterna la visibilidad |
| N1·6 | Correo o contraseña incorrectos | Genérico; desde el 3.er fallo, intentos restantes |
| N1·7 | Contraseña en pausa | Palabra «Contraseña en pausa» (durazno claro/tostado); CTA «Entrar con un código» |
| N1·8 | Cargando | «Entrando…» con `aria-busy` |
| N1·9 / N1·10 | Olvidé: correo, luego código y contraseña nueva | La misma ruta crea la primera contraseña |
| N1·11a / N1·11b | Contraseña corta; código vencido al restablecer | |
| N1·12 | Éxito | «Contraseña guardada»; lleva a N0 o al paso pendiente del alta |
| N1·13 | Sin conexión al entrar | El mostrador ya abierto sigue funcionando |
| N8·Acceso | Fila nueva en N8 → Tus datos | «Crear contraseña» o «Cambiar contraseña», ambas con código al correo |

### Criterios de aceptación (verificables)

- **CA-10.1** Sin tocar la sección de contraseña, el alta de N1·1 es idéntica a la aprobada en campos y pasos; la contraseña no es obligatoria en ningún camino.
- **CA-10.2** Con contraseña en el alta: la cuenta queda creada solo después de confirmar el código del correo, y desde la siguiente visita «Con contraseña» funciona.
- **CA-10.3** «Con código» y «Con contraseña» son pestañas con `role="tablist"`, de 44 px o más, y la elegida se distingue por texto y borde, no solo por color.
- **CA-10.4** La contraseña acepta de 8 a 72 caracteres, sin reglas de composición. Con menos de 8 se ve «Error: usa al menos 8 caracteres (llevas N)» ligado al campo con `aria-describedby`. El campo acepta pegar y tiene `autocomplete="new-password"` (nueva) o `"current-password"` (entrar). «Mostrar» tiene `aria-pressed`.
- **CA-10.5** Un correo o contraseña incorrectos muestran siempre el mismo mensaje, exista o no el correo.
- **CA-10.6** Al 3.er fallo seguido se muestra «Te quedan N intentos». Al 5.º, el campo y el botón de contraseña se deshabilitan, se muestra «Contraseña en pausa» con la hora de reapertura y el botón primario pasa a «Entrar con un código».
- **CA-10.7** Durante la pausa, «Entrar con un código» funciona y las sesiones abiertas (incluido el mostrador) no se cierran. A los 15 minutos, la contraseña vuelve a funcionar. Un acceso correcto (por contraseña o por código) reinicia el contador.
- **CA-10.8** El código de entrada y el de restablecimiento son de 6 dígitos, vencen a los 10 minutos y, al vencer, se muestra el patrón L1 («Código vencido», se envía uno nuevo, «Ayuda por WhatsApp»).
- **CA-10.9** «Pedir otro código» queda desactivado 60 s, con la cuenta regresiva en el botón. El cambio a «disponible» se anuncia en una región `aria-live="polite"`; los segundos intermedios no se anuncian.
- **CA-10.10** «¿Olvidaste tu contraseña?» responde igual con un correo con cuenta y sin cuenta («Si ese correo tiene cuenta…»), y solo envía un correo si existe.
- **CA-10.11** Al guardar la contraseña nueva, la persona queda con sesión iniciada y llega a N0 (o al paso pendiente del alta). La casilla «Cerrar sesión en mis otros dispositivos» viene desmarcada; marcada, cierra las demás sesiones y no la actual.
- **CA-10.12** Desde N8 → Tus datos → Acceso, «Crear contraseña» y «Cambiar contraseña» envían el código al correo del dueño y abren el paso de código y contraseña nueva, sin pedir la contraseña actual.
- **CA-10.13** Sin conexión, N1 muestra «Sin conexión» con «Reintentar»; no hay cola de acceso. Con sesión ya abierta, N5 sigue funcionando sin conexión (D-015).
- **CA-10.14** Todos los campos son de 16 px (`--font-size-input`); todos los controles miden 44 px o más; el foco usa `--focus-ring`; cada error o estado lleva palabra y color; no hay animaciones (o respetan `prefers-reduced-motion`). axe sin violaciones en N1·1 a N1·13.
- **CA-10.15** Eventos (si el analista los aprueba): `contrasena_restablecida` y `acceso_bloqueado` (sin correo ni IP en el payload). Ver «Eventos nuevos».

### Cambios al PRD con texto propuesto

- **RF-ALT-02** (reemplaza): «N1 Cuenta pide nombre, correo y WhatsApp del negocio. El dueño entra con **correo + código de 6 dígitos** (vigencia de **10 minutos**) **o con contraseña**. La contraseña es opcional: se puede crear en N1 (sección plegada «Crear también una contraseña») o después en N8 → Tus datos → Acceso; sin ella, el dueño sigue entrando solo con código. N1 ofrece las pestañas «Con código» y «Con contraseña».»
- **RF-ALT-02b** (reemplaza): «**Restablecer la contraseña por correo:** desde N1, «¿Olvidaste tu contraseña?» envía al correo del dueño un **código de 6 dígitos con vigencia de 10 minutos**. Con el código, el dueño crea una contraseña nueva de **8 a 72 caracteres, sin reglas de composición**, y queda con la sesión iniciada. Las demás sesiones no se cierran, salvo que marque «Cerrar sesión en mis otros dispositivos». Se puede pedir otro código cada 60 s. El mensaje es el mismo exista o no el correo. El mismo flujo sirve para crear la primera contraseña. Diseño: ver `docs/fase-7/propuestas/diseno/n1-cuenta-contrasena.html`.»
- **RF-ALT-02c** (nuevo): «**Intentos fallidos:** tras 5 contraseñas incorrectas seguidas para el mismo correo, el acceso con contraseña se pausa 15 minutos; el acceso con código y las sesiones abiertas no se ven afectados. Desde el 3.er fallo se indica cuántos intentos quedan. Los mensajes de error no revelan si el correo tiene cuenta.» `[SUPUESTO: 5 y 15]`
- **RF-ALT-03** (agrega): «…También existe el estado «Código incorrecto»; tras 5 códigos incorrectos el código deja de servir.» `[SUPUESTO]`
- **RF-AJU-03** (agrega): «…y **Acceso**: crear o cambiar la contraseña (con código al correo).»
- **RNF-STK-04** (agrega): «El envío de correos de Auth en producción usa SMTP propio (PQ-28).»
- **07-entrega** §1 (N1: estados N1·1 a N1·13 y N8·Acceso), §4 «Cuenta» (quita «N1 pendiente de ajuste») y piezas 04 y `01-mapa` §3 (quitan la nota de «pendiente de ajuste»). Se quita el pendiente PQ-10 del PRD.

### ¿Decisión nueva?

**No.** D-005 ya decidió la contraseña opcional y su restablecimiento; esto detalla reglas. Aarón solo tiene que **confirmar los valores `[SUPUESTO]`**: 8 de mínimo, 10 min, 5 intentos y 15 min de pausa. Si prefiere un registro formal, cabe como nota de aclaración a D-005.

---

## PQ-12 · C5 «Mis datos» (ver y borrar la cuenta)

**Requisitos:** RF-APP-14, RNF-PRI-01, RNF-PRI-02, RNF-PRI-09 · **Decisiones:** D-013, D-019 · **Pregunta ligada:** PQ-04 (retención, abierta) · **Evidencia:** ruta `/c/cuenta` ya está en RNF-PWA-03; entidades `identidad` y `cliente_negocio` en 07-entrega §3; `legal-notas` §4 punto 5 (30 días tras cancelar es de la cuenta del negocio, no del cliente) y punto 11 (plazo de conservación sin número).

**Contexto.** C5 está en el alcance (01-mapa §3) pero no tiene diseño. Con D-019 la cuenta es **un teléfono** (`identidad`) más un `cliente_negocio` por negocio, cada uno con su propio nombre. C5 es la única pantalla del cliente que cruza negocios, como Mis tarjetas (RF-APP-13).

### Lo que el cliente ve (salen de RNF-PRI-01 y de 07-entrega §3)

1. **Su cuenta:** WhatsApp, estado «Verificado» (campo `verificado`) y cuántos negocios.
2. **Por negocio:** el nombre que dio ahí, la fecha de alta, la fecha y hora en que aceptó el aviso (`aceptó_aviso_ts`), su avance (sellos y meta), la última visita y el enlace al aviso de ese negocio.
3. **Uso de la app:** una línea que dice que se registra cuándo abre LealTab y si la instaló. **Es necesaria porque `app_abierta` lleva la identidad (RF-EVT-02):** decir «solo guardamos nombre y WhatsApp» sería falso. El texto final es **Por definir (PQ-18)**.
4. Enlaces al aviso de LealTab y a «Tus derechos ARCO» (el canal ARCO es el correo del aviso; `legal-notas` §2).

No se muestra: historial de cada visita (no es dato que el cliente haya capturado y alarga la pantalla). El cliente ve «última visita» y sus sellos. Corregir el nombre se pide por el canal ARCO en el MVP (Por definir si C5 gana un botón «Editar nombre» en la v1).

### Opciones para borrar

| Opción | A favor | En contra |
|---|---|---|
| **A (recomendada). «Borrar mi cuenta»: todo, una sola acción** | Es lo que dice RF-APP-14 («puede borrar su cuenta»). Una pantalla, un efecto, fácil de explicar y de probar | Quien solo quiere salirse de un negocio no puede |
| B. Además, «Quitar esta tarjeta» por negocio | Más control; cercano a un derecho de cancelación frente a cada responsable | Suma una acción, otro diálogo y otro caso de borrado parcial. **Fuera del MVP**: se propone para la v1 si lo piden o si el abogado lo exige |
| C. Solo por solicitud al correo (ARCO) | Cero construcción | Contradice RF-APP-14 y no sirve como confirmación inmediata |

**Confirmación.** Diálogo destructivo del design system (`DESIGN.md`: panel blanco lino, título con el nombre, «Esta acción no se puede deshacer», «Cancelar» ghost y destructivo rojo, foco atrapado, Esc cancela), con **tres refuerzos**: (1) lista los negocios y avisa de las **recompensas listas** que se perderían; (2) una **casilla** «Entiendo que pierdo mis sellos y mis recompensas» que habilita el botón rojo; (3) no se borra sin conexión. Se descarta pedir un código por WhatsApp para confirmar: cuesta por mensaje (R-18), depende de PQ-13 y PQ-22, y la sesión ya acredita a la persona. Si la consulta legal (D-017) exige verificar la identidad otra vez, se agrega el código sin rehacer la pantalla.

### Cómo se diseña para no depender de PQ-04

La pantalla separa **lo que pasa ahora** (siempre igual) de **el plazo de eliminación definitiva** (el único texto abierto).

**Ahora, al confirmar (no depende del plazo):**
1. Se cierran todas las sesiones de la identidad y se limpia el almacenamiento local de la PWA (cachés del service worker de `/c/` e IndexedDB).
2. La persona deja de aparecer en Mis tarjetas y en N0, N6, N7 y el CSV de cada negocio, y no puede recibir sellos.
3. Sus datos personales (teléfono, nombre, consentimiento) quedan **bloqueados**: sin uso, sin lectura desde ninguna pantalla.

**Después (Por definir, PQ-04):** cuándo se eliminan de forma definitiva y qué se conserva por obligación legal. En la interfaz es **una sola variable de texto** (`{plazo}`, ver C5·9). El borrado definitivo es una tarea programada con un plazo en configuración; cambiar el plazo no cambia ninguna pantalla.

**Dos cuestiones para PQ-04 que este diseño hace visibles:**
- **Conteos del negocio.** Si al borrar se eliminan también los eventos, el historial de N0 («visitas por semana») y las métricas de G1 bajarían. Recomiendo **conservar los eventos sin datos personales** (se rompe el vínculo con la persona, no se borra el conteo) `[SUPUESTO: requiere revisión legal]`.
- **Eventos de analítica.** `app_abierta` y los demás eventos con identidad se eliminan o se anonimizan en el mismo proceso (D-018). El evento `cuenta_cliente_borrada` va sin identidad ni teléfono.

### Estados (ver el HTML)

| Id | Estado |
|---|---|
| C0·hdr | Encabezado de C0 con «Mis datos ›» (sustituye el nombre) |
| C5·1 | Mis datos con tarjetas |
| C5·2 | Sin tarjetas; borrar sigue disponible |
| C5·3 | Cargando |
| C5·4 | Error al cargar («Reintentar») |
| C5·5 | Sin conexión: se ve lo guardado y borrar está desactivado |
| C5·6 / C5·6b | Confirmación, con la casilla sin marcar y marcada |
| C5·7 | Borrando |
| C5·8 | Error al borrar: no se borró nada |
| C5·9 | Éxito: «Cuenta cerrada» y el plazo Por definir |

### Criterios de aceptación (verificables)

- **CA-12.1** C5 vive en `/c/cuenta` y se abre desde el encabezado de C0 («Mis datos ›»). Sin sesión, lleva a `/c/recuperar`.
- **CA-12.2** C5·1 muestra el WhatsApp, el chip «Verificado» o «Sin verificar» (palabra y color) y, por cada negocio con `cliente_negocio` activo, el nombre dado, la fecha de alta, la fecha y hora de aceptación del aviso, los sellos y la última visita. Una prueba con RLS comprueba que nunca llegan datos de otra identidad.
- **CA-12.3** Las tarjetas `por_confirmar` no aparecen en la lista (RF-APP-05) y sí se borran con la cuenta.
- **CA-12.4** El renglón «Uso de la app» existe y su texto final es la constante pendiente de PQ-18.
- **CA-12.5** «Borrar mi cuenta» abre un `role="alertdialog"` con foco atrapado, Esc que cancela y regreso del foco al botón que lo abrió. Lista los negocios y marca con palabra y color («Recompensa lista: se pierde») los que tienen una recompensa pendiente.
- **CA-12.6** El botón rojo está deshabilitado hasta marcar la casilla (con área táctil de 44 px) y habilitado después. El botón de borrar de la pantalla base es secundario con texto rojo; el rojo relleno solo vive en el diálogo.
- **CA-12.7** Al confirmar se ve «Borrando…» con `aria-busy` y los dos botones deshabilitados; el resultado se anuncia en `aria-live="polite"`.
- **CA-12.8** Tras el éxito: las sesiones de la identidad en todos sus dispositivos quedan cerradas; no queda en el dispositivo ninguna caché de tarjetas ni IndexedDB con datos de la persona; al recargar `/c/` aparece el estado vacío de C0.
- **CA-12.9** Ese número puede volver a registrarse como una cuenta nueva con 0 sellos y no recupera nada de la anterior; el código de recuperación no restaura tarjetas borradas.
- **CA-12.10** La persona ya no aparece en N0, N6, N7 ni en el CSV de ninguno de sus negocios, y en N5 la búsqueda por su WhatsApp da M2 («Cliente no encontrado»). Un sello pendiente en la cola de un mostrador que llegue después se descarta con motivo «tarjeta dada de baja»: se cuenta en M6 como descartado, **no va a Por revisar** y no deja ningún dato personal a la vista del negocio `[SUPUESTO: el arquitecto lo confirma]`.
- **CA-12.11** El borrado es una sola transacción: si falla, no queda nada a medias (C5·8), y reintentar es seguro (idempotente).
- **CA-12.12** Sin conexión, C5·5 deja «Borrar mi cuenta» deshabilitado con la explicación; el borrado nunca entra a una cola.
- **CA-12.13** Se emite `cuenta_cliente_borrada` (número de negocios) sin identidad ni teléfono, y los eventos previos de esa identidad se eliminan o anonimizan en el mismo proceso.
- **CA-12.14** El plazo y las excepciones de eliminación definitiva salen de una sola constante de texto y de una sola configuración; cambiarlas no requiere tocar la estructura de C5.
- **CA-12.15** Campos y controles de 16 px y 44 px o más; contraste AA; el foco usa `--focus-ring`; estados con palabra y color; sin animaciones. axe sin violaciones.

### Cambios al PRD con texto propuesto

- **RF-APP-14** (reemplaza): «**C5 Mis datos** (`/c/cuenta`, desde el encabezado de C0). El cliente ve su WhatsApp (con su estado de verificación) y, por cada negocio, el nombre que dio, la fecha de alta y de aceptación del aviso, su avance y su última visita; y puede **borrar su cuenta de LealTab completa** tras una confirmación explícita (casilla y botón destructivo). Al confirmar se cierran sus sesiones, se limpia el almacenamiento local, deja de aparecer en Mis tarjetas, N0, N6, N7 y en el CSV de sus negocios, y no recibe más sellos. No se puede borrar sin conexión. La eliminación definitiva de los datos y lo que se conserva por ley: **Por definir (PQ-04)**. Diseño: `docs/fase-7/propuestas/diseno/c5-mis-datos.html`.»
- **RNF-PRI-09** (agrega): «El diseño de C5 no depende del plazo: usa una sola constante de texto y una sola configuración para la eliminación definitiva.»
- **PRD §4.1** (quita el «Hueco» de C5) y **§12** (cierra PQ-12).
- **07-entrega** §1 (agrega C5 con sus estados) y §3 (`identidad.estado` `activa`/`bloqueada`/`eliminada`, y fecha de eliminación; y `cliente_negocio.estado` suma `baja`). **Pieza 05 B:** el encabezado de C0 muestra «Mis datos ›» en lugar del nombre (con D-019, `identidad` no guarda nombre, así que el nombre del encabezado actual no tiene origen).
- **RF-SEL-15 / M6** (agrega): motivo «tarjeta dada de baja» como descartado sin acción.

### ¿Decisión nueva?

**Sí.** Cambia lo que los negocios ven de sus clientes y toca el rol legal. Texto propuesto (sin registrar; el coordinador asigna el número):

```
## D-024 · <fecha de registro> · El cliente borra su cuenta de LealTab desde C5: efecto inmediato y eliminación definitiva según el aviso

- **Decisión:** desde C5 «Mis datos» el cliente puede borrar su cuenta de LealTab completa (su `identidad` y todos sus `cliente_negocio`) con una confirmación explícita. Al confirmar: se cierran sus sesiones y se limpia el almacenamiento local de la app; deja de aparecer en Mis tarjetas y en N0, N6, N7 y el CSV de cada negocio y no recibe sellos; y sus datos personales quedan bloqueados hasta su eliminación definitiva. No se puede borrar sin conexión. El mismo teléfono puede registrarse otra vez como una cuenta nueva, sin recuperar nada.
- **Por definir (PQ-04):** el plazo de eliminación definitiva, lo que se conserva por obligación legal y si los eventos de cada negocio se conservan sin datos personales para sus conteos históricos.
- **Motivo:** RF-APP-14 y RNF-PRI-09 piden que el cliente pueda borrar su cuenta; el modelo de D-019 hace que sea una sola acción sobre la identidad.
- **Consecuencias:** C5 deja de ser un hueco del PRD. El diseño no depende del plazo. Si el abogado (D-017) pide verificar la identidad otra vez, se agrega un código por WhatsApp (costo por mensaje, R-18).
- **Alternativa(s) descartada(s):** borrar por negocio (v1, si lo piden); borrado solo por correo (ARCO).
- **Decidió:** Por decidir (Aarón).
```

---

## PQ-19 · «Corregir sellos» en N7 y qué pasa si cambia el número de sellos

**Requisitos:** RF-CLI-02, RF-CLI-04, RF-TAR-06, RNF-OFF-01 · **Decisiones:** D-014 (registro de quién y cuándo), D-015 (el servidor es la fuente de verdad) · **Evidencia:** el botón ya existe en la ficha de `inicio/n7-clientes.html`; `investigacion-limite-sellos.md`: Loopy permite quitar sellos solo hasta el último canje y deja todo en bitácora ([Stamper app](https://docs.loopyloyalty.com/en/articles/10502182-using-the-ios-stamper-app)), y Stampify guarda hora y empleado de cada sello ([FAQ](https://stampify.co/faq)).

**Contexto.** El MVP tiene **una cuenta compartida** (D-010): cualquiera con el panel puede corregir. La protección real es el motivo obligatorio y la bitácora que el dueño puede revisar, no un permiso. Los permisos por usuario están fuera del MVP (PRD §4.2).

### Parte A · Corregir sellos

**Reglas propuestas**

| Regla | Valor | Por qué |
|---|---|---|
| Qué se corrige | Solo el **total de sellos de la tarjeta en curso**. Los canjes no se tocan ni se deshacen | Igual que Loopy; «deshacer canje» queda fuera y se atiende por WhatsApp de soporte |
| Rango | De 0 a la meta de la tarjeta (`meta_ciclo`) | No se puede pasar de la meta ni bajar de 0 |
| Cuánto por corrección | Hasta **3** sellos hacia arriba o hacia abajo `[SUPUESTO]` | Una corrección arregla un descuido, no reescribe un historial |
| Motivo | **Obligatorio**. Lista: «Se registró un sello de más», «Faltó registrar un sello», «Se dio a la tarjeta equivocada», «Otro (escribe cuál)». Con «Otro», la nota es obligatoria (hasta 140 caracteres) | Datos comparables y una razón siempre visible |
| Cuándo | Solo en línea y con la cuenta activa (no en pausa) | El servidor recalcula el conteo (RNF-OFF-01); en pausa no se dan sellos nuevos (RF-COB-03) |
| Quién | La cuenta compartida; «quién» = el dispositivo o la sesión (D-014). Para el panel en escritorio, nombre de sesión **Por definir** (por ejemplo «Panel · Chrome») | Es lo que permite el MVP |
| Si completa la tarjeta | Se permite llegar a la meta; la tarjeta pasa a «Recompensa lista» y el canje sigue siendo un escaneo en N5 | Evita castigar a un cliente por un olvido del staff. **Riesgo:** el staff podría fabricar una recompensa; lo cubren el límite de 3 y la bitácora. **Opción B:** tope en meta−1, de modo que el último sello siempre venga de un escaneo real |
| Si quita una recompensa lista | Se permite con aviso y una casilla extra | Es un cambio grande y debe ser consciente |
| Efecto en métricas | **No cuenta como visita**: no cambia la última visita, no consume el límite de sellos y no entra a N0, N6 ni G1. Las visitas son los eventos de sello y canje aceptados | Una corrección ajusta el saldo, no la asistencia |
| Deshacer | No se edita ni se borra una corrección. Si hubo un error, se hace otra corrección, también registrada | Bitácora íntegra |

**Concurrencia.** La corrección se guarda como **diferencia** (−1, +2), no como total. Si entre abrir el diálogo y guardar cambió el saldo (por ejemplo, se sincronizó un sello del mostrador), el servidor responde «La tarjeta cambió: ahora tiene 7/8. Revisa y vuelve a intentar» y no aplica nada.

**Bitácora.** Cada corrección es un `evento` nuevo de tipo `correccion`, inmutable, con: diferencia, sellos antes y después, motivo, nota, dispositivo o sesión, hora del dispositivo y hora de recepción. Se ve en el **historial de visitas de la ficha** (N7) con el chip «Corregido» (durazno claro/tostado: palabra y color):

```
20 oct   Corrección −1 · 6/8 → 5/8   [Corregido]
         Motivo: Se registró un sello de más
         18:05 · registró Mostrador (iPhone caja)
```

En el MVP **no hay una pantalla global de bitácora**; el dueño ve las correcciones en la ficha de cada cliente. Si en el piloto los dueños piden revisar todas, la v1 agrega un filtro «Correcciones» en N7. `[SUPUESTO]`

**Diálogo (borrador, no destructivo; el botón es primario bosque)**

```
┌ Corregir sellos · María Pérez ─────────────────────┐
│ Ahora tiene 6 de 8                                  │
│ Nuevo total     [ − ]   5 de 8   [ + ]     (−1)     │
│ Motivo (obligatorio)  [ Se registró un sello de más ▾ ]
│ Nota (solo con «Otro», hasta 140 caracteres)        │
│ Queda en su historial con la hora y el dispositivo. │
│ No se puede editar ni borrar.                       │
│ [Cancelar]                    [Guardar corrección]  │
└─────────────────────────────────────────────────────┘
```

### Parte B · Si cambia el número de sellos (RF-TAR-06)

**Opciones**

| Opción | Efecto | Problema |
|---|---|---|
| A. Conservar sellos y aplicar la meta nueva a todos | 7/8 pasa a 7/10; con meta menor, algunas tarjetas se completan | Una tarjeta con recompensa lista (8/8) pasaría a 8/10 y **el cliente perdería un premio ya ganado** |
| B. Reescalar proporcionalmente | 6/8 → 7.5/10 | Fracciones de sello. Descartada |
| C. Solo para tarjetas nuevas | Predecible | Quien quiere bajar la meta no ayuda a los clientes actuales |
| D. Bloquear el cambio si ya hay avance | Simple | Los dueños van a ajustar la meta en la primera semana del piloto |
| **E (recomendada). «Nunca quita nada»** | La meta de cada tarjeta se guarda por ciclo; **bajar la meta aplica ya a todos; subirla aplica a las tarjetas nuevas y a cada tarjeta después de su canje** | Las metas pueden diferir entre clientes durante un ciclo; la vista previa lo explica |

**Regla E.** Cada `tarjeta_cliente` guarda `meta_ciclo` (copia de `tarjeta_config.sellos_meta` al nacer la tarjeta y tras cada canje). Al cambiar la meta del negocio:
- **Sube:** las tarjetas en curso conservan su `meta_ciclo`; las nuevas y las posteriores a un canje usan la nueva. Nadie pierde avance ni recompensas.
- **Baja:** `meta_ciclo = min(meta_ciclo, nueva)` en todas las tarjetas en curso. Las que ya tienen ese número de sellos o más quedan con «Recompensa lista»; las demás conservan sus sellos y les faltan menos.
- Las tarjetas ya completas **nunca** cambian hasta su canje.
- Se muestra `min(sellos, meta_ciclo)`. Si bajar la meta dejó sellos de sobra (7 sellos con meta 6), el canje reinicia a 0 como siempre (regla aprobada) y el excedente se pierde. **Opción:** que el excedente pase al ciclo siguiente. Lo dejo para Aarón; contradice «el canje reinicia a 0» de 07-entrega §3.
- El texto de la recompensa sí cambia para todos al instante (no afecta al conteo) `[SUPUESTO]`.

**Vista previa antes de guardar** (solo si hay tarjetas con avance; en el alta no aparece):

```
Subir de 8 a 10 sellos
Tienes 23 tarjetas con avance. Seguirán con 8 sellos hasta que canjeen.
Las tarjetas nuevas y las que canjeen desde hoy usarán 10.       [Cancelar] [Guardar cambio]

Bajar de 8 a 6 sellos
Tus 23 clientes con avance ganan: 4 quedan con la recompensa lista y a los demás les faltan menos.
                                                                 [Cancelar] [Guardar cambio]
```

### Criterios de aceptación (verificables)

- **CA-19.1** «Corregir sellos» abre el diálogo desde la ficha de N7. Está deshabilitado, con la razón escrita, si la cuenta está en pausa o si no hay conexión.
- **CA-19.2** El control de total está acotado entre 0 y `meta_ciclo`, mide 44 px o más en «−» y «+», y muestra la diferencia con signo. Con una diferencia de 0 o de más de 3, «Guardar corrección» queda deshabilitado con la razón.
- **CA-19.3** El motivo es obligatorio; con «Otro», la nota es obligatoria y de hasta 140 caracteres. Los errores se ligan con `aria-describedby`.
- **CA-19.4** Al guardar se crea un único evento `correccion` inmutable con diferencia, antes, después, motivo, nota, dispositivo o sesión y las dos horas; la ficha muestra el renglón con el chip «Corregido» y el saldo nuevo.
- **CA-19.5** Si el saldo cambió entre abrir y guardar, no se aplica nada y se muestra «La tarjeta cambió: ahora tiene N/M. Revisa y vuelve a intentar».
- **CA-19.6** Una corrección no cambia `ultima_visita_ts`, no cuenta para el límite de sellos (1 por día, cada X horas, bloqueo de 2 min) y no aparece en las visitas de N0, N6 ni en las consultas de G1.
- **CA-19.7** Llevar la tarjeta a la meta la deja en «Recompensa lista» y C3 y C4 lo muestran al actualizarse (RF-APP-17). Bajarla desde una tarjeta completa pide la casilla «Entiendo que quito la recompensa lista».
- **CA-19.8** Las correcciones nunca modifican ni borran canjes.
- **CA-19.9** Se emite `sellos_corregidos` (diferencia, motivo) sin datos personales.
- **CA-19.10** Cambiar la meta de 8 a 10 con tarjetas en curso: ninguna tarjeta existente pierde sellos ni recompensas; las que ya tenían 8/8 siguen con «Recompensa lista»; tras el canje, la tarjeta arranca en 0/10; una tarjeta nueva nace en 0/10.
- **CA-19.11** Cambiar la meta de 8 a 6: toda tarjeta en curso pasa a `meta_ciclo` 6; las que tenían 6 o más sellos quedan con «Recompensa lista» y N5 permite canjearlas; la vista previa dice cuántas son.
- **CA-19.12** La vista previa aparece solo si existe al menos una tarjeta con sellos; durante el alta (N3) no aparece.
- **CA-19.13** N5, N7, C0, C3 y C4 usan `meta_ciclo` en el aro («4/8») y en el `aria-label` («4 de 8 sellos»). La regla del aro (RF-TAR-05) no cambia.

### Cambios al PRD con texto propuesto

- **RF-CLI-04** (reemplaza): «**Corregir sellos** desde la ficha de N7: solo el total de la tarjeta en curso, de 0 a su meta y hasta 3 sellos por corrección; motivo obligatorio (lista, y nota con «Otro»); solo en línea y con la cuenta activa. Se guarda como un evento `correccion` inmutable (diferencia, antes, después, motivo, nota, dispositivo, horas) visible en el historial de la ficha con el chip «Corregido». No cuenta como visita, no consume el límite de sellos y no toca los canjes. Con la cuenta compartida no hay permisos por persona.» `[SUPUESTO: el tope de 3]`
- **RF-TAR-06** (reemplaza): «Al cambiar el número de sellos: **bajarlo aplica de inmediato a todas las tarjetas en curso; subirlo aplica a las tarjetas nuevas y a cada tarjeta después de su canje.** Nadie pierde sellos ni recompensas ya ganadas. Antes de guardar, N3 o la pantalla Tarjeta muestra una vista previa del efecto si hay tarjetas con avance.»
- **RF-EVT-01** (agrega): `sellos_corregidos` (diferencia, motivo). Lo valida `lealtab-analista-metricas`.
- **07-entrega** §3: `tarjeta_cliente.meta_ciclo`; `evento.tipo` suma `correccion` con campos `delta`, `sellos_antes`, `sellos_despues`, `motivo` y `nota`. §4: reglas de arriba.
- **Pieza 05** (N7): el diálogo de corrección y el chip «Corregido» en el historial. Se cierra PQ-19.

### ¿Decisión nueva?

**Sí.** Define una regla de dinero (qué le debe el negocio al cliente) y agrega un tipo de evento. Texto propuesto:

```
## D-025 · <fecha de registro> · Corregir sellos deja bitácora y cambiar la meta nunca quita avance

- **Decisión:**
  - Corregir sellos (N7) cambia solo el total de la tarjeta en curso, hasta 3 sellos por corrección, con motivo obligatorio y solo en línea. Cada corrección es un evento inmutable en el historial del cliente. No cuenta como visita y no toca los canjes.
  - Cada tarjeta guarda la meta de su ciclo. Bajar el número de sellos aplica a todas las tarjetas en curso; subirlo aplica a las tarjetas nuevas y tras cada canje. Nadie pierde sellos ni recompensas ya ganadas.
- **Por definir:** si el excedente de sellos tras bajar la meta pasa al ciclo siguiente (hoy se pierde al canjear); si una corrección puede completar la tarjeta (hoy sí).
- **Motivo:** con una cuenta compartida (D-010) la bitácora es la protección; el mercado deja el registro de quién y cuándo como control central (`investigacion-limite-sellos.md`, D-014).
- **Consecuencias:** `tarjeta_cliente.meta_ciclo` y `evento.tipo = correccion` en el modelo; el aro y el `aria-label` usan `meta_ciclo`.
- **Alternativa(s) descartada(s):** conservar sellos con meta única para todos (quita premios ganados); reescalar proporcionalmente; bloquear el cambio si hay avance.
- **Decidió:** Por decidir (Aarón).
```

---

## PQ-20 · Definición de «semana» y de «intervalo habitual»

**Requisitos:** RF-INI-02, RF-INI-05, RF-INI-06, RF-INI-07, RF-QR-01, RF-QR-05, MET-10 · **Decisiones:** D-010 (En riesgo), D-011 (resumen solo en el panel), D-014 (la zona horaria del negocio fija el día) · **Con:** `lealtab-arquitecto` (consultas) y `lealtab-analista-metricas` (MET-10).

**Contexto.** N0 dice «Semana del 14 al 20 oct» y compara con la anterior; N6 usa 30 días y necesita el intervalo habitual de cada cliente.

**Hallazgo sobre la pieza aprobada.** El 20 oct de 2026 fue martes. El ejemplo de N0 («Semana del 14 al 20 oct») y las etiquetas de la gráfica (15 sep, 22 sep, 29 sep, 6 oct, 13 oct, 20 oct, todos martes) describen **ventanas de 7 días que terminan en un martes**, no semanas lunes–domingo. Los datos son de ejemplo, pero indican que el diseño asumió «los últimos 7 días».

### Semana: opciones

| Opción | Cómo se ve | Problema |
|---|---|---|
| A. Semana calendario lunes–domingo, en curso | El lunes todo está en cero y la comparación con la semana pasada sale injusta | Un resumen que dice «▼ 80 %» el martes por la mañana destruye la confianza (R-12) |
| B. Última semana calendario completa | Estable y alineada con «resumen semanal» | Hasta el primer lunes el dueño no ve nada aunque ya haya sellos y a media semana ve datos viejos; eso le quita valor a la primera semana del piloto |
| C. Últimos 7 días contando hoy | Siempre hay datos | Hoy está incompleto: por la mañana la comparación contra 7 días completos sale baja |
| **D (recomendada). Los 7 días completos que terminan ayer** | Cualquier ventana de 7 días tiene cada día de la semana exactamente una vez (la barbería que cierra los lunes se compara parejo); no cambia durante el día; muestra datos desde el segundo día de uso | La visita de hoy aparece mañana; para lo de hoy están N5 y N6 |

**Recomendación: D.**
- **Día:** de 00:00 a 23:59:59 en la zona horaria del negocio (RF-ALT-06, la misma que usa el límite por día).
- **Semana de N0:** los 7 días completos anteriores a hoy. Hoy es 20 oct: «Semana del 13 al 19 oct». **Semana anterior:** los 7 días previos a esos.
- **Gráfica «Visitas por semana»:** 6 ventanas consecutivas de 7 días hacia atrás; la etiqueta es el último día de cada ventana (como en el aprobado).
- **Negocio con menos de 8 días:** la ventana empieza el día del alta y el encabezado dice «Tus primeros N días»; no se muestra comparación («Aún no hay una semana anterior para comparar»). Si no hay ningún día completo todavía, o la ventana no tiene visitas, se muestra V1.
- **Evento `resumen_semanal_visto`:** el campo `semana` es la **semana ISO (lunes a domingo, zona del negocio) de la fecha en que se abre N0**, formato `AAAA-Www`. No depende de la ventana que se muestra y da una llave estable para MET-10 («dueños que lo abren cada semana»). Abrirlo varias veces en la misma semana cuenta una vez por negocio y semana al medir.
- **Comparaciones «más que la semana pasada» de En riesgo:** requieren evaluar el estado a una fecha pasada (la del último día de la ventana anterior). Las consultas reciben una fecha de corte; no hace falta guardar fotografías.

### Intervalo habitual

**Definiciones**
- **Visita:** un día (zona del negocio) con al menos un sello o canje **aceptado de origen mostrador**. Varios sellos el mismo día, con «Sin límite» o «1 cada X horas», cuentan como una visita. El sello de bienvenida y las correcciones **no** son visitas (en N0 los sellos de bienvenida ya van aparte de las visitas). Pendiente de Aarón: PQ-27.
- **Intervalo:** días naturales entre dos visitas consecutivas.
- **Intervalo habitual:** **mediana de los últimos 5 intervalos** (los que haya, si son menos) `[SUPUESTO: 5]`. La mediana resiste una pausa larga aislada.
- **Con 0 o 1 visita no hay intervalo.** La ficha dice «Aún no tenemos su ritmo (solo 1 visita)».
- **En riesgo:** más de `max(30, 2 × intervalo habitual)` días desde su última visita. **Sin intervalo, el umbral es solo el mínimo de 30 días** (D-010): quien vino una vez y no volvió en más de 30 días queda «En riesgo». Es exactamente el cliente que el dueño quiere escribirle.
- **Cómo se muestra el ritmo:** de 14 días en adelante, redondeado a semanas («cada 3 semanas»); menos de 14, en días («cada 4 días»).

**Alternativa descartada:** para quien tiene una sola visita, usar el ritmo mediano del negocio. Evita falsas alarmas en barberías (ciclo de 4 semanas, donde el mínimo de 30 días puede adelantar al cliente un par de semanas), pero necesita una muestra mínima de clientes y complica la explicación. **Se revisa con datos del piloto** (Fase 9). Para cafeterías el mínimo de 30 días domina siempre.

**Casos de prueba (CA-20.5)**

| Caso | Visitas (días) | Intervalos | Ritmo | Umbral | Estado |
|---|---|---|---|---|---|
| Una visita hace 31 días | 1 | — | sin ritmo | 30 | En riesgo |
| Una visita hace 12 días | 1 | — | sin ritmo | 30 | Nuevo |
| Cafetería, cada 3 días, última hace 10 días | muchas | 3, 3, 3… | cada 3 días | 30 | Frecuente (2+ visitas en 30 días) |
| Barbería, cada 28 días, última hace 35 días | 4 | 28, 28, 28 | cada 4 semanas | 56 | Ni Frecuente ni En riesgo |
| Barbería, cada 28 días, última hace 57 días | 4 | 28, 28, 28 | cada 4 semanas | 56 | En riesgo |
| María Pérez de la pieza 05: visitas 5 jul, 20 jul, 12 ago y 2 sep; hoy 20 oct | 4 | 15, 23, 21 | cada 3 semanas | 42 | En riesgo (48 días): **coincide con el ejemplo aprobado** |

> **Superado por la decisión del 22 oct 2026 (aclaración de D-028):** un solo chip por cliente con precedencia **En riesgo > Frecuente > Nuevo > Al día** (se agrega «Al día», el chip neutro). El texto de este bloque y de CA-20.9 y RF-QR-01 queda como historial; manda RF-QR-01 v2.0 del PRD.

**Una regla de precedencia, hallazgo adyacente.** En N6 un cliente puede ser a la vez Frecuente y Nuevo (primera visita hace 10 días y dos visitas en 30). La tabla tiene un solo chip. Propongo **En riesgo > Frecuente > Nuevo**, mutuamente excluyentes. Los números del ejemplo de N6 (22 + 9 + 14 = 45 contra 38 «regresaron») también muestran que el ejemplo no los trata como exclusivos; no es normativo. `[SUPUESTO]`

### Criterios de aceptación (verificables)

- **CA-20.1** N0 calcula las dos ventanas con los días completos en la zona horaria del negocio: con hoy = 20 oct, «Semana del 13 al 19 oct» y comparación con el 6 al 12 oct. Una visita a las 23:50 del 19 oct, hora del negocio, cuenta en la semana aunque en UTC sea del día 20.
- **CA-20.2** Abrir N0 a cualquier hora del día muestra las mismas cifras; cambian a las 00:00 del negocio.
- **CA-20.3** Con menos de 8 días de alta: encabezado «Tus primeros N días», sin comparación. Sin visitas en la ventana: V1.
- **CA-20.4** `resumen_semanal_visto` lleva `semana` en formato `AAAA-Www` (semana ISO de la fecha de apertura en la zona del negocio). Dos aperturas en la misma semana ISO se cuentan como una al medir MET-10.
- **CA-20.5** Los casos de la tabla producen el estado indicado, con fechas fijas de prueba.
- **CA-20.6** La ficha de N7 muestra «Aún no tenemos su ritmo (solo 1 visita)» con una visita y «cada N semanas» o «cada N días» con dos o más.
- **CA-20.7** El sello de bienvenida y las correcciones no crean visitas ni intervalos.
- **CA-20.8** Dos sellos el mismo día cuentan como una visita para el intervalo y para Frecuente.
- **CA-20.9** Un cliente cae en un solo estado según En riesgo > Frecuente > Nuevo. *(Superado por D-028, 22 oct 2026: En riesgo > Frecuente > Nuevo > Al día.)*

### Cambios al PRD con texto propuesto

- **RF-INI-06** (reemplaza): «**Semana** = los 7 días completos anteriores a hoy, en la zona horaria del negocio. La semana anterior son los 7 días previos. Con menos de 8 días de alta, la ventana empieza en el día del alta y no hay comparación.»
- **RF-INI-05** (agrega): «`semana` es la semana ISO (lunes a domingo, zona del negocio) de la fecha de apertura, `AAAA-Www`.»
- **RF-QR-05** (reemplaza): «**Visita** = día (zona del negocio) con al menos un sello o canje aceptado de origen mostrador. **Intervalo habitual** = mediana de los últimos 5 intervalos entre visitas; con una sola visita no existe y el umbral de En riesgo es solo el mínimo de 30 días. En riesgo = más de `max(30, 2 × intervalo)` días desde la última visita. El sello de bienvenida y las correcciones no son visitas.»
- **RF-QR-01** (agrega): «Un cliente tiene un solo estado, con la precedencia En riesgo > Frecuente > Nuevo.» `[SUPUESTO]` *(Superado por D-028, 22 oct 2026: se agrega «Al día» al final de la precedencia.)*
- **07-entrega** §4 («En riesgo») se alinea con RF-QR-05. Pieza 05: el ejemplo de N0 deja de ser normativo en fechas. Se cierra PQ-20.

### ¿Decisión nueva?

**Sí, pequeña**: fija cómo se calcula lo que D-010 llama «intervalo habitual» y define la semana de D-011. Texto propuesto:

```
## D-026 · <fecha de registro> · Definición de «semana» y de «intervalo habitual»

- **Decisión:**
  - La semana del resumen (N0) son los 7 días completos anteriores a hoy en la zona horaria del negocio, comparada con los 7 días previos. El evento `resumen_semanal_visto` usa la semana ISO de la apertura como llave.
  - Una visita es un día con al menos un sello o canje aceptado de origen mostrador. El intervalo habitual es la mediana de los últimos 5 intervalos entre visitas. Con una sola visita no hay intervalo y En riesgo usa solo el mínimo de 30 días (D-010).
- **Motivo:** una ventana de 7 días completos compara parejo, no cambia durante el día y da datos desde el segundo día de uso.
- **Por definir:** si el sello de bienvenida cuenta como visita (PQ-27); revisar el umbral con datos del piloto (Fase 9).
- **Consecuencias:** las consultas de N0 y N6 reciben una fecha de corte; el ejemplo de N0 en la pieza 05 deja de ser normativo en fechas.
- **Alternativa(s) descartada(s):** semana calendario lunes–domingo (en curso o última completa); últimos 7 días contando hoy.
- **Decidió:** Por decidir (Aarón).
```

---

## PQ-06 · Dónde se muestran los términos del límite de sellos

**Requisitos:** RF-APP-10, RF-APP-09, RF-AJU-02 · **Decisión:** D-014 · **Evidencia:** pieza 02 («en los términos de la tarjeta se menciona el límite de sellos») y `investigacion-limite-sellos.md` (Stamp Me recomienda poner el límite en los términos de la tarjeta; [Prevenir abuso](https://help.stampme.com/en/articles/6204197-how-to-prevent-misuse-with-stamping-and-reward-redemptions)).

**Contexto.** El cliente se entera del límite cuando el staff le dice «ya recibió su sello hoy» (M4b). Ahí nace la discusión en el mostrador. El «aviso de la tarjeta» lo interpreto como la hoja de términos de la tarjeta, **distinta del aviso de privacidad** (LFPDPPP), para no enterrar las reglas del juego en texto legal.

### Opciones

| Opción | A favor | En contra |
|---|---|---|
| A. Solo en el aviso de la tarjeta | C3 queda igual a lo aprobado | Nadie lo lee; la sorpresa ocurre en el mostrador |
| **B (recomendada). Una línea en C3 y la hoja completa a un toque** | El cliente lo ve en el momento y en el lugar donde importa, sin cambiar el aro ni el QR. Sin ruta nueva, sin campos y sin tocar el registro (MET-03) | Una línea más en C3 |
| C. Hoja en C1, antes del registro | Se lee una sola vez | Suma texto al formulario que más cuida MET-03 |

### Diseño de B

En el panel del QR de C3, bajo «Ana López · ID 7K2-49Q» (texto de 13 px muted, mismo estilo de las notas):

```
Muestra este código en mostrador
[ QR ]
Ana López · ID 7K2-49Q
1 sello por día · Términos de la tarjeta       <- enlace de 44 px
```

La línea sale de `limite_modo`:

| `limite_modo` | Línea |
|---|---|
| `por_dia` | «1 sello por día» |
| `cada_x_horas` | «1 sello cada {X} horas» («cada hora» si X = 1; formato de X fraccionario: Por definir, PQ-22) |
| `sin_limite` | Sin línea (solo queda el bloqueo de 2 min contra el doble escaneo, que no es una regla para el cliente) |

«Términos de la tarjeta» abre una **hoja inferior** dentro de la misma pantalla (no una ruta nueva), con la voz del negocio (RF-APP-18). Borrador:

> **Términos de tu tarjeta de {negocio}**
> - Ganas {1 sello por día | 1 sello cada X horas}. Si vuelves antes, el siguiente cuenta después.
> - Tu código cambia cada minuto. Una captura de pantalla no sirve.
> - Cada sello lo confirma el negocio en el mostrador.
> - Con {meta} sellos ganas: {recompensa}. La canjeas mostrando tu código en mostrador.
> - Si hubo un error, el negocio puede corregir tus sellos; queda registrado.
> - Hecho con LealTab.

**Hueco que esto destapa.** Unos términos normales dicen si los sellos o la recompensa caducan. Ninguna fuente lo define y la hoja **no puede afirmar nada** al respecto. Propongo **PQ-26**: ¿caducan los sellos o la recompensa? Mientras no se defina, la hoja no lo menciona.

**En N8** (pantalla del dueño), bajo la elección del límite: «Tus clientes lo ven en su tarjeta». Es una línea de ayuda, no un cambio de estructura.

### Criterios de aceptación (verificables)

- **CA-06.1** C3 muestra la línea de límite según `limite_modo` (sin línea con `sin_limite`), y la línea cambia al cambiar el límite en N8 en cuanto la tarjeta se actualiza.
- **CA-06.2** «Términos de la tarjeta» mide 44 px o más, abre una hoja con foco atrapado, se cierra con Esc y devuelve el foco al enlace.
- **CA-06.3** La hoja y la línea funcionan sin conexión (R4), con el último estado guardado de la tarjeta, y no se cargan desde un servidor externo.
- **CA-06.4** La hoja usa la voz del negocio, de tú, lleva «Hecho con LealTab» (D-016) y no menciona caducidad (PQ-26).
- **CA-06.5** C1 no cambia (no se agrega texto ni campo).
- **CA-06.6** Contraste AA, texto de 13 px mínimo y regla del aro intacta (el aro y el QR no se mueven).

### Cambios al PRD con texto propuesto

- **RF-APP-10** (reemplaza): «C3 muestra una línea con el límite de sellos del negocio («1 sello por día» o «1 sello cada X horas»; sin línea con «Sin límite») y un enlace «Términos de la tarjeta» que abre una hoja con las reglas de la tarjeta, con la voz del negocio. La hoja funciona sin conexión.»
- **RF-APP-09** (agrega): «…y la línea del límite de sellos.»
- **RF-AJU-02** (agrega): «…con la nota «Tus clientes lo ven en su tarjeta».»
- **Pieza 02** (C3): la línea y la hoja. **07-entrega** §8 punto 4 se cierra. Se cierra PQ-06.

### ¿Decisión nueva?

**No.** Detalla RF-APP-10 sin cambiar D-014. Lo que sí deja abierto es la nueva **PQ-26** (caducidad).

---

## Eventos nuevos propuestos (para `lealtab-analista-metricas`)

Los nombres de 07-entrega §5 son únicos; estos solo se agregan si el analista los acepta.

| Evento | PQ | Campos | Nota de privacidad |
|---|---|---|---|
| `sellos_corregidos` | PQ-19 | diferencia, motivo | Sin datos personales |
| `cuenta_cliente_borrada` | PQ-12 | número de negocios | Sin identidad ni teléfono |
| `contrasena_restablecida` | PQ-10 | — | Sin correo |
| `acceso_bloqueado` | PQ-10 | — | Sin correo ni IP |

## Preguntas nuevas propuestas (el coordinador asigna el ID final)

| ID provisional | Pregunta | Quién |
|---|---|---|
| PQ-26 | ¿Caducan los sellos o la recompensa? (los términos de la tarjeta, PQ-06, no pueden afirmar nada hasta saberlo) | Aarón |
| PQ-27 | ¿El sello de bienvenida cuenta como visita en N0, N6 y G1-a? Recomiendo que no (N0 ya lo lista aparte y G1-a cuenta segundas visitas selladas en mostrador); entonces «Nuevo» se mide desde el alta y no desde la primera visita | Aarón y analista |
| PQ-28 | Proveedor de correo (SMTP propio) para los códigos de entrada y restablecimiento del dueño, antes del piloto | Arquitecto y Aarón |

## Hallazgos adyacentes (no los cambié)

- **C0 muestra un nombre global** («Ana López») en el encabezado, pero D-019 dice que `identidad` no guarda nombre. Propongo cambiarlo por «Mis datos ›» (PQ-12).
- **Clientes sin chip.** Con las reglas aprobadas, un cliente de barbería a 35 días de su última visita no es Frecuente, En riesgo ni Nuevo. El design system solo tiene esos tres chips. Hay que decidir si N7 deja la celda vacía o se agrega un estado neutro (por ejemplo «Activo»). No lo resolví.
- **N0 «31 de 48 visitas»** mezcla clientes con visitas. Sugiero «31 de N clientes que vinieron» y que «regresó» sea un cliente con visita en la ventana y una visita anterior. Lo dejo al copywriter y al arquitecto.
- **N0 «Esta semana»** («Nuevos clientes», «Sellos de bienvenida dados») usa la misma ventana de PQ-20.
- **RF-APP-15 y los códigos por WhatsApp** (vigencia e intentos, PQ-22) pueden reusar los criterios de N1 (6 dígitos, 60 s de reenvío, 5 intentos), pero eso cuesta por mensaje: no lo propongo aquí.

## Tabla resumen

| PQ | Recomendación | Artefactos | Requisitos que cambian | ¿Decisión nueva? | Depende de |
|---|---|---|---|---|---|
| **PQ-10** | Contraseña opcional plegada en N1 y fila en N8; entrar con pestañas «código» o «contraseña»; restablecer con código de 6 dígitos de 10 min; contraseña de 8 a 72 sin reglas de composición; 5 fallos pausan la contraseña 15 min (el código sigue) | `n1-cuenta-contrasena.html` (N1·1 a N1·13 y N8·Acceso) | RF-ALT-02, 02b, 02c (nuevo), 03; RF-AJU-03; RNF-STK-04; 07-entrega §1 y §4 | No (confirmar los `[SUPUESTO]`) | Arquitecto: verificar capacidades de Supabase y PQ-28 (SMTP) |
| **PQ-12** | C5 con datos de la cuenta y de cada negocio; una sola acción «Borrar mi cuenta» con diálogo, lista de recompensas perdidas y casilla; efecto inmediato independiente del plazo; plazo como texto **Por definir** | `c5-mis-datos.html` (C0·hdr y C5·1 a C5·9) | RF-APP-14; RNF-PRI-09; PRD §4.1; 07-entrega §1 y §3; pieza 05 B; RF-SEL-15 | **Sí, D-024** | PQ-04 (retención) y PQ-18 (texto de uso de la app); consulta legal D-017 |
| **PQ-19** | Corrección del total en curso, tope de 3, motivo obligatorio, evento inmutable, solo en línea; cambiar la meta «nunca quita» con `meta_ciclo` (bajar aplica ya, subir aplica tras el canje) | Dibujos en este documento; sin HTML | RF-CLI-04; RF-TAR-06; RF-EVT-01; 07-entrega §3 y §4; pieza 05 (N7) | **Sí, D-025** | Aarón: ¿excedente al ciclo siguiente?, ¿corregir puede completar la tarjeta? |
| **PQ-20** | Semana = 7 días completos que terminan ayer, en la zona del negocio; llave ISO para el evento; intervalo = mediana de los últimos 5; con una visita, En riesgo usa solo los 30 días | Tabla de casos de prueba | RF-INI-05, 06; RF-QR-01, 05; 07-entrega §4 | **Sí, D-026** | PQ-27 (bienvenida); revisión con datos del piloto (Fase 9) |
| **PQ-06** | Una línea en C3 y hoja «Términos de la tarjeta» a un toque, sin ruta nueva | Dibujo en este documento | RF-APP-10; RF-APP-09; RF-AJU-02; pieza 02 | No | PQ-26 (caducidad) |

## Pendientes para otras fases o agentes

- **Fase 7 · `lealtab-copywriter`:** afinar todo el copy de N1, C5 y la hoja de términos (borradores marcados).
- **Fase 7 · `lealtab-arquitecto`:** verificar las capacidades de Supabase (tabla de PQ-10), el contador de intentos, el borrado con bloqueo y el rechazo «tarjeta dada de baja» (CA-12.10), `meta_ciclo` y el evento `correccion`, y las consultas con fecha de corte (PQ-20).
- **Fase 7 · `lealtab-analista-metricas`:** los cuatro eventos nuevos y la llave `semana` de MET-10.
- **Fase 7 · coordinador:** asignar números a D-024 a D-026 y a las PQ nuevas; actualizar el PRD y `07-entrega` con los textos de este documento (esta propuesta no los edita).
- **PNG de los dos wireframes:** pendientes (sin navegador en esta sesión).
- **v1 / Fase 9:** filtro global «Correcciones» en N7, «Quitar esta tarjeta» por negocio, «Editar nombre» en C5 y revisión del umbral de En riesgo con datos reales.
