# ADR-007: Dos layouts raíz (landing y producto) y aislamiento del producto frente a la landing

- **Estado:** **Aceptado (22 oct 2026).** Aprobado por Aarón el 22 oct 2026, con el brief `cimientos-entorno-esquema`. Antes de mover la landing a `(landing)` se verifica con la suite de paridad, como pide el brief (T1).
- **Fecha:** 22 oct 2026
- **Decidió:** Aarón López Sosa (fundador)
- **Autor:** `lealtab-arquitecto`
- **Desarrolla:** [`docs/fase-7/arquitectura.md`](../fase-7/arquitectura.md) §1.3 (cómo conviven landing y producto), §5.7 (cómo se prueba que el navegador nunca llama a Supabase) y la parte de rutas de §0 y §1.1.
- **Restricciones vigentes:**
  - D-022 y RNF-PWA-03: `lealtab.com/c/` (cliente), `lealtab.com/panel/` (dueño) y `/` (landing), sin `app.lealtab.com`. Las URLs no cambian.
  - D-023 y ADR-002 §2.1: todo el código en `web/`; Next.js (App Router); Tailwind y shadcn/ui; React Server Components por defecto.
  - D-018 y RNF-STK-10: sin cookies de analítica ni recursos de terceros; antes del piloto, comprobar que Vercel, Supabase y SMS Masivos no pongan cookies ni carguen recursos de terceros (PQ-18).
  - RNF-DIS-01 y `brand/04-design-system/tokens.css`: el producto no inventa colores.
  - AGENTS.md §5: la landing usa CSS Modules y el CSS global de la v1.7 queda fuera de `@layer`; sus specs de paridad no cambian; `web/src/styles/tokens.css` es copia manual de la de `brand/`.
  - D-026 y ADR-003 §2.2 a §2.4: la sesión del cliente y del dueño son cookies de primera parte escritas por el servidor, sin cliente de Supabase en el navegador.
  - Fase 5 en pausa (D-009): la landing no cambia de contenido ni de URL.

## 1. Contexto

`web/` ya es el proyecto de la landing (D-008). El producto se agrega en el mismo proyecto (ADR-002), y el riesgo es que el producto rompa la landing. Hoy `src/app/layout.tsx` importa `globals.css`, que trae Tailwind y el CSS de la v1.7 **sin `@layer`**. En `/c/` y `/panel/` ese CSS pisaría a Tailwind y a shadcn/ui. Next 16.4 no quita el CSS global al navegar entre rutas y puede chocar entre ellas ([css.md](../../web/node_modules/next/dist/docs/01-app/01-getting-started/11-css.md)).

Además, la landing debe seguir desplegándose y construyéndose aunque falte la base de datos del producto, y el navegador no debe llamar a Supabase (RNF-STK-10).

## 2. Decisión

### 2.1 Dos layouts raíz

| Tema | Decisión |
|---|---|
| Layouts raíz | `src/app/layout.tsx` desaparece. `src/app/(landing)/layout.tsx` conserva su contenido y su `import "@/styles/globals.css"`, sin cambios de contenido. `src/app/(producto)/layout.tsx` define `<html lang="es-MX">`, las fuentes y `producto.css`. Las URLs no cambian |
| Por qué | Next permite varios layouts raíz y cada uno define `<html>` y `<body>`. Navegar entre ellos es una carga completa de página, así que el CSS de un grupo no llega al otro ([layout.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md), [route-groups.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md)) |
| Árbol | `(landing)/`: `page.tsx`, `aviso-de-privacidad/`, `terminos-y-condiciones/` (movidas). `(producto)/`: `c/` (manifest, apple-touch-icon y registro del service worker solo aquí) y `panel/` (shell del panel; sin manifest). `robots.ts`, `sitemap.ts` y `fonts.ts` siguen en la raíz de `app/` |
| Ruta fuera de ambos | `api/` queda fuera de los grupos (`api/hooks/send-sms`, `api/cron/diario`, `api/salud`) |

