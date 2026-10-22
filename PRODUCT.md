# Product

<!-- impeccable:product-schema 1 -->

> **Qué es este archivo.** Verdad de producto de LealTab para agentes de diseño y desarrollo. Resume documentos aprobados; no los reemplaza. La referencia completa del MVP es [`docs/prd/PRD-lealtab-mvp.md`](docs/prd/PRD-lealtab-mvp.md) (v1.4, borrador para aprobación de Aarón). La parte visual vive en [`DESIGN.md`](DESIGN.md) y su fuente de verdad, `brand/04-design-system/`. Estrategia de marca: `brand/01-brand-strategy/identidad-de-marca.md` y `brand/01-brand-strategy/audiencia-y-posicionamiento.md`. Lo que las fuentes no resuelven dice **Por definir**; las personas marcadas **[H]** son hipótesis sin entrevistas. Los encabezados `##` van en inglés porque son los nombres canónicos que lee la herramienta.

## Platform

web

## Users

**Segmento principal.** PyMEs mexicanas de visita recurrente, con el dueño o la dueña operando y decidiendo. Normalmente tienen de 1 a 3 sucursales; **el MVP maneja una sola sucursal por negocio** y varias (hasta 3) llegan después (D-021). Viven de que el mismo cliente vuelva cada semana o cada mes. Hoy usan tarjeta de cartón, los puntos de su punto de venta (como Loyverse) o nada.

**Piloto.** Hasta 20 negocios, idealmente en **Villahermosa**, en cuatro oficios: **barberías**, **estéticas y salones de belleza**, **negocios de tapioca** y **cafeterías**. Los gimnasios quedan para después. Aarón los recluta en persona.

| Oficio | Ciclo de visita | Qué implica |
|---|---|---|
| Barberías, estéticas y salones | De 2 a 6 semanas | Ya conocen la tarjeta de sellos de papel; el dueño está presente y decide rápido |
| Tapiocas | Visita frecuente; clientes jóvenes y muy digitales | Negocios que cuidan su imagen |
| Cafeterías | Visitas mucho más frecuentes (hasta dos al día) | Ponen a prueba la velocidad en hora pico |

**Actores del MVP.**
- **Dueño del negocio:** da de alta su negocio, configura la tarjeta, ve el resumen semanal y quién regresa, administra clientes y exporta datos.
- **Staff de mostrador:** registra visitas y canjes en Mostrador. En el MVP usa la misma cuenta del dueño; los usuarios de staff con permisos llegan después.
- **Cliente final:** escanea el QR del mostrador, deja su nombre y su WhatsApp, junta sellos y canjea su recompensa. Instalar la app es opcional.

**Personas [H]** (hipótesis de Fase 1, sin entrevistas):
- **Mariana**, dueña de una estética (1 sucursal, 4 estilistas). Agenda por WhatsApp y maneja todo desde el celular. Le duelen las clientas que dejan de venir sin avisar y las tarjetas de cartón que se pierden. Objeción: «mis clientas no van a descargar otra app».
- **Luis**, dueño de una cafetería (2 sucursales). Ya tiene puntos en su punto de venta, pero nadie los ve; le importa la imagen de su marca. Objeción: «¿mis datos son míos?».
- **Diego**, dueño de una barbería. Bajas silenciosas, promociones a ojo. Objeción: «es algo más que aprender».

Fuera por ahora: abarrotes, cadenas grandes, e-commerce, gimnasios y farmacias.

## Product Purpose

**Qué es.** LealTab es la plataforma de lealtad para negocios de visita recurrente en México. Arranca con una tarjeta de lealtad web que se abre desde un QR, funciona en cualquier celular sin descargar nada y le muestra al dueño cada semana cuántos clientes volvieron.

**Misión.** «Ayudar a los negocios a que sus clientes regresen, con tecnología de lealtad fácil de usar, confiable y de primer nivel.»

