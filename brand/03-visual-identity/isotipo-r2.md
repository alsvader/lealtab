# LealTab · Isotipo, ronda 2

Fase 3 · Identidad visual · 4 de octubre de 2026
Paleta y tipografías: sin cambios (aprobadas). Estilo: Ciclo v2.

## Qué cambió respecto a la ronda 1
Los cuatro conceptos rechazados (Regreso, Esquina, Vueltas, Siguiente) eran el mismo aro con una variación mínima, y por eso recordaban a power, loading, Target o un ícono de señal. En esta ronda ningún finalista es un aro: todos se construyen desde la **L** de LealTab y el **cuarto de vuelta** (el arco que cierra el ciclo) con cuatro estrategias distintas: piezas que encajan, contraforma, umbral y armado modular.

Proceso: 20 bocetos (`isotipo-r2-bocetos.png`), filtrados con 4 criterios (idea de Ciclo legible, que no sea aro ni tarjeta, que aguante 16 px, un color y negativo, y que no tenga parecido claro con marcas conocidas). Pasaron 4, que se refinaron sobre una retícula de 64 unidades con área viva de 8 a 56: grosores de 8–10 u, esquinas convexas de 2.5–5 u, cóncavas de 2.5–3 u y separaciones de 4–6 u.

## Archivos
- `isotipo-r2-bocetos.png`: lámina interna con las 20 ideas, veredicto y finalistas.
- `isotipo-r2.png` (1600×1000): los 4 finalistas con retícula, un color, negativo, marketing, 64/32/16 px, favicon, ícono de app, composición preliminar con "LealTab" y riesgo.
- `isotipo/r2/isotipo-r2-<nombre>.svg` (bosque sobre transparente) y `isotipo-r2-<nombre>-negativo.svg` (lino sobre bosque), para encaje, vuelta, pasale y visitas. Son trazados únicos con relleno evenodd y viewBox de 64.
- Fuentes: `laminas-html/fin.py` (geometría), `gen_iso2.py` (lámina), `gen_bocetos.py` (bocetos).

## Finalistas

### 1. Encaje
**Idea:** una L sólida y la pieza de un cuarto de vuelta que encaja en su hueco. El negocio pone la base y el cliente, al regresar, cierra el ciclo.
**Construcción:** L con fuste de 18 u y pie de 18 u, más un cuarto de disco de radio 25 con centro en (31,33). La separación de 5 u es igual en los dos lados y el cuarto se recorta exacto al ángulo interno de la L.
**A 16 px:** es el más sólido de los cuatro. La separación se sigue leyendo y la silueta es compacta.
**Parecidos buscados:** "L logo quarter circle", "L + geometric fintech logo", monogramas L de banca, Slice (fintech de India, cuarto de círculo).
**Encontrados:** una familia genérica de monogramas "L + forma" (LUCA Plus, que son dos cuadrados redondeados con L y +; Lilly Finance, una L con cuadrado y medios círculos; plantillas "Letter Bank L") y Slice, cuyo cuarto de círculo forma una P. Ninguno tiene esta silueta.
**Riesgo:** medio-bajo, por pertenecer a un género y no por copiar algo concreto.

### 2. Vuelta
**Idea:** un cuarto de vuelta que guarda una L en su contraforma. Cada regreso completa la vuelta y la marca vive adentro.
**Construcción:** cuarto de disco de radio 48 con centro en la esquina (8,56). La L del contraespacio tiene trazo de 8 u y extremos redondos, y está colocada para que la pared quede en 10 u a la izquierda y abajo y en 9 u medida radialmente contra el arco. Es una sola pieza con una contraforma limpia.
**A 16 px:** la L interna queda como una ranura de unos 2 px y todavía se lee. En negativo funciona bien.
**Parecidos buscados:** "L negative space logo", "quarter circle logo letter L", íconos de gráfica de pastel.
**Encontrados:** plantillas de stock de "L en espacio negativo" (por ejemplo una de LogoSymbol con segmentos circulares que también se lee como U). Su construcción es distinta y no son de cuarto de círculo. No encontré marcas conocidas con esta forma.
**Riesgo:** bajo. Conviene vigilar que no se lea como gráfica de pastel o escuadra, sobre todo en contextos de datos.

