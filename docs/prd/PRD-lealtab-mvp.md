# LealTab · PRD del MVP (tarjeta digital de lealtad)

| Campo | Valor |
|---|---|
| Producto | LealTab, plataforma SaaS de lealtad para negocios. Arranca con la tarjeta de lealtad digital (PWA instalable) |
| Dueño del documento | Aarón López Sosa |
| Versión | v2.0 |
| Fecha de redacción | 21 oct 2026 (solo registro; el plan no lleva calendario) |
| Uso | Referencia de producto antes de arrancar la Fase 7 (Desarrollo) |
| Estado | **Borrador para aprobación de Aarón**. La Fase 6 está cerrada (2026-10-20) |

**Fuentes.** `PLAN.md`; `00-brief/resumen-inicial.md`; `01-brand-strategy/` (audiencia y posicionamiento, identidad de marca, competidores); `06-product-design/` (piezas 01 a 07, `entrega/mapa-pantallas.png`, `investigacion-limite-sellos.md`); `revision-docs-2026-10-20.md` (incluida la sección 6, «Huecos resueltos con Aarón»); `docs/decisiones.md` (D-001 a [D-031](../decisiones.md)), [`docs/adr/002-stack.md`](../adr/002-stack.md), `docs/adr/003-sesion-cliente-y-codigo.md`, `docs/adr/004-proveedor-codigo.md`, `docs/fase-7/propuestas/aprobaciones-2026-10-21.md`, `docs/01-validacion-idea.md`, `docs/02-plan-de-trabajo.md` v3, `docs/03-propuesta.md` v0.3, `docs/adr/001-modelo-pwa.md` y `docs/fase-2/legal-notas.md`.

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
| v1.3 | Stack decidido por Aarón ([D-023](../decisiones.md), [ADR-002](../adr/002-stack.md)): requisitos RNF-STK en 7.6, PQ-16 cerrada, PQ-13 reducida a la elección y el costo del proveedor del código por WhatsApp. Después, reglas del stack de Aarón (21 oct): React Server Components por defecto, Docker para local, migraciones de Supabase en el build de Vercel (RNF-STK-11 a 15) |
| v1.4 | Aclaración de Aarón (21 oct): todo el código de la app vive en `web/`, incluido Supabase (`web/supabase/migrations`) y Docker (RNF-STK-12 y 15). Se quita la nota de 7.6 sobre PostHog en los agentes: estaba en `lealtab-arquitecto.md` y ya se corrigió |
| v1.5 | Decisiones de Aarón del 21 oct sobre las PQ del v1.4 ([D-024 a D-030](../decisiones.md), aclaraciones a D-004, D-005, D-011, D-014, D-015 y D-023): proveedor del código (SMS Masivos con el hook de Supabase, respaldo por SMS, Resend para el correo del dueño); identidad y sesión del cliente propias y segundo negocio «por confirmar» (RF-APP-04 reemplazado); C5 y borrado de cuenta; corregir sellos y cambio de meta (`meta_ciclo`); semana, intervalo habitual, bienvenida que no es visita y chip «Al día»; sellos que no caducan; plantillas de WhatsApp de N7; N5 sin segundo service worker; N1 con contraseña; metas de rendimiento. PQ cerradas: 05, 06, 10, 12, 13, 19, 20, 22, 23, 24, 26, 27 y 28. Nuevas: PQ-29 y PQ-30; PQ-25 sigue abierta |
| v1.6 | Decisión de Aarón del 22 oct ([D-031](../decisiones.md), que **sustituye a D-025**): el cliente usa Supabase Auth con su teléfono verificado por OTP desde el registro en C1. Ya no hay sesión propia ni cookie `Path=/c/`; registro y recuperación son el mismo flujo; desaparece el estado «por confirmar» (RF-APP-05 y MET-08). Cambian RF-APP-01, 02, 04, 05, 14 y 15, RNF-PWA-05, RNF-PRI-02 y 07, RNF-STK-04 y 06, RNF-REN-06, F2, F9 y F10, MET-03, MET-05, MET-08 y R-18, el modelo de datos (§8: sin `sesion_cliente`, `identidad` con `auth_user_id`, `envio_codigo` cubre registros) y los eventos RF-EVT-02. PQ-18 suma un punto, PQ-30 se amplía y nace PQ-31 (`install_token` de iOS con la sesión de Supabase). Aarón aprobó el mismo día los límites y el costo del `docs/adr/003-sesion-cliente-y-codigo.md` (3 por hora y 10 al día por teléfono, 10 por hora por IP, tope global de 400 al día con aviso a los 200, alerta de saldo de 300 mensajes, límite de SMS por hora de Supabase de 30 a 100, costo variable del piloto de MXN 2,000 a 3,300 antes de IVA), y el §8 suma `tarjeta_llave`, `install_token`, `codigo_intento`, `dueno_negocio` y las vistas `negocio_publico` y `cliente_del_negocio`. Siguen **Por definir**: el mecanismo del `install_token` de iOS (PQ-31), el *custom access token hook* frente a `app_metadata` escrito por el servidor, la vigencia de 10 min en Supabase y el costo del WhatsApp (PQ-30) |
| v1.7 | Aprobaciones de Aarón del 22 oct tras D-031: eventos (RF-EVT-01 a 06 con el catálogo de `docs/fase-7/medicion.md`, incluidos los extra del analista: `registro_iniciado`, `duracion_s` y `duracion_ms`, `so` y `con_codigo`), tabla `evento_uso` y `envio_codigo.flujo_id` en el §8, y MET-03, 05, 06, 07 y 09 reescritas; la pieza `brand/06-product-design/08-registro-con-codigo.md` como diseño de C1, R1, recuperación e iOS (RF-APP-02, 04 y 15); botón «Enviarme el código», nombre prellenado en R1 y «el cliente sin código pregunta en el mostrador». PQ nuevas, todas abiertas: PQ-32 a PQ-40 (convenciones de G1, conservación de `evento_uso`, borrado de `envio_codigo`, motivos de corrección y los cinco puntos del arquitecto sobre la pieza 08) |
| v1.8 | Decisión de Aarón del 22 oct (PQ-32, aclaración de [D-004](../decisiones.md)): convenciones de Gate 1 en §2.2 (día 1 = fecha del alta del negocio; días 1 a 30; las 4 semanas de G1-a en los días 1-28; visita sin bienvenida ni correcciones; «segunda visita sellada» y «regresa»; G1-d como cifra global por cliente, con la mediana por negocio como lectura aparte). PQ-32 cerrada. Siguen **Por definir** G1-b (PQ-01 y PQ-02) y el denominador de G1-c |
| v1.9 | Aclaraciones de Aarón del 22 oct (aclaración de [D-004](../decisiones.md), convenciones de Gate 1 en §2.2): «≥5 segundas visitas selladas» de G1-a significa **5 clientes** distintos con visitas en 2 o más días locales distintos dentro de los días 1 a 30, no 5 visitas sueltas; **negocio evaluable** solo cuando ya pasó la ventana de su criterio (los no evaluables se muestran en el informe, pero no cuentan como «no cumple»). Nace **PQ-41** (abierta): captura del denominador de G1-c (`ext_visitas_dia`, RF-EVT-04), que puede esperar a la Fase 8. La nota de G1-c en §2.2 cita PQ-41 en lugar de «sin PQ propia» |
| v2.0 | Decisión de Aarón del 22 oct (aclaración de [D-028](../decisiones.md)): precedencia de los chips de estado de cliente en N6 y N7. Un cliente tiene **un solo chip**, con la precedencia **En riesgo > Frecuente > Nuevo > Al día**. Se cierra el «Por definir» de RF-QR-01 (la propuesta de diseño sin aprobar ya no aplica), y RF-CLI-01 remite a la misma regla. No había PQ abierta sobre la precedencia, así que §12 no cambia |

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
| Sin descargar nada, en cualquier celular | Escanea el QR, deja su nombre y su WhatsApp, confirma con un código y ya tiene su tarjeta. Instalarla es opcional. Se recupera con su WhatsApp | `[SUPUESTO]`: se prueba con E6 adaptado a la PWA [D-001] |
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

**Convenciones de medición** (PQ-32, decididas por Aarón el 22 oct 2026; aclaración de [D-004](../decisiones.md)):

| Concepto | Convención |
|---|---|
| Día 1 | Fecha del alta del negocio (`negocio.alta_ts` en la zona horaria del negocio). Días 1 a 30 = día 1 a día 1 + 29. El día 37 de cobro = día 1 + 36 |
| Semanas de G1-a | Días 1-7, 8-14, 15-21 y 22-28. Los días 29 y 30 no cuentan para «sellos en ≥3 de sus 4 semanas», pero sí para inscritos, canjes y segundas visitas |
| Visita | Sello o canje aceptado en el mostrador, sin el sello de bienvenida [D-028] ni las correcciones [D-027] |
| Segunda visita sellada (G1-a) | Un cliente con visitas en 2 o más días locales distintos dentro de los días 1 a 30 |
| Regresa (G1-d) | Una visita en un día local posterior al de su alta y hasta 21 días después. El mismo día del alta no cuenta, aunque lleve sello. Solo entran los inscritos cuya ventana de 21 días ya cerró |
| G1-d, cifra del gate | Global por cliente: todos los inscritos de los negocios de la tanda juntos. La mediana por negocio, el desglose por oficio y por semana de alta se reportan aparte como lectura complementaria y no deciden el gate |

**Aclaraciones del 22 oct 2026** (decisión de Aarón; aclaración de [D-004](../decisiones.md)):

1. «≥5 segundas visitas selladas» de G1-a significa **5 clientes** distintos que tienen visitas en 2 o más días locales distintos dentro de los días 1 a 30 (no 5 visitas sueltas).
2. **Negocio evaluable:** un negocio entra al cálculo de un criterio solo cuando ya pasó la ventana de ese criterio. Los no evaluables se muestran en el informe, pero no se cuentan como «no cumple».

**Siguen Por definir** (fuera de PQ-32): G1-b, si se suman los pagos o es un pago único ≥ MXN 299 (PQ-01 y PQ-02); y G1-c, cuyo denominador de visitas depende de que el dueño lo capture (RF-EVT-04): se rige por **PQ-41**.

**Lectura complementaria (no cuenta para pasar):** resultados por oficio (con unos 5 negocios por oficio son dirección, no estadística; un oficio es «candidato» con ≥3 activos y ≥2 pagando) y «¿lo recomendarías?» a los dueños [02-plan §4].

> **Por definir (PQ-02):** quién cuenta como negocio que paga en G1-b. Aarón lo decide cuando se fije el precio especial de piloto (PQ-01), porque depende de él (2026-10-21).

### 2.3 Métricas del producto (separadas del Gate 1)

| ID | Métrica | Meta | Fuente |
|---|---|---|---|
| MET-01 | Tiempo de alta del negocio (N1 a N4), sin ayuda | < 5 min | F1; D-005 `[SUPUESTO]` |
| MET-02 | Tiempo para dar un sello en el mostrador | < 5 s | 03-propuesta §5 `[SUPUESTO]` |
| MET-03 | De los flujos con `registro_iniciado` (el cliente vio C1), cuántos terminan en `cliente_registrado`, con el paso del código (D-031). **Denominador: flujos con `registro_iniciado`.** Se reportan dos tasas: la total (incluye el segundo negocio con sesión, que no pide código) y la de **sin sesión**, que es la que se compara con la meta. Se acompaña del embudo, del abandono por etapa (sin envío, sin intento, con fallos) y del canal | ≥85 % `[SUPUESTO]` en la tasa sin sesión; con el paso del código puede bajar. Los envíos (`codigo_enviado`) dan también el costo real por cliente nuevo (estimado de MXN 1.00 a 1.20 con reintentos, ADR-003 §4). El ajuste del umbral queda **Por definir** | E6 adaptado; D-031; `medicion.md` §6.3 |
| MET-04 | Instalación de la PWA (`pwa_instalada`, con `display-mode: standalone`), medida aparte en iPhone y Android | ≥25 %. Si es <10 % en los dos sistemas, no se invierte más en instalar. Entre 10 % y 25 %, se revisa el copy de la guía | E6; ADR-001 §10 |
| MET-05 | Recuperaciones de tarjeta (`recuperacion_completada`: verificación del código por un teléfono que ya tenía tarjetas, sin sesión en ese navegador; **incluye** al cliente que se registra en un segundo negocio sin sesión, `proposito = registro`, y al que cambió de teléfono o borró sus datos, `proposito = recuperacion`). Denominador: `cliente_registrado`. Un segundo negocio sin sesión emite a la vez `cliente_registrado` y `recuperacion_completada`, así que también aparece en MET-07 y MET-09 | <10 % de los inscritos | E6; ADR-001 §10; D-031; `medicion.md` §6.5 |
| MET-06 | Éxito de la transferencia de sesión en iOS, con dos mecanismos (PQ-31). **Mecanismo A (token):** identidades con `install_token_canjeado` entre las identidades con `guia_instalacion_mostrada` en iOS. **Mecanismo B (código al abrir la PWA):** flujos con `codigo_verificado` y `proposito = instalacion` entre los flujos con `codigo_pedido` del mismo propósito; cada intento cuesta un mensaje más. La guía mostrada es el denominador posible, no las instalaciones reales (iOS no avisa la instalación): se reporta junto con MET-04 de iOS | ≥80 %. Si es <60 % con A, se pasa al respaldo B de RNF-PWA-05 | ADR-001 §10; D-031; ADR-003 §2.3; `medicion.md` §6.5 |
| MET-07 | Conversión del segundo negocio en la app ya instalada. Denominador: `cliente_registrado` con `identidad_nueva = no` de una identidad que **ya tenía `pwa_instalada`**. Numerador: seguido de `app_abierta` en standalone en ≤7 días. Se segmenta por `con_codigo`: con sesión (un paso, sin código) frente a sin sesión (pasó por el código; en iPhone suele ser el caso, porque el QR abre Safari y no la PWA). Límite: «abrió la app» puede deberse al primer negocio, no al segundo | ≥60 %. Si es <30 %, se adelanta el escaneo desde dentro de la app | ADR-001 §10; D-031; `medicion.md` §6.6 |
| ~~MET-08~~ | ~~Tarjetas «por confirmar» que nunca se confirman~~ **Retirada (D-031, 22 oct 2026):** el estado «por confirmar» ya no existe | — | D-031 |
| MET-09 | Clientes con ≥2 negocios: identidades con `cliente_registrado` en ≥2 `negocio_id` distintos. Se calcula con eventos y solo en agregado con el rol de servicio, porque es un cruce de negocios por identidad (RNF-PRI-06; el aviso debe cubrirlo, PQ-18) | Solo se mide. Si es ≥20 %, refuerza la decisión de una sola app | ADR-001 §10 |
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

