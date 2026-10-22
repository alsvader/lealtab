# 08 · Registro con código: C1 en dos pasos, R1, recuperación e instalación en iPhone (v1)

Estado: **Propuesta (2026-10-22), con las decisiones de Aarón del mismo día aplicadas:** el botón del paso 1 es «Enviarme el código», el nombre de R1 con sesión se prellena (editable) y la ayuda al cliente es «pregunta en el mostrador», sin canal nuevo de LealTab. Pendiente de aprobación final. Fecha: 22 oct 2026. Base: `../04-design-system/tokens.css`, 390 px móvil, sin colores nuevos. Origen: **D-031** (el cliente usa Supabase Auth con su teléfono verificado por OTP desde el registro, sustituye a D-025), `docs/adr/003-sesion-cliente-y-codigo.md` §2.2, §2.3 y §2.8, y PRD v1.6 (RF-APP-01 a 04, 14 y 15, MET-03, R-18).
Archivos (`.html`; **los `.png` están pendientes**: el agente no tuvo un navegador, ver «Generar los PNG» al final):

| Archivo | Contenido |
|---|---|
| `tarjeta-cliente/c1-registro-con-codigo.html` | C1 paso 1 (8 estados), paso 2 (9 estados) y éxito (3 variantes) |
| `tarjeta-cliente/c1-segundo-negocio-y-recuperar.html` | R1 con sesión (6 estados), R1 sin sesión, `/c/recuperar` (5 estados) |
| `tarjeta-cliente/c2-instalar-ios-install-token.html` | C2 en iPhone con `install_token`: guía, mecanismo A, fallas y mecanismo B |

Negocio de ejemplo: Barbería Vélez (8 sellos) y Tapioca Mía (6 sellos). El copy es **borrador**: lo afina `lealtab-copywriter` en `docs/fase-7/microcopy.md`.

## 1. Qué cambia respecto a lo aprobado (pieza 02 y 06)

- **C1 pasa de uno a dos pasos.** Paso 1: nombre, WhatsApp, aviso del negocio y casilla (lo aprobado), con el botón «Enviarme el código». Paso 2: código de 6 dígitos y el botón «Crear mi tarjeta», que es la acción que de verdad crea la tarjeta. El aviso va **antes** del envío porque el número ya se trata al mandar el código.
- **R1 «WhatsApp ya registrado» se retira.** Decía «Ya tienes cuenta» antes del código: contradice D-031 (la respuesta es la misma para un teléfono nuevo y uno existente, ADR-003 §2.2). `estados/b-cliente-y-acceso.{html,png}` queda como historial; R2, R3, R4 y L1 siguen vigentes (R2 se actualiza en C1·1c).
- **R1 ahora es «segundo negocio»:** con sesión en el navegador no pide código; sin sesión es el mismo C1 en dos pasos y recupera todas las tarjetas.
- **C0 no tiene «tarjeta por confirmar»** (con «Aceptar» y «No soy yo»): ese diseño pendiente de D-025 se cancela. C0 conserva solo «con tarjetas» y «sin tarjetas» aprobados. No hay estado de C0 que haya que dibujar.
- **Recuperación** (`/c/recuperar`) es el mismo flujo sin negocio, con la voz de LealTab.
- **C2 en iPhone** suma el `install_token`, invisible para el cliente, y sus estados de falla.

## 2. Mapa del flujo

```
QR del mostrador → /c/{slug}/
  ├─ con sesión en este navegador ──→ R1·1 (nombre + aviso) ──→ tarjeta activa ──→ C3
  │                                   └ ya tenía la tarjeta ──→ C3 (R1·4)
  └─ sin sesión ──→ C1 paso 1 ──→ C1 paso 2 (código) ──→ éxito
                                    ├ teléfono nuevo ──→ C2 ──→ C3
                                    ├ teléfono con tarjetas ──→ C2/C3 + «También recuperamos…» (C1·2k)
                                    └ ya tenía tarjeta aquí ──→ C3 con sus sellos (C1·2l)
C0 sin sesión / R3 / C2 / I5 ──→ /c/recuperar (REC·1) ──→ paso 2 ──→ C0 (con o sin tarjetas)
PWA de iPhone, primera apertura ──→ A: canje del token ──→ C0   |   B: «Confirma tu número» ──→ paso 2 ──→ C0
```

