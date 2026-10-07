# LealTab — Plan de trabajo

Coordina: LealTab PM. Fuente: `00-brief/resumen-inicial.md`.
Regla: **ninguna fase avanza sin la aprobación de Aarón.**

## Decisiones cerradas

| Elemento | Decisión | Estado |
|---|---|---|
| Nombre | **LealTab** (marca madre; no se comunica el origen "Tab" = Tabasco) | ✅ Definido |
| Dominio | `lealtab.com` (principal) | ✅ Adquirido |
| Redes sociales | `@getlealtab` (el "get" no forma parte del nombre ni del logo) | ✅ Dirección elegida |
| Arquitectura de marca | LealTab como marca madre. Dentro del producto los módulos llevan nombres en español: Tarjeta, Clientes, Avisos, Campañas, Reportes. "LealTab + nombre" queda solo para la API o la expansión. Al lanzar hay Tarjeta y Clientes (reemplaza la lista preliminar Wallet, Rewards, etc.) | ✅ Aprobado (Fase 1) |
| Planes | Inicio, Negocio y Pro | ✅ Aprobado (Fase 1) |
| Misión | "Ayudar a los negocios a que sus clientes regresen, con tecnología de lealtad fácil de usar, confiable y de primer nivel." | ✅ Aprobado (Fase 1) |
| Visión | "Que cualquier negocio, del local de la esquina a la cadena más grande y en cualquier país, tenga en LealTab la plataforma para conocer a sus clientes y hacer que regresen." | ✅ Aprobado (Fase 1) |
| Personalidad y voz | Simple, Confiable, Humana y Premium. La voz va de tú. Detalle en `01-brand-strategy/identidad-de-marca.md` | ✅ Aprobado (Fase 1) |
| Lema de marca | "Haz que tus clientes siempre regresen." | ✅ Aprobado (Fase 1) |
| Frase de producto | "Tu tarjeta digital siempre a un toque." | ✅ Aprobado (Fase 1) |
| Audiencia inicial | PyMEs mexicanas de visita recurrente: cafeterías, estéticas, barberías, gimnasios | ✅ Confirmado (Fase 1) |
| Formato de la tarjeta al lanzar | Solo web, como app instalable en la pantalla de inicio (PWA). Apple y Google Wallet llegan después como función; la marca habla de "tarjeta digital", no de Wallet | ✅ Confirmado (Fase 1) |
| Posicionamiento | Lanzar con la Propuesta A ("la tarjeta digital más simple y bonita", la tarjeta es la protagonista) y pasar después a la Propuesta B ("la plataforma de lealtad seria que crece con tu negocio", la retención es la protagonista). Detalle en `01-brand-strategy/audiencia-y-posicionamiento.md` | ✅ Aprobado (Fase 1) |

### Cuándo pasar de la Propuesta A a la B

La marca no cambia desde el día uno (nombre, logo, personalidad premium, lema). Pasar a B es reescribir mensajes, no hacer un rebranding, y depende de señales, no de una fecha:
1. Ya existe un tablero real de retención y al menos una segunda función, como avisos o campañas.
2. Hay negocios piloto con resultados que se puedan contar.
3. Los clientes piden varias sucursales, datos o herramientas para atraer clientes.

### Precios (hipótesis que se valida en el piloto) ✅ Aprobado

- Prueba gratis de 14 a 30 días.
- Plan de entrada: $199 a $299 MXN al mes.
- Plan principal: alrededor de $449 MXN al mes.
- Plan Pro: $899 a $1,199 MXN al mes; llega después, junto con el paso a la Propuesta B.
- En el piloto se prueban precios distintos con negocios parecidos, y cada negocio tiene un precio de fundador anunciado por escrito desde el inicio.

### Piloto ✅ Aprobado

