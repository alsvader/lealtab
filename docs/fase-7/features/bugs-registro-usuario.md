# Feature: Bugs del registro del cliente

**Estado:** T1 a T4 implementados en el worktree, sin commit. T5 sigue para otro worktree. Plane no se sincronizó: Aarón pidió saltarlo (11 nov 2026). Cuando el túnel vuelva, desde `web/`: `pnpm plane:sync crear ../docs/fase-7/features/bugs-registro-usuario.md`.
**Fase:** 7 · **Rama:** `fix/bugs-registro-usuario` (T1 a T4). T5 va en otro worktree.
**Cubre:** RF-APP-02, RF-TAR-02, RF-ALT-05 · **Pantallas:** C1, C3 · **Flujos:** F2
**Restricciones:** D-031, D-016, D-019, ADR-003. Origen: `bugs/registro-usuario.md`.

## Objetivo

Corregir lo que Aarón vio al registrarse en `/c/{slug}/registro`: el logo, el botón del código, la barra de los dos pasos y la pantalla en la que se queda al confirmar. El rediseño de la tarjeta queda aparte.

## Fuentes

- Registro de Aarón: `bugs/registro-usuario.md`
- Diseño: `brand/06-product-design/08-registro-con-codigo.md` (CA-C1.1, CA-C1.12, CA-C1.22, CA-C1.25, CA-R1.4) y la barra de `tarjeta-cliente/c1-registro-con-codigo.html` (`.stp`: inactiva en menta, activa en bosque)
- Tarjeta: `brand/06-product-design/02-tarjeta-cliente.md` (C3) y RF-TAR-02
- Copy: `docs/fase-7/microcopy.md` §1 y `web/src/content/registro.ts`

## Contraste con la web

| Bug | Qué pasa hoy | Fix |
|---|---|---|
| Logo | El encabezado de `/c/{slug}/registro` siempre pinta las iniciales. `negocio_publico` ya trae `logo_path` y `/c/logo/{slug}` ya sirve el archivo, pero `leerNegocioPublico` no lo lee. | Pasar solo `tieneLogo`. Si hay logo, mostrar `/c/logo/{slug}`. Si no, las iniciales. |
| Botón | «Enviarme el código» se puede pulsar con el formulario vacío. El error sale después, al enviar. CA-C1.3 y la spec `registro-paso1` están escritos así. La revisión de Aarón pide lo contrario. | El botón nace deshabilitado y se habilita con nombre, WhatsApp de 10 dígitos y la casilla. No se muestra error mientras se escribe. Hay que actualizar la spec. |
| Barra | Solo existe en el paso 1, con el texto fijo «Paso 1 de 2». La primera barra es bosque y la segunda es `bg-border`, que en los tokens es noche (`#0f2a22`), casi el mismo verde oscuro que bosque (`#0f4d3a`). Por eso las dos se ven completas. En el paso del código la barra desaparece. La maqueta deja la inactiva en menta y, en el paso 2, enciende las dos y dice «Paso 2 de 2». | Misma barra en los dos pasos: paso 1, una en bosque y una en menta; paso 2, las dos en bosque y el texto «Paso 2 de 2». |
| Después del código | Al verificar, el formulario se queda en un cuadro («Tu tarjeta está lista») y no abre `/c/{slug}`. Si la página vuelve a cargar ya con la cookie, `/registro` pinta `TarjetaExistente`: el cuadro «Ya tienes tu tarjeta de {negocio}.», sin QR y sin enlace. La tarjeta con el QR solo está en `/c/{slug}`. CA-C1.25 y CA-R1.4 dicen abrir esa tarjeta. | Tras un código válido, ir a `/c/{slug}`. Si ya tiene tarjeta y abre `/registro`, redirigir ahí. |
| Diseño de la tarjeta | C3 (`vista-tarjeta.tsx`) es un recuento, un QR y texto. La pieza 02 pide aro de progreso, logo y recompensa. Aarón lo deja para otro worktree. | No se toca en la rama de T1 a T4. |

## Alcance

### Dentro

- T1 a T4 en `web/`, en la rama `fix/bugs-registro-usuario`, con las specs de `e2e-producto/registro-*.spec.ts` que cambien.
- T5 solo como work item. El diseño de C3 se hace en otro worktree.

### Fuera

- C2 y el `install_token`. Siguen en `pwa-instalacion`. Este round abre C3 al confirmar el código.
- Recuperar el paso 2 desde `sessionStorage` si el navegador recarga (CA-C1.14). El formulario lo escribe y nadie lo lee. No está en el registro de Aarón.
- El cuadro de éxito de R1 (segundo negocio), que tampoco abre C3. No está en `bugs/registro-usuario.md`.
- Reenvío, SMS, límites y el hook de SMS Masivos.

## Tareas

| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | Mostrar el logo del negocio en el registro | — | - Con logo, el encabezado de `/c/{slug}/registro` muestra la imagen de `/c/logo/{slug}` (spec) <br> - Sin logo, siguen las iniciales (spec) <br> - El cliente no recibe `logo_path` |
| T2 | Activar «Enviarme el código» solo con el formulario listo | — | - Al entrar, el botón está deshabilitado (spec) <br> - Se habilita con nombre, WhatsApp de 10 dígitos y la casilla marcada (spec) <br> - Sin la casilla no hay POST a `/c/api/auth/codigo` (spec) <br> - Mientras se escribe no aparece el error en rojo |
| T3 | La barra marca solo el paso en curso | — | - En el paso 1 el texto es «Paso 1 de 2», la primera barra es bosque y la segunda menta (spec) <br> - En el paso 2 el texto es «Paso 2 de 2» y las dos barras son bosque (spec) <br> - La barra inactiva no usa el color de borde |
| T4 | Abrir la tarjeta con QR al confirmar el código | — | - Tras un código válido la URL pasa a `/c/{slug}` y se ve el QR (spec) <br> - Si ya tiene tarjeta y abre `/registro`, llega a `/c/{slug}` y no al cuadro «Ya tienes tu tarjeta» (spec) <br> - El navegador no llama a Supabase (spec) |
| T5 | Rediseñar la tarjeta del cliente en otro worktree | — | - No se implementa en la rama de T1 a T4 <br> - El trabajo vive en un worktree de diseño de C3 contra la pieza 02 <br> - Cubre aro de progreso, logo, recompensa y QR grande (RF-TAR-02) |

## Por definir

- Nada bloquea T1 a T4. El botón deshabilitado sustituye, para este flujo, el error al pulsar sin casilla de CA-C1.3. Lo pidió Aarón en `bugs/registro-usuario.md`.

## Pendientes para Aarón

- Decir cuándo se implementan T1 a T4.
- Abrir el worktree de T5 cuando toque el rediseño de C3.
- Cuando Plane vuelva, correr el `plane:sync` de arriba. No se creó ningún work item.
