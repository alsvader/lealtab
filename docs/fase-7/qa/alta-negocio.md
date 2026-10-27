# QA: alta-negocio

**Veredicto:** APROBADA CON PENDIENTES
**Rama y commit:** `feat/alta-negocio` @ `d144cac`, con T1 a T7 en el árbol de trabajo (sin commit) · **Brief:** `docs/fase-7/features/alta-negocio.md`
**Fecha:** 2026-10-26

El alta de N1 a N4 corre en local, con Mailpit, y cierra los 30 días de prueba. El cierre del feature espera la aprobación de Aarón. No hay commit ni PR.

## 1. Gate técnico

| Comprobación | Resultado |
|---|---|
| `pnpm lint` | ✅ sin hallazgos |
| `pnpm typecheck` | ✅ |
| `pnpm test:unit` | ✅ 11 archivos, 62 pruebas |
| `pnpm test:rls` | ✅ 142 pasaron, 7 siguen en `todo` |
| `pnpm check:cliente` | ✅ `.next/static` no contiene `supabase`, `sb_publishable`, `sb_secret` ni `127.0.0.1:54321` |
| `pnpm build` | ✅ lo corre el servidor de `pnpm test:e2e:producto` y otra vez el de `pnpm test:e2e` |
| `pnpm test:e2e:producto` (5 proyectos) | ✅ 146 pasaron, 14 omitidas, 0 fallaron |
| `pnpm test:e2e` (5 proyectos, landing) | ✅ 340 pasaron, 50 omitidas, 0 fallaron |
| axe en pantallas nuevas | ✅ `/panel/alta` en `e2e-producto/alta-cascaron.spec.ts`, dentro de la suite del producto |
| Sin scroll horizontal desde 320 px | La landing lo cubre y pasó. Las pantallas de N1 a N4 no tienen una spec propia a 320 px |
| Consola limpia (fixture `guard`) | ✅ la suite del producto falla con error de consola o `pageerror`. El alta completo pasó con esa fixture |
| `/` (landing) sigue funcionando | ✅ `pnpm test:e2e`. El diff de esta pasada no toca la landing, `brand/`, el PRD, las decisiones ni los ADR |
| Specs del feature | `e2e-producto/alta-cascaron.spec.ts`, `codigo-dueno.spec.ts`, `contrasena-dueno.spec.ts`, `negocio-alta.spec.ts`, `tarjeta.spec.ts`, `cartel.spec.ts`, `alta-completo.spec.ts` |

`alta-completo.spec.ts` pasa en Chromium, Firefox y Mobile Chrome. En WebKit y Mobile Safari se omite: no guardan la cookie `Secure` por `http://localhost`.

## 2. Criterios de aceptación

| Tarea | Criterio | Evidencia | |
|---|---|---|---|
| T1 | Rutas de N1 a N4 en 200, barra de 4 pasos y «Ayuda por WhatsApp» sin `text=` | `alta-cascaron.spec.ts` dentro de `test:e2e:producto` | ✅ |
| T1 | axe en el alta | La misma spec, en `/panel/alta` | ✅ |
| T1 | El navegador no llama a Supabase | `pnpm check:cliente` y la spec de T7, que vigila peticiones a `:54321` y `supabase.co` | ✅ |
| T2 | Código de 6 dígitos en Mailpit y cookie `lt-dueno` `HttpOnly` `Path=/panel` | `codigo-dueno.spec.ts` y el alta completo, que lee el código en Mailpit y entra | ✅ |
| T2 | La respuesta no revela si el correo existe, y un cliente no se vuelve dueño | `codigo-dueno.spec.ts` | ✅ |
| T3 | Contraseña de 8 a 72, pausa de 15 min tras 5 fallos, el código sigue, el error es genérico | `contrasena-dueno.spec.ts` | ✅ |
| T3 | «Cerrar sesión en mis otros dispositivos» empieza desmarcado y solo entonces se llama `signOut({ scope: "others" })` | El código hace eso. GoTrue, además, revoca los otros refresh tokens en cualquier cambio de contraseña. Ver §5 | diferencia |
| T4 | Negocio, slug, zona, iniciales y logo fuera de `supabase.co` | `negocio-alta.spec.ts`. En el alta completo, sin logo, se ven las iniciales y el slug sale del nombre | ✅ |
| T4 | El dueño no escribe `slug`, `alta_ts`, `tanda`, `plan` ni `estado` | `negocio-alta.spec.ts` y el parche rechazado en `cartel.spec.ts` | ✅ |
| T5 | Vista previa 1/N solo con el sello de bienvenida, sin selector de color, un solo `tarjeta_configurada` | `tarjeta.spec.ts` y el alta completo (prende, apaga y vuelve a prender el interruptor) | ✅ |
| T6 | `alta_ts`, `fin_prueba` +30 días, `tanda` y `version_producto` juntos, y el dueño no los cambia | `cartel.spec.ts` y el alta completo | ✅ |
| T6 | `negocio_alta_completada` con oficio, tanda, versión y `duracion_s`, sin correo ni nombre | Las dos specs. En la UI, `duracion_s` queda en 0. Ver §5 | diferencia |
| T6 | Una descarga, un `qr_mostrador_descargado`. El QR abre `/c/{slug}` y no suma sellos | `cartel.spec.ts` (encabezado `X-Qr-Destino`) y el alta completo (PDF `%PDF-` y PNG) | ✅ |
| T7 | `lint`, `typecheck`, `build` y `test:e2e` verdes, landing sin cambios | Esta pasada | ✅ |
| T7 | Un alta de N1 a N4 en Chromium con Mailpit | `e2e-producto/alta-completo.spec.ts` | ✅ |
| T7 | `crear_negocio` y `completar_alta` no las ejecutan anon, dueño ni cliente | `src/test/rls/05-esquemas-servicio.test.ts`: 404 `PGRST202`. `service_role` sí entra y, sin negocio, responde 400 `23514` | ✅ |