Barberías, estéticas y salones de belleza, negocios de tapioca y cafeterías, hasta 20 negocios, idealmente en Villahermosa. Gimnasios quedan para después. Aarón recluta a los negocios en persona; cada uno tiene **un mes de prueba gratis, que es su piloto**, y al terminar se mide si paga (desde $299 sin IVA). Altas para el Gate 1 hasta el 17 nov; Gate 1 el 23 dic; los que entren después empiezan el 7 ene (ver D-004 en `docs/decisiones.md`).

> **Cambio 2026-10-07 (Aarón):** se suman las cafeterías y el piloto se amplía de 5–10 a 20 negocios. Antes: "Barberías, estéticas y negocios de tapioca, entre 5 y 10 negocios… Cafeterías y gimnasios quedan para después." En la landing, por ahora, las cafeterías aparecen en la línea final de Para quién (no como fila propia).

### Elementos de confianza ✅ Aprobado

- Desde el día uno (MVP): tablero básico de quién regresa, soporte por WhatsApp, precios públicos con alta sin llamada de ventas, datos exportables y aviso de privacidad.
- Después: factura CFDI, pagos en OXXO o SPEI, página de seguridad y API pública.

Detalle en `01-brand-strategy/audiencia-y-posicionamiento.md` (sección final).

### Decisión menor pendiente

- Si el plan Pro puede quitar la leyenda "Hecho con LealTab".

### Identidad visual (Fase 3) ✅ Cerrada (2026-10-06)

- Logo aprobado: masters congelados (`logo/master/`), sistema de variantes (`logo/sistema/`), íconos digitales y favicon opción B (`logo/iconos/`), área de protección y tamaños mínimos, usos correctos/incorrectos (`logo/uso/`), paquete de exportaciones (`logo/entregables/`, 131 archivos). Los archivos viejos v1.0 están en `logo/_obsoleto-v1.0/` y no están aprobados. Durazno no se usa como fondo del logo (se reserva para la recompensa completada).
- Paleta aprobada: lino `#F3EFE6`, blanco lino `#FFFDF8`, noche `#0F2A22`, bosque `#0F4D3A`, durazno `#FF9F6E` (solo acento), menta gris `#CFE3D6`, gris noche `#4D635A`. Tipografía: Archivo condensado 800 (títulos) y Manrope (texto). Detalle en `paleta-y-tipografia.md`.
- Recursos gráficos aprobados en `recursos/`: 18 íconos, aro de progreso, ilustraciones de los tres oficios del piloto y stickers.
- Brand book aprobado (24 páginas) en `brand-book/`.
- Pendientes abiertos (fuera del cierre de fase): validar CMYK con la imprenta; búsqueda de marca en el IMPI (clases 9/35/42) y la WIPO; colores de éxito, riesgo y error (provisionales hasta la Fase 4); fotografía propia del piloto.

### Implicaciones para fases siguientes

- Fases 2 y 3: la identidad visual no debe girar en torno a una tarjeta.
- Fase 5: la web puede incluir una sección de "Lo que viene".
- Fase 5: precios públicos con alta sin llamada de ventas; mensajes y materiales pensados para las barberías, estéticas y tapiocas del piloto.
- Fases 6 y 7: el MVP es una tarjeta web instalable (PWA); Apple y Google Wallet quedan para después. El MVP incluye tablero básico de quién regresa, soporte por WhatsApp, exportación de datos y aviso de privacidad; CFDI, OXXO/SPEI, página de seguridad y API pública van después.

### Design system (Fase 4) ✅ Cerrada (2026-10-06)

- Tokens (pieza 1) ✅ Aprobados (2026-10-06): color, tipografía, espacio, radios, bordes, sombras, movimiento, retícula y colores de estado. Archivos en `04-design-system/`.
- Botones y campos (pieza 2) ✅ Aprobados (2026-10-06): `04-design-system/02-botones-y-campos.md`.
- Cards y estados (pieza 3) ✅ Aprobados (2026-10-06): `04-design-system/03-cards-y-estados.md`.
- Tablas y formularios (pieza 4) ✅ Aprobados (2026-10-06): `04-design-system/04-tablas-y-formularios.md`.
- Patrones (pieza 5) ✅ Aprobados (2026-10-06): `04-design-system/05-patrones.md`.
- Las 5 piezas del Design System están aprobadas.

