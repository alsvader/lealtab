---
version: alpha
name: LealTab
description: Sistema de diseño de LealTab (Fase 4, aprobado el 6 oct 2026). Ruta Ciclo v2, minimal en el orden y neobrutal en los detalles.
colors:
  # Primitivos: valores exactos de brand/04-design-system/tokens.json (color.*)
  lino: "#F3EFE6"
  blanco-lino: "#FFFDF8"
  noche: "#0F2A22"
  bosque: "#0F4D3A"
  menta: "#CFE3D6"
  durazno: "#FF9F6E"
  gris-noche: "#4D635A"
  # Estados funcionales (cerrados en Fase 4; solo para estados, nunca de marca)
  tostado: "#A8461A"
  durazno-claro: "#FFE6D8"
  rojo: "#B42318"
  rosa-claro: "#FDECEA"
  # Roles semánticos: mismos alias que tokens.json, apuntan a un primitivo
  primary: "{colors.bosque}"   # alias que pide la spec de DESIGN.md; equivale a color.brand
  bg: "{colors.lino}"
  surface: "{colors.blanco-lino}"
  text: "{colors.noche}"
  text-muted: "{colors.gris-noche}"
  text-on-bosque: "{colors.lino}"
  border: "{colors.noche}"
  shadow: "{colors.noche}"
  brand: "{colors.bosque}"
  accent: "{colors.durazno}"
  support: "{colors.menta}"
  success: "{colors.bosque}"
  success-bg: "{colors.menta}"
  risk: "{colors.tostado}"
  risk-bg: "{colors.durazno-claro}"
  error: "{colors.rojo}"
  error-bg: "{colors.rosa-claro}"
typography:
  # Familias y tamaños de tokens.json (font.*); pesos por nivel de 01-tokens.md §4
  display:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 96px
    fontWeight: 800
    lineHeight: 0.9
    fontVariation: "'wdth' 75"
  h1:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 64px
    fontWeight: 800
    lineHeight: 0.92
    fontVariation: "'wdth' 75"
  h2:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 44px
    fontWeight: 800
    lineHeight: 0.95
    fontVariation: "'wdth' 75"
  h3:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 32px
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 75"
  h4:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.05
    fontVariation: "'wdth' 75"
  lead:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  input:
    # campos de texto (input, select, textarea) en todo tamaño de pantalla; token font.size.input (2026-10-21)
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: 16px
  ui:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.45
  caption:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.12em
  stat:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
    fontFeature: "'tnum'"
  sticker-sm:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 11px
    fontWeight: 800
    letterSpacing: 0.02em
    fontVariation: "'wdth' 75"
  sticker:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 13px
    fontWeight: 800
    letterSpacing: 0.02em
    fontVariation: "'wdth' 75"
  sticker-lg:
    fontFamily: "Archivo, \"Arial Narrow\", sans-serif"
    fontSize: 15px
    fontWeight: 800
    letterSpacing: 0.02em
    fontVariation: "'wdth' 75"
rounded:
  sticker: 6px
  control: 10px
  card: 14px
  container: 24px
  full: 9999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 24px
  "6": 32px
  "7": 48px
  "8": 64px
  grid-columns-desktop: 12
  grid-columns-mobile: 4
  grid-gutter-desktop: 24px
  grid-gutter-mobile: 16px
