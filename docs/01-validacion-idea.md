# LealTab: Informe 01, Validación de la idea

> **Nota (4 oct 2026):** este informe se conserva tal como lo entregó la validación. Dos de sus recomendaciones fueron reemplazadas por decisiones del fundador. Ver `docs/decisiones.md`:
> - **D-001:** la tarjeta del MVP es web (PWA), sin Apple ni Google Wallet.
> - **D-002:** no se usa marca blanca; los pilotos usan la plataforma propia.
>
> El plan vigente está en `docs/02-plan-de-trabajo.md`.

- **Fecha del análisis:** 2026-10-04
- **Insumo:** `/Users/alsvader/Documents/Github/lealtab/lealtab-resumen-branding.md`
- **Método:** lectura completa del resumen, búsqueda web de competidores (páginas oficiales de precios cuando fue posible), datos oficiales (INEGI, ENDUTIH, ENIF/BBVA Research), documentación de Apple y Google, y reseñas de usuarios.
- **Tipo de cambio usado:** aprox. MXN 17.5 por USD (agosto 2026 rondó 17.1; consenso de cierre 2026 cerca de 17.9). Todas las conversiones son aproximadas.
- **Etiquetas de calidad de evidencia:**
  - **[OFICIAL]**: INEGI, Apple, Google, Meta, Stripe o BBVA Research.
  - **[PROVEEDOR]**: página o blog de un competidor. Es dato real de su oferta, pero sus cifras de impacto son marketing.
  - **[SECUNDARIA]**: prensa o agregadores (Capterra, costbench). Útil, pero puede estar desactualizada o ser inconsistente.
  - **[SUPUESTO]**: estimación mía, explícita. No es dato.

> Advertencia de honestidad: no encontré datos públicos de adopción de pases de lealtad en Apple Wallet o Google Wallet en México, ni volúmenes de búsqueda, ni disposición a pagar medida directamente en PyMEs mexicanas. Donde hay hueco lo digo y lo convierto en experimento (sección 8). Las cifras de "impacto" que circulan en blogs de proveedores no deben usarse como evidencia.

---

## 0. Veredicto

**GO CON CONDICIONES para la oportunidad. NO-GO para el plan tal como está escrito (7 fases, marca primero, producto al final).**

La oportunidad existe (retención en negocios locales, 95.5% de las unidades económicas son micro, WhatsApp y smartphones omnipresentes) y validarla cuesta poco. Pero hoy LealTab tiene un nombre, un dominio y una estética aspiracional, y **ninguna hipótesis de negocio contrastada con un solo dueño de negocio**. El plan actual gasta lo más escaso (tiempo del fundador) en lo que menos información genera (identidad, design system) y deja para el final lo único que puede matar o salvar la idea (¿pagan, lo usan, regresan los clientes?).

**Cinco hallazgos que sostienen el veredicto:**

1. **El wallet ya no es diferenciador.** Un proveedor mexicano (SMS Masivos, desde MXN 379/mes) y uno hispanohablante (FIU, EUR 9.99/mes) ya ofrecen tarjetas en Apple/Google Wallet; Loopy Loyalty cuesta USD 25/mes; Google ofrece consola no-code gratuita. "Tu tarjeta digital siempre a un toque" describe a todo el mercado.
2. **El ancla de precios local es muy baja y el mercado regala el producto.** Lealify (MX): plan gratis hasta 1,000 clientes y PRO a MXN 2,500/año (~MXN 208/mes). Fideliza (MX): gratis hasta 100 clientes, de pago desde MXN 549/mes. SMS Masivos: gratis hasta 30 clientes. Loyverse incluye lealtad gratis. Con ARPU de MXN 200-550, no sobrevive una estrategia de CAC alto ni de producto "premium estilo Stripe".
3. **La competencia local es fragmentada y de baja calidad percibida, pero se está llenando en 2026.** Hay hueco de ejecución, no de concepto (FidelyT lanzó en marzo de 2026 con 100 negocios gratis en 3 semanas; Lealify reporta mensajería desde junio de 2026).
4. **El cuello de botella es operativo, no tecnológico:** que un cajero pida el QR a cada cliente y que el cliente lo agregue (en Android, con fricción). Un 78.7% de Android en México contradice un posicionamiento "wallet primero" que funciona de lujo solo en iPhone.
5. **El camino "plataforma de 9 módulos" ya lo recorrió Leal (Colombia):** US$20.5M levantados, pivote de "fidelizar" a "gestionar clientes" y recorte del equipo a menos de la mitad (Forbes Colombia). Un fundador sin capital no debe diseñar la arquitectura de esa plataforma antes de tener 10 clientes.

**Condiciones del GO (todas obligatorias):**

1. Invertir el orden: máximo ~1 semana de "marca mínima" antes de hablar con clientes; congelar Creative Direction, Visual Identity completa y Design System hasta pasar el Gate 1.
2. Un solo segmento, un solo trabajo: "que tus clientes vuelvan, y que puedas demostrarlo".
3. Cobrar desde el piloto (prepago o primer mes pagado). Un piloto gratis no valida disposición a pagar.
4. Presupuesto acotado y fecha de corte: 10 semanas y menos de ~MXN 15,000 [SUPUESTO] antes del Gate 1.
5. Criterios de kill escritos hoy (sección 9). Si no se cumplen, se pivota o se detiene.

**Mi juicio subjetivo (no es dato):** con el plan actual, la probabilidad de llegar a 100 clientes de pago en 12 meses es baja (<10%). Con el plan reordenado y un segmento acotado, es razonable (25-35%). El techo realista del negocio es de tipo bootstrapped (decenas de miles de USD de ARR a cientos de miles), no de plataforma regional, salvo que se suba de segmento.

---

## 1. Qué hay realmente en el documento actual

| Elemento | ¿Existe? | Comentario |
|---|---|---|
| Nombre, dominio `.com`, handle `@getlealtab` | Sí | Barato y reversible; no es evidencia de nada. |
| Arquitectura de 9 módulos (Wallet, Rewards, Campaigns, CRM, Automations, Analytics, AI, API, Passes) | Sí (en papel) | Es un organigrama de producto sin cliente que lo pida. |
| Personalidad de marca y referentes (Stripe, Linear, Vercel, Ramp, Mercury) | Sí | Referentes de marcas cuyo comprador es un desarrollador o CFO, no un dueño de cafetería. |
| Slogan "Tu tarjeta digital siempre a un toque" | Sí | Habla al **consumidor final**, no al **comprador** (el dueño). El segundo ("Haz que tus clientes siempre regresen") es el que habla al comprador. |
| Cliente ideal concreto | No | "Audiencia" aparece como ítem de la Fase 1, no como hipótesis. |
| Problema validado con evidencia | No | Cero entrevistas, cero datos propios. |
| Diferenciador real del producto | No | La diferenciación descrita es estética, no funcional. |
| Modelo de precios y canal de adquisición | No | Pendiente; son lo que decide si el negocio existe. |
| Criterios de éxito/fracaso | No | No hay puerta de decisión en ninguna de las 7 fases. |

**Contradicción central:** la marca quiere "no parecer software para cafeterías", pero **la cafetería, el salón y la barbería son exactamente el cliente donde existe el problema en volumen** (todos los competidores mexicanos los listan como objetivo). Se puede (y se debe) cuidar el diseño, pero hay que posicionarse por **resultado** ("clientes que vuelven, medibles"), no por parecer una fintech.

### Crédito ganado (lo que sí está bien)

- **Intuición de "wallet, sin app":** coincide con lo que hacen todos los jugadores relevantes y evita el problema real de las apps de lealtad (descarga y retención).
- **No atar la marca a Tabasco ni a México (.com) y no atar el isotipo a una tarjeta:** decisión sensata de bajo costo.
- **Perfil del fundador (técnico, local, bajo burn):** habilita un MVP barato y ventas presenciales en una región. No es una ventaja injusta frente a competidores mexicanos, pero sí un buen punto de partida.
- **Descartar `-ify`:** correcto en principio, aunque ver la sección 2.6 sobre colisión de nombres.