### Marketing (Fase 5) — en curso

- Estructura de landing ✅ (`05-marketing/01-estructura-landing.md` v1.1). Precios en landing: prueba gratis 30 días; Inicio $299 MXN/mes + IVA (200 clientes, 1 tarjeta, 1 sucursal); Negocio ~$449 + IVA, recomendado (ilimitado, varias tarjetas, hasta 3 sucursales); Pro «Próximamente» sin precio; precio de fundador solo en trato directo con el piloto.
- Copy de landing ✅ (`02-copy-landing.md` v1.1): CTA en bosque; al terminar la prueba, pausa + exportación; soporte por WhatsApp.
- Mockup visual de landing y pulido v1.1 ✅ (`03-mockup-landing.html`).
- Kit de redes @getlealtab ✅ (`04-kit-redes.md` + `kit-redes/`).
- Pitch para el piloto ✅ (`05-pitch-piloto.pdf`, 10 páginas).
- Dirección visual de la landing v1.2 🟡 (2026-10-07): análisis en `../lealtab-analisis-landing-ciclo-v2.md`. El mockup v1.1 no aplicaba las reglas de Ciclo v2 para la landing (aro protagonista, sticker, botón con flecha en bloque). Decisiones: el lema pasa al titular del hero y la frase de producto a subtítulo; los bloques de capítulo van en bosque. Copy actualizado a v1.2 (`02-copy-landing.md`). Estructura v1.2 en archivo nuevo (`01-estructura-landing-v1.2.md`; la v1.1 aprobada se conserva). Nueva versión del mockup en `03-mockup-landing-v1.2.html` con las 8 secciones rediseñadas (hero, Cómo funciona, La tarjeta, Para quién, Precios, Confianza, Lo que viene y cierre con FAQ); la v1.1 se conserva. Titular del cierre: "Crea tu tarjeta hoy."

## Dirección creativa aprobada (Fase 2)

- Ruta: **Ciclo v2**, arcos que se completan con cada visita, con un estilo entre minimalismo y neobrutalismo.
- Contornos y sombras duras en noche `#0F2A22`.
- Paleta exploratoria: lino `#F3EFE6`, noche `#0F2A22`, verde bosque `#0F4D3A`, durazno `#FF9F6E`, menta gris `#CFE3D6` (se cierra en la Fase 3).
- Tipografía de dirección: títulos en Archivo condensada 800; texto y cifras en Manrope.
- Un aro grande por pieza y stickers con significado.
- Archivos en `02-creative-direction/`: `rutas-creativas.md`, `ruta-ciclo-v2.png`, `ruta-ciclo-v2-reglas.png`, `moodboard.md` y las tres láminas `moodboard-*.png`. Referencias de Aarón en `02-creative-direction/referencias/`.

## Fases

| # | Fase | Carpeta | Responsable | Estado |
|---|---|---|---|---|
| 1 | Brand Strategy: misión, visión, audiencia, posicionamiento, propuesta de valor, personalidad, diferenciadores, voz y tono, arquitectura de marca | `01-brand-strategy/` | Estrategia de Marca | ✅ Cerrada (2026-10-04) |
| 2 | Creative Direction: moodboard, referencias, estilo visual, fotografía e ilustración, composición, movimiento, dirección estética | `02-creative-direction/` | Dirección Creativa e Identidad | ✅ Cerrada (2026-10-04) |
| 3 | Visual Identity: paleta, tipografías, isotipo, logotipo, variantes, favicon, iconografía, recursos gráficos, brand book | `03-visual-identity/` | Dirección Creativa e Identidad | ✅ Cerrada (2026-10-06) |
| 4 | Design System: tokens, spacing, radius, grids, componentes, formularios, cards, tablas, estados, patrones | `04-design-system/` | Diseño de Producto | ✅ Cerrada (2026-10-06) |
| 5 | Marketing: landing page, redes, emails, presentaciones, otros materiales | `05-marketing/` | Marketing y Lanzamiento | 🟡 En curso |
| 6 | Product Design: dashboard, UX, módulos, flujos principales | `06-product-design/` | Diseño de Producto (por crear) | ⏳ Pendiente |
| 7 | Desarrollo: implementación sobre la base de estrategia, identidad y producto | `07-desarrollo/` | Desarrollo (por crear) | ⏳ Pendiente |