### 3. Pásale
**Idea:** un marco en L con la puerta entreabierta. Es el "pásale" del negocio de barrio, el lugar al que se regresa.
**Construcción:** jamba y piso de 9 u. La hoja de la puerta va en ligera perspectiva (el canto superior sube 6 u) y está separada 6 u del marco. La perilla es una contraforma de radio 2.8.
**A 16 px:** se ve como L más bloque y la perilla desaparece. A 32 px y más se entiende la puerta.
**Parecidos buscados:** "open door logo", Opendoor, íconos de salida o "abrir puerta", Ledger (corchetes).
**Encontrados:** Opendoor usa una "O", así que no se parece. Lo más cercano es el género de íconos de sistema "salir / entrar", y el corchete en L recuerda de lejos a los corchetes del logotipo de Ledger.
**Riesgo:** medio. Es el más literal y el más cercano a un ícono de interfaz.

### 4. Visitas
**Idea:** tres módulos que arman la L, uno por visita. La última pieza ya trae el arco que cierra la vuelta.
**Construcción:** retícula de 2×2 con celdas de 22 u y separación de 4 u. Lleva un cuadrado en la esquina y dos cuartos de disco con la misma orientación, lo que le da ritmo. Se puede animar pieza por pieza en el producto (cada sello suma una).
**A 16 px:** se sostiene, pero las separaciones se cierran y pierde finura. Es el más débil en favicon.
**Parecidos buscados:** Tetris (pieza L), mosaicos 2×2 (Windows, Fidelity), Lattice, Modulr, Slice.
**Encontrados:** la lectura de pieza de Tetris o de mosaico es posible. Los arcos lo separan de Windows y de Lattice, y no encontré una marca con este armado.
**Riesgo:** medio-bajo.

## Descartados por parecido (resumen)
- **Ligadura l+t:** al refinarla se lee "U+", demasiado cerca de LG U+.
- **Bucle ℓ / lazo:** Lasso es un competidor mexicano de lealtad, y la ℓ es un recurso genérico.
- **Pétalos / L de hojas:** cliché ecológico de stock.
- **Local (L-edificio con puerta):** género inmobiliario de stock.
- **Mosaico 2×2:** recuerda a Windows y a Fidelity.
- **Vínculo:** se confunde con íconos de sincronizar y de eslabón.
- **Ojal:** se lee como "P" (estacionamiento, Pinterest, Slice).
- **Golondrina:** el concepto es bueno ("siempre regresan"), pero es ilustrativa, se ve ruidosa a 16 px y entra en terreno de logos de aves.
- **Conteo:** se lee como 卌, como puente o como código.
- Cualquier forma de bumerán queda fuera por Boomerangme.

Límites de la revisión: la búsqueda se hizo en la web abierta y en bancos de logos. No sustituye una búsqueda de marcas registradas (IMPI/WIPO) antes de registrar el símbolo.

## Recomendación
**Encaje**, con **Vuelta** como alternativa fuerte.
- Encaje es el que mejor resiste a 16 px, en un color y en negativo. Cuenta la historia completa (base + pieza que vuelve y cierra) y es el que más se presta a sistema: la pieza de cuarto de vuelta puede usarse sola como sello, viñeta o animación de "visita completada", con sombra dura en marketing.
- Vuelta es el más propio y "premium" (una sola pieza con contraforma). Si Aarón prefiere un símbolo más silencioso y escultórico, es la mejor opción.
- Pásale y Visitas tienen buena narrativa, pero Pásale es literal y Visitas pierde finura en favicon. Los dejaría como recursos de ilustración o animación, no como isotipo.

Siguiente paso sugerido: con el elegido, ajustar el logotipo LealTab (espaciado y peso para que case con el símbolo), definir el área de protección y hacer la búsqueda formal de marca.
