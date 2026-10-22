# LealTab: Informe 02, Plan de trabajo

> **Versión 3, 20 oct 2026.** Sin calendario: el plan se organiza por fases y cada fase cierra con su criterio de salida, no con una fecha. Junta en una sola secuencia las fases de marca y diseño de `PLAN.md` con las de validación de este documento. Incorpora D-001 a D-031 de `docs/decisiones.md`. *(Ajuste del 21 oct 2026: los entregables de cada fase van en `docs/fase-N/` con la numeración de este plan, el equipo de subagentes se actualizó en la sección 5 y la guía de instalación de iOS tiene 3 pasos, como en la pieza 02.)*
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
| 6 | Diseño de producto del MVP | ✅ Cerrada (2026-10-20) | Flujos ✅, pantallas N0-N8 y C0-C4 aprobadas ✅ (C5 en alcance, sin wireframe todavía), ADR-001 cerrado ✅, eventos definidos ✅ (`07-entrega` §5). **PRD del MVP v2.4** (`docs/prd/PRD-lealtab-mvp.md`) |
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
| **Alta del negocio (N1-N4)** | Autoservicio en menos de 5 min, sin llamada de ventas ni tarjeta de crédito: cuenta (correo + código de 10 min o contraseña, D-005 actualizado 2026-10-21), datos del negocio, tarjeta (4 a 12 sellos, recompensa, sello de bienvenida) y cartel QR del mostrador (D-005) |
| **App del cliente (C0-C5)** | Una sola PWA LealTab (D-013). Se abre desde el QR del mostrador; registro con nombre + WhatsApp verificado con un código por WhatsApp o SMS (D-031) y aviso de privacidad, sin contraseña. "Mis tarjetas" con las tarjetas de varios negocios, cada una con su marca. Muestra los sellos, la recompensa y un QR personal que cambia cada 60 s. "Mis datos" para ver o borrar la cuenta |
| **Instalación PWA** | Manifest y service worker. Aviso de instalación en Android/Chrome; en iOS, una guía visual de "Compartir → Agregar a inicio". Instalar es opcional |
| **Recuperación de tarjeta** | Con el número de WhatsApp y un código por WhatsApp o SMS (SMS Masivos, D-024) si el cliente cambia de teléfono o borra datos; es el mismo flujo del registro (D-031) |
| **Mostrador (N5)** | Dentro del panel, con la cuenta compartida del negocio. Escanea el QR del cliente o lo busca por WhatsApp; estados escanear, confirmar sello y canjear |
| **Antiabuso** | QR rotativo (60 s, validable sin conexión con 10 min de margen), 1 sello por día por defecto, configurable a "1 cada X horas" o "Sin límite", bloqueo fijo de 2 min contra escaneo doble y registro de quién dio cada sello (D-014) |
| **Sin conexión primero** | Sellos y canjes se guardan en el teléfono y se sincronizan después; el servidor decide y lo rechazado va a Clientes → Por revisar. Canje sin conexión con límite (D-015) |
| **Recompensa y canje** | Configurable por negocio, con canje confirmado por el staff |
| **Inicio (N0)** | Resumen semanal, solo en el panel (D-011) |
| **Quién regresa (N6)** | Frecuentes, En riesgo (más del doble del intervalo habitual, mínimo 30 días) y Nuevos |
| **Clientes (N7)** | Tabla, búsqueda, ficha con historial y exportar CSV (también con la cuenta en pausa) |
| **Ajustes (N8)** | Negocio, tarjeta, límite de sellos, plan y prueba, aviso de privacidad y soporte. "Activar mi plan" abre WhatsApp (D-012) |
| **Cobro en el piloto** | Link de pago de Stripe o Mercado Pago a precio especial de piloto (monto y duración: Por definir) |
| **"Hecho con LealTab"** | En la tarjeta y el cartel, en todos los planes (D-016) |
| **Eventos de medición** | Lista final en `06-product-design/07-entrega-desarrollo.md` §5, con los nombres unificados (`negocio_alta_completada` con `tanda`, `sello_registrado`, `canje_registrado`, `resumen_semanal_visto`) y los eventos del ADR-001 §10 |

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
| En iOS no hay aviso de instalación | Guía visual de 3 pasos (C2); instalar es opcional | E6 |
| iOS borra los datos de sitios no instalados después de un tiempo sin uso | La identidad vive en el servidor; se recupera con un código por WhatsApp o SMS (D-031) | Tasa de recuperación |
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