components:
  # Solo las 8 propiedades de la spec. Bordes, sombras, foco y movimiento van en la prosa.
  button-primary:
    backgroundColor: "{colors.bosque}"
    textColor: "{colors.lino}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: 12px 16px
  button-secondary:
    backgroundColor: "{colors.blanco-lino}"
    textColor: "{colors.noche}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: 12px 16px
  button-ghost:
    # fondo transparente (ver prosa); se omite backgroundColor para que el linter no mida contra #00000000
    textColor: "{colors.noche}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: 12px 16px
  button-destructive:
    backgroundColor: "{colors.rojo}"
    textColor: "{colors.lino}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: 12px 16px
  button-disabled:
    backgroundColor: "{colors.menta}"
    textColor: "{colors.gris-noche}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: 12px 16px
  button-sm:
    typography: "{typography.ui}"
    padding: 8px 12px
  button-lg:
    typography: "{typography.body}"
    padding: 16px 24px
  button-marketing-cta:
    backgroundColor: "{colors.durazno}"
    textColor: "{colors.noche}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.blanco-lino}"
    textColor: "{colors.noche}"
    typography: "{typography.input}"
    rounded: "{rounded.control}"
    padding: 12px
  card:
    backgroundColor: "{colors.blanco-lino}"
    textColor: "{colors.noche}"
    rounded: "{rounded.card}"
  chip-success:
    backgroundColor: "{colors.menta}"
    textColor: "{colors.bosque}"
    typography: "{typography.label}"
    rounded: "{rounded.sticker}"
    padding: 4px 8px
  chip-risk:
    backgroundColor: "{colors.durazno-claro}"
    textColor: "{colors.tostado}"
    typography: "{typography.label}"
    rounded: "{rounded.sticker}"
    padding: 4px 8px
  chip-error:
    backgroundColor: "{colors.rosa-claro}"
    textColor: "{colors.rojo}"
    typography: "{typography.label}"
    rounded: "{rounded.sticker}"
    padding: 4px 8px
  table-container:
    backgroundColor: "{colors.blanco-lino}"
    rounded: "{rounded.card}"
  table-header:
    textColor: "{colors.gris-noche}"
    typography: "{typography.label}"
  table-cell:
    textColor: "{colors.noche}"
    typography: "{typography.ui}"
    padding: 12px 16px
  table-cell-compact:
    typography: "{typography.ui}"
    padding: 8px 12px
  table-row-selected:
    backgroundColor: "{colors.menta}"
  validation-summary:
    backgroundColor: "{colors.rosa-claro}"
    textColor: "{colors.rojo}"
    rounded: "{rounded.control}"
  dialog:
    backgroundColor: "{colors.blanco-lino}"
    textColor: "{colors.noche}"
    rounded: "{rounded.card}"
    padding: 24px
  toast-success:
    backgroundColor: "{colors.menta}"
    textColor: "{colors.bosque}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: 12px 16px
  toast-error:
    backgroundColor: "{colors.rosa-claro}"
    textColor: "{colors.rojo}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: 12px 16px
  pagination-current:
    backgroundColor: "{colors.bosque}"
    textColor: "{colors.lino}"
    typography: "{typography.ui}"
---

# Design System: LealTab

> **Fuente de verdad.** Este archivo resume el design system aprobado en la Fase 4 (6 oct 2026). La fuente de verdad es `brand/04-design-system/`, en especial `brand/04-design-system/tokens.css` y `brand/04-design-system/tokens.json`. **Si este archivo choca con esa carpeta, gana `brand/04-design-system/`** y hay que corregir este. Detalle por pieza: `01-tokens.md`, `02-botones-y-campos.md`, `03-cards-y-estados.md`, `04-tablas-y-formularios.md` y `05-patrones.md`, en la misma carpeta.
>
> **Stack.** Definido en `docs/adr/002-stack.md`: Next.js con Tailwind y **shadcn/ui como primitivos**. shadcn/ui pone la estructura y la accesibilidad; la piel (color, tipografía, radios, bordes, sombras) sale siempre de los tokens de `tokens.css`, sin inventar colores (RNF-DIS-01 y RNF-STK-02 del PRD). Producto: `docs/prd/PRD-lealtab-mvp.md`. Contexto de producto para agentes: `PRODUCT.md`.
>
> Lo que las fuentes no resuelven dice **Por definir**. Los encabezados `##` van en inglés a propósito: son los nombres canónicos de la spec de DESIGN.md y las herramientas los leen tal cual.

## Overview

**Creative North Star: "Ciclo"**

La idea visual aprobada se llama Ciclo (ruta Ciclo v2): cada regreso cierra un círculo y abre el siguiente. El recurso propio es el **aro**, un arco que avanza con cada visita y solo se vuelve durazno cuando la recompensa se completa. Todo lo demás está al servicio de esa idea: **minimal en el orden, neobrutal en los detalles**. La base es papel lino, mucho aire y una retícula estricta. Encima va poca cosa, pero con carácter: contornos en noche, sombras duras sin desenfoque, bloques de color plano y titulares condensados con peso.

