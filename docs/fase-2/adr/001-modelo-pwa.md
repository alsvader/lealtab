# ADR-001: Modelo de PWA, una por negocio o una sola app LealTab

- **Estado:** Propuesto (revisión 2). La recomendación (opción B) está **condicionada** a dos validaciones (sección 5.1). Pendiente de la confirmación del fundador; cuando la dé, el `lealtab-coordinador` lo registra en `docs/decisiones.md`.
- **Fecha:** 4 oct 2026
- **Autor:** `lealtab-arquitecto`
- **Responde a:** sección 7 de `docs/02-plan-de-trabajo.md` y punto 1 de la sección 11 de `docs/03-propuesta.md`.
- **Restricciones vigentes:** D-001 (tarjeta web/PWA, sin wallets; instalar es opcional) y D-002 (plataforma propia, sin marca blanca).

> **Nota de revisión (4 oct 2026).** La revisión 1 recomendaba la opción H (una PWA por negocio). El fundador prefiere un solo ícono LealTab con la lista de tarjetas en el perfil del cliente. Esta revisión reevalúa la comparación con argumentos que la revisión 1 subestimó: una sola transferencia de sesión en iOS, el alta del segundo negocio, un solo permiso de push y que la tarjeta sigue con la marca del negocio. También reconoce que el argumento del ícono propio no está validado. La recomendación cambia a **B, condicionada**. H queda documentada como alternativa fuerte (sección 5.4) y es el plan de respaldo si fallan las validaciones.

## 1. Contexto

El cliente final llega a la tarjeta escaneando el QR del mostrador de **un** negocio. La tarjeta tiene que funcionar sin instalarse (D-001), y agregarla a la pantalla de inicio es un extra que mediremos (E6: ≥25% de instalación, por separado en iPhone y Android). En México, Android tiene el 78.7% del tráfico web móvil (informe 01, sección 3.4).

La pregunta: cuando el cliente instala, ¿qué ícono ve en su pantalla de inicio?

- **A.** El del negocio ("Café X"), con una PWA por negocio.
- **B.** El de LealTab, con todas sus tarjetas dentro.

Este ADR también fija tres decisiones derivadas que no se pueden posponer: la estructura de URLs, el modelo de identidad del cliente y la forma de pasar la sesión al instalar en iOS.

## 2. Hechos técnicos verificados

Consulté todo el 4 oct 2026. Las fuentes con URL están en la sección 11.

| # | Hecho | Fuente |
|---|---|---|
| H1 | El miembro `id` del manifest identifica la app. Si el `id` es distinto, el navegador la trata como **otra app aunque venga del mismo origen**, y el usuario puede tener las dos instaladas. Sin `id`, se usa `start_url`. | MDN `id` [1]; Chrome [2] |
| H2 | `scope` es un prefijo de ruta (coincidencia simple de texto; conviene terminarlo en `/`). Navegar fuera del scope no se bloquea, pero aparece la barra del navegador. | MDN `scope` [3] |
| H3 | iOS/iPadOS 16.4 soportan `id`, permiten instalar varias copias de una web app con identidades distintas y permiten que los navegadores de terceros ofrezcan "Agregar a inicio". | WebKit 16.4 [4]; WebKit Web Push [5] |
| H4 | En iOS, `apple-touch-icon` **tiene prioridad** sobre los íconos del manifest. Los íconos del manifest se usan solo si no hay `apple-touch-icon` y el `purpose` es `any` o se omite (desde Safari 15.4). | WebKit 15.4 [6] |
| H5 | Desde iOS 26, **todo** sitio agregado a inicio abre como web app por defecto, con o sin manifest. El usuario puede desactivar "Abrir como app web". | WebKit WWDC25 [7] |
| H6 | En iOS, las apps de pantalla de inicio "se crean como entidades aisladas, sin estado compartido con el navegador" (por diseño, según WebKit). Por lo tanto, **la sesión de Safari no pasa a la app instalada**. | WebKit Bugzilla 181849 [8] |
| H7 | En macOS (Agregar al Dock), Safari **sí** copia las cookies a la web app. Apple no documenta lo mismo para iOS. | WebKit WWDC23 [9] |
| H8 | Desde iOS 17, "Agregar a inicio" también está disponible en Safari View Controller, el navegador integrado que usan algunas apps. | WebKit WWDC23 [9] |
| H9 | Safari borra el almacenamiento escribible por script (IndexedDB, localStorage, registros de service worker) tras 7 días de uso de Safari sin interacción con el sitio. Las apps de pantalla de inicio "tienen su propio contador de días de uso". | WebKit ITP [10] |
| H10 | Desde iOS 17, la cuota por origen es de hasta 60% del disco en navegadores. El desalojo es LRU y excluye a los orígenes en modo persistente. `navigator.storage.persist()` se concede con heurísticas, como estar abierto como web app de pantalla de inicio. | WebKit storage policy [11] |
| H11 | Web Push en iOS: solo para web apps agregadas a inicio (16.4+) y con el permiso pedido tras un gesto directo del usuario. El manifest `id` identifica la app para Focus y la sincronización entre dispositivos. | WebKit Web Push [5] |
| H12 | Chrome necesita, para el aviso de instalación (`beforeinstallprompt`): HTTPS, `name`/`short_name`, íconos de 192 y 512 px, `start_url`, un `display` standalone o similar, y al menos un toque más 30 s de interacción. | web.dev install criteria [12] |
| H13 | En Android, cada WebAPK recibe un paquete `org.chromium.webapk.<hash>` derivado del manifest `id`, o sea, un ícono y una app distintos por `id`. Chrome revisa el manifest cada 24 h como máximo y regenera la WebAPK si cambian `name`, `icons`, `start_url`, `scope`, `theme_color`, etc. | Chromium identifiers [13]; web.dev manifest updates [14]; web.dev WebAPKs [15] |
| H14 | Un service worker controla las URLs bajo su scope y no puede ir más arriba de su ubicación sin el encabezado `Service-Worker-Allowed`. | MDN register [16] |
| H15 | Chrome concede el almacenamiento persistente sin preguntar si el sitio está instalado, en marcadores, con notificaciones o con alto engagement. | web.dev persistent storage [17] |
| H16 | Al instalarse, la WebAPK registra filtros de intent para **todas las URLs dentro de su scope**: "cuando el usuario toca un enlace dentro del scope de la app, se abre la app en lugar de una pestaña". Si el usuario escribe la URL en la barra de Chrome, se queda en Chrome. Ojo: el artículo es de 2017. | web.dev WebAPKs [15] |
| H17 | Desde Android 12, para **todas** las apps, un intent web genérico se resuelve a una app solo si esa app está aprobada para el dominio (App Links verificados o asociación manual del usuario en Ajustes → "Abrir de forma predeterminada"). Si no, se abre en el navegador predeterminado. | Android 12 behavior changes [19] |

