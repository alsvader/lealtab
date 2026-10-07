# LealTab: Informe 03, Propuesta de producto

> **Versión 0.2, 4 oct 2026.** Incorpora D-001 (tarjeta web PWA) y D-002 (plataforma propia desde el MVP). Ver `docs/decisiones.md`.
> Base: `docs/01-validacion-idea.md`. Calendario: `docs/02-plan-de-trabajo.md`. Lo marcado como `[SUPUESTO]` está pendiente de validar.

## 1. En una frase

**LealTab ayuda a cafeterías, panaderías y barberías independientes a que sus clientes regresen, con una tarjeta de lealtad web que se abre desde un QR, funciona en cualquier celular sin descargar nada y le dice al dueño cada semana cuántos clientes volvieron.**

## 2. Problema

- Los negocios de visita recurrente dependen de que el cliente vuelva, pero usan tarjetas de cartón que se pierden y se prestan a trampas, o no usan nada.
- El dueño no sabe cuántos clientes regresan ni si lo que hace para retenerlos funciona.
- Las herramientas que existen son baratas, pero el dueño tiene que configurarlas solo. Además, varias dependen de la app o del wallet del cliente, y prometen "+30% de ventas" sin medirlo.

## 3. Cliente ideal

Dueño-operador de un negocio de visita recurrente:
- 1–4 sucursales, empezando en Villahermosa
- Ticket ≥ MXN 120 y clientes que vuelven ≥2 veces al mes
- Clientela de 18–40 años, activa en Instagram y WhatsApp
- Decide él mismo

**Primer vertical:** cafeterías de especialidad y panaderías artesanales. **Segundo vertical para comparar:** barberías y estéticas.

**Fuera por ahora:**
- Abarrotes
- Cadenas grandes
- E-commerce
- Gimnasios
- Farmacias

## 4. Solución y cuña

| Cuña | Qué recibe | Estado |
|---|---|---|
| **Regreso medible** | Resumen semanal por WhatsApp: "volvieron N clientes que llevaban 30+ días sin venir; ingreso estimado $X" | `[SUPUESTO]`, se prueba en E8 |
| **Sin descargar nada, en cualquier celular** | El cliente escanea el QR, deja su nombre y su WhatsApp, y ya tiene su tarjeta en el navegador. Si quiere, la agrega a su pantalla de inicio. Su número sirve de respaldo para recuperarla. | `[SUPUESTO]`, se prueba en E6 (adaptado a la PWA) |
| **Hecho por nosotros en 24 h** | Tarjeta con la marca del negocio, cartel QR, capacitación de 15 min al cajero y soporte en español por WhatsApp | `[SUPUESTO]`, se prueba en los pilotos |

El estándar premium se aplica donde se ve: la tarjeta web, el cartel, la app del cajero y el resumen semanal.

**Plataforma propia desde el primer cliente.** La landing y la app son de LealTab: los datos, la experiencia y la marca son propios desde el día uno, sin migraciones posteriores.

**Lo que no somos (todavía):** una plataforma de 9 módulos. La arquitectura de marca madre (Wallet, Rewards, Campaigns, CRM, Passes…) se mantiene como dirección, y cada módulo llega cuando ≥3 clientes de pago lo piden.

## 5. Producto (MVP, semanas 2–5)

| Para quién | Qué hace |
|---|---|
| **Cliente final** | Tarjeta web con la marca del negocio: sellos, premio y QR personal rotativo. Instalable como PWA, visible sin conexión con el último estado y recuperable por WhatsApp. |
| **Cajero** | PWA para escanear el QR o buscar por teléfono, sellar en menos de 5 segundos y confirmar canjes. PIN por empleado. |
| **Dueño** | Panel con clientes nuevos, visitas, canjes, clientes en riesgo y tasa de retorno, más un resumen semanal por WhatsApp |
| **LealTab (tú)** | Alta del negocio, configuración del premio y las sucursales, registro de cobros manuales |
| **Público** | Landing en lealtab.com con CTA a WhatsApp |

El detalle completo del alcance, lo que queda fuera y los riesgos de la PWA está en la sección 3 del plan.

## 6. Modelo de negocio `[SUPUESTO]`

