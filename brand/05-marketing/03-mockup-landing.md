# LealTab · Mockup visual de la landing

Para revisión de Aarón López Sosa · Fase 5, Marketing · Pieza 3 · 6 de octubre de 2026

**Archivo:** [`03-mockup-landing.html`](./03-mockup-landing.html)  
**Base:** copy v1.1 aprobado (`02-copy-landing.md`) + tokens / botones Ciclo v2.

---

## Qué se mockeó

Las **8 secciones** + nav fijo + footer, con el copy aprobado en español:

1. **Hero** — titular, subtítulo, CTA bosque + secundario, nota 30 días; phone mock con tarjeta Barbería Norte y aro 4/5 (tip durazno en la visita por completar).
2. **Cómo funciona** — 3 pasos con íconos activos (negocio, escanear, visita).
3. **La tarjeta** — 3 ejemplos (barbería / estética / tapioca), bloque pantalla de inicio + mini guía iPhone/Android.
4. **Para quién** — 3 cards con ilustraciones SVG aprobadas.
5. **Precios** — banner prueba 30 días; Inicio $299 + IVA; Negocio $449 + IVA (badge Recomendado en durazno); Pro solo “Próximamente”.
6. **Confianza** — 4 bloques + WhatsApp secondary.
7. **Lo que viene** — bloque noche con 4 ítems etiquetados Próximamente.
8. **CTA final + FAQ + footer** — aro marketing completo (durazno) como acento; FAQ en acordeón; footer con logo, lema y enlaces.

Assets reales vía rutas relativas (`logo`, `ilustraciones`, `aro`, `iconos`, `tokens.css`). Tipografía Google Fonts Archivo (wdth 75) + Manrope.

---

## Decisiones visuales (Ciclo v2)

- Fondo **lino**, superficies **blanco-lino**, CTAs primary **bosque** + texto lino, bordes/sombras duras **noche**.
- **Durazno** solo: tip del aro en hero, badge “Recomendado”, aro completo del CTA final.
- Sin cupones, sin degradados arcoíris, sin urgencia falsa, sin precio de fundador.

---

## Pulido v1.1 (6 oct 2026)

Sin cambios de copy ni precios. Solo afinación visual / UX:

1. **Responsive:** `scroll-padding-top` + `scroll-margin-top: 80px` en secciones para que el nav sticky no tape anclas; `overflow-x: clip`; breakpoints ~700 / 720–899 (tablet hero) / 880 (nav) / 900; phone más compacto en tablet; planes apilados con **Negocio primero** en móvil (badge Recomendado visible); carrusel de tarjetas sin desbordar.
2. **Microinteracciones:** aro del hero anima el fill a 4/5 (`duration.arc`) + un pulso del tip durazno; hover de CTAs con lift suave (−1px) manteniendo sombra dura; drawer del menú con transición; FAQ con accordion suave (`grid-template-rows`); reveal ligero en títulos de sección.
3. **Accesibilidad:** `:focus-visible` con halo menta en botones, links, summary y toggle; Escape cierra el menú; `prefers-reduced-motion` desactiva animaciones y deja el aro en estado final.
4. **Capturas v2:** [`mockup/hero-v2.png`](./mockup/hero-v2.png), [`mockup/precios-v2.png`](./mockup/precios-v2.png), [`mockup/mobile-v2.png`](./mockup/mobile-v2.png), [`mockup/full-page-v2.png`](./mockup/full-page-v2.png).

---

## Abierto / a confirmar

1. Nombres de ejemplo en tarjetas (Barbería Norte, Estética Luna, Tapioca Sol) — ¿ok o preferís otros?
2. Número de WhatsApp real (ahora `wa.me/` vacío).
3. Enlace del aviso de privacidad (placeholder `#`).
4. En “La tarjeta”, los mini-aros usan el SVG 3/8 de UI (no hay asset 4/5 ni 2/6); el hero sí dibuja 4/5 en SVG inline.
5. ¿El phone mock del hero se siente premium o preferís foto/mockup más realista después?

---

## ¿Aprobamos este mockup?

¿Te late el pulido v1.1 para dar por cerrada la dirección visual de la landing (y pasar a kit de redes o implementación)?  
Marcá qué ajustar y lo iteramos.

---

## v1.2 · Hero (7 oct 2026) — en revisión

**Archivo:** [`03-mockup-landing-v1.2.html`](./03-mockup-landing-v1.2.html) (la v1.1 se conserva en `03-mockup-landing.html`). Solo cambia el hero; el resto de secciones son las de v1.1.
**Base:** `../../lealtab-analisis-landing-ciclo-v2.md` y copy v1.2 (`02-copy-landing.md`).
**Capturas:** [`mockup/hero-v1.2.png`](./mockup/hero-v1.2.png) (1440) y [`mockup/hero-mobile-v1.2.png`](./mockup/hero-mobile-v1.2.png) (390).

