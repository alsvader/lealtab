# Aprobaciones de Aarón sobre las PQ del PRD v1.4 · 21 oct 2026

Fuente única de lo que Aarón decidió en la sesión del 21 oct 2026, a partir de las propuestas de esta carpeta:
- `pq-arquitectura.md` (ronda 2)
- `pq-diseno.md` y los wireframes de `diseno/`
- `pq-copy.md`

Si una propuesta dice otra cosa, manda este archivo.

## Cerradas

| PQ | Decisión de Aarón | Detalle en |
|---|---|---|
| PQ-05 | Tres plantillas de `wa.me` fijas que N7 elige sola: recompensa lista → En riesgo → saludo. No son editables en el MVP | `pq-copy.md` |
| PQ-06 | Una línea con el límite bajo el QR de C3 y una hoja «Términos de la tarjeta» dentro de C3. C1 no cambia | `pq-diseno.md` §PQ-06 |
| PQ-10 | Tal cual la propuesta:<br>• la contraseña es opcional y aparece plegada en N1;<br>• para entrar hay pestañas «Con código» y «Con contraseña»;<br>• se restablece con un código de 6 dígitos que dura 10 min;<br>• la contraseña lleva de 8 a 72 caracteres, sin reglas de composición;<br>• 5 fallos pausan la contraseña 15 min y el código sigue disponible;<br>• «Cerrar otras sesiones» va desmarcada;<br>• N8 tiene una fila «Acceso» | `pq-diseno.md` §PQ-10; `diseno/n1-cuenta-contrasena.*` |
| PQ-12 | C5 vive en `/c/cuenta` y se entra desde «Mis datos ›» en C0, que sustituye el nombre global (D-019). «Borrar mi cuenta» pide una casilla de confirmación, no pide código y su efecto es inmediato. El plazo legal sigue Por definir (PQ-04) | `pq-diseno.md` §PQ-12; `diseno/c5-mis-datos.*` |
| PQ-13 | **SMS Masivos** (smsmasivos.com.mx), integrado con el **hook de SMS de Supabase Auth**. Supabase genera y verifica el código, y el hook lo envía por `POST /v2/otp` con `code_custom`. WhatsApp es el canal principal y SMS el respaldo | `pq-arquitectura.md` §7 |
| PQ-19 | Corregir sellos:<br>• hasta ±3 por corrección, con motivo obligatorio y solo en línea;<br>• cada corrección queda como un evento inmutable con el chip «Corregido»;<br>• una corrección **sí puede completar la tarjeta**.<br>Cambiar la meta nunca quita avance (`meta_ciclo`). Si se baja la meta, el **excedente se pierde al canjear**, porque el canje reinicia a 0 | `pq-diseno.md` §PQ-19 |
| PQ-20 | La semana son los 7 días completos que terminan ayer, en la zona del negocio. El intervalo habitual es la mediana de los últimos 5 intervalos. Con una sola visita, «En riesgo» usa solo el mínimo de 30 días | `pq-diseno.md` §PQ-20 |
| PQ-22 (a) | La zona horaria es un nombre IANA tomado del navegador en N2, validado contra las zonas de México y con `America/Mexico_City` de respaldo. Se puede editar en N8 | `pq-arquitectura.md` §1 |
| PQ-22 (b) | X se captura en horas, con hasta 2 decimales y 0 < X ≤ 24, y se guarda en minutos enteros. La ventana es móvil. **Aclara D-014** | `pq-arquitectura.md` §2 |
| PQ-22 (c) | Dos CSV, `clientes.csv` y `visitas.csv`, con las fórmulas neutralizadas | `pq-arquitectura.md` §3 |
| PQ-22 (d) | `alta_ts`, `tanda` y `version_producto` van en `negocio`. Las escribe el servidor y el dueño no las edita | `pq-arquitectura.md` §4 |
| PQ-22 (e) | Código de 6 dígitos que dura 10 min, con 5 intentos. Entre envíos hay que esperar 60 s, con un máximo de 3 por hora y 10 al día, y después hay un bloqueo de 15 min | `pq-arquitectura.md` §8 |
| PQ-22 (f) | La plantilla de WhatsApp es la fija del proveedor. El SMS va en GSM-7. No se necesita cuenta de Meta propia | `pq-arquitectura.md` §7 |
| PQ-22 (g) | La `identidad` y la sesión del cliente son propias (cookie `HttpOnly` con `Path=/c/`). Supabase Auth solo es el motor del código de recuperación | `pq-arquitectura.md` §8 |
| PQ-22 (h) | **Gana RF-APP-05**: la tarjeta del segundo negocio sin sesión queda «por confirmar» y no se manda código. El código por WhatsApp o SMS solo existe en `/c/recuperar`. Se reemplaza RF-APP-04 | `pq-arquitectura.md` §8 |
| PQ-23 | El respaldo es un SMS del mismo proveedor, con alertas de saldo y de fallos. **En el piloto no hay verificación por el cajero** | `pq-arquitectura.md` §9 |
| PQ-24 | Se aprueban las metas de rendimiento y disponibilidad. El plan de hosting y los respaldos quedan atados a la PQ-29 | `pq-arquitectura.md` §5 |
| PQ-26 (nueva) | Los sellos y la recompensa **no caducan** en el MVP | `pq-diseno.md` §PQ-06 |
| PQ-27 (nueva) | El sello de bienvenida **no cuenta como visita** en N0, N6 ni G1-a. «Nuevo» se mide desde el alta | `pq-diseno.md` §PQ-20 |
| PQ-28 (nueva) | Los correos de Auth del dueño salen por SMTP propio con **Resend** | `pq-diseno.md` §PQ-10 |