### Fase 6: Diseño de producto del MVP ✅ Cerrada (2026-10-20)

Aprobado: mapa de flujos, tarjeta del cliente, mostrador y quién regresa, alta y configuración, inicio/clientes/ajustes y estados de error y vacío, y la hoja de entrega para desarrollo (`07-entrega-desarrollo.md`, con eventos y modelo de datos). C5 Mis datos queda en alcance sin wireframe.

**PRD del MVP v2.4:** en `docs/prd/PRD-lealtab-mvp.md` (métricas del producto, requisitos no funcionales y preguntas abiertas).

### Fase 7: Desarrollo del MVP + piloto 0

**En paralelo (descubrimiento):** entrevistas con dueños (incluida la validación del ícono del ADR-001), consulta legal LFPDPPP y reclutamiento de pilotos en persona.

**Criterio de salida:** un local real usó el flujo completo durante 1 semana sin errores bloqueantes, hay **≥10 pilotos confirmados por escrito** (WhatsApp), de al menos 3 oficios, las dos validaciones del ADR-001 están hechas (D-017) y, antes del piloto, el aviso de privacidad está actualizado para la analítica (D-018) y el proveedor del código (SMS Masivos) está configurado y probado (D-024).
**Si a mitad de la fase hay menos de 6 pilotos confirmados:** revisar el segmento antes de seguir construyendo.

### Fase 8: Pilotos y Gate 1

**Formato (D-004):** Aarón recluta en persona hasta 20 negocios (barberías, estéticas, tapiocas y cafeterías, idealmente en Villahermosa). Cada negocio tiene **30 días de prueba gratis, que son su piloto**, y empieza cuando se da de alta. Al terminar paga con link de pago a precio especial de piloto (D-012). Se registra la fecha de alta y la versión del producto de cada negocio. Capacidad realista: 8–10 altas por semana si llegan confirmados; 4–6 si se recluta y activa a la vez `[SUPUESTO]`.

| Tarea | Entregable |
|---|---|
| Playbook del piloto: ayuda de arranque, cartel y capacitación de 15 min al staff | `docs/fase-8/playbook-piloto.md` |
| Guiones de WhatsApp: invitación, soporte y cobro | `docs/fase-8/mensajes-whatsapp.md` |
| Prueba de humo: anuncios en Meta dirigidos a la landing (MXN 3,000–5,000) | `docs/fase-8/prueba-humo.md` |
| Métricas semanales por piloto, incluida la apertura del resumen semanal | `docs/fase-8/metricas/` |
| Construir el cobro automático | Registro en `docs/decisiones.md` |
| Solo correcciones críticas, sin funciones nuevas | Registro en `docs/decisiones.md` si cambia el alcance |
| Evaluación del Gate 1 | `docs/fase-8/gate-1.md` |

**Gate 1.** Se evalúa sobre **N = negocios de la primera tanda** (corte de altas: Por definir). Cada negocio se mide en sus propios días 1–30; la tarjeta sigue funcionando en los días 31–37 para medir retorno y cobrar. Se pasa con 3 de estos 4:
- (a) **Activos:** ≥60 % de N. Activo = ≥30 inscritos, sellos en ≥3 de sus 4 semanas y (≥1 canje o ≥5 segundas visitas selladas). El "o" evita castigar a barberías y estéticas por su ciclo de visita.
- (b) **Conversión:** ≥40 % de N pagan ≥ MXN 299 sin IVA (primer mes o prepago) a más tardar su día 37. Cuenta solo dinero recibido; no cuentan promesas. Los precios especiales de piloto menores a $299 se reportan aparte. Recordatorio por WhatsApp el día 25.
- (c) **Inscripción:** mediana por negocio ≥30 % de los clientes que visitan, en sus días 1–14. Solo se evalúa si hay denominador (tickets o conteo) de ≥70 % de N; si no, "sin dato".
- (d) **Retorno:** ≥25 % de los inscritos en sus días 1–16 regresa en ≤21 días. Se reporta también por oficio y por semana de alta.

**Se corta** con ≤20 % de N activos, ≤10 % de conversión o mediana de inscripción menor a 10 %. En ese caso se revisan los pivotes de la sección 9 del informe 01.

