# QA: cimientos-entorno-esquema

**Veredicto:** APROBADA CON PENDIENTES
**Rama y commit:** `feat/cimientos-entorno-esquema` @ `d144cac`, más T6 y T7 en el árbol de trabajo (sin commit) · **Brief:** `docs/fase-7/features/cimientos-entorno-esquema.md`
**Fecha:** 2026-10-26

El código local de T1 a T7 está verde. **SP-0 no bloquea el cierre local ni el siguiente feature:** es la prueba de migrar al subir a producción, y espera el proyecto de Supabase alojado. T8 (este reporte, el README y los comandos) puede cerrarse en local. Sigue pendiente la sección 8, que escribe el orquestador.

## 1. Gate técnico

| Comprobación | Resultado |
|---|---|
| `pnpm lint` | ✅ sin hallazgos |
| `pnpm typecheck` | ✅ |
| `pnpm test:unit` | ✅ 6 archivos, 48 pruebas (incluidas las de `vercel-build.sh` y `db-push.sh`) |
| `pnpm build` | ✅ lo corre el servidor de `pnpm test:e2e:producto` y otra vez el de `pnpm test:e2e` |
| `pnpm check:cliente` | ✅ `.next/static` no contiene `supabase`, `sb_publishable`, `sb_secret` ni `127.0.0.1:54321` |
| `pnpm test:e2e:producto` (5 proyectos) | ✅ 43 pasaron, 12 omitidas (WebKit y Mobile Safari no envían cookies `Secure` por HTTP), 0 fallaron |
| `pnpm test:e2e` (5 proyectos, landing) | ✅ 340 pasaron, 50 omitidas, 0 fallaron |
| axe en pantallas nuevas | No hay pantallas de producto. La landing sigue en `e2e/a11y.spec.ts` |
| Sin scroll horizontal desde 320 px | Lo cubre la suite de la landing, que pasó |
| Consola limpia | La suite del producto trae fixture `guard` (error de consola y `pageerror`). La de la landing trae la fixture `guard` de `e2e/fixtures.ts` |
| `/` sigue funcionando | ✅ dentro de `pnpm test:e2e` |
| Specs del feature | `e2e-producto/sesion.spec.ts`, `e2e-producto/sin-supabase-en-navegador.spec.ts`, `src/test/migraciones.test.ts` |

No se volvieron a correr en esta pasada `pnpm test:rls`, `pnpm test:db` ni `docker compose`. Quedaron verdes en T3 a T5b (commits hasta `c2a7004`).

## 2. Criterios de aceptación

| Tarea | Criterio | Evidencia | |
|---|---|---|---|
| T1 a T5 | Layouts, entorno, esquema, RLS | En la rama, commits `579a451` a `c2a7004`. La landing volvió a pasar en esta pasada | ✅ |
| T6 | Cookies `HttpOnly`, `Secure`, `SameSite=Lax`, `Path` `/c` y `/panel` | `test:e2e:producto`: `Max-Age=34560000` en `lt-cliente` y `2592000` en `lt-dueno` | ✅ |
| T6 | Dueño y cliente conviven sin pisarse | La misma suite, en Chromium, Firefox y Mobile Chrome. WebKit se omite (ver §5) | ✅ |
| T6 | El navegador no llama a Supabase | `pnpm check:cliente` y `sin-supabase-en-navegador.spec.ts` | ✅ |
| T6 | `admin.ts` con `server-only` y la llave fuera de `.next/static` | Primera línea de `admin.ts`; `check:cliente` | ✅ |
| T6 | `proxy.ts` no corre en `/` | La landing y `/api/salud` no reciben `Set-Cookie` con las dos sesiones abiertas | ✅ |
| T7 | Preview imprime «Vista previa: sin migraciones» y sale 0 | `src/test/migraciones.test.ts` (con `LT_OMITIR_BUILD=1`, fuera de Vercel) | ✅ |
| T7 | Producción sin `SUPABASE_DB_URL_MIGRACIONES` falla | La misma prueba: código distinto de 0 y no llega al push | ✅ |
| T7 | `db-push.sh` se niega a migrar producción fuera de Vercel sin `LT_CONFIRMA_PRODUCCION=1` | La misma prueba, con una URL que contiene `SUPABASE_REF_PRODUCCION` y con un host `supabase.co` | ✅ |
| T7 | SP-0 en el proyecto alojado | No hay proyecto. Es la prueba al subir a producción, no un bloqueo del cierre local ni de `alta-negocio`. Informe en `docs/fase-7/sp-0-migraciones.md` | Pendiente de producción |
| T8 | README y comandos en `AGENTS.md` §5 | `web/README.md` (sesión, e2e del producto, migraciones) y la tabla de comandos de `AGENTS.md` | ✅ |
| T8 | Un desarrollador nuevo levanta todo solo con el README | No se repitió en una máquina vacía. En esta máquina `pnpm db:seed` y las dos suites e2e siguieron los comandos del README | pendiente de una pasada en limpio |