Se debe sentir como **una herramienta seria hecha por gente cercana**: precisa en el panel del negocio y alegre en el mostrador, sin volverse infantil. La personalidad es Simple, Confiable, Humana y Premium. El nivel de referencia es el de Stripe, Linear, Clerk, Resend, Vercel, Ramp y Mercury, sin copiar sus identidades. LealTab no es el típico software de puntos y cupones para cafeterías, y su identidad no gira alrededor de una tarjeta: la tarjeta es la puerta de entrada y la marca es el regreso.

La expresión sube por escalones. El panel del negocio (`/panel/`) es el nivel más minimal; le siguen la app del cliente (`/c/`) y la landing, y lo más expresivo son las redes y el material de mostrador.

**Key Characteristics:**
- Fondo lino, nunca blanco puro; superficies en blanco lino.
- Noche en lugar de negro, en texto, contornos y sombras.
- Bosque como protagonista; durazno solo como acento pequeño y premio.
- Sombras duras (sin blur, abajo a la derecha) y contornos de 2 px en producto.
- Archivo condensada 800 para titulares grandes; Manrope para todo lo demás.
- Un estado siempre se dice con color **y** palabra.
- Movimiento corto, con un solo rebote; nada pasa de 1 s.

## Colors

Paleta cálida y sobria: neutros de papel, un verde profundo que manda y un solo acento durazno que se gana.

