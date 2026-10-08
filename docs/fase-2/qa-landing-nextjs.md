# QA de paridad · Landing v1.7 → Next.js (T6 + T7)

Fase 2 · 7 de octubre de 2026 · Rol: `lealtab-desarrollador` (QA) · PRD: `docs/fase-2/prd-landing-nextjs.md`

## 1. Resumen y veredicto

**Veredicto: APROBADA, con una corrección hecha durante el QA y pendientes que no dependen del código.**

- La página de `web/` es visualmente indistinguible de la v1.7 a 375, 768 y 1280 px. La altura total es idéntica en los tres anchos. Ninguna sección pasa de 0.04 % de píxeles distintos, y todo es antialiasing de glifos.
- El texto visible es idéntico, también el oculto (`textContent`), `alt`, `aria-label` y `title`.
- Las 549 cajas de elementos (posición, tamaño, fuente, tamaño, peso, interlineado, espaciado) coinciden a menos de 0.5 px en los tres anchos. Eso incluye la flecha "→" y confirma que Archivo y Manrope se renderizan de verdad (sin fallback).
- Encontré **un defecto real**: las filas de clientes de "Cómo funciona" (paso 3) no abrían el motivo del estado. Ya está corregido (sección 4).
- Lighthouse en producción: 95 de rendimiento y 100 en accesibilidad, buenas prácticas y SEO en móvil. En escritorio, 100 en las cuatro.
- Cero errores o warnings de consola (producción y `next dev`, con hidratación) y cero respuestas 4xx/5xx durante la carga y todas las interacciones.

Cómo se probó: `pnpm build && pnpm start -p 3110`, Chromium (Playwright 1.64) contra `web/` y contra la v1.7 por `file://`. Cada paso se hizo en las dos páginas y se comparó el DOM normalizado (clases sin hash, atributos, estilos en línea, texto, foco, scroll) más una captura de pantalla con diff de píxeles (pixelmatch, umbral 0.1). Los scripts quedaron fuera del repo (scratchpad de la sesión).

## 2. Resultados por criterio de aceptación (PRD §6)

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Visualmente indistinguible a 375, 768 y 1280 | **Cumple** | Sección 3. Máximo por sección 0.036 %. Cajas de los 549 elementos iguales. Hover (20 estados), hero con mouse y 70+ estados de interacción por ancho sin diferencias. |
| 2 | Texto visible idéntico | **Cumple** | Diff de `innerText` y de nodos de texto: vacío en 375 y 1280, con y sin `reduced-motion`. Atributos `alt`, `aria-label`, `title`: vacío. `<title>` igual. |
| 3 | Interacciones iguales, también por teclado; `reduced-motion` apaga lo mismo | **Cumple (tras T7)** | Sección 5. Con `reduce`: 0 animaciones y 0 transiciones en ambas. Sin `reduce`: 133 elementos animados, lista idéntica. Orden de foco y anillo idénticos (44 paradas en 1280, 40 en 375). |
| 4 | Build, lint, tsc sin errores; consola limpia; Lighthouse ≥ 95 (Accesibilidad, Buenas prácticas, SEO) | **Cumple** | `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan (también después de la corrección). Consola limpia. Lighthouse: sección 6. |
| 5 | No se modifica `brand/` ni los informes 01–03 | **Cumple** | `git status` sin cambios en `brand/`, informes 01–03 ni `docs/decisiones.md`. |

## 3. Diff de píxeles por sección

Captura de página completa tras forzar todas las apariciones (modo `reduce`; el modo con movimiento, tras scroll lento, da lo mismo). Se muestra el % de píxeles distintos por sección.

| Sección | 375 px | 768 px | 1280 px |
|---|---|---|---|
| Nav | 0.000 | 0.000 | 0.000 |
| Hero | 0.010 | 0.036 | 0.031 |
| Cómo funciona | 0.003 | 0.001 | 0.000 |
| La tarjeta | 0.001 | 0.001 | 0.001 |
| Para quién | 0.001 | 0.001 | 0.001 |
| Precios | 0.002 | 0.001 | 0.000 |
| Confianza | 0.003 | 0.002 | 0.004 |
| Lo que viene | 0.001 | 0.001 | 0.000 |
| Cierre + FAQ | 0.004 | 0.002 | 0.000 |
| Footer | 0.000 | 0.000 | 0.000 |

Altura de página (v1.7 = web): 12 662 px (375), 11 264 px (768), 9 087 px (1280).

Ninguna región pasa de 1 %. Investigué lo que no es cero:
- **Hero (≈300 px a 768 y 1280):** bordes de unas cuantas letras del titular (subpíxel). Es la diferencia entre la fuente estática de Google Fonts de la v1.7 y la variable de `next/font`. Es antialiasing; ver `zoom-hero-titulo-antialiasing.png`.
- **Resto (< 50 px por sección):** antialiasing de texto suelto.
- **Con movimiento, "1 de 3" en Cómo funciona (1280):** 0.017 %. La captura de página completa cambia el tamaño del viewport y vuelve a disparar el "rebote" de la cifra. En reposo y con captura por viewport, el elemento es idéntico (0 px).

## 4. Correcciones hechas (T7)

| # | Defecto | Causa | Archivo | Verificación |
|---|---|---|---|---|
| 1 | Al tocar una fila de la tabla "Clientes · últimos 30 días" (Cómo funciona, paso 3) no aparecía el motivo del estado ("Le falta 1 corte", etc.). En la v1.7 la fila se abre; tocarla otra vez la cierra y solo hay una abierta a la vez. | El manejador de clic de las filas (v1.7 líneas 2596-2603) no se portó. El CSS (`.is-open`) sí estaba. El PRD lo ubicaba en Roadmap, pero en la v1.7 la tabla vive en Cómo funciona. | `web/src/components/landing/HowItWorks.tsx` (estado `openRow`, `className` con `s["is-open"]` y `onClick` por fila). Sin cambios de copy, CSS ni diseño. | Antes: el snapshot del DOM difería en las filas 1, 2 y 3 (`tr.is-open` solo en la v1.7). Después de reconstruir: filas 1, 2, 2 otra vez y 3, en 375, 768 y 1280, con y sin `reduced-motion`: DOM y píxeles iguales. `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan. |

