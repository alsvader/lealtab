# AGENTS.md: LealTab

Instrucciones para cualquier agente de IA que trabaje en este repositorio. Las reglas propias de Claude Code (orquestador, subagentes, memoria) están en `CLAUDE.md`.

## 1. Qué es LealTab

- SaaS mexicano de lealtad. El primer producto es una **tarjeta de sellos web (PWA)**: el cliente final la abre desde el QR del mostrador, funciona en cualquier teléfono sin instalar nada y el dueño ve cada semana quién regresó.
- Usuarios:
  - **dueño del negocio**: panel N0 a N8;
  - **personal de mostrador**: usa la cuenta compartida del dueño (D-010);
  - **cliente final**: una sola app LealTab, pantallas C0 a C5 (D-013).
- Piloto: hasta 20 negocios de Villahermosa en barberías, estéticas, tapiocas y cafeterías (D-003).
- La landing está publicada en www.lealtab.com y su código vive en `web/` (Next.js). El producto se construye en ese mismo proyecto.
- Quien decide es **Aarón** (fundador). Nada avanza sin su aprobación.

**Fase actual: 7, desarrollo del MVP y piloto 0.** La Fase 6 se cerró el 2026-10-20 y la Fase 5 (marketing) está en pausa. Criterio de salida de la Fase 7 (plan §4, PRD §10):
- un local real usa el flujo completo una semana sin errores bloqueantes;
- al menos 10 pilotos confirmados por escrito, de 3 oficios o más;
- entrevistas del ícono y consulta legal LFPDPPP hechas (D-017);
- antes del piloto, también: aviso de privacidad actualizado para la analítica (D-018) y proveedor del código (SMS Masivos) configurado y probado (D-024).

Gates:
- **Gate 1:** 3 de 4 criterios, G1-a a G1-d (PRD §2.2).
- **Gate 2:** ≥15 clientes de pago, MRR ≥ MXN 7,500, churn ≤8 % y un canal de ≤6 h del fundador por cliente.
- **Gate 3:** MRR ≥ MXN 30,000 con ≥60 clientes.

## 2. Fuentes de verdad

Si dos fuentes chocan, manda la que va primero:

1. `docs/decisiones.md`: decisiones vigentes D-001 a D-031.
2. `brand/06-product-design/`: pantallas, estados y reglas aprobadas. La hoja de entrega es `07-entrega-desarrollo.md`.
3. `docs/prd/PRD-lealtab-mvp.md` (v1.6): requisitos RF-, RNF-, MET-, G1-, riesgos R- y preguntas abiertas PQ-.
4. `docs/adr/001-modelo-pwa.md` y `docs/adr/002-stack.md`.
5. `docs/02-plan-de-trabajo.md` (plan v3) y `brand/PLAN.md` (estado y bitácora de marca y diseño).
6. `PRODUCT.md`, `DESIGN.md` y `brand/04-design-system/` (`tokens.css`, `tokens.json`).
7. Contexto de fondo: `docs/03-propuesta.md` y `docs/01-validacion-idea.md`.

| Tema | Fuente canónica |
|---|---|
| Decisiones | `docs/decisiones.md` |
| Stack | `docs/adr/002-stack.md` (le gana al PRD §7.6) |
| Modelo PWA, rutas, manifest, identidad | `docs/adr/001-modelo-pwa.md` |
| Requisitos con ID | `docs/prd/PRD-lealtab-mvp.md` |
| Pantallas, entidades, reglas de negocio, copy clave, accesibilidad | `brand/06-product-design/07-entrega-desarrollo.md` y las piezas 01 a 06 con sus wireframes HTML |
| Eventos de analítica | `07-entrega` §5 (espejo en PRD RF-EVT-01 a 03) |
| Tokens de diseño | `brand/04-design-system/tokens.css` (`DESIGN.md` es un resumen; manda la carpeta) |
| Voz y tono | `brand/01-brand-strategy/identidad-de-marca.md` §4, `07-entrega` §6 y `PRODUCT.md` |
| Fases y alcance del MVP | `docs/02-plan-de-trabajo.md` §2 a §4 |
| Legal | `docs/fase-2/legal-notas.md` y `web/src/content/legal/` |