No hay crédito (todavía) para: la lista de módulos, la aspiración estética como diferenciador y el nombre como activo estratégico.

---

## 2. Mapa competitivo

### 2.1 Especialistas globales en tarjetas wallet y sellos

| Competidor | Qué es | Precio (USD/mes, ~MXN) | Lo relevante para LealTab | Fuente |
|---|---|---|---|---|
| **Loopy Loyalty** (equipo de PassKit) | Tarjetas de sellos en Apple/Google Wallet, autoservicio, 15 días de prueba sin tarjeta | Starter USD 25 (~MXN 440, 1 sucursal); Growth USD 69 (~1,210, 3 sucursales); Ultimate USD 95 (~1,660, 10 sucursales + API). Anual -20%. Clientes ilimitados | Es el referente de precio de entrada. Reseñas (4.6/5, 69 en Capterra): fácil de usar; **quejas: fricción en Android** (obliga a instalar Google Pay/Wallet), exportes y segmentación pobres | [Precios](https://www.loopyloyalty.com/pricing), [Reseñas](https://www.capterra.ca/reviews/160859/loopy-loyalty) |
| **PassKit** | Infraestructura de pases (lealtad, membresías, cupones, boletos); proveedor certificado por Apple | Cargo de plataforma + volumen de pases; desde ~USD 39.50 según Capterra; 45 días de prueba | Es el proveedor "de fondo" para quien construya sobre APIs. Aparece en la lista de proveedores certificados de Apple | [Precios](https://passkit.com/pricing/), [Capterra](https://www.capterra.com/p/10033797/PassKit/), [Apple](https://developer.apple.com/wallet/loyalty-passes/) |
| **Boomerangme** | Wallet + CRM + campañas (push/SMS/email) + automatizaciones | Business USD 199 (~3,490; USD 164 anual); Agency USD 259 (~4,540; USD 214 anual, **marca blanca**); Franchise USD 299. Capterra lo lista "desde USD 69". 14 días de prueba | Es lo más parecido a la visión "plataforma" de LealTab, ya construido. 4.8/5 (48 reseñas). El plan **Agency con marca blanca** permite validar sin código (ver sección 7) | [Precios](https://boomerangme.com/pricing), [Capterra](https://www.capterra.com/p/241848/Boomerangme) |
| **Stamp Me** (Australia) | Tarjetas de sellos; el cliente usa su app; tiene contenido SEO para México y soporte en español | Lite USD 49 (~860); Pro USD 79 (~1,380); Elite USD 199 (~3,490). Una sola sucursal. Prueba 30 días | Ya compite por búsquedas "best loyalty apps in Mexico" (SEO activo). Precio claramente fuera del ancla local | [Precios](https://www.stampme.com/pricing), [Blog MX](https://www.stampme.com/blog/best-loyalty-apps-in-mexico) |
| **Square Loyalty** | Lealtad integrada al POS de Square | USD 45/mes por sucursal | **No está disponible en México** (EE.UU., Canadá, Reino Unido, Irlanda, Francia, España, Australia, Japón). Sirve como referencia de bundling, no como competidor directo hoy | [Capterra](https://www.capterra.com/p/276727/Square-Loyalty/), [Disponibilidad](https://squareup.com/help/us/en/article/6464) |
| **Smile.io** | Lealtad para e-commerce (principalmente Shopify) | Gratis (tope de 200 pedidos/mes); planes de USD 49-79 a USD 999 según la fuente (**datos inconsistentes entre fuentes**) | Otro segmento (online). No es competidor en negocio físico | [costbench](https://www.costbench.com/software/loyalty-program/smile-io/), [Rivo](https://www.rivo.io/blog/smile-io-pricing) |
| **Loyverse** | POS gratuito con programa de lealtad incluido; complementos de pago de USD 5-25/mes por tienda | Lealtad: USD 0 | Sustituto gratuito para micro-retail con POS. No verifiqué su base instalada en México | [Precios](https://loyverse.com/en-us/pricing) |
| **SleekPass** | Tarjetas wallet baratas | ~USD 4.99/mes (~MXN 87) | Muestra el **piso de precio** de la categoría | [Listado](https://pickyourapp.com/es/products/sleekpass) |
| **Booksy / Fresha** | Agenda y POS para belleza con lealtad incluida | Incluida en su plataforma | Ejemplo de **bundling vertical**: en belleza la lealtad la regala el software de agenda | [Booksy](https://biz.booksy.com/es-us/funciones/las-tarjetas-de-lealtad) |
| **Enterprise** (Airship, Paytronix, Punchh, Vibes, Pronto CX, Passcreator, PassEntry, Stell) | Proveedores certificados por Apple para lealtad contactless | Cotización | Techo del mercado; irrelevante para PyME | [Apple](https://developer.apple.com/wallet/loyalty-passes/) |

### 2.2 México y LATAM

Nota sobre "Fidelity apps": en la App Store de México aparecen Fidelity MixedPay y Fideligas (programas de incentivos de Fidelity Marketing, orientados a canales/corporativo), Big Fidelity (app de sellos con casi cero reseñas) y FideliApp. **No hay un "Fidelity" líder para PyMEs.**

| Competidor | Qué es | Precio | Lo relevante | Fuente |
|---|---|---|---|---|
| **Lealify** (lealify.com) | Plataforma mexicana de puntos/cashback con registro por teléfono y avisos por WhatsApp; quiosco web; **sin wallet** | Gratis (hasta 1,000 clientes, 1 sucursal). PRO MXN 2,500/año (~MXN 208/mes) | **Competidor directo** y de nombre casi idéntico a lo que el fundador descartó. Cifras autodeclaradas (sep. 2026): 100+ negocios activos de 300+ registrados (~33% de activación), 10,000+ clientes, 19,000+ visitas, 2,200+ canjes, mensajería WhatsApp desde junio 2026 | [Sitio](https://lealify.com) |
| **Fideliza** (fideliza.app) | Puntos, sellos, cashback, niveles VIP, referidos, campañas WhatsApp; sin app, con código | Gratis (100 clientes); Starter MXN 549/mes; Pro MXN 1,099; Enterprise MXN 1,699 (multi-sucursal "próximamente") | Sin wallet; sin clientes o casos publicados. Sirve como ancla de precio local de pago | [Sitio](https://fideliza.app/) |
| **SMS Masivos** | Proveedor mexicano de SMS/WhatsApp con tarjeta de sellos en **Apple/Google Wallet** | Básico gratis (30 clientes, 500 sellos/mes); Fidelidad MXN 379/mes (1,000 clientes, 2 sucursales); Recompensa MXN 899/mes (5,000 clientes, 5 sucursales) | **Ya ofrece wallet a precio local** y tiene SEO en español. Promete "30% más ventas en menos de un mes" sin evidencia | [Sitio](https://www.smsmasivos.com.mx/tarjetas-de-lealtad-digitales) |
| **FIU** (fiuapp.com) | Tarjetas de sellos/puntos en Apple/Google Wallet para cafés, panaderías, heladerías; el cliente no instala nada | EUR 9.99/mes (~MXN 205); 1 mes gratis | Precio en euros sugiere origen español; no verifiqué presencia real en México. Muestra que el wallet ya es commodity | [Sitio](https://www.fiuapp.com/) |
| **LoyaltyPro** (loyaltypro.mx) | Tarjetas digitales con puntos/estrellas; push, WhatsApp, email, SMS | No público | Sin mención de wallet | [Sitio](https://loyaltypro.mx/) |
| **FidelyT** (Mérida, Yucatán) | App de consumidor + suscripción para negocios; mapa de negocios participantes | Gratis hasta mayo 2026; luego suscripción (monto no publicado) | **Vecino geográfico del sureste.** 100 negocios en 3 semanas (gratis). Modelo de app propia, con el problema de adopción de apps | [Posta](https://www.posta.com.mx/yucatan/conoce-fidelyt-app-para-premiar-la-lealtad-de-los-cliente-en-yucatan/v-vl2171731) |
| **LEAL** (Colombia, en México desde 2022) | Lealtad para comercios tradicionales, luego "Leal 360" (gestión de clientes) con integraciones a 160 POS | Cotización | US$20.5M levantados; **pivote** de lealtad a gestión de clientes; equipo recortado a menos de la mitad. Es la advertencia sobre la ruta "plataforma" | [Forbes CO 2024](https://forbes.co/2024/01/31/emprendedores/leal-obtiene-us5-millones-para-integrar-ia-a-su-plataforma-de-recompensas/), [Pivote](https://forbes.co/2024/09/10/emprendedores/esta-startup-cambia-su-enfoque-pasa-de-ser-una-plataforma-que-fideliza-clientes-a-una-que-los-gestiona/), [Bloomberg Línea](https://www.bloomberglinea.com/2022/04/11/fintech-colombiana-leal-llega-a-mexico-busca-crear-1000-alianzas-con-retailers/) |
| **Lealy** (Lealy APP S.L., España) | App para comercios Lealy (puntos por QR) | Gratis (app) | Otra marca "Leal-" en el mismo espacio | [App Store](https://apps.apple.com/mx/app/mylealy/id6742460768) |

### 2.3 Sustitutos e incumbentes ocultos

| Sustituto o incumbente | Por qué importa | Calidad de evidencia |
|---|---|---|
| **Tarjeta de cartón, libreta, Excel + WhatsApp** | El competidor número uno: cuesta cero y ya funciona "suficientemente bien" | [SUPUESTO] razonable; validar en entrevistas |
| **Google Wallet Console (no-code)** | Google permite crear clases de pase de lealtad desde consola sin código, gratis; además lanzó "pases vinculados automáticamente" (mayo 2026) | [OFICIAL] ([Google](https://developers.google.com/wallet/retail/loyalty-cards/), [Airship](https://www.airship.com/docs/whats-new/2026-05-11-google-wallet-auto-linked-passes/)) |
| **Mercado Pago / Clip** | Dueños de la relación de cobro con la PyME; Mercado Pago lanzó "Cuenta Negocio" gratis con herramientas de gestión y Meli+ como programa de lealtad propio. **No encontré un módulo de lealtad para comercios**, pero el riesgo de bundling es estructural | [SECUNDARIA] ([DPL News](https://dplnews.com/?p=328406)) |
| **Plataformas de reparto (Rappi, Uber Eats, DiDi Food) y POS locales** | Poseen al cliente final en restaurantes, o regalan módulos de puntos | No verificado en detalle |
| **WhatsApp Business** (catálogo, etiquetas, difusión) | La herramienta que el dueño ya domina | [SUPUESTO] |
| **Treinta, Kyte** | Apps de gestión populares en PyMEs LATAM; no pude confirmar si tienen módulo de lealtad | No verificado |

### 2.4 Matriz de precios (MXN por mes, aprox.)

| Rango | Planes |
|---|---|
| Gratis | Lealify (<=1,000 clientes), Fideliza (<=100), SMS Masivos (<=30), Loyverse (lealtad incluida), FidelyT (hasta mayo 2026) |
| ~MXN 200-450 | Lealify PRO (~208), FIU (~205), SMS Masivos Fidelidad (379), Loopy Starter (~440) |
| ~MXN 550-1,100 | Fideliza Starter (549), Square Loyalty (~790, no disponible en MX), Stamp Me Lite (~860), SMS Masivos Recompensa (899), Fideliza Pro (1,099) |
| ~MXN 1,200-1,700 | Loopy Growth (~1,210), Stamp Me Pro (~1,380), Fideliza Enterprise (1,699), Loopy Ultimate (~1,660) |
| >MXN 2,800 | Boomerangme Business/Agency/Franchise (~2,870-5,230) |

### 2.5 Conclusiones competitivas

1. **Wallet es el mínimo exigible, no una cuña.** Lo ofrecen especialistas globales, un proveedor mexicano (SMS Masivos), un proveedor hispano (FIU) y Google gratis.
2. **El mercado mexicano local se ancla en MXN 0-550/mes.** Los especialistas wallet extranjeros cobran 1.5-4 veces más y facturan en USD. Hay un hueco por **encima** del micro-plan gratuito (negocios con 2+ sucursales) y por **debajo** de Boomerangme.
3. **WhatsApp es la columna vertebral local.** Lealify, Fideliza y SMS Masivos lo usan. Los wallet-first dependen de notificaciones de wallet, limitadas por plataforma (Google: 3 pushes/día por usuario, [Google](https://developers.google.com/wallet/retail/loyalty-cards/use-cases/trigger-push-notifications?hl=es); Apple: hasta ~20/día por pase según documentación de terceros, [PassKit](https://help.passkit.com/en/articles/11905171-understanding-push-notifications-for-apple-and-google-wallet-passes)).
4. **El mercado local se ve fragmentado, de baja producción de marca y sin líder claro** (por los sitios revisados; no tengo datos de tráfico). Eso es un hueco de **ejecución y confianza**, pero también puede significar baja disposición a pagar. Ambas lecturas son compatibles.
5. **El mercado se calienta en 2026** (FidelyT en marzo, Lealify con WhatsApp desde junio, SMS Masivos publicando contenido): la ventana existe, pero se cierra con copias rápidas. Ninguna cuña técnica dura más de semanas.
6. **Hay precedente de consolidación difícil en lealtad para PyME:** Belly (retirada tras ser adquirida por Mobivity) y Fivestars (reestructurada tras SumUp) según un blog de competidor (sesgado, [Loop](https://loop.fans/blog/belly-loyalty-program)); y el pivote de Leal. Tómalo como alerta, no como prueba.

### 2.6 Colisión de nombres (revisar antes de gastar en logo)

- El resumen descarta "Lealtify" por confundirse con "Lealify". **Lealify es un competidor mexicano en operación** y LealTab queda en el mismo espacio fonético ("Leal" + sufijo), mismo país y misma categoría. Además existen **LEAL** (Colombia, con US$20.5M y operación en México) y **Lealy** (España).
- `@lealtab` está ocupado por una cuenta activa (~1,230 seguidores). Averigua quién es y si opera en tu categoría.
- "Tab" evoca "tablet" (p. ej. Galaxy Tab); puede ser un acierto si el punto de contacto es una tablet en mostrador, o una confusión si no.
- **Acción:** búsqueda de anterioridades en MARCia (IMPI), clases 9, 35 y 42, **antes** de la Fase 3 (logo). Cuesta horas y puede evitar perder meses de identidad visual.

---

## 3. Validación de mercado

### 3.1 Tamaño (oficial)

- **Unidades económicas:** 5,451,113 en 2023; 95.5% micro, 3.7% pequeñas, 0.7% medianas ([INEGI vía Milenio](https://www.milenio.com/negocios/en-mexico-el-95-5-por-ciento-empresas-eran-micro-2023-inegi), [INEGI](https://www.inegi.org.mx/contenidos/saladeprensa/aproposito/2025/EAP_MIPYMES_25.pdf)) [OFICIAL]. El DENUE de noviembre de 2024 registra 6,058,548 establecimientos ([INEGI](https://inegi.org.mx/contenidos/saladeprensa/boletines/2024/denue/denue2024_11.pdf)) [OFICIAL]. Las cifras difieren por corte y definición.
- **Tabasco:** 140,391 establecimientos y 619,302 personas ocupadas en 2024; 95.5% micro ([INEGI CE 2024](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/ce/CE_2024_Def_Tab.pdf)) [OFICIAL]. Sirve de laboratorio, no de mercado.
- **Mercado de lealtad:** México ~US$1.55B en 2025 (programas de lealtad en general, incluyendo coaliciones y tarjetas bancarias) y LATAM de software de gestión de lealtad ~US$1.45B ([GlobeNewswire](https://www.globenewswire.com/fr/news-release/2025/08/11/3130648/28124/en/Mexico-Loyalty-Programs-Market-Intelligence-Report-2025-2029-Data-Driven-Personalization-and-Cashback-Models-Pave-Way-for-Expansion.html), [MarketsandMarkets](https://www.marketsandmarkets.com/Market-Reports/geography/loyalty-management-market/Latin-America)) [SECUNDARIA]. **No segmentan PyME + wallet; no son un TAM utilizable.**

### 3.2 Embudo bottom-up (todos los supuestos son míos)

| Paso | Valor | Calidad |
|---|---|---|
| Establecimientos de consumo recurrente (alimentos y bebidas, belleza, barbería, fitness, autolavado, farmacias, especialidades) | 600,000 | [SUPUESTO]; validar con DENUE por código SCIAN |
| Con madurez digital (smartphone + redes + cobro digital) | 15% = 90,000 | [SUPUESTO] |
| Penetración alcanzable en 3 años | 2-4% = 1,800-3,600 clientes | [SUPUESTO] |
| ARPU | MXN 450/mes | [SUPUESTO] (ancla de competidores) |
| ARR resultante | MXN 9.7-19.4 M (~US$0.55-1.1 M) | Cálculo |

**Lectura:** es un negocio sano de escala pequeña o mediana, no una "plataforma regional" por sí mismo. Para MXN 100,000 de MRR (~US$5,700) hacen falta ~222 clientes a MXN 450, pero solo ~67 a MXN 1,500. **La elección de segmento y ARPU decide la viabilidad más que cualquier decisión de marca.**

### 3.3 Señales de demanda

**A favor:**

- Oferta activa: al menos 8 proveedores en México (sección 2.2) y entradas nuevas en 2026.
- Demanda del consumidor: 83% de los mexicanos prefiere marcas con programa de lealtad y 91% cambiaría de marca por mejores beneficios (EY 2025; ~1,100 consumidores en la región; prensa sin metodología completa) ([EY](https://www.ey.com/content/dam/ey-unified-site/ey-com/latam/insights/consulting/documents/ey-estrategias-programas-fidelizacion-latinoamerica-2025.pdf), [El Imparcial](https://www.elimparcial.com/dinero/2025/08/04/segun-estudio-83-de-los-mexicanos-eligen-marcas-con-programas-de-lealtad-en-que-consiste-esta-estrategia-de-ventas/)) [SECUNDARIA]. Es actitud del **consumidor**, no del negocio que paga.
- Conectividad: 103.2 M de personas usaron celular en 2025 (84.6% de la población de 6+) y 104.9 M usaron internet (ENDUTIH 2025, [Crónica](https://www.cronica.com.mx/nacional/2026/06/16/mexico-cada-vez-mas-conectado-internet-transforma-la-vida-de-millones-de-personas-pero-aun-enfrenta-desafios/)) [OFICIAL vía prensa]. WhatsApp: ~78 M de usuarios (~87% de los internautas) ([DPL News](https://dplnews.com/?p=153178)) [SECUNDARIA].
- Tracción pública de los pequeños: Lealify (100+ negocios activos, autodeclarado) y FidelyT (100 negocios gratis en 3 semanas).

**En contra o con alerta:**

- **Casi todos compiten con plan gratis.** El registro gratuito (FidelyT) no prueba disposición a pagar.
- **Lealify:** ~33% de activación (100 de 300+ registrados); ~100 clientes y ~190 visitas acumuladas por negocio activo. Si ese es el nivel de uso de un competidor visible, el uso real por negocio es bajo. (Cifras autodeclaradas.)
- **Las cifras de impacto** ("+18% de ingresos", "+47% de frecuencia", "30% más ventas") salen de contenido patrocinado y de páginas de proveedores sin metodología ([NewsInAmerica](https://newsinamerica.com/pdcc/noticias/economia/2026/programa-de-puntos-digital-la-clave-para-retener-clientes-en-pymes-mexicanas/)). No las uses, ni en el pitch.
- **Las tasas de instalación wallet** (>60% iOS, >45% Android; 85-90% de apertura) vienen de blogs de proveedores en mercados anglosajones ([Passworks](https://blog.passworks.io/?p=782), [BonusQR](https://bonusqr.com/article/how-small-businesses-can-add-loyalty-cards-to-apple-wallet)). Tómalas como hipótesis a medir en México.
- **Volumen de búsqueda:** no pude obtener datos de Keyword Planner/Trends. Hay SEO activo en español (SMS Masivos, Stamp Me), señal de competencia por las mismas consultas. Pendiente en el experimento E3.

### 3.4 Adopción de Apple Wallet y Google Wallet en México

**No existen datos públicos fiables de adopción de pases de lealtad.** Lo que hay son proxies:

| Proxy | Dato | Implicación |
|---|---|---|
| Sistema operativo (tráfico web) | Android 78.7%, iOS 21.3% (julio 2026) ([Statcounter](https://gs.statcounter.com/os-market-share/mobile/mexico)) [SECUNDARIA; mide tráfico, no base instalada] | Un posicionamiento "wallet primero" funciona sin fricción solo para ~1 de cada 5 clientes |
| Mercado de smartphones | 35 M de unidades en 2025; Samsung 27.2% de unidades ([Milenio/The CIU](https://amp.milenio.com/negocios/mercado-de-smartphones-en-mexico-crece-7-por-ciento-en-2025-the-ciu)) | Dominio de Android de gama media y baja |
| Google Wallet en México | Lanzado en nov. 2022 con foco en pagos (Banorte, Nu, Hey Banco, Inbursa, etc.) ([Expansión](https://expansion.mx/tecnologia/2022/11/15/google-wallet-llega-a-mexico)); permite escanear tarjetas de lealtad (p. ej. OXXO, Liverpool) ([Xataka](https://www.xataka.com.mx/aplicaciones/buenas-noticias-para-usuarios-android-mexico-google-permite-agregar-a-wallet-casi-cualquier-tarjeta)) | Hay hábito incipiente, no masivo |
| Fricción Android observada | Reseñas de Loopy: "los clientes Android deben instalar Google Pay primero" ([Capterra](https://www.capterra.ca/reviews/160859/loopy-loyalty)) | El flujo Android es el punto débil del producto |
| Efectivo | En 2022, ~90% de los adultos usaba efectivo en compras menores de MXN 500 (cita de prensa en el lanzamiento de Google Wallet) | El cliente final todavía no vive "dentro" de su wallet |

**Conclusión:** "siempre a un toque" es cierto en iPhone con Apple Wallet. En Android de gama media, el "toque" son 3-5 pasos. El producto debe medirse en inscripciones completadas por sistema operativo, y debe tener fallback sin instalación (tarjeta web con número de teléfono).

### 3.5 Disposición a pagar

**No hay evidencia directa.** Lo que sí hay:

- **Precio ancla local:** MXN 0-550/mes (sección 2.4).
- **Madurez digital de la PyME:** solo 5.6% de ~4.9 M de PyMEs tiene sitio web y 12% vende en línea ([AMVO vía Computer Weekly](https://www.computerweekly.com/es/cronica/Migracion-digital-de-las-PyMEs-redefine-el-comercio-tradicional-en-Mexico)); 55% de las MiPyMEs usa herramientas digitales para contabilidad ([IDC Online](https://idconline.mx/finanzas/2025/01/15/como-tener-una-pyme-con-finanzas-saludables-en-2025)) [SECUNDARIA].
- **Fricción de cobro:** 28.6% de los adultos tenía tarjeta de crédito y 62.8% tarjeta de débito en 2024 (ENIF vía [BBVA Research](https://www.bbvaresearch.com/wp-content/uploads/2026/08/2026-08-25_Tenencia_Deb_y_Cred_Endutih.pdf), [Xataka](https://www.xataka.com.mx/banca-digital/adultos-mexico-cada-vez-usan-tarjetas-ninos-siguen-practicamente-igual-hace-casi-decada)) [OFICIAL]. OXXO Pay **no soporta pagos recurrentes** en Stripe ([Stripe](https://docs.stripe.com/payments/oxxo)). Consecuencia: ofrecer **prepago anual/semestral** (Lealify cobra MXN 2,500/año), transferencia SPEI y facturación CFDI.
- **Barra de ROI para justificar el precio:** a MXN 450/mes y un margen de contribución de ~MXN 75 por visita (ticket de MXN 120 y margen ~65%) [SUPUESTO], el negocio debe recuperar **~6 visitas adicionales al mes** para pagarse. Es una barra baja si se mide, y un riesgo si no se puede demostrar. Eso apunta a la cuña (sección 6).

### 3.6 Lo que no pude verificar

Adopción real de pases wallet de lealtad en México; volúmenes de búsqueda; tráfico de competidores; si Treinta, Kyte, Clip o Mercado Pago tienen módulo de lealtad para comercios; base instalada de Loyverse en México; origen y presencia real de FIU; clasificación exacta de establecimientos por SCIAN para tu embudo. Todo esto es trabajo de la Fase 0.

---

## 4. Riesgos principales

Escala: P = probabilidad, I = impacto (A = alta, M = media, B = baja).

| # | Riesgo | P | I | Evidencia | Mitigación |
|---|---|---|---|---|---|
| 1 | **Comoditización y piso de precio.** El wallet es commodity y el micro-plan es gratis | A | A | SMS Masivos (MXN 379), FIU (EUR 9.99), Loopy (USD 25), SleekPass (USD 4.99), Google no-code | No competir por "tarjeta bonita"; vender resultado medible y servicio de configuración; segmento con 2+ sucursales |
| 2 | **Venta a PyMEs: CAC alto frente a ARPU bajo.** Con ARPU de MXN 350, el CAC máximo para LTV:CAC 3:1 es ~MXN 2,000 | A | A | Cálculo (sección 4.1) | Ventas presenciales del fundador, referidos, alianzas (contadores, diseñadores, agencias, cámaras), prepago anual |
| 3 | **Churn de PyMEs.** El dueño que no ve ROI en 60 días cancela | A | A | Lealify: ~33% de activación de registrados; precedentes Belly/Fivestars | Reporte semanal de "clientes que volvieron", onboarding hecho por ti, contratos anuales con descuento |
| 4 | **Dependencia de Apple/Google.** Cuotas de notificaciones, políticas, certificados, aprobaciones | M | A | Google: issuer con aprobación y 3 pushes/día por usuario; Apple: Developer Program, certificado Pass Type ID y cuotas; las notificaciones fallan en silencio con certificado/tópico mal configurado | Arquitectura con ambos; WhatsApp y tarjeta web como canales alternos; iniciar las aprobaciones de Apple y Google ya (tienen tiempos de espera) |
| 5 | **Plataformas que absorben la función.** Google ya ofrece consola no-code gratis y vincula pases automáticamente | M | M | [Google](https://developers.google.com/wallet/retail/loyalty-cards/) | No construir sobre la "creación de pases" como valor; el valor es el flujo operativo y la medición |
| 6 | **Adopción en el punto de venta.** Depende de que el cajero pida el QR y el cliente lo agregue; Android con fricción | A | A | Reseñas Loopy; Android 78.7% | Inscripción por número de teléfono en caja; fallback web; cartel QR; capacitación de 15 min; medir tasa de inscripción por sucursal |
| 7 | **Costo de WhatsApp.** Mensaje de marketing en México ~USD 0.0305 y de utilidad ~USD 0.0085 por mensaje desde julio 2025 | M | M | [Meta](https://developers.facebook.com/docs/whatsapp/pricing) (tarifa vía agregadores; verificar la tarifa vigente) | Incluir cuota de mensajes y cobrar excedente; en el MVP usar enlaces `wa.me` manuales |
| 8 | **Cobro y fiscal.** Baja penetración de crédito; sin CFDI se vuelve menos atractivo para empresas | M | M | ENIF; Stripe/OXXO | Prepago, SPEI, domiciliación; emitir CFDI (hipótesis: los proveedores extranjeros no lo hacen) |
| 9 | **Privacidad.** La nueva LFPDPPP (vigente desde marzo de 2025; la autoridad pasó a la Secretaría Anticorrupción y Buen Gobierno) exige aviso de privacidad y controles sobre encargados | M | M | [Littler](https://www.littler.com/es/news-analysis/asap/mexico-tiene-nueva-ley-en-materia-de-proteccion-de-datos-personales) | Aviso simplificado en el alta, contrato de encargado con cada negocio, consentimiento explícito para WhatsApp |
| 10 | **Marca y nombre.** Colisión con Lealify, LEAL, Lealy; `@lealtab` ocupado | M | M | Sección 2.6 | Búsqueda en MARCia antes de la Fase 3 |
| 11 | **Alcance y capacidad del fundador.** Plataforma de 9 módulos con una sola persona (posiblemente a tiempo parcial; no lo sé) | A | A | Caso Leal | Un solo caso de uso hasta pasar el Gate 2 |
| 12 | **Sobreinversión en marca antes de validar.** | A | M | Sección 5 | Reordenar fases |

### 4.1 Economía unitaria (modelada, [SUPUESTO])

| Escenario | ARPU | Margen bruto | Churn mensual (supuesto) | Vida | LTV | CAC máximo (LTV:CAC 3:1) |
|---|---|---|---|---|---|---|
| A. Micro, 1 sucursal | MXN 349 (~US$20) | 85% | 5% | 20 meses | ~US$340 (~MXN 5,950) | ~US$113 (~MXN 2,000) |
| B. 2-5 sucursales | MXN 1,499 (~US$86) | 80% | 2.5% | 40 meses | ~US$2,740 (~MXN 48,000) | ~US$915 (~MXN 16,000) |

No hay benchmark confiable de churn de lealtad para PyMEs mexicanas; sustituye por tus datos del piloto. **El escenario A solo se sostiene con CAC casi nulo (boca a boca, SEO, alianzas). El escenario B permite visitas, demos y ventas asistidas.**

---

## 5. Crítica del orden de fases

### 5.1 ¿Tiene sentido invertir tanto en branding antes de validar?

**No como está planteado.** Razones:

1. **Cada fase de marca (1-4) produce documentos, no información.** Ninguna reduce la incertidumbre que decide el negocio: si el segmento paga, si el cajero la usa, si los clientes regresan.
2. **La marca saldrá mejor con clientes reales.** Voz, promesa y diferenciadores se afinan escuchando cómo hablan los dueños (la propia Fase 1 pide "audiencia" y "propuesta de valor", pero hoy serían hipótesis sin datos).
3. **Costo de oportunidad.** Con un fundador sin equipo, el tiempo es el recurso más escaso. Un plan secuencial de 7 pasos con el desarrollo al final puede consumir meses antes de la primera conversación con un cliente (estimación mía).
4. **Los referentes elegidos corresponden a otro comprador.** Stripe, Linear y Vercel construyeron su marca sobre un producto que ya funcionaba y cuyo comprador evalúa documentación y diseño. Tu comprador evalúa precio, si funciona con los teléfonos de sus clientes, si el cajero lo aprende en 2 minutos y si trae gente de vuelta.
5. **Los cambios de nombre o de segmento invalidan el trabajo hecho.** Hay una búsqueda de marca pendiente (sección 2.6) y el segmento no está elegido.
6. **El diseño premium sí puede ser cuña en un segmento concreto** (negocios de marca cuidada, clientes jóvenes con iPhone). Pero se demuestra con **un pase wallet espectacularmente bien hecho para 5 negocios**, no con un brand book.

**Lo que sí conservar:** la estrategia de marca en versión ligera (1 página), la regla de no atar el isotipo a una tarjeta y el principio de calidad visual desde el primer contacto.

### 5.2 Orden alternativo (con puertas de decisión)

| Fase | Tiempo | Qué se hace | Qué NO se hace | Salida |
|---|---|---|---|---|
| **0. Verificación de supuestos** | Semana 1 | Búsqueda en MARCia; identificar al titular de `@lealtab`; conteo en DENUE de negocios objetivo en Villahermosa; compra misteriosa a 6 competidores; solicitar cuenta Apple Developer (USD 99/año) y emisor de Google Wallet; guion de entrevistas | Logo, paleta | Lista de 40 negocios objetivo; matriz de competidores; cuentas en trámite |
| **1. Marca mínima** | Semana 1-2 (3-4 días) | Posicionamiento de 1 página orientado al **dueño**; voz; wordmark con una tipografía existente + un color de acento; **plantilla de pase wallet** muy bien diseñada; landing de 1 página con CTA a WhatsApp | Creative Direction completa, brand book, design system | Landing y 3 pases demo |
| **2. Descubrimiento + piloto concierge** | Semanas 2-7 | 20 entrevistas; 10 pilotos (herramienta alquilada o MVP mínimo); **cobrar**; medir | Módulos extra (CRM, IA, API) | Datos reales de inscripción, retorno, pago |
| **Gate 1** | Semana 7 | Decisión: seguir / pivotar / detener (sección 9) | | |
| **3. Producto v1 propio** | Semanas 8-15 | Construir **solo** el flujo que los pilotos usaron; design system mínimo (tokens + ~12 componentes sobre una base como Tailwind/shadcn) | Plataforma de 9 módulos | MVP en producción con clientes de pago |
| **Gate 2** | ~Semana 16 | 15 clientes de pago, retención aceptable, un canal replicable | | |
| **4. Identidad visual completa + sitio de marketing** | Tras Gate 2 (o MRR >= MXN 10,000) | Logo, isotipo, brand book, Creative Direction, con voz y casos reales | | Marca definitiva |
| **5. Crecimiento** | Continuo | Canal(es) que funcionaron; segundo vertical | | |
| **6. Módulos de plataforma** | Solo por demanda | Campaigns/Automations/Analytics cuando >=3 clientes lo pidan y paguen | AI/API/Passes por especulación | |

---

## 6. Segmento de entrada y cuña

### 6.1 Cliente ideal (ICP) recomendado

**Dueño-operador de un negocio de visita recurrente con 1-4 sucursales en Villahermosa (laboratorio) y luego ciudades medianas del sureste (Mérida, Veracruz, Cancún):**

- Ticket promedio de >= MXN 120 y cliente que vuelve >= 2 veces al mes.
- Clientela principalmente de 18-40 años (mayor probabilidad de iPhone y de uso de Wallet).
- Activo en Instagram y WhatsApp; hoy usa tarjetas de cartón o nada.
- El comprador es el dueño (decisión en días, no en meses).

> **Nota 7 oct 2026:** el piloto se amplió a 20 negocios en cuatro oficios (barberías, estéticas y salones de belleza, tapiocas y cafeterías) y los umbrales del Gate 1 se escalaron a 20. Ver D-003 en `docs/decisiones.md` y `docs/02-plan-de-trabajo.md`. Este informe se conserva como análisis original.

**Verticales para los 10 pilotos** (empieza con **uno** y compara con el segundo):

1. **Cafeterías de especialidad y panaderías/pastelerías artesanales** (visita semanal, sello natural, cuidan su marca).
2. **Barberías y estéticas** (visita cada 3-5 semanas, ticket MXN 150-600, el cliente ya agenda por WhatsApp).

**Por qué este segmento:** el problema es común; el comprador es accesible en persona (ventaja real del fundador); el diseño del pase importa para su marca; con 2-4 sucursales el ARPU llega a MXN 600-1,500 sin pelear con planes gratis.

**Qué descarto en la fase 1:**

- Abarrotes y micro-negocios de subsistencia (ARPU bajo, plan gratis, baja madurez digital).
- Cadenas y retail grande (Leal, Punchh, Paytronix; ciclos largos).
- E-commerce (Smile.io y apps de Shopify).
- Gimnasios y membresías (su problema es retención por membresía, no lealtad por visita; probar después).
- Restaurantes de comida corrida y farmacias con sistema propio.

**Hipótesis de precio a probar:** MXN 399/mes por negocio (1 sucursal), MXN 299 por sucursal adicional, prepago anual con 2 meses gratis; configuración incluida. Probar 299 / 499 / 799.

### 6.2 Cuña diferenciadora (tres hipótesis, ninguna probada)

1. **"Regreso medible."** Panel y **resumen semanal por WhatsApp al dueño**: "este mes volvieron N clientes que llevaban más de 30 días sin venir; ingreso atribuible estimado: $X". Los competidores prometen "+30% de ventas" sin medir. Convertir el valor en cifra defiende el precio y reduce el churn.
2. **"Funciona en el celular de todos."** Apple Wallet en iPhone; en Android, un flujo de un toque a Google Wallet **con fallback a tarjeta web sin instalar nada** y número de teléfono como identificador en caja. Ataca la queja documentada de Loopy sobre Android y el 78.7% de Android en México.
3. **"Hecho por nosotros en 24 horas."** Pase diseñado con la marca del negocio, cartel QR impreso, capacitación de 15 minutos al cajero, soporte por WhatsApp en español y facturación CFDI. Es un servicio, pero es lo que realmente vende a una PyME. Aquí es donde el estándar de diseño "premium" se vuelve ventaja: en la calidad del pase y de la experiencia, no en el sitio corporativo.

**Honestidad sobre el moat:** las tres cuñas son copiables en semanas. Hoy **no hay ventaja defendible**. La defensa realista viene de distribución (relaciones locales y alianzas), del historial de datos de ROI del cliente, del costo de cambio (su base de clientes vive en tu sistema) y de la velocidad.

**Dificultad (juicio mío):**

- Técnica del MVP: 3/10. Pases de Apple (PassKit + servicio web + APNs) y Google (API de objetos de lealtad) están bien documentados; el riesgo es la depuración de las actualizaciones de pase.
- Técnica de la plataforma de 9 módulos: 7/10 y costosa.
- Comercial: 8/10 (CAC, churn, adopción en caja).

---

## 7. MVP mínimo

### 7.1 Etapa A: MVP concierge (semanas 1-2, sin código)

Antes de escribir producto, **alquila el motor** y vende el resultado:

- **Boomerangme Agency (marca blanca, USD 214-259/mes)** permite ofrecer el servicio bajo tu marca y es el único de los revisados que lo plantea explícitamente. Alternativamente **Loopy Starter/Growth (USD 25-69/mes)** con tu servicio de configuración, **verificando antes sus términos sobre reventa**.
- Tú haces: diseño del pase, cartel QR, capacitación, reporte semanal manual (hoja de cálculo + mensaje de WhatsApp).
- Objetivo: 10 pilotos y datos de inscripción, retorno y pago. Si esto no funciona con un motor ajeno, ninguna identidad ni arquitectura propia lo va a arreglar.

### 7.2 Etapa B: MVP propio (solo si se pasa el Gate 1; ~4-6 semanas a tiempo parcial, [SUPUESTO])

| Dentro del MVP | Fuera del MVP |
|---|---|
| Alta de cliente: QR/enlace en mostrador -> nombre + WhatsApp -> pase en Apple Wallet/Google Wallet; **fallback** a tarjeta web con QR | CRM, segmentación avanzada, automatizaciones, IA, API pública |
| Sello/puntos desde una **PWA del cajero** (escanear QR o teclear teléfono); PIN por sucursal | App nativa |
| **Anti-fraude básico:** un sello por cliente cada X horas, bitácora por empleado, QR firmado e impredecible | Niveles VIP, referidos, cashback, tarjetas de regalo |
| Premio configurable y canje con confirmación | Integraciones con POS |
| Actualización automática del saldo en el pase (Apple y Google) | Marca blanca multi-cuenta |
| **Panel mínimo:** clientes nuevos, visitas, canjes, "en riesgo" (>30 días sin volver), **tasa de retorno** y estimación de ingreso atribuible | Módulos "Analytics", "Passes" (boletos/eventos) |
| **Resumen semanal por WhatsApp al dueño** | Campañas masivas por WhatsApp Business API (costo por mensaje) |
| Mensaje de reactivación con enlace `wa.me` manual y push de wallet (respetando los límites) | |
| Cobro: prepago por transferencia/SPEI o tarjeta; CFDI opcional vía un PAC | |

**Stack sugerido (opciones, no obligaciones):** TypeScript/Next.js, Postgres (Supabase o Neon), generación y firma de pases (por ejemplo `passkit-generator`) más el servicio web de Apple, API de Google Wallet, cola para actualizaciones, PWA para el cajero, Stripe Billing + SPEI manual, analítica de eventos (PostHog).

**Presupuesto de arranque [SUPUESTO]:** Apple Developer USD 99/año; Google Wallet sin costo; hosting USD 20-50/mes; motor alquilado para pilotos USD 25-259/mes; pruebas de anuncios MXN 3,000-5,000; cartel QR impreso para pilotos. En total, menos de ~MXN 15,000 hasta el Gate 1 (sin contar tu tiempo).

---

## 8. Experimentos de validación

Los umbrales son heurísticos míos (no son benchmarks verificados); ajústalos con tus entrevistas, pero **fíjalos antes de empezar**.

| # | Experimento | Hipótesis | Método | Éxito | Fracaso | Decisión |
|---|---|---|---|---|---|---|
| E0 | **Verificaciones bloqueantes** | El nombre y el handle son utilizables | Búsqueda MARCia (clases 9/35/42); identificar `@lealtab`; abrir trámites Apple/Google | Sin oposición probable; cuentas en trámite | Marca registrada en la categoría por un tercero | Si falla: cambiar de nombre **antes** de la Fase 3 |
| E1 | **20 entrevistas** (cafeterías y barberías, Villahermosa) | Retener clientes es prioridad y hoy se resuelve mal | Guion tipo "Mom Test" (ver 8.1). Sin pitch | >= 12 de 20 ponen "que vuelvan mis clientes" entre sus 3 prioridades; >= 6 aceptan un piloto en 7 días | < 3 aceptan piloto | Pivotar de segmento si falla |
| E2 | **Compra misteriosa** a 6 competidores (Lealify, Fideliza, SMS Masivos, FIU, Loopy, Stamp Me) | Hay brechas repetibles en onboarding, Android o reportes | Alta como negocio y como cliente; medir tiempo hasta primer sello, pasos en Android | >= 2 brechas que además mencionan los entrevistados | Todo cubierto y sin queja | Replantear la cuña |
| E3 | **Prueba de humo** (landing + anuncios + WhatsApp) | Hay demanda inbound a costo viable | Landing en español dirigida al dueño; MXN 3,000-5,000 en Meta a Villahermosa; consulta en Keyword Planner | CPL <= MXN 150; >= 3% de clics a WhatsApp; >= 10 leads calificados | CPL > MXN 400 o < 1% de clics | Si falla, depender solo de canales presenciales y referidos |
| E4 | **Pilotos concierge** (10 negocios, 30 días) | El flujo funciona en caja y los clientes regresan | Motor alquilado + tu servicio; eventos: inscripciones, sellos, canjes, visitas | Ver criterios (8.2) | Ver criterios (8.2) | Gate 1 |
| E5 | **Preventa** | Pagan antes de tener producto propio | Cobrar 3 meses con descuento a 5 negocios | >= 3 de 5 pagan | 0-1 pagan | Sin pago real no hay mercado probado |
| E6 | **Android vs iPhone** (dentro de E4) | El flujo Android no destruye la inscripción | Medir inscripciones completadas y pases efectivamente guardados por sistema | iPhone >= 70% guardan el pase; Android >= 50% (con fallback web) | Android < 30% | Si falla, pasar a WhatsApp/web como canal principal y wallet como extra |
| E7 | **Canal y costo de venta** | Hay un canal repetible | Comparar: visitas puerta a puerta (40 negocios), DMs de Instagram (100), referidos de los primeros clientes, alianzas (contadores, diseñadores, cámaras) | <= 4 horas de fundador por cliente en el mejor canal | > 12 horas por cliente en todos | Define dónde invertir |
| E8 | **ROI medible** (dentro de E4) | Se puede demostrar retorno | Visitas de inscritos vs 8 semanas previas del negocio; días con y sin cartel | >= 25% de inscritos con segunda visita en 21 días y >= 6 visitas adicionales/mes por negocio | Sin diferencia visible | Si no se puede medir, la cuña 1 cae |

### 8.1 Guion de entrevista (8 preguntas, sin vender)

1. ¿Qué hiciste la última vez que quisiste que un cliente regresara? Cuéntame el caso.
2. ¿Qué porcentaje de tus ventas viene de clientes que ya conocías? ¿Cómo lo sabes?
3. ¿Has usado tarjetas de cartón, puntos o descuentos? ¿Qué pasó con eso?
4. ¿Quién del equipo las manejaba y qué problemas tuvieron (olvidos, trampas, costo)?
5. ¿Cuánto gastas al mes en publicidad, redes o software? ¿Qué pagas hoy y qué dejaste de pagar?
6. Si regresaran 10 clientes más al mes, ¿cuánto valdría para ti?
7. ¿Cómo prefieres pagar y quién decide? ¿Necesitas factura?
8. ¿Qué tendría que pasar en 30 días para que quisieras seguir usándolo?

### 8.2 Criterios de las puertas

**Gate 1 (semana ~7).** Se pasa si cumple **3 de los 4**:

- (a) >= 6 de 10 pilotos activos a los 30 días (>= 30 clientes inscritos y >= 1 canje).
- (b) >= 4 negocios pagando (aunque sea con descuento) >= MXN 299/mes o con prepago.
- (c) Tasa de inscripción >= 30% de los clientes que visitan, con cajero entrenado.
- (d) Retorno: >= 25% de inscritos con segunda visita en 21 días y >= 7 de 10 dueños dicen que lo recomendarían (con n=10 es dirección, no estadística).

**Kill / pivote en Gate 1** si hay <= 2 pilotos activos, 0-1 negocios que pagan o inscripción < 10%.

**Gate 2 (semana ~16).** >= 15 clientes de pago; MRR >= MXN 7,500; churn mensual por logo <= 8% (n pequeño, referencial); un canal con <= 6 h de fundador por cliente.

**Gate 3 (para invertir en identidad completa y módulos).** MRR >= MXN 30,000 con >= 60 clientes y al menos tres clientes pidiendo lo mismo para el siguiente módulo.

---

## 9. Veredicto final y criterios de corte

**GO CON CONDICIONES.** El problema es real, el costo de validar es bajo y hay una ventana (mercado local fragmentado y poco pulido). **Pero** el diferenciador actual es estético, el wallet ya es commodity, el ancla de precios local es muy baja y la distribución a PyMEs es el verdadero negocio. Esta idea solo merece más inversión si pasa los experimentos del apartado 8.

**Cambiaría mi veredicto a NO-GO si:**

- En E1 menos de 3 de 20 dueños aceptan un piloto, o ninguno paga en E5.
- En E4 la inscripción en caja es < 10% incluso con cajero entrenado.
- Las inscripciones en Android son < 30% y el fallback web no lo corrige.
- La búsqueda de marca arroja un titular previo en la categoría y el nombre no es viable.
- El fundador no puede dedicar tiempo regular a ventas presenciales (el escenario A depende de ello).

**Pivotes razonables si el Gate 1 falla:**

1. **Subir de segmento:** 3-15 sucursales (grupos de restaurantes, cadenas locales), ARPU MXN 1,500-5,000, con ventas asistidas.
2. **Vertical de mayor ticket:** clínicas dentales/estética y gimnasios boutique, donde la retención vale más por cliente.
3. **Servicio antes que software:** vender "tarjeta de lealtad en wallet hecha por nosotros" sobre motor alquilado (ingreso rápido, margen menor, aprendizaje máximo).
4. **Reventa/canal:** convertirse en el socio local de Boomerangme/PassKit para agencias y contadores del sureste.

**Qué no hacer ahora:** diseñar el logo, el design system, la arquitectura de módulos, la capa de IA o la API pública.

---

## 10. Próximos 14 días

1. Búsqueda de marca en MARCia (IMPI) para "LEALTAB" y "LEAL" en clases 9, 35 y 42. Identificar al titular de `@lealtab`.
2. Abrir cuenta Apple Developer y solicitud de emisor en Google Wallet (tienen tiempos de espera).
3. Contar en DENUE los negocios objetivo en Villahermosa (cafeterías, panaderías, barberías, estéticas) y armar una lista de 40.
4. Dar de alta una cuenta de prueba en Lealify, Fideliza, SMS Masivos, FIU y Loopy, y documentar tiempo hasta primer sello y flujo en Android.
5. Programar 20 entrevistas con el guion de 8.1.
6. Escribir la marca mínima en una página (para el dueño, no para el cliente final) y diseñar 3 pases wallet de demostración.
7. Publicar una landing de una página con CTA a WhatsApp y definir el presupuesto del anuncio de prueba.
8. Escribir y fechar los criterios de los Gates 1-3 (sección 8.2) para no moverlos después.

---

## Anexo: Fuentes

**Competidores globales (precios y producto)**
- Loopy Loyalty, precios: https://www.loopyloyalty.com/pricing [PROVEEDOR]
- Loopy Loyalty, reseñas: https://www.capterra.ca/reviews/160859/loopy-loyalty [SECUNDARIA]
- PassKit, precios: https://passkit.com/pricing/ [PROVEEDOR]; Capterra: https://www.capterra.com/p/10033797/PassKit/ [SECUNDARIA]
- Boomerangme, precios: https://boomerangme.com/pricing [PROVEEDOR]; Capterra: https://www.capterra.com/p/241848/Boomerangme [SECUNDARIA]
- Stamp Me, precios: https://www.stampme.com/pricing [PROVEEDOR]; blog México: https://www.stampme.com/blog/best-loyalty-apps-in-mexico [PROVEEDOR]
- Square Loyalty: https://www.capterra.com/p/276727/Square-Loyalty/ [SECUNDARIA]; disponibilidad: https://squareup.com/help/us/en/article/6464 [PROVEEDOR]
- Smile.io: https://www.costbench.com/software/loyalty-program/smile-io/ y https://www.rivo.io/blog/smile-io-pricing [SECUNDARIA, datos inconsistentes]
- Loyverse: https://loyverse.com/en-us/pricing [PROVEEDOR]
- SleekPass: https://pickyourapp.com/es/products/sleekpass [SECUNDARIA]
- Booksy: https://biz.booksy.com/es-us/funciones/las-tarjetas-de-lealtad [PROVEEDOR]

**México y LATAM**
- Lealify: https://lealify.com [PROVEEDOR; cifras autodeclaradas]
- Fideliza: https://fideliza.app/ [PROVEEDOR]
- SMS Masivos: https://www.smsmasivos.com.mx/tarjetas-de-lealtad-digitales [PROVEEDOR]
- FIU: https://www.fiuapp.com/ [PROVEEDOR]
- LoyaltyPro: https://loyaltypro.mx/ [PROVEEDOR]
- FidelyT: https://www.posta.com.mx/yucatan/conoce-fidelyt-app-para-premiar-la-lealtad-de-los-cliente-en-yucatan/v-vl2171731 [SECUNDARIA]
- LEAL: https://forbes.co/2024/01/31/emprendedores/leal-obtiene-us5-millones-para-integrar-ia-a-su-plataforma-de-recompensas/ ; https://forbes.co/2024/09/10/emprendedores/esta-startup-cambia-su-enfoque-pasa-de-ser-una-plataforma-que-fideliza-clientes-a-una-que-los-gestiona/ ; https://www.bloomberglinea.com/2022/04/11/fintech-colombiana-leal-llega-a-mexico-busca-crear-1000-alianzas-con-retailers/ [SECUNDARIA]
- Lealy: https://apps.apple.com/mx/app/mylealy/id6742460768 ; Big Fidelity: https://apps.apple.com/mx/app/big-fidelity/id6450744343 ; Fidelity MixedPay: https://apps.apple.com/mx/app/fidelity-mixedpay/id6474262526
- Mercado Pago Cuenta Negocio: https://dplnews.com/?p=328406 [SECUNDARIA]
- Contenido patrocinado sobre lealtad (no usar como dato): https://newsinamerica.com/pdcc/noticias/economia/2026/programa-de-puntos-digital-la-clave-para-retener-clientes-en-pymes-mexicanas/

**Mercado y datos oficiales**
- Unidades económicas y tamaño: https://www.milenio.com/negocios/en-mexico-el-95-5-por-ciento-empresas-eran-micro-2023-inegi ; https://www.inegi.org.mx/contenidos/saladeprensa/aproposito/2025/EAP_MIPYMES_25.pdf ; https://inegi.org.mx/contenidos/saladeprensa/boletines/2024/denue/denue2024_11.pdf ; https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2025/ce/CE_2024_Def_Tab.pdf
- Mercado de lealtad: https://www.globenewswire.com/fr/news-release/2025/08/11/3130648/28124/en/Mexico-Loyalty-Programs-Market-Intelligence-Report-2025-2029-Data-Driven-Personalization-and-Cashback-Models-Pave-Way-for-Expansion.html ; https://www.marketsandmarkets.com/Market-Reports/geography/loyalty-management-market/Latin-America
- Consumidor (EY 2025): https://www.ey.com/content/dam/ey-unified-site/ey-com/latam/insights/consulting/documents/ey-estrategias-programas-fidelizacion-latinoamerica-2025.pdf ; https://www.elimparcial.com/dinero/2025/08/04/segun-estudio-83-de-los-mexicanos-eligen-marcas-con-programas-de-lealtad-en-que-consiste-esta-estrategia-de-ventas/
- Conectividad y WhatsApp: https://www.cronica.com.mx/nacional/2026/06/16/mexico-cada-vez-mas-conectado-internet-transforma-la-vida-de-millones-de-personas-pero-aun-enfrenta-desafios/ ; https://dplnews.com/?p=153178
- Digitalización de PyMEs: https://www.computerweekly.com/es/cronica/Migracion-digital-de-las-PyMEs-redefine-el-comercio-tradicional-en-Mexico ; https://idconline.mx/finanzas/2025/01/15/como-tener-una-pyme-con-finanzas-saludables-en-2025
- Sistema operativo y smartphones: https://gs.statcounter.com/os-market-share/mobile/mexico ; https://amp.milenio.com/negocios/mercado-de-smartphones-en-mexico-crece-7-por-ciento-en-2025-the-ciu
- Tarjetas bancarias: https://www.bbvaresearch.com/wp-content/uploads/2026/08/2026-08-25_Tenencia_Deb_y_Cred_Endutih.pdf ; https://www.xataka.com.mx/banca-digital/adultos-mexico-cada-vez-usan-tarjetas-ninos-siguen-practicamente-igual-hace-casi-decada
- Instalación wallet (afirmaciones de proveedores, no verificadas): https://blog.passworks.io/?p=782 ; https://bonusqr.com/article/how-small-businesses-can-add-loyalty-cards-to-apple-wallet
- Belly/Fivestars (blog de un competidor, sesgado): https://loop.fans/blog/belly-loyalty-program

**Apple, Google, Meta, Stripe, privacidad**
- Apple, pases de lealtad y proveedores certificados: https://developer.apple.com/wallet/loyalty-passes/
- Google Wallet, lealtad: https://developers.google.com/wallet/retail/loyalty-cards/ ; notificaciones: https://developers.google.com/wallet/retail/loyalty-cards/use-cases/trigger-push-notifications?hl=es ; pases vinculados: https://www.airship.com/docs/whats-new/2026-05-11-google-wallet-auto-linked-passes/
- Google Wallet en México: https://expansion.mx/tecnologia/2022/11/15/google-wallet-llega-a-mexico ; https://www.xataka.com.mx/aplicaciones/buenas-noticias-para-usuarios-android-mexico-google-permite-agregar-a-wallet-casi-cualquier-tarjeta
- Cuotas de notificaciones en Apple/Google: https://help.passkit.com/en/articles/11905171-understanding-push-notifications-for-apple-and-google-wallet-passes [PROVEEDOR]
- WhatsApp Business, precios: https://developers.facebook.com/docs/whatsapp/pricing (tarifas de México citadas vía agregadores; verificar en la tarjeta de tarifas vigente)
- Stripe y OXXO (sin recurrentes): https://docs.stripe.com/payments/oxxo
- Nueva LFPDPPP: https://www.littler.com/es/news-analysis/asap/mexico-tiene-nueva-ley-en-materia-de-proteccion-de-datos-personales ; https://www.gtlaw.com/es/insights/2025/3/nueva-ley-general-proteccion-de-datos
