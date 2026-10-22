# Alineación de documentos tras D-024 a D-031 y el PRD v1.6

Propuestas para los documentos protegidos o de otro rol. **No hay decisiones nuevas**: cada reemplazo aplica lo ya decidido (D-024 a D-031, PRD v1.6, ADR-003 y ADR-004). Aarón las aprueba y después se aplican. Los números de línea son del estado del repo al 22 oct 2026 (commit 0b16fe5 más la limpieza de `AGENTS.md` y `PRODUCT.md`).

Ya aplicado, para referencia: `AGENTS.md` (rango de D-, PRD v1.6, regla de cookies, criterio de salida con SMS Masivos) y `PRODUCT.md`. `CLAUDE.md` no tenía referencias a D-001 a D-023, a PRD v1.4 ni a WhatsApp Business: no requirió cambios.

Cómo leer cada propuesta: **Antes → Después**, con la fuente que la justifica.

---

## 1. `docs/02-plan-de-trabajo.md` (plan v3)

**1.1 · Línea 3 (cabecera).** Fuente: D-024 a D-031.
- Antes: `Incorpora D-001 a D-017 de \`docs/decisiones.md\`.`
- Después: `Incorpora D-001 a D-031 de \`docs/decisiones.md\`.`
- Nota: el ajuste del 21 oct entre paréntesis puede ganar una frase «Ajuste del 22 oct 2026: el cliente usa Supabase Auth con el teléfono verificado por código (D-031) y el código sale con SMS Masivos (D-024)».

**1.2 · Línea 48 (App del cliente, C0-C5).** Fuente: D-031, RF-APP-01.
- Antes: `registro con nombre + WhatsApp y aviso de privacidad, sin contraseña.`
- Después: `registro con nombre + WhatsApp verificado con un código por WhatsApp o SMS (D-031) y aviso de privacidad, sin contraseña.`

**1.3 · Línea 50 (Recuperación de tarjeta).** Fuente: D-031 («registro y recuperación son el mismo flujo»), D-024.
- Antes: `Con el número de WhatsApp si el cliente cambia de teléfono o borra datos`
- Después: `Con el número de WhatsApp y un código por WhatsApp o SMS (SMS Masivos, D-024) si el cliente cambia de teléfono o borra datos; es el mismo flujo del registro (D-031)`

**1.4 · Línea 82 (iOS borra datos).** Fuente: D-031.
- Antes: `La identidad vive en el servidor; se recupera por WhatsApp`
- Después: `La identidad vive en el servidor; se recupera con un código por WhatsApp o SMS (D-031)`

**1.5 · Línea 111 (criterio de salida de la Fase 7).** Fuente: D-024, D-018, D-017; coincide con `AGENTS.md` §1 y con el coordinador. El plan hoy no lista el aviso ni el proveedor.
- Antes: `... de al menos 3 oficios, y las dos validaciones del ADR-001 están hechas.`
- Después: `... de al menos 3 oficios, las dos validaciones del ADR-001 están hechas (D-017) y, antes del piloto, el aviso de privacidad está actualizado para la analítica (D-018) y el proveedor del código (SMS Masivos) está configurado y probado (D-024).`
- Sin fechas: se mantiene el criterio por salida.

**1.6 · Línea 173 (nota de actualización).** Fuente: PRD v1.6, D-031.
- Antes: `Actualizado el 21 oct 2026 contra el PRD v1.4 y D-001 a D-023.`
- Después: `Actualizado el 22 oct 2026 contra el PRD v1.6 y D-001 a D-031.`

**1.7 · Barrido de «WhatsApp Business».** El plan no contiene esa cadena (verificado con Grep); el criterio con «WhatsApp Business → SMS Masivos» que pidió el brief vivía en `AGENTS.md` y en los agentes. No hay cambio adicional aquí.

---

## 2. `docs/adr/001-modelo-pwa.md`

D-031 sustituye D-025 y aclara D-019. El ADR-003 ya declara qué partes de ADR-001 reemplaza. Se propone **dejar el historial y marcar lo sustituido**, sin borrar.