### Primary
- **Bosque** (`colors.bosque`, #0F4D3A): protagonista de la marca. Botón primario de producto, bloques de marca, página actual en la paginación y avance del aro. Sobre bosque el texto va en lino (8.54:1), nunca en noche (1.56:1, no pasa).

### Secondary
- **Menta gris** (`colors.menta`, #CFE3D6): apoyo. Fondos secundarios, estados de éxito, fila seleccionada, skeletons de carga, relleno de íconos activos, carril del aro y halo de foco. Sobre lino nunca va sola: siempre con contorno noche (1.17:1 como elemento gráfico).

### Tertiary
- **Durazno** (`colors.durazno`, #FF9F6E): acento pequeño y recompensa completada (el aro completo, el sticker "¡Recompensa lista!"). En marketing también rellena el CTA. Nunca es fondo de marca, nunca va en el logo y nunca es texto sobre lino (1.75:1).

### Neutral
- **Lino** (`colors.lino`, #F3EFE6): fondo de página en producto y marketing (~60 % de cada pieza).
- **Blanco lino** (`colors.blanco-lino`, #FFFDF8): superficie de cards, tablas, campos, dialogs y paneles.
- **Noche** (`colors.noche`, #0F2A22): texto, contornos y sombras duras. Sustituye siempre al negro puro.
- **Gris noche** (`colors.gris-noche`, #4D635A): solo texto secundario, etiquetas, hints y metadatos (AA sobre lino y blanco lino).

### Estados funcionales
Entran al sistema **solo** como tokens de estado, nunca como colores de marca:

| Estado | Texto / fondo | Tokens | Contraste |
|---|---|---|---|
| Éxito / Frecuente | Bosque sobre menta | `success` · `success-bg` | 7.29:1 |
| Riesgo / En riesgo / Te extrañamos | Tostado sobre durazno claro | `risk` · `risk-bg` | 4.94:1 |
| Error | Rojo sobre rosa claro | `error` · `error-bg` | 5.75:1 |

Proporción de referencia (Fase 3): lino ~60 %, bosque ~20 %, menta ~10 %, durazno ~7 %, noche ~3 % más el texto.

### Named Rules
**The Durazno se gana Rule.** El durazno se reserva para el momento en que se completa una recompensa (y para el CTA de marketing). No rellena cards, filas, toasts, dialogs, toolbars ni empty states, y nunca es fondo del logo.

**The Noche, no negro Rule.** No existe el negro puro (#000) en la interfaz. Texto, contornos y sombras van en noche.

**The Color más palabra Rule.** Ningún estado se comunica solo con color o solo con ícono: siempre lleva su palabra (Frecuente, En riesgo, Error, Listo).

**The Rojo es técnico Rule.** El rojo es solo para errores técnicos o de formulario y para la acción destructiva. Nunca en marketing.

## Typography

**Display Font:** Archivo, ancho 75 (condensada), peso 800; 700 solo si hace falta (respaldo `"Arial Narrow", sans-serif`)
**Body Font:** Manrope, pesos 400, 500, 600 y 700 (respaldo `system-ui, sans-serif`)

**Character:** Archivo condensada da el peso y el carácter neobrutal de los titulares sin perder claridad; Manrope es geométrica y amable, se lee bien en pantallas chicas y trae cifras tabulares para los datos. Las dos tienen licencia SIL OFL.

### Hierarchy
- **Display** (Archivo 800, 96 px, 0.9): portada de landing y mostrador.
- **H1 a H4** (Archivo 800; 64 / 44 / 32 / 24 px; 0.92 a 1.05): encabezados de marketing y secciones. 24 px es el mínimo de Archivo en titulares.
- **Lead** (Manrope 500, 20 px, 1.5): bajada del titular.
- **Body** (Manrope 400, 16 px, 1.55): párrafos; base web.
- **Input** (Manrope, 16 px): letra de todos los campos de texto (input, select y textarea), en todos los tamaños de pantalla.
- **UI** (Manrope 500, 14 px, 1.45): base del panel, tablas, botones y labels.
- **Caption** (Manrope 600, 12 px, 1.4): metadatos, hints y pies.
- **Label** (Manrope 700, 11 px, mayúsculas, +0.12 em): encabezados de tabla y etiquetas de sección.
- **Stat** (Manrope 700, 32 px, 1.1, −0.02 em, tabular): indicadores y datos grandes.
- **Sticker** (Archivo 800, mayúsculas, +0.02 em; 11 / 13 / 15 px): stickers, la única excepción a los 24 px.

### Named Rules
**The Archivo solo arriba de 24 Rule.** Archivo va solo en titulares de 24 px o más y en stickers. Nunca en párrafos, botones, labels, inputs, chips, tablas, cifras, dialogs ni toasts.

**The Panel en Manrope Rule.** En el panel del negocio todo es Manrope, incluidos los títulos de página (Manrope 700 en tamaño lead o body). Archivo queda para marketing, mostrador y stickers; si la app del cliente (`/c/`) usa Archivo en algún titular: **Por definir** en estas fuentes.

**The Cifra tabular Rule.** Toda cifra va en Manrope con `font-variant-numeric: tabular-nums`.

Los titulares van cortos (hasta unas 8 palabras) y de tú. Las mayúsculas se reservan para displays de hasta 4 palabras, carteles, stickers y labels.

Carga de fuentes: `tokens.css` las importa desde Google Fonts (Archivo `wdth` 75 en 700 y 800; Manrope 400 a 700) con `display=swap`; `paleta-y-tipografia.md` pide autoalojar las variables en web. Cuál de las dos se usa en `web/`: **Por definir**.

## Layout

Retícula estricta que ordena, no decora. Espaciado en base 4 px con la escala 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 (`spacing.1` a `spacing.8`); no se usan valores sueltos como 5, 10 o 18.

- **Desktop:** 12 columnas, medianil de 24 px (`spacing.5`), márgenes de 24 a 48 px.
- **Mobile:** 4 columnas, medianil de 16 px (`spacing.4`), márgenes de 16 px.
- Un dato por pantalla cuando se pueda.

**Nav shell del panel:** sidebar + content. Sidebar de ~220 a 260 px en desktop, colapsable a íconos en tablet; content sobre lino con padding de 24 a 32 px. En mobile el sidebar pasa a drawer o bottom nav. Navegación lateral del MVP: Inicio, Quién regresa, Mostrador, Clientes, Tarjeta y Ajustes. El fondo del sidebar (bosque, o surface con borde derecho noche) y la decisión drawer o bottom nav quedaron para la Fase 6: **Por definir** en estas fuentes.

**Formularios:** stack de una columna por defecto (ancho máximo ~480 a 560 px en desktop, gap de 16 a 24 px entre campos); en desktop, 2 columnas con medianil de 24 px y campos anchos a span 2; colapsa a 1 columna por debajo de ~720 px.

Breakpoints generales y ancho máximo del contenido: **Por definir**.

## Elevation & Depth

La profundidad es **estructural, no ambiental**: sombras duras en noche, sin blur ni spread, siempre abajo a la derecha. Nunca hay sombras difusas, degradados ni brillos.

| Sombra | Offset | Uso |
|---|---|---|
| sticker | 3 px 3 px 0 | Stickers de marketing (en producto van planos) |
| button | 4 px 4 px 0 | Botones con relieve |
| card | 5 px 5 px 0 | Cards con relieve, dialogs |
| social | 6 px 6 px 0 | Redes |
| storefront | 8 px 8 px 0 | Mostrador y piezas grandes |

Bordes en noche: hair 1.5 px (separadores), product 2 px (default de producto), product-strong 2.5 px (énfasis, hover y foco), marketing 3 px.

### Named Rules
**The Sombra se come Rule.** Al presionar, el botón baja al offset de su sombra (4 px) y la sombra desaparece. Una card interactiva baja solo 2 px.

**The Panel plano Rule.** En el panel del negocio la sombra vive solo en el botón primario, en los dialogs y, si aplica, en contenedores de página con relieve. Cards, tablas, secondary y ghost van planos.

## Shapes

Esquinas suaves y escalonadas, nunca píldoras para el chrome: sticker 6 px, control 10 px (botón, campo, toast, resumen de validación), card 14 px (cards, tablas, dialogs), container 24 px o más. `rounded.full` es **solo** para aros y anillos.

El aro de progreso es la forma firma: remates redondos, empieza a las 12 y avanza en sentido horario. Carril en menta, avance en bosque y, solo al completarse, durazno. En interfaz va plano (sin contorno ni sombra; 56 a 72 px con cifra, 24 a 28 px en listas) y siempre sobre blanco lino, nunca sobre bosque ni con el avance en lino. En marketing lleva contorno noche de 3 px y sombra dura de 6 px.

Íconos propios de línea (18, en `brand/03-visual-identity/recursos/iconos/`): rejilla de 24 px, trazo de 2 px en noche (2.5 en marketing), remates redondos, esquinas emparentadas con el isotipo y formas abiertas en L donde tiene sentido. El estado activo agrega un relleno plano menta. En producto nunca llevan sombra. WhatsApp usa su ícono oficial tal cual. Si shadcn/ui trae su propio set de íconos, cuál se usa de respaldo para lo que no cubren los 18: **Por definir**.

### Named Rules
**The Un solo aro Rule.** Un aro grande por pieza. Nunca hileras de aros iguales: eso parece tarjeta de sellos.

## Components

Filosofía: **táctil y seguro**. Contorno noche, relleno plano y sombra dura que se hunde al presionar. Todo en Manrope.

### Botones
Chrome común: Manrope 600, radio control, borde product 2 px noche, sombra button 4 px. Tamaños: `sm` 8 · 12 px (UI 14, ~32 px de alto), `md` por defecto 12 · 16 px (UI 14, ~40 px), `lg` 16 · 24 px (body 16, ~48 px).
- **Primary:** bosque con texto lino. Acción principal de producto. Máximo uno por page header.
- **Secondary:** blanco lino con texto noche.
- **Ghost / tertiary:** transparente, texto noche, borde hair o product, sin sombra.
- **Destructive:** rojo con texto lino. Solo para borrar o acciones irreversibles, y vive en el dialog de confirmación.
- **Disabled:** menta con texto gris noche, sin sombra, `pointer-events: none` (opacidad ~0.55 como alternativa).
- **Marketing CTA:** durazno con texto noche, contorno y sombra. Solo landing, redes y mostrador; nunca es el primario del panel ni de un formulario de producto.

Estados: **hover** sube el borde a 2.5 px (sin hex nuevos); **active** desplaza 4 px y apaga la sombra, con `duration.fast` (150 ms) y `easing.standard`; **focus visible** agrega el anillo `--focus-ring` (halo menta de 3 px) además del contorno; **loading** mantiene el look, pone `aria-busy` y el texto "Cargando…" y no acepta clic. En pantallas densas del panel, secondary y ghost van planos.

### Campos
Fondo blanco lino, texto noche, placeholder y hint en gris noche, radio control, borde product 2 px noche, padding 12 px, letra de 16 px (`typography.input`). Anatomía: label visible arriba (Manrope 600) → control → hint o error en caption.
- **Focus:** borde 2.5 px + anillo menta.
- **Error:** borde rojo y mensaje abajo con palabra ("Error: …", "Revisa este dato").
- **Disabled:** fondo menta o surface con opacidad, texto gris noche.
- Textarea (alto mínimo ~64 px) y select con el mismo chrome y la misma letra de 16 px; flecha del select en noche.

**The Campo en 16 Rule.** Todo input, select y textarea va en 16 px, en cualquier pantalla y en cualquier tamaño de control: `sm` o la densidad compacta reducen el padding, nunca la letra.

### Cards
Blanco lino sobre lino, texto noche, radio card, borde product 2 px, padding de 16 a 24 px, solo Manrope. Anatomía: header (título, chip o acción ghost) · body · footer (metadato o botón `sm`), con separadores hair opcionales.
- **Default / elevated:** con sombra card 5 px; elevated es el mismo tratamiento cuando la card es el foco de la vista.
- **Flat / dashboard:** sin sombra. Es la preferida en el panel.
- **Interactive:** hover con borde 2.5 px, foco con anillo menta, active con translate de 2 px y sombra apagada.

### Estados (chips y vacío / carga / error)
- **Chips de estado:** planos en producto (sin rotar, sin sombra), Manrope 700 en label o caption, radio sticker, padding 4 · 8 px, contorno noche fino. Frecuente (menta / bosque), En riesgo (durazno claro / tostado; "Te extrañamos" como copy alterno en avisos al dueño) y Error (rosa claro / rojo). El colorido exacto del chip "Nuevo" que usa el PRD ("neutro"): **Por definir** en el design system.
- **Empty:** ícono de línea opcional, texto muted, título corto ("Aún no hay clientes") y CTA secondary o ghost `sm`.
- **Loading:** skeleton de bloques menta con borde hair, o "Cargando…", con `aria-busy="true"`.
- **Error:** franja o borde rojo, mensaje con palabra ("Error: no se pudo cargar") y botón "Reintentar".

### Tablas
Contenedor blanco lino, borde product 2 px, radio card, overflow oculto; flat en el panel. Encabezados en Manrope 700, label 11 px, mayúsculas, +0.12 em, gris noche. Celdas en UI 14 px, texto noche, cifras tabulares. Separadores hair entre filas. Columna de acciones a la derecha.
- **Densidad:** comfortable 12 · 16 px (por defecto) y compact 8 · 12 px.
- **Hover:** fondo menta suave (~40 %), sin sombra ni translate. **Selected:** menta + barra izquierda bosque de 3 a 4 px y `aria-selected`.
- **Sin zebra.** Sticky header opcional, solo si la tabla scrollea dentro de un panel.
- Empty, loading y error reemplazan el tbody con las mismas reglas que las cards.

### Formularios
Label visible en cada campo. Field groups con título Manrope 600 (o label muted) y separador hair opcional. Al enviar con errores, **resumen de validación** arriba (rosa claro, texto rojo, radio control, "Error: revisa N campos" con la lista) y cada campo con su error. **Actions bar** al final (sticky en paneles largos): a la derecha "Cancelar" (ghost o secondary) y el primary ("Guardar", "Agregar cliente"); a la izquierda "Eliminar" solo en edición.

### Patrones
- **Page header:** label opcional en mayúsculas, título Manrope 700 (lead o body), subtítulo muted y acciones a la derecha (un solo primary). Margen inferior de 24 px.
- **Toolbar de filtros:** fuera del borde de la tabla. Búsqueda (~240 a 320 px), selects con "Todos" por defecto, "Limpiar" ghost solo con filtros activos y meta "N resultados". El "Agregar…" va en el page header, no aquí.
- **Dialog destructivo:** overlay noche al ~40 %, panel blanco lino con radio card, borde 2 px, sombra card, ancho ~400 a 440 px, padding 24 px. Título con el nombre ("¿Eliminar a {nombre}?"), body "Esta acción no se puede deshacer.", "Cancelar" ghost + "Eliminar" destructive. Trap de foco y Esc cancela.
- **Toast:** éxito menta / bosque con "Listo:", error rosa claro / rojo con "Error:". Radio control, borde noche, Manrope 500 a 600. Arriba a la derecha en desktop, abajo al centro en mobile; entrada con `duration.ui` (200 ms), sin rebote; máximo 2 o 3 apilados.
- **Empty page:** centrado, ~400 px de ancho, padding vertical de 48 a 64 px, título afirmativo, hint de una línea y CTA primary. Sin ilustración de marketing.
- **Paginación o "Cargar más":** uno por vista. Numérica en tablas densas de desktop (página actual en bosque / lino); "Cargar más" en listados móviles, con caption de progreso.

### Movimiento
`duration.fast` 150 ms (panel, hover), `duration.ui` 200 ms (transiciones), `duration.arc` 600 ms (el aro que se dibuja, rango 500 a 700 ms), `easing.standard` `cubic-bezier(0.2, 0.8, 0.2, 1)`. El aro se pasa 3 a 4 % y regresa con un solo rebote; al completarse hace un pulso de 4 % y cambia a durazno. Sin confeti, parallax ni loops. Con `prefers-reduced-motion` se muestra solo el estado final.

## Do's and Don'ts

### Do
- Do sentirte premium y serio: rigor de jerarquía como Stripe, densidad tranquila y transiciones cortas como Linear, estados terminados (vacío, carga, error) como Clerk, pocas palabras y mucho aire como Resend, retícula precisa como Vercel, gráfica plana con carácter como Ramp, calma premium como Mercury. Nivel de referencia, nunca copia.
- Do usar lino de fondo, blanco lino de superficie y noche para texto, contornos y sombras.
- Do usar bosque con texto lino para el primario de producto y reservar el durazno para la recompensa completada.
- Do decir cada estado con color y palabra (Frecuente, En riesgo, Error, Listo).
- Do usar Manrope en toda la interfaz del panel, y Archivo 800 condensada solo en titulares de 24 px o más y stickers.
- Do mantener el panel plano: sombra solo en el primary, dialogs y contenedores con relieve.
- Do respetar contraste AA, el anillo de foco menta y objetivos táctiles de 44 px o más.
- Do usar los tokens de `brand/04-design-system/tokens.css` tal cual.

### Don't
- Don't parecer el típico software de puntos y cupones para cafeterías ni una app de sellos con plantilla (mascotas, emojis, brochazos).
- Don't hacer que la identidad gire alrededor de una tarjeta: nada de tarjetas de plástico, tarjetas de sellos o de puntos como imagen, ni hileras de aros iguales.
- Don't copiar las identidades de referencia: ni degradados animados ni brillo (Stripe), ni modo oscuro como identidad (Linear), ni paleta morada (Clerk), ni monocromo extremo (Resend), ni blanco y negro puro (Vercel), ni verde lima (Ramp), ni aire de banca privada (Mercury).
- Don't usar negro puro, sombras con blur, degradados, 3D brillante ni efectos de luz.
- Don't usar durazno como fondo de marca, del logo, de cards, filas, toasts, dialogs, toolbars o empty states, ni como texto sobre lino.
- Don't poner texto noche sobre bosque ni menta sobre lino sin contorno noche.
- Don't usar Archivo en botones, labels, inputs, chips, tablas, cifras, dialogs, toasts ni títulos de página del panel.
- Don't comunicar estados solo con color o solo con ícono.
- Don't confirmar un borrado con el primary bosque ni usar el rojo en marketing.
- Don't rotar stickers ni ponerles sombra dentro del producto, ni usar más de dos por pieza.
- Don't inventar hexes, radios o espaciados fuera de la escala.
