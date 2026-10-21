# LealTab: Informe 02, Plan de trabajo

> **Versión 3, 20 oct 2026.** Sin calendario: el plan se organiza por fases y cada fase cierra con su criterio de salida, no con una fecha. Junta en una sola secuencia las fases de marca y diseño de `PLAN.md` con las de validación de este documento. Incorpora D-001 a D-017 de `docs/decisiones.md`.
> Base: `docs/01-validacion-idea.md` (veredicto: GO con condiciones).

## 1. Principios del plan

1. **Marca completa antes del MVP.** Aarón decidió hacer la estrategia, la dirección creativa, la identidad visual y el design system antes de construir (Fases 1 a 4, ya cerradas). Sustituye el principio original de "validar antes de pulir".
2. **Producto propio desde el día uno.** Landing y app de LealTab, sin herramientas de terceros con marca blanca (D-002).
3. **Tarjeta web primero.** Funciona en el navegador de cualquier celular sin instalar nada, y agregarla a la pantalla de inicio es opcional (D-001).
4. **Alcance cerrado.** Solo se construye lo que está en la sección 3 de este plan. Lo demás espera a un gate.
5. **Sin fechas por ahora.** Cada fase avanza cuando cumple su criterio de salida.
6. **Se mantiene del resumen inicial:** LealTab como marca madre, el isotipo no se ata a una tarjeta y la calidad visual se cuida desde el primer contacto.

## 2. Mapa de fases

| # | Fase | Estado | Criterio de salida |
|---|---|---|---|
| 0 | Validación de la idea | ✅ | Veredicto GO y competencia mapeada. Pendiente heredado: búsqueda en el IMPI y la WIPO |
| 1 | Estrategia de marca | ✅ | Posicionamiento, voz, planes y piloto aprobados |
| 2 | Dirección creativa | ✅ | Ciclo v2 aprobado |
| 3 | Identidad visual | ✅ | Logo, paleta y brand book aprobados |
| 4 | Design System | ✅ | 5 piezas aprobadas |
| 5 | Marketing de lanzamiento | ⏸️ En pausa | Landing en `web/` publicada ✅, perfil de IG confirmado, posts 8-9 e historias decididos |
| 6 | Diseño de producto del MVP | 🟡 En curso | Flujos ✅, pantallas N0-N8 y C0-C5 aprobadas, ADR-001 cerrado ✅, eventos definidos y **PRD del MVP aprobado** |
| 7 | Desarrollo del MVP + piloto 0 | Pendiente | Un local real usa el flujo completo una semana sin errores bloqueantes; al menos 10 pilotos confirmados por escrito, de 3 oficios o más; entrevistas sobre el ícono y consulta legal LFPDPPP hechas (D-017) |
| 8 | Pilotos y Gate 1 | Pendiente | Gate 1 según D-004 (sección 4) |
| 9 | Producto v1 y Gate 2 | Pendiente | Lo piden los datos. Gate 2: ≥15 clientes de pago, MRR ≥ MXN 7,500, churn ≤8 % y un canal de ≤6 h por cliente |
| 10 | Crecimiento y paso a la Propuesta B | Pendiente | Las señales A→B de `PLAN.md` |
| 11 | Módulos de plataforma | Por demanda | Gate 3: MRR ≥ MXN 30,000 con ≥60 clientes, y el módulo pedido por ≥3 clientes de pago |

La antigua "Fase 5: Identidad visual completa tras el Gate 2" se elimina: ya la cubren las Fases 1 a 4.

**A vigilar:**
- El tiempo de construcción es `[SUPUESTO]` y depende de cuánto tiempo le puedas dedicar.
- Conviene que la ventana de cobro de los pilotos no caiga en temporada de fiestas, cuando los dueños tienen menos tiempo para soporte.

## 3. Alcance del MVP (Fase 7, diseñado en la Fase 6)

Fuente de detalle: `06-product-design/` (mapa de flujos y piezas 2 a 6, aprobadas).

### Dentro

