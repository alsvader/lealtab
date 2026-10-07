# LealTab · Recursos gráficos
**Aprobado 2026-10-06**. Ruta Ciclo v2. Todo está en SVG; `recursos-graficos.png` es solo para ver la lámina. Verificación: `verificacion-recursos.json` (todo_ok). Scripts: `laminas-html/recursos/`.

## Archivos
- `iconos/linea/` y `iconos/activo/`: 18 íconos, cada uno en versión de línea y activa. Además `lt-iconos-sprite.svg` (con `<symbol>` y `currentColor`) y `lt-iconos-prueba-tamanos.svg/.png`.
- `aro/`: aro vacío, parcial (3 de 8) y completo, en tres tamaños: marketing (300 px) e interfaz (56 y 24 px). También `lt-aro-relacion-isotipo.svg` y dos animaciones SMIL, `-avance` y `-cierre`.
- `ilustraciones/`: barbería, estética y tapioca, con sombra y fondo o sin ellos.
- `stickers/`: cuatro stickers, cada uno en versión de marketing y de producto.

## Íconos
- Se dibujan en una rejilla de 24 px con una zona viva de 20 px. El trazo es de 2 px en noche (2.5 px en marketing) y los remates son redondos. Llevan un solo grosor por pieza y nunca sombra en el producto.
- **Esquinas:** radio exterior 2.25 e interior 0.25. Es la misma proporción que el isotipo, que tiene 58 y 6 sobre un trazo de 52. Por eso se ven "de la familia" sin copiar las L.
- Donde tiene sentido, la forma queda abierta en L: los ejes de estadísticas, las esquinas del QR, la caja de compartir, la tienda y la casa. Buscar y perfil usan un aro abierto.
- **Activo:** se agrega un relleno plano menta gris dentro de la forma. Check y agregar no tienen interior, así que llevan un disco menta detrás.
- **Tamaños:** se ven bien a 24 y 32 px. A 16 px se leen, pero recompensa, negocio y regalo quedan justos. En 16 px usa de preferencia los más simples.
- **WhatsApp:** se usa el ícono oficial de WhatsApp tal cual (regla del moodboard). El ícono "mensaje" es para avisos genéricos.

## Aro de progreso
- **Medidas:** tiene el mismo trazo que el isotipo (52 u) y su diámetro mide 2 veces la altura del isotipo (376 u). El trazo es el 13.8 % del diámetro y los remates son redondos.
- **Cómo avanza:** empieza a las 12 y avanza en sentido horario. El carril va en menta gris, el avance en bosque y el aro completo en durazno. Ese es el único momento en que el aro es durazno.
- **Marketing:** contorno noche de 3 px y sombra dura de 6 px. Va un solo aro grande por pieza, anclado a una esquina o saliendo del encuadre.
- **Interfaz:** plano, sin contorno ni sombra. Se usa solo como gráfica de avance, con la cifra en Manrope tabular ("3/8").
- Nunca va en hileras de aros iguales, porque eso parece tarjeta de sellos.
- **Movimiento:** se dibuja en unos 520 ms, se pasa un 3–4 % y regresa con un solo rebote; en total dura 650 ms. Al completar, el aro cambia a durazno con un pulso del 4 %. Nada dura más de 1 s, no hay confeti ni bucles, y con "reducir movimiento" se muestra solo el estado final.

## Ilustración
- Es plana, con contorno noche de 3 px y sombra dura de 6 px opcional en marketing. Solo usa tintas de la paleta, sin degradados ni 3D.
- Los protagonistas son las herramientas de cada oficio, con máximo tres objetos por escena y aire alrededor:
  - Barbería: tijeras, navaja y máquina.
  - Estética: secadora, cepillo y esmalte.
  - Tapioca: vaso con popote ancho y perlas.
- Durazno solo como acento pequeño (seguro de la tijera, esmalte, banda del vaso).
- **Personas:** cuando se agreguen, irán en tintas de marca y no en tonos de piel realistas. La diversidad la da la fotografía.

## Stickers
- Solo se usan cuando significan algo, con un máximo de dos por pieza. Nunca van sobre precios, cifras, errores ni textos legales.
- **Tipografía:** Archivo 800 condensada en mayúsculas. Las cifras van en Manrope 800 tabular, como en "Visita 5/8".
- **Colores:**

| Sticker | Fondo | Texto | Contraste |
|---|---|---|---|
| ¡Recompensa lista! | durazno | noche | 7.59:1 |
| Visita 5/8 | blanco lino (con mini aro) | noche | 15.03:1 |
| Nuevo | menta gris | noche | 11.36:1 |
| Te extrañamos | bosque | lino | 8.54:1 |

- **Marketing:** rotados entre 3 y 6°, con contorno de 2.5 px y sombra dura de 3 px.
- **Producto:** planos, sin rotar y sin sombra.

## Pendiente de decidir
- **"Te extrañamos":** va en bosque. El color funcional de riesgo (tostado sobre durazno claro) es provisional hasta la Fase 4.
- **Parecido con librerías conocidas:** check, agregar, campana, casa, pin de ubicación, regalo y calendario son formas universales y se parecen a sus equivalentes de Lucide o Material. Lo propio está en las esquinas, las formas en L abiertas, el aro abierto y los íconos de visita, recompensa y escanear.