La pantalla del paso 2 es **una sola** para registro, recuperación e instalación B; solo cambia el botón final («Crear mi tarjeta» o «Entrar») y si hay encabezado de negocio.

## 3. Decisiones de diseño y su evidencia

| Decisión | Por qué | Evidencia |
|---|---|---|
| Un solo campo para los 6 dígitos (no seis cajas) | El autollenado del teléfono y pegar un código funcionan mejor con un campo; menos errores de foco | `[SUPUESTO]` práctica común; sin datos propios. `autocomplete="one-time-code"` es un valor estándar de HTML (https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill, no se abrió en esta sesión: verificar) |
| Sin envío automático al completar 6 dígitos | Cada fallo gasta uno de 5 intentos (ADR-003 §2.8); el botón es explícito | ADR-003 §2.8 |
| «Pedir otro código» explícito al vencer (no automático como L1 del dueño) | Cada envío cuesta y cuenta para 3 por hora, 10 al día y 400 globales. **Texto: elegí el del copywriter** (`microcopy.md` §1.2) frente a mi «Enviar código nuevo» | ADR-003 §2.8; D-031 |
| «Reenviar código» y «Recibir por SMS» juntos, ambos con espera de 60 s | WhatsApp es el canal principal y SMS el respaldo a petición; los dos son un envío nuevo. **Texto del copywriter:** «Reenviar código» y «Reenviar código en {s} s» (el chip y el cuerpo ya dicen el canal) en lugar de «Reenviar por WhatsApp» | D-024; ADR-003 §2.8; `microcopy.md` §10 |
| Copy de la pieza = `microcopy.md` (§10): título del paso 2 **«Escribe tu código»**; «Número en pausa» (no «Demasiados intentos»); «No podemos registrarte ahora» (no «clientes nuevos»); «Listo, aquí están tus tarjetas.»; sin las palabras «sesión» ni «acceso» en el texto visible al cliente (se usa «tus tarjetas» y «Confirma tu número»); «Recibir código» en las pantallas de reentrada | El copy final es del copywriter; la maqueta manda en la estructura | `microcopy.md` §10 |
| Cuenta regresiva calculada desde la hora del envío, sin anunciar cada segundo | El cliente sale a WhatsApp y vuelve; un contador que se pausa en segundo plano miente | `[SUPUESTO]`; patrón ya usado en CA-10.9 |
| Nombre, WhatsApp, casilla y paso se conservan en `sessionStorage` solo durante el flujo | iOS puede recargar la pestaña mientras el cliente copia el código en WhatsApp; ADR-003 §2.2 dice «estado del formulario del navegador» pero no cubre la recarga. Dudas, punto 1 | `[SUPUESTO]`; propuesta al arquitecto |
| Éxito distinto solo **después** de verificar | Antes del código, ninguna pantalla puede decir si el teléfono existe | ADR-003 §2.2, §3 prueba 6; RF-APP-04 |
| R1 con sesión: WhatsApp enmascarado y de solo lectura | El teléfono ya está verificado; no se vuelve a pedir ni a mostrar completo | ADR-003 §2.2 |
| R1 con sesión: nombre prellenado y editable con el último que dio | Menos tecleo; sigue siendo un nombre por negocio y el de otro negocio nunca se sobrescribe (D-019) | Decisión de Aarón, 22 oct 2026 |
| La casilla del aviso del negocio nuevo nunca viene marcada | Es un consentimiento por negocio (D-019, RNF-PRI-01) | D-019 |
| `/c/recuperar` pide la casilla del aviso de LealTab | Un teléfono sin cuenta que «recupera» crea una `identidad`; no se puede distinguir (misma respuesta) | `[SUPUESTO]` legal; PQ-18 |
| Mecanismo B (respaldo): el envío del código es con botón, no automático al abrir | Evita gastar un mensaje cuando alguien abre el ícono sin querer | ADR-003 §2.3 y §4 |
| «Pregunta en el mostrador» en bloqueo, error del proveedor, falla tras verificar y sin número viejo (sin enlace ni canal de LealTab) | El negocio atiende al cliente que no recibe su código; es la salida humana cuando el flujo no deja avanzar. El «Ayuda por WhatsApp» del dueño sigue en el panel (L1) | Decisión de Aarón, 22 oct 2026 |
| Botón del paso 1: «Enviarme el código» | Dice qué pasa al tocarlo y el consentimiento ya aplica al envío; «Crear mi tarjeta» queda en el paso 2, donde se crea | Decisión de Aarón, 22 oct 2026 |

