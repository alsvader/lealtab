# Reconciliación de los cambios externos del 26 oct 2026

Propuesta del coordinador. **Nada de lo que sigue está aprobado ni registrado.** Aarón decide. No se editó ningún archivo existente ni se corrió ningún comando que cambie el árbol de trabajo.

## 0. Resumen ejecutivo

- Los 5 archivos que trae Aarón parten de una base **anterior al 21 oct** (PRD v1.4 → «v1.5»). Frente a lo commiteado (PRD v2.6, D-001 a D-031, ADR-002 con D-024 y D-031), el conjunto es **sobre todo una regresión**: borra D-026 a D-031, las aclaraciones de D-004, D-005, D-011, D-014, D-015, D-019 y D-023, las PQ cerradas del 21 y 22 oct, las convenciones de Gate 1 y toda la parte de D-031 y SMS Masivos.
- **Choques de numeración** con lo vigente: su «D-024 Contraseña del dueño» y su «D-025 Borrado y exportación C5» ocupan números que ya tienen otra decisión (D-024 = SMS Masivos con el hook; D-025 = sustituida por D-031). Su «PQ-26» choca con la PQ-26 vigente (cerrada, D-029: los sellos no caducan). Su «pieza 08» choca con `08-registro-con-codigo.md`.
- **Lo realmente nuevo es poco** (sección 3): borrar la tarjeta de un solo negocio, confirmar con «BORRAR», historial anónimo para el negocio, «Descargar mis datos» en PDF, nombre editable en C5, RNF-PRI-11 (ARCO), el texto de privacidad de C5 y una verificación sobre los límites de Supabase Auth.
- **La pieza de pantallas no llegó.** `brand/06-product-design/08-ajustes-n1-y-c5.md` y la carpeta `ajustes-08/` (que el PRD cita como `ajustes-08/n1-acceso` y `ajustes-08/c5-mis-datos`) no existen en el repo ni en el respaldo. No hay nada que revisar de esas pantallas todavía (sección 4). Lo vigente que cubre ese terreno: `docs/fase-7/propuestas/diseno/n1-cuenta-contrasena.html` y `c5-mis-datos.html` (aprobados el 21 oct, D-005 aclarada y D-026), `pq-diseno.md` (PQ-10 y PQ-12), `brand/06-product-design/08-registro-con-codigo.md`, RF-ALT-02/02b/02c y RF-APP-14.
- **Recomendación:** volver al estado limpio (sección 5) **después de** guardar el respaldo fuera de `/tmp`, y reintroducir solo lo rescatable, como propuestas, cuando Aarón responda lo de la sección 4.

**Alcance de esta revisión y límites.** Esta sesión no tenía shell: no pude correr `git diff HEAD` ni `git show HEAD:`. Comparé con `cambios-externos.diff` (formato `git diff HEAD`: las líneas `-` son lo vigente, las `+` son lo de Aarón) y con lecturas del árbol de trabajo (cabeceras de versión, encabezados D-024 y D-025 en `decisiones.md` líneas 216 y 223, ausencia de la pieza 08). Las referencias `L###` apuntan a líneas de ese diff. No verifiqué línea por línea que `brand/07-desarrollo/PRD-lealtab-mvp.md` sea idéntico a `docs/prd/PRD-lealtab-mvp.md`; solo comprobé que ambos dicen v1.5 (hay un comando de comprobación en la sección 5).

Ruta del respaldo: `/private/tmp/claude-501/-Users-alsvader-Documents-Github-lealtab/1b9d4729-ae6c-4f39-8b0f-819682bc9b0d/scratchpad/respaldo-externo-26oct/` (la ruta con `alsvector` no existe; la buena es `alsvader`).

---

## 1. Tabla de cada cambio de Aarón

Estados: **Cubierto** = ya cubierto por lo vigente; **Contradice** = contradice lo vigente; **Nuevo** = no existe en lo vigente.

### 1.1 `brand/PLAN.md` (L1 a L41)