**El problema.**
- Los negocios de visita recurrente dependen de que el cliente vuelva, pero usan tarjetas de cartón que se pierden y se prestan a trampas, puntos del punto de venta que nadie ve, o nada.
- El dueño no sabe cuántos clientes regresan ni si lo que hace para retenerlos funciona.
- Las herramientas que existen son baratas, pero el dueño tiene que configurarlas solo, varias dependen de la app o del wallet del cliente, y prometen «+30 % de ventas» sin medirlo.
- Nadie domina las tarjetas digitales en este segmento, y «sin app» ya no diferencia por sí solo.

**Qué ofrece el MVP.**
- **Regreso medible:** resumen semanal como primera pantalla del panel y la vista «Quién regresa» (frecuentes, en riesgo y nuevos).
- **Sin descargar nada, en cualquier celular:** escanea el QR, deja su nombre y su WhatsApp y ya tiene su tarjeta.
- **Alta sola en menos de 5 minutos:** sin llamada de ventas ni tarjeta de crédito, con la tarjeta y el cartel QR listos.

**Éxito.** Que los negocios del piloto usen la tarjeta en el mostrador, que sus clientes se inscriban y regresen, que paguen al terminar sus 30 días de prueba y que el dueño consulte el resumen semanal sin que se le envíe. Los criterios exactos del Gate 1 están en la sección 2 del PRD; quién cuenta como negocio que paga sigue **Por definir** (PQ-02).

## Positioning

- **Al lanzar (Propuesta A):** «la tarjeta digital más simple y bonita». La tarjeta es la protagonista.
- **Después (Propuesta B):** «la plataforma de lealtad seria que crece con tu negocio». El resultado (clientes que regresan y saber quién no) es el protagonista.
- Se pasa a B por señales, no por fecha: tablero de retención real más una segunda función, pilotos con resultados que se puedan contar y clientes que piden más. **La marca no cambia; cambia el énfasis del mensaje.** No es un rebrand.
- Diferencia frente a las apps de sellos con plantilla (Tago, Boxo, Sello, Orbita): diseño premium con la imagen del negocio, instalable como ícono, autoservicio con precio público y, hacia B, retención medible y confianza local (soporte por WhatsApp, datos exportables).

## Operating Context

Todo vive en `lealtab.com` (D-022): la landing en `/`, la app del cliente en `/c/` y el panel del negocio en `/panel/`. No se usa `app.lealtab.com`.

**`/c/` App del cliente.** Una sola PWA LealTab con las tarjetas de todos los negocios del cliente. Su cuenta se identifica por su WhatsApp. El ícono, el nombre de la app y el splash son de LealTab; en cada tarjeta, la marca protagonista es la del negocio, y LealTab aparece discreta como «Hecho con LealTab».
- **C0 Mis tarjetas:** lista de tarjetas por negocio con mini aro y la etiqueta «Recompensa lista». Es mínima: sin descubrimiento de negocios, sin recomendaciones y sin datos de un negocio visibles para otro.
- **C1 Registro** (nombre y WhatsApp, aviso de privacidad corto antes del botón) · **C2 Instalar** (guía de 3 pasos para iPhone y Android; «Ahora no» no bloquea nada) · **C3 Mi tarjeta** (aro de progreso, QR personal grande y última visita) · **C4 Recompensa** (aro completo en durazno y QR para canjear) · **C5 Mis datos** (ver y borrar la cuenta; diseño **Por definir**, PQ-12).
- Funciona sin instalarse y sin internet (muestra la tarjeta guardada y «Puede haber sellos pendientes»).

**`/panel/` Panel del negocio** (web responsiva). **Abre en N0 Inicio, el resumen semanal:** visitas de la semana frente a la anterior, clientes que regresaron, en riesgo, recompensas canjeadas y **una** acción sugerida. El resumen solo vive en el panel; no se envía por WhatsApp ni por correo. Navegación lateral: Inicio, Quién regresa, Mostrador, Clientes, Tarjeta y Ajustes. Alta en 4 pasos (N1 Cuenta, N2 Tu negocio, N3 Tu tarjeta, N4 QR de mostrador), N6 Quién regresa, N7 Clientes (ficha, historial, Por revisar y exportar CSV) y N8 Ajustes.

