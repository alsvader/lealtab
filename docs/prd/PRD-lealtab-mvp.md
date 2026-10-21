# LealTab · PRD del MVP (tarjeta digital de lealtad)

| Campo | Valor |
|---|---|
| Producto | LealTab, plataforma SaaS de lealtad para negocios. Arranca con la tarjeta de lealtad digital (PWA instalable) |
| Dueño del documento | Aarón López Sosa |
| Versión | v1.3 |
| Fecha de redacción | 21 oct 2026 (solo registro; el plan no lleva calendario) |
| Uso | Referencia de producto antes de arrancar la Fase 7 (Desarrollo) |
| Estado | **Borrador para aprobación de Aarón**. La Fase 6 está cerrada (2026-10-20) |

**Fuentes.** `PLAN.md`; `00-brief/resumen-inicial.md`; `01-brand-strategy/` (audiencia y posicionamiento, identidad de marca, competidores); `06-product-design/` (piezas 01 a 07, `entrega/mapa-pantallas.png`, `investigacion-limite-sellos.md`); `revision-docs-2026-10-20.md` (incluida la sección 6, «Huecos resueltos con Aarón»); `docs/decisiones.md` (D-001 a [D-023](../decisiones.md)), [`docs/fase-2/adr/002-stack.md`](../fase-2/adr/002-stack.md), `docs/01-validacion-idea.md`, `docs/02-plan-de-trabajo.md` v3, `docs/03-propuesta.md` v0.3, `docs/fase-2/adr/001-modelo-pwa.md` y `docs/fase-2/legal-notas.md`.

**Reglas de este documento.**
- Solo se usan datos que vienen de las fuentes. Lo que las fuentes no resuelven dice **Por definir**.
- Las cifras marcadas `[SUPUESTO]` son hipótesis de las fuentes que todavía no se validan con datos propios.
- Cada requisito tiene un ID y cita entre corchetes la decisión o la pieza de la que sale.
- Si este PRD choca con `06-product-design/` (pantallas y reglas aprobadas) o con `docs/decisiones.md`, mandan esos documentos, y hay que corregir este.

**Historial de versiones.**

| Versión | Cambios |
|---|---|
| v1.0 | Primera versión, armada con las fuentes al 20 oct 2026 (D-001 a D-017) |
| v1.1 | Limpieza de contradicciones aprobada por Aarón: sin fechas de calendario, Fase 6 cerrada, nombres de eventos unificados, «30 días» de prueba, N3 sin color de acento. Decisiones del 21 oct: bloqueo fijo de 2 min (D-014), entrada del dueño con código o contraseña (D-005), código de recuperación por WhatsApp con la API de pago (D-011), analítica propia sin cookies (D-018) |
| v1.2 | Decisiones del 21 oct: nombre del cliente por negocio y teléfono como único identificador global (D-019), sin límite de clientes en Inicio durante el piloto (D-020), una sola sucursal en el MVP (D-021), producto en lealtab.com con `/c/` y `/panel/` (D-022), X libre en «1 cada X horas» (D-014) y Gate 1 pendiente del precio de piloto (PQ-02). Revisión final: todas las decisiones D-001 a D-022 reflejadas (sección 13) y preguntas abiertas al día (sección 12) |
| v1.3 | Stack decidido por Aarón ([D-023](../decisiones.md), [ADR-002](../fase-2/adr/002-stack.md)): requisitos RNF-STK en 7.6, PQ-16 cerrada, PQ-13 reducida a la elección y el costo del proveedor del código por WhatsApp. Después, reglas del stack de Aarón (21 oct): React Server Components por defecto, Docker para local, migraciones de Supabase en el build de Vercel (RNF-STK-11 a 15) |

---

## 1. Resumen y problema

### 1.1 En una frase

LealTab ayuda a barberías, estéticas y salones de belleza, negocios de tapioca y cafeterías independientes a que sus clientes regresen. Lo hace con una tarjeta de lealtad web que se abre desde un QR, funciona en cualquier celular sin descargar nada y le muestra al dueño cada semana cuántos clientes volvieron [03-propuesta §1].

- **Lema de marca:** «Haz que tus clientes siempre regresen.»
- **Frase de producto:** «Tu tarjeta digital siempre a un toque.» [PLAN, decisiones cerradas]
- **Posicionamiento al lanzar:** Propuesta A, «la tarjeta digital más simple y bonita», con la tarjeta como protagonista. Se pasa a la Propuesta B, «la plataforma de lealtad seria que crece con tu negocio», cuando se cumplan las señales de la sección 11 [PLAN; audiencia-y-posicionamiento §4].

### 1.2 Problema

- Los negocios de visita recurrente dependen de que el cliente vuelva. Hoy usan tarjetas de cartón que se pierden y se prestan a trampas, usan los puntos de su punto de venta (como Loyverse) o no usan nada [03-propuesta §2; audiencia §1].
- El dueño no sabe cuántos clientes regresan ni si lo que hace para retenerlos funciona [03-propuesta §2].
- Las herramientas que existen son baratas, pero el dueño tiene que configurarlas solo. Varias dependen de la app o del wallet del cliente, y prometen «+30 % de ventas» sin medirlo [03-propuesta §2; 01-validación §3.3].
- Nadie domina las tarjetas digitales en este segmento, y «sin app» por sí solo ya no diferencia, porque Sello.club ofrece una tarjeta de sellos en el navegador [audiencia §1 y §2; competidores].

### 1.3 Qué ofrece el MVP (la cuña)

| Cuña | Qué recibe el negocio | Estado |
|---|---|---|
| Regreso medible | Resumen semanal como primera pantalla del panel y la vista «Quién regresa» (frecuentes, en riesgo y nuevos) | `[SUPUESTO]`: se mide en el piloto con `resumen_semanal_visto` [D-011] |
| Sin descargar nada, en cualquier celular | Escanea el QR, deja su nombre y su WhatsApp y ya tiene su tarjeta. Instalarla es opcional. Se recupera con su WhatsApp | `[SUPUESTO]`: se prueba con E6 adaptado a la PWA [D-001] |
| Alta sola en menos de 5 min | Sin llamada de ventas ni tarjeta de crédito: tarjeta con la marca del negocio y cartel QR listo. Soporte por WhatsApp y ayuda de arranque en persona durante el piloto | `[SUPUESTO]`: se prueba en el piloto [D-005] |

---

## 2. Objetivos y métricas de éxito

### 2.1 Objetivos del MVP

- **OBJ-01.** Validar que los negocios del piloto usan la tarjeta en el mostrador y que sus clientes se inscriben y regresan [D-004].
- **OBJ-02.** Validar que los negocios pagan al terminar sus 30 días de prueba [D-004, D-006, D-012].
- **OBJ-03.** Validar que el dueño consulta el resumen semanal en el panel sin que se le envíe por WhatsApp [D-011].
- **OBJ-04.** Validar el modelo de una sola app LealTab con «Mis tarjetas» (instalación, sesión en iOS y segundo negocio) antes de que el cambio cueste caro [ADR-001 §10].

### 2.2 Gate 1 del piloto (criterios del negocio)

Se evalúa sobre **N = los negocios de la primera tanda**. El corte de altas de la primera tanda está **Por definir** (sin calendario). Cada negocio se mide en sus propios días 1 a 30. La tarjeta sigue funcionando en los días 31 a 37 para medir el retorno y cobrar. **Se pasa con 3 de estos 4** [D-004; 02-plan §4, Fase 8]:

| ID | Criterio | Umbral |
|---|---|---|
| G1-a | **Activos.** Activo = ≥30 inscritos, sellos en ≥3 de sus 4 semanas y (≥1 canje o ≥5 segundas visitas selladas) | ≥60 % de N |
| G1-b | **Conversión.** Pagan ≥ MXN 299 sin IVA (primer mes o prepago) a más tardar su día 37. Solo cuenta el dinero recibido, no las promesas. Los precios especiales de piloto menores a $299 se reportan aparte. Recordatorio por WhatsApp el día 25 | ≥40 % de N |
| G1-c | **Inscripción.** Mediana por negocio de los clientes que visitan, en sus días 1 a 14. Solo se evalúa si hay denominador (tickets o conteo) para ≥70 % de N; si no, queda «sin dato» | ≥30 % |
| G1-d | **Retorno.** Inscritos en sus días 1 a 16 que regresan en ≤21 días. Se reporta también por oficio y por semana de alta | ≥25 % |

**Se corta** con ≤20 % de N activos, ≤10 % de conversión o una mediana de inscripción menor a 10 %. En ese caso se revisan los pivotes de la sección 9 del informe 01 [D-004].

**Lectura complementaria (no cuenta para pasar):** resultados por oficio (con unos 5 negocios por oficio son dirección, no estadística; un oficio es «candidato» con ≥3 activos y ≥2 pagando) y «¿lo recomendarías?» a los dueños [02-plan §4].

> **Por definir (PQ-02):** quién cuenta como negocio que paga en G1-b. Aarón lo decide cuando se fije el precio especial de piloto (PQ-01), porque depende de él (2026-10-21).

### 2.3 Métricas del producto (separadas del Gate 1)

| ID | Métrica | Meta | Fuente |
|---|---|---|---|
| MET-01 | Tiempo de alta del negocio (N1 a N4), sin ayuda | < 5 min | F1; D-005 `[SUPUESTO]` |
| MET-02 | Tiempo para dar un sello en el mostrador | < 5 s | 03-propuesta §5 `[SUPUESTO]` |
| MET-03 | De los que escanean el QR del mostrador, cuántos completan el registro | ≥85 % | E6 adaptado `[SUPUESTO]` |
| MET-04 | Instalación de la PWA (`pwa_instalada`, con `display-mode: standalone`), medida aparte en iPhone y Android | ≥25 %. Si es <10 % en los dos sistemas, no se invierte más en instalar. Entre 10 % y 25 %, se revisa el copy de la guía | E6; ADR-001 §10 |
| MET-05 | Recuperaciones de tarjeta (`recuperacion_completada`) | <10 % de los inscritos | E6; ADR-001 §10 |
| MET-06 | Éxito de la transferencia de sesión en iOS (`install_token_canjeado` / `guia_instalacion_mostrada`) | ≥80 %. Si es <60 %, se prioriza el respaldo con código | ADR-001 §10 |
| MET-07 | Conversión del segundo negocio en la app ya instalada: `cliente_registrado` con `identidad_nueva = no`, seguido de `app_abierta` en standalone en ≤7 días | ≥60 %. Si es <30 %, se adelanta el escaneo desde dentro de la app | ADR-001 §10 |
| MET-08 | Tarjetas «por confirmar» que nunca se confirman (`tarjeta_por_confirmar_creada` sin `tarjeta_confirmada`) | <20 % | ADR-001 §10 |
| MET-09 | Clientes con ≥2 negocios (`cliente_registrado` con `identidad_nueva = no`) | Solo se mide. Si es ≥20 %, refuerza la decisión de una sola app | ADR-001 §10 |
| MET-10 | Dueños que abren el resumen semanal cada semana (`resumen_semanal_visto`) | Umbral: **Por definir**. Si son pocos, en la v1 se evalúa un aviso por WhatsApp o correo | D-011 |
| MET-11 | Rechazos al sincronizar (Clientes → Por revisar) | Umbral: **Por definir** | 02-plan §3, riesgos de la PWA |
| MET-12 | Horas del fundador por cliente (E7) | Gate 2: un canal de ≤6 h por cliente | 02-plan §2 |

