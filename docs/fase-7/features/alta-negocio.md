# Feature: Alta del negocio

**Estado:** Aprobado por Aarón (26 oct 2026)
**Fase:** 7 · **Rama:** `feat/alta-negocio` (se crea al aprobar)
**Cubre:** RF-ALT-01 a 12; RF-TAR-01 a 04 y 07; RF-COB-01 y 02; RF-AJU-01 (guardar la zona en N2); RF-EVT-01 (solo los eventos de esta lista) · **Pantallas:** N1, N2, N3, N4 · **Flujos:** F1
**Restricciones:** D-004, D-005, D-006, D-010, D-013, D-014, D-016, D-022, D-024, D-031; ADR-003, ADR-006, ADR-007. H-01 ya cerrado en código: el registro de Auth está apagado y el servidor crea la cuenta.

## Objetivo

El dueño se da de alta solo, arma su tarjeta y se lleva el cartel del mostrador. Al terminar N4 empiezan sus 30 días de prueba. No hace falta el proyecto de producción ni el hook de SMS: el correo del dueño sale por Resend y, en local, por Mailpit.

## Fuentes

- Pieza de diseño: `brand/06-product-design/04-alta-y-configuracion.md` y los HTML de `brand/06-product-design/alta/` (N2, N3, N4). N1 con contraseña: `docs/fase-7/propuestas/diseno/n1-cuenta-contrasena.html` (D-005, PQ-10 cerrada).
- Arquitectura: `docs/fase-7/arquitectura.md` §1 (rutas `/panel/entrar`, `/panel/alta`, `/panel/negocio`, `/panel/tarjeta`, `/panel/cartel`), §3 (`negocio`, `dueno_negocio`, `completar_alta`), §5.3 a §5.5 (auth del dueño, DAL, proxy).
- Copy: textos de esos wireframes. El cuerpo del correo del código no está en `docs/fase-7/microcopy.md`; ver «Por definir».
- Eventos: `negocio_alta_completada`, `tarjeta_configurada`, `qr_mostrador_descargado`, `whatsapp_ayuda_click` (`docs/fase-7/medicion.md` §4 y `07-entrega` §5).

## Alcance

### Dentro

- N1 a N4 en `/panel/`, con la barra de 4 pasos y «Ayuda por WhatsApp».
- Entrada del dueño por código de correo o por contraseña, y restablecer la contraseña, sin que el navegador llame a Supabase.
- `servidor.crear_negocio` y `servidor.completar_alta`, con el rol `dueno` escrito solo por el servidor.
- Logo opcional en el bucket `logos`, servido por el mismo origen.
- Los cuatro eventos de arriba, por una ruta propia.

### Fuera

- Enlaces de la landing hacia `/panel/` (PQ-N10, Fase 5 en pausa). El alta se abre en `/panel/alta` y `/panel/entrar`.
- Registro del cliente, PWA, hook de SMS y `spike-auth-cliente`.
- N5 a N8, la cola sin conexión, el canje y el cobro dentro del producto. La zona se guarda en N2; editarla en N8 queda en `ajustes-y-cuenta`.
- SP-0 y el despliegue a producción.
- `theme-color` por negocio (PQ-N2, abierto). N3 no pide color (RF-ALT-08).

Este feature no cierra la Fase 7. Después siguen, en el orden de `arquitectura.md` §10, el spike de auth del cliente, el registro, la PWA, el mostrador, el modo sin conexión, el resumen, ajustes y cuenta, la medición y la operación previa al piloto. El criterio de salida de la fase sigue siendo el del plan §4.

## Tareas

| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | Cascarón de N1 a N4: rutas, layout con 4 pasos, textos en `src/content/`, «Ayuda por WhatsApp» | — | - `/panel/entrar`, `/panel/alta`, `/panel/negocio`, `/panel/tarjeta` y `/panel/cartel` responden 200 con Supabase local (spec) <br> - La barra muestra el paso y «Ayuda por WhatsApp» abre `wa.me` sin mandar el texto del mensaje a la analítica (spec) <br> - Contraste, foco y objetivos de 44 px en esas pantallas (axe) <br> - `pnpm check:cliente` sin hallazgos |
| T2 | Código por correo: `POST /panel/api/auth/codigo` y `…/verificar`. El servidor crea al usuario con la llave secreta y luego manda el código con `shouldCreateUser: false` | T1 | - En local el código llega a Mailpit, 6 dígitos, y la cookie `lt-dueno` sale `HttpOnly` y `Path=/panel` (spec) <br> - La respuesta es la misma si el correo existe o no (prueba) <br> - Un `auth.users` que ya es cliente no puede volverse dueño (prueba) <br> - El navegador no llama a Supabase (spec) |
| T3 | Contraseña y restablecer: `…/contrasena`, `…/contrasena/crear`, `…/restablecer/codigo` y `…/confirmar`, con `intento_acceso_dueno` | T2 | - 8 a 72 caracteres, sin reglas de composición (prueba) <br> - Tras 5 fallos la contraseña se pausa 15 min y el código sigue funcionando (prueba) <br> - El error no dice si el correo existe (spec) <br> - «Cerrar sesión en mis otros dispositivos» viene desmarcado; solo entonces se cierran las otras sesiones (prueba) |
| T4 | N2 y `servidor.crear_negocio`: nombre, giro, ciudad, logo opcional, zona IANA, slug inmutable y rol `dueno` | T2 | - Sin logo se ven las iniciales; con logo, la imagen sale de `/c/logo/{slug}` y no de `supabase.co` (spec) <br> - La zona sale del navegador, se valida contra las de México y, si no es una de ellas, queda `America/Mexico_City` (prueba) <br> - El dueño no escribe `slug`, `alta_ts`, `tanda`, `plan` ni `estado` (prueba RLS) <br> - Tras crear el negocio el JWT trae `rol = dueno` (prueba) |
| T5 | N3: sellos de 4 a 12, recompensa, sello de bienvenida y vista previa. Emite `tarjeta_configurada` la primera vez | T4 | - La vista previa muestra 1/N y «Tu sello de bienvenida ya está aquí» solo con el interruptor prendido (spec) <br> - No hay selector de color (spec) <br> - Guardar dos veces no duplica `tarjeta_configurada` (prueba) |
| T6 | N4 y `servidor.completar_alta`: cartel en carta, media carta y sticker; PDF y PNG; «Hecho con LealTab»; fecha de fin de prueba | T5 | - `alta_ts`, `fin_prueba` (+30 días), `tanda` y `version_producto` se escriben juntos y el dueño no los cambia (prueba) <br> - `negocio_alta_completada` lleva `oficio`, `tanda`, `version_producto` y `duracion_s`, sin correo ni nombre (prueba) <br> - Descargar el cartel emite `qr_mostrador_descargado` una vez por descarga (prueba) <br> - El QR del cartel solo identifica al negocio para registrarse; no suma sellos (revisión del contenido) |
| T7 | Cierre del feature: pruebas del flujo, RLS de las funciones nuevas y reporte de QA | T1 a T6 | - `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` verdes y la landing sin cambios (QA) <br> - Un alta completo, de N1 a N4, pasa en Chromium con Mailpit (spec) <br> - `docs/fase-7/qa/alta-negocio.md` con veredicto |

## Por definir

- Texto del correo del código y del restablecimiento. La arquitectura ya fija que la plantilla muestra `{{ .Token }}`, 6 dígitos y 10 minutos, sin enlace. Falta la frase que lo acompaña; la propone el copywriter antes de T2. Mientras tanto no se inventa.
- `duracion_s` de `negocio_alta_completada` está marcado como propuesto en `medicion.md`. Se mide como dice esa ficha (panel visible desde N1 hasta N4, sin contar la pestaña en segundo plano) salvo que Aarón lo quite.

## Pendientes para Aarón

1. Aprobar este brief antes de construir.
2. La frase del correo, o aceptar que el copywriter la redacte antes de T2.
3. El botón «Empieza gratis» de la landing sigue yendo a WhatsApp hasta que se pida el cambio de la Fase 5 (PQ-N10).