## 4. Estados y criterios de aceptación

Nomenclatura: `CA-C1.n` (registro), `CA-R1.n` (segundo negocio), `CA-REC.n` (recuperación), `CA-IOS.n` (instalación en iPhone), `CA-C0.n`. Cada uno se verifica con una prueba de Playwright o con una revisión manual.

### C1 paso 1 (`c1-registro-con-codigo.html`)

| ID | Estado | Criterio de aceptación |
|---|---|---|
| CA-C1.1 | 1a Normal | Orden: encabezado del negocio, «Paso 1 de 2» (texto y barra), título, nombre, WhatsApp con ayuda, aviso corto, casilla, botón «Enviarme el código», «Hecho con LealTab» al pie. El botón es el último control antes del pie |
| CA-C1.2 | 1a Campos | Nombre con `autocomplete="name"`. WhatsApp con prefijo «+52» fijo y de solo lectura, `inputmode="tel"`, `autocomplete="tel-national"`; acepta espacios, guiones, paréntesis y pegar con «+52» o «52» al inicio (se normaliza a 10 dígitos). Todos los campos usan `--font-size-input` y miden 48 px de alto o más |
| CA-C1.3 | 1e Falta aceptar | Con la casilla sin marcar, el envío no sale: se muestra «Error: para continuar, acepta el aviso de privacidad.» (en R1 con sesión, «…de {negocio}») en rojo, ligado a la casilla con `aria-describedby`, y el foco va a la casilla. El área táctil de la casilla es de 44 px o más |
| CA-C1.4 | 1a Aviso | El aviso corto del negocio va visible antes del botón, con enlace al aviso completo (44 px de alto o más). La frase que dice que el WhatsApp también se usa para enviar el código: **Por definir (PQ-18)**. Ayuda del WhatsApp y texto bajo el botón como en `microcopy.md` §1.1. «Hecho con LealTab» está siempre |
| CA-C1.5 | 1b Enviando | Al enviar, el botón queda deshabilitado con «Enviando código…» y `aria-busy`, los campos pasan a solo lectura y una región `aria-live="polite"` dice «Enviando tu código.» Tocar dos veces genera **una sola** petición a `POST /c/api/auth/codigo` |
| CA-C1.6 | 1b → 2a | La respuesta de éxito es siempre la misma (mismo texto, misma pantalla, sin diferencia visible de tiempo atribuible a la existencia del teléfono): ningún texto, chip o estado de este paso ni del siguiente dice «ya tienes cuenta» o equivalente |
| CA-C1.7 | 1c Número no válido | Con menos de 10 dígitos al enviar: «Error: escribe tus 10 dígitos, por ejemplo 993 123 4567.», campo con borde rojo, `aria-invalid="true"`, `aria-describedby` y `role="alert"`. No se valida mientras se escribe |
| CA-C1.8 | 1d Número rechazado | Si el servidor rechaza el prefijo (solo móviles de México de 10 dígitos): «Error: por ahora solo aceptamos celulares de México, de 10 dígitos. Por ejemplo, 993 123 4567.» (si lo rechaza el servidor: «Por ahora solo aceptamos celulares de México, de 10 dígitos. Revisa tu número.»). El mensaje es el mismo para cualquier rechazo de prefijo y no depende de si el número tiene cuenta |
| CA-C1.9 | 1f Sin conexión | Con `navigator.onLine` falso o la petición fallida por red: pastilla «Sin conexión» (durazno claro y texto), aviso «Para crear tu tarjeta hace falta internet. Lo que escribiste se queda aquí; inténtalo cuando vuelva la señal.» y botón «Intentar de nuevo» (comprueba la conexión). Los datos del formulario se conservan. Al volver la conexión se quita el aviso, se reactiva el envío sin recargar y se anuncia en `aria-live="polite"` |
| CA-C1.10 | 1g, 1g-b No podemos registrarte ahora | Título «No podemos registrarte ahora» con dos variantes: «error del envío» (fallo puntual de tiempo o 5xx: «Tuvimos un problema para enviarte el código. No hiciste nada mal. Inténtalo de nuevo en unos minutos.») y «proveedor caído o sin servicio» (fallan WhatsApp y SMS, tope global del día o sin saldo, R-18: «Por ahora no podemos mandar códigos… es un problema de nuestro lado. Inténtalo más tarde.»). Botón «Intentar de nuevo». Los límites por IP muestran la variante del envío. No revela cuál es la causa. Incluye `{askCounter}` («Pregunta en el mostrador de {negocio}: ahí te ayudan.»), sin enlace ni `wa.me`; la variante del proveedor agrega «Si ya tenías tu tarjeta, tus sellos siguen igual». Con `role="alert"` |
| CA-C1.11 | 2m Demasiados códigos | Al llegar a 3 envíos por hora, 10 al día por teléfono o 10 por hora por IP: título «Espera un momento» y «Ya mandamos varios códigos a este número. Si tienes uno reciente, escríbelo arriba: dura 10 minutos. Si no, inténtalo más tarde.» más `{askCounter}`; botón «Entendido». La hora de reapertura solo se muestra si el servidor la devuelve. Si el límite salta en el paso 1 (sin campo de código «arriba»), el texto queda **Por definir** con el copywriter. El texto no cambia según el teléfono tenga cuenta o no |