No hubo otras diferencias de paridad que corregir.

## 5. Interacciones probadas (v1.7 contra web, mismos pasos)

Todas coinciden (DOM normalizado, foco, scroll y píxeles) en 375, 768 y 1280, con y sin `reduced-motion`, salvo lo marcado en la sección 7.

- **Nav:** sección activa (`aria-current`) al recorrer las 8 secciones, clic en cada enlace y en el logo, CTA del menú (entra cuando sale el del hero, se prueba en 5 posiciones de scroll). Menú móvil: abrir, `aria-expanded`/`aria-label`, scroll bloqueado, foco al panel, Escape (devuelve el foco al botón), clic en un enlace, clic en el CTA, cambio de tamaño a 1280 (cierra) y regreso.
- **Cómo funciona:** stepper (3 pasos y regreso al 1, aro, "N de 3" con rebote), editor vivo (nombre, nombre vacío, recompensa, visitas con + / − hasta los límites 3 y 12, selector de color con clic y flechas ←→↑↓ con vuelta), filas de clientes (corregido).
- **La tarjeta:** selector de negocio con clic y flechas (con vuelta), "Suma una visita" hasta completar y "Empezar de nuevo" en los 3 negocios, "Mostrar/Ocultar mi código", código abierto y cambio de negocio, visita con código abierto, guía por SO con `?os=ios`, `?os=android`, `?os=windows` (sin etiqueta) y con user agent real de iPhone y de Android.
- **Para quién → La tarjeta ("Ver su tarjeta"):** en los 3 negocios, la tarjeta cambia al negocio correcto (`data-theme`, pestaña, textos), hace scroll y aplica `spotlight` a los ~450 ms. La trayectoria del scroll suave es idéntica cuadro por cuadro (muestreo con rAF) y la posición final es la misma. Captura: `cmp-spotlight-ver-su-tarjeta.png`.
- **Lo que viene:** el aviso voltea y vuelve con ratón y con Enter (`inert`, `aria-hidden`, `aria-expanded`, foco).
- **Precios y cierre:** el plan Negocio sube y queda fijo (`risen`), hover del plan, el aro del cierre se completa y cambia a durazno.
- **Teclado:** el primer Tab abre el "Saltar al contenido" (visible, mismo anillo). La secuencia de foco es idéntica a la v1.7. Anillo de foco: sombra de 3 px menta, igual en ambas.
- **Hero:** stickers que reaccionan al mouse (4 posiciones y salida del mouse) sin diferencias de estilos en línea ni de píxeles.

**Modos**
- `prefers-reduced-motion: reduce`: 0 animaciones y 0 transiciones en las dos páginas, `scroll-behavior` queda en `auto` en ambas, todo el contenido visible desde la carga. Captura de página completa igual que la v1.7 (tabla de la sección 3).
- **JavaScript deshabilitado:** el contenido es visible en `web/`, sin huecos. Diferencia con la v1.7 sin JS: en la v1.7 quedan invisibles (opacidad 0) los titulares `.reveal` y 1 párrafo de Lo que viene (7 elementos en total); en `web/` se ven. Es la corrección aprobada por el fundador. Por eso cada sección, salvo el hero, tiene ≈ 0.7–1.5 % de diff sin JS (solo el titular; ver `cmp-nojs-1280-para-quien.png`). Lo demás, incluidos los textos que se ocultan a propósito (motivo de cada fila, "¡Recompensa lista!", "Casi premio"), es igual.

**Consola y red:** cero errores y warnings en carga y durante todas las interacciones (producción). Además, una pasada con `next dev` (4 combinaciones de ancho, `?os=` y `reduced-motion`) no mostró avisos de hidratación. Cero 404 y las 11 imágenes cargan (`naturalWidth > 0`).