**App del cliente (una sola PWA LealTab):** C0 Mis tarjetas · C1 Registro · C2 Instalar · C3 Mi tarjeta · C4 Recompensa · C5 Mis datos (ver y borrar la cuenta; `/c/cuenta`, desde «Mis datos ›» en C0).

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

> **C5 «Mis datos»** está en el alcance (D-010; 01-mapa §3) y su diseño quedó aprobado el 21 oct 2026 (D-026): wireframe en `docs/fase-7/propuestas/diseno/c5-mis-datos.html`. Igual pasa con N1 con contraseña (`n1-cuenta-contrasena.html`). **Pendiente (fuera de la ronda del 21 oct):** pasar los dos a `brand/06-product-design/` y diseñar el selector de zona horaria en N8. C1, R1, la recuperación y los pasos de iOS con código quedaron diseñados el 22 oct 2026 en `brand/06-product-design/08-registro-con-codigo.md` (D-031). El estado «tarjeta por confirmar» de C0 ya no se diseña: desapareció con D-031.

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
| RF-ALT-02 | N1 Cuenta pide nombre, correo y WhatsApp del negocio. El dueño entra con **correo + código de 6 dígitos** (vigencia de **10 minutos**) **o con contraseña**, con las pestañas «Con código» y «Con contraseña». La contraseña es opcional: se puede crear en N1 (sección plegada «Crear también una contraseña») o después en N8 → Tus datos → Acceso; sin ella, el dueño sigue entrando solo con código | D-005 (aclarado 2026-10-21); 01-mapa §3 |
| RF-ALT-02b | **Restablecer la contraseña por correo:** desde N1, «¿Olvidaste tu contraseña?» envía al correo del dueño un **código de 6 dígitos con vigencia de 10 minutos**. Con el código, el dueño crea una contraseña nueva de **8 a 72 caracteres, sin reglas de composición**, y queda con la sesión iniciada. Las demás sesiones no se cierran, salvo que marque «Cerrar sesión en mis otros dispositivos» (viene desmarcada). Se puede pedir otro código cada 60 s. El mensaje es el mismo exista o no el correo. El mismo flujo sirve para crear la primera contraseña. Los correos salen por SMTP propio con Resend (RNF-STK-04). Diseño: `docs/fase-7/propuestas/diseno/n1-cuenta-contrasena.html` (PQ-10, cerrada) | D-005 (aclarado 2026-10-21); D-024 |
| RF-ALT-02c | **Intentos fallidos:** tras 5 contraseñas incorrectas seguidas para el mismo correo, el acceso con contraseña se pausa 15 minutos; el acceso con código y las sesiones abiertas (incluido el mostrador) no se ven afectados. Los errores no revelan si el correo tiene cuenta | D-005 (aclarado 2026-10-21) |
| RF-ALT-03 | Si el código vence (L1), se envía uno nuevo al correo y se ofrece «Ayuda por WhatsApp» | Pieza 06, L1 |
| RF-ALT-04 | N1 muestra lo que incluye la prueba: 30 días gratis, precios públicos desde $299 MXN/mes + IVA, sin contratos, exportación CSV, pausa que conserva la exportación y soporte por WhatsApp. Al continuar, el dueño acepta los términos y el aviso de privacidad | Pieza 04; D-006 |
| RF-ALT-05 | N2 Tu negocio pide nombre, giro (barbería, estética o salón, tapioca, cafetería u otro), ciudad y logo opcional. Si no hay logo, se usan las iniciales | Pieza 04 |
| RF-ALT-06 | Se guarda la zona horaria del negocio como **nombre IANA** (la usan el límite de sellos, el reinicio a medianoche y la semana). En N2 se toma del navegador del dueño, se valida contra las zonas de México y, si no es una de ellas, se usa `America/Mexico_City`. N2 no agrega un campo. Se muestra y se puede cambiar en N8 → Negocio. Cambiarla no recalcula el pasado | D-014 (aclarado 2026-10-21); 07-entrega §3 |
| RF-ALT-07 | N3 Tu tarjeta configura los sellos (de 4 a 12, con − / +), la recompensa y el interruptor del sello de bienvenida, con vista previa en vivo. Con el interruptor prendido, la vista previa muestra 1/N y «Tu sello de bienvenida ya está aquí» | Pieza 04 |
| RF-ALT-08 | N3 **no lleva color de acento** en el MVP, como en la pieza 04 aprobada (`01-mapa` y `docs/02-plan` se alinearon el 2026-10-21) | Pieza 04 |
| RF-ALT-09 | N4 genera el cartel con el QR del mostrador, que **solo sirve para registrarse**, en tamaño carta, media carta y sticker, y se descarga en PDF o PNG. Recuerda que los sellos se suman escaneando la tarjeta desde Mostrador y muestra la fecha de fin de la prueba | Pieza 04; D-010 |
| RF-ALT-10 | El cartel lleva «Hecho con LealTab» siempre | D-016 |
| RF-ALT-11 | Al terminar N4 arrancan los 30 días de prueba. Se registran la fecha de alta, la tanda y la versión del producto de cada negocio en `negocio` (`alta_ts`, `tanda`, `version_producto`): las escribe el servidor y el dueño no las edita | 01-mapa F1; D-004 (aclarado 2026-10-21) |
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
| RF-TAR-06 | **Cambiar el número de sellos nunca quita avance.** Cada tarjeta guarda la meta de su ciclo (`meta_ciclo`). **Bajar** la meta aplica de inmediato a todas las tarjetas en curso (las que ya tienen ese número de sellos o más quedan con «Recompensa lista»). **Subirla** aplica a las tarjetas nuevas y a cada tarjeta después de su canje. Las tarjetas ya completas no cambian hasta su canje. Si al bajar la meta quedan sellos de sobra, el canje reinicia a 0 y **el excedente se pierde**. Antes de guardar, si hay tarjetas con avance, la pantalla muestra una vista previa del efecto. El aro y su `aria-label` usan `meta_ciclo` | D-027 |
| RF-TAR-07 | **Los sellos y la recompensa no caducan** en el MVP | D-029 |

### 5.3 Sellos, canjes y QR (N5 Mostrador) · flujos F3 y F4

| ID | Requisito | Fuente |
|---|---|---|
| RF-SEL-01 | La visita se registra cuando el staff **escanea el QR personal del cliente** en N5 Mostrador, dentro del panel. El QR del mostrador no suma sellos | D-010; 01-mapa §5 |
| RF-SEL-02 | Respaldo: si la cámara falla, el staff busca al cliente por WhatsApp o por nombre | D-010; pieza 03 |
| RF-SEL-03 | N5 tiene 4 estados: N5·1 Escanear, N5·2 Confirmar sello (ficha, sellos con el nuevo marcado, «Confirmar +1 sello» y «Su tarjeta ya se actualizó»), N5·3 Canjear y N5·4 Límite alcanzado | Pieza 03 |
| RF-SEL-04 | **QR rotativo:** `card_id + paso + HMAC-SHA256(llave_tarjeta, card_id\|business_id\|paso)`, con pasos de 60 s calculados en el teléfono del cliente (funciona aunque el cliente no tenga internet). En línea se aceptan ±2 pasos. Sin conexión, la gracia es de 10 min. Una captura de más de 10 min se rechaza | D-014; pieza 06 §2 |
| RF-SEL-05 | **Límite por defecto: 1 sello por cliente por día**, que se reinicia a medianoche en la zona horaria del negocio | D-014 |
| RF-SEL-06 | El negocio puede cambiar el límite en N8 Ajustes a «1 cada X horas» o «Sin límite» (con advertencia). En «1 cada X horas», **cada negocio elige X libremente**: la interfaz sugiere 2 h, pero no hay mínimo obligatorio. X se captura en **horas, con hasta 2 decimales, mayor que 0 y hasta 24**, y se guarda en minutos enteros (`limite_minutos`). La ventana es **móvil**: se mide desde el último sello aceptado, no desde la medianoche. El límite efectivo nunca baja del bloqueo fijo de 2 min (RF-SEL-07). No existe «1 por semana» | D-014 (aclarado 2026-10-21); pieza 05 |
| RF-SEL-07 | **Bloqueo fijo de 2 minutos contra el doble escaneo, siempre activo** (también con «Sin límite»): muestra «Ya registrado» y no suma otro sello (M4a). Se aplica igual en línea y sin conexión | D-014 (actualizado 2026-10-21) |
| RF-SEL-08 | Con el límite alcanzado (M4b), N5 muestra «Ya recibió su sello hoy. El siguiente, desde mañana.» o «Próximo sello disponible a las HH:MM», junto con el último sello y quién lo registró. Indica que el límite se cambia en Ajustes | Pieza 03; pieza 06 |
| RF-SEL-09 | Cada sello y canje registra quién y cuándo. Con la cuenta compartida, «quién» es el dispositivo del mostrador (por ejemplo, «Mostrador (iPhone caja)»). Se ve en el historial de N7 | D-014; pieza 03 |
| RF-SEL-10 | **Canje:** con la tarjeta completa, N5 muestra «Confirmar canje» (la tarjeta vuelve a 0/N) o «Ahora no, solo sumar visita». El canje queda en el historial | 01-mapa F4; pieza 03 |
| RF-SEL-11 | Estados de error: M1 sin permiso de cámara (cómo permitirla y «Buscar por WhatsApp»), M2 cliente no encontrado (revisar el número o mostrar el QR del mostrador para que se registre) y M3 QR no válido o de otro negocio (dice de qué negocio es y pide abrir la tarjeta correcta en Mis tarjetas) | Pieza 06 |
| RF-SEL-12 | Indicador de sincronización en cada estado de N5: «En línea · sincronizado», «Sin conexión · N pendientes» o «Sincronizando» | Pieza 03 |
| RF-SEL-13 | **Sin conexión (M5):** el mostrador sigue registrando sellos y canjes en una cola local y aplica localmente el límite y el bloqueo. Las tarjetas que aún no están en caché reciben un sello **provisional** que se valida al sincronizar. **N5 debe abrirse con conexión**; si la red se cae con N5 abierto, sigue registrando (ver RNF-OFF-04) | D-015 (aclarado 2026-10-21); pieza 06 §1-3 |
| RF-SEL-14 | **Canje sin conexión:** solo si la tarjeta está completa en una caché sincronizada en las últimas 24 h, y como máximo 1 canje por tarjeta mientras dure el modo sin conexión. Un doble canje va a Por revisar | D-015 |
| RF-SEL-15 | Resultado de la sincronización (M6): «N sincronizados, M por revisar» con el motivo y un enlace a Clientes → Por revisar. Un sello pendiente de una tarjeta ya borrada por el cliente (C5) se descarta como «tarjeta dada de baja»: se cuenta en el resultado pero no va a Por revisar ni deja datos personales a la vista del negocio `[SUPUESTO: el arquitecto lo confirma]` | Pieza 06; D-026 |
| RF-SEL-16 | «Ayuda por WhatsApp» fijo al pie de cada estado de N5 | Pieza 03 |
| RF-SEL-17 | Los resultados de escaneo y de sincronización se anuncian con `aria-live="polite"` | 07-entrega §7 |

### 5.4 App del cliente y «Mis tarjetas» (C0 a C5) · flujo F2