**Históricos o espejos (no se toman como fuente):**
- Los `lealtab-*.md` de la raíz y `grok/`: material inicial de marca.
- `docs/fase-2/`: numeración vieja de fases.
- `brand/05-marketing/03-mockup-landing-v1.*.html`: historial. La v1.7 es la referencia de paridad de la landing.
- `.claude/agents-archivo/`: agentes retirados.

## 3. Reglas duras

**Stack (ADR-002, D-023, RNF-STK-01 a 15)**
- TypeScript y Next.js (App Router), con React Server Components por defecto. Componentes de cliente solo donde hacen falta: escáner, cola sin conexión, QR rotativo.
- Tailwind y shadcn/ui, con los tokens de `tokens.css` tal cual, sin inventar colores (RNF-DIS-01). pnpm.
- Supabase: Postgres con **RLS por `negocio_id`** en todas las tablas de negocio, y Auth: el dueño entra con correo y código de 10 min o contraseña; el cliente, con su teléfono verificado por un código (D-031).
- Vercel. Pagos solo con links de Stripe o Mercado Pago.
- **Todo el código de la app vive en `web/`**: Next.js, `web/supabase/` (config y `migrations/`), Dockerfile multi-stage y Docker Compose (Supabase y app en local). Nada de código en la raíz ni en `docs/`.
- Todo cambio de base es una migración en `web/supabase/migrations`. Corre en el build de producción de Vercel y, si falla, el build falla.

**Rutas (D-022, ADR-001)**
- `/` es la landing, `/c/` la app del cliente y `/panel/` el panel del negocio. No hay `app.lealtab.com`.
- El manifest y el service worker solo tienen alcance en `/c/` (RNF-PWA-02 a 04).
- Cada despliegue también publica la landing: comprueba que `/` siga funcionando.

**Analítica (D-018)**
- Tabla propia de eventos en Supabase, con los nombres exactos de `07-entrega` §5.
- Sin cookies de analítica, sin PostHog y sin scripts de terceros. «Sin cookies» se refiere a la analítica y a los terceros: las cookies de sesión de Supabase Auth, de primera parte y necesarias, sí existen (ADR-003 §2.4, D-031).
- Los nombres viejos están prohibidos (RF-EVT-03).

**Privacidad (LFPDPPP)**
- Datos mínimos del cliente: nombre, WhatsApp y consentimiento (RNF-PRI-01).
- `identidad` guarda solo el teléfono E.164 y es el único identificador global. Cada negocio tiene su propio `cliente_negocio` (D-019).
- Un negocio nunca ve datos de otro (RF-CLI-08).
- La exportación CSV siempre está disponible, incluso con la cuenta pausada.
- Los datos no se usan para fines propios de LealTab sin un ADR nuevo y revisión legal (RNF-PRI-06).

**Accesibilidad (RNF-A11Y-01 a 04, `07-entrega` §7)**
- Cada estado se muestra con palabra y color, nunca solo con color.
- Contraste AA y `--focus-ring` visible.
- Objetivos táctiles de al menos 44 px.
- Campos de texto a 16 px con `--font-size-input` (`font.size.input`). El campo de WhatsApp usa `inputmode="tel"` y `autocomplete`; los errores se ligan con `aria-describedby`.
- Resultados de escaneo y sincronización con `aria-live="polite"`.
- Se respeta `prefers-reduced-motion`.

**Reglas de negocio fijas**
- QR rotativo de 60 s firmado con HMAC.
- 1 sello por día por defecto, configurable a «1 cada X horas» o «Sin límite».
- Bloqueo fijo de 2 min contra el doble escaneo (D-014).
- Sin conexión primero: el servidor es la fuente de verdad y lo rechazado va a Clientes → Por revisar (D-015).
- Una sucursal por negocio (D-021), una tarjeta por negocio y una cuenta compartida.

**Fuera del alcance del MVP (PRD §4.2, plan §3)**
Apple o Google Wallet, app nativa, staff con permisos, varias tarjetas o sucursales, avisos, campañas y reportes, cobro dentro del producto, resumen semanal por WhatsApp o correo, IA, API pública, niveles VIP, referidos, cashback, POS, push, ícono o dominio por negocio. Solo entra lo que registre una decisión nueva en `docs/decisiones.md`.

