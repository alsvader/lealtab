# LealTab: Registro de decisiones

Formato: fecha · decisión · motivo · alternativas descartadas · quién decidió.

> **Nota (20 oct 2026):** la fecha del encabezado de cada decisión es solo el registro de cuándo se tomó. Los planes ya no llevan calendario: se organizan por fase con criterio de salida (ver `docs/02-plan-de-trabajo.md`). Las fechas de calendario que tenían D-002 y D-004 se quitaron y se dejan como criterios.

## D-001 · 4 oct 2026 · La tarjeta digital del MVP es web (PWA), sin Apple Wallet ni Google Wallet

- **Decisión:** en la primera implementación, la tarjeta de lealtad del cliente final vive en la web como PWA y se puede agregar a la pantalla de inicio del celular. No se emiten pases de Apple Wallet ni de Google Wallet.
- **Motivo:** decisión del fundador. Un solo flujo para iPhone y Android, sin depender de certificados ni cuentas de emisor, con control total de la experiencia.
- **Consecuencias:**
  - Ya no hay que firmar `.pkpass`, usar APNs ni la Google Wallet API, así que el alcance técnico baja.
  - La tarjeta debe funcionar sin instalarse. Agregarla a la pantalla de inicio es opcional.
  - En iOS no hay aviso automático de instalación; el cliente lo hace a mano desde Safari (Compartir → Agregar a inicio). Los navegadores integrados en WhatsApp e Instagram no permiten instalar.
  - Las notificaciones web en iOS solo llegan si la PWA está instalada (iOS 16.4 o posterior).
  - Ante competidores que ofrecen wallet, "funciona en el navegador de cualquier celular, sin descargar nada" se vuelve el mensaje. El wallet queda como un posible módulo futuro (LealTab Passes), solo si los clientes lo piden. *(Actualizado en D-007: Wallet es una función que llega después, no un módulo con nombre propio.)*
- **Alternativa descartada:** Apple Wallet y Google Wallet con una tarjeta web de respaldo (recomendación del informe 01).
- **Decidió:** fundador.

## D-002 · 4 oct 2026 · Desde el MVP, todo es plataforma propia (landing + app), sin marca blanca

- **Decisión:** no se alquila un motor de terceros (Boomerangme, Loopy ni otros) para los pilotos. Los pilotos usan desde el inicio la landing y la app de LealTab.
- **Motivo:** decisión del fundador. Los datos, la experiencia y la marca son propios desde el primer cliente, y no habrá que migrar a nadie después.
- **Consecuencias:**
  - Hay que construir el MVP antes de los pilotos. El Gate 1 queda después de la fase de desarrollo del MVP, no en paralelo.
  - Sube el riesgo de construir algo que no se use. Se mitiga con entrevistas en paralelo a la construcción y un alcance mínimo y cerrado.
  - Se cancela la Etapa A (concierge sobre motor alquilado) del informe 01. Se mantiene el servicio "hecho por nosotros": instalación, cartel y capacitación. *(Sustituido en parte por D-005: el alta ahora la hace el propio negocio; en el piloto queda la ayuda de arranque.)*
- **Alternativa descartada:** piloto concierge sobre un motor con marca blanca (recomendación del informe 01).
- **Decidió:** fundador.

## D-003 · 7 oct 2026 · El piloto se amplía a 20 negocios y suma cafeterías

- **Decisión:** el piloto pasa de 5–10 a 20 negocios, idealmente en Villahermosa, en cuatro oficios: barberías, estéticas y salones de belleza, negocios de tapioca y cafeterías. Gimnasios quedan para después.
- **Motivo:** decisión del fundador. Las cafeterías tienen visitas mucho más frecuentes (datos de retención y canjes en semanas) y son el segmento más competido, así que prueban la diferenciación donde es más difícil.
- **Consecuencias:**
  - Los umbrales del Gate 1 se redefinen en D-004.
  - Con cuatro oficios quedan unos 5 negocios por oficio: los resultados por oficio son dirección, no estadística.
  - Más carga operativa durante la fase de pilotos (altas, carteles, capacitación y soporte por WhatsApp para 20 negocios).
  - Las cafeterías ponen a prueba el límite de 200 clientes activos del plan Inicio y la velocidad del cajero en hora pico.
  - Cuidar el mensaje para no caer en "puntos y cupones para cafeterías" (brief).
  - En la landing (v1.7), las cafeterías aparecen en la línea final de "Para quién", no como fila propia; no hay ilustración de cafetería aprobada.
- **Alternativas descartadas:** sumar solo 1–2 cafeterías como prueba de estrés; cambiar tapioca por cafetería; dejar cafeterías para la siguiente ola.
- **Decidió:** fundador.