### C1 paso 2

| ID | Estado | Criterio de aceptación |
|---|---|---|
| CA-C1.12 | 2a Estructura | «Paso 2 de 2», título «Escribe tu código», chip con el canal («Enviado por WhatsApp» o «Enviado por SMS»), cuerpo «Te lo mandamos por WhatsApp al {teléfono}. Dura 10 minutos.» (o «por SMS») y «‹ Cambiar número» (44 px de alto o más) que vuelve al paso 1 con los datos conservados |
| CA-C1.13 | 2a Campo | **Un solo** `<input>` de 6 dígitos con `inputmode="numeric"`, `autocomplete="one-time-code"`, `maxlength="6"`, `pattern="[0-9]*"`, etiqueta visible «Código de 6 dígitos» y `--font-size-input`. Acepta pegar «482 913» o «482-913» y deja solo los 6 dígitos. El foco entra al campo al abrir el paso. No se envía solo al completar los 6 dígitos. Con menos de 6 dígitos, el botón muestra «Error: escribe los 6 dígitos del código.» |
| CA-C1.14 | 2a Avance | Nombre, WhatsApp, casilla y paso se conservan en `sessionStorage` solo durante el flujo y se borran al crear la tarjeta o al cerrar la pestaña. Si el navegador recarga la página al volver de WhatsApp, se regresa al paso 2 con el teléfono y sin pedir otro código. Si el estado se perdió, se vuelve al paso 1 con «Empecemos de nuevo» y no se crea nada. **Pendiente de confirmar con el arquitecto** (Dudas, punto 1) |
| CA-C1.15 | 2d Verificando | Botón deshabilitado «Verificando…» con `aria-busy`, campo y «Cambiar número» deshabilitados, región `aria-live="polite"` con «Verificando tu código.» Una sola petición a `POST /c/api/auth/verificar` aunque se toque dos veces |
| CA-C1.16 | 2e Incorrecto | Chip «Error: código incorrecto» y «Ese código no es el correcto. Revisa los 6 dígitos. Te quedan N intentos.» («Te queda 1 intento.» en singular; con 1 intento, además se ofrece «Pedir otro código») con N = 5 menos los fallos, tomado del servidor (`codigo_intento`), no del navegador. Campo con borde rojo, `aria-invalid`, `aria-describedby`; el foco queda en el campo con el texto seleccionado. No vacía el campo ni reinicia la espera de reenvío |
| CA-C1.17 | 2f Vencido | A los 10 minutos, o al intentar con un código vencido: chip «Código vencido» y «Este código ya venció: dura 10 minutos. Pide uno nuevo.». Ofrece «Pedir otro código» (primario) y «Recibir por SMS»; **no se envía solo**. Respeta los 60 s y los límites; si alguno aplica, se muestra el estado 1h o la espera |
| CA-C1.18 | 2a/2b Reenvío | 60 s desde el último envío exitoso. Mientras tanto, «Reenviar código en 42 s» (`role="timer"`, `aria-live="off"`) y «Recibir por SMS» están deshabilitados (`aria-disabled`). Con la espera cumplida, el botón dice «Reenviar código». Debajo de ambos va siempre «¿No te llega? Pasa a veces.» más `{askCounter}`. La cuenta sale de la hora del envío, no de un temporizador que se detiene en segundo plano. Solo el paso a «ya puedes pedir otro código» se anuncia en `aria-live="polite"`. Al reenviar, el campo se limpia y la espera reinicia |
| CA-C1.19 | 2b/2c SMS | «Recibir por SMS» está junto a «Reenviar» y sigue la misma espera. Cada envío cuenta para 3 por hora y 10 al día. Tras enviar por SMS, el chip y el cuerpo dicen «SMS» y el reenvío sigue llamándose «Reenviar código». Etiqueta unificada: «Recibir por SMS» (aria: «Recibir el código por SMS») |
| CA-C1.20 | 2c Respaldo automático | Si WhatsApp falla, el servidor reintenta por SMS en la misma llamada y la pantalla dice «No pudimos usar WhatsApp, así que te lo mandamos por SMS al {teléfono}.» (chip «Enviado por SMS», `aria-live="polite"`). Si fallan los dos, se muestra 1g |
| CA-C1.21 | 2h Sin conexión | Pastilla «Sin conexión» y aviso «Para crear tu tarjeta hace falta internet. Lo que escribiste se queda aquí; inténtalo cuando vuelva la señal.» con botón «Intentar de nuevo». El código escrito se conserva y el tiempo de vigencia no se pausa. Al volver la conexión se reactiva sin recargar |
| CA-C1.22 | 2j Éxito, cliente nuevo | Al verificar, si la creación tarda más de 1 s se ve «Creando tu tarjeta…» (`aria-live="polite"`). El resultado es C2 con «Tu tarjeta está lista» y «Número verificado. Tu tarjeta de {negocio} ya está en tu celular.». Con sello de bienvenida activo, nota «Tu sello de bienvenida ya está aquí» y 1/N; sin él, 0/N sin la nota. El foco va al encabezado. Si la app ya está instalada, se pasa directo a C3 |
| CA-C1.23 | 2i Falla tras verificar | Si el número se verificó pero la transacción de creación falla: chip «Número verificado» y «No se creó tu tarjeta… no necesitas otro código». «Reintentar» repite solo la creación con la sesión ya abierta y con el nombre y el consentimiento conservados. Si la sesión ya no existe, regresa al paso 1 con el aviso. **Pendiente del arquitecto** (Dudas, punto 5) |
| CA-C1.24 | 2k Teléfono con tarjetas | Solo **después** de verificar: «Listo, aquí están tus tarjetas.» y el aviso «Más seguro: por tu seguridad, cerramos tus tarjetas en otros teléfonos y navegadores. Si las necesitas ahí, entra de nuevo con un código.» (elegí el texto corto del copywriter; no se listan los negocios). El negocio de este registro no ve nada distinto: su panel muestra solo nombre, WhatsApp y alta del cliente (RF-CLI-08) |
| CA-C1.25 | 2l Ya tenía tarjeta aquí | Si ya existía el `cliente_negocio` de este negocio: «Ya tienes tu tarjeta de {negocio}.», se abre esa tarjeta con sus sellos, no se crea otra y no se repite el sello de bienvenida. El nombre que ya guardó ese negocio no se cambia con el que se escribió ahora `[SUPUESTO]`, Dudas, punto 6 |
| CA-C1.26 | 2g Demasiados intentos | El 5.º fallo invalida el código y bloquea el teléfono 15 minutos: título «Número en pausa» y «Hubo 5 intentos con este código, así que lo cancelamos. Por seguridad, este número descansa hasta las HH:MM. Después podrás pedir otro código.» más `{askCounter}` (sin enlace). Campo deshabilitado; botones «Cambiar número» y «Entendido». La hora viene del servidor (`bloqueado_hasta`). El mensaje es el mismo para cualquier teléfono. Pasados los 15 minutos, el estado se limpia y «Pedir otro código» vuelve |
| CA-C1.27 | Todos | Estado siempre con palabra y color; texto de 4.5:1 de contraste o más; `--focus-ring` visible en todo control; orden de tabulación lógico; objetivos de 44 px o más (los botones de la maqueta miden 48 px); sin animaciones y con `prefers-reduced-motion` respetado; los resultados se anuncian en `aria-live="polite"` y los errores bloqueantes con `role="alert"` |
| CA-C1.28 | Todos | El código nunca se escribe en la URL, en `localStorage`, en `sessionStorage` ni en un evento de analítica. El teléfono no va en la URL |
| CA-C1.29 | 1g | Si `POST /c/api/auth/codigo` no responde en el tiempo de espera, se muestra 1g. El valor es **Por definir** con la prueba del hook (PQ-30); el borrador usa 15 s `[SUPUESTO]` |

