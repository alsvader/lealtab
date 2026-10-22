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
  - Hay que registrar fecha de alta y versión del producto por negocio. *(Aclarado 21 oct 2026, decisión de Aarón: `alta_ts`, `tanda` y `version_producto` van como columnas de `negocio`; las escribe el servidor y el dueño no las edita.)*
- **Alternativas descartadas:** evaluar a los 20 aunque entren tarde; criterios distintos por ciclo de visita; esperar a tener los 20; altas en olas fijas.
- **Sustituido en parte (20 oct 2026):** las fechas originales (corte de altas, Gate 1, segunda tanda) se quitaron por la regla de planear sin calendario. El cobro al terminar la prueba se detalla en D-012.
- **Decidió:** fundador.

## D-005 · 4 oct 2026 · El negocio se da de alta solo, sin llamada de ventas

- **Decisión:** el alta es autoservicio desde el MVP: cuenta, datos del negocio, tarjeta y cartel QR en menos de 5 minutos, sin llamada de ventas y sin tarjeta de crédito durante la prueba (flujo F1, pantallas N1 a N4). El dueño entra con correo + código (el código dura 10 minutos) **o** con contraseña. *(Cambio 21 oct 2026, decisión de Aarón: antes era solo código por correo, sin contraseña. Se agrega la contraseña opcional con restablecimiento por correo; N1 se ajusta.)*
- **Aclarado (21 oct 2026, decisión de Aarón, cierra PQ-10 y PQ-28):**
  - La contraseña es opcional y aparece plegada en N1; N8 tiene una fila «Acceso» para crearla o cambiarla.
  - Para entrar hay pestañas «Con código» y «Con contraseña».
  - La contraseña se restablece con un código de 6 dígitos que dura 10 minutos y lleva de 8 a 72 caracteres, sin reglas de composición.
  - 5 fallos seguidos pausan la contraseña 15 minutos; el código por correo sigue disponible.
  - «Cerrar otras sesiones» va desmarcada al restablecer.
  - Los correos de Auth del dueño salen por SMTP propio con **Resend** (D-024).
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
- **Aclarado (21 oct 2026, decisión de Aarón):** el proveedor del código es SMS Masivos con el hook de SMS de Supabase Auth (D-024). El código va por WhatsApp y, como respaldo, por **SMS** con el mismo proveedor (automático si el envío falla y a petición del cliente). El resumen semanal sigue solo en el panel y la API de WhatsApp no se usa para nada más. Queda por confirmar por escrito con el proveedor que su OTP por WhatsApp usa la API oficial de Meta (PQ-30).
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
  - En "1 cada X horas", **X se captura en horas, con hasta 2 decimales y 0 < X ≤ 24, y se guarda en minutos enteros.** La ventana es **móvil**: se mide desde el último sello aceptado, no desde la medianoche. El límite efectivo nunca baja del bloqueo fijo de 2 minutos. *(Aclarado 21 oct 2026, decisión de Aarón, cierra PQ-22 b.)*
  - La zona horaria del negocio es un nombre IANA tomado del navegador en N2, validado contra las zonas de México y con `America/Mexico_City` de respaldo; se puede editar en N8. El «día» del límite se calcula en el servidor con esa zona. *(Aclarado 21 oct 2026, decisión de Aarón, cierra PQ-22 a.)*
  - El límite es visible para el cliente: C3 muestra una línea con el límite bajo el QR y una hoja «Términos de la tarjeta»; C1 no cambia. *(Aclarado 21 oct 2026, decisión de Aarón, cierra PQ-06.)*
  - Siempre hay un bloqueo **fijo de 2 minutos** contra escaneos dobles, también con "Sin límite". *(Actualizado 21 oct 2026, decisión de Aarón: antes decía "de 1 a 2 minutos".)*
  - Queda registrado quién dio cada sello y cuándo (con la cuenta compartida, "quién" es el dispositivo del mostrador), visible en el historial de N7.
- **Motivo:** ninguna plataforma revisada limita a un sello por semana; la mayoría deja el límite al negocio y la protección real es la confirmación del staff con registro (`06-product-design/investigacion-limite-sellos.md`).
- **Alternativa descartada:** 1 sello por semana.
- **Decidió:** fundador.

## D-015 · 20 oct 2026 · La app trabaja sin conexión primero

