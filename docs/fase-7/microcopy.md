# Microcopy de la Fase 7

Autor: `lealtab-copywriter`. Estado: **borrador para aprobación de Aarón**. Fecha: 22 oct 2026.

## 0. Alcance de esta versión

Esta versión cubre **solo lo que cambió con D-031**: el cliente verifica su teléfono con un código de 6 dígitos desde el registro. Incluye C1 (dos pasos), el segundo negocio con y sin sesión, `/c/recuperar`, la guía de instalación en iPhone con su plan B, los mensajes del proveedor (WhatsApp y SMS) y el renglón de consentimiento.

Pendientes de este archivo, que van en versiones siguientes (no son de este brief): C5 Mis datos, N1 con contraseña opcional y «¿Olvidaste tu contraseña?», texto de «Escribir por WhatsApp» (ya está en `docs/fase-7/propuestas/pq-copy.md`, D-030), términos del límite de sellos en C3 y el párrafo del aviso de privacidad sobre la analítica sin cookies. Los borradores del designer de C5 y N1 están en `docs/fase-7/propuestas/diseno/`.

Fuentes: `AGENTS.md` §4, `PRODUCT.md` (Brand Commitments), `identidad-de-marca.md` §4, `07-entrega-desarrollo.md` §6 y §8, pieza 06 (R1 a R4), `tarjeta-con-leyenda.html` (C1 y C2 aprobados), D-019, D-024, D-026, D-031, ADR-003 §2.2, §2.3 y §2.8, ADR-004 §2, PRD v2.5 RF-APP-01 a 04, 14 y 15.

### Reglas que seguí

- Español de México, de tú, frases cortas. Calmado: dice qué pasó y qué hacer, nunca culpa al cliente ni al negocio.
- Sin «OTP», «token», «sesión» ni «autenticación» en pantalla. Se dice **«código»**. «Sesión» solo aparece en la forma «cerramos tu tarjeta en otros teléfonos».
- **Quién habla:** el paso 1 de C1 y la tarjeta hablan con la voz **del negocio** (como en el wireframe aprobado). El paso del código, los errores del código y `/c/recuperar` hablan con la voz **de LealTab**, porque el código lo manda LealTab. «Hecho con LealTab» queda en el pie de C1 y C2 (D-016).
- La respuesta es **la misma para un teléfono nuevo y uno que ya usa LealTab** (ADR-003 §2.2, RF-APP-04): ningún texto dice «bienvenido de nuevo», «ya tienes cuenta» ni «te recuperamos».
- Hora siempre como `HH:MM` de 24 h («a las 17:35»), igual que «Próximo sello disponible a las HH:MM» de `07-entrega` §6.
- Variables: `{business}` nombre del negocio, `{phone}` teléfono como «993 123 4567», `{last4}` últimos 4 dígitos, `{n}` número, `{s}` segundos, `{time}` hora `HH:MM`, `{minutes}` vigencia del código.
- Plural: «Te quedan {n} intentos» / «Te queda 1 intento».
- **Vigencia del código:** el texto dice 10 minutos. Está **Por definir** hasta confirmar en el panel de Supabase que es alcanzable (RF-APP-15, ADR-003 §3 prueba 3). Va como variable `{minutes}`.

---

## 1. C1 Registro (`/c/{slug}/`)

- **Objetivo:** que el cliente termine su registro en menos de un minuto, aun con el paso del código.
- **Público:** cliente final en el mostrador, de pie, con el celular en la mano, a veces con mala señal.
- **Variante A/B:** una sola propuesta, sin prueba hasta tener volumen del piloto. Hipótesis a medir después: el texto bajo el botón del paso 1 (con y sin la línea sobre confirmar el número) y cuál lleva a más códigos escritos. El botón del paso 1 ya está decidido: «Enviarme el código».
- **Métrica de éxito:** MET-03 (registro completado; D-031 advierte que puede bajar por el paso extra). Eventos de códigos pedidos, verificados y fallidos: **Por definir**, los propone `lealtab-analista-metricas` (ADR-003 §3 punto 9).

### 1.1 Paso 1: nombre, WhatsApp y consentimiento (sin sesión)

Voz del negocio. Lo aprobado se conserva tal cual; cambia el botón (ver nota).

| Elemento | Texto |
|---|---|
| Título (h1) | `Junta sellos y gana {recompensa}` (aprobado, el negocio lo completa) |
| Subtítulo | Tu tarjeta digital siempre a un toque. |
| Etiqueta del nombre | Tu nombre |
| Etiqueta de WhatsApp | Tu WhatsApp |
| Ayuda del WhatsApp | 10 dígitos. Si ya usas LealTab en otro negocio, escribe el mismo número y ahí tendrás todas tus tarjetas. |
| Aviso corto (aprobado) | **Tus datos, claros.** {business} usará tu nombre y WhatsApp solo para tu tarjeta de lealtad. No los vendemos ni los compartimos. |
| Enlace del aviso | Lee el aviso de privacidad |
| Casilla (aprobado) | Acepto el aviso de privacidad |
| Renglón de código (voz de LealTab, antes del botón) | Ver §6 |
| Botón principal | Enviarme el código |
| Texto bajo el botón | Te mandamos un código por WhatsApp para confirmar que el número es tuyo. |
| Pie | Hecho con **LealTab** |

**Nota sobre el botón (decidido por Aarón, 22 oct 2026).** El aprobado «Crear mi tarjeta» ya no es verdad en el paso 1, porque ahí todavía no se crea nada. El paso 1 lleva **«Enviarme el código»** y **«Crear mi tarjeta»** (copy clave aprobado) pasa al botón del paso 2, donde sí se crea.

| Estado | Elemento | Texto | aria |
|---|---|---|---|
| Campo de WhatsApp | `aria-label` (si no hay etiqueta visible) | Tu WhatsApp, 10 dígitos | `inputmode="tel"`, `autocomplete="tel-national"`, ligado a la ayuda con `aria-describedby` |
| Error: nombre vacío | Debajo del campo | Error: escribe tu nombre. | `aria-describedby`; `aria-invalid="true"` |
| Error: número no válido (R2, aprobado) | Debajo del campo | Error: escribe tus 10 dígitos, por ejemplo 993 123 4567. | igual |
| Error: número de otro país o prefijo no aceptado | Debajo del campo | Error: por ahora solo aceptamos celulares de México, de 10 dígitos. Por ejemplo, 993 123 4567. | igual |
| Error: casilla sin marcar | Junto a la casilla | Error: para continuar, acepta el aviso de privacidad. | igual; el foco pasa a la casilla |
| Enviando | Botón | Enviando código… | `aria-busy="true"`. Mensaje `aria-live="polite"`: «Enviando tu código.» |

No se desactivan los botones para forzar la casilla: se marca el error al enviar y el foco va al primer campo con error.

### 1.2 Paso 2: escribe tu código

Voz de LealTab. Encabezado con el logo del negocio y «‹ Cambiar número».

| Elemento | Texto |
|---|---|
| Título (h1) | Escribe tu código |
| Cuerpo (WhatsApp) | Te lo mandamos por WhatsApp al {phone}. Dura {minutes} minutos. |
| Cuerpo (SMS) | Te lo mandamos por SMS al {phone}. Dura {minutes} minutos. |
| Etiqueta del campo | Código de 6 dígitos |
| Botón principal | Crear mi tarjeta |
| Botón mientras verifica | Verificando… |
| Enlace de regreso | ‹ Cambiar número |
| Enlace de reenvío (activo) | Reenviar código |
| Reenvío en espera | Reenviar código en {s} s |
| Alternativa | Recibir por SMS |
| Pie | Hecho con **LealTab** |