| Concepto | Hipótesis |
|---|---|
| Precio base | MXN 399/mes por negocio (1 sucursal); se probarán 299, 499 y 799 |
| Sucursal adicional | MXN 299/mes |
| Anual | Prepago con 2 meses gratis |
| Configuración | Incluida |

**Contexto de precios:** la competencia local va de MXN 0 a 550 al mes. LealTab compite por servicio y resultados medibles, no por precio.

**Techo realista:** un negocio bootstrapped de ~US$0.55–1.1M de ARR en un escenario optimista. Subir a negocios de 2–5 sucursales es la palanca principal.

## 7. Competencia

- **Locales:** Lealify, Fideliza, SMS Masivos y FIU.
- **Globales:** Loopy, Boomerangme, Stamp Me, Square Loyalty y Smile.io.
- **Sustituto gratuito:** la consola de Google Wallet sin código.

Varios competidores ya ofrecen Apple y Google Wallet. LealTab no compite en eso en el MVP; compite en servicio, en la medición del regreso y en una experiencia web impecable en cualquier teléfono. Si los pilotos muestran que el wallet hace falta, entra como el módulo LealTab Passes.

Hoy no hay una ventaja defendible. La defensa vendrá de la distribución local, del historial de ROI de cada cliente, del costo de cambio y de la velocidad.

## 8. Riesgos principales

1. **Construir antes de validar (D-002).** El MVP se construye antes del primer piloto. Se mitiga con entrevistas en paralelo, un alcance cerrado y el corte de la semana 4 si hay menos de 3 pilotos confirmados.
2. **Adopción en caja.** Se mitiga con capacitación, el cartel y la métrica de inscripción.
3. **Experiencia PWA en iOS y en navegadores integrados (D-001).** Se mitiga con la tarjeta funcionando sin instalarse, la guía de "Agregar a inicio" y la recuperación por WhatsApp. Se mide en E6.
4. **Percepción frente a los competidores con wallet.** Se mitiga con el mensaje "sin descargar nada" y midiendo en las entrevistas si el wallet aparece como requisito.
5. **Precio ancla bajo.** Se mitiga vendiendo resultados y apuntando a negocios con más de una sucursal.
6. **Nombre.** Hay que buscar anterioridades en el IMPI antes de invertir en la identidad.
7. **Distribución.** Vender a PyMEs requiere ventas presenciales. Se mide en horas de fundador por cliente (E7).

## 9. Hitos

| Hito | Fecha aprox. | Criterio |
|---|---|---|
| Fase 0 | 11 oct 2026 | Marca viable y 40 negocios en la lista |
| Landing en línea | 18 oct 2026 | Publicada con CTA a WhatsApp |
| MVP en producción | 8 nov 2026 | 1 local real usándolo una semana; ≥10 pilotos confirmados por escrito con alta ≤17 nov |
| Gate 1 | 23 dic 2026 | Sobre los pilotos con alta ≤17 nov, 3 de 4: ≥60 % activos, ≥40 % pagan al terminar su mes, inscripción mediana ≥30 %, retorno ≥25 % en 21 días (D-004) |
| Gate 2 | ~21 feb 2027 | ≥15 clientes de pago, MRR ≥ MXN 7,500, churn ≤8%, canal ≤6 h por cliente |
| Gate 3 | Por definir | MRR ≥ MXN 30,000 con ≥60 clientes |

## 10. Inversión hasta el Gate 1 `[SUPUESTO]`

| Concepto | Costo |
|---|---|
| Hosting y base de datos | USD 20–50/mes |
| Dominio | Ya adquirido |
| Anuncios de prueba | MXN 3,000–5,000 |
| Carteles impresos | ~MXN 1,000–2,000 |
| Apple Developer y motor alquilado | Ya no hacen falta (D-001, D-002) |
| **Total** | **Menos de ~MXN 10,000**, sin contar el tiempo del fundador |

El costo principal es tu tiempo de construcción: 4 semanas estimadas.

## 11. Lo que pedimos decidir ahora

1. ¿Una PWA por negocio o una sola app LealTab con todas las tarjetas? (pregunta de la sección 7 del plan)
2. ¿Cuántas horas por semana hay para construir y cuántas para vender en persona?
3. Fijar hoy los criterios de los gates en `docs/gates.md` y no moverlos después.
