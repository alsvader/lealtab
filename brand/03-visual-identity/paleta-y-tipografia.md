# LealTab: paleta y tipografía

Fase 3, Visual Identity (parte 1) · Para aprobación de Aarón López Sosa · 4 de octubre de 2026

Base: Ciclo v2 y el moodboard aprobados (`02-creative-direction/`). Lámina: `paleta-y-tipografia.png`. Los contrastes se calcularon con la fórmula de luminancia relativa de WCAG 2.1. Umbrales: AA pide 4.5:1 en texto normal y 3:1 en texto grande (24 px o más, o 18.66 px en negrita) y en elementos gráficos; AAA pide 7:1.

## 1. Paleta final

La paleta de Ciclo v2 se queda sin cambios en los tonos. Solo se agregan dos neutros de trabajo que ya se venían usando en las láminas.

| Color | Hex | RGB | Rol | Proporción |
|---|---|---|---|---|
| **Lino** | #F3EFE6 | 243, 239, 230 | Fondo principal | ~60 % |
| **Bosque** | #0F4D3A | 15, 77, 58 | Protagonista: bloques, botones de producto y fondo para el logo en lino | ~20 % |
| **Menta gris** | #CFE3D6 | 207, 227, 214 | Apoyo: estados, gráficas, fondos secundarios y sticker "Casi premio" (texto noche) | ~10 % |
| **Durazno** | #FF9F6E | 255, 159, 110 | Acento pequeño: recompensa completada (sticker "¡Recompensa lista!"), acción principal en marketing, celebración. Nunca es fondo de marca ni color del logo | ~7 % |
| **Noche** | #0F2A22 | 15, 42, 34 | Texto, contornos y sombras duras (nunca negro puro) | ~3 % (más el texto) |
| Blanco lino *(neutro)* | #FFFDF8 | 255, 253, 248 | Superficie de tarjetas, tablas y campos sobre lino | según uso |
| Gris noche *(neutro)* | #4D635A | 77, 99, 90 | Texto secundario, etiquetas y metadatos | solo texto |

### Contraste medido (texto sobre fondo)

| Texto / fondo | Contraste | Resultado |
|---|---|---|
| Noche / Blanco lino | **15.03:1** | AAA |
| Noche / Lino | **13.31:1** | AAA |
| Noche / Menta gris | **11.36:1** | AAA |
| Lino / Bosque · Blanco lino / Bosque | **8.54:1** · **9.64:1** | AAA |
| Bosque / Lino | **8.54:1** | AAA |
| Noche / Durazno | **7.59:1** | AAA (solo en acentos pequeños, como el sticker "¡Recompensa lista!"; ni logo ni titulares sobre fondo durazno) |
| Durazno / Noche | **7.59:1** | AAA |
| Bosque / Menta gris | **7.29:1** | AAA |
| Gris noche / Lino · Blanco lino | **5.63:1** · **6.36:1** | AA |
| Durazno / Bosque | **4.87:1** | AA (mejor solo en titulares y botones) |
| Gris noche / Menta gris | **4.81:1** | AA justo |
| Durazno / Lino | **1.75:1** | **No pasa**: nunca texto durazno sobre fondos claros |
| Menta gris / Lino (elemento gráfico) | **1.17:1** | **No pasa 3:1**: la menta sobre lino siempre lleva contorno noche |
| Noche / Bosque | **1.56:1** | **No pasa**: no se pone texto noche sobre bosque; la sombra noche sobre bosque no se distingue |

El antiguo gris #6E7F77 de las láminas da 3.69:1 sobre lino, así que **se descarta para texto**. Lo reemplaza el gris noche.

### Combinaciones aprobadas

- **Producto:** texto noche sobre lino o blanco lino; botón principal con fondo bosque y texto lino, o fondo durazno y texto noche, siempre con contorno noche.
- **Marketing:** titular noche sobre lino o menta; titular lino o durazno sobre bosque. El durazno no es fondo de titulares.
- **Isotipo:** noche sobre lino; lino sobre bosque o noche. Nunca va en bosque ni en durazno, ni sobre fondo durazno.
- **No se usan:** texto durazno o menta sobre lino, texto noche sobre bosque, ni bosque y durazno juntos en párrafos.
- **Durazno:** solo como acento pequeño (aro completo, sticker "¡Recompensa lista!"). Nunca es fondo de marca.