## 6. Lighthouse 13.5 (producción, Chrome headless)

| Perfil | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Móvil | 95 | 100 | 100 | 100 |
| Escritorio | 100 | 100 | 100 | 100 |

Móvil: FCP 1.1 s, LCP 3.0 s, TBT 20 ms, CLS 0. La meta (≥ 95 en las tres últimas) se cumple con holgura.
Observaciones, sin acción obligatoria (no cambian diseño ni copy):
- El LCP móvil es el logo del menú (`<img>`, sin `fetchpriority="high"`). Agregar ese atributo es un cambio de rendimiento sin efecto visual y deja el 95 con más margen, porque el valor oscila entre corridas. No lo apliqué: no es un criterio de paridad.
- Avisos informativos: JS sin usar (≈ 51 KiB), CSS que bloquea el render (≈ 200 ms en móvil simulado) y un polyfill heredado (≈ 13 KiB) de Next.
- Lighthouse 13.5 incluye una categoría nueva, "Agentic browsing" (50). No es de las metas del PRD y su único fallo es la auditoría experimental "Accessibility tree is not well-formed".

Reportes en HTML y JSON: en el scratchpad de la sesión (`t6/lh/`), no se versionan.

## 7. Diferencias aceptadas

Las aprobadas de antemano por el fundador (sin JS visible, `<head>`, `aria-hidden` de `#codeFace`, `tabindex`, `data-flipped`, `data-settle`, `data-seen`, preflight) se confirmaron tal cual. Además, estas diferencias menores de implementación no cambian lo que ve ni lo que hace el usuario:

- `data-hero-cta="true"` en el botón del hero (lo pide el PRD para el CTA del menú).
- `data-reveal="true"` en lugar de `data-reveal=""` en algunos bloques. Mismo efecto con el selector `[data-reveal]`.
- `stroke-dasharray="80.0 100"` frente a `"80 100"` en el aro de La tarjeta (render inicial). Mismo valor.
- La v1.7 deja la clase `swap` en el panel de La tarjeta después de la animación; en `web/` a veces se retira al terminar. La animación se reinicia bien al repetir el cambio de negocio (comparado por píxeles). Sin efecto visible.
- `<div hidden>` al inicio del `<body>` y `data-scroll-behavior="smooth"` / `next-size-adjust`: los inserta Next.
- El color de los `<button>` sin texto (hamburguesa, muestras de color) hereda el tinta del cuerpo en lugar del negro del navegador, por el preflight de Tailwind. No hay diferencia visible en ningún estado probado.
- `aria-hidden` de `#codeFace`: al cambiar de negocio con el código abierto, la v1.7 lo dejaba en `false` aunque el panel ya estaba cerrado; `web/` lo sincroniza con el estado (ya estaba aprobado).
- Capturas con animación en curso (hero a los 600 ms, aro del cierre, cuenta final de la tapioca) difieren unos milisegundos por el orden en que se ejecutan los pasos; en reposo son iguales.

## 8. Pendientes para el fundador

1. **Prueba manual en dispositivos reales (no se puede hacer aquí):** iPhone con Safari, Android con Chrome y los navegadores integrados de WhatsApp e Instagram. Revisar sobre todo: menú móvil a pantalla completa y bloqueo de scroll, scroll suave de "Ver su tarjeta", aviso que voltea (`inert`), guía por SO (aquí solo se simuló el user agent), fuentes y flechas "→", `100vh`/barras del navegador, y el foco táctil. Chromium no cubre WebKit ni los visores integrados.
2. **Decisión opcional de rendimiento:** `fetchpriority="high"` en el logo del menú para asegurar el 95+ móvil.
3. Pendientes que ya estaban en el PRD §7: URLs reales de aviso de privacidad, términos y WhatsApp (siguen en `#`), analítica y aviso de cookies, páginas legales y despliegue.

## 9. Archivos

- Corrección: `web/src/components/landing/HowItWorks.tsx`.
- Este informe: `docs/fase-2/qa-landing-nextjs.md`.
- Capturas en `docs/fase-2/qa-landing/` (izquierda v1.7, derecha `web/`; cuando hay un tercer panel es el diff, en rojo lo distinto):
  - `cmp-1280-hero.png`: hero a 1280 px.
  - `cmp-375-hero-showcase.png`: La tarjeta a 375 px, con diff.
  - `cmp-768-precios.png`: Precios a 768 px, con diff.
  - `cmp-spotlight-ver-su-tarjeta.png`: "Ver su tarjeta" (tapioca) con `spotlight`.
  - `cmp-nojs-1280-para-quien.png`: sin JavaScript (titular visible en `web/`, aprobado).
  - `zoom-hero-titulo-antialiasing.png`: ampliación 2× del único diferencial del hero.
  - `diff-pagina-375.png`, `diff-pagina-768.png`, `diff-pagina-1280.png`: diff de página completa (gris = igual, rojo = distinto).