**No verificado (pruebas de la semana 3):**

- **[SUPUESTO] S1.** iOS lee el `<link rel="manifest">` del documento abierto en el momento de "Agregar a inicio". Por eso, si la página cambia el `href` del manifest (por ejemplo, para agregarle un token), iOS usa ese manifest y su `start_url`. Es coherente con H1, H3 y H4, pero Apple no lo documenta para manifests dinámicos. Con B, solo importa para el token de instalación (sección 7). Con A/H, también importa para el nombre y el ícono por negocio.
- **[SUPUESTO] S2.** En iOS, cada ícono instalado tiene su propio contenedor (cookies y almacenamiento), así que dos negocios instalados no comparten sesión entre sí. Hay reportes de terceros que lo afirman, sin fuente oficial. Con B solo hay un ícono, así que este supuesto deja de afectar el diseño.
- **[SUPUESTO] S3.** iOS no actualiza el nombre ni el ícono de una web app ya instalada cuando cambia el manifest. Android sí lo hace (H13).
- **[SUPUESTO] S4.** El navegador integrado de WhatsApp en iOS es Safari View Controller y permite "Agregar a inicio" (H8). En Android, el integrado de WhatsApp no permite instalar (supuesto del plan 02).
- **[SUPUESTO] S5.** En iOS no se copian las cookies de Safari a la app instalada (inferido de H6 y H7).
- **[SUPUESTO] S6.** En iOS, un enlace externo (el QR leído con la cámara, un enlace en WhatsApp) **abre Safari, no la web app instalada**. Apple no documenta ninguna captura de enlaces para las web apps de pantalla de inicio; las fuentes que lo describen son de terceros y antiguas. Es muy probable, pero no hay fuente oficial.
- **[SUPUESTO] S7.** En Android, un QR con una URL dentro del scope abre la app LealTab instalada. H16 dice que sí, pero H17 (Android 12+) indica que un intent web sin dominio verificado se va al navegador predeterminado, y no encontré documentación oficial actual de cómo Chrome resuelve este caso con las WebAPK. También depende del lector: la cámara, Google Lens o un lector de terceros pueden abrir su propio visor. **Hay que probarlo.** El diseño de B no depende de S7 (sección 5.2, punto 6).

## 3. Opciones

**A. Una PWA por negocio, en una ruta del dominio principal**
`lealtab.com/c/{slug}/`, con un manifest dinámico por negocio (`id: /c/{slug}/`, `scope: /c/{slug}/`, `start_url: /c/{slug}/`, nombre y colores del negocio) y un `apple-touch-icon` por negocio. Un solo despliegue, un solo origen y un certificado.

**A2. Una PWA por negocio en un subdominio** (`cafe-x.lealtab.com`)
Cada negocio es un origen distinto, con almacenamiento, service worker y cookies aislados por el navegador. Requiere un certificado comodín, enrutar por `Host`, decidir cómo compartir o aislar las cookies (`Domain=`) y pagar CORS en las llamadas a la API.

**A3. Dominio propio del negocio** (`lealtad.cafex.mx`)
Lo mismo que A2, más DNS y certificados por cliente. Es marca blanca de facto, lo que choca con LealTab como marca madre. Es material de Fase 7, como módulo de pago.

