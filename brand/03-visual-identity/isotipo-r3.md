# LealTab · Isotipo, ronda 3 (sobre el boceto de Aarón)

Fase 3 · Identidad visual · 4 de octubre de 2026
Base: `referencias/ref-aaron.svg`. Paleta, tipografías y estilo Ciclo v2 sin cambios.

## Qué se hizo
Tomé tu símbolo tal como está planteado: una L (fuste que baja y gira a la derecha) y una segunda pieza en L de cabeza (brazo arriba que baja por la derecha). Juntas casi cierran un cuadro y dejan dos aberturas en esquinas opuestas. No agregué elementos ni cambié la idea. Lo redibujé como formas rellenas, lo corregí ópticamente y preparé tres variaciones que cambian **un solo parámetro** cada una.

## Archivos
- `isotipo-r3.png` (1600×1000): A y sus variaciones B, C y D. Cada una incluye retícula de construcción, un color, negativo sobre bosque, marketing (sombra dura noche sobre durazno), 64/32/16 px, favicon en pestaña, ícono de app y lockup horizontal. En A, el 16 px está ajustado a píxel y se muestra ampliado ×3.
- `isotipo-r3-lockups.png` (1600×1000): lockups horizontal y vertical de A sobre lino, bosque y durazno, con área de protección preliminar y especificaciones.
- `isotipo/r3/`:
  - `isotipo-r3-<a-fiel | b-cerrada | c-remate-recto | d-esquina-tensa>.svg`: bosque sobre fondo transparente. Cada una también viene en `-noche`, `-negativo` y `-marketing`.
  - `isotipo-r3-a-fiel-16px.svg` (ajustado a píxel, para favicon) e `isotipo-r3-a-app-icon.svg` (1024).
  - `lealtab-r3-lockup-horizontal(.svg | -negativo | -durazno)` y `lealtab-r3-lockup-vertical(.svg | -negativo)`. El logotipo va **en curvas** y el lienzo ya incluye el área de protección.
- Fuentes en `laminas-html/`: `r3geo.py` (geometría paramétrica), `r3word.py` (logotipo en curvas con HarfBuzz), `r3lock.py` (lockups), `r3px.py` (raster de 16 px), `gen_r3.py`, `gen_r3_lock.py` y `gen_r3_svg.py`. La instancia `archivo-75-800.ttf` sale de Archivo variable, que tiene licencia OFL.

## Construcción de A (fiel refinada)
Retícula de 64 u. El área viva va de 7 a 57 y forma un **cuadrado de 50 × 50 u**, con 7 u de aire por lado para la máscara de los íconos.

| Parámetro | Valor | Por qué |
|---|---|---|
| Fuste vertical | 13 u (26 % del ancho) | Mantiene el trazo grueso de tu boceto (58/226 = 26 %). |
| Brazos horizontales | 12 u | Corrección óptica: con el mismo grosor, una barra horizontal se ve más gruesa que una vertical. Archivo hace lo mismo (fuste de L 161 y pie 137). |
| Esquina exterior | R 14 u | Proporcionalmente igual a tu boceto (61/226 de ancho), que es de donde sale la suavidad. |
| Esquina interior | r 4 u | En el boceto medía unos 3 px, casi un pico. Con 4 u, la unión adelgaza un poco en la diagonal (unos 13.5 u frente a 13), así que no se empasta. |
| Remates | Semicírculos (radio = medio grosor) | Igual que en tu boceto. El remate de arriba a la izquierda y el de abajo a la derecha sobresalen 0.75 u para que el círculo no se vea más bajo que los bordes planos. |
| Abertura superior | 8 u | Ranura entre el fuste de la L y la punta del brazo de la pieza 2. |
| Abertura inferior | 7.5 u en diagonal (6 u de recorrido del pie) | La punta del pie y la punta de la pieza 2 se ven en diagonal. Ajusté el largo del pie para que esta abertura **se vea igual** que la de arriba. |
| Pieza 2 | Su fuste termina 7 u antes del borde inferior | Respeta tu boceto: la segunda pieza es un gancho más corto y la L domina. Eso sostiene la lectura de "L de LealTab". |