---

# Ronda 2 · Navegadores, móvil, anchos extra, red lenta y accesibilidad

7 de octubre de 2026 · Rol: `lealtab-desarrollador` (QA) · Producción (`pnpm build && next start`) contra la v1.7 por `file://` (y por HTTP local solo en la prueba de red lenta).

## R2.1 Veredicto por motor

| Motor | Veredicto | Notas |
|---|---|---|
| **WebKit** (Safari 26.5, build de Playwright) | **Aprobado** | Máximo 0.073 % por sección (todo antialiasing del titular). 0 cajas distintas de 549. Funcional completo, también con toques (iPhone 13/SE). |
| **Firefox** 151 | **Aprobado tras una corrección** | Encontré un defecto real en el footer (R2.7). Corregido: 0 % en el footer y alturas iguales. Quedan 0.7 px de ancho en 5 titulares (ver R2.4). |
| **Chromium** 149 | **Aprobado** | Igual que la ronda 1 (máximo 0.044 %). |
| Móvil emulado (iPhone 13, iPhone SE, Pixel 7; WebKit y Chromium) | **Aprobado** | 56 pasos con toques: DOM idéntico a la v1.7 en cada paso. Sin scroll horizontal, salvo a 320 px (heredado, R2.8). |
| Accesibilidad (axe, 3 motores) | **Sin nada nuevo** | Solo 1 violación menor heredada de la v1.7. |

**Cómo se probó WebKit (el hueco de la ronda 1):** con Playwright, headless y headed. No hizo falta `safaridriver`.

- **Causa del cuelgue:** no es el sandbox ni el modo headless. Esta Mac es macOS 14.4 y Playwright usa ahí un WebKit congelado (revisión 2251, `webkit_mac14_arm64_special-2251`). Desde Playwright 1.62 el cliente le manda a WebKit el ajuste `Page.overrideSetting PushAPIEnabled`, que ese build no conoce (`Unknown setting: PushAPIEnabled`); la página se cierra con un comando que tampoco existe (`Playwright.closePage`) y `newPage()` espera para siempre. Se ve con `DEBUG=pw:protocol`.
- **Solución:** `@playwright/test` y `playwright-core` fijados en **1.61.1** (última versión sin ese ajuste). Con eso, `newPage()` tarda ~0.2 s, headless y headed. En macOS 15+ o Linux se puede subir (README).
- **Aparte, inofensivo:** `~/Library/WebKit` es de `root` (carpetas de EaseUS y Recoverit de dic. 2024), así que WebKit imprime avisos de "could not create directory" al arrancar. No impiden nada (los contextos son efímeros). Si el fundador quiere quitarlos: `sudo chown -R "$USER" ~/Library/WebKit`. Opcional.
- Safari real (`safaridriver`) no se usó. Para una prueba extra con el Safari instalado, el fundador tendría que correr `sudo safaridriver --enable` (pide administrador; no lo ejecuté).
- Límite del WebKit emulado: `navigator.maxTouchPoints` vale 0 aunque haya `hasTouch` (los toques sí funcionan). No afecta a la landing (la detección de iPad usa `platform`, y la de iPhone el user agent).

## R2.2 Diff de píxeles: anchos × motores

Página completa con `prefers-reduced-motion: reduce`, misma altura en los tres motores (web = v1.7 en cada uno). Cada celda es el **máximo por sección** en % de píxeles distintos (y la sección). Una corrida a la vez (en paralelo el Chromium a 375 subió a 0.3 % por contención de CPU; no es real).

| Ancho | Chromium | Firefox | WebKit |
|---|---|---|---|
| 320 | 0.011 (hero) | 0.003 (confianza) | 0.028 (hero) |
| 360 | 0.014 (hero) | 0.004 (cierre) | 0.061 (hero) |
| 375 | 0.013 (hero) | 0.004 (cierre) | 0.059 (hero) |
| 768 | 0.044 (hero) | 0.041 (hero) | 0.073 (hero) |
| 844×390 (celular horizontal) | 0.040 (hero) | 0.037 (hero) | 0.066 (hero) |
| 1024×768 (el menú cambia a escritorio) | 0.012 (hero) | 0.009 (hero) | 0.068 (hero) |
| 1280 | 0.039 (hero) | 0.025 (hero) | 0.003 (confianza) |
| 1440 | 0.025 (hero) | 0.029 (hero) | 0.027 (hero) |
| 1920 | 0.018 (hero) | 0.021 (hero) | 0.021 (hero) |

Alturas de página (v1.7 = web): 12 773 / 12 662 / 11 264 / 11 220 / 9 251 / 9 087 px en Chromium (360, 375, 768, 844, 1024, 1280); Firefox 1 px menos a 1280 (9 086), igual en los demás anchos, y WebKit 9 042 a 1280 (otro motor de texto). Hoy ninguna sección pasa de 0.073 %.

Por sección a 1280 (Chromium, Firefox, WebKit): hero 0.039, 0.025, 0.001; confianza 0.004, 0.004, 0.003; todas las demás ≤ 0.002.