Si la instalación sale muy baja pero el retorno es bueno, la instalación no hacía falta y no se insiste en ella [02-plan §4, E6].

---

## 3. Usuarios y personas

### 3.1 Actores del MVP [01-mapa §1]

| Actor | Qué hace en el MVP |
|---|---|
| **Dueño del negocio** | Da de alta su negocio, configura la tarjeta, ve el resumen semanal y quién regresa, administra clientes y exporta datos |
| **Staff (mostrador)** | Registra visitas y canjes en N5 Mostrador. En el MVP usa **la misma cuenta del dueño**; los usuarios de staff con permisos llegan después [D-010] |
| **Cliente final** | Se registra con el QR del mostrador, instala su tarjeta (opcional), junta sellos, canjea su recompensa y tiene sus tarjetas en «Mis tarjetas» |
| **LealTab (Aarón)** | Ayuda de arranque en el piloto, soporte por WhatsApp y envío del link de pago al terminar la prueba [03-propuesta §5] |

### 3.2 Segmento y piloto

- **Segmento principal:** PyMEs mexicanas de visita recurrente, normalmente de 1 a 3 sucursales, con el dueño operando y decidiendo [audiencia §1]. **El MVP maneja una sola sucursal por negocio**; varias, hasta 3, llegan después [D-021].
- **Piloto:** hasta **20 negocios**, idealmente en Villahermosa, en cuatro oficios: barberías, estéticas y salones de belleza, negocios de tapioca y **cafeterías**. Los gimnasios quedan para después [D-003]. Aarón los recluta en persona [D-004].
- Con cuatro oficios quedan unos 5 negocios por oficio, así que los resultados por oficio son dirección, no estadística [D-003].
- Fuera por ahora: abarrotes, cadenas grandes, e-commerce, gimnasios y farmacias [03-propuesta §3].

### 3.3 Personas `[H]`: hipótesis de Fase 1, sin entrevistas [audiencia §1]

| Persona | Contexto | Dolores | Objeciones |
|---|---|---|---|
| **Mariana**, dueña de una estética (1 sucursal, 4 estilistas) | Agenda por WhatsApp, cobra con terminal y maneja todo desde el celular | Clientas que dejan de venir sin avisar, tarjetas de cartón que se pierden, no sabe quién es su clienta frecuente | «Mis clientas no van a descargar otra app», «no tengo tiempo de configurarlo», «¿cuánto me va a costar al mes?» |
| **Luis**, dueño de una cafetería (2 sucursales) | Ya usa un punto de venta con puntos integrados; le importa la imagen de su marca | Nadie ve ni recuerda los puntos del punto de venta, no puede mandar avisos y sus datos están repartidos entre sucursales | «Ya tengo puntos en mi punto de venta», «¿se conecta con lo que ya uso?», «¿mis datos son míos?» |
| **Diego**, dueño de una barbería o de un gimnasio pequeño | Clientes con visitas muy regulares (cada 2 a 3 semanas o mensualidad) | Bajas silenciosas, no sabe cuándo alguien dejó de venir, promociones a ojo | «Es algo más que aprender», «¿y si mis clientes no lo usan?», «necesito factura» |

### 3.4 Ciclo de visita por oficio (afecta las reglas)

| Oficio | Ciclo de visita según las fuentes | Implicación para el MVP |
|---|---|---|
| Barberías, estéticas y salones | De 2 a 6 semanas [audiencia, segmento piloto] | El criterio «o ≥5 segundas visitas» de G1-a evita castigarlos [02-plan §4]. «1 por semana» no les aporta nada [investigación de límite] |
| Cafeterías | Visitas mucho más frecuentes, con datos de retención y canjes en semanas [D-003] | Pueden pedir «1 cada X horas» por las dos visitas al día [investigación de límite]. Ponen a prueba el límite de 200 clientes del plan Inicio y la velocidad en hora pico [D-003] |
| Tapiocas | Clientes jóvenes, visita frecuente, muy digitales [audiencia] | El ticket mínimo de ≥ MXN 120 no está validado para tapiocas: **Por definir** [03-propuesta §3] |

> **Pendiente (PQ-11):** las fichas por oficio no tienen datos propios. Hacen falta las entrevistas con dueños (D-017).

---

## 4. Alcance del MVP

### 4.1 Dentro del MVP [02-plan §3; 01-mapa §3; D-010 a D-016]

**Panel del negocio (web responsiva):** N0 Inicio (resumen semanal) · N1 Cuenta · N2 Tu negocio · N3 Tu tarjeta · N4 QR de mostrador · N5 Mostrador · N6 Quién regresa · N7 Clientes (ficha, historial y Por revisar) · N8 Ajustes.
Navegación lateral: Inicio, Quién regresa, Mostrador, Clientes, Tarjeta y Ajustes [pieza 05].

**App del cliente (una sola PWA LealTab):** C0 Mis tarjetas · C1 Registro · C2 Instalar · C3 Mi tarjeta · C4 Recompensa · C5 Mis datos (ver y borrar la cuenta).

**Transversal:**
- Antiabuso: QR rotativo, límite de sellos configurable, bloqueo contra el doble escaneo y registro de quién dio cada sello [D-014].
- Funciona sin conexión primero [D-015].
- «Hecho con LealTab» en la tarjeta y en el cartel, en todos los planes [D-016].
- Elementos de confianza desde el día uno: alta sin llamada de ventas, aviso de privacidad, exportar CSV y «Ayuda por WhatsApp» [PLAN; 01-mapa §2].
- Plataforma propia desde el primer cliente: la landing y la app son de LealTab, sin motores de terceros ni marca blanca [D-002].
- Módulos al lanzar: **Tarjeta** y **Clientes**, con nombres en español. Avisos, Campañas y Reportes llegan después; Wallet es una función posterior, no un módulo [D-007].
- Dónde vive: todo en `lealtab.com`. La landing está en `/` (fuente de verdad: `web/`, D-008), la app del cliente en `/c/` y el panel del negocio en `/panel/`. No se usa `app.lealtab.com` [D-022].
- Cobro del piloto con un link de pago [D-012].
- Eventos de analítica [07-entrega §5].

Pantallas diseñadas y aprobadas: N0 a N8 y C0 a C4, además de los estados M1 a M6, R1 a R4, L1, V1 a V3 y P1 (`entrega/mapa-pantallas.png`).

> **Hueco:** C5 «Mis datos» está en el alcance (D-010; 01-mapa §3), pero no tiene wireframe en el mapa de pantallas ni en la hoja de entrega. **Por definir** su diseño (PQ-12).

### 4.2 Fuera del MVP (hasta un gate) [02-plan §3; 01-mapa §3]

| Fuera | Cuándo se reconsidera |
|---|---|
| Pases de Apple Wallet o Google Wallet | Función posterior, si los clientes la piden [D-001, D-007] |
| App nativa | — |
| Usuarios de staff con permisos, varias tarjetas y varias sucursales (hasta 3) | Plan Negocio / v1 [01-mapa §3; D-021] |
| Avisos, Campañas y Reportes avanzados | Fase 11, por demanda (Gate 3) |
| Pago en línea dentro del producto (CFDI, OXXO/SPEI) | Después; el cobro automático se construye durante los pilotos [D-012] |
| Resumen semanal por WhatsApp o correo | Se evalúa en la v1 si la apertura en el panel sale baja [D-011] |
| IA, API pública, página de seguridad | Con la transición a la Propuesta B [PLAN] |
| Niveles VIP, referidos de clientes finales, cashback | — |
| Integración con punto de venta | — |
| Motor de terceros o marca blanca para los pilotos | Descartado [D-002] |
| Subdominio `app.lealtab.com` | Descartado; el producto vive en `lealtab.com/c/` y `/panel/` [D-022] |
| Alertas por patrones raros de sellos | v1 [investigación de límite] |
| Ícono propio por negocio, subdominio o dominio propio | Posible módulo de pago, después [ADR-001 §8] |
| Escanear el QR de un negocio desde dentro de la app | Solo si MET-07 lo justifica [ADR-001 §8] |
| Notificaciones push | No se depende de ellas en el MVP [02-plan §3] |

---

## 5. Requisitos funcionales por módulo

Prioridad: todos los requisitos de esta sección son **MVP (obligatorios)** salvo que digan otra cosa.

### 5.1 Alta del negocio (N1 a N4) · flujo F1

