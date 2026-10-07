# LealTab: Informe 02, Plan de trabajo

> **Versión 2, 4 oct 2026.** Incorpora las decisiones D-001 (tarjeta web PWA, sin wallets) y D-002 (plataforma propia desde el MVP, sin marca blanca) de `docs/decisiones.md`.
> Base: `docs/01-validacion-idea.md` (veredicto: GO con condiciones). Arranque: lunes 5 de octubre de 2026.

## 1. Principios del plan

1. **Validar antes de pulir.** La identidad completa (logo, brand book, Creative Direction) llega después de tener clientes que pagan.
2. **Producto propio desde el día uno.** Landing y app de LealTab, sin herramientas de terceros con marca blanca (D-002).
3. **Tarjeta web primero.** Funciona en el navegador de cualquier celular sin instalar nada, y agregarla a la pantalla de inicio es opcional (D-001).
4. **Alcance cerrado.** Solo se construye lo que está en la sección 3 de este plan. Lo demás espera a un gate.
5. **Se mantiene del resumen inicial:** LealTab como marca madre, el isotipo no se ata a una tarjeta y la calidad visual se cuida desde el primer contacto.

### Cómo quedan las fases del plan original

| Plan original | Dónde queda ahora |
|---|---|
| 1. Brand Strategy | Ligera en la **Fase 1**. Completa en la **Fase 5**. |
| 2. Creative Direction | **Fase 5** |
| 3. Visual Identity | Wordmark + acento en la **Fase 1**. Logo e isotipo en la **Fase 5**. |
| 4. Design System | Mínimo en la **Fase 2**. Completo en la **Fase 5**. |
| 5. Marketing | Landing en las **Fases 1–2**. Sitio completo en la **5** y canales en la **6**. |
| 6. Product Design | **Fase 2** (MVP) y **Fase 4** (iteración con datos) |
| 7. Desarrollo | **Fase 2** (MVP) y **Fase 4** (v1) |

## 2. Calendario

| Fase | Semanas | Fechas aprox. | Objetivo |
|---|---|---|---|
| 0. Verificación de supuestos | 1 | 5–11 oct 2026 | Confirmar que el nombre y el mercado no bloquean |
| 1. Marca mínima | 1–2 | 5–18 oct | Posicionamiento, wordmark, diseño de la tarjeta web y copy de la landing |
| 2. MVP propio: landing + PWA | 2–5 | 12 oct – 8 nov | Construir el flujo mínimo; **en paralelo**, 20 entrevistas |
| 3. Pilotos | 6–11 | 9 nov – 23 dic | Hasta 20 negocios, cada uno con su mes de prueba gratis como piloto; medición y conversión a pago (ver D-003 y D-004) |
| **Gate 1** | 12 | 23 dic | Seguir / pivotar / detener |
| 4. Producto v1 | 13–19 | 7 ene – 14 feb 2027 | Iterar con datos, cobro recurrente, multi-sucursal. 24 dic – 6 ene: semana muerta, solo correcciones. Segunda tanda de pilotos desde el 7 ene |
| **Gate 2** | 20 | ~21 feb 2027 | 15 clientes de pago y un canal replicable |
| 5. Identidad visual completa | Tras Gate 2 | mar–abr 2027 | Marca definitiva con casos reales |
| 6. Crecimiento | Continuo | — | Escalar el canal ganador; segundo vertical |
| 7. Módulos de plataforma | Por demanda | — | Solo cuando ≥3 clientes de pago lo pidan |

**Calendario a vigilar:**
- La construcción en 4 semanas es `[SUPUESTO]` y depende del tiempo que puedas dedicarle. Si la semana 5 llega sin el MVP en producción, los pilotos se recorren y chocan con diciembre.
- Los pilotos deben integrarse a más tardar el 13 de noviembre, para tener 30 días de datos antes de las fiestas.
- Diciembre es alta temporada para cafeterías y panaderías, lo que ayuda a medir, pero los dueños tienen menos tiempo para soporte.

## 3. Alcance del MVP (Fase 2)

### Dentro