**2.1 · §5.2 punto 6, línea 151 (iOS sin sesión en Safari).** Fuente: D-031 («sin sesión, pide WhatsApp y código»), ADR-003 §2.2, RF-APP-05 retirado.
- Antes: `- Si Safari no tiene sesión, el cliente escribe su WhatsApp. La tarjeta se liga a la \`identidad\` de ese teléfono, pero queda **por confirmar**: no se muestra en la app hasta que el cliente la acepta desde la app instalada (que sí tiene sesión) o el cajero lo verifica al dar el primer sello. Así, quien escriba un teléfono ajeno no puede meter tarjetas en el perfil de otra persona.`
- Después: `- Si Safari no tiene sesión, el cliente escribe su WhatsApp y el código que recibe (mismo flujo del registro, D-031). Al verificar, entra a su cuenta y «Mis tarjetas» muestra todas las de su identidad. Ya no existe el estado «por confirmar» ni la confirmación por el cajero; el código impide meter tarjetas en el perfil de otra persona. *(Sustituido el 22 oct 2026 por D-031; antes: tarjeta «por confirmar», D-025.)*`

**2.2 · §5.2 punto 6, línea 148 (Android).** Fuente: D-031.
- Antes: `El cliente acepta el registro con un toque y la tarjeta aparece en "Mis tarjetas".`
- Después: `El cliente escribe su nombre para ese negocio y acepta el aviso (sin código, porque hay sesión, D-031) y la tarjeta aparece en "Mis tarjetas".`
- Nota: lo mismo aplica a la línea 150 («el alta es de un toque»): con sesión no pide código, pero sí nombre y consentimiento del negocio (D-019, D-031).

**2.3 · §6 «Recuperación», línea 203.** Fuente: D-024, D-031.
- Antes: `... recupera con un **código enviado por WhatsApp** mediante la API de WhatsApp Business, de pago. ... Costo y configuración de la API: pendientes.)*`
- Después: `... recupera con un **código enviado por WhatsApp o SMS** con SMS Masivos y el hook de Supabase Auth (D-024), de pago por mensaje (MXN 0.77 a 0.90 por SMS, antes de IVA). Desde D-031 el código también se pide en el registro. Lo pendiente con el proveedor está en PQ-30.)*`

**2.4 · §7 «Sesión al instalar en iOS», líneas 215, 222-225 (puntos 1, 3, 4).** Fuente: ADR-003 §2.3 y §2.4, RNF-PWA-05, PQ-31.
- Punto 1 (línea 215). Antes: `una cookie \`HttpOnly\` y \`Secure\` emitida por el servidor, de larga duración.` → Después: `las cookies de sesión de Supabase Auth, escritas por el servidor con \`@supabase/ssr\` (\`lt-cliente\`, \`Path=/c\`, \`HttpOnly\`, \`Secure\`, \`SameSite=Lax\`), de larga duración (ADR-003 §2.4).`
- Punto 3 (línea 223). Antes: `el cliente canjea el token por una sesión nueva en el contenedor de la app` → Después: `el cliente canjea el token por una sesión de Supabase en el contenedor de la app. El mecanismo (A: correo técnico y \`generateLink\`; B: código nuevo) está Por definir hasta la prueba de PQ-31 (ADR-003 §2.3).`
- Punto 4 (línea 224). Antes: `el respaldo ... la app pide el WhatsApp y muestra un código de 6 dígitos que el cliente confirma en la pestaña de Safari ... o con el cajero. No hay costo de OTP.` → Después: `el respaldo es el mecanismo B: la PWA pide un código nuevo por WhatsApp o SMS al abrirse por primera vez en iPhone. Cuesta un mensaje más por instalación (RF-APP-15, ADR-003 §2.3). Ya no se confirma con el cajero.`

**2.5 · §10 «Qué medir», líneas 265-268.** Fuente: PRD MET-05, MET-06, MET-07, MET-08 retirada.
- Línea 265. Antes: `<60%: priorizar el respaldo del código o revisar S1` → Después: `<60%: pasar al respaldo B (código nuevo al abrir la PWA en iPhone, RNF-PWA-05; con B la métrica mide cuántos completan ese código, MET-06)`.
- Línea 266. Antes: `Recuperaciones en apps instaladas de iOS | <10% de los inscritos` → Después: `Recuperaciones (\`recuperacion_completada\`: verificación del código por un teléfono que ya tenía tarjetas, sin sesión en ese navegador) | <10% de los inscritos (MET-05)`.
- Línea 267. Agregar al final de «Señal para revisar» o en nota: `Con D-031, el segundo negocio con sesión sigue en un paso, sin código; sin sesión cuenta como registro con código (MET-03) y recuperación (MET-05) (MET-07).`
- Línea 268 (`Tarjetas por_confirmar que nunca se confirman`). Antes: la fila completa. Después: `~~Tarjetas \`por_confirmar\` que nunca se confirman~~ **Retirada (D-031, 22 oct 2026): el estado «por confirmar» ya no existe (MET-08).**`

