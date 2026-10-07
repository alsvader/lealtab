# LealTab: cards y estados (Fase 4 · pieza 3)

Para aprobación de Aarón López Sosa · 6 de octubre de 2026

Pieza corta: superficies de contenido (card) + chips de estado + estados vacíos/carga/error de la card. Usa **únicamente** tokens aprobados en `01-tokens.md` / `tokens.css` y el chrome de controles de `02-botones-y-campos.md`. **No** incluye tablas ni layouts de formularios completos.

Preview: [`preview-cards-estados.html`](./preview-cards-estados.html) · capturas: `preview-cards.png`, `preview-estados.png`

---

## 1. Card — anatomía

```
┌─────────────────────────────────────────┐
│  Header                                  │  ← título + acción opcional / chip
│  ─────────────────────────────────────── │  ← separador hair (opcional)
│  Body                                    │  ← contenido principal
│                                          │
│  ─────────────────────────────────────── │  ← separador hair (opcional)
│  Footer                                  │  ← meta / CTAs secundarios
└─────────────────────────────────────────┘
```

| Zona | Tipografía | Contenido típico |
|---|---|---|
| **Header** | Manrope 600–700 · `font.size.ui` o título corto en `font.size.body` / `lead` | Título, chip de estado, acción ghost (⋯ o “Ver”) |
| **Body** | Manrope 400–500 · `font.size.body` / `ui` · cifras con `size.stat` + tabular | Texto, dato, lista corta, vacío / loading / error |
| **Footer** | Manrope 500 · `font.size.caption` o `ui` | Metadato (“Hace 2 h”), botón secondary/ghost `sm` |

**Chrome base (Ciclo v2):** fondo `color.surface` (blanco lino) sobre `color.bg` (lino) · texto noche · `radius.card` **14 px** · `border.product` **2 px** noche · padding `space.4`–`space.5` · tipografía **solo Manrope** (sin Archivo dentro de la card de producto).

Separadores internos: `border.hair` 1.5 px noche. Header y footer son **opcionales**; una card puede ser solo body (p. ej. dato grande).

---

## 2. Variantes

| Variante | Borde | Sombra | Uso |
|---|---|---|---|
| **Default** | `border.product` 2 px | `shadow.card` 5 px | Cards sueltas en producto / paneles con relieve |
| **Elevated** | `border.product` 2 px (o `product-strong` 2.5 en foco) | `shadow.card` 5 px | Misma cromática que default; nombre semántico cuando la card es el foco de la vista (modal ligero, detalle) |
| **Flat / dashboard** | `border.product` 2 px o `hair` 1.5 px | **Ninguna** | Densidad del dashboard: más minimal; sombra solo en contenedor de página y botón primary |
| **Interactive** | Igual que default o flat según contexto | Según contexto | `role="button"` / enlace · hover: borde `product-strong` · focus-visible: `focus.ring` · active: translate `2px 2px` y sombra off si tenía sombra (presión suave, no tan agresiva como el botón) |

**Dashboard:** preferir **flat**. **Landing / marketing:** default o elevated con sombra. **Durazno no rellena** la card (ni como fondo de variante): solo acento pequeño (punto, borde de 4 px a la izquierda en un callout, o chip de recompensa).

---

## 3. Status badges / pills (chips)

Comunican estado de cliente o de sistema. **Siempre color + palabra.** En producto: **planos** (sin rotación ni `shadow.sticker`). Manrope 700 · `font.size.label` (11) o `caption` (12) · `radius.sticker` 6 px · padding `space.1` · `space.2` · contorno noche `hair` o `product` fino.

| Chip | Texto (palabra) | Color texto | Fondo | Tokens |
|---|---|---|---|---|
| Éxito | **Frecuente** | Bosque | Menta | `color.success` · `color.success-bg` |
| Riesgo | **En riesgo** | Tostado | Durazno claro | `color.risk` · `color.risk-bg` |
| Error | **Error** | Rojo | Rosa claro | `color.error` · `color.error-bg` |

Notas:

- Alternativa de copy de riesgo en voz de negocio: **“Te extrañamos”** (mismo par tostado / durazno claro). Propuesta: **“En riesgo”** en listados/dashboard; **“Te extrañamos”** en avisos al dueño. Ambos válidos; no inventar un tercer color.
- Stickers de marketing (“Nuevo”, “Casi premio”) siguen las reglas de Ciclo v2 (pueden rotar ±3–6° y llevar sombra); **esta pieza fija solo los chips de estado funcional en producto**, planos.
- **No** Archivo en chips. **No** chip solo con color o solo con ícono.

---

## 4. Estados de la card (empty / loading / error)

Cuando el body no tiene datos útiles, la card entra en uno de estos modos. Mantienen el chrome de la variante (default o flat); cambian el body.

| Estado | Visual | Copy / acción |
|---|---|---|
| **Empty** | Ícono de línea discreto (opcional) + texto muted · sin relleno durazno | Título corto (“Aún no hay clientes”) · hint caption · CTA secondary o ghost `sm` (“Agregar cliente”) |
| **Loading** | Placeholder de bloques (skeleton) en menta con borde hair, o texto “Cargando…” · `aria-busy="true"` | Sin CTA clicable · duración visual con `duration.ui` / `fast` |
| **Error** | Borde o franja con `color.error` · mensaje en rojo **con palabra** (“Error: no se pudo cargar”) | Botón secondary/ghost “Reintentar” · nunca solo el rojo |

El skeleton usa menta / blanco lino (apoyo), no durazno ni bosque como relleno de bloque.

---

## 5. Do’s / don’ts

**Sí**
- Surface blanco lino sobre fondo lino; radio 14; sombra dura 5 px cuando hay relieve.
- Manrope en toda la card y en chips.
- Estado = color funcional **+** palabra (`Frecuente`, `En riesgo` / `Te extrañamos`, `Error`).
- Dashboard: cards flat; stickers/chips planos.
- Empty / loading / error tipados, con acción clara cuando aplica.

**No**
- Archivo dentro de chips o labels de card de producto.
- Durazno como fill de la card.
- Negro puro, blur en sombras, degradados de superficie.
- Comunicar riesgo/éxito/error solo con color o solo con ícono.
- Stickers rotados o con sombra dentro del dashboard.
- Meter tablas o formularios completos dentro de esta especificación (piezas siguientes).

---

## Qué aprobar / ajustar

1. **Anatomía** header / body / footer (¿separadores hair ok?).
2. **Variantes** default · elevated · flat/dashboard · interactive (¿elevated = default con nombre semántico, o querés otro tratamiento?).
3. **Dashboard flat** sin sombra — ¿cierra con Ciclo v2?
4. **Chips:** palabras **Frecuente** / **En riesgo** (+ “Te extrañamos” como alt) / **Error**; planos en producto.
5. **Estados de card** empty · loading (skeleton) · error con palabra + Reintentar.
6. **Interactive:** presión `2px` (más suave que el botón `4px`) — ¿ok?

Si algo no te late (sobre todo elevated vs default, o el copy “En riesgo” vs solo “Te extrañamos”), dímelo y lo cerramos antes de tablas/formularios.


---

**Estado:** 🟡 Pendiente de aprobación · 6 de octubre de 2026.


---

**Estado:** ✅ Aprobado por Aarón López Sosa · 6 de octubre de 2026.
