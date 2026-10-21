# 03 · Panel del negocio: N5 Mostrador y N6 Quién regresa (v1)

Estado: ✅ **Aprobado (2026-10-20)**. Fecha: 20 oct 2026. Base: `../04-design-system/tokens.css`, chips y tablas de `03-cards-y-estados.md` y `04-tablas-y-formularios.md`.
Archivos: `panel/n5-mostrador.{html,png}` (móvil 390 px, 4 estados) y `panel/n6-quien-regresa.{html,png}` (escritorio 1280 px).

## N5 Mostrador (móvil)
| Estado | Qué pasa |
|---|---|
| N5·1 Escanear | Cámara para el QR del cliente (opción A). Respaldo: buscar por WhatsApp o nombre |
| N5·2 Confirmar sello | Ficha del cliente, sellos con el nuevo marcado, "Confirmar +1 sello" y confirmación "Su tarjeta ya se actualizó" |
| N5·3 Canjear | Tarjeta completa: "Confirmar canje" (vuelve a 0/8) u "Ahora no, solo sumar visita" |
| N5·4 Límite alcanzado | "Ya recibió su sello hoy" (por defecto, 1 por día) o "Próximo sello disponible a las HH:MM" (modo por horas); muestra último sello y quién lo registró. Agregado 2026-10-20 por la decisión de límite de sellos |
"Ayuda por WhatsApp" está fijo al pie de cada estado.
Indicador de sincronización arriba en cada estado: En línea · sincronizado / Sin conexión · N pendientes / Sincronizando (offline-first, 2026-10-20).
Antiabuso (2026-10-20): QR del cliente rotativo, bloqueo fijo de 2 min contra doble escaneo (D-014, 2026-10-21) y registro de quién dio cada sello y cuándo. Con la cuenta compartida del MVP, "quién" se registra como la sesión/dispositivo del mostrador (p. ej. "Mostrador (iPhone caja)").
El sello de bienvenida ya no pasa por mostrador: se otorga automático en el registro del cliente (C1) cuando el interruptor está activo (cambio de Aarón, 2026-10-20).

## N6 Quién regresa (escritorio)
- Cifras: regresaron, Frecuente (2+ visitas en 30 días), En riesgo (más del doble de su ritmo, mínimo 30 días), Nuevo (primera visita en 30 días).
- Filtros por grupo, búsqueda y tabla: cliente, WhatsApp, estado, visitas, sellos, última visita, Ver.
- "Exportar CSV" arriba a la derecha junto a "Registrar visita"; "Ayuda por WhatsApp" en el menú lateral; aviso de privacidad en el pie.
- Chips planos con palabra (Frecuente menta/bosque, En riesgo durazno claro/tostado, Nuevo neutro), como en el sistema de diseño.

## Notas
- El logo del menú lateral es texto provisional: en producción va el logotipo aprobado.
- Los datos son de ejemplo.

## Siguiente
Pieza 4: alta del negocio y configurar tarjeta (N1–N4, con el interruptor del sello de bienvenida automático).