Atributos del campo: `inputmode="numeric"`, `autocomplete="one-time-code"`, `maxlength="6"`, 16 px.

| Elemento | `aria-label` o mensaje `aria-live="polite"` |
|---|---|
| Campo (una caja) | Código de 6 dígitos |
| Campo (seis cajas, si el designer las usa) | Dígito {i} de 6 (cada una); el grupo lleva `role="group"` con `aria-label="Código de 6 dígitos"` |
| Cambiar número | Cambiar número de WhatsApp |
| Reenviar (activo) | Reenviar el código por WhatsApp (o «por SMS» si ya se usó SMS) |
| Reenviar (en espera) | Reenviar código, disponible en {s} segundos |
| Recibir por SMS | Recibir el código por SMS |
| Al enviar (WhatsApp) | Te enviamos un código por WhatsApp al {phone}. |
| Al enviar (SMS pedido por el cliente) | Te enviamos un código por SMS al {phone}. |
| Verificando | Verificando tu código. |
| Cuenta regresiva | **No se anuncia cada segundo.** Se anuncia una vez al empezar («Puedes pedir otro código en 60 segundos.») y otra al terminar («Ya puedes pedir otro código.») |

**Reenvío y SMS.** El reenvío espera 60 s (RF-APP-15). «Recibir por SMS» aparece junto al reenvío y también se habilita a los 60 s, porque la ventana de 60 s de Supabase es por usuario y aplica a cualquier canal. ADR-004 §2.3 habla de «30 a 60 s»; con 60 s no hay un botón que falle. Dudas en §9.

**Nombre del botón de SMS (decidido por Aarón, 22 oct 2026): «Recibir por SMS» en todo el texto.** No uso «Mejor recíbelo por SMS» (ADR-004 §2.3 y `docs/fase-7/medicion.md` §4.3 lo citan con esas palabras). Nota para el arquitecto, que no toqué: alinear esos dos textos con «Recibir por SMS». Cuando ya se usó SMS, el reenvío se llama «Reenviar código» (el chip y el cuerpo ya dicen el canal).

#### Estados del paso 2

| Estado | Título o chip | Cuerpo | Botón(es) | aria-live |
|---|---|---|---|---|
| **Normal** | Escribe tu código | (cuerpo de arriba) | Crear mi tarjeta | — |
| **Enviando de nuevo** (reenvío) | — | Enviando otro código… | Reenviar (en espera) | Enviando otro código. |
| **Reenviado** | — | Listo, te mandamos otro código. El anterior ya no sirve. | — | Te enviamos otro código. El anterior ya no sirve. |
| **Respaldo automático** (el envío por WhatsApp falló y salió por SMS) | — | No pudimos usar WhatsApp, así que te lo mandamos por SMS al {phone}. | — | No pudimos usar WhatsApp. Te enviamos el código por SMS. |
| **Código incorrecto** (1 a 4 fallos) | Error: código incorrecto | Ese código no es el correcto. Revisa los 6 dígitos. {Te quedan {n} intentos. \| Te queda 1 intento.} | Crear mi tarjeta | Código incorrecto. {Te quedan {n} intentos. \| Te queda 1 intento.} |
| **Último intento** (queda 1) | Error: código incorrecto | Ese código no es el correcto. Te queda 1 intento. Si no lo encuentras, pide otro. | Crear mi tarjeta · Pedir otro código | Código incorrecto. Te queda 1 intento. |
| **Vencido** | Código vencido | Este código ya venció: dura {minutes} minutos. Pide uno nuevo. | Pedir otro código | Este código ya venció. Pide uno nuevo. |
| **Incorrecto o vencido** (respaldo, si Supabase no distingue) | Error: código no válido | Ese código no es correcto o ya venció. Revisa los 6 dígitos o pide uno nuevo. | Crear mi tarjeta · Pedir otro código | Código no válido. Revisa los 6 dígitos o pide uno nuevo. |
| **Demasiados intentos y bloqueo de 15 min** (5.º fallo) | Número en pausa | Hubo 5 intentos con este código, así que lo cancelamos. Por seguridad, este número descansa hasta las {time}. Después podrás pedir otro código. {askCounter} | Cambiar número · Entendido | Número en pausa hasta las {time}. Después podrás pedir otro código. |
| **Número en pausa** (pide código o escribe mientras dura el bloqueo) | Número en pausa | Este número está en pausa por seguridad hasta las {time}. Puedes volver a intentarlo después de esa hora. {askCounter} | Cambiar número | Este número está en pausa hasta las {time}. |
| **Demasiados códigos** (3 por hora, 10 al día o 10 por hora por IP) | Espera un momento | Ya mandamos varios códigos a este número. Si tienes uno reciente, escríbelo arriba: dura {minutes} minutos. Si no, inténtalo más tarde. {askCounter} | Entendido | Ya mandamos varios códigos. Inténtalo más tarde. |
| **Número no válido** (el servidor lo rechaza aunque el campo pasó) | Error | Por ahora solo aceptamos celulares de México, de 10 dígitos. Revisa tu número. | Cambiar número | Número no válido. Revisa tu WhatsApp. |
| **Sin conexión** | Chip tostado «Sin conexión» | Para crear tu tarjeta hace falta internet. Lo que escribiste se queda aquí; inténtalo cuando vuelva la señal. | Intentar de nuevo | Sin conexión. Inténtalo cuando vuelva el internet. |
| **Error del envío** (fallo puntual: tiempo agotado o error 5xx; un reintento puede funcionar) | No podemos registrarte ahora | Tuvimos un problema para enviarte el código. No hiciste nada mal. Inténtalo de nuevo en unos minutos. {askCounter} | Intentar de nuevo | No podemos registrarte ahora. Inténtalo de nuevo en unos minutos. |
| **Proveedor caído o sin servicio** (R-18: fallan WhatsApp y SMS, tope global del día o sin saldo) | No podemos registrarte ahora | Por ahora no podemos mandar códigos. No es tu número ni tu negocio: es un problema de nuestro lado. Inténtalo más tarde. {askCounter} Si ya tenías tu tarjeta, tus sellos siguen igual. | Intentar de nuevo | No podemos registrarte ahora. Inténtalo más tarde. |
| **No me llega el código** (línea fija bajo «Reenviar» y «Recibir por SMS») | — | ¿No te llega? Pasa a veces. {askCounter} | — | — |
| **Éxito** | Tu tarjeta está lista | Número verificado. Tu tarjeta de {business} ya está en tu celular. | (pasa a C3 / C2) | Número verificado. Tu tarjeta de {business} está lista. |
| **Éxito con sello de bienvenida** (RF-APP-09) | Tu tarjeta está lista | Tu sello de bienvenida ya está aquí. | (C3 con 1/N) | Tu tarjeta está lista. Tu sello de bienvenida ya está aquí. |

Notas de redacción:

- «No hiciste nada mal» solo va en el error del envío, donde el cliente suele sospechar que escribió mal su número. En los demás errores basta con no culpar. En el de proveedor caído, «es un problema de nuestro lado» (LealTab) no culpa ni al cliente ni al negocio.
- **`{askCounter}`** (decidido por Aarón, 22 oct 2026: el cliente que no recibe su código pregunta en el mostrador y lo atiende el negocio): en C1 y segundo negocio es **«Pregunta en el mostrador de {business}: ahí te ayudan.»**; en `/c/recuperar`, que no tiene negocio, es **«Pregunta en el mostrador de un negocio donde tengas tu tarjeta: ahí te ayudan.»**. En ningún error del cliente va «Ayuda por WhatsApp». Cierra la PQ nueva que había sugerido sobre quién atiende al cliente. `aria-live`: la frase va dentro del mismo mensaje del error, no aparte.
- «Ahí te ayudan» promete atención, no una solución: en el MVP el negocio no puede verificar ni desbloquear un número (D-024, sin verificación por el cajero). Ver §9.
- **«Número en pausa»** y no «bloqueado»: es la misma regla (15 min), con un tono más calmado. El chip lleva la palabra, no solo el color (tostado para aviso, rojo para error, bosque para éxito).
- «Demasiados intentos» no aparece como título para no sonar a acusación. El 5.º fallo explica qué pasó y cuándo termina.
- **Éxito:** no menciona «cuenta» ni «te recuperamos», para no revelar si el número ya existía. Si el cliente ya tenía tarjetas, las ve en Mis tarjetas (C0) y no hace falta decirlo antes.
- La **hora** de la pausa viene del servidor (`bloqueado_hasta`) y se muestra en la hora del teléfono.

---

## 2. Segundo negocio

- **Objetivo:** que quien ya usa LealTab agregue otro negocio en un toque, y que quien llega a otro navegador recupere todo con un código.
- **Público:** cliente que ya tiene una tarjeta y escanea el QR de un segundo negocio.
- **Variante A/B:** ninguna.
- **Métrica de éxito:** clientes con 2 o más negocios (`cliente_registrado` con `identidad_nueva` = no, `07-entrega` §5) y `app_abierta` en la app instalada en ≤7 días. Sin sesión, también cuenta en MET-05 (recuperaciones, PRD).

### 2.1 Con sesión en el navegador (sin código)

Voz del negocio, con la cuenta de LealTab como contexto. No se vuelve a pedir el WhatsApp.

| Elemento | Texto |
|---|---|
| Título (h1) | Agrega tu tarjeta de {business} |
| Subtítulo | Ya tienes tu cuenta de LealTab. Solo confirma tu nombre para este negocio. |
| Línea de cuenta | Entraste con el número que termina en {last4}. (El designer lo muestra enmascarado, «+52 993 ••• 4567», con «Verificado»; vale cualquiera de las dos formas.) |
| Enlace de cambio | ¿No eres tú? Usar otro número |
| Etiqueta del nombre | Tu nombre en {business} |
| Valor inicial del campo | El último nombre que dio el cliente (decidido por Aarón, 22 oct 2026), **prellenado y editable**. Se prellena solo con sesión: es su propia cuenta |
| Ayuda del nombre (prellenado) | Usamos el último nombre que diste. Puedes cambiarlo: cada negocio guarda el que le das aquí y ningún otro negocio lo ve. |
| Ayuda del nombre (si no hay nombre previo) | Cada negocio guarda el nombre que le das aquí. Ningún otro negocio lo ve. |
| Aviso corto (aprobado, mismo texto de C1) | **Tus datos, claros.** {business} usará tu nombre y WhatsApp solo para tu tarjeta de lealtad. No los vendemos ni los compartimos. |
| Enlace del aviso | Lee el aviso de privacidad |
| Casilla | Acepto el aviso de privacidad de {business} |
| Botón principal | Agregar mi tarjeta |
| Botón en curso | Agregando… |
| Pie | Hecho con **LealTab** |

| Estado | Texto | aria-live |
|---|---|---|
| Error: nombre vacío (el cliente borró el prellenado) | Error: escribe tu nombre. | — |
| Error: casilla sin marcar (siempre llega desmarcada) | Error: para continuar, acepta el aviso de privacidad de {business}. | — |
| Sin conexión | Para agregar tu tarjeta hace falta internet. Inténtalo cuando vuelva la señal. | Sin conexión. Inténtalo cuando vuelva el internet. |
| Error al guardar | No pudimos agregar tu tarjeta. No se guardó nada. Inténtalo de nuevo. | No pudimos agregar tu tarjeta. Inténtalo de nuevo. |
| Éxito | Listo, agregamos tu tarjeta de {business} a Mis tarjetas. | Tu tarjeta de {business} ya está en Mis tarjetas. |
| Éxito con sello de bienvenida | Listo. Tu sello de bienvenida ya está aquí. | Tu tarjeta está lista. Tu sello de bienvenida ya está aquí. |

`aria-label` de «¿No eres tú? Usar otro número»: «Usar otro número de WhatsApp». Qué hace ese enlace (cerrar la sesión de este navegador y pasar al §1) lo decide el designer: ver §9.

**Si el navegador ya tiene la tarjeta de ese negocio** (el cliente vuelve a escanear el QR del mostrador): no se pide nada y se abre C3. Texto de apoyo opcional, `aria-live`: «Ya tienes tu tarjeta de {business}.»

### 2.2 Sin sesión (otro navegador, otro teléfono o PWA sin instalar)

Es **el mismo C1** del §1, sin ningún texto distinto antes de verificar (no se puede saber si el teléfono ya existe). Lo único que cambia es lo que ve el cliente **después** de verificar su propio código:

| Elemento | Texto |
|---|---|
| Aviso en Mis tarjetas (solo si se recuperaron 2 o más tarjetas, o si ya existía la identidad) | Listo, aquí están tus tarjetas. |
| `aria-live` | Número verificado. Aquí están tus tarjetas. |

La ayuda del WhatsApp del §1.1 («Si ya usas LealTab en otro negocio, escribe el mismo número…») es lo que prepara al cliente sin revelar nada.

---

## 3. Recuperación (`/c/recuperar`)

- **Objetivo:** que el cliente que cambió de teléfono o perdió su sesión entre a sus tarjetas con un código.
- **Público:** cliente con tarjetas que abre LealTab en un navegador nuevo.
- **Variante A/B:** ninguna.
- **Métrica de éxito:** `recuperacion_completada` (`07-entrega` §5; MET-05, objetivo <10 % de los inscritos). Meta de fallos: por debajo del 5 % de las recuperaciones del piloto en los dos canales (D-024).

### 3.1 Paso 1

| Elemento | Texto |
|---|---|
| Título (h1) | Recupera tus tarjetas |
| Cuerpo | Escribe tu WhatsApp. Te mandamos un código para entrar a todas tus tarjetas. |
| Etiqueta | Tu WhatsApp |
| Ayuda | 10 dígitos. Si cambiaste de teléfono, escribe tu número de antes. |
| Renglón de código | Ver §6 |
| Botón principal | Enviarme el código |
| Enlace de ayuda | ¿Ya no tienes ese número? |
| Despliegue de ese enlace (título) | Si ya no tienes ese número |
| Despliegue (cuerpo) | No podemos pasar tus sellos a un número nuevo. Puedes empezar de cero con tu número de ahora: escanea el QR de tu negocio y regístrate. |
| Pie | Hecho con **LealTab** |

Errores del campo, de «Enviando…», «Sin conexión» y «Error del proveedor»: los mismos del §1.1 y §1.2.

**«Empezar de cero» es la consecuencia de ADR-003 §2.2** (con un número nuevo no se recupera nada). El texto no promete que el negocio pueda mover los sellos, porque en el MVP no tiene cómo.

