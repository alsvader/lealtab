# Arquitectura de implementación del MVP (Fase 7)

- **Estado:** **Aprobada por Aarón (22 oct 2026) para `cimientos-entorno-esquema`; el resto, propuesta.** Lo ya decidido se consolida sin reabrirlo; lo nuevo va marcado como propuesta con el ADR o la decisión que haría falta. Nada de esto modifica el PRD, `docs/decisiones.md` ni los ADR vigentes.
- **Fecha:** 22 oct 2026
- **Autor:** `lealtab-arquitecto`
- **Para quién:** `lealtab-desarrollador` (implementa en `web/`), `lealtab-qa` (verifica) y `security-review` (revisa RLS, auth, HMAC y firma).
- **Fuentes que mandan:** `docs/decisiones.md` (D-018 a D-031 y aclaraciones), `brand/06-product-design/07-entrega-desarrollo.md`, PRD v2.5 (§5, §7, §8, §12), ADR-001, ADR-002, ADR-003 y ADR-004, y `docs/fase-7/medicion.md` (`evento_uso`). El detalle de PQ-22/PQ-24/PQ-25 viene de `docs/fase-7/propuestas/pq-arquitectura.md`, que **solo es historial donde choca** con las decisiones del 22 oct (sesión propia, «por confirmar», plan de pago).

**Cómo leer las marcas.**

| Marca | Significa |
|---|---|
| **Decidido** (con fuente) | Ya está en una D-, un ADR o el PRD. Se implementa tal cual |
| **Propuesta** | Decisión técnica nueva mía. Necesita aprobación de Aarón; si afecta a un documento protegido, la lleva el `lealtab-coordinador` |
| `[SUPUESTO]` | Dato no verificado. Cada uno trae la prueba que lo cierra |
| **Por definir** | Las fuentes no lo resuelven. Se cita la PQ o se propone una nueva (PQ-N1, PQ-N2…; el coordinador les asigna número) |

---

## 0. Resumen

