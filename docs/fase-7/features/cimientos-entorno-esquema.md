# Feature: Cimientos, entorno y esquema

**Estado:** Aprobado por Aarón (22 oct 2026)
**Fase:** 7 · **Rama:** `feat/cimientos-entorno-esquema`
**Cubre:** RNF-STK-01 a 04, 11 a 13 y 15; RNF-PRI-02; RF-EVT-05 (la tabla, sin emisor); RF-ALT-11 (`negocio`) · **Pantallas:** ninguna · **Flujos:** ninguno
**Restricciones:** D-018, D-019, D-022, D-023, D-024, D-026, D-031; ADR-002, ADR-003, ADR-004. Pide aprobar antes de construir: ADR-005, ADR-006, ADR-007 y la aclaración a D-023 (ver «Pendientes para Aarón»)

## Objetivo
Dejar `web/` listo para construir el producto sin tocar la landing: entorno local reproducible, esquema de datos con RLS por rol probado, y la base de sesión (clientes de Supabase y cookies). Desbloquea todos los demás features. No hay pantallas ni funciones de negocio todavía.

## Fuentes
- Arquitectura: `docs/fase-7/arquitectura.md` §1 (estructura y layouts), §2 (entorno, Docker, variables, migraciones), §3 (esquema), §4 (RLS y pruebas), §5 (auth y cookies), §10 (orden de features)
- Decisiones: `docs/adr/003-sesion-cliente-y-codigo.md` §2.4 a §2.6; PRD v2.5 §7.6 y §8
- Alcance: veredicto del coordinador (partir «cimientos» en dos y sacar de aquí las tablas de sellos, las funciones de registro/borrado/canje y el spike de QR)
- Copy: no aplica (sin interfaz)
- Eventos: ninguno se emite. Solo se crea la tabla `evento_uso` (`docs/fase-7/medicion.md` §3.1), sin emisor ni políticas

## Alcance
### Dentro
- Mover la landing a un layout raíz `(landing)` sin cambiar ninguna URL, y crear `(producto)` con su propio CSS (Tailwind y tokens), sin tocar `globals.css`.
- `compose.yaml` solo para la app, `Dockerfile` multi-stage, `.dockerignore` y `/api/salud`.
- Supabase local con el CLI (`supabase start`): `web/supabase/config.toml`, migraciones 1, 2, 3, 5, 6, 7 y 8 de `arquitectura.md` §3.1 (sin `evento`, `dispositivo`, `por_revisar`, canje, ni funciones `SECURITY DEFINER` de registro, borrado o canje), `seed.sql` y `scripts/seed-dev.ts`.
- RLS por rol (dueño y cliente) con la exclusión mutua identidad/dueño, vistas `negocio_publico`, `cliente_del_negocio` y `mis_tarjetas`, pruebas pgTAP y pruebas de RLS por la API REST directa.
- Clientes de `@supabase/ssr` en `src/lib/supabase/` (`server`, `anon`, `admin`), cookies `lt-cliente` (`Path=/c`) y `lt-dueno` (`Path=/panel`) con `HttpOnly`, `proxy.ts` con `matcher` solo en `/c` y `/panel`, `src/lib/env.ts` con validación perezosa y `.env.local.example`.
- `vercel.json` y `scripts/vercel-build.sh`: `next build` primero y `supabase db push` después, solo con `VERCEL_ENV=production`.
- `robots.ts` con `disallow` de `/c/`, `/panel/` y `/api/`, y `robots: { index: false }` en el layout del producto.
- Revisión `security-review` de la migración y las políticas.

### Fuera
- Cualquier pantalla (N1 a N8, C0 a C5) → features `alta-negocio` y siguientes.
- Hook de SMS, `/c/api/auth/*` con lógica de código y spikes de `install_token` → feature `spike-auth-cliente`.
- Tablas `evento`, `dispositivo`, `por_revisar` y canje, y las funciones `servidor.registrar_*` → `mostrador-n5`.
- Librería de QR (PQ-25) → brief de `mostrador-n5`.
- Emisión de eventos y `src/lib/eventos.ts` → `alta-negocio`.
- CI en `.github/` → por definir, cuando Aarón lo pida.
- Respaldo semanal, cron diario y alertas → `pre-piloto-operacion`.
- Enlaces de la landing a `app.lealtab.com` → Fase 5 (en pausa).