### R1 con y sin sesión (`c1-segundo-negocio-y-recuperar.html`)

| ID | Estado | Criterio de aceptación |
|---|---|---|
| CA-R1.1 | R1·1 | Con una sesión válida en el navegador, la pantalla («Agrega tu tarjeta de {negocio}», «Ya tienes tu cuenta de LealTab. Solo confirma tu nombre para este negocio.») no pide WhatsApp ni código: lo muestra enmascarado («+52 993 ••• 4567», «Verificado») y de solo lectura, con el enlace «¿No eres tú? Usar otro número» (qué hace ese enlace lo decide el arquitecto; microcopy.md §9) |
| CA-R1.2 | R1·1 | Pide el nombre para ese negocio (editable; prellenado con el último que dio, sin sobrescribir nunca el nombre guardado en otro negocio) y la casilla del aviso **de ese negocio**, siempre desmarcada al llegar. Ayuda del nombre: «Usamos el último nombre que diste. Puedes cambiarlo: cada negocio guarda el que le das aquí y ningún otro negocio lo ve.» Sin la casilla no avanza («Error: para continuar, acepta el aviso de privacidad de {negocio}.») |
| CA-R1.3 | R1·2, R1·3 | «Agregar mi tarjeta» es un solo paso. Al terminar, la tarjeta queda activa, aparece en Mis tarjetas y se abre C3 con «Listo, agregamos tu tarjeta de {negocio} a Mis tarjetas.»; con sello de bienvenida, «Listo. Tu sello de bienvenida ya está aquí.» y 1/N. C2 no se muestra si la app ya está instalada o si ya eligió «Ahora no» |
| CA-R1.4 | R1·4 | Si el cliente ya tiene tarjeta en ese negocio, no hay formulario: «Ya tienes tu tarjeta de {negocio}.» y se abre C3 |
| CA-R1.5 | R1·5 | Sin conexión, «Agregar mi tarjeta» queda deshabilitado con «Para agregar tu tarjeta hace falta internet. Inténtalo cuando vuelva la señal.»; Mis tarjetas sigue visible con lo guardado |
| CA-R1.6 | R1·6 | Si la sesión ya no es válida (cerrada por otro teléfono, cuenta borrada, vencida), el navegador la trata como sin sesión: título «Confirma tu número otra vez», «Cerramos tus tarjetas en este teléfono porque entraste desde otro lugar. Pide un código y las vuelves a ver.» y botón «Recibir código» (sin las palabras «sesión» ni «acceso»). No muestra datos de tarjetas. Se borran del almacenamiento local las tarjetas y las llaves del QR |
| CA-R1.7 | R1·7 | Sin sesión, el segundo negocio es el mismo C1 en dos pasos (CA-C1.1 a CA-C1.28). No existe pantalla ni estado propio antes del código |
| CA-R1.8 | R1·7 | Una prueba automática confirma que, para un teléfono nuevo y para uno con tarjetas, las respuestas de `/c/api/auth/codigo` y `/c/api/auth/verificar` (con código válido) coinciden en forma y en texto visible hasta el éxito; ADR-003 §3, prueba 6 |