- **Titular:** el lema "Haz que tus clientes siempre regresen." en Archivo 800 (hasta 92 px), en tres líneas. Subtítulo: "Tu tarjeta de lealtad, ahora en el celular de tus clientes. La instalan con un toque, sin descargar nada."
- **Aro protagonista:** un aro grande en 4/5, arriba a la derecha y saliendo del encuadre. Se dibuja desde las 12 en 650 ms, se pasa un 3 % y regresa una vez. La visita 5 aparece en durazno con un pulso: es el único durazno de la vista. El celular tapa el cuadrante inferior izquierdo, de modo que el final del avance y la punta durazno siempre quedan a la vista.
- **Celular con UI real de la PWA:** encabezado del negocio, tarjeta 4/5, últimas visitas, "Mostrar mi código" y "Hecho con LealTab". Se quitaron los emojis de la pantalla de inicio.
- **Sticker:** "Casi premio" en menta con texto noche, rotado 4°, con sombra de 3 px y entrada de 240 ms (solo marketing).
- **Botón firma:** "Crea tu tarjeta gratis" en bosque con la flecha en un bloque noche, contorno de 2.5 px y sombra de 4 px. Al presionarlo baja a su sombra en 90 ms. El secundario pasa a enlace de texto.
- **Móvil:** titular, subtítulo, CTA a todo el ancho, enlace y nota; abajo, el celular a la izquierda y el aro asomando por la derecha. En tableta la escena se centra en 400 px.
- **Reducir movimiento:** el aro y el sticker aparecen directo en su estado final.

**Abierto:**
1. El botón con flecha en bloque no está en la pieza 2 del design system: si se aprueba, se documenta como variante "CTA marketing".
2. El cierre (sección 8) todavía repite el lema; falta decidir su titular.
3. En tableta (700–899 px) el aro y el celular quedan lado a lado, con menos traslape que en móvil y escritorio.

## v1.2 · Cómo funciona (7 oct 2026) — en revisión

**Capturas:** [`mockup/como-funciona-v1.2.png`](./mockup/como-funciona-v1.2.png) (1440) y [`mockup/como-funciona-mobile-v1.2.png`](./mockup/como-funciona-mobile-v1.2.png) (390). La estructura de esta versión está en [`01-estructura-landing-v1.2.md`](./01-estructura-landing-v1.2.md); la v1.1 aprobada sigue intacta.

- **Sin la fila de tres cards:** la sección queda sobre lino, separada del hero por una línea fina noche.
- **Escritorio:** a la izquierda, fijos mientras se hace scroll, la etiqueta, el titular, un aro de avance mediano ("1 de 3" → "3 de 3", con transición de 600 ms) y el CTA con flecha en bloque. A la derecha, los tres pasos se recorren uno por uno; la etiqueta del paso a la vista se llena de bosque. El aro de avance se queda en bosque (el durazno se reserva para la recompensa).
- **Cada paso muestra la interfaz real** en lugar de un ícono, al nivel de producto (contorno de 2 px y sombra solo en el contenedor):
  1. Editor de la tarjeta: nombre, color, recompensa y vista previa 0/5.
  2. QR de mostrador junto a "Compartir → Agregar a inicio" y el ícono BN en la pantalla de inicio.
  3. Tabla de clientes con estados planos: Casi premio (menta), Frecuente (bosque) y Te extrañamos (colores de riesgo). Andrés es el mismo cliente del hero (4/5, última visita el 2 de octubre).
- **Móvil:** los pasos se apilan, sin aro de avance, y el CTA va a todo el ancho al final. La jerarquía queda titular de sección (36 px) > título de paso (24 px).
- **Reducir movimiento:** el aro cambia de paso sin transición.

**Abierto:**
1. El microcopy de las muestras de UI es ilustrativo ("Escanea y guarda tu tarjeta", "Clientes · últimos 30 días", "Vista previa"): no está en el copy aprobado.
2. El QR es decorativo (no escaneable).

## v1.2 · La tarjeta (7 oct 2026) — en revisión

**Capturas:** [`mockup/la-tarjeta-v1.2.png`](./mockup/la-tarjeta-v1.2.png) (1440, barbería) y [`mockup/la-tarjeta-mobile-v1.2.png`](./mockup/la-tarjeta-mobile-v1.2.png) (390, tapioca).

- **Una sola tarjeta grande con selector** (Barbería · Estética · Tapioca) en lugar de tres cards con tres mini aros 3/8 en fila, que rompían la regla de "nunca hileras de aros iguales" y no coincidían con su texto.
- **El selector cambia** el nombre, las iniciales, los colores, el mensaje, la cifra grande (4/5, 2/6, 7/10, en Manrope tabular) y el avance del aro, con una transición de 600 ms. También cambia el ícono en la pantalla de inicio. Se maneja con teclado (flechas izquierda y derecha) y el panel anuncia el cambio a lectores de pantalla.
- **Temas dentro de la paleta:** barbería en bosque, estética en blanco lino y tapioca en noche. En tapioca no hay sombra, porque la sombra noche no se distingue sobre noche.
- **Fondo:** banda de menta pura (token), en lugar del tinte `color-mix` de v1.1. Es la banda de apoyo de la página.
- **Instalación sin cajas:** "En su pantalla de inicio" con íconos vacíos en lugar de emojis, y "Cómo se instala" en dos filas (iPhone / Android). El copy es el aprobado.
- **Reducir movimiento:** el aro cambia sin transición.

