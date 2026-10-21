# LealTab · Perfil de Instagram (@getlealtab)

Documento de Aarón López Sosa · Fase 5, Marketing · Pieza 7 · 7 de octubre de 2026 · **Aprobado por Aarón (7 oct 2026)**. Actualizado el mismo día: posts en 3:4 y story-01 corregida.

**Base:** kit de redes aprobado (`04-kit-redes.md` + `kit-redes/`), copy de landing v1.1 (`02-copy-landing.md`), identidad de marca (voz de tú; Simple, Confiable, Humana, Premium), paleta y tipografía, recursos gráficos aprobados (íconos, aros) y avatares de `03-visual-identity/logo/entregables/redes/`.
**Español de México, voz de tú.** `[ ]` = dato que falta de Aarón. No se inventan teléfono, correo ni dirección.

**Archivos de esta pieza** (carpeta [`perfil-instagram/`](./perfil-instagram/)):

| Archivo | Qué es |
|---|---|
| `perfil-instagram/perfil-mockup.png` | Mockup del perfil completo (1080 px de ancho), con la cuadrícula armada con los posts 3:4 de `kit-redes/34/`. **Es simulación, no captura real.** |
| `perfil-instagram/avatar-preview.png` | Avatares noche y lino en círculo: 280, 110, 40 y 32 px, en modo claro y oscuro |
| `perfil-instagram/destacados/01…06-*.png` | 6 portadas de destacados, 1080×1920 |
| `perfil-instagram/destacados-preview.png` | Las 6 portadas en círculo con su nombre, como las muestra Instagram (claro y oscuro, grande y a tamaño real) |
| `perfil-instagram/html/` | Fuente: `build.py` (contenido y diseño) + `render.sh` (Chrome headless, igual que el kit) |

Regenerar todo: `bash perfil-instagram/html/render.sh`

---

## 1. Avatar

**Recomendado: noche** → subir `03-visual-identity/logo/entregables/redes/lealtab-avatar-noche-cuadrado-1080.png`.

**Por qué, en una línea:** en modo claro (el de la mayoría) el avatar lino casi se funde con el fondo blanco, mientras que el isotipo lino sobre noche se lee nítido a 110, 40 y 32 px en modo claro y oscuro.

- Sube la versión **cuadrada**: Instagram la recorta en círculo solo. La versión `-circulo` trae esquinas transparentes, que algunas pantallas rellenan de negro o blanco.
- El isotipo queda completo dentro del círculo, con aire alrededor. A 40 px y 32 px (comentarios, mensajes) la "L" sigue identificable.
- Lino queda como alternativa, por ejemplo para una temporada o para otras redes con fondo oscuro.

Ver `perfil-instagram/avatar-preview.png`.

---

## 2. Nombre visible y usuario

El campo **Nombre** es el que Instagram usa en la búsqueda, así que lleva palabras que alguien escribiría ("tarjeta de lealtad"). El "get" solo vive en el usuario.

| | Texto | Caracteres |
|---|---|---|
| **Recomendado** | `LealTab · Tarjeta de lealtad digital` | **36** / 64 |
| Alternativa (más corta) | `LealTab · Tarjeta de lealtad` | 28 / 64 |

- **Usuario:** `@getlealtab`
- Instagram solo deja cambiar el nombre **dos veces cada 14 días**. Conviene decidirlo antes de crear la cuenta.
- En el mockup, el recomendado cabe en una línea junto al avatar. En celulares muy angostos puede partirse en dos; si eso molesta, usa la alternativa.

---

## 3. Bio (máximo 150 caracteres)

Conteo exacto: cada espacio, acento, símbolo y salto de línea cuenta como 1. Sin Wallet, sin cupón ni urgencia, sin Tabasco, sin precio de fundador. Sin emoji; solo la flecha "↓", que es un símbolo de texto y apunta al enlace, que Instagram pone justo debajo de la bio.

### Recomendada · **134 / 150**

```
Haz que tus clientes siempre regresen.
Tu tarjeta de lealtad digital, siempre a un toque y sin descargar nada.
Prueba gratis 30 días ↓
```
Líneas: 38 + 71 + 23 = 132, más 2 saltos de línea = **134**.
Lleva el lema, la promesa de Propuesta A ("siempre a un toque", "sin descargar nada") y la prueba de 30 días.

### Alternativa 1 · **140 / 150**: producto y para quién