## 3. Checklist de UX y accesibilidad

Este feature no tiene pantallas de producto. `/c` y `/panel` muestran «Producto no configurado» o «LealTab» en texto. No hay formularios, objetivos táctiles ni estados de color. La landing no se modificó en el HTML.

## 4. Fallas encontradas

Ninguna que deje la suite en rojo.

Al probar una cookie de sesión inválida, el servidor escribe en stderr `@supabase/ssr: could not base64url-decode chunked cookie value` y sigue: la página responde 200. Es el caso de la prueba «el proxy la ignora».

## 5. Diferencias aceptadas

- No existe `src/lib/supabase/anon.ts`. El brief lo pedía. T5b (`c2a7004`) le quitó todo privilegio a `anon` (hallazgo H-03) y el navegador no habla con Supabase. El servidor lee con la llave secreta en `admin.ts`.
- Las pruebas de cookies viven en `e2e-producto/`, no en `e2e/cookies.spec.ts`. La suite de la landing tiene que pasar sin variables de Supabase. Los cinco proyectos sí están: chromium, firefox, webkit, Mobile Safari y Mobile Chrome.
- WebKit y Mobile Safari no envían cookies `Secure` por `http://localhost`. Esas pruebas se saltan. El envío en iPhone queda para HTTPS (RNF-PWA-07).
- Sin Supabase, `/c` y `/panel` responden 200 con el texto «Producto no configurado», no 503. Un 503 tumbaría la fixture `guard` de la landing, que falla con 4xx y 5xx. Así está `e2e/producto-sin-configurar.spec.ts`.
- `anon` ya no lee `negocio_publico`. El criterio de T5 decía que sí; T5b lo cerró a propósito.
- Las pruebas del script de Vercel usan `LT_OMITIR_BUILD=1` para no compilar dos veces. En Vercel (`VERCEL=1`) esa variable hace fallar el script. El build real lo cubren `pnpm build` y las dos suites e2e.

## 6. Pendientes para el fundador

1. Crear el proyecto de Supabase alojado y correr SP-0 al subir a producción. No bloquea `alta-negocio`. Hasta entonces el merge a `main` no migra producción.
2. Confirmar por escrito el cierre de H-01 (registro de Auth cerrado, cuentas solo por el servidor). El código ya está en T5b; ADR-003 §2.5 todavía describe el registro abierto.
3. Probar en un iPhone real, con HTTPS, que el navegador envía `lt-cliente` (RNF-PWA-07). No entra en este feature más allá de dejarlo anotado.
4. Aprobar el cierre antes del commit o del PR.

## 7. Archivos y capturas

No hay capturas: no hay UI nueva.

Código nuevo de esta pasada: `web/vercel.json`, `web/scripts/vercel-build.sh`, `web/scripts/db-push.sh`, `web/src/test/migraciones.test.ts`, `docs/fase-7/sp-0-migraciones.md`. T6 ya estaba en el árbol (`web/src/lib/supabase/`, `web/src/proxy.ts`, `web/e2e-producto/`).

Se restauraron a `HEAD` `brand/PLAN.md`, `docs/adr/002-stack.md`, `docs/decisiones.md` y `docs/prd/PRD-lealtab-mvp.md` (PRD v2.6, D-031 presente). Se borró la copia suelta `brand/07-desarrollo/PRD-lealtab-mvp.md`.

`web/scripts/plane-sync.mjs` es la sincronización del flujo de features con Plane (al aprobar el brief y al cambiar el estado de una tarea). No es una tarea de producto de este feature.

## 8. Revisión del diff

Pendiente del orquestador. QA no la llena.
