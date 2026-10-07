# LealTab · Uso del logo: área de protección y tamaños mínimos
**Aprobado 2026-10-05** (propuesta del 2026-10-05). Se basa en los masters congelados y en el sistema de variantes aprobado. Todos los lockups usan los `d` congelados sin cambios (ver `verificacion-uso.json`).

## Archivos
- `area-proteccion.svg`: las cuatro versiones con su área de protección, cotas y medidas.
- `tamanos-minimos.svg`: muestras a tamaño real en hoja A4 apaisada. Si se imprime al 100 %, las medidas en mm son reales.
- `uso-logo.svg` + `uso-logo.png` (1600×1000): lámina resumen. El PNG es solo para verla.
- Scripts y datos de las pruebas: `laminas-html/uso/`.

## La unidad: x
**x = el grosor del trazo del isotipo = 52 u.** Equivale a 0.41 C (C = altura de la mayúscula = 125.33 u) y a unas 2 astas de la «l».
Se mide sobre el propio logo, así que crece y se achica con él. En las cuatro versiones vale lo mismo, porque el isotipo mide 222 × 188 u en todas. En el wordmark solo, x = 0.41 C.

## Área de protección
- **Mínimo: 1.5x por lado** (78 u) en horizontal, vertical, isotipo y wordmark.
- **Si hay espacio: 2x por lado** (104 u).
- En la zona de protección (durazno claro en las láminas) no entra nada: ni texto, ni bordes, ni otras imágenes. Tampoco puede quedar pegada al borde de la página.
- Se mide desde la tinta del logo, no desde un recuadro imaginario.
- Por qué 1.5x: con 1x el logo se ve apretado, y 2x es cómodo pero a veces cuesta en barras de navegación pequeñas. Además, los íconos aprobados ya dejan al menos 1.5x (app icon ≈ 1.55x a los lados, maskable ≈ 2.1x).

## Tamaños mínimos (siempre por ancho)

| Versión | Digital | Impreso | Inversa o papel absorbente |
|---|---|---|---|
| Horizontal | 80 px | 25 mm | 30 mm |
| Vertical | 56 px | 16 mm | 19 mm |
| Isotipo | 16 px (con el pixel-fit) | 6 mm | 7 mm |
| Wordmark | 56 px | 15 mm | 18 mm |

- **Regla en pantalla.** La mayúscula debe medir al menos 12 px de alto y las contraformas de la e, la a y la b deben verse abiertas. Esto se probó en Chrome a 1×, que es el peor caso; en pantallas 2× se ve todavía mejor.
- **Regla impresa.** La mayúscula debe medir al menos 3.5 mm de alto y la separación más fina entre letras, al menos 0.10 mm. En inversa (lino sobre noche), en serigrafía o en papel kraft la tinta se expande y cierra los huecos, por eso se suma un 20 %.
- **Isotipo bajo 48 px.** Usa los pixel-fit aprobados de `logo/iconos/pixel/` (16, 24 y 32 px) a su tamaño exacto; no se escala el vector congelado. Dentro de los lockups el isotipo sigue siendo vector, y su hueco queda abierto en los mínimos (≥ 3 px).
- **Cambios respecto a la propuesta de Aarón** (96 px / 25 mm, 64 / 18, 16 / 6, 64 / 15):
  - Horizontal: 96 → 80 px. A 80 px ya cumple la regla (C 12.4 px, contraformas abiertas); a 64 px la contraforma de la a se ve gris.
  - Vertical: 64 → 56 px y 18 → 16 mm. A 16 mm su wordmark mide lo mismo que en el horizontal de 25 mm.
  - Wordmark: 64 → 56 px. Así queda igual que el vertical, que lleva el wordmark al mismo ancho.
  - Isotipo (16 px / 6 mm) y los mm de horizontal y wordmark se validan sin cambios.

---

# Usos correctos e incorrectos
**Aprobado 2026-10-06** (propuesta del 2026-10-05). Archivos: `usos-correctos.svg` y `usos-incorrectos.svg` (horizontal y vertical); láminas `usos-logo.svg` + `.png` (horizontal) y `usos-logo-vertical.svg` + `.png` (vertical). Los PNG son solo para verlas. Verificación: `verificacion-usos.json`.

## Sí
1. **Noche sobre lino.** Es la versión principal. Contraste 13.3:1.
2. **Lino sobre noche.** Es la inversa. Contraste 13.3:1.
3. **Negra sobre blanco**, para impresión a una tinta. Contraste 21:1.
4. **Blanca sobre foto oscura**, solo si la zona que ocupa el logo es oscura y pareja. En el ejemplo simulado, el punto más claro de esa zona da 9.1:1.
5. **Lino sobre bosque (#0F4D3A).** Contraste 8.5:1, pasa AAA. El blanco puro sobre bosque da 9.8:1.
6. **Sobre foto con zona limpia:** noche sobre una parte clara y sin detalle de la foto, con todo el 1.5x libre. En el ejemplo, 11.9:1 o más.
7. **Vertical:** noche sobre lino, lino sobre noche, lino sobre bosque o blanca sobre foto oscura. Siempre con su proporción congelada: el símbolo mide 2 C, va arriba y centrado, y está separado del nombre por 0.45 C.

Siempre: área de protección de 1.5x (2x si hay espacio) y los tamaños mínimos de arriba. Si dudas, usa noche sobre lino.

## No
1. **Deformar:** no estires, comprimas, rotes ni inclines el logo.
2. **Logo en durazno:** durazno es el color de acento del sistema, nunca del logo. Además, sobre lino da 1.75:1.
3. **Recolocar el símbolo:** no lo muevas de lugar respecto al nombre ni cambies su tamaño relativo. Usa solo el horizontal y el vertical aprobados.
4. **Contornear o vaciar:** el logo va siempre relleno.
5. **Sombras, degradados, brillos u otros efectos:** ninguno. La sombra dura noche del estilo Ciclo v2 es para tarjetas y recuadros, nunca para el logo.
6. **Fondos sin contraste:** noche sobre bosque (1.56:1) y lino sobre durazno (1.75:1) no se leen.
7. **Fondos cargados:** nada de fotos con ruido ni texturas detrás del logo. Busca una zona limpia o pon el logo sobre un recuadro.
8. **Invadir el área de protección:** ni textos, ni etiquetas, ni bordes dentro del 1.5x.
9. **Otra tipografía:** el wordmark son curvas fijas de Archivo 75/800. No lo escribas con ninguna otra fuente, ni con Archivo como texto.
10. **Pixel-fit mal usado:** el isotipo de 16 px es solo para 16 px; ampliado se ve pixelado. A 16 px, usa el pixel-fit y no el vector, que se empasta.
11. **Noche sobre durazno:** aunque pasa WCAG (7.59:1), no se usa. Es una regla de marca: el durazno se reserva para el momento en que se completa una recompensa y nunca es fondo de marca.
12. **Vertical modificado:** no lo estires ni lo rotes. El símbolo no cambia de escala (siempre 2 C), no se desalinea, va arriba del nombre y la separación es siempre 0.45 C, ni más ni menos. Tampoco se invade su área de 1.5x.