> **Corrección 2026-10-06.** Se ajustó esta sección para que coincida con la regla aprobada en `logo/uso/uso.md`: el logo nunca va sobre fondo durazno y el durazno no es fondo de marca, porque se reserva para la recompensa completada. Antes decía "titular noche sobre durazno" (Marketing) e "Isotipo… Sobre durazno, solo en noche". El contraste noche/durazno (7.59:1) sigue siendo válido para acentos pequeños. Segunda corrección del mismo día: el logo y el isotipo no van en bosque (solo noche, lino, negro y blanco, como en `uso.md`); el bosque sí es fondo, con el logo en lino. Antes decía "Isotipo: bosque o noche sobre lino" y el bosque tenía el rol "Protagonista: isotipo". Además, el sticker "Casi premio" pasa de durazno a menta gris con texto noche: el durazno queda solo para "¡Recompensa lista!". La lámina `paleta-y-tipografia.png` se regeneró con ese cambio; la anterior quedó como `paleta-y-tipografia-anterior.png`.

### Colores de función (provisionales, se cierran en la Fase 4)

| Función | Texto | Fondo | Contraste |
|---|---|---|---|
| Éxito / frecuente | Bosque #0F4D3A | Menta gris #CFE3D6 | 7.29:1 |
| Riesgo / te extrañamos | Tostado #A8461A | Durazno claro #FFE6D8 | 4.94:1 (5.15:1 sobre lino) |
| Error | Rojo #B42318 | Rosa claro #FDECEA | 5.75:1 (6.47:1 sobre blanco lino) |

El rojo es solo para errores, nunca para marketing. El estado nunca se comunica únicamente con color: siempre va acompañado de una palabra (Frecuente, En riesgo, Error).

## 2. Tipografía final

Se **confirman Archivo y Manrope**. Archivo condensada en peso 800 da el peso y el carácter neobrutal de los titulares sin perder claridad. Manrope es geométrica y amable, se lee bien en pantallas pequeñas y trae cifras tabulares para los datos.

| | Archivo | Manrope |
|---|---|---|
| Uso | Titulares, displays y stickers | Interfaz, texto, cifras y etiquetas |
| Configuración | Ancho 75 (condensada), peso 800; 700 solo si hace falta | Pesos 400, 500, 600 y 700 |
| Licencia | **SIL Open Font License** (verificado: `ofl/archivo` en el repositorio de Google Fonts, `license: "OFL"`) | **SIL Open Font License** (verificado: `ofl/manrope`, `license: "OFL"`) |
| Variable | Ejes `wght` 100–900 y `wdth` 62–125 | Eje `wght` 200–800 |
| Español | ñ, acentos, ü, ¿ ¡ y $ comprobados en el archivo | ñ, acentos, ü, ¿ ¡ y $ comprobados en el archivo |
| Cifras tabulares | Sí (`tnum`) | Sí (`tnum`), que se usa en todo dato |

La licencia OFL permite usarlas gratis en web, app, impresos y logotipo, y empaquetarlas en la app; lo único que no permite es vender las fuentes por sí solas.

### Escala base

| Nivel | Fuente | Tamaño / interlineado | Uso |
|---|---|---|---|
| Display | Archivo 800, ancho 75 | 96 / 0.9 | Portada de landing, mostrador |
| H1 | Archivo 800 | 64 / 0.92 | Encabezados de página en marketing |
| H2 | Archivo 800 | 44 / 0.95 | Secciones |
| H3 | Archivo 800 | 32 / 1.0 | Títulos de módulo ("Clientes") |
| H4 | Archivo 800 | 24 / 1.05 | Tamaño mínimo de Archivo en titulares |
| Lead | Manrope 500 | 20 / 1.5 | Bajada del titular |
| Texto | Manrope 400 | 16 / 1.55 | Párrafos (base web) |
| Interfaz | Manrope 500 | 14 / 1.45 | Base del dashboard y tablas |
| Pie | Manrope 600 | 12 / 1.4 | Metadatos |
| Etiqueta | Manrope 700, mayúsculas, +0.12 em | 11 / 1.3 | Encabezados de tabla y etiquetas |
| Dato grande | Manrope 700, tabular, −0.02 em | 32 / 1.1 | Indicadores (68 %) |
| Sticker | Archivo 800, mayúsculas, +0.02 em | 11–15 | Stickers (la única excepción a los 24 px) |

### Reglas de uso

- Archivo **solo** en titulares de 24 px o más y en stickers. Nunca en párrafos, botones de producto, tablas ni cifras.
- Los titulares van cortos (hasta unas 8 palabras) y en tono de tú. Las mayúsculas se reservan para displays de hasta 4 palabras, carteles y stickers.
- Toda cifra va en Manrope con `font-variant-numeric: tabular-nums`.
- Respaldos: `Archivo, "Arial Narrow", sans-serif` y `Manrope, system-ui, sans-serif`. En la web se autoalojan las fuentes variables, con `font-display: swap`.
- El logotipo final se dibujará partiendo de Archivo 800 condensada, con ajustes propios que se harán en la siguiente parte de la Fase 3.