### Recuperación (`c1-segundo-negocio-y-recuperar.html`)

| ID | Estado | Criterio de aceptación |
|---|---|---|
| CA-REC.1 | REC·1 | `/c/recuperar` se alcanza desde C0 sin sesión («Recibir código» en la pantalla de reentrada), desde el texto «recupérala con tu WhatsApp» de C2 y R3, y desde I5. Habla con la voz de LealTab, sin logo de negocio |
| CA-REC.2 | REC·1, REC·2 | Paso 1: título «Recupera tus tarjetas», solo WhatsApp (ayuda «10 dígitos. Si cambiaste de teléfono, escribe tu número de antes.»), botón «Enviarme el código» y la casilla del aviso de LealTab (texto **Por definir, PQ-18**). Paso 2: el mismo de C1, con el botón «Entrar». «¿Ya no tienes ese número?» abre REC·5 |
| CA-REC.3 | REC·3, REC·4 | La respuesta al pedir y al verificar es igual para un teléfono con tarjetas y uno sin ellas. Solo después de verificar: con tarjetas, C0 con «Listo, aquí están tus tarjetas.»; sin tarjetas, el estado vacío aprobado de C0 con «Número verificado» |
| CA-REC.4 | REC·3 | Al verificar se cierran las demás sesiones del usuario (`signOut` con `scope: 'others'`). El teléfono que entra ve, una sola vez, el aviso «Más seguro: por tu seguridad, cerramos tus tarjetas en otros teléfonos y navegadores. Si las necesitas ahí, entra de nuevo con un código.» con «Entendido» |
| CA-REC.5 | R1·6 | En el teléfono anterior, al fallar la renovación de su sesión o recibir un 401, se muestra R1·6 y se borran tarjetas y llaves locales. Un access token ya emitido puede seguir funcionando hasta 1 hora (ADR-003 §1); la pantalla no promete cierre inmediato. Dudas, punto 3 |
| CA-REC.6 | REC·5 | Título «Si ya no tienes ese número»: «No podemos pasar tus sellos a un número nuevo. Puedes empezar de cero con tu número de ahora: escanea el QR de tu negocio y regístrate.» No promete recuperar sellos. Incluye «Entendido» y `{askCounter}` en su variante sin negocio («Pregunta en el mostrador de un negocio donde tengas tu tarjeta: ahí te ayudan.»), sin enlace |
| CA-REC.7 | REC·2 | Los límites y estados son los de C1 (60 s, 3 por hora, 10 al día, 5 intentos, bloqueo de 15 min, solo móviles de México, sin conexión, error del proveedor) con los mismos textos |