| ID | Requisito | Fuente |
|---|---|---|
| RF-ALT-01 | El negocio se da de alta solo, desde «Empieza gratis» en lealtab.com, sin llamada de ventas y sin tarjeta de crédito durante la prueba | D-005; 01-mapa F1 |
| RF-ALT-02 | N1 Cuenta pide nombre, correo y WhatsApp del negocio. El dueño entra de una de dos formas: **correo + código** (el código dura **10 minutos**) **o contraseña**. La contraseña es opcional: el dueño puede seguir entrando solo con código | D-005 (actualizado 2026-10-21); 01-mapa §3 |
| RF-ALT-02b | **Restablecer la contraseña por correo:** desde N1, «¿Olvidaste tu contraseña?» envía al correo del dueño un enlace o código para crear una nueva. Vigencia del enlace, reglas de la contraseña y bloqueo por intentos fallidos: **Por definir**. Diseño de N1 con contraseña y recuperación: pendiente de Diseño de Producto (PQ-10) | D-005 (actualizado 2026-10-21); PLAN |
| RF-ALT-03 | Si el código vence (L1), se envía uno nuevo al correo y se ofrece «Ayuda por WhatsApp» | Pieza 06, L1 |
| RF-ALT-04 | N1 muestra lo que incluye la prueba: 30 días gratis, precios públicos desde $299 MXN/mes + IVA, sin contratos, exportación CSV, pausa que conserva la exportación y soporte por WhatsApp. Al continuar, el dueño acepta los términos y el aviso de privacidad | Pieza 04; D-006 |
| RF-ALT-05 | N2 Tu negocio pide nombre, giro (barbería, estética o salón, tapioca, cafetería u otro), ciudad y logo opcional. Si no hay logo, se usan las iniciales | Pieza 04 |
| RF-ALT-06 | Se guarda la zona horaria del negocio (la usa el límite de sellos). Cómo se obtiene (de la ciudad o preguntándola): **Por definir** | 07-entrega §3 |
| RF-ALT-07 | N3 Tu tarjeta configura los sellos (de 4 a 12, con − / +), la recompensa y el interruptor del sello de bienvenida, con vista previa en vivo. Con el interruptor prendido, la vista previa muestra 1/N y «Tu sello de bienvenida ya está aquí» | Pieza 04 |
| RF-ALT-08 | N3 **no lleva color de acento** en el MVP, como en la pieza 04 aprobada (`01-mapa` y `docs/02-plan` se alinearon el 2026-10-21) | Pieza 04 |
| RF-ALT-09 | N4 genera el cartel con el QR del mostrador, que **solo sirve para registrarse**, en tamaño carta, media carta y sticker, y se descarga en PDF o PNG. Recuerda que los sellos se suman escaneando la tarjeta desde Mostrador y muestra la fecha de fin de la prueba | Pieza 04; D-010 |
| RF-ALT-10 | El cartel lleva «Hecho con LealTab» siempre | D-016 |
| RF-ALT-11 | Al terminar N4 arrancan los 30 días de prueba. Se registran la fecha de alta, la tanda y la versión del producto de cada negocio | 01-mapa F1; D-004 |
| RF-ALT-12 | La barra superior muestra los 4 pasos y «Ayuda por WhatsApp» siempre visible | Pieza 04 |

### 5.2 Tarjeta (configuración y reglas)

| ID | Requisito | Fuente |
|---|---|---|
| RF-SUC-01 | El MVP maneja **una sola sucursal** por negocio. Varias sucursales, hasta 3, llegan después (plan Negocio) | D-021 |
| RF-TAR-01 | Cada negocio tiene **una** tarjeta en el MVP (plan Inicio: 1 tarjeta). Varias tarjetas llegan con el plan Negocio | D-006; 01-mapa §3 |
| RF-TAR-02 | La tarjeta lleva el logo, el nombre y la recompensa del negocio. El ícono, el nombre de la app y el splash son de LealTab | D-013; ADR-001 §5.2 |
| RF-TAR-03 | Sello de bienvenida: si el negocio lo prende, el sello se da **en automático al crear la tarjeta del cliente (C1)**, sin confirmación del staff, y queda como evento con origen «bienvenida» | D-010; 07-entrega §3 |
| RF-TAR-04 | La tarjeta muestra «Hecho con LealTab» siempre, en todos los planes, Pro incluido. No hay variante sin leyenda | D-016 |
| RF-TAR-05 | Regla del aro: carril menta gris, avance bosque y durazno solo con el aro completo. Siempre sobre blanco lino, nunca sobre bosque y nunca con el avance en lino | Pieza 02; 07-entrega §2 |
| RF-TAR-06 | Al cambiar el número de sellos de una tarjeta que ya tiene clientes con avance: **Por definir** qué pasa con su avance | No lo resuelven las fuentes |

### 5.3 Sellos, canjes y QR (N5 Mostrador) · flujos F3 y F4

| ID | Requisito | Fuente |
|---|---|---|
| RF-SEL-01 | La visita se registra cuando el staff **escanea el QR personal del cliente** en N5 Mostrador, dentro del panel. El QR del mostrador no suma sellos | D-010; 01-mapa §5 |
| RF-SEL-02 | Respaldo: si la cámara falla, el staff busca al cliente por WhatsApp o por nombre | D-010; pieza 03 |
| RF-SEL-03 | N5 tiene 4 estados: N5·1 Escanear, N5·2 Confirmar sello (ficha, sellos con el nuevo marcado, «Confirmar +1 sello» y «Su tarjeta ya se actualizó»), N5·3 Canjear y N5·4 Límite alcanzado | Pieza 03 |
| RF-SEL-04 | **QR rotativo:** `card_id + paso + HMAC-SHA256(llave_tarjeta, card_id\|business_id\|paso)`, con pasos de 60 s calculados en el teléfono del cliente (funciona aunque el cliente no tenga internet). En línea se aceptan ±2 pasos. Sin conexión, la gracia es de 10 min. Una captura de más de 10 min se rechaza | D-014; pieza 06 §2 |
| RF-SEL-05 | **Límite por defecto: 1 sello por cliente por día**, que se reinicia a medianoche en la zona horaria del negocio | D-014 |
| RF-SEL-06 | El negocio puede cambiar el límite en N8 Ajustes a «1 cada X horas» o «Sin límite» (con advertencia). En «1 cada X horas», **cada negocio elige X libremente**: la interfaz sugiere 2 h, pero no hay mínimo obligatorio y la validación solo exige un número mayor que 0. El piso de cualquier regla es el bloqueo fijo de 2 min (RF-SEL-07). No existe «1 por semana». Unidad y fracciones de X (¿horas enteras?): **Por definir** | D-014 (aclarado 2026-10-21); pieza 05 |
| RF-SEL-07 | **Bloqueo fijo de 2 minutos contra el doble escaneo, siempre activo** (también con «Sin límite»): muestra «Ya registrado» y no suma otro sello (M4a). Se aplica igual en línea y sin conexión | D-014 (actualizado 2026-10-21) |
| RF-SEL-08 | Con el límite alcanzado (M4b), N5 muestra «Ya recibió su sello hoy. El siguiente, desde mañana.» o «Próximo sello disponible a las HH:MM», junto con el último sello y quién lo registró. Indica que el límite se cambia en Ajustes | Pieza 03; pieza 06 |
| RF-SEL-09 | Cada sello y canje registra quién y cuándo. Con la cuenta compartida, «quién» es el dispositivo del mostrador (por ejemplo, «Mostrador (iPhone caja)»). Se ve en el historial de N7 | D-014; pieza 03 |
| RF-SEL-10 | **Canje:** con la tarjeta completa, N5 muestra «Confirmar canje» (la tarjeta vuelve a 0/N) o «Ahora no, solo sumar visita». El canje queda en el historial | 01-mapa F4; pieza 03 |
| RF-SEL-11 | Estados de error: M1 sin permiso de cámara (cómo permitirla y «Buscar por WhatsApp»), M2 cliente no encontrado (revisar el número o mostrar el QR del mostrador para que se registre) y M3 QR no válido o de otro negocio (dice de qué negocio es y pide abrir la tarjeta correcta en Mis tarjetas) | Pieza 06 |
| RF-SEL-12 | Indicador de sincronización en cada estado de N5: «En línea · sincronizado», «Sin conexión · N pendientes» o «Sincronizando» | Pieza 03 |
| RF-SEL-13 | **Sin conexión (M5):** el mostrador sigue registrando sellos y canjes en una cola local y aplica localmente el límite y el bloqueo. Las tarjetas que aún no están en caché reciben un sello **provisional** que se valida al sincronizar | D-015; pieza 06 §1-3 |
| RF-SEL-14 | **Canje sin conexión:** solo si la tarjeta está completa en una caché sincronizada en las últimas 24 h, y como máximo 1 canje por tarjeta mientras dure el modo sin conexión. Un doble canje va a Por revisar | D-015 |
| RF-SEL-15 | Resultado de la sincronización (M6): «N sincronizados, M por revisar» con el motivo y un enlace a Clientes → Por revisar | Pieza 06 |
| RF-SEL-16 | «Ayuda por WhatsApp» fijo al pie de cada estado de N5 | Pieza 03 |
| RF-SEL-17 | Los resultados de escaneo y de sincronización se anuncian con `aria-live="polite"` | 07-entrega §7 |

### 5.4 App del cliente y «Mis tarjetas» (C0 a C5) · flujo F2