**Qué es lo que no es cero.** Todo es bordes de letras: la v1.7 usa las instancias estáticas de Google Fonts (Archivo ancho 75, pesos 700 y 800) y `web/` la fuente variable de `next/font`; el subpíxel de algunos glifos del titular cambia (en WebKit, el borde del tallo de una "i" al ampliar 4 veces; en Firefox y Chromium, unas decenas de píxeles). Las posiciones no se mueven.

**Cajas de elementos** (549 elementos: posición, tamaño, fuente, tamaño, peso, interlineado): Chromium y WebKit, 0 diferencias de más de 0.5 px en los 9 anchos. Firefox: 1 a 6 diferencias por ancho, todas de la misma causa y sin efecto visible: el `max-width` en `ch` de cinco titulares (`h2`) mide 0.7 px más en `web/` (probablemente la misma causa que en R2.7: Firefox mide `ch` con la cara estática en la v1.7 y con la variable en `web/`; la caja es 0.7 px más ancha y el texto no cambia de línea) y la caja del titular del footer (298 px frente a 314 px, mismo salto de línea; ver R2.7). Estilos: la diferencia aprobada del color de los `<button>` sin texto.

## R2.3 Móvil con toques

`mobile.mjs` (scratchpad): 56 pasos idénticos en la v1.7 y en `web/`, con `tap()` y perfil completo de Playwright (viewport, DPR, `isMobile`, `hasTouch`, user agent real): menú móvil (abrir, cerrar, enlace, CTA, `overflow: hidden`, foco), CTA del menú al hacer scroll, los 3 pasos de Cómo funciona, editor vivo (+, selector de color), filas de clientes, selector de negocio, "Suma una visita" hasta el premio y "Empezar de nuevo" (2 negocios), "Mostrar mi código", "Ver su tarjeta" (3 negocios, con el spotlight), aviso que voltea y la guía por SO sin `?os=`.

| Perfil | Motor | Pasos con DOM distinto | Scroll horizontal | Guía por SO (user agent real) |
|---|---|---|---|---|
| iPhone 13 (390×664, DPR 3) | WebKit | 0 de 56 | no | "Estás en iPhone", Android atenuado |
| iPhone 13 | Chromium | 4 de 56 (ver nota) | no | igual |
| iPhone SE (320×568) | WebKit | 0 de 56 | **sí, 353 px (heredado, R2.8)** | iPhone |
| iPhone SE | Chromium | 3 de 56 (ver nota) | sí, 353 px (heredado) | iPhone |
| Pixel 7 (412×839, DPR 2.625) | Chromium | 3 de 56 (ver nota) | no | "Estás en Android", iPhone atenuado |

Nota: las diferencias de Chromium son solo en los pasos que se capturan **a mitad del scroll suave** ("Ver su tarjeta" a 300 ms: `SCROLL 3938` contra `3975`, ±40 px de un recorrido que dura ~1.3 s) y una vez la clase `risen` del plan Negocio (se agrega unos cientos de ms después; el paso siguiente ya es igual). El recorrido del scroll de "Ver su tarjeta" es el mismo (161 cuadros en ambos). Con el scroll ya terminado, DOM idéntico. La combinación WebKit + user agent de Android no es real y se descartó.

En WebKit sin cabeza el scroll suave tiene pocos cuadros; por eso comparé el DOM sin las clases de aparición (`is-in`, `is-visible`), que dependen de cuántos cuadros vio el `IntersectionObserver` al pasar volando. Verifiqué que el destino queda igual: tras tocar "Precios" en el menú, el titular y el plan están visibles y con la misma posición en las dos páginas.

La suite e2e repite lo esencial con Mobile Safari (iPhone 13) y Mobile Chrome (Pixel 7) y aserciones.

## R2.4 Cobertura por motor de las interacciones

Las mismas 50 pruebas funcionales corren en 5 proyectos (R2.9). Pasaron todas en Chromium, Firefox, WebKit, Mobile Safari y Mobile Chrome: menú móvil y bloqueo de scroll, 1024 px, sección activa, CTA del menú, stepper, editor vivo, filas de clientes, selector (clic y flechas), sumar visitas hasta el premio en los 3 negocios, código que voltea, "Ver su tarjeta" con spotlight, aviso que voltea (`inert`/`aria`), plan Negocio, aro del cierre, guía por SO con `?os=` y con el user agent real, `reduced-motion`, sin JavaScript, y consola/red limpias en todas.

## R2.5 Red lenta y carga de fuentes (Chromium, CDP: 400 kbps, 400 ms de RTT, sin caché)

La v1.7 por `file://` no sirve para comparar (su HTML, CSS y JS no pasan por la red), así que serví `brand/` con un servidor HTTP local solo para esta prueba (ya detenido). Una corrida por viewport.