```
Tu tarjeta digital siempre a un toque.
Para barberías, estéticas, tapiocas, cafeterías y más.
Prueba gratis 30 días. Sin tarjeta de crédito.
```
Líneas: 38 + 54 + 46 = 138, más 2 saltos = **140**. La lista de negocios es la que aprobaste para el pitch de marca.

### Alternativa 2 · **139 / 150**: lema y cómo funciona

```
Haz que tus clientes siempre regresen.
Crea tu tarjeta de lealtad en minutos. Tus clientes la instalan con un toque.
Prueba gratis 30 días.
```
Líneas: 38 + 77 + 22 = 137, más 2 saltos = **139**.

> El conteo se hizo con los textos normalizados (NFC), como los guarda Instagram. Si pegas desde otro editor, revisa que la "í" de "días" no se convierta en dos caracteres.

---

## 4. Categoría

**Recomendada: "Software"**, con la opción **Mostrar categoría** activada.

- Dice en una palabra lo que es LealTab (una herramienta digital, no un local). Aparece en gris bajo el nombre, como en el mockup.
- Alternativas si no te convence: **"Producto/servicio"** (más genérica, no dice que es digital) o **"Empresa de Internet"**.
- La lista exacta se elige en la app (Editar perfil → Categoría) y los nombres en español pueden variar un poco. Busca "Software" y, si no aparece igual, toma la más cercana de la lista.
- Tipo de cuenta profesional: **Empresa** (no Creador). Habilita categoría, botones de contacto y WhatsApp.

---

## 5. Enlace de la bio

- **Enlace 1:** `https://lealtab.com` · título: `Crea tu tarjeta gratis` (22 / 30 caracteres).
- Instagram permite hasta 5 enlaces. En el perfil se ve el primero ("lealtab.com") y los títulos aparecen al tocarlo.
- **Cuando exista `app.lealtab.com`:** la landing sigue siendo el enlace principal, porque explica, da precios y lleva al alta con "Crea tu tarjeta gratis". Se puede sumar `app.lealtab.com` como enlace 2 con el título `Entrar` para negocios que ya tienen cuenta. Decisión pendiente para cuando exista.
- **[x] Landing publicada (verificado 9 oct 2026):** `https://www.lealtab.com` responde 200 con el título y copy aprobados (lema, prueba 30 días, CTA "Crea tu tarjeta gratis", precios $299/$449). Ya se puede usar como enlace 1 de Instagram.

---

## 6. Contacto: botón de WhatsApp

- **Botón:** WhatsApp (Editar perfil → Opciones de contacto → WhatsApp, vinculando el número de WhatsApp Business). En el perfil aparece como **"WhatsApp"** junto a "Seguir" y "Mensaje" (ver mockup).
- **[ ] Número de WhatsApp Business:** en la landing ya publica `+52 55 8806 3606` (`wa.me/525588063606`, verificado en lealtab.com el 9 oct 2026). Falta confirmar que es WhatsApp Business para vincularlo en Instagram (también estaba abierto en el kit de redes).
- Instagram no permite precargar un texto en ese botón. El primer mensaje lo pone **WhatsApp Business** con su mensaje de bienvenida automático. Propuesta, genérica, sin nombre ni horario (decisión cerrada del copy):

```
Hola, gracias por escribir a LealTab. Aquí te atiende una persona.
Cuéntanos de tu negocio y en qué te ayudamos.
```

- Mensaje de ausencia (opcional, sin horario): `Gracias por escribir. Te respondemos en cuanto podamos; aquí te atiende una persona.`
- **Correo:** mostrarlo solo si me das uno de contacto → `[ correo ]`. Recomendado si tienes uno de soporte, porque prensa y aliados lo buscan.
- **Teléfono para llamadas:** no recomendado; WhatsApp es el canal. Solo si tú lo pides → `[ teléfono ]`.
- **Dirección:** no se muestra (LealTab es un servicio en línea).
- **Botones de acción** (reservar, pedir, etc.): no aplican; no se usan.

---

## 7. Destacados

6 portadas listas en `perfil-instagram/destacados/` (1080×1920, fondo bosque, ícono aprobado del set `recursos/iconos/activo` en lino con relleno menta, centrado dentro del círculo central). Sin durazno: el set queda sobrio y no compite con el aro completo de los posts. Los nombres van en minúscula inicial y tienen 9 caracteres o menos, para que no se corten (Instagram acepta 15, pero corta desde unos 10–12).

