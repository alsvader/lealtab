# SP-0 · Migraciones en el build de Vercel

**Feature:** `cimientos-entorno-esquema` (T7) · **Fecha:** 2026-10-26
**Estado:** pendiente de producción. No bloquea el cierre local de `cimientos-entorno-esquema` ni el feature `alta-negocio`. No hay proyecto de Supabase alojado ni proyecto de Vercel de pruebas, así que estas pruebas no se corrieron.

El brief y el ADR-005 dejan SP-0 en manos de Aarón: él crea el proyecto alojado y entrega la URL del pooler de sesión (`SUPABASE_DB_URL_MIGRACIONES`, puerto 5432, IPv4). Hasta que esto pase, el primer merge a `main` no migra producción. En local el candado ya está: `scripts/vercel-build.sh` solo llama a `supabase db push` con `VERCEL_ENV=production` y con esa URL; `scripts/db-push.sh` se niega a migrar producción fuera de Vercel sin `LT_CONFIRMA_PRODUCCION=1`.

## Qué hay que probar cuando exista el proyecto

| Id | Pregunta | Cómo | Resultado |
|---|---|---|---|
| SP-0.1 | ¿El build de Vercel llega al pooler de sesión por IPv4? | `scripts/vercel-build.sh` con `VERCEL_ENV=production` y `SUPABASE_DB_URL_MIGRACIONES` del proyecto de pruebas, más una migración válida | Sin evidencia |
| SP-0.2 | ¿`supabase db push --db-url` pide `supabase login`? | El mismo build, sin token de la CLI | Sin evidencia |
| SP-0.3 | ¿Una migración que falla a la mitad deja la base sin cambios? | Un archivo con un `create table` seguido de un error, en el proyecto de pruebas | Sin evidencia |
| SP-0.4 | ¿Los nombres de red `supabase_network_lealtab` y `supabase_kong_lealtab` coinciden tras `supabase start`? | `docker network ls` en local | Sin evidencia en esta corrida |

Si SP-0.1 o SP-0.2 fallan, la alternativa del ADR-005 es correr `db push` desde GitHub Actions. Eso pide una decisión nueva: el CI quedó fuera de este feature.
