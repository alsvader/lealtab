# 02 · Tarjeta del cliente (PWA) · wireframes C1–C4 (v1)

Estado: ✅ **Aprobado (2026-10-20)**. Fecha: 20 oct 2026. Base: `../04-design-system/tokens.css`, 390 px móvil.
Archivos: `tarjeta-cliente/tarjeta-con-leyenda.{html,png}`. Negocio de ejemplo: Barbería Vélez, tarjeta de 8 sellos.

| Pantalla | Qué resuelve | Notas |
|---|---|---|
| C1 Registro | Nombre + WhatsApp, aviso de privacidad corto y visible antes del botón, casilla de aceptación y enlace al aviso completo | Sin contraseña. Si el negocio activó el sello de bienvenida, se otorga automático al crear la tarjeta. **Ajuste 2026-10-22 (D-031):** C1 pasa a dos pasos; este wireframe es el paso 1 (su botón pasa a «Enviarme el código», la captura aprobada no se rehace) y el paso 2 pide el código de 6 dígitos: ver `08-registro-con-codigo.md` |
| C2 Instalar PWA | Guía de 3 pasos con pestañas iPhone/Android; "Ahora no" no bloquea | Recuperación de la tarjeta con su WhatsApp y un código (`/c/recuperar`). **Ajuste 2026-10-22 (D-031):** en iPhone suma el `install_token`, invisible para el cliente, y sus estados de falla: pieza 08 |
| C3 Mi tarjeta | Aro de progreso + QR personal grande + última visita | El QR es lo que escanea el staff (opción A aprobada). **Ajuste 2026-10-20:** el QR personal **rota periódicamente** (una captura vieja no sirve); en los términos de la tarjeta se menciona el límite de sellos. **Ajuste 2026-10-20:** recién registrada con sello de bienvenida activo, C3 muestra 1/8 y la nota "Tu sello de bienvenida ya está aquí" en lugar de "Última visita" (las capturas aprobadas muestran 4/8; no se rehacen) |
| C0 Mis tarjetas | Agregada después (ADR-001): `tarjeta-cliente/c0-mis-tarjetas.{html,png}`, documentada en la pieza 5 | ✅ Aprobado (2026-10-20). **D-031 (2026-10-22):** no tiene estado «por confirmar» ni los botones «Aceptar» y «No soy yo»; solo «con tarjetas» y «sin tarjetas» |
| C4 Recompensa | Aro completo en durazno, mensaje de logro, QR para canjear y estado después del canje (vuelve a 0/8) | |

**Regla del aro (aplicada):** carril menta gris, avance bosque, durazno solo con el aro completo; nunca avance en lino y nunca sobre fondo bosque (va en panel blanco lino).
**Leyenda:** **"Hecho con LealTab" siempre visible** (Aarón, 2026-10-20): en todos los planes, Pro incluido, en la tarjeta del cliente y en el cartel de mostrador. La variante sin leyenda se eliminó.

## Siguiente
Pieza 3: panel del negocio (N5 Mostrador y N6 Quién regresa).
