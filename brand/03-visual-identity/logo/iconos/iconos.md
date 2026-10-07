# LealTab · Íconos digitales — Aprobado 2026-10-05, 11:28 PM hora de México (propuesta del 2026-10-05)

Generado con `laminas-html/iconos/` (build_iconos.py → render_iconos.py → post.py → gen_lamina.py → verificar_iconos.py).

- **Íconos grandes** (app/, pwa/, avatar/): `d` de #isotipo copiados sin cambios del master congelado; solo cambian fill, transform, viewBox y fondo. Isotipo al 58 % del lado en ancho (49 % en alto); en el maskable, 50 %. Centrado óptico: +2.44 u en x y −1.17 u en y respecto al centro de la caja (el centro de masa está en 106.1, 95.2 u contra 111, 94).
- **Pixel-fit** (pixel/): trazados NUEVOS derivados a rejilla de 16/24/32/48 px. No sustituyen al master.
- **Favicon (elegido por Aarón: opción B)**: isotipo lino sobre cuadrado redondeado noche, en `favicon/favicon.svg` y `favicon/favicon.ico` (frames de 16/32/48 dibujados a píxel, sin reescalar). Prueba: `favicon/prueba-pestanas.png`.
- **Opción A · DESCARTADA**: noche sobre transparente, archivada en `favicon/descartado/opcion-a/`. Se descartó porque se pierde en pestaña oscura (contraste 1.3:1). No usar.
- **Maskable**: el isotipo ocupa el 50 % del lado (los demás íconos, el 58 %), con el mismo centrado óptico proporcional. Radio máximo 154.6 px contra 204.8 px de zona segura (holgura 50.2 px).

```html
<!-- favicon oficial = opción B: favicon/favicon.ico y favicon/favicon.svg -->
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"> <!-- app/lealtab-apple-touch-icon-180-sangre.png -->
```
```json
"icons": [
  {"src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any"},
  {"src": "/lealtab-pwa-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
  {"src": "/lealtab-pwa-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
  {"src": "/lealtab-pwa-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
]
```