| # | Nombre (car.) | Portada | Ícono | Qué va adentro (piezas que ya existen) | Estado |
|---|---|---|---|---|---|
| 1 | **3 pasos** (7) | `01-3-pasos.png` | Visita | Post 03 "Cómo funciona" compartido a historia + story-01 CTA | ✅ listo con el kit |
| 2 | **Negocios** (8) | `02-negocios.png` | Negocio | Posts 04 barbería, 05 estética y 06 tapioca compartidos a historia | ✅ listo con el kit |
| 3 | **Precios** (7) | `03-precios.png` | Calendario (30 días) | Post 07 "Prueba 30 días" compartido a historia + story-01 CTA | ✅ listo con el kit |
| 4 | **Instalar** (8) | `04-instalar.png` | Escanear | Story-02 "Pon el QR donde se vea" + mini guía iPhone/Android (copy aprobado de la landing, sección 3) | 🟡 story-02 lista; guía por diseñar |
| 5 | **Preguntas** (9) | `05-preguntas.png` | Mensaje | Las 5 preguntas frecuentes de la landing, una por historia | 🟡 copy aprobado; historias por diseñar |
| 6 | **Piloto** (6) | `06-piloto.png` | Ubicación | Qué es el piloto y cómo sumarse; sin resultados ni nombres de negocios sin su permiso | ⏸ publicar solo cuando haya contenido aprobado |

- **Para lanzar:** 1–4 (con lo que ya existe). Preguntas entra cuando estén sus historias; Piloto, más adelante.
- Orden en el perfil: 3 pasos · Negocios · Precios · Instalar · Preguntas · Piloto. En el celular se ven unos 4½ y el resto se desliza.
- Ver `perfil-instagram/destacados-preview.png`.
- **Story-01 CTA corregida (7 oct 2026):** el aro tapaba parte de "Tus clientes la instalan con un toque". Se movió arriba a la derecha, al espacio libre entre el encabezado y el titular, y ya no cubre texto. Lo demás no cambió. `kit-redes/story-01-cta.png` es la versión corregida; la anterior quedó como `story-01-cta-v1.png`.

---

## 8. Primeros posts: cuadrícula y fijados

### Cuadrícula vertical 3:4: resuelto con las versiones 3:4 del kit
Desde 2025, Instagram muestra cada post del perfil como un **recorte vertical 3:4 tomado del centro**. Si se suben cuadrados (1080×1080), pierden ~135 px por lado en la cuadrícula: se cortan el logo, el inicio de los titulares y el @.

**Decisión:** se suben las **versiones 3:4 (1080×1440)** de los 7 posts, en `kit-redes/34/` (hoja de contacto: `kit-redes/34/preview-34.png`). Llevan el mismo copy, paleta, assets y estilo Ciclo v2, reacomodados para el formato vertical. En la cuadrícula se ven completas (logo, titular y @), igual en el feed, y no hace falta "Ajustar vista previa". En los posts que se fijan (03 y 07), el @ quedó abajo a la izquierda para que no lo tape el ícono de fijado. Los originales 1:1 de `kit-redes/` se quedan para Facebook, LinkedIn y X.

De aquí en adelante, los posts nuevos se diseñan en 1080×1440.

### Orden y fijados (7 posts aprobados)
Publicar en el orden del kit (día 1 → 7: 01, 02, 03, 04, 05, 06, 07) y después **fijar 3 posts**: 01 lema, 03 cómo funciona y 07 prueba 30 días. Los fijados van primero y el resto sigue del más nuevo al más viejo:

```
Fila 1 (fijados):  01 Lema        · 03 Cómo funciona · 07 Prueba 30 días
Fila 2 (nichos):   06 Tapioca     · 05 Estética      · 04 Barbería
Fila 3:            02 Adiós cartón ·  (libre)        ·  (libre)
```

- Quien llega ve en la primera fila qué es, cómo funciona y cuánto cuesta. En la segunda se reconoce en su oficio.
- Fíjalos en este orden: **07, luego 03, al final 01**. Instagram suele poner primero el último que fijaste; si no queda así, desfija y vuelve a fijar.

### Para llenar 3×3 (posts 8 y 9)
El kit aprobado tiene **7 posts de feed y 2 stories**. Las stories (9:16) no sirven para la cuadrícula sin adaptarlas. Propuesta, con copy ya aprobado, pendiente de diseño y aprobación:
- **Post 8:** story-01 "Crea tu tarjeta hoy" adaptada a 1080×1440 (fondo bosque).
- **Post 9:** story-02 "Pon el QR donde se vea" adaptada a 1080×1440 (fondo lino).

