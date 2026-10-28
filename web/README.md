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

Los scripts `db:*` y `test:db` usan la CLI de Supabase. `pnpm test:unit` corre Vitest (no incluye `src/test/rls`).

### Pruebas de RLS por la API REST (`pnpm test:rls`)

Comprueban desde fuera, con `fetch` crudo a `SUPABASE_URL/rest/v1/...` y JWT reales (sin cliente de Supabase), que `anon`, el cliente, el dueño, un usuario sin filas y `service_role` ven y escriben solo lo que la matriz de `docs/fase-7/arquitectura.md` §4.2 permite (casos R-xx de §4.4; los de tablas o funciones que aún no existen quedan como `it.todo` con su ID).

```bash
pnpm db:up         # Supabase local arriba, con las migraciones aplicadas (pnpm db:reset si hace falta)
pnpm db:env        # .env.local con SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY y SUPABASE_SECRET_KEY locales
pnpm test:rls
```

- **Solo contra el Supabase local, nunca contra producción.** La prueba se niega a correr si `LT_ENV` no es `local` o si `SUPABASE_URL` no apunta a `127.0.0.1` o `localhost`. Lee `.env.local`; una variable ya exportada en la terminal manda sobre el archivo.
- Usa la llave secreta solo para preparar y limpiar: crea con la API de administración de Auth unos 15 usuarios ficticios (correos `rls-*@rls.lealtab.test`, teléfonos `+52993999xxxxx`, contraseña aleatoria por corrida) y negocios con slug `rls-*` con sus clientes y tarjetas, y obtiene el JWT de cada uno por inicio de sesión con contraseña. Los clientes llevan también un correo ficticio porque el inicio de sesión por teléfono sigue apagado en local hasta el feature de registro.
- Al terminar (y al empezar, por si una corrida anterior se cortó) borra todo lo que lleve esos prefijos. No toca el resto de los datos locales (los de `pnpm db:seed` quedan intactos).
- Configuración en `vitest.rls.config.ts` (los archivos corren en serie y comparten los fixtures de `src/test/rls/global-setup.ts`).
- `pnpm test:db` corre las pruebas pgTAP de `supabase/tests/` dentro de la base.

## Migraciones en Vercel y push manual

`vercel.json` usa `sh scripts/vercel-build.sh` (ADR-005). El script compila con `next build` y solo después, si `VERCEL_ENV=production` y existe `SUPABASE_DB_URL_MIGRACIONES`, corre `supabase db push` contra esa URL (pooler de sesión, puerto 5432). Sin la URL no migra y el build sigue: se publica la landing. En cualquier otro entorno imprime «Vista previa: sin migraciones» y no toca la base. El directorio raíz del proyecto en Vercel es `web/`.

```bash
pnpm db:push           # SUPABASE_DB_URL_MIGRACIONES; se niega si la URL es de producción
pnpm db:push:pruebas   # SUPABASE_DB_URL_PRUEBAS (proyecto lealtab-pruebas)
```

Producción, fuera de Vercel, pide `LT_CONFIRMA_PRODUCCION=1` en esa corrida. No dejes esa variable en `.env.local`. Hasta cerrar SP-0 (proyecto alojado) el primer merge a `main` no migra producción. El informe está en `docs/fase-7/sp-0-migraciones.md`.

## Plane

El flujo de un feature crea las tareas en Plane al aprobar el brief y actualiza el estado cada vez que cambia. Desde este directorio, con `PLANE_API_KEY` en `.env.local`:

```bash
pnpm plane:sync crear ../docs/fase-N/features/<slug>.md
pnpm plane:sync estado ../docs/fase-N/features/<slug>.md T1 "In Progress"
```

Los estados son `Todo` (al crear), `In Progress`, `In QA`, `Blocked`, `Done` y `Cancelled`. El detalle está en el skill `/feature`.

## Sesión del producto y guardas de aislamiento

- **Dos cookies de sesión**, escritas solo por el servidor: `lt-cliente` (`Path=/c`, 400 días) y `lt-dueno` (`Path=/panel`, 30 días), ambas `HttpOnly`, `SameSite=Lax` y `Secure` (según `cookieSecure()`). Código en `src/lib/supabase/` (`cookies.ts`, `server.ts`, `admin.ts`, `claims.ts`); todo con `server-only`. No hay `anon.ts` ni cliente para el navegador: tras T5b el rol `anon` no tiene privilegios y el servidor lee con la llave secreta.
- `src/proxy.ts` solo corre en `/c/*` y `/panel/*` (nunca en la landing) y renueva la sesión del rol que toca. Sin Supabase configurado no hace nada.
- Cabeceras de seguridad y CSP (`connect-src 'self'`, solo en producción, sin `script-src`) en `next.config.ts`, solo para `/c/*`, `/panel/*` y `/api/*`.
- **ESLint** prohíbe importar `@supabase/*` o `src/lib/supabase` desde componentes `'use client'`, `components/landing` y `app/(landing)`; `@supabase/*` solo se importa dentro de `src/lib/supabase`.
- **`pnpm check:cliente`** (después de `pnpm build`): falla si `.next/static` contiene `supabase`, `sb_publishable`, `sb_secret` o `127.0.0.1:54321`.
- **Ruta de prueba de cookies, solo desarrollo:** `POST /c/api/auth/dev-sesion` y `POST /panel/api/auth/dev-sesion` con `{"usuario": "+529931000201"}` o `{"usuario": "velez@lealtab.test"}` abren sesión con un usuario de `pnpm db:seed`. **Solo existe con `LT_ENV=local`**, Supabase configurado y `SUPABASE_URL` local; en cualquier otro caso responden **404**. Para el cliente de la semilla le asigna un correo y una contraseña ficticios (el acceso por teléfono sigue apagado en local). Se retira cuando existan las pantallas de acceso.

## Pruebas e2e del producto (`pnpm test:e2e:producto`)

Aparte de la suite de la landing. Necesita `pnpm db:up`, `pnpm db:env` (`.env.local` con `LT_ENV=local`) y `pnpm db:seed`. `playwright.producto.config.ts` hace `pnpm build` + `next start` en el puerto 3140 (`E2E_PRODUCTO_PORT` lo cambia; reutiliza un servidor ya levantado ahí) y corre `e2e-producto/` en los mismos 5 proyectos que la landing, con `LT_COOKIE_SECURE=1` sobre `localhost`.

- Chromium, Firefox y Mobile Chrome tratan `localhost` como seguro y aceptan cookies `Secure`. **WebKit (escritorio y Mobile Safari) las guarda pero no las envía por HTTP**: ahí corren solo las pruebas que miran los `Set-Cookie` y la red, y las demás se saltan. Lo que depende del envío de la cookie en iOS se prueba con HTTPS en un iPhone real (RNF-PWA-07).
- Cubre: atributos de las cookies, que `lt-cliente` no viaje a `/panel` ni `lt-dueno` a `/c`, convivencia en el mismo navegador, que la landing y `/api/salud` no reciban `Set-Cookie`, y que el navegador no haga ninguna petición a Supabase.
- `pnpm test:e2e` (landing) no cambia y corre sin variables de Supabase.

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