### 2.2 Estilos: `globals.css` intacto y `producto.css` propio

- `globals.css` de la landing **no se edita**.
- `src/styles/producto.css` trae Tailwind, el `@theme inline` que mapea los tokens y las variables semánticas de shadcn (`--primary`, `--background`…). Ese `@theme` está **repetido a propósito** en los dos archivos. Una extracción a un archivo común se hace solo con la suite de paridad en verde.
- `src/styles/tokens.css` es **una sola copia**, importada por los dos. El producto no inventa colores (RNF-DIS-01). Las variables de shadcn se mapean a los tokens; no se agregan colores nuevos.
- `fonts.ts` se comparte: Archivo y Manrope de `next/font`, autoalojadas, sin petición a Google en producción (RNF-STK-10).

### 2.3 shadcn/ui apartado de la landing

- `components.json` apunta a `src/components/producto` (alias `ui` → `producto/ui`) y su `css` a `src/styles/producto.css`.
- **Nunca** apunta a `components/ui` (tiene `BtnCta` y `RevealObserver` de la landing) ni a `globals.css`. Así `shadcn add` no reescribe CSS ni carpetas de la landing.

### 2.4 `robots` y metadatos

- `robots.ts` agrega `disallow: ["/c/", "/panel/", "/api/"]`. Hoy permite todo (`allow: "/"`).
- Los layouts del producto llevan `robots: { index: false }`.
- `sitemap.ts` no cambia.

### 2.5 404 sin layout

Con varios layouts raíz, una URL inexistente muestra la página 404 por defecto de Next, sin layout. `global-not-found` es experimental y **no se activa**. Se agrega una prueba: una ruta inexistente responde 404 y la landing sigue sana ([not-found.md](../../web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md)).

### 2.6 Guardas de aislamiento

1. Ningún módulo de `(landing)` ni de `components/landing` importa `lib/supabase` ni nada de `(producto)`.
2. `pnpm build` **no exige** variables del producto: `env.ts` valida de forma perezosa. Sin ellas, las rutas del producto responden 503 «Producto no configurado» y la landing sigue sana.
3. Las specs de la landing corren sin Supabase.
4. Criterio de «no rompe la landing»: antes y después de mover los archivos, la suite actual (`pnpm test:e2e`, cinco proyectos, paridad con la v1.7) pasa **sin cambios en las specs** (AGENTS.md §5).

### 2.7 El producto no usa cliente de Supabase en el navegador

Decisión de ADR-003 §2.4 llevada a la arquitectura de rutas:

- **Ningún componente del navegador usa `createBrowserClient` ni `@supabase/supabase-js`.** Toda llamada a Supabase sale del servidor (`/c/api/*`, `/panel/api/*`, RSC). No existe `browser.ts`.
- **Sondeo, no Realtime.** La tarjeta del cliente (C3 y C4) se refresca con sondeo a una ruta propia (`GET /c/api/tarjeta/…`), no con Supabase Realtime. Un cliente de Realtime en el navegador tendría que hablar con Supabase.
- **Logos por el mismo origen.** `/c/logo/{slug}` lo lee el servidor de Storage y lo sirve con caché; el navegador nunca ve `supabase.co`.
- **Lo que sí es de cliente** queda en la lista cerrada de `arquitectura.md` §1.4 (formularios, QR rotativo, service worker, escáner de N5, sondeo, previsualización de N3). El resto se renderiza en el servidor.

**Política de contenido (CSP)** solo en `/c/:path*` y `/panel/:path*`, nunca en la landing, y solo con `NODE_ENV=production` para no romper el HMR:

```text
connect-src 'self'; img-src 'self' data: blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
```

No lleva `script-src`: con una política estricta, Next exige *nonces* y eso obliga a renderizar cada petición, lo que choca con `cacheComponents`.

### 2.8 Cómo se prueba (cuatro capas)

