# LealTab · Paquete de logo (exportaciones finales)
**Aprobado 2026-10-06**

## La regla más importante
**El SVG es la fuente.** Los PNG, PDF e ICO se generan solos desde los SVG aprobados con `laminas-html/entregables/exportar.py`. Nunca se editan a mano. Si algo cambia, se cambia el SVG aprobado y se vuelve a exportar.
- `manifiesto.json` tiene el sha256 de cada archivo y de qué SVG sale.
- `verificacion-entregables.json` comprueba que los trazados son los congelados, que cada PNG coincide con su SVG y que nada queda bajo el mínimo.

## ¿Qué archivo uso?

| Necesito… | Usa |
|---|---|
| El logo en una web, Figma o Illustrator | `svg/lealtab-horizontal-noche.svg` (o la versión y el color que necesites) |
| Ponerlo en Canva, Word, PowerPoint o Google Docs sin pensar en márgenes | `svg/*-con-area.svg`, o `png/<versión>/*-con-area-1024.png` si el programa no acepta SVG |
| Logo claro sobre fondo oscuro | `-lino` (transparente) o `-lino-fondo-noche` (ya trae el fondo) |
| Imprimir a una tinta | `impresion/lealtab-*-negro.pdf` o `.svg` |
| Mandarlo a la imprenta | `impresion/` (SVG + PDF vectorial, noche y negro). **No está en CMYK**: la conversión queda pendiente de validar con la imprenta. |
| Favicon e íconos del sitio o la app | Todo `web/`: copia los archivos a la raíz del sitio y pega `snippet.html` en el `<head>` |
| Foto de perfil (Instagram, Facebook, WhatsApp Business, Google Maps) | `redes/lealtab-avatar-*-cuadrado-1080.png`: la plataforma lo recorta en círculo y el símbolo queda dentro |
| Portada de Facebook | `redes/lealtab-portada-facebook-1640x624.png` |

## Carpetas
- **svg/** (40): horizontal, vertical, isotipo y wordmark × noche, lino, lino-fondo-noche, negro y blanco. Cada uno viene **ajustado al borde** y **con-area**, donde el lienzo ya incluye el área de protección de 1.5x (78 u por lado).
- **png/** (50): exportados desde los SVG con área, con fondo transparente salvo en `lino-fondo-noche`. Horizontal y vertical en 512, 1024 y 2048 px de ancho; isotipo y wordmark en 512 y 1024.
- **web/** (8): `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180, a sangre), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest` y `snippet.html`.
- **redes/** (12): avatares lino y noche en 400 y 1080 px. Vienen en dos formas:
  - **círculo** con esquinas transparentes, que es el aprobado;
  - **cuadrado a sangre**, recomendado para subir.

  Además, la portada de Facebook: fondo noche con el logo lino al centro, sin texto.
- **impresion/** (16): SVG y PDF vectorial (sin imágenes ni fuentes) del horizontal, vertical, isotipo y wordmark, en noche y en negro. El tamaño de página es de muestra y escala sin perder calidad.

## Reglas rápidas
- **Área de protección:** como mínimo 1.5x libre alrededor del logo (x = grosor del trazo del isotipo); si hay espacio, 2x.
- **Tamaños mínimos (ancho):**

  | Versión | Pantalla | Impreso |
  |---|---|---|
  | Horizontal | 80 px | 25 mm |
  | Vertical | 56 px | 16 mm |
  | Isotipo | 16 px, con el pixel-fit | 6 mm |
  | Wordmark | 56 px | 15 mm |

  En inversa o en papel absorbente, un 20 % más.
- **Colores del logo:** solo noche, lino, negro o blanco. El durazno nunca es color del logo ni fondo de marca: se reserva para el momento en que se completa una recompensa.
- **Prohibido:** deformar, recolocar, contornear, poner sombras o cambiar la tipografía. Detalle completo en `logo/uso/uso.md` y en las láminas de usos.
