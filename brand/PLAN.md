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

- Prueba gratis de 14 a 30 días. *(Resuelto: 30 días, D-006.)*
- Plan de entrada: $199 a $299 MXN al mes.
- Plan principal: alrededor de $449 MXN al mes.
- Plan Pro: $899 a $1,199 MXN al mes; llega después, junto con el paso a la Propuesta B.
- En el piloto se prueban precios distintos con negocios parecidos, y cada negocio tiene un precio de fundador anunciado por escrito desde el inicio.

### Piloto ✅ Aprobado

Barberías, estéticas y salones de belleza, negocios de tapioca y cafeterías, hasta 20 negocios, idealmente en Villahermosa. Gimnasios quedan para después. Aarón recluta a los negocios en persona; cada uno tiene **30 días de prueba gratis, que son su piloto**, y al terminar se mide si paga (desde $299 sin IVA). Sin calendario: hay un corte de altas para la primera tanda (Por definir), que es la que cuenta para el Gate 1; los que entren después forman la segunda tanda y cuentan para el Gate 2. El Gate 1 se evalúa cuando todos los de la primera tanda terminan su prueba y su ventana de cobro, con los criterios de D-004 (ver `docs/decisiones.md` y la Fase 8 de `docs/02-plan-de-trabajo.md`).

> **Historial:** las fechas que tenía este punto (altas hasta el 17 nov, Gate 1 el 23 dic, segunda tanda el 7 ene) y la meta de "MVP en producción el 8 nov" ya no rigen. Desde el 2026-10-20 el plan va por fases con criterio de salida, sin fechas.

> **Cambio 2026-10-07 (Aarón):** se suman las cafeterías y el piloto se amplía de 5–10 a 20 negocios. Antes: "Barberías, estéticas y negocios de tapioca, entre 5 y 10 negocios… Cafeterías y gimnasios quedan para después." En la landing, por ahora, las cafeterías aparecen en la línea final de Para quién (no como fila propia).

### Elementos de confianza ✅ Aprobado

- Desde el día uno (MVP): tablero básico de quién regresa, soporte por WhatsApp, precios públicos con alta sin llamada de ventas, datos exportables y aviso de privacidad.
- Después: factura CFDI, pagos en OXXO o SPEI, página de seguridad y API pública.

Detalle en `01-brand-strategy/audiencia-y-posicionamiento.md` (sección final).

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

### Product Design (Fase 6) ✅ Cerrada (2026-10-20)

- Piezas 01 a 07 aprobadas en `06-product-design/`: mapa de flujos, tarjeta del cliente C1-C4, N5 Mostrador y N6 Quién regresa, alta N1-N4, N0 Inicio, N7 Clientes, N8 Ajustes y C0 Mis tarjetas, estados de error y vacío, y la hoja de entrega con `entrega/mapa-pantallas.png`.
- **C5 Mis datos** (ver y borrar la cuenta) está en el alcance del MVP (D-010), pero **todavía no tiene wireframe**. Se diseña al arrancar la Fase 7.
- El bloqueo contra el doble escaneo es fijo de **2 minutos** (D-014, decidido el 2026-10-21).
- PRD del MVP: borrador en revisión en `docs/prd/PRD-lealtab-mvp.md` (v1.4).
- **Pendiente (Diseño de Producto):** ajustar la pantalla N1 para entrar con contraseña además del código por correo, con el flujo de recuperación (restablecer contraseña por correo). Lo pide el cambio de D-005 del 2026-10-21.
- **Pendiente:** costo y configuración de la API de WhatsApp Business para el código de recuperación de la tarjeta del cliente (cuenta, número, plantilla aprobada y costo por mensaje). Lo pide el cambio parcial de D-011 del 2026-10-21.
- **Pendiente antes del piloto:** actualizar el aviso de privacidad para cubrir los eventos de uso de la analítica propia sin cookies (D-018).
- **Pendiente (Por definir):** qué pasa al llegar al límite de 200 clientes del plan Inicio después del piloto, y si cuentan los clientes totales o los activos. Durante el piloto no hay límite (D-020).
- **Pendiente (Por definir):** quién cuenta como negocio que paga en el Gate 1 (criterio b, hoy ≥ $299 sin IVA). Se decide cuando se fije el precio especial de piloto, porque depende de él (decisión de Aarón, 2026-10-21).
- Sucursales (D-021): el MVP maneja una sola sucursal; varias, hasta 3, llegan después.
- Stack del producto decidido (D-023, `docs/adr/002-stack.md`): Next.js en `web/`, Tailwind + shadcn/ui, pnpm, Supabase (Postgres, Auth, RLS por `negocio_id`, tabla propia de eventos) y Vercel. Por definir: el proveedor del código por WhatsApp (hook de Supabase Auth) y la librería de escaneo de QR.
- ~~Pendiente (repo): quitar PostHog de los agentes~~ ✅ Hecho el 2026-10-21 (estaba en `lealtab-arquitecto.md`).
- Todo el código de la app vive en `web/`, incluidos Supabase (`web/supabase/migrations`) y Docker (aclaración de D-023, 2026-10-21).
- Criterio de salida de la Fase 7 (Desarrollo): ver `docs/02-plan-de-trabajo.md`.