| # | Qué dice Aarón | Equivale a (vigente) | Estado |
|---|---|---|---|
| P1 | C5 «ya tiene pieza 08 aprobada el 26 oct» (`08-ajustes-n1-y-c5.md`), con N1 con contraseña y C5 en `/c/cuenta` «(D-024, D-025)» | Wireframes aprobados el 21 oct en `docs/fase-7/propuestas/diseno/` (D-005 aclarada, D-026). La pieza 08 vigente es el registro con código (D-031). La pieza citada no existe | **Contradice** (numeración de pieza y de D-) y **Nuevo** (la pieza, si trae cambios) |
| P2 | «PRD v1.5 … copia en `07-desarrollo/`» | PRD v2.6, una sola copia en `docs/prd/` (copia retirada el 21 oct, `07-desarrollo/README.md`) | **Contradice** |
| P3 | Tacha el pendiente «ajustar N1 para contraseña» como hecho en la pieza 08 | D-005 aclarada (21 oct) y `n1-cuenta-contrasena.html`. El `PLAN.md` vigente todavía lo lista como pendiente y está desactualizado | **Cubierto** (la intención); el texto de Aarón cita una pieza inexistente |
| P4 | Pendiente: consulta legal sobre el borrado global desde C5 (frente al rol de encargado) y ARCO (RNF-PRI-11, PQ-07) | PQ-07 y RNF-PRI-03 cubren la consulta legal y el rol; el borrado global no está nombrado en PQ-07 | **Nuevo** (útil) |
| P5 | Pendiente: el aviso debe coincidir con el texto de C5 («Sin cookies de rastreo. Solo registramos el uso de la app para mejorarla») | PQ-18, D-018, RNF-PRI-07; `c5-mis-datos.html` línea 112 tiene otro texto «Por definir (PQ-18)» | **Cubierto** (PQ-18); el texto es **Nuevo** (ver N4) |
| P6 | Pendiente (Por definir): contenido del PDF de «Descargar mis datos» y cómo se protege sin contraseña en `/c/` | No existe PDF en lo vigente. Sobre la protección: el cliente ya tiene sesión de Supabase Auth con teléfono verificado (D-031), así que «sin contraseña» no es un hueco | **Nuevo** (ver N3) |
| P7 | Pendiente antes de N1: límites de Supabase Auth (bloqueo por cuenta, vencimientos de 10 y 60 min), PQ-26 | RF-ALT-02c y la tabla `intento_acceso_dueno` (ADR-006) ya resuelven el bloqueo por correo con tabla propia; un solo vencimiento (10 min) | **Cubierto** en lo esencial; la pregunta de 60 min solo existe si se adopta el enlace (ver C2) |
| P8 | Pendiente: los HTML de N1 y C5 usan `16px` fijo; en código, `--font-size-input` | `07-entrega` §2 y RNF-A11Y-03 ya lo exigen; el desarrollador lo aplica | **Cubierto** |
| P9 | Fila de la Fase 7 en la tabla: carpeta `07-desarrollo/` | Entregables en `docs/fase-7/`, código en `web/` | **Contradice** |
| P10 | Borra 3 entradas de bitácora (21 oct AGENTS/CLAUDE y limpieza; 22 oct pieza 08 de registro con código; 22 oct aclaración de D-028) | Son historial vigente | **Contradice** (pérdida de historial) |
| P11 | Agrega «2026-10-26 Resumen semanal… sin cambios en archivos desde el 21 oct» | Falso frente a HEAD (hay 5 commits de T2 a T5 y los documentos hasta v2.6) | **Contradice** |
| P12 | Agrega «2026-10-26 Aarón aprobó la pieza 08 … (D-024, D-025) … PRD v1.5 … PQ-26 nueva» | Ver P1 | **Contradice** (numeración) y **Nuevo** (la aprobación) |

### 1.2 `docs/adr/002-stack.md` (L42 a L107)

| # | Qué dice Aarón | Equivale a (vigente) | Estado |
|---|---|---|---|
| A1 | Quita «D-011 y D-024: código por WhatsApp con SMS (respaldo) con SMS Masivos y el hook de Supabase» y deja «D-011: código por WhatsApp» | D-024 vigente | **Contradice** |
| A2 | Quita las restricciones de D-024 (Resend) y D-031 | D-024 y D-031 | **Contradice** |
| A3 | D-018 «sin cookies» (en vez de «sin cookies de analítica ni de terceros; las de sesión de Supabase son de primera parte y necesarias, ADR-003 §2.4») | D-018 con la aclaración de ADR-003 §2.4; RNF-PRI-07 | **Contradice** (impreciso: la sesión de Supabase sí usa cookies) |
| A4 | Fila Autenticación sin SMTP Resend, sin cliente con OTP, sin `app_metadata.rol` | D-024, D-031, ADR-003 §2.5 | **Contradice** |
| A5 | Filas «Código del cliente» y «Correo del dueño»: proveedor «Por definir» | D-024: SMS Masivos con el hook; Resend | **Contradice** |
| A6 | §3 Por definir: proveedor, identidad Auth «por definir», librería de QR sin PQ-25, región sin SMS Masivos | D-024, D-031, PQ-25, PQ-18 | **Contradice** |
| A7 | §3 agrega «Límites de Supabase Auth para D-024» (bloqueo por cuenta, 10 y 60 min) | RF-ALT-02c e `intento_acceso_dueno` | **Cubierto** en lo esencial; **Nuevo** como verificación (N5) |
| A8 | §4 Consecuencias: «proveedor de WhatsApp», costo sin los MXN 2,000 a 3,300 de códigos y sin PQ-29 (planes gratuitos) | D-023 aclarada, PQ-29 cerrada, RNF-REN-06 | **Contradice** |