## D-004 · 7 oct 2026 · Formato del piloto: un mes de prueba gratis por negocio; criterios del Gate 1

- **Decisión:**
  - El fundador recluta en persona hasta 20 negocios. Cada negocio tiene un mes de prueba gratis, que es su piloto, y empieza cuando se le da de alta.
  - El reclutamiento empieza durante la fase de desarrollo del MVP; al abrir los pilotos solo se activan pilotos ya confirmados.
  - Hay un corte de altas para la primera tanda, que es la que cuenta para el Gate 1. Los que entren después forman una segunda tanda y cuentan para el Gate 2. Fecha del corte: Por definir (sin calendario por ahora).
  - Gate 1 sobre los negocios de la primera tanda, cuando todos terminen su mes y su ventana de cobro, con criterio único: ≥60 % activos (≥30 inscritos, sellos en 3 de 4 semanas y un canje o 5 segundas visitas), ≥40 % pagan ≥ $299 sin IVA a más tardar su día 37, inscripción mediana ≥30 % y retorno ≥25 % en 21 días. Corte con ≤20 % activos, ≤10 % de conversión o inscripción <10 %.
- **Motivo:** decisión del fundador, con la revisión de `lealtab-analista-metricas`. Medir a cada negocio en su propio mes da datos comparables; el corte de altas evita que la ventana de cobro caiga en temporadas muertas.
- **Consecuencias:**
  - Capacidad realista para la primera tanda: 10–14 negocios, no 20.
  - El pago se mide como conversión al terminar la prueba, no durante el piloto.
  - La fase de producto v1 arranca después del Gate 1; mientras tanto, solo correcciones.
  - Hay que registrar fecha de alta y versión del producto por negocio.
- **Alternativas descartadas:** evaluar a los 20 aunque entren tarde; criterios distintos por ciclo de visita; esperar a tener los 20; altas en olas fijas.
- **Sustituido en parte (20 oct 2026):** las fechas originales (corte de altas, Gate 1, segunda tanda) se quitaron por la regla de planear sin calendario. El cobro al terminar la prueba se detalla en D-012.
- **Decidió:** fundador.

## D-005 · 4 oct 2026 · El negocio se da de alta solo, sin llamada de ventas

- **Decisión:** el alta es autoservicio desde el MVP: cuenta, datos del negocio, tarjeta y cartel QR en menos de 5 minutos, sin llamada de ventas y sin tarjeta de crédito durante la prueba (flujo F1, pantallas N1 a N4). El dueño entra con correo + código (el código dura 10 minutos) **o** con contraseña. *(Cambio 21 oct 2026, decisión de Aarón: antes era solo código por correo, sin contraseña. Se agrega la contraseña opcional con restablecimiento por correo; N1 se ajusta.)*
- **Motivo:** decisión del fundador (Fase 1, elementos de confianza del MVP; diseño aprobado en la Fase 6).
- **Consecuencias:** sustituye el "alta la haces tú" y el "autoservicio fuera" del plan original, y la cuña "hecho por nosotros en 24 h" de la propuesta. En el piloto queda la ayuda de arranque en persona y por WhatsApp.
- **Decidió:** fundador.

## D-006 · 6 oct 2026 · Precios y planes públicos

- **Decisión:** precios públicos en la web. Prueba gratis de 30 días; **Inicio** $299 MXN/mes + IVA (200 clientes, 1 tarjeta, 1 sucursal); **Negocio** ~$449 MXN/mes + IVA, recomendado (ilimitado, varias tarjetas, hasta 3 sucursales); **Pro** "Próximamente", sin precio. Al terminar la prueba sin pagar, la cuenta se pausa y los datos se pueden exportar. El precio de fundador solo se ofrece en trato directo con los pilotos.
- **Motivo:** decisión del fundador (Fase 1 y Fase 5). Confirmado contra `web/`.
- **Consecuencias:** sustituye la hipótesis de $399 base + $299 por sucursal de `03-propuesta.md`.
- **Decidió:** fundador.

## D-007 · 4 oct 2026 · Los módulos llevan nombres en español

- **Decisión:** LealTab es la marca madre y dentro del producto los módulos se llaman Tarjeta, Clientes, Avisos, Campañas y Reportes. Al lanzar solo hay Tarjeta y Clientes. "LealTab + nombre" queda solo para la API o la expansión. Wallet es una función que llega después.
- **Motivo:** arquitectura de marca aprobada en la Fase 1.
- **Consecuencias:** sustituye Wallet, Rewards, Campaigns, CRM y Passes como nombres de módulo.
- **Decidió:** fundador.

