# LealTab: análisis de dirección visual para la landing

Análisis de la referencia visual en `brand/` y contraste con `lealtab-direccion-visual-landing.md` · 7 de octubre de 2026

## Resumen

La carpeta `brand/` ya define el estilo de la landing, así que no hace falta adoptar uno de moda. El problema es que el mockup actual no aplica la dirección aprobada. La recomendación es **Ciclo v2 en su nivel "landing"**: lino, contorno noche y sombras duras, titulares en Archivo condensada, **un aro grande por sección** y un sticker con significado.

El otro análisis llega casi al mismo diagnóstico. No coincidimos en el nombre ("editorial"), en algunas propuestas que rompen las reglas aprobadas y en que no piensa la página desde el celular.

---

## 1. Qué dice la referencia visual

- **Dirección aprobada:** Ciclo v2, "minimal en el orden, neobrutal en los detalles" (`brand/02-creative-direction/moodboard.md`).
- **Nivel de expresión:** las reglas fijan una escala: dashboard, luego tarjeta PWA, luego landing, y lo más expresivo son redes y mostrador. Para la landing piden: *"titular condensado grande, un aro protagonista, un sticker de novedad y botón con flecha en bloque"* (`brand/02-creative-direction/ruta-ciclo-v2-reglas.png`).
- **Composición:** jerarquía fija (titular, aro, texto, acción, sticker), al menos 40 % de aire y como máximo dos fondos además del lino.
- **Posicionamiento:** un producto tech premium en español, que nadie ocupa todavía, frente a competidores con mascotas, morados, temas espaciales o un look indie como el de Sello.club (`brand/01-brand-strategy/competidores.md`).

## 2. Dónde se aleja el mockup actual de esas reglas

Revisión de `brand/05-marketing/03-mockup-landing.html` y sus capturas `mockup/*-v2.png`:

| Regla aprobada | Mockup v1.1 |
|---|---|
| Un aro protagonista en la landing | El hero solo tiene un mini aro dentro de la tarjeta del teléfono. El aro grande que aparece en `ruta-ciclo-v2.png` desapareció. |
| Botón con flecha en bloque (el botón firma) | Usa botones normales sin el bloque de la flecha. |
| Un sticker en la landing | El hero no tiene ninguno. |
| Nada de emojis, look premium | La pantalla de inicio del teléfono usa emojis como íconos (📷 💬 ♪ 📅 ✉️ ⚙️). |
| Durazno solo para la recompensa; stickers nunca sobre precios | La etiqueta "Recomendado" de precios está en durazno. |
| Nunca hileras de aros iguales | En "La tarjeta" aparecen tres mini aros 3/8 en fila. |
| Máximo dos fondos además del lino | La página usa menta, bosque (banner de precios) y noche (Lo que viene). |

Las otras piezas de marketing tienen problemas parecidos:

- `kit-redes/01-lema.png`: el "3/8" está en noche sobre bosque, una combinación prohibida (1.56:1 de contraste).
- `pitch-piloto/01.png`: hay dos aros translúcidos sin contorno.

**El riesgo no es elegir mal el estilo, sino que la ejecución pierda la identidad al pasar de las láminas a las piezas reales.**

## 3. Estilo recomendado

**"Ciclo v2, nivel landing": neobrutalismo controlado sobre lino, con el aro como narrativa.**

1. **Hero:** titular condensado grande, un aro grande que sale del encuadre por el lado contrario al titular, el teléfono con UI real encima y el sticker "Casi premio" junto al 4/5. El durazno aparece solo en la punta del aro.
2. **El aro avanza con el scroll** en lugar de repetirse: vacío → 4/5 → completo en durazno en el CTA final. Debe haber uno por sección como máximo, nunca en fila y nunca orbitando el teléfono.
3. **Ritmo de fondos:** lino como base y **una sola** tinta para los bloques de capítulo, bosque o noche pero no las dos. La menta queda para bandas de apoyo.
4. **Botón firma con flecha en bloque** en todos los CTA principales, con el efecto de presión contra la sombra.
5. **Durazno solo cuando algo se completa.** "Recomendado" pasa a menta o bosque.
6. **Ilustraciones como objetos sueltos**, no dentro de tres cards idénticas. Con fotos del piloto, usar el tratamiento ya definido: **recorte con borde lino sobre color plano**, que es más propio que la "foto documental" genérica.
7. **Diseñar primero para el celular.** El documento de estructura lo dice: los dueños van a verla en el teléfono. Un hero asimétrico solo funciona si primero se resuelve a 390 px.

