# ADR-002: Stack del producto (MVP)

- **Fuente de verdad del stack técnico.** Si este ADR y la sección 7.6 del [PRD del MVP](../prd/PRD-lealtab-mvp.md) difieren, manda este ADR.
- **Estado:** **Decidido (2026-10-21).** Registrado como D-023 en `docs/decisiones.md`.
- **Fecha:** 21 oct 2026
- **Decidió:** Aarón López Sosa (fundador)
- **Restricciones vigentes:**
  - D-001: tarjeta web/PWA.
  - D-002: plataforma propia.
  - D-005: entrada del dueño con correo + código o contraseña.
  - D-011: código de recuperación por WhatsApp.
  - D-012: cobro con link de pago.
  - D-013 y ADR-001: una sola app.
  - D-015: sin conexión primero.
  - D-018: analítica propia, sin cookies.
  - D-019: identidad por teléfono y `cliente_negocio` por negocio.
  - D-022: `lealtab.com/c/` y `/panel/`.

## 1. Contexto

Hasta ahora el stack era una sugerencia: «TypeScript/Next.js, Postgres (Supabase o Neon)» (`01-validacion-idea.md` §7.2) y «RLS en Postgres si usamos Supabase» (ADR-001 §6). El PRD del MVP lo tenía como pregunta abierta (PQ-16). La landing ya vive en `web/` con Next.js, Tailwind, shadcn/ui y pnpm (D-008). Con D-022, producto y landing comparten el dominio `lealtab.com`.

## 2. Decisión

| Capa | Elección |
|---|---|
| Lenguaje y framework | TypeScript + Next.js (App Router), **en el mismo proyecto que la landing (`web/`)**, con las rutas `/c/` (app del cliente) y `/panel/` (panel del negocio) |
| Interfaz | Tailwind + shadcn/ui, como en `web/`, con los tokens de `04-design-system/tokens.css` |
| Paquetes | pnpm, como en `web/` |
| Base de datos | Supabase Postgres |
| Autenticación | Supabase Auth: el dueño entra con correo + código o con contraseña (D-005) |
| Separación entre negocios | RLS en Postgres que filtra por `negocio_id` (ADR-001 §6) |
| Analítica | Tabla propia de eventos en Supabase. Sin cookies, sin PostHog ni otras herramientas de terceros (D-018) |
| Alojamiento | Vercel, junto con la landing |
| Código de recuperación por WhatsApp | Hook de teléfono/OTP de Supabase Auth, con un proveedor externo configurado en Supabase. **Proveedor: Por definir** |
| Escaneo del QR en N5 Mostrador | Librería de escaneo en el navegador. **Librería: Por definir** |
| Cobro | Link de pago de Stripe o Mercado Pago (D-012), sin cambios |

### 2.1 Reglas del stack (agregadas por Aarón el 2026-10-21)

**Frontend**
- React Server Components por defecto. Los componentes de cliente se usan solo donde hacen falta.
- Tailwind CSS.
- shadcn/ui como capa estándar de componentes base.

**Infraestructura**
- **Lista para contenedores:** Docker, Docker Compose y un Dockerfile multi-stage.
- **Local:** la app está dockerizada. Docker Compose levanta Supabase con sus contenedores y la app web.
- **Producción:** Vercel compila `web/`. El contenedor no se despliega en producción.
- **Base de datos:** todo cambio es una migración de Supabase en `supabase/migrations`. Las migraciones corren durante el build de Vercel.

## 3. Por definir

- **Proveedor del código por WhatsApp:** cuál conectar al hook de Supabase Auth, cuánto cuesta por mensaje y qué pide (cuenta, número, plantilla aprobada por Meta).
- **Librería de escaneo de QR:** tiene que funcionar en el navegador del celular o la tablet del mostrador, también sin conexión (D-015).
- **Identidad del cliente en Supabase Auth:** cómo se relaciona la `identidad` (teléfono en E.164, D-019) con el usuario de Supabase Auth, y cómo se hace la confirmación sin costo de un segundo negocio (ADR-001 §5.2, punto 6).
- **Región de Supabase y de Vercel**, y si hay datos fuera de México (`legal-notas.md` §3, riesgo 6).

## 4. Consecuencias

- **Un solo proyecto y un solo despliegue.** La landing (`/`), la app del cliente (`/c/`) y el panel (`/panel/`) comparten código y despliegue en Vercel. Cambiar el producto puede afectar a la landing, así que conviene separar bien las rutas y probar la landing en cada despliegue.
- **Agente de desarrollo.** `.claude/agents/lealtab-desarrollador.md` menciona PostHog. Hay que actualizarlo en el repo de Aarón para que diga «tabla propia de eventos en Supabase, sin cookies». No se editó aquí.
- **Privacidad.**
  - Vercel, Supabase y el proveedor del código por WhatsApp tratan datos por cuenta de LealTab.
  - Antes del piloto hay que comprobar que no pongan cookies ni carguen recursos de terceros, decidir si se nombran en el aviso y confirmar dónde guardan los datos. Esto va con la consulta legal (D-017) y la actualización del aviso (D-018).
- **Costo.** El supuesto de USD 20–50 al mes en hosting y base de datos (`03-propuesta.md` §10) sigue sin validar con los planes reales de Vercel y Supabase. Se suma el costo por mensaje del proveedor de WhatsApp.
- **Nota sobre las migraciones en el build de Vercel** (riesgos a cuidar al implementarlo; no cambian la decisión):
  - Los despliegues de vista previa también compilan y podrían aplicar migraciones a la base de producción. Conviene que las migraciones corran solo en los builds de producción.
  - Las credenciales de la base van en variables de entorno de Vercel, nunca en el repo.
  - Si una migración falla, el build debe fallar, para no publicar código que espera un esquema que no existe.
- **Sin conexión.** La cola en IndexedDB, la validación del QR y la firma de eventos (D-015) se hacen en el navegador. Supabase recibe los eventos al sincronizar, y la idempotencia se resuelve con el UUID de cada evento.