**B. Una sola PWA "LealTab" (recomendada, condicionada)**
Un solo ícono LealTab. Dentro, el perfil del cliente con la lista de sus tarjetas, cada una con la marca de su negocio. El QR del mostrador sigue apuntando a la tarjeta del negocio (`/c/{slug}/`). El diseño técnico está en la sección 5.2.

**H. Híbrido (alternativa fuerte; era la recomendación de la revisión 1)**
A como modelo de instalación, más:
1. "con LealTab" discreto en la tarjeta y en el splash.
2. Una identidad técnica del cliente a nivel plataforma, con los datos de lealtad separados por negocio.
3. La vista `lealtab.com/mis-tarjetas` diseñada desde ahora pero **no construida** en el MVP.

## 4. Criterios y comparación

Escala: ●●● muy bien · ●● aceptable · ● mal.

| Criterio | Peso | A (ruta) | A2 (subdominio) | B (LealTab) | H (híbrido) |
|---|---|---|---|---|---|
| Viabilidad técnica en iOS y Android hoy | Alto | ●●● (H1–H5, H13; S1 por probar) | ●●● | ●●● (manifest estático; menos supuestos) | ●●● |
| Coherencia con el punto de entrada (QR de **un** negocio) | Alto | ●●● | ●●● | ●● (el cliente escanea "Café X" e instala "LealTab"; se mitiga con el copy de la guía) | ●●● |
| Argumento de venta al dueño ("tu ícono en el celular de tus clientes") | Alto, **no validado** | ●●● | ●●● | ●● (la tarjeta sigue con la marca del negocio; solo cambia el ícono de inicio) | ●●● |
| Transferencia de sesión al instalar en iOS (H6, sección 7) | Alto | ● (una por negocio: token, respaldo y recuperación por negocio) | ● | ●●● (una sola vez) | ● (igual que A) |
| Alta del segundo negocio para quien ya instaló | Medio | ● (instalar y transferir otra vez) | ● | ●●● (la tarjeta nueva aparece sola en la app ya instalada) | ● |
| Permiso de push en iOS (H11) | Bajo en el MVP | ● (uno por negocio) | ● | ●●● (uno solo) | ● |
| Experiencia del cliente con 1–2 negocios (el caso realista del piloto) | Alto | ●●● | ●●● | ●●● (un ícono; el segundo negocio no cuesta nada) | ●●● |
| Experiencia del cliente con 5+ negocios | Bajo en el MVP | ● (íconos acumulados) | ● | ●●● | ●● (con `/mis-tarjetas` en el futuro) |
| Experiencia del cajero | Medio | ●●● (sin cambios) | ●●● | ●●● | ●●● |
| Marca LealTab con el cliente final | Medio | ● | ● | ●●● | ●● |
| Privacidad y separación por negocio (LFPDPPP) | Alto | ●● | ●●● (aislamiento del navegador) | ● a ●● (depende de la consulta legal, sección 5.1) | ●● |
| Costo en el MVP de 4 semanas | Alto | ●●● (+0.5–1 día) | ●● (+2–3 días entre DNS, TLS, cookies y CORS) | ●●● (+0.5–1 día por la vista de lista; se ahorra el manifest dinámico) | ●●● (igual que A) |
| Facilidad de migrar después | Medio | ●●● | ●● | ● (pasar a A obliga a reinstalar para tener el ícono del negocio) | ●●● |
| Módulos futuros (Passes, Campaigns) | Bajo | ●● | ●● | ●●● | ●●● |

**Cómo leer la tabla.** En la revisión 1, el criterio que inclinaba la balanza hacia H era el argumento de venta del ícono, con peso alto. Ese peso no está validado: ningún dueño lo ha pedido todavía. Los tres criterios nuevos (transferencia en iOS, segundo negocio y push) son costos técnicos verificados (H6, H11) que H paga por cada negocio y B paga una sola vez. Si las entrevistas confirman que el ícono vende, H vuelve a ganar (sección 5.1).

### Lectura por actor

- **Cliente final.** Escanea el QR de Café X y ve la tarjeta de Café X, con su logo y sus colores, en cualquiera de las opciones. La diferencia aparece solo si instala:
  - Con B, el ícono dice "LealTab" y adentro encuentra "mis tarjetas". El salto mental ("escaneé Café X, ¿por qué instalo LealTab?") es real y se mitiga con el copy de la guía, por ejemplo: "Guarda tus tarjetas en tu inicio" en lugar de "Instala LealTab" `[SUPUESTO, medir en piloto]`.
  - **El segundo negocio es donde B gana claramente.** En iOS, el QR de Café Y abre Safari, no la app instalada (S6). Con B y la identidad de plataforma, el cliente se registra en Café Y y la tarjeta nueva aparece sola en el ícono LealTab que ya tiene. Con A/H tiene que volver a instalar, volver a transferir la sesión (H6) y termina con dos íconos. En Android, si el scope de LealTab cubre `/c/{slug}/`, el escaneo puede abrir directamente la app instalada (H16); si no ocurre (H17, S7), se abre Chrome, que comparte cookies con la app, y la tarjeta igual aparece en el ícono LealTab.
  - En iOS, con B, el cliente pasa **una sola vez** por la transferencia de sesión y concede **un solo** permiso de push (H11).
  - Instalar es opcional (D-001): el que no instala no ve ningún ícono en ninguna de las opciones.
