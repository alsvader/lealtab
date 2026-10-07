# LealTab: patrones de UI (Fase 4 · pieza 5)

Para aprobación de Aarón López Sosa · 6 de octubre de 2026

Última pieza de Fase 4: **patrones reutilizables de página** (no pantallas de dashboard completas — eso es Fase 6). Usa **únicamente** tokens de `01-tokens.md` / `tokens.css` y componentes de piezas 2–4. Cierra el design system de producto a nivel de composición corta.

Preview: [`preview-patrones.html`](./preview-patrones.html) · capturas: `preview-patrones-1.png`, `preview-patrones-2.png`

---

## 1. Page header + actions

Cabecera de una vista de producto (listado, detalle, configuración).

```
┌─────────────────────────────────────────────────────────────┐
│  [Label sección opcional]                                    │
│  Título de página                    [Ghost] [Secondary] [Primary] │
│  Subtítulo / meta muted (opcional)                           │
└─────────────────────────────────────────────────────────────┘
```

| Zona | Tipografía / chrome | Contenido |
|---|---|---|
| **Label** (opcional) | Manrope 700 · `size.label` · mayúsculas · muted | “CLIENTES”, “CONFIGURACIÓN” |
| **Título** | Manrope 700 · `font.size.lead` o `body` (producto) · **no Archivo** en dashboard | “Clientes”, “Editar cliente” |
| **Subtítulo** | Manrope 400–500 · `size.ui` o `caption` · muted | Conteo (“128 clientes”), breadcrumb corto |
| **Actions** | Botones pieza 2 · alineados a la derecha · gap `space.2`–`space.3` | Ghost/secondary + **un** primary |

Reglas:

- Gap vertical título↔subtítulo: `space.1`–`space.2`. Margen bajo el header: `space.5`.
- En mobile: título arriba; actions debajo a ancho completo o wrap (primary a la derecha / full-width si es la única CTA).
- Dashboard: primary con sombra; secondary/ghost **planos**.
- Máximo **un** primary por header. Destructive no vive aquí (va al dialog de confirmación).

---

## 2. Filters / toolbar (arriba de tablas)

Barra de filtros y búsqueda encima del contenedor de tabla (pieza 4).

```
┌─────────────────────────────────────────────────────────────┐
│  [🔍 Buscar…        ]  [Estado ▾]  [Periodo ▾]    [Limpiar]  │
│  12 resultados · filtros activos (chips opcionales)          │
└─────────────────────────────────────────────────────────────┘
│  TABLA …                                                     │
```

| Elemento | Chrome | Notas |
|---|---|---|
| **Search** | Input pieza 2 · ancho ~240–320 px desktop · crece en mobile | Placeholder concreto (“Buscar por nombre o tel”) · label accesible (visible o `aria-label`) |
| **Select / filtro** | Select pieza 2 · `sm` o `md` | Opciones con valor “Todos” default |
| **Limpiar** | Ghost `sm` plano | Solo visible si hay filtros activos |
| **Meta** | Caption muted | “N resultados” · opcional chips de filtro activo (planos, con ×) |
| **Layout** | Flex wrap · gap `space.3` · padding bajo `space.4` | Toolbar **fuera** del borde de la tabla (no dentro del thead) |

Do: Manrope; bordes noche; sin durazno de fondo. Don’t: meter el primary “Agregar…” en la toolbar (ese va en el page header).

---

## 3. Confirmation dialog (destructivo)

Modal corto para acciones irreversibles (eliminar cliente, borrar programa).

```
        ┌──────────────────────────────────┐
        │  ¿Eliminar a María González?     │  ← título Manrope 700 body/lead
        │                                  │
        │  Esta acción no se puede         │  ← body muted
        │  deshacer. Se pierden visitas    │
        │  y el historial del cliente.     │
        │                                  │
        │        [Cancelar]  [Eliminar]    │  ← ghost + destructive
        └──────────────────────────────────┘
              ▲ overlay noche ~40 %
```

