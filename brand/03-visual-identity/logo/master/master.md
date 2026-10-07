# LealTab · Master del logo

**Estado: horizontal y vertical congelados 2026-10-05** (aprobados por Aarón López Sosa). Ya no se modifican los atributos `d` ni los transforms de estos archivos. Todo lo que se derive (sistema de variantes, pixel-fit, exportaciones) reutiliza sus `d` literales.

### Re-congelado limpio (2026-10-05, 23:00 CST)
Solo cambiaron **metadatos**: `<title>` y `<desc>`.
- Antes, el `<title>` del horizontal decía "PROPUESTA · no aprobado · no congelado" y el `<desc>` del vertical citaba el hash anterior del master.
- Ahora los títulos son "LealTab · Master horizontal · congelado 2026-10-05" y "LealTab · Master vertical · congelado 2026-10-05".
- Al cambiar esos bytes cambia el sha256 del archivo. La geometría es la misma.

| Archivo | sha256 anterior | sha256 nuevo |
|---|---|---|
| `lealtab-master.svg` = `lealtab-master-frozen.svg` | `c0d59f96b4a5aa9d3d0f11bf4f9b4189a1615961751d1717f2c36d0e4f7acd65` | `18e949212be392167cf0719f5142c9081ba547f50c2ba6b6bf37fc4defc36c77` |
| `lealtab-vertical.svg` = `lealtab-vertical-frozen.svg` | `57d5bee375327bf0563da4d8e52766d9229c7ece776e32161736883347526cc5` | `8ca6ee15aff62416cc395cd4cccfc5a5b4c8d29764ea1725dfea3f49a3ac5377` |

- Las copias `*-frozen.svg` se regeneraron con permisos 444. `cmp` confirma que son idénticas byte a byte a su original.
- **Comprobación de geometría** (`laminas-html/sistema/recongelar.py` → `recongelado.json`):
  - los 9 `d` tienen el mismo sha256 antes y después;
  - los grupos y transforms (`#isotipo` `translate(89.5563 0)`, `#wordmark` `translate(-211.62 206.8) scale(0.75)` en el vertical, ninguno en el horizontal) no cambiaron.

| Trazado | sha256 del `d` (sin cambios) |
|---|---|
| isotipo-pieza-l | `2facb2f3b38d…` |
| isotipo-pieza-gancho | `81ef2992439f…` |
| wm-L | `3ec5ef758c3f…` |
| wm-e | `1ea1fe1b4489…` |
| wm-a1 | `62bd31940ea9…` |
| wm-l | `c29c6707cd5a…` |
| wm-T | `0ff8fdc3db82…` |
| wm-a2 | `3f84d693ddf0…` |
| wm-b | `6db24b615a56…` |

Los hashes completos están en `logo/sistema/verificacion-paths.json`.

## Archivos
- `lealtab-master.svg`: lockup horizontal maestro.
- `lealtab-master-frozen.svg` y `lealtab-vertical-frozen.svg`: copias congeladas de solo lectura.
- `verification.png` (1600×1000) y `verification.html`: lámina de verificación. Solo se cambió la etiqueta, que ahora dice "Horizontal congelado · 2026-10-05"; el resto de la lámina no cambió.
- `lealtab-vertical.svg`: master vertical **congelado**. `vertical-verification.png` es la lámina de cuando era propuesta: no se regeneró y su etiqueta todavía dice "no congelado".
- Sistema de variantes en `../sistema/` (PROPUESTA · pendiente de aprobación): 20 SVG, `sistema-variantes.svg` + `.png` y `verificacion-paths.json`.
- Fuentes reproducibles en `../../laminas-html/master/`:
  - `build_master.py`: arma el master.
  - `verify.py`: compara por raster.
  - `gen_verification.py` y `render.sh`: arman y exportan la lámina.
  - `verify-resultados.json`: cifras de la última corrida.