**Abierto:**
1. "Toca un negocio para ver su tarjeta." es microcopy nuevo, no está en el copy aprobado.
2. Las tarjetas de ejemplo usan solo colores de la paleta de LealTab. Un negocio real traería sus propios colores.
3. La sección siguiente (Para quién) sigue en v1.1 con un tinte menta, así que hoy quedan dos bandas verdes seguidas. Se resuelve al rediseñarla.

## v1.2 · Para quién (7 oct 2026) — en revisión

**Capturas:** [`mockup/para-quien-v1.2.png`](./mockup/para-quien-v1.2.png) (1440) y [`mockup/para-quien-mobile-v1.2.png`](./mockup/para-quien-mobile-v1.2.png) (390).

- **Sin las tres cards iguales:** ahora son tres filas separadas por líneas finas noche, con la ilustración y el texto alternando de lado en escritorio (barbería a la izquierda, estética a la derecha, tapioca a la izquierda). En móvil van apiladas: ilustración, oficio y línea.
- **Ilustraciones sueltas sobre lino** (versión `-sin-sombra`, sin fondo propio), a 360 px. Se tratan como objetos, siguiendo la regla de "las herramientas son las protagonistas, con aire alrededor".
- **Oficio como titular** en Archivo (hasta 44 px) y la línea de cada uno a tamaño lead. El copy es el aprobado, sin cambios.
- **Fondo lino:** después de la banda menta de La tarjeta ya no quedan dos bandas verdes seguidas.
- La línea final ("¿Tu negocio vive de que el cliente regrese? También es para ti.") queda alineada a la izquierda, como el resto de la página.

## v1.2 · Corrección de aros (7 oct 2026)

Ajuste a las reglas aprobadas del aro (`recursos/recursos.md` y brand book, páginas 18 y 22):

- **Aro de interfaz** (tarjeta en el teléfono del hero y tarjeta de La tarjeta): ahora va **plano, sin contorno ni sombra**, con carril menta, avance bosque y la cifra en Manrope tabular dentro. Va sobre un panel blanco lino; la marca del negocio vive en el marco y el encabezado de la tarjeta, como en el ejemplo de la PWA del brand book. En el hero, el panel apila el aro y el mensaje, y "Mostrar mi código" pasa a botón primario bosque.
- **La tarjeta:** el aro es igual en los tres temas (barbería, estética y tapioca); solo cambia el marco. Estética pasa de blanco lino a lino para que el panel interior se distinga.
- **Aros de marketing** (hero y avance de Cómo funciona): el contorno se ajustó a unos 3 px y la sombra dura a unos 6 px.
- **Durazno del hero:** primero se quitó la punta durazno y luego Aarón decidió regresarla (7 oct 2026). La visita 5 va en durazno en el aro grande y en el aro de la tarjeta del teléfono (plano, como el resto del aro de interfaz). Es una excepción del hero a la regla "durazno solo en el aro completo".

## v1.2 · Precios (7 oct 2026) — en revisión

**Capturas:** [`mockup/precios-v1.2.png`](./mockup/precios-v1.2.png) (1440) y [`mockup/precios-mobile-v1.2.png`](./mockup/precios-mobile-v1.2.png) (390).

- **Encabezado a dos columnas:** el titular a la izquierda y, a la derecha, la prueba gratis ("Pruébala gratis 30 días. Sin tarjeta de crédito.") con el botón con flecha en bloque. Ya no hay banner bosque: el bosque se guarda para los capítulos.
- **Negocio destacado sin durazno (ajuste por petición de Aarón: más peso al plan que se quiere vender):** bloque bosque con texto lino, columna más ancha (1.15 contra 1), sobresale 24 px arriba y abajo en escritorio, sombra dura de 8 px, nombre a 32 px y precio a 72 px. La etiqueta "Recomendado" va en menta a tamaño de sticker grande (Archivo 15 px, contorno de 2 px y sombra de 3 px, sin rotar), junto al nombre del plan y no sobre el precio. Su CTA es el botón con flecha en bloque invertido (etiqueta blanco lino y flecha noche). Las viñetas de check toman el color del texto (lino en Negocio, noche en Inicio).
- **Inicio:** contorno de 2 px, sin sombra; su CTA es el botón secundario, para que no haya dos primarios iguales lado a lado.
- **Pro:** sin caja llena, solo un contorno tenue y el texto "Próximamente", sin precio ni botón.
- **Precios** en Manrope 700 tabular a 56 px, con "MXN/mes + IVA" debajo. Las viñetas son el ícono de check del set aprobado, en lugar de puntos que podían leerse como sellos.
- **Móvil:** Negocio va primero. El copy y los precios son los aprobados, sin cambios.

## v1.2 · Confianza (7 oct 2026) — en revisión

**Capturas:** [`mockup/confianza-v1.2.png`](./mockup/confianza-v1.2.png) (1440) y [`mockup/confianza-mobile-v1.2.png`](./mockup/confianza-mobile-v1.2.png) (390).

