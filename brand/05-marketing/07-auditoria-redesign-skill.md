# LealTab · Auditoría de la landing con el skill redesign-existing-projects

Fase 5, Marketing · 7 de octubre de 2026 · Para revisión de Aarón López Sosa

**Archivo auditado:** `03-mockup-landing-v1.6.html` → copia con los cambios: [`03-mockup-landing-v1.7.html`](./03-mockup-landing-v1.7.html).
**Skill:** `redesign-existing-projects` del repositorio `Leonxlnx/taste-skill`, instalado en `.claude/skills/redesign-existing-projects/` (nivel proyecto).

El skill trabaja en tres pasos (escanear, diagnosticar y corregir) con mejoras pequeñas que respetan el stack existente: aquí, HTML y CSS nativos sobre los tokens de LealTab. No se aplicó nada que contradiga decisiones aprobadas (fuentes, paleta, fotografía propia, texto de los stickers ni el cierre ya descartado).

## 1. Cambios aplicados en la v1.7

| Hallazgo del skill | Cambio |
|---|---|
| Faltan metaetiquetas para compartir (Código: "Missing meta tags") | Se agregaron `og:type`, `og:locale`, `og:title`, `og:description`, `og:image` (con medidas y texto alternativo), `twitter:card` y `theme-color`. Imagen nueva de 1200×630 en [`og/lealtab-og-1200x630.png`](./og/lealtab-og-1200x630.png) (fuente HTML en `og/lealtab-og.html`). En producción la ruta debe ser absoluta. |
| No hay "saltar al contenido" (Omisiones) | Enlace "Saltar al contenido", visible solo al navegar con teclado, que lleva al `<main>`. |
| Estilos en línea mezclados con clases (Código) | Los 6 estilos en línea pasaron a clases (colores del editor, botón móvil de Cómo funciona y enlace del logo en el footer). Solo quedan las variables de retraso `--d`. |
| Imágenes con significado sin texto alternativo (Código) | Las tres ilustraciones de Para quién recuperan su descripción (los íconos junto a texto siguen como decorativos). |
| Palabras sueltas al final de una línea (Tipografía) | `text-wrap: balance` en titulares y `text-wrap: pretty` en párrafos y listas. |
| Diseño plano sin textura (Color y superficies) | Grano de papel muy sutil (6 %, en tono noche) fijo sobre toda la página, sin eventos ni costo de scroll. El moodboard ya preveía "textura de grano muy sutil, solo en marketing". |
| FAQ en acordeón (Componentes) | Las cinco preguntas quedan a la vista en una lista de dos columnas (una en móvil), sin abrir ni cerrar. Las respuestas son cortas y se leen de un vistazo. Se quitó el JavaScript del acordeón. |
| Footer: "Footer link farm with 4 columns. Simplify. Focus on main navigational paths and legally required links." (Componentes) y "Add privacy policy and terms of service links in the footer" (Omisiones) | El footer de la v1.6 (3 columnas, 8 enlaces) no era una "granja de enlaces", así que se conserva: Producto (las rutas principales: Cómo funciona, La tarjeta, Precios, Preguntas), Contacto y Cuenta. En la línea legal se agrega "Términos y condiciones" junto al aviso de privacidad (ambos pendientes de URL real). **Corrección:** en una primera pasada se quitó la columna Producto por repetir el menú; eso contradecía la regla (que pide conservar las rutas principales) y se regresó a petición de Aarón. Capturas: [`mockup/footer-v1.7.png`](./mockup/footer-v1.7.png) y [`mockup/footer-mobile-v1.7.png`](./mockup/footer-mobile-v1.7.png). |
| Código sin uso | Se quitaron los estilos de las etiquetas "Paso N" (eliminadas en la v1.6). |

Comprobado en Chrome headless: sin errores de JavaScript; 5 preguntas visibles; grano activo. Capturas: [`mockup/faq-footer-v1.7.png`](./mockup/faq-footer-v1.7.png).

## 2. Ya cumplía

Fuentes con carácter (Archivo + Manrope) y pesos 400/500/600/700; cifras tabulares; espaciado de letras ajustado en titulares y etiquetas; párrafos de unos 35 a 60 caracteres; sin negro puro; un solo acento; sombras teñidas en noche y con una sola dirección de luz; contenedor máximo de 1120 px; radios variados por nivel; capas y superposiciones en el hero; botones con hover, presión y transiciones; anillo de foco visible; sección activa en el menú; scroll suave; animaciones con `transform` y `opacity`; nombres y datos creíbles; sin clichés de copy; un botón principal más un enlace (no "relleno + fantasma"); planes destacados con color, no solo con altura; íconos propios con trazo uniforme; favicon; HTML semántico; aviso de privacidad en el pie.

## 3. No se aplicó (choca con la marca o falta información)

| Propuesta del skill | Motivo |
|---|---|
| Cambiar la fuente (Geist, Satoshi…) | Archivo + Manrope están aprobadas. |
| Fotos de fondo o de stock (picsum) para dar profundidad | La marca prohíbe el stock; la fotografía será propia del piloto. |
| Quitar los signos de exclamación de los mensajes de éxito | "¡Recompensa lista!" es un sticker aprobado en `recursos.md`. |
| Evitar secciones oscuras dentro de una página clara | Los capítulos en bosque son una decisión tuya (Lo que viene y footer). |
| Animar solo `transform`/`opacity` | Dos excepciones justificadas: la entrada del CTA del menú (`max-width`, para que la barra no deje hueco) y el cambio de color del aro. Son elementos aislados, sin costo visible. |
| Enlaces muertos (`#`) | El aviso de privacidad y el número de WhatsApp siguen pendientes desde la v1.1: hacen falta la URL y el número reales. |
| Aviso de cookies y página 404 | Corresponden a la implementación (Fase 7). Si se usa analítica con cookies, el aviso se vuelve necesario (LFPDPPP). El enlace a "Términos y condiciones" ya está en el pie, pero falta redactar el documento. |
| Relleno inferior un poco mayor que el superior en cada sección | Ajuste óptico menor; queda para el pulido de implementación. |