## 4. Contraste con `lealtab-direccion-visual-landing.md`

### En qué coincidimos (la mayor parte)

- El mockup se siente como una demostración del design system: card tras card, todas iguales.
- El aro debe contar la historia (inicio → progreso → recompensa), no solo decorar.
- El durazno funciona como recompensa visual.
- Bloques oscuros como capítulos, ilustraciones sin cards y movimiento con significado, sin parallax ni WebGL.
- Validar primero solo el hero y el inicio de "Cómo funciona" antes de hacer las 8 secciones.

### En qué difiero

| Tema | Otro análisis | Esta lectura |
|---|---|---|
| Nombre del estilo | Propone uno nuevo: "Warm Editorial Product". | No hace falta otra etiqueta: Ciclo v2 ya define el nivel landing. "Editorial" además empuja hacia la Ruta 2 (Cercanía), que se descartó por el riesgo de cliché de cafetería. |
| Diagnóstico | La landing necesita "más expresión". | El problema concreto es que el mockup no aplicó las reglas aprobadas (tabla de la sección 2). Es más fácil de corregir y más fácil de revisar. |
| Hero propuesto | Varios ◯ alrededor del teléfono y el titular completo en mayúsculas. | Rompe dos reglas: varios aros parecen órbitas (el territorio de Orbita) o sellos, y las mayúsculas son solo para displays de hasta 4 palabras. |
| Titulares gigantes | "VUELVE." a media pantalla. | Hay un choque que no menciona: el hero aprobado tiene 11 palabras y la regla es de unas 8. Un display enorme con ese copy, en celular, ocupa 5 o 6 líneas. |
| Proporción | 40 % sistema / 60 % expresión. | La escala aprobada pone la landing por debajo de redes y mostrador. Mejor 50/50. Con 60 % la landing compite con el kit de redes. |
| Competencia | Usa Square Loyalty, Smile.io y LoyaltyLion. | Square Loyalty no está en México (según `competidores.md`) y las otras dos son de ecommerce. El riesgo visual real es **Sello.club**: neobrutal indie en negro y lima. Lo que separa a LealTab es el control: lino, aire y bosque. |
| Bloques oscuros | Dos bloques en bosque. | De acuerdo, siempre que se quite la noche y no se use la menta como tercer fondo. El bloque "Ves quién regresa" debe ser apoyo y no protagonista, porque al lanzar manda la Propuesta A (la tarjeta). |
| Móvil | No lo trata. | Es la mayor omisión, porque la audiencia del piloto ve la landing en el celular. |

## 5. Decisiones (Aarón, 7 de octubre de 2026)

1. **Titular del hero:** el lema sube al hero. Display: "Haz que tus clientes siempre regresen." (6 palabras, en altas y bajas, porque las mayúsculas son solo para displays de hasta 4 palabras). Subtítulo: "Tu tarjeta de lealtad, ahora en el celular de tus clientes." Cambia el copy aprobado del hero en `brand/05-marketing/02-copy-landing.md` y el lema deja de ser exclusivo del cierre.
2. **Tinta de los capítulos:** bosque `#0F4D3A`, con texto lino. La noche se queda solo para texto, contornos y sombras: el bloque "Lo que viene" pasa de noche a bosque.

## 6. Siguiente paso

Con esas dos decisiones, rehacer solo el hero y el inicio de "Cómo funciona", en móvil y escritorio, sobre el mockup actual. Cuando ese lenguaje se sienta LealTab, extenderlo al resto de la página.