### 1.3 `docs/decisiones.md` (L108 a L374)

| # | Qué dice Aarón | Equivale a (vigente) | Estado |
|---|---|---|---|
| D1 | D-004: quita la aclaración del 21 oct (`alta_ts`, `tanda`, `version_producto`) y la del 22 oct (convenciones de Gate 1: día 1, 4 semanas, visita, «regresa», G1-d global, ≥8 evaluables, veredicto) | D-004 vigente, PQ-32 cerrada | **Contradice** |
| D2 | D-005: quita lo «Aclarado 21 oct» (pestañas, contraseña opcional plegada, código de 6 dígitos de 10 min para restablecer, 8 a 72 caracteres, 5 fallos pausan la contraseña, Resend) | D-005 vigente (cierra PQ-10 y PQ-28) | **Contradice** |
| D3 | D-011: quita lo «Aclarado» (SMS Masivos, respaldo por SMS) | D-011 y D-024 | **Contradice** |
| D4 | D-014: quita 3 aclaraciones (X en horas con 2 decimales y ventana móvil; zona IANA; límite visible en C3) | D-014 vigente (PQ-06 y PQ-22 a/b) | **Contradice** |
| D5 | D-015: quita lo «Aclarado» (N5 abre con conexión, sin segundo service worker, cuándo sincroniza, evento de reapertura) | D-015 vigente | **Contradice** |
| D6 | D-019: quita la aclaración del 22 oct (sin `por_confirmar`, `auth_user_id`) | D-019 y D-031 | **Contradice** |
| D7 | D-022: agrega «se suma `/c/cuenta` para C5 (D-025), junto a `/c/recuperar` (D-011)» | RNF-PWA-03 y D-026 ya fijan `/c/cuenta` | **Cubierto** (la ruta); opcional como nota |
| D8 | D-023: quita SMS Masivos, PQ-25, las aclaraciones del 21 y 22 oct (PQ-29, RNF-STK-13, esquema, CI, detalles de CSV y rendimiento) y agrega el pendiente de límites de Auth | D-023 vigente | **Contradice** |
| D9 | «D-024 · 26 oct · Contraseña y recuperación del dueño» **reemplaza** a D-024 SMS Masivos (L226 a L250) | D-024 vigente es otra decisión | **Contradice** (colisión de número y borra la vigente) |
| D10 | «D-025 · 26 oct · Borrado y exportación C5» **reemplaza** a D-025 (sustituida por D-031) y borra D-026 a D-031 (L251 a L370) | D-026 (borrado desde C5), D-027 (corregir sellos), D-028 (semana, chips), D-029 (no caducan), D-030 (plantillas `wa.me`), D-031 (cliente con Supabase Auth) | **Contradice** (colisión y pérdida de seis decisiones) |
| D11 | Contenido de su D-024: mínimo 8 caracteres | RF-ALT-02b vigente: 8 a 72 | **Cubierto** |
| D12 | …enlace de recuperación de 60 min, de un solo uso | D-005 aclarada: código de 6 dígitos, 10 min | **Contradice** |
| D13 | …tras 5 intentos «la cuenta se bloquea 15 minutos» | RF-ALT-02c: solo se pausa la contraseña; el código por correo y las sesiones abiertas (incluido el mostrador) siguen | **Contradice** (alcance del bloqueo) |
| D14 | …error genérico «Correo o contraseña incorrectos» y mensaje que no revela si el correo existe | RF-ALT-02b y 02c | **Cubierto** |
| D15 | Contenido de su D-025: borrado inmediato de nombre y WhatsApp; recompensas pendientes se pierden | D-026 (inmediato) y C5·6 (lista las recompensas que se pierden) | **Cubierto** |
| D16 | …borrar la tarjeta de **un solo negocio** además de la cuenta completa | D-026 descarta «borrar por negocio» para el MVP (v1 si lo piden) | **Contradice**; es **Nuevo** como propuesta (N1) |
| D17 | …confirmar escribiendo **BORRAR** | D-026: casilla de confirmación, sin código | **Contradice** (detalle de UI) |
| D18 | …el negocio conserva el **historial anónimo** de sellos, sin nombre ni WhatsApp | PQ-04 lo deja Por definir («si los eventos de cada negocio se conservan sin datos personales»); `pq-diseno.md` lo recomienda `[SUPUESTO: legal]` | **Nuevo** como decisión (N2) |
| D19 | …«Descargar mis datos» genera un PDF legible, descarga directa | No existe | **Nuevo** (N3) |

