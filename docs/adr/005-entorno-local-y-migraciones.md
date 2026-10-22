# ADR-005: Entorno local con la CLI de Supabase y migraciones en el build de Vercel

- **Estado:** **Aceptado (22 oct 2026).** Aclara la lectura de D-023 y RNF-STK-13 (Supabase local lo levanta la CLI, no un Compose propio). Aprobado por Aarón el 22 oct 2026, junto con el brief `cimientos-entorno-esquema`.
- **Fecha:** 22 oct 2026
- **Decidió:** Aarón López Sosa (fundador)
- **Autor:** `lealtab-arquitecto`
- **Desarrolla:** [`docs/fase-7/arquitectura.md`](../fase-7/arquitectura.md) §2 (entorno, Dockerfile, variables, migraciones y plan gratuito) y §8 (SP-0).
- **Restricciones vigentes:**
  - D-023 y RNF-STK-13 (aclaración del 22 oct 2026): todo vive en `web/`; Supabase local con `supabase start`; `compose.yaml` solo para la app; respaldo: el stack de autoalojamiento en Compose.
  - D-023 y RNF-STK-14: producción la compila Vercel; el contenedor no se despliega en producción.
  - RNF-STK-15 y ADR-002 §2.1: todo cambio de base es una migración en `web/supabase/migrations`; corre en el build de Vercel; si falla, el build falla; no corre en vistas previas; credenciales solo en variables de Vercel.
  - D-018 y RNF-STK-10: sin herramientas de terceros ni cookies de analítica; las variables no llevan `NEXT_PUBLIC_` (el navegador no habla con Supabase; ADR-003 §2.4).
  - Plan gratuito de Vercel (Hobby) y Supabase durante el piloto (decisión de Aarón del 22 oct 2026, PQ-29; ADR-002 §4).
  - Secretos fuera del repositorio (AGENTS.md §4).

## 1. Contexto

D-023 y RNF-STK-13 decían, en su primera versión, que «Docker Compose levanta Supabase con sus contenedores». Al bajar el stack a archivos aparecieron dos problemas:

- **Fidelidad.** El trabajo de Fase 7 que más depende de Supabase (hook de SMS, límites de Auth, vigencia del código, SMTP, plantillas) se configura en `config.toml`. Ese archivo es el mismo con el que se configura el proyecto alojado. El stack de autoalojamiento de Supabase (Envoy, Supavisor, Studio, Auth, PostgREST, Realtime, Storage y demás servicios en un `docker-compose.yml`) pone esa configuración en variables de `.env` del contenedor de Auth. Así, lo que se prueba en local no es lo que corre en el proyecto alojado.
- **Migraciones.** Las migraciones corren en el build de Vercel (RNF-STK-15). El flujo debe funcionar con la misma herramienta en local (`db reset`, `db lint`, `db types`) y en producción (`db push`).

Además, el build de Vercel no puede depender de un Docker propio, y las migraciones deben poder llegar a Supabase desde Vercel, que tiene IPv4 pero no siempre IPv6.

