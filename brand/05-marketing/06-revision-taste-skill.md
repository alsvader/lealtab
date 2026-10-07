# LealTab · Revisión de la landing con el skill design-taste-frontend

Fase 5, Marketing · 7 de octubre de 2026 · Para revisión de Aarón López Sosa

**Archivo revisado:** `03-mockup-landing-v1.5.html` → copia con correcciones: [`03-mockup-landing-v1.6.html`](./03-mockup-landing-v1.6.html).
**Skill:** `design-taste-frontend` del repositorio `Leonxlnx/taste-skill`, instalado en `.claude/skills/design-taste-frontend/` (nivel proyecto).

---

## 1. Cómo se aplicó

El skill es una guía contra el diseño "genérico de IA", con una revisión final de unas 60 casillas (pre-flight, sección 14). Varias de sus reglas son preferencias por defecto que **chocan con decisiones de marca ya aprobadas** (paleta, iconografía, escala tipográfica, solo modo claro, sin fotos de stock). Por eso se usó en su modo **Redesign: Preserve** (sección 11): se audita, se corrige lo que no toca la marca y lo demás se documenta para decisión.

**Lectura de diseño (sección 0.B):** landing B2B para dueños de negocios de mostrador en México, con un lenguaje "minimal en el orden, neobrutal en los detalles" (Ciclo v2), apoyada en el design system propio de LealTab sobre HTML y CSS nativos.

**Diales (sección 1), leídos de la v1.5:** `DESIGN_VARIANCE 6` · `MOTION_INTENSITY 5` · `VISUAL_DENSITY 3`. Están dentro del rango del preset "Redesign: Preserve" y no se cambiaron.

## 2. Corregido en la v1.6

| Regla del skill | Hallazgo | Corrección |
|---|---|---|
| 9.G Cero semirrayas (–) | El ícono del FAQ abierto usaba "–" | Ahora es el signo menos "−" (U+2212), el mismo del selector de visitas |
| 9.F Sin etiquetas genéricas de paso | "Paso 1 / Paso 2 / Paso 3" sobre cada paso | Se quitaron: el título de cada paso ya es la etiqueta y el aro "1 de 3" marca el avance |
| 4.9 Revisión del copy | "Toca un negocio para ver su tarjeta." no tiene sentido con mouse | "Elige un negocio para ver su tarjeta." |

Sin errores de JavaScript tras los cambios.

## 3. Pasa la revisión

- **Cero rayas (—)** en todo el texto visible; un solo punto medio por línea ("Clientes · últimos 30 días").
- **Una sola etiqueta tipo eyebrow** de sección ("Cómo funciona"), dentro del máximo de 1 cada 3 secciones.
- **Color:** un solo acento (durazno) usado igual en toda la página; los botones pasan contraste AA. La paleta coincide con la familia "Forest" que el propio skill recomienda (verde profundo + hueso + acento cálido), no con el cliché beige + latón.
- **Formas:** sistema de radios documentado (6 / 10 / 14 / 24 / completo) y aplicado de forma consistente.
- **Hero:** el CTA se ve sin scroll; subtítulo de 19 palabras (máximo 20); relleno superior dentro del límite.
- **Menú** en una línea, 76 px de alto (máximo 80).
- **Sin tres tarjetas iguales:** los planes son de tamaño y peso distintos.
- **Formularios:** etiqueta arriba del campo, sin placeholder como etiqueta, contraste AA.
- **Movimiento:** cada animación tiene un motivo (jerarquía, narrativa o respuesta); sin escuchar el evento `scroll` (se usa IntersectionObserver); todo respeta "reducir movimiento"; solo se animan `transform`, `opacity` y propiedades de SVG.
- **Nombres y datos de ejemplo** locales y creíbles (Barbería Norte, Andrés S., Carlos P.), sin "Acme" ni cifras perfectas.
- **Las muestras de interfaz son componentes reales en miniatura** (el editor, la tarjeta y la tabla funcionan), que el skill acepta en lugar de capturas falsas.

## 4. Choca con la marca: no se aplicó