### 1.4 `docs/prd/PRD-lealtab-mvp.md` (L375 a L955) y su copia en `brand/07-desarrollo/`

| # | Qué dice Aarón | Equivale a (vigente) | Estado |
|---|---|---|---|
| R1 | Versión v1.5 y tabla de cambios: borra v1.5 a v2.6 y mete una v1.5 propia (L383 a L410) | PRD v2.6 | **Contradice** |
| R2 | Fuentes y §13: D-001 a D-025, sin ADR-003, 004, 006 (L389, L909 a L955) | D-001 a D-031 y ADR-003 a 008 | **Contradice** |
| R3 | §1 cuña «escanea el QR… y ya tiene su tarjeta», sin código (L418) | D-031: verificación por código desde el registro | **Contradice** |
| R4 | §2.2 Gate 1: revierte a «≥60 % de N», sin convenciones, sin cortes por evaluables ni veredicto (L427 a L464) | D-004 aclarada 22 oct, PQ-32 | **Contradice** |
| R5 | MET-03, 05, 06, 07, 08, 09 revertidas; MET-08 vuelve a existir (L472 a L484) | D-031 y `medicion.md` | **Contradice** |
| R6 | §4.1 C5 «ver y **editar** sus datos, descargarlos en PDF, borrar una tarjeta o la cuenta»; rutas `/c/cuenta` y `/c/recuperar`; pantallas «N0 a N8 y C0 a C5 (pieza 08)» (L492 a L509) | RF-APP-14 y pieza 05; las rutas ya están en RNF-PWA-03 | **Nuevo** (editar, PDF, una tarjeta) y **Cubierto** (rutas) |
| R7 | RF-ALT-02, 02b; **borra RF-ALT-02c** (L518 a L520) | RF-ALT-02, 02b, 02c vigentes | **Contradice** |
| R8 | RF-ALT-06, 11; RF-TAR-06, 07; RF-SEL-02, 06, 13, 15; RF-APP-01 a 05, 10, 15; RF-CLI-01, 03, 04, 06; RF-INI-05, 06; RF-QR-01, 03, 05; RF-AJU-01 a 03; RF-EVT-01 a 06 (L526 a L663) | Versión vigente de cada uno (D-014, D-015, D-027, D-028, D-029, D-030, D-031) | **Contradice** (regresión a la v1.4) |
| R9 | RF-APP-14 reescrito: nombre editable, aviso, «Sin cookies de rastreo», PDF, borrar una tarjeta o la cuenta con BORRAR, recompensa que se pierde, enlace a `/c/recuperar` (L596) | RF-APP-14 vigente (D-026): borra solo la cuenta, casilla, borra también el usuario de Supabase, plazo en PQ-04 | **Contradice** en partes y **Nuevo** en partes (N1 a N4, N7) |
| R10 | F2, F7, F9, F10, RNF-PWA-04 y 05, RNF-OFF-03 y 04, RNF-PRI-02, 07, REN-02, 04, 06, STK-04, 06, 07, 10, 13 (L670 a L763) | Versión vigente | **Contradice** |
| R11 | RNF-PRI-09: borrado inmediato con historial anónimo; plazos y texto legal en PQ-04 (L724) | RNF-PRI-09 vigente | **Contradice** en partes; el historial anónimo es **Nuevo** (N2) |
| R12 | **RNF-PRI-11 Derechos ARCO** (L726) | Nada en el PRD; `c5-mis-datos.html` ya tiene el enlace «Tus derechos ARCO» y `pq-diseno.md` dice que el canal es el correo del aviso (`legal-notas` §2) | **Nuevo** (N6) |
| R13 | §8 modelo de datos revertido: sin `auth_user_id`, `dueno_negocio`, `evento_uso`, `envio_codigo`, `meta_ciclo`, `config_plataforma`, `intento_acceso_dueno`, `cuenta_pendiente_borrado`, `mis_tarjetas`, y `limite_horas` en vez de `limite_minutos` (L770 a L805) | §8 vigente y ADR-006 (ya hay migraciones T4 y pruebas RLS T5) | **Contradice** (rompería lo ya construido) |
| R14 | R-18 y R-19: R-19 desaparece; R-18 vuelve a «API de WhatsApp Business» (L826 a L828) | R-18 y R-19 vigentes | **Contradice** |
| R15 | §12: borra PQ-30 a PQ-42 y reabre PQ-05, 06, 13, 19, 20, 22, 23, 24; **PQ-26 nueva** (límites de Auth) (L856 a L905) | §12 vigente. PQ-26 ya existe y está cerrada | **Contradice** (colisión) |
| R16 | PQ-04: «qué se borra en C5 ya se decidió»; debe coincidir con el texto de C5 (L856) | PQ-04 vigente, PQ-18 | **Nuevo** (parcial; depende de N2) |
| R17 | PQ-07 ampliada: la consulta legal debe cubrir el borrado global desde C5 y ARCO (L859) | PQ-07 vigente | **Nuevo** (útil; ver N1 y N6) |
| R18 | PQ-10 y PQ-12 «cerradas el 26 oct» con la pieza 08 | Ya cerradas el 21 oct (D-005 aclarada, D-026) | **Cubierto** (el cierre) |
| R19 | `brand/07-desarrollo/PRD-lealtab-mvp.md` (copia del PRD) | Aarón decidió quitarla el 21 oct; queda un README | **Contradice** (sobra, y es la v1.5 vieja) |