**2.6 · Cabecera, línea 3 (Estado).** Opcional. Agregar al final: `Parcialmente sustituido por D-031 (sesión y alta del segundo negocio, §5.2 punto 6, §6 y §7).`

---

## 3. `docs/adr/002-stack.md`

D-024 completó los «Por definir» de D-023 (salvo la librería de QR, PQ-25) y D-031 cambió la identidad del cliente.

**3.1 · Restricciones vigentes, línea 11.** Fuente: D-024.
- Antes: `D-011: código de recuperación por WhatsApp.`
- Después: `D-011 y D-024: código de WhatsApp (principal) o SMS (respaldo) con SMS Masivos y el hook de Supabase.`

**3.2 · Restricciones vigentes, línea 15.** Fuente: D-018, ADR-003 §2.4.
- Antes: `D-018: analítica propia, sin cookies.`
- Después: `D-018: analítica propia, sin cookies de analítica ni de terceros (las cookies de sesión de Supabase Auth son de primera parte y necesarias, ADR-003 §2.4).`
- Agregar bullets: `D-024: proveedor del código y SMTP del dueño (Resend).` y `D-031: el cliente usa Supabase Auth con teléfono verificado por OTP.`

**3.3 · Tabla §2, línea 31 (Autenticación).** Fuente: D-031.
- Antes: `Supabase Auth: el dueño entra con correo + código o con contraseña (D-005)`
- Después: `Supabase Auth: el dueño entra con correo + código o con contraseña (D-005), con SMTP propio (Resend, D-024); el cliente, con teléfono verificado por código desde el registro (D-031). Rol en \`app_metadata.rol\` (ADR-003 §2.5)`

**3.4 · Tabla §2, línea 33 (Analítica).**
- Antes: `Sin cookies, sin PostHog ni otras herramientas de terceros (D-018)`
- Después: `Sin cookies de analítica, sin PostHog ni otras herramientas de terceros (D-018)`

**3.5 · Tabla §2, línea 35 (Código por WhatsApp).** Fuente: D-024, ADR-004.
- Antes: `Código de recuperación por WhatsApp | Hook de teléfono/OTP de Supabase Auth, con un proveedor externo configurado en Supabase. **Proveedor: Por definir**`
- Después: `Código del cliente (registro y recuperación) | Hook de SMS de Supabase Auth con **SMS Masivos** (WhatsApp principal, SMS de respaldo; D-024, D-031, ADR-004). Pendiente de probar que el hook funcione sin proveedor nativo (PQ-30)`
- Agregar fila: `Correo del dueño | SMTP propio con Resend (D-024)`.

**3.6 · §3 «Por definir», líneas 55-58.** Fuente: D-024, D-031, ADR-003, PRD §12.
- Línea 55 (Proveedor del código por WhatsApp). Antes: el bullet completo. Después: `**Proveedor del código:** decidido, SMS Masivos (D-024). Por confirmar con el proveedor y probar: PQ-30.`
- Línea 56 (Librería de QR). Se queda; agregar `(PQ-25)`.
- Línea 57 (Identidad del cliente). Antes: el bullet completo. Después: `**Identidad del cliente en Supabase Auth:** decidido (D-031, ADR-003 §2.1): \`identidad.auth_user_id\` ligada a \`auth.users\`, sin confirmación sin costo ni «por confirmar». Quedan las pruebas del ADR-003 §3 (PQ-31).`
- Línea 58 (Región). Agregar: `Supabase aloja el teléfono verificado de los clientes además de \`identidad\` (ADR-003 §4) y SMS Masivos trata datos en EE. UU. (D-024); entra en la consulta legal (PQ-18).`

**3.7 · §4 Consecuencias, líneas 65 y 67.**
- Línea 65. Antes: `el proveedor del código por WhatsApp tratan datos` → Después: `SMS Masivos (proveedor del código) trata datos`.
- Línea 67. Antes: `Se suma el costo por mensaje del proveedor de WhatsApp.` → Después: `Se suma el costo por mensaje del código: unos MXN 2,000 a 3,300 en el piloto, antes de IVA, con SMS como peor caso (D-031, RNF-REN-06). El hosting de pago sigue en PQ-29.`
- Línea 63 («sin cookies»): cambiar a `sin cookies de analítica`.

