# LealTab · Logo final v1.0

Fase 3 · Identidad visual · 5 de octubre de 2026
Base aprobada: `../referencias/ref-aaron-v2.svg` ("Sistema oficial de variantes v0.6", de Aarón López Sosa). La geometría de Aarón **reemplaza** a la de la ronda 3. Se conservan su forma, su proporción horizontal, sus curvas y la asimetría de las aberturas. Solo se aplicaron los cuatro ajustes aprobados.

## 1. Construcción del isotipo
- Origen: dos trazos de **52 u** con remates y uniones redondas.
  - P1 `M40 20 V124 Q40 156 72 156 H138` (la L).
  - P2 `M154 20 H178 Q210 20 210 52 V124` (el gancho de cabeza).
- **Paso a relleno:** el trazo se convirtió a contorno con Skia (`pathops.stroke` + unión booleana), sin redibujar. Las coordenadas quedan a 2 decimales y la silueta es idéntica (ver la comprobación en `logo-antes-despues.png`).
  - El ángulo interior de la L queda casi recto (radio de unos 6 u), tal como lo produce el trazo original.
- **Caja del maestro:** 222 × 188 u (proporción 1.18:1, horizontal), con origen en la esquina superior izquierda de la tinta.
- **Aberturas (maestro), con asimetría intencional:**
  - superior izquierda: 62 u (del fuste de la L a la punta del brazo);
  - inferior derecha: 26.8 u en diagonal (de remate a remate).
- **x = grosor del trazo = 52 u.** Es la unidad de protección.

## 2. Logotipo (wordmark)
- Contornos de **Archivo** (SIL OFL), instancia estática de **ancho 75 y peso 800** (`laminas-html/archivo-75-800.ttf`), generada con fontTools a partir del archivo variable de Google Fonts.
- **Tracking:** −28/1000 uniforme. **Kerning:** el de la fuente, aplicado con HarfBuzz.
  - El par **l·T no tiene ajuste**: la fuente no trae kerning para ese par y no se agregó ninguno, así que se respeta el ritmo aprobado.
  - El único par con kerning es T·a (−67/1000), que ya viene de la fuente.
- **Altura de mayúsculas (C)** = 687/1000 del cuerpo. Las ascendentes de *l* y *b* suben a 724/1000 y las curvas bajan 12/1000 de la línea base. Los SVG ya incluyen esos excesos.
- Nota: el PNG del v0.6 se renderizó con *Archivo Narrow* de respaldo, porque "Archivo Condensed" no es un nombre de familia instalado. Ahora el nombre es la Archivo 75/800 real, en curvas, así que se ve igual en cualquier equipo.

## 3. Ajustes aplicados (con medidas)
| Ajuste | v0.6 | Final |
|---|---|---|
| Alto del símbolo en el horizontal | 143 px con mayúsculas de 77 px (fuente de 112 px) = **1.86 C** | **1.5 C** (a 112 px de fuente: 115 px) |
| Espacio entre símbolo y nombre (horizontal) | ≈10 px (0.14 C) | **0.48 C medido** (a 112 px: 37 px). Ópticamente se ve como ½ C: se restó 0.02 C porque la esquina superior derecha del símbolo y el remate del gancho son redondos y "alejan" el borde. |
| Alineación vertical (horizontal) | Centro del símbolo ≈ en las mayúsculas | Centro del símbolo = centro exacto de la altura de mayúsculas |
| Vertical: alto del símbolo | 1.57 C (44 % del ancho del nombre) | **2.0 C** (el símbolo mide 56 % del ancho del nombre) |
| Vertical: espacio | 0.58 C | **0.45 C** (de la base del símbolo a la línea de mayúsculas) |
| Vertical: centrado | Por la caja | Símbolo centrado sobre el ancho de tinta del nombre |
| 16/32/48 px | El vector escalado: a 16 px la abertura inferior se llena de grises y se lee cerrada | Versiones dibujadas en píxel (ver §4) |
| Formato | Trazos + texto vivo | Todo en curvas |

## 4. Versiones ajustadas a píxel (solo 16, 32 y 48 px)
Se usan en `favicon.ico` y en `favicon-16/32/48.png`. Bordes rectos en píxel entero, con antialias solo en las curvas. A 16 px, la cobertura se cuantiza en 3 tonos para evitar grises sucios.

| Tamaño | Caja | Trazo | Abertura superior | Apertura óptica inferior derecha |
|---|---|---|---|---|
| 16 px | 14 × 12 px (x 1–15, y 2–14) | 3 px | 4 px | pie −0.4 px y gancho −1 px → quedan 2 px libres |
| 32 px | 30 × 25 px (x 1–31, y 3–28) | 7 px | 8.4 px | pie −0.5 px y gancho −0.5 px |
| 48 px | 44 × 37 px (x 2–46, y 5–42) | 10 px | 12.3 px | sin cambio (ya abre 5.3 px) |

La asimetría se mantiene en las tres: la abertura de arriba siempre es mayor que la de abajo.

## 5. Proporciones de las variantes (unidades del maestro)
- **Horizontal:** 810.3 × 188 u (4.31:1). C = 125.33 u; espacio = 60.16 u.
- **Vertical:** 396.1 × 325.9 u. C = 94 u; espacio = 42.3 u; símbolo de 222 u centrado.
- **Isotipo:** 222 × 188 u.
- **Wordmark:** 528.2 × 134.3 u (C = 125.33 u, la misma escala que en el horizontal).

## 6. Área de protección
**2x por lado** en todas las variantes, con x = grosor del trazo del isotipo (52 u; en el horizontal equivale a 0.41 C). En el wordmark solo, x = 0.41 C. Dentro de esa zona no entra nada: texto, bordes, otras marcas ni el borde del formato. Las versiones PNG con fondo ya incluyen esta área.