- **Dueño.** "Tu ícono en el celular de tus clientes" es tangible en la venta presencial, pero **no está validado**: nadie sabe todavía si un dueño de PyME compra por eso o por "tus clientes regresan". Con B, el negocio no pierde su marca: la tarjeta sigue tematizada (logo, colores, nombre, premio). Lo único que cambia es el ícono de inicio. Sigue la objeción probable de que el dueño sienta que construye la marca de LealTab con sus clientes `[SUPUESTO, validar en entrevistas]`. Si existe, la respuesta comercial es el **ícono propio como módulo de pago en Fase 7** (sección 8).
- **Cajero.** No cambia nada. Escanea el QR rotativo y busca por teléfono igual en todas las opciones, porque la PWA del cajero es aparte (`lealtab.com/caja/`).
- **Marca LealTab.** Con B gana visibilidad ante el consumidor y un canal propio para productos futuros (Passes, Campaigns), aunque el comprador sigue siendo el dueño. Esa visibilidad **no** autoriza usar los datos para fines propios (por ejemplo, recomendar otros negocios) sin un ADR nuevo y revisión legal (sección 6).

## 5. Decisión recomendada

**Opción B: una sola PWA LealTab, con la lista de tarjetas en el perfil del cliente**, condicionada a las dos validaciones de la sección 5.1. Hasta que se resuelvan, se construye todo lo que sirve para B y para H (identidad, tarjeta por negocio, sesión, caché), y se deja para el final la única pieza que cambia entre ellas: el manifest y el ícono.

### 5.1 Validaciones previas y qué pasa si fallan

Las dos se resuelven **antes de abrir a los pilotos**. Pasar de B a A después obliga a cada cliente a reinstalar (sección 9), así que no conviene decidir con pilotos ya instalados.

| Validación | Pregunta | Responsable | Si pasa | Si falla |
|---|---|---|---|---|
| (a) Consulta legal LFPDPPP | ¿Una vista "mis tarjetas" que solo le muestra al cliente **sus propios** datos de varios negocios convierte a LealTab en responsable, o le permite seguir como encargado de cada negocio? | Fundador con abogado | B sin aviso propio de LealTab; contrato de encargo por negocio (sección 6) | Si el abogado exige un aviso propio de LealTab, se evalúa el costo de tenerlo **desde el día 1**: redacción del aviso, consentimiento en la primera alta, canal de derechos ARCO y la carga del rol de responsable. Si el costo es aceptable, se sigue con B; si no, se vuelve a H |
| (b) Entrevistas con dueños (E1 y conversaciones de cierre) | ¿El ícono propio en el celular del cliente aparece **espontáneamente** como motivo de compra? | Fundador | Menos de 3 de 10 lo citan: B | **≥3 de 10 dueños citan el ícono: se vuelve a H** |

Notas:
- En (b), cuenta solo si el dueño lo menciona sin que se le sugiera, o si lo elige frente a otros beneficios en una pregunta abierta. Preguntar "¿te gustaría tu ícono?" sesga la respuesta hacia el sí `[SUPUESTO]`.
- Si se vuelve a H, el costo es bajo porque el modelo de datos, la sesión y la caché son los mismos (sección 5.4). Cambian el manifest (dinámico por negocio), los íconos por negocio y el token, que pasa a ligarse a la tarjeta.

### 5.2 Diseño técnico de B

1. **Manifest único** en `/c/manifest.webmanifest`:
   - `id: "/c/"`. Es inmutable: si cambia, todos los íconos instalados quedan como otra app (H1, H13).
   - `scope: "/c/"`.
   - `start_url: "/c/?source=pwa"`.
   - `name: "LealTab"`, `short_name: "LealTab"`, `display: standalone`, colores de LealTab.
   - Íconos de 192, 512 y maskable de LealTab, más un `<link rel="apple-touch-icon">` de 180 px de LealTab en el layout de `/c/` (H4).
2. **Scope `/c/` y no `/`.** Lo que importa es que las URLs del QR (`/c/{slug}/`) queden **dentro** del scope: así no aparece la barra del navegador al abrir una tarjeta desde la lista (H2) y, en Android, el filtro de intent de la WebAPK cubre los QR (H16, S7). `/c/` lo logra igual que `/`, sin capturar rutas que no son del cliente:
   - La landing (`/`) y el panel del dueño (`/panel/`) no deben abrirse dentro de la app del cliente.
   - La PWA del cajero (`/caja/`) tiene su propio manifest y scope. Como el scope es un prefijo de texto y termina en `/` (H2), `/caja/` **no** queda dentro de `/c/`. Con scope `/` sí se traslaparían, y en Android dos WebAPK con scopes anidados compiten por las mismas URLs `[SUPUESTO]`.
3. **Estructura de URLs:**
   - `/c/` → "Mis tarjetas" (la pantalla de inicio de la app instalada). `/mis-tarjetas` redirige a `/c/` para usarlo en copy y mensajes.
   - `/c/{slug}/` → tarjeta del negocio. Es lo que imprime el QR del mostrador, igual que en H.
   - `/c/{slug}/registro`, `/c/recuperar`, `/c/cuenta`, `/c/privacidad`.
   - Los slugs `recuperar`, `cuenta`, `privacidad`, `manifest.webmanifest` y similares quedan **reservados**. El `slug` sigue siendo inmutable.