---

## 4. `docs/fase-2/legal-notas.md`

Es histórico (numeración vieja), pero `AGENTS.md` lo nombra como fuente legal. Las notas nuevas sirven a la consulta legal (D-017) y a PQ-18; se proponen como un punto nuevo en §5 «Pendientes».

**4.1 · Línea 84 (Recuperación por WhatsApp).** Fuente: D-024, D-031.
- Antes: `**Recuperación por WhatsApp (D-011, cambio del 21 oct 2026):** el código de recuperación se envía con la API de WhatsApp Business. Revisar con el abogado si Meta actúa como proveedor o subencargado y cómo se menciona en el aviso.`
- Después: `**Código del cliente (D-011, D-024 y D-031):** el código de verificación, en el registro y en la recuperación, se envía por WhatsApp o SMS con SMS Masivos y el hook de Supabase Auth. Revisar con el abogado si SMS Masivos (y Meta, si su WhatsApp usa la API oficial; Por confirmar con el proveedor, PQ-30) actúan como encargados y cómo se mencionan en el aviso.`

**4.2 · Punto nuevo en §5, después de la línea 84 (cookies de sesión).** Fuente: ADR-003 §2.4, D-031, PQ-18.
- Texto: `**Cookies de sesión (ADR-003 §2.4, D-031):** «sin cookies» (D-018) se refiere a la analítica y a los terceros. Existen cookies de sesión de Supabase Auth, de primera parte, \`HttpOnly\` y necesarias (\`lt-cliente\` en \`/c\` y \`lt-dueno\` en \`/panel\`). Decidir con el abogado cómo se declaran en el aviso (PQ-18, punto 1 y punto 4).`

**4.3 · Punto nuevo en §5 (teléfono en `auth.users`, EE. UU.).** Fuente: ADR-003 §4, PQ-18.
- Texto: `**Teléfono verificado en Supabase (D-031):** el teléfono del cliente vive también en \`auth.users\` de Supabase (región \`us-east-1\` \`[SUPUESTO]\`, ADR-003 §4), además de \`identidad\`. Al borrar la cuenta (D-026) se borra también ese usuario, pero la documentación de Supabase no aclara qué pasa con las sesiones del usuario borrado (ADR-003 §2.7). Va a la consulta legal sobre transferencias fuera de México y al aviso (PQ-18, punto 2).`

**4.4 · Punto nuevo en §5 (SMS Masivos y retención de 3 meses).** Fuente: D-024, PQ-18, RNF-PRI-08.
- Texto: `**SMS Masivos (D-024):** trata los datos en EE. UU., como encargado, y conserva número y contenido hasta 3 meses. Entra en el aviso y en la consulta legal (PQ-18, punto 3; RNF-PRI-08). El consentimiento del registro debe quedar antes del envío del código, porque el número se manda al proveedor desde el primer paso de C1 (PQ-18, punto 4).`

**4.5 · Para PQ-18 y PQ-04.** El plazo de retención y qué se borra al eliminar la cuenta siguen **Por definir** (PQ-04). No se inventa un plazo.

---

## 5. `.claude/agents/lealtab-*.md`

Verificado con Grep sobre los nueve agentes. Se agrupan por tipo de cambio.

### 5.1 La línea de D-011 (nueve agentes, mismo texto)

Archivos y líneas: `lealtab-coordinador.md:61`, `lealtab-arquitecto.md:66`, `lealtab-copywriter.md:61`, `lealtab-product-designer.md:58`, `lealtab-growth.md:49`, `lealtab-investigador.md:45`, `lealtab-investigador-clientes.md:54`, `lealtab-desarrollador.md:70`, `lealtab-analista-metricas.md:63`. Fuente: D-011, D-024, D-031.
- Antes: `  - D-011: el resumen semanal vive **solo en el panel** (N0). La API de WhatsApp Business se usa solo para el código de recuperación del cliente.`
- Después: `  - D-011: el resumen semanal vive **solo en el panel** (N0). El código del cliente (registro y recuperación) sale por WhatsApp o SMS con SMS Masivos y el hook de Supabase (D-024, D-031); no hay API de WhatsApp Business propia.`