## 7. Tamaños mínimos
| Variante | Digital | Impreso |
|---|---|---|
| Horizontal | 96 px de ancho (símbolo de 22 px de alto) | 25 mm de ancho |
| Vertical | 64 px de ancho | 18 mm |
| Isotipo | 16 px (solo con la versión ajustada) | 6 mm |
| Wordmark | 64 px de ancho | 15 mm |
Por debajo de estos tamaños se usa solo el isotipo.

## 8. Color
**El logo va en noche o lino.** Negro y blanco puros solo para aplicaciones de una tinta. El durazno es acento del sistema: puede ser fondo en marketing, **nunca** color del logo.

| Color | Hex | RGB | CMYK aprox.* | Uso en el logo |
|---|---|---|---|---|
| Noche | #0F2A22 | 15, 42, 34 | 64 / 0 / 19 / 84 | Color principal del logo |
| Lino | #F3EFE6 | 243, 239, 230 | 0 / 2 / 5 / 5 | Logo inverso y fondo principal |
| Negro | #000000 | 0, 0, 0 | 0 / 0 / 0 / 100 | Monocromática negra |
| Blanco | #FFFFFF | 255, 255, 255 | 0 / 0 / 0 / 0 | Monocromática blanca |
| Durazno *(acento)* | #FF9F6E | 255, 159, 110 | 0 / 38 / 57 / 0 | Solo como fondo de marketing |
| Bosque *(sistema)* | #0F4D3A | 15, 77, 58 | 81 / 0 / 25 / 70 | Solo como fondo (logo en lino) |

\*CMYK por conversión directa, **sin perfil ICC**. Antes de imprimir, hay que validarlo con el proveedor (perfil Coated FOGRA39 o GRACoL) y pedir una prueba de color. Para la noche, conviene sacar el negro enriquecido de la prueba.

**Combinaciones permitidas (contraste):** noche/lino 13.3:1 · noche/blanco lino 15.0:1 · noche/menta gris 11.4:1 · noche/durazno 7.6:1 (marketing) · lino/noche 13.3:1 · lino/bosque 8.5:1 · negro/blanco y blanco/negro 21:1.
**No permitido:** logo en durazno, bosque u otros colores; noche sobre bosque (1.56:1); fotos sin contraste.
**Usos incorrectos** (ver `logo-uso.png`): estirar, rotar, cambiar colores, poner sombras o efectos fuera de marketing, recolocar o reescalar el símbolo, cambiar el espacio, contornear y usar poco contraste.

## 9. Archivos
```
logo/
├─ logo-final.png           lámina con todas las variantes (1600×1000)
├─ logo-uso.png             protección, mínimos, usos incorrectos, color (1600×1000)
├─ logo-antes-despues.png   v0.6 contra final con medidas (1600×1000)
├─ logo.md
├─ svg/   lealtab-{horizontal|vertical|isotipo|wordmark}-{noche|lino|negro|blanco}.svg   (16, transparentes, en curvas)
├─ png/   los mismos, en 1x, @2x y @4x, transparentes (64)
│         + lealtab-{variante}-fondo-lino y -fondo-noche, en 1x/@2x/@4x, con el área de protección (24)
│         anchos base 1x: horizontal 640, vertical 360, isotipo 256, wordmark 480 px
└─ favicon/
   ├─ favicon.ico           16 + 32 + 48, cada uno dibujado en píxel (noche, fondo transparente)
   ├─ favicon-16/32/48.png
   ├─ favicon.svg           vectorial; noche en modo claro y lino en modo oscuro (prefers-color-scheme)
   ├─ apple-touch-icon.png  180, fondo noche, símbolo lino (60 % del ancho)
   ├─ icon-192.png · icon-512.png               PWA "any" (símbolo 60 %)
   ├─ icon-192-maskable.png · icon-512-maskable.png (+ .svg)   PWA "maskable" (símbolo 46 %, dentro del círculo seguro del 80 %)
   ├─ avatar-400-lino.png · avatar-400-noche.png   redes (símbolo 52 %, seguro para recorte circular)
   └─ site.webmanifest
```
Para el `<head>`:
```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0F2A22">
```
Fuentes reproducibles en `laminas-html/logo/` (`lg_geo.py` geometría · `lg_word.py` logotipo · `lg_lock.py` lockups · `lg_px.py` píxel · `lg_build.py` exportación · `lg_final.py`, `lg_uso.py` y `lg_ad.py` láminas · `render.sh`).

## 10. Pendientes
1. **Búsqueda formal de marca ante el IMPI (clases 9, 35 y 42) y en WIPO (Global Brand Database)** antes de registrar. Hay un parecido estructural con el logo de **MIT Lincoln Laboratory** (1958): dos L giradas 180° que forman un rectángulo con aberturas en esquinas opuestas. La ejecución y el sector son distintos, pero conviene que un especialista en propiedad industrial lo valore. También hay que revisar Light Work (dos L entrelazadas) y la familia de íconos de "recortar".
2. **Favicon en pestañas oscuras:** el `.ico` en noche transparente se ve poco sobre pestañas oscuras (lo probé contra #35363A). Los navegadores modernos usan `favicon.svg`, que cambia a lino en modo oscuro. Si se quiere un `.ico` que funcione en cualquier fondo, la alternativa es un mosaico noche con símbolo lino. Queda a decisión de Aarón.
3. CMYK definitivos con perfil y prueba de imprenta (ver §8).
4. Opcional: revisar a mano el espacio T·a en tamaños de display, sin tocar el par l·T.