## Tareas
| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | Aislar la landing: layouts raíz `(landing)` y `(producto)`, `producto.css`, `robots` | — | - Las 5 suites de `pnpm test:e2e` de la landing pasan **sin cambiar ninguna spec** (comando) <br> - `/`, `/aviso-de-privacidad` y `/terminos-y-condiciones` responden igual que antes (spec existente) <br> - Una ruta inexistente responde 404 y la landing sigue sana (spec nueva `e2e/aislamiento.spec.ts`) <br> - `robots.txt` trae el `disallow` de `/c/`, `/panel/` y `/api/` (spec) <br> - `pnpm lint && pnpm typecheck && pnpm build` sin variables de Supabase |
| T2 | Dependencias y entorno: `supabase` (CLI, versión exacta), `@supabase/ssr`, `@supabase/supabase-js`, Vitest; Node ≥ 22 y `@types/node` acorde; `src/lib/env.ts`, `.env.local.example`, scripts de `package.json` (§2.2) | T1 | - `pnpm install --frozen-lockfile` limpio (comando) <br> - `env.ts` no falla al compilar sin variables, y las rutas del producto responden 503 «Producto no configurado» (prueba unitaria) <br> - `.env*` sigue ignorado y no hay secretos en el repo (`git grep` de `sb_secret`, `service_role`) <br> - Ninguna variable lleva prefijo `NEXT_PUBLIC_` (prueba unitaria) |
| T3 | Entorno local: `supabase init` y `config.toml`, `compose.yaml` (servicio `app`), `Dockerfile` multi-stage, `.dockerignore`, `/api/salud`, `pnpm stack:up` | T2 | - `pnpm db:up` levanta Supabase y `pnpm db:status` muestra los servicios sanos (comando) <br> - `docker compose --profile app up --build` levanta la app y `/api/salud` responde 200 (comando) <br> - El contenedor corre sin privilegios, con `read_only` y sin secretos en la imagen (`docker inspect` y `docker history`) <br> - La landing en `/` responde desde el contenedor (spec contra el contenedor) <br> - Antes de cualquier comando destructivo de Docker se aplicó `docker-destructive-guardrails` |
| T4 | Migraciones 1, 2, 3, 5, 6, 7 y 8, `seed.sql` y `scripts/seed-dev.ts`, `pnpm db:types` | T3 | - `pnpm db:reset` termina sin errores desde cero (comando) <br> - `pnpm db:lint` sin errores (comando) <br> - Cada tabla con RLS activo, `REVOKE` y `GRANT` explícitos en su propio archivo (pgTAP estructural, `supabase/tests/`) <br> - `database.types.ts` generado y `pnpm typecheck` verde <br> - `identidad` solo guarda teléfono E.164 y `auth_user_id`; `cliente_negocio` solo nombre y consentimiento (RNF-PRI-01 y 02, revisión de esquema) <br> - Una migración que falla a la mitad no deja cambios a medias (prueba de SP-0, ver T7) |
| T5 | RLS y pruebas: políticas por rol, exclusión mutua con disparador, vistas, pgTAP y `tests/rls/` por REST directa | T4 | - Los casos de la matriz `arquitectura.md` §4.2 y §4.4 (R-01 a R-38, salvo los de las tablas diferidas) pasan con llamadas directas a la API REST, incluidos los que **deben fallar** (`pnpm test:rls`) <br> - Un usuario creado a mano en Supabase, sin fila en `identidad` ni en `dueno_negocio`, no lee nada (spec REST) <br> - Un mismo `auth.users.id` no puede estar en `identidad` y en `dueno_negocio` (pgTAP) <br> - El dueño no lee `identidad`, ni `tarjeta_llave`, ni otro negocio; el cliente no lee otro cliente (spec REST) <br> - `anon` solo lee `negocio_publico` (spec REST) <br> - `pnpm test:db` verde <br> - Reporte de `security-review` sin hallazgos críticos abiertos (documento) |
| T6 | Clientes de Supabase y cookies: `src/lib/supabase/{server,anon,admin}.ts`, `proxy.ts`, cookies `lt-cliente` y `lt-dueno`, `scripts/check-no-supabase-en-cliente.sh`, CSP `connect-src 'self'` | T4 | - Las cookies salen con `HttpOnly`, `Secure`, `SameSite=Lax` y su `Path` (`/c` y `/panel`) en una ruta de prueba protegida por `LT_ENV` (spec `e2e/cookies.spec.ts`, 5 proyectos) <br> - Dueño y cliente pueden convivir en el mismo navegador sin pisarse la sesión (spec) <br> - El navegador nunca llama a Supabase: `pnpm check:cliente` sin hallazgos y Playwright no ve peticiones a `supabase` (spec) <br> - `admin.ts` lleva `server-only` y la llave secreta no aparece en `.next/static` (comando) <br> - `proxy.ts` no corre en `/` ni en la landing (spec) <br> - Consola limpia con la fixture `guard` |
| T7 | Migraciones en el build de Vercel: `vercel.json`, `scripts/vercel-build.sh`, `scripts/db-push.sh` | T4 | - `vercel-build.sh` con `VERCEL_ENV=preview` imprime «Vista previa: sin migraciones» y termina en 0 (prueba del script) <br> - Con `VERCEL_ENV=production` y sin `SUPABASE_DB_URL_MIGRACIONES` falla con código distinto de cero (prueba del script) <br> - `db-push.sh` se niega a correr contra producción fuera de Vercel sin `LT_CONFIRMA_PRODUCCION=1` (prueba del script) <br> - **SP-0 en el proyecto alojado** (depende de Aarón): el *pooler* de sesión por IPv4 sirve para `db push`, no pide `supabase login`, y una migración que falla deja la base sin cambios (informe en `docs/fase-7/` con evidencia) |
| T8 | Cierre: `web/README.md` con comandos y entornos, actualizar `AGENTS.md` §5 si cambian los comandos, reporte de QA | T1 a T7 | - `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` verdes, la landing sin cambios (QA) <br> - Un desarrollador nuevo levanta todo siguiendo solo el README (QA, paso a paso) <br> - `docs/fase-7/qa/cimientos-entorno-esquema.md` con veredicto |

