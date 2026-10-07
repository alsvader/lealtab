# Bloque de entrevista: ícono de la PWA (por negocio o LealTab)

- **Para:** entrevistas E1 con dueños (Fase 2, semanas 2–4).
- **Alimenta:** ADR-001 (`docs/fase-2/adr/001-modelo-pwa.md`), sección 10, métrica "Dueños que citan mi ícono/mi marca como motivo de compra".
- **Hipótesis que se prueba:** "Tu ícono en el celular de tus clientes" es un motivo de compra para el dueño. `[SUPUESTO, sin validar]`
- **Nota:** todavía no existe el kit general (`docs/fase-2/entrevistas/kit.md`). Cuando exista, este bloque se integra ahí como anexo.

## Reglas de uso

1. **Nunca digas "ícono", "app" ni "tu marca en el celular" antes de la parte 2.** Si el dueño lo dice primero, anótalo textual: es la señal que buscamos.
2. **Orden:** guion de 8 preguntas (informe 01, 8.1) → parte 1 de este bloque → petición de piloto/preventa → parte 2 (maquetas). Las maquetas van **después** del compromiso para no contaminar la decisión de piloto.
3. **Hechos antes que opiniones.** Pide casos concretos ("la última vez…"), no intenciones ("¿usarías…?").
4. **No defiendas ninguna opción.** Si pregunta "¿cuál es la buena?", responde: "Todavía no lo decidimos; por eso te pregunto".

## Parte 1. Comportamiento actual (5 min, sin maquetas)

1. Cuando un cliente quiere ver cuántos sellos o puntos lleva, ¿qué hace hoy? Cuéntame la última vez.
2. ¿Dónde guarda el cliente la tarjeta (cartera, foto, WhatsApp, nada)? ¿Cuántas veces la pierde u olvida? ¿Cómo lo sabes?
3. La última vez que quisiste que un cliente regresara, ¿por dónde le llegaste (WhatsApp, Instagram, Google, en persona)? ¿Qué pasó?
4. ¿Alguna vez has pagado, cotizado o pedido algo para "estar en el celular" de tus clientes? (app propia, página, Google Maps, anuncios, catálogo de WhatsApp). ¿Cuánto costó? ¿Qué pasó con eso?
5. Si alguien te ha ofrecido una app propia, ¿qué le contestaste y por qué?
6. ¿Qué te molestaría que apareciera junto a tu negocio frente a tus clientes? (sin sugerir LealTab)

> Lo que cuenta aquí son los **hechos**: dinero gastado, cotizaciones pedidas, esfuerzos hechos. "Estaría padre tener app" es opinión y pesa poco.

## Parte 2. Comparación con dos maquetas (3–5 min)

**Material:** dos capturas de pantalla de inicio de un celular, del mismo tamaño y con la misma calidad visual:

- **Maqueta 1:** un ícono con el logo y el nombre del negocio. Al abrirlo, su tarjeta de sellos.
- **Maqueta 2:** un ícono "LealTab". Al abrirlo, la misma tarjeta con la marca del negocio (y, si hay más, las de otros negocios).

Si puedes, usa el logo real del negocio entrevistado; si no, un "Café Ejemplo" genérico en ambas.

**Cómo presentarlo sin inducir:**

- Nómbralas "1" y "2", nunca "la tuya" y "la de LealTab".
- **Alterna el orden:** en las entrevistas impares, primero la 1; en las pares, primero la 2.
- No menciones precio, esfuerzo técnico ni cuál prefiere el equipo.
- Guion:
  1. "Esto es lo que vería tu cliente si guarda la tarjeta en su celular. Hay dos formas. ¿Qué ves en cada una?"
  2. "¿Cambia algo para ti entre una y otra? ¿Qué?"
  3. "Si tuvieras que quedarte con una, ¿cuál, y por qué?" (vale "me da igual").
  4. **Pregunta de módulo futuro:** "Supón que la opción con tu propio ícono fuera un extra. ¿Pagarías por eso? ¿Cuánto al mes?" Si dice que sí, sigue con: "¿Lo dejamos apuntado en tu preventa?" Un sí con monto y compromiso es un hecho; un "sí, seguro" sin monto es opinión.

**Qué observar:**

- A cuál señala primero y cuánto tarda en decidir.
- Si habla de **sus clientes** ("lo van a encontrar más fácil") o de **sí mismo** ("se ve más profesional", "es mi marca").
- Si la marca LealTab le genera rechazo ("le estoy haciendo publicidad a otro") o le da igual.
- Si pregunta por costo, por "tener app en la tienda" o por wallet (anótalo para D-001).
- Si el tema lo deja indiferente: también es dato.

## Criterios de lectura

**Qué cuenta como señal a favor del ícono propio** (solo una de estas dos):

- **Espontánea:** el dueño menciona el ícono, la app propia o "mi marca en el celular" **antes** de la parte 2, o lo da como razón al aceptar el piloto o la preventa.
- **Con pago:** después de las maquetas, da un monto concreto y acepta dejarlo apuntado en la preventa.

**No cuenta:** preferir la maqueta 1 sin argumento ni pago, "se ve más bonito" o "estaría padre".

**Umbral de decisión** (por cada 10 dueños que pasen por el bloque; con 20, se usa la proporción):

| Dueños con señal válida | Decisión |
|---|---|
| ≥3 de 10 | Se vuelve a la opción H del ADR-001 (ícono por negocio), porque el ícono sí es argumento de venta. |
| 1–2 de 10 | Zona gris: se mantiene lo que diga el ADR y se vuelve a medir en el cierre de los pilotos. |
| 0 de 10 | Se descarta el argumento "tu ícono en el celular de tus clientes". La elección A o B se decide solo con criterios técnicos y de cliente final. |

**Módulo futuro "ícono propio":** si ≥3 dueños dan monto y aceptan apuntarlo en la preventa, se propone al `lealtab-coordinador` como candidato de módulo de pago (Fase 7, junto con el subdominio o dominio propio del ADR-001). Mientras tanto, va a "Pendientes para fase 7".

## Plantilla de registro (una por entrevista)

```
Entrevista #__ · Fecha: ____ · Negocio/giro: ____ · Sucursales: __
Orden de maquetas: 1→2 / 2→1

PARTE 1 (hechos)
- Cómo consulta hoy el cliente sus sellos: ____
- Dónde guarda la tarjeta / la pierde: ____
- Canal para que regresen (último caso): ____
- Gasto o cotización para "estar en el celular" (qué, cuánto, cuándo): ____
- Le ofrecieron app propia (sí/no, qué respondió): ____

SEÑAL ESPONTÁNEA
- ¿Mencionó ícono/app/marca antes de la parte 2? sí/no
- Cita textual: "____"

PARTE 2 (maquetas)
- Señaló primero: 1 / 2 · Eligió: 1 / 2 / le da igual
- Razón (textual): "____"
- Habla de: sus clientes / sí mismo / ninguno
- Rechazo a la marca LealTab: sí/no · cita: "____"
- Pagaría extra por ícono propio: no / sí sin monto / sí con monto $____/mes
- Lo apuntó en la preventa: sí/no

LECTURA
- ¿Señal válida a favor del ícono propio? sí/no (espontánea / con pago)
- Mencionó app de tienda o wallet: sí/no
- Notas: ____
```

## Pendientes para fase 7

- Módulo de pago "ícono propio" o dominio propio, solo si se cumple el criterio de módulo futuro.