| Pieza | Descripción |
|---|---|
| **Landing** (lealtab.com, `web/`) | Para el dueño, con CTA "Empieza gratis", ayuda por WhatsApp aparte y precios públicos (D-006, D-008) |
| **Alta del negocio (N1-N4)** | Autoservicio en menos de 5 min, sin llamada de ventas ni tarjeta de crédito: cuenta (código por correo de 10 min), datos del negocio, tarjeta (4 a 12 sellos, recompensa, color, sello de bienvenida) y cartel QR del mostrador (D-005) |
| **App del cliente (C0-C5)** | Una sola PWA LealTab (D-013). Se abre desde el QR del mostrador; registro con nombre + WhatsApp y aviso de privacidad, sin contraseña. "Mis tarjetas" con las tarjetas de varios negocios, cada una con su marca. Muestra los sellos, la recompensa y un QR personal que cambia cada 60 s. "Mis datos" para ver o borrar la cuenta |
| **Instalación PWA** | Manifest y service worker. Aviso de instalación en Android/Chrome; en iOS, una guía visual de "Compartir → Agregar a inicio". Instalar es opcional |
| **Recuperación de tarjeta** | Con el número de WhatsApp si el cliente cambia de teléfono o borra datos |
| **Mostrador (N5)** | Dentro del panel, con la cuenta compartida del negocio. Escanea el QR del cliente o lo busca por WhatsApp; estados escanear, confirmar sello y canjear |
| **Antiabuso** | QR rotativo (60 s, validable sin conexión con 10 min de margen), 1 sello por día por defecto, configurable a "1 cada X horas" o "Sin límite", bloqueo de 1 a 2 min contra escaneo doble y registro de quién dio cada sello (D-014) |
| **Sin conexión primero** | Sellos y canjes se guardan en el teléfono y se sincronizan después; el servidor decide y lo rechazado va a Clientes → Por revisar. Canje sin conexión con límite (D-015) |
| **Recompensa y canje** | Configurable por negocio, con canje confirmado por el staff |
| **Inicio (N0)** | Resumen semanal, solo en el panel (D-011) |
| **Quién regresa (N6)** | Frecuentes, En riesgo (más del doble del intervalo habitual, mínimo 30 días) y Nuevos |
| **Clientes (N7)** | Tabla, búsqueda, ficha con historial y exportar CSV (también con la cuenta en pausa) |
| **Ajustes (N8)** | Negocio, tarjeta, límite de sellos, plan y prueba, aviso de privacidad y soporte. "Activar mi plan" abre WhatsApp (D-012) |
| **Cobro en el piloto** | Link de pago de Stripe o Mercado Pago a precio especial de piloto (monto y duración: Por definir) |
| **"Hecho con LealTab"** | En la tarjeta y el cartel, en todos los planes (D-016) |
| **Eventos de medición** | Lista final: Por definir en la Fase 6. Mínimos en la sección 4, más `resumen_semanal_visto` |

### Fuera (hasta un gate)

- Pases de Apple o Google Wallet
- App nativa
- Usuarios de staff con permisos, varias tarjetas y sucursales (plan Negocio)
- Avisos, Campañas y Reportes avanzados
- Pago en línea dentro del producto (CFDI, OXXO/SPEI); el cobro automático se construye durante los pilotos
- Resumen semanal por WhatsApp o correo (se evalúa en la v1)
- IA
- API pública
- Niveles VIP, referidos de clientes finales y cashback
- Integración con POS

### Riesgos técnicos y de experiencia de la PWA

| Riesgo | Mitigación | Se mide en |
|---|---|---|
| El QR se abre en el navegador integrado de WhatsApp o Instagram, que no permite instalar | La tarjeta funciona igual; se ofrece "abrir en Safari/Chrome" solo para instalar | E6 |
| En iOS no hay aviso de instalación | Guía visual de 2 pasos; instalar es opcional | E6 |
| iOS borra los datos de sitios no instalados después de un tiempo sin uso | La identidad vive en el servidor; se recupera por WhatsApp | Tasa de recuperación |
| Las notificaciones web en iOS requieren la PWA instalada | No dependas del push en el MVP | — |
| Fraude con capturas de pantalla del QR | QR rotativo firmado y validación en el servidor | Registro de sellos |
| Mala conexión en el local | Modo sin conexión primero; búsqueda por WhatsApp como respaldo | Rechazos en Por revisar |