### 3.2 Paso 2

Igual al §1.2, con estos cambios:

| Elemento | Texto |
|---|---|
| Título (h1) | Escribe tu código |
| Botón principal | Entrar |
| Botón mientras verifica | Verificando… |
| Éxito | Listo, aquí están tus tarjetas. |
| `aria-live` del éxito | Número verificado. Aquí están tus tarjetas. |

### 3.3 Se cerraron las demás sesiones

Al verificar, el servidor cierra las otras sesiones de ese usuario (`signOut` con `scope: 'others'`, ADR-003 §2.2).

**Donde acaba de entrar** (aviso informativo en Mis tarjetas, una sola vez):

| Elemento | Texto |
|---|---|
| Chip | Más seguro |
| Cuerpo | Por tu seguridad, cerramos tus tarjetas en otros teléfonos y navegadores. Si las necesitas ahí, entra de nuevo con un código. |
| Botón | Entendido |
| `aria-live` | Cerramos tus tarjetas en otros teléfonos y navegadores. |

**En el dispositivo que se quedó sin sesión** (cuando intenta renovar y ya no puede):

| Elemento | Texto |
|---|---|
| Título (h1) | Confirma tu número otra vez |
| Cuerpo | Cerramos tus tarjetas en este teléfono porque entraste desde otro lugar. Pide un código y las vuelves a ver. |
| Botón | Recibir código |
| `aria-live` | Tu sesión se cerró en este teléfono. Pide un código para volver a entrar. |

Sin conexión, la tarjeta guardada se sigue viendo con «Puede haber sellos pendientes» (R4); este aviso aparece cuando vuelve la conexión. Los accesos ya emitidos pueden vivir hasta 1 hora (ADR-003 §2.2): por eso el texto no promete «cerrada al instante».

---

## 4. Instalación (C2) y plan B del acceso del ícono

- **Objetivo:** que el cliente guarde su tarjeta en el inicio sin sentir que instala una app. Instalar nunca es obligatorio.
- **Público:** cliente con iPhone (Safari); Android más abajo.
- **Variante A/B:** por medir en el piloto, como pide RF-APP-07: encabezado «Tenla siempre a un toque» (aprobado) frente a «Guarda tus tarjetas en tu inicio».
- **Métrica de éxito:** `guia_instalacion_mostrada` → `pwa_instalada` y `install_token_canjeado` (`07-entrega` §5); MET-06 mide la transferencia (≥80 %).

### 4.1 Guía en iPhone

| Elemento | Texto |
|---|---|
| Píldora | Tu tarjeta está lista |
| Título (h1, aprobado) | Tenla siempre a un toque |
| Cuerpo (RF-APP-07) | Guarda tus tarjetas en tu inicio. Sin descargar nada. |
| Pestañas | iPhone · Android |
| Paso 1 | Toca **Compartir** (el cuadro con una flecha) abajo en Safari. |
| Ayuda del paso 1 | ¿No lo ves? Toca los tres puntos (···) y luego **Compartir**. |
| Paso 2 | Elige **Agregar a inicio**. |
| Paso 3 | Toca **Agregar**. ¡Listo! |
| Botón principal | Ya la agregué |
| Botón secundario | Ahora no |
| Pie de ayuda | Si la pierdes, recupérala con tu WhatsApp. |
| Pie | Hecho con **LealTab** |

`[SUPUESTO]` La ayuda del paso 1 asume el nuevo diseño de Safari en iOS 26, donde el botón Compartir puede quedar dentro del menú «···». Se confirma en un iPhone real con iOS 18 y 26 (RNF-PWA-07). Si no aplica, se quita esa línea.

| Elemento | `aria-label` o `aria-live` |
|---|---|
| Pestañas | `role="tablist"` con `aria-label="Instrucciones por tipo de teléfono"`; cada pestaña: «Instrucciones para iPhone» y «Instrucciones para Android» |
| Lista de pasos | `aria-label="Tres pasos para guardar tu tarjeta en el inicio"` |
| Ícono de Compartir | `aria-hidden`; el texto ya dice «Compartir» |
| «Ya la agregué» | Al tocarlo: «Listo. Tu tarjeta ya está en tu inicio.» (`aria-live`) |
| «Ahora no» | Cierra la guía sin mensaje y deja la tarjeta funcionando |

**Línea que depende de PQ-31** (opcional, bajo el paso 3): «La primera vez que la abras, puede pedirte confirmar tu número.» Solo se muestra si queda el mecanismo B del ADR-003 §2.3 (pedir un código al abrir la tarjeta instalada). **Por definir (PQ-31)**; si el mecanismo A funciona, no se escribe.

### 4.2 Guía en Android

| Elemento | Texto |
|---|---|
| Paso 1 | Toca **Instalar** en el aviso que aparece abajo. |
| Paso 2 (si no apareció) | Abre el menú (⋮) y elige **Instalar app** o **Agregar a la pantalla principal**. |
| Paso 3 | Confirma con **Instalar**. ¡Listo! |

`[SUPUESTO]` Los nombres exactos del menú de Chrome cambian según la versión; se confirman en un Android real. Si el navegador es el de WhatsApp o Instagram, aplica R3 (aprobado): «Este navegador no permite agregar la tarjeta a tu inicio. Ábrela en Safari (iPhone) o Chrome (Android).»

### 4.3 Si el acceso del ícono falla y se pide un código nuevo

Cuando se abre la tarjeta desde el ícono en iPhone y el acceso preparado al instalarla ya no sirve (pasó más de un día, ya se usó o no se pudo canjear), la tarjeta pide un código. El texto no habla de «acceso» ni «token».

| Elemento | Texto |
|---|---|
| Título (h1) | Confirma tu número |
| Cuerpo | No pudimos abrir tus tarjetas desde este ícono. Escribe tu WhatsApp, te mandamos un código y entras en segundos. |
| Etiqueta | Tu WhatsApp |
| Botón principal | Recibir código |
| Pie | Tu tarjeta no se perdió: sigue guardada con tu número. |
| `aria-live` al mostrarse | No pudimos abrir tus tarjetas desde este ícono. Confirma tu número con un código. |

Después sigue el paso 2 del §1.2 con el botón **«Entrar»** y el éxito «Listo, aquí están tus tarjetas.». «Tu tarjeta no se perdió» es verdad solo si el cliente sigue con el mismo número; si no recuerda cuál usó, ve el despliegue del §3.1.

---

## 5. Mensajes que envía el proveedor (SMS Masivos)

El código lo manda **LealTab**, no el negocio, y el hook de Supabase no conoce el negocio (ADR-004 §2.8). Por eso ningún mensaje lleva el nombre del negocio: lleva «LealTab».

### 5.1 WhatsApp: plantilla fija del proveedor

La plantilla es del proveedor y **no la controlamos** (D-024, ADR-004 §1). **Ya no se pide nada por escrito a SMS Masivos** (decisión de Aarón, 22 oct 2026: ya tiene cuenta y solo se usa su API; PQ-30 queda como spike del hook). El texto de la plantilla de WhatsApp, su remitente y su costo los fija el proveedor al usar su API; el costo real se conocerá con la factura. Si el texto que entregue el proveedor no dice «LealTab», lleva enlaces o no es de autenticación, lo revisamos contra las reglas de este §5.

Lo que sigue es solo **referencia**, no se controla:

**Texto ideal (propuesta, no controlada):**