| ID | Requisito | Fuente |
|---|---|---|
| RF-APP-01 | **Una sola PWA LealTab.** El cliente tiene las tarjetas de varios negocios en la misma app. Su cuenta es un usuario de Supabase Auth identificado por su WhatsApp verificado con un código (D-031) | D-013; D-031 |
| RF-APP-02 | **C1 Registro, en dos pasos** (diseño en `brand/06-product-design/08-registro-con-codigo.md`): paso 1 con nombre, WhatsApp, aviso y casilla, y el botón **«Enviarme el código»**; paso 2 con **un código de 6 dígitos** enviado por WhatsApp (principal) o SMS (respaldo), salvo que ya haya sesión en el navegador (RF-APP-04). El aviso de privacidad corto va visible antes del botón, con casilla de aceptación y enlace al aviso completo. El nombre y el consentimiento se quedan en el formulario del navegador; al verificar el código, el servidor crea en una sola transacción la `identidad` (o reutiliza la que ya existe), el `cliente_negocio`, la tarjeta y el sello de bienvenida si aplica, y escribe la cookie de sesión de Supabase. El navegador nunca llama a Supabase Auth: todo pasa por rutas del servidor (`/c/api/auth/*`, ADR-003 §2.2 y §2.4). Si el estado del formulario se pierde (por ejemplo, al recargar), la pieza 08 lo conserva en `sessionStorage` durante el flujo; confirmarlo: **Por definir** (arquitecto, CA-C1.14). Si el cliente no recibe su código, pregunta en el mostrador: lo atiende el negocio, y LealTab no da soporte a clientes finales | Pieza 02; 01-mapa §2; D-031 |
| RF-APP-03 | El WhatsApp se valida a 10 dígitos, con un ejemplo en el error en línea (R2) | Pieza 06, R2 |
| RF-APP-04 | **Registro y recuperación son el mismo flujo** (D-031). **Con sesión de Supabase válida en ese navegador**, el segundo negocio **no pide código**: pide el nombre para ese negocio (D-019) y el consentimiento, y la tarjeta queda `activa` con un toque. En ese caso el nombre aparece **prellenado con el último que el cliente dio**, editable, y nunca sobrescribe el que dio en otro negocio (D-019 aclarado). **Sin sesión**, pide WhatsApp y código; si el teléfono ya tenía tarjetas, al verificarlo recupera todas. R1 (WhatsApp ya registrado) deja de ser un camino sin código: el código siempre es la prueba de que el teléfono es del cliente. La respuesta al pedir el código y al verificarlo es la misma para un teléfono nuevo y para uno que ya usa LealTab, y el negocio nunca ve la `identidad` (RF-CLI-08; prueba de enumeración del ADR-003 §3). **Cambio de teléfono:** se entra con el número viejo para recuperar; si ya no se tiene, empieza una cuenta nueva sin recuperar nada. Al verificar, se cierran las demás sesiones de ese usuario (`signOut` con `scope: 'others'`). *(Sustituye los textos del v1.4 y del v1.5, de D-025.)* | D-031; D-019; ADR-003 §2.2; diseño en la pieza 08 (R1) |
| ~~RF-APP-05~~ | ~~Tarjeta «por confirmar» para un segundo negocio sin sesión.~~ **Retirado (D-031, 22 oct 2026):** el estado «por confirmar» desaparece de `cliente_negocio`, de C0 y de N5 (el cajero ya no confirma identidades). Nadie mete una tarjeta en el perfil de otra persona porque toda alta exige el código del teléfono. Se conserva el ID para no romper referencias | D-031; ADR-001 §5.2 punto 6 (sustituido) |
| RF-APP-06 | **C2 Instalar:** guía de 3 pasos con pestañas para iPhone y Android. «Ahora no» no bloquea nada. En iOS, la guía va por «Compartir → Agregar a inicio». En Android/Chrome, se usa el aviso de instalación | Pieza 02; 02-plan §3 |
| RF-APP-07 | El copy de la guía habla de tarjetas, no de una app: por ejemplo, «Guarda tus tarjetas en tu inicio» `[SUPUESTO, medir en el piloto]` | ADR-001 §5.2 punto 7 |
| RF-APP-08 | R3: en un navegador sin instalación PWA (WhatsApp, Instagram), se ofrece abrir en Safari o Chrome, copiar el enlace o seguir sin instalar. La tarjeta funciona igual | Pieza 06; D-001 |
| RF-APP-09 | **C3 Mi tarjeta:** aro de progreso, QR personal grande (rotativo) y última visita, y la línea del límite de sellos (RF-APP-10). Recién registrada con el sello de bienvenida, muestra 1/N y «Tu sello de bienvenida ya está aquí» | Pieza 02 |
| RF-APP-10 | C3 muestra bajo el QR **una línea con el límite de sellos** del negocio («1 sello por día» o «1 sello cada X horas»; sin línea con «Sin límite») y un enlace «Términos de la tarjeta» (44 px o más) que abre una **hoja dentro de C3**, con la voz del negocio, «Hecho con LealTab» y que los sellos y la recompensa no caducan (RF-TAR-07). La línea y la hoja funcionan sin conexión (R4). C1 no cambia. N8 dice bajo el límite «Tus clientes lo ven en su tarjeta». Formato de X fraccionario en la línea: **Por definir** (copy) | Pieza 02; 07-entrega §8; D-014 (aclarado 2026-10-21); D-029 |
| RF-APP-11 | **C4 Recompensa:** aro completo en durazno, mensaje de logro (por ejemplo, «¡Tu corte gratis está listo!»), QR para canjear y el estado después del canje (vuelve a 0/N) | Pieza 02 |
| RF-APP-12 | **C0 Mis tarjetas:** lista de tarjetas por negocio con mini aro y la etiqueta «Recompensa lista» cuando se completa. Tocar una abre C3. El estado vacío explica que se agrega una tarjeta escaneando el QR del mostrador | Pieza 05 B |
| RF-APP-13 | «Mis tarjetas» es mínima: sin descubrimiento de negocios, sin recomendaciones y sin datos de un negocio visibles para otro | ADR-001 §5.2 punto 9 |
| RF-APP-14 | **C5 Mis datos** (`/c/cuenta`, desde «Mis datos ›» en C0, que sustituye el nombre global del encabezado). El cliente ve su WhatsApp (con su estado de verificación) y, por cada negocio, el nombre que dio, la fecha de alta y de aceptación del aviso, su avance y su última visita. Puede **borrar su cuenta de LealTab completa**: pide una casilla de confirmación, no pide código y el efecto es inmediato (se cierran sus sesiones, **se borra también su usuario de Supabase Auth** (una función del servidor borra la `identidad` y sus `cliente_negocio` y tarjetas, luego `auth.admin.deleteUser` con la llave de servicio; si ese segundo paso falla, queda en una tabla de pendientes y un reintento lo cierra, ADR-003 §2.7), se borra la cookie de sesión, se limpia el almacenamiento local, deja de aparecer en Mis tarjetas, N0, N6, N7 y en el CSV de sus negocios, y no recibe más sellos). No se puede borrar sin conexión. El mismo teléfono puede registrarse de nuevo como cuenta nueva, sin recuperar nada. El plazo de eliminación definitiva y lo que se conserva por ley: **Por definir (PQ-04)**. Texto de la línea «Uso de la app»: **Por definir (PQ-18)**. Diseño: `docs/fase-7/propuestas/diseno/c5-mis-datos.html` | D-026; D-019; 01-mapa §3 |
| RF-APP-15 | **Código de verificación del cliente, para registrarse y para recuperar la tarjeta** (D-031; es el mismo flujo de RF-APP-04). Cuando el cliente se registra sin sesión, o cambia de teléfono o borra sus datos, escribe su WhatsApp (en C1 o en `/c/recuperar`) y recibe un código de **6 dígitos que dura 10 minutos**, por **WhatsApp** (canal principal) o por **SMS** (respaldo: automático si el envío falla y a petición del cliente), enviado con el hook de SMS de Supabase Auth y SMS Masivos (RNF-STK-06). Admite 5 intentos fallidos por código (el quinto lo invalida), se puede pedir otro tras 60 s y tras 5 fallos el teléfono se bloquea 15 min. **Límites (aprobados por Aarón el 22 oct 2026, ADR-003 §2.8):** por teléfono, 3 envíos por hora y 10 al día (se imponen en el hook de SMS, que es el paso obligado); por IP, 10 por hora (en nuestro servidor); tope global de 400 envíos al día, con aviso por correo a Aarón a los 200 (en el hook); y el límite de SMS por hora de Supabase sube de 30 a 100. Los 5 intentos y el límite por IP **solo se imponen en nuestro servidor**: no cubren a quien llame a Supabase directo con la llave pública. Es un riesgo aceptado por Aarón, que pasa a `security-review`. Vigencia de 10 min: **Por definir** hasta confirmar en el panel de Supabase que es alcanzable (ADR-003 §3, prueba 3). La respuesta no revela si el número tiene tarjetas. Solo números de México de 10 dígitos. Con una sola app, recupera todas sus tarjetas de una vez. Con sesión en el navegador no se pide código (RF-APP-04). Si el envío falla en WhatsApp, el hook reintenta por SMS en la misma llamada; si falla en los dos canales, la pantalla lo dice y se avisa a Aarón, y no se pueden registrar clientes nuevos ni entrar sin sesión (R-18). Al verificar el código se crea la sesión de Supabase Auth del cliente (RNF-STK-04). Costo del WhatsApp y confirmación de que usa la API oficial de Meta: **Por definir (PQ-30)** | D-011 (aclarado 2026-10-21); D-024; D-031; [D-023](../decisiones.md); ADR-001 §6; 02-plan §3; diseño en la pieza 08 (recuperación `/c/recuperar` e iOS) |
| RF-APP-16 | **R4, sin internet:** muestra la tarjeta guardada, el QR generado localmente, la hora de actualización y «Puede haber sellos pendientes». La tarjeta nunca suma sellos por su cuenta | Pieza 06 §5 |
| RF-APP-17 | La tarjeta se actualiza sola cuando el staff confirma un sello en línea | 01-mapa F3 |
| RF-APP-18 | Los mensajes de la tarjeta hablan con la voz del negocio, de tú por defecto | identidad-de-marca §4 |

### 5.5 Clientes (N7)

| ID | Requisito | Fuente |
|---|---|---|
| RF-CLI-01 | Lista de clientes con estado (Frecuente, En riesgo, Nuevo y **Al día**, chip neutro con el estilo de «Nuevo» para quien no es ninguno de los otros) y búsqueda. Cada cliente lleva **un solo chip**, con la precedencia de RF-QR-01 (En riesgo > Frecuente > Nuevo > Al día) | Pieza 05; D-028; aclaración del 22 oct 2026 |
| RF-CLI-02 | Ficha del cliente: sellos, ritmo habitual, «Escribir por WhatsApp», corregir sellos e historial de visitas con la hora y quién registró cada sello | Pieza 05 |
| RF-CLI-03 | «Escribir por WhatsApp» abre un enlace `wa.me` al número del cliente con texto prellenado, sin la API. N7 elige sola entre **tres plantillas fijas**, en este orden: **recompensa lista** (sellos ≥ meta), **En riesgo** (RF-QR-01) y **saludo** (los demás). No son editables en el MVP; el dueño puede editar el texto en WhatsApp antes de enviarlo. Hablan con la voz del negocio, sin presión ni promesas, sin enlaces y solo con el nombre del cliente en ese negocio, el nombre del negocio, la recompensa y los sellos. Textos y reglas: `docs/fase-7/propuestas/pq-copy.md`. Si hace falta una línea de baja: **Por definir (PQ-04)**. En el MVP la API de WhatsApp Business solo se usa para el código de recuperación del cliente (RF-APP-15) | D-030; 07-entrega §8; D-011 |
| RF-CLI-04 | **Corregir sellos** desde la ficha de N7: solo el total de la tarjeta en curso, de 0 a su meta y **hasta ±3 por corrección**; motivo obligatorio (lista y, con «Otro», una nota); solo en línea y con la cuenta activa. Se guarda como un evento `correccion` inmutable (diferencia, antes, después, motivo, nota, dispositivo, horas), visible en el historial de la ficha con el chip «Corregido». **Una corrección sí puede completar la tarjeta.** No cuenta como visita, no consume el límite de sellos y no toca los canjes. Con la cuenta compartida no hay permisos por persona. El evento `sellos_corregidos` está pendiente del analista (ver RF-EVT-06) | D-027; pieza 05 |
| RF-CLI-05 | Vista **Por revisar:** los movimientos sin conexión que el servidor rechazó, con su motivo (límite, QR vencido, duplicado, doble canje o firma). El dueño elige «Aprobar de todos modos» o «Descartar», y la decisión queda en la bitácora | D-015; pieza 06 §4 |
| RF-CLI-06 | **Exportar CSV** siempre disponible, también con la cuenta en pausa. Son **dos archivos**: `clientes.csv` (nombre, WhatsApp, visitas, sellos, última visita) y `visitas.csv` (cliente, WhatsApp, fecha y hora en la zona del negocio, tipo, dispositivo y estado). Las celdas que empiezan con `=`, `+`, `-` o `@` se neutralizan. La ruta de exportación no depende de `negocio.estado` | 01-mapa F6; pieza 05; PQ-22 (c) |
| RF-CLI-07 | V2, Clientes vacío: «Exportar CSV» deshabilitado y opción para descargar el QR | Pieza 06 |
| RF-CLI-08 | Un negocio **nunca** ve si su cliente está inscrito en otro negocio | ADR-001 §6 |

### 5.6 Resumen del dueño (N0 Inicio) y Quién regresa (N6)