**Peso con el nombre.** En el lockup horizontal, el símbolo mide 1.45 veces la altura de mayúsculas de Archivo 800 (ancho 75). Su fuste (13 u) queda 1.6 veces más grueso que el de la tipografía (8.1 u en la misma escala). Así se ve del mismo peso que la palabra: el símbolo es una forma abierta con mucho blanco interior y necesita algo más de grosor que una letra para equilibrarse. Con el 1.86 de tu boceto, el símbolo se comía a la palabra. Con 1.35 se veía débil.

**16 px ajustado (solo A).** Lo redibujé directamente en píxeles: 12 × 12 px, trazos de 3 px, aberturas de 2 px, esquinas de 3 px con antialias solo en las curvas y remates de corte recto con canto. A ese tamaño, un semicírculo de 1.5 px se vuelve una mancha. Los bordes rectos caen exactos en la rejilla de píxeles.

## Cambios respecto a tu referencia
1. **De trazos a formas rellenas**, con nodos limpios (dos trazados cerrados, sin strokes).
2. **Proporción:** de apaisado (226 × 194, 1.17:1) a **cuadrado**, para que funcione igual en ícono de app, favicon y avatar.
3. **Aberturas equilibradas:** en tu boceto, la de arriba mide unos 46 px y la de abajo casi se cierra (unos 13 px). Ahora las dos se ven iguales (8 y 7.5 u).
4. **Radios coherentes:** el exterior conserva tu proporción y el interior pasa de casi un pico a 4 u.
5. **Grosor compensado:** horizontales un 8 % más delgados que el vertical, para que todo se vea parejo.
6. **Piezas más armónicas:** la segunda sigue siendo un gancho corto, pero su largo ahora sigue reglas fijas: termina 7 u antes del borde y su brazo empieza a 8 u del fuste.
7. **Logotipo:** "LealTab" en curvas con el kerning de la fuente y tracking de −10/1000. Además, el símbolo pasa de 1.86 a 1.45 veces la altura de mayúsculas y la separación entre ambos se fijó en 18 u.

## Variaciones (un parámetro cada una)
- **B · Más cerrada.** Solo cambia la separación: 4 u arriba y 4.7 u en diagonal abajo. Se lee más como un cuadro y un ciclo casi completo, con más tensión. En contra: a 16 px las aberturas casi desaparecen, y en marketing el contorno noche las estrecha todavía más. También se acerca a la lectura de "marco".
- **C · Remate recto.** Solo cambian los remates: corte recto con canto de 1.5 u (y aberturas rectas de 8 u). Es más neobrutal y se emparenta con los cortes rectos de Archivo. En contra: pierde la amabilidad de tu boceto y comparte el remate recto con Lasso y con los íconos de "recortar".
- **D · Esquina tensa.** Solo cambia el radio: R7/r2 en lugar de R14/r4. Gana presencia en tamaños chicos y se ve más "sólido". En contra: pierde la curva que hace tuyo el boceto y es la más cercana a los corchetes de "recortar" y a MIT Lincoln Lab.
- **Opción con elemento nuevo:** no la dibujé. Ninguna idea que probé mentalmente (un punto o sello en el centro, una pieza durazno en una abertura) mejoraba el símbolo sin convertirlo en otro ícono, como grabar o cámara. Si la quieres ver, la armo como opción aparte y marcada.

## Revisión de parecido (honesta)
Busqué en la web abierta: logos de dos L o dos corchetes, íconos de recortar y enmarcar, fintech y SaaS con símbolos de esquinas, y competidores de lealtad (revisé sus logos actuales en sus sitios).

