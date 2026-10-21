# LealTab · pitch de marca y producto (Propuesta A) · 11 páginas

Fase 5, Marketing · 7 de octubre de 2026 · Para aliados, posibles socios y prensa (no para dueños del piloto).

## Entregables
- `06-pitch-marca.pdf`: 11 páginas, 1920×1080.
- `pitch-marca/01.png` … `11.png`: vistas previas.
- `pitch-marca/html/build.py`: fuente única que genera las páginas `01-portada.html` … `11-cierre.html`. `_base.css` es una copia del deck piloto con utilidades extra. `assets/` tiene los aros sin cifra.
- `pitch-marca/render.sh`: corre build.py y luego genera HTML → PNG → PDF.

## Estructura
1. Portada: lema y la frase de producto
2. Por qué existimos: misión y visión aprobadas
3. El problema: negocios de visita recurrente con lealtad en papel
4. Propuesta A: la tarjeta digital más simple y bonita, con sus 4 beneficios
5. El producto: tarjeta PWA, el aro que se completa y el tablero de quién regresa
6. Para quién: barberías, estéticas y salones, tapiocas (ilustraciones reales), y cafeterías y más (tarjeta con ícono)
7. Cómo nos vemos y cómo hablamos: 4 rasgos, voz, paleta, Archivo y Manrope, el aro
8. Modelo: prueba de 30 días; Inicio $299 + IVA; Negocio $449 + IVA (recomendado); Pro próximamente, sin precio; alta sin llamada de ventas
9. Piloto en Villahermosa: 5 a 10 negocios y qué buscamos aprender (sin resultados)
10. Hacia dónde vamos: avisos, campañas, sucursales, Apple y Google Wallet (todo próximamente, sin fechas)
11. Cierre: lema, lealtab.com y @getlealtab

## Fuentes
`PLAN.md` · `01-brand-strategy/identidad-de-marca.md` (misión, visión, personalidad, voz, arquitectura) · `01-brand-strategy/audiencia-y-posicionamiento.md` (segmento, Propuesta A, beneficios, señales para pasar a B) · `02-creative-direction/rutas-creativas.md` (Ciclo v2, reglas del aro) · `05-marketing/02-copy-landing.md` (planes y precios). No se inventaron métricas, clientes, inversión ni resultados.

## Reglas de diseño
- Mismo sistema Ciclo v2 que el pitch del piloto. El durazno solo aparece como acento: el punto, el badge "Recomendado" y la muestra de color en la página 7.
- Aros: `assets/aro-*-sin-cifra.svg` son versiones de los SVG aprobados a las que solo se les quitó el trazo de la cifra ("3/8", "8/8"). Ninguna página usa los SVG originales con cifra.
- No incluye: Wallet como promesa de lanzamiento, look de cupón, Tabasco, precio de fundador, CFDI, OXXO ni API.

## También corregido
Pitch del piloto: los 10 HTML ahora usan `pitch-piloto/html/assets/` (aros sin cifra). Se quitó el "8/8" de la portada y del cierre, y se volvió a generar `05-pitch-piloto.pdf`.
