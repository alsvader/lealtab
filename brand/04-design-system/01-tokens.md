# LealTab: tokens de diseño (Fase 4 · pieza 1)

Para aprobación de Aarón López Sosa · 6 de octubre de 2026

Estos tokens cierran en código lo que ya aprobaste en paleta, tipografía y reglas de Ciclo v2. No inventan colores nuevos: solo nombran roles semánticos, cierran los estados funcionales que quedaron provisionales y fijan espacio, radio, borde, sombra y movimiento para que producto y marketing hablen el mismo idioma.

---

## 1. Color — primitivos

| Token | Hex | Uso |
|---|---|---|
| `color.lino` | #F3EFE6 | Fondo principal (~60 %) |
| `color.blanco-lino` | #FFFDF8 | Superficie de tarjetas, tablas y campos |
| `color.noche` | #0F2A22 | Texto, contornos y sombras (nunca negro puro) |
| `color.bosque` | #0F4D3A | Protagonista: bloques, botón primario de producto |
| `color.menta` | #CFE3D6 | Apoyo: estados, gráficas, fondos secundarios |
| `color.durazno` | #FF9F6E | Acento pequeño / recompensa completada |
| `color.gris-noche` | #4D635A | Texto secundario, etiquetas, metadatos |

## 2. Color — roles semánticos

| Rol | Token | Valor | Cuándo |
|---|---|---|---|
| Fondo de página | `color.bg` | Lino | Default de producto y marketing |
| Superficie | `color.surface` | Blanco lino | Tarjetas, paneles, inputs |
| Texto | `color.text` | Noche | Cuerpo y titulares |
| Texto secundario | `color.text-muted` | Gris noche | Metadatos, hints |
| Texto sobre bosque | `color.text-on-bosque` | Lino | Botón primario, bloques bosque |
| Borde / sombra | `color.border` · `color.shadow` | Noche | Contornos y sombras duras |
| Marca / primario | `color.brand` | Bosque | CTAs de producto, superficies de marca |
| Acento | `color.accent` | Durazno | Solo acento pequeño o “¡Recompensa lista!” |
| Apoyo | `color.support` | Menta | Fondos secundarios, “Casi premio” |

**Durazno** nunca es fondo de marca ni del logo. **Noche** sustituye siempre al negro puro.

## 3. Color — estados funcionales (cierre de provisionales)

Propuesta para **cerrar** lo que en Fase 3 quedó provisional:

| Estado | Texto | Fondo | Tokens | Contraste |
|---|---|---|---|---|
| Éxito / Frecuente | Bosque #0F4D3A | Menta #CFE3D6 | `color.success` · `color.success-bg` | 7.29:1 |
| Riesgo / Te extrañamos | Tostado #A8461A | Durazno claro #FFE6D8 | `color.risk` · `color.risk-bg` | 4.94:1 |
| Error | Rojo #B42318 | Rosa claro #FDECEA | `color.error` · `color.error-bg` | 5.75:1 |

- El rojo es **solo** para errores técnicos o de formulario; nunca marketing.
- El estado **nunca** se comunica solo con color: siempre va una palabra (`Frecuente`, `En riesgo`, `Error`).
- Tostado, Durazno claro, Rojo y Rosa claro entran al sistema **únicamente** como tokens de estado (no como colores de marca).

## 4. Tipografía

| Token | Familia | Pesos | Uso |
|---|---|---|---|
| `font.display` | Archivo (wdth 75), 800 | 800 (700 solo si hace falta) | Titulares ≥24 px y stickers |
| `font.body` | Manrope | 400 · 500 · 600 · 700 | UI, texto, cifras, etiquetas |
| Fallback | `Archivo, "Arial Narrow", sans-serif` · `Manrope, system-ui, sans-serif` | — | Web con `font-display: swap` |

### Escala (`font.size.*` / `font.line.*`)

| Nivel | Fuente | Tamaño | Interlineado | Token |
|---|---|---|---|---|
| Display | Archivo 800 | 96 | 0.9 | `size.display` |
| H1 | Archivo 800 | 64 | 0.92 | `size.h1` |
| H2 | Archivo 800 | 44 | 0.95 | `size.h2` |
| H3 | Archivo 800 | 32 | 1.0 | `size.h3` |
| H4 | Archivo 800 | 24 | 1.05 | `size.h4` |
| Lead | Manrope 500 | 20 | 1.5 | `size.lead` |
| Texto | Manrope 400 | 16 | 1.55 | `size.body` |
| Interfaz | Manrope 500 | 14 | 1.45 | `size.ui` |
| Pie | Manrope 600 | 12 | 1.4 | `size.caption` |
| Etiqueta | Manrope 700, mayúsculas, +0.12 em | 11 | 1.3 | `size.label` |
| Dato grande | Manrope 700, tabular, −0.02 em | 32 | 1.1 | `size.stat` |
| Sticker | Archivo 800, mayúsculas, +0.02 em | 11–15 | — | `size.sticker-sm` 11 · `size.sticker` 13 · `size.sticker-lg` 15 |