1. **Landing y producto se aíslan con dos layouts raíz** (`(landing)` y `(producto)`). Hoy `src/app/layout.tsx` importa `globals.css`, que trae Tailwind más el CSS de la v1.7 **sin `@layer`**: en `/c/` y `/panel/` pisaría a Tailwind y a shadcn/ui. La guía de Next 16.4 lo confirma: el CSS global no se quita al navegar entre rutas y puede chocar ([css.md](../../web/node_modules/next/dist/docs/01-app/01-getting-started/11-css.md)). Los dos layouts raíz dan una carga completa de página entre landing y producto (§1.2, **propuesta ADR-007**).
2. **Supabase local con el CLI** (`supabase start`, que levanta sus contenedores en Docker) **y Compose para la app**. El stack de autoalojamiento de Supabase (Envoy, Supavisor, claves en `.env`) no replica la configuración del proyecto alojado (`config.toml`: hook, límites, SMTP). Es una lectura ligeramente distinta de «Docker Compose levanta Supabase» (D-023): se propone con ADR y un camino de respaldo (§2.1, **ADR-005**).
3. **Sin cliente de Supabase en el navegador, para nadie** (ni cliente ni dueño). Con cookies `HttpOnly` el navegador no puede usar el JWT, y RNF-STK-10 prohíbe conexiones a terceros. Consecuencias: la tarjeta se refresca con sondeo a una ruta propia (no Realtime), los logos salen por el mismo origen y se prueba con CSP `connect-src 'self'` y Playwright (§5.7).
4. **Esquema:** `public` (tablas y vistas, con GRANTs explícitos y mínimos), `privado` (ayudantes de RLS, no expuesto) y `servidor` (funciones `SECURITY DEFINER` que **solo ejecuta el rol de servicio**). Desde el **30 oct 2026** Supabase deja de exponer tablas nuevas al Data API sin `GRANT` explícito; las migraciones ya los traen ([changelog de Supabase](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)) (§3).
5. **Hallazgo que contradice a dos fuentes:** ADR-003 §2.6 dice que el dueño **no** lee `tarjeta_llave`, pero RNF-OFF-03 y D-015 exigen que el mostrador valide el QR **sin conexión**, o sea que el navegador del dueño necesita las llaves. Resolución propuesta: un endpoint del servidor que las entrega solo a un dispositivo registrado (§7.1, **ADR-008**).
6. **Claves nuevas de Supabase.** `anon` y `service_role` se retiran a fines de 2026; se usan `sb_publishable_…` y `sb_secret_…` desde el principio y **sin prefijo `NEXT_PUBLIC_`** porque el navegador no las necesita ([API keys](https://supabase.com/docs/guides/api/api-keys), consultado el 22 oct 2026).
7. **El plan gratuito sí permite lo que ADR-003 dudaba:** los hooks (SMS y *custom access token*) y el SMTP propio aparecen incluidos en Free; 2 proyectos activos; sin respaldos; pausa a la semana ([supabase.com/pricing](https://supabase.com/pricing), 22 oct 2026). Lo que sigue sin documentar son los **valores** de límites y vigencia del OTP; los cierra el spike SP-4.
8. **Migraciones en el build de Vercel:** el script corre `next build` primero y `supabase db push` después, **solo si `VERCEL_ENV=production`**, con la URL de la base disponible únicamente en el entorno Production de Vercel (§2.5). Regla de compatibilidad: migraciones aditivas (*expand/contract*), porque un *rollback* de Vercel deja el código viejo contra el esquema nuevo.
9. **«Cimientos» se parte en dos** (decisión del coordinador, incorporada en §10): `cimientos-entorno-esquema` (Docker, `web/supabase/`, migración inicial recortada, RLS y pruebas REST, clientes `@supabase/ssr`, `proxy` limitado a `/c` y `/panel`, migraciones en el build) y `spike-auth-cliente` (hook mínimo, `/c/api/auth/codigo` y `verificar`, página y manifest de prueba para iPhone, informe). El spike de QR (PQ-25) va en el brief de N5.
   - **Aclaración propuesta a D-023 (decide Aarón):** Supabase local con el CLI (`supabase start`) y un Compose solo para la app (§2.1).
10. **Orden por dependencias** (§10): alta del negocio (N1–N4) **antes** del registro del cliente, porque C1 necesita un negocio real y porque N1–N4 no dependen de PQ-30 ni de PQ-31.

### 0.1 ADR y decisiones (005 a 007 redactados; 008 pendiente; las lleva el coordinador)

| ADR | Qué fija | Cuándo hace falta |
|---|---|---|
| **ADR-005** Entorno local y migraciones (redactado; Aceptado el 22 oct 2026) | Supabase CLI + Compose para la app; proyecto alojado de pruebas; migraciones solo en producción; *build* primero, *push* después; *expand/contract* | Antes de empezar `cimientos-entorno-esquema` (toca la lectura literal de D-023) |
| **ADR-006** Esquema de datos del MVP (redactado; Aceptado el 22 oct 2026) | Esquemas `public`/`privado`/`servidor` (exposición de `servidor` aprobada); tablas nuevas que el PRD §8 no lista (`config_plataforma`, `intento_acceso_dueno`, `cuenta_pendiente_borrado`); vistas definer incl. `mis_tarjetas`; `evento` en cascada; 1 negocio por dueño; `slug` y `color` en `negocio` | Antes de la primera migración |
| **ADR-007** Rutas y layouts raíz (redactado; Aceptado el 22 oct 2026) | Dos layouts raíz; producto sin cliente de Supabase en el navegador; CSP; sondeo en vez de Realtime; logos por el mismo origen; `robots` | Antes de mover la landing a `(landing)` |
| **ADR-008** Sin conexión: reglas de conflicto, recálculo y llaves (propuesta, no redactado) | Recálculo canónico de sellos; orden por `device_ts` validado; entrega de llaves al mostrador (aclara ADR-003 §2.6 frente a RNF-OFF-03) | Antes de `mostrador-n5` (decisión de Aarón, 22 oct 2026; lo pide la entrega de llaves por `servidor.llaves_del_negocio`, §7.1) |
| **ADR condicional** Rol por *custom access token hook* | Solo si pasa SP-5; no cambia las políticas (siguen leyendo `app_metadata.rol`) | Tras el spike |
| **D-/ADR condicional** Mecanismo A o B del `install_token`, y librería de QR | Resultado de SP-2 y SP-6 | Tras los spikes |

Dudas de producto o de PRD que salen de bajar el modelo a tablas: §11.3.

---

## 1. Estructura de `web/`

### 1.1 Diagrama de componentes y rutas

```mermaid
flowchart LR
  subgraph NAV["Navegador (solo habla con lealtab.com)"]
    L["Landing /"]
    C["PWA cliente /c/ (SW con scope /c/)"]
    P["Panel /panel/ (N5 con cola en IndexedDB)"]
  end
  subgraph VER["Vercel: Next.js 16.4 en web/ (iad1)"]
    PX["proxy.ts: refresca la sesion en /c y /panel"]
    RL["(landing): RSC + CSS Modules"]
    RC["(producto)/c: RSC + /c/api/*"]
    RP["(producto)/panel: RSC + /panel/api/*"]
    HK["/api/hooks/send-sms"]
    CR["/api/cron/diario"]
  end
  subgraph SB["Supabase (us-east-1, SUPUESTO)"]
    AU["Auth"]
    DB[("Postgres + RLS")]
    ST["Storage: logos (privado)"]
  end
  SMS["SMS Masivos"]
  RES["Resend (SMTP del duenio)"]
  L --> RL
  C --> RC
  P --> RP
  PX -.-> RC
  PX -.-> RP
  RC -->|"JWT del usuario o llave secreta"| DB
  RP -->|"JWT del usuario o llave secreta"| DB
  RC --> AU
  RP --> AU
  AU -->|"Send SMS hook (HTTP firmado)"| HK
  HK --> SMS
  AU -->|"SMTP"| RES
  HK -->|"llama a servidor.autorizar_envio_codigo"| DB
  CR --> SMS
  CR --> DB
  RP --> ST
```

**Rutas del producto** (D-022, RNF-PWA-03; las del panel son **propuesta**, el PRD solo fija `/panel/`):

| Ruta | Pantalla | Quién | Notas |
|---|---|---|---|
| `/` | Landing | público | Sin cambios de URL ni de contenido |
| `/c/` | C0 Mis tarjetas | cliente | `/mis-tarjetas` redirige aquí (`redirects` en `next.config.ts`) |
| `/c/{slug}/` | C1 / C3 / C4 según estado | público y cliente | Lo que imprime el QR del mostrador. La parte pública (`negocio_publico`) se cachea con `use cache` |
| `/c/{slug}/registro` | C1 paso 1 y 2, R1 | público y cliente | |
| `/c/recuperar` | REC·1 | público | |
| `/c/cuenta` | C5 | cliente | |
| `/c/privacidad` | Aviso de la tarjeta | público | |
| `/c/manifest.webmanifest` | Manifest único (`id` y `scope` `/c/`) | público | Route handler; acepta `?it=<token>` (ADR-001 §7) |
| `/c/sw.js` | Service worker (scope `/c/`) | público | Archivo estático en `public/c/sw.js` con encabezados propios. Lo construye el feature de PWA |
| `/c/logo/{slug}` | Logo del negocio | público | El servidor lo lee de Storage y lo sirve con caché; el navegador nunca ve `supabase.co` |
| `/c/api/auth/*` | Código, verificar, segundo negocio, install, salir | público y cliente | Ver §5.2 |
| `/c/api/cuenta/*`, `/c/api/tarjeta/*`, `/c/api/eventos` | Borrar cuenta, estado de tarjeta (sondeo), eventos | cliente | |
| `/panel/` | N0 Inicio (exige sesión de dueño) | dueño | |
| `/panel/entrar`, `/panel/alta` | N1 (entrar y crear cuenta) | público | `LINKS.createCard` hoy abre WhatsApp; cambiarlo es de la Fase 5 y lo pide Aarón |
| `/panel/negocio`, `/panel/tarjeta`, `/panel/cartel` | N2, N3, N4 | dueño | |
| `/panel/mostrador` | N5 | dueño | |
| `/panel/quien-regresa`, `/panel/clientes`, `/panel/ajustes` | N6, N7 (con ficha y Por revisar), N8 | dueño | |
| `/panel/api/auth/*` | Código, verificar, contraseña, restablecer, salir | público y dueño | Ver §5.3 |
| `/panel/api/*` | Sync, llaves, eventos, exportaciones CSV | dueño | `POST /panel/api/sync` es el §7 |
| `/api/hooks/send-sms` | Hook de SMS de Supabase Auth | solo Supabase (firma) | Fuera de `/c` y de `/panel` a propósito (ADR-004) |
| `/api/cron/diario` | Saldo del proveedor, limpieza, reintentos de borrado | solo Vercel (`CRON_SECRET`) | Hobby permite un cron por día ([Vercel](https://vercel.com/docs/cron-jobs/usage-and-pricing), 22 oct 2026) |
| `/api/salud` | Salud sin datos personales | público | Base del monitor externo de RNF-REN-04 |

**Slugs reservados** (RNF-PWA-03, ADR-001 §5.2 punto 3). El formato `^[a-z0-9]+(-[a-z0-9]+)*$` (3 a 40 caracteres) ya impide `manifest.webmanifest` y `sw.js` (llevan punto). Se reservan además, en un `CHECK`: `recuperar`, `cuenta`, `privacidad`, `registro`, `api`, `logo`, `iconos`, `offline`, `panel`, `c`, `admin`.

### 1.2 Árbol de carpetas

```text
web/
  Dockerfile                 multi-stage (§2.3)
  compose.yaml               app + redes hacia el stack del CLI (§2.2)
  .dockerignore
  .env.local.example         sin secretos (§2.4)
  vercel.json                buildCommand, regions ["iad1"], crons
  components.json            shadcn: alias hacia components/producto (§1.3)
  scripts/
    vercel-build.sh          next build y, solo en producción, db push (§2.5)
    db-push.sh               push manual con candado contra producción
    db-env.sh                escribe .env.local desde `supabase status -o env`
    seed-dev.ts              crea usuarios y negocios de prueba por la API de admin
    check-no-supabase-en-cliente.sh   falla si .next/static trae supabase.co, claves o 54321
  supabase/
    config.toml              espejo de la configuración alojada (§2.6)
    migrations/              una migración por tema (§3.1)
    seed.sql                 vacío a propósito; lo sembrado va en scripts/seed-dev.ts
    templates/               correos del dueño con {{ .Token }} (código, no enlace)
    tests/                   pgTAP: estructura y RLS (§4.3)
  tests/
    unit/                    Vitest: HMAC del QR, límites, normalizar teléfono, esquema de eventos
    rls/                     Vitest: llamadas directas a la API REST con JWT reales (§4.4)
  e2e/
    (las specs de la landing actuales, sin tocar)
    producto/                specs de /c y /panel, con axe (§5.7)
  spikes/                    código desechable de los spikes; no se despliega (§8)
  public/
    c/sw.js                  (feature de PWA)
  src/
    proxy.ts                 refresco de sesión (§5.5)
    app/
      (landing)/             layout raíz de la landing
        layout.tsx           el actual de app/layout.tsx, sin cambios de contenido
        page.tsx             la landing (movida)
        aviso-de-privacidad/ terminos-y-condiciones/   (movidas)
      (producto)/            layout raíz del producto
        layout.tsx           <html lang="es-MX">, fuentes, producto.css; sin manifest
        c/
          layout.tsx         manifest, apple-touch-icon, registro del SW (solo aquí)
          page.tsx           C0
          [slug]/page.tsx  [slug]/registro/page.tsx
          recuperar/ cuenta/ privacidad/
          manifest.webmanifest/route.ts
          logo/[slug]/route.ts
          api/auth/*/route.ts   api/cuenta/  api/tarjeta/  api/eventos/
        panel/
          layout.tsx         shell del panel; sin manifest
          page.tsx           N0
          entrar/ alta/ negocio/ tarjeta/ cartel/ mostrador/ quien-regresa/ clientes/ ajustes/
          api/auth/*/route.ts   api/sync/  api/llaves/  api/eventos/  api/export/
      api/
        hooks/send-sms/route.ts
        cron/diario/route.ts
        salud/route.ts
      robots.ts  sitemap.ts  fonts.ts      (siguen en la raíz de app/)
    components/
      landing/  legal/  ui/                (actuales: no se tocan)
      producto/                            componentes del producto
        ui/                                shadcn/ui (alias en components.json)
        c/  panel/  mostrador/             por área
    content/                               textos como constantes tipadas (AGENTS.md §5)
      (actuales de la landing)
      c/  panel/                           textos del producto, uno por pantalla
    hooks/  lib/
      (actuales: restart-animation, reveal, site)
      supabase/
        server.ts            createServerClient por rol (cookies lt-cliente / lt-dueno)
        anon.ts              cliente sin sesión y sin persistencia (lecturas públicas)
        admin.ts             llave secreta; import 'server-only'
        claims.ts            getClaims() y lectura de app_metadata.rol
        cookies.ts           nombres, rutas y opciones de las dos cookies
        database.types.ts    generado con `pnpm db:types`; se versiona
      auth/        dal.ts (requireCliente, requireDueno)  telefono.ts  ip.ts  limites.ts
      sms/         smsmasivos.ts  hook.ts
      qr/          hmac.ts  paso.ts   (puro; lo usan servidor y navegador)
      mostrador/   cola.ts  firma.ts  sync.ts   (solo navegador)
      eventos.ts   lista cerrada y esquema de props (medicion.md §3.1)
      version.ts   version_producto, tomada de package.json
      env.ts       variables validadas de forma perezosa
    styles/
      tokens.css   copia manual de brand/04-design-system/tokens.css (sin cambios)
      globals.css  CSS de la landing (NO se toca)
      producto.css Tailwind + tokens + @theme del producto
```

### 1.3 Cómo conviven landing y producto (**propuesta ADR-007**)

| Tema | Decisión | Motivo y fuente |
|---|---|---|
| Layouts raíz | `src/app/layout.tsx` desaparece. `(landing)/layout.tsx` conserva su contenido y su `import "@/styles/globals.css"`. `(producto)/layout.tsx` importa `producto.css`. Las URLs no cambian | Next permite varios layouts raíz y cada uno define `<html>` y `<body>`; navegar entre ellos es una carga completa ([layout.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md), [route-groups.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md)) |
| `globals.css` de la landing | No se edita. `producto.css` repite el `@theme inline` que mapea los tokens (una copia deliberada); una extracción a un archivo común se hace solo con la suite de paridad en verde | AGENTS.md §5: la landing usa CSS global de la v1.7 fuera de `@layer` |
| Tokens | `tokens.css` es una sola copia, importada por los dos. El producto no inventa colores (RNF-DIS-01). Las variables semánticas de shadcn (`--primary`, `--background`…) se **mapean** a los tokens en `producto.css` | `tailwind-design-system`, AGENTS.md §6 |
| shadcn/ui | `components.json` apunta a `src/components/producto` (`ui` → `producto/ui`) y su `css` a `src/styles/producto.css`. **Nunca** al `components/ui` actual (tiene `BtnCta` y `RevealObserver` de la landing) ni a `globals.css` | Evita que `shadcn add` reescriba CSS o carpetas de la landing |
| Fuentes | `fonts.ts` se comparte (Archivo y Manrope de `next/font`, autoalojadas: no hay petición a Google en producción) | RNF-STK-10 |
| 404 | Con varios layouts raíz, una URL inexistente muestra la página 404 por defecto de Next, sin layout. `global-not-found` es experimental y **no se activa** | [not-found.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md). Se agrega una prueba: una ruta inexistente responde 404 y la landing sigue sana |
| `robots.ts` y `sitemap.ts` | Siguen en `app/`. `robots` agrega `disallow: ["/c/", "/panel/", "/api/"]` y los layouts del producto llevan `robots: { index: false }`. `sitemap` no cambia | Hoy `robots` permite todo (`allow: "/"`) |
| Guardas de aislamiento | (1) Ningún módulo de `(landing)` ni de `components/landing` importa `lib/supabase`. (2) `pnpm build` **no exige** variables del producto: `env.ts` valida de forma perezosa. (3) Los e2e de la landing corren sin Supabase | La landing debe construirse y desplegarse aunque falte la base |
| Criterio de «no rompe la landing» | Antes y después de mover los archivos: la suite actual (`pnpm test:e2e`, 5 proyectos, paridad con la v1.7) pasa **sin cambios en las specs** | AGENTS.md §5 |

### 1.4 Límites de componentes de cliente (RNF-STK-11)

React Server Components por defecto. Un archivo lleva `'use client'` **solo** en esta lista cerrada:

| Componente de cliente | Dónde | Por qué |
|---|---|---|
| Formularios con estado (C1 paso 1 y 2, `/c/recuperar`, N1) y `sessionStorage` del flujo | `/c`, `/panel` | Estado local y `inputmode`/`autocomplete` |
| QR rotativo de C3/C4 (genera el paso cada 60 s con la llave local) | `/c` | Funciona sin red (RF-SEL-04) |
| Registro del service worker, guía de instalación de C2, sondeo del estado de la tarjeta | `/c` | APIs del navegador |
| Escáner, cola de IndexedDB, firma ECDSA, indicador de sincronización | `/panel/mostrador` | RNF-OFF-02 a 04 |
| Vista previa en vivo de N3 y controles de N8 | `/panel` | Interacción inmediata |

Todo lo demás se renderiza en el servidor. **Con `cacheComponents: true`** (ya activo en `next.config.ts`):

- Leer `cookies()` fuera de un `<Suspense>` impide prerenderizar la ruta ([cookies.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md)). Toda lectura de sesión va dentro de un componente bajo `<Suspense>`, vía el DAL (`requireCliente`/`requireDueno`), y nunca en el nivel superior de un layout ([authentication-with-cache-components.md](../../web/node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md)).
- Las opciones de segmento `dynamic`, `revalidate` y `fetchCache` se reemplazan por `use cache` y `cacheLife` ([migrating-to-cache-components.md](../../web/node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md)). El desarrollador no las usa. `runtime = 'edge'` no existe: todo corre en Node.
- La parte pública de `/c/{slug}/` (nombre, meta, recompensa, límite) se lee con el cliente `anon.ts` dentro de una función con `use cache`, sin leer cookies. Es lo que da el LCP de RNF-REN-04 y no cuesta nada al primer escaneo del QR.
- Los *route handlers* `POST` no se cachean. Los `GET` que leen cookies corren al momento de la petición.
- `experimental.useOffline` existe en 16.4, pero es experimental y reintenta navegaciones y Server Actions; **no se adopta**: el sin conexión del mostrador es la cola propia de D-015.

---

## 2. Entorno local, entornos y migraciones

### 2.1 Docker Compose y Supabase local (**propuesta ADR-005**)

**Decidido (D-023, RNF-STK-12 y 13):** todo vive en `web/`; Docker Compose levanta Supabase con sus contenedores y la app; Dockerfile multi-stage; en producción Vercel compila `web/`.

**Propuesta.** El stack de Supabase lo levanta el CLI (`supabase start`, contenedores Docker oficiales) y `compose.yaml` define la **app** y se une a la red del CLI. Un solo comando (`pnpm stack:up`) levanta las dos cosas.

| | A. CLI + Compose para la app (**propuesta**) | B. Stack de autoalojamiento en Compose |
|---|---|---|
| Qué es | `supabase start` y `compose.yaml` con el servicio `app` | `docker-compose.yml` del repo de Supabase (Envoy, Supavisor, Studio, Auth, PostgREST, Realtime, Storage, imgproxy, meta, edge runtime, Postgres) |
| Fidelidad con el proyecto alojado | Alta: la configuración (hook, límites, SMTP, plantillas) es `config.toml`, el mismo archivo con el que se configura el proyecto | Baja: la configuración va en variables de `.env` del contenedor de Auth |
| Mantenimiento | El CLI baja las imágenes de su versión | Claves, JWT y secretos con scripts propios; versión fijada (`self-hosted/v0.8.3` en la guía) |
| Migraciones | `supabase db reset` y `supabase db push` | `supabase db push --db-url` |
| Fuente | [config del CLI](https://supabase.com/docs/guides/local-development/cli/config) | [guía de autoalojamiento](https://supabase.com/docs/guides/self-hosting/docker), sin fecha, con etiquetas de abril de 2026 |

**Por qué A:** el trabajo de Fase 7 que más depende de Supabase (hook de SMS, límites, OTP, SMTP) se configura con `config.toml` y se prueba igual en local y en el proyecto alojado. La guía de autoalojamiento ni menciona el CLI. **Qué cambia respecto a D-023:** los contenedores de Supabase no están *definidos* en `compose.yaml`; los crea el CLI. **Respaldo:** si Aarón quiere la lectura literal, se pasa a B sin tocar migraciones ni código (cambian solo `compose.yaml` y el origen de las variables).

Reglas del Compose (`docker-compose-patterns`, `docker-build-strategies`):

- La red del CLI se declara `external` (nombre esperado `supabase_network_lealtab`, con `project_id = "lealtab"`) `[SUPUESTO: verificar el nombre con `docker network ls` tras `supabase start`]`. El servicio `app` llega a Supabase por el nombre del contenedor del gateway (`supabase_kong_lealtab:8000`) `[SUPUESTO]`.
- Perfiles: `app` (imagen de producción, la que usa el e2e y la que verifica el Dockerfile) y `dev` (destino `dev` con *hot reload*). **El día a día va con `pnpm dev` en el anfitrión**: la guía de Next recomienda no usar Docker para desarrollar en Mac y Windows por rendimiento ([deploying.md](../../web/node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md)).
- Reglas de higiene: servicio `app` con `read_only: true` y `tmpfs`, `user` sin privilegios, sin `privileged`, sin `network_mode: host`, `healthcheck` contra `/api/salud`, `restart: unless-stopped` solo en el perfil `app`. Los secretos entran por `env_file` (`.env.local`), nunca por `build.args`.
- Antes de cualquier comando destructivo de Docker (`down -v`, `system prune`, `supabase stop --no-backup`), el desarrollador aplica `docker-destructive-guardrails`.

### 2.2 Puertos y comandos

| Servicio | Puerto local | Notas |
|---|---|---|
| App Next.js (`pnpm dev` o contenedor) | 3000 | El e2e usa 3120 (`E2E_PORT`) |
| Supabase API (gateway) | 54321 | `SUPABASE_URL` |
| Postgres | 54322 | `SUPABASE_DB_URL` (solo migraciones y pruebas) |
| Postgres sombra (`db diff`) | 54320 | |
| Studio | 54323 | |
| Correo local (Mailpit, `[local_smtp]`) | 54324 | Los códigos del dueño llegan aquí |

Plantilla de `config.toml` de 2.121.0 verificada el 22 oct 2026 ([apps/cli-go/pkg/config/templates/config.toml](https://github.com/supabase/cli/blob/main/apps/cli-go/pkg/config/templates/config.toml)).

`package.json` scripts (nombres propuestos):

| Script | Hace |
|---|---|
| `pnpm db:up` / `db:down` / `db:status` | `supabase start` / `stop` / `status` |
| `pnpm db:reset` | `supabase db reset` (aplica migraciones y `seed.sql`; **solo local**) |
| `pnpm db:new <tema>` | `supabase migration new` |
| `pnpm db:lint` | `supabase db lint --level warning --fail-on error` ([db lint](https://supabase.com/docs/reference/cli/supabase-db-lint)) |
| `pnpm db:types` | `supabase gen types typescript --local > src/lib/supabase/database.types.ts` (se versiona; sin él `typecheck` no tiene tipos) |
| `pnpm db:env` | Escribe `.env.local` desde `supabase status -o env` |
| `pnpm db:seed` | `scripts/seed-dev.ts` (dueños, negocios y clientes de prueba) |
| `pnpm db:push` | `scripts/db-push.sh`: se niega a correr contra producción fuera de Vercel |
| `pnpm stack:up` / `stack:down` | `supabase start` y `docker compose --profile app up --build -d`, y su inverso |
| `pnpm test:db` | `supabase test db` (pgTAP, directorio `supabase/tests`) |
| `pnpm test:unit` / `test:rls` | Vitest (nuevo; solo desarrollo) |
| `pnpm test:e2e` | Playwright de la landing, **sin cambios** |
| `pnpm test:e2e:producto` | Playwright del producto contra `next start` con Supabase local |
| `pnpm check:cliente` | `scripts/check-no-supabase-en-cliente.sh` |

### 2.3 Dockerfile multi-stage (`web/Dockerfile`)

| Etapa | Contenido |
|---|---|
| `base` | `node:24-slim` (`@supabase/supabase-js` 2.118.0 pide Node ≥ 22; el Node local es 24.21) y `corepack` con `pnpm@10.28.2`, el de `packageManager` |
| `deps` | `pnpm install --frozen-lockfile` con solo `package.json` y `pnpm-lock.yaml` (capa cacheable) |
| `dev` | Desde `deps`; `pnpm dev -H 0.0.0.0`; el código entra por *bind mount* |
| `build` | Código completo; `NEXT_OUTPUT=standalone pnpm build`. **No necesita base de datos**: ninguna ruta lee Supabase al compilar (`/c/[slug]` no usa `generateStaticParams`) |
| `runner` | Usuario sin privilegios, solo `.next/standalone`, `.next/static` y `public/`; `EXPOSE 3000`; `HEALTHCHECK`; `CMD ["node","server.js"]` |

`next.config.ts` activa `output: "standalone"` **solo** con `NEXT_OUTPUT=standalone`, para que Vercel no vea cambios ([output.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md)). La imagen no lleva secretos ni `.env*` (`.dockerignore`: `node_modules`, `.next`, `.env*`, `supabase/.temp`, `test-results`, `playwright-report`, `.git`). **En producción el contenedor no se despliega** (RNF-STK-14).

### 2.4 Variables de entorno

Reglas: **ninguna lleva `NEXT_PUBLIC_`** (el navegador no habla con Supabase). Se leen con `src/lib/env.ts` de forma perezosa y con validación; el `.env.local.example` se versiona con valores vacíos o ficticios, y `.env*` está en `.gitignore`.

| Variable | Local | Preview | Producción | Notas |
|---|---|---|---|---|
| `SUPABASE_URL` | `http://127.0.0.1:54321` (en contenedor: el gateway) | proyecto de pruebas | proyecto de producción | |
| `SUPABASE_PUBLISHABLE_KEY` | `db:env` | pruebas | producción | `sb_publishable_…`. Baja confianza: la RLS manda |
| `SUPABASE_SECRET_KEY` | `db:env` | pruebas | producción | `sb_secret_…`. Solo `admin.ts` (`server-only`). Nunca en el navegador; Supabase responde 401 si se usa desde uno |
| `SUPABASE_DB_URL` | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | — | — | Solo scripts y pruebas |
| `SUPABASE_DB_URL_MIGRACIONES` | — | — | **solo Production** | Pooler de sesión, puerto 5432 (IPv4); ver §2.5 |
| `SEND_SMS_HOOK_SECRET` | generado | generado | generado | Formato `v1,whsec_…` |
| `SMS_PROVIDER_MODE` | `stub` | `sandbox` | `live` | El modo `stub` se niega a arrancar si `LT_ENV` no es `local` |
| `SMSMASIVOS_API_KEY` | vacía | llave de sandbox (`sandbox: 1`, 100 envíos al día) | llave real | ADR-004 §2 punto 5 |
| `RESEND_API_KEY` | vacía (Mailpit) | prueba | producción | Contraseña SMTP de Auth y avisos al fundador |
| `ALERT_EMAIL_TO` | tu correo | tu correo | correo de Aarón | Avisos del hook y del cron |
| `IP_HASH_PEPPER` | aleatoria | aleatoria | aleatoria | HMAC de la IP en `envio_codigo` |
| `CRON_SECRET` | aleatoria | aleatoria | aleatoria | Vercel la manda como `Authorization: Bearer` `[SUPUESTO: verificar]` |
| `LT_ENV` | `local` | `preview` | `production` | Distingue entornos sin depender de `NODE_ENV` |
| `LT_COOKIE_SECURE` | `1` con HTTPS local, `0` solo en HTTP de Chrome | `1` | `1` | WebKit no acepta cookies `Secure` por HTTP; para iPhone se usa `next dev --experimental-https` o un túnel HTTPS |

Sin las variables de Supabase, las rutas del producto responden «Producto no configurado» (503) y la landing sigue sana.

### 2.5 Migraciones: local, build de Vercel y vistas previas

**Decidido (RNF-STK-15, ADR-002 §4):** todo cambio de base es una migración en `web/supabase/migrations`; corren en el build de Vercel; si una falla, el build falla; no deben correr en vistas previas; credenciales en variables de entorno de Vercel.

**Local.** `pnpm db:new <tema>` crea el archivo con marca de tiempo UTC. `pnpm db:reset` reaplica todo desde cero y debe terminar sin errores antes de cada commit con migraciones. Luego `pnpm db:types`.

**Build de Vercel.** `vercel.json` fija `"buildCommand": "sh scripts/vercel-build.sh"` ([guía de Vercel](https://vercel.com/kb/guide/dynamic-build-commands): el script decide con `VERCEL_ENV`; el *Ignored Build Step* no sirve para esto). El script, con `set -euo pipefail`:

1. `pnpm exec next build`. **Se compila antes de migrar**: un error de compilación no deja la base adelantada.
2. Si `VERCEL_ENV` es `production`: exige `SUPABASE_DB_URL_MIGRACIONES`, corre `supabase db push --dry-run --db-url …` (queda en el log) y luego `supabase db push --yes --db-url …`. Cualquier fallo sale con código distinto de cero y **Vercel no promueve el despliegue** (RNF-STK-15).
3. En cualquier otro entorno imprime «Vista previa: sin migraciones» y termina.

Tres candados contra migrar desde una vista previa: el script revisa `VERCEL_ENV`; **`SUPABASE_DB_URL_MIGRACIONES` solo existe en el entorno Production de Vercel**, de modo que una vista previa ni la ve; y `scripts/db-push.sh` (uso manual) se niega a correr si la URL contiene la referencia de producción sin `LT_CONFIRMA_PRODUCCION=1`.

Datos verificados que condicionan el diseño:

- La conexión directa (`db.<ref>.supabase.co:5432`) es **solo IPv6 en Free**; el *pooler* compartido en modo sesión (`aws-<n>-<region>.pooler.supabase.com:5432`, usuario `postgres.<ref>`) es IPv4 en todos los planes ([conectar a Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres), 22 oct 2026). Se usa el *pooler* de sesión para migrar. `[SUPUESTO: que el build de Vercel no tenga IPv6 y que `db push --db-url` no pida `supabase login`; lo cierra el spike SP-0]`.
- `supabase` (CLI) 2.121.0 se instala como `devDependency`: trae los binarios por `optionalDependencies` y **no tiene `postinstall`**, así que pnpm 10 no necesita `onlyBuiltDependencies` (revisado en el `package.json` del paquete, 22 oct 2026). Se fija la versión exacta.
- La documentación de `db push` no dice si cada archivo corre en una transacción. **Prueba en SP-0:** una migración que falla a la mitad debe dejar la base sin cambios; mientras tanto, nada de `CREATE INDEX CONCURRENTLY`.
- Dos *builds* de producción a la vez podrían empujar a la vez `[SUPUESTO: riesgo bajo con un solo desarrollador]`.

**Regla de compatibilidad (*expand/contract*).** Una migración nunca rompe al código anterior: se agrega, se despliega, y solo en una migración posterior se quita o renombra. El motivo: *rollback* de Vercel (código viejo) y el tiempo entre `db push` y la promoción del despliegue.

**Vistas previas.** Usan un **proyecto Supabase de pruebas** (`lealtab-pruebas`, el segundo del plan gratuito, que permite 2 activos: [pricing](https://supabase.com/pricing)). Su esquema se actualiza a mano con `pnpm db:push:pruebas` antes de probar un PR con migraciones. Sin ese proyecto, la vista previa muestra «Producto no configurado» y solo se prueba la landing. Las vistas previas de Vercel traen protección de despliegue: no son un destino para el hook de SMS de Supabase (§8, SP-1).

### 2.6 Qué cambia con el plan gratuito de Supabase y Hobby de Vercel (PQ-29, cerrada)

| Tema | Plan gratuito | Qué hace la arquitectura |
|---|---|---|
| Respaldos | Ninguno ni PITR | `pnpm db:backup` (`supabase db dump` con la URL de migraciones) **semanal**, cifrado con `age` o `gpg`, guardado fuera del repo y **una restauración de prueba en local antes del piloto**. El respaldo trae teléfonos: va cifrado y entra al aviso (PQ-18). La exportación CSV del dueño es el otro respaldo (R-19) |
| Pausa a la semana sin actividad | Sí | El cron diario hace una consulta trivial. `[SUPUESTO: que esa consulta cuente como actividad]`; se confirma observando el panel un fin de semana |
| Sesiones | Sin plazo máximo ni de inactividad | Limitación del piloto aprobada (ADR-003 §2.4). `[auth.sessions]` queda comentado en `config.toml` |
| Límites de Auth | Los valores por defecto no alcanzan con todas las llamadas saliendo de Vercel | Se suben en el panel y se confirman en SP-4. Si Free no deja subirlos: decisión de Aarón (plan de pago, PQ-29) |
| Hooks y SMTP | Incluidos | Sin cambio |
| Disco 500 MB, Storage 1 GB, 5 GB de salida | Suficiente `[SUPUESTO]` | 14 negocios × 200 clientes = 2,800 tarjetas; unos 30 mil `evento` y 100 mil `evento_uso` rondan decenas de MB. Se mide al cierre de la Fase 8 |
| Cron de Vercel | Un cron por día, con precisión de ±59 min | Un solo cron `/api/cron/diario`. Las alertas que no pueden esperar un día (tope de 200 envíos, 3 de 10 fallidos) las dispara el hook |
| Funciones | Una región (`iad1`), 300 s máximo | `regions: ["iad1"]` explícito; el hook mide su duración (PQ-39) |
| Vercel Hobby | Solo uso no comercial | Riesgo aceptado (R-19). **Disparadores propuestos para reevaluar el plan de pago** (PQ-29 dejó la fecha sin definir): el primer cobro real, base ≥ 400 MB, una pausa con un negocio activo, p95 > 800 ms tres días seguidos o una pérdida de datos. Costo al subir: unos USD 45 al mes (Vercel Pro por asiento, [pricing](https://vercel.com/pricing), consultado el 21 oct 2026; Supabase Pro desde USD 25, [pricing](https://supabase.com/pricing), 22 oct 2026) |
| Resend | 100 correos al día y 3,000 al mes ([pricing](https://resend.com/pricing), 22 oct 2026) | Alcanza para los códigos del dueño de 14 altas por día; el hook avisa si un día se acerca |

---

## 3. Esquema inicial y migraciones

### 3.1 Convenciones y orden

- **Una migración por tema**, nombre `AAAAMMDDHHMMSS_<tema>.sql` (UTC), en `snake_case` sin acentos, hacia adelante y **nunca editada después de entrar a `main`** (se corrige con otra).
- Cada migración que crea una tabla trae, **en el mismo archivo**: `ENABLE ROW LEVEL SECURITY`, `REVOKE ALL … FROM anon, authenticated`, los `GRANT` explícitos que sí se quieren (a `authenticated` por columna cuando aplique **y a `service_role`**: `BYPASSRLS` no concede privilegios de tabla) y sus políticas. Así el resultado no depende de los privilegios por defecto del proyecto, que cambian el 30 oct 2026.
- Tipos: `text` con `CHECK` en lugar de `enum` (cambiar un `CHECK` es una migración corta). Claves `uuid` con `gen_random_uuid()` (incluida en Postgres), salvo las tablas de bitácora (`bigint generated always as identity`). Marcas de tiempo `timestamptz`.
- Nombres de dominio en español y `snake_case`, como el PRD §8 y `07-entrega` §3 (`cliente_negocio`, `evento_uso`).
- Postgres 17 (`major_version = 17` en `config.toml`, el valor de la plantilla). **Debe coincidir con el proyecto alojado**: `show server_version;` al crearlo. `[SUPUESTO]`.
- Las funciones `SECURITY DEFINER` llevan `set search_path = ''` y nombres calificados (`public.tabla`, `extensions.hmac`), `REVOKE ALL … FROM PUBLIC`, y `GRANT EXECUTE` solo a quien corresponde.

| # | Migración | Contenido |
|---|---|---|
| 1 | `extensiones_esquemas_roles` | `pgcrypto` en `extensions`; esquemas `privado` y `servidor`; `ALTER DEFAULT PRIVILEGES` que quitan `EXECUTE` a `PUBLIC`, `anon` y `authenticated` en `servidor`; `GRANT USAGE` sobre `privado` a `authenticated` |
| 2 | `plataforma_y_negocio` | `config_plataforma`, `negocio`, `dueno_negocio`, `tarjeta_config`; disparadores (slug inmutable, columnas de alta); ayudantes `privado.rol()`, `privado.negocios_del_dueno()`, `privado.es_dueno_de()`; políticas del dueño |
| 3 | `identidad_y_tarjetas` | `identidad`, `cliente_negocio`, `tarjeta_cliente`, `tarjeta_llave`; disparadores de exclusión mutua; ayudantes `privado.mi_identidad_id()` y `privado.mis_cliente_negocio_ids()`; políticas del cliente y del dueño |
| 4 | `sellos_y_mostrador` | `dispositivo`, `evento`, `por_revisar`; disparadores de inmutabilidad de `correccion`; índices del §3.3 |
| 5 | `acceso_codigos` | `install_token`, `envio_codigo`, `codigo_intento`, `intento_acceso_dueno`, `cuenta_pendiente_borrado` |
| 6 | `eventos_uso` | `evento_uso` tal como `medicion.md` §3.1, con claves foráneas `ON DELETE SET NULL` |
| 7 | `vistas` | `negocio_publico`, `cliente_del_negocio`, `mis_tarjetas` |
| 8 | `config_inicial` | Filas de `config_plataforma` (tanda, topes y umbrales) y bucket `logos` |
| 9 | `servidor_codigos` | `servidor.autorizar_envio_codigo` y `servidor.registrar_resultado_envio` (las necesita el hook, el único flujo de cimientos B con lógica de base) |

**Recorte para `cimientos-entorno-esquema` (coordinador).** La migración inicial **no** incluye `evento`, `dispositivo`, `por_revisar` ni el canje (migración 4 completa, que pasa al feature `mostrador-n5`), ni ninguna función `SECURITY DEFINER` de registro, borrado o canje (`registrar_cliente`, `borrar_cuenta_cliente`, `canjear_install_token`, `registrar_eventos`…). Tampoco `por_confirmar`, que ya no existe (D-031). Queda: migraciones 1, 2, 3, 5, 6, 7 y 8 y los ayudantes `privado.*` (necesarios para las políticas), con RLS, pruebas REST (R-01 a R-38 salvo las de las tablas diferidas) y pgTAP. La migración 9 (hook) pertenece a `spike-auth-cliente`. Cada feature agrega después sus tablas y funciones, con su migración y su prueba de RLS.

Las demás funciones `servidor.*` las crea el feature que las usa (tabla del §3.6), cada una con su migración y su prueba de RLS.

### 3.2 Tablas

Notación: `PK` clave primaria, `FK` clave foránea, `NN` no nulo. Todas llevan RLS activo.

**`config_plataforma`** · `clave text PK`, `valor jsonb NN`, `actualizado_ts timestamptz NN default now()`. Sin políticas; solo el rol de servicio. Filas iniciales (migración 8): `tanda_actual = 1`; `codigo_tope_dia = 400`; `codigo_aviso_dia = 200`; `codigo_por_telefono_hora = 3`; `codigo_por_telefono_dia = 10`; `codigo_por_ip_hora = 10`; `saldo_alerta = 300`. Son los valores aprobados el 22 oct (ADR-003 §2.8) y quedan editables sin desplegar, igual que la tanda (D-004, aclarado). **Propuesta.**

**`negocio`** (PRD §8 + **«Por conciliar» resuelto**)

| Columna | Tipo y restricciones |
|---|---|
| `id` | `uuid PK` |
| `slug` | `text NN unique`, `^[a-z0-9]+(-[a-z0-9]+)*$`, 3 a 40, fuera de la lista reservada (§1.1); **inmutable** por disparador. **No está en el PRD §8** aunque RNF-PWA-03 lo exige: PQ-N1 |
| `nombre` | `text NN`, 1 a 80 |
| `giro` | `text NN`, uno de `barberia`, `estetica`, `tapioca`, `cafeteria`, `otro` (RF-ALT-05) |
| `ciudad` | `text NN`, 1 a 80 |
| `zona_horaria` | `text NN default 'America/Mexico_City'`, una de las 12 zonas de México (PQ-22 a; lista en `pq-arquitectura.md` §1) |
| `logo_path` | `text` nulo (ruta en el bucket privado `logos`, `{negocio_id}/logo.<ext>`) |
| `color` | `text` nulo, hex de 6 dígitos con `CHECK` (`^#[0-9A-Fa-f]{6}$`, por ejemplo `#0F5132`). Lo expone `negocio_publico` (§3.3). Nulo hasta que N2 o N3 lo capturen (PQ-N2) |
| `plan` | `text NN default 'inicio'`, `inicio`/`negocio`/`pro` (PRD §9; solo `inicio` se usa) |
| `estado` | `text NN default 'prueba'`, `prueba`/`activo`/`pausa` |
| `whatsapp` | `text NN`, E.164 mexicano `^\+52\d{10}$` (WhatsApp **del negocio**, no una `identidad`) |
| `correo_dueno` | `text NN`, minúsculas. Duplica el correo de `auth.users`: ver PQ-N6 |
| `creado_ts` | `timestamptz NN default now()` |
| `alta_ts`, `fin_prueba`, `tanda`, `version_producto` | Nulos hasta terminar N4; luego los escribe **solo** `servidor.completar_alta`: `alta_ts = now()`, `fin_prueba = alta_ts + 30 días`, `tanda` = `config_plataforma.tanda_actual` leída en la misma transacción, `version_producto` = `version` de `package.json` (`src/lib/version.ts`). `CHECK` de que los cuatro son nulos o los cuatro tienen valor; una vez escritos no cambian (disparador) |

Esto **cierra «Por conciliar»** (PRD §8, D-004 aclarado): la tanda y la versión viven en `negocio`, y son la **fuente de verdad del Gate 1**. El evento `negocio_alta_completada` solo las repite. Índices: `slug` (único), `(estado)`, `(tanda, alta_ts)`.

**`dueno_negocio`** · `user_id uuid NN FK auth.users ON DELETE CASCADE`, `negocio_id uuid NN FK negocio ON DELETE CASCADE`, `creado_ts`, `PK (negocio_id, user_id)`, **`UNIQUE (user_id)`**: un dueño, un negocio en el MVP (D-021, D-010). **Propuesta**: quita el selector de negocio del panel y se relaja después con una migración. Disparador de **exclusión mutua** con `identidad` (§3.4).

**`tarjeta_config`** · `negocio_id uuid PK FK negocio ON DELETE CASCADE`; `sellos_meta smallint NN default 8` entre 4 y 12 (`[SUPUESTO]` el valor por defecto, tomado de los ejemplos del diseño); `recompensa text NN` (1 a 80); `sello_bienvenida boolean NN default true`; `limite_modo text NN default 'por_dia'` (`por_dia`/`cada_x_horas`/`sin_limite`); `limite_minutos integer` entre 1 y 1,440; `CHECK ((limite_modo = 'cada_x_horas') = (limite_minutos IS NOT NULL))`; `actualizado_ts`. La interfaz habla en horas con hasta 2 decimales y guarda minutos enteros; el límite efectivo es `max(limite_minutos, 2)` (D-014, RF-SEL-06).

**`identidad`** (ADR-003 §2.1) · `id uuid PK`, `whatsapp text NN unique` (E.164 `^\+52\d{10}$`), `auth_user_id uuid NN unique FK auth.users ON DELETE CASCADE`, `verificado_ts NN`, `creada_ts NN default now()`. Sin nombre (D-019). Supabase guarda el teléfono **sin el `+`**: se normaliza al comparar (`src/lib/auth/telefono.ts`, con prueba).

**`cliente_negocio`** · `id uuid PK`, `identidad_id FK identidad ON DELETE CASCADE`, `negocio_id FK negocio ON DELETE CASCADE`, `nombre text NN` (1 a 60), `acepto_aviso_ts NN`, `alta_ts NN default now()`, `UNIQUE (identidad_id, negocio_id)`, índice `(negocio_id, alta_ts)`. Sin `estado` (D-031).

**`tarjeta_cliente`** · `id uuid PK`, `cliente_negocio_id uuid NN unique FK cliente_negocio ON DELETE CASCADE` (una tarjeta por cliente y negocio, RF-TAR-01), `negocio_id uuid NN FK negocio` (copia para RLS y para consultas), `sellos smallint NN default 0` (≥ 0), `meta_ciclo smallint NN` entre 4 y 12 (D-027), `creada_ts`, `ultima_visita_ts`, **`ultimo_sello_ts`** (último sello aceptado de origen mostrador; sirve a la ventana del límite). `sellos` es un **resultado calculado** por el servidor (RNF-OFF-01, §7.4), no un dato que alguien edite. Índice `(negocio_id)`.

**`tarjeta_llave`** · `tarjeta_id uuid PK FK tarjeta_cliente ON DELETE CASCADE`, `llave_hmac bytea NN` (32 bytes de `extensions.gen_random_bytes`), `creada_ts`. Otra tabla porque dueño y cliente son ambos `authenticated` y no se separan por permisos de columna (ADR-003 §2.6).

**`dispositivo`** · `id uuid PK`, `negocio_id FK negocio ON DELETE CASCADE`, `nombre text NN` («iPhone caja»), `llave_publica bytea NN` (SPKI de ECDSA P-256, 91 bytes), `creado_ts`, `ultimo_uso_ts`, `revocado_ts` nulo. Los dispositivos no se borran: se revocan, porque el historial de «quién dio el sello» (RF-SEL-09) los cita.

**`evento`** (sello, canje y corrección; PRD §8). El **canje no es una tabla aparte**: es un `evento` con `tipo = 'canje'` y la recompensa entregada.

| Columna | Detalle |
|---|---|
| `event_id` | `uuid PK`. Llave de idempotencia (RNF-OFF-02). Si llega un `event_id` que ya existe con otro `negocio_id`, se rechaza sin revelar nada |
| `negocio_id` | `uuid NN FK negocio ON DELETE CASCADE` |
| `tarjeta_id` | `uuid FK tarjeta_cliente ON DELETE CASCADE`, **nulo** solo para el descarte «tarjeta dada de baja» (RF-SEL-15), que se guarda sin datos personales para responder igual si el evento se reenvía |
| `tipo` | `sello`/`canje`/`correccion` |
| `origen` | `mostrador`/`bienvenida`/`panel` (la corrección nace en N7, no en un mostrador; **propuesta**, PRD solo lista dos) |
| `modo` | `linea`/`sin_conexion` (lo declara el dispositivo; ver §7.2) |
| `qr_step` | `bigint`, nulo salvo mostrador |
| `device_ts` | `timestamptz` nulo (lo que dice el dispositivo) |
| `ts_efectivo` | `timestamptz NN`: la hora validada con que se ordena (§7.2) |
| `recibido_ts` | `timestamptz NN default now()` |
| `dispositivo_id` | `uuid FK dispositivo`, nulo para `bienvenida` y `panel` |
| `firma` | `bytea` nulo |
| `estado` | `aceptado`/`rechazado`/`provisional` (PRD §8). La aprobación del dueño pasa el evento a `aceptado` y deja `por_revisar.resolucion = 'aprobado'` |
| `motivo_rechazo` | `limite`, `qr_vencido`, `duplicado`, `doble_canje`, `firma`, `tarjeta_baja`, y **`cuenta_pausada` (propuesta, PQ-N4)** |
| `recompensa` | `text`, obligatoria si `tipo = 'canje'` (copia de `tarjeta_config.recompensa` al canjear) |
| `delta`, `sellos_antes`, `sellos_despues`, `motivo`, `nota` | Obligatorias si `tipo = 'correccion'`, nulas en los demás. **Inmutables** (disparador `BEFORE UPDATE OR DELETE`; D-027). `nota` hasta 200 caracteres y solo la lee el dueño |

Índices: `(tarjeta_id, ts_efectivo desc)` (ventana del límite y recálculo), `(negocio_id, ts_efectivo)` (reportes y CSV), `(negocio_id) WHERE estado IN ('rechazado','provisional')` (Por revisar). **Qué pasa al borrar la cuenta:** `tarjeta_id` va en cascada, así que los sellos de esa persona desaparecen de N0, N6, N7 y del CSV (D-026) y los conteos pasados bajan. Si PQ-04 resuelve conservar los conteos sin datos personales, cambia a `SET NULL` con una migración corta (ver `medicion.md` §3.3, que ya asume que el dominio «no ve» a la persona borrada).

**`por_revisar`** · `evento_id uuid PK FK evento ON DELETE CASCADE`, `negocio_id`, `motivo` (los de `evento.motivo_rechazo` salvo `tarjeta_baja`), `resolucion` nula/`aprobado`/`descartado`, `resuelto_por uuid FK auth.users ON DELETE SET NULL`, `resuelto_ts`, `creado_ts`.

**`install_token`** · `id uuid PK`, `token_hash bytea NN unique` (SHA-256; nunca el token), `identidad_id FK identidad ON DELETE CASCADE`, `creado_ts`, `vence_ts NN` (creado + 24 h), `usado_ts`. Los campos finales dependen de PQ-31 (SP-2).

**`envio_codigo`** (ADR-003 §2.8, ADR-004 §2.4 y §2.8; PRD §8) · `id bigint PK identity`, `creado_ts NN`, `hook_ts` (cuándo lo tomó el hook), `telefono text NN` (E.164), `proposito` (`registro`/`recuperacion`/`install`), `canal_intencion` (`auto`/`sms`), `canal` (`whatsapp`/`sms`), `resultado` (`solicitado`/`enviado`/`enviado_por_respaldo`/`fallido`/`rechazado_limite`), `motivo_rechazo`, `flujo_id uuid`, `request_id text` (del proveedor), `ip_hash bytea` (HMAC-SHA256 de la IP con `IP_HASH_PEPPER`; solo para el límite por IP). Índices `(telefono, creado_ts)`, `(ip_hash, creado_ts)`, `(creado_ts)`, `(flujo_id)`. Se conserva 30 días `[SUPUESTO]` (la limpieza va en el cron). Cómo se enlazan el servidor y el hook: §6.

**`codigo_intento`** · `id bigint PK identity`, `telefono NN`, `creado_ts NN`, `resultado` (`incorrecto`/`correcto`/`vencido`/`bloqueado`), `flujo_id`. Índice `(telefono, creado_ts desc)`. Cuenta los 5 intentos y el bloqueo de 15 min.

**`intento_acceso_dueno`** (**nueva; el PRD §8 no la lista**, la exige RF-ALT-02c) · `id bigint PK identity`, `creado_ts`, `correo text NN` (minúsculas), `metodo` (`contrasena`/`codigo`/`restablecer`), `resultado` (`incorrecto`/`correcto`/`bloqueado`), `ip_hash`. Índice `(correo, creado_ts desc)`. Supabase no tiene bloqueo por correo; los «5 fallos pausan la contraseña 15 min sin afectar al código ni a las sesiones» se imponen aquí.

**`cuenta_pendiente_borrado`** (ADR-003 §2.7) · `auth_user_id uuid PK` (sin FK: el usuario ya no tiene `identidad`), `creado_ts`, `intentos integer`, `ultimo_error text`. El cron lo reintenta con `auth.admin.deleteUser`. También recoge usuarios con teléfono verificado y sin `identidad` tras 24 h (PQ-38).

**`evento_uso`** · tal como `medicion.md` §3.1 (columnas, `CHECK` del nombre, índices), con dos precisiones: `negocio_id` **y** `identidad_id` son `ON DELETE SET NULL`, y `props` lleva `CHECK (jsonb_typeof(props) = 'object' AND pg_column_size(props) < 2048)`. Sin políticas; `REVOKE ALL FROM anon, authenticated`. La lista cerrada de nombres vive en `src/lib/eventos.ts`.

**Borrado de cuenta (D-026) y `evento_uso`.** Dentro de `servidor.borrar_cuenta_cliente`, **antes** de borrar la `identidad`: `update evento_uso set flujo_id = null where identidad_id = :id`; al borrarla, `ON DELETE SET NULL` deja `identidad_id` en nulo; y se inserta `cuenta_cliente_borrada` sin `negocio_id` ni `identidad_id`. La prueba de `medicion.md` §3.3 (contar filas con `identidad_id` o `flujo_id` no nulos tras el borrado debe dar 0) entra en pgTAP. Lo que queda ligado al teléfono (`envio_codigo` y `codigo_intento`, 30 días) sigue en PQ-34.

### 3.3 Vistas

Las tres se crean **sin** `security_invoker` (con los privilegios del propietario, que ignora la RLS de las tablas base) y **se filtran dentro de la propia vista**. El asesor de seguridad de Supabase marca las vistas *definer*; son una excepción documentada y cubierta por pruebas (§4.3).

| Vista | Columnas | Filtro | Acceso |
|---|---|---|---|
| `negocio_publico` | `slug`, `nombre`, `logo_path`, `color`, `sellos_meta`, `recompensa`, `sello_bienvenida`, `limite_modo`, `limite_minutos` | `alta_ts IS NOT NULL` y estado efectivo `prueba` o `activo` (`fin_prueba` vencida cuenta como pausa) | `SELECT` a `anon` y `authenticated` |
| `cliente_del_negocio` | `id` (de `cliente_negocio`), `negocio_id`, `nombre`, `whatsapp`, `alta_ts` | `privado.rol() = 'dueno'` y `negocio_id` en `privado.negocios_del_dueno()`. **No expone `identidad_id`** (RNF-PRI-02) | `SELECT` a `authenticated`; sin `anon` |
| `mis_tarjetas` (**propuesta**; ADR-003 la llama «las funciones») | `tarjeta_id`, `slug`, `negocio_nombre`, `logo_path`, `estado_negocio`, `sellos`, `meta_ciclo`, `ultima_visita_ts`, `recompensa`, `limite_modo`, `limite_minutos`, `cliente_nombre`, `acepto_aviso_ts`, `alta_ts` | `privado.rol() = 'cliente'` y la fila pertenece a `auth.uid()`. Incluye negocios en pausa (la tarjeta no desaparece por eso) | `SELECT` a `authenticated`; sin `anon` |

`negocio_publico` incluye `sello_bienvenida` porque C1 lo necesita, y `color` (`negocio.color`, nulable, hex de 6 dígitos; decidido el 22 oct 2026, PQ-N2). Si el negocio aún no lo capturó, la columna va nula y la interfaz usa el color de LealTab. El uso de N2 y N3 y el `theme-color` por negocio (RNF-PWA-06) siguen en PQ-N2. La vista es **la única cosa que `anon` lee**.

### 3.4 Roles, funciones y GRANTs

**Roles.** `anon`, `authenticated`, `service_role` (los de Supabase), más `supabase_auth_admin` solo si se adopta el *custom access token hook* (SP-5). No se crean roles propios.

**Ayudantes en `privado`** (no expuesto; `authenticated` tiene `USAGE` y `EXECUTE` solo sobre estos). `SECURITY DEFINER`, `STABLE`, `search_path = ''`:

| Función | Devuelve |
|---|---|
| `privado.rol()` | `coalesce(auth.jwt() -> 'app_metadata' ->> 'rol', '')` (invoker; se usa como `(select privado.rol())` para que Postgres la evalúe una vez por consulta) |
| `privado.negocios_del_dueno()` | `setof uuid` con los `negocio_id` de `dueno_negocio` donde `user_id = auth.uid()` |
| `privado.es_dueno_de(uuid)` | `boolean` |
| `privado.mi_identidad_id()` | `uuid` de la `identidad` con `auth_user_id = auth.uid()` |
| `privado.mis_cliente_negocio_ids()` | `setof uuid` |
| `privado.estado_efectivo(negocio)` | `estado` con `fin_prueba` vencida tratada como `pausa` (la persistencia la hace el cron; RF-COB-03) |

**Exclusión mutua** (ADR-003 §2.5): disparadores `CONSTRAINT TRIGGER … DEFERRABLE` sobre `identidad` y `dueno_negocio` que rechazan la inserción si el mismo `auth.users.id` ya está en la otra tabla. Además, `servidor.crear_negocio` y `servidor.registrar_cliente` se niegan antes de escribir.

**Funciones `servidor.*`.** Son el único camino de escritura para el cliente y para casi todo lo del dueño. Se llaman por RPC desde el servidor con la llave secreta, **reciben `p_auth_user_id`** (que el servidor ya verificó con `getClaims()` o `getUser()`) y nunca confían en un `negocio_id` que venga del navegador sin cruzarlo con `dueno_negocio`. `REVOKE ALL … FROM PUBLIC, anon, authenticated; GRANT EXECUTE … TO service_role`. Exigen exponer el esquema `servidor` en la API (`[api] schemas = ["public","servidor"]`; en el proyecto alojado, en «Exposed schemas» del panel). **ADR-003 §2.6 dice «esquema no expuesto»**: con `supabase-js` solo se llega a una función por RPC y eso exige exponer su esquema; el efecto es el mismo (ni `anon` ni `authenticated` pueden ejecutarlas, y una prueba lo comprueba) pero no es literal. Alternativa descartada: conexión directa a Postgres desde Vercel, que suma una credencial de ejecución y un *pooler* más. **Aprobado por Aarón el 22 oct 2026** (ADR-006 §2.1; nota fechada en ADR-003 §2.6).

**GRANTs por columna** (la única escritura directa del dueño):

```sql
-- Ilustrativo; la migración 2 lo define. Las demás columnas de negocio solo las escribe el servidor.
grant update (nombre, giro, ciudad, zona_horaria, logo_path, whatsapp, correo_dueno)
  on public.negocio to authenticated;
```

El resto de las escrituras del dueño (`tarjeta_config`, dispositivos, correcciones, resolver Por revisar) pasan por `servidor.*`, porque cambiar `sellos_meta` debe recalcular `meta_ciclo` de las tarjetas (D-027, RF-TAR-06) y no puede quedar a medias.

### 3.5 Semilla

`seed.sql` queda vacío (el CLI lo corre solo en `db reset`, no en `db push`). Las filas de producción viven en la migración 8. Los datos de prueba (Barbería Vélez y Tapioca Mía, dos dueños, clientes con los teléfonos de `[auth.sms.test_otp]`) los crea `scripts/seed-dev.ts` con la API de administración, porque insertar en `auth.users` por SQL es frágil.

### 3.6 Funciones de `servidor` y qué feature las crea

| Función | Feature | Hace |
|---|---|---|
| `autorizar_envio_codigo`, `registrar_resultado_envio` | cimientos B | Límites y bitácora del hook (§6) |
| `crear_negocio`, `completar_alta` | alta del negocio | Crea `negocio` y `dueno_negocio`; fija `alta_ts`, `fin_prueba`, `tanda` y versión |
| `guardar_tarjeta_config` | alta y ajustes | Valida; al bajar `sellos_meta` recalcula `meta_ciclo` de las tarjetas en curso (RF-TAR-06) |
| `registrar_cliente` | registro del cliente | En una transacción: `identidad` (la crea o la reutiliza, comparando el teléfono normalizado de `auth.users`), `cliente_negocio`, `tarjeta_cliente`, `tarjeta_llave` y sello de bienvenida. Idempotente por `auth.uid()`: sirve para el primer negocio, el segundo con sesión y el reintento de PQ-38 |
| `emitir_install_token`, `canjear_install_token` | PWA | Según SP-2 |
| `borrar_cuenta_cliente` | cuenta del cliente | §3.2 |
| `registrar_dispositivo`, `llaves_del_negocio` | mostrador | §7.1 |
| `registrar_eventos` (lote) | mostrador | §7.3 |
| `corregir_sellos`, `resolver_por_revisar` | clientes | D-027, RF-CLI-05 |
| `recalcular_tarjeta` | mostrador | §7.4 |

---

## 4. RLS por rol y pruebas

### 4.1 Reglas

- Todas las tablas con RLS activo; sin `FORCE`. Las políticas son `to authenticated` y de **dos familias** (dueño y cliente), cada una con el rol de `app_metadata` **y** la pertenencia por filas en la misma condición (ADR-003 §2.6, sin políticas restrictivas globales). El rol no es la barrera principal: sin fila en `dueno_negocio` o en `identidad`, el claim no sirve de nada.
- `anon` no tiene privilegios sobre ninguna tabla, solo `SELECT` sobre `negocio_publico`.
- Las políticas del dueño **no dependen de `negocio.estado`**: con la cuenta en pausa sigue leyendo clientes y eventos para exportar (RF-COB-03, RF-CLI-06).
- Una sesión sin claim de rol (la primera, justo después de `verifyOtp`) **no ve nada** hasta que el servidor escribe el rol y refresca (ADR-003 §2.5).
- Cada política usa `(select auth.uid())` y `(select privado.rol())`, e índices en `dueno_negocio(user_id)` e `identidad(auth_user_id)` (únicos).

### 4.2 Matriz completa

`R` lectura (`SELECT`), `E` escritura (`INSERT`, `UPDATE` o `DELETE`), `—` sin acceso (privilegio revocado o cero filas). «Servicio» es `service_role`/llave secreta (ignora la RLS). Marcado con **SR** lo que revisa `security-review`.

| Objeto | `anon` | Cliente (`rol=cliente`) | Dueño (`rol=dueno`) | Servicio |
|---|---|---|---|---|
| `config_plataforma` | — | — | — | R E |
| `negocio` | — | — | R de su negocio; **E por columna**: `nombre`, `giro`, `ciudad`, `zona_horaria`, `logo_path`, `whatsapp`, `correo_dueno` (sin `INSERT` ni `DELETE`). **SR** | R E |
| `dueno_negocio` | — | — | R de su propia fila | R E |
| `tarjeta_config` | — | — | R de su negocio. Escribe solo por `servidor.guardar_tarjeta_config` | R E |
| `identidad` | — | R de su fila | — (no existe política) **SR** | R E |
| `cliente_negocio` | — | R de sus filas | — (usa `cliente_del_negocio`) **SR** | R E |
| `tarjeta_cliente` | — | R de las suyas | R de su negocio (sin la llave: está en otra tabla) | R E |
| `tarjeta_llave` | — | R de la suya (la necesita para el QR sin conexión) | — **SR** (ver §7.1: el mostrador la recibe por endpoint, no por REST) | R E |
| `dispositivo` | — | — | R de su negocio. Altas y revocaciones por `servidor.*` | R E |
| `evento` | — | — (sin historial para el cliente) | R de su negocio | R E |
| `por_revisar` | — | — | R de su negocio. Resolver por `servidor.resolver_por_revisar` | R E |
| `install_token`, `envio_codigo`, `codigo_intento`, `intento_acceso_dueno`, `cuenta_pendiente_borrado`, `evento_uso` | — | — | — | R E |
| `negocio_publico` (vista) | R | R | R | R |
| `cliente_del_negocio` (vista) | — | `SELECT` permitido, devuelve 0 filas (el filtro exige rol dueño) | R de su negocio. **SR** | R |
| `mis_tarjetas` (vista) | — | R de las suyas | `SELECT` permitido, 0 filas (exige rol cliente) **SR** | R |
| Funciones `servidor.*` | — | — | — | Ejecuta |
| Ayudantes `privado.*` | — | Ejecuta (los usan las políticas) | Ejecuta | Ejecuta |
| Usuario creado a mano sin filas o con claim falso | — | 0 filas en todo | 0 filas en todo | n. a. |

### 4.3 Pruebas estructurales (pgTAP, `supabase/tests/`)

Corren con `pnpm test:db` y fallan si alguien agrega algo sin pensar en RLS:

| ID | Verifica |
|---|---|
| P-01 | Toda tabla de `public` tiene RLS activo |
| P-02 | `anon` no tiene privilegio alguno sobre tablas; solo `SELECT` sobre `negocio_publico` |
| P-03 | Ninguna función de `public`, `servidor` ni `privado` es ejecutable por `PUBLIC` o `anon`; `authenticated` solo ejecuta la lista cerrada de `privado.*` |
| P-04 | Toda función `SECURITY DEFINER` tiene `search_path` fijado en `proconfig` |
| P-05 | Las tres vistas son las únicas *definer* de `public` y ninguna expone `identidad_id` |
| P-06 | Claves foráneas: `identidad.auth_user_id` y `dueno_negocio.user_id` con `CASCADE`; `evento_uso.identidad_id` y `negocio_id` con `SET NULL` |
| P-07 | Ninguna política tiene `using (true)` ni omite `to authenticated` |
| P-08 | Los `CHECK` de §3.2 (meta 4 a 12, límite, formato del teléfono, `slug`, correcciones inmutables) rechazan lo inválido |
| P-09 | Tras `borrar_cuenta_cliente`, cero filas de `evento_uso` con `identidad_id` o `flujo_id` de esa persona |
| P-10 | `db lint` (plpgsql_check) sin errores |

### 4.4 Pruebas de RLS con llamadas directas a la API REST (`tests/rls/`)

Vitest con `fetch` a `${SUPABASE_URL}/rest/v1/...` y las cabeceras `apikey: <publishable>` y `Authorization: Bearer <access_token>`, **no** con la app, para que valgan contra alguien que se salta nuestro servidor (ADR-003 §2.6). Los usuarios de prueba se crean con la API de administración: dueños con contraseña y clientes con los teléfonos de `[auth.sms.test_otp]` (sesión real por `signInWithOtp` y `verifyOtp`). Resultado esperado: **401 o 403 con `42501`, o una lista vacía; nunca datos ajenos.**

| ID | Quién | Intenta | Debe pasar |
|---|---|---|---|
| R-01 | `anon` | `SELECT` en cada tabla (salvo `negocio_publico`) | Falla |
| R-02 | `anon` | `INSERT`, `UPDATE`, `DELETE` en `negocio`, `evento_uso`, `identidad` | Falla |
| R-03 | `anon` | `RPC` de cualquier `servidor.*` | Falla |
| R-04 | `anon` | `SELECT negocio_publico` | Solo columnas esperadas; un negocio en pausa o sin `alta_ts` no aparece |
| R-10 | Usuario creado a mano (correo y teléfono), sin filas | `SELECT` en todas las tablas y vistas | Cero filas |
| R-11 | Igual, con `app_metadata.rol = 'dueno'` forzado por admin, sin fila en `dueno_negocio` | Todo | Cero filas |
| R-12 | Igual, con `rol = 'cliente'` sin `identidad` | Todo | Cero filas |
| R-13 | Usuario que edita su `user_metadata` a `{rol: 'dueno'}` por `PUT /auth/v1/user` | Todo | Cero filas (las políticas leen `app_metadata`) |
| R-14 | Usuario que intenta escribir su propio `app_metadata` por la API de Auth | | Ignorado o rechazado; el claim no cambia |
| R-15 | Admin | Meter en `dueno_negocio` a quien ya está en `identidad`, y al revés | Error de exclusión mutua |
| R-20 | Cliente A (2 negocios) | `tarjeta_cliente`; filtrar por `id` de la tarjeta de B | Solo las suyas; la ajena, 0 filas |
| R-21 | Cliente A | `tarjeta_llave` de A y de B | Solo la suya |
| R-22 | Cliente A | `identidad` filtrando por el WhatsApp de B | 0 filas |
| R-23 | Cliente A | `cliente_negocio` de otro | 0 filas |
| R-24 | Cliente A | `negocio`, `evento`, `por_revisar`, `dispositivo`, `dueno_negocio`, `cliente_del_negocio` | Falla o vacío |
| R-25 | Cliente A | `INSERT/UPDATE/DELETE` en cualquier tabla (por ejemplo `sellos = 99`) | Falla |
| R-26 | Cliente A | `mis_tarjetas` | Solo las suyas |
| R-27 | Cliente A | `RPC servidor.*` | Falla |
| R-28 | Cliente con sesión viva | Borrar su cuenta (con admin) y reusar el access token | Cero filas, aunque el token siga vigente (ADR-003 §2.6) |
| R-30 | Dueño A | `negocio` de B por `id` | 0 filas |
| R-31 | Dueño A | `UPDATE negocio` de A en `nombre`; en `estado`, `plan`, `fin_prueba`, `alta_ts`, `tanda`, `version_producto`, `slug`; y `UPDATE` de B | Solo el primero tiene efecto; los demás fallan o afectan 0 filas |
| R-32 | Dueño A | `tarjeta_cliente` de A y de B; `tarjeta_llave` | Solo A; la llave, denegada |
| R-33 | Dueño A | `identidad`, `cliente_negocio`; `cliente_del_negocio?select=identidad_id` | Denegado; la columna no existe |
| R-34 | Dueño A | `cliente_del_negocio` | Solo clientes de A |
| R-35 | Dueño A | `INSERT/DELETE` en `tarjeta_cliente`, `evento`, `por_revisar`, `dispositivo`, `tarjeta_config` | Falla |
| R-36 | Dueño A | `evento_uso`, `envio_codigo`, `codigo_intento`, `install_token` | Falla |
| R-38 | Dueño con negocio en `pausa` | `cliente_del_negocio`, `evento`, `tarjeta_cliente` | Sigue leyendo (exportación, RF-CLI-06) |
| R-40 | Servicio | Lee todo y ejecuta `servidor.*` | Funciona (control) |

**Lo que requiere `security-review`**, antes de cerrar cada feature donde aparece: (1) migraciones 2 a 7 completas: políticas, GRANTs por columna, vistas *definer*; (2) ayudantes `SECURITY DEFINER` y `search_path`; (3) la exclusión mutua; (4) el camino que escribe `app_metadata.rol` y la ventana de la primera sesión sin rol; (5) el riesgo aceptado de ADR-003 §2.8 (intentos por código que no cubren a quien verifica directo en Supabase); (6) el endpoint de llaves y la firma de los eventos (§7); (7) las cookies y el DAL (§5); (8) la firma y los límites del hook (§6); (9) la neutralización de fórmulas del CSV (RF-CLI-06) y el servicio de logos; (10) el mecanismo A del `install_token`, incluido el correo técnico (§8, SP-2).

---

## 5. Auth y cookies

### 5.1 Principios (decididos en ADR-003 §2.4 y §2.5)

- **El navegador nunca llama a Supabase Auth** ni usa `supabase-js` (RNF-STK-10, ADR-003 §2.4). Vale para cliente **y dueño**: ninguna llamada al navegador sale de `lealtab.com`.
- Dos cookies de sesión escritas **por el servidor** con `@supabase/ssr` (0.12.7, publicado el 8 sep 2026): `lt-cliente` con `Path=/c` y `lt-dueno` con `Path=/panel`, ambas `HttpOnly`, `Secure`, `SameSite=Lax` y `Max-Age` de 400 días. La coincidencia de `Path` es por segmentos: `/c` cubre `/c` y `/c/...`, **no** `/cafe`.
- El rol vive en `app_metadata.rol` (`dueno`/`cliente`), lo escribe solo el servidor con `auth.admin.updateUserById` y nunca desde el navegador ni desde `user_metadata`.

Verificado en el código del paquete (`@supabase/ssr` 0.12.7, descargado el 22 oct 2026): los valores por defecto son `path: "/"`, `sameSite: "lax"`, **`httpOnly: false`** y `maxAge` de 400 días; `cookieOptions.name` fija el nombre (y la clave de almacenamiento); una sesión grande se parte en cookies `nombre.0`, `nombre.1` de 3,180 bytes, todas con el mismo `Path`; `setAll(cookies, headers)` recibe además `Cache-Control: private, no-cache, no-store, must-revalidate, max-age=0`, `Expires: 0` y `Pragma: no-cache`, que **hay que copiar a la respuesta** para que un CDN no entregue la sesión de uno a otro. Hay una opción `cookies.encode: "tokens-only"` (experimental) que reduce el tamaño; se prueba en SP-3, no se asume. El navegador nunca usa `createBrowserClient`.

### 5.2 Cliente: rutas `/c/api/auth/*`

| Ruta | Entra | Hace | Responde |
|---|---|---|---|
| `POST /c/api/auth/codigo` | `telefono` (10 dígitos), `flujo_id`, `proposito`, `canal` (`auto`/`sms`) | Valida; normaliza a +52; límite por IP (10 por hora, `envio_codigo.ip_hash`); revisa bloqueo de 15 min (`codigo_intento`); inserta `envio_codigo` en `solicitado`; llama a `signInWithOtp({ phone, options: { shouldCreateUser: true } })` **sin `channel`**, con un cliente sin persistencia (`persistSession: false`) para que no escriba cookies | Siempre el mismo 200 «Te enviamos un código», exista o no el teléfono. Si el hook falla: el mismo error genérico |
| `POST /c/api/auth/verificar` | `telefono`, `codigo`, `flujo_id`, y (si es registro) `negocio_slug`, `nombre`, `acepto` | Revisa bloqueo; `verifyOtp({ phone, token, type: 'sms' })` con `createServerClient` y cookie `lt-cliente`. Fallo: registra `codigo_intento`. Éxito: (1) `updateUserById` con `rol = 'cliente'` si falta, tras comprobar que no es dueño; (2) `refreshSession()` para que el JWT lleve el rol; (3) `servidor.registrar_cliente`; (4) en recuperación, `signOut({ scope: 'others' })` (ver PQ-36 en SP-2) | Estado de la tarjeta; el mismo cuerpo para teléfono nuevo y existente |
| `POST /c/api/auth/segundo-negocio` | `negocio_slug`, `nombre`, `acepto` | Exige sesión (`getClaims()`); llama a `servidor.registrar_cliente` (reutiliza la identidad). **Sin código** (RF-APP-04) | Estado de la tarjeta |
| `POST /c/api/auth/install`, `/canjear` | | `install_token` según SP-2 | |
| `POST /c/api/auth/salir` | | Borra la cookie (`maxAge: 0`, mismos `Path` y nombre) | |
| `POST /c/api/cuenta/borrar` | casilla | `servidor.borrar_cuenta_cliente`, luego `auth.admin.deleteUser`; si falla, `cuenta_pendiente_borrado`; borra la cookie | |

Reintento tras verificar (PQ-38, **propuesta**): si el código ya se verificó y `registrar_cliente` falla, la **sesión es la prueba**, no hace falta otra ventana ni otro código. La pantalla ofrece «Reintentar» y llama a `segundo-negocio` con el nombre guardado en `sessionStorage` (CA-C1.14). Si ese estado se perdió, se cae en R1 con sesión (pide nombre y consentimiento). Un usuario con teléfono verificado y sin `identidad` tras 24 h entra a `cuenta_pendiente_borrado` y el cron lo elimina.

### 5.3 Dueño: rutas `/panel/api/auth/*`

| Ruta | Hace |
|---|---|
| `POST …/codigo` | `signInWithOtp({ email, options: { shouldCreateUser: true } })`, misma respuesta exista o no el correo. El código llega por SMTP de Resend con una plantilla que muestra `{{ .Token }}` (no un enlace) y vigencia de 10 minutos (`[auth.email] otp_expiry = 600`, 6 dígitos, `max_frequency = "60s"`) |
| `POST …/verificar` | `verifyOtp({ email, token, type: 'email' })`, cookie `lt-dueno`. Si el usuario aún no tiene negocio, el panel lo manda a N2 |
| `POST …/contrasena` | Revisa `intento_acceso_dueno` (5 fallos para el mismo correo pausan **solo** la contraseña 15 min; el código y las sesiones abiertas no se ven afectados, RF-ALT-02c); `signInWithPassword`; error siempre genérico |
| `POST …/contrasena/crear` | Con sesión y un código reciente al correo, `updateUser({ password })` (RF-ALT-02, N8 → Acceso). 8 a 72 caracteres sin reglas de composición: `minimum_password_length = 8` y tope de 72 en nuestro servidor |
| `POST …/restablecer/codigo` y `…/confirmar` | `resetPasswordForEmail` (plantilla de `recovery` con `{{ .Token }}`); `verifyOtp({ email, token, type: 'recovery' })`; `updateUser({ password })`; si marcó «Cerrar sesión en mis otros dispositivos», `signOut({ scope: 'others' })` (RF-ALT-02b) |
| `POST /panel/api/negocio` | Con sesión **sin rol** (acaba de entrar): `servidor.crear_negocio`, luego `updateUserById` con `rol = 'dueno'` y `refreshSession()` |
| `POST …/salir` | Borra `lt-dueno` |

**Guardia en el servidor (DAL).** `requireCliente()` y `requireDueno()` en `src/lib/auth/dal.ts` verifican con `getClaims()` (firma y vigencia del JWT) y el rol. Las acciones sensibles (borrar, crear contraseña, aprobar o descartar, corregir sellos) además usan `getUser()`, que es la única forma de detectar una sesión terminada en otro dispositivo ([guía de SSR](https://supabase.com/docs/guides/auth/server-side/advanced-guide), 22 oct 2026). El `proxy` **no autoriza**, solo refresca y hace una redirección optimista ([proxy.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md)).

### 5.4 Asignación del rol

1. `verifyOtp` crea o reutiliza al usuario y abre la sesión **sin rol**; esa sesión no ve nada (§4.1).
2. El servidor, ya con el usuario verificado, comprueba la exclusión mutua y escribe el rol con `updateUserById`. `[SUPUESTO: que `app_metadata` se fusiona y no se reemplaza; lo confirma SP-3]`.
3. `refreshSession()` emite un JWT con el rol y `setAll` actualiza la cookie en la misma respuesta.

**Alternativa por probar (SP-5):** un *custom access token hook* que derive el claim de las tablas en cada emisión (también en `token_refresh`; la página lo da a entender, no lo afirma). Las políticas no cambian porque siguen leyendo `app_metadata.rol`. No se adopta sin la prueba; si el hook de base falla, el inicio de sesión **no** debe romperse (devolver el evento sin rol). El plan gratuito lo incluye ([pricing](https://supabase.com/pricing), 22 oct 2026).

### 5.5 `proxy.ts` (Next 16.4)

`middleware` pasó a llamarse **`proxy`**, corre en Node.js por defecto, no admite la opción `runtime` y va en `src/proxy.ts` ([proxy.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md)).

- `matcher` fijo y constante: `/c/:path*` y `/panel/:path*`, **excluyendo** `/c/api/auth/:path*` y `/panel/api/auth/:path*` (esas rutas manejan sus propias cookies; refrescar dos veces la misma sesión rompe la rotación del token), `/c/manifest.webmanifest`, `/c/sw.js` y `/c/logo/:path*`.
- Hace: elegir el adaptador por prefijo (`lt-cliente` en `/c`, `lt-dueno` en `/panel`); **si la petición no trae esa cookie, no hace nada** (una visita anónima al QR no cuesta una verificación); `getClaims()`; si renovó el token, `setAll` escribe las cookies en la petición y en la respuesta y copia `Cache-Control: private, no-store`.
- Redirección optimista: `/panel/*` sin cookie `lt-dueno`, salvo `/panel/entrar` y `/panel/alta`, va a `/panel/entrar`. No hay redirección optimista en `/c/*` (la tarjeta pública funciona sin sesión).
- Las peticiones paralelas que renuevan el mismo token se cubren con los 10 s de tolerancia del reúso del *refresh token*; SP-3 lo prueba con varias peticiones simultáneas y con el service worker.

### 5.6 Qué cambia en la configuración de Auth (local y alojado)

| Ajuste | Valor | Fuente |
|---|---|---|
| `[auth] enable_signup` / `enable_anonymous_sign_ins` / `enable_manual_linking` | `true` / `false` / `false` | ADR-003 §5: sin inicio anónimo |
| `[auth] jwt_expiry`, `enable_refresh_token_rotation`, `refresh_token_reuse_interval` | `3600`, `true`, `10` | Plantilla del CLI; ADR-003 §1 |
| `[auth.sms] enable_signup` | **`true`** (la plantilla trae `false`) | Hace falta para `shouldCreateUser` |
| `[auth.sms] max_frequency` | `60s` `[SUPUESTO: valor aceptado]` | ADR-003 §2.8 |
| OTP de teléfono: vigencia 10 min | La plantilla local **no trae** `otp_expiry` para SMS (solo para correo); en el proyecto alojado hay un ajuste en el panel `[SUPUESTO]` | SP-4 |
| `[auth.hook.send_sms]` | `enabled = true`, `uri = "http://host.docker.internal:3000/api/hooks/send-sms"` en local, `secrets = "env(SEND_SMS_HOOK_SECRET)"` | [config del CLI](https://supabase.com/docs/guides/local-development/cli/config); en Linux, `host.docker.internal` pide `--add-host` `[SUPUESTO]` |
| `[auth.sms.test_otp]` | Teléfonos fijos con código fijo, **solo local**, para pruebas | Plantilla del CLI. Si con `test_otp` Supabase no llama al hook, se prueba la ruta del hook firmando a mano una carga (§6) |
| `[auth.email] otp_length / otp_expiry / max_frequency` | `6` / `600` / `60s` | RF-ALT-02, RF-ALT-02b |
| `[auth.email] enable_confirmations` | `false` | El código verifica |
| `[auth.email.smtp]` (alojado) | Resend por SMTP, `pass = env(RESEND_API_KEY)`, remitente «LealTab» `[SUPUESTO: host y puertos de Resend, verificar al configurar]` | D-024 |
| Plantillas `magic_link`, `confirmation`, `recovery` | Muestran solo `{{ .Token }}` y los 10 minutos; sin `{{ .ConfirmationURL }}` | RF-ALT-02 |
| `[auth.rate_limit] sms_sent` | **100** (de 30) | D-024, ADR-003 §2.8 |
| `[auth.rate_limit] sign_in_sign_ups`, `token_verifications`, `token_refresh` | Subirlos mucho: todas las llamadas salen de pocas IP de Vercel. Valores **por definir** en SP-4 | ADR-003 §2.8 |
| `[auth.rate_limit] email_sent` | Subirlo `[SUPUESTO: 30 por hora]` con SMTP propio | Un día de arranque trae varios códigos de dueño |
| `[auth.sessions]` | Comentado: no aplica en Free | Limitación aprobada (ADR-003 §2.4) |
| `[auth] minimum_password_length` | `8` | RF-ALT-02b |
| `[realtime]`, `[edge_runtime]`, `[analytics]` locales | `enabled = false` | No se usan; ahorran contenedores |
| `[storage.buckets.logos]` | `public = false`, 512 KiB, `image/png`, `image/jpeg`, `image/webp` (nunca SVG) | Plantilla del CLI (sintaxis de buckets) |

Cambiar el proyecto **alojado** (esquemas expuestos, límites, SMTP, hook, plantillas, vigencia del OTP) es una lista de verificación manual o `supabase config push` `[SUPUESTO: la página de `config push` no dice qué secciones aplica]`. El desarrollador la deja en `docs/fase-7/checklist-proyecto-supabase.md`, con la región y el resultado de `show server_version`.

### 5.7 Cómo se prueba que el navegador nunca llama a Supabase Auth

Cuatro capas, de más barata a más cara:

1. **Estático.** `eslint` con `no-restricted-imports`: `createBrowserClient` y `@supabase/supabase-js` solo dentro de `src/lib/supabase/` (y ahí, `server-only`). No existe `browser.ts`.
2. **Artefacto.** `pnpm check:cliente` busca en `.next/static` (JS y CSS del cliente) `supabase.co`, `54321`, `sb_publishable` y `sb_secret`; falla si aparece alguno.
3. **Navegador, en producción.** CSP `connect-src 'self'; img-src 'self' data: blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'` **solo en `/c/:path*` y `/panel/:path*`** (nunca en la landing, que no se toca) y **solo con `NODE_ENV=production`** para no romper el HMR. No lleva `script-src`: con una política estricta Next exige *nonces* y eso obliga a renderizar todo en cada petición, lo que pelea con `cacheComponents`.
4. **Playwright** (`e2e/producto/no-terceros.spec.ts`), por proyecto de navegador: recorre C1 (dos pasos), `/c/recuperar`, N1 (código y contraseña) y el panel; **toda petición** (incluidas las del service worker) debe ir al origen de la app; ninguna respuesta lleva `Set-Cookie` salvo `lt-cliente*` y `lt-dueno*` con los atributos esperados; `/` no recibe ninguna cookie. Las rutas que **deben** dar 4xx (límite, bloqueo) se prueban con la fixture `request`, no con `page`, porque `guard` falla toda respuesta ≥ 400.

Pruebas de cookies que usan lo mismo (SP-3): atributos exactos de `Set-Cookie`; `document.cookie` no ve `lt-*`; dueño y cliente conviven en el mismo navegador sin pisarse; una petición a `/panel` no lleva `lt-cliente` y una a `/c` no lleva `lt-dueno`; peticiones paralelas con el token vencido no matan la sesión.

---

## 6. Hook de SMS (`/api/hooks/send-sms`)

**Decidido (ADR-004).** Supabase genera y verifica el código; el hook solo lo envía. `signInWithOtp` se llama sin `channel`; el hook decide el canal real. Nunca se llama a `/v2/otp/verify`, nunca se usa `code_in_response`, nunca se registra el código ni el teléfono en los logs.

### 6.1 Flujo de la ruta

1. **Firma.** Lee el cuerpo crudo (`await request.text()`) y lo verifica con Standard Webhooks (`standardwebhooks` 1.1.1, MIT) y los encabezados `webhook-id`, `webhook-timestamp`, `webhook-signature`. El secreto es `SEND_SMS_HOOK_SECRET`; la guía de Supabase quita el prefijo `v1,whsec_` antes de crear el verificador ([hook de SMS](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook), 22 oct 2026). Firma inválida: 401 sin detalle.
2. **Carga.** Espera `user` (con `phone`) y `sms.otp` de 6 dígitos. La página no documenta otros campos (ni IP, ni canal).
3. **Teléfono.** Normaliza (deja 10 dígitos si empieza con `52`); cualquier otro país o formato se rechaza (RF-APP-03).
4. **Autorización.** `servidor.autorizar_envio_codigo(p_telefono)`, en una transacción con un candado consultivo por teléfono: toma la fila `solicitado` más reciente de `envio_codigo` (menos de 2 minutos) o crea una (caso «llamada directa a Supabase», sin IP) y la marca con `hook_ts`; luego aplica, leyendo `config_plataforma`: 3 por hora y 10 al día por teléfono; tope global de 400 al día. Devuelve `permitido`, el motivo y la `canal_intencion`. Si denegó: responde error 429 con el formato `{"error":{"http_code":429,"message":"limite"}}` y registra `rechazado_limite`.
5. **Aviso.** Al llegar a 200 envíos del día, manda un correo a `ALERT_EMAIL_TO` (API HTTP de Resend) una sola vez por día, marcando la fecha en `config_plataforma`.
6. **Canal y proveedor.** `POST https://api.smsmasivos.com.mx/v2/otp` con el encabezado `apikey` y: `phone_number`, `country_code: 52`, `company: "LealTab"`, `code_custom` igual al código de Supabase, `code_rotate: true`, `expiration_date` a 10 minutos, `channel` y, en modo sandbox, `sandbox: 1`. Primer envío por WhatsApp (salvo `canal_intencion = 'sms'`); si responde `502`, `5xx` o agota el tiempo, **reintenta en la misma llamada por SMS** con el texto `{{company}}: tu clave es {{code}}. Vence en 10 min. No la compartas.` (GSM-7, sin acentos, PQ-40). Presupuesto de tiempo de trabajo: 6 s por canal y 15 s en total `[SUPUESTO, PQ-39]`.
7. **Cierre.** Actualiza `envio_codigo` (`canal`, `resultado`, `request_id`). Éxito: 200 con cuerpo vacío. Los dos canales fallaron: 502 `{"error":{"http_code":502,"message":"proveedor"}}` y aviso a Aarón (R-18). Si fallan 3 de los últimos 10 envíos, también avisa.

`SMS_PROVIDER_MODE`: `live` (producción), `sandbox` (vistas previas; `sandbox: 1`) y `stub` (local: no llama a nadie y deja `[HOOK] enviado` sin el código en el log; **la app se niega a arrancar en modo `stub` si `LT_ENV` no es `local`**).

### 6.2 Límites: quién impone qué

| Límite | Dónde | Observación |
|---|---|---|
| 3 por hora y 10 al día por teléfono; 400 globales; solo móviles de México | **El hook** (paso obligado, también para quien llama a Supabase directo) | ADR-003 §2.8 |
| 10 por hora por IP, 5 intentos por código y bloqueo de 15 min | Nuestro servidor (`/c/api/auth/*`) con `envio_codigo.ip_hash` y `codigo_intento` | No cubre a quien verifica directo: riesgo aceptado, pasa a `security-review` |
| Espera de 60 s entre envíos | Supabase y la pantalla | |
| 100 SMS por hora y topes por IP de Supabase | Ajustes del proyecto | SP-4 |

La IP sale de `x-forwarded-for` (primer valor), que Vercel fija en la entrada `[SUPUESTO: Vercel sobrescribe el valor del cliente; verificar con un encabezado falso en una vista previa]`. Se guarda solo el HMAC.

### 6.3 Qué se prueba

- **En el spike (SP-1):** que Supabase llame al hook sin proveedor nativo ni `channel`; que `code_custom` entregue **exactamente** el código de Supabase (también en reenvíos); la entrega real por Telcel, AT&T y Movistar en iPhone y Android, en los dos canales; el tiempo máximo del hook (PQ-39).
- **En cimientos B, sin Supabase en medio:** la ruta con una carga firmada a mano (prueba de integración): firma buena y mala, teléfono extranjero, límites por teléfono y globales, reintento por SMS, modo `stub` bloqueado fuera de local, el código ausente de los logs.

---

## 7. Sincronización sin conexión y validación en el servidor

**Decidido:** D-014, D-015, RF-SEL-04 a 15, RNF-OFF-01 a 06. Esta sección baja el flujo a pasos; la **propuesta ADR-008** son las partes marcadas.

### 7.1 Dispositivos y llaves

- **Registro del dispositivo** (al abrir N5 por primera vez): WebCrypto crea un par ECDSA P-256 con la privada **no exportable** (`extractable: false`), guardada como `CryptoKey` en IndexedDB. El navegador manda la pública (SPKI) y un nombre; `servidor.registrar_dispositivo` la guarda. `[SUPUESTO: Safari de iOS guarda `CryptoKey` en IndexedDB y firma con ECDSA P-256; lo confirma la prueba de N5]`.
- **Llaves HMAC para validar sin red (propuesta, aclara ADR-003 §2.6 frente a RNF-OFF-03).** El dueño **no** lee `tarjeta_llave` por REST, pero el mostrador necesita las llaves de las tarjetas de su negocio para validar el QR sin conexión. Se entregan por `GET /panel/api/llaves` (`servidor.llaves_del_negocio`), que exige sesión de dueño y un `dispositivo_id` registrado y no revocado, devuelve solo las llaves de **su** negocio y registra el acceso. El navegador las guarda cifradas con una clave AES-GCM no exportable (RNF-OFF-03) y las refresca en cada sincronización. Un dueño puede, en teoría, sacarlas de la memoria: solo le sirve para falsificar QR de sus propios clientes. `security-review`.
- Una tarjeta nueva que el mostrador aún no tiene en caché recibe un sello **provisional** que se valida al sincronizar (RF-SEL-13).
- Safari borra IndexedDB de un sitio no instalado tras 7 días sin uso (ADR-001 H9) y `/panel/` no es una PWA. Si desaparece la clave del dispositivo, el mostrador se registra de nuevo como otro dispositivo; lo que estuviera en la cola sin enviar se pierde. Se pide almacenamiento persistente (`navigator.storage.persist()`) y se mide con `mostrador_reabierto_tras_caida`.

### 7.2 Qué viaja y qué se valida

Cada evento (RNF-OFF-02): `event_id` (UUID v4), `tipo`, `card_id`, `qr_step`, `qr_mac`, `device_ts`, `device_id`, `modo` y `firma` ECDSA P-256 sobre una cadena canónica `event_id|tipo|card_id|qr_step|qr_mac|device_ts|device_id`. Formato del QR (RF-SEL-04): `card_id`, `paso` (`floor(t / 60 s)`) y `HMAC-SHA256(llave, card_id|business_id|paso)`. **Propuesta, con `security-review` y SP-6:** codificar `card_id` como 16 bytes y truncar el MAC a 16 bytes (128 bits, válido para un HMAC) para que el QR tenga menos módulos y escanee mejor; la prueba del spike compara los dos tamaños.

### 7.3 Envío y revalidación (`POST /panel/api/sync`)

- **Cuándo envía el navegador** (RNF-OFF-04): al abrir N5, en `visibilitychange`, con el evento `online`, cada 30 s y con el botón «Sincronizar». Espera exponencial y el mismo `event_id`. Background Sync **no es requisito**: en Safari de iOS no existe ([caniuse](https://caniuse.com/background-sync), consultado el 21 oct 2026). **N5 debe abrirse con conexión.**
- **Lote:** hasta 50 eventos ordenados por `device_ts`. Cada evento se procesa en su propia transacción; la respuesta lista el resultado de cada uno y el navegador borra de la cola solo lo que recibió.
- **Identificación:** sesión `lt-dueno` con rol de dueño; el `dispositivo_id` debe pertenecer a su negocio y no estar revocado.

Pasos de `servidor.registrar_eventos`, por evento (en una sola función `plpgsql`; las llaves nunca salen de la base):

1. **Idempotencia.** `insert … on conflict (event_id) do nothing`. Si ya existía con el mismo negocio, responde el resultado anterior sin tocar nada. Si existía con otro negocio, rechaza.
2. **Hora efectiva.** `ts_efectivo = min(device_ts, recibido_ts)` y nunca menor que `recibido_ts − 72 h` (RNF-OFF-04); un `device_ts` en el futuro se trata como `recibido_ts`.
3. **Firma.** Verifica el ECDSA con la pública del dispositivo. Falla: `rechazado`, motivo `firma`.
4. **Tarjeta.** Debe pertenecer a su negocio (si no, M3). Si ya no existe (cuenta borrada), queda descartada como `tarjeta_baja`: cuenta en el resultado pero no va a Por revisar ni deja datos personales (RF-SEL-15).
5. **QR.** Recalcula el HMAC con `extensions.hmac` y la llave de la tarjeta. En línea acepta ±2 pasos respecto de `ts_efectivo`; sin conexión, hasta 10 min de gracia (RF-SEL-04). Falla: `qr_vencido`. `[SUPUESTO: la comparación `=` en SQL basta; el atacante es un dueño autenticado que solo puede sondear las tarjetas de su propio negocio]`.
6. **Cuenta.** Con el estado efectivo en `pausa` a `ts_efectivo`, el evento se rechaza con `cuenta_pausada` (propuesta, PQ-N4). Un sello dado antes del fin de la prueba que sincroniza después sí cuenta.
7. **Reglas del sello** (en este orden): bloqueo fijo de 2 min contra doble escaneo (`duplicado`, RF-SEL-07); límite según `limite_modo`: `por_dia` (el «día» es `ts_efectivo AT TIME ZONE negocio.zona_horaria`, nunca la zona del teléfono), `cada_x_horas` (ventana móvil desde el último sello aceptado, con piso de 2 min) o `sin_limite` (`limite`, RF-SEL-05 y 06).
8. **Canje** (RF-SEL-10 y 14): la tarjeta debe estar completa a `ts_efectivo`; sin conexión, máximo 1 canje por tarjeta mientras dure la caída y solo con la caché sincronizada en las 24 h previas (lo declara el dispositivo; el servidor solo verifica la completitud). Un segundo canje: `doble_canje`.
9. **Resultado.** `aceptado` (actualiza la tarjeta) o `rechazado` con motivo y una fila en `por_revisar` (salvo `tarjeta_baja`). Cada resultado vuelve al navegador junto con los sellos resultantes.

Después del lote se emiten `sello_registrado`, `sello_bloqueado`, `canje_registrado` y `sync_completada` (aceptados, rechazados, descartados) por el servidor, con el `modo` del evento. Un bloqueo que el mostrador aplicó localmente sin conexión y que nunca llegó al servidor **no se cuenta** (límite conocido de `medicion.md` §2).

El mismo `servidor.registrar_eventos` atiende el sello en línea (un lote de 1, `modo = 'linea'`, p95 ≤ 800 ms, RNF-REN-04).

### 7.4 Conflictos entre dispositivos y recálculo (**propuesta ADR-008**)

RNF-OFF-05 pide ordenar por `device_ts` validado y que, en un empate, gane el primero recibido; y que, si dos dispositivos dan sello al mismo cliente el mismo día, se acepte el primero y el otro vaya a Por revisar. Si un evento antiguo llega después de uno más nuevo ya aceptado, **el orden de llegada no basta**. Propuesta:

- `servidor.recalcular_tarjeta(tarjeta_id)` es la **única** forma de fijar `sellos`, `ultimo_sello_ts` y `ultima_visita_ts`: recorre los eventos aceptados de esa tarjeta desde el último canje, en orden de `(ts_efectivo, recibido_ts)`, aplica las reglas del paso 7 y marca como `rechazado` (con su fila en `por_revisar`) los que ya no caben. El conteo siempre se recalcula en el servidor (RNF-OFF-01).
- Se toma un `SELECT … FOR UPDATE` de la fila de `tarjeta_cliente` al empezar, de modo que dos sellos de la misma tarjeta se serializan y dos tarjetas distintas corren en paralelo (RNF-REN-02: 10 sellos por minuto por negocio y 140 entre todos los de la primera tanda).
- **Prueba de propiedades** (Vitest con `fast-check`, nuevo, solo desarrollo): el resultado final de un conjunto de eventos **no depende del orden de llegada** entre lotes. Es el criterio de aceptación del feature `mostrador-sin-conexion`.
- Alternativa más simple, descartada por defecto: «gana el primero que llega». Rompe RNF-OFF-05 al pie de la letra; solo se adopta si Aarón acepta ese cambio.
- **Los eventos del sello de bienvenida no consumen el límite del día** `[SUPUESTO, PQ-N3]`: si lo consumieran, el cajero no podría dar el sello de esa primera visita.

### 7.5 Resultado para el mostrador y el dueño

La respuesta alimenta M6 («N sincronizados, M por revisar», con el motivo y un enlace a Clientes → Por revisar) y el indicador de sincronización (RF-SEL-12). `aria-live="polite"` en el resultado (RF-SEL-17). El dueño resuelve con `servidor.resolver_por_revisar` («Aprobar de todos modos» pasa el evento a `aceptado`, **recalcula** la tarjeta y deja la bitácora; «Descartar» lo deja `rechazado`).

---

## 8. Spikes

**Todos entregan un informe obligatorio** en `docs/fase-7/spikes/<id>-<slug>.md` con: objetivo, entorno (versión del CLI, etiqueta de Auth, iOS y Android exactos), pasos, tabla de resultados (pasa o no pasa por criterio), evidencia sin datos personales (capturas y logs recortados), **decisión** y qué documento hay que cambiar. Sin informe, el feature que depende no se considera desbloqueado. El código del spike va en `web/spikes/` y no se despliega.

**Entornos de prueba.** (a) **Local** (Docker): esquema, RLS, cookies, hook con proveedor `stub`. (b) **Proyecto alojado de pruebas** (`lealtab-pruebas`, gratuito) con un **túnel HTTPS temporal** al `next dev` local (Cloudflare Tunnel o similar `[SUPUESTO: herramienta a elegir]`): permite que el hook alojado llame a tu máquina y que el iPhone abra la app por HTTPS. Las vistas previas de Vercel no sirven para el hook por su protección de despliegue. (c) **Dominio real** (`www.lealtab.com`) para lo que depende de ITP y de la PWA instalada; antes de abrir a los pilotos.

| ID | Pregunta | Cubre | Bloquea | Local o dispositivos |
|---|---|---|---|---|
| SP-0 | ¿`supabase db push --db-url` corre desde el build de Vercel por el *pooler* IPv4, sin `login`, y una migración fallida deja la base intacta? | RNF-STK-15 | `cimientos-entorno-esquema` (cierre) | Vercel de pruebas con el proyecto de pruebas |
| SP-1 | ¿El hook se dispara sin proveedor nativo? ¿`code_custom` entrega el código exacto? ¿Cuánto tarda el hook? ¿Enumeración? | PQ-30, PQ-39, ADR-003 pruebas 1, 6 y 7 | C1 y `/c/recuperar` | Local + alojado + dispositivos y operadores |
| SP-2 | `install_token` de iOS: ¿mecanismo A o B? ¿`signOut others` mata a la PWA? | PQ-31, PQ-36, PQ-37, ADR-003 prueba 2 | Instalación en iOS (C2) | iPhone iOS 18 y 26 |
| SP-3 | Cookies de `@supabase/ssr`: atributos, convivencia, tamaño, ráfagas, ITP | ADR-003 prueba 4 | C1, N1 | Local + iPhone |
| SP-4 | ¿El plan gratuito permite 100 SMS por hora, topes por IP altos y 10 min de OTP? ¿`Sb-Forwarded-For`? | ADR-003 prueba 3 | C1 | Alojado |
| SP-5 | ¿El *custom access token hook* da el rol sin ventana ni `updateUserById`? | RNF-STK-04 («Por definir») | Nada (optimización) | Local + alojado |
| SP-6 | Librería de escaneo de QR | PQ-25, RNF-STK-07 | N5 | iPhone iOS 18 y 26, Android |

### SP-0 · Migraciones en el build

1. En un proyecto Vercel de pruebas con el proyecto Supabase de pruebas: `scripts/vercel-build.sh` con `VERCEL_ENV=production` simulado y una migración válida.
2. Una migración que falla a la mitad (`create table` y luego un error).
3. Una vista previa con `SUPABASE_DB_URL_MIGRACIONES` ausente.

**Pasa si:** (1) la migración se aplica y se ve el `--dry-run` en el log; (2) la base queda **sin** la tabla creada antes del error y el build falla; (3) la vista previa no toca la base. **No pasa si:** la conexión por *pooler* falla, se exige `supabase login`, o una migración fallida deja cambios a medias (entonces, migraciones de una sentencia por archivo y respaldo antes de empujar).

### SP-1 · Hook sin proveedor nativo (PQ-30)

1. `signInWithOtp({ phone })` sin `channel`, con `[auth.sms] enable_signup = true`, el hook habilitado y **ningún proveedor** de SMS. En local y en el proyecto alojado (la interfaz del panel puede exigir un proveedor aunque el motor no lo haga).
2. Con `code_custom` y `code_rotate: true` (proveedor en `sandbox`), pedir el código, reenviarlo y verificar con `verifyOtp`.
3. Entrega real: 10 envíos por combinación de operador (Telcel, AT&T, Movistar) × dispositivo (iPhone, Android) × canal (WhatsApp, SMS).
4. Tiempo del hook: respuesta artificial de 5, 10, 15, 20 y 30 s; medir cuándo Supabase falla; medir el tiempo real de la API de SMS Masivos.
5. Enumeración: 50 peticiones a un teléfono nuevo y 50 a uno existente (`signInWithOtp` y `verifyOtp`): cuerpo, estado y tiempo.
6. Teléfono: `auth.users.phone` sin `+`; la función de normalización contra `identidad.whatsapp`.
7. Con `[auth.sms.test_otp]`, ¿se llama al hook?

**Pasa si:** (1) el hook recibe `user.phone` y `sms.otp` sin proveedor, en local **y** en alojado; (2) el código entregado es idéntico al de Supabase, incluso en reenvíos; (3) la entrega llega en ≤ 30 s en ≥ 9 de 10 por combinación `[SUPUESTO: umbral]`; (4) una respuesta de hasta 15 s no hace fallar a Supabase (si el máximo es menor, se reparte el presupuesto: WhatsApp 6 s y SMS 6 s menos); (5) las respuestas son idénticas en cuerpo y estado, y la diferencia de la mediana de tiempo entre nuevo y existente es < 50 ms `[SUPUESTO: umbral]`.
**No pasa si** Supabase responde «proveedor no configurado» antes de llamar al hook. **Salidas** (ADR-003 §3, sin elegir ninguna antes de la prueba): (a) proveedor nominal de Twilio con credenciales de relleno, si el hook tiene prioridad; (b) código propio sin Supabase Auth, que contradice D-031 y D-023 y **se lleva a Aarón**. Si falla (3), se evalúa el respaldo SMS por defecto para ese operador; si falla (5), se iguala el tiempo con una espera mínima.

### SP-2 · `install_token` de iOS (PQ-31, PQ-36, PQ-37)

Prueba previa **(cero):** al «Agregar a inicio» desde Safari, ¿la app instalada hereda la cookie `lt-cliente`? Una fuente de terceros afirma que Safari copia cookies al instalar (desde iOS 17.2) `[SUPUESTO sin fuente oficial]`; ADR-001 H6 dice lo contrario. Si la hereda, el `install_token` pasa a ser respaldo y el costo de MET-06 baja.

**Mecanismo A** (ADR-003 §2.3): el servidor asigna al usuario un correo técnico (`<uuid>@cliente.lealtab.invalid`, confirmado), `auth.admin.generateLink({ type: 'magiclink' })` y canje con `verifyOtp({ token_hash, type: 'magiclink' })`. La página de `generateLink` solo describe los tipos de enlace; no confirma qué devuelve (consultada el 22 oct 2026).

| # | Criterio de A | Pasa si |
|---|---|---|
| A1 | `generateLink` devuelve un `hashed_token` utilizable | Sí, **y no se envía ningún correo** (se revisa Mailpit y Resend) |
| A2 | Canje en la PWA instalada, iOS 18 y 26 | Abre una **sesión distinta** a la de Safari (`session_id` distinto) |
| A3 | Rotación | Safari y la PWA refrescan por separado al menos 3 veces en 2 horas y ninguna sesión termina |
| A4 | Un solo uso | El segundo canje del mismo token falla |
| A5 | El correo técnico no recibe códigos | Tras el canje, `signInWithOtp({ email })` contra ese correo **no** envía nada (o el correo se retira). Si pudiera enviarse, un atacante agotaría `email_sent` y bloquearía los códigos del dueño |
| A6 | `history.replaceState` quita el token de la URL | Sí |

**Pasa A** si cumple A1 a A6 en iOS 18 y 26. **Si no, B:** la PWA pide un código nuevo al abrirse (un mensaje más por iPhone que instala). Se registra la decisión: ADR condicional.

**PQ-36.** Tras verificar un código en Safari con `signOut({ scope: 'others' })`, ¿sigue viva la sesión de la PWA instalada en el mismo iPhone? **Pasa si** sobrevive. Si muere: no llamar a `others` cuando existe una sesión instalada reciente, o llamarlo solo desde `/c/recuperar` con un teléfono distinto del de la sesión; la decisión pasa por `security-review` y por Aarón.

**PQ-37.** Teléfono anterior tras una recuperación (access token de hasta 1 h y llaves HMAC locales). **Propuesta, `security-review`:** basta con revocar con `others` y con que la RLS por filas no dependa del token; **no rotar las llaves** en el MVP. Quien tiene el teléfono viejo desbloqueado ya podía dar sus sellos, y el límite del día los acota. La rotación de llaves (con ventana de 24 h para la anterior) se deja como mejora. Por el mismo camino, quien recibe un número reasignado recupera las tarjetas del dueño anterior: es inherente a la identidad por teléfono (D-031) y pasa a la consulta legal.

**Necesita dispositivos reales:** iPhone con iOS 18 y otro con 26 (RNF-PWA-07), HTTPS.

### SP-3 · Cookies (ADR-003 prueba 4)

| # | Criterio | Pasa si |
|---|---|---|
| C1 | Atributos | `Set-Cookie` de `lt-cliente` y `lt-dueno` con `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/c` o `/panel`, `Max-Age` = 400 días; `document.cookie` no las ve |
| C2 | Convivencia | Las dos sesiones en el mismo navegador sin pisarse; una petición a `/panel` no trae `lt-cliente` y una a `/c` no trae `lt-dueno` |
| C3 | Fusión de `app_metadata` | `updateUserById` con `{ rol }` conserva `provider` y `providers` `[SUPUESTO]` |
| C4 | Tamaño | Tamaño de cada cookie con y sin `cookies.encode: 'tokens-only'`; los fragmentos `.0`, `.1` comparten `Path` |
| C5 | Ráfaga | Seis peticiones paralelas con el access token vencido (en local con `jwt_expiry` bajo): ninguna sesión termina; incluye el service worker |
| C6 | ITP | En Safari de iPhone, la cookie escrita por el servidor muestra una expiración > 30 días en el Inspector. Si Safari la acorta a 7 días, el plan es una renovación deslizante por visita y la limitación pasa al aviso |

C1 a C5 corren en local con Playwright. C6 pide un iPhone, y se repite en el dominio real.

### SP-4 · Límites de Auth (ADR-003 prueba 3)

En el proyecto alojado gratuito: subir `sms_sent` a 100, `sign_in_sign_ups`, `token_verifications` y `token_refresh` a un valor alto, y la vigencia del OTP de teléfono a 600 s; probar con ráfagas. Con un encabezado `Sb-Forwarded-For` distinto por llamada, ¿el límite por IP se separa? **Pasa si** los valores se guardan y se cumplen. **No pasa si** el plan gratuito no los deja subir: queda en la decisión de Aarón (plan de pago, PQ-29), y mientras tanto se calcula el tope de registros por hora que sí aguanta.

### SP-5 · *Custom access token hook*

Función de base que deriva `app_metadata.rol` (teléfono sin correo, o con `identidad`: `cliente`; correo con fila en `dueno_negocio`: `dueno`; en otro caso, nada). **Pasa si:** el claim aparece en el primer token tras `verifyOtp` de una identidad ya existente y en cada `token_refresh`; un error dentro de la función no rompe el inicio de sesión; `supabase_auth_admin` tiene los `GRANT` exactos y ningún otro rol puede ejecutarla. Beneficio esperado menor al supuesto: una identidad **nueva** sigue necesitando `registrar_cliente` y un refresco, porque no existe aún al emitirse el primer token. Si pasa, es un ADR condicional; si no, sigue el camino de `updateUserById`.

### SP-6 · Librería de escaneo (PQ-25) — va en el brief de `mostrador-n5`, no en los cimientos

`qr-scanner` (1.4.2, última versión del 23 nov 2022, MIT) y `barcode-detector` (3.2.3, 19 oct 2026, MIT; ZXing-C++ en WebAssembly) con el `.wasm` **autoalojado** desde un archivo de `web/public/`, cargado con `prepareZXingModule` y `locateFile` (por defecto lo pide a jsDelivr, un tercero). Se prueban en páginas aparte con los **nueve criterios de `pq-arquitectura.md` §6.1** (lectura con luz normal y con poca luz, velocidad, modo avión con cero peticiones, sin terceros, cámara, QR rotativo, 30 minutos de escaneo continuo y arranque) en iPhone con iOS 18, iPhone con iOS 26 y Android con Chrome estable. **Pasa** la que cumple todos en los tres; gana la más ligera (bytes de JS y `.wasm` juntos). `BarcodeDetector` nativo no basta: sigue «Limited availability» y experimental en MDN ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector), 22 oct 2026). Se agrega una variable: el QR con MAC de 32 o de 16 bytes (§7.2). Si ninguna pasa, `@zxing/browser` con los mismos criterios, y mientras tanto «Buscar por WhatsApp» (RF-SEL-02). Se carga **solo en N5** con importación dinámica y encabezados de caché inmutables. Solo en dispositivos reales.

### Qué se prueba en local y qué exige dispositivos

| Prueba | Local (Docker + Playwright) | Proyecto alojado | iPhone / Android reales |
|---|---|---|---|
| Esquema, RLS, pgTAP, pruebas REST | Todo | | |
| Cookies C1 a C5, no-terceros, CSP | Todo | | |
| Hook: firma, límites, `stub`, reintento | Todo | | |
| SP-1 (1), (4), (5) del hook de Supabase | Parcial | Sí | |
| SP-1 (3) entrega real por operador | | Sí | Sí |
| SP-2, SP-3 C6 | | | Sí |
| SP-4 | | Sí | |
| SP-6 | | | Sí |

---

## 9. Pruebas técnicas previas al piloto, rendimiento, terceros y región

### 9.1 Plan de RNF-PWA-07 (iPhone con iOS 18 y 26, y Android con Chrome estable)

Se ejecuta **en el dominio real** antes de abrir a los pilotos (los feature de PWA lo dejan listo). Lo que sí está documentado: en iOS 26 y iPadOS 26 cualquier sitio agregado a inicio abre como app web por defecto, con o sin manifest, y el usuario puede desactivarlo con «Abrir como app web» ([WebKit, Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/), 22 oct 2026); el artículo no dice nada de cookies ni de almacenamiento. En Chrome, la instalación pide HTTPS, `name` o `short_name`, íconos de 192 y 512, `start_url`, `display` y un toque más 30 s de interacción; la página (de 2024) no menciona el service worker ([web.dev](https://web.dev/articles/install-criteria)). **Todo lo demás se trata como `[SUPUESTO]` hasta esta prueba.**

| # | Prueba | Dispositivos | Pasa si |
|---|---|---|---|
| 1 | Instalación (iOS: Compartir → Agregar a inicio; Android: aviso de instalación) | los tres | La app abre en `standalone` con el ícono y el splash de LealTab |
| 2 | `install_token` / sesión tras instalar | iPhone 18 y 26 | La PWA abre con la sesión (SP-2); MET-06 registrado |
| 3 | QR de un segundo negocio | los tres | Con sesión, el alta es de un toque; en iOS el QR abre Safari y la tarjeta aparece en la app instalada |
| 4 | `theme-color` por negocio en `standalone` | los tres | Cambia a color de LealTab o del negocio según PQ-N2 |
| 5 | «Agregar a inicio» desde WhatsApp e Instagram | iPhone y Android | Se ofrece abrir en Safari o Chrome (R3) y la tarjeta funciona igual |
| 6 | iOS 26 con «Abrir como app web» desactivado | iPhone 26 | Se comporta como marcador y la tarjeta funciona sin instalar (D-001) |
| 7 | `/panel/` no se abre dentro de `/c/` | los tres | Al tocar un enlace al panel desde la PWA aparece la barra del navegador |
| 8 | Sesión persistente y cookie (SP-3 C6) | iPhone | Expiración > 30 días |
| 9 | R4 sin conexión | los tres | Tarjeta guardada, QR local, «Puede haber sellos pendientes» |
| 10 | Android: la PWA comparte cookies con Chrome | Android | Un registro hecho en Chrome aparece en la PWA sin código `[SUPUESTO de ADR-003 §2.3]` |

### 9.2 PQ-18 y RNF-STK-10: cookies y recursos de terceros, región

| Qué | Cómo se comprueba | Dónde |
|---|---|---|
| Vercel no pone cookies | Playwright en producción: `/`, `/c/{slug}` y `/panel/entrar` sin `Set-Cookie` fuera de `lt-*`. **Las vistas previas sí pueden traer cookies de protección** (`_vercel_jwt`), por eso la prueba es contra producción o local | `e2e/producto/no-terceros.spec.ts` |
| Vercel no carga scripts propios | **Vercel Web Analytics y Speed Insights deben estar apagados** (inyectan un script `/_vercel/…`; D-018). Se revisa en el panel y en la prueba de peticiones | Lista de verificación |
| Supabase no pone cookies ni recursos | El navegador no lo contacta nunca (§5.7); las fotos de logos salen por `/c/logo/{slug}` | Las cuatro capas de §5.7 |
| SMS Masivos y Resend | Solo de servidor a servidor; el cliente nunca visita sus sitios | Revisión de rutas |
| Fuentes | `next/font` las autoaloja en el build | Prueba de peticiones |
| Región | Supabase en `us-east-1` y funciones de Vercel en `iad1` `[SUPUESTO: la región de Supabase no tiene opción en México; latencia a Tabasco sin medir]`. La región se fija al crear el proyecto: se registra en el checklist con `supabase projects list` y se mide con el teléfono de pruebas antes de producción | Checklist del proyecto |
| Aviso | Debe decir: cookies de sesión de primera parte y necesarias; datos en EE. UU. (Supabase, Vercel, SMS Masivos); conservación de 3 meses del proveedor; teléfono verificado en `auth.users` | PQ-18 (abogado) |

### 9.3 Rendimiento, disponibilidad y respaldos (PQ-24)

Metas **ya aprobadas** (RNF-REN-02 y RNF-REN-04): 10 sellos por minuto por negocio y 140 entre todos los de la primera tanda, sin 5xx; confirmar un sello p95 ≤ 800 ms y de escanear a «+1 sello» ≤ 5 s; tarjeta LCP p75 ≤ 2.5 s en 4G (≤ 1 s con el service worker), INP ≤ 200 ms, CLS ≤ 0.1; N5 listo ≤ 4 s p75 en 4G; disponibilidad interna de 99.5 % mensual **que puede no cumplirse** con el plan gratuito (R-19, aceptado por Aarón). Cómo se verifica con lo que hay:

| Meta | Cómo | Cuándo |
|---|---|---|
| Hora pico de cafetería (10 sellos por minuto por negocio y 140 en total) | Prueba de carga sintética contra el **proyecto de pruebas** con `servidor.registrar_eventos` (es poco: unas 2 a 3 escrituras por segundo). Lo delicado es la concurrencia por tarjeta (§7.4). Con el compute gratuito el p95 de 800 ms puede no cumplirse `[SUPUESTO]`; el resultado alimenta los disparadores del §2.6 | `mostrador-n5` y de nuevo antes del piloto |
| LCP, INP y CLS | Lighthouse con perfil móvil sobre la tarjeta (`/c/{slug}`, con `use cache`) y el panel; presupuesto de JS inicial ≤ 170 KB gzip `[SUPUESTO: presupuesto propio]` | Cada feature de UI |
| Disponibilidad | Monitor externo sobre `/api/salud` (sin datos personales) y el cron diario de «aliento» | Antes del piloto |
| Respaldos | Los del §2.6 y una **restauración de prueba** en local antes de abrir pilotos | Lista de verificación previa al piloto |
| Costo real frente a USD 20–50 | Con planes gratuitos, USD 0 de infraestructura; el costo de los códigos es el único variable (ADR-003 §4: MXN 2,000 a 3,300 en el piloto, con SMS como peor caso). Reevaluar con los disparadores del §2.6 | PQ-29, Gate 1 |

---

## 10. Orden de features de la Fase 7

Sin fechas; cada uno sale por criterio. Cada feature pasa por el flujo de `AGENTS.md` §8 (brief aprobado, implementación en `feat/<slug>`, QA, cierre).

**Partición de «cimientos» (decisión del coordinador).** `cimientos-entorno-esquema` se verifica en local, sin dispositivos y sin PQ abiertas, y desbloquea a todos. `spike-auth-cliente` necesita el proyecto de pruebas, un túnel y dispositivos; separarlo evita que el esquema espere a los spikes. El spike de QR (SP-6, PQ-25) **no** va aquí: entra al brief de `mostrador-n5`.

| # | Feature (`slug`) | Alcance en una línea | RF y RNF | Depende de | Lo desbloquea |
|---|---|---|---|---|---|
| 0a | `cimientos-entorno-esquema` | Mover la landing a `(landing)` sin cambiar URLs; Compose (solo la app) y Dockerfile; `web/supabase/` con migración inicial recortada (§3.1: sin `evento`, `dispositivo`, `por_revisar`, canje ni funciones de registro, borrado o canje); RLS por rol, pgTAP y pruebas REST directas; exclusión mutua identidad/dueño con disparador; clientes `@supabase/ssr` (`server`, `anon`, `admin`) con `lt-cliente` y `lt-dueno`; `proxy` con `matcher` solo en `/c` y `/panel`; `vercel.json` y `vercel-build.sh` con migraciones solo en producción (SP-0); `robots` | RNF-STK-01 a 04, 11 a 13 y 15; RNF-PRI-02; RF-EVT-05 (tabla); RF-ALT-11 (`negocio`) | ADR-005, 006 y 007; aclaración a D-023 | Todo |
| 0b | `spike-auth-cliente` | Hook mínimo `/api/hooks/send-sms` (+ migración 9), `/c/api/auth/codigo` y `verificar`, página y manifest de prueba solo para iPhone; informe con **PQ-30, PQ-31, PQ-36, PQ-39** y las pruebas 2, 3, 4 y 6 del ADR-003 §3 (SP-1 a SP-4; SP-5 opcional) | RNF-STK-06; RNF-PWA-05; RF-APP-15; ADR-003 §3 | 0a, proyecto de pruebas, dispositivos | 2a y 2b |
| 1 | `alta-negocio` | N1 a N4: cuenta (código o contraseña, restablecer), negocio, tarjeta con vista previa, cartel con QR; `crear_negocio`, `completar_alta`; ingestión de `evento_uso` | RF-ALT-01 a 12; RF-TAR-01 a 04, 07; RF-COB-01 y 02; RF-AJU-01 (zona) | 0a (no necesita PQ-30 ni PQ-31; el correo del dueño usa Resend, el hook de SMS no) | 2 |
| 2a | `registro-cliente` | C1 en dos pasos, R1 (segundo negocio y recuperación), C0, C3 con QR rotativo local, C4; `registrar_cliente`; sondeo de la tarjeta | RF-APP-01 a 04, 09 a 13, 15 a 18; RF-SEL-04 (lado del cliente); RNF-STK-06 | 1 y **PQ-30 resuelta** (SP-1); SP-3 | 3, 6 |
| 2b | `pwa-instalacion` | Manifest, service worker de `/c/`, C2, `install_token` (A o B), R3 y R4 | RNF-PWA-01 a 08; RF-APP-06 a 08 y 16 | 2a y **PQ-31 resuelta** (SP-2) | Pilotos |
| 3 | `mostrador-n5` | N5 en línea: escanear (librería de SP-6), confirmar sello, canje, límite y bloqueo, búsqueda por WhatsApp; `registrar_dispositivo`, `llaves_del_negocio`, `registrar_eventos` | RF-SEL-01 a 03, 05 a 11, 16 y 17; RF-TAR-03 y 06; RNF-REN-01, 02 y 04 | 2a, **PQ-25 resuelta** (SP-6) y **ADR-008 redactado** (llaves, antes de `mostrador-n5`) | 4 y 5 |
| 4 | `mostrador-sin-conexion` | Cola en IndexedDB, firma, sincronización por los cinco disparadores, M5 y M6, Por revisar, recálculo de la tarjeta | RF-SEL-12 a 15; RNF-OFF-01 a 06; D-015 | 3 y ADR-008 | 5 |
| 5 | `resumen-clientes` | N0, N6, N7 con ficha, corregir sellos, Por revisar (UI) y CSV | RF-INI-01 a 07; RF-QR-01 a 05; RF-CLI-01 a 08; D-027, D-028 | 3 y 4 | |
| 6 | `ajustes-y-cuenta` | N8 (negocio, tarjeta, datos, plan), C5 con borrado de cuenta, «Activar mi plan» | RF-AJU-01 a 05; RF-APP-14; RF-COB-03 a 05; D-026 | 1 y 2a | |
| 7 | `eventos-medicion` | Cierra el catálogo de `medicion.md` (lo que cada feature aún no emitió), vistas de métricas y prueba de contrato de eventos | RF-EVT-01 a 06; RNF-STK-05 | 1 a 6 | |
| 8 | `pre-piloto-operacion` | Cron diario (saldo, limpieza, reintentos), alertas, respaldo y restauración de prueba, pruebas de RNF-PWA-07, de terceros y de carga, lista de verificación del proyecto | RNF-STK-10; RNF-PWA-07; RNF-REN-02 y 04; R-18, R-19 | 1 a 7 | Apertura de pilotos |

Notas sobre el orden:

- **N1 a N4 antes que C1 a C4** (cambia el orden de la lista del encargo): C1 necesita un negocio real, y N1 a N4 no esperan a PQ-30 ni a PQ-31. Quien quiera adelantar C1 puede usar negocios de `seed-dev.ts`, pero el flujo real necesita el alta.
- **Instrumentar con cada feature.** `src/lib/eventos.ts` y la ruta de ingestión nacen en `alta-negocio`; cada feature emite sus eventos con el nombre exacto de `07-entrega` §5. `eventos-medicion` solo cierra y verifica.
- **Gates por PQ:** PQ-30 bloquea 2a; PQ-31, 2b; PQ-25, 3; PQ-36 a PQ-39 entran en 0b y se resuelven en SP-1 y SP-2.
- **CI.** No hay `.github/`. Se propone un flujo mínimo (lint, typecheck, build, `test:db`, `test:rls`, e2e de la landing) cuando lo pida Aarón; el build de Vercel solo cubre `build`. **Por definir.**

---

## 11. Riesgos, supuestos y qué hace falta decidir

### 11.1 Riesgos técnicos

| # | Riesgo | Mitigación | Dueño |
|---|---|---|---|
| T-1 | Mover la landing a `(landing)` altera el CSS o la paridad | La suite actual debe pasar sin tocar specs; los archivos se mueven con `git mv` y no se editan | 0a |
| T-2 | Una política o un `GRANT` mal puesto filtra datos de otro negocio | pgTAP (P-01 a P-10), 40 casos REST (§4.4) y `security-review` | 0a, cada feature |
| T-3 | El hook no se dispara sin proveedor nativo | SP-1; salidas del ADR-003 §3, sin elegir antes de la prueba; **se lleva a Aarón** | 0b |
| T-4 | Los límites por IP de Supabase se agotan porque todo sale de Vercel | SP-4; subirlos; si Free no deja, decisión de plan | 0b |
| T-5 | Un `Set-Cookie` con sesión se cachea en un CDN | `setAll` copia `Cache-Control` a la respuesta; `proxy` lo fija; prueba en SP-3 | 0b |
| T-6 | El mecanismo A abre un canal de correo por el correo técnico | Criterio A5 de SP-2 | 0b |
| T-7 | Cambios de Supabase del 30 oct 2026 (tablas sin acceso por defecto) | Cada migración concede y revoca de forma explícita, incluido `service_role` | 0a |
| T-8 | El *pooler* de sesión o el IPv6 impiden migrar desde Vercel | SP-0; alternativa: GitHub Actions con `db push` (no existe CI hoy) | 0a |
| T-9 | Plan gratuito: pausa, sin respaldos, cómputo compartido | §2.6; R-19 aceptado | Aarón |
| T-10 | El orden de eventos entre dispositivos produce resultados distintos según el orden de llegada | ADR-008, recálculo y prueba de propiedades | 4 |
| T-11 | Un `service_role`/llave secreta filtrada rompe todo el modelo | Solo `admin.ts` con `server-only`; llave distinta por entorno; rotación documentada; nunca en `NEXT_PUBLIC_` | 0b |
| T-12 | El almacenamiento del mostrador (IndexedDB y la clave del dispositivo) se borra en Safari | `storage.persist()`, nuevo registro de dispositivo, métrica | 4 |
| T-13 | `supabase-js` 2.118 exige Node ≥ 22 y el proyecto trae `@types/node ^20` | `engines` ≥ 22, `base` del Dockerfile en `node:24-slim`, subir `@types/node`; fijar la versión de Node en Vercel `[SUPUESTO: 24.x]` | 0a |

### 11.2 Supuestos pendientes

| `[SUPUESTO]` | Se cierra con |
|---|---|
| Nombres de red y contenedor del CLI (`supabase_network_lealtab`, `supabase_kong_lealtab`) | `docker network ls` en 0a |
| Claves nuevas de Supabase aceptadas por `supabase-js` 2.118 y `status -o env` las imprime | 0a |
| `db push --db-url` sin `login`; transacción por archivo; *pooler* IPv4 desde Vercel | SP-0 |
| La región `us-east-1` y la versión de Postgres 17 del proyecto alojado | Checklist del proyecto |
| `host.docker.internal` desde los contenedores del CLI (y `--add-host` en Linux) | 0b |
| Con `test_otp` Supabase no llama al hook | SP-1 |
| Valores de límites y vigencia del OTP de teléfono en Free | SP-4 |
| `app_metadata` se fusiona al escribir `{ rol }` | SP-3 |
| Safari no acorta la cookie del servidor; Safari copia o no cookies al instalar | SP-3 C6 y SP-2 (cero) |
| Vercel sobrescribe `x-forwarded-for`; `CRON_SECRET` llega como `Bearer` | Prueba en una vista previa |
| Una consulta del cron cuenta como actividad para la pausa de Supabase | Observación de un fin de semana |
| Safari de iOS guarda `CryptoKey` ECDSA en IndexedDB | Prueba de N5 |
| Host y puertos de SMTP de Resend | Al configurar Auth |
| El proveedor de túnel para los spikes | Elección de Aarón |
| 2,800 tarjetas y volumen de eventos caben holgados en 500 MB | Cierre de la Fase 8 |

### 11.3 Dudas de producto y de PRD que salen de bajar el modelo (al coordinador)

| ID propuesto | Duda | Propuesta mía |
|---|---|---|
| PQ-N1 | `negocio.slug` no está en el PRD §8 aunque RNF-PWA-03 lo exige (inmutable, reservados) | **Decidida por Aarón (22 oct 2026):** `slug` en `negocio` con formato, longitud y lista reservada de §1.1 (ADR-006 §1) |
| PQ-N2 | `negocio_publico` lista «color», pero no había columna (RF-ALT-08: N3 sin color de acento) y RNF-PWA-06 pide `theme-color` por negocio | **Decidida por Aarón (22 oct 2026):** `negocio.color`, nulable, hex de 6 dígitos con `CHECK`, expuesto por `negocio_publico`; el formato es el recomendado y queda así salvo que Aarón lo cambie. **Abierto:** el uso en N2 y N3 (`alta-negocio`) y el `theme-color` por negocio (RNF-PWA-06) |
| PQ-N3 | ¿El sello de bienvenida consume el límite del día? Y qué significa «Ahora no, solo sumar visita» con la tarjeta completa (¿suma un sello de más?) | No consume el límite; la semántica de «solo sumar visita» la define el diseñador antes del feature `mostrador-n5` |
| PQ-N4 | ¿Un evento sin conexión de antes del fin de la prueba que sincroniza después de la pausa se acepta? El PRD lista cinco motivos de rechazo y no tiene `cuenta_pausada` | Aceptar si `ts_efectivo` es anterior a `fin_prueba`; rechazar con `cuenta_pausada` si no. Agregar el motivo a RF-CLI-05 |
| PQ-N5 | ¿Un dueño tiene un solo negocio en el MVP? | Sí, `UNIQUE (user_id)` en `dueno_negocio` (D-021, D-010) |
| PQ-N6 | `correo_dueno` está en `negocio` y en `auth.users.email`: ¿cambiarlo en N8 cambia el correo de acceso? | Dejarlo como correo de contacto; cambiar el acceso es otro flujo (no está en N8). Decidir antes de `ajustes-y-cuenta` |
| PQ-N7 | Retención de `envio_codigo` y `codigo_intento` (30 días `[SUPUESTO]`), `intento_acceso_dueno` e `install_token` vencidos | 30 días, y 7 para los tokens vencidos; entra al aviso (PQ-18, PQ-33, PQ-34) |
| PQ-N8 | Tablas nuevas que el PRD §8 no lista: `config_plataforma`, `intento_acceso_dueno`, `cuenta_pendiente_borrado` (las dos últimas ya las pide ADR-003 §2.7 y RF-ALT-02c sin nombre) | **Decidida por el brief (22 oct 2026):** se agregan como tablas de ADR-006 §2.4 |
| PQ-N9 | La exportación CSV con más de 1,000 filas choca con `max_rows = 1000` de la API | Paginar en el servidor al generar el CSV (RF-CLI-06); lo cubre `resumen-clientes` |
| PQ-N10 | Alta del negocio en N1: los enlaces de la landing apuntan a `https://app.lealtab.com` y a WhatsApp (`LINKS`), contra D-022 | Fase 5 en pausa; cambiar cuando Aarón lo pida |

### 11.4 Qué decisión o ADR haría falta si algo no se puede

| Si… | Entonces |
|---|---|
| SP-1 falla | ADR-003 §3: proveedor nominal de Twilio o código propio (esto último enmienda D-031 y D-023); lo decide Aarón |
| Aarón quiere la lectura literal de D-023 (Supabase **en** Compose) | Pasar a la opción B del ADR-005; cambian `compose.yaml` y las variables, no las migraciones |
| SP-4 muestra que Free no permite subir los límites | Decisión de plan de pago (PQ-29) y nueva fecha de reevaluación |
| SP-2 falla para A | Mecanismo B; D-/ADR con el costo (un mensaje más por iPhone) |
| La vista `mis_tarjetas` o la entrega de llaves no se aprueban | ADR-006 o ADR-008 con la alternativa (conexión directa a Postgres; llaves por otra vía) |
| El abogado concluye otra cosa sobre LFPDPPP | Opción H del ADR-001 (RNF-PRI-03); no afecta a este documento hasta entonces |

---

## 12. Pendientes para otras fases

- **Fase 8:** cobro automático (RF-COB-08), paso manual de pausa a activo (RF-COB-07, PQ-17), guion de capacitación del staff para el cliente sin código (D-024), denominador de G1-c (PQ-41) y revisión de los umbrales con datos.
- **Fase 5 (en pausa):** enlaces de la landing hacia `/panel/` (PQ-N10).
- **Fase 9:** umbrales de «En riesgo» con datos del piloto; reevaluar el límite de sesión y el plan de pago.
- **Legal (PQ-04, PQ-18):** texto del aviso, conservación de eventos y de `envio_codigo`, y el rol de encargado.

---

## 13. Fuentes consultadas (22 oct 2026, salvo donde se indica)

- Guía de Next.js 16.4 del repositorio (`web/node_modules/next/dist/docs/01-app/`): `proxy`, `route-groups`, `layout`, `route handlers`, `cookies`, `css`, `cacheComponents`, `authentication-with-cache-components`, `migrating-to-cache-components`, `not-found`, `output`, `deploying` y `progressive-web-apps`.
- `@supabase/ssr` 0.12.7, `@supabase/supabase-js` 2.118.0, `supabase` (CLI) 2.121.0, `standardwebhooks` 1.1.1, `barcode-detector` 3.2.3, `qr-scanner` 1.4.2: registro de npm (`https://registry.npmjs.org/<paquete>`), código y `CHANGELOG` del paquete descargado.
- Supabase: [config del CLI](https://supabase.com/docs/guides/local-development/cli/config) y [plantilla `config.toml`](https://github.com/supabase/cli/blob/main/apps/cli-go/pkg/config/templates/config.toml); [guía de SSR avanzada](https://supabase.com/docs/guides/auth/server-side/advanced-guide); [hook de SMS](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook); [custom access token hook](https://supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook); [API keys](https://supabase.com/docs/guides/api/api-keys); [JWT](https://supabase.com/docs/guides/auth/jwts); [conectar a Postgres](https://supabase.com/docs/guides/database/connecting-to-postgres); [autoalojamiento con Docker](https://supabase.com/docs/guides/self-hosting/docker); [esquemas propios](https://supabase.com/docs/guides/api/using-custom-schemas); [aviso del 30 oct 2026](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically); [`db push`](https://supabase.com/docs/reference/cli/supabase-db-push); [`db lint` y `test db`](https://supabase.com/docs/reference/cli/supabase-db-lint); [`config push`](https://supabase.com/docs/reference/cli/supabase-config-push); [`generateLink`](https://supabase.com/docs/reference/javascript/auth-admin-generatelink); [precios](https://supabase.com/pricing). Las de ADR-003 §6 siguen vigentes.
- Vercel: [cron jobs](https://vercel.com/docs/cron-jobs/usage-and-pricing); [variables de sistema](https://vercel.com/docs/environment-variables/system-environment-variables); [límites de funciones](https://vercel.com/docs/functions/limitations); [comandos de build por entorno](https://vercel.com/kb/guide/dynamic-build-commands); [precios](https://vercel.com/pricing) (21 oct).
- Resend: [precios](https://resend.com/pricing).
- PWA: [WebKit, Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/); [criterios de instalación de Chrome](https://web.dev/articles/install-criteria) (actualizado el 2024-09-19); [MDN, BarcodeDetector](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector); [barcode-detector](https://github.com/Sec-ant/barcode-detector); [Background Sync en caniuse](https://caniuse.com/background-sync) (21 oct).
- Docker local: Docker 29.8.0, Node 24.21.0 y pnpm 10.28.2 en la máquina de desarrollo (no se ejecutó nada del stack: `supabase` no está instalado).