### Instalación en iPhone (`c2-instalar-ios-install-token.html`)

| ID | Estado | Criterio de aceptación |
|---|---|---|
| CA-IOS.1 | I1 | La guía conserva sus 3 pasos y «Ahora no» no bloquea. Cuerpo «Guarda tus tarjetas en tu inicio. Sin descargar nada.» y la línea «Después, ábrela desde el ícono de LealTab en tu inicio.» (`install.openFromIcon`). El `install_token` se genera al mostrar la guía y va en el `start_url` del manifest; el cliente no lo ve ni lo copia |
| CA-IOS.2 | I2 | La primera apertura envía el token con un `POST` desde el servidor, se quita de la URL con `history.replaceState` antes de pintar nada y mientras tanto se muestra el splash de LealTab con «Abriendo tu tarjeta…» (`aria-live="polite"`). El token se marca usado al canjear, aunque falle el segundo paso |
| CA-IOS.3 | I3 | Con el canje bien, se abre C0 (o C3 si venía de una tarjeta) con «Listo. Tu tarjeta ya está en tu inicio.». El aviso se cierra con un botón de 44 px y no vuelve a aparecer |
| CA-IOS.4 | I5 | Si el token ya se usó, venció (más de 24 h) o el canje falla después de usarlo: título «Confirma tu número», «No pudimos abrir tus tarjetas desde este ícono. Escribe tu WhatsApp, te mandamos un código y entras en segundos.», campo «Tu WhatsApp» y botón «Recibir código» (misma pantalla que `/c/recuperar`; sin la palabra «acceso»). No muestra ningún dato del cliente |
| CA-IOS.5 | I6 | Sin conexión, el token no se gasta: «Sin conexión» y «Reintentar» (copy propio del designer, falta en `microcopy.md`). Mientras el token siga vigente, reintentar funciona |
| CA-IOS.6 | I4, I4b (mecanismo B; **dos variantes hasta PQ-31**) | **B1** (el token identifica al cliente): «Confirma tu número» y «Te mandamos un código al número que termina en {last4}.» con «Enviarme el código»; el envío ocurre solo al tocarlo y «No es mi número» lleva a REC·1. **B2** (el token no deja saber el número): se usa la pantalla de I5 con «Recibir código». En ambas, después, el paso 2 con «Entrar» y los estados y límites de C1. Lo decide el arquitecto con la prueba de PQ-31 |
| CA-IOS.7 | I4 | Con el mecanismo B, el token solo identifica a quién enviar el código; no abre sesión. Se marca usado al verificar el código. Cada instalación cuenta para los límites de envío |
| CA-IOS.8 | Android | En Android/Chrome no hay token ni pantalla nueva. Si la prueba de RNF-PWA-07 muestra que la PWA no hereda la sesión, se usa I5 |