| ID | Requisito | Fuente |
|---|---|---|
| RF-INI-01 | **N0 Inicio es la primera pantalla** que ve el dueño al entrar al panel web | D-011 |
| RF-INI-02 | Muestra las visitas de la semana frente a la anterior, los clientes que regresaron, los que están en riesgo, las recompensas canjeadas y **una** acción sugerida. En escritorio suma «visitas por semana» y «Esta semana» | Pieza 05; 01-mapa F5a |
| RF-INI-03 | La acción sugerida sigue una regla simple: si hay clientes en riesgo, escribirles («N clientes no han vuelto: escríbeles hoy»); si no, las tarjetas a 1 sello del premio | Pieza 05 |
| RF-INI-04 | El resumen **solo vive en el panel**; no se envía por WhatsApp ni por correo | D-011 |
| RF-INI-05 | Al mostrarse N0 se registra el evento `resumen_semanal_visto` (negocio, semana). El campo `semana` es la semana ISO (lunes a domingo, zona del negocio) de la fecha de apertura, formato `AAAA-Www`; abrirlo varias veces en la misma semana cuenta una vez por negocio y semana al medir MET-10 | D-011; D-028 |
| RF-INI-06 | **Semana** = los **7 días completos que terminan ayer**, en la zona horaria del negocio (de 00:00 a 23:59:59). La semana anterior son los 7 días previos. Las cifras no cambian durante el día. Con menos de 8 días de alta, la ventana empieza el día del alta, el encabezado dice «Tus primeros N días» y no hay comparación. Los sellos de bienvenida no son visitas y van aparte (RF-QR-05). Copy de N0 «31 de 48 visitas» (mezcla clientes con visitas): **Por definir** (copy y arquitectura) | D-028 |
| RF-INI-07 | V1, primera semana sin datos: invita a registrar una visita o descargar el QR | Pieza 06 |
| RF-QR-01 | **N6 Quién regresa**, con estas definiciones: **Frecuente** = 2 o más visitas en los últimos 30 días. **En riesgo** = sin volver en más del doble de su intervalo habitual, con mínimo de 30 días. **Nuevo** = alta en los últimos 30 días (se mide desde el alta; el sello de bienvenida no es una visita). **Al día** = chip neutro, con el estilo de «Nuevo» y sin colores nuevos, para quien no es ninguno de los otros tres. **Un solo chip por cliente.** Si un cliente cumple más de una definición, N6 y N7 muestran un único chip, con esta precedencia: **En riesgo > Frecuente > Nuevo > Al día** (la alerta gana al elogio, porque al dueño le sirve más saber a quién recuperar). Así cada cliente aparece en una sola categoría en el conteo de N6 y en sus listas. Ejemplos: un cliente Nuevo que ya superó el doble de su intervalo habitual y los 30 días sin volver se muestra En riesgo; uno Frecuente que cumple En riesgo se muestra En riesgo. Decisión de Aarón del 22 oct 2026 (aclaración de D-028) | D-010; D-028; 01-mapa F5 |
| RF-QR-02 | Cifras clave (regresaron, recompensas canjeadas), filtros por grupo, búsqueda y tabla (cliente, WhatsApp, estado, visitas, sellos, última visita, Ver). Cada grupo abre su lista en N7 | Pieza 03 |
| RF-QR-03 | Los chips de estado van siempre con palabra (Frecuente menta/bosque, En riesgo durazno claro/tostado, Nuevo y Al día neutros) | Pieza 03; D-028 |
| RF-QR-04 | V3, sin datos: «Sin datos aún», porque se calcula con 2 a 3 semanas de visitas | Pieza 06 |
| RF-QR-05 | **Visita** = día (zona del negocio) con al menos un sello o canje aceptado de origen mostrador; varios sellos el mismo día cuentan como una visita. **El sello de bienvenida no es una visita** (en N0, N6 ni G1-a) y las correcciones de sellos tampoco. **Intervalo habitual** = mediana de los últimos 5 intervalos entre visitas (los que haya, si son menos). Con una sola visita no existe y el umbral de En riesgo es solo el mínimo de 30 días. **En riesgo** = más de `max(30, 2 × intervalo habitual)` días desde la última visita. La ficha muestra «Aún no tenemos su ritmo (solo 1 visita)», «cada N semanas» (desde 14 días) o «cada N días». El umbral se revisa con datos del piloto (Fase 9) | D-028; D-010 |

### 5.7 Ajustes (N8)

| ID | Requisito | Fuente |
|---|---|---|
| RF-AJU-01 | Sección **Negocio**: los datos capturados en N2, incluida la zona horaria (RF-ALT-06), que se puede editar | Pieza 05; D-014 |
| RF-AJU-02 | Sección **Tarjeta**: interruptor del sello de bienvenida, límite de sellos (1 por día por defecto · 1 cada X horas, con X libre, hasta 2 decimales y hasta 24, y 2 h sugeridas · Sin límite con advertencia) con la nota «Tus clientes lo ven en su tarjeta», reinicio a medianoche del negocio, bloqueo contra el doble escaneo (ver RF-SEL-07) y QR | Pieza 05; D-014 |
| RF-AJU-03 | Sección **Tus datos**: exportar `clientes.csv` y `visitas.csv` (RF-CLI-06), el aviso de privacidad y una fila **Acceso** para crear o cambiar la contraseña (con código al correo del dueño, sin pedir la contraseña actual) | Pieza 05; D-005 (aclarado 2026-10-21) |
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
| RF-EVT-01 | **Producto** (nombres únicos para todo el proyecto; catálogo con atributos, emisor y privacidad en `docs/fase-7/medicion.md` §4): `resumen_semanal_visto` (negocio, `semana`) · `negocio_alta_completada` (oficio, fecha, **tanda**, versión del producto, `duracion_s`) · `tarjeta_configurada` · `qr_mostrador_descargado` · `cliente_registrado` (bienvenida sí/no, `identidad_nueva` sí/no, `con_codigo` sí/no, SO) · `sello_registrado` (en línea/sin conexión, origen, `duracion_ms`) · `sello_bloqueado` (motivo: límite/doble_escaneo) · `canje_registrado` (en línea/sin conexión) · `sync_completada` (aceptados, rechazados, descartados) · `por_revisar_resuelto` (resolución, motivo) · `accion_sugerida_click` (tipo) · `export_csv` (`archivo`: clientes/visitas) · `whatsapp_ayuda_click` · `activar_plan_click` | 07-entrega §5; `medicion.md` §10 |
| RF-EVT-02 | **Instalación y sesión (ADR-001 §10):** `pwa_instalada` (SO, `display-mode: standalone`) · `guia_instalacion_mostrada` (SO) · `install_token_canjeado` · `recuperacion_completada` (`proposito`: registro/recuperación; verificar el código por un teléfono que ya tenía tarjetas, sin sesión en ese navegador) · `app_abierta` (identidad, `display-mode`). **Código de verificación (D-031):** `registro_iniciado` (C1 mostrada, `con_sesion`) · `codigo_pedido` · `codigo_enviado` (canal: whatsapp/sms; razón del canal) · `codigo_reenviado` · `codigo_canal_cambiado` · `codigo_verificado` · `codigo_fallido` (motivo: incorrecto/vencido/bloqueado/límite/proveedor). El abandono en el código no es un evento: se calcula de un `codigo_pedido` sin `codigo_verificado` tras 10 min. Los eventos de código **no llevan identidad ni teléfono** hasta verificar, y se unen por un `flujo_id` aleatorio. **Retirados por D-031:** `tarjeta_por_confirmar_creada` y `tarjeta_confirmada` | 07-entrega §5; ADR-001 §10; D-031; ADR-003; ADR-004 |
| RF-EVT-03 | Ya no se usan los nombres anteriores del plan: `negocio_alta` → `negocio_alta_completada`, `sello_otorgado` → `sello_registrado`, `canje_confirmado` → `canje_registrado`. Tampoco se usan `tarjeta_por_confirmar_creada` ni `tarjeta_confirmada` (D-031) | 02-plan §4 (unificado 2026-10-21); D-031 |
| RF-EVT-04 | Fuera de la app se registran los clientes que visitaron por día (tickets o conteo), los pagos (RF-COB-06), las horas del fundador y el gasto en códigos, con las plantillas de `docs/fase-7/medicion.md` §9 | 02-plan §4 |
| RF-EVT-06 | **Operación y cuenta:** `mostrador_reabierto_tras_caida` (`duracion_s`, `pendientes`; D-015) · `sellos_corregidos` (`delta`, `motivo`, `completa_tarjeta`, `con_nota`; D-027) · `cuenta_cliente_borrada` (número de negocios; sin identidad, teléfono ni negocio; D-026) · `contrasena_restablecida` y `acceso_bloqueado` (sin correo ni IP; D-005 aclarado 2026-10-21). `export_csv` lleva el atributo `archivo` (clientes/visitas). Todos con nombre final. La lista cerrada de `motivo` de `sellos_corregidos` es **Por definir** (PQ-D) | D-015; D-026; D-027; D-005 |
| RF-EVT-05 | **Analítica propia, sin cookies** y sin herramientas de analítica de terceros: los eventos se guardan en una tabla propia en Supabase (`evento_uso`), sin PostHog (RNF-STK-05). Ningún evento guarda teléfono (ni en claro ni con hash), nombre, correo, IP, user agent, el código tecleado ni texto libre. Solo los eventos que lo indican llevan `identidad_id`, y el borrado de cuenta (D-026) lo deja en nulo en la misma transacción. Los eventos los emite el servidor: el navegador solo los pide por una ruta propia y no fija la identidad. Antes del piloto, el aviso de privacidad debe cubrir los eventos de uso (RNF-PRI-07) y su plazo de conservación (**Por definir**, PQ-B y PQ-18) | D-018; D-023; D-026 |

---

## 6. Flujos principales

| Flujo | Pasos | Fuente |
|---|---|---|
| **F1. Alta del negocio** (meta: < 5 min, sin ayuda) | 1) «Empieza gratis» en lealtab.com → N1 crea la cuenta; el dueño entra con código por correo o con contraseña. 2) N2 datos del negocio → N3 configura la tarjeta con vista previa en vivo. 3) N4 descarga el cartel QR del mostrador. Arranca el mes de prueba | 01-mapa §4 |
| **F2. El cliente se registra e instala** | 1) Escanea el QR del mostrador con la cámara → se abre la tarjeta web del negocio (`/c/{slug}/`). 2) C1: nombre y WhatsApp, lee el aviso corto y acepta; **sin sesión en el navegador, recibe un código por WhatsApp (o SMS) y lo escribe** → se crea su sesión de Supabase y su tarjeta. Si está prendido el sello de bienvenida, queda en 1/N. 3) Si ya tiene sesión en ese navegador (la app instalada), no se pide código: la tarjeta se agrega a C0 sin reinstalar. Si el teléfono ya tenía tarjetas, al verificar el código las recupera todas. C2 lo invita a instalar; si no instala, vuelve con su WhatsApp y un código (`/c/recuperar`) | 01-mapa §4; D-031 |
| **F3. Registrar una visita** | 1) El cliente muestra su QR (C3). 2) El staff abre N5 y escanea → ve el nombre y los sellos → confirma «+1 sello» (o ve M4a/M4b). 3) Los dos ven la confirmación y la tarjeta se actualiza. Respaldo: búsqueda por WhatsApp | 01-mapa §4 |
| **F4. Recompensa y canje** | 1) Con el último sello, C4 muestra «Recompensa lista» (aro en durazno). 2) En la siguiente visita el staff escanea → N5 muestra «Canjear recompensa» → confirma. 3) La tarjeta se reinicia y el canje queda en el historial | 01-mapa §4 |
| **F5a. Resumen semanal** | El dueño entra → N0 con el resumen de la semana y la acción sugerida → se registra `resumen_semanal_visto` | 01-mapa §4 |
| **F5. Quién regresa** | N6 con frecuentes, en riesgo y nuevos → cada grupo abre su lista en N7 → ficha → «Escribir por WhatsApp» | 01-mapa §4; pieza 05 |
| **F6. Exportar datos** | N7 → «Exportar CSV». También con la cuenta en pausa | 01-mapa §4 |
| **F7. Sin conexión y sincronización** | El mostrador (que se abrió con conexión) pierde la red (M5) y guarda sellos y canjes en la cola de IndexedDB → al reconectar, N5 envía la cola (al abrir, con `visibilitychange`, con `online`, cada 30 s o con el botón «Sincronizar») → el servidor revalida → M6 muestra el resultado → los rechazos van a Por revisar → el dueño aprueba o descarta | D-015; pieza 06 |
| **F8. Fin de la prueba y pago** | Los 30 días gratis terminan → P1 (pausa, exportación disponible) → «Activar mi plan» abre WhatsApp → Aarón envía el link de Stripe o Mercado Pago → pago → cuenta activa (paso manual: Por definir) | D-012; pieza 06 |
| **F9. Segundo negocio** | El cliente escanea el QR de otro negocio. En iOS se abre Safari: si hay sesión de Supabase, el alta es de un toque (nombre para ese negocio y consentimiento, sin código); si no, escribe su WhatsApp y el código, y recupera todas sus tarjetas. En Android se abre la app o Chrome con sesión. En ningún caso hay que reinstalar | ADR-001 §5.2 punto 6; D-031 |
| **F10. Cambio de teléfono** | El cliente abre `/c/recuperar` en el teléfono nuevo → escribe su WhatsApp → recibe un código por WhatsApp (o por SMS de respaldo) → lo escribe → se crea su sesión de Supabase y recupera todas sus tarjetas en Mis tarjetas → `recuperacion_completada`. Es el mismo flujo que el registro sin sesión (F2) | D-011 (aclarado 2026-10-21); D-024; D-031; ADR-001 §6 |

Diagrama: `06-product-design/mapa-flujos-mvp.png`. Pantallas: `06-product-design/entrega/mapa-pantallas.png`.

---

## 7. Requisitos no funcionales

### 7.1 PWA e instalación

