# LealTab: tablas y formularios (Fase 4 · pieza 4)

Para aprobación de Aarón López Sosa · 6 de octubre de 2026

Pieza corta: patrones de **tabla** (listados de clientes / visitas) y **formulario** (alta/edición). Usa **únicamente** tokens de `01-tokens.md` / `tokens.css`, controles de `02-botones-y-campos.md` y chips/estados de `03-cards-y-estados.md`. **No** incluye un dashboard completo ni navegación de página.

Preview: [`preview-tablas-formularios.html`](./preview-tablas-formularios.html) · capturas: `preview-tablas.png`, `preview-formularios.png`

---

## 1. Tabla — anatomía

```
┌──────────────────────────────────────────────────────────┐
│  THEAD (sticky opcional)                                  │
│  CLIENTE │ VISITAS │ ÚLTIMA │ ESTADO │ ACCIONES           │  ← labels UPPERCASE size.label
├──────────────────────────────────────────────────────────┤
│  row                                                      │
│  row · hover                                              │
│  row · selected                                           │
├──────────────────────────────────────────────────────────┤
│  empty / loading / error  (reemplaza el tbody)            │
└──────────────────────────────────────────────────────────┘
```

| Zona | Tipografía / chrome | Contenido típico |
|---|---|---|
| **Header (`th`)** | Manrope 700 · `font.size.label` 11 · **mayúsculas** · tracking `0.12em` · color `text-muted` | Etiquetas de columna |
| **Celda (`td`)** | Manrope 400–500 · `font.size.ui` 14 · texto noche · cifras `tabular-nums` | Nombre, dato, fecha, chip, acción ghost `sm` |
| **Contenedor** | Surface blanco lino · `border.product` 2 px noche · `radius.card` 14 px · overflow hidden | En dashboard: **flat** (sin sombra). Fuera: puede llevar `shadow.card` |
| **Separadores** | `border.hair` 1.5 px noche entre filas; header con borde inferior `product` o hair | — |

**Sticky header (opcional):** `position: sticky; top: 0` en `thead th` · fondo `color.surface` · z-index local · borde inferior `product`. Solo cuando la tabla scrollea dentro de un panel; no es default obligatorio.

Columnas de acción a la derecha; chips de estado usan las palabras aprobadas (`Frecuente`, `En riesgo`, `Error`) — nunca solo color.

---

## 2. Filas — hover, selected, densidades

| Estado / densidad | Visual | Uso |
|---|---|---|
| **Default** | Fondo surface | — |
| **Hover** | Fondo menta al ~40 % *o* menta plena suave vía `color.support` con opacidad · cursor default/pointer si la fila es clicable · transición `duration.fast` | Feedback ligero; **sin** sombra ni translate |
| **Selected** | Fondo menta (`color.support`) · borde izquierdo 3–4 px bosque *o* outline interno hair · `aria-selected="true"` | Selección de fila / bulk |
| **Focus visible (fila)** | `focus.ring` en la fila o en el control dentro | Teclado |
| **Comfortable (default)** | Padding celda `space.3` · `space.4` (12 · 16) | Listados generales |
| **Compact** | Padding `space.2` · `space.3` (8 · 12) · misma tipografía | Dashboard denso |

Propuesta: **hover = fondo menta suave**; **selected = menta + barra izquierda bosque**. Sin hex nuevos.

---

## 3. Tabla — empty / loading / error

Sustituyen el `tbody` (o ocupan una fila `colspan`). Mantienen el chrome del contenedor.

| Estado | Visual | Copy / acción |
|---|---|---|
| **Empty** | Texto muted centrado · ícono de línea opcional | “Aún no hay clientes” · hint caption · CTA secondary/ghost `sm` (“Agregar cliente”) |
| **Loading** | Skeleton de filas (bloques menta + borde hair) o “Cargando…” · `aria-busy="true"` | Sin CTA clicable |
| **Error** | Mensaje en `color.error` **con palabra** (“Error: no se pudo cargar la lista”) | Botón ghost/secondary “Reintentar” |

Igual que cards: skeleton en menta/surface, no durazno ni bosque como fill de bloque.

---

## 4. Formulario — layouts

