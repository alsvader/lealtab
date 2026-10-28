# Feature: Registro del cliente

**Estado:** Cerrado por Aarón (27 oct 2026). Se construyó contra el código de prueba local. Lo que falta queda en T7. La entrega real del hook sigue en `spike-auth-cliente/T7`.
**Fase:** 7 · **Rama:** `feat/registro-cliente`
**Cubre:** RF-APP-01 a 04, 09 a 13 y 15 a 18; RF-SEL-04 (el QR en la tarjeta del cliente); RF-TAR-03 (el sello al crear la tarjeta); RNF-STK-06 en local · **Pantallas:** C0, C1, C3, C4, R1, `/c/recuperar` · **Flujos:** F2
**Restricciones:** D-019, D-031, D-016, ADR-003. El registro por correo sigue cerrado.

## Objetivo

El cliente abre el QR del mostrador, deja su nombre y su WhatsApp, confirma el código de prueba y ve su tarjeta. Si el negocio prendió el sello de bienvenida, la tarjeta nace con 1 sello. Un segundo negocio, con la sesión ya abierta, no pide otro código.

## Fuentes

- Diseño: `brand/06-product-design/08-registro-con-codigo.md` y los HTML de `tarjeta-cliente/`. El copy de los estados está en `docs/fase-7/microcopy.md` §1.
- Arquitectura: `docs/fase-7/arquitectura.md` §5.2 (`registrar_cliente`, segundo negocio) y §3.2 (`identidad`, `tarjeta_cliente`, `tarjeta_llave`).
- El código de prueba es el de `test_otp` (`+529931009901`, código `847291`). No se llama a SMS Masivos.

## Alcance

### Dentro

- `servidor.registrar_cliente`: identidad, ficha en el negocio, tarjeta, llave HMAC y, si el negocio lo tiene prendido, un sello de bienvenida. La segunda llamada no suma otro sello.
- C1 en dos pasos en `/c/{slug}/registro`, R1 con sesión, `/c/recuperar`, C0, C3 con el QR local y C4 cuando la tarjeta está llena.
- La respuesta de pedir el código no dice si el teléfono ya existía.

### Fuera

- La entrega real del código, el túnel y los teléfonos. Está en Plane como `spike-auth-cliente/T7`.
- C2, el manifest de la PWA y el `install_token`. Eso es `pwa-instalacion`.
- N5, el escáner y la tabla `evento`. El sello de bienvenida queda en `tarjeta_cliente.sellos`. La fila del evento, con origen `bienvenida`, entra cuando exista esa tabla.
- Cobro, N8 completo y borrar la cuenta.

## Tareas

| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | `servidor.registrar_cliente` | — | - Crea identidad, ficha, tarjeta y llave de 32 bytes (prueba) <br> - Con el sello de bienvenida prendido la tarjeta nace en 1; apagado, en 0 (prueba) <br> - Llamarla otra vez no suma otro sello (prueba) <br> - Un dueño no puede registrarse como cliente (prueba) <br> - `anon` y `authenticated` no ejecutan la función (prueba RLS) |
| T2 | C1 paso 1 en `/c/{slug}/registro` | T1 | - Pide nombre, WhatsApp y la casilla del aviso. El botón dice «Enviarme el código» (spec) <br> - Sin la casilla no sale el envío (spec) <br> - La respuesta es la misma si el teléfono existe o no (spec) |
| T3 | C1 paso 2 y alta de la tarjeta | T1, T2 | - El código de prueba deja la cookie `lt-cliente` y crea la tarjeta (spec) <br> - «Hecho con LealTab» se ve en la tarjeta (spec) <br> - El navegador no llama a Supabase (spec) |
| T4 | R1, segundo negocio, y `/c/recuperar` | T3 | - Con sesión, el segundo negocio no pide código y no pisa el nombre del primero (spec) <br> - Sin sesión, recuperar pide el teléfono y devuelve las tarjetas (spec) |
| T5 | C0, C3 y C4 | T3 | - C0 lista las tarjetas o el vacío (spec) <br> - C3 muestra los sellos y un QR que cambia con el paso de 60 s (spec) <br> - Con la meta llena se ve C4 (spec) |
| T6 | Cierre | T1 a T5 | - `pnpm lint`, `typecheck` y las specs de este feature en Chromium pasan (QA) <br> - `docs/fase-7/qa/registro-cliente.md` con veredicto |
| T7 | Seguimiento de lo que quedó fuera del cierre | T6 | - PQ-18: la frase del proveedor y si el aviso de la landing cubre al cliente (nota) <br> - El texto de «1 sello cada X horas» cuando X no es una hora entera (microcopy) <br> - axe, scroll desde 320 px, Firefox, WebKit y los dos móviles (specs) <br> - Revisión de seguridad del diff, que el reporte dejó vacía (reporte) <br> - Registro y QR en un iPhone con HTTPS (nota) <br> - No repite el hook alojado ni entra a la PWA ni a la fila del evento |

## Por definir

- La frase del aviso que dice que el WhatsApp también sirve para el código sigue en PQ-18. En este feature se usa el texto ya escrito en `microcopy.md` §1.1.
- El QR local firma con la llave de `tarjeta_llave`. Quien lo escanea es N5, que todavía no existe. Aquí solo se comprueba que el contenido cambia cada 60 s y que no llama a la red.

## Pendientes para Aarón

1. T7 de este brief: lo que el cierre dejó fuera.
2. Cuando exista el proyecto de pruebas, retomar `spike-auth-cliente/T7`. No está en el ticket de arriba.