> **{{code}}** es tu código de verificación de LealTab. Vence en 10 minutos. Por tu seguridad, no lo compartas con nadie.

`[SUPUESTO]` Sigue la forma que Meta usa en sus plantillas de autenticación (código, vigencia, aviso de seguridad). No lo verifiqué contra la documentación de Meta; verifícalo en https://developers.facebook.com/docs/whatsapp/ antes de compararlo con el texto que entregue el proveedor al usar su API. Si el texto es distinto, se revisa contra estas reglas: dice «LealTab», no culpa, no pide dar el código a nadie, y no tiene enlaces.

### 5.2 SMS: texto en GSM-7

Reglas aplicadas: sin acentos ni «ñ» (ni «¡» ni «¿»), sin emojis, sin enlaces, sin llaves ni símbolos de extensión, un solo segmento (máx. 160 caracteres) y con `{{code}}` y `{{company}}` (obligatorios en el proveedor).

**Plantilla (se envía al proveedor):**

```
{{company}}: tu codigo es {{code}}. Vence en 10 min. No lo compartas con nadie. Si no lo pediste, ignora este mensaje.
```

**Como lo verá el cliente** (`company` = `LealTab`, código de 6 dígitos):

```
LealTab: tu codigo es 123456. Vence en 10 min. No lo compartas con nadie. Si no lo pediste, ignora este mensaje.
```

| Dato | Valor |
|---|---|
| Caracteres del mensaje ya sustituido | **112** (límite: 160, un solo segmento) |
| Caracteres de la plantilla con `{{company}}` y `{{code}}` | 118 |
| Caracteres usados | letras A a Z sin acentos, dígitos, espacio, `:`, `.` y `,` (todos del alfabeto básico GSM-7) |
| Caracteres evitados | «á é í ó ú ñ ¡ ¿», `{ } [ ] \ ^ ~ \| €` (los de extensión cuentan doble) |

**Por qué «codigo» sin acento.** La «ó» no está en el alfabeto básico de GSM-7, y un solo carácter fuera de él pasa el mensaje a UCS-2 (límite de 70 caracteres y mayor costo). La «ñ» sí está en GSM-7, pero ADR-004 §1 dice que el proveedor tampoco acepta «á, é, ó»; por eso evité todo acento y la «ñ» hasta que el proveedor confirme su alfabeto exacto. Se mantiene «código» en pantalla y «codigo» en el SMS: así lo escriben los bancos y las tiendas en México.

**No pude verificarlo con un script.** Mi rol no tiene Bash. Conté a mano, dos veces, por tramos: «LealTab:» 8, «tu» 3, «codigo» 7, «es» 3, «123456.» 8, «Vence» 6, «en» 3, «10» 3, «min.» 5, «No» 3, «lo» 3, «compartas» 10, «con» 4, «nadie.» 7, «Si» 3, «no» 3, «lo» 3, «pediste,» 9, «ignora» 7, «este» 5, «mensaje.» 9 (cada tramo cuenta su espacio inicial) = 112. Falta una prueba automática: el desarrollador debe agregar una prueba que (a) compruebe que cada carácter del texto sustituido está en el alfabeto básico GSM-7 y (b) que el largo con un código de 6 dígitos y `company = "LealTab"` es ≤160. Con eso queda cerrada la verificación.

**Nota sobre la vigencia.** «Vence en 10 min» depende de que Supabase permita 10 min (ADR-003 §3 prueba 3). Si la vigencia cambia, cambia el texto: el número va como constante.

**Autollenado del código.** El campo lleva `autocomplete="one-time-code"` para que iPhone y Android sugieran el código. No agrego la línea de dominio de la Web OTP API porque el SMS no lleva enlaces ni dominios; si el piloto muestra que hace falta, se evalúa.

**Un solo texto para registro, recuperación e instalación:** el hook no distingue el propósito de cara al cliente y no hace falta.

---

## 6. Renglón de consentimiento antes de enviar el código (PQ-18)

El número del cliente sale hacia el proveedor (SMS Masivos, en Estados Unidos) **desde el paso 1**, antes de que escriba el código. El renglón va **debajo de la casilla del aviso y arriba del botón «Enviarme el código»** (C1 y `/c/recuperar`), en texto pequeño de 14 px con contraste AA. Voz de LealTab.

| Opción | Texto | Cuándo |
|---|---|---|
| **A (propuesta)** | Para mandarte el código, LealTab envía tu WhatsApp a su proveedor de mensajes. Lo explicamos en el aviso de privacidad. | Si el abogado acepta no nombrar al proveedor |
| **B (con nombre)** | Para mandarte el código, LealTab envía tu WhatsApp a su proveedor de mensajes, SMS Masivos, que trata los datos en Estados Unidos. Lo explicamos en el aviso de privacidad. | Si el abogado pide nombrarlo y decir el país |

- Enlace del renglón: «aviso de privacidad» (mismo enlace de C1).
- `aria`: el renglón es texto, no un control. Se liga al botón con `aria-describedby`.
- **Texto legal final: Por definir (PQ-18).** No doy opinión legal. Preguntas para el abogado, que yo no resuelvo: (1) si basta la casilla actual «Acepto el aviso de privacidad» o hace falta una aceptación separada para el envío al proveedor; (2) si se nombra al proveedor y el país (opciones A y B); (3) si se menciona la conservación de hasta 3 meses del número y del contenido del mensaje por parte del proveedor; (4) cómo se declara que la sesión usa una cookie necesaria de primera parte (PQ-18, punto 4).
- La cuenta de LealTab como responsable o encargada también es de la consulta legal (D-017); el texto usa «LealTab envía» solo como lenguaje claro, no como definición legal.

---

## 7. Resumen de textos por voz

| Voz | Dónde |
|---|---|
| **Negocio** | Título y aviso corto de C1 (paso 1), segundo negocio con sesión, tarjeta |
| **LealTab** | Paso del código, errores del código, `/c/recuperar`, aviso de sesiones cerradas, plan B del ícono, mensajes de WhatsApp y SMS |
| **Ambas, con «Hecho con LealTab» en el pie** | C1 y C2 |

---

## 8. Constantes sugeridas para `web/src/content/`

Nombres en inglés, textos en español. Siguen el patrón de la landing (constantes tipadas, sin texto en los componentes). Las funciones reciben las variables; ningún componente concatena frases.

**Archivo `client-signup.ts`**

| Constante | Texto o forma |
|---|---|
| `signupStep1.title` | `(reward: string) => \`Junta sellos y gana ${reward}\`` |
| `signupStep1.subtitle` | Tu tarjeta digital siempre a un toque. |
| `signupStep1.nameLabel` | Tu nombre |
| `signupStep1.phoneLabel` | Tu WhatsApp |
| `signupStep1.phoneHint` | 10 dígitos. Si ya usas LealTab en otro negocio, escribe el mismo número y ahí tendrás todas tus tarjetas. |
| `signupStep1.privacyIntro` | `(business: string) => ...` («Tus datos, claros. {business} usará…») |
| `signupStep1.privacyLink` | Lee el aviso de privacidad |
| `signupStep1.consentCheckbox` | Acepto el aviso de privacidad |
| `signupStep1.submit` | Enviarme el código |
| `signupStep1.submitHint` | Te mandamos un código por WhatsApp para confirmar que el número es tuyo. |
| `signupStep1.submitting` | Enviando código… |
| `signupErrors.nameRequired` | Error: escribe tu nombre. |
| `signupErrors.phoneInvalid` | Error: escribe tus 10 dígitos, por ejemplo 993 123 4567. |
| `signupErrors.phoneForeign` | Error: por ahora solo aceptamos celulares de México, de 10 dígitos. Por ejemplo, 993 123 4567. |
| `signupErrors.consentRequired` | Error: para continuar, acepta el aviso de privacidad. |
| `signupFooter` | Hecho con LealTab (la marca va en negritas; el componente lo arma) |