| Pieza | Descripción |
|---|---|
| **Landing** (lealtab.com) | 1 página para el dueño, con CTA a WhatsApp y analítica básica |
| **Tarjeta web del cliente** | Se abre desde el QR del mostrador. Registro con nombre + WhatsApp, sin contraseña. Muestra los sellos, el premio y un QR personal. Se ve con la marca del negocio. |
| **Instalación PWA** | Manifest y service worker. Aviso de instalación en Android/Chrome. En iOS, una guía visual de "Compartir → Agregar a inicio". La tarjeta debe verse sin conexión con el último estado guardado. |
| **Recuperación de tarjeta** | Si el cliente cambia de teléfono o borra datos, la recupera con su número de WhatsApp (verificado por el cajero o por un enlace seguro) |
| **PWA del cajero** | Escanea el QR del cliente o busca por teléfono; sella en menos de 5 segundos. PIN por sucursal y por empleado. |
| **Antifraude básico** | QR rotativo firmado (para que no sirva una captura de pantalla), un sello por cliente cada X horas y bitácora por empleado |
| **Premio y canje** | Configurable por negocio, con canje confirmado por el cajero |
| **Panel del dueño** | Clientes nuevos, visitas, canjes, clientes "en riesgo" (más de 30 días sin volver) y tasa de retorno |
| **Resumen semanal al dueño** | Por WhatsApp. En el MVP puede generarse automático y enviarse a mano, o con enlace `wa.me`. |
| **Alta de negocio** | La haces tú (servicio "hecho por nosotros"): logo, colores, premio, sucursales y empleados |
| **Cobro** | Manual en el MVP (SPEI o transferencia), registrado en la app |
| **Eventos de medición** | Inscripción (con sistema operativo y navegador), instalación PWA, sello, canje, visita y recuperación |

### Fuera (hasta un gate)

- Pases de Apple o Google Wallet (posible módulo futuro: LealTab Passes)
- App nativa
- CRM y segmentación
- Campañas y automatizaciones
- IA
- API pública
- Niveles VIP, referidos de clientes finales y cashback
- Integración con POS
- Autoservicio del negocio
- Cobro recurrente automático (llega en la Fase 4)

### Riesgos técnicos y de experiencia de la PWA

| Riesgo | Mitigación | Se mide en |
|---|---|---|
| El QR se abre en el navegador integrado de WhatsApp o Instagram, que no permite instalar | La tarjeta funciona igual; se ofrece "abrir en Safari/Chrome" solo para instalar | E6 |
| En iOS no hay aviso de instalación | Guía visual de 2 pasos; instalar es opcional | E6 |
| iOS borra los datos de sitios no instalados después de un tiempo sin uso | La identidad vive en el servidor; se recupera por WhatsApp | Tasa de recuperación |
| Las notificaciones web en iOS requieren la PWA instalada | No dependas del push en el MVP; reactiva por WhatsApp | — |
| Fraude con capturas de pantalla del QR | QR rotativo firmado y validación en el servidor | Bitácora |
| Mala conexión en el local | El cajero puede sellar por teléfono; la tarjeta muestra el estado guardado | Errores por sucursal |

## 4. Detalle por fase

### Fase 0: Verificación de supuestos (semana 1)

**Agentes:** `lealtab-investigador`, `lealtab-coordinador`

| Tarea | Responsable | Entregable |
|---|---|---|
| Búsqueda en MARCia (IMPI) de "LEALTAB" y "LEAL" en clases 9, 35 y 42 | Fundador, con la guía del investigador | `docs/fase-0/marca-impi.md` |
| Identificar al titular de `@lealtab`; reservar `@getlealtab` en todas las redes | Fundador | Checklist en el mismo archivo |
| Conteo en DENUE y lista de 40 negocios objetivo en Villahermosa | `lealtab-investigador` | `docs/fase-0/lista-negocios.md` |
| Compra misteriosa a Lealify, Fideliza, SMS Masivos, FIU y Loopy, poniendo el foco en su experiencia **web/PWA** y en Android | Fundador ejecuta; el investigador prepara y sintetiza | `docs/fase-0/compra-misteriosa.md` |
| Escribir y fechar los criterios de los Gates 1–3 | `lealtab-coordinador` | `docs/gates.md` |