Las tareas T1, T2 y T3 se hacen en orden; T5, T6 y T7 pueden ir en paralelo con `isolation: "worktree"` una vez cerrada T4.

## Por definir
- **PQ-N1 a PQ-N10** (`arquitectura.md` §11.3), solo las que tocan el esquema y se deciden antes de la primera migración:
  - `negocio.slug` (RNF-PWA-03 lo exige y el PRD §8 no lo lista): se agrega como columna única e inmutable.
  - `negocio_publico` pide «color»: se agrega la columna con el color de marca del negocio, nulable, hasta que N2 y N3 lo capturen.
  - Un negocio por dueño: se asume así en el esquema (D-021 y el PRD ya hablan de un negocio por cuenta).
  - Tablas que el PRD §8 no lista (`config_plataforma`, `intento_acceso_dueno`, `cuenta_pendiente_borrado`): entran en la migración, con ADR-006.
  - Las demás (sello de bienvenida frente al límite, motivo `cuenta_pausada`, retención de `envio_codigo`, exportación con más de 1,000 filas, enlaces a `app.lealtab.com`) no afectan este feature y se anotan para sus features.
- **PQ-24 y PQ-29** quedan resueltas: planes gratuitos; la región es un valor de trabajo `us-east-1` `[SUPUESTO]` hasta medir.
- **SP-0** (T7) se prueba en el proyecto alojado, que crea Aarón. Hasta entonces el primer merge a `main` no corre migraciones contra producción.
- **Rol por *custom access token hook* o por `app_metadata`:** se queda `app_metadata` (decisión de Aarón); el hook se prueba en `spike-auth-cliente` (SP-5).

## Pendientes para Aarón
1. **Aprobar este brief** (partido en dos: este feature y `spike-auth-cliente`).
2. **Aclaración a D-023 (CLI en vez de Compose para Supabase local):** `RNF-STK-13` dice «Docker Compose levanta Supabase». La propuesta es `supabase start` (contenedores Docker oficiales, configuración en `config.toml`, la misma del proyecto alojado) más un Compose solo para la app. Si prefieres la lectura literal, el respaldo es el stack de autoalojamiento en Compose, sin tocar migraciones ni código.
3. **Aprobar que se redacten tres ADR antes de construir:** ADR-005 (entorno local y migraciones), ADR-006 (esquema de datos) y ADR-007 (rutas y layouts raíz). El coordinador los redacta y tú los apruebas.
4. **Crear el proyecto de Supabase alojado de pruebas** (y el de producción cuando toque) y entregar las credenciales como variables de entorno. Hace falta solo para SP-0 en T7. Región de trabajo `us-east-1`.
5. **CI en `.github/`:** no existe. **Decisión de Aarón (22 oct 2026): se agrega después**, no en este feature.

**Aprobado el 22 oct 2026:** el brief, la aclaración a D-023 (CLI de Supabase más Compose para la app), la redacción de ADR-005, 006 y 007, y la creación del proyecto alojado por Aarón (necesario solo para SP-0 en T7).