- **Sin las cuatro cards con sombra:** ahora es una cuadrícula de 2×2 (una columna en móvil) separada por líneas finas noche, sobre lino. Se lee como una lista de compromisos.
- **Cada compromiso como titular** en Archivo (hasta 30 px) con su línea a tamaño de texto. Los íconos pasan del set "activo" al de línea (28 px), más sobrios.
- **Titular de sección alineado a la izquierda**, separado de Precios por una línea fina, como en Cómo funciona.
- "Escríbenos por WhatsApp" se queda como botón secundario. El copy es el aprobado, sin cambios.
- Sin tinte `color-mix` de fondo: el siguiente bloque (Lo que viene) es el capítulo en bosque.

## v1.2 · Lo que viene (7 oct 2026) — en revisión

**Capturas:** [`mockup/lo-que-viene-v1.2.png`](./mockup/lo-que-viene-v1.2.png) (1440) y [`mockup/lo-que-viene-mobile-v1.2.png`](./mockup/lo-que-viene-mobile-v1.2.png) (390).

- **Capítulo en bosque** (decisión v1.2), con texto lino y contorno noche de 3 px arriba y abajo. Es el único bloque oscuro de la página por ahora.
- **"Lo que viene." a tamaño display** (Archivo 96 px en escritorio, 56 px o más en móvil), con la línea del piloto debajo.
- **Mosaicos en noche (ajuste por petición de Aarón: las líneas se sentían planas):** cuadrícula de 2×2 (una columna en móvil) de mosaicos noche sobre el bosque, con contorno lino tenue. Un tono más oscuro da profundidad sin parecer funciones ya disponibles, como pasaría con tarjetas claras. Cada mosaico lleva el ícono aprobado en un cuadro menta (Avisos → Notificación, Campañas → Calendario, Varias sucursales → Negocio, Apple y Google Wallet → Cartera, ícono nuevo en propuesta), "Próximamente" como etiqueta de texto en menta (no sticker, para respetar el máximo de dos por pieza), el nombre en Archivo hasta 30 px y su línea.
- Sin fechas. El copy es el aprobado, sin cambios.

## v1.2 · Cierre + FAQ (7 oct 2026) — en revisión

**Capturas:** [`mockup/cierre-v1.2.png`](./mockup/cierre-v1.2.png) (1440) y [`mockup/cierre-mobile-v1.2.png`](./mockup/cierre-mobile-v1.2.png) (390). Página completa: [`mockup/full-page-v1.2.png`](./mockup/full-page-v1.2.png) y [`mockup/full-page-mobile-v1.2.png`](./mockup/full-page-mobile-v1.2.png).

- **Titular "Crea tu tarjeta hoy."** a tamaño display, con el subtítulo "Es gratis empezar." (decisión de Aarón), el botón con flecha en bloque y "¿Dudas? Escríbenos por WhatsApp.". Todo alineado a la izquierda.
- **Aro completo protagonista:** al entrar en pantalla se dibuja de 0 a 100 % (650 ms), cambia de bosque a durazno con un pulso del 4 % y aparece el sticker "¡Recompensa lista!" (durazno con texto noche, rotado −4°). Es la animación firma de `recursos.md` y cierra la historia del "Casi premio" del hero. El aro sale del encuadre por la derecha.
- **Ajuste (Aarón: el aro se veía vacío):** dentro del aro va **"5/5 cortes"** (Manrope 700 tabular, hasta 96 px), como en el asset aprobado `lt-aro-marketing-completo.svg`. Cierra la historia de Barbería Norte: 4/5 en el hero, 5/5 en el cierre. La cifra aparece con un fundido cuando el aro termina de completarse. Se quitó el límite de ancho global de los SVG para este aro, que lo encogía y descentraba la cifra. Con "reducir movimiento" (o sin JavaScript) se muestra directo el estado final.
- **FAQ en dos columnas:** el titular a la izquierda y el acordeón sin cajas a la derecha, con líneas finas y un botón +/– con contorno (bosque cuando está abierto). Se mantiene una pregunta abierta a la vez. Preguntas y respuestas son las aprobadas.
- **Corrección (Aarón: el footer daba un pequeño salto al abrir otra pregunta):** antes, la pregunta que se cerraba desaparecía de golpe mientras la nueva se abría con animación; la página se encogía un instante y, cerca del final, el navegador movía el scroll. Ahora la que cierra y la que abre se animan juntas (200 ms, misma curva), así la altura total cambia de forma continua. El signo +/– cambia al instante, varios toques rápidos no dejan la pregunta a medias y hay un respaldo si el navegador no avisa del fin de la animación. Con "reducir movimiento" el cambio es inmediato.
- El pie de página es el mismo de v1.1.

## v1.2 · Menú (7 oct 2026) — en revisión

**Capturas:** [`mockup/nav-v1.2.png`](./mockup/nav-v1.2.png) (escritorio) y [`mockup/nav-mobile-abierto-v1.2.png`](./mockup/nav-mobile-abierto-v1.2.png) (menú móvil abierto).

