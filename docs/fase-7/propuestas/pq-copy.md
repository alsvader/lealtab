# Propuesta para cerrar la PQ-05: texto prellenado de «Escribir por WhatsApp» (N7)

Estado: **propuesta, pendiente de aprobación de Aarón**. No modifica el PRD, `docs/decisiones.md` ni `brand/`.
Fuentes: PRD RF-CLI-03, RF-QR-01 y PQ-05; `07-entrega-desarrollo.md` §3, §4, §6 y §8; pieza 05 y `inicio/n7-clientes.html`; `identidad-de-marca.md` §4; D-010, D-011 y D-019.

## 1. Objetivo, público y métrica

- **Objetivo:** que el dueño (o su personal) abra WhatsApp desde la ficha con un mensaje listo, corto y que suene a su negocio, para recuperar a un cliente o avisarle de su recompensa.
- **Público:** el cliente final, que recibe el mensaje en su WhatsApp normal. El dueño lo puede editar antes de enviar (es solo texto prellenado).
- **Variante A/B:** ninguna en el MVP. Con los pilotos se revisa si el dueño borra o reescribe el texto (lo cuenta él, a mano, en la entrevista; ver §7).
- **Métrica de éxito:** el dueño envía el mensaje sin reescribirlo y el cliente lo recibe como un saludo del negocio, no como publicidad. Medición: **Por definir** (§7), no se inventan eventos.

## 2. ¿Una plantilla o varias?

**Recomendación: tres plantillas, elegidas en automático, sin pedirle nada al dueño.**

Motivo:
- Un solo texto genérico sirve mal en los dos usos que el flujo ya prevé: a quien no vuelve le hace falta un saludo sin presión, y a quien ya completó su tarjeta le hace falta el aviso concreto de que su recompensa está lista. Mezclarlos en un solo texto lo alarga o lo deja vago.
- Más de tres plantillas es trabajo que el MVP no necesita y obliga al dueño a elegir.
- Nada de plantillas editables por negocio: sería configuración nueva fuera del MVP (PRD §4.2).

### Cómo elige N7 (solo con datos que ya existen)

Orden de prioridad, la primera que se cumpla:

| # | Plantilla | Condición | Dato de origen |
|---|---|---|---|
| 1 | **Recompensa lista** | `tarjeta_cliente.sellos` ≥ `tarjeta_config.sellos_meta` | `07-entrega` §3 |
| 2 | **No ha regresado** | el cliente es «En riesgo» (RF-QR-01 / `07-entrega` §4) | el mismo cálculo que pinta el chip en N7 |
| 3 | **Saludo** (genérico) | cualquier otro caso (Frecuente, Nuevo, o En riesgo sin datos) | n/a |

Si la ficha se abre desde una lista de N6, aplica la misma regla; N6 no cambia la plantilla.

## 3. Variables

| Variable | De dónde sale | Regla |
|---|---|---|
| `{nombre}` | primera palabra de `cliente_negocio.nombre` (el nombre que dio **en este negocio**, D-019) | Si viene vacío, se omite y el mensaje empieza con «Hola.» |
| `{negocio}` | `negocio.nombre` | Tal cual. |
| `{recompensa}` | `tarjeta_config.recompensa` | Tal cual, en minúsculas tal como la escribió el dueño. |
| `{sellos}` y `{sellos_meta}` | `tarjeta_cliente.sellos` y `tarjeta_config.sellos_meta` | Solo en la plantilla 2. |

Segmento condicional de la plantilla 2, `{linea_sellos}`: «Tu tarjeta sigue con {sellos} de {sellos_meta} sellos. » (con espacio al final). Solo aparece si `sellos` ≥ 1; si no, se omite.

## 4. Textos

El mensaje es del negocio al cliente: habla en plural («te escribimos», «te esperamos») y nunca nombra a LealTab.

### Plantilla 1 · Recompensa lista

```
Hola, {nombre}. Te escribimos de {negocio}: ya completaste tu tarjeta y tu recompensa te está esperando ({recompensa}). Pasa cuando quieras a canjearla.
```
- Longitud: unos 120 caracteres sin variables.
- Ejemplo (157 caracteres aprox.): «Hola, María. Te escribimos de Barbería El Güero: ya completaste tu tarjeta y tu recompensa te está esperando (corte gratis). Pasa cuando quieras a canjearla.»
- Se evita «tu {recompensa} está listo» porque el género de la palabra lo escribe el dueño y puede salir mal («tu tapioca de regalo está listo»).

### Plantilla 2 · No ha regresado

```
Hola, {nombre}. Te escribimos de {negocio}. Hace rato que no te vemos y queríamos saludarte. {linea_sellos}Aquí te esperamos cuando quieras pasar.
```
- Longitud: unos 100 caracteres sin variables, hasta unos 175 con todo.
- Ejemplo (173 caracteres aprox.): «Hola, María. Te escribimos de Barbería El Güero. Hace rato que no te vemos y queríamos saludarte. Tu tarjeta sigue con 6 de 8 sellos. Aquí te esperamos cuando quieras pasar.»
- Ejemplo sin sellos (137 aprox.): «Hola, Jorge. Te escribimos de Tapiocas Nube. Hace rato que no te vemos y queríamos saludarte. Aquí te esperamos cuando quieras pasar.»
- No dice cuántos días ni semanas, ni «tu ritmo habitual»: el cliente no espera que el negocio calcule eso (ver §5).

