# PRD · Migración de la landing v1.7 a Next.js

Fase 2 · 7 de octubre de 2026 · Orquestador: Claude Opus 5.5 · Ejecución: subagentes en Sonnet 5.5

## 1. Objetivo

Llevar la landing aprobada (`brand/05-marketing/03-mockup-landing-v1.7.html`) a un proyecto Next.js (última versión estable) en la carpeta `web/`, **con paridad visual, de copy y de comportamiento**. Es una migración, no un rediseño: nada de copy, color, tipografía, layout ni animación cambia.

**Por qué `web/` y no `app/`:** Next.js usa `src/app/` para el App Router; `app/src/app/` confunde. `web/` alojará la landing ahora y la PWA después (D-002: plataforma propia).

## 2. Alcance

**Dentro:** las 10 piezas de la v1.7 (Nav + menú móvil, Hero, Cómo funciona con editor vivo, La tarjeta con selector de negocio, Para quién, Precios, Confianza, Lo que viene, Cierre + FAQ, Footer), el enlace "Saltar al contenido", el grano de papel, la capa de movimiento y todas las microinteracciones, metadatos (OG/Twitter/theme-color), favicon e íconos.

**Fuera:** PWA del cliente o del cajero, backend, analítica, aviso de cookies, páginas legales, 404 personalizada, despliegue. Los enlaces pendientes (`#` del aviso de privacidad, términos y WhatsApp) se conservan como en la v1.7, centralizados en una constante para llenarlos después.

## 3. Decisiones técnicas

| Tema | Decisión |
|---|---|
| Framework | `create-next-app@latest`, App Router, TypeScript estricto, `src/`, alias `@/*`, ESLint |
| Gestor de paquetes | pnpm |
| Estilos | Tailwind CSS v4 instalado (base para shadcn en la PWA). Los tokens de `brand/04-design-system/tokens.css` se copian como fuente de verdad en `src/styles/tokens.css` y se exponen a Tailwind con `@theme inline`. **El CSS de cada sección se porta casi literal a CSS Modules** (`Section.module.css`) para garantizar paridad; no se reescribe a utilidades. Utilidades globales (reset, tipografía, `.wrap`, `.btn*`, movimiento, grano) en `src/styles/globals.css`. |
| Fuentes | `next/font/google`: Archivo (eje `wdth` 75, pesos 700/800) y Manrope (400–700), expuestas como variables CSS que alimentan `--font-display` y `--font-body`. Se elimina el `@import` de Google Fonts. |
| Componentes | Server Components por defecto. `"use client"` solo donde hay interacción: Nav, HowItWorks (stepper + editor), Showcase (selector, "Mostrar mi código", "Suma una visita", guía por SO), Roadmap (aviso que voltea, filas de clientes), CloseVisual (aro que se completa), y el hook de aparición. |
| Movimiento | Se respeta `prefers-reduced-motion` igual que hoy. Un hook `useReveal` (IntersectionObserver, una sola vez) reemplaza los bloques "Scroll reveal" y "Aparición escalonada". La clase `js` en `<html>` se mantiene con un script inline en `layout.tsx` para que el contenido no parpadee sin JS. |
| Comunicación entre secciones | Evento DOM `lt:select-biz` (`detail: { theme: "barberia" \| "estetica" \| "tapioca" }`) para "Para quién → La tarjeta". El CTA del menú observa el elemento con `data-hero-cta` (Hero). Sin estado global extra. |
| Assets | Copiados a `web/public/` desde `brand/`: logos (`/brand/logo/…`), íconos de línea (`/brand/icons/…`), ilustraciones (`/brand/illustrations/…`), favicon/manifest (`/`), OG (`/og/lealtab-og-1200x630.png`). Se usa `<img>`/`next/image` con width/height como en la v1.7. |
| Metadatos | Metadata API de Next: `metadataBase: https://lealtab.com`, `lang="es-MX"`, OG, Twitter, `themeColor` vía `viewport`. Iconos con las convenciones de archivo de App Router. |
| Contenido | Copy exacto de la v1.7. Datos repetidos (planes, FAQ, negocios del selector, compromisos, roadmap, enlaces del footer) en `src/content/landing.ts`. |
| Calidad | `pnpm build`, `pnpm lint` y `tsc --noEmit` sin errores. Sin errores en consola. |