| ID | Requisito | Fuente |
|---|---|---|
| RNF-PWA-01 | La tarjeta funciona **sin instalarse**, en el navegador de cualquier celular. Instalar es opcional | D-001 |
| RNF-PWA-02 | Manifest único en `/c/manifest.webmanifest` con `id: "/c/"` (inmutable), `scope: "/c/"`, `start_url: "/c/?source=pwa"`, `name`/`short_name: "LealTab"`, `display: standalone`, íconos de 192, 512 y maskable, y un `apple-touch-icon` de 180 px de LealTab | ADR-001 §5.2 |
| RNF-PWA-03 | Rutas: `/c/` = Mis tarjetas; `/c/{slug}/` = tarjeta del negocio (lo que imprime el QR); `/c/{slug}/registro`, `/c/recuperar`, `/c/cuenta`, `/c/privacidad`; `/mis-tarjetas` redirige a `/c/`. Los slugs reservados y el `slug` de cada negocio son inmutables. El panel vive en `/panel/`, fuera de `/c/`. Todo en el dominio `lealtab.com`, sin `app.lealtab.com` | ADR-001 §5.2; D-022 |
| RNF-PWA-04 | Un solo service worker con scope `/c/`, que guarda en caché el último estado de cada tarjeta por `slug` y la lista de Mis tarjetas. **No hay un segundo service worker en `/panel/` en el piloto** (N5 usa solo la cola de IndexedDB; se reevalúa si `mostrador_reabierto_tras_caida` sale alta) | ADR-001 §5.2; D-015 (aclarado 2026-10-21) |
| RNF-PWA-05 | **Sesión en iOS:** la sesión es la de **Supabase Auth** (ya no hay cookie propia ni `Path=/c/`, D-031), más un `install_token` de 128 bits o más, de un solo uso, ligado a la identidad y con vigencia de 24 h, que **se canjea por una sesión de Supabase** en la app instalada; en la base solo se guarda su hash. El canje es un `POST` del servidor, el token se quita de la URL con `history.replaceState`, se marca usado al canjear aunque falle el segundo paso y, una vez canjeado, no abre sesión. **Mecanismo candidato (A):** el servidor emite una sesión distinta para la PWA con `generateLink` y `verifyOtp` con `token_hash`, de modo que cada dispositivo tiene su propia sesión (nunca se comparte el refresh token de Safari, porque su rotación terminaría la sesión). **Respaldo (B):** la PWA pide un código nuevo al abrirse la primera vez, con un mensaje más por cada iPhone que instala. Cuál de los dos se usa: **Por definir (PQ-31)**, a probar en iOS 18 y 26; hasta la prueba no se afirma que A funcione. Cookies de sesión escritas por el servidor, `HttpOnly`, `Secure`, `SameSite=Lax` y hasta 400 días, con nombre y ruta propios (`lt-cliente` en `/c` para el cliente; `lt-dueno` en `/panel` para el dueño); que Safari no las acorte: **Por definir** (prueba de iOS de RNF-PWA-07). En el piloto no hay verificación por el cajero (D-024) | ADR-001 §7; D-031; `docs/adr/003-sesion-cliente-y-codigo.md` §2.3 y §2.4 |
| RNF-PWA-06 | Cada tarjeta cambia `theme-color` al color del negocio `[SUPUESTO: confirmar en modo standalone]` | ADR-001 §5.2 |
| RNF-PWA-07 | Pruebas técnicas antes de abrir a los pilotos, en un iPhone con iOS 18 y 26 y un Android con Chrome estable: instalación, `install_token`, QR de un segundo negocio, `theme-color`, «Agregar a inicio» desde WhatsApp e Instagram, iOS 26 con «Abrir como app web» desactivado, y que `/panel/` no se abra dentro de `/c/` | ADR-001 §10 |
| RNF-PWA-08 | Las notificaciones push no son requisito del MVP (en iOS solo llegan con la PWA instalada) | 02-plan §3; D-001 |

### 7.2 Sin conexión primero y antifraude