| Pieza | Spec |
|---|---|
| **Overlay** | Noche al ~40 % opacidad · click en overlay = cancelar (salvo proceso en curso) |
| **Panel** | Surface · `radius.card` 14 · `border.product` 2 · `shadow.card` 5 · max-width ~400–440 px · padding `space.5` |
| **Título** | Pregunta clara con el nombre del objeto · Manrope 700 · sin Archivo |
| **Body** | Consecuencia en 1–2 líneas · muted · **palabra** si hay riesgo (“no se puede deshacer”) |
| **Actions** | Derecha: ghost/secondary “Cancelar” · **Destructive** “Eliminar” (pieza 2) · gap `space.2` |
| **Foco** | Trap de foco · Esc = Cancelar · focus-visible con `focus.ring` |
| **No** | No primary bosque para confirmar borrado · no solo ícono rojo sin copy |

Propuesta de copy default: título “¿Eliminar a {nombre}?” · body “Esta acción no se puede deshacer.” · CTA “Eliminar”.

---

## 4. Toast / snackbar (éxito y error)

Feedback temporal tras una acción. **Siempre color + palabra.**

| Tipo | Fondo | Texto | Palabra | Duración propuesta |
|---|---|---|---|---|
| **Éxito** | `color.success-bg` (menta) | `color.success` (bosque) | **“Listo:”** o **“Éxito:”** + mensaje | ~4 s · dismiss manual con × |
| **Error** | `color.error-bg` (rosa claro) | `color.error` (rojo) | **“Error:”** + mensaje | ~6 s o hasta dismiss · opcional “Reintentar” |

Chrome común:

- `radius.control` 10 · borde `hair` o `product` noche · padding `space.3` · `space.4`
- Manrope 500–600 · `size.ui`
- Posición: **abajo-centro** o **arriba-derecha** del content (no sobre el sidebar). Propuesta: **abajo-centro** en mobile; **arriba-derecha** en desktop.
- Entrada/salida: `duration.ui` + `easing.standard` (slide + fade corto). Sin bounce.
- Apilar máx. 2–3; el más nuevo arriba (desktop) o abajo (mobile).
- **No** toast de “riesgo / Te extrañamos” como snackbar genérico (eso es chip o aviso en página). **No** durazno de fondo.

Ejemplos: `Listo: cliente guardado` · `Error: no se pudo eliminar`.

---

## 5. Empty page

Cuando la **vista completa** no tiene datos (distinto del empty de card/tabla en piezas 3–4).

```
┌─────────────────────────────────────────┐
│                                         │
│         (ícono línea opcional)          │
│         Aún no hay clientes             │  ← Manrope 700 · body/lead
│         Agrega el primero para          │  ← muted · ui/caption
│         empezar a registrar visitas.    │
│              [Agregar cliente]          │  ← primary md
│                                         │
└─────────────────────────────────────────┘
```

| Regla | Detalle |
|---|---|
| Contenedor | Centrado en el content · max-width ~400 px · padding vertical `space.7`–`space.8` |
| Copy | Título afirmativo corto · hint de 1 línea · CTA primary alineada al page header (“Agregar…”) |
| Visual | Ícono de línea noche opcional · **sin** ilustración marketing ni fill durazno |
| Relación | Si hay toolbar/tabla vacía, preferir **empty de tabla** (pieza 4). Empty **page** cuando no hay chrome de tabla aún (primera visita / onboarding corto) |

---

## 6. Paginación · “Cargar más”

Dos patrones válidos; elegir **uno por vista** (no mezclar).

### A · Paginación numérica

```
← Anterior    1  2  3  …  12    Siguiente →
```

- Controles ghost/flat `sm` · página actual: bosque + texto lino **o** menta + texto bosque + borde noche (propuesta: **bosque / lino** como “selected”)
- Meta caption a la izquierda opcional: “Mostrando 1–20 de 128”
- Gap `space.2` · Manrope · tabular-nums en números

