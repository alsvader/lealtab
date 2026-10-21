# 05 · Inicio (resumen semanal), Clientes y Ajustes + C0 Mis tarjetas (v1)

Estado: ✅ **Aprobado (2026-10-20)** (N0, N7, N8 y C0). Fecha: 20 oct 2026. Base: `../04-design-system/tokens.css`. Todas las cifras están etiquetadas como **Datos de ejemplo**.

## A. Panel del negocio (`inicio/`) · ✅ Aprobado (2026-10-20)
| Pantalla | Archivo | Qué resuelve |
|---|---|---|
| N0 Inicio | `n0-inicio` (1280) y `n0-inicio-movil` (390) | Lo primero que ve el dueño al entrar: visitas de la semana vs. la anterior, clientes que regresaron, en riesgo, recompensas canjeadas y **una acción sugerida** ("9 clientes no han vuelto: escríbeles hoy"). Escritorio añade visitas por semana y un "Esta semana" |
| N7 Clientes | `n7-clientes` (1280) | Lista con estados y búsqueda + ficha del cliente: sellos, ritmo habitual, escribir por WhatsApp, corregir sellos e historial de visitas con hora y quién registró cada sello (ajuste 2026-10-20). Vista **Por revisar** para movimientos sin conexión rechazados al sincronizar: Aprobar de todos modos o Descartar (offline-first, 2026-10-20). Exportar CSV arriba |
| N8 Ajustes | `n8-ajustes` (1280) | Negocio, Tarjeta (interruptor de sello de bienvenida, **límite de sellos**: 1 por día por defecto, 1 cada X horas (X libre; se sugiere 2 h, sin mínimo obligatorio; D-014, aclarado 2026-10-21), o Sin límite con advertencia; reinicio a medianoche del negocio; bloqueo fijo de 2 min contra doble escaneo; QR), Tus datos (exportar clientes y visitas, aviso de privacidad), Plan y pago (prueba, fecha de fin, $299 MXN/mes + IVA, pausa conservando exportación) y Ayuda por WhatsApp |

Decisión aplicada (Aarón vía PM, 2026-10-20): el resumen semanal vive solo en el panel, no se envía por WhatsApp. Evento de analítica **`resumen_semanal_visto`** (negocio, semana) al mostrarse N0, para medir en el piloto cuántos dueños lo abren cada semana.
Navegación lateral: Inicio, Quién regresa, Mostrador, Clientes, Tarjeta, Ajustes.

## B. Tarjeta del cliente: C0 Mis tarjetas · ✅ Aprobado (2026-10-20)
`tarjeta-cliente/c0-mis-tarjetas.{html,png}` (390 px). Una sola PWA LealTab (ADR-001): lista de tarjetas por negocio con mini aro, etiqueta "Recompensa lista" cuando se completa; tocar abre C3. Estado vacío que explica cómo agregar una tarjeta (escanear el QR del mostrador). Regla del aro: carril menta, avance bosque, durazno solo completo, sobre blanco lino.

## Notas
- "Acción sugerida" en MVP: una sola, por regla simple (si hay clientes en riesgo → escribirles; si no, tarjetas a 1 sello del premio).
- Precio confirmado (N1 y N8): $299 MXN/mes + IVA, sin contratos, según `lealtab/web/src/content/pricing.ts` (confirmado por PM, 2026-10-20).

