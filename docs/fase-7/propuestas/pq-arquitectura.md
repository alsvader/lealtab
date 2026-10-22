# Propuestas técnicas para cerrar las PQ de arquitectura (Fase 7)

> **Ronda 2, con decisiones de Aarón del 21 oct.** Esta versión reemplaza la primera: sin segundo service worker, gana RF-APP-05, el proveedor es SMS Masivos con respaldo SMS, la librería de QR se decide con una prueba técnica y el costo base pasa a una PQ nueva.

- **Estado:** propuesta. Nada de esto está registrado: Aarón decide y el coordinador lo lleva a `docs/decisiones.md`, al PRD y a `docs/adr/`.
- **Fecha:** 21 oct 2026
- **Autor:** `lealtab-arquitecto`
- **Cubre:** PQ-22 (a a h), PQ-13, PQ-23, PQ-24, PQ-25 y la PQ-26 propuesta del PRD v1.4 §12.
- **Fuentes externas:** todas consultadas el **21 oct 2026**; la lista está al final (§12). `[SUPUESTO]` marca lo que no pude verificar.

## 0. Lo que conviene saber antes de leer

Hallazgos de la investigación. Los marcados con (R2) cambian por las decisiones de Aarón de la ronda 2.

1. **(R2) Sin segundo service worker en el piloto.** N5 vive en `/panel/`, fuera del scope del service worker de `/c/` (RNF-PWA-04). Aarón decidió no agregar otro: N5 solo usa la cola de IndexedDB y **debe abrirse con conexión**; si se cae la red con N5 abierto, sigue registrando y sincroniza después (§6.4). Se mide cuántas veces se rompe esa condición y, si sale alta, se reevalúa. Esto descarta el ADR-005 que proponía la primera ronda.
2. **Background Sync no existe en Safari de iOS** ([caniuse](https://caniuse.com/background-sync): sin soporte en iOS 3.2 a 27.2; Chrome Android sí). RNF-OFF-04 lo da por hecho. En iPhone la sincronización sale de eventos de la página (§6.4).
3. **«Sin cookies» (D-018, RNF-STK-10) choca con las cookies de sesión** que el propio diseño exige (RNF-PWA-05, sesión del dueño de Supabase). Son cookies de primera parte y necesarias, no de analítica, pero el aviso de privacidad debe decirlo así (PQ-18). Detalle en §13.
4. **(R2) SMS Masivos tiene dos «WhatsApp» muy distintos.** El de `/whatsapp/send` se conecta escaneando un QR «igual que WhatsApp Web», con límite de 1 envío cada 60 s y advertencia de bloqueo de línea: **no sirve** para códigos y no es la API de WhatsApp Business de D-011. El de su endpoint OTP (`/v2/otp`, canal `whatsapp`) dice usar la «integración oficial» con plantilla fija. Hay que **confirmar por escrito con el proveedor** que esa ruta es la API oficial de Meta (§7).
5. **(R2) El costo base de USD 45 al mes** (Vercel Pro y Supabase Pro) queda como pregunta nueva para Aarón, sin recomendarlo como aprobado (PQ-26 propuesta, §5).
6. **(R2) La prueba técnica de QR decide la librería**, no esta propuesta (§6).

---

## 1. PQ-22 (a): zona horaria del negocio (RF-ALT-06)

**Contexto.** El límite «1 por día», el reinicio a medianoche (RF-SEL-05), el «Próximo sello disponible a las HH:MM» (RF-SEL-08) y la «semana» del resumen (RF-INI-06) dependen de la zona del negocio. La ciudad de N2 es texto libre.

**Opciones**
- A. Preguntarla en N2 con un selector. Agrega un campo a un flujo con meta de menos de 5 minutos (MET-01).
- B. Derivarla de la ciudad. Es texto libre: habría que geocodificar o mantener un catálogo.
- C. Tomarla del navegador del dueño en el alta, validarla contra las zonas de México, y mostrarla y poder cambiarla en N8.

**Recomendación: C.** `negocio.zona_horaria` guarda un **nombre IANA**, nunca un desfase en horas. El valor sale de `Intl.DateTimeFormat().resolvedOptions().timeZone` en N2. Si no es una zona mexicana de la lista (`America/Mexico_City`, `Cancun`, `Merida`, `Monterrey`, `Matamoros`, `Chihuahua`, `Ciudad_Juarez`, `Ojinaga`, `Mazatlan`, `Bahia_Banderas`, `Hermosillo`, `Tijuana`), se usa `America/Mexico_City`. Motivo: los 10 a 14 negocios de la primera tanda están en Villahermosa (todos en `America/Mexico_City`), el alta no gana ni un campo y el dueño puede corregirlo. Con nombre IANA, el horario de verano de las zonas fronterizas lo resuelve la base de datos `[SUPUESTO: confirmar con el tzdata de Postgres]`.

Reglas que se derivan:
- El «día» de un sello se calcula **en el servidor** con `fecha_evento AT TIME ZONE negocio.zona_horaria`, nunca con la zona del teléfono que escaneó.
- Cambiar la zona no recalcula el pasado.

**Cambia:** RF-ALT-06, RF-AJU-01 y §8 (`negocio`).
> **RF-ALT-06 (propuesto).** Se guarda la zona horaria del negocio como nombre IANA. En N2 se propone la del navegador del dueño si es una zona de México; si no, `America/Mexico_City`. N2 no agrega un campo. La zona se muestra y se puede cambiar en N8 → Negocio. El servidor la usa para el límite, el reinicio a medianoche y la semana (RF-INI-06).

**Requiere:** ningún D- ni ADR. Pide a Diseño de Producto una línea o un selector en N8 → Negocio.

---

## 2. PQ-22 (b): fracciones de X en «1 cada X horas» (RF-SEL-06, D-014)

**Contexto.** D-014 dice que X es libre y que solo se valida que sea mayor que 0.

**Opciones**
- A. Horas enteras. Impide «1 cada 90 minutos».
- B. Número decimal en horas. Hay que guardar un flotante.
- C. La interfaz acepta horas con decimales (hasta 2) y el servidor guarda **minutos enteros**.

**Recomendación: C.** La interfaz habla en horas (el negocio piensa en «cada 2 horas»), el dato es `limite_minutos integer`, y el valor efectivo es `max(limite_minutos, 2)`, porque el piso de cualquier regla es el bloqueo de 2 min (RF-SEL-07). Evita errores de redondeo en la comparación contra `device_ts`. La ventana es **móvil**: se mide desde el último sello aceptado, no desde la medianoche; así M4b dice «Próximo sello disponible a las HH:MM» con `último sello + X` en la zona del negocio.

Un tope no está decidido. Propongo **máximo 24 h**: más allá no es un límite de visita sino una ventana de varios días, y D-014 descartó «1 por semana». Si Aarón no quiere tope, se quita sin otro cambio.

**Cambia:** RF-SEL-06, RF-AJU-02 y §8 (`tarjeta_config.limite_horas` pasa a `limite_minutos`).
> **RF-SEL-06 (propuesto, cierra la parte «Por definir»).** En «1 cada X horas», X se captura en horas con hasta 2 decimales, mayor que 0 y hasta 24, y se guarda en minutos enteros (`limite_minutos`). La ventana es móvil desde el último sello aceptado. El límite efectivo nunca baja del bloqueo fijo de 2 minutos.

**Requiere:** una **aclaración a D-014** (no una D nueva): «X se captura en horas con decimales, tope 24 h, ventana móvil». El tope de 24 h es lo único que Aarón debe aprobar expresamente.

---

## 3. PQ-22 (c): detalle de visitas en el CSV (RF-CLI-06)

**Contexto.** RF-CLI-06 lista cinco campos por cliente, pero N8 dice «exportar clientes y visitas» y RNF-PRI-10 promete «Tus datos son tuyos».

**Opciones**
- A. Un solo CSV de clientes (cinco campos).
- B. Un ZIP con dos CSV. Hace falta una librería de ZIP y complica la descarga en iOS.
- C. Dos descargas CSV independientes: `clientes.csv` y `visitas.csv`.

**Recomendación: C.** Cumple lo que N8 ya promete sin agregar dependencias.
- `clientes.csv`: nombre, WhatsApp, visitas, sellos, última visita (RF-CLI-06 tal cual).
- `visitas.csv`: cliente, WhatsApp, fecha y hora **en la zona del negocio**, tipo (`sello`, `bienvenida`, `canje`), dispositivo («Mostrador (iPhone caja)») y estado (`aceptado` o `aprobado`). No lleva `firma`, `event_id` ni `qr_step`. Los rechazados y pendientes de Por revisar no se incluyen: no son visitas confirmadas.
- «Exportar CSV» en N7 baja `clientes.csv`; N8 → Tus datos ofrece los dos.

Dos requisitos de seguridad para el desarrollador:
- Las celdas que empiecen con `=`, `+`, `-` o `@` se prefijan con `'` (inyección de fórmulas en Excel, porque el nombre lo escribe el cliente final).
- La política RLS y la ruta de exportación **no dependen de `negocio.estado`**: con la cuenta en pausa la exportación sigue (RF-COB-03).

**Cambia:** RF-CLI-06, RF-AJU-03.
> **RF-CLI-06 (propuesto).** Exportar CSV siempre disponible, también con la cuenta en pausa. Son dos archivos: `clientes.csv` (nombre, WhatsApp, visitas, sellos, última visita) y `visitas.csv` (cliente, WhatsApp, fecha y hora en la zona del negocio, tipo, dispositivo y estado). Las celdas que empiezan con `=`, `+`, `-` o `@` se neutralizan.

**Requiere:** ningún D- ni ADR. Evento: `export_csv` gana el atributo `archivo` (clientes/visitas), a coordinar con `lealtab-analista-metricas`.

---

## 4. PQ-22 (d): tanda y versión del producto en `negocio` (§8, D-004)

**Contexto.** El PRD §8 marca «Por conciliar»: la tanda y la versión del producto solo viajan en el evento `negocio_alta_completada`. D-004 exige registrarlas por negocio, y el Gate 1 se calcula sobre la primera tanda.

**Opciones**
- A. Solo en el evento (como hoy). Un evento en una tabla de analítica no debería ser la fuente de verdad de un criterio de gate.
- B. Columnas en `negocio`, escritas por el servidor al terminar N4.
- C. Tabla aparte `negocio_cohorte`. Es innecesaria con una sola fila por negocio.

**Recomendación: B.** Columnas en `negocio`:
- `alta_ts timestamptz not null`: la fija el servidor al terminar N4 (RF-ALT-11).
- `tanda smallint not null`: la toma de una fila de configuración de la plataforma (`config_plataforma`, clave `tanda_actual`, valor `1`). Aarón la cambia a `2` en el corte de altas (PQ-08) sin desplegar.
- `version_producto text not null`: constante de compilación (la `version` de `web/package.json`), que sube a mano cuando un cambio afecta lo que mide el Gate. En el piloto solo hay correcciones (D-004), así que casi no cambia. El SHA del commit viaja aparte, en el payload del evento.

El dueño **no** puede modificarlas. Postgres no restringe columnas con RLS, así que se usa `GRANT UPDATE (nombre, giro, ciudad, zona_horaria, logo, correo_dueno, whatsapp) ON negocio TO authenticated`, sin incluir `plan`, `estado`, `fin_prueba`, `alta_ts`, `tanda` ni `version_producto`. Esas se escriben solo con el rol de servicio. El evento `negocio_alta_completada` se emite con los mismos valores.

**Cambia:** §8 (`negocio`) y se quita la nota «Por conciliar»; RF-ALT-11.
> **§8, `negocio` (propuesto).** id, nombre, giro, ciudad, zona_horaria (IANA), logo, plan, estado (prueba/activo/pausa), fin_prueba, whatsapp, correo_dueño, **alta_ts, tanda, version_producto**. Las tres últimas las escribe el servidor al terminar N4; el dueño no las edita.

**Requiere:** ningún D- ni ADR.

---

## 5. PQ-24: rendimiento, disponibilidad, respaldos y costo (RNF-REN-02, RNF-REN-04, RNF-REN-06)

**Contexto.** D-003 pide que el mostrador aguante la hora pico de una cafetería. Las fuentes no fijan cifras. Vercel y Supabase no dan SLA en los planes de entrada.

**Datos verificados (21 oct 2026)**
- Vercel Hobby: «personal, non-commercial use»; Pro: USD 20 por asiento al mes, con crédito de USD 20. Sin SLA publicado para Hobby ni Pro ([vercel.com/pricing](https://vercel.com/pricing)).
- Supabase Free: se pausa tras 1 semana sin actividad, sin respaldos automáticos. Pro: desde USD 25 al mes, 8 GB de disco, respaldo diario con 7 días de retención, compute Micro (USD 10 de crédito incluidos) con 60 conexiones directas y 200 por pooler, **sin SLA** (solo Enterprise) ([supabase.com/pricing](https://supabase.com/pricing)).
- PITR: unos USD 100 al mes por 7 días y exige al menos compute Small; sustituye a los respaldos diarios ([docs de respaldos](https://supabase.com/docs/guides/platform/backups)). Con respaldo diario, «podrías perder un día de datos» (la propia documentación).
- Umbrales «buenos» de Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, al percentil 75 ([web.dev](https://web.dev/articles/vitals)).

**Carga de diseño `[SUPUESTO]`.** Una cafetería concurrida da 60 a 120 visitas por hora en su pico (1 a 2 por minuto). Diseño para **10 sellos por minuto por negocio** (5 a 10 veces el pico supuesto), con los 14 negocios de la primera tanda en pico a la vez: 140 sellos por minuto, unas 2 a 3 escrituras por segundo. Es una carga pequeña para un Micro; lo delicado es la **concurrencia por tarjeta** (límite y bloqueo de 2 min dentro de una transacción con bloqueo por `tarjeta_id`), no el volumen.

**Opciones**
- A. Objetivos mínimos (solo «que no se caiga»). No sirven para pruebas de aceptación.
- B. Objetivos medibles con los planes de entrada, y subir de plan (PITR, compute Small) solo cuando una métrica lo pida.

**Recomendación: B.** Objetivos propuestos:

| Tema | Objetivo | Cómo se verifica |
|---|---|---|
| Pico en mostrador | Sostener 10 sellos/min por negocio y 140/min en total sin errores 5xx | Prueba de carga con datos sintéticos contra vista previa con base aparte |
| Confirmar un sello en línea | p95 del endpoint ≤ 800 ms; escanear a ver «+1 sello» ≤ 5 s (RNF-REN-01) | Prueba medida en el iPhone y el Android de RNF-PWA-07 |
| Tarjeta del cliente (`/c/{slug}/`) | LCP p75 ≤ 2.5 s en 4G sin caché; ≤ 1 s con service worker; INP ≤ 200 ms; CLS ≤ 0.1; JS inicial ≤ 170 KB gzip `[SUPUESTO: presupuesto propio]` | Lighthouse en CI con perfil móvil + prueba manual en los dos teléfonos |
| Panel (N0 y N5) | LCP p75 ≤ 2.5 s; N5 listo para escanear (con el escáner cargado) ≤ 4 s p75 en 4G, porque N5 abre con conexión y no hay service worker | Igual |
| Disponibilidad | Objetivo interno **99.5 % mensual** del servidor (unas 3.6 h de caída al mes) `[SUPUESTO]`; no es un compromiso a clientes. Un corte no detiene un N5 que ya estaba abierto, gracias a la cola sin conexión (D-015) | Un monitor externo sobre una ruta de salud (`/api/salud`, sin datos personales) |
| Respaldos | RPO de 24 h con el respaldo diario de Pro; RTO de 4 h `[SUPUESTO]`. Además, una copia cifrada semanal fuera de Supabase (`supabase db dump`) y **una restauración de prueba antes de abrir el piloto** | Lista de verificación previa al piloto |
| PITR | No en el MVP. Se reconsidera antes del Gate 2 o si un incidente cuesta más de un día de datos | Revisión al cierre del piloto |

Por qué el RPO de 24 h es aceptable: los sellos del mostrador nacen en una cola local y se reenvían (D-015), así que lo que un corte pierde en el servidor se recupera de los teléfonos que aún tengan eventos pendientes. Lo que no se recupera es lo que ya se sincronizó entre el último respaldo y el fallo.

**Costo real frente al supuesto (RNF-REN-06). (R2) Aarón lo revisa después.**

| Concepto | USD al mes |
|---|---|
| Vercel Pro, 1 asiento | 20 |
| Supabase Pro (Micro incluido) | 25 |
| **Subtotal de infraestructura** | **45** |
| Códigos de recuperación con SMS Masivos (§7.4: ≤ 420 envíos al mes en el peor caso; hasta unos USD 24 si todos fueran SMS; el WhatsApp está por cotizar) | por cotizar |

El supuesto de USD 20 a 50 queda en el borde con solo la infraestructura. Esto **no se propone como aprobado**: se deja como pregunta nueva.

> **PQ-26 (propuesta).** Costo base de infraestructura del MVP: ¿se acepta USD 45 al mes (Vercel Pro, porque Hobby es solo para uso no comercial, y Supabase Pro, porque la gratuita se pausa a la semana y no tiene respaldos), más el costo de los códigos? Incluye revisar qué plan de Vercel usa hoy `web/` (no pude comprobarlo). Quién: Aarón, antes del piloto. Fuente: ADR-002 §4; RNF-REN-06.

**Región y datos en el extranjero (parte de PQ-18 y RNF-STK-10).** Supabase no tiene región en México; las de América son `us-west-1`, `us-west-2`, `us-east-1`, `us-east-2`, `ca-central-1` y `sa-east-1` ([docs de regiones](https://supabase.com/docs/guides/platform/regions)). Vercel tampoco tiene cómputo en México; el valor por defecto es `iad1` en Washington, D. C. ([regiones de Vercel](https://vercel.com/docs/regions)). **Recomiendo Supabase `us-east-1` y funciones de Vercel en `iad1`**, juntas para que cada consulta no cruce regiones. `[SUPUESTO: latencia hacia Tabasco no medida; se mide con el teléfono de pruebas antes de fijarla en producción.]` Los datos personales de los clientes quedan en Estados Unidos: es un tema para la consulta legal (D-017) y el aviso (D-018), y la dejo anotada en §8.

**Cambia:**
> **RNF-REN-02 (propuesto).** El mostrador sostiene 10 sellos por minuto por negocio y 140 por minuto entre todos los negocios de la primera tanda, sin errores 5xx. La concurrencia por tarjeta se resuelve en el servidor dentro de una transacción.
>
> **RNF-REN-04 (propuesto).** Confirmar un sello en línea: p95 del servidor ≤ 800 ms. Tarjeta del cliente: LCP p75 ≤ 2.5 s en 4G, ≤ 1 s con el service worker de `/c/`, INP ≤ 200 ms, CLS ≤ 0.1. Disponibilidad objetivo interna de 99.5 % mensual, sin SLA contractual. Respaldo diario de Supabase Pro (7 días), copia cifrada semanal fuera de Supabase y una restauración probada antes del piloto. Región: Supabase `us-east-1` y Vercel `iad1`.

**RNF-REN-06:** sin cambio propuesto hasta que Aarón revise la PQ-26.

**Requiere:** ningún D-. Pendiente de Aarón: la PQ-26 (costo y plan de Vercel de `web/`).

---

## 6. PQ-25: librería de escaneo de QR para N5 Mostrador (RNF-STK-07, RF-SEL-13)

**Contexto.** N5 corre en el navegador del teléfono o la tablet del mostrador, en iPhone (Safari) o Android (Chrome). **(R2)** Aarón decidió que no se elige por papel: se prueban dos librerías en teléfonos reales antes de construir N5 y se queda **la más ligera que pase**.

**Dato clave.** `BarcodeDetector` nativo es «Limited availability» y experimental en MDN; Chromium lo tiene y Safari y Firefox no lo habían lanzado `[SUPUESTO: la tabla de compatibilidad de MDN no cargó; confirmar en caniuse]`. No se puede depender de él en iOS.

**Candidatas comparadas** (npm y GitHub, 21 oct 2026)

| | `qr-scanner` (nimiq) | `barcode-detector` (Sec-ant), *ponyfill* | `html5-qrcode` (mebjas) | `@zxing/browser` |
|---|---|---|---|---|
| Última versión | 1.4.2 (23 nov 2022) | 3.2.3 (19 oct 2026) | 2.3.8 (15 abr 2023) | 0.2.1 (6 jul 2026) |
| Mantenimiento | Sin versión desde 2022, 109 issues abiertos | Activo | **«Maintenance mode until further notice»** | Activo `[SUPUESTO]` |
| Licencia | MIT | MIT (ZXing-C++ es Apache-2.0) | Apache-2.0 | MIT |
| Descargas por semana | 264 mil | 1.64 M | 963 mil | 818 mil |
| Peso | 16.3 kB gzip (5.6 kB con `BarcodeDetector` nativo) | JS pequeño + **WASM de ~1.04 MiB** (build solo lector) | 2.6 MB desempacado | 5.8 MB desempacado |
| Decodifica con | JavaScript en un Web Worker | ZXing-C++ en WebAssembly | JavaScript (ZXing-js) | JavaScript (ZXing-js) |
| Sin conexión | Sí, copiando sus dos archivos JS | Sí, **si el `.wasm` sale de nuestro origen**; por defecto lo pide a jsDelivr | Sí | Sí |

`html5-qrcode` queda fuera por estar declaradamente en pausa. `@zxing/browser` es el pesado de reserva si ninguna pasa.

### 6.1 Prueba técnica con las dos finalistas (pasa / no pasa)

**Qué se prueba:** `qr-scanner` y `barcode-detector/ponyfill` con el `.wasm` autoalojado (`prepareZXingModule` con `locateFile` hacia un archivo de `web/public/`, verificando `ZXING_WASM_SHA256`), cada una en una página de prueba aparte, **antes de construir N5**.

**Con qué:** un iPhone con iOS 18 y otro con iOS 26 (Safari) y un Android con Chrome estable. Si hay un Android de gama baja, también. El QR de prueba es el real: `card_id + paso + HMAC` (RF-SEL-04), mostrado en el teléfono del cliente a 50 % de brillo, y uno impreso.

**Criterios.** Cada librería debe cumplir **todos** en **cada** teléfono para pasar:

| # | Criterio | Pasa si |
|---|---|---|
| 1 | Lectura con luz normal | ≥ 19 de 20 intentos correctos |
| 2 | Lectura con poca luz (luz de mostrador apagada, ≤ 50 lux medidos con una app `[SUPUESTO]`) | ≥ 17 de 20 |
| 3 | Velocidad | Del QR enfocado a la lectura: mediana ≤ 1 s y p95 ≤ 2 s |
| 4 | Modo avión | Con la página cargada y la red cortada, lee igual y **cero** peticiones de red (se revisa en las herramientas de desarrollo o con un proxy) |
| 5 | Sin terceros | Ninguna petición a otro origen que no sea `lealtab.com` (incluido el `.wasm`) |
| 6 | Cámara | Usa la trasera por defecto, pide permiso una sola vez, y reanuda tras bloquear y desbloquear la pantalla y tras cambiar de app y volver |
| 7 | QR rotativo | Lee un QR que cambia cada 60 s y entrega el paso vigente |
| 8 | Resistencia | 30 min de escaneo continuo (unas 150 lecturas) sin caer más de 10 % de aciertos, sin cierre de la pestaña y sin sobrecalentamiento notable |
| 9 | Arranque | Con caché caliente, de abrir la página a escáner listo ≤ 2 s; con Fast 4G simulada y caché fría, ≤ 4 s `[SUPUESTO: presupuesto propio]` |

**Cómo se elige.**
1. Si **una** pasa en los tres teléfonos, esa gana.
2. Si **las dos** pasan, gana la que transfiera menos bytes al abrir N5 (JS y `.wasm` juntos; se anota el total de cada una). Por peso, se espera que gane `qr-scanner`; entonces se **congela la versión y se vendoriza** (copia dentro de `web/`) por la falta de mantenimiento.
3. Si **ninguna** pasa, se prueba `@zxing/browser` con los mismos criterios, y mientras tanto «Buscar por WhatsApp» (RF-SEL-02) sigue como camino.
4. El resultado se anota en un registro de la prueba y se lleva a una D- o a un ADR con la librería elegida.

**Sin service worker (R2):** la librería, y el `.wasm` si gana `barcode-detector`, se descargan **al abrir N5**, no en el primer escaneo, con encabezados de caché inmutables para que las siguientes aperturas salgan del caché HTTP del navegador. Se carga solo en N5 (importación dinámica), no pesa en `/c/` ni en la landing.

**Cambia:**
> **RNF-STK-07 (propuesto).** Escaneo del QR en N5 con una librería de escaneo en el navegador, elegida con la prueba técnica de la sección 6.1 (`qr-scanner` o `barcode-detector`): la más ligera que pase en iPhone y Android, también en modo avión y con poca luz. La librería y sus archivos salen de `lealtab.com`; no se carga ningún recurso de terceros.

**Requiere:** ningún D- ni ADR hoy. Tras la prueba, un registro con la librería elegida (D- o nota en ADR-002 §2, lo decide el coordinador).

### 6.4 Sin service worker en el piloto: cola y sincronización (R2)

Decisión de Aarón: **un solo service worker, el de `/c/`**. N5 usa la cola de IndexedDB sin service worker.

**Aclaración propuesta a D-015** (no cambia su decisión):
> **D-015 (aclaración, 21 oct 2026).** El mostrador debe abrirse con conexión; después funciona sin ella. En el piloto no hay service worker en `/panel/`: si la página se cierra o se recarga sin red, no abre hasta que vuelva la conexión. Los sellos y canjes ya guardados en la cola de IndexedDB se conservan y se envían al volver. Si la métrica `mostrador_reabierto_tras_caida` sale alta, se reevalúa un service worker para N5.

**RNF-PWA-04 queda igual** (un solo service worker, scope `/c/`).

> **RNF-OFF-04 (propuesto, ajustado).** La cola de IndexedDB se envía: al abrir N5, al volver a primer plano (`visibilitychange`), con el evento `online`, cada 30 s mientras N5 esté abierto y con un botón «Sincronizar». Donde exista (Chrome en Android) se suma Background Sync del service worker de `/c/`, que **no** cubre `/panel/`, así que no se depende de él. En iOS no existe. Cada reintento usa espera exponencial y el mismo `event_id`.
>
> **RNF-OFF-03 (ajuste).** Las llaves HMAC de las tarjetas se guardan cifradas en IndexedDB (no en el caché de un service worker), y se refrescan en cada sincronización.

**Métrica de caídas (propuesta).** Al perder la red, N5 guarda `offline_since` en IndexedDB; al volver, lo borra. Si al **cargar** N5 el valor sigue ahí, es que N5 se cerró o se recargó durante la caída: se emite un evento con la duración (ahora menos `offline_since`) y el número de eventos pendientes en la cola. Nombre propuesto: **`mostrador_reabierto_tras_caida`** con `duracion_s` y `pendientes` (el nombre final lo decide `lealtab-analista-metricas`; hay que sumarlo a RF-EVT-01 y a `07-entrega` §5).

Dos límites que conviene conocer: sin red, un N5 cerrado no abre, así que el evento se emite en la primera carga con conexión; y Safari borra el almacenamiento de un sitio no instalado tras 7 días sin uso (ADR-001 H9), lo que solo afectaría a eventos pendientes de un mostrador que no se abra en una semana.

---

## 7. PQ-13 y PQ-22 (f): proveedor del código, SMS Masivos con el hook de Supabase (RNF-STK-06, D-011, D-023)

**Contexto.** **(R2)** Aarón decidió que el proveedor es **SMS Masivos** (https://www.smsmasivos.com.mx/), integrado con el *Send SMS hook* de Supabase Auth (RNF-STK-06 se mantiene). Con el hook, **Supabase genera y verifica el código**; el hook solo lo envía.

### 7.1 Qué sabemos del hook de Supabase (21 oct 2026)

- El *Send SMS hook* recibe el usuario (`user`) y el código (`sms.otp`, de 6 dígitos), y puede ser un endpoint HTTP o una función de Postgres. Basta responder 200 vacío; un error con código distinto de 200 hace fallar la solicitud. El ejemplo oficial manda WhatsApp a números de Latinoamérica y SMS al resto, es decir, **el hook decide el canal real** ([docs del hook](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook)). La documentación no precisa un tiempo máximo de respuesta.
- Límites por defecto: 30 SMS por hora por proyecto, 30 verificaciones cada 5 minutos por IP y 60 s entre códigos por usuario; configurables ([límites](https://supabase.com/docs/guides/auth/rate-limits)).
- Los proveedores nativos de teléfono y el canal `whatsapp` de Supabase solo existen con Twilio ([login por teléfono](https://supabase.com/docs/guides/auth/phone-login)). Con SMS Masivos no hay proveedor nativo: se usa el hook.

### 7.2 Qué ofrece SMS Masivos (documentación y sitio oficiales, 21 oct 2026)

| Tema | Hallazgo | Fuente |
|---|---|---|
| API | REST sobre HTTPS, JSON, base `https://api.smsmasivos.com.mx`. Autenticación con el encabezado `apikey` (se genera en Integraciones del panel). Modo `sandbox: 1` (100 envíos de prueba al día) | [API v2](https://app.smsmasivos.com.mx/api-docs/v2) |
| OTP propio | `POST /v2/otp` crea, reenvía o rota un código por `sms` (por defecto), `whatsapp` o `voice`; `POST /v2/otp/verify` lo comprueba. El código es de 6 dígitos por defecto (4 a 10), con 7 intentos por ronda, reenvío cada 30 s y vigencia de 24 h por defecto (máximo 3 días). **Solo se cobra el envío; verificar es gratis** | [Referencia API](https://app.smsmasivos.com.mx/api-docs/api-reference) |
| Código propio de Supabase | `code_custom` (4 a 10 letras o dígitos) permite **enviar un código que ya existe**. Así el hook entrega el OTP de Supabase y no se usa el verificador de SMS Masivos. `code_rotate: true` empieza una ronda nueva en cada envío | Referencia API |
| SMS | Mensaje en alfabeto **GSM-7** (sin «ó», «á», «í»), de hasta 160 caracteres ya sustituidos, con `{{code}}` y `{{company}}` obligatorios | Referencia API |
| WhatsApp por OTP | `channel: "whatsapp"` usa una **plantilla oficial fija**; el texto del mensaje se ignora. Dicen que no requiere cuenta de Meta ni plantillas propias, y que usa la «integración oficial» | [WhatsApp](https://app.smsmasivos.com.mx/api-docs/whatsapp) |
| WhatsApp «normal» | `POST /whatsapp/send` se conecta **escaneando un QR «igual que WhatsApp Web»**, con tu propio número. Límite de **1 envío cada 60 s** (si se rebasa, bloquea la cuenta 2 min), y advierte que WhatsApp «puede restringir o bloquear tu línea». No es la API de WhatsApp Business | WhatsApp, [Errores y límites](https://app.smsmasivos.com.mx/api-docs/errors) |
| Alcance | Números de México de 10 dígitos (`country_code: 52`) | Referencia API |
| Límite de tasa | 100 mensajes por segundo en producción (excepto `/whatsapp/send`); reintentar 429, 500 y 502 con espera exponencial | Errores y límites |
| Errores útiles | `402 otp_insufficient_credits`, `429 otp_throttled`, `502 otp_send_failed` | Referencia API |
| Estado de entrega | La API de SMS lista webhooks de estados; la del OTP documenta `GET /v2/otp/status` (solo lectura) y no documenta webhooks `[SUPUESTO]` | [Sitio](https://www.smsmasivos.com.mx/) |
| Precio del SMS | MXN 0.90 (recarga de 500 o más), 0.77 (1,000+), 0.68 (10,000+), **antes de IVA**; compra mínima de 500 mensajes; los de código corto no caducan y los de código largo duran 1 año | [Precios](https://www.smsmasivos.com.mx/precios-sms-masivos) |
| Precio del WhatsApp | **No está publicado**, ni el del OTP por WhatsApp. Hay que pedir cotización `[SUPUESTO]` | Precios |
| Datos | Servidores en **Estados Unidos**; responsable con domicilio en León, Guanajuato. Actúa como **encargado** de los datos de los destinatarios. Conserva número, contenido y metadatos de entrega **hasta 3 meses** y luego los borra. Transfiere a operadores móviles y a un proveedor de nube (AWS, GCP o Azure) | [Aviso de privacidad](https://www.smsmasivos.com.mx/aviso-de-privacidad) |
| Cookies | Las de analítica y de Meta Pixel que su aviso menciona son de **su sitio web**; nuestro flujo es servidor a servidor y el cliente nunca visita su sitio | Aviso de privacidad |

**Respuesta directa: ¿SMS Masivos ofrece WhatsApp por API?** Sí por el endpoint de OTP (`/v2/otp`, `channel: whatsapp`, plantilla fija, descrita como «oficial»). **No** por el de `/whatsapp/send`, que es una conexión por QR no oficial. Ni su documentación ni su sitio dicen si el OTP por WhatsApp pasa por la API de WhatsApp Business de Meta (que es lo que D-011 pide); eso **hay que confirmarlo por escrito** antes de construir, junto con el remitente que verá el cliente (no será un número de LealTab `[SUPUESTO]`) y el texto exacto de la plantilla.

### 7.3 Diseño de la integración

1. **Solicitud.** El cliente escribe su WhatsApp en `/c/recuperar`. El navegador llama a nuestro envoltorio (`/c/api/recuperar/solicitar`), que aplica los límites de §8 (e) y anota la intención de canal en `envio_codigo` (`auto` o `sms`).
2. **Supabase genera el código.** El envoltorio llama a `signInWithOtp` con el teléfono **sin pasar `channel`**. Supabase crea el código de 6 dígitos y llama al hook.
3. **El hook (`/api/hooks/send-sms`, ruta de Next.js).** Verifica la firma del hook (Standard Webhooks, secreto en variables de entorno), normaliza el teléfono (si empieza con `52`, deja los 10 dígitos; cualquier otro país se rechaza, igual que RF-APP-03) y elige el canal (abajo). Llama a `POST /v2/otp` con `phone_number`, `country_code: 52`, `company: "LealTab"`, `code_custom` igual al código de Supabase, `code_rotate: true`, `expiration_date` a 10 minutos, `channel` y el mensaje de SMS. Responde 200 si el envío salió.
4. **Verificación.** El cliente escribe el código; el envoltorio (`/c/api/recuperar/verificar`) cuenta intentos y llama a `verifyOtp` de **Supabase**. Nunca se llama a `/v2/otp/verify` de SMS Masivos.
5. **Sesión.** Si el código es correcto, se descarta la sesión de Supabase y se emite la cookie propia del cliente (§8 g).

**Cómo se elige el canal** (principal WhatsApp, respaldo SMS):
- **Primer envío:** WhatsApp (`channel: whatsapp`).
- **Fallo inmediato:** si SMS Masivos responde error de envío (`502`, `5xx` o tiempo agotado), el hook reintenta **en la misma llamada** por SMS.
- **El cliente lo pide:** tras 30 a 60 s, `/c/recuperar` ofrece «Mejor recíbelo por SMS». El envoltorio anota `canal = sms` y el hook lo lee.
- **Sin créditos o sin servicio en los dos canales:** el hook responde error y la pantalla dice «No pudimos enviarte el código. Intenta en unos minutos». Se avisa a Aarón por correo.
- Mensaje de SMS propuesto (GSM-7, menos de 160 caracteres): `{{company}}: tu clave es {{code}}. Vence en 10 min. No la compartas.` El texto de WhatsApp es fijo y no lo controlamos; `lealtab-copywriter` lo revisa cuando el proveedor lo entregue.

**Sobre el riesgo de `channel: 'whatsapp'` en Supabase.** Se elimina por diseño: **Supabase siempre pide el canal por defecto y el hook decide el canal real**. Queda un riesgo menor por probar: que `signInWithOtp` con teléfono llegue al hook sin un proveedor de teléfono nativo habilitado `[SUPUESTO]`. Si no llega, la salida es el código propio sin Supabase Auth (G3 de §8 g), que sí obligaría a enmendar D-023.

**Operación y seguridad**
- La `apikey` va en variables de entorno de Vercel **solo de producción**; las vistas previas usan otra llave con `sandbox: 1` (que con `code_custom` no exige `code_in_response`). Nunca se usa `code_in_response` ni se registra el código en los logs.
- `envio_codigo` guarda fecha, teléfono, canal, resultado y el `request_id` del proveedor. Un cron de Vercel consulta `GET /credits/consult` cada día y avisa a Aarón por correo si el saldo baja de un umbral (por ejemplo, 100 mensajes) o si fallan 3 de los últimos 10 envíos.
- SMS Masivos guarda número y contenido (que incluye el código, caducado a los 10 min) hasta 3 meses, en Estados Unidos, como encargado. Hay que declararlo en el aviso (PQ-18) y atarlo al contrato de encargo (RNF-PRI-08).

### 7.4 Costo (preliminar)

| Canal | Costo por mensaje | Fuente |
|---|---|---|
| SMS con SMS Masivos | MXN 0.77 a 0.90 + IVA (≈ USD 0.04 a 0.05 `[SUPUESTO: MXN 18 a 19 por USD]`) | [Precios](https://www.smsmasivos.com.mx/precios-sms-masivos) |
| WhatsApp (OTP) con SMS Masivos | **Por cotizar** | No publicado |
| Referencia: WhatsApp directo con Meta | USD 0.0085 a 0.0309 (las fuentes terceras chocan) | [EngageLab](https://www.engagelab.com/blog/whatsapp-business-api-pricing) y otras en §12 |

Peor caso del piloto: 14 negocios × 200 clientes = 2,800 identidades; con MET-05 en menos de 10 %, ≤ 280 recuperaciones y ≤ 420 envíos con reenvíos. **Si todos fueran SMS**, serían unos MXN 380 + IVA al mes (≈ USD 24 `[SUPUESTO]`). La primera recarga mínima es de 500 mensajes: MXN 450 + IVA. Con WhatsApp el costo dependerá de la cotización.

### 7.5 Frente a las otras opciones de la primera ronda

| | SMS Masivos (elegida por Aarón) | Meta Cloud API directo | Twilio Verify |
|---|---|---|---|
| Cuenta de Meta propia | **No** (según el proveedor) | Sí: portafolio, WABA, número y verificación del negocio | Sí: remitente propio ([Twilio](https://www.twilio.com/docs/verify/whatsapp)) |
| Respaldo SMS | Sí, mismo proveedor y misma API | Habría que sumar otro proveedor | Solo en una función piloto con ventas |
| Plantilla de WhatsApp | Fija, del proveedor | La crea LealTab | Automática |
| Dependencia | Un solo proveedor para los dos canales | Meta (y otro para SMS) | Twilio y Meta |
| Datos | EE. UU., encargado, 3 meses | EE. UU. (Meta) | EE. UU. (Twilio y Meta) |
| Punto débil | Confirmar que su WhatsApp es el oficial; precio sin publicar; remitente ajeno | Trámite de Meta | Costo: USD 0.05 por verificación más las tarifas de Meta y Twilio |

Mi lectura: la elección de Aarón es coherente. Ahorra el trámite de Meta (que toca RNF-PRI-08: razón social y RFC) y trae el respaldo SMS en la misma API. El riesgo es de **confirmación**, no de diseño.

### 7.6 Qué hay que probar antes de construir (*spike*)

1. Que `signInWithOtp` con teléfono llegue al hook sin proveedor nativo y sin `channel`.
2. Que `code_custom` de 6 dígitos con `channel: whatsapp` y `code_rotate: true` entregue exactamente el código de Supabase, también en reenvíos.
3. El **texto de la plantilla de WhatsApp**, el remitente y si es la API oficial de Meta: por escrito del proveedor.
4. La **cotización por escrito** del WhatsApp OTP y del SMS para el volumen del piloto.
5. Entrega real en Telcel, AT&T y Movistar, y en iPhone y Android, por los dos canales.
6. Tiempo de respuesta de la API frente al tiempo máximo del hook (no documentado).

**Cambia:** RNF-STK-06, RF-APP-15 (proveedor, canales y costo), R-18 (montos), RNF-REN-06.
> **RNF-STK-06 (propuesto).** Código de recuperación con el *Send SMS hook* de Supabase Auth y **SMS Masivos** como proveedor: Supabase genera y verifica el código; el hook solo lo envía por la API OTP de SMS Masivos (`/v2/otp`, con `code_custom`). Canal principal: WhatsApp. Respaldo: SMS, de forma automática si el envío falla y a petición del cliente. Solo números de México de 10 dígitos.

**Requiere:** D-024 propuesta y ADR-004 propuesto (§10), más una **aclaración a D-011** (el respaldo por SMS, §9).

---

## 8. PQ-22 (e), (g) y (h): código de recuperación, `identidad` frente a Supabase Auth y segundo negocio sin sesión

### 8 (e). Vigencia e intentos del código de recuperación (RF-APP-15)

**Contexto.** El default de Supabase para el código de teléfono es 1 hora (según su documentación de login por teléfono, que además dice «60 segundos» para verificarlo; las dos cifras no cuadran `[SUPUESTO]`). Verificar un código solo está limitado por IP (30 cada 5 minutos). No documentan un máximo de intentos **por código**.

**Recomendación.**
- Código de 6 dígitos, **vigencia de 10 minutos** (se envía a SMS Masivos como `expiration_date`; la plantilla de WhatsApp es fija y no muestra la vigencia, así que el límite real lo aplica nuestro envoltorio).
- **5 intentos fallidos por código**; el quinto lo invalida.
- Reenvío después de 60 s (el límite de Supabase) y **máximo 3 códigos por teléfono por hora y 10 al día**.
- Tras 5 fallos, bloqueo de ese teléfono por 15 minutos.
- Un tope global diario (por ejemplo 200 envíos) que avise a Aarón por correo: protege el costo ante abuso.
- La pantalla no revela si el teléfono tiene tarjetas: «Si ese número tiene tarjetas, te enviamos un código».

Como Supabase no cuenta intentos por código, el control vive en un **envoltorio del servidor**: el navegador nunca llama a `verifyOtp` de Supabase; llama a `/c/api/recuperar/*`, que cuenta intentos, aplica la vigencia y reenvía la IP real con `Sb-Forwarded-For`.

**Cambia:**
> **RF-APP-15 (propuesto, cierra «vigencia e intentos»).** El código es de 6 dígitos y dura 10 minutos. Admite 5 intentos fallidos; después se invalida. Se puede pedir otro tras 60 s, hasta 3 por hora y 10 al día por teléfono. Tras 5 fallos, el teléfono se bloquea 15 minutos. La respuesta no revela si el número existe.

**Requiere:** el ADR-003 propuesto (§10). Sin D- nueva.

### 8 (g). Cómo se relaciona la `identidad` con Supabase Auth (RNF-STK-04, D-019)

**Contexto.** D-023 y RNF-STK-04 dicen que Supabase Auth es para el **dueño**. El cliente se registra sin contraseña y sin código (C1), y en iOS su sesión viaja por un `install_token` de un solo uso (RNF-PWA-05, ADR-001 §7).

**Opciones**
- **G1. El cliente es un usuario de Supabase Auth** (`identidad.id = auth.users.id`, con teléfono). Da RLS con `auth.uid()`. Pero el servidor **no puede acuñar una sesión** de Supabase para un teléfono sin pasar por un código, así que ni el registro sin código (C1) ni el canje del `install_token` (que debe crear una sesión nueva en el contenedor de iOS) encajan. Y el registro anónimo de Supabase tiene 30 altas por hora por IP, que una cafetería con un solo Wi-Fi rebasaría.
- **G2. `identidad` propia y sesión propia; Supabase Auth solo como motor del código** (recomendada). `identidad` y `sesion_cliente` viven en nuestro esquema. La sesión es una cookie `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/c/`, con un token aleatorio de 256 bits cuyo hash está en `sesion_cliente`. Para el **código de recuperación**, Supabase Auth hace de motor: el envoltorio llama a `signInWithOtp` con el teléfono (se crea un usuario «sombra» con solo teléfono), el hook envía el WhatsApp, `verifyOtp` lo comprueba, y **se descarta la sesión de Supabase en el mismo momento** (cliente sin persistencia, sin cookies de Supabase para el cliente). Después el servidor emite la cookie propia.
- **G3. Código propio, sin Supabase Auth** (tabla de códigos con hash e intentos, y llamada directa a la API de SMS Masivos). Es más simple y da control total de vigencia e intentos, pero **contradice RNF-STK-06 y D-023** (que piden el hook de Supabase).

**Recomendación: G2.** Respeta D-023 y D-019, resuelve el registro sin código y el `install_token`, y deja el control de intentos en nuestro envoltorio. Si el *spike* de §7.4 falla (por ejemplo, el hook no se dispara sin un proveedor nativo), la salida es **G3**, y entonces sí hace falta enmendar D-023: lo señalo para que Aarón no se sorprenda.

Reglas del diseño:
- `identidad`: `id uuid`, `whatsapp text unique` (E.164), `verificado bool`, `verificado_ts`, `auth_user_id uuid unique null` (el usuario sombra, si existe). **Sin nombre** (D-019).
- `sesion_cliente`: `id`, `identidad_id`, `token_hash`, `origen` (registro, install_token, recuperacion), `creada_ts`, `ultimo_uso_ts`, `expira_ts` (hasta 400 días, que es el máximo que permiten los navegadores `[SUPUESTO]`, renovable al usar).
- **Acceso a datos del cliente:** las tablas de cliente (`identidad`, `sesion_cliente`, `cliente_negocio`, `tarjeta_cliente`) tienen RLS activo **sin políticas** para `anon` y `authenticated` (todo denegado). Solo el rol de servicio las toca, a través de funciones `SECURITY DEFINER` en un esquema aparte que reciben el token de sesión y devuelven únicamente datos de esa identidad. Las rutas `/c/api/*` son el único camino.
- **Protección contra secuestro previo:** alguien podría registrar el teléfono de otra persona antes de que ella use LealTab y quedarse con una sesión de esa identidad. Cuando la identidad se verifica con un código por primera vez (`verificado` pasa a `true`), **se revocan todas las sesiones anteriores**. Así el dueño real del número desplaza al intruso.
- **Un usuario sombra no es un dueño:** los usuarios con teléfono en `auth.users` no tienen fila en `dueno_negocio`, y todas las políticas de negocio exigen esa pertenencia. Hay que probarlo: un token de Supabase de un usuario sombra no debe leer ni una fila de negocio.
- Cada negocio sigue viendo solo su `cliente_negocio` (RF-CLI-08); «Mis tarjetas» es una función que filtra por la identidad de la sesión.

**Cambia:** RNF-STK-04 y §8.
> **RNF-STK-04 (propuesto).** Supabase Auth autentica **al dueño** (correo + código o contraseña, con restablecimiento). El cliente **no** es un usuario de sesión de Supabase: su `identidad` (teléfono E.164) y sus sesiones están en tablas propias, con una cookie `HttpOnly` de primera parte. Supabase Auth solo se usa como motor del código de recuperación por WhatsApp (RNF-STK-06); la sesión de Supabase que ese flujo crea se descarta y se emite la cookie propia.
>
> **§8, `identidad` (propuesto).** id, whatsapp (E.164, único), verificado, verificado_ts, auth_user_id (opcional). Sesiones en `sesion_cliente` (id, identidad_id, token_hash, origen, creada_ts, ultimo_uso_ts, expira_ts). Al verificar la identidad por código se revocan las sesiones previas.

**Requiere:** el ADR-003 propuesto. D-019 no cambia: este diseño la implementa.

### 8 (h). Segundo negocio sin sesión: código por WhatsApp o confirmación sin costo

**(R2) Decisión de Aarón: gana RF-APP-05** («por confirmar», sin código). Lo que sigue es el texto que **reemplaza RF-APP-04**.

**Contexto.** RF-APP-04 dice que, si el teléfono ya existe (R1), se envía un código. RF-APP-05 y ADR-001 §5.2 punto 6 dicen que la tarjeta queda «por confirmar» sin código. Las dos reglas chocan.

**Opciones**
- A. Código por WhatsApp en cada alta de un segundo negocio sin sesión. Costo por mensaje, fricción en el mostrador y dependencia del proveedor del código (R-18) en el momento más sensible del registro.
- B. Confirmación sin costo del ADR-001: la tarjeta nace `por_confirmar`, el cliente la acepta desde la app instalada o el cajero la verifica al dar el primer sello.

**Recomendación: B.** La tarjeta `por_confirmar` no aparece en «Mis tarjetas» ni da acceso a ningún dato de la identidad, así que quien escriba un teléfono ajeno no gana nada. El código por WhatsApp queda **solo en `/c/recuperar`** (cambio de teléfono). Si MET-08 sale en 20 % o más (tarjetas por confirmar que nunca se confirman), se evalúa ofrecer «Confirmar con código» como opción.

Efectos que hay que cuidar:
- **Pantalla R1 y C0**: R1 hoy promete un código; cambia a «Listo. Dile tu número en el mostrador para tu primer sello». C0 necesita un estado «Tarjeta por confirmar: ¿es tuya?» con «Aceptar» y «No soy yo» (que borra el `cliente_negocio`). Ambos son trabajo para `lealtab-product-designer` y `lealtab-copywriter`.
- **Fuga aceptada:** que `/c/{slug}/registro` conteste distinto a un teléfono nuevo y a uno ya existente permite que un negocio averigüe si un teléfono usa LealTab (un bit). Se mitiga con límite de intentos por IP y por teléfono, y se lleva a la consulta legal (PQ-18). No revela en qué otros negocios está.
- **Quién da el primer sello**: el cajero busca por WhatsApp (RF-SEL-02), ve el estado `por_confirmar` y pulsa «Confirmar que es este cliente». Queda en la bitácora con el dispositivo.

**Cambia:**
> **RF-APP-04 (propuesto).** Si el WhatsApp ya está registrado y no hay sesión en ese navegador (R1), la tarjeta se crea «por confirmar» (RF-APP-05) **sin enviar código**. La pantalla indica cómo conseguir el primer sello y ofrece «Ya usé LealTab en otro teléfono» hacia `/c/recuperar`, que es donde se envía el código por WhatsApp (RF-APP-15).
>
> **RF-APP-05 (aclaración).** Si hay sesión válida en ese navegador, la tarjeta del segundo negocio queda `activa` con un toque, sin código.

**Requiere:** ningún D-. Es lo que el ADR-001 ya decidió. El ADR-003 propuesto lo deja explícito.

---

---

## 9. PQ-23: respaldo si WhatsApp falla (R-18)

**Contexto.** **(R2)** Con SMS Masivos, el respaldo natural es SMS con el mismo proveedor. Si el cliente no recibe el código, no recupera sus tarjetas al cambiar de teléfono.

**Qué está en juego.** Un fallo de WhatsApp **no pierde sellos**: el cajero puede registrarlos buscando al cliente por WhatsApp (RF-SEL-02), sin su QR. Lo que se pierde es que el cliente vea su tarjeta.

**Opciones**
- A. **SMS con el mismo proveedor.** Misma API, MXN 0.77 a 0.90 + IVA por mensaje, sin proveedor ni subencargado extra. Cubre «no llegó el WhatsApp» (el cliente no tiene WhatsApp en ese número, la plantilla falló, etc.).
- B. Verificación por el cajero en N5 con un código en pantalla (la propuesta de la primera ronda). Cubre incluso una caída del proveedor, pero pide una pantalla nueva en N5, diseño y una regla de seguridad delicada (un cajero que habilita sesiones).
- C. Segundo proveedor (por ejemplo, WhatsApp directo con Meta). Más cuentas, más costo.

**Recomendación: A. La verificación por el cajero ya no hace falta en el piloto y la quito de la propuesta.** Motivos:
1. SMS ya cubre el fallo real más probable (entrega por un canal). Se activa solo si el envío falla y a petición del cliente (§7.3).
2. B agrega superficie de seguridad y diseño (N5) para un caso residual: que **los dos canales** del mismo proveedor fallen al mismo tiempo.
3. Los sellos nunca dependen del código (RF-SEL-02).

El caso residual (proveedor caído o sin créditos) se atiende con vigilancia, no con otra pantalla:
- **Alerta de saldo:** el cron diario de `GET /credits/consult` avisa a Aarón antes de que se acaben los créditos (`402 otp_insufficient_credits` es el fallo más previsible y evitable).
- **Alerta de fallos:** correo si fallan 3 de los últimos 10 envíos (`envio_codigo`).
- **Mensaje claro** al cliente («No pudimos enviarte el código. Intenta en unos minutos») y «Ayuda por WhatsApp» (RF-AJU-05).

**Gatillos para reconsiderar** (con una D- nueva): que **5 % o más** de las recuperaciones del piloto fallen en los dos canales, o una caída del proveedor de más de un día. Entonces se evalúa la verificación por el cajero (B) o un segundo proveedor (C).

**Qué no cambia:** RNF-PWA-05 conserva su respaldo de 6 dígitos «confirmado en Safari o con el cajero» para la transferencia de sesión en iOS. Eso es otro flujo y no lo toca esta propuesta.

**Cambia:** R-18, RF-APP-15 (se cierra «respaldo»).
> **R-18, mitigación (propuesta).** Código por WhatsApp con respaldo por SMS con el mismo proveedor (automático si el envío falla y a petición del cliente). Alerta diaria de saldo de créditos y aviso a Aarón si fallan 3 de los últimos 10 envíos. Los sellos nunca dependen del código (RF-SEL-02). Gatillo para evaluar otra verificación: 5 % o más de recuperaciones fallidas en los dos canales.
>
> **RF-APP-15 (adición).** Si el código por WhatsApp falla o no llega, el cliente puede pedirlo por SMS desde `/c/recuperar` (con el mismo proveedor). Solo se aceptan números de México de 10 dígitos.

**Requiere:** una **aclaración a D-011** (§10): el código va por WhatsApp y, de respaldo, por SMS con el mismo proveedor. Aarón ya lo decidió; falta registrarlo. Sin pantallas nuevas.

---

## 10. Textos propuestos de decisión y ADR (sin registrar)

### D-024 · 21 oct 2026 · Proveedor del código de recuperación: SMS Masivos

- **Decisión:**
  - El código de recuperación (D-011) se envía con **SMS Masivos**, integrado con el *Send SMS hook* de Supabase Auth. Supabase genera y verifica el código; el hook solo lo envía por la API OTP de SMS Masivos.
  - Canal principal: WhatsApp. Respaldo: SMS con el mismo proveedor, de forma automática si el envío falla y a petición del cliente.
  - Cierra el «Por definir» del proveedor en D-023. La librería de escaneo sigue por definir hasta la prueba técnica (§6.1).
- **Motivo:** decisión del fundador. Ahorra el trámite propio con Meta, trae el respaldo SMS en la misma API y cuesta MXN 0.77 a 0.90 por SMS antes de IVA. Detalle en `docs/adr/` (ADR-004 propuesto).
- **Consecuencias:**
  - Antes de construir hay que confirmar por escrito que el WhatsApp del OTP usa la API de WhatsApp Business (D-011), obtener la cotización del WhatsApp y probar el hook (§7.6).
  - SMS Masivos trata los datos en Estados Unidos, como encargado, y conserva número y contenido hasta 3 meses (PQ-18, RNF-PRI-08).
  - Solo se aceptan números de México de 10 dígitos.
  - Con una cuenta de recarga mínima de 500 mensajes.
- **Alternativa(s) descartada(s):** WhatsApp directo con Meta; Twilio Verify; 360dialog.
- **Decidió:** Aarón (pendiente de registrar).

### Aclaración a D-011 (no es una D- nueva)

- **Aclarado (decisión de Aarón, 21 oct 2026):** el código de recuperación va por WhatsApp y, como respaldo, por **SMS** con el mismo proveedor. El resumen semanal sigue solo en el panel y la API de WhatsApp no se usa para nada más.

### Aclaración a D-014 (no es una D- nueva)

- **Aclarado (decisión de Aarón, por registrar):** en «1 cada X horas», X se captura en horas con hasta 2 decimales, mayor que 0 y **hasta 24**; se guarda en minutos enteros; la ventana es móvil desde el último sello aceptado; el límite efectivo nunca baja del bloqueo fijo de 2 minutos. (El tope de 24 h sigue pendiente de aprobación expresa.)

### Aclaración a D-015 (no es una D- nueva)

- **Aclarado (decisión de Aarón, 21 oct 2026):** el mostrador debe abrirse con conexión; después funciona sin ella. En el piloto no hay service worker en `/panel/`: si N5 se cierra o se recarga sin red, no abre hasta que vuelva la conexión; la cola de IndexedDB se conserva y se envía al volver. Se mide con `mostrador_reabierto_tras_caida` y, si sale alta, se reevalúa un service worker para N5.

### ADR-003 · Identidad del cliente, sesión propia y recuperación

- **Estado:** Propuesto. **Fecha:** 21 oct 2026. **Decidió:** pendiente (Aarón).
- **Restricciones vigentes:** D-005, D-010, D-011, D-013, D-018, D-019, D-023; ADR-001 §5.2 punto 6 y §7.
- **Contexto.** D-023 asigna Supabase Auth al dueño. El cliente se registra sin código (C1), la sesión de iOS se transfiere con un `install_token` y la recuperación usa un código por WhatsApp (con respaldo SMS) enviado por el hook. Supabase no permite acuñar una sesión para un teléfono sin código y solo limita la verificación por IP.
- **Decisión.**
  1. `identidad` y `sesion_cliente` son tablas propias; la sesión es una cookie `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/c/`, con token de 256 bits guardado como hash.
  2. Las tablas del cliente tienen RLS sin políticas para `anon` y `authenticated`; solo funciones `SECURITY DEFINER` invocadas con el rol de servicio las leen, a partir del token de sesión.
  3. Supabase Auth se usa como motor del código mediante un envoltorio del servidor (`/c/api/recuperar/*`) que aplica vigencia de 10 min, 5 intentos por código, 3 códigos por hora y 10 al día por teléfono, y bloqueo de 15 min. La sesión de Supabase se descarta.
  4. Al verificar una identidad por código, se revocan sus sesiones previas.
  5. Un teléfono sin sesión en un segundo negocio crea una tarjeta `por_confirmar` sin código (RF-APP-05; ADR-001 §5.2 punto 6). El código se usa solo en `/c/recuperar`.
  6. Canal del código: WhatsApp principal y SMS de respaldo (ADR-004).
- **Por definir.** Que el hook se dispare con `signInWithOtp` sin proveedor nativo (*spike*); si el abogado exige otra cosa sobre la sesión de «Mis tarjetas» (D-017).
- **Consecuencias.** El cliente no depende de la sesión de Supabase ni de sus límites por IP. Hay un usuario sombra por identidad en `auth.users` (solo teléfono). Si el *spike* falla, se pasa a un código propio y se enmienda D-023. No hay verificación por el cajero en el piloto (§9).

### ADR-004 · Proveedor del código de recuperación

- **Estado:** Propuesto. **Fecha:** 21 oct 2026. **Decidió:** Aarón (proveedor); pendiente de registrar.
- **Restricciones vigentes:** D-011, D-018, D-023, RNF-STK-06, RNF-STK-10.
- **Contexto.** El código se envía con el hook de Supabase. Aarón eligió SMS Masivos. Su API OTP permite enviar un código existente (`code_custom`) por WhatsApp (plantilla oficial fija) o SMS.
- **Decisión.** Endpoint HTTP de Next.js (`/api/hooks/send-sms`) que verifica la firma del hook y llama a `POST /v2/otp` de SMS Masivos con el código de Supabase. WhatsApp principal; SMS si falla o si el cliente lo pide. Se elige el canal con una intención que anota el envoltorio en `envio_codigo`. Supabase genera y verifica el código; no se usa `/v2/otp/verify`. Alertas por saldo bajo y por fallos. La `apikey` va en variables de entorno de Vercel, solo en producción.
- **Por definir.** Confirmación escrita de que el WhatsApp del OTP es la API oficial de Meta, texto de la plantilla y remitente, precio del WhatsApp OTP, tiempo máximo del hook y entrega real por operador.
- **Consecuencias.** Un solo proveedor para los dos canales (punto único de falla, mitigado con alertas). Datos en Estados Unidos por 3 meses. Solo México. Cambiar de proveedor es cambiar un endpoint.

---

## 11. Tabla resumen

| PQ | Recomendación | ¿D- o ADR? | Bloquea |
|---|---|---|---|
| PQ-22 (a) | Zona IANA tomada del navegador en N2, validada contra zonas de México, editable en N8 | No | Alta N2, límite de sellos, semana de N0 |
| PQ-22 (b) | X en horas con 2 decimales, 0 < X ≤ 24, guardado en minutos, ventana móvil | Aclaración a D-014 | N8 Ajustes, validación del límite en el servidor |
| PQ-22 (c) | Dos CSV: `clientes.csv` y `visitas.csv`, con neutralización de fórmulas | No | Exportación (N7, N8) |
| PQ-22 (d) | `alta_ts`, `tanda` y `version_producto` en `negocio`, escritas por el servidor; sin UPDATE para el dueño | No | Migración inicial, `negocio_alta_completada`, métricas del Gate 1 |
| PQ-22 (e) | 6 dígitos, 10 min, 5 intentos por código, 60 s entre envíos, 3 por hora y 10 al día, bloqueo de 15 min, en un envoltorio del servidor | ADR-003 | `/c/recuperar` |
| PQ-22 (f) | Proveedor SMS Masivos: plantilla de WhatsApp fija del proveedor (confirmar texto y remitente); SMS de GSM-7 con `{{company}}` y `{{code}}`. Sin cuenta de Meta propia | ADR-004 | Configuración del proveedor antes del piloto |
| PQ-22 (g) | `identidad` y sesión propias; Supabase Auth solo como motor del código | ADR-003 | Auth del cliente, C1, `install_token`, Mis tarjetas |
| PQ-22 (h) | **Gana RF-APP-05** (por confirmar, sin código); el código solo en `/c/recuperar`; RF-APP-04 se reemplaza | ADR-003 | C1/R1, C0 (estado «por confirmar») |
| PQ-13 | SMS Masivos con el hook de Supabase; Supabase genera y verifica; WhatsApp principal y SMS de respaldo; el hook decide el canal | **D-024 + ADR-004** y aclaración a D-011 | `/c/recuperar`, configuración del proveedor (D-011) |
| PQ-23 | SMS con el mismo proveedor, alertas de saldo y fallos; **sin verificación por el cajero** en el piloto | Aclaración a D-011 | `/c/recuperar` |
| PQ-24 | Objetivos de §5, sin PITR, región `us-east-1`/`iad1`; el costo base de USD 45 pasa a **PQ-26 propuesta** | No | Entornos e infraestructura, pruebas de carga |
| PQ-25 | Prueba técnica con `qr-scanner` y `barcode-detector` en iPhone y Android; gana la más ligera que pase (criterios en §6.1) | No hoy; registro tras la prueba | N5 Mostrador |
| Sin SW en N5 | Un solo service worker (`/c/`); N5 abre con conexión; métrica `mostrador_reabierto_tras_caida` | Aclaración a D-015 | N5 sin conexión, RNF-OFF-03 y RNF-OFF-04 |
| **PQ-26 (propuesta)** | Costo base de infraestructura USD 45 al mes (Vercel Pro y Supabase Pro) y plan actual de Vercel: **Aarón lo revisa después** | Pendiente | Presupuesto, RNF-REN-06 |

---

## 12. Fuentes (consultadas el 21 oct 2026)

- Supabase, Send SMS hook: https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook
- Supabase, login por teléfono: https://supabase.com/docs/guides/auth/phone-login
- Supabase, límites de tasa: https://supabase.com/docs/guides/auth/rate-limits
- Supabase, configuración local (CLI): https://supabase.com/docs/guides/local-development/cli/config
- Supabase, precios: https://supabase.com/pricing
- Supabase, respaldos: https://supabase.com/docs/guides/platform/backups
- Supabase, regiones: https://supabase.com/docs/guides/platform/regions
- Vercel, precios: https://vercel.com/pricing
- Vercel, regiones: https://vercel.com/docs/regions
- **SMS Masivos**, sitio: https://www.smsmasivos.com.mx/
- SMS Masivos, API v2 (introducción): https://app.smsmasivos.com.mx/api-docs/v2
- SMS Masivos, WhatsApp: https://app.smsmasivos.com.mx/api-docs/whatsapp
- SMS Masivos, referencia de la API (OTP): https://app.smsmasivos.com.mx/api-docs/api-reference
- SMS Masivos, errores y límites: https://app.smsmasivos.com.mx/api-docs/errors
- SMS Masivos, precios: https://www.smsmasivos.com.mx/precios-sms-masivos
- SMS Masivos, aviso de privacidad: https://www.smsmasivos.com.mx/aviso-de-privacidad
- Referencia, WhatsApp directo con Meta: https://developers.facebook.com/docs/whatsapp/pricing (la tarifa de México no aparece en el texto); plantillas de autenticación: https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates
- Referencia, tarifa de México (tercero, cita tarjetas de Meta de jul y oct 2026): https://www.engagelab.com/blog/whatsapp-business-api-pricing. Cifras que chocan: https://www.aurorainbox.com/en/2026/05/26/price-whatsapp-business-api-mexico-2026/ y https://www.go4whatsup.com/mexico/whatsapp-business-api-pricing/
- Referencia, Twilio Verify: https://www.twilio.com/es-mx/verify/pricing y https://www.twilio.com/docs/verify/whatsapp
- Referencia, 360dialog: https://360dialog.com/pricing
- Background Sync: https://caniuse.com/background-sync
- Barcode Detection API (MDN): https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API
- `barcode-detector`: https://github.com/Sec-ant/barcode-detector · `zxing-wasm`: https://github.com/Sec-ant/zxing-wasm
- `qr-scanner`: https://github.com/nimiq/qr-scanner · `html5-qrcode`: https://github.com/mebjas/html5-qrcode
- Versiones, licencias y descargas: registro de npm (`https://registry.npmjs.org/<paquete>` y `https://api.npmjs.org/downloads/point/last-week/<paquete>`).
- Core Web Vitals: https://web.dev/articles/vitals

## 13. Lo que no pude verificar `[SUPUESTO]`

- Si el **WhatsApp del OTP de SMS Masivos** usa la API oficial de Meta, el texto de su plantilla, el remitente y su **precio** (no están publicados). Tampoco si el endpoint OTP tiene webhooks de entrega.
- Si **Supabase** dispara el hook con `signInWithOtp` sin proveedor nativo, su tiempo máximo de espera, y si fija la vigencia del código de teléfono por proyecto.
- Si **Vercel** o **Supabase** ponen cookies a los visitantes: no encontré documentación que lo afirme o lo niegue. En producción, Next.js en Vercel no escribe cookies propias salvo las de la app; en vista previa, Vercel puede agregar cookies de protección y de su barra (`_vercel_jwt`, por ejemplo). `@supabase/ssr` guarda la sesión del **dueño** en una cookie `sb-<ref>-auth-token` de primera parte. Propongo una prueba de Playwright que falle si `/`, `/c/` o `/panel/` en producción reciben `Set-Cookie` que no sea la de sesión, o piden recursos de otro origen.
- Región exacta de proceso de Supabase y la latencia a Tabasco.
- El plan de Vercel que usa hoy `web/`.
- El tipo de cambio usado para pasar MXN a USD (18 a 19 por USD).