---

## 2. Qué manda en cada «Contradice» y cómo conciliarlo

Regla: `AGENTS.md` §2. Primero `docs/decisiones.md`; después `brand/06-product-design/`; después el PRD, los ADR y el plan. Lo de Aarón del 26 oct no es una decisión registrada en el repo: son borradores en un árbol viejo. Prioridad a lo vigente, como pidió Aarón.

| Grupo | Qué manda | Propuesta de conciliación |
|---|---|---|
| Regresión por base vieja (A1 a A8, D1 a D8, R1 a R5, R7, R8, R10, R13, R14, P2, P9 a P11, R19) | Lo vigente (HEAD), por completo | Restaurar los 4 archivos (sección 5) y borrar la copia suelta. No hay nada que fusionar a mano en esos bloques |
| Numeración: su D-024 y D-025, su PQ-26, su «pieza 08» | D-024 (SMS Masivos), D-025 (sustituida por D-031), D-026 (borrado), PQ-26 (cerrada, D-029) y `08-registro-con-codigo.md` | Si algo de ellos se adopta, va con números nuevos: la siguiente decisión libre es **D-032** (D-031 es la última), la siguiente PQ libre es **PQ-43** (PQ-42 es la última) y la pieza sería la **09** (`09-ajustes-n1-y-c5.md`). Son IDs provisionales hasta que Aarón confirme |
| D12 (enlace de 60 min, un solo uso) | D-005 aclarada el 21 oct: código de 6 dígitos de 10 min, con la contraseña de 8 a 72 | Es un choque entre dos decisiones de Aarón. Hay que preguntarle si cambió de opinión. Si no, se queda lo vigente. Si sí, hace falta una enmienda a D-005 (decisión, ver sección 4) que cambiaría RF-ALT-02b, los estados N1·9 a N1·13 del wireframe, la plantilla del correo y la PQ del vencimiento único de Supabase |
| D13 (la cuenta se bloquea 15 min) | RF-ALT-02c: solo se pausa la contraseña; el código por correo y las sesiones abiertas siguen | Se queda lo vigente. Bloquear toda la cuenta permite que un tercero deje fuera al dueño con 5 intentos. La razón es de diseño y de seguridad; no hace falta decisión nueva |
| D16 (borrar una tarjeta) | D-026 lo descarta para el MVP | Se queda fuera. Ver N1: se reabre solo con una decisión nueva |
| D17 («BORRAR» en vez de la casilla) | D-026: casilla, sin código | Se queda la casilla (CA-12.6). Escribir «BORRAR» es un refuerzo razonable; si Aarón lo prefiere, es un cambio chico de UI que se registra como aclaración de D-026 |
| R9 y R11 (RF-APP-14 y RNF-PRI-09 de Aarón) | RF-APP-14 y RNF-PRI-09 vigentes (D-026, D-031) | Se queda el texto vigente. Los elementos nuevos entran solo si pasan la sección 3 |
| R15 (PQ-26 nueva) | PQ-26 vigente cerrada | No reutilizar el número. La verificación de límites de Auth se lleva al arquitecto (N5) |

---

## 3. Lo nuevo: ¿cabe en el MVP y qué decisión haría falta?