**Archivo `client-code.ts`** (paso del código, compartido por C1, `/c/recuperar` y el plan B del ícono)

| Constante | Texto o forma |
|---|---|
| `codeStep.title` | Escribe tu código |
| `codeStep.bodyWhatsapp` | `(phone: string, minutes: number) => \`Te lo mandamos por WhatsApp al ${phone}. Dura ${minutes} minutos.\`` |
| `codeStep.bodySms` | `(phone: string, minutes: number) => \`Te lo mandamos por SMS al ${phone}. Dura ${minutes} minutos.\`` |
| `codeStep.fieldLabel` | Código de 6 dígitos |
| `codeStep.digitLabel` | `(i: number) => \`Dígito ${i} de 6\`` |
| `codeStep.changePhone` | ‹ Cambiar número |
| `codeStep.changePhoneAria` | Cambiar número de WhatsApp |
| `codeStep.submitSignup` | Crear mi tarjeta |
| `codeStep.submitRecover` | Entrar |
| `codeStep.verifying` | Verificando… |
| `codeStep.resend` | Reenviar código |
| `codeStep.resendWait` | `(s: number) => \`Reenviar código en ${s} s\`` |
| `codeStep.resendWaitAria` | `(s: number) => \`Reenviar código, disponible en ${s} segundos\`` |
| `codeStep.viaSms` | Recibir por SMS |
| `codeStep.viaSmsAria` | Recibir el código por SMS |
| `codeLive.sentWhatsapp` | `(phone: string) => \`Te enviamos un código por WhatsApp al ${phone}.\`` |
| `codeLive.sentSms` | `(phone: string) => \`Te enviamos un código por SMS al ${phone}.\`` |
| `codeLive.resent` | Te enviamos otro código. El anterior ya no sirve. |
| `codeLive.fallbackToSms` | No pudimos usar WhatsApp. Te enviamos el código por SMS. |
| `codeLive.waitStart` | Puedes pedir otro código en 60 segundos. |
| `codeLive.waitEnd` | Ya puedes pedir otro código. |
| `codeLive.verifying` | Verificando tu código. |
| `codeLive.success` | `(business: string) => \`Número verificado. Tu tarjeta de ${business} está lista.\`` |
| `codeLive.successRecover` | Número verificado. Aquí están tus tarjetas. |
| `codeErrors.wrong` | `(left: number) => ...` («Ese código no es el correcto. Revisa los 6 dígitos. Te quedan N intentos.» y la forma «Te queda 1 intento.») |
| `codeErrors.wrongLastTry` | Ese código no es el correcto. Te queda 1 intento. Si no lo encuentras, pide otro. |
| `codeErrors.expired` | `(minutes: number) => ...` («Este código ya venció: dura N minutos. Pide uno nuevo.») |
| `codeErrors.invalidOrExpired` | Ese código no es correcto o ya venció. Revisa los 6 dígitos o pide uno nuevo. |
| `codeErrors.lockedAfterFails` | `(time: string, askCounter: string) => ...` («Hubo 5 intentos con este código, así que lo cancelamos. Por seguridad, este número descansa hasta las HH:MM. Después podrás pedir otro código. ${askCounter}») |
| `codeErrors.phoneLocked` | `(time: string, askCounter: string) => ...` («Este número está en pausa por seguridad hasta las HH:MM. Puedes volver a intentarlo después de esa hora. ${askCounter}») |
| `codeErrors.tooManyCodes` | `(minutes: number, askCounter: string) => ...` («Ya mandamos varios códigos a este número. … Si no, inténtalo más tarde. ${askCounter}») |
| `codeErrors.phoneRejected` | Por ahora solo aceptamos celulares de México, de 10 dígitos. Revisa tu número. |
| `codeErrors.offline` | Para crear tu tarjeta hace falta internet. Lo que escribiste se queda aquí; inténtalo cuando vuelva la señal. |
| `codeErrors.sendFailed.title` | No podemos registrarte ahora |
| `codeErrors.sendFailed.body` | `(askCounter: string) => ...` («Tuvimos un problema para enviarte el código. No hiciste nada mal. Inténtalo de nuevo en unos minutos. ${askCounter}») |
| `codeErrors.providerDown.title` | No podemos registrarte ahora |
| `codeErrors.providerDown.body` | `(askCounter: string) => ...` («Por ahora no podemos mandar códigos. No es tu número ni tu negocio: es un problema de nuestro lado. Inténtalo más tarde. ${askCounter} Si ya tenías tu tarjeta, tus sellos siguen igual.») |
| `askCounter.business` | `(business: string) => \`Pregunta en el mostrador de ${business}: ahí te ayudan.\`` |
| `askCounter.generic` | Pregunta en el mostrador de un negocio donde tengas tu tarjeta: ahí te ayudan. (para `/c/recuperar`, sin negocio) |
| `codeNotArriving` | `(askCounter: string) => \`¿No te llega? Pasa a veces. ${askCounter}\`` |
| `codeErrors.providerDown.retry` | Intentar de nuevo |
| `codeChips` | `{ error: 'Error', expired: 'Código vencido', paused: 'Número en pausa', wait: 'Espera un momento', offline: 'Sin conexión' }` |

**Archivo `client-second-business.ts`**

| Constante | Texto o forma |
|---|---|
| `secondBusiness.title` | `(business: string) => \`Agrega tu tarjeta de ${business}\`` |
| `secondBusiness.subtitle` | Ya tienes tu cuenta de LealTab. Solo confirma tu nombre para este negocio. |
| `secondBusiness.accountLine` | `(last4: string) => \`Entraste con el número que termina en ${last4}.\`` |
| `secondBusiness.notYou` | ¿No eres tú? Usar otro número |
| `secondBusiness.notYouAria` | Usar otro número de WhatsApp |
| `secondBusiness.nameLabel` | `(business: string) => \`Tu nombre en ${business}\`` |
| `secondBusiness.nameHintPrefilled` | Usamos el último nombre que diste. Puedes cambiarlo: cada negocio guarda el que le das aquí y ningún otro negocio lo ve. |
| `secondBusiness.nameHint` | Cada negocio guarda el nombre que le das aquí. Ningún otro negocio lo ve. |
| `secondBusiness.consentCheckbox` | `(business: string) => \`Acepto el aviso de privacidad de ${business}\`` |
| `secondBusiness.submit` | Agregar mi tarjeta |
| `secondBusiness.submitting` | Agregando… |
| `secondBusiness.success` | `(business: string) => \`Listo, agregamos tu tarjeta de ${business} a Mis tarjetas.\`` |
| `secondBusiness.errorSave` | No pudimos agregar tu tarjeta. No se guardó nada. Inténtalo de nuevo. |
| `secondBusiness.alreadyHave` | `(business: string) => \`Ya tienes tu tarjeta de ${business}.\`` |
| `welcomeStamp` | Tu sello de bienvenida ya está aquí. |

**Archivo `client-recover.ts`**