## 4. Detalle por fase

### Fase 0: Validación de la idea ✅

Hecha en `docs/01-validacion-idea.md`. Pendiente heredado: búsqueda de marca en el IMPI (clases 9, 35 y 42) y la WIPO.

### Fases 1 a 4: Marca y design system ✅

Estrategia, dirección creativa, identidad visual y design system cerrados. Entregables en `brand/` (ver `PLAN.md`).

### Fase 5: Marketing de lanzamiento ⏸️

Landing publicada en `web/`. Se retoma después de la Fase 6; lo pendiente está en `PLAN.md`.

### Fase 6: Diseño de producto del MVP 🟡

Aprobado: mapa de flujos, tarjeta del cliente, mostrador y quién regresa, alta y configuración, inicio/clientes/ajustes y estados de error y vacío. Falta para el PRD: métricas del producto, lista final de eventos, requisitos no funcionales, reglas pendientes y modelo de datos (base en ADR-001 §6), y la hoja de entrega para desarrollo.

**Criterio de salida:** PRD del MVP aprobado.

### Fase 7: Desarrollo del MVP + piloto 0

**En paralelo (descubrimiento):** entrevistas con dueños (incluida la validación del ícono del ADR-001), consulta legal LFPDPPP y reclutamiento de pilotos en persona.

**Criterio de salida:** un local real usó el flujo completo durante 1 semana sin errores bloqueantes, hay **≥10 pilotos confirmados por escrito** (WhatsApp), de al menos 3 oficios, y las dos validaciones del ADR-001 están hechas.
**Si a mitad de la fase hay menos de 6 pilotos confirmados:** revisar el segmento antes de seguir construyendo.

### Fase 8: Pilotos y Gate 1

**Formato (D-004):** Aarón recluta en persona hasta 20 negocios (barberías, estéticas, tapiocas y cafeterías, idealmente en Villahermosa). Cada negocio tiene **un mes de prueba gratis, que es su piloto**, y empieza cuando se da de alta. Al terminar paga con link de pago a precio especial de piloto (D-012). Se registra la fecha de alta y la versión del producto de cada negocio. Capacidad realista: 8–10 altas por semana si llegan confirmados; 4–6 si se recluta y activa a la vez `[SUPUESTO]`.

| Tarea | Entregable |
|---|---|
| Playbook del piloto: ayuda de arranque, cartel y capacitación de 15 min al staff | `docs/fase-3/playbook-piloto.md` |
| Guiones de WhatsApp: invitación, soporte y cobro | `docs/fase-3/mensajes-whatsapp.md` |
| Prueba de humo: anuncios en Meta dirigidos a la landing (MXN 3,000–5,000) | `docs/fase-3/prueba-humo.md` |
| Métricas semanales por piloto, incluida la apertura del resumen semanal | `docs/fase-3/metricas/` |
| Construir el cobro automático | Registro en `docs/decisiones.md` |
| Solo correcciones críticas, sin funciones nuevas | Registro en `docs/decisiones.md` si cambia el alcance |
| Evaluación del Gate 1 | `docs/fase-3/gate-1.md` |

**Gate 1.** Se evalúa sobre **N = negocios de la primera tanda** (corte de altas: Por definir). Cada negocio se mide en sus propios días 1–30; la tarjeta sigue funcionando en los días 31–37 para medir retorno y cobrar. Se pasa con 3 de estos 4:
- (a) **Activos:** ≥60 % de N. Activo = ≥30 inscritos, sellos en ≥3 de sus 4 semanas y (≥1 canje o ≥5 segundas visitas selladas). El "o" evita castigar a barberías y estéticas por su ciclo de visita.
- (b) **Conversión:** ≥40 % de N pagan ≥ MXN 299 sin IVA (primer mes o prepago) a más tardar su día 37. Cuenta solo dinero recibido; no cuentan promesas. Los precios especiales de piloto menores a $299 se reportan aparte. Recordatorio por WhatsApp el día 25.
- (c) **Inscripción:** mediana por negocio ≥30 % de los clientes que visitan, en sus días 1–14. Solo se evalúa si hay denominador (tickets o conteo) de ≥70 % de N; si no, "sin dato".
- (d) **Retorno:** ≥25 % de los inscritos en sus días 1–16 regresa en ≤21 días. Se reporta también por oficio y por semana de alta.