**Criterio de salida:** marca viable y lista de 40 negocios lista. **Si falla la marca:** cambiar de nombre antes de la Fase 2.

### Fase 1: Marca mínima (semanas 1–2)

**Agentes:** `lealtab-estratega-marca`, `lealtab-copywriter`, `lealtab-disenador-tarjeta`

| Tarea | Responsable | Entregable |
|---|---|---|
| Posicionamiento de 1 página orientado al dueño, con voz y tono | `lealtab-estratega-marca` | `docs/fase-1/posicionamiento.md` |
| Wordmark (tipografía existente + color de acento) | `lealtab-disenador-tarjeta` | `docs/fase-1/wordmark.md` |
| Diseño de la tarjeta web con la marca del negocio, en 3 ejemplos: cafetería, panadería y barbería | `lealtab-disenador-tarjeta` | `docs/fase-1/tarjeta-web/` |
| Ícono de pantalla de inicio y splash de la PWA, y guía visual de "Agregar a inicio" | `lealtab-disenador-tarjeta` | Mismo directorio |
| Cartel QR de mostrador | `lealtab-disenador-tarjeta` + `lealtab-copywriter` | `docs/fase-1/cartel-qr.md` |
| Copy de la landing | `lealtab-copywriter` | `docs/fase-1/landing-copy.md` |

**No se hace:** brand book, isotipo ni Creative Direction completa.

### Fase 2: MVP propio, landing + PWA (semanas 2–5)

**Agentes de construcción:** `lealtab-arquitecto`, `lealtab-product-designer`, `lealtab-design-system`, `lealtab-desarrollador`
**En paralelo (descubrimiento):** `lealtab-investigador-clientes`, `lealtab-copywriter`

| Semana | Construcción | Descubrimiento |
|---|---|---|
| 2 | Arquitectura y ADRs, flujos, tokens y componentes base. **Landing publicada.** | Kit de entrevista y primeras 5 entrevistas |
| 3 | Tarjeta web del cliente, registro, QR rotativo y PWA instalable | 8 entrevistas más; **empezar a reclutar pilotos** (el fundador, en persona) |
| 4 | PWA del cajero, sellos, antifraude, premio y canje | 7 entrevistas más; síntesis E1; seguir reclutando |
| 5 | Panel del dueño, resumen semanal, eventos, pruebas en un local real (piloto 0) | Confirmar pilotos por escrito con fecha de alta agendada ≤17 nov (meta: 12 o más, mínimo 10); preventas (E5) |

**Criterio de salida (8 nov):** un local real usó el flujo completo durante 1 semana sin errores bloqueantes, y hay **≥10 pilotos confirmados por escrito** (WhatsApp), con alta agendada a más tardar el 17 nov y de al menos 3 oficios.
**Si al 1 nov hay menos de 6 pilotos confirmados:** revisar el segmento con `lealtab-coordinador` antes de seguir construyendo.

### Fase 3: Pilotos (semanas 6–12)

**Formato (D-004):** el fundador recluta en persona hasta 20 negocios. Cada negocio tiene **un mes de prueba gratis, que es su piloto**, y empieza cuando se le da de alta. Del 9 al 17 nov solo se activan los pilotos ya confirmados en la Fase 2 (capacidad realista: 8–10 altas por semana si llegan confirmados; 4–6 si se recluta y activa a la vez `[SUPUESTO]`). Se registra la fecha de alta y la versión del producto de cada negocio para comparar la primera mitad contra la segunda.

**Agentes:** `lealtab-investigador-clientes`, `lealtab-analista-metricas`, `lealtab-copywriter`, `lealtab-desarrollador` (correcciones), `lealtab-coordinador`

| Tarea | Entregable |
|---|---|
| Playbook del piloto: alta en 24 h, cartel, capacitación de 15 min al cajero | `docs/fase-3/playbook-piloto.md` |
| Guiones de WhatsApp: invitación, resumen semanal y reactivación | `docs/fase-3/mensajes-whatsapp.md` |
| Prueba de humo: anuncios en Meta dirigidos a la landing (MXN 3,000–5,000) | `docs/fase-3/prueba-humo.md` |
| Métricas semanales por piloto | `docs/fase-3/metricas/semana-XX.md` |
| Solo correcciones críticas, sin funciones nuevas | Registro en `docs/decisiones.md` si cambia el alcance |
| Evaluación del Gate 1 | `docs/fase-3/gate-1.md` |