## Otras decisiones

- **N5 Mostrador sin un segundo service worker en el piloto.** Se descarta el ADR-005 propuesto.
  - N5 usa solo la cola en IndexedDB y debe abrirse con conexión. Si la red se cae con N5 abierto, sigue registrando.
  - La sincronización ocurre al abrir, con `visibilitychange`, con `online`, cada 30 s y con un botón. Background Sync no es requisito.
  - Se mide cuántas veces N5 se cerró o recargó durante una caída: se guarda `offline_since` en IndexedDB y se emite un evento. El nombre provisional es `mostrador_reabierto_tras_caida` y el final lo decide el analista. Si la métrica sale alta, se reevalúa el service worker.
  - RNF-PWA-04 se queda con un solo service worker, en `/c/`. **Aclara D-015**: «el mostrador debe abrirse con conexión; después funciona sin ella».
- **Clientes sin estado en N7:** reciben un chip neutro **«Al día»**, con el estilo de «Nuevo» y sin colores nuevos.

## Siguen abiertas

- **PQ-25:** la librería de QR. Antes de construir N5 se prueban `qr-scanner` y `barcode-detector` (*ponyfill*, con el `.wasm` autoalojado) en un iPhone y un Android reales, con los criterios de `pq-arquitectura.md` §6.1. Gana la más ligera que pase.
- **PQ-29 (nueva):** el costo base de infraestructura (Vercel Pro y Supabase Pro, unos USD 45 al mes) y el plan actual de Vercel. Hobby no permite uso comercial. Aarón lo revisa después y RNF-REN-06 no cambia mientras tanto.
- **PQ-30 (nueva):** lo que falta confirmar por escrito con SMS Masivos antes de construir la recuperación:
  - si su OTP por WhatsApp usa la API oficial de Meta (D-011);
  - el texto de la plantilla y el remitente;
  - la cotización del WhatsApp y del SMS;
  - si hay webhooks de entrega.

  Además, hay que hacer una prueba técnica: que Supabase dispare el hook sin un proveedor nativo. Si falla, se enmienda D-023.
- **PQ-01, 02, 08, 09, 15 y 17:** no bloquean el desarrollo. Se deciden antes de reclutar.
- **PQ-04, 07, 11, 18 y 21:** son del abogado o de trabajo de campo. La PQ-18 suma tres puntos:
  - las cookies de sesión son de primera parte y no de analítica;
  - los datos se tratan en EE. UU. (SMS Masivos, Supabase y Vercel);
  - SMS Masivos conserva los datos hasta 3 meses.

## Fuera de esta ronda (no decidido)

- Los eventos nuevos (`mostrador_reabierto_tras_caida`, `sellos_corregidos`, `cuenta_cliente_borrada`, `contrasena_restablecida`, `acceso_bloqueado`) y el atributo `archivo` de `export_csv`. Le toca al analista de métricas.
- Las pantallas que faltan: el estado «tarjeta por confirmar» en C0, con «Aceptar» y «No soy yo»; R1 sin la promesa de código; y el selector de zona horaria en N8.
- El copy de N0 «31 de 48 visitas», que mezcla clientes con visitas.
- Actualizar `brand/06-product-design/` (`07-entrega` §3, §4, §5 y §8; piezas 02, 05 y 06) y `PRODUCT.md`.