4. **Tarjeta tematizada por negocio.** Dentro de la app, cada tarjeta usa el logo, los colores y el nombre del negocio, y cambia `<meta name="theme-color">` al color del negocio `[SUPUESTO: confirmar que el modo standalone respeta el cambio en iOS y Android]`. El ícono, el nombre de la app y el splash son de LealTab.
5. **Un solo service worker** registrado con scope `/c/` (H14). Guarda en caché el último estado de cada tarjeta con una clave por `slug` y la lista de "mis tarjetas" para verla sin conexión. La separación por negocio la garantiza el servidor (sección 6), no el navegador.
6. **Alta del segundo negocio:**
   - **Android:** el QR de Café Y abre la app instalada (H16) o Chrome (H17, S7). En los dos casos hay sesión, porque la WebAPK comparte cookies con Chrome. El cliente acepta el registro con un toque y la tarjeta aparece en "Mis tarjetas".
   - **iOS:** el QR abre Safari (S6).
     - Si Safari conserva la sesión del primer registro, el alta es de un toque y la página dice "Listo. Abre LealTab en tu inicio: tu tarjeta de Café Y ya está ahí".
     - Si Safari no tiene sesión, el cliente escribe su WhatsApp. La tarjeta se liga a la `identidad` de ese teléfono, pero queda **por confirmar**: no se muestra en la app hasta que el cliente la acepta desde la app instalada (que sí tiene sesión) o el cajero lo verifica al dar el primer sello. Así, quien escriba un teléfono ajeno no puede meter tarjetas en el perfil de otra persona.
   - **No** hay que instalar ni transferir otra vez.
7. **Guía de instalación** con copy de tarjetas, no de app: "Guarda tus tarjetas en tu inicio". Muestra el ícono LealTab con una línea que explique "Ahí viven tu tarjeta de Café X y las que agregues". El copy final lo define diseño `[SUPUESTO, medir en piloto]`.
8. **Transferencia de sesión en iOS una sola vez,** ligada a la `identidad` (sección 7).
9. **"Mis tarjetas" mínima en el MVP:** una lista con el logo, el nombre, el progreso de sellos y el enlace a cada tarjeta. Sin descubrimiento de negocios, sin recomendaciones y sin datos de un negocio visibles para otro.

### 5.3 Costos honestos de B

- **Privacidad.** Es posible que LealTab tenga que actuar como **responsable** de la cuenta del cliente y no solo como encargado de cada negocio. Por eso existe la validación (a).
- **Salto mental.** El cliente escanea "Café X" e instala "LealTab". Se mitiga con el copy de la guía (punto 7 de la sección 5.2) y se mide con la tasa de instalación por SO frente a E6.
- **Reversibilidad.** Pasar de B a A obliga a cada cliente a reinstalar si quiere el ícono del negocio, y en iOS a transferir la sesión otra vez (sección 9). Pasar de H a B era barato. Por eso las validaciones van antes de los pilotos.
- **Objeción del dueño.** Algún dueño querrá su ícono. La respuesta es el **ícono propio por negocio como posible módulo de pago en Fase 7** (sección 8), no un cambio del modelo base.

### 5.4 Alternativa fuerte: H (recomendación de la revisión 1)

Se conserva el razonamiento completo porque es el plan de respaldo si falla cualquiera de las validaciones.

**Opción H: una PWA por negocio en `lealtab.com/c/{slug}/`**, con:

1. **Manifest dinámico por negocio** en `/c/{slug}/manifest.webmanifest`:
   - `id` y `scope` iguales a `/c/{slug}/`.
   - `start_url` dentro del scope.
   - `name`/`short_name` del negocio.
   - `theme_color` y `background_color` de la marca.
   - `display: standalone`.
   - Íconos de 192, 512 y maskable.

   Además, un `<link rel="apple-touch-icon">` de 180 px **por negocio** en el HTML de `/c/{slug}/`, porque en iOS tiene prioridad (H4). **Nunca** se pone un `apple-touch-icon` global de LealTab en el layout de las rutas `/c/`.
2. **Todas las pantallas del cliente bajo su scope** (`/c/{slug}/registro`, `/c/{slug}/recuperar`, etc.), para que no aparezca la barra del navegador (H2). La API (`/api/...`) es fetch, no navegación, y no se ve afectada.
3. **Un solo service worker** en `/sw.js` con scope `/`, que guarda en caché el último estado de cada tarjeta con una clave por `slug` (H14). En Android, todas las PWAs del origen comparten el almacenamiento de Chrome, así que la separación por negocio la garantizan el servidor y las claves de caché, no el navegador.
4. **"con LealTab" discreto** en el pie de la tarjeta, en el splash y en el aviso de privacidad. No aparece en el ícono.
5. **Identidad del cliente** (ver sección 6).
6. **Transferencia de sesión al instalar en iOS** por negocio (ver sección 7), con el token ligado a la `tarjeta`.
7. **`/mis-tarjetas` queda fuera del MVP.** Se diseña el modelo de datos para que sea posible (sección 6), pero no se construye hasta que un gate lo justifique.