| ID | Requisito | Fuente |
|---|---|---|
| RF-APP-01 | **Una sola PWA LealTab.** El cliente tiene las tarjetas de varios negocios en la misma app. Su cuenta se identifica por su WhatsApp | D-013 |
| RF-APP-02 | **C1 Registro:** nombre y WhatsApp, sin contraseña. El aviso de privacidad corto va visible antes del botón, con casilla de aceptación y enlace al aviso completo. Al aceptar se crea la tarjeta | Pieza 02; 01-mapa §2 |
| RF-APP-03 | El WhatsApp se valida a 10 dígitos, con un ejemplo en el error en línea (R2) | Pieza 06, R2 |
| RF-APP-04 | Si el WhatsApp ya está registrado (R1), se envía un **código por WhatsApp** con la API de WhatsApp Business (de pago). Con el código, el cliente recupera sus tarjetas y la nueva se agrega a Mis tarjetas sin repetir la instalación | D-011 (cambio parcial 2026-10-21); pieza 06 R1 |
| RF-APP-05 | Una tarjeta nueva ligada a un teléfono **sin sesión** queda «por confirmar» y no aparece en la app hasta que el cliente la acepta desde la app instalada o el cajero lo verifica al dar el primer sello. Así nadie mete tarjetas en el perfil de otra persona | ADR-001 §5.2 punto 6 |
| RF-APP-06 | **C2 Instalar:** guía de 3 pasos con pestañas para iPhone y Android. «Ahora no» no bloquea nada. En iOS, la guía va por «Compartir → Agregar a inicio». En Android/Chrome, se usa el aviso de instalación | Pieza 02; 02-plan §3 |
| RF-APP-07 | El copy de la guía habla de tarjetas, no de una app: por ejemplo, «Guarda tus tarjetas en tu inicio» `[SUPUESTO, medir en el piloto]` | ADR-001 §5.2 punto 7 |
| RF-APP-08 | R3: en un navegador sin instalación PWA (WhatsApp, Instagram), se ofrece abrir en Safari o Chrome, copiar el enlace o seguir sin instalar. La tarjeta funciona igual | Pieza 06; D-001 |
| RF-APP-09 | **C3 Mi tarjeta:** aro de progreso, QR personal grande (rotativo) y última visita. Recién registrada con el sello de bienvenida, muestra 1/N y «Tu sello de bienvenida ya está aquí» | Pieza 02 |
| RF-APP-10 | La tarjeta menciona el límite de sellos en sus términos. **Por definir (PQ-06)** si se muestran en C3 o solo en el aviso de la tarjeta | Pieza 02; 07-entrega §8 |
| RF-APP-11 | **C4 Recompensa:** aro completo en durazno, mensaje de logro (por ejemplo, «¡Tu corte gratis está listo!»), QR para canjear y el estado después del canje (vuelve a 0/N) | Pieza 02 |
| RF-APP-12 | **C0 Mis tarjetas:** lista de tarjetas por negocio con mini aro y la etiqueta «Recompensa lista» cuando se completa. Tocar una abre C3. El estado vacío explica que se agrega una tarjeta escaneando el QR del mostrador | Pieza 05 B |
| RF-APP-13 | «Mis tarjetas» es mínima: sin descubrimiento de negocios, sin recomendaciones y sin datos de un negocio visibles para otro | ADR-001 §5.2 punto 9 |
| RF-APP-14 | **C5 Mis datos:** el cliente ve sus datos y puede borrar su cuenta. Diseño: **Por definir** (PQ-12). Retención y borrado: **Por definir** (PQ-04) | 01-mapa §3; 07-entrega §8 |
| RF-APP-15 | **Recuperación de la tarjeta cuando el cliente cambia de teléfono** (o borra sus datos): escribe su WhatsApp en `/c/recuperar` y recibe un **código por WhatsApp** (de pago), enviado con el hook de teléfono/OTP de Supabase Auth y un proveedor externo configurado en Supabase (RNF-STK-06). Con una sola app, recupera todas sus tarjetas de una vez. Proveedor y costo: **Por definir** (PQ-13). Vigencia del código e intentos: **Por definir** (PQ-22) | D-011 (cambio parcial 2026-10-21); [D-023](../decisiones.md); ADR-001 §6; 02-plan §3 |
| RF-APP-16 | **R4, sin internet:** muestra la tarjeta guardada, el QR generado localmente, la hora de actualización y «Puede haber sellos pendientes». La tarjeta nunca suma sellos por su cuenta | Pieza 06 §5 |
| RF-APP-17 | La tarjeta se actualiza sola cuando el staff confirma un sello en línea | 01-mapa F3 |
| RF-APP-18 | Los mensajes de la tarjeta hablan con la voz del negocio, de tú por defecto | identidad-de-marca §4 |

### 5.5 Clientes (N7)

| ID | Requisito | Fuente |
|---|---|---|
| RF-CLI-01 | Lista de clientes con estado (Frecuente, En riesgo, Nuevo) y búsqueda | Pieza 05 |
| RF-CLI-02 | Ficha del cliente: sellos, ritmo habitual, «Escribir por WhatsApp», corregir sellos e historial de visitas con la hora y quién registró cada sello | Pieza 05 |
| RF-CLI-03 | «Escribir por WhatsApp» abre un enlace `wa.me` con texto prellenado, sin la API. **Plantilla: Por definir (PQ-05)**. En el MVP la API de WhatsApp Business solo se usa para el código de recuperación del cliente (RF-APP-15) | 07-entrega §8; D-011 |
| RF-CLI-04 | Corregir sellos: queda en la bitácora. Permisos, motivo obligatorio y límites: **Por definir** | Pieza 05 (sin detalle) |
| RF-CLI-05 | Vista **Por revisar:** los movimientos sin conexión que el servidor rechazó, con su motivo (límite, QR vencido, duplicado, doble canje o firma). El dueño elige «Aprobar de todos modos» o «Descartar», y la decisión queda en la bitácora | D-015; pieza 06 §4 |
| RF-CLI-06 | **Exportar CSV** siempre disponible, también con la cuenta en pausa. Campos: nombre, WhatsApp, visitas, sellos y última visita. N8 dice «exportar clientes y visitas»; si se exporta también el detalle de visitas: **Por definir** | 01-mapa F6; pieza 05 |
| RF-CLI-07 | V2, Clientes vacío: «Exportar CSV» deshabilitado y opción para descargar el QR | Pieza 06 |
| RF-CLI-08 | Un negocio **nunca** ve si su cliente está inscrito en otro negocio | ADR-001 §6 |

### 5.6 Resumen del dueño (N0 Inicio) y Quién regresa (N6)

| ID | Requisito | Fuente |
|---|---|---|
| RF-INI-01 | **N0 Inicio es la primera pantalla** que ve el dueño al entrar al panel web | D-011 |
| RF-INI-02 | Muestra las visitas de la semana frente a la anterior, los clientes que regresaron, los que están en riesgo, las recompensas canjeadas y **una** acción sugerida. En escritorio suma «visitas por semana» y «Esta semana» | Pieza 05; 01-mapa F5a |
| RF-INI-03 | La acción sugerida sigue una regla simple: si hay clientes en riesgo, escribirles («N clientes no han vuelto: escríbeles hoy»); si no, las tarjetas a 1 sello del premio | Pieza 05 |
| RF-INI-04 | El resumen **solo vive en el panel**; no se envía por WhatsApp ni por correo | D-011 |
| RF-INI-05 | Al mostrarse N0 se registra el evento `resumen_semanal_visto` (negocio, semana) | D-011 |
| RF-INI-06 | Cómo se define la «semana» (día de inicio y zona horaria): **Por definir** | No lo resuelven las fuentes |
| RF-INI-07 | V1, primera semana sin datos: invita a registrar una visita o descargar el QR | Pieza 06 |
| RF-QR-01 | **N6 Quién regresa**, con estas definiciones: **Frecuente** = 2 o más visitas en los últimos 30 días. **En riesgo** = sin volver en más del doble de su intervalo habitual, con mínimo de 30 días. **Nuevo** = primera visita en los últimos 30 días | D-010; 01-mapa F5 |
| RF-QR-02 | Cifras clave (regresaron, recompensas canjeadas), filtros por grupo, búsqueda y tabla (cliente, WhatsApp, estado, visitas, sellos, última visita, Ver). Cada grupo abre su lista en N7 | Pieza 03 |
| RF-QR-03 | Los chips de estado van siempre con palabra (Frecuente menta/bosque, En riesgo durazno claro/tostado, Nuevo neutro) | Pieza 03 |
| RF-QR-04 | V3, sin datos: «Sin datos aún», porque se calcula con 2 a 3 semanas de visitas | Pieza 06 |
| RF-QR-05 | Cómo se calcula el «intervalo habitual» cuando un cliente tiene una sola visita: **Por definir** | No lo resuelven las fuentes |

### 5.7 Ajustes (N8)

| ID | Requisito | Fuente |
|---|---|---|
| RF-AJU-01 | Sección **Negocio**: los datos capturados en N2 | Pieza 05 |
| RF-AJU-02 | Sección **Tarjeta**: interruptor del sello de bienvenida, límite de sellos (1 por día por defecto · 1 cada X horas, con X libre y 2 h sugeridas · Sin límite con advertencia), reinicio a medianoche del negocio, bloqueo contra el doble escaneo (ver RF-SEL-07) y QR | Pieza 05; D-014 |
| RF-AJU-03 | Sección **Tus datos**: exportar clientes y visitas, y el aviso de privacidad | Pieza 05 |
| RF-AJU-04 | Sección **Plan y pago**: estado de la prueba, fecha de fin, $299 MXN/mes + IVA, sin contratos, y que la pausa conserva la exportación | Pieza 05 |
| RF-AJU-05 | «Ayuda por WhatsApp» | Pieza 05 |

### 5.8 Cobro y estados de la cuenta

| ID | Requisito | Fuente |
|---|---|---|
| RF-COB-01 | Estados del negocio: prueba, activo o pausa, con la fecha de fin de la prueba | 07-entrega §3 |
| RF-COB-02 | Prueba de 30 días gratis desde el alta, sin tarjeta de crédito | D-004; D-005; D-006 |
| RF-COB-03 | **P1, prueba terminada sin pagar:** la cuenta pasa a pausa. Los datos se guardan, no se dan sellos nuevos y **la exportación CSV sigue disponible** | D-006; pieza 06 |
| RF-COB-04 | **«Activar mi plan» abre WhatsApp**, donde Aarón envía el link de pago | D-012 |
| RF-COB-05 | **Piloto:** al terminar sus 30 días gratis, el negocio paga con un **link de pago de Stripe o Mercado Pago** a un **precio especial de piloto** durante los primeros meses. Monto y duración: **Por definir (PQ-01)** | D-012 |
| RF-COB-06 | Registro de pagos fuera de la app: fecha, monto sin IVA y método (lo pide G1-b) | 02-plan §4 |
| RF-COB-07 | El paso de la cuenta de pausa a activo después del pago: **Por definir** (¿lo hace Aarón a mano mientras no exista el cobro automático?) | No lo resuelven las fuentes |
| RF-COB-08 | **Cobro automático:** se construye durante la fase de pilotos (Fase 8), no en el MVP | D-012; 02-plan §4 |
| RF-COB-09 | **Durante el piloto no hay límite de clientes en el plan Inicio**: el producto no bloquea ni avisa al llegar a 200. Después del piloto, qué pasa al llegar a 200 y si cuentan los clientes totales o los activos (D-003 dice «activos»): **Por definir (PQ-09)** | D-020; D-003; D-006 |

### 5.9 Eventos de analítica