## Cómo se construyó
1. **Isotipo.** Se reconvirtió desde los trazos originales de `referencias/ref-aaron-v2.svg`:
   - P1 `M40 20 V124 Q40 156 72 156 H138`;
   - P2 `M154 20 H178 Q210 20 210 52 V124`;
   - trazo de 52 u, remates y uniones redondas.

   Cada trazo se pasó a relleno con Skia (`pathops`: `stroke` → `convertConicsToQuads` → `simplify`), sin redibujar a ojo. Se trasladó (−14, +6) para que la tinta empiece en 0,0. Son dos trazados, uno por pieza, porque las piezas no se tocan.
2. **Wordmark.** Es "LealTab" en Archivo (SIL OFL), instancia estática de ancho 75 y peso 800 hecha con fontTools.
   - El kerning es el de la fuente (HarfBuzz) y el tracking, −28/1000 uniforme.
   - **Par l·T: 0** (sin kerning en la fuente y sin ajuste manual). T·a: −67, de la fuente.
   - Los glifos van a curvas con la transformación ya aplicada a las coordenadas: no queda ningún `transform` en el archivo.
3. **Composición (Ajuste A).** El símbolo mide 1.5 C, el espacio es 0.48 C y el símbolo va centrado en la altura de mayúsculas.

## Estructura del SVG
- `viewBox="0 0 810.31 188"`. Un solo color: `fill="#0F2A22"` (noche), declarado en el grupo raíz.
- Sin `stroke`, `<text>`, `transform`, filtros ni sombras.
- Grupos:
```
#lealtab-master
├─ #isotipo   → #isotipo-pieza-l, #isotipo-pieza-gancho      caja x 0–222, y 0–188
└─ #wordmark  → #wm-L, #wm-e, #wm-a1, #wm-l, #wm-T, #wm-a2, #wm-b   caja x 282.16–810.31, y 24.58–158.86
```
- Para extraer una pieza, se copia su grupo y se usa su caja como `viewBox`: isotipo `0 0 222 188`; wordmark `282.16 24.58 528.15 134.27`. El `<desc>` del archivo repite estas cajas.

## Medidas exactas (unidades del master)
| Medida | Valor |
|---|---|
| Isotipo | 222 × 188 u (1.18:1) |
| Aberturas del v0.6 (sin tocar) | superior izquierda 62 u · inferior derecha 26.8 u en diagonal |
| C (altura de mayúsculas) | 125.33 u (687/1000 del cuerpo; cuerpo = 182.44 u) |
| Símbolo / C | 188 / 125.33 = **1.500** |
| Espacio símbolo → fuste de la L | **60.16 u = 0.48 C** (ópticamente ≈ ½ C) |
| Línea base | y = 156.67 (centro de C en y = 94, igual al centro del símbolo) |
| Fuste de Archivo 800 | 29.37 u (el trazo del símbolo, 52 u, es 1.77 veces ese fuste) |
| Lockup completo | 810.31 × 188 u |

**A un cuerpo de referencia de 112 px** (el del v0.6): C = 76.9 px, símbolo = 115.4 px, espacio = 36.9 px y el lockup mide 497 × 115 px.

## Cómo se verifica la fidelidad
- **Isotipo.** Chrome renderiza el trazo original (52 u) y el relleno del master a ×4 (888×752 px) y se comparan con `verify.py`:
  - **0 píxeles** difieren más de 50 %;
  - 38 difieren más de 10 % (solo antialias en bordes), de 375,600 píxeles con tinta;
  - la diferencia máxima es de 20 %.

  En la lámina, el contorno verde del master corre sobre el borde del trazo rojo del v0.6, incluida la esquina interior de la L y la abertura inferior derecha.