## D-008 · 20 oct 2026 · La fuente de verdad de la landing es `web/`

- **Decisión:** la landing vive en `web/` (Next.js). Lo que diga `web/` manda sobre los mockups v1.x y los documentos de análisis de la landing, que quedan como historial.
- **Decidió:** fundador.

## D-009 · 20 oct 2026 · Fase 5 en pausa y Fase 6 en curso

- **Decisión:** la Fase 5 (Marketing) se pausa y arranca la Fase 6 (Diseño de producto del MVP). Marketing no avanza hasta que se retome.
- **Decidió:** fundador.

## D-010 · 20 oct 2026 · Mapa de flujos del MVP aprobado

- **Decisión:** el MVP se define por el mapa de flujos de la Fase 6 (`06-product-design/01-mapa-de-flujos-mvp.md`): panel del negocio N0 a N8 y tarjeta del cliente C0 a C5.
  - La visita se registra cuando el staff escanea el QR personal del cliente en **N5 Mostrador**, dentro del panel; si la cámara falla, se busca al cliente por WhatsApp. El QR fijo del mostrador solo sirve para registrarse.
  - **Una sola cuenta compartida por negocio** en el MVP; los usuarios de staff con permisos llegan después.
  - **En riesgo:** cliente sin volver en más del doble de su intervalo habitual, con mínimo de 30 días.
  - **Sello de bienvenida:** interruptor en N3. Si está prendido, el sello se da en automático al crear la tarjeta, sin confirmación del staff.
  - Exportar CSV, aviso de privacidad y "Ayuda por WhatsApp" son parte del MVP.
- **Consecuencias:** sustituye la PWA de cajero aparte (`/caja/`), el PIN por empleado y "en riesgo = más de 30 días" del plan original.
- **Decidió:** fundador.

## D-011 · 20 oct 2026 · El resumen semanal vive solo en el panel

- **Decisión:** el resumen semanal entra al MVP como la pantalla N0 Inicio, lo primero que ve el dueño al entrar. No se envía por WhatsApp. Se mide con el evento `resumen_semanal_visto` (negocio, semana).
- **Motivo:** es más simple y no depende de la API de WhatsApp Business (cobro por mensaje y plantillas aprobadas).
- **Consecuencias:** si en el piloto pocos dueños lo abren, en la v1 se evalúa un aviso por WhatsApp o correo.
- **Cambio parcial (21 oct 2026, decisión de Aarón):** el MVP **sí usa la API de WhatsApp Business (de pago)** para un caso: el código con el que el cliente recupera su tarjeta (o sus tarjetas) cuando cambia de teléfono. El resumen semanal sigue solo en el panel. Pendiente: costo por mensaje y configuración de la API (cuenta, número y plantilla aprobada).
- **Alternativa descartada:** resumen semanal por WhatsApp.
- **Decidió:** fundador.

## D-012 · 20 oct 2026 · Cobro al terminar la prueba del piloto

- **Decisión:** al terminar su mes gratis, el negocio del piloto paga con un link de pago de Stripe o Mercado Pago, a un precio especial de piloto durante los primeros meses. En el MVP, "Activar mi plan" (N8) abre WhatsApp, donde se envía el link. El cobro automático se construye durante la fase de pilotos.
- **Por definir:** el monto del precio especial y cuántos meses dura.
- **Consecuencias:** sustituye el cobro manual por SPEI o transferencia registrado en la app. El pago en línea dentro del producto (CFDI, OXXO/SPEI) queda para después.
- **Decidió:** fundador.

## D-013 · 20 oct 2026 · ADR-001 decidido: una sola app LealTab con "Mis tarjetas" en el MVP

- **Decisión:** opción B del ADR-001. Hay una sola PWA LealTab; el cliente tiene las tarjetas de varios negocios en la misma app (C0 Mis tarjetas) desde el MVP. La cuenta del cliente se identifica por su WhatsApp. Cada tarjeta sigue con la marca del negocio.
- **Consecuencias:** cambia el mapa de flujos, que dejaba "Mis tarjetas" para después. Las validaciones del ADR siguen pendientes (D-017).
- **Alternativa descartada:** una PWA por negocio (opción H), que queda como respaldo si fallan las validaciones.
- **Decidió:** fundador.

## D-014 · 20 oct 2026 · Reglas contra el abuso de sellos