| ID | Requisito | Fuente |
|---|---|---|
| RF-EVT-01 | **Producto** (nombres únicos para todo el proyecto, 07-entrega §5): `resumen_semanal_visto` (negocio, semana) · `negocio_alta_completada` (oficio, fecha, **tanda**, versión del producto) · `tarjeta_configurada` · `qr_mostrador_descargado` · `cliente_registrado` (bienvenida sí/no, `identidad_nueva` sí/no) · `sello_registrado` (en línea/sin conexión) · `sello_bloqueado` (motivo: límite/doble_escaneo) · `canje_registrado` (en línea/sin conexión) · `sync_completada` (aceptados, rechazados) · `por_revisar_resuelto` · `accion_sugerida_click` · `export_csv` · `whatsapp_ayuda_click` · `activar_plan_click` | 07-entrega §5 |
| RF-EVT-02 | **Los que pide el ADR-001 §10:** `pwa_instalada` (SO, `display-mode: standalone`) · `guia_instalacion_mostrada` (SO) · `install_token_canjeado` · `recuperacion_completada` · `tarjeta_por_confirmar_creada` · `tarjeta_confirmada` (origen: app/cajero) · `app_abierta` (identidad, `display-mode`) | 07-entrega §5; ADR-001 §10 |
| RF-EVT-03 | Ya no se usan los nombres anteriores del plan: `negocio_alta` → `negocio_alta_completada`, `sello_otorgado` → `sello_registrado`, `canje_confirmado` → `canje_registrado` | 02-plan §4 (unificado 2026-10-21) |
| RF-EVT-04 | Fuera de la app se registran los clientes que visitaron por día (tickets o conteo) | 02-plan §4 |
| RF-EVT-05 | **Analítica propia, sin cookies** y sin herramientas de analítica de terceros: los eventos se guardan en una tabla propia en Supabase, sin PostHog (RNF-STK-05). Antes del piloto, el aviso de privacidad debe cubrir los eventos de uso (ver RNF-PRI-07) | D-018; [D-023](../decisiones.md) |

---

## 6. Flujos principales

| Flujo | Pasos | Fuente |
|---|---|---|
| **F1. Alta del negocio** (meta: < 5 min, sin ayuda) | 1) «Empieza gratis» en lealtab.com → N1 crea la cuenta; el dueño entra con código por correo o con contraseña. 2) N2 datos del negocio → N3 configura la tarjeta con vista previa en vivo. 3) N4 descarga el cartel QR del mostrador. Arranca el mes de prueba | 01-mapa §4 |
| **F2. El cliente se registra e instala** | 1) Escanea el QR del mostrador con la cámara → se abre la tarjeta web del negocio (`/c/{slug}/`). 2) C1: nombre y WhatsApp, lee el aviso corto y acepta → se crea su tarjeta. Si está prendido el sello de bienvenida, queda en 1/N. 3) Si ya tiene la app o una cuenta con su WhatsApp, la tarjeta se agrega a C0 sin reinstalar. Si no, C2 lo invita a instalar; si no instala, la recupera con su WhatsApp | 01-mapa §4 |
| **F3. Registrar una visita** | 1) El cliente muestra su QR (C3). 2) El staff abre N5 y escanea → ve el nombre y los sellos → confirma «+1 sello» (o ve M4a/M4b). 3) Los dos ven la confirmación y la tarjeta se actualiza. Respaldo: búsqueda por WhatsApp | 01-mapa §4 |
| **F4. Recompensa y canje** | 1) Con el último sello, C4 muestra «Recompensa lista» (aro en durazno). 2) En la siguiente visita el staff escanea → N5 muestra «Canjear recompensa» → confirma. 3) La tarjeta se reinicia y el canje queda en el historial | 01-mapa §4 |
| **F5a. Resumen semanal** | El dueño entra → N0 con el resumen de la semana y la acción sugerida → se registra `resumen_semanal_visto` | 01-mapa §4 |
| **F5. Quién regresa** | N6 con frecuentes, en riesgo y nuevos → cada grupo abre su lista en N7 → ficha → «Escribir por WhatsApp» | 01-mapa §4; pieza 05 |
| **F6. Exportar datos** | N7 → «Exportar CSV». También con la cuenta en pausa | 01-mapa §4 |
| **F7. Sin conexión y sincronización** | El mostrador sin conexión (M5) guarda sellos y canjes en la cola → al reconectar, Background Sync envía la cola → el servidor revalida → M6 muestra el resultado → los rechazos van a Por revisar → el dueño aprueba o descarta | D-015; pieza 06 |
| **F8. Fin de la prueba y pago** | Los 30 días gratis terminan → P1 (pausa, exportación disponible) → «Activar mi plan» abre WhatsApp → Aarón envía el link de Stripe o Mercado Pago → pago → cuenta activa (paso manual: Por definir) | D-012; pieza 06 |
| **F9. Segundo negocio** | El cliente escanea el QR de otro negocio. En iOS se abre Safari: si hay sesión, el alta es de un toque; si no, escribe su WhatsApp y la tarjeta queda «por confirmar». En Android se abre la app o Chrome con sesión. En ningún caso hay que reinstalar | ADR-001 §5.2 punto 6 |
| **F10. Cambio de teléfono** | El cliente abre `/c/recuperar` en el teléfono nuevo → escribe su WhatsApp → recibe un código por WhatsApp (API de WhatsApp Business) → lo escribe → recupera todas sus tarjetas en Mis tarjetas → `recuperacion_completada` | D-011 (cambio parcial 2026-10-21); ADR-001 §6 |

Diagrama: `06-product-design/mapa-flujos-mvp.png`. Pantallas: `06-product-design/entrega/mapa-pantallas.png`.

---

## 7. Requisitos no funcionales

### 7.1 PWA e instalación

| ID | Requisito | Fuente |
|---|---|---|
| RNF-PWA-01 | La tarjeta funciona **sin instalarse**, en el navegador de cualquier celular. Instalar es opcional | D-001 |
| RNF-PWA-02 | Manifest único en `/c/manifest.webmanifest` con `id: "/c/"` (inmutable), `scope: "/c/"`, `start_url: "/c/?source=pwa"`, `name`/`short_name: "LealTab"`, `display: standalone`, íconos de 192, 512 y maskable, y un `apple-touch-icon` de 180 px de LealTab | ADR-001 §5.2 |
| RNF-PWA-03 | Rutas: `/c/` = Mis tarjetas; `/c/{slug}/` = tarjeta del negocio (lo que imprime el QR); `/c/{slug}/registro`, `/c/recuperar`, `/c/cuenta`, `/c/privacidad`; `/mis-tarjetas` redirige a `/c/`. Los slugs reservados y el `slug` de cada negocio son inmutables. El panel vive en `/panel/`, fuera de `/c/`. Todo en el dominio `lealtab.com`, sin `app.lealtab.com` | ADR-001 §5.2; D-022 |
| RNF-PWA-04 | Un solo service worker con scope `/c/`, que guarda en caché el último estado de cada tarjeta por `slug` y la lista de Mis tarjetas | ADR-001 §5.2 |
| RNF-PWA-05 | **Sesión en iOS:** cookie `HttpOnly` y `Secure` de larga duración, más un `install_token` de 128 bits o más, de un solo uso, ligado a la identidad y con vigencia de 24 h. Si falla, respaldo con un código de 6 dígitos confirmado en Safari o con el cajero | ADR-001 §7 |
| RNF-PWA-06 | Cada tarjeta cambia `theme-color` al color del negocio `[SUPUESTO: confirmar en modo standalone]` | ADR-001 §5.2 |
| RNF-PWA-07 | Pruebas técnicas antes de abrir a los pilotos, en un iPhone con iOS 18 y 26 y un Android con Chrome estable: instalación, `install_token`, QR de un segundo negocio, `theme-color`, «Agregar a inicio» desde WhatsApp e Instagram, iOS 26 con «Abrir como app web» desactivado, y que `/panel/` no se abra dentro de `/c/` | ADR-001 §10 |
| RNF-PWA-08 | Las notificaciones push no son requisito del MVP (en iOS solo llegan con la PWA instalada) | 02-plan §3; D-001 |

### 7.2 Sin conexión primero y antifraude

| ID | Requisito | Fuente |
|---|---|---|
| RNF-OFF-01 | **El servidor es la fuente de verdad.** El conteo de cada tarjeta siempre se recalcula en el servidor | D-015; pieza 06 §6 |
| RNF-OFF-02 | Cola local en IndexedDB en el mostrador. Cada evento lleva `event_id` (UUID v4, llave de idempotencia), `tipo`, `card_id`, `qr_step`, `device_ts`, `device_id` y una `firma` ECDSA P-256 hecha con una llave del dispositivo creada con WebCrypto (no exportable) y registrada en el servidor al iniciar sesión. Reenviar un evento nunca duplica | Pieza 06 §1 |
| RNF-OFF-03 | El mostrador guarda en caché cifrada las llaves HMAC de las tarjetas de su negocio y las refresca en cada sincronización | Pieza 06 §2 |
| RNF-OFF-04 | Sincronización con Background Sync del service worker y reintento al abrir la app, con espera exponencial. El servidor revalida la firma, la ventana del QR, el límite (con `device_ts` acotado a la hora de recepción menos 72 h) y los duplicados entre dispositivos | Pieza 06 §4 |
| RNF-OFF-05 | Reglas de conflicto: gana el servidor. Se ordena por `device_ts` validado; en un empate gana el primero recibido. Si dos dispositivos dan sello al mismo cliente el mismo día, se acepta el primero y el otro va a Por revisar | Pieza 06 §6 |
| RNF-OFF-06 | Los eventos rechazados no se borran; van a Por revisar | D-015 |

### 7.3 Privacidad y LFPDPPP