Fuera del alcance del MVP según `AGENTS.md` §3 y PRD §4.2: wallets, app nativa, staff con permisos, varias tarjetas o sucursales, avisos, campañas y reportes, cobro dentro del producto, resumen por WhatsApp o correo, IA, API, niveles VIP, referidos, cashback, POS, push, ícono o dominio por negocio. **Ninguno de los elementos de abajo está en esa lista**; la pregunta es de costo, de riesgo legal y de si Aarón quiere reabrir D-026. Nada queda propuesto como aprobado.

| # | Elemento | ¿Cabe? | Qué haría falta | Propuesta de tipo |
|---|---|---|---|---|
| N1 | **Borrar la tarjeta de un solo negocio** | Está en el producto, pero D-026 lo dejó fuera del MVP a propósito (suma otro diálogo, un borrado parcial y casos con la cola sin conexión, RF-SEL-15 y «tarjeta dada de baja»). Tiene un argumento legal: la cancelación frente a cada responsable (PQ-07, RNF-PRI-03) | **Decisión nueva** que reabra la alternativa descartada de D-026, con cambios a RF-APP-14, RF-SEL-15, el esquema (ADR-006) y el evento `cuenta_cliente_borrada` (hoy cuenta negocios). Disparador razonable: que el abogado lo exija en la consulta de D-017 | **D- nueva** (provisional D-032), solo si Aarón la pide o la consulta legal la exige. Mientras tanto, queda como pregunta para el abogado dentro de PQ-07 |
| N2 | **Historial anónimo para el negocio** al borrar | Cabe. Responde a una parte de PQ-04 (qué se conserva) y evita que se muevan N0 y las cifras de Gate 1 al borrar | Decisión de Aarón y validación legal: qué significa «anónimo» (sin `identidad_id`, sin nombre, sin teléfono y sin forma de reconectarlo; con fechas y horas finas podría re-identificarse). El arquitecto debe revisar cómo se desvincula con las claves de ADR-006 y D-031 (borrado en cascada de `auth.users`) y cómo se cuentan esas visitas en N0, N6 y Gate 1 (D-028: visita = día con sello) | **Aclaración de D-026** (no una D- aparte) cuando Aarón la confirme, más la nota en PQ-04 y PQ-33. Conviene que el abogado la vea en D-017 |
| N3 | **«Descargar mis datos» en PDF** | Cabe, pero es trabajo nuevo: generar el PDF en servidor y decidir qué lleva. No hay hoy exportación para el cliente (RNF-PRI-10 es del negocio). Responde al derecho de acceso | Contenido del PDF (WhatsApp, nombre por negocio, fechas de alta y de aceptación del aviso, sellos y canjes por negocio; nunca datos de otros negocios, RF-CLI-08), cómo se genera sin cargar servicios de terceros (D-018, RNF-STK-10), cómo se protege (ya hay sesión de Supabase verificada por código, D-031; falta definir si basta o si pide código otra vez), límite de frecuencia, y si emite evento (sin identidad, D-018). Alternativa más ligera: que C5 ya muestre los datos en pantalla (acceso) y el PDF espere a la v1 | **PQ nueva** (provisional PQ-43). Pasa a **D- nueva** solo si Aarón lo mete al MVP, porque cambia RF-APP-14 y PRD §4.1 |
| N4 | **Texto de privacidad de C5**: «Sin cookies de rastreo. Solo registramos el uso de la app para mejorarla» | Cabe: es copy. «Sin cookies de rastreo» es más exacto que «Sin cookies» (hay cookies de sesión de Supabase de primera parte, ADR-003 §2.4, RNF-PRI-07). «Solo registramos el uso» debe ser verdad: `app_abierta` lleva `identidad_id` (RF-EVT-02), así que el texto debe decirlo sin prometer de más | Sin decisión nueva: es el pendiente de **PQ-18** (aviso de privacidad). Lo afina `lealtab-copywriter` y lo valida el abogado. El aviso y C5 deben decir lo mismo | **No** hay PQ nueva; se anota como insumo de PQ-18 |
| N5 | **Límites de Supabase Auth** (bloqueo por cuenta, vencimientos de 10 y 60 min) | La preocupación es válida: Supabase limita por IP. En el esquema vigente la tabla `intento_acceso_dueno` (ADR-006) ya cuenta los intentos por correo, así que el bloqueo por cuenta es propio y no depende de Supabase. La pregunta de 60 min desaparece si se queda el código de 10 min (D-005) | Que el arquitecto confirme con el desarrollo de N1 (prueba técnica) que la pausa de 15 min por correo funciona con esa tabla. Se vuelve pregunta real solo si Aarón adopta el enlace de 60 min | **Ninguna D- ni PQ nueva** por ahora; nota para el arquitecto. Si se adopta el enlace de 60 min, se abre la PQ provisional PQ-44 |
| N6 | **RNF-PRI-11 Derechos ARCO** (acceso, rectificación, cancelación, oposición) | Cabe como requisito legal, no como función. C5 ya cubre acceso en pantalla, cancelación (borrar) y el enlace «Tus derechos ARCO» (por correo, `legal-notas` §2). Faltan: rectificar el WhatsApp (con D-031 cambiar de teléfono es abrir otra cuenta), oposición, canal formal y plazo de respuesta | Consulta legal (D-017, PQ-07) antes del piloto. Si el abogado pide rectificar el teléfono o un formulario propio, eso sí necesita decisión. Mi lectura del plazo de la ley `[SUPUESTO: verificar con el abogado, y confirmar si aplica la LFPDPPP de 2010 o la vigente tras la reforma de 2025]` | Agregar RNF-PRI-11 al PRD como requisito **Por definir** (con aprobación de Aarón) y ampliar PQ-07 con ARCO y el borrado global. **No** D- nueva todavía |
| N7 | **Nombre editable por negocio en C5** («Tu nombre en cada negocio») | Cabe y es chico (`cliente_negocio.nombre` es por negocio, D-019). Pero `pq-diseno.md` decidió que en el MVP el cambio se pide por ARCO y «editar nombre» quedaría para la v1. Implica una política RLS de escritura para el cliente y su interacción con el nombre prellenado en R1 (D-031) | Decisión de Aarón si lo quiere en el MVP; si no, queda como ARCO | **D- nueva** (provisional D-033) si entra al MVP; si no, nota en RNF-PRI-11 |
| N8 | Enlace a `/c/recuperar` desde C5 | Ya cubierto: CA-12.1 (sin sesión lleva a `/c/recuperar`) | Ninguna | — |