- **Decisión:** el mostrador y la tarjeta funcionan sin conexión. Cada sello o canje se guarda en el teléfono con un identificador único y la firma del dispositivo, y se sincroniza en segundo plano al volver la conexión. El servidor es la fuente de verdad; lo que rechaza va a Clientes → Por revisar.
- **Canje sin conexión:** permitido solo si la tarjeta está completa y se sincronizó en las últimas 24 h, y máximo un canje por tarjeta mientras dure el modo sin conexión.
- **Aclarado (21 oct 2026, decisión de Aarón):**
  - **El mostrador debe abrirse con conexión; después funciona sin ella.** En el piloto no hay un segundo service worker en `/panel/` (se descarta el ADR-005 propuesto): N5 usa solo la cola en IndexedDB. Si la red se cae con N5 abierto, sigue registrando; si N5 se cierra o se recarga sin red, no abre hasta que vuelva la conexión, y la cola se conserva.
  - La sincronización ocurre al abrir N5, con `visibilitychange`, con `online`, cada 30 s y con un botón. Background Sync no es requisito.
  - Se mide cuántas veces N5 se cerró o recargó durante una caída: se guarda `offline_since` en IndexedDB y se emite un evento (nombre provisional `mostrador_reabierto_tras_caida`; el final lo decide `lealtab-analista-metricas`). Si la métrica sale alta, se reevalúa un service worker para N5.
  - RNF-PWA-04 se queda con un solo service worker, en `/c/`.
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
- **Consecuencias:** sustituye la entidad `cliente` con nombre global de `06-product-design/07-entrega-desarrollo.md` §3. Una tarjeta nueva ligada a un teléfono sin sesión nace `por_confirmar` y no aparece en Mis tarjetas hasta que el cliente la acepta en la app o el cajero la verifica al dar el primer sello (ADR-001 §5.2, punto 6). *(Aclaración del 22 oct 2026, D-031: el estado `por_confirmar` desaparece; sin sesión, el segundo negocio pide WhatsApp y código. La `identidad` ahora se liga a `auth.users` con `auth_user_id`.)*
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
  - **Código de recuperación por WhatsApp (D-011):** se envía con el hook de teléfono/OTP de Supabase Auth, con un proveedor externo configurado en Supabase. Proveedor: **SMS Masivos** *(completado el 21 oct 2026, D-024)*.
  - **Escaneo del QR:** una librería de escaneo en el navegador. Librería: **Por definir** (PQ-25): antes de construir N5 se prueban `qr-scanner` y `barcode-detector` (con el `.wasm` autoalojado) en un iPhone y un Android reales y gana la más ligera que pase. *(Aclarado 21 oct 2026, decisión de Aarón.)*
  - **Correo del dueño:** los correos de Auth salen por SMTP propio con Resend *(agregado el 21 oct 2026, D-024)*.
  - **Detalles aprobados el 21 oct 2026 (aclaraciones, no cambian el stack):**
    - Exportación CSV en dos archivos, `clientes.csv` y `visitas.csv`, con las fórmulas neutralizadas (PQ-22 c).
    - Se aprueban las metas de rendimiento y disponibilidad de RNF-REN-02 y RNF-REN-04. El plan de hosting y los respaldos quedan atados a la PQ-29 (PQ-24).
    - La sesión del cliente es propia y Supabase Auth solo es el motor del código de recuperación (D-025). *(Sustituido el 22 oct 2026 por D-031: el cliente usa Supabase Auth con teléfono verificado por OTP desde el registro.)*
  - **Cobro:** link de pago de Stripe o Mercado Pago, sin cambios (D-012).
  - **Reglas de frontend (agregadas el 21 oct 2026):** React Server Components por defecto; Tailwind CSS; shadcn/ui como capa estándar de componentes base.
  - **Reglas de infraestructura (agregadas el 21 oct 2026):**
    - Todo el código de la app vive dentro de `web/`, incluidos Supabase (`web/supabase/`) y los archivos de Docker. *(Aclarado 21 oct 2026, decisión de Aarón.)*
    - La app está lista para contenedores: Docker, Docker Compose y un Dockerfile multi-stage.
    - En local, Docker Compose levanta Supabase con sus contenedores y la app web.
    - En producción, Vercel compila `web/`; no despliega el contenedor.
    - Todo cambio a la base de datos es una migración de Supabase en `web/supabase/migrations`. Las migraciones corren durante el build de Vercel.