| ID | Requisito | Fuente |
|---|---|---|
| RNF-PRI-01 | **Datos mínimos del cliente:** nombre, WhatsApp y consentimiento (con su fecha y hora). Nada más en el MVP | ADR-001 §6; 07-entrega §3 |
| RNF-PRI-02 | Modelo de identidad (D-019): una `identidad` (teléfono en E.164, el único identificador global) por persona y un `cliente_negocio` independiente por cada negocio, con su propio nombre y su estado `activa`/`por_confirmar`. Todas las consultas del panel filtran por `negocio_id` (con RLS en Postgres si se usa Supabase). La única vista que cruza negocios es Mis tarjetas, y solo la ve el propio cliente | ADR-001 §6 |
| RNF-PRI-03 | Rol propuesto: **el negocio es el responsable** de los datos de su programa y LealTab actúa como **encargado**, con un contrato de encargo en cada alta `[SUPUESTO, requiere revisión legal]`. Si el abogado concluye que Mis tarjetas convierte a LealTab en responsable, se evalúa tener un aviso propio desde el día 1; si el costo no es aceptable, se vuelve a la opción H (una PWA por negocio) | ADR-001 §5.1 y §6 |
| RNF-PRI-04 | **La consulta legal LFPDPPP es requisito antes de arrancar el piloto** | D-017 |
| RNF-PRI-05 | Aviso de privacidad corto y visible en C1 antes del botón, con enlace al completo; también en el pie del panel | 01-mapa §2 |
| RNF-PRI-06 | Los datos no se usan para fines propios de LealTab (por ejemplo, recomendar otros negocios) sin un ADR nuevo y revisión legal | ADR-001 §6 |
| RNF-PRI-07 | **Analítica propia, sin cookies** (D-018). El aviso actual de lealtab.com dice que no hay cookies ni analítica. **Antes del piloto** hay que actualizar el aviso para cubrir los eventos de uso: qué datos lleva cada evento, para qué y por cuánto tiempo. También falta el aviso de la plataforma, y hay que revisar cómo se menciona a Meta (API de WhatsApp Business) en el aviso | D-018; legal-notas §2 y §5 |
| RNF-PRI-08 | Pendientes legales heredados: domicilio, razón social y RFC del responsable; designar a la persona o el área de datos personales (art. 29); aviso simplificado junto al WhatsApp; contrato o anexo de encargo; proveedor de alojamiento sin nombrar; posible trato de consumidor a microempresas (LFPC) | legal-notas §3 |
| RNF-PRI-09 | **Retención y borrado** cuando un cliente elimina su cuenta (C5), plazo de conservación del aviso y texto legal final: **Por definir (PQ-04)**. El borrador de Términos propone 30 días tras cancelar para descargar o reactivar; el aviso no tiene un plazo numérico | 07-entrega §8; legal-notas §4 |
| RNF-PRI-10 | «Tus datos son tuyos: expórtalos cuando quieras.» La exportación siempre está disponible | 07-entrega §6; D-006 |

### 7.4 Rendimiento y operación

| ID | Requisito | Fuente |
|---|---|---|
| RNF-REN-01 | Dar un sello en el mostrador en menos de 5 segundos `[SUPUESTO]` | 03-propuesta §5 |
| RNF-REN-02 | El mostrador aguanta la hora pico de una cafetería (lo señala D-003). Objetivo numérico: **Por definir** | D-003 |
| RNF-REN-03 | Funciona con mala conexión en el local gracias al modo sin conexión | 02-plan §3 |
| RNF-REN-04 | Tiempos de carga de la tarjeta y del panel, disponibilidad y respaldos: **Por definir** (las fuentes no fijan cifras) | — |
| RNF-REN-05 | Dominio y rutas: decididos (D-022, RNF-PWA-03). Stack y alojamiento: decididos ([D-023](../decisiones.md)), ver 7.6 | D-022; [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) |
| RNF-REN-06 | Costo de infraestructura hasta el Gate 1: hosting y base de datos de USD 20 a 50 al mes `[SUPUESTO]`, por validar con los planes de Vercel y Supabase. Se suma el costo por mensaje del proveedor del código de recuperación por WhatsApp: **Por definir** (PQ-13) | 03-propuesta §10; D-011 |

### 7.5 Accesibilidad, idioma y diseño

| ID | Requisito | Fuente |
|---|---|---|
| RNF-A11Y-01 | Todo estado va con palabra y color, nunca solo color o ícono | 07-entrega §7 |
| RNF-A11Y-02 | Contraste AA, foco visible (`--focus-ring`), orden de tabulación lógico y objetivos táctiles de 44 px o más | 07-entrega §7 |
| RNF-A11Y-03 | Inputs de 16 px; el campo de WhatsApp lleva `inputmode="tel"` y `autocomplete`; los errores se asocian con `aria-describedby` | 07-entrega §7 |
| RNF-A11Y-04 | Aro con `role="img"` y `aria-label` (por ejemplo, «4 de 8 sellos»). El QR tiene como alternativa la búsqueda por WhatsApp. Se respeta `prefers-reduced-motion` | 07-entrega §7 |
| RNF-DIS-01 | Se usan los tokens de `04-design-system/tokens.css` tal cual, sin inventar colores | 07-entrega |
| RNF-DIS-02 | Español de México, de tú. Copy clave según 07-entrega §6. En producción va el logotipo aprobado (en los wireframes es texto provisional) | 07-entrega §6; piezas 03 y 04 |

### 7.6 Stack técnico ([D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md))

**Fuente de verdad:** el stack técnico se define en [ADR-002](../fase-2/adr/002-stack.md). Esta sección lo resume; si las dos difieren, manda el ADR-002.

| ID | Requisito | Fuente |
|---|---|---|
| RNF-STK-01 | TypeScript + Next.js (App Router), **en el mismo proyecto que la landing (`web/`)**, con las rutas `/c/` (app del cliente) y `/panel/` (panel del negocio) | [D-023](../decisiones.md); D-022; D-008 |
| RNF-STK-02 | Tailwind + shadcn/ui y pnpm, como en `web/`, con los tokens de `04-design-system/tokens.css` (RNF-DIS-01) | [D-023](../decisiones.md) |
| RNF-STK-03 | Supabase Postgres como base de datos, con **RLS que filtra por `negocio_id`** en todas las tablas de negocio (RNF-PRI-02) | [D-023](../decisiones.md); ADR-001 §6 |
| RNF-STK-04 | Supabase Auth para el dueño: correo + código o contraseña, con restablecimiento de contraseña por correo (RF-ALT-02, RF-ALT-02b). Cómo se relaciona la `identidad` del cliente con Supabase Auth: **Por definir** (PQ-22) | [D-023](../decisiones.md); D-005; D-019 |
| RNF-STK-05 | Eventos de uso (RF-EVT) en una **tabla propia en Supabase**, sin cookies, sin PostHog y sin herramientas de analítica de terceros | [D-023](../decisiones.md); D-018 |
| RNF-STK-06 | Código de recuperación por WhatsApp (RF-APP-15) con el **hook de teléfono/OTP de Supabase Auth** y un proveedor externo configurado en Supabase. Proveedor: **Por definir** (PQ-13) | [D-023](../decisiones.md); D-011 |
| RNF-STK-07 | Escaneo del QR en N5 Mostrador con una **librería de escaneo en el navegador**, que funcione sin conexión (RF-SEL-13). Librería: **Por definir** (PQ-25) | [D-023](../decisiones.md); D-015 |
| RNF-STK-08 | Alojamiento en **Vercel**, junto con la landing, en `lealtab.com` | [D-023](../decisiones.md); D-022 |
| RNF-STK-09 | Cobro con link de pago de Stripe o Mercado Pago, sin cambios (RF-COB-04) | D-012; [D-023](../decisiones.md) |
| RNF-STK-10 | Antes del piloto, comprobar que Vercel, Supabase y el proveedor de WhatsApp no pongan cookies ni carguen recursos de terceros, y confirmar en qué región guardan los datos (PQ-18) | [D-023](../decisiones.md); legal-notas §3 riesgo 6 |
| RNF-STK-11 | **React Server Components por defecto**; Tailwind CSS; shadcn/ui como capa estándar de componentes base | [D-023](../decisiones.md) (reglas del 21 oct); [ADR-002](../fase-2/adr/002-stack.md) §2.1 |
| RNF-STK-12 | La app está **lista para contenedores**: Docker, Docker Compose y un **Dockerfile multi-stage** | [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) §2.1 |
| RNF-STK-13 | **Desarrollo local dockerizado:** Docker Compose levanta Supabase con sus contenedores y la app web | [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) §2.1 |
| RNF-STK-14 | **Producción:** Vercel compila `web/`; el contenedor no se despliega en producción | [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) §2.1 |
| RNF-STK-15 | **Todo cambio a la base es una migración de Supabase** en `supabase/migrations`, y las migraciones corren durante el build de Vercel. Riesgos a cuidar: que solo corran en builds de producción (no en vista previa), credenciales en variables de entorno de Vercel, y que una migración fallida haga fallar el build | [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) §2.1 y §4 |

Nota: `.claude/agents/lealtab-desarrollador.md` en el repo todavía menciona PostHog. Hay que actualizarlo para que diga «tabla propia de eventos en Supabase» ([D-023](../decisiones.md)).

---

## 8. Modelo de datos (base para desarrollo) [07-entrega §3; ADR-001 §6]

| Entidad | Campos |
|---|---|
| negocio | id, nombre, giro, ciudad, zona_horaria, logo, plan, estado (prueba/activo/pausa), fin_prueba, whatsapp, correo_dueño |
| tarjeta_config | negocio_id, sellos_meta (4–12), recompensa, sello_bienvenida (bool), limite_modo (por_dia/cada_x_horas/sin_limite), limite_horas (> 0, sin mínimo obligatorio; se sugiere 2) |
| identidad (plataforma) | id, whatsapp (E.164, **único identificador global**; identifica la cuenta en la PWA), verificado, sesiones por dispositivo. Sin nombre |
| cliente_negocio | id, identidad_id, negocio_id, nombre (propio de cada negocio), aceptó_aviso_ts, alta_ts, estado (`activa`/`por_confirmar`). Uno por identidad y negocio |
| tarjeta_cliente | id, cliente_negocio_id, negocio_id, sellos, llave_hmac, creada_ts, ultima_visita_ts |
| dispositivo | id, negocio_id, nombre («iPhone caja»), llave_publica (ECDSA P-256) |
| evento (sello/canje) | event_id (UUID), tipo, tarjeta_id, qr_step, device_ts, recibido_ts, dispositivo_id, firma, origen (mostrador/bienvenida), estado (aceptado/rechazado/provisional) |
| canje | evento con tipo = canje, más la recompensa entregada; reinicia los sellos a 0 |
| por_revisar | evento_id, motivo (límite, QR vencido, duplicado, doble canje, firma), resolución (aprobado/descartado), resuelto_por, resuelto_ts |