**Parecidos reales (estructura):**
- **MIT Lincoln Laboratory** (logo de 1958). Son **dos L giradas 180° que forman un rectángulo con aberturas en esquinas opuestas**, que es justo la estructura de tu símbolo. Encierran una figura de Lissajous, con trazos acampanados y esquinas filosas. Es el antecedente más cercano en concepto. Nos separan la ejecución (redondeada, monolineal, sin figura interior), el gancho corto y el sector (laboratorio de defensa, no comercio). Riesgo de confusión en el mercado: bajo. Riesgo de que se perciba "ya visto" entre diseñadores: medio.
- **Light Work** (organización de fotografía en Syracuse; identidad de Remake / Michael Dyer). Son **dos L entrelazadas que forman un cuadro** con un hueco cuadrado al centro, angulosas y con biseles. Concepto cercano y forma distinta. Riesgo: medio-bajo.
- **Brace** (concepto publicado en Logosystem, de Farouq Osuolale, etiquetado como fintech/SaaS). Son **corchetes escalonados que forman un cuadro abierto, en verde sobre verde oscuro**. Coinciden el sector, la idea de "cuadro abierto" y el territorio de color. La forma es distinta: líneas finas y escalones, no dos L gruesas. Riesgo: medio-bajo. Ojo con el verde.
- **Liao Liao Stationery** (proyecto estudiantil, Red Dot): dos L en espejo que funcionan como marco. **Sosemo** (agencia de Nueva York, enero de 2026): "Interlocking Brackets", corchetes girados y entrelazados. Solo los vi descritos, sin imagen confiable, así que no puedo valorar qué tanto se parecen.

**Íconos de interfaz:**
- **Recortar y enmarcar:** Phosphor "Crop", los íconos "crop" de Material y Lucide, y la familia "crop / pantalla completa". Son dos L desfasadas que forman un cuadro abierto. En línea delgada, tu estructura **sí** puede leerse como "recortar". Lo que nos separa es el grosor (26 % del ancho), que las piezas no se cruzan y los remates redondos. D y C son las que más se acercan. Hay que vigilarlo en contextos de interfaz, por ejemplo si el ícono queda junto a herramientas de edición.

**Fintech o SaaS con símbolos de la misma familia:** LUCA Plus (dos cuadrados redondeados entrelazados con una L y un +) y muchas plantillas de stock de "L geométrica dentro de un cuadrado" (Logowik y similares). Es un género, no una copia.

**Competidores de lealtad:**
- **Lasso** (México, competidor directo). Su símbolo es una **L monolineal gruesa con lazos** (se lee casi "dL"), en azul, con remates rectos. Compartimos el género "L de trazo grueso", pero no la silueta: Lasso tiene curvas de lazo y nosotros un cuadro de dos piezas. Riesgo: bajo-medio. A, con remates redondos, se distancia más que C.
- **Boomerangme:** logotipo "Boomerang" con una B dibujada, sin símbolo parecido. Ya descartamos formas de bumerán.
- **Loyverse:** ícono de caja de regalo naranja y logotipo azul. Sin parecido.
- **Stamp Me:** aro negro con disco rojo-morado. Sin parecido.

**Conclusión del parecido:** la idea de "dos L que forman un cuadro" **no es inédita**. MIT Lincoln Lab la usa desde 1958, y Light Work y otros la trabajan. Lo que hace propio el símbolo de LealTab es la ejecución: trazo grueso redondeado, un gancho corto que deja dominar a la L y aberturas medidas. Por eso **no recomiendo D**, que se vuelve corchete genérico, y conviene conservar los remates redondos. Esta revisión no sustituye una búsqueda formal de marca ante el IMPI (clases 9, 35 y 42) y en la base de WIPO antes de registrar.

## Recomendación
**A · Fiel refinada** como símbolo maestro.
- Es tu idea casi intacta, con oficio: aguanta 16 px (versión ajustada), un color, negativo y marketing, y su peso casa con Archivo 800.
- Los remates redondos y el gancho corto la separan de Lincoln Lab, de Lasso y de los íconos de recortar.
- Si quieres más carácter neobrutal, **C** es la alternativa. Cuidaría que no se lea como "recortar". B queda como recurso de animación (el ciclo que se cierra al completar la tarjeta) y no como logo, porque se cierra en tamaños chicos.

Siguientes pasos sugeridos: (1) aprobar A o C; (2) revisar a mano los pares T·a y l·T del logotipo y dibujar una "a" de marca si hiciera falta; (3) cerrar el área de protección y los tamaños mínimos; (4) búsqueda formal ante el IMPI.
