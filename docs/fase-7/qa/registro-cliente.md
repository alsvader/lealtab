# QA: registro-cliente

**Veredicto:** APROBADA CON PENDIENTES
**Rama:** `feat/registro-cliente`. T1 `15f3a2f`, T2 `de82ea2`, T3 `8cf10f1`, T4 `c7f0f8e`, T5 `b9e9ecd`. **Brief:** `docs/fase-7/features/registro-cliente.md`
**Fecha:** 2026-10-27

El cliente se registra en local con el código de prueba, agrega un segundo negocio sin otro código y ve su tarjeta con un QR que cambia cada 60 s. La entrega real del código sigue en `spike-auth-cliente/T7`. El cierre espera la aprobación de Aarón.

## 1. Gate técnico

| Comprobación | Resultado |
|---|---|
| `pnpm lint` | ✅ sale en 0. Un aviso previo en `e2e-producto/alta-adversarial.spec.ts` (`codB`), fuera de este feature |
| `pnpm typecheck` | ✅ |
| `pnpm check:cliente` | ✅ `.next/static` no contiene `supabase`, `sb_publishable`, `sb_secret` ni `127.0.0.1:54321` |
| Prueba de `registrar_cliente` | ✅ `src/test/rls/07-registrar-cliente.test.ts` |
| `anon` y `authenticated` no ejecutan `registrar_cliente` | ✅ el caso «solo las ejecuta service_role» de `05-esquemas-servicio.test.ts` |
| HMAC del paso | ✅ `src/lib/qr/paso.test.ts` (2) y el teléfono de `alta.test.ts` (3) |
| Specs del feature en Chromium | ✅ 8 pasaron, 0 fallaron. El servidor de Playwright compiló y sirvió el árbol actual |
| `pnpm test:e2e:producto` en los otros 4 navegadores | No se corrió en esta pasada. El brief de T6 pide Chromium |
| `pnpm test:e2e` de la landing | No se corrió. Este árbol no toca `/`, `brand/`, el PRD, las decisiones ni los ADR |
| axe en las pantallas nuevas | No hay spec de axe en C0, C1, C3, C4 ni `/c/recuperar` |
| Sin scroll horizontal desde 320 px | No hay medición de este feature |
| Consola limpia | ✅ las specs usan la fixture `guard` |

Specs: `e2e-producto/registro-paso1.spec.ts`, `registro-paso2.spec.ts`, `registro-segundo.spec.ts`, `registro-tarjeta.spec.ts`. También `codigo-cliente.spec.ts`, porque `verificar` sigue dejando la cookie si no llega un negocio.

## 2. Criterios de aceptación

| Tarea | Criterio | Evidencia | |
|---|---|---|---|
| T1 | Identidad, ficha, tarjeta y llave. Bienvenida en 1 o en 0. La segunda llamada no suma. Un dueño no entra. Solo `service_role` | `07-registrar-cliente.test.ts` y el caso de `05-esquemas-servicio.test.ts` | ✅ |
| T2 | Nombre, WhatsApp, casilla y «Enviarme el código». Sin casilla no hay envío. La pantalla siguiente es la misma si el teléfono ya existía | `registro-paso1.spec.ts` | ✅ |
| T3 | El código `847291` deja `lt-cliente` HttpOnly en `/c`, crea la tarjeta con «Hecho con LealTab» y el navegador no llama a Supabase | `registro-paso2.spec.ts` | ✅ |
| T4 | Con sesión, el segundo negocio no pide código y no pisa el nombre del primero | `registro-segundo.spec.ts`: Ana López se queda en Casa Alfa; Casa Beta guarda Luis Vega | ✅ |
| T4 | Sin sesión, recuperar pide el teléfono y devuelve las tarjetas | La misma spec, en un contexto nuevo, con «Listo, aquí están tus tarjetas.» | ✅ |
| T5 | C0 lista las tarjetas o el vacío | `registro-tarjeta.spec.ts`: sin sesión, el enlace a recuperar; con sesión, Casa Alfa; al borrar el negocio, «Aún no tienes tarjetas» | ✅ |
| T5 | C3 muestra los sellos y un QR que cambia a los 60 s, sin otra petición | La misma spec: `1/8`, y `data-qr` distinto tras adelantar el reloj 60 s. El conteo de peticiones a Supabase no sube | ✅ |
| T5 | Con la meta llena se ve C4 | La misma spec, con los sellos en 8: «¡Tu corte gratis está listo!» y «Recompensa lista» | ✅ |
| T6 | `lint`, `typecheck` y las specs de Chromium | Esta pasada | ✅ |

## 3. Checklist de UX y accesibilidad

- Botones y la casilla usan al menos 44 px (`min-h-11` o `min-h-12`).
- Los campos heredan 16 px de `producto.css` (`--font-size-input`). El WhatsApp usa `inputmode="tel"` y el código `inputmode="numeric"` con `autocomplete="one-time-code"`.
- El foco visible es `--focus-ring`.
- Los errores van en `role="alert"`. El envío y la verificación anuncian en `aria-live="polite"`. El QR no anuncia cada segundo.
- C4 dice «Recompensa lista» además del aro. No queda solo en el color.
- No se midió `prefers-reduced-motion` en estas pantallas. No hay animación nueva.
- No se corrió axe.

## 4. Fallas encontradas

Ninguna dejó estas corridas en rojo.

## 5. Diferencias aceptadas

- La frase de que el WhatsApp se manda al proveedor sigue en PQ-18. No se muestra. El enlace abre el aviso de la landing.
- El sello de bienvenida queda en `tarjeta_cliente.sellos`. La fila del evento, con origen `bienvenida`, espera a la tabla `evento` del mostrador.
- «1 sello cada X horas» con X fraccionario sigue por definir. La línea solo sale con horas enteras, o «1 sello por día». «Sin límite» no lleva línea.
- La hoja «Términos de la tarjeta» dice el límite y que los sellos y la recompensa no caducan. No hay un texto legal más largo: `microcopy.md` lo dejó para otra versión.
- C2, el manifest de la PWA y el `install_token` no entran. Son `pwa-instalacion`.
- Quien ya tiene la tarjeta y abre `/c/{slug}/registro` ve «Ya tienes tu tarjeta de {negocio}.» La tarjeta con el QR está en `/c/{slug}`.
- Recuperar cierra las otras sesiones. La sesión nueva sigue viendo las tarjetas. No se probó en un segundo teléfono.
- El código es el de prueba local (`847291`). No se llama a SMS Masivos.

## 6. Pendientes para el fundador

1. Aprobar el push de `feat/registro-cliente`.
2. PQ-18: la frase del proveedor y si el aviso de la landing alcanza para el cliente.
3. Cuando exista el proyecto de pruebas, retomar `spike-auth-cliente/T7`.
4. El texto de «1 sello cada X horas» cuando X no es una hora entera.
5. Probar el registro y el QR en un iPhone con HTTPS. Aquí solo corrió Chromium.

## 7. Archivos

Specs: `web/e2e-producto/registro-paso1.spec.ts`, `registro-paso2.spec.ts`, `registro-segundo.spec.ts`, `registro-tarjeta.spec.ts`.

No hay capturas de esta pasada. La evidencia es la salida de las specs.

## 8. Revisión del diff

No se lanzó bugbot ni la revisión de seguridad en esta pasada.