**Por qué H era la recomendación (y lo sigue siendo si fallan las validaciones).** Con B, el cliente escanea el QR de Café X y termina con un ícono que no dice Café X. Eso le quita al dueño el argumento de venta más tangible y puede obligar a LealTab a ser responsable de una cuenta de consumidor con su propio aviso de privacidad desde el día 1. Además, migrar de B a A en el futuro obliga a cada cliente a reinstalar. Migrar de A a B (o agregar `/mis-tarjetas`) no rompe nada de lo instalado.

**Por qué ya no es la primera opción.** El primer argumento depende de que el ícono venda, y eso no está validado (5.1 b). El segundo depende de la consulta legal (5.1 a). El tercero es cierto y es la razón por la que las validaciones van antes de los pilotos. A cambio, H paga por cada negocio la transferencia de sesión en iOS, el alta con reinstalación y el permiso de push, y esos costos sí están verificados (H6, H11).

### Por qué no A2 ni A3 ahora

El subdominio da aislamiento por el navegador, pero cuesta de 2 a 3 días entre certificado comodín, enrutamiento por host, cookies y CORS, y en iOS ya hay aislamiento por app instalada (H6, S2). El dominio propio es marca blanca y entra como posible módulo de pago en la Fase 7.

## 6. Identidad del cliente y privacidad

- **Modelo (sirve igual para B y para H):**
  - `identidad`: el teléfono en E.164, verificado o no, y sus sesiones por dispositivo. Pertenece a la plataforma.
  - `cliente_negocio`: el nombre, el consentimiento, la fecha de alta, el estado (`activa` o `por_confirmar`, sección 5.2, punto 6) y la relación con un `negocio_id`.
  - `tarjeta` y `evento`: siempre con `negocio_id`.

  El mismo WhatsApp en tres negocios es **una** identidad con **tres** `cliente_negocio` independientes. Con B, "Mis tarjetas" es la lista de los `cliente_negocio` activos de la identidad con sesión.
- **Separación:** el panel del dueño y todas las consultas filtran por `negocio_id` (con RLS en Postgres si usamos Supabase). Un negocio **nunca** ve si su cliente está inscrito en otro negocio. La única vista que cruza negocios es "Mis tarjetas", y solo la ve el propio cliente con su sesión.
- **Recuperación:** con B se hace una sola vez, desde `/c/recuperar`, con verificación del cajero o un enlace firmado, y recupera todas las tarjetas de la identidad. Con H se hace por negocio, desde `/c/{slug}/recuperar`.
- **LFPDPPP (nueva ley, DOF 20 mar 2025):** propongo que el **negocio sea el responsable** de los datos de su programa y que **LealTab actúe como encargado**, con un contrato de encargo en cada alta (informe 01, riesgo 9). Reservar la `identidad` compartida solo para autenticar y mostrarle al cliente sus propias tarjetas, sin usos propios de LealTab, es lo que buscaría sostener ese rol de encargado `[SUPUESTO, requiere revisión legal: validación 5.1 a]`.

  Si el abogado concluye que "Mis tarjetas" ya convierte a LealTab en responsable de esa cuenta, aplica la sección 5.1. En cualquier caso, si mañana se usan los datos para fines propios (por ejemplo, recomendar otros negocios), LealTab sí pasa a ser responsable: necesitará su propio aviso de privacidad y un consentimiento explícito. Ese cambio debe pasar por un ADR y por un abogado.
- **Datos mínimos:** nombre, WhatsApp y consentimiento. Nada más en el MVP.

## 7. Sesión al instalar en iOS (riesgo principal verificado)

**Problema:** el cliente se registra en Safari, pero la app instalada nace sin las cookies de Safari (H6, S5). Si no hacemos nada, al abrir el ícono por primera vez el cliente "pierde" su tarjeta. **Con B este problema se resuelve una sola vez por dispositivo; con A/H, una vez por cada negocio instalado.**

**Diseño propuesto (B):**

1. **Sesión principal:** una cookie `HttpOnly` y `Secure` emitida por el servidor, de larga duración. Al no ser escribible por script, no entra en el borrado de 7 días (H9) `[SUPUESTO: confirmar que ITP no la acorta por ser de primera parte emitida por el servidor]`. La identidad vive en el servidor, así que perder el dispositivo se resuelve con la recuperación.
2. **Token de instalación:** cuando el cliente abre la guía "Compartir → Agregar a inicio" en iOS, el servidor emite un `install_token` con estas propiedades:
   - Aleatorio de 128 bits o más.
   - De un solo uso.
   - Ligado a la `identidad` (con H, a la `tarjeta`).
   - Con vigencia de 24 h.

   La página cambia el `href` de `<link rel="manifest">` a `/c/manifest.webmanifest?it=<token>`, que devuelve `start_url: /c/?source=pwa&it=<token>`. El `id` sigue siendo `/c/`, así que el token no crea otra app (H1).