Fuentes verificadas el 22 oct 2026: [configuración del CLI](https://supabase.com/docs/guides/local-development/cli/config), [guía de autoalojamiento con Docker](https://supabase.com/docs/guides/self-hosting/docker) (sin fecha, con etiquetas de abril de 2026), [conectar a Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres), [planes de Supabase](https://supabase.com/pricing), [planes de Vercel](https://vercel.com/pricing) y [cron de Vercel](https://vercel.com/docs/cron-jobs/usage-and-pricing).

### Opciones consideradas

| | A. CLI de Supabase para la base local y Compose para la app (**elegida**) | B. Stack de autoalojamiento en Compose (respaldo) |
|---|---|---|
| Qué es | `supabase start` levanta los contenedores oficiales de Supabase; `compose.yaml` define solo el servicio `app` y se une a la red del CLI | `docker-compose.yml` del repositorio de Supabase, con todos sus servicios y claves generadas |
| Fidelidad con el proyecto alojado | Alta: la configuración es `config.toml`, el mismo archivo del proyecto | Baja: la configuración va en variables del contenedor de Auth |
| Mantenimiento | El CLI baja las imágenes de su versión fijada | Claves, JWT y secretos con scripts propios; versión fijada a mano |
| Migraciones | `supabase db reset` y `supabase db push` | `supabase db push --db-url` |
| Lectura de D-023 | Los contenedores de Supabase no están definidos en `compose.yaml`; los crea el CLI | Lectura literal |

## 2. Decisión

### 2.1 Supabase local con la CLI y la app con Compose

- El stack de Supabase lo levanta `supabase start` (contenedores Docker oficiales). La configuración vive en `web/supabase/config.toml`. La versión de la CLI se fija exacta (2.121.0 en el momento de este ADR) como `devDependency` (`supabase` no tiene `postinstall`, así que pnpm 10 no necesita `onlyBuiltDependencies`).
- `web/compose.yaml` define **solo** el servicio `app`, con dos perfiles:
  - `app`: imagen de producción (la que usa el e2e y la que verifica el Dockerfile);
  - `dev`: destino `dev` con recarga en caliente. El día a día corre con `pnpm dev` en el anfitrión, porque la guía de Next recomienda no desarrollar en Docker en Mac y Windows por rendimiento.
- La red del CLI se declara `external`, con el nombre esperado `supabase_network_lealtab` (`project_id = "lealtab"`). El servicio `app` llega a Supabase por el contenedor del gateway (`supabase_kong_lealtab:8000`). **Ambos nombres son `[SUPUESTO]`** (ver Por definir).
- Higiene del servicio `app`: `read_only: true` con `tmpfs`, usuario sin privilegios, sin `privileged`, sin `network_mode: host`, `healthcheck` contra `/api/salud` y `restart: unless-stopped` solo en el perfil `app`. Los secretos entran por `env_file` (`.env.local`), nunca por `build.args`.
- Antes de cualquier comando destructivo de Docker (`down -v`, `system prune`, `supabase stop --no-backup`) se aplica `docker-destructive-guardrails`.

**Respaldo (opción B):** si Aarón pide la lectura literal de RNF-STK-13, se pasa a B sin tocar migraciones ni código. Cambian solo `compose.yaml` y el origen de las variables.

### 2.2 Puertos y comandos

| Servicio | Puerto local | Notas |
|---|---|---|
| App Next.js (`pnpm dev` o contenedor) | 3000 | El e2e del producto usa `E2E_PORT` (3120) |
| API de Supabase (gateway) | 54321 | `SUPABASE_URL` |
| Postgres | 54322 | `SUPABASE_DB_URL`; solo migraciones y pruebas |
| Postgres sombra (`db diff`) | 54320 | |
| Studio | 54323 | |
| Correo local (Mailpit, `[local_smtp]`) | 54324 | Los códigos del dueño llegan aquí |

Scripts de `web/package.json` (nombres propuestos):

| Script | Hace |
|---|---|
| `pnpm db:up` / `db:down` / `db:status` | `supabase start` / `stop` / `status` |
| `pnpm db:reset` | `supabase db reset`; aplica migraciones y `seed.sql`. **Solo local** |
| `pnpm db:new <tema>` | `supabase migration new` (marca de tiempo UTC) |
| `pnpm db:lint` | `supabase db lint --level warning --fail-on error` |
| `pnpm db:types` | Genera `src/lib/supabase/database.types.ts` (se versiona) |
| `pnpm db:env` | Escribe `.env.local` desde `supabase status -o env` |
| `pnpm db:seed` | `scripts/seed-dev.ts` (datos de prueba por la API de administración) |
| `pnpm db:push` | `scripts/db-push.sh`; se niega a correr contra producción fuera de Vercel |
| `pnpm stack:up` / `stack:down` | `supabase start` y `docker compose --profile app up --build -d`, y su inverso |
| `pnpm test:db` | `supabase test db` (pgTAP) |
| `pnpm test:e2e` | Playwright de la landing, sin cambios |
| `pnpm check:cliente` | Busca rastros de Supabase en el JS del navegador (ADR-007) |

### 2.3 Dockerfile multi-stage (`web/Dockerfile`)

| Etapa | Contenido |
|---|---|
| `base` | `node:24-slim` (`@supabase/supabase-js` pide Node 22 o superior) y `corepack` con `pnpm@10.28.2`, el de `packageManager` |
| `deps` | `pnpm install --frozen-lockfile` solo con `package.json` y `pnpm-lock.yaml` (capa cacheable) |
| `dev` | Desde `deps`; `pnpm dev -H 0.0.0.0`; el código entra por *bind mount* |
| `build` | Código completo; `NEXT_OUTPUT=standalone pnpm build`. No necesita base de datos: ninguna ruta lee Supabase al compilar |
| `runner` | Usuario sin privilegios, solo `.next/standalone`, `.next/static` y `public/`; `EXPOSE 3000`; `HEALTHCHECK`; `CMD ["node","server.js"]` |

`next.config.ts` activa `output: "standalone"` solo con `NEXT_OUTPUT=standalone`, para que Vercel no vea cambios. La imagen no lleva secretos ni `.env*` (`.dockerignore`). **En producción el contenedor no se despliega** (RNF-STK-14).

### 2.4 Variables de entorno

Reglas: **ninguna variable lleva `NEXT_PUBLIC_`**. El navegador nunca habla con Supabase (ADR-003 §2.4). Se leen con `src/lib/env.ts` de forma perezosa y con validación. `.env.local.example` se versiona con valores vacíos o ficticios. Las claves son las nuevas de Supabase (`sb_publishable_…` y `sb_secret_…`), porque `anon` y `service_role` se retiran a fines de 2026 ([API keys](https://supabase.com/docs/guides/api/api-keys), consultado el 22 oct 2026).

| Variable | Local | Vista previa | Producción |
|---|---|---|---|
| `SUPABASE_URL` | `http://127.0.0.1:54321` (en contenedor, el gateway) | Proyecto de pruebas | Proyecto de producción |
| `SUPABASE_PUBLISHABLE_KEY` | `db:env` | Pruebas | Producción |
| `SUPABASE_SECRET_KEY` | `db:env` | Pruebas | Producción. Solo `admin.ts` (`server-only`) |
| `SUPABASE_DB_URL` | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | — | — |
| `SUPABASE_DB_URL_MIGRACIONES` | — | **No existe** | **Solo en el entorno Production de Vercel**; pooler de sesión (ver 2.5) |
| `SEND_SMS_HOOK_SECRET` | Generado | Generado | Generado (`v1,whsec_…`) |
| `SMS_PROVIDER_MODE` | `stub` | `sandbox` | `live` |
| `SMSMASIVOS_API_KEY` | Vacía | Llave de prueba (`sandbox: 1`) | Llave real (ADR-004) |
| `RESEND_API_KEY` | Vacía (Mailpit) | Prueba | Producción |
| `ALERT_EMAIL_TO` | Correo de desarrollo | Correo de desarrollo | Correo de Aarón |
| `IP_HASH_PEPPER` | Aleatoria | Aleatoria | Aleatoria |
| `CRON_SECRET` | Aleatoria | Aleatoria | Aleatoria |
| `LT_ENV` | `local` | `preview` | `production` |
| `LT_COOKIE_SECURE` | `1` con HTTPS local; `0` solo en HTTP de Chrome | `1` | `1` |

Sin las variables de Supabase, las rutas del producto responden **503 «Producto no configurado»** y la landing sigue sana. `SMS_PROVIDER_MODE=stub` se niega a arrancar si `LT_ENV` no es `local`.

Para iPhone, `LT_COOKIE_SECURE=1` obliga a HTTPS en local: WebKit no acepta cookies `Secure` por HTTP. Se usa `next dev --experimental-https` o un túnel HTTPS.

### 2.5 Migraciones: local, build de Vercel y vistas previas

**Local.** `pnpm db:reset` reaplica todo desde cero y debe terminar sin errores antes de cada commit con migraciones. Luego `pnpm db:types`.

**Build de Vercel.** `vercel.json` fija `"buildCommand": "sh scripts/vercel-build.sh"`. Se decide con `VERCEL_ENV` porque el *Ignored Build Step* no sirve para esto ([guía de Vercel](https://vercel.com/kb/guide/dynamic-build-commands)). El script corre con `set -euo pipefail`:

1. `pnpm exec next build`. **Se compila antes de migrar**: un error de compilación no deja la base adelantada.
2. Si `VERCEL_ENV` es `production`: exige `SUPABASE_DB_URL_MIGRACIONES`, corre `supabase db push --dry-run --db-url …` (queda en el log) y luego `supabase db push --yes --db-url …`. Cualquier fallo sale con código distinto de cero y **Vercel no promueve el despliegue**.
3. En cualquier otro entorno imprime «Vista previa: sin migraciones» y termina con código 0.

**Pooler de sesión por IPv4.** La conexión directa (`db.<ref>.supabase.co:5432`) es solo IPv6 en el plan gratuito. El *pooler* compartido en modo sesión (`aws-<n>-<region>.pooler.supabase.com:5432`, usuario `postgres.<ref>`) es IPv4 en todos los planes ([conectar a Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres), 22 oct 2026). Por eso las migraciones usan el pooler de sesión. **Que esto funcione desde Vercel es `[SUPUESTO]`** (SP-0).

**Tres candados contra migrar desde una vista previa:**

- El script revisa `VERCEL_ENV`.
- `SUPABASE_DB_URL_MIGRACIONES` solo existe en el entorno Production de Vercel, así que una vista previa ni la ve.
- `scripts/db-push.sh` (uso manual) se niega a correr si la URL contiene la referencia del proyecto de producción sin `LT_CONFIRMA_PRODUCCION=1`.

**Vistas previas.** Usan un proyecto Supabase de pruebas (`lealtab-pruebas`, el segundo proyecto activo del plan gratuito). Su esquema se actualiza a mano con `pnpm db:push:pruebas` antes de probar un PR con migraciones. Sin ese proyecto, la vista previa muestra «Producto no configurado» y solo se prueba la landing. Las vistas previas de Vercel tienen protección de despliegue, así que no son destino del hook de SMS.

**Regla de compatibilidad (*expand/contract*).** Una migración nunca rompe al código anterior: primero se agrega, luego se despliega, y solo en una migración posterior se quita o renombra algo. El motivo es doble: un *rollback* de Vercel deja el código viejo contra el esquema nuevo, y hay un tiempo entre `db push` y la promoción del despliegue.

**Convenciones de migración** (detalle en ADR-006): una migración por tema, nombre `AAAAMMDDHHMMSS_<tema>.sql` en UTC, nunca editada después de entrar a `main`; sin `CREATE INDEX CONCURRENTLY` mientras SP-0 no confirme la atomicidad por archivo.

**Dos *builds* de producción a la vez** podrían empujar migraciones al mismo tiempo. `[SUPUESTO: riesgo bajo con un solo desarrollador]`.

### 2.6 Plan gratuito durante el piloto

Decisión de Aarón del 22 oct 2026 (PQ-29): durante el piloto, Vercel y Supabase usan planes gratuitos. Lo que cambia en la arquitectura:

| Tema | Plan gratuito | Qué hace la arquitectura |
|---|---|---|
| Respaldos | Ninguno ni recuperación a un punto en el tiempo | `pnpm db:backup` (`supabase db dump` con la URL de migraciones) **semanal**, cifrado con `age` o `gpg`, fuera del repositorio, y una restauración de prueba en local antes del piloto. Entra al aviso (PQ-18). La exportación CSV del dueño es el otro respaldo (R-19) |
| Pausa tras una semana sin actividad | Sí | Un cron diario hace una consulta trivial. `[SUPUESTO: que esa consulta cuente como actividad]`; se confirma observando el panel un fin de semana |
| Sesiones de Auth | Sin plazo máximo ni de inactividad | Limitación del piloto aprobada (ADR-003 §2.4) |
| Límites de Auth | Los valores por defecto no alcanzan | Se suben en el panel y se confirman en SP-4 (ADR-003 §3) |
| Hooks y SMTP propio | Incluidos | Sin cambio |
| Espacio y Storage | 500 MB de base, 1 GB de Storage | Suficiente `[SUPUESTO]`; se mide al cierre de la Fase 8 |
| Cron de Vercel | Un cron por día, con precisión de ±59 min | Un solo cron, `/api/cron/diario`. Las alertas que no pueden esperar un día las dispara el hook |
| Funciones de Vercel | Una región (`iad1`), 300 s máximo | `regions: ["iad1"]` explícito |
| Vercel Hobby | Solo uso no comercial | Riesgo aceptado (R-19). Disparadores para reevaluar el plan de pago: el primer cobro real, base de 400 MB o más, una pausa con un negocio activo, p95 mayor de 800 ms tres días seguidos o una pérdida de datos |

El costo de subir al plan de pago (unos USD 45 al mes entre Vercel Pro y Supabase Pro, [Vercel](https://vercel.com/pricing) y [Supabase](https://supabase.com/pricing), consultados el 21 y 22 oct 2026) no entra en el piloto. La fecha de reevaluación sigue **Por definir** (PQ-29).

## 3. Por definir

**Pruebas de SP-0 (`cimientos-entorno-esquema`, tarea T7).** Se prueban en el proyecto alojado de pruebas, que crea Aarón. Hasta cerrarlas, el primer merge a `main` no corre migraciones contra producción.

- **SP-0.1 · IPv6 y pooler desde Vercel.** Que el build de Vercel llegue al *pooler* de sesión por IPv4 y que `supabase db push --db-url` funcione desde ahí. Si no, la alternativa es correr `db push` desde GitHub Actions (no existe CI hoy; ver Consecuencias).
- **SP-0.2 · `supabase login`.** Que `db push --db-url` no pida `supabase login` en el build de Vercel.
- **SP-0.3 · Atomicidad de `db push`.** La documentación no dice si cada archivo corre en una transacción. Una migración que falla a la mitad (un `create table` y luego un error) debe dejar la base sin cambios y hacer fallar el build. Si no, la regla es una sentencia por archivo y respaldo antes de empujar.
- **SP-0.4 · Nombres de red y contenedor del CLI.** Que `supabase_network_lealtab` y `supabase_kong_lealtab` sean los nombres reales tras `supabase start` (`docker network ls`). `[SUPUESTO]`.
**Otros `[SUPUESTO]` de este ADR:**

- `host.docker.internal` desde los contenedores del CLI (y `--add-host` en Linux) para que el hook llegue a la app local. Lo cierra `spike-auth-cliente` (0b).
- Encabezado `Authorization: Bearer` de `CRON_SECRET` que manda Vercel. Verificar al configurar el cron.
- Versión de Postgres: `major_version = 17` en `config.toml` debe coincidir con el proyecto alojado (`show server_version;`). Registrar el resultado en `docs/fase-7/checklist-proyecto-supabase.md`.
- Región de trabajo `us-east-1` para Supabase y Vercel `iad1`, valores de trabajo hasta medir (PQ-18 y ADR-002 §3).
- Cambiar el proyecto alojado (esquemas expuestos, límites, SMTP, hook, plantillas, vigencia del código) se hace con una lista de verificación manual o con `supabase config push`. La documentación no dice qué secciones aplica `config push`. `[SUPUESTO]`.

## 4. Consecuencias

- **Lectura de D-023 y RNF-STK-13.** Los contenedores de Supabase los crea la CLI, no `compose.yaml`. La aclaración de D-023 la registró Aarón el 22 oct 2026 y el respaldo (opción B) cuesta cambiar `compose.yaml` y el origen de las variables, sin tocar migraciones ni código.
- **Local y producción usan la misma configuración.** Lo que se prueba del hook, los límites y el OTP en local es `config.toml`, el mismo archivo del proyecto alojado. La diferencia restante es el hook: en local usa el proveedor `stub`.
- **Producción depende de Vercel para migrar.** Un fallo de la migración hace fallar el build y no se promueve el despliegue. El costo es que el build necesita la URL de migraciones en el entorno Production y que SP-0 esté cerrado.
- **Una migración sin prueba de SP-0 no llega a producción.** Hasta que SP-0 pase, las migraciones solo corren en local y en el proyecto de pruebas.
- **Sin CI en el MVP.** Se decidió (22 oct 2026) que el CI de `.github/` se agrega después. Si SP-0 falla, la alternativa es GitHub Actions con `db push`, lo que pide una decisión nueva.
- **Vistas previas sin datos reales.** Las vistas previas usan el proyecto de pruebas y no el de producción. Si el proyecto de pruebas no existe, la vista previa solo muestra la landing y el aviso «Producto no configurado».
- **Costo y riesgos del plan gratuito.** Sin respaldos automáticos, con pausa a la semana y con Vercel Hobby. Riesgo aceptado (R-19 y PQ-29), con respaldo semanal cifrado y disparadores para reevaluar.
- **Entorno de desarrollo.** El día a día corre en el anfitrión con `pnpm dev` y Docker solo para la app de prueba (`pnpm stack:up`), lo que deja a Mac y Windows con buen rendimiento.

## Fuentes (consultadas el 21 y 22 oct 2026)

- https://supabase.com/docs/guides/local-development/cli/config
- https://github.com/supabase/cli/blob/main/apps/cli-go/pkg/config/templates/config.toml (plantilla 2.121.0)
- https://supabase.com/docs/guides/self-hosting/docker
- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://supabase.com/docs/guides/api/api-keys
- https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
- https://supabase.com/pricing
- https://vercel.com/kb/guide/dynamic-build-commands
- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://vercel.com/pricing