> **Resuelto (D-019, 2026-10-21):** se adopta el modelo del ADR-001. El teléfono es el único identificador global y cada negocio guarda su propio nombre del cliente en `cliente_negocio`, con estado `activa`/`por_confirmar`. La hoja de entrega ya lo refleja.
>
> **Por conciliar:** faltan en `negocio` la tanda y la versión del producto (D-004), que hoy solo viajan en el evento `negocio_alta_completada`.

---

## 9. Precios y planes

### 9.1 Precios públicos [D-006; pieza 05]

| Plan | Precio | Incluye |
|---|---|---|
| Prueba | Gratis 30 días, sin tarjeta de crédito | Al terminar sin pagar, la cuenta se pausa y los datos se pueden exportar |
| **Inicio** | **$299 MXN/mes + IVA**, sin contratos | 200 clientes, 1 tarjeta, 1 sucursal |
| **Negocio** (recomendado) | ~$449 MXN/mes + IVA | Clientes ilimitados, varias tarjetas, hasta 3 sucursales (sus funciones llegan después del MVP; el MVP maneja 1 sucursal, D-021). La landing tiene `pricing.ts` («Hasta 3 sucursales») y `roadmap.ts` («Varias sucursales» como «Próximamente») sin alinear: se corrige al retomar la Fase 5 |
| **Pro** | «Próximamente», sin precio | Hipótesis: varias sucursales y funciones nuevas (avisos, campañas), junto con la transición a la Propuesta B [audiencia, hipótesis de precios] |

- **«Hecho con LealTab» va en todos los planes, Pro incluido**, en la tarjeta y en el cartel [D-016].
- El precio de fundador solo se ofrece en trato directo con los pilotos, por escrito desde el inicio [D-006; PLAN].
- Nunca se sube un precio sin aviso previo [audiencia, hipótesis de precios]. El borrador de Términos propone un aviso de al menos 30 días [legal-notas §4].
- Mensaje de venta: inversión, no gasto («con que regresen 2 o 3 clientes más al mes, ya se pagó»). Hay que medirlo en el piloto [audiencia].
- Contexto: la competencia local va de MXN 0 a 550 al mes. LealTab compite por servicio y resultados medibles, no por precio [03-propuesta §6].

### 9.2 Piloto

- 30 días de prueba gratis por negocio, que son su piloto. Al terminar, paga con un link de Stripe o Mercado Pago a un **precio especial de piloto** durante los primeros meses. **Monto y duración: Por definir (PQ-01)** [D-012].
- Relación entre el «precio especial de piloto» (D-012) y el «precio de fundador» (PLAN, D-006): **Por definir** si son lo mismo.
- El plan pedía probar precios distintos con negocios parecidos [PLAN]. Cómo se combina eso con un precio especial único: **Por definir**.

---

## 10. Roadmap por fase con criterio de salida (sin fechas)

Numeración de `docs/02-plan-de-trabajo.md` v3. La «Fase 7, Desarrollo» de `PLAN.md` corresponde aquí a la Fase 7, «Desarrollo del MVP + piloto 0».

| # | Fase | Estado | Criterio de salida |
|---|---|---|---|
| 0 | Validación de la idea | ✅ | Veredicto GO y competencia mapeada. Pendiente heredado: búsqueda en el IMPI (clases 9, 35 y 42) y la WIPO |
| 1–4 | Estrategia, dirección creativa, identidad visual y design system | ✅ | Aprobados |
| 5 | Marketing de lanzamiento | ⏸️ En pausa (D-009) | Landing en `web/` publicada ✅ (D-008), perfil de IG confirmado, posts 8 y 9 e historias decididos. Al retomarla: alinear `pricing.ts` y `roadmap.ts` en sucursales (D-021) |
| 6 | Diseño de producto del MVP | ✅ Cerrada (2026-10-20) | Pantallas N0-N8 y C0-C4 aprobadas (C5 en alcance, sin wireframe), ADR-001 cerrado y eventos definidos. **PRD del MVP: borrador en revisión** (este documento) |
| **7** | **Desarrollo del MVP + piloto 0** | Pendiente | 1) Un local real usa el flujo completo durante una semana sin errores bloqueantes. 2) Al menos **10 pilotos confirmados por escrito** (WhatsApp), de 3 oficios o más. 3) **Entrevistas con dueños sobre el ícono y consulta legal LFPDPPP hechas** (D-017). Antes del piloto también hay que actualizar el aviso de privacidad para la analítica (D-018) y tener configurada la API de WhatsApp Business para la recuperación (D-011). Si a mitad de la fase hay menos de 6 pilotos confirmados, se revisa el segmento. En paralelo: entrevistas, consulta legal y reclutamiento en persona |
| 8 | Pilotos y Gate 1 | Pendiente | Gate 1 (sección 2.2). Durante la fase: playbook del piloto, guiones de WhatsApp, prueba de humo con anuncios en Meta (MXN 3,000–5,000), métricas semanales (incluida la apertura del resumen), **construir el cobro automático** y solo correcciones críticas |
| 9 | Producto v1 y Gate 2 | Pendiente | Solo lo que pidan los datos (candidatos: cobro recurrente con CFDI, varias sucursales y usuarios de staff, aviso del resumen por WhatsApp o correo, mejoras de instalación). Gate 2: ≥15 clientes de pago, MRR ≥ MXN 7,500, churn mensual ≤8 % y un canal de ≤6 h del fundador por cliente |
| 10 | Crecimiento y paso a la Propuesta B | Pendiente | Las 3 señales: 1) tablero de retención real y al menos una segunda función (avisos o campañas); 2) pilotos con resultados que se puedan contar; 3) clientes que piden varias sucursales, datos o herramientas para atraer clientes |
| 11 | Módulos de plataforma | Por demanda | Gate 3: MRR ≥ MXN 30,000 con ≥60 clientes, y el módulo pedido por ≥3 clientes de pago (candidatos: Avisos, Campañas, Reportes y Wallet) |

Los negocios que entren después del corte de altas forman la segunda tanda y cuentan para el Gate 2 [D-004].

---

## 11. Riesgos

| # | Riesgo | Mitigación | Fuente |
|---|---|---|---|
| R-01 | **Construir antes de validar:** el MVP se construye antes del primer piloto y todavía no hay entrevistas | Entrevistas en paralelo, alcance cerrado y revisión del segmento si hay menos de 6 pilotos a mitad de la Fase 7 | D-002; 03-propuesta §8 |
| R-02 | **Adopción en el mostrador:** que el staff pida el QR y el cliente se inscriba | Capacitación de 15 min, cartel, métrica de inscripción y búsqueda por WhatsApp | 03-propuesta §8; 01-validación R6 |
| R-03 | **PWA en iOS y en navegadores integrados:** sin aviso de instalación, sesión que no pasa de Safari a la app, borrado de datos de sitios no instalados | La tarjeta funciona sin instalarse, guía visual, `install_token`, identidad en el servidor y recuperación por WhatsApp | D-001; ADR-001 §7; 02-plan §3 |
| R-04 | **Privacidad (LFPDPPP):** con una sola app y Mis tarjetas, LealTab podría ser responsable y no solo encargado | Consulta legal antes del piloto; respaldo con la opción H | D-017; ADR-001 §5.1 |
| R-05 | **Reversibilidad de la opción B:** volver a una PWA por negocio con pilotos ya instalados obliga a reinstalar | Validaciones (a) y (b) antes de abrir a los pilotos | ADR-001 §5.3 y §9 |
| R-06 | **Ícono del negocio:** si ≥3 de 10 dueños citan el ícono propio como motivo de compra, se vuelve a H | Entrevistas antes del piloto; posible módulo de pago después | ADR-001 §5.1 |
| R-07 | **Fraude con sellos:** capturas del QR o sellos de más | QR rotativo con HMAC, límite por día, bloqueo, registro por dispositivo y Por revisar | D-014 |
| R-08 | **Doble canje sin conexión** en dos dispositivos del mismo negocio | Máximo 1 canje sin conexión por tarjeta; el segundo va a Por revisar y el negocio absorbe ese costo | Pieza 06 §7 |
| R-09 | **Carga operativa:** altas, carteles, capacitación y soporte por WhatsApp para 20 negocios. Capacidad realista de la primera tanda: 10 a 14 negocios | Corte de altas para la primera tanda; segunda tanda para el Gate 2 | D-003; D-004 |
| R-10 | **Límite de 200 clientes de Inicio** en cafeterías | Sin límite durante el piloto (D-020). Regla después del piloto: Por definir (RF-COB-09, PQ-09) | D-003; D-020 |
| R-11 | **Precio ancla bajo** (competencia local de MXN 0 a 550) | Vender resultados y apuntar a negocios con más de una sucursal | 03-propuesta §8 |
| R-12 | **El resumen semanal no se abre** al vivir solo en el panel | Se mide con `resumen_semanal_visto`; en la v1 se evalúa un aviso por WhatsApp o correo | D-011 |
| R-13 | **Percepción frente a competidores con wallet** | Mensaje «sin descargar nada»; medir en las entrevistas si el wallet aparece como requisito | 03-propuesta §8 |
| R-14 | **Nombre:** falta la búsqueda en el IMPI y la WIPO; hay colisión con Lealify, Leal y Lealy | Búsqueda pendiente | 01-validación §2.6 |
| R-15 | **Distribución:** vender a PyMEs requiere ventas presenciales | Se mide en horas del fundador por cliente (E7) | 03-propuesta §8 |
| R-16 | **Tiempo de construcción** `[SUPUESTO]`: depende de las horas disponibles | Pregunta abierta PQ-15 | 02-plan §2; 03-propuesta §11 |
| R-17 | **Ventana de cobro en temporada de fiestas**, cuando los dueños tienen menos tiempo | Cuidar el corte de altas | 02-plan §2 |
| R-18 | **Costo y configuración de la API de WhatsApp Business** para el código de recuperación: cobro por mensaje, plantilla que Meta debe aprobar, número y cuenta de negocio, y dependencia de un proveedor externo (si la API falla, el cliente no recupera su tarjeta). Montos: **Por definir** | Configurar la API antes del piloto y medir cuántos códigos se envían (MET-05). El respaldo si la API falla: **Por definir** | D-011 (cambio parcial 2026-10-21); 01-validación R7 |

---

## 12. Preguntas abiertas