| Regla del skill | Por qué no se aplica |
|---|---|
| 4.8 Usar fotografía real o generada; prohíbe ilustraciones SVG hechas a mano | La marca tiene ilustraciones propias aprobadas y prohíbe el stock; la fotografía será propia del piloto (pendiente en el brand book). Cuando exista, entra en Para quién y Confianza. |
| 3.C / 9.E Íconos solo de librerías (Phosphor, Tabler…); prohíbe dibujar SVG | LealTab tiene su propio set aprobado de 18 íconos (más Cartera en propuesta). Las flechas de los botones sí se dibujaron a mano: conviene agregarlas al set. |
| 6.C / 8 Modo oscuro obligatorio | La identidad aprobada es solo clara (lino); un modo oscuro sería una decisión de marca nueva. |
| 3.A React + Tailwind + Motion; fuentes autoalojadas | El mockup es HTML de referencia. Al implementar (Fase 7) aplica: fuentes autoalojadas con `font-display: swap`, como ya dice `paleta-y-tipografia.md`. |
| 4.1 Prefiere Geist, Satoshi… | Archivo + Manrope están aprobadas y no son las fuentes "por defecto" que el skill quiere evitar. |

## 5. Propuestas que requieren tu decisión

1. **Una sola etiqueta por intención de CTA (4.5).** El alta aparece como "Crea tu tarjeta gratis" en todas partes, pero en la barra móvil dice "Empieza gratis" (copy aprobado, porque la etiqueta larga no cabe). El skill lo marca como falla. Opciones: dejarlo así; usar "Crea tu tarjeta" en móvil; o quitar el CTA de la barra móvil (ya está en el hero y en el menú desplegable).
2. **Familias de layout repetidas (4.7).** Tres secciones usan "texto a la izquierda, visual a la derecha": el hero, La tarjeta y el cierre. El skill pide que cada familia aparezca una sola vez. Propuesta: recomponer el cierre como bloque centrado tipo manifiesto, con el aro 5/5 detrás del titular (concéntrico, permitido por Ciclo v2).
3. **Hero con máximo 4 elementos de texto (4.7).** La nota "Prueba gratis 30 días. Sin tarjeta de crédito." bajo los CTA cuenta como texto extra prohibido en el hero. Es copy aprobado y útil para convertir. Opciones: dejarla; o moverla a la primera línea de Cómo funciona.
4. **Titular del hero en 2 líneas (4.7).** Hoy ocupa 3 líneas a 92 px en escritorio. Se respeta la escala Display aprobada (96 px para la portada); el CTA sigue visible sin scroll, que es el objetivo de la regla. Para 2 líneas habría que bajar a unos 72 px o ensanchar la columna del texto.
5. **Variación en mosaicos (4.7).** Los cuatro mosaicos de Lo que viene son iguales (noche). El skill pide variar 2 o 3. Con la paleta permitida se podría destacar Avisos (el que tiene ejemplo) en menta.
6. **Un solo cambio de tema por página (4.11).** Hay dos bloques bosque: Lo que viene y el footer. Un footer oscuro es convencional; se puede dejar así.

## 6. Aplicado después de la revisión (decisión de Aarón)

- **Propuesta 2 · Cierre centrado tipo manifiesto: probada y descartada.** Se recompuso el cierre con el aro 5/5 concéntrico y el texto centrado dentro, pero a Aarón no le gustó y se regresó al cierre de la v1.5 (texto a la izquierda, aro a la derecha). Queda aceptada la repetición de la familia "texto + visual" en hero, La tarjeta y cierre.
- **Propuesta 5 · Avisos destacado en menta.** El mosaico de Avisos (el único con ejemplo interactivo) pasa a menta con texto noche, contorno noche, cuadro del ícono en blanco lino y "Próximamente" y "Ver un ejemplo" en bosque. Los otros tres siguen en noche. Captura: [`mockup/lo-que-viene-v1.6.png`](./mockup/lo-que-viene-v1.6.png).

Siguen abiertas las propuestas 1, 3, 4 y 6. La 2 queda descartada.
