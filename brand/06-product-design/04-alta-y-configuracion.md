# 04 · Alta del negocio y configuración: N1–N4 (v1)

Estado: ✅ **Aprobado (2026-10-20)**. Fecha: 20 oct 2026. Base: `../04-design-system/tokens.css`.
Archivos en `alta/`: `n1-cuenta`, `n2-negocio`, `n3-tarjeta`, `n4-qr-mostrador` (escritorio 1280 px) y `n3-tarjeta-movil` (390 px), cada uno en `.html` y `.png`.

| Pantalla | Qué resuelve |
|---|---|
| N1 Cuenta | Alta self-serve: nombre, correo y WhatsApp del negocio; entra con código por correo (sin contraseña). *Actualización 2026-10-21 (D-005): también podrá entrar con contraseña y restablecerla por correo; esta pantalla está pendiente de ajuste por Diseño de Producto.* Sin llamada de ventas ni tarjeta de crédito. A la derecha, lo que incluye la prueba: 30 días gratis, precios públicos desde $299 MXN/mes + IVA, sin contratos (confirmado por PM en `lealtab/web/src/content/pricing.ts`, 2026-10-20), exportación CSV, pausa conservando la exportación y soporte por WhatsApp |
| N2 Tu negocio | Nombre, giro (barbería, estética o salón, tapioca, cafetería, otro), ciudad y logo opcional (iniciales si no hay) |
| N3 Tu tarjeta | Sellos 4–12 (− / +), recompensa e interruptor de sello de bienvenida (automático al crear la tarjeta). Vista previa en vivo que muestra 1/8 y "Tu sello de bienvenida ya está aquí" cuando está activo |
| N4 QR de mostrador | Cartel con QR para registrarse; tamaños carta, media carta y sticker; descarga PDF/PNG; recuerda que los sellos se suman escaneando la tarjeta desde Mostrador; fecha de fin de prueba |

Barra superior con 4 pasos y "Ayuda por WhatsApp" siempre visible. El aro respeta la regla (menta / bosque / durazno solo completo, sobre blanco lino).

## Notas
- El cartel de N4 lleva "Hecho con LealTab" siempre, en todos los planes (decisión de Aarón, 2026-10-20).
- Logo "LealTab" en la barra es texto provisional; datos y QR de ejemplo.

## Siguiente
Con esto queda cubierto el inventario MVP del panel salvo N7 Clientes y N8 Ajustes, que propongo como pieza 5.
