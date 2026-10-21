# LealTab: Informe 03, Propuesta de producto

> **Versión 0.3, 20 oct 2026.** Incorpora D-001 a D-017 de `docs/decisiones.md` (alta sin llamada de ventas, precios públicos, módulos en español, flujos del MVP aprobados y ADR-001 decidido).
> Base: `docs/01-validacion-idea.md`. Plan por fases: `docs/02-plan-de-trabajo.md`. Lo marcado como `[SUPUESTO]` está pendiente de validar.

## 1. En una frase

**LealTab ayuda a barberías, estéticas, negocios de tapioca y cafeterías independientes a que sus clientes regresen, con una tarjeta de lealtad web que se abre desde un QR, funciona en cualquier celular sin descargar nada y le muestra al dueño cada semana cuántos clientes volvieron.**

## 2. Problema

- Los negocios de visita recurrente dependen de que el cliente vuelva, pero usan tarjetas de cartón que se pierden y se prestan a trampas, o no usan nada.
- El dueño no sabe cuántos clientes regresan ni si lo que hace para retenerlos funciona.
- Las herramientas que existen son baratas, pero el dueño tiene que configurarlas solo. Además, varias dependen de la app o del wallet del cliente, y prometen "+30% de ventas" sin medirlo.

## 3. Cliente ideal

Dueño-operador de un negocio de visita recurrente:
- Hasta 3 sucursales, empezando en Villahermosa. El MVP maneja una sola sucursal; varias, hasta 3, llegan después (D-021)
- Clientes que vuelven seguido (el ciclo de visita cambia por oficio: semanas en barberías y estéticas, días en cafeterías y tapiocas)
- Ticket mínimo: Por definir (el ≥ MXN 120 original no está validado para tapiocas)
- Clientela de 18–40 años, activa en Instagram y WhatsApp
- Decide él mismo

**Piloto (D-003):** hasta 20 negocios, idealmente en Villahermosa, en cuatro oficios: barberías, estéticas y salones de belleza, negocios de tapioca y cafeterías.

**Fuera por ahora:**
- Abarrotes
- Cadenas grandes
- E-commerce
- Gimnasios
- Farmacias

## 4. Solución y cuña

| Cuña | Qué recibe | Estado |
|---|---|---|
| **Regreso medible** | Resumen semanal en el panel (lo primero que ve el dueño al entrar) y la vista "Quién regresa": frecuentes, en riesgo y nuevos (D-011) | `[SUPUESTO]`, se mide con `resumen_semanal_visto` en el piloto |
| **Sin descargar nada, en cualquier celular** | El cliente escanea el QR, deja su nombre y su WhatsApp, y ya tiene su tarjeta en el navegador. Si quiere, la agrega a su pantalla de inicio. Su número sirve de respaldo para recuperarla. | `[SUPUESTO]`, se prueba en E6 (adaptado a la PWA) |
| **Alta sola en menos de 5 min** | Sin llamada de ventas ni tarjeta de crédito: tarjeta con la marca del negocio y cartel QR listos para imprimir. Soporte en español por WhatsApp y, en el piloto, ayuda de arranque en persona (D-005) | `[SUPUESTO]`, se prueba en los pilotos |

El estándar premium se aplica donde se ve: la tarjeta web, el cartel, el mostrador y el resumen semanal.

**Plataforma propia desde el primer cliente.** La landing y la app son de LealTab: los datos, la experiencia y la marca son propios desde el día uno, sin migraciones posteriores.

**Lo que no somos (todavía):** una plataforma de 9 módulos. La arquitectura de marca madre (Tarjeta, Clientes, Avisos, Campañas, Reportes) se mantiene como dirección: al lanzar solo hay Tarjeta y Clientes, y cada módulo llega cuando ≥3 clientes de pago lo piden (D-007).

## 5. Producto (MVP)

| Para quién | Qué hace |
|---|---|
| **Cliente final (C0-C5)** | Una sola app LealTab con "Mis tarjetas" (D-013). Cada tarjeta con la marca del negocio: sellos, recompensa y QR personal que cambia cada 60 s. Instalable como PWA, funciona sin conexión y se recupera por WhatsApp. Puede ver o borrar sus datos. |
| **Staff (N5 Mostrador)** | Dentro del panel, con la cuenta compartida del negocio: escanea el QR o busca por WhatsApp, sella en menos de 5 segundos y confirma canjes. 1 sello por día por defecto, configurable (D-014). |
| **Dueño (N0-N8)** | Alta sola (N1-N4), resumen semanal en Inicio, quién regresa (frecuentes, en riesgo, nuevos), clientes con historial y exportar CSV, y ajustes con plan y prueba |
| **LealTab (tú)** | Ayuda de arranque en el piloto, soporte por WhatsApp y envío del link de pago al terminar la prueba (D-012) |
| **Público** | Landing en lealtab.com (`web/`) con CTA "Empieza gratis" y ayuda por WhatsApp aparte |

El detalle completo del alcance, lo que queda fuera y los riesgos de la PWA está en la sección 3 del plan y en `06-product-design/`.

## 6. Modelo de negocio (precios públicos, D-006)

| Plan | Precio | Incluye |
|---|---|---|
| Prueba | Gratis 30 días, sin tarjeta de crédito | Al terminar sin pagar, la cuenta se pausa y los datos se pueden exportar |
| **Inicio** | MXN 299/mes + IVA | 200 clientes, 1 tarjeta, 1 sucursal |
| **Negocio** (recomendado) | ~MXN 449/mes + IVA | Clientes ilimitados, varias tarjetas, hasta 3 sucursales |
| **Pro** | Próximamente, sin precio | — |