### Marketing (Fase 5) — ⏸️ En pausa (2026-10-20)

- Estructura de landing ✅ (`05-marketing/01-estructura-landing.md` v1.1). Precios en landing: prueba gratis 30 días; Inicio $299 MXN/mes + IVA (200 clientes, 1 tarjeta, 1 sucursal); Negocio ~$449 + IVA, recomendado (ilimitado, varias tarjetas, hasta 3 sucursales); Pro «Próximamente» sin precio; precio de fundador solo en trato directo con el piloto.
- Copy de landing ✅ (`02-copy-landing.md` v1.1): CTA en bosque; al terminar la prueba, pausa + exportación; soporte por WhatsApp.
- Mockup visual de landing y pulido v1.1 ✅ (`03-mockup-landing.html`).
- Kit de redes @getlealtab ✅ (`04-kit-redes.md` + `kit-redes/`).
- Pitch para el piloto ✅ (`05-pitch-piloto.pdf`, 10 páginas).
- Landing ✅ (fuente de verdad: `lealtab/web/`, el proyecto Next.js en la raíz del repo, decidido por Aarón el 2026-10-20). Lo que diga `web/` manda sobre los mockups y documentos de esta carpeta. Historial: la dirección visual v1.2 (2026-10-07, análisis en `../lealtab-analisis-landing-ciclo-v2.md`) llevó el lema al titular del hero, la frase de producto al subtítulo y los bloques de capítulo a bosque. Los mockups v1.2 a v1.7 (`03-mockup-landing-v1.*.html`), el copy v1.2 y la estructura v1.2 quedan solo como referencia histórica.
- Perfil de Instagram @getlealtab ✅ Aprobado (2026-10-07) (`07-perfil-instagram.md` + `perfil-instagram/`): avatar noche, nombre "LealTab · Tarjeta de lealtad digital", bio recomendada (134 caracteres), categoría Software, enlace lealtab.com, botón de WhatsApp, 6 destacados (4 al lanzar) y cuadrícula con 3 fijados. Los posts del perfil se suben en 3:4 (`kit-redes/34/`).
- Landing publicada en `https://www.lealtab.com` (verificado 2026-10-09 y 2026-10-12).
- Post 01 "Lema" en 3:4 ✅ Aprobado (2026-10-12): opción D tal cual, en `kit-redes/34/01-lema.png`.
- **Pendiente para Marketing (al retomar la Fase 5):** alinear la landing en `web/` con D-021. Hoy `pricing.ts` ofrece "Hasta 3 sucursales" en el plan Negocio y `roadmap.ts` lista "Varias sucursales" como "Próximamente". No se edita `web/` hasta entonces.
- Pendientes de Aarón para el perfil: confirmar que `+52 55 8806 3606` es WhatsApp Business, correo de contacto (opcional), confirmar que @getlealtab está registrado y si se diseñan los posts 8 y 9 y las historias de Instalar y Preguntas.

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
| 5 | Marketing: landing page, redes, emails, presentaciones, otros materiales | `05-marketing/` | Marketing y Lanzamiento | ⏸️ En pausa (2026-10-20); se retoma después |
| 6 | Product Design: dashboard, UX, módulos, flujos principales | `06-product-design/` | Diseño de Producto | ✅ Cerrada (2026-10-20) |
| 7 | Desarrollo: implementación sobre la base de estrategia, identidad y producto. Sale cuando un local real usa el flujo completo una semana sin errores bloqueantes, hay ≥10 pilotos confirmados por escrito de ≥3 oficios y están hechas las entrevistas del ícono y la consulta legal LFPDPPP | `docs/fase-7/` (código en `web/`) | Desarrollo (por crear) | ⏳ Pendiente |

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
- 2026-10-07: Aarón define el formato del piloto con `lealtab-analista-metricas` (D-004): él recluta en persona; un mes de prueba gratis por negocio como piloto; conversión a pago al terminar; altas hasta el 17 nov y Gate 1 el 23 dic con criterio único *(fechas históricas; ya no rigen)*; reclutamiento durante la Fase 2. Actualizados `docs/02-plan-de-trabajo.md`, `docs/03-propuesta.md` y `docs/decisiones.md`.
- 2026-10-07: Aarón aprobó el perfil de Instagram @getlealtab (`05-marketing/07-perfil-instagram.md`). Se agregaron los posts en 3:4 y se corrigió el aro de story-01.
- 2026-10-08: Marketing y Lanzamiento preparó cuatro opciones (A a D) del acomodo del post 01 "Lema" en 3:4. Pendiente la elección de Aarón.
- 2026-10-09: Se verificó que la landing está publicada en www.lealtab.com con el copy y los precios aprobados.
- 2026-10-12: Resumen semanal. Sin cambios en archivos desde el 9 oct. Fase 5 sigue en curso.
- 2026-10-12: Dirección Creativa recomienda para el post 01 la opción D, con el subtítulo de 40 px; quitar el badge «Nuevo» y bajar el aro son opcionales. Sigue pendiente la elección de Aarón.
- 2026-10-12: Aarón aprobó el post 01 "Lema" con la opción D tal cual (subtítulo a 48 px, badge y aro sin cambios). El archivo final es 05-marketing/kit-redes/34/01-lema.png y la versión anterior quedó como 01-lema-v3.png.
- 2026-10-20: Se sincronizó la carpeta con el repo local de Aarón (lealtab/brand). La landing v1.2–v1.7 se hizo aparte y vive en Next.js en lealtab/web.