- **Decisión:**
  - El QR personal del cliente cambia cada 60 segundos, para que no sirva una captura de pantalla. El mostrador lo puede validar sin conexión, con 10 minutos de margen.
  - Por defecto, **1 sello por cliente por día**, que se reinicia a medianoche en la zona horaria del negocio. En N8 Ajustes el negocio puede cambiarlo a "1 cada X horas" o a "Sin límite" (con advertencia). En "1 cada X horas", **cada negocio elige X libremente**: 2 h es solo una sugerencia, no un mínimo obligatorio. El piso de cualquier regla es el bloqueo fijo de 2 minutos contra escaneos dobles. *(Aclarado 21 oct 2026, decisión de Aarón.)*
  - Siempre hay un bloqueo **fijo de 2 minutos** contra escaneos dobles, también con "Sin límite". *(Actualizado 21 oct 2026, decisión de Aarón: antes decía "de 1 a 2 minutos".)*
  - Queda registrado quién dio cada sello y cuándo (con la cuenta compartida, "quién" es el dispositivo del mostrador), visible en el historial de N7.
- **Motivo:** ninguna plataforma revisada limita a un sello por semana; la mayoría deja el límite al negocio y la protección real es la confirmación del staff con registro (`06-product-design/investigacion-limite-sellos.md`).
- **Alternativa descartada:** 1 sello por semana.
- **Decidió:** fundador.

## D-015 · 20 oct 2026 · La app trabaja sin conexión primero

- **Decisión:** el mostrador y la tarjeta funcionan sin conexión. Cada sello o canje se guarda en el teléfono con un identificador único y la firma del dispositivo, y se sincroniza en segundo plano al volver la conexión. El servidor es la fuente de verdad; lo que rechaza va a Clientes → Por revisar.
- **Canje sin conexión:** permitido solo si la tarjeta está completa y se sincronizó en las últimas 24 h, y máximo un canje por tarjeta mientras dure el modo sin conexión.
- **Decidió:** fundador.

## D-016 · 20 oct 2026 · "Hecho con LealTab" va en todos los planes

- **Decisión:** la leyenda va siempre, en todos los planes (Pro incluido), en la tarjeta del cliente y en el cartel del mostrador.
- **Consecuencias:** se cierra el pendiente de la Fase 1; no hay variante sin leyenda.
- **Decidió:** fundador.

## D-017 · 20 oct 2026 · Validaciones pendientes antes del piloto

- **Decisión:** no se han hecho ni las entrevistas con dueños sobre el ícono de la app ni la consulta legal de privacidad (LFPDPPP) que pide el ADR-001. Las dos son requisito antes de arrancar el piloto (criterio de salida de la fase de desarrollo del MVP).
- **Decidió:** fundador.

## D-018 · 21 oct 2026 · Analítica propia, sin cookies

- **Decisión:** la analítica de uso del MVP es propia (eventos registrados por LealTab en su propio servidor), sin cookies y sin herramientas de analítica de terceros. Los eventos son los de `06-product-design/07-entrega-desarrollo.md` §5.
- **Condición:** antes de arrancar el piloto hay que actualizar el aviso de privacidad para que cubra los eventos de uso (qué se registra, para qué y por cuánto tiempo).
- **Consecuencias:** el aviso actual de lealtab.com dice que no hay cookies ni analítica; esa línea se reescribe para el producto. Se suma a la consulta legal LFPDPPP (D-017).
- **Decidió:** fundador.

## D-019 · 21 oct 2026 · Cada negocio guarda su propio nombre del cliente; el teléfono es el único identificador global

- **Decisión:** se adopta el modelo de identidad del ADR-001 §6. La `identidad` de plataforma solo guarda el teléfono (WhatsApp en E.164), que es el **único identificador global**, y sus sesiones. Cada negocio tiene su propio `cliente_negocio` con el nombre que el cliente dio en ese negocio, su consentimiento, su fecha de alta y su estado (`activa` o `por_confirmar`). La tarjeta y los eventos cuelgan del `cliente_negocio` y siempre llevan `negocio_id`.
- **Motivo:** mantiene separados los datos de cada negocio (un negocio nunca ve el nombre que el cliente dio en otro) y sostiene la propuesta de que LealTab actúe como encargado, pendiente de la consulta legal (D-017).
- **Consecuencias:** sustituye la entidad `cliente` con nombre global de `06-product-design/07-entrega-desarrollo.md` §3. Una tarjeta nueva ligada a un teléfono sin sesión nace `por_confirmar` y no aparece en Mis tarjetas hasta que el cliente la acepta en la app o el cajero la verifica al dar el primer sello (ADR-001 §5.2, punto 6).
- **Decidió:** fundador.

## D-020 · 21 oct 2026 · Sin límite de clientes en el plan Inicio durante el piloto

