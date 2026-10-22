# ADR-002: Stack del producto (MVP)

- **Fuente de verdad del stack técnico.** Si este ADR y la sección 7.6 del [PRD del MVP](../prd/PRD-lealtab-mvp.md) difieren, manda este ADR.
- **Estado:** **Decidido (2026-10-21).** Registrado como D-023 en `docs/decisiones.md`.
- **Fecha:** 21 oct 2026
- **Decidió:** Aarón López Sosa (fundador)
- **Restricciones vigentes:**
  - D-001: tarjeta web/PWA.
  - D-002: plataforma propia.
  - D-005: entrada del dueño con correo + código o contraseña.
  - D-011 y D-024: código de WhatsApp (principal) o SMS (respaldo) con SMS Masivos y el hook de Supabase.
  - D-012: cobro con link de pago.
  - D-013 y ADR-001: una sola app.
  - D-015: sin conexión primero.
  - D-018: analítica propia, sin cookies de analítica ni de terceros (las cookies de sesión de Supabase Auth son de primera parte y necesarias, ADR-003 §2.4).
  - D-019: identidad por teléfono y `cliente_negocio` por negocio.
  - D-022: `lealtab.com/c/` y `/panel/`.
  - D-024: proveedor del código y SMTP del dueño (Resend).
  - D-031: el cliente usa Supabase Auth con teléfono verificado por OTP.

## 1. Contexto

Hasta ahora el stack era una sugerencia: «TypeScript/Next.js, Postgres (Supabase o Neon)» (`01-validacion-idea.md` §7.2) y «RLS en Postgres si usamos Supabase» (ADR-001 §6). El PRD del MVP lo tenía como pregunta abierta (PQ-16). La landing ya vive en `web/` con Next.js, Tailwind, shadcn/ui y pnpm (D-008). Con D-022, producto y landing comparten el dominio `lealtab.com`.

## 2. Decisión

| Capa | Elección |
|---|---|
| Lenguaje y framework | TypeScript + Next.js (App Router), **en el mismo proyecto que la landing (`web/`)**, con las rutas `/c/` (app del cliente) y `/panel/` (panel del negocio) |
| Interfaz | Tailwind + shadcn/ui, como en `web/`, con los tokens de `04-design-system/tokens.css` |
| Paquetes | pnpm, como en `web/` |
| Base de datos | Supabase Postgres |
| Autenticación | Supabase Auth: el dueño entra con correo + código o con contraseña (D-005), con SMTP propio (Resend, D-024); el cliente, con teléfono verificado por código desde el registro (D-031). Rol en `app_metadata.rol` (ADR-003 §2.5) |
| Separación entre negocios | RLS en Postgres que filtra por `negocio_id` (ADR-001 §6) |
| Analítica | Tabla propia de eventos en Supabase. Sin cookies de analítica, sin PostHog ni otras herramientas de terceros (D-018) |
| Alojamiento | Vercel, junto con la landing |
| Código del cliente (registro y recuperación) | Hook de SMS de Supabase Auth con **SMS Masivos** (WhatsApp principal, SMS de respaldo; D-024, D-031, ADR-004). Pendiente de probar que el hook funcione sin proveedor nativo (PQ-30) |
| Correo del dueño | SMTP propio con Resend (D-024) |
| Escaneo del QR en N5 Mostrador | Librería de escaneo en el navegador. **Librería: Por definir** |
| Cobro | Link de pago de Stripe o Mercado Pago (D-012), sin cambios |

### 2.1 Reglas del stack (agregadas por Aarón el 2026-10-21)

**Frontend**
- React Server Components por defecto. Los componentes de cliente se usan solo donde hacen falta.
- Tailwind CSS.
- shadcn/ui como capa estándar de componentes base.

**Infraestructura**
- **Todo el código de la app vive dentro de `web/`:** Next.js, Supabase (`web/supabase/`, con su configuración y sus migraciones) y los archivos de Docker. *(Aclarado por Aarón el 2026-10-21.)*
- **Lista para contenedores:** Docker, Docker Compose y un Dockerfile multi-stage.
- **Local:** la app está dockerizada. Docker Compose levanta Supabase con sus contenedores y la app web.
- **Producción:** Vercel compila `web/`. El contenedor no se despliega en producción.
- **Base de datos:** todo cambio es una migración de Supabase en `web/supabase/migrations`. Las migraciones corren durante el build de Vercel.

## 3. Por definir

- **Proveedor del código:** decidido, SMS Masivos (D-024). Por confirmar con el proveedor y probar: PQ-30.
- **Librería de escaneo de QR:** tiene que funcionar en el navegador del celular o la tablet del mostrador, también sin conexión (D-015) (PQ-25).
- **Identidad del cliente en Supabase Auth:** decidido (D-031, ADR-003 §2.1): `identidad.auth_user_id` ligada a `auth.users`, sin confirmación sin costo ni «por confirmar». Quedan las pruebas del ADR-003 §3 (PQ-31).
- **Región de Supabase y de Vercel**, y si hay datos fuera de México (`legal-notas.md` §3, riesgo 6). Supabase aloja el teléfono verificado de los clientes además de `identidad` (ADR-003 §4) y SMS Masivos trata datos en EE. UU. (D-024); entra en la consulta legal (PQ-18).

## 4. Consecuencias

- **Un solo proyecto y un solo despliegue.** La landing (`/`), la app del cliente (`/c/`) y el panel (`/panel/`) comparten código y despliegue en Vercel. Cambiar el producto puede afectar a la landing, así que conviene separar bien las rutas y probar la landing en cada despliegue.
- **Agentes.** La mención de PostHog estaba en `.claude/agents/lealtab-arquitecto.md`, no en el del desarrollador. Se quitó el 2026-10-21 al actualizar los agentes; los dos dicen ahora «tabla propia de eventos en Supabase, sin cookies de analítica».
- **Privacidad.**
  - Vercel, Supabase y SMS Masivos (proveedor del código) tratan datos por cuenta de LealTab.
  - Antes del piloto hay que comprobar que no pongan cookies ni carguen recursos de terceros, decidir si se nombran en el aviso y confirmar dónde guardan los datos. Esto va con la consulta legal (D-017) y la actualización del aviso (D-018).
- **Costo.** El supuesto de USD 20–50 al mes en hosting y base de datos (`03-propuesta.md` §10) sigue sin validar con los planes reales de Vercel y Supabase. Se suma el costo por mensaje del código: unos MXN 2,000 a 3,300 en el piloto, antes de IVA, con SMS como peor caso (D-031, RNF-REN-06). Durante el piloto el hosting usa los planes gratuitos de Vercel y Supabase (decisión de Aarón, 22 oct 2026, PQ-29).
- **Nota sobre las migraciones en el build de Vercel** (riesgos a cuidar al implementarlo; no cambian la decisión):
  - Los despliegues de vista previa también compilan y podrían aplicar migraciones a la base de producción. Conviene que las migraciones corran solo en los builds de producción.
  - Las credenciales de la base van en variables de entorno de Vercel, nunca en el repo.
  - Si una migración falla, el build debe fallar, para no publicar código que espera un esquema que no existe.
- **Sin conexión.** La cola en IndexedDB, la validación del QR y la firma de eventos (D-015) se hacen en el navegador. Supabase recibe los eventos al sincronizar, y la idempotencia se resuelve con el UUID de cada evento.