3. **Primer arranque en standalone:** el cliente canjea el token por una sesión nueva en el contenedor de la app, y luego `history.replaceState` quita el token de la URL. En los arranques siguientes, el token ya se usó y se ignora si existe una sesión. Si no hay sesión (por ejemplo, porque iOS borró los datos), se muestra la recuperación.
4. **Respaldo si S1 falla** (iOS no toma el manifest con el token): en el primer arranque, la app pide el WhatsApp y muestra un código de 6 dígitos que el cliente confirma en la pestaña de Safari donde ya tiene sesión, o con el cajero. No hay costo de OTP.
5. **Android:** la PWA instalada comparte las cookies con Chrome, así que no hace falta token. El mismo código se puede usar sin daño.
6. **Riesgo aceptado:** el token queda grabado en el `start_url` del ícono. Como es de un solo uso y vence, no sirve para robar la sesión después del primer arranque.
7. **Negocios siguientes:** no hay token ni transferencia. La tarjeta nueva se liga a la identidad en el servidor y aparece en la app (sección 5.2, punto 6).

## 8. Consecuencias

**Positivas (B)**
- Una sola transferencia de sesión, una sola recuperación y un solo permiso de push por dispositivo en iOS (H6, H11).
- El segundo negocio y los siguientes aparecen solos en la app ya instalada, sin reinstalar.
- Manifest estático: menos supuestos de iOS (S1 solo afecta al token; S2 y S3 dejan de afectar el diseño).
- Mismo costo que H en el MVP: se ahorra el manifest dinámico y los íconos por negocio, y se agregan de 0.5 a 1 día por la vista "Mis tarjetas" mínima.
- La marca LealTab gana visibilidad ante el consumidor, sin que el negocio pierda la suya dentro de la tarjeta.

**Negativas y riesgos (B)**
- Posible rol de responsable para LealTab (validación 5.1 a).
- Salto mental "escaneé Café X, instalé LealTab". Se mitiga con el copy y se mide (sección 10).
- Revertir a A obliga a reinstalar (sección 9).
- Posible objeción del dueño por el ícono. Se atiende con el módulo de Fase 7 y se mide en las entrevistas (5.1 b).
- El `id` (`/c/`) y los `slug` son **inmutables**. El nombre y los colores de un negocio sí se pueden cambiar, y como viven dentro de la tarjeta, se actualizan al instante en las dos plataformas, sin depender de S3.
- El alta "hecha por nosotros" sigue generando el logo del negocio para la tarjeta, pero ya no los íconos de 180, 192, 512 y maskable por negocio.

**Si se vuelve a H**, aplican las consecuencias de la revisión 1: argumento de venta tangible, íconos acumulados con muchos negocios, poca visibilidad de LealTab ante el consumidor, transferencia y push por negocio en iOS (S2, H11) e íconos por negocio en el alta.

**Pendientes para fase 4/7**
- **Fase 7: ícono propio por negocio como módulo de pago.** Requiere un manifest por negocio con un `id` y un scope que **no** se traslapen con `/c/` (por ejemplo, `/n/{slug}/` o un subdominio, A2/A3). Los clientes de ese negocio que ya tengan LealTab instalado lo conservan; el ícono propio sería una segunda instalación opcional.
- Subdominio o dominio propio como módulo (A2/A3).
- Push (un solo permiso con B).
- Escanear el QR de un negocio desde dentro de la app LealTab, para evitar el paso por Safari en iOS (S6). Solo si las métricas del segundo negocio lo justifican.

## 9. Cómo revertir

- **De B a H/A:** se publican los manifests por negocio en un scope que no se traslape con `/c/` (por ejemplo, `/n/{slug}/`), o se reemplaza el manifest de `/c/`. El ícono LealTab ya instalado sigue funcionando y muestra todas las tarjetas. Quien quiera el ícono del negocio **tiene que reinstalar** y, en iOS, transferir la sesión otra vez. No se pierden datos, porque la identidad es de plataforma. Costo técnico: 1–2 días. Costo para el cliente: alto si ya hay pilotos instalados; por eso las validaciones van antes.
- **De B a A2:** se sirve `cafe-x.lealtab.com` y se redirige `/c/cafe-x/`. El ícono LealTab sigue funcionando. En iOS, quien quiera el ícono del negocio reinstala `[SUPUESTO]`. No conviene hacerlo durante los pilotos.
- **(Referencia, revisión 1) De H a B:** se publica la app LealTab. Los íconos de negocio ya instalados siguen funcionando. Costo: 1–2 días, sin pérdida de datos. Esta asimetría es el mejor argumento a favor de H y la razón de condicionar B.

## 10. Qué medir en los pilotos para confirmar o revertir