- **Fondo lino sólido:** se quitó el `backdrop-filter: blur`, porque el moodboard prohíbe el vidrio esmerilado. La línea inferior es hair noche.
- **Escritorio:** logo a la izquierda (lleva al inicio); al centro las anclas "Cómo funciona" y "Precios"; a la derecha "Entrar" como enlace y el CTA firma con flecha en bloque en tamaño chico. "Entrar" ya no se mezcla con las anclas.
- **Sección activa:** al hacer scroll, el enlace de la sección a la vista se pone en bosque con un subrayado de 2 px. El hover usa el mismo subrayado.
- **Móvil:** barra con logo, CTA "Empieza gratis" con flecha y hamburguesa plana (sin sombra, para que el CTA sea el único con sombra). El menú abre a pantalla completa con las anclas en Archivo a 40 px, y abajo el CTA a todo el ancho, "Prueba gratis 30 días. Sin tarjeta de crédito." y "¿Ya tienes cuenta? Entrar". Al abrirlo se bloquea el scroll y se oculta el CTA de la barra para no duplicarlo; se cierra con la X, con Escape o al tocar un enlace.
- **Ajuste (Aarón):** se agregan "La tarjeta" y "Preguntas" (ancla al FAQ), en el orden de la página. El texto del menú de escritorio sube de 14 a 16 px y el CTA de la barra a 46 px de alto con texto de 16 px. Para que todo quepa, el menú completo aparece desde 1024 px; por debajo se usa el menú a pantalla completa (enlaces en Archivo de 32 a 44 px).
- **Anclas:** el desfase al saltar a una sección es solo la altura del menú (64 px en móvil, 76 px en escritorio). Antes se sumaban dos valores y la sección quedaba 184 px abajo de la barra.
- "¿Ya tienes cuenta? Entrar" es microcopy nuevo.

## v1.2 · Footer (7 oct 2026) — en revisión

**Capturas:** [`mockup/footer-v1.2.png`](./mockup/footer-v1.2.png) (1440) y [`mockup/footer-mobile-v1.2.png`](./mockup/footer-mobile-v1.2.png) (390).

- **Fondo bosque** con contorno noche de 3 px arriba: es el segundo capítulo en bosque y da peso al final de la página. El logo va en lino (`lealtab-horizontal-lino.svg`), una combinación aprobada en `logo/uso`.
- **El lema** "Haz que tus clientes siempre regresen." en Archivo hasta 44 px, junto al logo.
- **Enlaces por columnas:** Producto (las cuatro anclas del menú), Contacto (WhatsApp, Instagram @getlealtab) y Cuenta (Crea tu tarjeta gratis, Entrar). Los títulos van en etiqueta menta y los enlaces en lino a 16 px, con subrayado menta en hover.
- **Línea legal:** © 2026 LealTab a la izquierda y el aviso de privacidad a la derecha, sobre una línea fina lino.
- **Móvil:** dos columnas de enlaces y la de Cuenta debajo.

## v1.2 · Menos líneas divisorias (7 oct 2026)

Petición de Aarón: había demasiadas líneas horizontales dividiendo secciones.