Publicados en la semana 2, la cuadrícula queda así:
```
Fila 1 (fijados):  01 Lema       · 03 Cómo funciona · 07 Prueba 30 días
Fila 2:            09 Tip QR     · 08 Crea tu tarjeta · 06 Tapioca
Fila 3:            05 Estética   · 04 Barbería      · 02 Adiós cartón
```
Los fondos bosque (01 y 08) quedan en diagonal y no juntos.

- Los captions del kit traen máximo 3 hashtags, dentro del tope actual de Instagram (5 por post).
- Agrega **texto alternativo** a cada post (⋯ → Editar → Texto alternativo) con el titular de la imagen.

---

## 9. Mensajes directos (recomendado)

En Configuración → Herramientas para empresas → **Preguntas frecuentes** (en el chat), usa 4 preguntas de la landing con sus respuestas aprobadas:
1. ¿Mis clientes tienen que descargar algo?
2. ¿Funciona en iPhone y Android?
3. ¿Qué pasa cuando termina la prueba?
4. ¿Puedo cancelar cuando quiera?

Respuesta guardada sugerida para "¿Cuánto cuesta?": `Pruébala gratis 30 días, sin tarjeta de crédito. Después: Inicio $299 MXN/mes + IVA o Negocio $449 MXN/mes + IVA. Todo en lealtab.com`

---

## 10. Checklist para completar el perfil

**Cuenta**
- [ ] Confirmar que `@getlealtab` ya está registrado a nombre de LealTab (en el plan dice "dirección elegida")
- [ ] Cambiar a cuenta profesional → **Empresa**
- [ ] Cuenta **pública**
- [ ] Verificación en dos pasos (con app de autenticación) y correo y teléfono de recuperación de Aarón `[ ]`
- [ ] Vincular la página de Facebook de LealTab, si existe `[ ]` (la portada de FB ya está en `logo/entregables/redes/`)

**Perfil**
- [ ] Foto: `lealtab-avatar-noche-cuadrado-1080.png`
- [ ] Nombre: `LealTab · Tarjeta de lealtad digital`
- [ ] Bio recomendada (134 caracteres)
- [ ] Categoría "Software" + Mostrar categoría: sí
- [ ] Enlace: `https://lealtab.com`, título "Crea tu tarjeta gratis" (landing publicada ✅ 9 oct 2026)
- [ ] WhatsApp vinculado: número `[ ]` + mensaje de bienvenida en WhatsApp Business
- [ ] Correo de contacto: `[ ]` (opcional) · teléfono para llamadas: no · dirección: no
- [ ] Sin botón de acción (reservar/pedir)

**Contenido**
- [x] Corregir el aro de story-01 (7 oct 2026)
- [x] Formato de la cuadrícula: versiones 3:4 (`kit-redes/34/`)
- [ ] Publicar los 7 posts **3:4** con sus captions del kit + texto alternativo
- [ ] Fijar 07 → 03 → 01
- [ ] Subir historias y crear destacados 1–4 con sus portadas y nombres
- [ ] Diseñar los posts 8 y 9 (3:4) e historias de Instalar y Preguntas (opcional, semana 2)
- [ ] Preguntas frecuentes en mensajes directos

---

## 11. Pendientes de Aarón

1. Confirmar que `+52 55 8806 3606` (ya en la landing) es el WhatsApp Business para Instagram.
2. Correo de contacto (si quieres que aparezca).
3. Confirmar que @getlealtab está registrado. (lealtab.com ya está publicada: ver §5, 9 oct 2026).
4. ¿Diseño los posts 8 y 9 (3:4) y las historias de Instalar y Preguntas?

_Resuelto el 7 oct 2026: posts exportados en 3:4 (`kit-redes/34/`) y aro de story-01 corregido._

---

## 12. Aprobación

**Aprobado por Aarón el 7 oct 2026:** avatar noche, nombre "LealTab · Tarjeta de lealtad digital", bio recomendada (134 caracteres), categoría Software, enlace lealtab.com, botón de WhatsApp, 6 destacados (4 al lanzar) y la cuadrícula con 3 fijados. Después de la aprobación se agregaron los posts 3:4 y la corrección de story-01.