| ID | Pregunta | Quién / cuándo | Fuente |
|---|---|---|---|
| **PQ-01** | **Precio especial de piloto:** ¿qué monto y cuántos meses dura? ¿Es el mismo «precio de fundador» que se ofrece por escrito? ¿Se prueban precios distintos con negocios parecidos, como pedía el plan? | Aarón, antes de abrir los pilotos | D-012; 03-propuesta §11 |
| **PQ-02** | **Gate 1 y precio de piloto (pendiente, depende de PQ-01):** G1-b cuenta como pagando a quien paga ≥ $299 sin IVA, pero el precio especial de piloto puede ser menor. Aarón decidió (2026-10-21) definir quién cuenta como negocio que paga **cuando se fije el precio de piloto** | Aarón, al fijar el precio de piloto | 02-plan §4; D-004; D-012 |
| ~~PQ-03~~ | ~~Bloqueo contra el doble escaneo: ¿1 o 2 minutos?~~ **Cerrada (Aarón, 2026-10-21): fijo en 2 min** (D-014) | — | D-014 |
| **PQ-04** | **Retención de datos y aviso legal final:** ¿cuánto tiempo se guardan los datos, qué se borra cuando un cliente elimina su cuenta (C5), y cuál es el texto final del aviso de privacidad? | Aarón con abogado, antes del piloto | 07-entrega §8; legal-notas §4 |
| **PQ-05** | **Plantilla de WhatsApp desde Clientes:** ¿qué texto prellenado lleva el enlace `wa.me` de «Escribir por WhatsApp» en N7? | Durante el desarrollo | 07-entrega §8 |
| **PQ-06** | **Términos del límite de sellos:** ¿se muestran en C3 o solo en el aviso de la tarjeta? | Durante el desarrollo | 07-entrega §8; pieza 02 |
| **PQ-07** | **Entrevistas y consulta legal:** las entrevistas con dueños sobre el ícono (validación 5.1 b) y la consulta legal LFPDPPP (5.1 a) no se han hecho. ¿Quién y cómo se hacen? Si fallan, se vuelve a la opción H | Aarón, **antes del piloto** (criterio de salida de la Fase 7) | D-017; ADR-001 §5.1 |
| PQ-08 | Corte de altas de la primera tanda (sin calendario) | Aarón | D-004 |
| PQ-09 | **Límite de 200 clientes de Inicio después del piloto** (durante el piloto no hay límite, D-020): ¿qué pasa al llegar a 200 (bloqueo de registros, aviso, paso al plan Negocio) y cuentan los clientes totales o los activos? | Aarón, antes de terminar el piloto | D-020; D-003; D-006 |
| PQ-10 | **Pendiente de Diseño de Producto:** ajustar N1 para entrar con contraseña y para restablecerla por correo (vigencia del enlace, reglas de la contraseña, intentos). *(El color de acento ya se resolvió: N3 no lo lleva.)* | Diseño de Producto | D-005 (2026-10-21); PLAN |
| PQ-11 | Fichas por oficio con datos propios (ciclo de visita y ticket mínimo, sobre todo en tapiocas) | Entrevistas | revisión §5; 03-propuesta §3 |
| PQ-12 | Diseño de C5 «Mis datos», que no tiene wireframe | Diseño | 01-mapa §3 |
| PQ-13 | **Pendiente: proveedor del código por WhatsApp**, el que se conecta al hook de teléfono/OTP de Supabase Auth: cuál se elige y cuánto cuesta por mensaje | Aarón y desarrollo, antes del piloto | D-011 (cambio parcial 2026-10-21); [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) §3 |
| ~~PQ-14~~ | ~~Lista final de eventos~~ **Cerrada (2026-10-21):** nombres unificados en `07-entrega` §5, `docs/02-plan` y este PRD (RF-EVT-01 a 03) | — | 07-entrega §5 |
| PQ-15 | ¿Cuántas horas por semana hay para construir y cuántas para vender en persona? | Aarón | 03-propuesta §11 |
| ~~PQ-16~~ | ~~Stack y proveedor de alojamiento~~ **Cerrada (Aarón, 2026-10-21):** Next.js en `web/`, Supabase y Vercel ([D-023](../decisiones.md), sección 7.6). La revisión de cookies y región de los proveedores pasa a PQ-18 | — | [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) |
| PQ-17 | Cómo se activa la cuenta después del pago por link (manual hasta que exista el cobro automático) | Aarón | D-012 |
| PQ-18 | **Pendiente: actualizar el aviso de privacidad** para cubrir los eventos de uso de la analítica propia sin cookies (decidido en D-018). También: revisar que Vercel, Supabase y el proveedor de WhatsApp no pongan cookies, decidir si se nombran en el aviso y si tratan datos fuera de México (RNF-STK-10) | Aarón con abogado, antes del piloto | D-018; legal-notas §5 |
| PQ-19 | Reglas de «corregir sellos» en N7 (motivo, límites, bitácora) y qué pasa con el avance si cambia el número de sellos de la tarjeta | Diseño | Pieza 05 |
| PQ-20 | Definición de «semana» del resumen y del «intervalo habitual» con una sola visita | Diseño y desarrollo | — |
| PQ-21 | Búsqueda de marca en el IMPI y la WIPO | Aarón | 02-plan §2 |
| PQ-22 | Detalles de implementación que las fuentes no fijan: de dónde sale la zona horaria del negocio (RF-ALT-06), si X en «1 cada X horas» acepta fracciones (RF-SEL-06), si el CSV incluye el detalle de visitas (RF-CLI-06), dónde se guardan la tanda y la versión del producto del negocio (sección 8), vigencia del código de recuperación e intentos (RF-APP-15), plantilla y cuenta que pida el proveedor de WhatsApp, cómo se relaciona la `identidad` del cliente con Supabase Auth (RNF-STK-04), y si el alta de un segundo negocio sin sesión usa el código por WhatsApp o la confirmación sin costo del ADR-001 (§5.2 punto 6) | Desarrollo | [ADR-002](../fase-2/adr/002-stack.md) §3 |
| PQ-23 | Respaldo si la API de WhatsApp Business falla y el cliente no recibe su código de recuperación (R-18) | Desarrollo y Aarón | D-011 |
| PQ-24 | Objetivos numéricos de rendimiento y operación: hora pico en cafeterías, tiempos de carga, disponibilidad y respaldos (RNF-REN-02 y RNF-REN-04) | Desarrollo | D-003 |
| PQ-25 | Librería de escaneo de QR en el navegador para N5 Mostrador, que funcione sin conexión (RNF-STK-07) | Desarrollo | [D-023](../decisiones.md); [ADR-002](../fase-2/adr/002-stack.md) §3 |

---

## 13. Trazabilidad de decisiones (D-001 a [D-023](../decisiones.md))

| Decisión | Dónde aplica en este PRD |
|---|---|
| D-001 Tarjeta web (PWA), sin Apple ni Google Wallet; instalar es opcional | 4.2, RNF-PWA-01, RNF-PWA-08 |
| D-002 Plataforma propia desde el MVP, sin marca blanca | 4.1, 4.2, R-01 |
| D-003 Piloto de 20 negocios en 4 oficios, con cafeterías | 3.2, 3.4, R-09, R-10 |
| D-004 30 días de prueba por negocio como piloto; Gate 1 y tandas | 2.2, RF-ALT-11, 10, PQ-08 |
| D-005 Alta sola en menos de 5 min; entrada con código de 10 min o contraseña (actualizado 2026-10-21) | 5.1 (RF-ALT-01 a 02b), MET-01, PQ-10 |
| D-006 Precios y planes públicos; pausa y exportación al terminar la prueba | 9.1, RF-COB-03 |
| D-007 Módulos en español; al lanzar, Tarjeta y Clientes | 4.1, 4.2 |
| D-008 La landing vive en `web/` | 4.1, 10 (Fase 5) |
| D-009 Fase 5 en pausa | 10 (Fase 5) |
| D-010 Mapa de flujos: N5 dentro del panel, cuenta compartida, «En riesgo», sello de bienvenida automático | 3.1, 5.3, 5.6, RF-TAR-03 |
| D-011 Resumen solo en el panel; la API de WhatsApp Business solo para el código de recuperación (cambio parcial 2026-10-21) | 5.6, RF-APP-04, RF-APP-15, RF-CLI-03, F10, R-18, PQ-13, PQ-23 |
| D-012 Cobro del piloto con link de Stripe o Mercado Pago; «Activar mi plan» abre WhatsApp | 5.8, F8, 9.2, PQ-01, PQ-17 |
| D-013 Una sola app LealTab con Mis tarjetas | 5.4, 6 (F9), RNF-PWA-02 a 05 |
| D-014 Antiabuso: QR de 60 s, 1 sello por día por defecto, X libre en «1 cada X horas», bloqueo fijo de 2 min, registro por dispositivo | 5.3 (RF-SEL-04 a 09), RF-AJU-02, 8 |
| D-015 Sin conexión primero; canje sin conexión con límite | RF-SEL-13 a 15, 7.2, F7 |
| D-016 «Hecho con LealTab» en todos los planes, Pro incluido | RF-ALT-10, RF-TAR-04, 9.1 |
| D-017 Entrevistas del ícono y consulta legal LFPDPPP antes del piloto | RNF-PRI-03, RNF-PRI-04, 10 (Fase 7), PQ-07 |
| D-018 Analítica propia, sin cookies; aviso actualizado antes del piloto | RF-EVT-05, RNF-PRI-07, PQ-18 |
| D-019 Nombre del cliente por negocio; el teléfono es el único identificador global | 8, RNF-PRI-02, RF-APP-05 |
| D-020 Sin límite de clientes en Inicio durante el piloto | RF-COB-09, R-10, PQ-09 |
| D-021 Una sola sucursal en el MVP; hasta 3 después | 3.2, 4.2, RF-SUC-01, 9.1, 10 (Fase 5) |
| D-022 Producto en `lealtab.com`, con `/c/` y `/panel/` | 4.1, 4.2, RNF-PWA-03, RNF-REN-05, RNF-STK-08 |
| [D-023](../decisiones.md) Stack: Next.js en `web/`, Tailwind + shadcn/ui, pnpm, Supabase (Postgres, Auth, RLS, eventos), Vercel; proveedor de WhatsApp y librería de QR por definir | 7.6 (RNF-STK-01 a 15), RNF-REN-05, RF-APP-15, RF-EVT-05, PQ-13, PQ-16, PQ-25 |