**Mostrador (N5, dentro del panel).** El staff escanea el QR personal del cliente y confirma «+1 sello» o el canje. Meta: un sello en menos de 5 segundos. Respaldo: buscar por WhatsApp o nombre si falla la cámara. Funciona sin conexión y sincroniza después. El QR impreso del mostrador solo sirve para registrarse; no suma sellos.

**Fuera de la pantalla.** Cartel QR impreso (carta, media carta o sticker), soporte por WhatsApp con Aarón, ayuda de arranque en persona durante el piloto y cobro con link de pago enviado por WhatsApp.

## Capabilities and Constraints

- **Módulos al lanzar:** Tarjeta y Clientes, con nombres funcionales en español. Avisos, Campañas y Reportes llegan después; Wallet es una función posterior, no un módulo.
- **Tarjeta:** una por negocio en el MVP, de 4 a 12 sellos, sello de bienvenida opcional. Límite por defecto de 1 sello por cliente por día, configurable, con bloqueo fijo de 2 minutos contra el doble escaneo. QR personal rotativo.
- **Estados de cliente:** Frecuente (2 o más visitas en 30 días), En riesgo (sin volver en más del doble de su intervalo habitual, con mínimo de 30 días) y Nuevo (primera visita en 30 días).
- **Datos mínimos del cliente:** nombre, WhatsApp y consentimiento. Un negocio nunca ve si su cliente está inscrito en otro.
- **Confianza desde el día uno:** alta sin llamada de ventas, precios públicos, exportar CSV (también con la cuenta en pausa), aviso de privacidad y «Ayuda por WhatsApp». Analítica propia sin cookies.
- **Precios públicos:** 30 días de prueba gratis; plan Inicio $299 MXN/mes + IVA; Negocio ~$449 + IVA; Pro «Próximamente». Precio especial de piloto: **Por definir** (PQ-01).
- **Fuera del MVP:** Apple/Google Wallet, app nativa, staff con permisos, varias tarjetas y sucursales, avisos y campañas, pago dentro del producto (CFDI, OXXO/SPEI), notificaciones push, integración con punto de venta, IA y API pública.
- **Stack:** definido en `docs/adr/002-stack.md` (Next.js en `web/`, Tailwind + shadcn/ui, Supabase y Vercel). Si difiere del PRD, manda el ADR-002.
- **Por definir (principales):** diseño de C5 Mis datos; N1 con contraseña y recuperación; retención y borrado de datos; plantilla del mensaje «Escribir por WhatsApp»; definición de «semana» del resumen; qué pasa con el avance si cambia el número de sellos; objetivos numéricos de rendimiento. Lista completa en la sección 12 del PRD.

## Brand Commitments

- **Nombre:** siempre «LealTab», con T mayúscula; nunca «Leal» a secas. Redes: @getlealtab (el «get» no va en el logo ni en textos).
- **Lema de marca:** «Haz que tus clientes siempre regresen.»
- **Frase de producto:** «Tu tarjeta digital siempre a un toque.»
- **Personalidad (4 rasgos):**
  - **Simple:** cualquier dueño la entiende y la usa sin ayuda. Clara, directa, pocos pasos; no básica ni «barata».
  - **Confiable:** cumple, es transparente y cuida los datos. Seria, predecible, honesta; no fría ni burocrática.
  - **Humana:** cercana, habla como persona y entiende el mostrador. Con buen humor; no infantil, sin mascotas ni exceso de emojis.
  - **Premium:** cuidado en cada detalle, sin ser pretenciosa. Elegante y con estándar alto; no cara ni exclusiva.
  - Cómo se siente: una herramienta seria hecha por gente cercana; precisa en el panel y alegre en el mostrador, sin volverse infantil.