## 4. Estructura objetivo

```
web/
  public/              favicon, manifest, og/, brand/{logo,icons,illustrations}
  src/app/             layout.tsx, page.tsx, icon/apple-icon
  src/styles/          tokens.css, globals.css
  src/content/         landing.ts (copy estructurado y enlaces pendientes)
  src/hooks/           useReveal.ts, useReducedMotion.ts
  src/components/landing/
    SkipLink, Nav, Hero, HowItWorks, Showcase, WhoFor, Pricing,
    Trust, Roadmap, ClosingCta (incluye FAQ), Footer  (+ .module.css)
  src/components/ui/   piezas compartidas (BtnCta, LinkArrow, Aro…)
```

## 5. Tareas

| # | Tarea | Agente | Depende de | Entregable |
|---|---|---|---|---|
| T1 | Scaffold Next.js en `web/`, Tailwind v4, tokens, fuentes, `globals.css` (reset, tipografía, layout, botones, cards, capa de movimiento, grano v1.7), assets en `public/`, `layout.tsx` con metadatos, hooks compartidos, `content/landing.ts` base, `page.tsx` con los componentes vacíos | `lealtab-desarrollador` | — | Proyecto que compila |
| T2 | Nav (sección activa, menú móvil a pantalla completa, CTA que entra cuando sale el del hero), SkipLink, Hero (aro protagonista, secuencia de entrada, stickers que reaccionan al mouse) y Footer | `lealtab-desarrollador` | T1 | Componentes + CSS Modules |
| T3 | Cómo funciona (titular fijo, aro de avance, pasos con UI real, editor vivo con visitas) y La tarjeta (selector de negocio, mensaje, aro, "Mostrar mi código", "Suma una visita", guía según el SO con `?os=`) | `lealtab-desarrollador` | T1 | Componentes + CSS Modules |
| T4 | Para quién (filas alternadas, emite `lt:select-biz`), Precios, Confianza, Lo que viene (aviso que voltea, filas de clientes), Cierre (aro que se completa en durazno) + FAQ | `lealtab-desarrollador` | T1 | Componentes + CSS Modules |
| T5 | Integración: `page.tsx`, contrato `lt:select-biz` de punta a punta, limpieza de CSS duplicado, build/lint/types | Orquestador | T2–T4 | Build verde |
| T6 | QA de paridad: capturas de la v1.7 y de `web/` a 375, 768 y 1280 px (Playwright), diferencias de copy (texto extraído de ambos), interacciones, teclado/foco, `prefers-reduced-motion`, consola limpia, Lighthouse | `lealtab-desarrollador` (rol QA) | T5 | `docs/fase-2/qa-landing-nextjs.md` + capturas en `docs/fase-2/qa-landing/` |
| T7 | Corrección de las diferencias que encuentre T6 | `lealtab-desarrollador` | T6 | Paridad cerrada |

T2, T3 y T4 corren en paralelo. Cada agente toca **solo** sus archivos; los cambios a archivos compartidos (`globals.css`, `content/landing.ts`, `page.tsx`) se reportan al orquestador en vez de editarlos, salvo agregar su propia sección a `content/landing.ts`.

## 6. Criterios de aceptación

1. A 375, 768 y 1280 px la página en `web/` es visualmente indistinguible de la v1.7 (diferencias solo por antialiasing de fuentes).
2. El texto visible es idéntico (diff de texto vacío).
3. Todas las interacciones de la v1.7 funcionan igual, incluidas las de teclado, y con `prefers-reduced-motion` se desactivan las mismas animaciones.
4. `pnpm build`, `pnpm lint` y `tsc --noEmit` pasan; cero errores en consola; Lighthouse ≥ 95 en Accesibilidad, Buenas prácticas y SEO.
5. No se modifica nada dentro de `brand/` ni de los informes 01–03.

## 7. Pendientes para después

- URLs reales: aviso de privacidad, términos y número de WhatsApp.
- Analítica básica y aviso de cookies (LFPDPPP) si la analítica usa cookies.
- Despliegue en lealtab.com y `app.lealtab.com`.