| | v1.7 (HTTP) 390 | web/ 390 | v1.7 (HTTP) 1280 | web/ 1280 |
|---|---|---|---|---|
| Primera pintura (FCP) | 2.16 s | **1.65 s** | 2.17 s | **1.66 s** |
| LCP | 4.68 s | **2.31 s** | 4.68 s | **2.25 s** |
| **CLS** | 0.0057 | **0** | 0.0245 | **0.0003** |

- El CLS de la v1.7 viene de la barra superior (el CTA que se oculta cuando entra el JS) y del texto del hero al pintar por partes. En `web/` el único corrimiento (0.0003, a 1280) es el cambio de fuente.
- **Fallback antes de las fuentes, igual que la v1.7.** Reteniendo los `woff2` 9 s (cuadro `10-...`): 0 píxeles de diferencia entre las dos páginas a 390 px, y la altura de página es la misma. Como se esperaba por `tokens.css`, el fallback es "Arial Narrow"/system-ui en las dos, no el "Fallback" ajustado de `next/font`.
- Altura de la página al cargar fuentes a 390 px: 12 662 (todo en fallback) → 12 686 (llega Manrope) → 12 613 px (llega Archivo). A 1280: 9 136 → 9 087. Mismo recorrido en la v1.7 y `web/`. El salto ocurre sobre todo debajo del primer pantallazo, por eso el CLS es ≈ 0.
- Recursos de `web/` a 400 kbps: Manrope (24 KB) llega a los 2.2 s, **Archivo latín (90 KB) a los 5.4 s**, porque comparte los 50 KB/s con el CSS (≈1.3-1.6 s) y los 6 archivos JS (hasta ≈6.9 s). Entre la primera pintura (1.7 s) y los 5.4 s el titular se ve en el fallback. La v1.7 baja 71 KB de Archivo (dos instancias estáticas de 36 KB) frente a los 90 KB de la variable.

**Opciones (no apliqué ninguna: la estrategia de fuentes no se toca), con su efecto en la paridad:**

1. **Dejar como está.** Paridad total del fallback y mejor CLS y FCP que la v1.7. Recomendada.
2. Usar el "Fallback" de `next/font` (`var(--font-archivo)`): cambia el aspecto previo a la carga (Arial normal en lugar de Arial Narrow, más ancho) y la altura previa. Rompe la paridad del fallback, y Turbopack 16.4 ignora `adjustFontFallback`.
3. Un `@font-face` propio con `size-adjust` y `ascent-override` sobre `local("Arial Narrow")` para acercar el fallback a Archivo: reduciría el salto de 12 662 → 12 613 px, pero cambia el aspecto del fallback.
4. `font-display: optional` en Archivo: sin cambio de fuente ni CLS, pero con red lenta el titular se quedaría en fallback. Cambia el resultado final con esa red.
5. Autoalojar las dos instancias estáticas de Archivo (ancho 75, 700 y 800, ≈ 71 KB) en lugar de la variable (90 KB): mismos píxeles que la v1.7, 19 KB menos. Cambia la estrategia de fuentes (PRD §3).

## R2.6 Accesibilidad automatizada (axe-core 4.13.0 con `@axe-core/playwright` 4.13)

La página en Chromium, Firefox y WebKit, y con el menú móvil abierto (390 px), en `web/` y en la v1.7.

- **Nuevo en `web/`:** nada. Las mismas reglas con los mismos nodos que la v1.7 en los 6 casos (3 motores × página y menú abierto).
- **Heredado de la v1.7** (también en `web/`): `aria-allowed-role` (menor), 1 nodo: `#bizcard` tiene `role="tabpanel"` en un elemento que no lo admite. Pendiente de diseño/markup (R2.10).
- `color-contrast` queda como "incompleta" (15 o 16 nodos, igual en las dos páginas: textos sobre fondos con gradiente o ilustraciones, axe no puede resolverlos). Revisar a ojo si se quiere certificar.
- La prueba `a11y.spec.ts` falla solo por reglas nuevas o con más nodos que en la v1.7.

## R2.7 Correcciones

| # | Defecto | Causa | Archivo | Verificación |
|---|---|---|---|---|
| 1 | **Firefox: el titular del footer ("Haz que tus clientes siempre regresen.") queda en 2 líneas en `web/` y en 3 en la v1.7**; el footer mide 29 a 42 px menos (2 a 3.9 % de píxeles distintos en el footer y 0.7 a 1 % de la página). Solo Firefox; Chromium y WebKit sin cambio. | `max-width: 15ch` más `font-variation-settings: "wdth" 75`. Firefox calcula `ch` sin aplicar `font-variation-settings`: en la v1.7 la fuente es una instancia estática de ancho 75 y `ch` sale angosto (≈ 314 px); en `web/` es la variable, con ancho 100 por defecto, y `ch` sale ≈ 20 % más ancho (378 px). | `web/src/components/landing/Footer.module.css`: se agregó `font-stretch: 75%` a `.footer-tagline` (lleva el ancho a `ch`; no cambia el dibujo porque `wdth 75` ya estaba aplicado). | Firefox 320, 360, 375, 768, 844, 1024, 1280, 1440 y 1920: altura igual a la v1.7 y footer en 0.000 % (antes 1.4 a 3.9 %). Chromium y WebKit: footer 0.000-0.001 %, cajas iguales. `pnpm lint`, `typecheck` y `build` pasan. Captura `09-...`. |