**Disciplina de fase**
- Sin calendario: las fases avanzan por criterio de salida. No propongas fechas ni semanas.
- No hagas trabajo de fases futuras: anótalo en «Pendientes para la Fase N».
- La Fase 5 está en pausa (D-009): la landing no se toca salvo que Aarón lo pida.
- La marca y el design system están cerrados (Fases 1 a 4); cambiarlos requiere una decisión.
- En la Fase 8 solo entran correcciones críticas y el cobro automático.

**Documentos protegidos**
- Los informes 01 a 03, `docs/decisiones.md`, el PRD y los ADR no se editan directo. Los cambios se proponen al coordinador y Aarón los aprueba.
- Formato de una decisión: `## D-NNN · <fecha de registro> · <título>`, con viñetas **Decisión**, **Motivo**, **Consecuencias**, **Alternativa(s) descartada(s)** y **Decidió**.
- Formato de un ADR: `docs/adr/NNN-slug.md`, con Estado, Fecha, Decidió y Restricciones vigentes; las secciones son Contexto, Decisión, Por definir y Consecuencias.

## 4. Convenciones

- **Idioma:** interfaz en español de México, de tú. La tarjeta del cliente habla con la voz del negocio. El código y sus identificadores van en inglés. Eventos y tablas de dominio, en español y `snake_case` (`sello_registrado`, `cliente_negocio`).
- **Marca:** siempre «LealTab», nunca «Leal». «Hecho con LealTab» va en todos los planes (D-016). Lo que no existe se muestra como «Muy pronto». Sin testimonios ni métricas inventadas y sin fotos de stock.
- **IDs:**
  - decisiones `D-NNN`;
  - requisitos `RF-<ÁREA>-NN` y `RNF-<ÁREA>-NN`;
  - métricas `MET-NN`, riesgos `R-NN` y preguntas abiertas `PQ-NN`;
  - flujos `F1` a `F10`;
  - pantallas `N0` a `N8` (panel) y `C0` a `C5` (cliente), con subestados como `N5·1`.
- **Marcadores:** **Por definir** para lo que las fuentes no resuelven (no se inventa: se cita la PQ o se propone una nueva). `[SUPUESTO]` para datos no verificados, citando la fuente.
- **Entregables:** van en `docs/fase-N/`, con la numeración del plan v3:
  - briefs de feature en `docs/fase-N/features/<slug>.md`;
  - reportes de QA en `docs/fase-N/qa/<slug>.md`;
  - notas de estado en `docs/estado/AAAA-MM-DD.md`.
- **Git:**
  - ramas `feat/<slug>` (o `fix/<slug>`) desde `main`;
  - commits en español, en presente y con sujeto implícito («Agrega…», «Actualiza…», «Corrige…»), sin prefijos tipo Conventional Commits y sin punto final;
  - el commit o el PR cita los IDs que implementa (RF-, RNF-, D-).
- **Secretos:** fuera del repositorio. `.env*` está en `.gitignore`.

## 5. Trabajar en `web/`

Antes de tocar código lee `web/AGENTS.md`. Esta versión de Next.js (16.4) cambia APIs y convenciones: consulta la guía correspondiente en `web/node_modules/next/dist/docs/` antes de escribir código.

