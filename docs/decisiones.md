# LealTab: Registro de decisiones

Formato: fecha · decisión · motivo · alternativas descartadas · quién decidió.

## D-001 · 4 oct 2026 · La tarjeta digital del MVP es web (PWA), sin Apple Wallet ni Google Wallet

- **Decisión:** en la primera implementación, la tarjeta de lealtad del cliente final vive en la web como PWA y se puede agregar a la pantalla de inicio del celular. No se emiten pases de Apple Wallet ni de Google Wallet.
- **Motivo:** decisión del fundador. Un solo flujo para iPhone y Android, sin depender de certificados ni cuentas de emisor, con control total de la experiencia.
- **Consecuencias:**
  - Ya no hay que firmar `.pkpass`, usar APNs ni la Google Wallet API, así que el alcance técnico baja.
  - La tarjeta debe funcionar sin instalarse. Agregarla a la pantalla de inicio es opcional.
  - En iOS no hay aviso automático de instalación; el cliente lo hace a mano desde Safari (Compartir → Agregar a inicio). Los navegadores integrados en WhatsApp e Instagram no permiten instalar.
  - Las notificaciones web en iOS solo llegan si la PWA está instalada (iOS 16.4 o posterior).
  - Ante competidores que ofrecen wallet, "funciona en el navegador de cualquier celular, sin descargar nada" se vuelve el mensaje. El wallet queda como un posible módulo futuro (LealTab Passes), solo si los clientes lo piden.
- **Alternativa descartada:** Apple Wallet y Google Wallet con una tarjeta web de respaldo (recomendación del informe 01).
- **Decidió:** fundador.

## D-002 · 4 oct 2026 · Desde el MVP, todo es plataforma propia (landing + app), sin marca blanca

- **Decisión:** no se alquila un motor de terceros (Boomerangme, Loopy ni otros) para los pilotos. Los pilotos usan desde el inicio la landing y la app de LealTab.
- **Motivo:** decisión del fundador. Los datos, la experiencia y la marca son propios desde el primer cliente, y no habrá que migrar a nadie después.
- **Consecuencias:**
  - Hay que construir el MVP antes de los pilotos. El Gate 1 pasa de la semana 7 a la semana ~11 (mediados de diciembre de 2026).
  - Sube el riesgo de construir algo que no se use. Se mitiga con entrevistas en paralelo a la construcción y un alcance mínimo y cerrado.
  - Se cancela la Etapa A (concierge sobre motor alquilado) del informe 01. Se mantiene el servicio "hecho por nosotros": instalación, cartel y capacitación.
- **Alternativa descartada:** piloto concierge sobre un motor con marca blanca (recomendación del informe 01).
- **Decidió:** fundador.

## D-003 · 7 oct 2026 · El piloto se amplía a 20 negocios y suma cafeterías

- **Decisión:** el piloto pasa de 5–10 a 20 negocios, idealmente en Villahermosa, en cuatro oficios: barberías, estéticas y salones de belleza, negocios de tapioca y cafeterías. Gimnasios quedan para después.
- **Motivo:** decisión del fundador. Las cafeterías tienen visitas mucho más frecuentes (datos de retención y canjes en semanas) y son el segmento más competido, así que prueban la diferenciación donde es más difícil.
- **Consecuencias:**
  - Los umbrales del Gate 1 se redefinen en D-004.
  - Con cuatro oficios quedan unos 5 negocios por oficio: los resultados por oficio son dirección, no estadística.
  - Más carga operativa en las semanas 6–10 (altas, carteles, capacitación y soporte por WhatsApp para 20 negocios).
  - Las cafeterías ponen a prueba el límite de 200 clientes activos del plan Inicio y la velocidad del cajero en hora pico.
  - Cuidar el mensaje para no caer en "puntos y cupones para cafeterías" (brief).
  - En la landing (v1.7), las cafeterías aparecen en la línea final de "Para quién", no como fila propia; no hay ilustración de cafetería aprobada.
- **Alternativas descartadas:** sumar solo 1–2 cafeterías como prueba de estrés; cambiar tapioca por cafetería; dejar cafeterías para la siguiente ola.
- **Decidió:** fundador.

## D-004 · 7 oct 2026 · Formato del piloto: un mes de prueba gratis por negocio; Gate 1 el 23 dic

- **Decisión:**
  - El fundador recluta en persona hasta 20 negocios. Cada negocio tiene un mes de prueba gratis, que es su piloto, y empieza cuando se le da de alta.
  - El reclutamiento empieza en la Fase 2 (semanas 3–5); del 9 al 17 nov solo se activan pilotos ya confirmados.
  - Fecha límite de altas para el Gate 1: 17 nov. Los que entren después forman una segunda tanda desde el 7 ene y cuentan para el Gate 2.
  - Gate 1 el 23 dic, sobre los negocios dados de alta a más tardar el 17 nov, con criterio único: ≥60 % activos (≥30 inscritos, sellos en 3 de 4 semanas y un canje o 5 segundas visitas), ≥40 % pagan ≥ $299 sin IVA a más tardar su día 37, inscripción mediana ≥30 % y retorno ≥25 % en 21 días. Corte con ≤20 % activos, ≤10 % de conversión o inscripción <10 %.
- **Motivo:** decisión del fundador, con la revisión de `lealtab-analista-metricas`. Medir a cada negocio en su propio mes da datos comparables; cerrar altas el 17 nov deja el último cobro (23 dic) antes de la semana muerta de fiestas.
- **Consecuencias:**
  - Capacidad realista para la primera tanda: 10–14 negocios, no 20.
  - El pago se mide como conversión al terminar la prueba, no durante el piloto.
  - Fase 4 arranca el 7 ene; del 24 dic al 6 ene solo correcciones.
  - Hay que registrar fecha de alta y versión del producto por negocio.
- **Alternativas descartadas:** evaluar a los 20 aunque entren tarde; criterios distintos por ciclo de visita; esperar a tener los 20 (llevaría el Gate 1 a febrero); altas en olas fijas.
- **Decidió:** fundador.