También: otros titulares con `ch` (Cómo funciona, Precios, Confianza, Para quién, FAQ, La tarjeta) no tienen el problema, porque llevan `font-stretch` o peso que elige bien la cara; solo difieren 0.7 px de ancho de caja en Firefox, sin cambio de salto de línea (R2.2).

## R2.8 Pendientes para el fundador (con comandos)

1. **Heredado de la v1.7, decisión de diseño: a 320 px (iPhone SE de primera generación, Android pequeños) la página se desplaza 33 px a los lados** (`scrollWidth` 353 con 320 de ancho). Causa: la barra superior (logo + CTA "Empieza gratis" + hamburguesa) pide 353 px. A 360 px en adelante no pasa. Es igual en la v1.7, por eso la suite lo trata como heredado (`layout.spec.ts`, anotación) y no lo cambié. Opciones: ocultar el CTA de la barra por debajo de ~350 px (queda en el menú), reducir su relleno, o `overflow-x: clip` en el `body` (esconde el síntoma, no la causa).
2. **Prueba manual en dispositivos reales (prioridad: ver R2.11):** sigue pendiente (iPhone con Safari, Android con Chrome, visores de WhatsApp e Instagram). Lo nuevo de esta ronda reduce el riesgo en el motor de Safari y en el tacto, pero no cubre barras del navegador (`100vh`), el teclado virtual ni los visores integrados.
3. **Playwright fijado en 1.61.1 por macOS 14.** Al pasar a macOS 15 o a CI en Linux: `pnpm add -D -E @playwright/test@latest playwright-core@latest && npx playwright install` y correr `pnpm test:e2e`.
4. **Opcional:** `sudo chown -R "$USER" ~/Library/WebKit` (quita los avisos de permisos de WebKit); `sudo safaridriver --enable` si se quiere una prueba con el Safari real instalado.
5. `aria-allowed-role` en `#bizcard` (heredado, menor): quitar `role="tabpanel"` o cambiar el elemento. Requiere decidir si el selector de negocio sigue siendo un `tablist` (cambia markup aprobado).
6. ~~Aparte: `brand/05-marketing/og/lealtab-og.html` y `lealtab-og-1200x630.png` aparecen modificados en `git status` con fecha de hoy 18:52.~~ **Resuelto:** es la nueva versión de la imagen OG (aro completo, "5/5 cortes" y "¡Recompensa lista!"), confirmada por el fundador. Se copió a `web/public/og/lealtab-og-1200x630.png` (mismo nombre y medidas; la metadata no cambia).
7. Fuentes (R2.5): decidir si se quiere alguna de las opciones 2 a 5. Mi recomendación es dejarlo como está.
8. Los pendientes de las rondas anteriores siguen (URLs reales, analítica, cookies, `fetchpriority="high"` en el logo).

## R2.9 Suite e2e repetible

Comando: `pnpm test:e2e` (build + start en el puerto 3120 por el `webServer`; en local reutiliza un servidor ya levantado, `E2E_PORT` lo cambia). Resultado de las dos últimas corridas completas: **203 pasaron, 47 omitidas con `test.skip`, 0 fallaron** (1.8 min con 3 workers; el build y el arranque los hace Playwright).

Archivos en `web/`:

- `playwright.config.ts`: proyectos `chromium`, `firefox`, `webkit`, `Mobile Safari` (iPhone 13), `Mobile Chrome` (Pixel 7).
- `e2e/fixtures.ts`: la v1.7 por `file://`, `press` (toque en táctil, clic en los demás), `openLanding` (espera fuentes e hidratación de React), y una guarda automática que falla la prueba con errores o avisos de consola, excepciones o respuestas 4xx/5xx.
- `e2e/nav.spec.ts`, `how-it-works.spec.ts`, `showcase.spec.ts`, `sections.spec.ts`, `os-guide.spec.ts`: las interacciones, con aserciones sobre DOM y estado (50 pruebas por proyecto, menos las omitidas).
- `e2e/copy-parity.spec.ts`: `innerText` normalizado igual que la v1.7, además del texto oculto a propósito, `alt`/`aria-label`/`title` y `<title>`.
- `e2e/layout.spec.ts`: anchos 320 a 1920 y 844×390; sin scroll horizontal y misma altura que la v1.7 (el desborde de 320 px se anota como heredado).
- `e2e/a11y.spec.ts`: axe en la página y con el menú abierto; falla por reglas nuevas respecto a la v1.7.
- `README.md` (sección "Pruebas e2e", con `npx playwright install` y notas por entorno), `package.json` (script `test:e2e`, `@playwright/test`, `playwright-core` y `@axe-core/playwright`) y `.gitignore` (`test-results/`, `playwright-report/`). Sin capturas de referencia en el repo.