**Gate 1 (23 dic).** Se evalúa sobre **N = negocios dados de alta a más tardar el 17 nov** (primera tanda). Cada negocio se mide en sus propios días 1–30; la tarjeta sigue funcionando en los días 31–37 para medir retorno y cobrar. Se pasa con 3 de estos 4:
- (a) **Activos:** ≥60 % de N. Activo = ≥30 inscritos, sellos en ≥3 de sus 4 semanas y (≥1 canje o ≥5 segundas visitas selladas). El "o" evita castigar a barberías y estéticas por su ciclo de visita.
- (b) **Conversión:** ≥40 % de N pagan ≥ MXN 299 sin IVA (primer mes o prepago) a más tardar su día 37. Cuenta solo dinero recibido (SPEI, tarjeta o efectivo con recibo); no cuentan promesas ni precios de fundador menores a $299 (se reportan aparte). Recordatorio por WhatsApp el día 25.
- (c) **Inscripción:** mediana por negocio ≥30 % de los clientes que visitan, en sus días 1–14. Solo se evalúa si hay denominador (tickets o conteo) de ≥70 % de N; si no, "sin dato".
- (d) **Retorno:** ≥25 % de los inscritos en sus días 1–16 regresa en ≤21 días. Se reporta también por oficio y por semana de alta (diciembre infla visitas).

**Se corta** con ≤20 % de N activos, ≤10 % de conversión o mediana de inscripción menor a 10 %. En ese caso se revisan los pivotes de la sección 9 del informe 01.

**Lectura complementaria (no cuenta para pasar):** resultados por oficio (con ~5 por oficio son dirección; un oficio es "candidato" con ≥3 activos y ≥2 pagando) y "¿lo recomendarías?" a los dueños.

**Segunda tanda:** los negocios que entren después del 17 nov empiezan su mes desde el 7 ene (sin fiestas de por medio) y su conversión cuenta para el Gate 2 (21 feb).

**Eventos mínimos** (definir en `docs/fase-2/eventos.md`): `negocio_alta` (oficio, fecha, tanda), `cliente_registrado`, `sello_otorgado` (una visita por cliente por día), `canje_confirmado`; fuera de la app, clientes que visitaron por día (tickets o conteo) y registro de pagos (fecha, monto sin IVA, método).

> **7 oct 2026 (D-003 y D-004):** umbrales revisados con `lealtab-analista-metricas` y decididos por Aarón: criterio único, fecha límite de altas el 17 nov, Gate 1 el 23 dic y reclutamiento durante la Fase 2. Antes (10 pilotos): ≥6/10 activos, ≥4 pagando, corte ≤2 activos o 0–1 pagando, Gate 1 ~18 dic.

**E6 adaptado a la PWA (`[SUPUESTO]`, se fijan en `docs/gates.md`):**
- ≥85% de los que escanean el QR completan el registro.
- ≥25% instala la PWA, medido por separado en iPhone y Android.
- Recuperaciones menores al 10% de los inscritos.
- Si la instalación es muy baja pero el retorno es bueno, la instalación no era necesaria y no se insiste en ella.

### Fase 4: Producto v1 (semanas 12–19)

**Agentes:** `lealtab-product-designer`, `lealtab-arquitecto`, `lealtab-desarrollador`, `lealtab-design-system`, `lealtab-analista-metricas`

Solo se construye lo que pidieron los datos de los pilotos. Candidatos:
- Cobro recurrente (Stripe y SPEI) con CFDI
- Multi-sucursal
- Envío automático del resumen semanal
- Autoservicio parcial para el alta de negocios
- Mejoras de instalación y recuperación según E6

**Gate 2 (~21 feb 2027):**
- ≥15 clientes de pago
- MRR ≥ MXN 7,500
- Churn mensual ≤8%
- Un canal que requiera ≤6 h del fundador por cliente

### Fase 5: Identidad visual completa (tras el Gate 2)