---

## 4. Lo que hay que pedirle a Aarón

**Archivos que faltan (de la otra copia del repo):**
1. `brand/06-product-design/08-ajustes-n1-y-c5.md`.
2. La carpeta `brand/06-product-design/ajustes-08/` con `n1-acceso` y `c5-mis-datos` (los HTML y los PNG; así los nombra su PRD).
3. Cualquier otro archivo que haya tocado en esa copia y que no esté en estos 5 (por ejemplo `07-entrega-desarrollo.md`, `01-mapa`, `entrega/mapa-pantallas.png`, `docs/fase-7/microcopy.md` o un `README` de la pieza). Lo más simple: el resultado de `git status --short` de la otra copia.
4. El commit o la fecha de la base de la otra copia, para saber qué se perdió por el camino.

**Confirmaciones y decisiones (las toma Aarón; ninguna está registrada):**
1. ¿La «pieza 08 aprobada el 26 oct» es el mismo wireframe del 21 oct (`diseno/n1-cuenta-contrasena.html` y `c5-mis-datos.html`) con cambios, o un diseño nuevo? Sin los archivos no puedo revisarla.
2. Renumeración: su D-024 y D-025 y la PQ-26 pasan a números libres (D-032 en adelante, PQ-43 en adelante) y la pieza se llama 09.
3. Recuperación del dueño: ¿se queda el código de 6 dígitos de 10 min (D-005 aclarada) o cambia al enlace de 60 min de un solo uso? (D12)
4. Bloqueo por 5 intentos: ¿solo la contraseña (RF-ALT-02c) o toda la cuenta? (D13)
5. Borrar una sola tarjeta: ¿reabre D-026 para el MVP o queda como pregunta al abogado? (N1)
6. Confirmación del borrado: ¿casilla (D-026) o escribir BORRAR? (D17)
7. Historial anónimo para el negocio: ¿lo confirma como aclaración de D-026, sujeto a la consulta legal? (N2)
8. «Descargar mis datos» en PDF: ¿entra al MVP o espera a la v1 y por ahora C5 solo muestra los datos? (N3)
9. Nombre editable en C5: ¿MVP o por ARCO? (N7)
10. Aprobación para que el coordinador proponga el texto de RNF-PRI-11 y la ampliación de PQ-07 en el PRD (documento protegido).
11. Si quiere conservar la bitácora de su aprobación del 26 oct en `brand/PLAN.md`, hacerlo cuando lleguen los archivos de la pieza y con los números nuevos.

---

## 5. Volver al estado limpio sin perder nada