| Constante | Texto o forma |
|---|---|
| `recover.title` | Recupera tus tarjetas |
| `recover.body` | Escribe tu WhatsApp. Te mandamos un código para entrar a todas tus tarjetas. |
| `recover.phoneHint` | 10 dígitos. Si cambiaste de teléfono, escribe tu número de antes. |
| `recover.submit` | Enviarme el código |
| `recover.noNumberLink` | ¿Ya no tienes ese número? |
| `recover.noNumberTitle` | Si ya no tienes ese número |
| `recover.noNumberBody` | No podemos pasar tus sellos a un número nuevo. Puedes empezar de cero con tu número de ahora: escanea el QR de tu negocio y regístrate. |
| `recover.success` | Listo, aquí están tus tarjetas. |
| `sessionsClosed.chip` | Más seguro |
| `sessionsClosed.body` | Por tu seguridad, cerramos tus tarjetas en otros teléfonos y navegadores. Si las necesitas ahí, entra de nuevo con un código. |
| `sessionsClosed.dismiss` | Entendido |
| `sessionsClosed.live` | Cerramos tus tarjetas en otros teléfonos y navegadores. |
| `sessionEnded.title` | Confirma tu número otra vez |
| `sessionEnded.body` | Cerramos tus tarjetas en este teléfono porque entraste desde otro lugar. Pide un código y las vuelves a ver. |
| `sessionEnded.cta` | Recibir código |
| `sessionEnded.live` | Tu sesión se cerró en este teléfono. Pide un código para volver a entrar. |

**Archivo `client-install.ts`**

| Constante | Texto o forma |
|---|---|
| `install.ready` | Tu tarjeta está lista |
| `install.title` | Tenla siempre a un toque |
| `install.body` | Guarda tus tarjetas en tu inicio. Sin descargar nada. |
| `install.tabs` | `{ iphone: 'iPhone', android: 'Android' }` y sus `aria-label` |
| `install.iphoneSteps` | `['Toca Compartir (el cuadro con una flecha) abajo en Safari.', 'Elige Agregar a inicio.', 'Toca Agregar. ¡Listo!']` (los nombres de botón en negritas) |
| `install.iphoneStep1Help` | ¿No lo ves? Toca los tres puntos (···) y luego Compartir. |
| `install.androidSteps` | `['Toca Instalar en el aviso que aparece abajo.', 'Abre el menú (⋮) y elige Instalar app o Agregar a la pantalla principal.', 'Confirma con Instalar. ¡Listo!']` |
| `install.done` | Ya la agregué |
| `install.later` | Ahora no |
| `install.recoverFooter` | Si la pierdes, recupérala con tu WhatsApp. |
| `install.openFromIcon` | Después, ábrela desde el ícono de LealTab en tu inicio. |
| `install.opening` | Abriendo tu tarjeta… |
| `install.doneLive` | Listo. Tu tarjeta ya está en tu inicio. |
| `installTokenFailed.title` | Confirma tu número |
| `installTokenFailed.body` | No pudimos abrir tus tarjetas desde este ícono. Escribe tu WhatsApp, te mandamos un código y entras en segundos. |
| `installTokenFailed.cta` | Recibir código |
| `installTokenFailed.footer` | Tu tarjeta no se perdió: sigue guardada con tu número. |
| `installTokenFailed.live` | No pudimos abrir tus tarjetas desde este ícono. Confirma tu número con un código. |

**Archivo `code-messages.ts`** (solo servidor: lo usa el hook, no el navegador)

| Constante | Texto |
|---|---|
| `SMS_TEMPLATE` | `{{company}}: tu codigo es {{code}}. Vence en 10 min. No lo compartas con nadie. Si no lo pediste, ignora este mensaje.` |
| `SMS_COMPANY` | `LealTab` |
| `SMS_MAX_LENGTH` | `160` |
| `WHATSAPP_TEMPLATE_REFERENCE` | Texto ideal del §5.1, solo como referencia: la plantilla real la fija el proveedor al usar su API (D-024; PQ-30 ya no la pide) |

**Archivo `consent.ts`**

| Constante | Texto |
|---|---|
| `codeConsent.optionA` | Para mandarte el código, LealTab envía tu WhatsApp a su proveedor de mensajes. Lo explicamos en el aviso de privacidad. |
| `codeConsent.optionB` | Para mandarte el código, LealTab envía tu WhatsApp a su proveedor de mensajes, SMS Masivos, que trata los datos en Estados Unidos. Lo explicamos en el aviso de privacidad. |
| `codeConsent.active` | **Por definir (PQ-18):** hasta que el abogado decida, usa la opción A. |

Prueba sugerida para esos archivos: un test unitario que revise que `SMS_TEMPLATE`, con `company = LealTab` y un código de 6 dígitos, solo usa caracteres GSM-7 básicos y mide 160 o menos; y otro que revise que ninguna constante de este archivo contenga «OTP», «token» ni un emoji.

---

## 9. Dudas y PQ

| # | Tema | Quién decide |
|---|---|---|
| PQ-30 | Solo el spike técnico del hook de Supabase sin proveedor nativo. Las confirmaciones con SMS Masivos (plantilla, remitente, cotización, webhooks) no se piden (decisión de Aarón, 22 oct 2026) | Arquitecto (spike), antes de construir C1 |
| PQ-31 | Si el acceso del ícono de iPhone se canjea sin código (mecanismo A) o se pide un código al abrir (mecanismo B). Define la línea opcional del §4.1 y el uso de §4.3 | Arquitecto y desarrollo |
| PQ-18 | Texto legal del renglón del §6, si basta la casilla actual, si se nombra a SMS Masivos y el país, y cómo se declara la cookie de sesión | Aarón con el abogado |
| Vigencia | Si «10 minutos» es alcanzable en Supabase; si no, cambian el SMS y los cuerpos de C1 | Arquitecto (prueba 3 del ADR-003) |
| Canal real | Para escribir «Te lo mandamos por SMS» y «No pudimos usar WhatsApp», la respuesta del servidor debe decir **por qué canal salió** el código. No es un dato que delate si el teléfono existe, pero ADR-003 §2.2 solo dice que la respuesta es «Te enviamos un código». Falta confirmarlo | Arquitecto |
| Vencido o incorrecto | Supabase puede devolver el mismo error para un código vencido y uno incorrecto. Si es así, se usa el texto «Ese código no es correcto o ya venció» y no se muestran las dos pantallas | Desarrollo, en el *spike* |
| Hora de la pausa | El servidor tiene que devolver `bloqueado_hasta`. ADR-003 §2.8 define el bloqueo, no que se informe la hora | Arquitecto |
| Hora del límite por hora o por día | El texto «inténtalo más tarde» no da hora porque el hook solo rechaza. Si se puede devolver cuánto falta, el texto lo diría | Arquitecto |
| Reenvío y SMS | ADR-004 §2.3 dice que el SMS se ofrece «tras 30 a 60 s»; yo propuse 60 s, igual que el reenvío | Diseño y arquitecto |
| «Usar otro número» (§2.1) | Cerrar la sesión local o solo abrir el C1 completo | Designer |
| ~~Botón del paso 1~~ | **Cerrada (Aarón, 22 oct 2026): «Enviarme el código»**; «Crear mi tarjeta» queda en el paso 2 | — |
| ~~Soporte del cliente final~~ | **Cerrada (Aarón, 22 oct 2026): el cliente que no recibe su código pregunta en el mostrador y lo atiende el negocio.** Ningún error del cliente lleva «Ayuda por WhatsApp»; llevan `{askCounter}` (§1.2) | — |
| Qué puede hacer el negocio | En el MVP el mostrador no puede verificar ni desbloquear a nadie (D-024: sin verificación por el cajero; el 5.º fallo bloquea el teléfono 15 min). El texto «ahí te ayudan» promete atención, no solución. Hay que darle al staff qué decir (por ejemplo, «espera al aviso de la hora» o «pide otro código por SMS»): entra al guion de capacitación de N5 de la Fase 8 | `lealtab-copywriter` y `lealtab-investigador-clientes` |
| Textos del arquitecto | ADR-004 §2.3 y `docs/fase-7/medicion.md` §4.3 citan «Mejor recíbelo por SMS»; Aarón decidió «Recibir por SMS». No los toqué | Arquitecto |
| Textos de la pieza 08 | Ver §10: textos de `08-registro-con-codigo.md` que deben coincidir | Designer |
| Eventos | Códigos pedidos, verificados y fallidos, y `cuenta_cliente_borrada` | `lealtab-analista-metricas` |