| Métrica (evento) | Umbral para confirmar | Señal para revisar |
|---|---|---|
| Instalación de LealTab por SO (`pwa_instalada`, con `display-mode: standalone`) | ≥25% (E6) | <10% en ambos SO: el modelo de instalación da igual; no invertir más en él. Entre 10% y 25%: revisar el copy del salto mental |
| Éxito de la transferencia en iOS (`install_token_canjeado` / guías mostradas) | ≥80% | <60%: priorizar el respaldo del código o revisar S1 |
| Recuperaciones en apps instaladas de iOS | <10% de los inscritos | Más alto: la sesión no sobrevive y hay que revisar la sección 7 |
| Conversión del segundo negocio en la app ya instalada (`cliente_negocio` nuevo de una identidad con `pwa_instalada` que se abre en standalone en ≤7 días) | ≥60% | <30%: el paso por Safari en iOS (S6) pesa; adelantar el escaneo desde la app |
| Tarjetas `por_confirmar` que nunca se confirman | <20% | Más alto: simplificar la confirmación |
| Clientes con ≥2 negocios (`identidad` con >1 `cliente_negocio`) | Medir | ≥20%: refuerza B |
| Dueños que citan "mi ícono/mi marca" como motivo de compra (entrevistas E1 y cierre) | <3 de 10 (validación 5.1 b) | ≥3 de 10: volver a H antes de los pilotos; después de los pilotos, ofrecer el módulo de Fase 7 |
| Dueños que piden el ícono propio después de firmar | Anecdótico | Frecuente: priorizar el módulo de Fase 7 |
| Clientes que preguntan "¿qué es LealTab?" o buscan la app en tiendas | Anecdótico | Frecuente: reforzar el copy de la guía y la tarjeta |
| Abiertas en navegador integrado y conversión a instalación | Medir por SO | Valida S4 |

**Pruebas técnicas de la semana 3**, antes de abrir a los pilotos, en un iPhone con iOS 18 y 26 y un Android con Chrome estable:

1. Instalación de LealTab desde `/c/{slug}/` en iOS y Android: nombre, ícono, `id` y `start_url` correctos (H4, H12).
2. Transferencia con `install_token` (S1, S5).
3. QR de un segundo negocio con la app ya instalada: en iOS, confirmar que abre Safari (S6); en Android, probar la cámara nativa, Google Lens y un lector de terceros, y ver si se abre la app o Chrome (H16, H17, S7). En los dos casos, confirmar que la tarjeta aparece en "Mis tarjetas".
4. `<meta name="theme-color">` por tarjeta en modo standalone.
5. "Agregar a inicio" desde el navegador integrado de WhatsApp e Instagram (S4).
6. iOS 26 con "Abrir como app web" desactivado.
7. Que la PWA del cajero (`/caja/`) y la del cliente (`/c/`) se instalen como apps distintas y no se capturen enlaces entre ellas.
8. **Solo si se vuelve a H:** dos negocios instalados desde el mismo origen (S1, S2) y cambio de nombre o color después de instalar (S3).

## 11. Fuentes (consultadas el 4 oct 2026)

1. MDN, manifest `id`: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/id
2. Chrome for Developers, "Uniquely identifying PWAs with the web app manifest id property" (actualizado el 20 sep 2024): https://developer.chrome.com/docs/capabilities/pwa-manifest-id
3. MDN, manifest `scope`: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope
4. WebKit, "WebKit Features in Safari 16.4": https://webkit.org/blog/13966/webkit-features-in-safari-16-4/
5. WebKit, "Web Push for Web Apps on iOS and iPadOS" (16 feb 2023): https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
6. WebKit, "New WebKit Features in Safari 15.4": https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/
7. WebKit, "News from WWDC25: Web technology coming this fall in Safari 26 beta": https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/
8. WebKit Bugzilla 181849, "Add to homescreen apps don't share storage with Safari" (comentario de B. Fulgham, 1 feb 2022): https://bugs.webkit.org/show_bug.cgi?id=181849
9. WebKit, "News from WWDC23: WebKit Features in Safari 17 beta": https://webkit.org/blog/14205/news-from-wwdc23-webkit-features-in-safari-17-beta/
10. WebKit, "Full Third-Party Cookie Blocking and More" (7 días de almacenamiento escribible por script): https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
11. WebKit, "Updates to Storage Policy" (10 ago 2023): https://webkit.org/blog/14403/updates-to-storage-policy/
12. web.dev, "What does it take to be installable?" (actualizado el 19 sep 2024): https://web.dev/articles/install-criteria
13. Chromium, "Identifiers in Web Apps": https://chromium.googlesource.com/chromium/src/+/main/components/webapps/docs/identifiers.md
14. web.dev, "How Chrome handles updates to the web app manifest" (actualizado el 19 sep 2024): https://web.dev/articles/manifest-updates
15. web.dev, "WebAPKs on Android" (filtros de intent por scope; última actualización del artículo: 21 may 2017): https://web.dev/articles/webapks
16. MDN, `ServiceWorkerContainer.register()`: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
17. web.dev, "Persistent storage": https://web.dev/articles/persistent-storage
18. LFPDPPP 2025 (DOF 20 mar 2025; responsable y encargado), resumen secundario de Hogan Lovells: https://www.hoganlovells.com/es/publications/mexicos-new-federal-data-protection-law-what-it-means-for-companies. El texto oficial del DOF no se revisó `[SUPUESTO]`.
19. Android Developers, "Behavior changes: all apps" de Android 12, sección "Web intent resolution": https://developer.android.com/about/versions/12/behavior-changes-all