- 2026-10-20: Aarón definió que la fuente de verdad de la landing es `lealtab/web/` (Next.js); los mockups v1.x de `05-marketing/` quedan como historial.
- 2026-10-20: Aarón pausó la Fase 5 (pendientes del perfil de IG: WhatsApp Business, registro de @getlealtab, posts 8-9, historias Instalar y Preguntas) y arrancó la Fase 6 (Product Design) con Diseño de Producto, para llegar al MVP del 8 nov del plan de trabajo *(fecha histórica; ya no rige)*.
- 2026-10-20: Aarón aprobó la pieza 1 de la Fase 6, el mapa de flujos del MVP (`06-product-design/01-mapa-de-flujos-mvp.md`). La visita se registra cuando el staff escanea el QR personal del cliente; si la cámara falla, se busca por WhatsApp. El QR del mostrador sirve solo para registrarse. El sello de bienvenida es un switch por negocio y lo confirma el staff. Un cliente queda «En riesgo» cuando no vuelve en más del doble de su intervalo habitual, con un mínimo de 30 días. En el MVP hay una sola cuenta compartida por negocio. La tarjeta se diseña con y sin «Hecho con LealTab» mientras se decide lo del plan Pro. Desde el día uno hay alta sin llamada de ventas, aviso de privacidad, exportación a CSV y Ayuda por WhatsApp. Lo siguiente son los wireframes C1 a C4 de la tarjeta.
- 2026-10-20: Aarón aprobó tal cual la pieza 2 de la Fase 6, la tarjeta del cliente C1 a C4 (`06-product-design/02-tarjeta-cliente.md`). Incluye registro sin contraseña con el aviso de privacidad visible, la guía para instalar la tarjeta, la tarjeta con QR personal y aro de avance, y la recompensa con su canje. Hay dos versiones, con y sin «Hecho con LealTab». Lo siguiente es el panel del negocio: N5 Mostrador y N6 Quién regresa.
- 2026-10-20: Aarón aprobó la pieza 3 de la Fase 6 (`06-product-design/03-panel-mostrador-y-quien-regresa.md`). N5 Mostrador tiene 3 estados (escanear, confirmar sello y canjear). N6 Quién regresa muestra Frecuente, En riesgo y Nuevo, con exportación a CSV y Ayuda por WhatsApp. Cambio de decisión: si el negocio prende el sello de bienvenida, se da en automático al crear la tarjeta y ya no lo confirma el staff. Además, el resumen semanal entra al MVP solo en el panel web, sin WhatsApp. Lo siguiente es N1 a N4.
- 2026-10-20: Aarón aprobó tal cual la pieza 4 de la Fase 6, alta y configuración N1 a N4 (`06-product-design/04-alta-y-configuracion.md`): alta sin llamada de ventas ni tarjeta de crédito, entrada con código por correo, datos del negocio, tarjeta de 4 a 12 sellos con el switch del sello de bienvenida y cartel del QR del mostrador. Falta confirmar en lealtab/web que el precio diga "$299 al mes (+IVA)". El cartel lleva "Hecho con LealTab". También se decidió el ADR-001: habrá una sola app LealTab, con "Mis tarjetas" en el MVP.
- 2026-10-20: Aarón aprobó tal cual la pieza 5 de la Fase 6 (`06-product-design/05-inicio-clientes-ajustes.md`) y la pantalla C0 Mis tarjetas. N0 Inicio abre con el resumen semanal y registra el evento `resumen_semanal_visto`. También quedaron N7 Clientes, con ficha e historial, y N8 Ajustes. Con esto, todas las pantallas del MVP (N0 a N8 y C0 a C4) ya están diseñadas y aprobadas.
- 2026-10-20: Aarón decidió las reglas contra el abuso de sellos. El QR del cliente cambia. Se da 1 sello por día por defecto, y el negocio puede cambiarlo en Ajustes a "1 cada X horas" o "Sin límite". Siempre hay un bloqueo de 1 a 2 min contra escaneos dobles *(fijado en 2 min el 2026-10-21)*.
- 2026-10-20: Aarón aprobó la pieza 6 de la Fase 6 (`06-product-design/06-estados-error-y-vacio.md`), con los estados de error, de vacío y de cuenta en pausa. Decisiones nuevas en 01-mapa: la app trabaja sin conexión primero (cada sello y canje lleva un id único y la firma del dispositivo, se sincroniza en segundo plano y lo que el servidor rechaza va a Clientes → Por revisar). El QR del cliente cambia cada 60 s y el mostrador lo puede validar sin conexión con 10 min de margen. El canje sin conexión solo se permite si la tarjeta está completa y se sincronizó en las últimas 24 h, con un canje como máximo. En el MVP, «Activar mi plan» abre WhatsApp, donde se envía el link de pago. El código de acceso del dueño dura 10 min. Lo siguiente es la hoja de entrega para desarrollo.
- 2026-10-20: Aarón decidió que "Hecho con LealTab" va en todos los planes, Pro incluido, tanto en la tarjeta como en el cartel. Se cierra el pendiente de la Fase 1.
- 2026-10-20: Pendiente antes del piloto: las entrevistas con dueños sobre el ícono y la consulta legal de privacidad (LFPDPPP). Ya quedaron resueltos los 6 huecos de la revisión de docs.
- 2026-10-20: Aarón aprobó la pieza 7, la hoja de entrega para desarrollo (`06-product-design/07-entrega-desarrollo.md` y `entrega/mapa-pantallas.png`), y con eso **cerró la Fase 6**. Quedan 4 preguntas que se resuelven durante el desarrollo: si el bloqueo contra doble escaneo dura 1 o 2 min (se propone 2; *cerrada el 2026-10-21: 2 min*), cuánto tiempo se guardan los datos junto con el texto legal final del aviso, la plantilla del mensaje de WhatsApp desde Clientes, y si los términos del límite de sellos se muestran en C3.
- 2026-10-21: Limpieza de contradicciones aprobada por Aarón: se quitan las fechas de calendario de `PLAN.md` y de la Fase 6 (quedan como historial), la Fase 6 queda cerrada (2026-10-20) en todos los documentos, se quita el pendiente de "Hecho con LealTab" en Pro (D-016), se unifican los nombres de eventos (`sello_registrado`, `canje_registrado`, `negocio_alta_completada` con `tanda`, más los eventos del ADR-001) en `07-entrega`, `docs/02-plan` y el PRD, la prueba se llama "30 días" en todos lados, se anota que C5 Mis datos está en alcance sin wireframe y N3 queda sin color de acento, como en la pieza 04. Decisión de Aarón: el bloqueo contra doble escaneo es fijo de 2 min (D-014). PRD del MVP en `07-desarrollo/PRD-lealtab-mvp.md`, borrador en revisión.
- 2026-10-21: Aarón cambió el acceso del dueño: entra con correo + código **o** con contraseña (revierte la parte de "solo código" de D-005). Actualizados D-005, `01-mapa`, `docs/02-plan` y el PRD. Pendiente: Diseño de Producto ajusta N1 para la contraseña y su recuperación.
- 2026-10-21: Aarón decidió que el cliente que cambia de teléfono recupera su tarjeta con un código por WhatsApp, enviado con la API de WhatsApp Business (de pago). Es un cambio parcial de D-011: el resumen semanal sigue solo en el panel. Actualizados D-011, ADR-001, el estado R1 y el PRD. Pendiente: costo y configuración de la API.
- 2026-10-21: Aarón decidió que la analítica es propia y sin cookies (D-018). Antes del piloto hay que actualizar el aviso de privacidad para cubrir los eventos de uso. Actualizados `docs/decisiones.md`, `docs/fase-2/legal-notas.md` y el PRD.
- 2026-10-21: Aarón decidió (D-019) que cada negocio guarda su propio nombre del cliente, como propone el ADR-001, con estado `activa`/`por_confirmar`; el teléfono es el único identificador global. Actualizados `docs/decisiones.md`, ADR-001, el modelo de datos de `07-entrega` y el PRD.
- 2026-10-21: Aarón decidió (D-020) que durante el piloto no hay límite de clientes en el plan Inicio. Qué pasa al llegar a 200 después del piloto queda Por definir. Actualizados `docs/decisiones.md` y el PRD.
- 2026-10-21: Aarón aclaró D-014: en "1 cada X horas" cada negocio elige X libremente; 2 h es solo una sugerencia, no un mínimo, y el piso es el bloqueo fijo de 2 min contra doble escaneo. Actualizados `docs/decisiones.md`, piezas 01 y 05, el modelo de datos de `07-entrega` y el PRD.
- 2026-10-21: Aarón decidió que quién cuenta como negocio que paga en el Gate 1 se define cuando se fije el precio de piloto (queda pendiente), y que el MVP maneja una sola sucursal; varias, hasta 3, llegan después (D-021). Actualizados `docs/decisiones.md`, `audiencia-y-posicionamiento.md`, `docs/03-propuesta.md` y el PRD. Pendiente para Marketing: alinear `pricing.ts` y `roadmap.ts` en `web/`.
- 2026-10-21: Aarón decidió (D-022) que el producto vive en lealtab.com, con `/c/` para la app del cliente y `/panel/` para el panel del negocio, no en app.lealtab.com. Actualizados `docs/decisiones.md`, `identidad-de-marca.md`, `legal-notas.md`, ADR-001 y el PRD. Con esto se cierran las contradicciones de criterio de la revisión del PRD; el PRD pasa a v1.2, borrador para aprobación de Aarón.
- 2026-10-21: Aarón decidió el stack (D-023, ADR-002): TypeScript + Next.js (App Router) en el mismo proyecto que la landing (`web/`), con `/c/` y `/panel/`; Tailwind + shadcn/ui y pnpm; Supabase (Postgres, Auth con correo + código o contraseña, RLS por `negocio_id` y eventos de uso en una tabla propia, sin cookies ni PostHog); Vercel junto con la landing; código de recuperación por WhatsApp con el hook de teléfono/OTP de Supabase Auth (proveedor por definir); librería de QR en el navegador (por definir); cobro con link de Stripe o Mercado Pago, sin cambios. Actualizados `docs/decisiones.md`, `docs/adr/002-stack.md` (nuevo), ADR-001, `legal-notas.md` y el PRD (v1.3: PQ-16 cerrada, PQ-13 reducida al proveedor y su costo, nuevas PQ-25 y sección 7.6). Pendiente: actualizar `.claude/agents/lealtab-desarrollador.md` (menciona PostHog).
- 2026-10-21: Aarón agregó reglas al stack (D-023, ADR-002 §2.1). Frontend: React Server Components por defecto, Tailwind CSS y shadcn/ui como capa estándar de componentes base. Infraestructura: app lista para contenedores (Docker, Docker Compose, Dockerfile multi-stage); en local, Docker Compose levanta Supabase y la app web; en producción, Vercel compila `web/`, no el contenedor; todo cambio a la base es una migración de Supabase en `supabase/migrations` y corre en el build de Vercel. Actualizados `docs/decisiones.md`, ADR-002 (con una nota de riesgos de las migraciones en el build) y el PRD (RNF-STK-11 a 15; sigue en v1.3).
- 2026-10-21: Aarón definió el ADR-002 como fuente de verdad del stack técnico; si difiere de la sección 7.6 del PRD, manda el ADR. El PRD pasa a `docs/prd/PRD-lealtab-mvp.md` en el repo (copia idéntica en `07-desarrollo/`), con enlaces relativos al ADR-002 y a D-023.
- 2026-10-21: Aarón decidió que todos los campos de texto (input, select y textarea) usan 16 px de letra en todos los tamaños de pantalla. Nuevo token `font.size.input` / `--font-size-input` en `04-design-system/` (`tokens.json`, `tokens.css`, `01-tokens.md`, `02-botones-y-campos.md`, `04-tablas-y-formularios.md`, con nota de cambio) y `DESIGN.md` de la raíz del repo actualizado. RNF-A11Y-03 del PRD queda alineado con el design system. Pendiente: regenerar los HTML y capturas de preview de la Fase 4.
- 2026-10-21: Se actualizaron los subagentes de `.claude/agents/` contra el PRD y D-001 a D-023 (numeración de fases del plan v3, sin calendario, lecturas obligatorias y decisiones clave). Se archivaron en `.claude/agents-archivo/` el estratega de marca, el director creativo, el de design system y el diseñador de la tarjeta, porque su trabajo ya se entregó. Aarón aclaró D-023: todo el código de la app vive en `web/`, incluido Supabase (`web/supabase/migrations`) y Docker. Corregidos `docs/decisiones.md`, ADR-002, el PRD (v1.4, con la copia en `07-desarrollo/`) y `docs/02-plan-de-trabajo.md` (entregables en `docs/fase-8/`, guía de 3 pasos y equipo de subagentes en la sección 5).
- 2026-10-21: Se crearon `AGENTS.md` y `CLAUDE.md` en la raíz del repo, el agente `lealtab-qa` y el flujo `/feature` (orquestador en Opus, subagentes en Sonnet, aprobación de Aarón en el brief y en el cierre). Limpieza aprobada por Aarón: `PRODUCT.md` apunta al PRD v1.4; las rutas del PRD en `docs/02-plan-de-trabajo.md` y en este archivo pasan a `docs/prd/`; la Fase 7 entrega en `docs/fase-7/` (código en `web/`); se quitó la copia del PRD de `07-desarrollo/` (queda un README con el enlace); `07-entrega` §2 usa `--font-size-input` para los campos y `web/src/styles/tokens.css` ya lo incluye.
