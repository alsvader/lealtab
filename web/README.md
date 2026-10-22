# LealTab · web

Landing de LealTab en Next.js 16 (App Router, Turbopack, Tailwind v4, CSS Modules). Migración con paridad de la v1.7 de `brand/05-marketing/03-mockup-landing-v1.7.html`.

## Comandos

```bash
pnpm install
pnpm dev          # desarrollo
pnpm build && pnpm start   # producción
pnpm lint
pnpm typecheck
```

## Entorno del producto

Copia `.env.local.example` a `.env.local` (o corre `pnpm db:env` con Supabase local arriba). `src/lib/env.ts` lee las variables de forma perezosa: `pnpm build` y `pnpm lint` no las exigen. Sin las de Supabase, `/c` y `/panel` muestran «Producto no configurado».

## Entorno local (Supabase con la CLI y la app con Docker)

Requisitos: Docker, Node 22 o superior y pnpm. Supabase local lo levanta la CLI (`supabase start`, proyecto `lealtab`, configuración en `supabase/config.toml`); `compose.yaml` define solo la app (ADR-005).

```bash
pnpm install
pnpm db:up         # solo Supabase (la primera vez baja muchas imágenes)
pnpm db:env        # escribe .env.local con las claves locales (no se versiona)
pnpm dev           # día a día: la app en el anfitrión, en el puerto 3000

pnpm stack:up      # Supabase + .env.local + la app en Docker (imagen de producción)
pnpm stack:down    # baja la app y Supabase (los datos se conservan); solo del proyecto lealtab
```

| Servicio | Puerto local |
|---|---|
| App en Docker | `APP_PORT` (3300 por defecto) |
| App con `pnpm dev` | 3000 |
| API de Supabase (gateway) | 54321 |
| Postgres | 54322 |
| Postgres sombra (`db diff`) | 54320 |
| Studio | 54323 |
| Correo local (Mailpit) | 54324 |

- Si el 3300 está ocupado: `APP_PORT=3400 pnpm stack:up`.
- Si un puerto de Supabase está ocupado (`lsof -iTCP:54321 -sTCP:LISTEN`), cámbialo en `supabase/config.toml` y en `.env.local.example`, y vuelve a correr `pnpm db:env`.
- Salud de la app: `curl http://127.0.0.1:3300/api/salud` responde `{"ok":true}`.
- La app del contenedor llega a Supabase por la red `supabase_network_lealtab` y el contenedor `supabase_kong_lealtab:8000` (Compose anula `SUPABASE_URL` de `.env.local`). Corre sin privilegios y con el sistema de archivos de solo lectura.
- Perfil `dev` (recarga en caliente en Docker, opcional): `docker compose --profile dev up --build app-dev`.
- Nunca corras `docker system prune`, `docker volume rm` ni `down -v` sin revisar antes qué borran: en esta máquina puede haber contenedores de otros proyectos.

Los scripts `db:*` y `test:db` usan la CLI de Supabase; `db:types` y `test:rls` dependen de T4 (esquema) y `check:cliente` de T6. `pnpm test:unit` corre Vitest.

## Pruebas e2e (Playwright)

La suite vive en `e2e/` y corre contra el build de producción en el puerto 3120 (`playwright.config.ts` hace `pnpm build` + `next start`; en local reutiliza un servidor que ya esté en ese puerto, y `E2E_PORT` lo cambia).

```bash
pnpm install
npx playwright install            # una vez por máquina: chromium, firefox y webkit
pnpm test:e2e                     # los 5 proyectos
pnpm test:e2e --project=firefox   # un solo proyecto
pnpm test:e2e -g "menú móvil"     # una prueba por nombre
pnpm exec playwright show-report  # informe HTML de la última corrida
```

Proyectos: `chromium`, `firefox`, `webkit` (escritorio), `Mobile Safari` (iPhone 13, WebKit) y `Mobile Chrome` (Pixel 7, Chromium), con toques (`tap`) en los dos móviles.

Qué cubre:

- Interacciones de la landing con aserciones sobre el DOM (menú móvil y bloqueo de scroll, sección activa, CTA del menú, stepper, editor vivo, filas de clientes, selector de negocio, "Suma una visita", "Mostrar mi código", "Ver su tarjeta" con `spotlight`, aviso que voltea, plan Negocio, aro del cierre, guía por sistema operativo con `?os=` y con el user agent real, `prefers-reduced-motion`, sin JavaScript). Cada prueba falla si hay errores o avisos de consola o respuestas 4xx/5xx.
- Paridad de copy con la v1.7 (`copy-parity.spec.ts`): `innerText`, todo el texto (también el oculto a propósito), `alt`/`aria-label`/`title` y `<title>`.
- Anchos (320 a 1920 y 844×390): sin scroll horizontal y misma altura que la v1.7 (`layout.spec.ts`).
- Accesibilidad con axe (`a11y.spec.ts`): la página y con el menú móvil abierto. Falla solo por violaciones nuevas respecto a la v1.7; lo heredado se anota en el informe.

Las pruebas de paridad leen la v1.7 por `file://` desde `../brand/`, así que corren desde el repositorio completo. No se guardan capturas de referencia.

### Notas por entorno

- **macOS 14 (Sonoma):** `@playwright/test` está fijado en **1.61.1** a propósito. Desde la 1.62 el cliente le manda a WebKit el ajuste `PushAPIEnabled`, que el WebKit congelado para macOS 14 (revisión 2251) no conoce, y `newPage()` se queda colgado sin error. `playwright-core` también está fijado (misma versión) para que `@axe-core/playwright` use los mismos tipos. Con macOS 15+ o Linux se puede subir todo junto (`pnpm add -D -E @playwright/test@latest playwright-core@latest`) y volver a correr la suite.
- **Safari en macOS:** el WebKit de Playwright solo enfoca enlaces con Opción+Tab (igual que Safari con su configuración por defecto); la prueba del enlace "Saltar al contenido" lo contempla.
- **Linux/CI:** `npx playwright install --with-deps` instala también las librerías del sistema. Con `CI=1` no se reutiliza el servidor y se reintenta una vez.
- `test-results/` y `playwright-report/` están en `.gitignore`.