- **Wordmark.** Las curvas se comparan contra la misma fuente renderizada como texto vivo (Archivo 75/800, −28/1000): 17 de 595,977 píxeles difieren más de 50 %, por redondeo de bordes del rasterizador de texto. No se compara contra el PNG del v0.6, porque ese texto salió con Archivo Narrow de respaldo.
- **Para repetir la prueba:** `python3 verify.py && python3 gen_verification.py && bash render.sh` en `laminas-html/master/`.

## Lockup vertical (congelado 2026-10-05 · principal 2 C / 0.45 C)
Se derivó del master congelado **sin redibujar**: los 9 atributos `d` se copiaron tal cual y solo se aplicó `transform` a los grupos.
- `#isotipo`: `translate(89.5563 0)`, a escala 1.
- `#wordmark`: `translate(-211.62 206.8) scale(0.75)`, escala uniforme.
- Tracking y kerning no cambian, porque van dentro de los trazados.

| Medida | Principal (2 C · 0.45 C) | Alt. A (1.75 C · 0.5 C) | Alt. B (2.25 C · 0.4 C) |
|---|---|---|---|
| C | 94.00 u | 107.43 u | 83.56 u |
| Símbolo | 188 u = 2 C | 188 u = 1.75 C | 188 u = 2.25 C |
| Espacio símbolo → mayúsculas | 42.30 u | 53.71 u | 33.42 u |
| Escala del wordmark | 0.75 | 0.857 | 0.667 |
| viewBox | 0 0 396.11 325.95 | 0 0 452.70 351.02 | 0 0 352.10 306.44 |
| Símbolo / ancho del nombre | 56 % | 49 % | 63 % |
| A 112 px de cuerpo (C = 76.9 px) | símbolo 153.9 · espacio 34.6 · 324 × 267 px | 134.6 · 38.5 px | 173.1 · 30.8 px |

- **Centrado óptico.** El centroide de tinta del isotipo cae en x = 106.0 (el centro de su caja es 111): la pieza en L pesa más. Por eso el símbolo se desplaza **+2.5 u** (½ del desfase, 0.027 C) a la derecha del centro geométrico del nombre.
- **Prueba de identidad.** Los 9 trazados (`#isotipo-pieza-l`, `#isotipo-pieza-gancho`, `#wm-L` … `#wm-b`) son iguales al master como cadena, y por lo tanto tienen el mismo sha256. La tabla está en `vertical-verification.png` y se genera con `build_vertical.py`.
- sha256 de `lealtab-vertical.svg`: `8ca6ee15aff62416cc395cd4cccfc5a5b4c8d29764ea1725dfea3f49a3ac5377` (antes del re-congelado: `57d5bee3…26cc5`).
- Las alternativas A y B solo aparecen en la lámina. Sus SVG de trabajo están en `laminas-html/master/lealtab-vertical-alt-*.svg`.
- Fuentes: `build_vertical.py` y `gen_vertical.py`.
- **Aarón congeló la principal.** Las alternativas A y B quedan descartadas.

## Qué NO se hizo todavía
- El sistema de variantes SVG ya existe como propuesta en `../sistema/`. Antes de eso no había variantes (isotipo y wordmark sueltos, inversa, mono) ni exportaciones PNG.
- No hay versiones ajustadas a píxel de 16/32/48 ni favicons finales. La franja de reducción de la lámina es el mismo master escalado, **sin pixel-fit**: a 16 px la abertura inferior derecha se estrecha y se llena de grises.
- No hay brand book. Tampoco se cerraron el área de protección, los tamaños mínimos ni los CMYK.
- No se tocaron `logo/logo-final.png`, `logo/png/`, `logo/svg/` ni `logo/favicon/` (son de la iteración anterior).
- Sigue pendiente la búsqueda formal ante el IMPI (clases 9, 35 y 42) y en WIPO, por el parecido estructural con MIT Lincoln Laboratory.

Siguiente paso: que Aarón apruebe el sistema de variantes (`../sistema/sistema-variantes.png`). Después siguen el pixel-fit, los PNG de exportación, los favicons y el brand book.
