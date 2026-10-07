# LealTab: botones y campos (Fase 4 · pieza 2)

Para aprobación de Aarón López Sosa · 6 de octubre de 2026

Pieza corta: solo los controles interactivos base (botón + campo). Usa **únicamente** tokens aprobados en `01-tokens.md` / `tokens.css`. No incluye tarjetas, tablas ni layouts de formularios completos.

Preview: [`preview-botones-campos.html`](./preview-botones-campos.html)

---

## 1. Botón

**Chrome común (todas las variantes con sombra):** Manrope 600 · `radius.control` 10 px · `border.product` 2 px noche · `shadow.button` 4 px · tipografía `font.size.ui` (sm/md) o `font.size.body` (lg).

**Presión (Ciclo v2):** al `:active` / pressed el botón se desplaza `4px` abajo-derecha y la sombra desaparece (`box-shadow: none`). Transición `duration.fast` + `easing.standard`.

### Variantes

| Variante | Fondo | Texto | Contorno | Sombra | Uso |
|---|---|---|---|---|---|
| **Primary** | Bosque | Lino | Noche | Sí | Acción principal de producto |
| **Secondary** | Blanco lino | Noche | Noche | Sí | Acción secundaria |
| **Ghost / tertiary** | Transparente | Noche | Noche (hair o product) | No | Acciones terciarias; dashboard |
| **Destructive** | Error (rojo) | Lino | Noche | Sí | Borrar / acción irreversible |
| **Disabled** | Menta | Gris noche | Noche (opacidad ↓) | No | No interactivo |

**Marketing CTA (fuera de producto):** fondo Durazno + texto Noche + contorno noche + sombra. **No** es el primario del dashboard; solo landing / redes / mostrador.

### Tamaños

| Size | Padding (y · x) | Fuente | Altura aprox. |
|---|---|---|---|
| `sm` | `space.2` · `space.3` (8 · 12) | `font.size.ui` 14 | ~32 px |
| `md` (default) | `space.3` · `space.4` (12 · 16) | `font.size.ui` 14 | ~40 px |
| `lg` | `space.4` · `space.5` (16 · 24) | `font.size.body` 16 | ~48 px |

### Estados

| Estado | Comportamiento |
|---|---|
| **Default** | Según variante |
| **Hover** | Primary: bosque un tono más denso visualmente vía overlay menta al 20 % *o* mantener plano y subir borde a `border.product-strong` (2.5 px). Propuesta: **borde 2.5 px** + cursor pointer (sin hex nuevos). |
| **Active / pressed** | Translate `4px 4px` · sombra off |
| **Focus visible** | Anillo `focus.ring` (halo menta 3 px) además del contorno noche — ver token nuevo abajo |
| **Disabled** | `pointer-events: none` · sin sombra · opacidad ~0.55 o fondo menta / texto gris noche |
| **Loading** | Mismo look que default + `aria-busy` · texto “Cargando…” · no acepta clic · (spinner completo llega en pieza posterior) |

**Dashboard:** sombra solo en contenedor y en el **botón primary**. Secondary y ghost pueden ir planos (sin sombra) en pantallas densas.

---

## 2. Campo (input)

**Chrome:** fondo `color.surface` (blanco lino) · texto noche · placeholder / hint en gris noche · Manrope · `radius.control` 10 px · `border.product` 2 px noche · padding `space.3` · `font.size.ui`.

### Anatomía

```
[ Label ]                    ← Manrope 600, size.ui o caption
[  Input / Textarea / Select ]
[ Hint o mensaje de error ]  ← caption; error en color.error + palabra
```

### Estados del control

| Estado | Visual |
|---|---|
| **Default** | Borde product 2 px noche |
| **Focus** | Borde `product-strong` 2.5 px + anillo `focus.ring` (menta) |
| **Error** | Borde `color.error` · fondo puede quedar surface · mensaje abajo en rojo **con palabra** (“Error: …”) |
| **Disabled** | Fondo menta o surface con opacidad · texto gris noche · sin foco |

Label siempre visible (no solo placeholder). Hint opcional en `color.text-muted`. Error nunca solo con color.

### Textarea y select

Misma cromática y radios que el input. Textarea: min-height ~`space.8` (64 px), resize vertical opcional. Select: flecha en noche (ícono de línea; set completo después); altura alineada a `md`.

---

## 3. Token nuevo (mínimo)

En `tokens.css` se agregó **un** token semántico para foco accesible (sin hex nuevos):

| Token | Valor | Uso |
|---|---|---|
| `focus.ring` / `--focus-ring` | `0 0 0 3px var(--color-menta)` | Halo de `:focus-visible` en botón y campo |

---

## 4. Do’s / don’ts

**Sí**
- Manrope en botones y campos.
- Primary de producto = bosque + lino.
- Contorno noche + sombra dura en botones con relieve.
- Al presionar, el botón “baja” a su sombra.
- Errores con color **y** palabra (“Error”, “Revisa este dato”).
- Label visible encima del campo.

**No**
- Archivo en botones, labels o inputs.
- Durazno como relleno del primary de producto (solo CTA de marketing).
- Negro puro, sombras con blur, degradados en controles.
- Comunicar error o riesgo solo con color.
- Stickers ni sombras decorativas dentro del control (stickers = pieza aparte).

---

## Qué aprobar / ajustar

1. **Variantes** primary / secondary / ghost / destructive / disabled (y el CTA marketing aparte).
2. **Tamaños** sm · md · lg y el mapeo a space + font.size.
3. **Presión** 4 px + sombra off (¿ok los tiempos `duration.fast`?).
4. **Focus ring** menta 3 px (¿o preferís solo borde noche más grueso?).
5. **Campo:** label + hint + error con palabra; textarea/select con el mismo chrome.
6. **Dashboard:** primary con sombra; secondary/ghost planos — ¿cierra?

Si algo no te late (sobre todo el halo menta o el destructive en rojo pleno), dímelo y lo ajustamos antes de la librería completa de componentes.


---

**Estado:** ✅ Aprobado por Aarón López Sosa · 6 de octubre de 2026.