### B · Cargar más (propuesta default para listados móviles / feeds)

```
            [Cargar más]
         20 de 128 clientes
```

- Botón secondary o ghost `md` plano · centrado bajo la tabla
- Caption muted con progreso
- Loading del botón: `aria-busy` + “Cargando…” (pieza 2)
- Al agotar: ocultar botón · caption “128 de 128 clientes”

**Propuesta:** listados de clientes/visitas en mobile → **Cargar más**; tablas densas desktop con muchas páginas → **paginación**. Documentar ambos; implementar el que encaje por vista en Fase 6.

---

## 7. Nav shell (nota de alto nivel)

Solo el **esqueleto**, no pantallas de dashboard (Fase 6).

```
┌──────────┬──────────────────────────────────────┐
│ SIDEBAR  │  CONTENT                             │
│  logo    │  page header + actions               │
│  nav     │  toolbar / filtros                   │
│  …       │  tabla / form / empty                │
│  cuenta  │  paginación                          │
└──────────┴──────────────────────────────────────┘
```

| Zona | Spec corto |
|---|---|
| **Sidebar** | Fondo bosque **o** surface con borde derecho noche · ancho ~220–260 px desktop · items Manrope 500–600 `size.ui` · activo: menta + texto bosque **o** lino sobre bosque según fondo · **colapsable** a íconos en tablet |
| **Content** | Fondo lino · padding `space.5`–`space.6` · max-width del contenido según retícula (pieza 1) |
| **Mobile** | Sidebar → drawer / bottom nav (decidir en Fase 6) · content a ancho completo |
| **Fuera de alcance** | Widgets, gráficas, home del dueño, tarjeta PWA — Fase 6 |

No se aprueban aquí layouts de dashboard ni IA de navegación; solo el principio **sidebar + content** con tokens ya cerrados.

---

## 8. Do’s / don’ts

**Sí**
- Un primary por page header; destructive solo en dialog de confirmación.
- Toasts y dialogs con **palabra** (`Listo:`, `Error:`, “no se puede deshacer”).
- Toolbar de filtros **fuera** de la tabla; empty page centrado con CTA clara.
- Manrope en todo el producto; sombra solo en primary, dialog y (si aplica) contenedores con relieve.
- Nav shell: sidebar + content; detalle de pantallas en Fase 6.

**No**
- Archivo en títulos de página de dashboard, dialogs o toasts.
- Durazno como fondo de toast, dialog, toolbar o empty.
- Confirmar borrado con botón primary bosque.
- Comunicar éxito/error solo con color o solo con ícono.
- Diseñar aquí el dashboard completo, top nav marketing o tarjeta cliente.

---

## Qué aprobar / ajustar

1. **Page header:** label uppercase opcional + título Manrope + actions (1 primary) — ¿ok?
2. **Toolbar** de filtros fuera de la tabla · Limpiar ghost solo si hay filtros — ¿cierra?
3. **Dialog destructivo:** overlay noche 40 % · Cancelar ghost + Eliminar destructive · copy “¿Eliminar a {nombre}?”
4. **Toast:** éxito menta/bosque con “Listo:” · error rosa/rojo con “Error:” · posición arriba-derecha desktop / abajo-centro mobile
5. **Empty page** vs empty de tabla — ¿la distinción te late?
6. **Cargar más** como default mobile · paginación numérica en tablas densas desktop — ¿o solo uno de los dos por ahora?
7. **Nav shell** solo como nota (sidebar + content) — sin pantallas Fase 6

Si algo no te late (sobre todo posición del toast, o “Listo:” vs “Éxito:”, o cargar más vs paginación), dímelo y cerramos Fase 4.

---

**Estado:** 🟡 Pendiente de aprobación · 6 de octubre de 2026.


---

**Estado:** ✅ Aprobado por Aarón López Sosa · 6 de octubre de 2026.