- **Decisión:** durante el piloto, los negocios no tienen límite de clientes en el plan Inicio. El límite público de 200 clientes de Inicio (D-006) no se aplica en el piloto.
- **Por definir:** qué pasa al llegar a 200 clientes en Inicio después del piloto, y si cuentan los clientes totales o los activos (D-003 dice «activos»).
- **Motivo:** las cafeterías ponían a prueba el límite de 200 (D-003); quitarlo en el piloto evita frenar a un negocio a mitad de su prueba.
- **Decidió:** fundador.

## D-021 · 21 oct 2026 · El MVP maneja una sola sucursal

- **Decisión:** el MVP soporta **una sucursal** por negocio. Varias sucursales, **hasta 3** (plan Negocio), llegan después del MVP.
- **Consecuencias:** el cliente ideal se describe como negocios de 1 a 3 sucursales (antes `03-propuesta.md` decía 1–4). La landing en `web/` tiene una inconsistencia: `pricing.ts` ofrece "Hasta 3 sucursales" en el plan Negocio y `roadmap.ts` lista "Varias sucursales" como "Próximamente". Se alinea cuando se retome la Fase 5 (Marketing); `web/` no se toca ahora.
- **Decidió:** fundador.

## D-022 · 21 oct 2026 · El producto vive en lealtab.com, con las rutas /c/ y /panel/

- **Decisión:** el producto se sirve en el dominio principal `lealtab.com`: la app del cliente en `/c/` y el panel del negocio (incluido N5 Mostrador) en `/panel/`. No se usa `app.lealtab.com`.
- **Motivo:** es la estructura del ADR-001 §5.2: un solo origen, el scope de la PWA en `/c/` cubre las URLs del QR del mostrador y el panel queda fuera de la app del cliente.
- **Consecuencias:** sustituye "Producto en app.lealtab.com" de `01-brand-strategy/identidad-de-marca.md` y la mención en `docs/fase-2/legal-notas.md`. La landing sigue en `/` (`web/`, D-008).
- **Decidió:** fundador.

## D-023 · 21 oct 2026 · Stack del producto

- **Decisión:**
  - **Lenguaje y framework:** TypeScript + Next.js (App Router), en el mismo proyecto que la landing (`web/`), con las rutas `/c/` y `/panel/` (D-022).
  - **Interfaz y paquetes:** Tailwind + shadcn/ui y pnpm, como en `web/`.
  - **Datos y acceso:** Supabase: Postgres, Auth (correo + código o contraseña, D-005) y RLS que filtra por `negocio_id`.
  - **Analítica:** los eventos de uso van a una tabla propia en Supabase, sin cookies y sin PostHog (D-018).
  - **Alojamiento:** Vercel, junto con la landing.
  - **Código de recuperación por WhatsApp (D-011):** se envía con el hook de teléfono/OTP de Supabase Auth, con un proveedor externo configurado en Supabase. Proveedor: **Por definir**.
  - **Escaneo del QR:** una librería de escaneo en el navegador. Librería: **Por definir**.
  - **Cobro:** link de pago de Stripe o Mercado Pago, sin cambios (D-012).
  - **Reglas de frontend (agregadas el 21 oct 2026):** React Server Components por defecto; Tailwind CSS; shadcn/ui como capa estándar de componentes base.
  - **Reglas de infraestructura (agregadas el 21 oct 2026):**
    - La app está lista para contenedores: Docker, Docker Compose y un Dockerfile multi-stage.
    - En local, Docker Compose levanta Supabase con sus contenedores y la app web.
    - En producción, Vercel compila `web/`; no despliega el contenedor.
    - Todo cambio a la base de datos es una migración de Supabase en `supabase/migrations`. Las migraciones corren durante el build de Vercel.
- **Motivo:** un solo proyecto y un solo despliegue para la landing y el producto, en el mismo origen que pide D-022. Detalle en `docs/fase-2/adr/002-stack.md`.
- **Consecuencias:**
  - Sustituye la mención de PostHog en `.claude/agents/lealtab-desarrollador.md`. Ese archivo hay que actualizarlo en el repo; no se tocó aquí.
  - Confirma las opciones que el ADR-001 §6 y `01-validacion-idea.md` §7.2 dejaban abiertas («Supabase si usamos»).
  - Vercel, Supabase y el proveedor del código por WhatsApp tratan datos por cuenta de LealTab. La revisión de cookies, de si se nombran en el aviso y de si tratan datos fuera de México (`legal-notas.md` §3, riesgo 6) entra en la consulta legal (D-017) y en la actualización del aviso (D-018).
- **Decidió:** fundador.