Reglas: Archivo solo ≥24 px o stickers; cifras siempre con `font-variant-numeric: tabular-nums`.

## 5. Espaciado (base 4 px)

`space.1` 4 · `space.2` 8 · `space.3` 12 · `space.4` 16 · `space.5` 24 · `space.6` 32 · `space.7` 48 · `space.8` 64

Usar múltiplos de esta escala en padding, gaps y márgenes. Evitar valores sueltos (p. ej. 5, 10, 18).

## 6. Radio, borde y sombra

### Radio

| Token | Valor | Uso |
|---|---|---|
| `radius.sticker` | 6 px | Stickers |
| `radius.control` | 10 px | Botón, campo |
| `radius.card` | 14 px | Tarjetas |
| `radius.container` | 24 px | Contenedores (o más) |
| `radius.full` | 9999 px | Solo aros / anillos |

### Borde (color noche)

| Token | Valor | Uso |
|---|---|---|
| `border.hair` | 1.5 px | Divisiones, separadores |
| `border.product` | 2 px | UI de producto (default) |
| `border.product-strong` | 2.5 px | Énfasis en producto |
| `border.marketing` | 3 px | Marketing, redes, mostrador |

### Sombra dura (sin blur, abajo-derecha, color noche)

| Token | Offset | Uso |
|---|---|---|
| `shadow.sticker` | 3 px 3 px 0 | Stickers (marketing; en producto van planos) |
| `shadow.button` | 4 px 4 px 0 | Botones |
| `shadow.card` | 5 px 5 px 0 | Tarjetas |
| `shadow.social` | 6 px 6 px 0 | Redes |
| `shadow.storefront` | 8 px 8 px 0 | Mostrador / piezas grandes |

Al presionar un botón, la sombra se “come”: el botón baja al offset de la sombra (animación de presión).

## 7. Movimiento (corto)

| Token | Valor | Uso |
|---|---|---|
| `duration.fast` | 150 ms | Dashboard, hover ligero |
| `duration.ui` | 200 ms | Transiciones de UI |
| `duration.arc` | 600 ms | Animación firma: arco que se dibuja (rango 500–700 ms) |
| `easing.standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Impulso final suave del arco / presión |

Dashboard: preferir `fast`/`ui`. Marketing y firma de marca: `arc`.

## 8. Retícula (nota corta)

- **Desktop:** 12 columnas · gutter **24 px** (`space.5`) · márgenes 24–48 px.
- **Mobile:** 4 columnas · gutter **16 px** (`space.4`) · márgenes 16 px.
- Un dato por pantalla cuando se pueda; la retícula ordena, no decora.

## 9. Contraste y uso (recordatorio)

- Texto noche sobre lino / blanco lino / menta → OK (AAA).
- Texto lino sobre bosque → OK. **No** texto noche sobre bosque.
- Durazno: acento pequeño o sticker de recompensa; **nunca** texto durazno sobre lino; **nunca** fondo de logo/marca.
- Menta sobre lino siempre con contorno noche (el contraste gráfico no llega a 3:1 sola).
- Gris noche solo para texto secundario (AA sobre lino / blanco lino).
- Estado = color **+** palabra.

---

## Qué aprobar / ajustar

1. **Cerrar** los colores funcionales (Tostado, Durazno claro, Rojo, Rosa claro) tal como están arriba.
2. **Espaciado** base 4 con la escala 4→64.
3. **Bordes** 1.5 / 2 / 2.5 / 3 y **sombras** 3 / 4 / 5 / 6 / 8 (sin blur).
4. **Radios** 6 / 10 / 14 / 24 / full.
5. **Movimiento:** 150 / 200 / 600 ms (arco en el centro del rango 500–700).
6. **Retícula** 12 / 4 con gutters 24 / 16.

Si algo no te late (sobre todo el tostado de riesgo o el 2.5 px de producto), dime el ajuste y lo cerramos antes de pasar a componentes.


---

**Estado:** ✅ Aprobado por Aarón López Sosa · 6 de octubre de 2026 (tarde, America/Mexico_City).