- **Motivo:** un solo proyecto y un solo despliegue para la landing y el producto, en el mismo origen que pide D-022. Detalle en `docs/adr/002-stack.md`.
- **Consecuencias:**
  - Sustituye la mención de PostHog en `.claude/agents/lealtab-arquitecto.md` (antes se atribuía por error a `lealtab-desarrollador.md`). Ya se quitó el 21 oct 2026, cuando se actualizaron los agentes.
  - Confirma las opciones que el ADR-001 §6 y `01-validacion-idea.md` §7.2 dejaban abiertas («Supabase si usamos»).
  - Vercel, Supabase y el proveedor del código por WhatsApp tratan datos por cuenta de LealTab. La revisión de cookies, de si se nombran en el aviso y de si tratan datos fuera de México (`legal-notas.md` §3, riesgo 6) entra en la consulta legal (D-017) y en la actualización del aviso (D-018).
- **Decidió:** fundador.

## D-024 · 21 oct 2026 · Proveedor del código de recuperación: SMS Masivos con el hook de Supabase; correo del dueño con Resend

- **Decisión:**
  - El código con el que el cliente recupera su tarjeta (D-011) se envía con **SMS Masivos** (smsmasivos.com.mx), integrado con el **hook de SMS de Supabase Auth**. Supabase genera y verifica el código; el hook solo lo envía por `POST /v2/otp` con `code_custom`.
  - Canal principal: **WhatsApp**. Respaldo: **SMS** con el mismo proveedor, automático si el envío falla y a petición del cliente. La plantilla de WhatsApp es la fija del proveedor, el SMS va en GSM-7 y no se necesita cuenta de Meta propia.
  - El código es de 6 dígitos y dura 10 minutos, con 5 intentos. Entre envíos hay que esperar 60 s, con un máximo de 3 por hora y 10 al día por teléfono, y después un bloqueo de 15 minutos.
  - **En el piloto no hay verificación por el cajero** como respaldo: el respaldo es el SMS, con alertas de saldo y de fallos.
  - Los correos de Auth del dueño (código de entrada y restablecimiento) salen por SMTP propio con **Resend**.
  - Completa los «Por definir» de D-023, salvo la librería de QR (PQ-25).