### 5.2 Línea de D-018 (mismas nueve líneas: coordinador:65, arquitecto:70, copywriter:65, designer:62, growth:53, investigador:49, investigador-clientes:58, desarrollador:74, analista:67)
- Antes: `  - D-018: analítica propia, sin cookies y sin herramientas de terceros.`
- Después: `  - D-018: analítica propia, sin cookies de analítica y sin herramientas de terceros. La sesión de Supabase Auth usa cookies necesarias de primera parte (ADR-003 §2.4).`
- Mismo ajuste en `lealtab-desarrollador.md:23` (`Sin cookies, sin PostHog` → `Sin cookies de analítica, sin PostHog`) y en `lealtab-analista-metricas.md:14` (`sin cookies ni herramientas de terceros` → `sin cookies de analítica ni herramientas de terceros`); `lealtab-qa.md:29` (`sin cookies ni scripts de terceros (D-018)` → `sin cookies de analítica ni scripts de terceros (D-018); solo las cookies de sesión de Supabase Auth, de primera parte`).
- `lealtab-copywriter.md:25` (`analítica sin cookies`) → `analítica sin cookies de analítica ni de terceros`; el aviso debe nombrar las cookies de sesión (PQ-18).

### 5.3 Decisiones nuevas en la lista «no se reabren» (los nueve agentes, después de la línea de D-023; coordinador:67)
Agregar dos viñetas:
- `  - D-024: el código del cliente se envía con SMS Masivos y el hook de SMS de Supabase; el correo del dueño sale por Resend.`
- `  - D-031: el cliente usa Supabase Auth con su teléfono verificado por un código desde el registro; sin «por confirmar»; dueño y cliente comparten \`auth.users\` y se distinguen por \`app_metadata.rol\`.`

### 5.4 `lealtab-coordinador.md`
- Línea 17. Antes: `cuáles bloquean la Fase 7 (PQ-01, PQ-04, PQ-07, PQ-13, PQ-18) y quién las cierra.` → Después: `cuáles bloquean la Fase 7 (PQ-01, PQ-04, PQ-07, PQ-18) y quién las cierra. PQ-13 está cerrada (D-024); PQ-30 y PQ-31 bloquean construir C1, la recuperación y la sesión del cliente (D-031), y PQ-29 sigue pendiente de Aarón.` Fuente: PRD §12.
- Línea 14 (criterios de salida de la Fase 7). Antes: `API de WhatsApp configurada (D-011)` → Después: `proveedor del código (SMS Masivos) configurado y probado (D-024)`.
- Gate 1: sin cambio, pero MET-03 puede bajar con el paso del código (D-031).

### 5.5 `lealtab-arquitecto.md`
- Línea 16. Antes: `Sesión en iOS con cookie \`HttpOnly\` y \`install_token\` de un solo uso (24 h), con respaldo por código de 6 dígitos.` → Después: `Sesión del cliente con Supabase Auth: cookies \`lt-cliente\` (\`/c\`) y \`lt-dueno\` (\`/panel\`) escritas por el servidor con \`@supabase/ssr\`, \`install_token\` de un solo uso (24 h) y, como respaldo, un código nuevo al abrir la PWA en iPhone (ADR-003 §2.3 y §2.4; mecanismo por probar, PQ-31).`
- Línea 17. Antes: `con estado \`activa\` o \`por_confirmar\`.` → Después: `sin estado \`por_confirmar\` (D-031); \`identidad.auth_user_id\` ligada a \`auth.users\` (ADR-003 §2.1).`
- Línea 19. Antes: `Background Sync, revalidación en el servidor` → Después: `sincronización por apertura de N5, \`visibilitychange\`, \`online\`, cada 30 s y botón «Sincronizar» (Background Sync no es requisito, RNF-OFF-04), revalidación en el servidor`.
- Línea 20. Antes: `**Recuperación (D-011):** código por WhatsApp con el hook de teléfono/OTP de Supabase Auth y un proveedor externo.` → Después: `**Código del cliente (D-011, D-024, D-031):** registro y recuperación con el hook de SMS de Supabase Auth y SMS Masivos (ADR-004); WhatsApp principal, SMS de respaldo.`
- Línea 26. Antes: `y cliente (cómo se relaciona la \`identidad\` con Supabase Auth).` → Después: `y cliente (teléfono verificado con OTP, D-031, ADR-003).`
- Línea 30. Antes: `(el siguiente es el 003)` → Después: `(el siguiente es el 005; ya existen el 003 y el 004)`.
- Líneas 33, 34, 36, 37. Estado según el PRD §12:
  - PQ-13 y PQ-23 están **cerradas** (D-024): reemplazar por `**PQ-30:** confirmaciones por escrito con SMS Masivos y prueba del hook sin proveedor nativo.` y `**PQ-31:** \`install_token\` de iOS con la sesión de Supabase (mecanismo A o B) y las pruebas del ADR-003 §3.`
  - PQ-22 está **cerrada**: quitar la línea 36.
  - Línea 37 (PQ-18 y RNF-STK-10): `el proveedor de WhatsApp` → `SMS Masivos`.
  - Línea 38 (PQ-24) está cerrada; el costo del hosting vive en **PQ-29**.