**Piloto:** al terminar sus 30 días gratis, cada negocio paga con link de Stripe o Mercado Pago a un precio especial de piloto los primeros meses (monto y duración: Por definir). El cobro automático se construye durante los pilotos (D-012). "Hecho con LealTab" va en todos los planes (D-016).

**Contexto de precios:** la competencia local va de MXN 0 a 550 al mes. LealTab compite por servicio y resultados medibles, no por precio.

**Techo realista:** un negocio bootstrapped de ~US$0.55–1.1M de ARR en un escenario optimista. Subir a negocios de 2–5 sucursales es la palanca principal.

## 7. Competencia

- **Locales:** Lealify, Fideliza, SMS Masivos y FIU.
- **Globales:** Loopy, Boomerangme, Stamp Me, Square Loyalty y Smile.io.
- **Sustituto gratuito:** la consola de Google Wallet sin código.

Varios competidores ya ofrecen Apple y Google Wallet. LealTab no compite en eso en el MVP; compite en servicio, en la medición del regreso y en una experiencia web impecable en cualquier teléfono. Si los pilotos muestran que el wallet hace falta, llega como función después.

Hoy no hay una ventaja defendible. La defensa vendrá de la distribución local, del historial de ROI de cada cliente, del costo de cambio y de la velocidad.

## 8. Riesgos principales

1. **Construir antes de validar (D-002).** El MVP se construye antes del primer piloto. Se mitiga con entrevistas en paralelo, un alcance cerrado y la revisión del segmento si a mitad del desarrollo hay menos de 6 pilotos confirmados.
2. **Adopción en caja.** Se mitiga con capacitación, el cartel y la métrica de inscripción.
3. **Experiencia PWA en iOS y en navegadores integrados (D-001).** Se mitiga con la tarjeta funcionando sin instalarse, el modo sin conexión, la guía de "Agregar a inicio" y la recuperación por WhatsApp. Se mide en E6.
4. **Percepción frente a los competidores con wallet.** Se mitiga con el mensaje "sin descargar nada" y midiendo en las entrevistas si el wallet aparece como requisito.
5. **Precio ancla bajo.** Se mitiga vendiendo resultados y apuntando a negocios con más de una sucursal.
6. **Nombre.** Falta la búsqueda de anterioridades en el IMPI y la WIPO (pendiente heredado).
7. **Distribución.** Vender a PyMEs requiere ventas presenciales. Se mide en horas de fundador por cliente (E7).
8. **Privacidad (LFPDPPP).** Con una sola app y "Mis tarjetas", falta la consulta legal sobre el rol de LealTab; es requisito antes del piloto (D-017).
9. **Carga operativa.** Altas, ayuda y soporte por WhatsApp para 20 negocios; y el límite de 200 clientes de Inicio en cafeterías (D-003).

## 9. Hitos por fase

Sin fechas: cada hito se cumple con su criterio (ver el mapa de fases del plan).

| Hito | Estado | Criterio |
|---|---|---|
| Validación de la idea | ✅ | Veredicto GO y competencia mapeada (IMPI/WIPO pendiente) |
| Marca y design system (Fases 1-4) | ✅ | Estrategia, identidad y design system aprobados |
| Landing en línea | ✅ | Publicada en `web/` con CTA "Empieza gratis" |
| PRD del MVP (Fase 6) | 🟡 | Pantallas aprobadas ✅, eventos y requisitos definidos, PRD aprobado |
| MVP en producción (Fase 7) | Pendiente | 1 local real usándolo una semana; ≥10 pilotos confirmados por escrito de ≥3 oficios; entrevistas y consulta legal hechas |
| Gate 1 | Pendiente | Sobre la primera tanda, 3 de 4: ≥60 % activos, ≥40 % pagan al terminar su mes, inscripción mediana ≥30 %, retorno ≥25 % en 21 días (D-004) |
| Gate 2 | Pendiente | ≥15 clientes de pago, MRR ≥ MXN 7,500, churn ≤8%, canal ≤6 h por cliente |
| Gate 3 | Pendiente | MRR ≥ MXN 30,000 con ≥60 clientes |

## 10. Inversión hasta el Gate 1 `[SUPUESTO]`

| Concepto | Costo |
|---|---|
| Hosting y base de datos | USD 20–50/mes |
| Dominio | Ya adquirido |
| Anuncios de prueba | MXN 3,000–5,000 |
| Carteles impresos | ~MXN 1,000–2,000 |
| Apple Developer y motor alquilado | Ya no hacen falta (D-001, D-002) |
| **Total** | **Menos de ~MXN 10,000**, sin contar el tiempo del fundador |

El costo principal es tu tiempo de construcción (duración: Por definir). A esto se suman las comisiones del link de pago y la consulta legal (montos: Por definir).

## 11. Lo que pedimos decidir ahora

Cerradas:
- ~~¿Una PWA por negocio o una sola app LealTab?~~ Una sola app LealTab con "Mis tarjetas" en el MVP (D-013).
- ~~Criterios de los gates~~ Fijados en D-004 y en el mapa de fases del plan.

Abiertas:
1. Precio especial de piloto: monto y cuántos meses dura.
2. ¿Cuántas horas por semana hay para construir y cuántas para vender en persona?