Comandos (desde `web/`, con pnpm):

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm lint` | ESLint (`eslint.config.mjs`) |
| `pnpm typecheck` | `next typegen` y `tsc --noEmit` |
| `pnpm build` | Build de producción |
| `pnpm test:e2e` | Playwright contra un build de producción en 5 proyectos: chromium, firefox, webkit, Mobile Safari y Mobile Chrome |
| `pnpm test:e2e:producto` | Playwright de `/c` y `/panel` (cookies y aislamiento), mismos 5 proyectos; necesita Supabase local |
| `pnpm check:cliente` | Tras `pnpm build`, falla si `.next/static` contiene Supabase o sus llaves |

- Playwright está fijado en **1.61.1** a propósito: desde la 1.62, WebKit se cuelga en macOS 14. No lo actualices.
- La fixture `guard` de `e2e/fixtures.ts` falla cualquier prueba con errores de consola, `pageerror` o respuestas 4xx o 5xx.
- La suite actual comprueba la **paridad de la landing** con el mockup v1.7. Las rutas del producto (`/c/`, `/panel/`) necesitan specs propias, con axe incluido.
- Los textos de la interfaz viven como constantes tipadas en `src/content/*.ts`; los componentes los importan, no los escriben en duro.
- `web/src/styles/tokens.css` es una **copia manual** de `brand/04-design-system/tokens.css`. Si cambia el original, sincroniza la copia en el mismo cambio.
- La landing usa CSS Modules y el CSS global de la v1.7 queda fuera de `@layer`. No uses utilidades de Tailwind para sobrescribirlo.

## 6. Qué skill usar

Los skills del proyecto viven en `.agents/skills/` y se enlazan desde `.claude/skills/`; sus versiones están en `skills-lock.json`. **`DESIGN.md` y los tokens siempre les ganan a las sugerencias de cualquier skill.**

| Trabajo | Skill | Cuidado |
|---|---|---|
| UI del producto (`/c/`, `/panel/`): diseñar, criticar, auditar, pulir, endurecer, estados vacíos y de error | `impeccable` | Modo *Operate* para el producto (precisión y contención); la landing es *Persuade*. Lee `PRODUCT.md` y `DESIGN.md`. Es el skill principal de interfaz. |
| Checklist de UX y accesibilidad antes de entregar | `ui-ux-pro-max` | Úsalo solo como checklist (44 px, 16 px, formularios, foco). Ignora sus paletas y estilos. |
| Tokens en `@theme` de Tailwind v4, instalar y tematizar shadcn/ui, variantes de componentes | `tailwind-design-system` | Mapea a los `tokens.css` existentes; sus ejemplos OKLCH no se copian y no se agregan colores. |
| Docker Compose (Supabase y app) y Dockerfile multi-stage | `docker-patterns`, `docker-compose-patterns`, `docker-build-strategies` | Antes de cualquier comando destructivo de Docker: `docker-destructive-guardrails`. |
| Landing, **solo si Aarón lo pide** | `design-taste-frontend`, `redesign-existing-projects` | **Prohibidos en el producto**: proponen fuentes, gradientes y estéticas que chocan con el design system cerrado y con la paridad v1.7. |
| Revisión de código o de seguridad (RLS, HMAC, auth) | `code-review`, `security-review` | |
| Gráficas o tableros de métricas | `dataviz` | |

## 7. Roles

| Rol | Para qué | Dónde escribe |
|---|---|---|
| Coordinador | Fase, alcance, gates, decisiones y PQ | `docs/estado/`, propuestas para `docs/decisiones.md` |
| Arquitecto | Arquitectura, modelo de datos con RLS, PWA, sin conexión, QR y ADRs | `docs/fase-7/arquitectura.md`, `docs/adr/` |
| Product designer | Pantallas pendientes (C5, N1 con contraseña), criterios de aceptación y revisión de diseño | `brand/06-product-design/` |
| Copywriter | Microcopy, plantillas de WhatsApp y guiones | `docs/fase-7/microcopy.md`, `docs/fase-8/` |
| Desarrollador | Implementación y pruebas | `web/` |
| QA | Verificación técnica y reporte de evidencia; no corrige código | `docs/fase-N/qa/` |
| Analista de métricas | Instrumentación de eventos, consultas y gates | `docs/fase-7/medicion.md`, `docs/fase-8/metricas/` |
| Investigador de clientes | Entrevistas Mom Test y playbook del piloto | `docs/fase-7/entrevistas/` |
| Investigador | IMPI y WIPO, competencia, proveedores y mercado | `docs/fase-N/` |
| Growth (Fase 10) | Canales, referidos y expansión | `docs/fase-10/` |

## 8. Flujo para cada feature nuevo

1. **Contexto:** ubicar los RF y RNF, la pieza de diseño, las D- y las PQ abiertas que afectan.
2. **Alcance:** confirmar con el coordinador que es de la fase actual y del MVP. Si no, se detiene y se propone a Aarón.
3. **Definición:** solo lo que falte (diseño, copy, arquitectura, eventos).
4. **Brief** en `docs/fase-N/features/<slug>.md`. **Aarón lo aprueba antes de construir.**
5. **Implementación** en `feat/<slug>`, con pruebas, y **verificación** independiente: QA técnica, revisión de diseño y de eventos.
6. **Cierre:** reporte con evidencia y pendientes. **Aarón aprueba antes del commit o el PR.**

En Claude Code, este flujo es el skill `/feature` (`.agents/skills/feature/`).