### Plantilla 3 · Saludo

```
Hola, {nombre}. Te escribimos de {negocio}. Gracias por tu visita. Si tienes alguna duda con tu tarjeta, aquí estamos.
```
- Longitud: unos 95 caracteres sin variables.
- Ejemplo (112 caracteres aprox.): «Hola, Luis. Te escribimos de Café La Esquina. Gracias por tu visita. Si tienes alguna duda con tu tarjeta, aquí estamos.»

Las longitudes son aproximadas; el desarrollador las confirma con un conteo real. Todas caben holgadas en un enlace `wa.me` (el texto va con `encodeURIComponent`).

## 5. Reglas

1. **De tú, español de México, frases cortas.** Una idea por frase.
2. **Voz del negocio:** plural, sin nombrar a LealTab ni a la tarjeta como «app». Habla de «tu tarjeta».
3. **Sin presión ni promesas:** nada de «última oportunidad», «no te lo pierdas», descuentos, plazos o urgencia falsa. Solo se menciona la recompensa que el cliente ya ganó, sin vencimiento (no existe en el MVP).
4. **Nada que parezca spam:** sin mayúsculas sostenidas, sin signos de exclamación en cadena, sin emojis, sin enlaces, sin «responde SÍ». Un mensaje por cliente, con su nombre.
5. **Solo datos que el cliente espera que el negocio tenga:** su nombre, el nombre del negocio y los sellos de la tarjeta que él mismo usa. No se mencionan días sin visitar, ritmo habitual, número de visitas, historial ni el estado «En riesgo».
6. **Nada de la API de WhatsApp (D-011):** el enlace es `https://wa.me/{whatsapp E.164 sin «+»}?text={texto codificado}`. Se abre en el WhatsApp del dueño, que lo envía a mano y puede editarlo. No hay plantillas de Meta ni aprobación.
7. **Sin datos de otros negocios (RF-CLI-08):** el texto solo usa datos del `cliente_negocio` y la tarjeta de este negocio.
8. **El resumen semanal no se envía por WhatsApp (D-011):** estas plantillas son mensajes uno a uno que decide el dueño, no un envío automático.

## 6. Texto propuesto para RF-CLI-03

> **RF-CLI-03** · «Escribir por WhatsApp» abre un enlace `wa.me` al número del cliente con un texto prellenado, sin la API. El dueño lo ve y puede editarlo en WhatsApp antes de enviarlo. N7 elige entre tres plantillas fijas, en este orden: **Recompensa lista** (sellos ≥ meta), **No ha regresado** (cliente «En riesgo», RF-QR-01) y **Saludo** (los demás). El texto habla con la voz del negocio, sin presión ni promesas, y solo usa el nombre del cliente en ese negocio, el nombre del negocio, la recompensa y los sellos. Textos y reglas: `docs/fase-7/propuestas/pq-copy.md`. En el MVP la API de WhatsApp Business solo se usa para el código de recuperación del cliente (RF-APP-15).

Y en PQ-05: marcarla como **cerrada** con la fecha de aprobación y referencia a la D- siguiente.

## 7. Decisión nueva propuesta (sin registrar)

## D-NNN · <fecha de registro> · Plantillas del mensaje «Escribir por WhatsApp» en N7

- **Decisión:** «Escribir por WhatsApp» (N7) abre un enlace `wa.me` con una de tres plantillas fijas, elegida por el sistema: Recompensa lista, No ha regresado o Saludo, según `sellos` ≥ `sellos_meta` o el estado «En riesgo» (RF-QR-01). Hablan con la voz del negocio, sin presión comercial, sin enlaces y sin datos que el cliente no espere que el negocio tenga. El dueño puede editar el texto en WhatsApp antes de enviarlo.
- **Motivo:** cubre los dos usos del flujo F5 (recuperar y avisar de la recompensa) con el mínimo de variantes y sin campos ni configuración nuevos; no depende de la API (D-011).
- **Consecuencias:** cierra la PQ-05 y completa RF-CLI-03. Las plantillas no son editables por negocio en el MVP. Las plantillas editables, los envíos masivos y las campañas siguen fuera del alcance (PRD §4.2).
- **Alternativa(s) descartada(s):** una sola plantilla genérica (vaga para la recompensa); plantillas editables por negocio (configuración fuera del MVP); más de tres plantillas (el dueño tendría que elegir).
- **Decidió:** fundador.

## 8. Por definir

- **Base legal del contacto (PQ-04, D-017):** el aviso de C1 recoge nombre y WhatsApp con consentimiento. Si ese consentimiento alcanza para que el negocio le escriba por WhatsApp (sobre todo para «No ha regresado», que es de reactivación) y si conviene una línea de baja («Si prefieres que no te escribamos, avísanos») es una pregunta para el abogado. No doy opinión legal; la línea de baja no está en los textos y se puede agregar al final de las tres plantillas si el abogado la pide.
- **Medición:** no existe un evento para este botón en `07-entrega` §5 (`accion_sugerida_click` es de N0). Si se quiere contar los clics de «Escribir por WhatsApp», lo propone el analista de métricas y requiere cambiar el §5 y RF-EVT-01; no lo inventé.
- **Ajuste por oficio:** «Hace rato que no te vemos» es neutro para barberías, estéticas, tapiocas y cafeterías. Se revisa con los 3 primeros pilotos si algún oficio lo siente invasivo.