- **Motivo:** ahorra el trámite propio con Meta y trae el respaldo SMS en la misma API. El SMS cuesta MXN 0.77 a 0.90 antes de IVA ([precios](https://www.smsmasivos.com.mx/precios-sms-masivos), consultado el 21 oct 2026). El correo integrado de Supabase es solo para pruebas `[SUPUESTO: verificar en https://supabase.com/docs/guides/auth/auth-smtp]`.
- **Consecuencias:**
  - Detalle de la integración en `docs/adr/004-proveedor-codigo.md`.
  - Antes de construir la recuperación hay que confirmar por escrito con el proveedor lo de PQ-30 (si su OTP por WhatsApp es la API oficial de Meta, texto de la plantilla y remitente, cotización y webhooks de entrega) y probar que Supabase dispare el hook sin un proveedor nativo. Si esa prueba falla, se enmienda D-023.
  - SMS Masivos trata los datos en Estados Unidos, como encargado, y conserva número y contenido hasta 3 meses. Entra en la consulta legal y el aviso (PQ-18, RNF-PRI-08).
  - Solo se aceptan números de México de 10 dígitos.
  - Si el 5 % o más de las recuperaciones del piloto fallan en los dos canales, o el proveedor se cae más de un día, se reabre el respaldo con una decisión nueva.
  - Cierra PQ-13, PQ-22 (e, f), PQ-23 y PQ-28.
  - **Aclaración del 22 oct 2026 (D-031):** el código ya no es solo de recuperación. Cada registro del cliente en C1 y cada recuperación consumen un código por WhatsApp o SMS, y Supabase Auth es el sistema de autenticación del cliente, no solo el motor del código. Los límites por teléfono de arriba (60 s, 3 por hora, 10 al día, bloqueo de 15 min) ahora también cubren registros y **se mantienen**. **Aprobado por Aarón el 22 oct 2026** (recalculado en `docs/adr/003-sesion-cliente-y-codigo.md` §2.8): por IP, 10 por hora en nuestro servidor; tope global de **400 envíos al día** (antes 200), con aviso por correo a Aarón a los 200; alerta de saldo de SMS Masivos en **300 mensajes** (antes 100); y el límite de SMS por hora de Supabase sube de 30 a 100. El hook de SMS es el paso obligado de los límites por teléfono y global. Los 5 intentos por código y el límite por IP solo se imponen en nuestro servidor (no cubren a quien llame a Supabase directo): riesgo aceptado, que pasa a `security-review`. La caída del proveedor bloquea registros nuevos (R-18).
- **Alternativa(s) descartada(s):** WhatsApp directo con Meta; Twilio Verify; 360dialog; verificación por el cajero en N5 como respaldo; el endpoint `/whatsapp/send` de SMS Masivos (conexión por QR, no oficial).
- **Decidió:** fundador.

## D-025 · 21 oct 2026 · La identidad y la sesión del cliente son propias, y el segundo negocio sin sesión queda «por confirmar»

> **Sustituida por D-031 (22 oct 2026).** El texto de abajo se conserva como historial: ya no hay sesión propia del cliente, ni cookie `Path=/c/`, ni estado «por confirmar».

- **Decisión:**
  - La `identidad` y la sesión del cliente son propias: la sesión es una cookie `HttpOnly` con `Path=/c/`. Supabase Auth solo es el motor del código de recuperación; la sesión de Supabase que ese flujo crea se descarta.
  - **Gana RF-APP-05:** la tarjeta de un segundo negocio, sin sesión en ese navegador, queda «por confirmar» y no se manda código. Con sesión válida queda activa con un toque.
  - El código por WhatsApp o SMS solo existe en `/c/recuperar` (cambio de teléfono). Se reemplaza RF-APP-04.
- **Motivo:** Supabase no puede acuñar una sesión para un teléfono sin pasar por un código, y el registro sin código (C1) y el `install_token` de iOS lo necesitan. Un código en cada alta de un segundo negocio suma costo por mensaje, fricción en el mostrador y dependencia del proveedor en el momento más sensible del registro.
- **Consecuencias:**
  - Implementa D-019 y el ADR-001 §5.2 punto 6, sin cambiarlos. Detalle en `docs/adr/003-sesion-cliente-y-codigo.md`.
  - Faltan por diseñar el estado «tarjeta por confirmar» en C0 (con «Aceptar» y «No soy yo») y R1 sin la promesa de código.
  - Si MET-08 sale en 20 % o más, se evalúa ofrecer «Confirmar con código».
  - Una respuesta distinta de `/c/{slug}/registro` para un teléfono nuevo y uno existente deja saber a un negocio si ese teléfono usa LealTab; entra en la consulta legal (PQ-18).
  - Si la prueba del hook falla (D-024), se enmienda D-023.
  - Cierra PQ-22 (g, h).
- **Alternativa(s) descartada(s):** el cliente como usuario de sesión de Supabase Auth; un código propio sin Supabase Auth (contradice D-023); un código por WhatsApp en cada alta de un segundo negocio.
- **Decidió:** fundador.

## D-026 · 21 oct 2026 · El cliente borra su cuenta desde C5, con efecto inmediato

- **Decisión:**
  - C5 «Mis datos» vive en `/c/cuenta` y se entra desde «Mis datos ›» en C0, que sustituye el nombre global del encabezado (D-019).
  - «Borrar mi cuenta» borra la cuenta de LealTab completa (la `identidad` y todos sus `cliente_negocio`). Pide una casilla de confirmación, no pide código y su efecto es inmediato: se cierran sus sesiones (y, desde D-031, se borra también su usuario de Supabase Auth), se limpia el almacenamiento local, deja de aparecer en Mis tarjetas y en N0, N6, N7 y el CSV de cada negocio, y no recibe sellos. No se puede borrar sin conexión. El mismo teléfono puede registrarse otra vez como una cuenta nueva.
- **Por definir (PQ-04):** el plazo de eliminación definitiva, lo que se conserva por obligación legal y si los eventos de cada negocio se conservan sin datos personales para sus conteos.
- **Motivo:** RF-APP-14 y RNF-PRI-09 piden que el cliente pueda borrar su cuenta; con D-019 es una sola acción sobre la identidad. Pedir un código por WhatsApp costaría por mensaje y dependería del proveedor.
- **Consecuencias:**
  - C5 deja de ser un hueco del PRD. El diseño no depende del plazo.
  - Si el abogado (D-017) pide verificar la identidad otra vez, se agrega el código.
  - Evento `cuenta_cliente_borrada`: pendiente del analista de métricas.
  - Cierra PQ-12.
- **Alternativa(s) descartada(s):** borrar por negocio («Quitar esta tarjeta», para la v1 si lo piden); borrar solo por solicitud al correo (ARCO).
- **Decidió:** fundador.

## D-027 · 21 oct 2026 · Corregir sellos deja bitácora y cambiar la meta nunca quita avance

- **Decisión:**
  - Corregir sellos (N7) cambia solo el total de la tarjeta en curso: hasta ±3 por corrección, con motivo obligatorio y solo en línea. Cada corrección queda como un evento inmutable con el chip «Corregido» en el historial del cliente. Una corrección **sí puede completar la tarjeta**. No toca los canjes.
  - Cada tarjeta guarda la meta de su ciclo (`meta_ciclo`). **Cambiar la meta nunca quita avance:** bajarla aplica a todas las tarjetas en curso; subirla aplica a las tarjetas nuevas y tras cada canje. Si se baja la meta, el **excedente se pierde al canjear**, porque el canje reinicia a 0.
- **Motivo:** con una cuenta compartida (D-010) la protección es el motivo obligatorio y la bitácora, no un permiso. Conservar sellos con una meta única quitaría premios ya ganados.
- **Consecuencias:**
  - `tarjeta_cliente.meta_ciclo` y `evento.tipo = correccion` en el modelo; el aro y su `aria-label` usan `meta_ciclo`.
  - Antes de guardar un cambio de meta, la pantalla muestra una vista previa si hay tarjetas con avance.
  - El evento `sellos_corregidos` está pendiente del analista de métricas.
  - Cierra PQ-19 y RF-TAR-06.
- **Alternativa(s) descartada(s):** conservar sellos con una meta única para todos; reescalar proporcionalmente; bloquear el cambio si ya hay avance; que el excedente pase al ciclo siguiente (contradice «el canje reinicia a 0»).
- **Decidió:** fundador.

## D-028 · 21 oct 2026 · Definición de «semana» y de «intervalo habitual»; el sello de bienvenida no es una visita; chip «Al día»

- **Decisión:**
  - La semana del resumen (N0) son los **7 días completos que terminan ayer**, en la zona horaria del negocio, comparados con los 7 días previos.
  - El **intervalo habitual** es la mediana de los últimos 5 intervalos entre visitas. Con una sola visita no hay intervalo y «En riesgo» usa solo el mínimo de 30 días (D-010).
  - El **sello de bienvenida no cuenta como visita** en N0, N6 ni G1-a. «Nuevo» se mide desde el alta.
  - Los clientes que no son Frecuente, En riesgo ni Nuevo reciben en N7 un chip neutro **«Al día»**, con el estilo de «Nuevo» y sin colores nuevos.
- **Motivo:** una ventana de 7 días completos compara parejo y no cambia durante el día. Con las reglas aprobadas, un cliente a 35 días de su última visita quedaba sin chip.
- **Consecuencias:**
  - Aclara el «intervalo habitual» de D-010 y la «semana» de D-011.
  - Las consultas de N0 y N6 reciben una fecha de corte. El ejemplo de fechas de N0 en la pieza 05 deja de ser normativo.
  - El umbral se revisa con datos del piloto (Fase 9).
  - Cierra PQ-20 y PQ-27.
- **Alternativa(s) descartada(s):** semana calendario lunes a domingo (en curso o la última completa); últimos 7 días contando hoy; el ritmo mediano del negocio para quien tiene una sola visita.
- **Decidió:** fundador.

## D-029 · 21 oct 2026 · Los sellos y la recompensa no caducan en el MVP

- **Decisión:** en el MVP los sellos y la recompensa no caducan.
- **Motivo:** los términos de la tarjeta (D-014) no podían afirmar nada sobre caducidad mientras no se definiera.
- **Consecuencias:** la hoja «Términos de la tarjeta» de C3 puede decirlo. Las plantillas de WhatsApp (D-030) no mencionan vencimientos. Cierra PQ-26.
- **Alternativa(s) descartada(s):** ninguna registrada.
- **Decidió:** fundador.

## D-030 · 21 oct 2026 · Plantillas del mensaje «Escribir por WhatsApp» en N7

- **Decisión:** «Escribir por WhatsApp» (N7) abre un enlace `wa.me` con una de **tres plantillas fijas** que N7 elige sola, en este orden: recompensa lista, En riesgo y saludo. No son editables en el MVP. Hablan con la voz del negocio, sin presión comercial, sin enlaces y solo con datos que el cliente espera que el negocio tenga. El dueño puede editar el texto en WhatsApp antes de enviarlo.
- **Motivo:** cubre los dos usos del flujo F5 (recuperar y avisar de la recompensa) con el mínimo de variantes y sin configuración nueva; no depende de la API (D-011).
- **Consecuencias:** textos y reglas en `docs/fase-7/propuestas/pq-copy.md`. Las plantillas editables, los envíos masivos y las campañas siguen fuera del alcance. Si el abogado pide una línea de baja, se agrega al final de las tres (PQ-04). Cierra PQ-05.
- **Alternativa(s) descartada(s):** una sola plantilla genérica; plantillas editables por negocio; más de tres plantillas.
- **Decidió:** fundador.

## D-031 · 22 oct 2026 · El cliente usa Supabase Auth con teléfono verificado por OTP desde el registro

- **Decisión:**
  - El cliente se autentica con **Supabase Auth, con su teléfono verificado por un código (OTP) desde el registro en C1**. El código sale por WhatsApp (principal) o SMS (respaldo) con SMS Masivos y el hook de Supabase (D-024). **Sustituye a D-025:** ya no hay sesión propia del cliente ni cookie `Path=/c/`.
  - **Registro y recuperación son el mismo flujo.** Con sesión en el navegador, un segundo negocio **no pide código**: pide el nombre para ese negocio (D-019) y el consentimiento. Sin sesión, pide WhatsApp y código, y recupera todas las tarjetas del cliente.
  - **Desaparece el estado «por confirmar»** (RF-APP-05 y MET-08).
  - El `install_token` de iOS sigue y se canjea por la sesión de Supabase.
  - Borrar la cuenta (D-026) también borra el usuario de Supabase.
  - Dueño y cliente comparten `auth.users`, y se distinguen por el rol en `app_metadata`.
- **Motivo (de Aarón):** un solo sistema de autenticación.
- **Consecuencias:**
  - Costos aceptados:
    - un mensaje por cada registro (MXN 0.77 a 0.90 con SMS, antes de IVA, D-024);
    - un paso más en C1, por lo que MET-03 puede bajar;
    - el registro depende del proveedor: R-18 pasa a bloquear el registro de clientes nuevos.
  - Sustituye a D-025. Aclara D-019 (sin `por_confirmar`), D-023 (la sesión del cliente es de Supabase Auth), D-024 (los límites de envío por teléfono cubren registros) y D-026 (borra también el usuario de Supabase).
  - Hay que reescribir o alinear `docs/adr/003-sesion-cliente-y-codigo.md` y `docs/adr/004-proveedor-codigo.md` (el arquitecto lo hace en paralelo; no se editan desde esta decisión).
  - Sin estado «por confirmar» se cae el diseño pendiente de C0 con «Aceptar» y «No soy yo»; R1 y C1 se rediseñan con el paso del código.
  - Quedan **Por definir**, con pruebas: el canje del `install_token` de iOS por la sesión de Supabase y el hook sin proveedor nativo (PQ-30, PQ-31), y las demás pruebas del ADR-003 §3. Los límites de envío ya están aprobados (aclaración del 22 oct 2026 más abajo).
  - El PRD pasa a v1.6; hay que alinear `brand/06-product-design/` (C1, R1, C0) cuando se retome el diseño.
  - **Aclaración del 22 oct 2026 (aprobación de Aarón del ADR-003 reescrito):** se aprueban los límites y el costo del ADR-003 §2.8 y §4 (ver la aclaración de D-024): por teléfono 3 por hora y 10 al día, por IP 10 por hora, tope global de 400 al día con aviso a los 200, alerta de saldo de 300 mensajes y límite de SMS por hora de Supabase de 30 a 100. **Costo variable del piloto:** unos MXN 2,000 a 3,300 antes de IVA, una sola vez, con SMS como peor caso (alrededor de MXN 1.00 a 1.20 por cliente nuevo; el WhatsApp depende de la cotización, PQ-30). El rol vive en `app_metadata.rol` (`dueno` o `cliente`), que escribe solo el servidor; si se sustituye por un *custom access token hook* queda **Por definir** hasta el *spike*. Queda **Por definir** también el mecanismo del `install_token` de iOS (PQ-31) y la vigencia de 10 min del código en Supabase. El costo del hosting de pago sigue en PQ-29, pendiente de Aarón.
- **Alternativa(s) descartada(s):**
  - Inicio de sesión anónimo de Supabase (límite de 30 por hora por IP; con el wifi del local se agotaría).
  - Social login para el cliente: no elimina el OTP, choca con la privacidad (D-018, RNF-PRI-01) y el OAuth dentro de la PWA de iOS es frágil.
  - Mantener la sesión propia (D-025).
  - Nota: el social login para el **dueño** queda como candidato de la v1, sin decidir.
- **Decidió:** fundador.