Los agentes de cada fase se crean cuando esa fase empieza; LealTab PM avisa a Aarón en ese momento.

## Lineamientos de marca (del brief)

- Personalidad preliminar: moderna, tecnológica, simple, confiable, humana, premium.
- Evitar parecer "software de puntos y cupones para cafeterías".
- Referencia de nivel (sin copiar): Stripe, Linear, Clerk, Resend, Vercel, Ramp, Mercury.
- El isotipo no debe depender de una tarjeta.

## Bitácora

- 2026-10-03: Plan creado. Fase 1 arranca con Estrategia de Marca.
- 2026-10-04: Aarón confirmó la audiencia inicial y la tarjeta web instalable (PWA) al lanzar. Panorama de competidores en `01-brand-strategy/competidores.md`.
- 2026-10-04: Aarón aprobó el posicionamiento (A al lanzar, B después según señales), el lema de marca y la frase de producto.
- 2026-10-04: Aarón aprobó la hipótesis de precios, el piloto (5 a 10 barberías y estéticas, idealmente en Villahermosa) y los elementos de confianza del MVP.
- 2026-10-04: Aarón aprobó la identidad de marca (misión, visión, personalidad, voz, arquitectura y planes). El piloto suma negocios de tapioca en Villahermosa. Fase 1 con todos sus entregables; falta el visto bueno para cerrarla.
- 2026-10-04: Aarón ajustó la misión ("fácil de usar" en lugar de "simple"). Aarón cerró la Fase 1 y aprobó arrancar la Fase 2 (Creative Direction).
- 2026-10-04: Aarón eligió la ruta Ciclo y aprobó Ciclo v2 y el moodboard completo. Fase 2 cerrada. La Fase 3 espera su luz verde.
- 2026-10-04: Aarón dio luz verde a la Fase 3 (Visual Identity).
- 2026-10-05: Logo v0.6 en revisión (no aprobado). Aarón quiere ver primero los ajustes aplicados.
- 2026-10-05: Logo final v1.0 exportado con los ajustes aplicados (variantes, favicon e íconos PWA). Pendiente la revisión de Aarón.
- 2026-10-05: Aarón congeló masters horizontal y vertical, aprobó sistema de variantes, íconos digitales y área de protección/tamaños mínimos.
- 2026-10-06: Aarón aprobó usos del logo, exportaciones finales, recursos gráficos, paleta y tipografía, y el brand book. Fase 3 cerrada.
- 2026-10-06: Aarón dio luz verde a la Fase 4 (Design System). Se crea el bot Diseño de Producto.
- 2026-10-06: Aarón aprobó los tokens de la Fase 4 (pieza 1). Sigue componentes base.
- 2026-10-06: Aarón aprobó botones y campos (Fase 4, pieza 2). Sigue cards y estados.
- 2026-10-06: Aarón aprobó cards y estados (Fase 4, pieza 3). Sigue tablas y formularios.
- 2026-10-06: Aarón aprobó tablas y formularios (Fase 4, pieza 4). Sigue patrones (última pieza).
- 2026-10-06: Aarón aprobó patrones (Fase 4, pieza 5). Las 5 piezas del Design System están listas; falta el visto bueno para cerrar la fase.
- 2026-10-06: Aarón cerró la Fase 4 y dio luz verde a la Fase 5 (Marketing). Se crea Marketing y Lanzamiento.
- 2026-10-06: Aarón aprobó el copy de la landing (`05-marketing/02-copy-landing.md`). Inicio: 200 clientes / 1 tarjeta / 1 sucursal; Negocio: ilimitado / varias tarjetas / hasta 3 sucursales. CTA bosque. Fin de prueba: pausa + export. Soporte WhatsApp sin nombre/horario. Pro solo Próximamente.
- 2026-10-06: Aarón aprobó la estructura de la landing (`05-marketing/01-estructura-landing.md`). Decisiones: prueba 30 días; Inicio $299 + IVA; Negocio ~$449 + IVA; Pro Próximamente sin precio; precio de fundador solo en piloto.
- 2026-10-06: Pulido v1.1 del mockup de landing (`05-marketing/03-mockup-landing.html`): responsive, microinteracciones del aro, FAQ y a11y.
- 2026-10-06: Aarón aprobó en la Fase 5 la estructura, el copy, el mockup de la landing (v1.1), el kit de redes y el pitch del piloto.
- 2026-10-07: Aarón decidió llevar el lema al titular del hero (la frase de producto pasa a subtítulo) y usar bosque en los bloques de capítulo de la landing. Copy v1.2 y mockup v1.2 en curso, empezando por el hero.
- 2026-10-07: Mockup v1.2 con hero y Cómo funciona rediseñados (titular fijo, aro de avance de 3 pasos y muestras reales de la interfaz). Estructura v1.2 creada como archivo nuevo.
- 2026-10-07: Mockup v1.2: La tarjeta rediseñada (una tarjeta con selector de negocio, banda menta, instalación sin cajas).
- 2026-10-07: Mockup v1.2: Para quién rediseñada (filas alternadas con ilustraciones sueltas sobre lino).
- 2026-10-07: Corrección de aros en el mockup v1.2: el aro de interfaz va plano (carril menta, avance bosque, cifra dentro) sobre panel blanco lino; los aros de marketing llevan contorno de 3 px y sombra de 6 px. Aarón decidió que el durazno es solo para el aro completo: se quitó del hero.
- 2026-10-07: Aarón revirtió la decisión del durazno: el hero mantiene la visita 5 en durazno, en el aro grande y en el aro del teléfono (excepción a la regla de `recursos.md`).
- 2026-10-07: Mockup v1.2: Precios rediseñados; "Recomendado" pasa de durazno a menta (aprobado por Aarón).
- 2026-10-07: Mockup v1.2: Negocio con más peso en Precios (bloque bosque, más ancho y alto). Confianza rediseñada (cuadrícula de compromisos sin cajas).
- 2026-10-07: Mockup v1.2: Lo que viene pasa a capítulo en bosque, con titular display y lista sin cajas ("Próximamente" como etiqueta de texto).
- 2026-10-07: Aarón eligió "Crea tu tarjeta hoy." como titular del cierre. Mockup v1.2 completo: cierre con aro que se completa en durazno y sticker "¡Recompensa lista!"; FAQ en dos columnas sin cajas. Pendiente: revisión de Aarón del mockup v1.2 completo.
- 2026-10-07: Menú v1.2: lino sólido (sin vidrio esmerilado), sección activa, "Entrar" separado de las anclas, CTA firma y menú móvil a pantalla completa.
- 2026-10-07: Menú: se agregan "La tarjeta" y "Preguntas"; texto de escritorio a 16 px; menú completo desde 1024 px.
- 2026-10-07: Cierre: "5/5 cortes" dentro del aro completo (cierra el 4/5 del hero). Footer v1.2 en bosque, con logo lino, lema grande y enlaces por columnas.
- 2026-10-07: FAQ: la que cierra y la que abre se animan juntas (sin salto del footer). Menos líneas divisorias: secciones separadas por espacio y fondos; Confianza pasa a banda blanco lino (se probó menta y Aarón la descartó).
- 2026-10-07: Lo que viene: mosaicos en noche con íconos aprobados en lugar de filas con líneas.
- 2026-10-07: Ícono nuevo Cartera (línea y activo) para Apple y Google Wallet, en `recursos/iconos/`. Propuesta pendiente de aprobación; aún no entra al sprite ni al brand book.
- 2026-10-07: A Aarón le gusta cómo quedó la v1.2. Se crea `03-mockup-landing-v1.3.html` (copia de la v1.2) con una capa de movimiento: entrada del hero, aparición escalonada, estados de Cómo funciona, Negocio que se levanta de su sombra y hovers. La v1.2 se conserva.
- 2026-10-07: Entrada del hero más pausada en la v1.3 (texto 900 ms, celular 950 ms). Se crea `03-mockup-landing-v1.4.html` (copia de la v1.3) con tres microinteracciones: editor vivo en Cómo funciona, "Suma una visita" en La tarjeta y enlaces de Para quién a La tarjeta. Microcopy nuevo pendiente de aprobación.
- 2026-10-07: v1.4, segunda tanda: guía según el celular, "Mostrar mi código" con QR, íconos de Confianza que se dibujan, ejemplo de aviso en Lo que viene, checks escalonados en Negocio y filas de clientes con motivo.
- 2026-10-07: v1.4: el CTA del menú entra al salir del hero (enlaces fijos en cuadrícula de tres columnas) y los stickers se enderezan al pasar el mouse.
- 2026-10-07: Se crea `03-mockup-landing-v1.5.html` (copia de la v1.4): el editor del paso 1 suma "Visitas para tu recompensa" (3–12) y la recompensa pasa a ser solo el premio; la vista previa queda coherente (0/N y "Al completar N"). Ilustrativo hasta la Fase 6.
- 2026-10-07: Se instala el skill `design-taste-frontend` (Leonxlnx/taste-skill) a nivel proyecto. Se crea `03-mockup-landing-v1.6.html` con su revisión en modo "Redesign: Preserve": 3 correcciones aplicadas y 6 propuestas para decisión en `05-marketing/06-revision-taste-skill.md`.
- 2026-10-07: v1.6: Aarón aplicó Avisos destacado en menta. El cierre centrado tipo manifiesto se probó y se descartó; el cierre vuelve al de la v1.5.
- 2026-10-07: Se instala el skill `redesign-existing-projects` (Leonxlnx/taste-skill). Se crea `03-mockup-landing-v1.7.html` con su auditoría: metaetiquetas e imagen para compartir, saltar al contenido, accesibilidad, grano de papel, FAQ abierto y "Términos y condiciones" en el footer (que conserva sus tres columnas). Informe en `05-marketing/07-auditoria-redesign-skill.md`.
- 2026-10-07: Aarón suma las cafeterías al piloto y lo amplía a 20 negocios. En la landing v1.7, "Estéticas" pasa a "Estéticas y salones de belleza" y la línea final de Para quién nombra cafeterías y gimnasios. Pendiente: actualizar los documentos que aún dicen 5 a 10 negocios y tres oficios.
- 2026-10-07: Documentos actualizados a 20 negocios y cuatro oficios: `01-brand-strategy/audiencia-y-posicionamiento.md`, `docs/02-plan-de-trabajo.md` (umbrales del Gate 1 escalados a 20, pendientes de confirmar), `docs/03-propuesta.md`, nota en `docs/01-validacion-idea.md` y decisión D-003 en `docs/decisiones.md`. Se conservan como registro la bitácora y `01-estructura-landing.md` v1.1.
- 2026-10-07: Aarón define el formato del piloto con `lealtab-analista-metricas` (D-004): él recluta en persona; un mes de prueba gratis por negocio como piloto; conversión a pago al terminar; altas hasta el 17 nov y Gate 1 el 23 dic con criterio único; reclutamiento durante la Fase 2. Actualizados `docs/02-plan-de-trabajo.md`, `docs/03-propuesta.md` y `docs/decisiones.md`.