- **Voz:** de **tú**, en español de México, sin jerga. Si en soporte el cliente escribe de usted, se contesta de usted; los textos legales pueden ir más formales. En la tarjeta del cliente habla **la voz del negocio**, de tú por defecto.
  - Claro antes que ingenioso. Concreto, no adjetivos («ves quién no ha vuelto en un mes», no «potente» ni «innovador»). Cercano y respetuoso, nunca condescendiente. Seguro, sin exagerar: sin urgencia falsa ni promesas que el producto no cumple.
  - Decimos «tus clientes regresan», «tarjeta digital», «ves quién regresa y quién no», «precio claro, sin contratos», «tus datos son tuyos». No decimos «maximiza el engagement», «solución omnicanal», «analítica impulsada por IA» ni «¡solo hoy!». Lo que no existe se presenta como «Muy pronto», nunca como si ya existiera.
  - Errores: calmados, dicen qué pasó y qué hacer, nunca culpan («No pudimos guardar los cambios. Revisa tu conexión e inténtalo otra vez.»).
- **«Hecho con LealTab»** aparece en la tarjeta y en el cartel, en todos los planes, Pro incluido.
- **Logo e identidad:** usar solo los archivos aprobados de `brand/03-visual-identity/logo/` (los de `_obsoleto-v1.0/` no están aprobados). El logo nunca va en durazno ni sobre durazno.

### Anti-referencias
- El típico «software de puntos y cupones para cafeterías».
- Apps de sellos con plantilla, mascotas, emojis o brochazos (el terreno de Tago, Boxo y Sello).
- Una identidad que gira alrededor de una tarjeta: la marca tiene que poder crecer más allá de ella.
- Banco o gobierno (por eso no se habla de usted), lo corporativo y frío, y el lenguaje de marketing inflado.
- Referencias de nivel, no para copiar: Stripe, Linear, Clerk, Resend, Vercel, Ramp y Mercury.

## Evidence on Hand

- **No hay datos propios de clientes todavía.** Las personas y las cifras de éxito son hipótesis por validar en el piloto. No se inventan testimonios, casos, métricas de resultados ni logos de clientes.
- **Fotografía:** toda la foto será propia, con los negocios del piloto en Villahermosa; aún no se produce. Nada de stock.
- **Activos aprobados:** logo, íconos, aro de progreso, ilustraciones de barbería, estética y tapioca, y stickers en `brand/03-visual-identity/`; brand book de 24 páginas en `brand/03-visual-identity/brand-book/`.
- **Landing publicada** en `https://www.lealtab.com`; su fuente de verdad es `web/`.

## Product Principles

Derivados de decisiones aprobadas:
1. **El regreso se mide.** El dueño ve cada semana quién volvió y qué hacer hoy; una acción sugerida, no un tablero lleno.
2. **Cero fricción para el cliente.** Funciona sin descargar nada y sin instalar; instalar ayuda, pero nunca bloquea.
3. **El mostrador no espera.** Un sello en segundos, con respaldo si falla la cámara o el internet.
4. **Los datos son del negocio.** Exportación siempre disponible, datos mínimos y ningún cruce entre negocios.
5. **Prometer solo lo que existe.** Lo que viene se dice «Muy pronto», nunca como si ya estuviera.

## Accessibility & Inclusion

- Todo estado va con palabra y color, nunca solo color o ícono.
- Contraste AA como mínimo, foco visible (`--focus-ring`), orden de tabulación lógico y objetivos táctiles de 44 px o más.
- Inputs de 16 px; el campo de WhatsApp lleva `inputmode="tel"` y `autocomplete`; los errores se asocian con `aria-describedby`. Alineado con el design system: input, select y textarea usan `font.size.input` = 16 px en todos los tamaños de pantalla (decisión de Aarón, 2026-10-21).
- El aro lleva `role="img"` y `aria-label` (por ejemplo, «4 de 8 sellos»). El QR tiene como alternativa la búsqueda por WhatsApp.
- Se respeta `prefers-reduced-motion`.
- Funciona en cualquier celular y con mala conexión.
