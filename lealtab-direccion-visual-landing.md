# LealTab — Dirección visual para la landing page

## Contexto

Se revisó la referencia visual completa de LealTab: estrategia de marca, posicionamiento, rutas creativas, **Ciclo v2**, paleta y tipografía, isotipo/logo, brand book, iconografía, ilustraciones, stickers, aro de progreso, design system y el mockup actual de la landing.

También se contrastó con cómo se presentan productos actuales de lealtad y SaaS como Boxo, Sello.club, Square Loyalty, Stamp Me, Smile.io, LoyaltyLion y PassKit, además de patrones contemporáneos de diseño SaaS.

La conclusión principal es que **LealTab ya tiene una identidad suficientemente definida como para no necesitar adoptar un “estilo de moda” externo**. Lo correcto es construir un estilo web propio a partir de esa identidad.

---

## Dirección visual recomendada

### Editorial Product SaaS + neo-brutalismo cálido y controlado

No se recomienda una landing de neo-brutalismo puro.

El neo-brutalismo más extremo suele recurrir a:

- Colores muy estridentes.
- Bordes excesivos.
- Sombras demasiado agresivas.
- Composiciones deliberadamente incómodas.
- Saturación visual.

Eso podría provocar que LealTab pareciera un producto indie divertido en lugar de una plataforma que quiere comunicar:

**Simple · Confiable · Humana · Premium**

Sin embargo, LealTab ya contiene varios elementos compatibles con ese lenguaje:

- Archivo Condensed.
- Contornos oscuros.
- Sombras duras sin blur.
- Botones con sensación física de presión.
- Stickers.
- Ilustraciones planas.
- Bloques de color.
- Titulares grandes.

La recomendación es mantener esos ingredientes, pero combinarlos con una composición mucho más editorial, limpia y sofisticada.

Conceptualmente:

> **Stripe/Linear en disciplina de producto + una publicación editorial moderna + el carácter visual propio de Ciclo v2.**

No se trata de copiar visualmente a ninguna de esas empresas.

---

## Por qué esta dirección encaja con LealTab

La competencia deja un espacio visual interesante.

Boxo comunica muchas funcionalidades, métricas, Wallet, dashboards y beneficios mediante una landing orientada a startup/growth.

Sello.club está más cerca del mismo usuario inicial de LealTab: pequeños negocios, QR, sin aplicación y tarjeta en navegador. Su comunicación es extremadamente directa y funcional.

PassKit se posiciona más como infraestructura tecnológica de Wallet y utiliza un lenguaje sobrio y enterprise.

Smile.io y LoyaltyLion están más orientados a ecommerce de mayor escala, métricas como CLV, revenue, Shopify Plus y analítica avanzada.

LealTab puede ocupar el espacio que queda entre estos mundos:

> **Un producto muy sencillo para un negocio local, presentado con el nivel de cuidado visual de una compañía tecnológica mucho mayor.**

Eso coincide con el posicionamiento construido para la marca.

---

# La landing no debe convertirse en el dashboard

Este es uno de los principales riesgos del mockup actual.

El diseño que ya existe en `05-marketing` es correcto y consistente, pero todavía se percibe demasiado como una demostración del design system.

Actualmente se repite constantemente una lógica del tipo:

- Card.
- Card.
- Card.
- Tres cards.
- Cuatro cards.
- Tres pricing cards.
- Cuatro cards.

Todo está alineado y diseñado correctamente, pero conforme el usuario baja por la página **la silueta visual se vuelve demasiado uniforme**.

La identidad de LealTab tiene potencial para ser mucho más expresiva.

El propio brand book plantea que la landing debe ser más expresiva que el dashboard.

### Dashboard

Debe sentirse:

- Ordenado.
- Denso.
- Racional.
- Minimalista.

### Landing

Debe sentirse:

- Más espacial.
- Editorial.
- Asimétrica.
- Expresiva.

Ambas superficies pueden compartir exactamente los mismos tokens y seguir perteneciendo al mismo sistema visual.

---

# 1. Composición editorial, no “SaaS template”

Se debería evitar la estructura típica:

`headline → grid de 3 → headline → grid de 3 → headline → grid de 4`

El bento grid ya se ha convertido prácticamente en una convención del diseño SaaS, por lo que utilizarlo indiscriminadamente hace que muchas páginas terminen pareciéndose entre sí.

Sí se pueden utilizar grids, pero solo cuando ayuden realmente a explicar algo.

Por ejemplo:

```text
                     [ ARO GIGANTE ]

HAZ QUE TUS
CLIENTES SIEMPRE
REGRESEN.             ┌─────────────┐
                      │   TELÉFONO  │
Texto corto            │   LealTab   │
CTA                     └─────────────┘

              CASI PREMIO
```

Después podría aparecer una sección con una composición completamente diferente:

```text
01
CREA TU TARJETA

                    [ UI REAL ]
                 ┌──────────────┐
                 │ Barbería     │
                 │              │
                 │     4/5      │
                 └──────────────┘


                    02
                    TU CLIENTE
                    ESCANEA.
```

La página debería alternar ritmos y composiciones.

Eso permitiría construir una experiencia más memorable.

---

# 2. El aro debe convertirse en el gran recurso narrativo

El aro es probablemente una de las oportunidades visuales más importantes de toda la identidad de LealTab.

No debería limitarse a aparecer como una pequeña gráfica de progreso.

Puede funcionar prácticamente como **la firma visual de la experiencia web de LealTab**.

Ya existe una definición para:

- Estado vacío.
- Estado con avance.
- Estado casi completo.
- Estado completo.
- Animación.
- Relación con el isotipo.
- Comportamiento en marketing y producto.

La landing debería aprovechar mucho más ese recurso.

### Hero

Un aro enorme parcialmente fuera del viewport.

### Cómo funciona

El aro avanza conforme el usuario recorre los pasos del producto.

### Producto

El concepto se convierte en el progreso `4/5` de la tarjeta.

### Pricing

El aro desaparece para evitar sobredecorar.

### CTA final

El aro aparece completo en durazno.

Esto crea una narrativa natural:

**inicio → progreso → regreso → recompensa**

El aro deja de ser decoración y se convierte en storytelling de producto.

---

# 3. Hero mucho más expresivo

El hero actual utiliza una propuesta funcional:

> **Tu tarjeta de lealtad, ahora en el celular de tus clientes.**

No necesariamente debe cambiarse ese copy.

Lo que sí debería cambiar es la puesta en escena.

La composición actual responde a una fórmula bastante convencional:

```text
Texto                       Teléfono
```

Una alternativa con más identidad sería:

```text
TU TARJETA DE
LEALTAD, AHORA
EN EL CELULAR
DE TUS CLIENTES.

              ◯
          ◯       ◯
             [PHONE]
               ◯
```

El teléfono podría superponerse ligeramente al aro.

Detrás podría existir una segunda tarjeta parcialmente visible o algún detalle real de UI.

También podría aparecer un sticker pequeño:

**CASI PREMIO**

El durazno aparecería únicamente en el punto que completa el progreso.

El objetivo es que el hero sea **inconfundiblemente LealTab**.

---

# 4. Mucho más contraste de escala

Archivo Condensed tiene mucho potencial y puede aprovecharse mucho más.

No todos los encabezados deberían tener aproximadamente la misma escala o presencia.

Se pueden utilizar titulares enormes.

Por ejemplo:

> **VUELVE.**

podría ocupar prácticamente media pantalla.

Después, en otro bloque:

> **Que siempre regresen.**

O utilizar elementos como:

> **4 / 5**

en una escala enorme junto al producto.

No todo tiene que ser una frase explicativa.

El estilo editorial se beneficia de la combinación de:

**titulares gigantes + pequeños fragmentos funcionales + producto real**

---

# 5. El lino debe funcionar como canvas

El color `#F3EFE6` es una excelente elección.

No debería convertirse simplemente en un fondo sobre el que flotan cards constantemente.

La recomendación es dejar áreas grandes completamente libres.

Por ejemplo:

```text
                    mucho
                    espacio

        VUELVE.


                         [4/5]
```

Ese espacio negativo aumenta inmediatamente la sensación premium.

La personalidad vendría principalmente de:

- Tipografía.
- Composición.
- Producto.
- Aro.
- Bordes.
- Pequeños gestos de color.

No de la cantidad de elementos presentes en pantalla.

---

# 6. El bosque debe crear capítulos

El bloque oscuro ya utilizado en **Lo que viene** funciona bien conceptualmente.

Ese mismo principio puede aplicarse de forma estratégica.

Por ejemplo, la landing podría tener únicamente **dos grandes interrupciones en bosque**.

## Bloque oscuro intermedio

Para comunicar algo como:

> **Ves quién regresa.  
> Y quién no.**

Acompañado de un preview real del dashboard.

## Segundo bloque oscuro

Cerca del final, para:

> **Lo que viene.**

El resto del sitio permanece principalmente en lino.

Eso crea un ritmo:

**claro → oscuro → claro → oscuro → claro**

El resultado sería mucho más editorial.

---

# 7. Las ilustraciones deben funcionar como objetos

Las ilustraciones actuales de barbería, estética y tapioca están bien resueltas visualmente.

No necesariamente deberían aparecer dentro de tres cards idénticas.

Pueden integrarse de una manera mucho más libre.

Por ejemplo:

```text
BARBERÍAS

                ✂️ ilustración grande

Al quinto corte,
el sexto va por
nuestra cuenta.
```

Luego invertir la composición:

```text
                  ESTÉTICAS

[ilustración]

                   Tus clientas saben
                   cuánto falta para
                   su recompensa.
```

Esto ayuda a que las ilustraciones formen parte del lenguaje de marca y no se perciban simplemente como iconos agrandados.

---

# 8. Fotografía real, pero en poca cantidad

La dirección planteada por el brand book respecto a fotografía es acertada.

Se debería evitar el tipo de stock clásico de:

> “Dueño feliz sosteniendo un iPad”.

Cuando exista un piloto real, sería recomendable incorporar fotografías de:

- Una barbería.
- Una estética.
- Una tienda de tapioca.
- Manos escaneando el QR.
- Un mostrador.
- Un cliente viendo su progreso.

La fotografía debería seguir una regla:

**documental, no publicitaria**

Con:

- Planos cerrados.
- Luz natural.
- Texturas reales.
- Situaciones auténticas.

Esto permitiría conectar el nivel tech-premium de la interfaz con **negocios mexicanos reales**.

---

# 9. Microinteracción como identidad

No se recomienda utilizar:

- Scroll-jacking.
- WebGL excesivo.
- 3D innecesario.
- Grandes movimientos cinemáticos.
- Efectos puramente decorativos.

Para LealTab sería demasiado.

En cambio, sí se pueden definir cuatro movimientos característicos:

1. El aro progresa.
2. El botón se hunde contra su sombra.
3. Un sticker entra con una ligera rotación.
4. La UI cambia de `4/5 → 5/5 → recompensa`.

Para el aro, una duración de aproximadamente **500–700 ms** encaja bien con la definición actual.

La animación debe tener significado.

---

# 10. No abusar del durazno

Una de las decisiones más acertadas del brand book es reservar el durazno.

Ese color podría utilizarse prácticamente como una **recompensa visual**.

Durante gran parte de la landing se verían principalmente:

- Lino.
- Noche.
- Bosque.
- Menta.

Y solo cuando algo se completa aparece:

**durazno**

Por ejemplo, en el cierre:

```text
       ◯  8/8
    DURAZNO

HAZ QUE TUS CLIENTES
SIEMPRE REGRESEN.
```

De esta manera el color también adquiere significado dentro del lenguaje del producto.

---

# Nombre propuesto para la estética

Para documentar esta dirección o trasladarla posteriormente a Figma, Claude, Cursor u otras herramientas, se recomienda usar el nombre:

## LealTab — Warm Editorial Product

Descripción:

> **Una landing SaaS editorial, cálida y tipográfica, con neo-brutalismo controlado: grandes titulares condensados, composiciones asimétricas, superficies lino, contornos noche, bosque como color estructural, sombras duras discretas y el aro de progreso como elemento narrativo principal.**

Esta definición describe mejor a LealTab que simplemente llamarlo “neo-brutalism”.

---

# Evaluación del mockup actual

No se recomienda descartar el mockup existente.

La base es buena.

Se pueden mantener:

- Copy.
- Orden general de contenidos.
- Paleta.
- Tipografías.
- Botones.
- Sistema de bordes.
- Pricing.
- Dark section.
- FAQ.
- Ilustraciones.
- Phone/product UI.

Lo que principalmente necesita cambiar es la:

## Dirección de arte y composición

Actualmente la landing puede percibirse aproximadamente como:

**70% sistema / 30% expresión de marca**

Para marketing sería recomendable acercarla a:

**40% sistema / 60% expresión de marca**

Mientras que el dashboard debería hacer prácticamente lo contrario.

---

# Diferenciación buscada

Cuando alguien compare LealTab con Boxo, Sello u otra alternativa, no debería pensar:

> “Otra tarjeta de sellos digital.”

La percepción buscada debería ser:

> **“Esta empresa construyó un producto en serio.”**

Pero sin provocar que una barbería, estética o pequeño comercio piense:

> “Esto debe ser carísimo o demasiado complicado para mí.”

El territorio visual de LealTab está precisamente en ese equilibrio:

## Producto tecnológico premium + negocio local accesible

La identidad actual ya contiene prácticamente todos los ingredientes necesarios para construir ese posicionamiento.

---

# Recomendación de siguiente paso

Antes de diseñar o programar las ocho secciones completas de la landing, lo recomendable es validar primero una sola dirección visual.

La primera prueba debería incluir únicamente:

1. **Hero.**
2. **Inicio de la sección “Cómo funciona”.**

Con eso sería posible validar:

- Escala tipográfica.
- Composición.
- Uso del aro.
- Integración del teléfono.
- Densidad visual.
- Espacio negativo.
- Nivel de neo-brutalismo.
- Uso del bosque.
- Uso del durazno.
- Nivel de expresión de la marca.

Una vez que ese lenguaje visual se sienta realmente como **LealTab**, se puede extender con seguridad al resto de la landing page.