| ID | Requisito | Fuente |
|---|---|---|
| RNF-OFF-01 | **El servidor es la fuente de verdad.** El conteo de cada tarjeta siempre se recalcula en el servidor | D-015; pieza 06 §6 |
| RNF-OFF-02 | Cola local en IndexedDB en el mostrador. Cada evento lleva `event_id` (UUID v4, llave de idempotencia), `tipo`, `card_id`, `qr_step`, `device_ts`, `device_id` y una `firma` ECDSA P-256 hecha con una llave del dispositivo creada con WebCrypto (no exportable) y registrada en el servidor al iniciar sesión. Reenviar un evento nunca duplica | Pieza 06 §1 |
| RNF-OFF-03 | El mostrador guarda las llaves HMAC de las tarjetas de su negocio **cifradas en IndexedDB** (no en el caché de un service worker) y las refresca en cada sincronización | Pieza 06 §2; D-015 (aclarado 2026-10-21) |
| RNF-OFF-04 | La cola de IndexedDB se envía **al abrir N5, al volver a primer plano (`visibilitychange`), con el evento `online`, cada 30 s mientras N5 esté abierto y con un botón «Sincronizar»**. Cada reintento usa espera exponencial y el mismo `event_id`. Background Sync **no es requisito**: no existe en Safari de iOS ([caniuse](https://caniuse.com/background-sync), consultado el 21 oct 2026) y el service worker de `/c/` no cubre `/panel/`. **N5 debe abrirse con conexión.** Al perder la red, N5 guarda `offline_since` en IndexedDB; si al cargar sigue ahí, emite un evento de reapertura tras caída (RF-EVT-06). El servidor revalida la firma, la ventana del QR, el límite (con `device_ts` acotado a la hora de recepción menos 72 h) y los duplicados entre dispositivos | Pieza 06 §4; D-015 (aclarado 2026-10-21) |
| RNF-OFF-05 | Reglas de conflicto: gana el servidor. Se ordena por `device_ts` validado; en un empate gana el primero recibido. Si dos dispositivos dan sello al mismo cliente el mismo día, se acepta el primero y el otro va a Por revisar | Pieza 06 §6 |
| RNF-OFF-06 | Los eventos rechazados no se borran; van a Por revisar | D-015 |

### 7.3 Privacidad y LFPDPPP

| ID | Requisito | Fuente |
|---|---|---|
| RNF-PRI-01 | **Datos mínimos del cliente:** nombre, WhatsApp y consentimiento (con su fecha y hora). Nada más en el MVP | ADR-001 §6; 07-entrega §3 |
| RNF-PRI-02 | Modelo de identidad (D-019): una `identidad` (teléfono en E.164, el único identificador global) por persona y un `cliente_negocio` independiente por cada negocio, con su propio nombre y su fecha de alta (sin estado «por confirmar», D-031). La `identidad` se liga a `auth.users` con `auth_user_id`; dueño y cliente comparten `auth.users` y se distinguen por el rol en `app_metadata`. Todas las consultas del panel filtran por `negocio_id` (con RLS en Postgres si se usa Supabase). El dueño nunca lee `identidad` ni `tarjeta_llave`: ve a sus clientes por la vista `cliente_del_negocio`, que no expone `identidad_id` (así dos negocios no pueden cruzar un identificador), y el cliente ve el negocio por `negocio_publico`. La única vista que cruza negocios es Mis tarjetas, y solo la ve el propio cliente | ADR-001 §6 |
| RNF-PRI-03 | Rol propuesto: **el negocio es el responsable** de los datos de su programa y LealTab actúa como **encargado**, con un contrato de encargo en cada alta `[SUPUESTO, requiere revisión legal]`. Si el abogado concluye que Mis tarjetas convierte a LealTab en responsable, se evalúa tener un aviso propio desde el día 1; si el costo no es aceptable, se vuelve a la opción H (una PWA por negocio) | ADR-001 §5.1 y §6 |
| RNF-PRI-04 | **La consulta legal LFPDPPP es requisito antes de arrancar el piloto** | D-017 |
| RNF-PRI-05 | Aviso de privacidad corto y visible en C1 antes del botón, con enlace al completo; también en el pie del panel | 01-mapa §2 |
| RNF-PRI-06 | Los datos no se usan para fines propios de LealTab (por ejemplo, recomendar otros negocios) sin un ADR nuevo y revisión legal | ADR-001 §6 |
| RNF-PRI-07 | **Analítica propia, sin cookies** (D-018). El aviso actual de lealtab.com dice que no hay cookies ni analítica. **Antes del piloto** hay que actualizar el aviso para cubrir los eventos de uso: qué datos lleva cada evento, para qué y por cuánto tiempo. También falta el aviso de la plataforma, y hay que declarar a SMS Masivos (proveedor del código, con datos en EE. UU. hasta 3 meses) y revisar cómo se menciona a Meta en el aviso. Ya no hay cookie de sesión propia del cliente (D-031): las únicas cookies o almacenamiento de sesión son los de Supabase Auth, para cliente y dueño, de primera parte y necesarios, no de analítica, y el aviso debe decirlo así (PQ-18) | D-018; legal-notas §2 y §5 |
| RNF-PRI-08 | Pendientes legales heredados: domicilio, razón social y RFC del responsable; designar a la persona o el área de datos personales (art. 29); aviso simplificado junto al WhatsApp; contrato o anexo de encargo; proveedor de alojamiento sin nombrar; posible trato de consumidor a microempresas (LFPC) | legal-notas §3 |
| RNF-PRI-09 | **Retención y borrado** cuando un cliente elimina su cuenta (C5), plazo de conservación del aviso y texto legal final: **Por definir (PQ-04)**. El borrador de Términos propone 30 días tras cancelar para descargar o reactivar; el aviso no tiene un plazo numérico. El diseño de C5 no depende del plazo: usa una sola constante de texto y una sola configuración para la eliminación definitiva (D-026) | 07-entrega §8; legal-notas §4 |
| RNF-PRI-10 | «Tus datos son tuyos: expórtalos cuando quieras.» La exportación siempre está disponible | 07-entrega §6; D-006 |

### 7.4 Rendimiento y operación

| ID | Requisito | Fuente |
|---|---|---|
| RNF-REN-01 | Dar un sello en el mostrador en menos de 5 segundos `[SUPUESTO]` | 03-propuesta §5 |
| RNF-REN-02 | El mostrador aguanta la hora pico de una cafetería (lo señala D-003): sostiene **10 sellos por minuto por negocio y 140 por minuto entre todos los negocios de la primera tanda**, sin errores 5xx `[SUPUESTO: carga de diseño de 60 a 120 visitas por hora en el pico]`. La concurrencia por tarjeta se resuelve en el servidor dentro de una transacción | D-003; PQ-24 (cerrada) |
| RNF-REN-03 | Funciona con mala conexión en el local gracias al modo sin conexión | 02-plan §3 |
| RNF-REN-04 | Confirmar un sello en línea: p95 del servidor ≤ 800 ms, y de escanear a ver «+1 sello» ≤ 5 s (RNF-REN-01). Tarjeta del cliente: LCP p75 ≤ 2.5 s en 4G, ≤ 1 s con el service worker de `/c/`, INP ≤ 200 ms y CLS ≤ 0.1 ([web.dev](https://web.dev/articles/vitals), consultado el 21 oct 2026). Panel: LCP p75 ≤ 2.5 s, y N5 listo para escanear ≤ 4 s p75 en 4G. Disponibilidad: objetivo interno de 99.5 % mensual, sin SLA contractual. **Plan de hosting, respaldos y región: Por definir** (atados a PQ-29) | PQ-24 (cerrada); PQ-29 |
| RNF-REN-05 | Dominio y rutas: decididos (D-022, RNF-PWA-03). Stack y alojamiento: decididos ([D-023](../decisiones.md)), ver 7.6 | D-022; [D-023](../decisiones.md); [ADR-002](../adr/002-stack.md) |
| RNF-REN-06 | Costo de infraestructura hasta el Gate 1: hosting y base de datos de USD 20 a 50 al mes `[SUPUESTO]`, por validar con los planes de Vercel y Supabase. A esto se suma un **costo variable del código, que desde D-031 se paga en cada registro de cliente sin sesión**: unos **MXN 2,000 a 3,300 antes de IVA, una sola vez a lo largo del piloto** (USD 108 a 177 a MXN 18.5), con 10 a 14 negocios de 200 clientes y 1.3 envíos por alta, con SMS como peor caso (alrededor de MXN 1.00 a 1.20 por cliente nuevo; si el iPhone usa el mecanismo B de RNF-PWA-05, un mensaje más por instalación). El costo con WhatsApp depende de la cotización, **Por definir** (PQ-30). El costo del hosting de pago sigue en PQ-29, pendiente de Aarón (SMS Masivos: SMS de MXN 0.77 a 0.90 antes de IVA; el WhatsApp está por cotizar, **Por definir**, PQ-30). Con solo la infraestructura de pago (Vercel Pro y Supabase Pro, unos USD 45 al mes) el supuesto queda en el borde; Aarón lo revisa en PQ-29 y esta cifra no cambia mientras tanto | 03-propuesta §10; D-011; D-024 |

### 7.5 Accesibilidad, idioma y diseño

| ID | Requisito | Fuente |
|---|---|---|
| RNF-A11Y-01 | Todo estado va con palabra y color, nunca solo color o ícono | 07-entrega §7 |
| RNF-A11Y-02 | Contraste AA, foco visible (`--focus-ring`), orden de tabulación lógico y objetivos táctiles de 44 px o más | 07-entrega §7 |
| RNF-A11Y-03 | Inputs de 16 px; el campo de WhatsApp lleva `inputmode="tel"` y `autocomplete`; los errores se asocian con `aria-describedby`. **Alineado con el design system (2026-10-21):** input, select y textarea usan `font.size.input` = 16 px en todos los tamaños de pantalla (`04-design-system/tokens.css`) | 07-entrega §7; decisión de Aarón 2026-10-21 |
| RNF-A11Y-04 | Aro con `role="img"` y `aria-label` (por ejemplo, «4 de 8 sellos»). El QR tiene como alternativa la búsqueda por WhatsApp. Se respeta `prefers-reduced-motion` | 07-entrega §7 |
| RNF-DIS-01 | Se usan los tokens de `04-design-system/tokens.css` tal cual, sin inventar colores | 07-entrega |
| RNF-DIS-02 | Español de México, de tú. Copy clave según 07-entrega §6. En producción va el logotipo aprobado (en los wireframes es texto provisional) | 07-entrega §6; piezas 03 y 04 |

### 7.6 Stack técnico ([D-023](../decisiones.md); [ADR-002](../adr/002-stack.md))

**Fuente de verdad:** el stack técnico se define en [ADR-002](../adr/002-stack.md). Esta sección lo resume; si las dos difieren, manda el ADR-002.

| ID | Requisito | Fuente |
|---|---|---|
| RNF-STK-01 | TypeScript + Next.js (App Router), **en el mismo proyecto que la landing (`web/`)**, con las rutas `/c/` (app del cliente) y `/panel/` (panel del negocio) | [D-023](../decisiones.md); D-022; D-008 |
| RNF-STK-02 | Tailwind + shadcn/ui y pnpm, como en `web/`, con los tokens de `04-design-system/tokens.css` (RNF-DIS-01) | [D-023](../decisiones.md) |
| RNF-STK-03 | Supabase Postgres como base de datos, con **RLS que filtra por `negocio_id`** en todas las tablas de negocio (RNF-PRI-02) | [D-023](../decisiones.md); ADR-001 §6 |
| RNF-STK-04 | Supabase Auth autentica **al dueño**: correo + código o contraseña, con restablecimiento de contraseña por correo (RF-ALT-02, RF-ALT-02b). Los correos de Auth salen por **SMTP propio con Resend**. Supabase Auth autentica **también al cliente** (D-031): su teléfono se verifica con un código (OTP) desde el registro en C1 (RNF-STK-06) y su sesión es la de Supabase; no hay sesión propia ni cookie `Path=/c/`. Dueño y cliente comparten `auth.users` y se distinguen por `app_metadata.rol` (`dueno` o `cliente`), que escribe solo el servidor con la API de administración, nunca desde el navegador ni desde `user_metadata`. El rol **no es la barrera principal**: un usuario sin fila en `dueno_negocio` o en `identidad` no ve nada, tenga el claim que tenga, y una restricción impide que un mismo usuario esté en las dos tablas. La `identidad` (teléfono E.164) guarda `auth_user_id`. Borrar la cuenta (RF-APP-14) borra también el usuario de Supabase. El navegador no llama a Supabase Auth: la sesión del cliente se maneja por rutas del servidor con `@supabase/ssr`. Se escribe con el servidor tras `verifyOtp`; **si el rol se deriva de las tablas con un *custom access token hook* en vez de `app_metadata` escrito por el servidor: Por definir** (se prueba en el *spike*; la página de Supabase no dice de qué planes es). Las políticas de RLS son dos familias con `to authenticated` (dueño y cliente), cada una con el rol y la membresía por filas, y su detalle está en `docs/adr/003-sesion-cliente-y-codigo.md` §2.6; las revisa `security-review` | [D-023](../decisiones.md); D-005; D-019; D-024; D-031 |
| RNF-STK-05 | Eventos de uso (RF-EVT) en una **tabla propia en Supabase**, sin cookies, sin PostHog y sin herramientas de analítica de terceros | [D-023](../decisiones.md); D-018 |
| RNF-STK-06 | Código de verificación del cliente, en cada registro sin sesión y en cada recuperación (RF-APP-15, D-031), con el **hook de SMS de Supabase Auth** y **SMS Masivos** como proveedor: Supabase genera y verifica el código; el hook solo lo envía por `POST /v2/otp` con `code_custom`. Canal principal WhatsApp, respaldo SMS. El control de vigencia e intentos vive en un envoltorio del servidor. Antes de construir: confirmación escrita del proveedor y prueba de que Supabase dispare el hook sin proveedor nativo (PQ-30); si falla, las salidas son un proveedor nominal de relleno o un código propio sin Supabase Auth, que contradice D-031 y D-023 y se lleva a Aarón (ADR-003 §3); no se elige ninguna sin la prueba. **Ahora la prueba bloquea el registro, no solo la recuperación.** El hook (`/api/hooks/send-sms`) verifica la firma, solo acepta móviles de México de 10 dígitos, elige el canal (WhatsApp primero y SMS si falla o si el cliente lo pide) y es el paso obligado de los límites por teléfono y global (RF-APP-15). La alerta de saldo de SMS Masivos es de **300 mensajes** (antes 100), y avisa también si fallan 3 de los últimos 10 envíos | [D-023](../decisiones.md); D-011; D-024; D-031 |
| RNF-STK-07 | Escaneo del QR en N5 Mostrador con una **librería de escaneo en el navegador**, que funcione sin conexión (RF-SEL-13). Librería: **Por definir** (PQ-25). Antes de construir N5 se prueban `qr-scanner` y `barcode-detector` (*ponyfill*, con el `.wasm` autoalojado) en un iPhone y un Android reales, con los criterios de `docs/fase-7/propuestas/pq-arquitectura.md` §6.1, y gana la más ligera que pase. La librería y sus archivos salen de `lealtab.com`; no se carga ningún recurso de terceros | [D-023](../decisiones.md); D-015 |
| RNF-STK-08 | Alojamiento en **Vercel**, junto con la landing, en `lealtab.com` | [D-023](../decisiones.md); D-022 |
| RNF-STK-09 | Cobro con link de pago de Stripe o Mercado Pago, sin cambios (RF-COB-04) | D-012; [D-023](../decisiones.md) |
| RNF-STK-10 | Antes del piloto, comprobar que Vercel, Supabase y SMS Masivos no pongan cookies ni carguen recursos de terceros, y confirmar en qué región guardan los datos (PQ-18). SMS Masivos, Supabase y Vercel tratan datos en EE. UU. | [D-023](../decisiones.md); legal-notas §3 riesgo 6 |
| RNF-STK-11 | **React Server Components por defecto**; Tailwind CSS; shadcn/ui como capa estándar de componentes base | [D-023](../decisiones.md) (reglas del 21 oct); [ADR-002](../adr/002-stack.md) §2.1 |
| RNF-STK-12 | La app está **lista para contenedores**: Docker, Docker Compose y un **Dockerfile multi-stage**. Todo el código de la app, incluidos Supabase y los archivos de Docker, vive dentro de `web/` | [D-023](../decisiones.md); [ADR-002](../adr/002-stack.md) §2.1 |
| RNF-STK-13 | **Desarrollo local dockerizado:** Docker Compose levanta Supabase con sus contenedores y la app web | [D-023](../decisiones.md); [ADR-002](../adr/002-stack.md) §2.1 |
| RNF-STK-14 | **Producción:** Vercel compila `web/`; el contenedor no se despliega en producción | [D-023](../decisiones.md); [ADR-002](../adr/002-stack.md) §2.1 |
| RNF-STK-15 | **Todo cambio a la base es una migración de Supabase** en `web/supabase/migrations`, y las migraciones corren durante el build de Vercel. Riesgos a cuidar: que solo corran en builds de producción (no en vista previa), credenciales en variables de entorno de Vercel, y que una migración fallida haga fallar el build | [D-023](../decisiones.md); [ADR-002](../adr/002-stack.md) §2.1 y §4 |


---

## 8. Modelo de datos (base para desarrollo) [07-entrega §3; ADR-001 §6]

| Entidad | Campos |
|---|---|
| negocio | id, nombre, giro, ciudad, zona_horaria (nombre IANA), logo, plan, estado (prueba/activo/pausa), fin_prueba, whatsapp, correo_dueño, **alta_ts, tanda, version_producto** (las tres últimas las escribe el servidor al terminar N4; el dueño no las edita; `tanda` sale de una fila de configuración de la plataforma) |
| tarjeta_config | negocio_id, sellos_meta (4–12), recompensa, sello_bienvenida (bool), limite_modo (por_dia/cada_x_horas/sin_limite), limite_minutos (entero; en la interfaz son horas con hasta 2 decimales, 0 < X ≤ 24; el límite efectivo es al menos 2 min) |
| identidad (plataforma) | id, whatsapp (E.164, **único**; único identificador global; identifica la cuenta en la PWA), **auth_user_id** (único, no nulo, `ON DELETE CASCADE` desde `auth.users`: el usuario de Supabase Auth del cliente, D-031), verificado_ts, creada_ts. Sin nombre. No existe una identidad sin código verificado, así que no lleva un campo `verificado`. Supabase guarda el teléfono sin el `+`: se normaliza al comparar |
| dueno_negocio | user_id (de `auth.users`), negocio_id. Membresía del dueño; un mismo usuario no puede estar a la vez en `identidad` y aquí (ADR-003 §2.5) |
| ~~sesion_cliente~~ | **Retirada (D-031):** la sesión del cliente es la de Supabase Auth |
| install_token | hash del token (128 bits o más, de un solo uso), identidad_id, vigencia de 24 h, usado_ts. Solo lo lee el servidor. Los campos finales dependen del mecanismo de canje: **Por definir** (PQ-31) |
| evento_uso | id, `evento_uuid` (idempotencia), nombre (de una lista cerrada en el servidor), `ocurrido_ts`, `negocio_id` y `identidad_id` (los estampa el servidor desde la sesión; `identidad_id` pasa a nulo al borrar la cuenta), `flujo_id` (une los pasos de un registro o recuperación; aleatorio, no deriva del teléfono), emisor (cliente/panel/servidor/hook), `version_producto`, `props` (solo enteros, booleanos y catálogos cerrados). Es la tabla de RF-EVT; no se confunde con `evento` (sello, canje, corrección). Solo el rol de servicio la lee, sin políticas para el dueño ni el cliente. Nunca guarda teléfono (ni con hash), nombre, correo, IP, user agent, el código ni texto libre. Conservación: **Por definir** (PQ-B). Detalle en `docs/fase-7/medicion.md` §3 |
| envio_codigo | fecha, teléfono, canal (WhatsApp/SMS), **propósito (registro/recuperación/install)**, **`flujo_id`** (para que el hook relacione el envío con el flujo del navegador), resultado, `request_id` del proveedor, IP con hash. De aquí salen los conteos del hook (3 por hora y 10 al día por teléfono, tope global de 400 al día) y las alertas de saldo y de fallos. Solo el servidor lo lee. Se conserva 30 días `[SUPUESTO]` |
| codigo_intento | teléfono, fecha, resultado. Cuenta los 5 intentos fallidos por código y el bloqueo de 15 min. Solo el servidor lo lee |
| cliente_negocio | id, identidad_id, negocio_id, nombre (propio de cada negocio), aceptó_aviso_ts, alta_ts. Sin estado «por confirmar» (D-031). Uno por identidad y negocio. Estados tras el borrado de cuenta (C5) y fecha de eliminación definitiva: **Por definir** (PQ-04) |
| tarjeta_cliente | id, cliente_negocio_id, negocio_id, sellos, **meta_ciclo** (copia de `sellos_meta` al nacer la tarjeta y tras cada canje, ajustada a la baja si el negocio baja la meta), creada_ts, ultima_visita_ts. La llave HMAC ya no vive aquí |
| tarjeta_llave | tarjeta_id, llave_hmac. La lee el cliente (la necesita para generar el QR sin conexión) y el servidor; el dueño no, porque el servidor valida el HMAC. Es otra tabla porque dueño y cliente son ambos `authenticated` y no se pueden separar con permisos de columna |
| negocio_publico (vista) | nombre, logo, color, meta de sellos, recompensa y límite de sellos, solo de negocios activos o en prueba. Es lo único que `anon` ve, porque C1 la necesita antes del registro |
| cliente_del_negocio (vista) | id del `cliente_negocio`, nombre, WhatsApp y alta. La usa el dueño; verifica la membresía y **no expone `identidad_id`** |
| dispositivo | id, negocio_id, nombre («iPhone caja»), llave_publica (ECDSA P-256) |
| evento (sello/canje/corrección) | event_id (UUID), tipo (sello/canje/**correccion**; una corrección guarda además delta, sellos_antes, sellos_despues, motivo y nota, y es inmutable), tarjeta_id, qr_step, device_ts, recibido_ts, dispositivo_id, firma, origen (mostrador/bienvenida), estado (aceptado/rechazado/provisional) |
| canje | evento con tipo = canje, más la recompensa entregada; reinicia los sellos a 0 |
| por_revisar | evento_id, motivo (límite, QR vencido, duplicado, doble canje, firma), resolución (aprobado/descartado), resuelto_por, resuelto_ts |

> **Resuelto (D-019, 2026-10-21):** se adopta el modelo del ADR-001. El teléfono es el único identificador global y cada negocio guarda su propio nombre del cliente en `cliente_negocio`. *(El estado `por_confirmar` que traía esta nota se retiró con D-031, 22 oct 2026.)*
>
> **Resuelto (2026-10-21):** la tanda y la versión del producto viven en `negocio` (D-004, aclarado). `meta_ciclo` y el evento `correccion` vienen de D-027. **Resuelto (2026-10-22):** las sesiones del cliente son de Supabase Auth, no propias (D-031, que sustituye a D-025).
>
> **Eventos (2026-10-22):** `07-entrega` §5 ya está alineado con los eventos de D-031 y de `docs/fase-7/medicion.md`. **Por alinear:** `07-entrega` §3 todavía puede no reflejar `auth_user_id`, `meta_ciclo`, `limite_minutos`, el tipo `correccion` ni el retiro de `por_confirmar` (fuera de esta ronda).

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
| 6 | Diseño de producto del MVP | ✅ Cerrada (2026-10-20) | Pantallas N0-N8 y C0-C4 aprobadas (C5 y N1 con contraseña quedaron aprobadas el 21 oct, con wireframe en `docs/fase-7/propuestas/diseno/`), ADR-001 cerrado y eventos definidos. **PRD del MVP: borrador en revisión** (este documento) |
| **7** | **Desarrollo del MVP + piloto 0** | Pendiente | 1) Un local real usa el flujo completo durante una semana sin errores bloqueantes. 2) Al menos **10 pilotos confirmados por escrito** (WhatsApp), de 3 oficios o más. 3) **Entrevistas con dueños sobre el ícono y consulta legal LFPDPPP hechas** (D-017). Antes del piloto también hay que actualizar el aviso de privacidad para la analítica (D-018) y tener configurado el envío del código de recuperación por WhatsApp y SMS (D-011, D-024; PQ-30). Si a mitad de la fase hay menos de 6 pilotos confirmados, se revisa el segmento. En paralelo: entrevistas, consulta legal y reclutamiento en persona |
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
| R-18 | **Dependencia y costo del proveedor del código** (SMS Masivos), que con D-031 **bloquea el registro de clientes nuevos**: un solo proveedor para WhatsApp y SMS (punto único de falla), WhatsApp sin precio publicado, plantilla y remitente fijos del proveedor, datos en EE. UU. y saldo que se puede agotar. Si el envío falla, el cliente nuevo no se registra y el que cambia de teléfono no recupera su tarjeta; los clientes con sesión abierta y los sellos ya dados no dependen del proveedor, y N5 sigue sellando a quien ya tiene tarjeta (RF-SEL-02). Cada registro cuesta un mensaje (SMS de MXN 0.77 a 0.90 antes de IVA). Montos: **Por definir** (PQ-30) | Código por WhatsApp con respaldo por SMS (automático si falla y a petición del cliente), alerta diaria de saldo (umbral de 300 mensajes) y aviso a Aarón si fallan 3 de los últimos 10 envíos, y tope global de 400 envíos al día con aviso a los 200; confirmar por escrito la API oficial de Meta, la plantilla y la cotización antes de construir; medir los códigos enviados (MET-03 y MET-05). Gatillo para reabrir el respaldo: ≥5 % de códigos (registros y recuperaciones) fallidos en los dos canales o una caída de más de un día. En el piloto no hay verificación por el cajero | D-011 (aclarado 2026-10-21); D-024; D-031; 01-validación R7 |

---

## 12. Preguntas abiertas

Estado al 2026-10-21, según `docs/fase-7/propuestas/aprobaciones-2026-10-21.md`:
- **Actualización del 2026-10-22 (D-031):** PQ-30 ahora bloquea también el registro en C1, y nace PQ-31 (`install_token` de iOS con la sesión de Supabase y pruebas del ADR-003 §3). Los límites de envío ya están aprobados (22 oct).
- **Actualización del 2026-10-22 (v1.9):** nace PQ-41 (abierta): captura del denominador de G1-c (RF-EVT-04); puede esperar a la Fase 8. Las aclaraciones de §2.2 (5 clientes en «segunda visita sellada» y «negocio evaluable») son decisión de Aarón del 22 oct 2026.
- **Actualización del 2026-10-22 (v1.8):** PQ-32 cerrada por Aarón (convenciones de Gate 1, §2.2 y [D-004](../decisiones.md)). Siguen abiertas G1-b (PQ-01 y PQ-02) y el denominador de G1-c, que todavía no tiene PQ propia.
- **Actualización del 2026-10-22 (v1.7):** nacen PQ-32 a PQ-40. PQ-36 a PQ-39 son pruebas del *spike* del arquitecto; PQ-40 se confirma con el proveedor junto con PQ-30.
- **Abiertas que condicionan la construcción:** PQ-25 (antes de construir N5), PQ-30, PQ-31, PQ-36, PQ-37, PQ-38 y PQ-39 (antes de construir C1, la recuperación y la sesión) y PQ-29 (Aarón, después; RNF-REN-06 no cambia mientras tanto).
- **No bloquean el desarrollo; se deciden antes de reclutar:** PQ-01, PQ-02, PQ-08, PQ-09, PQ-15 y PQ-17.
- **Son del abogado o de trabajo de campo:** PQ-04, PQ-07, PQ-11, PQ-18 y PQ-21.
- **Cerradas el 2026-10-21:** PQ-05, PQ-06, PQ-10, PQ-12, PQ-13, PQ-19, PQ-20, PQ-22, PQ-23, PQ-24, PQ-26, PQ-27 y PQ-28 (más PQ-03, PQ-14 y PQ-16 de versiones anteriores).

| ID | Pregunta | Quién / cuándo | Fuente |
|---|---|---|---|
| **PQ-01** | **Precio especial de piloto:** ¿qué monto y cuántos meses dura? ¿Es el mismo «precio de fundador» que se ofrece por escrito? ¿Se prueban precios distintos con negocios parecidos, como pedía el plan? | Aarón, antes de abrir los pilotos | D-012; 03-propuesta §11 |
| **PQ-02** | **Gate 1 y precio de piloto (pendiente, depende de PQ-01):** G1-b cuenta como pagando a quien paga ≥ $299 sin IVA, pero el precio especial de piloto puede ser menor. Aarón decidió (2026-10-21) definir quién cuenta como negocio que paga **cuando se fije el precio de piloto** | Aarón, al fijar el precio de piloto | 02-plan §4; D-004; D-012 |
| ~~PQ-03~~ | ~~Bloqueo contra el doble escaneo: ¿1 o 2 minutos?~~ **Cerrada (Aarón, 2026-10-21): fijo en 2 min** (D-014) | — | D-014 |
| **PQ-04** | **Retención de datos y aviso legal final:** ¿cuánto tiempo se guardan los datos, qué se borra cuando un cliente elimina su cuenta (C5), y cuál es el texto final del aviso de privacidad? | Aarón con abogado, antes del piloto | 07-entrega §8; legal-notas §4 |
| ~~PQ-05~~ | ~~Plantilla de WhatsApp desde Clientes~~ **Cerrada (Aarón, 2026-10-21): tres plantillas de `wa.me` fijas que N7 elige sola (recompensa lista, En riesgo, saludo), no editables en el MVP** (D-030, RF-CLI-03) | — | D-030 |
| ~~PQ-06~~ | ~~Términos del límite de sellos~~ **Cerrada (Aarón, 2026-10-21): una línea con el límite bajo el QR de C3 y una hoja «Términos de la tarjeta» dentro de C3; C1 no cambia** (D-014 aclarado, RF-APP-10) | — | D-014 |
| **PQ-07** | **Entrevistas y consulta legal:** las entrevistas con dueños sobre el ícono (validación 5.1 b) y la consulta legal LFPDPPP (5.1 a) no se han hecho. ¿Quién y cómo se hacen? Si fallan, se vuelve a la opción H | Aarón, **antes del piloto** (criterio de salida de la Fase 7) | D-017; ADR-001 §5.1 |
| PQ-08 | Corte de altas de la primera tanda (sin calendario) | Aarón | D-004 |
| PQ-09 | **Límite de 200 clientes de Inicio después del piloto** (durante el piloto no hay límite, D-020): ¿qué pasa al llegar a 200 (bloqueo de registros, aviso, paso al plan Negocio) y cuentan los clientes totales o los activos? | Aarón, antes de terminar el piloto | D-020; D-003; D-006 |
| ~~PQ-10~~ | ~~N1 con contraseña y restablecimiento~~ **Cerrada (Aarón, 2026-10-21): contraseña opcional plegada en N1, pestañas «Con código» y «Con contraseña», restablecer con código de 6 dígitos de 10 min, contraseña de 8 a 72 caracteres sin reglas de composición, 5 fallos pausan la contraseña 15 min, «Cerrar otras sesiones» desmarcada, fila «Acceso» en N8** (D-005 aclarado, RF-ALT-02 a 02c) | — | D-005 |
| PQ-11 | Fichas por oficio con datos propios (ciclo de visita y ticket mínimo, sobre todo en tapiocas) | Entrevistas | revisión §5; 03-propuesta §3 |
| ~~PQ-12~~ | ~~Diseño de C5 «Mis datos»~~ **Cerrada (Aarón, 2026-10-21): `/c/cuenta`, desde «Mis datos ›» en C0; «Borrar mi cuenta» con casilla, sin código y con efecto inmediato.** El plazo legal sigue Por definir (PQ-04) (D-026, RF-APP-14) | — | D-026 |
| ~~PQ-13~~ | ~~Proveedor del código por WhatsApp~~ **Cerrada (Aarón, 2026-10-21): SMS Masivos con el hook de SMS de Supabase Auth; WhatsApp principal y SMS de respaldo** (D-024, RNF-STK-06). Lo que falta confirmar con el proveedor pasa a PQ-30 | — | D-024 |
| ~~PQ-14~~ | ~~Lista final de eventos~~ **Cerrada (2026-10-21):** nombres unificados en `07-entrega` §5, `docs/02-plan` y este PRD (RF-EVT-01 a 03) | — | 07-entrega §5 |
| PQ-15 | ¿Cuántas horas por semana hay para construir y cuántas para vender en persona? | Aarón | 03-propuesta §11 |
| ~~PQ-16~~ | ~~Stack y proveedor de alojamiento~~ **Cerrada (Aarón, 2026-10-21):** Next.js en `web/`, Supabase y Vercel ([D-023](../decisiones.md), sección 7.6). La revisión de cookies y región de los proveedores pasa a PQ-18 | — | [D-023](../decisiones.md); [ADR-002](../adr/002-stack.md) |
| PQ-17 | Cómo se activa la cuenta después del pago por link (manual hasta que exista el cobro automático) | Aarón | D-012 |
| PQ-18 | **Pendiente: actualizar el aviso de privacidad** para cubrir los eventos de uso de la analítica propia sin cookies (decidido en D-018). También: revisar que Vercel, Supabase y SMS Masivos no pongan cookies, decidir si se nombran en el aviso y si tratan datos fuera de México (RNF-STK-10). **Tres puntos sumados el 2026-10-21:** (1) las cookies de sesión son de primera parte y no de analítica; (2) los datos se tratan en EE. UU. (SMS Masivos, Supabase y Vercel); (3) SMS Masivos conserva los datos hasta 3 meses. **Punto sumado el 2026-10-22 (D-031):** (4) ya no hay cookie propia del cliente, solo el almacenamiento de sesión de Supabase Auth; el aviso debe decirlo, y el consentimiento del registro debe quedar antes del envío del código, porque el número se manda al proveedor desde el primer paso de C1 | Aarón con abogado, antes del piloto | D-018; D-024; legal-notas §5 |
| ~~PQ-19~~ | ~~Reglas de «corregir sellos» y cambio del número de sellos~~ **Cerrada (Aarón, 2026-10-21): hasta ±3 por corrección, motivo obligatorio, solo en línea, evento inmutable con el chip «Corregido»; una corrección sí puede completar la tarjeta; cambiar la meta nunca quita avance (`meta_ciclo`) y, si se baja, el excedente se pierde al canjear** (D-027, RF-CLI-04, RF-TAR-06) | — | D-027 |
| ~~PQ-20~~ | ~~Definición de «semana» e «intervalo habitual»~~ **Cerrada (Aarón, 2026-10-21): la semana son los 7 días completos que terminan ayer en la zona del negocio; el intervalo habitual es la mediana de los últimos 5; con una visita, En riesgo usa solo el mínimo de 30 días** (D-028, RF-INI-06, RF-QR-05) | — | D-028 |
| PQ-21 | Búsqueda de marca en el IMPI y la WIPO | Aarón | 02-plan §2 |
| ~~PQ-22~~ | ~~Detalles de implementación~~ **Cerrada (Aarón, 2026-10-21), por inciso:** (a) zona horaria IANA del navegador en N2, editable en N8 (RF-ALT-06); (b) X en horas con hasta 2 decimales, 0 < X ≤ 24, ventana móvil (RF-SEL-06; D-014 aclarado); (c) dos CSV con fórmulas neutralizadas (RF-CLI-06); (d) `alta_ts`, `tanda` y `version_producto` en `negocio` (§8; D-004 aclarado); (e) código de 6 dígitos, 10 min, 5 intentos, 60 s entre envíos, 3 por hora, 10 al día y bloqueo de 15 min (RF-APP-15; D-024); (f) plantilla fija del proveedor, SMS en GSM-7, sin cuenta de Meta propia (D-024); (g) y (h): identidad y sesión propias, y código solo en `/c/recuperar` (D-025), **sustituidos el 2026-10-22 por D-031** (Supabase Auth para el cliente, código desde el registro, sin «por confirmar»); los límites de envío del inciso (e) se mantienen y ya cubren registros (aprobados el 2026-10-22: 3 por hora y 10 al día por teléfono, tope global de 400 al día) | — | D-024; D-025; D-031 |
| ~~PQ-23~~ | ~~Respaldo si el WhatsApp falla~~ **Cerrada (Aarón, 2026-10-21): SMS del mismo proveedor, con alertas de saldo y de fallos; en el piloto no hay verificación por el cajero** (D-024, R-18) | — | D-024 |
| ~~PQ-24~~ | ~~Objetivos de rendimiento y operación~~ **Cerrada (Aarón, 2026-10-21): se aprueban las metas de rendimiento y disponibilidad** (RNF-REN-02, RNF-REN-04; D-023 aclarado). El plan de hosting y los respaldos quedan atados a PQ-29 | — | D-023 |
| PQ-25 | **Librería de escaneo de QR para N5 Mostrador** (RNF-STK-07). Antes de construir N5 se prueban `qr-scanner` y `barcode-detector` (*ponyfill*, con el `.wasm` autoalojado) en un iPhone y un Android reales, con los criterios de `docs/fase-7/propuestas/pq-arquitectura.md` §6.1. Gana la más ligera que pase | Desarrollo, antes de construir N5 | [D-023](../decisiones.md); [ADR-002](../adr/002-stack.md) §3 |
| ~~PQ-26~~ | ~~¿Caducan los sellos o la recompensa?~~ **Cerrada (Aarón, 2026-10-21): no caducan en el MVP** (D-029, RF-TAR-07) | — | D-029 |
| ~~PQ-27~~ | ~~¿El sello de bienvenida cuenta como visita?~~ **Cerrada (Aarón, 2026-10-21): no cuenta como visita en N0, N6 ni G1-a; «Nuevo» se mide desde el alta** (D-028, RF-QR-05) | — | D-028 |
| ~~PQ-28~~ | ~~Proveedor de correo para los códigos de entrada y restablecimiento del dueño~~ **Cerrada (Aarón, 2026-10-21): SMTP propio con Resend** (D-024, RNF-STK-04) | — | D-024 |
| PQ-29 | **Costo base de infraestructura:** Vercel Pro y Supabase Pro, unos USD 45 al mes `[SUPUESTO]`, y el plan actual de Vercel (Hobby no permite uso comercial). Incluye el plan de hosting, los respaldos y la región (RNF-REN-04). Los plazos máximo y de inactividad de la sesión de Supabase también piden plan Pro (ADR-003 §2.4). El costo variable del código (MXN 2,000 a 3,300 en el piloto, antes de IVA) ya está aprobado y vive en RNF-REN-06; lo que sigue pendiente de Aarón es el costo del hosting de pago | Aarón, después | [vercel.com/pricing](https://vercel.com/pricing) y [supabase.com/pricing](https://supabase.com/pricing), consultados el 2026-10-21; RNF-REN-06 |
| PQ-30 | **Por confirmar por escrito con SMS Masivos antes de construir la recuperación:** (1) si su OTP por WhatsApp usa la API oficial de Meta (D-011); (2) el texto de la plantilla y el remitente; (3) la cotización del WhatsApp y del SMS; (4) si hay webhooks de entrega. Además, una **prueba técnica**: que Supabase dispare el hook sin un proveedor nativo; si falla, se enmienda D-023. **Con D-031 esto bloquea construir el registro en C1 y `/c/recuperar`**, y se suma (5) si el proveedor aguanta el volumen de un mensaje por registro. **Pruebas del *spike* (ADR-003 §3 y ADR-004 §3):** (a) que `signInWithOtp` con teléfono llegue al hook sin proveedor nativo y sin `channel` (si no, las salidas del ADR-003 §3, sin elegir ninguna antes de la prueba); (b) que `code_custom` de 6 dígitos con `channel: whatsapp` y `code_rotate: true` entregue exactamente el código de Supabase, también en reenvíos; (c) entrega real en Telcel, AT&T y Movistar, en iPhone y Android, por los dos canales; (d) el tiempo de respuesta de la API frente al tiempo máximo del hook, que no está documentado | Aarón y desarrollo, antes de construir C1 y `/c/recuperar` | D-024; D-011; D-031; `docs/adr/003-sesion-cliente-y-codigo.md` §3; `docs/adr/004-proveedor-codigo.md` §3 |
| PQ-31 | **`install_token` de iOS con la sesión de Supabase (D-031):** ¿se puede canjear el token por una sesión de Supabase sin pedir otro código (por ejemplo, con un servidor que emita la sesión del usuario verificado)? ¿Dónde queda guardada la sesión en Safari y en la PWA instalada (cookie o almacenamiento) y cuánto dura? ¿Cómo se guarda el token de un solo uso? Es una **prueba técnica** en iPhone con iOS 18 y 26 (RNF-PWA-07). Si no se puede, el respaldo es el código (mecanismo B, RF-APP-15) y MET-06 sube de importancia. **Pruebas del ADR-003 §3 que cuelgan de esta PQ:** (2) el mecanismo A (correo técnico, `generateLink` y `verifyOtp` con `token_hash`) y la rotación del refresh token en la PWA, en iOS 18 y 26, con B como respaldo; (3) que el proyecto permita subir el límite de SMS por hora de 30 a 100 y los topes por IP de `/otp`, `/verify` y `/token`, si `Sb-Forwarded-For` está disponible y que la vigencia de 10 min sea alcanzable; (4) que `@supabase/ssr` escriba cookies `HttpOnly` con nombre y ruta propios, que dueño y cliente convivan en un navegador y que Safari no las acorte; (5) la revisión de `security-review` (rol, exclusión mutua, vistas, políticas y el riesgo aceptado de los intentos); (6) que `signInWithOtp` y `verifyOtp` no cambien su respuesta ni su tiempo entre teléfonos nuevos y existentes; (7) la normalización del teléfono en `auth.users`. Los límites de envío ya están aprobados (RF-APP-15) | Arquitecto y desarrollo, antes de construir C1, C2 y la sesión | D-031; RNF-PWA-05; `docs/adr/003-sesion-cliente-y-codigo.md` §3 |
| ~~PQ-32~~ | ~~**Convenciones de Gate 1 que el PRD no define**~~ **Cerrada (Aarón, 2026-10-22):** día 1 = fecha del alta del negocio (`negocio.alta_ts`, zona del negocio); las 4 semanas de G1-a son los días 1-28 (los días 29 y 30 no cuentan para las semanas); segunda visita sellada = visitas en 2 o más días locales distintos dentro de los días 1 a 30; regresa = visita en un día posterior al alta y hasta 21 días después; G1-d = cifra global por cliente, con la mediana por negocio como lectura aparte. G1-b y G1-c siguen Por definir (§2.2) | — | §2.2; [D-004](../decisiones.md) (aclaración del 22 oct 2026); `docs/fase-7/medicion.md` §7 |
| PQ-33 | **Conservación de `evento_uso`:** ¿por cuánto tiempo se guardan los eventos y se anonimizan o se borran al borrar la cuenta? Propuesta `[SUPUESTO]`: 13 meses, para cubrir Gate 2 y cohortes, anonimizando (`identidad_id` en nulo). El aviso debe decir el plazo. Se relaciona con PQ-04 y PQ-18 | Aarón y abogado | `medicion.md` §3.3; D-018; D-026 |
| PQ-34 | **¿El borrado de cuenta limpia también `envio_codigo` y `codigo_intento` del teléfono?** Cierra el hilo entre `flujo_id` y el teléfono (`envio_codigo` se conserva 30 días `[SUPUESTO]`), a costa de reiniciar los límites de envío de ese número | Arquitecto y abogado | `medicion.md` §3.3; D-026; ADR-003 §2.8 |
| PQ-35 | **Lista cerrada de motivos al corregir sellos** (`sellos_corregidos.motivo`, RF-CLI-04): el texto de la lista de N7 y sus códigos | Product designer | D-027; `medicion.md` §4.2 |
| PQ-36 | **`signOut` con `scope: 'others'` y la PWA instalada:** al verificar un código, cerrar las demás sesiones del usuario (RF-APP-04) podría cerrar también la sesión de la PWA instalada en el mismo iPhone. Falta probarlo y, si pasa, decidir cómo evitarlo | Arquitecto y desarrollo, en el *spike* | ADR-003 §2.2; pieza 08 |
| PQ-37 | **Teléfono anterior tras una recuperación:** el teléfono viejo conserva su access token hasta 1 h y las llaves HMAC de sus tarjetas guardadas en local. Falta decidir si basta con la RLS por membresía o si hay que hacer algo más | Arquitecto, con `security-review` | ADR-003 §2.2 y §2.6; pieza 08 |
| PQ-38 | **Reintento de crear la tarjeta tras verificar:** si el código ya se verificó y falla la creación de la tarjeta, si se puede reintentar sin pedir otro código (y con qué ventana). Incluye confirmar que el estado del paso 2 se conserva en `sessionStorage` (CA-C1.14) | Arquitecto | ADR-003 §2.2; pieza 08 |
| PQ-39 | **Tiempo de espera del hook de SMS:** el máximo no está documentado por Supabase; el valor de trabajo es de 15 s `[SUPUESTO]` y se mide en el *spike* junto con el reintento por SMS dentro de la misma llamada | Arquitecto y desarrollo, en el *spike* | ADR-004 §2 punto 11 y §3 |
| PQ-40 | **Alfabeto del SMS:** el ADR-004 dice «sin á, é, ó», pero el GSM-7 sí incluye la «é». Confirmar por escrito con SMS Masivos qué caracteres aceptan en el SMS y ajustar el texto | Aarón, con el proveedor (junto con PQ-30) | ADR-004 §1; D-024 |
| **PQ-41** | **Captura del denominador de G1-c** (`ext_visitas_dia`, RF-EVT-04): ¿cómo captura el dueño los clientes que visitan por día (pantalla o ajuste de N0/N8, o conteo externo), con qué frecuencia, y qué pasa si falta el dato? Hoy G1-c queda «sin dato» si menos del 70 % de N tiene denominador (§2.2) | Aarón, con el product designer; puede esperar a la Fase 8 | RF-EVT-04; §2.2 (G1-c); `docs/fase-7/medicion.md` §7.3 y §9; [D-004](../decisiones.md) (aclaración del 22 oct 2026) |

---

## 13. Trazabilidad de decisiones (D-001 a [D-031](../decisiones.md))

| Decisión | Dónde aplica en este PRD |
|---|---|
| D-001 Tarjeta web (PWA), sin Apple ni Google Wallet; instalar es opcional | 4.2, RNF-PWA-01, RNF-PWA-08 |
| D-002 Plataforma propia desde el MVP, sin marca blanca | 4.1, 4.2, R-01 |
| D-003 Piloto de 20 negocios en 4 oficios, con cafeterías | 3.2, 3.4, R-09, R-10 |
| D-004 30 días de prueba por negocio como piloto; Gate 1 y tandas (aclarado 2026-10-21: `alta_ts`, `tanda` y `version_producto` en `negocio`) | 2.2, RF-ALT-11, 8, 10, PQ-08 |
| D-005 Alta sola en menos de 5 min; entrada con código de 10 min o contraseña (aclarado 2026-10-21: reglas de N1, PQ-10) | 5.1 (RF-ALT-01 a 02c), RF-AJU-03, RF-EVT-06, MET-01 |
| D-006 Precios y planes públicos; pausa y exportación al terminar la prueba | 9.1, RF-COB-03 |
| D-007 Módulos en español; al lanzar, Tarjeta y Clientes | 4.1, 4.2 |
| D-008 La landing vive en `web/` | 4.1, 10 (Fase 5) |
| D-009 Fase 5 en pausa | 10 (Fase 5) |
| D-010 Mapa de flujos: N5 dentro del panel, cuenta compartida, «En riesgo», sello de bienvenida automático | 3.1, 5.3, 5.6, RF-TAR-03 |
| D-011 Resumen solo en el panel; la API de WhatsApp Business solo para el código de recuperación (cambio parcial 2026-10-21; aclarado: proveedor y respaldo por SMS) | 5.6, RF-APP-15, RF-CLI-03, F10, R-18, PQ-30 |
| D-012 Cobro del piloto con link de Stripe o Mercado Pago; «Activar mi plan» abre WhatsApp | 5.8, F8, 9.2, PQ-01, PQ-17 |
| D-013 Una sola app LealTab con Mis tarjetas | 5.4, 6 (F9), RNF-PWA-02 a 05 |
| D-014 Antiabuso: QR de 60 s, 1 sello por día por defecto, X libre en «1 cada X horas» (aclarado 2026-10-21: horas con 2 decimales, tope 24 h, ventana móvil; zona IANA; línea y términos en C3), bloqueo fijo de 2 min, registro por dispositivo | 5.3 (RF-SEL-04 a 09), RF-ALT-06, RF-APP-10, RF-AJU-01 y 02, 8 |
| D-015 Sin conexión primero; canje sin conexión con límite (aclarado 2026-10-21: N5 abre con conexión, sin segundo service worker, sincronización por eventos de la página, métrica de reaperturas) | RF-SEL-13 a 15, RNF-PWA-04, 7.2 (RNF-OFF-03 y 04), F7, RF-EVT-06 |
| D-016 «Hecho con LealTab» en todos los planes, Pro incluido | RF-ALT-10, RF-TAR-04, 9.1 |
| D-017 Entrevistas del ícono y consulta legal LFPDPPP antes del piloto | RNF-PRI-03, RNF-PRI-04, 10 (Fase 7), PQ-07 |
| D-018 Analítica propia, sin cookies; aviso actualizado antes del piloto | RF-EVT-05, RNF-PRI-07, PQ-18 |
| D-019 Nombre del cliente por negocio; el teléfono es el único identificador global (aclarado 2026-10-22: sin `por_confirmar`, D-031) | 8, RNF-PRI-02, RF-APP-04 |
| D-020 Sin límite de clientes en Inicio durante el piloto | RF-COB-09, R-10, PQ-09 |
| D-021 Una sola sucursal en el MVP; hasta 3 después | 3.2, 4.2, RF-SUC-01, 9.1, 10 (Fase 5) |
| D-022 Producto en `lealtab.com`, con `/c/` y `/panel/` | 4.1, 4.2, RNF-PWA-03, RNF-REN-05, RNF-STK-08 |
| [D-023](../decisiones.md) Stack: Next.js en `web/`, Tailwind + shadcn/ui, pnpm, Supabase (Postgres, Auth, RLS, eventos), Vercel; librería de QR por definir (PQ-25). Proveedor del código: D-024. Aclarado: dos CSV, metas de rendimiento | 7.6 (RNF-STK-01 a 15), 7.4 (RNF-REN-02 y 04), RF-CLI-06, RF-EVT-05, PQ-16, PQ-24, PQ-25 |
| D-024 Código con SMS Masivos y el hook de Supabase; Resend para el correo del dueño (aclarado 2026-10-22: cubre registros y sus límites quedan por definir) | RF-APP-15, RNF-STK-04 y 06, RNF-REN-06, R-18, PQ-30 |
| D-025 *(sustituida por D-031)* Sesión propia del cliente y «por confirmar» | Historial: RF-APP-05 retirado, PQ-22 (g, h) |
| D-026 Borrar la cuenta desde C5 (aclarado 2026-10-22: borra también el usuario de Supabase) | RF-APP-14, RNF-PRI-09, PQ-04 |
| D-027 Corregir sellos y `meta_ciclo` | RF-CLI-04, RF-TAR-06, 8 |
| D-028 Semana, intervalo habitual, bienvenida y chip «Al día» (aclaración del 22 oct 2026: un solo chip por cliente, En riesgo > Frecuente > Nuevo > Al día) | RF-QR-01, RF-CLI-01, RF-QR-05, G1-a |
| D-029 Los sellos no caducan | RF-TAR-07, RF-APP-10 |
| D-030 Plantillas de «Escribir por WhatsApp» | RF-CLI-03 |
| D-031 El cliente usa Supabase Auth con teléfono verificado por OTP desde el registro (sustituye a D-025) | RF-APP-01, 02, 04, 05 (retirado), 14 y 15, RNF-PWA-05, RNF-PRI-02 y 07, RNF-STK-04 y 06, 8, F2, F9, F10, MET-03, MET-05, MET-08 (retirada), R-18, PQ-18, PQ-30, PQ-31, PQ-36 a PQ-40; RF-EVT-01, 02, 05 y 06 y la pieza 08 (v1.7) |