### Stack (default · mobile y formularios cortos)

```
[ Label ]
[ Campo ]
[ Hint / error ]

[ Label ]
[ Campo ]
…
[ Actions bar ]
```

Gap entre campos: `space.4`–`space.5`. Ancho máximo del stack ~480–560 px en desktop (no estirar un solo campo a todo el viewport).

### 2 columnas (desktop)

Grid 2 cols · gutter `space.5` (24). Campos anchos (textarea, select largo, dirección) hacen **span 2**. En mobile (< ~720 px) colapsa a 1 col.

### Field groups

Agrupar campos relacionados bajo un título de grupo:

- Título de grupo: Manrope 600 · `font.size.ui` o label uppercase `size.label` muted
- Separador hair opcional debajo del título
- Gap interno `space.4`; entre grupos `space.5`–`space.6`

Ejemplo: “Datos del cliente” · “Preferencias de visita”.

---

## 5. Validación y barra de acciones

### Resumen de validación (arriba del form o del grupo)

Cuando hay ≥1 error al enviar:

```
┌─────────────────────────────────────────────┐
│  Error: revisa 2 campos                     │  ← fondo error-bg · texto error · palabra
│  · Nombre es obligatorio                    │
│  · Teléfono no es válido                    │
└─────────────────────────────────────────────┘
```

- Fondo `color.error-bg` · texto `color.error` · borde hair/product noche · `radius.control` 10 · padding `space.3`–`space.4`
- Cada campo en error mantiene el chrome de pieza 2 (borde rojo + mensaje con palabra debajo)
- **Nunca** solo color: siempre la palabra “Error” (o “Revisa…”)

### Actions bar

Fija al final del form (o sticky bottom en paneles largos):

| Posición | Controles |
|---|---|
| Derecha (LTR producto) | Ghost/secondary “Cancelar” · **Primary** “Guardar” / “Agregar cliente” |
| Izquierda (opcional) | Destructive ghost/text “Eliminar” solo en edición |

Botones según pieza 2: primary con sombra; en dashboard secondary/ghost planos. Tamaño `md` default; `sm` si el form vive dentro de un drawer denso.

---

## 6. Do’s / don’ts

**Sí**
- Headers de tabla en Manrope 700 · `size.label` · mayúsculas.
- Chips de estado con palabra (`Frecuente`, `En riesgo`, `Error`).
- Tabla flat en dashboard; Manrope en toda la UI de tabla/form.
- Label visible encima de cada campo; resumen de errores con palabra.
- Actions: Cancelar (ghost/secondary) + Guardar (primary).
- Cifras con `tabular-nums`.

**No**
- Archivo en headers de tabla, labels de form o chips.
- Durazno como fondo de fila, header o form.
- Negro puro, blur, zebra stripes fuertes (si hay zebra, que sea menta casi imperceptible — propuesta: **sin zebra**, solo hover/selected).
- Comunicar estado o error solo con color.
- Dashboard completo / sidebar / top nav en esta pieza.
- Meter marketing CTA (durazno) como primary de un form de producto.

---

## Qué aprobar / ajustar

1. **Headers** uppercase `size.label` + tracking — ¿ok?
2. **Hover / selected:** menta suave · selected con barra bosque — ¿o preferís solo fondo sin barra?
3. **Densidades** comfortable vs compact — ¿ambas, o solo comfortable por ahora?
4. **Sticky header** opcional — ¿sí como patrón documentado?
5. **Form 2-col** en desktop con span-2 para campos anchos — ¿cierra?
6. **Validation summary** arriba + mensajes por campo — ¿ok el tono “Error: revisa N campos”?
7. **Actions bar:** Cancelar ghost + Guardar primary a la derecha — ¿Eliminar a la izquierda en edición?
8. **Sin zebra** (solo hover/selected) — ¿confirmás?

Si algo no te late (sobre todo selected con barra, o sticky), dímelo y lo cerramos antes de patrones de página / dashboard.

---

**Estado:** 🟡 Pendiente de aprobación · 6 de octubre de 2026.


---

**Estado:** ✅ Aprobado por Aarón López Sosa · 6 de octubre de 2026.
