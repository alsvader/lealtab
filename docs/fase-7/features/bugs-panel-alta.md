# Feature: Bugs del alta del panel

**Estado:** Aprobado (11 nov 2026)
**Fase:** 7 · **Rama:** `feat/bugs-panel-alta`
**Cubre:** RF-ALT-01, RF-ALT-08, RF-TAR-01, RF-TAR-07, RNF-DIS-01, RNF-A11Y-01, RNF-A11Y-02 · **Pantallas:** N1, N2, N3, N4 · **Flujos:** F1
**Restricciones:** D-005, D-016, D-022. Pieza `brand/06-product-design/04-alta-y-configuracion.md` y los HTML de `brand/06-product-design/alta/`. Botones: `brand/04-design-system/02-botones-y-campos.md`.

## Objetivo

Corregir lo que Aarón encontró al recorrer `/panel/alta` a mano: los pasos ya concluidos no se reabren, los botones responden al puntero, el logo se previsualiza, el sello de bienvenida se ve como interruptor y el cartel de N4 muestra el QR en un marco fijo. Mostrador sigue sin construirse: la salida dice «Muy pronto».

## Fuentes

- Reporte: `bugs/panel-alta.md`.
- Pieza de diseño: `brand/06-product-design/alta/n1-cuenta.html`, `n2-negocio.html`, `n3-tarjeta.html`, `n4-qr-mostrador.html`.
- Copy existente: `web/src/content/alta.ts`. «Muy pronto» es la marca para lo que no existe.
- Eventos: la vista previa del QR no emite `qr_mostrador_descargado`. La descarga sí.

## Alcance

### Dentro

- Barra de N1 a N4 como estado, no como navegación. Abrir `/panel/alta` muestra la cuenta.
- Hover y presión de los botones del alta, con los tokens ya aprobados.
- Miniatura del logo en N2, interruptor de N3 y cartel de N4 a 300×400 px con el QR de registro.
- En N4, «Ir a Mostrador» inactivo y la palabra «Muy pronto».

### Fuera

- Construir N0 o N5 Mostrador.
- Landing, PRD, decisiones y ADR.
- Cambiar el contrato de `servidor.crear_negocio`, `servidor.completar_alta` o el evento de descarga.

## Tareas

| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | Pasos cerrados al avanzar | — | - La barra de pasos no tiene enlaces y el paso actual lleva aria-current step (spec) <br> - Abrir /panel/alta deja la cuenta en pantalla, también con sesión (spec) <br> - Atrás de N2 no abre /panel/alta; N3 y N4 sí regresan al paso anterior |
| T2 | Hover y presión de los botones del alta | — | - Primario y secundario usan cursor pointer, borde de 2.5 px al hover y, al presionar, se desplazan 4 px y apagan la sombra <br> - El hover solo aplica con hover hover y el desplazamiento respeta prefers-reduced-motion <br> - Sin colores nuevos |
| T3 | Miniatura del logo en N2 | — | - Al elegir un archivo se ve la imagen en el recuadro; sin archivo siguen las iniciales <br> - El archivo se sigue enviando en el formulario <br> - La URL temporal se revoca al cambiar o desmontar |
| T4 | Interruptor del sello de bienvenida | — | - El círculo queda a la izquierda apagado y a la derecha encendido, sobre un área de al menos 44 px <br> - Conserva role switch y aria-checked <br> - La vista previa sigue mostrando 1/N solo con el interruptor prendido |
| T5 | El cartel muestra el QR de registro | — | - La vista previa es una imagen del destino /c/slug y no sale de /panel/api/cartel <br> - Abrir N4 no emite qr_mostrador_descargado (spec) <br> - Descargar PDF o PNG sigue emitiendo el evento una vez por descarga |
| T6 | El cartel deja de ser un rectángulo alto | T5 | - El marco mide 300 por 400 px y no se estira con el formulario (spec) <br> - Lleva el texto Escanéame con tu cámara y Hecho con LealTab <br> - Sin destino, el mismo marco muestra la ayuda y no un bloque vacío estirado |
| T7 | N4 ofrece Ir a Mostrador como Muy pronto | — | - El botón Ir a Mostrador está inactivo y se lee Muy pronto (spec) <br> - N4 ya no enlaza a Ajustes <br> - Atrás sigue yendo a la tarjeta |

## Por definir

- Nada. N5 queda fuera: se muestra «Muy pronto» hasta que exista Mostrador.

## Pendientes para Aarón

- El cierre, antes del commit.