### 5.6 `lealtab-copywriter.md`
- Línea 20 (`PQ-12`): cerrada por D-026. Antes: `C5 Mis datos: ver y borrar la cuenta (con \`lealtab-product-designer\`, PQ-12).` → Después: `C5 Mis datos: ver y borrar la cuenta (D-026; el plazo legal sigue en PQ-04).`
- Línea 22. Antes: `Plantilla del código de recuperación por WhatsApp, que Meta debe aprobar (D-011, RF-APP-15).` → Después: `Textos del paso del código en C1 y R1 y el mensaje del código (la plantilla de WhatsApp es la fija del proveedor y el SMS va en GSM-7, sin cuenta de Meta propia; D-024, D-031, RF-APP-15).`
- Línea 23. Antes: `Texto prellenado de «Escribir por WhatsApp» en N7 (PQ-05).` → Después: `Las tres plantillas de «Escribir por WhatsApp» en N7 están decididas (D-030, \`docs/fase-7/propuestas/pq-copy.md\`); solo el ajuste final si el abogado pide una línea de baja (PQ-04).`

### 5.7 `lealtab-product-designer.md`
- Línea 19. Antes: `**PQ-12:** C5 Mis datos ...` → Después: `**C5 Mis datos:** cerrada por D-026 (\`/c/cuenta\`, borrar con casilla y efecto inmediato); falta el diseño según D-026 y PQ-04.`
- Línea 23. Antes: `**PQ-20:** definición de «semana» ...` → Después: cerrada por D-028; se sustituye por `**D-031:** rediseñar C1 en dos pasos, R1 sin la promesa de código y C0 sin «por confirmar» (PRD v1.6; ADR-003 §3, punto 9).`

### 5.8 `lealtab-investigador.md`
- Línea 17. Antes: `(por ejemplo, el del código por WhatsApp de PQ-13)` → Después: `(el proveedor del código ya está elegido, D-024; queda comparar costos si PQ-30 muestra que SMS Masivos no cumple)`.

### 5.9 `lealtab-analista-metricas.md`
- Línea 29. Antes: `... recuperaciones <10 %, transferencia de sesión en iOS ≥80 %, segundo negocio ≥60 %, tarjetas por confirmar sin confirmar <20 %, clientes con ≥2 negocios ...` → Después: quitar «tarjetas por confirmar sin confirmar <20 %» (MET-08 retirada por D-031). Revisar la numeración de MET-01 a MET-12 contra el PRD §2.3 y agregar los eventos de códigos pedidos, verificados y fallidos que ADR-003 §3 punto 9 deja pendientes.

### 5.10 Sin cambio detectado
`lealtab-qa.md` y `lealtab-desarrollador.md`: más allá de las líneas de D-011 y D-018 de arriba, no citan PQ-13, Background Sync ni «por confirmar». Ningún agente cita una versión vieja del PRD (Grep de `PRD v1.x` sin resultados; `lealtab-qa.md:27` menciona «paridad v1.7», que es la landing y está bien).

---

## Resumen de documentos que cambian

| Documento | Cambios | Justificación |
|---|---|---|
| `docs/02-plan-de-trabajo.md` | 6 | D-024, D-031, PRD v1.6 |
| `docs/adr/001-modelo-pwa.md` | 6 | D-031 (sustituye D-025), RF-APP-05 retirado, MET-08 retirada |
| `docs/adr/002-stack.md` | 7 | D-024, D-031 |
| `docs/fase-2/legal-notas.md` | 4 | PQ-18, D-024, ADR-003 §2.4 |
| `.claude/agents/lealtab-*.md` | 9 agentes | D-011/D-024, D-018, D-031, PQ cerradas |