---

## 10. Textos de `brand/06-product-design/08-registro-con-codigo.md` que deben coincidir con este archivo

Lo ajusta el designer (no toqué `brand/`). Donde dos textos chocan, manda este archivo para el copy; la maqueta manda en la estructura. Decisiones de Aarón del 22 oct 2026 marcadas con (A).

| Criterio de la pieza 08 | Dice ahora | Debe decir |
|---|---|---|
| CA-C1.1, CA-IOS.6 | «Enviarme el código» en el paso 1 | Ya coincide (A) |
| Todos los «Ayuda por WhatsApp» de clientes: CA-C1.10 (1g), CA-C1.26 (2g), CA-REC.6 (REC·5), §3 fila «Ayuda por WhatsApp», §5 viñeta de `whatsapp_ayuda_click` y §6 punto 7 | Botón o enlace «Ayuda por WhatsApp» que abre `wa.me` | Sin botón: la frase `{askCounter}` («Pregunta en el mostrador de {business}: ahí te ayudan.» o la variante genérica de `/c/recuperar`) (A). Ese evento ya no sale de pantallas del cliente; lo revisa el analista |
| CA-C1.10 (1g) | «No pudimos enviar el código… no podemos registrar clientes nuevos» | Título «No podemos registrarte ahora», con dos variantes: error del envío y proveedor caído (§1.2). Sin «clientes nuevos», que habla del negocio y no del cliente |
| CA-C1.3 y CA-R1.2 | «Error: acepta el aviso de privacidad para continuar.» | «Error: para continuar, acepta el aviso de privacidad.» (con «de {business}» en el segundo negocio) |
| CA-C1.8 (1d) | «Error: este número no puede recibir el código. Usa un celular de México de 10 dígitos.» | «Error: por ahora solo aceptamos celulares de México, de 10 dígitos. Por ejemplo, 993 123 4567.» (el segundo texto, del servidor, es «Por ahora solo aceptamos celulares de México, de 10 dígitos. Revisa tu número.») |
| CA-C1.11 (1h) | «Ya se pidieron varios códigos para este número. Puedes intentarlo de nuevo a las HH:MM» (o «mañana») | Título «Espera un momento» y «Ya mandamos varios códigos a este número. Si tienes uno reciente, escríbelo arriba… {askCounter}». La hora solo si el servidor la devuelve (§9) |
| CA-C1.12 | Título «Revisa tu WhatsApp» | «Escribe tu código». Si el designer prefiere «Revisa tu WhatsApp», se cambia en `codeStep.title`, pero cuando el canal sea SMS no sirve |
| CA-C1.16 | «Código incorrecto» y «Revisa los 6 dígitos. Te quedan N intentos» | «Ese código no es el correcto. Revisa los 6 dígitos. Te quedan N intentos.» («Te queda 1 intento» en singular) |
| CA-C1.17 | «Código vencido… dura 10 minutos»; botón «Enviar código nuevo» | Botón **«Pedir otro código»** (o se cambia en este archivo a «Enviar código nuevo»; hay que elegir uno) |
| CA-C1.18, CA-C1.19 | «Reenviar por WhatsApp», «Reenviar por SMS», «Podrás pedir otro en 0:42» | «Reenviar código» y «Reenviar código en {s} s» (el canal ya lo dicen el chip y el cuerpo); «Recibir por SMS» igual (A) |
| CA-C1.20 | «No pudimos mandarlo por WhatsApp, así que te enviamos el código por SMS» | «No pudimos usar WhatsApp, así que te lo mandamos por SMS al {phone}.» |
| CA-C1.26 (2g) | Título «Demasiados intentos» | Título «Número en pausa»; el cuerpo explica los 5 intentos y la hora, y agrega `{askCounter}` |
| CA-C1.24 (2k) | «También recuperamos tus otras N tarjetas» y «Si tenías LealTab abierta en otro teléfono, la cerramos por seguridad» | Es posible (ya es después de verificar). Este archivo usa algo más corto: «Listo, aquí están tus tarjetas.» y «Por seguridad, cerramos tus tarjetas en otros teléfonos y navegadores…». Elegir uno |
| CA-REC.3 | «Recuperaste tus tarjetas» | «Listo, aquí están tus tarjetas.» |
| CA-R1.6 (R1·6), CA-REC.5 | «Sesión cerrada» y «Entrar con mi WhatsApp» | «Confirma tu número otra vez» y «Recibir código» (§3.3). «Sesión» sale del texto visible |
| CA-IOS.4 (I5) | «El acceso ya no sirve» y «Entrar con mi WhatsApp» | «Confirma tu número» y «Recibir código» (§4.3); sin «acceso» |
| CA-IOS.6 (I4) | «Un último paso» con el número enmascarado y «Enviarme el código» | **Diferencia de fondo:** yo escribí §4.3 pidiendo el WhatsApp porque no sabía si el token vencido deja saber el número. Si la maqueta muestra el número enmascarado (el token identifica al cliente), el cuerpo pasa a «Te mandamos un código al número que termina en {last4}.» y el botón a «Enviarme el código». Lo decide el arquitecto con PQ-31 |
| CA-IOS.1 | Línea «después ábrela desde el ícono de LealTab en tu inicio» | La adopto: `install.openFromIcon` = «Después, ábrela desde el ícono de LealTab en tu inicio.» (bajo el paso 3) |
| CA-IOS.2 y CA-IOS.3 | «Abriendo tu tarjeta…» y «Listo: tu tarjeta ya está en tu inicio» | «Abriendo tu tarjeta…» se adopta (`install.opening`); el éxito queda como «Listo. Tu tarjeta ya está en tu inicio.» |
| CA-R1.1, CA-R1.2 | Nombre prellenado `[SUPUESTO]` | Ya no es supuesto: lo decidió Aarón (A). Ayuda del campo en §2.1 |

---

## 11. Pendientes para otras fases o archivos

- C5, N1 con contraseña, restablecimiento, términos del límite de sellos y el párrafo del aviso de privacidad sobre la analítica (Fase 7, siguientes versiones de este archivo).
- Texto del correo del dueño por Resend (código de entrada y restablecimiento): no está en este brief; saldrá con N1.
- Fase 8: `mensajes-whatsapp.md` (invitación, piloto, soporte). El código del cliente **no** es una plantilla nuestra.
- El resumen semanal **no se envía** por WhatsApp ni por correo (D-011): no hay plantilla.