**Agentes:** `lealtab-estratega-marca`, `lealtab-director-creativo`, `lealtab-design-system`, `lealtab-copywriter`

Incluye la brand strategy completa, Creative Direction, logo e isotipo, brand book, el design system completo y el sitio con casos de éxito. **Criterio de entrada:** pasar el Gate 2 o llegar a un MRR ≥ MXN 10,000.

### Fase 6: Crecimiento (continuo)

**Agentes:** `lealtab-growth`, `lealtab-copywriter`, `lealtab-analista-metricas`

- Escalar el canal ganador de E7.
- Abrir el segundo vertical.
- Expandir al sureste: Mérida, Veracruz y Cancún.
- Subir a negocios de 2–5 sucursales.

### Fase 7: Módulos de plataforma (por demanda)

Gate 3: MRR ≥ MXN 30,000 con ≥60 clientes, y el módulo pedido por ≥3 clientes de pago. Candidatos: LealTab Passes (Apple y Google Wallet), Campaigns, Automations y Analytics.

## 5. Equipo de subagentes

Los agentes viven en `.claude/agents/`. Todos leen los informes 01–03 y `docs/decisiones.md` antes de trabajar.

| Agente | Fases | Rol |
|---|---|---|
| `lealtab-coordinador` | Todas | Plan, gates, decisiones y control del alcance |
| `lealtab-investigador` | 0, 6 | Competencia, DENUE, IMPI y mercado |
| `lealtab-estratega-marca` | 1, 5 | Posicionamiento, voz y estrategia de marca |
| `lealtab-copywriter` | 1–3, 5, 6 | Landing, WhatsApp, anuncios y textos de la app |
| `lealtab-disenador-tarjeta` | 1, 2 | Tarjeta web del cliente, ícono y guía de instalación PWA, cartel QR, wordmark |
| `lealtab-investigador-clientes` | 2, 3 | Entrevistas, síntesis y playbook del piloto |
| `lealtab-analista-metricas` | 3, 4, 6 | Métricas de los pilotos, E6 y evaluación de gates |
| `lealtab-product-designer` | 2, 4, 7 | Flujos, UX y wireframes |
| `lealtab-arquitecto` | 2, 4, 7 | Arquitectura de la PWA, datos, antifraude, seguridad y ADRs |
| `lealtab-design-system` | 2, 4, 5 | Tokens y componentes |
| `lealtab-desarrollador` | 2–4, 7 | Implementación de la landing y la app |
| `lealtab-director-creativo` | 5 | Creative Direction, identidad y brand book |
| `lealtab-growth` | 6 | Canales, referidos y expansión |

Apoyos de `voltagent-research`:
- `competitive-analyst` y `market-researcher` en la Fase 0.
- `cohort-analysis` en las Fases 3 y 4.
- `ab-test-analysis` para la prueba de humo y las pruebas de precio.

## 6. Próximos 14 días

1. Búsqueda en MARCia e identificar al titular de `@lealtab`.
2. Conteo en DENUE y lista de 40 negocios.
3. Compra misteriosa a 5 competidores, con foco en su versión web y en Android.
4. Escribir y fechar los criterios de los Gates 1–3 en `docs/gates.md`.
5. Posicionamiento de 1 página, wordmark y diseño de la tarjeta web.
6. Arquitectura y ADRs del MVP, incluida la pregunta de la sección 7.
7. Landing publicada a más tardar el 18 de octubre.
8. Primeras 5 entrevistas.

## 7. Pregunta abierta para el arquitecto (antes de codificar)

**¿Una PWA por negocio o una sola PWA de LealTab?**

- **Opción A, una PWA por negocio** (manifest dinámico, por ejemplo `lealtab.com/c/cafe-x`). El ícono en la pantalla de inicio es el del negocio. Al dueño le gusta más, pero el cliente final acumula un ícono por negocio.
- **Opción B, una sola app "LealTab".** El ícono es de LealTab y adentro el cliente tiene todas sus tarjetas. Construye la marca LealTab con los clientes finales, pero el negocio pierde protagonismo.

Se decide en un ADR y se registra en `docs/decisiones.md`.