### C0 (`tarjeta-cliente/c0-mis-tarjetas.html`, sin cambios)

| ID | Criterio de aceptación |
|---|---|
| CA-C0.1 | C0 tiene solo dos estados de lista: con tarjetas y sin tarjetas. No existe el chip «Por confirmar» ni los botones «Aceptar» y «No soy yo»; toda tarjeta que aparece en C0 está activa y se abre en C3 |
| CA-C0.2 | Sin sesión, C0 no se muestra: lleva a `/c/recuperar`. Sin conexión y con sesión guardada, se muestra lo guardado con «Puede haber sellos pendientes» (R4) |

## 5. Eventos (los nombres son del analista; no se editó `07-entrega` §5)

El catálogo vigente está en `07-entrega` §5 y `docs/fase-7/medicion.md` §4.3 y §4.4 (`registro_iniciado`, `codigo_pedido`, `codigo_enviado`, `codigo_reenviado`, `codigo_canal_cambiado`, `codigo_verificado`, `codigo_fallido`, `recuperacion_completada`, `install_token_canjeado`, `whatsapp_ayuda_click`). Cada estado de esta pieza tiene su evento, salvo estos huecos para que el analista los revise:
- Con la decisión del 22 oct, las pantallas del cliente ya no tienen «Ayuda por WhatsApp»: no se necesita atributo de origen para el cliente; `whatsapp_ayuda_click` queda para el dueño.
- Instalación en iPhone: solo existe el canje exitoso (`install_token_canjeado`). Faltan el canje fallido (I5), la apertura sin conexión (I6) y el paso al respaldo B (I4).
- Las pantallas R1·6 (sesión cerrada) y CA-C1.23 (falla tras verificar) no tienen evento.
- Botón de SMS: se unifica en **«Recibir por SMS»** (igual que `microcopy.md`). `medicion.md` y el ADR-004 §2.3 aún citan «Mejor recíbelo por SMS»: es solo la etiqueta, no cambia el evento.

## 6. Por definir y dudas

Detalle y propuestas en el reporte de entrega. Resumen:
1. Estado del formulario en `sessionStorage` durante el código (arquitecto).
2. `signOut` con `scope: 'others'` y la PWA de iPhone en el mismo teléfono (arquitecto).
3. Llaves HMAC y tarjetas en caché local del teléfono anterior (arquitecto).
4. ~~Prellenar el nombre en R1 con sesión~~ **Cerrada (Aarón, 22 oct):** se prellena y es editable.
5. Reintento de la creación tras verificar, sin código nuevo (arquitecto).
6. Nombre existente en el negocio frente al nuevo (arquitecto).
7. (Retirado: el destino de la ayuda para clientes ya está resuelto, «pregunta en el mostrador».) Queda por pensar para N5 qué hace el cajero cuando un cliente no recibe el código; no se diseñó.
8. Casilla del aviso de LealTab en `/c/recuperar` y texto del aviso (PQ-18, abogado).
9. Perder el número sin acceso al anterior: ¿hay una salida asistida por el negocio? Fuera del MVP; se anota para la Fase 9.
10. Tiempo de espera de la petición del código (PQ-30).

## 7. Generar los PNG

Los `.png` de estos tres `.html` y el de `tarjeta-cliente/c0-mis-tarjetas` (cambió su encabezado) están pendientes: el agente no tiene Bash. Con Playwright 1.61.1 de `web/` (ya instalado), el orquestador puede correr (ajustando la lista `files` para incluir `c0-mis-tarjetas`) `/private/tmp/claude-501/-Users-alsvader-Documents-Github-lealtab/1b9d4729-ae6c-4f39-8b0f-819682bc9b0d/scratchpad/shoot.mjs`, que captura cada `.html` a su `.png` hermano a página completa y ancho de 1708 px.