**`test.skip` (47, todos por diseño; ninguno es por un motor que no corra):**

- **Proyectos de escritorio (3):** la prueba "Móvil (perfil del proyecto)" de `layout.spec.ts`, una por motor.
- **Mobile Safari y Mobile Chrome (22 cada uno):** los 10 anchos de `layout.spec.ts` (se fuerzan en escritorio; los móviles usan su propio perfil), 7 de `nav.spec.ts` (cambio de tamaño a escritorio, 1024 px, `aria-current` por scroll, enlaces de escritorio, CTA del menú de escritorio, Tab en "Saltar al contenido" y centrar sin scroll horizontal; no hay teclado ni ventana redimensionable en el perfil táctil), las flechas del selector de color, las flechas de las pestañas, Enter en el aviso, y los 2 user agent simulados de iPhone/Android (ya los cubre el user agent real del proyecto).
- El `Tab` hacia "Saltar al contenido" usa `Alt+Tab` en WebKit de macOS (Safari solo enfoca enlaces así por defecto).

Para correr un motor en otra máquina: `npx playwright install <chromium|firefox|webkit>` y `pnpm test:e2e --project=<nombre>`.

## R2.10 Archivos

- Corrección: `web/src/components/landing/Footer.module.css`.
- Suite: ver R2.9. Informe: este archivo.
- Capturas (12) en `docs/fase-2/qa-landing/ronda-2/`:
  - `01-webkit-1280-hero-v17-vs-web.png`, `02-webkit-1280-la-tarjeta-v17-vs-web.png`
  - `03-iphone13-webkit-menu-abierto.png`, `04-iphone13-webkit-guia-ios-user-agent-real.png`, `05-pixel7-chromium-guia-android-user-agent-real.png`
  - `06-chromium-320-precios-v17-web-diff.png`, `07-chromium-1920-hero-v17-vs-web.png` (a 50 %)
  - `08-firefox-1280-hero-seccion-con-mas-diff.png` (la sección con más diff tras la corrección), `09-firefox-1280-footer-antes-y-despues-del-arreglo.png` (la que tenía más diff antes: 2.1 %)
  - `10-red-lenta-390-antes-de-cargar-fuentes.png`, `11-red-lenta-1280-400kbps-primeras-pinturas.png`, `12-webkit-1024x768-menu-y-hero.png`

## R2.11 Revisión del orquestador: volteo 3D en el WebKit de pruebas

Al revisar a ojo `02-webkit-1280-la-tarjeta-v17-vs-web.png` se ve que, **en reposo, el panel de La tarjeta muestra la cara trasera en espejo** (QR y "Barbería Norte · Muéstralo en caja." invertidos) en lugar del aro. Pasa igual en el mosaico de Avisos de Lo que viene ("Ejemplo de aviso" invertido). Ocurre **idéntico en la v1.7 y en `web/`**, por eso el diff de píxeles de WebKit no lo detectó.

**Diagnóstico** (Playwright WebKit 2251, macOS 14.4, scripts fuera del repo):

| Prueba | Resultado en WebKit |
|---|---|
| v1.7 headless y headed | Cara trasera visible en espejo |
| Chromium, mismo archivo | Correcto (se ve el aro) |
| `body::after` (grano) desactivado | Sigue fallando |
| `-webkit-transform-style: preserve-3d` explícito | Sigue fallando |
| `translateZ(1px)` en ambas caras / `rotateY(0deg)` en la frontal | Sigue fallando |
| `will-change: transform` en `.face` | Sigue fallando |
| Apariciones (`data-reveal`) desactivadas | Sigue fallando |
| **Tarjeta volteable mínima de manual** (`perspective` + `preserve-3d` + `backface-visibility: hidden` con y sin prefijo), sin CSS de LealTab | **También falla** (muestra "BACK" en espejo); en Chromium es correcta |

**Conclusión:** el fallo es del build de WebKit que Playwright usa en macOS 14 (no respeta `backface-visibility` en este entorno), no del CSS de la landing. El patrón es estándar y debería verse bien en Safari real, pero **no está comprobado**. Con el código volteado ("Mostrar mi código") la cara correcta sí se ve.

**Consecuencias:**
- Las pruebas e2e de WebKit siguen siendo válidas (verifican estado del DOM, no la imagen), pero el diff de píxeles de WebKit no sirve para estos dos componentes.
- **Primera revisión en el iPhone real:** al cargar, La tarjeta debe mostrar el aro (no el QR) y el mosaico de Avisos su frente; después, "Mostrar mi código" y "Ver un ejemplo" deben voltear y regresar bien. Repetir en el visor integrado de WhatsApp e Instagram.
- Si en Safari real fallara, la corrección sería no depender de `backface-visibility`: ocultar la cara que no está al frente con `visibility` sincronizada con la mitad de la transición. No se aplica sin evidencia.