**Se corta** con ≤20 % de N activos, ≤10 % de conversión o mediana de inscripción menor a 10 %. En ese caso se revisan los pivotes de la sección 9 del informe 01.

> **Por definir:** cómo cuenta para el criterio (b) el precio especial de piloto, si su monto queda abajo de $299.

**Lectura complementaria (no cuenta para pasar):** resultados por oficio (con ~5 por oficio son dirección; un oficio es "candidato" con ≥3 activos y ≥2 pagando) y "¿lo recomendarías?" a los dueños.

**Segunda tanda:** los negocios que entren después del corte cuentan para el Gate 2.

**Eventos mínimos** (lista final en la Fase 6): `negocio_alta` (oficio, fecha, tanda), `cliente_registrado`, `sello_otorgado`, `canje_confirmado`, `resumen_semanal_visto`; fuera de la app, clientes que visitaron por día (tickets o conteo) y registro de pagos (fecha, monto sin IVA, método).

**E6 adaptado a la PWA (`[SUPUESTO]`):**
- ≥85% de los que escanean el QR completan el registro.
- ≥25% instala la PWA, medido por separado en iPhone y Android.
- Recuperaciones menores al 10% de los inscritos.
- Si la instalación es muy baja pero el retorno es bueno, la instalación no era necesaria y no se insiste en ella.

### Fase 9: Producto v1 y Gate 2

Solo se construye lo que pidieron los datos de los pilotos. Candidatos:
- Cobro recurrente con CFDI
- Multi-sucursal y usuarios de staff
- Aviso del resumen semanal por WhatsApp o correo, si la apertura en el panel sale baja
- Mejoras de instalación y recuperación según E6

**Gate 2:** ≥15 clientes de pago, MRR ≥ MXN 7,500, churn mensual ≤8% y un canal que requiera ≤6 h del fundador por cliente.

### Fase 10: Crecimiento y paso a la Propuesta B

- Escalar el canal ganador de E7.
- Expandir al sureste: Mérida, Veracruz y Cancún.
- Subir a negocios de 2–5 sucursales.
- Pasar del mensaje "la tarjeta digital más simple" a "la plataforma de lealtad seria que crece con tu negocio" cuando se cumplan las señales de `PLAN.md`.

### Fase 11: Módulos de plataforma (por demanda)

Gate 3: MRR ≥ MXN 30,000 con ≥60 clientes, y el módulo pedido por ≥3 clientes de pago. Candidatos: Avisos, Campañas, Reportes y Wallet (Apple y Google).

## 5. Equipo de subagentes (histórico)

> **Histórico.** Esta tabla describe el equipo planeado en `.claude/agents/` al 4 oct 2026 y su numeración de fases original. Ya no coincide con el equipo actual (Estrategia de Marca, Dirección Creativa e Identidad, Diseño de Producto, Marketing y Lanzamiento, y el PM que lleva `PLAN.md`).

| Agente | Fases (numeración original) | Rol |
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

## 6. Siguientes pasos (Fase 6)

1. Hoja de entrega para desarrollo.
2. Métricas del producto y lista final de eventos.
3. Requisitos no funcionales (rendimiento, sin conexión, accesibilidad, LFPDPPP) y modelo de datos.
4. Definir el precio especial de piloto y su duración.
5. Redactar y aprobar el PRD del MVP.

## 7. Pregunta del arquitecto (cerrada)

**¿Una PWA por negocio o una sola PWA de LealTab?** Decidido el 20 oct 2026: una sola app LealTab con "Mis tarjetas" en el MVP (ADR-001, D-013).