## 3. Checklist de UX y accesibilidad

- Objetivos de 44 px: botones y controles con `min-h-11`.
- Campos a 16 px: `text-input` y la regla de `producto.css` sobre `input`.
- Foco: `:focus-visible` usa `--focus-ring`.
- El sello de bienvenida es un `switch` con `aria-checked`. El error del código usa `role="alert"`.
- No hay estados que dependan solo del color en estas pantallas.
- El alta no anima. `prefers-reduced-motion` sigue cubierto en la landing, que no se tocó.
- axe en `/panel/alta` pasó dentro de la suite. No se corrió axe en N2, N3 y N4 en esta pasada.

## 4. Fallas encontradas

Ninguna dejó la suite en rojo.

Al abrir `/panel/cartel`, la fecha de fin de prueba no aparecía: el prerender se tragaba el error de `cookies()` y el HTML estático quedaba sin alta. `CartelDatos` ahora espera `connection()` y ya no captura ese error. El alta completo comprueba la frase «Tu mes de prueba termina el …».

## 5. Diferencias aceptadas

- `duracion_s` en la pantalla de N4 se guarda como 0. La ruta acepta `?duracion_s=` (así lo prueba `cartel.spec.ts`, con 42). El cronómetro de panel visible, de N1 a N4, sigue como lo describe `medicion.md` §4.1 y el brief. Hace falta que Aarón confirme si se mide o se quita.
- El cuerpo del correo sigue siendo solo `{{ .Token }}`. La frase que lo acompaña sigue en «Por definir» del brief.
- GoTrue revoca los otros refresh tokens al cambiar la contraseña, aunque la casilla vaya desmarcada. El texto dice que, si no se marca, el mostrador sigue abierto. En esta versión de Auth no se puede cumplir. La casilla sigue desmarcada al entrar.
- N1 guarda nombre y WhatsApp en `sessionStorage`, y N2 los usa solo si el campo va vacío. Los campos de N2 son obligatorios y empiezan vacíos, así que hay que volver a escribirlos.
- WebKit y Mobile Safari no envían la cookie `Secure` por HTTP. El alta completo se omite ahí. En iPhone queda para HTTPS.

## 6. Pendientes para el fundador

1. Aprobar el cierre antes del commit o del PR.
2. Decidir `duracion_s`: medirlo en el navegador o quitarlo del evento.
3. La frase del correo del código y del restablecimiento, o dejar la plantilla en el token.
4. Si la casilla de «cerrar otros dispositivos» debe prometer algo que GoTrue no permite.
5. Probar el alta en un iPhone con HTTPS (RNF-PWA-07). No bloquea este cierre local.

## 7. Archivos y capturas

No hay capturas. La evidencia es la spec de N1 a N4 y las suites.

Código de esta pasada: `web/e2e-producto/alta-completo.spec.ts`, `web/src/test/rls/05-esquemas-servicio.test.ts`, `web/src/app/(producto)/panel/cartel/page.tsx`, `web/src/lib/negocio/cartel.ts`. El resto de T1 a T6 ya estaba en el árbol.

## 8. Revisión del diff

Pendiente del orquestador. QA no la llena.