- **Se quitaron** los separadores entre secciones (antes de Cómo funciona y de Confianza), los bordes de la banda menta de La tarjeta, la línea sobre la instalación, las líneas entre los pasos de Cómo funciona, entre los oficios de Para quién y entre los compromisos de Confianza, y la línea sobre el FAQ. La separación ahora la dan el espacio y los fondos.
- **Se quedan** solo las líneas que ordenan una lista: las preguntas del FAQ, la lista de Lo que viene, la línea legal del footer y la línea inferior del menú. También se quedan los contornos de 3 px de los bloques bosque, porque son parte del estilo Ciclo v2.
- **Confianza pasa a banda blanco lino** (#FFFDF8), para que Para quién, Precios y Confianza no queden como tres secciones lino seguidas. Primero se probó en menta y a Aarón no le gustó. El ritmo de fondos queda: lino (hero y Cómo funciona) · menta (La tarjeta) · lino (Para quién y Precios) · blanco lino (Confianza) · bosque (Lo que viene) · lino (cierre y FAQ) · bosque (footer).
- Se regeneraron las capturas de página completa y de las secciones afectadas.

## Ícono nuevo: Cartera (7 oct 2026) — propuesta, pendiente de aprobación

Petición de Aarón: el ícono "Agregar" no era literal para Apple y Google Wallet.

- **Archivos:** `03-visual-identity/recursos/iconos/linea/lt-icono-cartera.svg` y `activo/lt-icono-cartera-activo.svg`. Lámina de prueba: `iconos/lt-icono-cartera-prueba.png` (y `.html`), con el ícono junto a los 18 aprobados a 16, 24 y 32 px, en versión activo, en versión inversa y dentro del mosaico de Lo que viene.
- **Construcción:** rejilla 24, trazo 2 noche, remates y uniones redondos, esquinas de radio 1.25 (como Calendario y Compartir). El cuerpo de la cartera, una tarjeta que entra inclinada como forma abierta y el broche a la derecha. La versión activo rellena el cuerpo en menta gris.
- **Se descartaron** dos variantes con la tarjeta recta asomando arriba, porque se leían como portafolios o bolsa con asa.
- **Pendiente:** si Aarón lo aprueba, se agrega al sprite (`lt-iconos-sprite.svg`), a `recursos.md` y a la página de iconografía del brand book (el set pasa de 18 a 19 íconos).

---

## v1.3 · Capa de movimiento (7 oct 2026) — en revisión

**Archivo:** [`03-mockup-landing-v1.3.html`](./03-mockup-landing-v1.3.html), copia de la v1.2 (que se conserva tal cual, con el visto bueno de Aarón) más una capa de animaciones. Tira de la entrada del hero: [`mockup/animacion-hero-v1.3.png`](./mockup/animacion-hero-v1.3.png). Los cuadros son aproximados: Chrome headless no respeta los tiempos exactos de las animaciones, así que la tira sirve para ver el orden y no la velocidad.

Reglas aplicadas (moodboard §7 y tokens): movimiento corto (200–700 ms), un solo rebote, curva `cubic-bezier(.2,.8,.2,1)`, nada en bucle, sin parallax ni confeti, cada animación se ve una sola vez. Con "reducir movimiento" todo aparece directo en su estado final.

1. **Entrada del hero (más pausada, por petición de Aarón):** el titular, la bajada, los CTA y la nota entran en secuencia, 900 ms cada uno, con inicio a los 0 / 150 / 300 / 450 ms y una subida de 24 px. El celular sube con un rebote corto (950 ms, desde los 300 ms) mientras el aro se dibuja; el aro no cambió. "Casi premio" aparece a los 1300 ms, cuando el celular ya se asentó. Antes: 600 ms por elemento, separados 80–90 ms, y celular de 700 ms.
2. **Aparición al hacer scroll:** las muestras de interfaz de Cómo funciona, la tarjeta y la instalación de La tarjeta, las filas de Para quién, los planes, los compromisos de Confianza y los mosaicos de Lo que viene entran con fundido y subida de 20 px. Los grupos van escalonados (90 ms entre elementos).
3. **Cómo funciona "se activa":** la primera vez que un paso está a la vista, su interfaz cambia de estado. En el paso 1 aparece la vista previa; en el paso 2 se resalta "Agregar a inicio" y luego aparece el ícono en la pantalla; en el paso 3 los estados (Casi premio, Frecuente, Te extrañamos) aparecen uno por uno. La cifra del aro de avance hace un pequeño pulso al cambiar de paso.
4. **La tarjeta:** al elegir otro negocio, el encabezado y el panel hacen un fundido corto (220 ms) además del cambio del aro.
5. **Precios:** Negocio **se levanta de su sombra** al entrar en pantalla (de "presionado" a su lugar, con un rebote; es el inverso del botón presionado) y después aparece "Recomendado" con la entrada de sticker.
6. **Hovers** (solo con mouse): las tarjetas de planes y las muestras de interfaz se levantan sobre su sombra dura, igual que los botones. Las ilustraciones de Para quién se inclinan 3°. En Lo que viene, el ícono gira y el contorno del mosaico se aclara.

**Comprobado en Chrome headless:** tras cargar no queda ningún elemento oculto, ni en una ventana alta ni con "reducir movimiento"; no hay errores de JavaScript. La suavidad real se revisa en el navegador.

---

## v1.4 · Microinteracciones (7 oct 2026) — en revisión

**Archivo:** [`03-mockup-landing-v1.4.html`](./03-mockup-landing-v1.4.html), copia de la v1.3 (que se conserva). Se implementaron las tres recomendadas del análisis de microinteracciones. Capturas: [`mockup/editor-vivo-v1.4.png`](./mockup/editor-vivo-v1.4.png), [`mockup/suma-visita-v1.4.png`](./mockup/suma-visita-v1.4.png) y [`mockup/para-quien-v1.4.png`](./mockup/para-quien-v1.4.png).

1. **Editor vivo (Cómo funciona, paso 1).** "Nombre del negocio" y "Recompensa" son campos reales: al escribir, la vista previa cambia al instante. Los cuatro colores son botones (grupo de opciones accesible con flechas) que cambian el fondo de la vista previa con un pequeño pulso. Si un campo se vacía, la vista previa muestra "Tu negocio" o "Tu recompensa".
2. **Suma una visita (La tarjeta).** Debajo de la tarjeta, el botón "+ Suma una visita" avanza el aro de uno en uno, con un pulso en la cifra. Al completarse, el aro cambia a durazno con su pulso y aparece el sticker "¡Recompensa lista!"; el botón pasa a "Empezar de nuevo". Cambiar de negocio regresa a su estado inicial (4/5, 2/6, 7/10). El panel anuncia los cambios a lectores de pantalla.
3. **Para quién → La tarjeta.** Cada oficio tiene "Ver su tarjeta →": lleva a La tarjeta con ese negocio ya seleccionado y la tarjeta da un pequeño salto para señalar el cambio.

Todo funciona sin animación con "reducir movimiento". Lógica comprobada en Chrome headless: sumar, completar, reiniciar, cambiar de negocio, escribir, elegir color y los enlaces de Para quién; sin errores de JavaScript.

**Microcopy nuevo (pendiente de aprobación):**
- "Pruébalo: cambia el nombre, el color o la recompensa."
- "Suma una visita" · "Empezar de nuevo" · "Así suma tu cajero cada visita."
- Mensajes intermedios: "{n} de {total}. Te faltan {k} para tu {corte gratis | tratamiento de regalo | tapioca gratis}." (en singular, "Te falta 1").
- Mensajes al completar: "Tu siguiente corte va por nuestra cuenta." · "Tu tratamiento de regalo te espera." · "Tu siguiente tapioca va por nuestra cuenta."
- "Ver su tarjeta →"

### v1.4 · Segunda tanda de microinteracciones (7 oct 2026)

Sobre la misma copia (`03-mockup-landing-v1.4.html`), las propuestas 1 a 6. Capturas: [`mockup/guia-celular-v1.4.png`](./mockup/guia-celular-v1.4.png), [`mockup/codigo-v1.4.png`](./mockup/codigo-v1.4.png), [`mockup/aviso-ejemplo-v1.4.png`](./mockup/aviso-ejemplo-v1.4.png) y [`mockup/filas-detalle-v1.4.png`](./mockup/filas-detalle-v1.4.png).

1. **Guía según el celular (La tarjeta → Cómo se instala).** Se detecta iPhone/iPad o Android; la guía del visitante sube al primer lugar en una caja blanco lino con "Estás en iPhone" (o Android), y la otra queda atenuada. En computadora se ven las dos igual. Para revisarlo en el mockup desde una computadora, se puede abrir con `?os=ios` o `?os=android` al final de la ruta.
2. **"Mostrar mi código" voltea el panel (La tarjeta).** Ahora es un botón: el panel gira (420 ms) y muestra el QR con el nombre del negocio y "Muéstralo en caja."; el botón pasa a "Ocultar mi código". Se regresa solo al sumar una visita o cambiar de negocio. El sticker "¡Recompensa lista!" se oculta mientras se ve el código.
3. **Íconos que se dibujan (Confianza).** Los cuatro íconos de línea se trazan al aparecer (600 ms, escalonados), como el aro.
4. **Ejemplo de aviso (Lo que viene).** El mosaico de Avisos tiene "Ver un ejemplo →": gira y muestra cómo llega un aviso, con el ejemplo aprobado en `identidad-de-marca.md` ("Hace 3 semanas de tu último corte. ¿Te apartamos lugar?") firmado por Barbería Norte; "← Volver" lo regresa. La cara oculta queda inactiva para teclado y lectores de pantalla, y el foco pasa al botón de la otra cara.
5. **Checks de Negocio uno por uno (Precios).** Después de que la tarjeta se levanta de su sombra, sus cuatro checks entran escalonados (80 ms).
6. **Filas con motivo (Cómo funciona, paso 3).** Al pasar el mouse o tocar una fila, se resalta y bajo su estado aparece el motivo: "Le falta 1 corte", "Viene cada semana", "Hace 41 días que no viene". **Corrección (Aarón: la sección siguiente se movía en cada hover):** el motivo ya ocupa su espacio desde el inicio, invisible, y solo aparece con un fundido; la altura de la tabla no cambia (comprobado: 259 px con cualquier fila abierta).

Lógica comprobada en Chrome headless (detección forzada, voltear y regresar, interacción con "Suma una visita" y el selector, filas), sin errores de JavaScript. Con "reducir movimiento" los volteos y trazos son inmediatos.

**Microcopy nuevo (pendiente de aprobación):** "Estás en iPhone" / "Estás en Android" · "Ocultar mi código" · "Muéstralo en caja." · "Ver un ejemplo →" · "← Volver" · "Ejemplo de aviso" · "Le falta 1 corte" · "Viene cada semana" · "Hace 41 días que no viene".

### v1.4 · Menú y stickers (7 oct 2026)

Captura: [`mockup/nav-hero-v1.4.png`](./mockup/nav-hero-v1.4.png) (hero completo: la barra solo muestra "Entrar" mientras el botón del hero está a la vista).

- **8. El CTA del menú entra al salir del hero.** Mientras el botón "Crea tu tarjeta gratis" del hero está a la vista, el del menú se colapsa (escritorio y móvil) y la barra solo muestra "Entrar" (o la hamburguesa en móvil). Al pasarlo, el CTA del menú entra (320 ms) con su sombra. Así nunca hay dos CTA iguales compitiendo en pantalla. En escritorio el menú pasa a una cuadrícula de tres columnas: los enlaces quedan centrados en la página y no se mueven cuando aparece el CTA. Sin JavaScript, el CTA del menú se ve siempre.
- **9. Los stickers responden al mouse.** "Casi premio" (hero) y "¡Recompensa lista!" (cierre) se enderezan y se levantan sobre su sombra al pasar el mouse, como los botones. Solo con mouse; sin efecto con "reducir movimiento".

---

## v1.5 · Visitas para la recompensa en el editor (7 oct 2026) — en revisión

**Archivo:** [`03-mockup-landing-v1.5.html`](./03-mockup-landing-v1.5.html), copia de la v1.4 (que se conserva). Capturas: [`mockup/editor-visitas-v1.5.png`](./mockup/editor-visitas-v1.5.png) y [`mockup/editor-visitas-mobile-v1.5.png`](./mockup/editor-visitas-mobile-v1.5.png).

**Motivo (propuesta de Aarón):** el número de visitas es la decisión central de un programa de sellos y no se podía configurar. Además había una incoherencia: la recompensa era texto libre ("Al quinto corte, el siguiente es gratis.") y la vista previa decía "0/5" fijo, así que si alguien escribía "Al sexto corte…" la vista previa no cambiaba.

- **Nuevo control "Visitas para tu recompensa":** selector − / + de 3 a 12 (inicia en 5). Los botones se desactivan en los extremos y el número se anuncia a lectores de pantalla.
- **"Recompensa" pasa a ser solo el premio** ("Corte gratis"), sin el número.
- **Vista previa siempre coherente:** "0/N visitas" y "Al completar N: {premio}". La cifra hace un pequeño pulso al cambiar; si el premio se vacía, dice "tu recompensa".
- El editor queda en cuatro controles visibles (nombre, color, visitas y recompensa) y sigue leyéndose como "lista en minutos".
- **Es ilustrativo:** el editor real se diseña en la Fase 6 (Product Design). Si ahí se decide otra forma de configurar la recompensa (por ejemplo, plantillas por oficio), esta muestra se ajusta.

**Microcopy nuevo (pendiente de aprobación):** "Visitas para tu recompensa" · "Al completar {n}: {premio}" · "visitas" (unidad en la vista previa) · "Pruébalo: cambia el nombre, el color, las visitas o la recompensa." (reemplaza la versión de la v1.4).

---

## v1.6 · Revisión con el skill design-taste-frontend (7 oct 2026) — en revisión

**Archivo:** [`03-mockup-landing-v1.6.html`](./03-mockup-landing-v1.6.html), copia de la v1.5 (que se conserva). Informe completo: [`06-revision-taste-skill.md`](./06-revision-taste-skill.md).

- Corregido: la semirraya del FAQ pasa a signo menos; se quitaron las etiquetas "Paso 1/2/3"; "Toca un negocio…" pasa a "Elige un negocio para ver su tarjeta."
- No aplicado por chocar con la marca: fotografía de stock, librerías de íconos externas, modo oscuro, cambio de stack y de fuentes.
- Seis propuestas para decisión. **Aplicada: la 5 (Avisos destacado en menta).** La 2 (cierre centrado con el aro concéntrico) se probó y Aarón la descartó: el cierre de la v1.6 es el mismo de la v1.5. Siguen abiertas: CTA móvil, nota bajo los CTA del hero, titular en 2 líneas y dos bloques oscuros.

---

## v1.7 · Auditoría con el skill redesign-existing-projects (7 oct 2026) — en revisión

**Archivo:** [`03-mockup-landing-v1.7.html`](./03-mockup-landing-v1.7.html), copia de la v1.6 (que se conserva). Informe: [`07-auditoria-redesign-skill.md`](./07-auditoria-redesign-skill.md).

- Aplicado: metaetiquetas para compartir con imagen de 1200×630 (`og/`), enlace "Saltar al contenido", estilos en línea a clases, texto alternativo en las ilustraciones, titulares y párrafos sin palabras sueltas, grano de papel sutil, FAQ con todas las respuestas a la vista (sin acordeón), "Términos y condiciones" en la línea legal del footer y limpieza de estilos sin uso. El footer conserva sus tres columnas (Producto, Contacto, Cuenta): se quitó "Producto" en una primera pasada, pero eso contradecía la regla del skill (conservar las rutas principales) y se regresó.
- No aplicado: cambio de fuentes, fotos de stock, quitar el "¡" del sticker, quitar los bloques bosque; pendientes de datos reales (aviso de privacidad, WhatsApp, términos, cookies).
- **Para quién (7 oct 2026, Aarón):** el oficio "Estéticas" pasa a "Estéticas y salones de belleza" (mismo elemento, no uno nuevo). En escritorio cabe en una línea; en móvil se balancea en dos. El selector de La tarjeta ("Estética") y el ejemplo "Estética Luna" no cambian. Capturas: [`mockup/para-quien-v1.7.png`](./mockup/para-quien-v1.7.png) y [`mockup/para-quien-mobile-v1.7.png`](./mockup/para-quien-mobile-v1.7.png).
- **Para quién, línea final (7 oct 2026, Aarón):** "¿Tienes una cafetería, un gimnasio u otro negocio al que tus clientes vuelven? **También es para ti.**" A todo el ancho se veía como nota al pie: ahora va en una columna acotada (34 letras, separada 48 px de la última fila) y el remate va en su propia línea en negrita bosque.
- **Contacto (7 oct 2026, Aarón):** los tres enlaces de WhatsApp (Confianza, cierre y footer) apuntan a +52 55 8806 3606 con el mensaje precargado "Hola, vi la página de LealTab y quiero saber más sobre la tarjeta digital para mi negocio."; Instagram apunta a https://www.instagram.com/getlealtab. Ambos abren en una pestaña nueva. Queda pendiente solo la URL del aviso de privacidad y de términos.