> **Por definir:** cómo cuenta para el criterio (b) el precio especial de piloto, si su monto queda abajo de $299.

**Lectura complementaria (no cuenta para pasar):** resultados por oficio (con ~5 por oficio son dirección; un oficio es "candidato" con ≥3 activos y ≥2 pagando) y "¿lo recomendarías?" a los dueños.

**Segunda tanda:** los negocios que entren después del corte cuentan para el Gate 2.

**Eventos mínimos** (lista final en `06-product-design/07-entrega-desarrollo.md` §5): `negocio_alta_completada` (oficio, fecha, tanda), `cliente_registrado`, `sello_registrado`, `canje_registrado`, `resumen_semanal_visto`, más los del ADR-001 §10 (`pwa_instalada`, `guia_instalacion_mostrada`, `install_token_canjeado`, `recuperacion_completada`, `app_abierta`); fuera de la app, clientes que visitaron por día (tickets o conteo) y registro de pagos (fecha, monto sin IVA, método).

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

## 5. Equipo de subagentes (`.claude/agents/`)

> Actualizado el 22 oct 2026 contra el PRD v2.3 y D-001 a D-031. Los entregables en documento van en `docs/fase-N/` con la numeración de este plan; el código de la app va en `web/`.

| Agente | Fases | Rol |
|---|---|---|
| `lealtab-coordinador` | Todas | Criterios de salida, gates, decisiones, preguntas abiertas del PRD y control del alcance |
| `lealtab-arquitecto` | 7, 9, 11 | Arquitectura de implementación sobre el ADR-002, modelo de datos con RLS, PWA, sin conexión, antifraude, privacidad y ADRs |
| `lealtab-desarrollador` | 7, 8, 9, 11 | Código del MVP en `web/` (incluido `web/supabase/`), correcciones y cobro automático en los pilotos |
| `lealtab-qa` | 7, 8, 9, 11 | Verificación con evidencia de cada tarea o feature antes del cierre (lint, typecheck, build, e2e, axe); no corrige código |
| `lealtab-product-designer` | 7, 9, 11 | Pantallas pendientes (C5, N1 con contraseña), dudas de diseño durante el desarrollo, cambios al design system y a la tarjeta |
| `lealtab-copywriter` | 7, 8, 10 (y 5 al retomarla) | Microcopy pendiente, plantillas y guiones de WhatsApp, anuncios y mensaje de la Propuesta B |
| `lealtab-analista-metricas` | 7 a 10 | Medición sobre la tabla de eventos, métricas de los pilotos y cálculo de gates |
| `lealtab-investigador-clientes` | 7, 8 | Entrevistas (incluida la del ícono), seguimiento del reclutamiento y playbook del piloto |
| `lealtab-investigador` | 0 (pendientes), 7, 10 | IMPI y WIPO, negocios objetivo, competencia, proveedores y expansión |
| `lealtab-growth` | 10 | Canales, referidos, alianzas, expansión y paso a la Propuesta B |

Cada feature nuevo sigue el flujo `/feature` (`.agents/skills/feature/SKILL.md`): la sesión principal orquesta (Opus) y los subagentes (Sonnet) hacen el trabajo, con aprobación de Aarón en el brief y en el cierre. Las reglas del repo están en `AGENTS.md` y `CLAUDE.md`.

**Archivados** en `.claude/agents-archivo/` porque su trabajo ya se entregó: `lealtab-estratega-marca` (Fase 1), `lealtab-director-creativo` (Fases 2 y 3), `lealtab-design-system` (Fase 4) y `lealtab-disenador-tarjeta` (Fase 6).

## 6. Siguientes pasos (cierre de la Fase 6 y arranque de la Fase 7)

1. ~~Hoja de entrega para desarrollo.~~ ✅ Aprobada (2026-10-20).
2. ~~Lista final de eventos.~~ ✅ En `07-entrega` §5 (nombres unificados el 2026-10-21).
3. Revisar y aprobar el PRD del MVP (borrador en `docs/prd/PRD-lealtab-mvp.md`, con métricas del producto y requisitos no funcionales).
4. Definir el precio especial de piloto y su duración.
5. Diseñar C5 Mis datos.

## 7. Pregunta del arquitecto (cerrada)

**¿Una PWA por negocio o una sola PWA de LealTab?** Decidido el 20 oct 2026: una sola app LealTab con "Mis tarjetas" en el MVP (ADR-001, D-013).