**No se ejecutó ninguno de estos comandos.** Se corren desde la raíz del repo, `/Users/alsvader/Documents/Github/lealtab`, en este orden.

**Paso 0. Guardar el respaldo fuera de `/tmp` (que se puede limpiar solo):**

```sh
mkdir -p ~/Documents/respaldo-lealtab-26oct
cp -R "/private/tmp/claude-501/-Users-alsvader-Documents-Github-lealtab/1b9d4729-ae6c-4f39-8b0f-819682bc9b0d/scratchpad/respaldo-externo-26oct/." ~/Documents/respaldo-lealtab-26oct/
```

**Paso 1. Comprobar que el respaldo coincide con el árbol de trabajo (no debe imprimir nada) y que la copia suelta es igual al PRD:**

```sh
R=~/Documents/respaldo-lealtab-26oct
for f in brand/PLAN.md docs/adr/002-stack.md docs/decisiones.md docs/prd/PRD-lealtab-mvp.md brand/07-desarrollo/PRD-lealtab-mvp.md; do diff -q "$f" "$R/$f"; done
diff -q brand/07-desarrollo/PRD-lealtab-mvp.md docs/prd/PRD-lealtab-mvp.md
```

**Paso 2. Restaurar los 4 archivos rastreados a `HEAD`** (descarta los cambios de Aarón en ellos; ya están en el respaldo):

```sh
git checkout -- brand/PLAN.md docs/adr/002-stack.md docs/decisiones.md docs/prd/PRD-lealtab-mvp.md
```

**Paso 3. Borrar la copia suelta del PRD** (es un archivo sin seguimiento; el `README.md` de esa carpeta se queda):

```sh
rm brand/07-desarrollo/PRD-lealtab-mvp.md
```

**Paso 4. Comprobar el resultado:**

```sh
git status --short
```

Lo esperado: solo `?? docs/fase-7/qa/` (trabajo ajeno a esta tarea, que no se toca) y `?? docs/fase-7/propuestas/reconciliacion-26oct.md` (este documento). No uses `git checkout .` ni `git clean`: tocarían `docs/fase-7/qa/`.

**Qué conviene rescatar antes del paso 2** (todo está en el respaldo; se reintroduce como propuesta, con aprobación de Aarón y con números nuevos):

1. **Los archivos de la pieza de pantallas** (sección 4). Es lo único que no se puede reconstruir desde el repo.
2. **Pendientes que sí aportan** y que hoy no están: la consulta legal sobre el borrado global desde C5 y ARCO (ampliación de PQ-07), el requisito RNF-PRI-11 y la frase «el aviso debe coincidir con el texto de C5» (PQ-04 y PQ-18). Texto en `PRD` respaldo, líneas del diff L726, L856, L859.
3. **El texto de privacidad de C5** («Sin cookies de rastreo. Solo registramos el uso de la app para mejorarla») como insumo del copywriter para PQ-18.
4. **Las cuatro ideas nuevas de C5** (borrar una tarjeta, BORRAR, PDF, historial anónimo, nombre editable) en la sección 3 de este documento, listas para decidir.
5. **La nota de `/c/cuenta` en D-022** (L192): opcional, ya está en RNF-PWA-03.
6. **La entrada de bitácora del 26 oct** de `PLAN.md` (L41), a reescribir con los números nuevos cuando llegue la pieza.

Con el estado limpio, los cambios aprobados de la sección 4 se hacen en el orden de `AGENTS.md`: primero la decisión en `docs/decisiones.md` (Aarón confirma), después PRD, ADR y `brand/06-product-design/`.

---

## 6. Alineaciones pendientes si Aarón aprueba algo de la sección 3

| Si se aprueba | Hay que alinear |
|---|---|
| N1 (borrar una tarjeta) | D-026, RF-APP-14, RF-SEL-15, ADR-006, evento `cuenta_cliente_borrada`, wireframe C5, `medicion.md` |
| N2 (historial anónimo) | D-026, RNF-PRI-09, PQ-04, PQ-33, ADR-006, N0 y G1 (D-028), consulta legal |
| N3 (PDF) | RF-APP-14, PRD §4.1, ADR-002 (si hay dependencia nueva), wireframe C5, `medicion.md` |
| N6 (ARCO) | RNF-PRI-11 nuevo, PQ-07, aviso de privacidad, `legal-notas` |
| N7 (nombre editable) | RF-APP-14, RLS de `cliente_negocio`, R1 (nombre prellenado), `pq-diseno.md` |
| Enlace de 60 min | D-005, RF-ALT-02b, wireframe N1, plantilla del correo (Resend), ADR-002 §3 |