1. **Estático.** `eslint` con `no-restricted-imports`: `createBrowserClient` y `@supabase/supabase-js` solo dentro de `src/lib/supabase/`, y ahí con `server-only`.
2. **Artefacto.** `pnpm check:cliente` (`scripts/check-no-supabase-en-cliente.sh`) busca en `.next/static` `supabase.co`, `54321`, `sb_publishable` y `sb_secret`; falla si aparece alguno.
3. **Navegador en producción.** La CSP de 2.7 aplicada solo en las rutas del producto.
4. **Playwright** (`e2e/producto/no-terceros.spec.ts`, en los cinco proyectos): recorre C1, `/c/recuperar`, N1 (código y contraseña) y el panel. **Toda petición**, incluidas las del service worker, debe ir al origen de la app. Ninguna respuesta lleva `Set-Cookie` salvo `lt-cliente*` y `lt-dueno*` con sus atributos. `/` no recibe ninguna cookie. Las respuestas que **deben** dar 4xx (límite, bloqueo) se prueban con la fixture `request`, porque `guard` falla toda respuesta de 400 o más.

Las specs del producto (`e2e/producto/`) llevan axe. La fixture `guard` sigue vigente: falla con errores de consola o respuestas 4xx y 5xx.

## 3. Por definir

- **Terceros que cargan recursos o ponen cookies** (PQ-18, RNF-STK-10): Vercel, Supabase y SMS Masivos. La prueba de 2.8 (capa 4) cubre el producto; la landing no se revisa con esa prueba, y el aviso de privacidad es de Aarón con abogado.
- **`theme-color` por negocio en `standalone`** (RNF-PWA-06, PQ-N2): hoy usa el de LealTab. Se cambia cuando se decida el uso del color de marca.
- **Llamadas de la landing a `app.lealtab.com`** (`LINKS.createCard`, PQ-N10): cambiar a `/panel/alta` es de la Fase 5, en pausa; lo pide Aarón.
- **`global-not-found`** (experimental en Next 16.4): no se activa en el MVP. Si se quiere una 404 con la marca del producto, se decide con una prueba propia.
- **Extraer el `@theme` común** a un solo archivo: solo con la suite de paridad en verde y una decisión propia.

## 4. Consecuencias

- **La landing no cambia de URL ni de contenido.** Solo cambia el archivo que la contiene. Su suite de paridad es el criterio de cierre.
- **Una carga completa entre landing y producto.** Es el precio de los dos layouts; el producto no necesita JavaScript de la landing ni viceversa.
- **Duplicación controlada.** El `@theme` está en dos archivos y se sincroniza a mano; el paso de sincronización de `tokens.css` (AGENTS.md §5) se hace en el mismo cambio.
- **Sondeo en lugar de tiempo real.** La tarjeta del cliente se actualiza cada cierto tiempo. Es lo que permite no meter Supabase en el navegador (RNF-STK-10) y no cuesta una conexión persistente en el teléfono.
- **Logos por el servidor.** Cada logo pasa por Vercel; se sirve con caché para no pegarle a Storage en cada visita.
- **La CSP sin `script-src`** no frena un script inyectado en la página. Se decidió así para no obligar a *nonces* ni a renderizar cada petición. Lo que sí limita el daño es que el navegador no tiene llave ni conexión a Supabase y que las cookies son `HttpOnly`. Esto pasa a `security-review`.
- **Un solo proyecto y un solo despliegue.** Cambiar el producto puede afectar a la landing; por eso la suite de paridad corre en cada cambio de `web/`.

## Fuentes

- Guías de Next 16.4 incluidas en `web/node_modules/next/dist/docs/` (consultadas el 22 oct 2026): CSS (`01-getting-started/11-css.md`), layouts y grupos de rutas (`03-api-reference/03-file-conventions/`), `not-found` y `proxy`.
- `docs/fase-7/arquitectura.md` §0, §1.1, §1.3, §1.4 y §5.7 (22 oct 2026).
- `docs/adr/002-stack.md` §2.1 y `docs/adr/003-sesion-cliente-y-codigo.md` §2.4.
