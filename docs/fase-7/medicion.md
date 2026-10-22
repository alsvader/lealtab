# Medición del MVP: eventos, consultas y registros fuera de la app

- **Fase:** 7 (Desarrollo del MVP y piloto 0). Autor: `lealtab-analista-metricas`.
- **Estado:** borrador para revisión de Aarón y del coordinador. **Las consultas se revisaron a mano: no hay base de datos ni `psql` en este entorno** y ninguna se ha ejecutado. Se prueban con datos de prueba antes del piloto 0 (sección 8).
- **Fuentes:** D-005, D-015, D-018, D-026, D-027, D-028, D-031; PRD v2.5 §2.2, §2.3, §5.9 y §8; `brand/06-product-design/07-entrega-desarrollo.md` §5; `docs/adr/003-sesion-cliente-y-codigo.md`; `docs/adr/004-proveedor-codigo.md`; `docs/fase-7/propuestas/pq-diseno.md` y `pq-arquitectura.md`.
- **Alcance:** catálogo completo de eventos del MVP vigente, consultas de MET-01 a MET-12 y de G1-a a G1-d, qué falta instrumentar, plantillas de los registros fuera de la app y texto de reemplazo para RF-EVT-01 a 06. No incluye Gate 2, Gate 3 ni cohortes (Fases 9 y 10).
- **Marcadores:** `[SUPUESTO]` = dato o regla no verificada; **Por definir** = lo que las fuentes no resuelven, con su PQ o una PQ propuesta (sección 11).

---

## 1. Qué cambió desde D-024 a D-031

| Cambio | Efecto en la medición |
|---|---|
| D-031: el cliente verifica su teléfono con un código desde el registro | Nacen 7 eventos (`registro_iniciado`, `codigo_*`). MET-03 se calcula por embudo con el paso del código y por canal; el costo por cliente nuevo sale de los envíos |
| D-031: desaparece «por confirmar» | **Se retiran** `tarjeta_por_confirmar_creada` y `tarjeta_confirmada`, y **MET-08**. Cambian MET-05, MET-06 y MET-07 (sección 6) |
| D-015 (aclaración): N5 se abre con conexión | Nace `mostrador_reabierto_tras_caida` (nombre final) |
| D-027: corregir sellos | Nace `sellos_corregidos`. Una corrección no es visita: las consultas de G1 filtran `evento.tipo` |
| D-026: borrar cuenta | Nace `cuenta_cliente_borrada`. Los eventos con identidad se anonimizan en la misma transacción (sección 3.3) |
| D-005 (aclaración): contraseña del dueño | Nacen `contrasena_restablecida` y `acceso_bloqueado` |
| PQ-22 (c) | `export_csv` gana el atributo `archivo` |
| D-028: la bienvenida no es visita | Las consultas de G1 excluyen `origen = 'bienvenida'` |

Además agrego, **porque una métrica vigente no se podía calcular sin ellos**, estos atributos y un evento (se marcan «propuesto» en el catálogo): `registro_iniciado` (denominador de MET-03, que antes no tenía), `negocio_alta_completada.duracion_s` (MET-01), `sello_registrado.duracion_ms` (MET-02), `cliente_registrado.so` (MET-04 por sistema operativo) y `cliente_registrado.con_codigo`. Si el coordinador los rechaza, esas métricas quedan «sin dato».

---

## 2. Principios

1. **Tabla propia, sin cookies ni terceros** (D-018, RNF-STK-05). Los eventos los escribe nuestro servidor.
2. **El navegador nunca decide la identidad ni el negocio.** El navegador manda `POST /c/api/eventos` o `POST /panel/api/eventos`; el servidor valida el nombre contra una lista cerrada, valida `props` con un esquema (solo enteros, booleanos y textos de un catálogo cerrado) y **estampa `negocio_id` e `identidad_id` desde la sesión**. Un valor de identidad enviado por el cliente se ignora.
3. **Emitir nunca rompe el flujo.** Si el insert falla, se registra en el log del servidor y el usuario no se entera. Los eventos de analítica no son fuente de verdad de nada del producto.
4. **Fuente de verdad de los gates: las tablas de dominio** (`negocio`, `cliente_negocio`, `tarjeta_cliente`, `evento` de sellos y canjes). Los eventos de analítica sirven para embudos, tiempos y conteos que no existen en el dominio. G1 se calcula sobre el dominio, y los eventos solo ayudan a detectar bajas (sección 3.3).
5. **Sin conexión:** los eventos del cliente en `/c/` no se encolan (si no hay red, se pierden). Los eventos del mostrador nacen en el servidor al sincronizar, con el `modo` correspondiente. Un bloqueo que N5 aplica localmente sin conexión no llega al servidor y **no se cuenta** (límite conocido de `sello_bloqueado`).
6. **Nombre de la tabla: `evento_uso`**, para no chocar con la tabla de dominio `evento` (sello, canje, corrección) del PRD §8.

---

## 3. Tabla `evento_uso` (propuesta al arquitecto)

### 3.1 Estructura

```sql
create table evento_uso (
  id               bigint generated always as identity primary key,
  evento_uuid      uuid unique,                         -- idempotencia de lo que emite el navegador
  nombre           text not null check (nombre ~ '^[a-z]+(_[a-z]+)*$'),
  ocurrido_ts      timestamptz not null default now(),  -- hora de recepción en el servidor
  negocio_id       uuid references negocio(id),
  identidad_id     uuid references identidad(id) on delete set null,   -- anonimiza al borrar la cuenta
  flujo_id         uuid,                                -- une los pasos de un registro o recuperación; aleatorio, no deriva del teléfono
  emisor           text not null check (emisor in ('cliente','panel','servidor','hook')),
  version_producto text not null,
  props            jsonb not null default '{}'::jsonb
);
alter table evento_uso enable row level security;       -- sin políticas: solo el rol de servicio
revoke all on evento_uso from anon, authenticated;
create index on evento_uso (nombre, ocurrido_ts);
create index on evento_uso (negocio_id, nombre, ocurrido_ts);
create index on evento_uso (flujo_id) where flujo_id is not null;
create index on evento_uso (identidad_id, nombre) where identidad_id is not null;
```

- El dueño y el cliente **no leen** `evento_uso` (ni siquiera sus propias filas). N0 y N6 salen de las tablas de dominio.
- La lista de nombres válidos vive en el código del servidor (`src/lib/eventos.ts`, con el esquema de `props` de cada uno) y es la misma de la sección 4. Agregar un evento es un cambio de código y de este documento.
- `emisor`: `cliente` (navegador de `/c/`), `panel` (navegador de `/panel/`), `servidor` (ruta o función de base), `hook` (`/api/hooks/send-sms`).
- `flujo_id` nace en el navegador cuando se muestra C1 o `/c/recuperar` y viaja en cada llamada de `/c/api/auth/*`. El servidor lo escribe en `envio_codigo` (columna nueva, sección 10) para que el hook, que no ve el navegador, lo recupere. Si C1 conserva el paso en `sessionStorage` durante el flujo (propuesta de `brand/06-product-design/08-registro-con-codigo.md`, CA-C1.14), `flujo_id` vive ahí y sobrevive a una recarga; si no, una recarga genera otro `flujo_id` y infla un poco el denominador de MET-03. Se borra con el resto del estado del flujo.

### 3.2 Qué NO se guarda nunca (ningún evento, ningún atributo)

| No se guarda | Por qué |
|---|---|
| Teléfono, **ni en claro ni con hash** | Un hash de 10 dígitos se revierte en segundos. El teléfono vive solo en `identidad`, `auth.users`, `envio_codigo` y `codigo_intento` |
| Nombre del cliente, correo del dueño, nombre del negocio | RNF-PRI-01. El negocio se identifica con `negocio_id` |
| IP, user agent, huella del navegador, geolocalización | Ni siquiera con hash. (`envio_codigo` guarda IP con hash solo para el límite por IP y vence a los 30 días) |
| El código tecleado (correcto o no) ni el que se envió | Seguridad |
| Texto libre: la nota de «Otro» en una corrección, mensajes de error, URLs completas | Puede contener datos personales. Los atributos son enteros, booleanos o catálogos cerrados |
| `tarjeta_id`, `cliente_negocio_id`, `llave_hmac` | El detalle de cada sello vive en el dominio. Un evento de analítica con `tarjeta_id` permitiría reconstruir el historial de una persona |
| Nombre del proveedor, `request_id` del proveedor | Se queda en `envio_codigo` |

`identidad_id` es seudónimo (un UUID interno). Solo lo llevan los eventos marcados «sí» en la columna Identidad. Nunca llega a un negocio (RF-CLI-08).

### 3.3 Borrado de cuenta del cliente (D-026, RF-APP-14)

Al borrar la cuenta, **en la misma transacción** que borra `identidad`, `cliente_negocio` y tarjetas:

```sql
update evento_uso set flujo_id = null where identidad_id = :identidad_id;
-- luego: delete from identidad where id = :identidad_id;
-- on delete set null deja identidad_id en null: las filas quedan, sin vínculo con la persona.
insert into evento_uso (nombre, emisor, version_producto, props)
values ('cuenta_cliente_borrada', 'servidor', :version, jsonb_build_object('negocios', :n));  -- sin negocio_id ni identidad_id
```

- **Se anonimizan, no se borran**, para que los conteos históricos de cada negocio y de G1 no bajen. Es la recomendación de `pq-diseno.md` (C5) y `[SUPUESTO: requiere revisión legal]`, porque PQ-04 todavía no decide si los eventos se conservan. Si PQ-04 resuelve que se borren, el cambio es `delete` en lugar de `set null`, sin tocar el catálogo.
- Quedan filas como `cliente_registrado` con `negocio_id`, la hora y atributos gruesos (SO, bienvenida), sin ninguna referencia a una persona.
- **Riesgo residual:** `flujo_id` de los eventos `codigo_*` que no llevan identidad enlaza, mientras exista, con `envio_codigo.telefono` (30 días `[SUPUESTO]`). Esos eventos no se pueden anular por identidad porque nunca la llevaron. El hilo se corta solo cuando `envio_codigo` vence. Si el abogado lo considera material, la salida es que el borrado también limpie las filas de `envio_codigo` y `codigo_intento` de ese teléfono (a costa de reiniciar sus límites de envío): **Por definir, PQ propuesta (sección 11)**.
- **Prueba obligatoria** (sección 8): antes de borrar, guardar los `id` de los eventos de esa identidad; después, `select count(*) from evento_uso where id = any(:ids) and (identidad_id is not null or flujo_id is not null)` debe dar 0.
- **Efecto en G1:** las consultas del dominio ya no ven a la persona borrada. La consulta de bajas (sección 7.1) compara `cliente_registrado` (que sobrevive) contra `cliente_negocio` y reporta cuántos inscritos se dieron de baja por negocio. Si es distinto de 0, el informe de Gate 1 lo advierte.

---

## 4. Catálogo de eventos del MVP vigente

Columnas: **Emisor** (sección 3.1), **Neg.** y **Ident.** (sí = el servidor estampa `negocio_id` o `identidad_id`; no = va nulo; opc. = nulo si no hay sesión o contexto). Los atributos van en `props`, salvo `flujo_id`.

### 4.1 Alta, tarjeta y panel del dueño

| Evento | Emisor y momento | Atributos | Neg. | Ident. | Privacidad |
|---|---|---|---|---|---|
| `negocio_alta_completada` | servidor, al terminar N4 (la misma transacción que escribe `negocio.alta_ts`, `tanda` y `version_producto`) | `oficio` (= `negocio.giro`), `tanda`, `version_producto`, **`duracion_s`** (propuesto; entero, lo manda N1 a N4: tiempo con el panel visible desde que se muestra N1 hasta N4, sin contar pestaña en segundo plano; incluye la espera del código por correo). La fecha es `ocurrido_ts` | sí | no | Sin nombre ni correo del negocio. `tanda` y `oficio` se copian de `negocio`, no los escribe el cliente |
| `tarjeta_configurada` | panel, al guardar N3 por primera vez | — | sí | no | — |
| `qr_mostrador_descargado` | panel, al descargar el cartel en N4 o N7·V2 | — | sí | no | — |
| `resumen_semanal_visto` | panel, al mostrarse N0 | `semana` (ISO `AAAA-Www` de la fecha de apertura en la zona del negocio, RF-INI-05) | sí | no | — |
| `accion_sugerida_click` | panel | `tipo` (`en_riesgo`, `a_un_sello`; RF-INI-03) (propuesto) | sí | no | — |
| `whatsapp_ayuda_click` | panel o cliente | `pantalla` (id de pantalla: `N1`, `L1`, `M1`, `R2`, etc.) (propuesto) | opc. | no | Sin el texto que se prellena |
| `activar_plan_click` | panel | `pantalla` (`P1`, `N8`, etc.) (propuesto) | sí | no | — |
| `por_revisar_resuelto` | panel, al decidir en N7 → Por revisar | `resolucion` (`aprobado`, `descartado`), `motivo` (`limite`, `qr_vencido`, `duplicado`, `doble_canje`, `firma`) (propuesto) | sí | no | — |
| `export_csv` | servidor, al generar el archivo | **`archivo`** (`clientes`, `visitas`), `cuenta_estado` (`prueba`, `activo`, `pausa`) (propuesto) | sí | no | Sin el contenido ni el número de filas |
| `contrasena_restablecida` | servidor, al aceptar el código y fijar la contraseña nueva (D-005) | `cerro_otras_sesiones` (booleano) | sí | no | Sin correo ni IP. Solo se emite cuando la cuenta existe y el restablecimiento termina, así que no filtra si un correo tiene cuenta |
| `acceso_bloqueado` | servidor, al pausar el acceso con contraseña por 5 fallos (RF-ALT-02c) | — (el único método bloqueable es la contraseña) | sí | no | Sin correo ni IP. Solo con cuenta existente |

### 4.2 Mostrador, sellos y correcciones

| Evento | Emisor y momento | Atributos | Neg. | Ident. | Privacidad |
|---|---|---|---|---|---|
| `sello_registrado` | servidor, al aceptar un sello (en línea) o al validarlo en la sincronización | `modo` (`en_linea`, `sin_conexion`), `origen` (`mostrador`, `bienvenida`; propuesto), **`duracion_ms`** (propuesto; solo mostrador: desde que N5·1 decodifica el QR hasta que N5 muestra «+1 sello»; lo mide el navegador y viaja en el lote; nulo en bienvenida y si falta). Con `modo = sin_conexion`, `ocurrido_ts` es la recepción; la hora real del sello vive en `evento.device_ts` | sí | no | Sin `tarjeta_id`: el detalle es del dominio |
| `sello_bloqueado` | servidor, al rechazar un sello en línea | `motivo` (`limite`, `doble_escaneo`), `modo` | sí | no | Los bloqueos locales sin conexión no se cuentan |
| `canje_registrado` | servidor, al aceptar un canje | `modo` (`en_linea`, `sin_conexion`) | sí | no | — |
| `sync_completada` | servidor, por cada lote de la cola que termina de procesar con ≥1 movimiento | `aceptados`, `rechazados`, `descartados` (propuesto; «tarjeta dada de baja», RF-SEL-15) | sí | no | — |
| `mostrador_reabierto_tras_caida` | panel, al cargar N5 con conexión cuando `offline_since` sigue en IndexedDB (D-015; RNF-OFF-04) | `duracion_s` (entero ≥ 0: ahora menos `offline_since`), `pendientes` (entero ≥ 0: movimientos en la cola). El cliente borra `offline_since` después de emitir | sí | no | Sin `dispositivo_id`. Nombre provisional de D-015 **confirmado** como final |
| `sellos_corregidos` | servidor, al guardar una corrección (D-027, RF-CLI-04) | `delta` (entero de −3 a +3, distinto de 0), `motivo` (código de la lista de N7; la lista cerrada la define Diseño: **Por definir**, sección 11), `completa_tarjeta` (booleano), `con_nota` (booleano: hay nota, nunca el texto) | sí | no | Sin la nota, sin `tarjeta_id`, sin `cliente_negocio_id`, sin nombre. El detalle por persona es el evento de dominio `correccion` |

### 4.3 App del cliente, instalación y sesión

| Evento | Emisor y momento | Atributos | Neg. | Ident. | Privacidad |
|---|---|---|---|---|---|
| `cliente_registrado` | servidor, al terminar la transacción de registro (después del código, o al aceptar un segundo negocio con sesión) | `bienvenida` (booleano), `identidad_nueva` (booleano), **`con_codigo`** (propuesto; falso en el segundo negocio con sesión), **`so`** (propuesto; `ios`, `android`, `otro`, deducido en el servidor del encabezado y descartado: no se guarda el user agent), `flujo_id` | sí | sí | Sin nombre ni teléfono. Se conserva anonimizado tras el borrado |
| `pwa_instalada` | cliente, en la primera apertura con `display-mode: standalone` de esa identidad (iOS no avisa de la instalación) `[SUPUESTO]`; el servidor ignora repetidos por identidad | `so`, `display_mode` (`standalone`) | opc. | sí si hay sesión | — |
| `guia_instalacion_mostrada` | cliente, al mostrarse C2 | `so` | opc. | sí si hay sesión | — |
| `install_token_canjeado` | servidor, al canjear con éxito el token en iOS (PQ-31, mecanismo A) | — | no | sí | Sin el token ni su hash |
| `recuperacion_completada` | servidor, al verificar el código por un teléfono que ya tenía tarjetas y sin sesión en ese navegador (MET-05) | `proposito` (`registro`, `recuperacion`), `tarjetas_previas` (entero ≥ 1), `flujo_id` | opc. | sí | Sin negocios ni teléfono |
| `app_abierta` | cliente, al cargar `/c/` en frío con sesión | `display_mode` (`standalone`, `browser`). El servidor acepta máximo 1 por identidad y `display_mode` por hora `[SUPUESTO]` | no | sí | — |
| `cuenta_cliente_borrada` | servidor, al terminar el borrado (D-026) | `negocios` (número de `cliente_negocio` borrados) | **no** | **no** | Sin identidad, sin teléfono y sin negocio |

### 4.4 Código de verificación (D-031, ADR-003, ADR-004)

Un **flujo** es una visita a C1 o a `/c/recuperar` y comparte `flujo_id`. El orden normal es `registro_iniciado` → `codigo_pedido` → `codigo_enviado` → `codigo_verificado` → `cliente_registrado`. Ningún evento de código antes de verificar lleva identidad (todavía no existe o no se ha probado), y ninguno lleva teléfono.

| Evento | Emisor y momento | Atributos | Neg. | Ident. | Privacidad |
|---|---|---|---|---|---|
| `registro_iniciado` (propuesto) | cliente, una vez cuando C1 se muestra y se hidrata; **aquí nace `flujo_id`** | `con_sesion` (booleano), `so` (`ios`, `android`, `otro`), `navegador_integrado` (booleano: WhatsApp, Instagram; R3) | sí (slug) | no | Sin user agent: el navegador manda solo las tres banderas |
| `codigo_pedido` | servidor, en la **primera** petición con ese `flujo_id` a `/c/api/auth/codigo`, **antes** de aplicar límites (así el denominador incluye lo rechazado) | `proposito` (`registro`, `recuperacion`, `instalacion`; mismo catálogo que `envio_codigo`) | sí en C1; no en `/c/recuperar` e instalación | no | Sin teléfono |
| `codigo_enviado` | hook (`/api/hooks/send-sms`), al responder 200 el proveedor | `canal` (`whatsapp`, `sms`), `razon_canal` (`principal`, `respaldo_automatico`, `respaldo_cliente`), `proposito`, `latencia_ms` (llamada al proveedor), `flujo_id` (del registro del servidor en `envio_codigo`; nulo si alguien llamó a Supabase directo). El negocio se obtiene por `flujo_id` | no | no | Sin teléfono, sin `request_id`, sin el código. **Es el evento que se cuenta para el costo**: un envío fallido no se cobra `[SUPUESTO; se confirma con la factura al usar la API, PQ-30 ya no lo pide al proveedor]` |
| `codigo_reenviado` | servidor, en una petición posterior con el mismo `flujo_id` y el canal por defecto (la espera es de 60 s) | `proposito`, `n` (número de petición del flujo, ≥ 2), `segundos_desde_anterior` | no | no | — |
| `codigo_canal_cambiado` | servidor, cuando el cliente pide «Mejor recíbelo por SMS» (ADR-004 §2.3). Es excluyente con `codigo_reenviado`; el envío resultante es un `codigo_enviado` con `razon_canal = respaldo_cliente` | `de` (`whatsapp`), `a` (`sms`), `segundos_desde_envio`, `proposito` | no | no | — |
| `codigo_verificado` | servidor, en `/c/api/auth/verificar` con éxito | `proposito`, `canal` (el del último `codigo_enviado` del flujo), `intentos_previos` (0 a 4), `segundos_desde_envio`, `identidad_nueva` (booleano), `flujo_id` | opc. | sí | Sin teléfono ni código |
| `codigo_fallido` | servidor (verificación; límite por IP), hook (límites por teléfono y globales; error del proveedor) | `fase` (`envio`, `verificacion`), `motivo` (`incorrecto`, `vencido`, `bloqueado`, `limite`, `proveedor`), `detalle` (catálogo abajo), `proposito`, `canal` (solo en `proveedor` y en verificación), `intento_n` (1 a 5, solo `incorrecto`), `flujo_id` | no | no | **No lleva identidad aunque el teléfono exista**: evita enumerar. Sin el código tecleado |

**Catálogo cerrado de `motivo` y `detalle` de `codigo_fallido`:**

| `motivo` | `fase` | `detalle` | Origen (ADR-003 §2.8, ADR-004 §2.3 y §2.8) |
|---|---|---|---|
| `incorrecto` | verificacion | — | Código distinto; con `intento_n` = 5 el código se invalida |
| `vencido` | verificacion | — | Pasaron los 10 min |
| `bloqueado` | verificacion | `cinco_fallos` (el quinto fallo dispara el bloqueo de 15 min), `en_bloqueo` (intento durante el bloqueo) | Bloqueo de 15 min por teléfono |
| `limite` | envio | `telefono_hora` (3), `telefono_dia` (10), `ip_hora` (10), `tope_global` (400 al día), `espera_60s`, `no_movil_mx` | Hook y servidor |
| `proveedor` | envio | `sin_credito` (402), `limitado` (429), `error_envio` (502 o 5xx), `tiempo_agotado` | SMS Masivos. Se emite una vez por canal que falla, con su `canal`; un fallo de WhatsApp seguido de un envío por SMS exitoso deja un `codigo_fallido` y un `codigo_enviado` |

**Abandono en el código (sin evento propio).** Por qué: un evento de «cerró la pantalla» depende de `pagehide` y de balizas, que en Safari de iOS no son confiables, y el abandono se deduce con certeza de lo que sí llegó. Un flujo con `codigo_pedido` y sin `codigo_verificado` cuyo último evento tiene más de 10 minutos (la vigencia del código) está abandonado. Su etapa (consulta 6.3):

| Etapa | Condición |
|---|---|
| `a_sin_envio` | Hubo `codigo_pedido` y ningún `codigo_enviado` (límite o proveedor; el cliente no pudo continuar) |
| `b_sin_intento` | Hubo `codigo_enviado` y ningún intento (ni `codigo_verificado` ni `codigo_fallido` de verificación): no tecleó el código |
| `c_con_fallos` | Hubo ≥1 `codigo_fallido` de verificación y nunca `codigo_verificado` |

El abandono previo al código (`registro_iniciado` sin `codigo_pedido`) es la primera etapa del embudo de MET-03.

**Retirados (D-031):** `tarjeta_por_confirmar_creada` y `tarjeta_confirmada`. Si siguen en el código, se borran. Las filas históricas con esos nombres, si existieran, se ignoran en las consultas.

---

## 5. Verificación de nombres (D-018, RF-EVT-03)

Reglas: español, `snake_case`, sin acentos ni `ñ`, sin nombres retirados (`negocio_alta`, `sello_otorgado`, `canje_confirmado`, `tarjeta_por_confirmar_creada`, `tarjeta_confirmada`) y sin chocar con los de `07-entrega` §5 vigente antes de este cambio. Comprobado con un guion sobre las tablas de la sección 4 (31 eventos): los 31 cumplen el formato `^[a-z]+(_[a-z]+)*$`, no hay duplicados, ninguno es un nombre retirado, los 12 nuevos no existían en `07-entrega` §5 anterior y los 31 aparecen en el §5 actualizado. Los nombres nuevos son: `registro_iniciado`, `codigo_pedido`, `codigo_enviado`, `codigo_reenviado`, `codigo_canal_cambiado`, `codigo_verificado`, `codigo_fallido`, `mostrador_reabierto_tras_caida`, `sellos_corregidos`, `cuenta_cliente_borrada`, `contrasena_restablecida`, `acceso_bloqueado`. No hay prefijos de herramientas de terceros ni de PostHog.

`sellos_corregidos` y `cuenta_cliente_borrada` se conservan con el nombre que ya usan D-026, D-027 y el PRD: no se renombran para no abrir otra ronda de alineación.

---

## 6. Consultas de las métricas del producto

**Convenciones.** Parámetros de `psql`: `:'tanda'`, `:'desde'`, `:'hasta'` (timestamptz). Los porcentajes se devuelven como fracción (0.85 = 85 %). Un denominador cero devuelve `null` («sin dato»), nunca 0. Con N de 10 a 14 negocios y unos 5 por oficio, **cualquier cifra por oficio o por canal es dirección, no significancia estadística**. Las tablas externas `ext_*` se cargan desde los CSV de la sección 9. `negocio.giro` es el oficio.

### 6.1 Vistas de apoyo

```sql
-- Día 1 de cada negocio = fecha local de su alta (N4). [SUPUESTO: el PRD no define el día 1; ver PQ propuesta]
create or replace view v_negocio_g1 as
select n.id as negocio_id, n.giro as oficio, n.tanda, n.zona_horaria, n.alta_ts,
       (n.alta_ts at time zone n.zona_horaria)::date as dia1
from negocio n;

-- Visita = sello o canje aceptado en el mostrador. Excluye bienvenida (D-028) y correcciones (D-027).
create or replace view v_visita as
select tc.negocio_id, tc.cliente_negocio_id, e.tipo,
       coalesce(e.device_ts, e.recibido_ts) as ocurrido_ts,
       (coalesce(e.device_ts, e.recibido_ts) at time zone n.zona_horaria)::date as dia_local
from evento e
join tarjeta_cliente tc on tc.id = e.tarjeta_id
join negocio n on n.id = tc.negocio_id
where e.estado = 'aceptado'
  and e.tipo in ('sello', 'canje')
  and e.origen = 'mostrador';
```

`[SUPUESTO]` que un sello rechazado y luego aprobado desde Por revisar queda con `estado = 'aceptado'`; si no, se suma `por_revisar.resolucion = 'aprobado'`. El arquitecto lo confirma. Los nombres de columna de `evento` son los del PRD §8; si cambian, solo cambia `v_visita`.

### 6.2 MET-01 y MET-02

```sql
-- MET-01: mediana de la duración del alta, sin los negocios con alta asistida (meta < 300 s).
select percentile_cont(0.5) within group (order by (e.props->>'duracion_s')::int) as mediana_s,
       avg(((e.props->>'duracion_s')::int < 300)::int)                          as fraccion_menor_5_min,
       count(*)                                                                 as altas
from evento_uso e
where e.nombre = 'negocio_alta_completada'
  and e.props ? 'duracion_s'
  and not exists (select 1 from ext_horas_fundador h
                  where h.negocio_id = e.negocio_id and h.actividad = 'alta_asistida');
```

Advertencia: con ayuda de arranque en persona en el piloto (D-005), la mayoría puede quedar excluida; se reporta cuántas altas fueron asistidas.

```sql
-- MET-02: tiempo de escanear a «+1 sello» (meta < 5000 ms). Solo sellos del mostrador con medición.
select percentile_cont(array[0.5, 0.9]) within group (order by (props->>'duracion_ms')::int) as p50_p90_ms,
       avg(((props->>'duracion_ms')::int < 5000)::int) as fraccion_menor_5_s,
       count(*) as sellos_medidos
from evento_uso
where nombre = 'sello_registrado' and props->>'origen' = 'mostrador' and props ? 'duracion_ms'
  and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta';
```

### 6.3 MET-03: registro, paso del código, canal y costo (cambia con D-031)

**Definición nueva.** De los flujos con `registro_iniciado` (el cliente vio C1), cuántos terminan en `cliente_registrado`. Se reportan **dos tasas**: la total (incluye el segundo negocio con sesión, que no pide código) y la de **sin sesión** (la que pasa por el código y la que se compara con la meta de ≥85 %). Se acompaña del embudo, del abandono por etapa y del canal. Meta: ≥85 % `[SUPUESTO]`; el ajuste del umbral sigue **Por definir** (PRD).

```sql
-- Embudo por flujo de C1 (sin sesión y con sesión).
with f as (
  select flujo_id,
         bool_or(nombre = 'registro_iniciado' and (props->>'con_sesion')::boolean) as con_sesion,
         bool_or(nombre = 'codigo_pedido')                                         as pidio,
         bool_or(nombre = 'codigo_enviado')                                        as se_envio,
         bool_or(nombre = 'codigo_verificado')                                     as verifico,
         bool_or(nombre = 'cliente_registrado')                                    as se_registro
  from evento_uso
  where flujo_id is not null
    and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
    and nombre in ('registro_iniciado','codigo_pedido','codigo_enviado','codigo_verificado','cliente_registrado')
  group by flujo_id
  having bool_or(nombre = 'registro_iniciado')          -- solo flujos de C1 (excluye /c/recuperar)
)
select
  con_sesion,
  count(*)                                       as vieron_c1,
  count(*) filter (where pidio)                  as pidieron_codigo,
  count(*) filter (where se_envio)               as codigo_enviado,
  count(*) filter (where verifico)               as codigo_verificado,
  count(*) filter (where se_registro)            as registrados,
  count(*) filter (where se_registro)::numeric / nullif(count(*), 0) as tasa_registro
from f
group by rollup (con_sesion);                    -- fila con con_sesion nulo = total
```

```sql
-- Canal: de los flujos con al menos un envío (registro y recuperación), cuántos verificaron, por canal del último envío.
with ultimo as (
  select distinct on (flujo_id) flujo_id, props->>'canal' as canal
  from evento_uso
  where nombre = 'codigo_enviado' and flujo_id is not null
    and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
  order by flujo_id, ocurrido_ts desc
), fin as (
  select flujo_id, bool_or(nombre = 'codigo_verificado') as verifico
  from evento_uso where flujo_id is not null and nombre in ('codigo_enviado','codigo_verificado')
  group by flujo_id
)
select u.canal, count(*) as flujos, count(*) filter (where f.verifico) as verificados,
       count(*) filter (where f.verifico)::numeric / nullif(count(*), 0) as tasa_verificacion
from ultimo u join fin f using (flujo_id)
group by u.canal;
```

```sql
-- Abandono en el código por etapa (flujos cuyo último evento tiene más de 10 min).
with f as (
  select flujo_id,
         max(ocurrido_ts)                                                   as ultimo_ts,
         bool_or(nombre = 'codigo_pedido')                                  as pidio,
         bool_or(nombre = 'codigo_enviado')                                 as se_envio,
         bool_or(nombre = 'codigo_verificado')                              as verifico,
         bool_or(nombre = 'codigo_fallido' and props->>'fase' = 'verificacion') as fallo_verif
  from evento_uso
  where flujo_id is not null and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
  group by flujo_id
)
select case when not se_envio then 'a_sin_envio'
            when not fallo_verif then 'b_sin_intento'
            else 'c_con_fallos' end as etapa_abandono,
       count(*) as flujos
from f
where pidio and not verifico and ultimo_ts < now() - interval '10 minutes'
group by 1 order by 1;
```

Lectura: si MET-03 sale <85 %, el PRD pide mirar primero cuántos abandonan en el código. `a_sin_envio` alto es un problema del proveedor o de los límites (R-18); `b_sin_intento` alto, de fricción (el cliente no encuentra el mensaje); `c_con_fallos`, de entrega o de copy.

```sql
-- Motivos de fallo (envío y verificación), por canal.
select props->>'fase' as fase, props->>'motivo' as motivo, props->>'detalle' as detalle,
       props->>'canal' as canal, count(*) as eventos
from evento_uso
where nombre = 'codigo_fallido' and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
group by 1, 2, 3, 4 order by eventos desc;
```

```sql
-- Costo de los códigos y costo por cliente nuevo.
-- tarifa_codigo(canal, mxn_sin_iva): tabla de apoyo. SMS 0.90 [SUPUESTO, ADR-004 §1; 0.77 con recargas de 1,000+];
-- WhatsApp: sin precio publicado (PQ-30) -> null = «sin dato».
-- Conciliar cada mes contra la factura del proveedor (ext_gasto_codigos).
with envios as (
  select props->>'proposito' as proposito, props->>'canal' as canal, count(*) as envios
  from evento_uso
  where nombre = 'codigo_enviado' and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
  group by 1, 2
), costo as (
  select e.proposito, e.canal, e.envios, e.envios * t.mxn_sin_iva as mxn_sin_iva
  from envios e left join tarifa_codigo t on t.canal = e.canal
), nuevos as (
  select count(*) as clientes_nuevos_con_codigo
  from evento_uso
  where nombre = 'cliente_registrado' and (props->>'con_codigo')::boolean
    and props->>'identidad_nueva' = 'true'
    and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
)
select c.proposito, c.canal, c.envios, c.mxn_sin_iva,
       -- costo por cliente nuevo = todo el costo de envíos con propósito 'registro' (incluye abandonos y reintentos) / clientes nuevos
       case when c.proposito = 'registro'
            then c.mxn_sin_iva / nullif((select clientes_nuevos_con_codigo from nuevos), 0) end as mxn_por_cliente_nuevo
from costo c;
```

El costo por cliente nuevo total es la suma de la columna `mxn_sin_iva` con `proposito = 'registro'` entre `clientes_nuevos_con_codigo`. El estimado del ADR-003 §4 es MXN 1.00 a 1.20 con reintentos. Si algún canal no tiene tarifa, el total va «sin dato», no parcial. Un cliente que se registra de nuevo después de borrar su cuenta cuenta como identidad nueva.

```sql
-- Gatillo de R-18: códigos de registro y recuperación fallidos en los dos canales (reabrir el respaldo con ≥ 5 %).
with f as (
  select flujo_id,
         bool_or(nombre = 'codigo_enviado') as se_envio,
         bool_or(nombre = 'codigo_fallido' and props->>'motivo' = 'proveedor' and props->>'canal' = 'whatsapp') as fallo_wa,
         bool_or(nombre = 'codigo_fallido' and props->>'motivo' = 'proveedor' and props->>'canal' = 'sms')      as fallo_sms
  from evento_uso
  where flujo_id is not null and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
  group by flujo_id
  having bool_or(nombre = 'codigo_pedido')
)
select count(*) filter (where not se_envio and fallo_wa and fallo_sms)::numeric / nullif(count(*), 0) as fraccion_falla_total
from f;
```

### 6.4 MET-04 (instalación por sistema operativo)

```sql
-- Instalación (primera apertura en standalone) entre los inscritos, por SO. Meta ≥ 25 %; < 10 % en ambos: no se invierte más.
with inscritos as (
  select identidad_id, min(props->>'so') as so      -- una identidad, su SO de registro
  from evento_uso where nombre = 'cliente_registrado' and identidad_id is not null group by identidad_id
), instaladas as (
  select distinct identidad_id from evento_uso
  where nombre = 'pwa_instalada' and props->>'display_mode' = 'standalone' and identidad_id is not null
)
select i.so, count(*) as inscritos, count(x.identidad_id) as instalaron,
       count(x.identidad_id)::numeric / nullif(count(*), 0) as tasa_instalacion
from inscritos i left join instaladas x using (identidad_id)
group by i.so;
```

Límite: un cliente con varios negocios cuenta una vez; quien borra su cuenta sale de numerador y denominador.

### 6.5 MET-05 (recuperaciones) y MET-06 (transferencia en iOS), reescritas

**MET-05, definición nueva (D-031).** Recuperación = `recuperacion_completada`: se verificó el código por un teléfono que ya tenía tarjetas, sin sesión en ese navegador. **Incluye** al cliente que se registra en un segundo negocio sin sesión (`proposito = 'registro'`) y al que cambió de teléfono o borró sus datos (`proposito = 'recuperacion'`). Ya no hay recuperaciones por «por confirmar». Meta: <10 % de los inscritos.

```sql
select count(*) filter (where nombre = 'recuperacion_completada')::numeric
       / nullif(count(*) filter (where nombre = 'cliente_registrado'), 0) as recuperaciones_sobre_inscritos,
       count(*) filter (where nombre = 'recuperacion_completada' and props->>'proposito' = 'registro')     as via_segundo_negocio_sin_sesion,
       count(*) filter (where nombre = 'recuperacion_completada' and props->>'proposito' = 'recuperacion') as via_recuperar
from evento_uso
where nombre in ('recuperacion_completada','cliente_registrado')
  and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta';
```

Aviso de lectura: un segundo negocio sin sesión emite **a la vez** `cliente_registrado` (con `identidad_nueva = false`) y `recuperacion_completada`; por eso el denominador son los registros y la parte «segundo negocio sin sesión» también aparece en MET-07 y MET-09.

**MET-06, definición nueva.** Mismo propósito, dos mecanismos (PQ-31):

- **Mecanismo A (token):** identidades con `install_token_canjeado` entre las identidades con `guia_instalacion_mostrada` en iOS. Meta ≥80 %; <60 % pasa al respaldo B.
- **Mecanismo B (código al abrir la PWA):** flujos con `codigo_verificado` y `proposito = 'instalacion'` entre los flujos con `codigo_pedido` del mismo propósito. Cada intento cuesta un mensaje más.

```sql
-- A
with g as (select distinct identidad_id from evento_uso
           where nombre = 'guia_instalacion_mostrada' and props->>'so' = 'ios' and identidad_id is not null),
     c as (select distinct identidad_id from evento_uso where nombre = 'install_token_canjeado' and identidad_id is not null)
select count(*) as guias_ios, count(c.identidad_id) as canjes,
       count(c.identidad_id)::numeric / nullif(count(*), 0) as tasa_transferencia
from g left join c using (identidad_id);

-- B
select count(*) filter (where bool_ver)::numeric / nullif(count(*), 0) as tasa_codigo_instalacion
from (select flujo_id,
             bool_or(nombre = 'codigo_verificado') as bool_ver
      from evento_uso
      where flujo_id is not null and props->>'proposito' = 'instalacion'
        and nombre in ('codigo_pedido','codigo_verificado')
      group by flujo_id
      having bool_or(nombre = 'codigo_pedido')) x;
```

Advertencia: iOS no avisa la instalación; la guía mostrada es el denominador posible, no las instalaciones reales. Una guía mostrada a quien nunca instala baja la tasa sin que el mecanismo falle. Se reporta junto con MET-04 de iOS.

### 6.6 MET-07 (segundo negocio en la app instalada) y MET-09 (clientes con ≥2 negocios)

**MET-07, definición nueva.** Denominador: `cliente_registrado` con `identidad_nueva = false` de una identidad que **ya tenía `pwa_instalada`** antes. Numerador: seguido de `app_abierta` con `display_mode = 'standalone'` en ≤7 días. Se segmenta por `con_codigo`: con sesión (un paso, sin código) frente a sin sesión (pasó por el código; en iPhone suele ser el caso, porque el QR abre Safari y no la PWA, ADR-001 S6). Meta ≥60 %; <30 % adelanta el escaneo desde la app.

```sql
with segundo as (
  select e.identidad_id, e.ocurrido_ts, (e.props->>'con_codigo')::boolean as con_codigo
  from evento_uso e
  where e.nombre = 'cliente_registrado' and e.props->>'identidad_nueva' = 'false'
    and e.identidad_id is not null
    and e.ocurrido_ts <= now() - interval '7 days'                -- ventana cerrada
    and exists (select 1 from evento_uso p
                where p.nombre = 'pwa_instalada' and p.identidad_id = e.identidad_id and p.ocurrido_ts < e.ocurrido_ts)
), conv as (
  select s.*, exists (select 1 from evento_uso a
                      where a.nombre = 'app_abierta' and a.identidad_id = s.identidad_id
                        and a.props->>'display_mode' = 'standalone'
                        and a.ocurrido_ts > s.ocurrido_ts and a.ocurrido_ts <= s.ocurrido_ts + interval '7 days') as abrio
  from segundo s
)
select con_codigo, count(*) as segundos_negocios, count(*) filter (where abrio) as abrieron_app,
       count(*) filter (where abrio)::numeric / nullif(count(*), 0) as tasa
from conv group by rollup (con_codigo);
```

Límite: «abrió la app» puede deberse a que la usa para el primer negocio, no al segundo. Es la definición del PRD; si sale alta, se revisa con la apertura de la tarjeta del negocio nuevo.

```sql
-- MET-09: clientes con ≥ 2 negocios. Solo se mide; ≥ 20 % refuerza la decisión de una sola app.
with r as (select identidad_id, count(distinct negocio_id) as negocios
           from evento_uso where nombre = 'cliente_registrado' and identidad_id is not null group by identidad_id)
select count(*) as clientes, count(*) filter (where negocios >= 2) as con_2_o_mas,
       count(*) filter (where negocios >= 2)::numeric / nullif(count(*), 0) as fraccion
from r;
```

Se calcula con eventos (no con `cliente_negocio`) para que la consulta no cruce negocios en las tablas de dominio. Aun así es un cruce de negocios por identidad, solo en agregado y solo con el rol de servicio: el aviso de privacidad debe cubrirlo (RNF-PRI-06, PQ-18).

### 6.7 MET-08 (retirada)

**Retirada por D-031.** Ya no hay tarjetas por confirmar, ni los eventos `tarjeta_por_confirmar_creada` y `tarjeta_confirmada`. Lo que más se le parece hoy es el embudo de MET-03 (cuántos flujos terminan en tarjeta) y el abandono por etapa. No se calcula nada más.

### 6.8 MET-10, MET-11 y MET-12

```sql
-- MET-10: semanas ISO completas en que cada negocio abrió el resumen (RF-INI-05). Umbral: Por definir.
with n as (select id as negocio_id, alta_ts, zona_horaria from negocio where tanda = :'tanda'),
semanas as (
  select n.negocio_id, to_char(d, 'IYYY"-W"IW') as semana
  from n,
       generate_series(date_trunc('week', n.alta_ts at time zone n.zona_horaria)::date + 7,
                       date_trunc('week', now() at time zone n.zona_horaria)::date - 7,
                       interval '7 days') as d
), vistas as (
  select distinct negocio_id, props->>'semana' as semana
  from evento_uso where nombre = 'resumen_semanal_visto'
)
select s.negocio_id, count(*) as semanas, count(v.semana) as semanas_con_apertura,
       count(v.semana)::numeric / nullif(count(*), 0) as fraccion
from semanas s left join vistas v using (negocio_id, semana)
group by s.negocio_id;
```

El conteo parte de la semana ISO siguiente al alta y termina en la última semana completa. Abrir N0 varias veces en la misma semana cuenta una vez.

```sql
-- MET-11: rechazos al sincronizar y reaperturas del mostrador. Umbral: Por definir.
select negocio_id,
       sum((props->>'aceptados')::int)                               as aceptados,
       sum((props->>'rechazados')::int)                              as rechazados,
       sum(coalesce((props->>'descartados')::int, 0))                as descartados_baja,
       sum((props->>'rechazados')::int)::numeric
         / nullif(sum((props->>'aceptados')::int + (props->>'rechazados')::int), 0) as tasa_rechazo
from evento_uso where nombre = 'sync_completada' and ocurrido_ts >= :'desde' and ocurrido_ts < :'hasta'
group by rollup (negocio_id);

-- Motivos de lo resuelto en Por revisar
select props->>'motivo' as motivo, props->>'resolucion' as resolucion, count(*)
from evento_uso where nombre = 'por_revisar_resuelto' group by 1, 2;

-- Reaperturas del mostrador tras una caída (D-015): por negocio y semana, y contra las sincronizaciones con movimientos.
select r.negocio_id, date_trunc('week', r.ocurrido_ts) as semana,
       count(*) as reaperturas,
       percentile_cont(0.5) within group (order by (r.props->>'duracion_s')::int) as mediana_duracion_s,
       sum((r.props->>'pendientes')::int) as pendientes_totales,
       (select count(*) from evento_uso s
        where s.nombre = 'sync_completada' and s.negocio_id = r.negocio_id
          and date_trunc('week', s.ocurrido_ts) = date_trunc('week', r.ocurrido_ts)) as syncs_misma_semana
from evento_uso r
where r.nombre = 'mostrador_reabierto_tras_caida'
group by 1, 2 order by 2, 1;
```

La relación reaperturas / sincronizaciones es un indicador aproximado: no existe un evento «se cayó la red» (solo se mide la reapertura, D-015). Un `sync_completada` por cada caída con cola es lo esperado. Sirve para decidir si se reevalúa un service worker en N5 (D-015), no como porcentaje exacto.

MET-12 (horas del fundador por cliente) sale solo de `ext_horas_fundador` y `ext_pago` (sección 9):

```sql
-- Horas del fundador por cliente que paga, por canal de origen. Gate 2: un canal con ≤ 6 h por cliente.
select h.canal_origen,
       sum(h.minutos) / 60.0                                          as horas,
       count(distinct h.negocio_id) filter (where p.negocio_id is not null) as clientes_que_pagan,
       (sum(h.minutos) / 60.0) / nullif(count(distinct h.negocio_id) filter (where p.negocio_id is not null), 0) as horas_por_cliente
from ext_horas_fundador h
left join (select distinct negocio_id from ext_pago where monto_sin_iva_mxn > 0) p using (negocio_id)
group by h.canal_origen;
```

---

## 7. Consultas de Gate 1 (G1-a a G1-d)

Todas parten de **N = los negocios de `:'tanda'`**. El corte de la primera tanda está **Por definir** (PRD §2.2). Convenciones que el PRD no fijaba, **aprobadas por Aarón el 22 oct 2026 (PQ-32)** y aclaradas en [D-004](../decisiones.md):

- **Día 1** = fecha local del alta (`negocio.alta_ts` en la zona del negocio). Días 1 a 30 = `dia1` a `dia1 + 29`; día 37 = `dia1 + 36`.
- **Las 4 semanas** de G1-a = días 1-7, 8-14, 15-21 y 22-28 (los días 29 y 30 no cuentan para «sellos en ≥3 de 4 semanas»).
- **Visita** = sello o canje aceptado en el mostrador (`v_visita`: sin bienvenida ni correcciones, D-028 y D-027). **«Segunda visita sellada»** = un cliente con visitas en ≥2 días locales distintos dentro de los días 1 a 30 (aprobado por Aarón el 22 oct 2026). Por eso «≥5 segundas visitas» de G1-a son **5 clientes**, no 5 visitas sueltas.
- **«Regresa»** (G1-d) = una visita en un día local posterior al de su alta y hasta 21 días después.
- Un negocio es **evaluable** para un criterio solo cuando ya pasó la ventana de ese criterio (aprobado por Aarón el 22 oct 2026, PQ-32; PRD §2.2 v1.9). Cada criterio calcula su propia bandera `evaluable`, en la fecha local del negocio:

| Criterio | Evaluable cuando | Unidad que se evalúa |
|---|---|---|
| G1-a | hoy ≥ `dia1 + 30` (ya terminó el día 30) | negocio |
| G1-b | hoy ≥ `dia1 + 37` (ya terminó el día 37) | negocio |
| G1-c | hoy ≥ `dia1 + 14` (ya terminó el día 14) y, además, tiene denominador | negocio |
| G1-d | `dia_alta + 22 ≤ hoy` (ya terminaron los 21 días de ese inscrito) | **inscrito** (el filtro ya va por inscrito) |

- **Regla de lectura común.** Cada consulta devuelve `n_total` (todo N), `n_evaluables`, `n_no_evaluables`, el numerador y el denominador **solo sobre evaluables**, y la razón. Los no evaluables **se listan en el informe, no cuentan como «no cumple» y no entran al denominador**. Sin evaluables, la razón es `null` = «sin dato», nunca 0 %. Mientras haya no evaluables, el informe lo dice junto a la cifra (por ejemplo, «2 de 4 negocios aún no cumplen su ventana»).
- La **ventana cerrada** se cuenta en la zona horaria de cada negocio (`now() at time zone n.zona_horaria`), no en una zona fija.
- **Mínimo de 8 evaluables (aprobado por Aarón el 22 oct 2026).** El Gate 1 solo se declara (pasa o se corta) cuando el criterio medido tiene al menos 8 negocios evaluables. Con menos, el informe muestra las cifras junto a `n_evaluables` y el veredicto de ese criterio es **«sin veredicto»**: ni «pasa» ni «se corta». El corte (≤ 20 % activos, ≤ 10 % conversión, mediana de inscripción < 10 %) se evalúa solo sobre evaluables y solo con muestra suficiente. El 8 es el parámetro `min_evaluables` (valor por defecto 8); si Aarón decide otro, se cambia en la línea `\set` de abajo y en ningún otro lado.
- **Unidad del mínimo.** G1-a, G1-b y G1-c: negocios evaluables. G1-d: **negocios con al menos un inscrito evaluable** (`negocios_evaluables`), porque la unidad de cálculo es el inscrito pero el mínimo habla de negocios.
- **Cobertura de G1-c (aprobado por Aarón el 22 oct 2026).** El ≥ 70 % de negocios con denominador se mide sobre los **evaluables de G1-c** (los que ya pasaron el día 14). La cobertura sobre N se reporta también, solo como dato.

Parámetro y función de apoyo (se corren una vez por sesión de `psql`; `:'min_evaluables'` se convierte a entero donde se usa):

```sql
\set min_evaluables 8

-- Estado de un criterio. Devuelve: 'sin veredicto' | 'corte' | 'cumple' | 'no cumple'.
--   corte_incluye_igual: true para ≤ (G1-a, G1-b); false para < (G1-c). Sin corte definido (G1-d): corte = null.
create or replace function g1_estado(valor numeric, n_eval bigint, min_eval int,
                                     umbral numeric, corte numeric, corte_incluye_igual boolean)
returns text language sql immutable as $$
  select case
    when n_eval < min_eval or valor is null then 'sin veredicto'
    when corte is not null and (case when corte_incluye_igual then valor <= corte else valor < corte end) then 'corte'
    when valor >= umbral then 'cumple'
    else 'no cumple'
  end
$$;
```

### 7.1 G1-a: activos

Vista por negocio (sobre todas las tandas; se filtra `tanda` al consultar). `activo` es `null` cuando el negocio no es evaluable.

```sql
create or replace view v_g1a_negocio as
with n as (select * from v_negocio_g1),
ins as (
  select cn.negocio_id, count(*) as inscritos
  from cliente_negocio cn join n using (negocio_id)
  where (cn.alta_ts at time zone n.zona_horaria)::date between n.dia1 and n.dia1 + 29
  group by cn.negocio_id
), sem as (
  select v.negocio_id, count(distinct (v.dia_local - n.dia1) / 7) as semanas_con_sellos
  from v_visita v join n using (negocio_id)
  where v.tipo = 'sello' and v.dia_local - n.dia1 between 0 and 27
  group by v.negocio_id
), canj as (
  select v.negocio_id, count(*) as canjes
  from v_visita v join n using (negocio_id)
  where v.tipo = 'canje' and v.dia_local - n.dia1 between 0 and 29
  group by v.negocio_id
), seg as (
  select negocio_id, count(*) as segundas_visitas
  from (select v.negocio_id, v.cliente_negocio_id
        from v_visita v join n using (negocio_id)
        where v.dia_local - n.dia1 between 0 and 29
        group by v.negocio_id, v.cliente_negocio_id
        having count(distinct v.dia_local) >= 2) x
  group by negocio_id
), t as (
  select n.negocio_id, n.oficio, n.tanda, n.dia1,
         coalesce(ins.inscritos, 0)          as inscritos,
         coalesce(sem.semanas_con_sellos, 0) as semanas_con_sellos,
         coalesce(canj.canjes, 0)            as canjes,
         coalesce(seg.segundas_visitas, 0)   as segundas_visitas,
         ((now() at time zone n.zona_horaria)::date >= n.dia1 + 30) as evaluable
  from n left join ins using (negocio_id) left join sem using (negocio_id)
         left join canj using (negocio_id) left join seg using (negocio_id)
)
select t.*,
       case when evaluable
            then (inscritos >= 30 and semanas_con_sellos >= 3 and (canjes >= 1 or segundas_visitas >= 5))
            end as activo                      -- null = no evaluable todavía
from t;
```

```sql
-- Cifra G1-a por tanda (sin veredicto; el veredicto se calcula abajo y en el resumen 7.5).
create or replace view v_g1a_cifra as
select tanda,
       count(*)                                  as n_total,
       count(*) filter (where evaluable)         as n_evaluables,
       count(*) filter (where not evaluable)     as n_no_evaluables,
       count(*) filter (where activo)            as activos,
       count(*) filter (where activo)::numeric
         / nullif(count(*) filter (where evaluable), 0) as g1_a   -- null = «sin dato»
from v_g1a_negocio
group by tanda;
```

```sql
-- Detalle por negocio (los no evaluables salen en el informe con activo = null).
select * from v_g1a_negocio where tanda = :'tanda' order by oficio, negocio_id;

-- Cifra y veredicto G1-a.
select c.*,
       (c.n_evaluables >= :'min_evaluables'::int) as suficiente_muestra,
       g1_estado(c.g1_a, c.n_evaluables, :'min_evaluables'::int, 0.60, 0.20, true) as veredicto
from v_g1a_cifra c
where c.tanda = :'tanda';
-- Umbral ≥ 60 % de los evaluables. Corte: ≤ 20 %. Con n_evaluables < min_evaluables el veredicto es «sin veredicto»
-- (se muestran las cifras, pero ni pasa ni se corta). Con n_evaluables = 0 tampoco hay cifra (g1_a null).
```

```sql
-- Advertencia de bajas (D-026): inscritos que ya no están en el dominio.
with ev as (select negocio_id, count(*) as inscritos_eventos from evento_uso
            where nombre = 'cliente_registrado' group by negocio_id),
     dom as (select negocio_id, count(*) as inscritos_tabla from cliente_negocio group by negocio_id)
select n.negocio_id, coalesce(ev.inscritos_eventos, 0) as por_eventos, coalesce(dom.inscritos_tabla, 0) as por_tabla,
       coalesce(ev.inscritos_eventos, 0) - coalesce(dom.inscritos_tabla, 0) as bajas_aprox
from v_negocio_g1 n left join ev using (negocio_id) left join dom using (negocio_id)
where n.tanda = :'tanda';
```

`bajas_aprox` es aproximado: una persona que se borra y vuelve a registrarse suma dos eventos y una fila. Se reporta como advertencia, no como corrección.

### 7.2 G1-b: conversión

Solo cuenta dinero recibido (`ext_pago`, RF-COB-06). Pagó = suma de lo recibido hasta su día 37 ≥ MXN 299 sin IVA `[SUPUESTO: se suma; el PRD dice «primer mes o prepago»]` (Por definir; PQ-01 y PQ-02). Los pagos menores se reportan aparte y **no** suman al criterio hasta que se resuelva PQ-02. Un pago recibido por un negocio aún no evaluable no lo cuenta como pagador todavía: se muestra, pero el negocio sigue fuera del cálculo hasta que termine su día 37.

```sql
create or replace view v_g1b_negocio as
select n.negocio_id, n.oficio, n.tanda, n.dia1,
       ((now() at time zone n.zona_horaria)::date >= n.dia1 + 37) as evaluable,
       coalesce(sum(x.monto_sin_iva_mxn) filter (where x.fecha_pago <= n.dia1 + 36), 0) as recibido_a_dia_37
from v_negocio_g1 n
left join ext_pago x on x.negocio_id = n.negocio_id
group by n.negocio_id, n.oficio, n.tanda, n.dia1, n.zona_horaria;
```

```sql
create or replace view v_g1b_cifra as
select tanda,
       count(*)                                  as n_total,
       count(*) filter (where evaluable)         as n_evaluables,
       count(*) filter (where not evaluable)     as n_no_evaluables,
       count(*) filter (where evaluable and recibido_a_dia_37 >= 299) as pagan,
       count(*) filter (where evaluable and recibido_a_dia_37 > 0 and recibido_a_dia_37 < 299)
                                                 as pagan_precio_menor_de_piloto,
       count(*) filter (where evaluable and recibido_a_dia_37 >= 299)::numeric
         / nullif(count(*) filter (where evaluable), 0) as g1_b    -- null = «sin dato»
from v_g1b_negocio
group by tanda;

select c.*,
       (c.n_evaluables >= :'min_evaluables'::int) as suficiente_muestra,
       g1_estado(c.g1_b, c.n_evaluables, :'min_evaluables'::int, 0.40, 0.10, true) as veredicto
from v_g1b_cifra c
where c.tanda = :'tanda';
-- Umbral ≥ 40 % de los evaluables. Corte: ≤ 10 %. «sin veredicto» con n_evaluables < min_evaluables.
-- El veredicto de G1-b es provisional mientras PQ-01 y PQ-02 sigan Por definir (qué suma y qué precio cuenta).
-- Detalle (incluye los no evaluables, que se muestran sin contar):
--   select * from v_g1b_negocio where tanda = :'tanda' order by oficio, negocio_id;
```

### 7.3 G1-c: inscripción

Mediana por negocio de (inscritos en días 1-14 / clientes que visitaron en días 1-14, de `ext_visitas_dia`). Un negocio entra a la mediana solo si es evaluable (terminó su día 14) **y** tiene denominador. Para decidir G1-c, **≥70 % de los evaluables** deben tener denominador (base **aprobada por Aarón el 22 oct 2026**: los evaluables de G1-c, es decir, los que ya pasaron el día 14); si no, «sin dato» y el veredicto es «sin veredicto». `cobertura_sobre_n` se devuelve aparte, solo como dato. Además aplica el mínimo de `min_evaluables` evaluables. `[SUPUESTO]` qué cuenta como «tener denominador» (los 14 días con dato, un día sin visitas se registra con 0, total > 0): **Por definir, depende de PQ-41** (captura del denominador, RF-EVT-04). No se resuelve en este documento.

```sql
create or replace view v_g1c_negocio as
with n as (select * from v_negocio_g1),
ins as (select cn.negocio_id, count(*) as inscritos
        from cliente_negocio cn join n using (negocio_id)
        where (cn.alta_ts at time zone n.zona_horaria)::date between n.dia1 and n.dia1 + 13
        group by cn.negocio_id),
den as (select n.negocio_id, sum(v.clientes_visitaron) as visitaron, count(distinct v.fecha) as dias_con_dato
        from n join ext_visitas_dia v on v.negocio_id = n.negocio_id and v.fecha between n.dia1 and n.dia1 + 13
        group by n.negocio_id)
select n.negocio_id, n.oficio, n.tanda, n.dia1,
       ((now() at time zone n.zona_horaria)::date >= n.dia1 + 14) as evaluable,
       coalesce(ins.inscritos, 0) as inscritos, den.visitaron, den.dias_con_dato,
       coalesce(den.dias_con_dato = 14 and den.visitaron > 0, false) as tiene_denominador   -- [SUPUESTO] PQ-41
from n left join ins using (negocio_id) left join den using (negocio_id);
```

```sql
create or replace view v_g1c_cifra as
with c as (
  select tanda,
         count(*)                                                   as n_total,
         count(*) filter (where evaluable)                          as n_evaluables,
         count(*) filter (where not evaluable)                      as n_no_evaluables,
         count(*) filter (where evaluable and tiene_denominador)    as n_con_denominador,
         count(*) filter (where tiene_denominador)::numeric / nullif(count(*), 0) as cobertura_sobre_n,
         count(*) filter (where evaluable and tiene_denominador)::numeric
           / nullif(count(*) filter (where evaluable), 0)           as cobertura_sobre_evaluables
  from v_g1c_negocio
  group by tanda
)
select c.*,
       case when c.cobertura_sobre_evaluables >= 0.7
            then (select percentile_cont(0.5) within group (order by b.inscritos::numeric / b.visitaron)
                  from v_g1c_negocio b
                  where b.tanda = c.tanda and b.evaluable and b.tiene_denominador)
            end as g1_c_mediana     -- null = «sin dato» (sin evaluables, o cobertura sobre evaluables < 70 %)
from c;

select c.*,
       (c.n_evaluables >= :'min_evaluables'::int) as suficiente_muestra,
       g1_estado(c.g1_c_mediana, c.n_evaluables, :'min_evaluables'::int, 0.30, 0.10, false) as veredicto
from v_g1c_cifra c
where c.tanda = :'tanda';
-- Umbral ≥ 30 %. Corte: mediana < 10 % (estricto). «sin veredicto» si n_evaluables < min_evaluables o si la cobertura
-- sobre evaluables es < 70 %. Una razón > 1 indica un conteo de visitas incompleto: se marca en el informe.
-- Los negocios no evaluables o sin denominador se listan con select * from v_g1c_negocio, sin contar como «no cumple».
```

### 7.4 G1-d: retorno

Inscritos en días 1 a 16 que regresan en ≤21 días. **Cifra principal: global por cliente** (todos los inscritos evaluables de N juntos) (aprobado por Aarón el 22 oct 2026, PQ-32). La mediana por negocio, el desglose por oficio y por semana de alta se reportan aparte como lectura complementaria. Aquí la unidad evaluable es el **inscrito**: entra solo si su ventana de 21 días ya terminó (`dia_alta + 22 ≤ hoy`, en la zona del negocio). Los inscritos con ventana abierta se cuentan en `inscritos_no_evaluables` y no entran al denominador ni cuentan como «no regresó». Un negocio sin inscritos evaluables no pesa en la cifra.

```sql
create or replace view v_g1d_inscrito as
with n as (select * from v_negocio_g1),
insc as (
  select cn.id as cliente_negocio_id, cn.negocio_id, n.oficio, n.tanda, n.dia1, n.zona_horaria,
         (cn.alta_ts at time zone n.zona_horaria)::date as dia_alta
  from cliente_negocio cn join n on n.negocio_id = cn.negocio_id
  where (cn.alta_ts at time zone n.zona_horaria)::date between n.dia1 and n.dia1 + 15
)
select i.cliente_negocio_id, i.negocio_id, i.oficio, i.tanda, i.dia_alta,
       ((i.dia_alta - i.dia1) / 7) + 1 as semana_alta,
       (i.dia_alta + 22 <= (now() at time zone i.zona_horaria)::date) as evaluable,
       exists (select 1 from v_visita v
               where v.cliente_negocio_id = i.cliente_negocio_id
                 and v.dia_local > i.dia_alta and v.dia_local <= i.dia_alta + 21) as regreso
from insc i;
```

```sql
-- Cifra global y lectura complementaria por oficio y por semana de alta.
-- El veredicto solo se calcula en la fila 'global'; las demás filas son lectura complementaria (veredicto null).
select case grouping(oficio, semana_alta) when 3 then 'global' when 1 then 'oficio' else 'semana_alta' end as corte,
       oficio, semana_alta,
       (select count(*) from v_negocio_g1 where tanda = :'tanda') as n_negocios_total,
       count(distinct negocio_id) filter (where evaluable) as negocios_evaluables,
       count(*)                                          as inscritos_total,
       count(*) filter (where evaluable)                 as inscritos_evaluables,
       count(*) filter (where not evaluable)             as inscritos_no_evaluables,
       count(*) filter (where evaluable and regreso)     as regresaron,
       count(*) filter (where evaluable and regreso)::numeric
         / nullif(count(*) filter (where evaluable), 0)  as g1_d,     -- null = «sin dato»
       (grouping(oficio, semana_alta) = 3
          and count(distinct negocio_id) filter (where evaluable) >= :'min_evaluables'::int) as suficiente_muestra,
       case when grouping(oficio, semana_alta) = 3
            then g1_estado(count(*) filter (where evaluable and regreso)::numeric
                             / nullif(count(*) filter (where evaluable), 0),
                           count(distinct negocio_id) filter (where evaluable),
                           :'min_evaluables'::int, 0.25, null, true)
            end as veredicto
from v_g1d_inscrito
where tanda = :'tanda'
group by grouping sets ((), (oficio), (semana_alta));   -- () = cifra global; la semana 3 solo cubre los días 15 y 16
-- Umbral ≥ 25 % (fila 'global'). Corte: no definido para G1-d en el PRD, así que el veredicto es cumple, no cumple o sin veredicto.

-- Lectura complementaria: mediana por negocio (solo negocios con inscritos evaluables).
select percentile_cont(0.5) within group (order by tasa) as mediana_por_negocio, count(*) as negocios_con_evaluables
from (select negocio_id,
             count(*) filter (where regreso)::numeric / count(*) as tasa
      from v_g1d_inscrito where tanda = :'tanda' and evaluable
      group by negocio_id) x;
```

#### Vista para el resumen de G1-d

```sql
create or replace view v_g1d_cifra as
select tanda,
       count(distinct negocio_id) filter (where evaluable) as n_evaluables,   -- negocios con ≥1 inscrito evaluable
       count(*) filter (where evaluable)                   as inscritos_evaluables,
       count(*) filter (where evaluable and regreso)::numeric
         / nullif(count(*) filter (where evaluable), 0)    as g1_d
from v_g1d_inscrito
group by tanda;
```

Advertencia fija para el informe: las bajas de D-026 reducen numerador y denominador del dominio (7.1); con ~200 clientes por negocio y 10 a 14 negocios es dirección, no significancia.

### 7.5 Resumen del Gate 1 (cuatro criterios, veredicto)

Junta los cuatro criterios, cuenta cuántos cumplen y devuelve el veredicto global. Muestra `n_evaluables` por criterio para que nadie lea una cifra sin su muestra.

Reglas del veredicto (**aprobadas por Aarón el 22 oct 2026**). Cada criterio se calcula sobre sus propios negocios evaluables y solo da veredicto con `n_evaluables` ≥ `min_evaluables`:

1. **«pasa»**: 3 criterios con veredicto cumplen su umbral, aunque el cuarto esté «sin veredicto».
2. **«se corta»**: cualquier criterio con veredicto llega a su corte (G1-a ≤ 20 %, G1-b ≤ 10 %, G1-c mediana < 10 %), aunque los demás estén «sin veredicto». Un corte nunca se declara con `n_evaluables` < `min_evaluables`.
3. **«sin veredicto»**: cualquier otro caso (por ejemplo, 2 cumplen y 2 sin veredicto, o los cuatro con veredicto y menos de 3 cumplen sin corte).

Si hubiera a la vez 3 criterios que cumplen y 1 en corte, la consulta da «se corta» porque evalúa el corte primero. Ver Dudas.

```sql
with a as (select 'G1-a' as criterio, 1 as orden, n_evaluables, g1_a as valor,
                  g1_estado(g1_a, n_evaluables, :'min_evaluables'::int, 0.60, 0.20, true)  as estado
           from v_g1a_cifra where tanda = :'tanda'),
     b as (select 'G1-b', 2, n_evaluables, g1_b,
                  g1_estado(g1_b, n_evaluables, :'min_evaluables'::int, 0.40, 0.10, true)
           from v_g1b_cifra where tanda = :'tanda'),
     c as (select 'G1-c', 3, n_evaluables, g1_c_mediana,
                  g1_estado(g1_c_mediana, n_evaluables, :'min_evaluables'::int, 0.30, 0.10, false)
           from v_g1c_cifra where tanda = :'tanda'),
     d as (select 'G1-d', 4, n_evaluables, g1_d,
                  g1_estado(g1_d, n_evaluables, :'min_evaluables'::int, 0.25, null, true)
           from v_g1d_cifra where tanda = :'tanda'),
     u as (select * from a union all select * from b union all select * from c union all select * from d),
     r as (select count(*) filter (where estado = 'cumple')        as cumplen,
                  count(*) filter (where estado = 'corte')         as en_corte,
                  count(*) filter (where estado = 'sin veredicto') as sin_veredicto
           from u)
-- Una fila por criterio, con su muestra y su estado; el veredicto global se repite en cada fila.
select u.criterio, u.n_evaluables, (u.n_evaluables >= :'min_evaluables'::int) as suficiente_muestra,
       u.valor, u.estado,
       r.cumplen, r.en_corte, r.sin_veredicto,
       case when r.en_corte > 0 then 'se corta'
            when r.cumplen >= 3 then 'pasa'
            else 'sin veredicto'
       end as veredicto_gate_1
from u cross join r
order by u.orden;
```

Nota de uso: es una sola consulta (se puede guardar como vista `v_g1_resumen` por `tanda` cuando exista la base). Un criterio con corte y otro sin muestra da «se corta»; uno con pase de 3 criterios y otro sin muestra da «pasa». G1-b y el denominador de G1-c (PQ-41) siguen **Por definir**: mientras no se cierren PQ-01, PQ-02 y PQ-41, el veredicto global es **provisional** y así se rotula en `docs/fase-8/gate-1.md`.

### 7.6 Revisión a mano con casos de prueba

#### Escenario 1: cuatro negocios (menos de 8 evaluables, debe dar «sin veredicto»)

No hay base de datos para correr las consultas. Se revisaron a mano con cuatro negocios de una misma tanda (escenario 1) y la fecha de hoy fijada en **1 dic 2026** (zona `America/Mexico_City`; para reproducirlo en un entorno de pruebas se sustituye `now()` por `'2026-12-01 12:00-06'::timestamptz`). Cuando exista la base, estas tablas son la prueba de aceptación de la sección 7. Todos los escenarios usan `min_evaluables` = 8.

| Negocio | Oficio | `dia1` | Hoy es el día | Evaluable a-b-c |
|---|---|---|---|---|
| A | barbería | 1 oct | 62 | sí, sí, sí |
| B | estética | 5 oct | 58 | sí, sí, sí |
| C | tapiocas | 20 nov | 12 | no, no, no |
| D | cafetería | 10 nov | 22 | no, no, sí |

**Datos de entrada**

| Negocio | G1-a (días 1-30) | G1-b (`ext_pago`) | G1-c (días 1-14) | G1-d (inscritos días 1-16) |
|---|---|---|---|---|
| A | 32 inscritos; sellos en las 4 semanas; 1 canje | 299 el 5 nov (día 36) | 20 inscritos; 50 visitaron; 14 días con dato | 10 inscritos; 4 regresan |
| B | 25 inscritos; sellos en 2 semanas; 0 canjes; 3 clientes con ≥2 días | 150 el 8 nov | 6 inscritos; 40 visitaron; 14 días con dato | 10 inscritos; 1 regresa |
| C | 10 inscritos; sellos en 1 semana | 299 el 25 nov (día 6) | 4 inscritos; sin captura de visitas | 4 inscritos (altas del 20 al 25 nov) |
| D | 8 inscritos; sellos en 1 semana | sin pagos | 6 inscritos; 24 visitaron; 14 días con dato | 5 inscritos el 10 nov (altas el día 1) |

**Resultados esperados**

| Criterio | A | B | C | D | Cifra esperada |
|---|---|---|---|---|---|
| G1-a `activo` | `true` (32 ≥ 30, 4 semanas, 1 canje) | `false` (25 < 30, 2 semanas, 3 < 5 segundas) | `null` (no evaluable) | `null` (no evaluable) | `n_total` 4, `n_evaluables` 2, `n_no_evaluables` 2, `activos` 1, **g1_a = 50 %** (con el conteo viejo habría salido 1 de 4 = 25 %) |
| G1-b `recibido_a_dia_37` | 299 → paga | 150 → precio menor | 299 pero no evaluable → no cuenta | 0, no evaluable | `n_total` 4, `n_evaluables` 2, `pagan` 1, `pagan_precio_menor_de_piloto` 1, **g1_b = 50 %** |
| G1-c razón | 20/50 = 40 % | 6/40 = 15 % | no evaluable, sin denominador | 6/24 = 25 % | `n_evaluables` 3, `n_con_denominador` 3, `cobertura_sobre_evaluables` 100 %, `cobertura_sobre_n` 75 %, **g1_c_mediana = 25 %** (mediana de 40, 15 y 25) |
| G1-d inscritos evaluables | 10 (el último alta el día 16: 16 oct + 22 = 7 nov ≤ 1 dic) | 10 | 0 (altas del 20 al 25 nov: +22 cae después de hoy) | 0 (10 nov + 22 = 2 dic > 1 dic) | `inscritos_total` 29, `inscritos_evaluables` 20, `inscritos_no_evaluables` 9, `regresaron` 5, **g1_d = 25 %** (global); `mediana_por_negocio` = 25 % (mediana de 40 % y 10 %), `negocios_con_evaluables` 2 |
| Sin evaluables | si `tanda` solo tuviera C y D: G1-a y G1-b dan `n_evaluables` 0 y la razón `null` («sin dato»), G1-d `null`; G1-c solo cuenta D (1 evaluable) | | | | Ninguna razón sale 0 % por falta de evaluables |

Notas de la revisión: (1) `count(distinct (dia_local - dia1) / 7)` usa división entera de enteros (días 0 a 6 = semana 0); (2) `group by` de `v_g1b_negocio` incluye `zona_horaria` porque se usa en `evaluable`; (3) en G1-d la columna `corte` usa `grouping(oficio, semana_alta)`: 3 = global, 1 = por oficio, 2 = por semana; (4) en G1-c, G1-a y G1-b el umbral y el corte se aplican a la cifra sobre evaluables, no sobre N, y solo con `n_evaluables` ≥ `min_evaluables`.

**Veredictos del escenario 1 (`min_evaluables` = 8).** Evaluables por criterio: G1-a 2, G1-b 2, G1-c 3, G1-d 2 negocios (A y B). Los cuatro quedan por debajo de 8, así que:

| Criterio | `n_evaluables` | `suficiente_muestra` | Cifra | `estado` |
|---|---|---|---|---|
| G1-a | 2 | `false` | 50 % | sin veredicto |
| G1-b | 2 | `false` | 50 % | sin veredicto |
| G1-c | 3 | `false` | 25 % | sin veredicto |
| G1-d | 2 | `false` | 25 % | sin veredicto |

Resumen: `cumplen` 0, `en_corte` 0, `sin_veredicto` 4 → **`veredicto_gate_1` = «sin veredicto»**. Aunque G1-a y G1-b muestran 50 %, no se declara que pasan; y si un criterio mostrara 10 % con 2 evaluables, tampoco se declararía corte.

#### Escenario 2: 10 negocios, todos evaluables en los cuatro criterios (hoy 1 dic 2026, todos con `dia1` entre el 1 y el 20 oct)

Cada negocio tiene 10 inscritos en los días 1 a 16 y denominador completo de G1-c. Cifras de entrada y resultado:

| Variante | G1-a | G1-b | G1-c | G1-d | Cumplen | `veredicto_gate_1` |
|---|---|---|---|---|---|---|
| 2a (3 de 4 no; ningún corte) | 6 activos de 10 = 60 % → cumple (el umbral es ≥) | 4 pagan de 10 = 40 % → cumple | mediana 28 % → no cumple (≥ 10 y < 30) | 20 regresan de 100 = 20 % → no cumple | 2 | **sin veredicto** (los cuatro con veredicto, <3 cumplen, sin corte) |
| 2b (pasa) | igual: cumple | igual: cumple | mediana 32 % → cumple | 20 % → no cumple | 3 | **pasa** |
| 2c (corte) | 2 activos de 10 = 20 % → **corte** (≤ 20 %) | igual: cumple | mediana 32 % → cumple | 30 de 100 = 30 % → cumple | 3 | **se corta** (el corte se evalúa primero; ver Dudas) |
| 2d (corte en G1-c) | 6 de 10 = 60 % → cumple | 4 de 10 = 40 % → cumple | mediana 9 % → **corte** (< 10 %, estricto) | 30 % → cumple | 3 | **se corta** |

#### Escenario 2e a 2g: combinaciones con criterios «sin veredicto» (regla aprobada el 22 oct 2026)

Misma tanda de 10 negocios, pero con criterios que no llegan a 8 evaluables (por ejemplo, G1-b y G1-d con 5 evaluables porque la mitad de los negocios es reciente):

| Caso | G1-a | G1-b | G1-c | G1-d | `cumplen` / `en_corte` / `sin_veredicto` | `veredicto_gate_1` |
|---|---|---|---|---|---|---|
| 2e (3 cumplen + 1 sin veredicto) | 70 % con 10 evaluables → cumple | 50 % con 10 → cumple | mediana 35 % con 10 → cumple | 30 % con 5 evaluables → sin veredicto | 3 / 0 / 1 | **pasa** |
| 2f (1 corte + otros sin veredicto) | 15 % con 10 evaluables → **corte** | 60 % con 5 → sin veredicto | cobertura 60 % → sin veredicto | 5 evaluables → sin veredicto | 0 / 1 / 3 | **se corta** |
| 2g (2 cumplen + 2 sin veredicto) | 70 % con 10 → cumple | 50 % con 10 → cumple | cobertura 60 % → sin veredicto | 5 evaluables → sin veredicto | 2 / 0 / 2 | **sin veredicto** |

#### Escenario 3: bordes del mínimo y de la cobertura

| Caso | Datos | Resultado esperado |
|---|---|---|
| 3a: 7 evaluables en G1-a | 9 negocios, 2 con `dia1` reciente; 7 evaluables, 1 activo (14 %) | `n_evaluables` 7, `suficiente_muestra` `false`, **sin veredicto** (aunque 14 % ≤ 20 %, no se corta) |
| 3b: 8 evaluables en G1-a | igual con 8 evaluables, 1 activo (12.5 %) | `suficiente_muestra` `true`, `estado` **corte** |
| 3c: cobertura de G1-c justo en 70 % | 10 evaluables, 7 con denominador (más 2 no evaluables sin denominador) | `cobertura_sobre_evaluables` 70 %, `cobertura_sobre_n` 7/12 = 58 %, hay mediana; el veredicto depende de la mediana |
| 3d: cobertura de G1-c bajo 70 % | 10 evaluables, 6 con denominador | `cobertura_sobre_evaluables` 60 %, `g1_c_mediana` `null`, **sin veredicto** (aun con 10 evaluables) |
| 3e: G1-d con pocos negocios | 100 inscritos evaluables, pero solo 6 negocios con inscritos evaluables | `negocios_evaluables` 6 < 8, **sin veredicto** aunque haya 100 inscritos |

---

## 8. Qué falta instrumentar y revisión con `lealtab-desarrollador` antes del piloto 0

Yo no lanzo a otros agentes: este es el listado que el orquestador pasa al desarrollador y al arquitecto.

### 8.1 Pendiente de construir (no existe nada en `web/`)

| # | Qué | Quién |
|---|---|---|
| 1 | Migración de `evento_uso` (3.1), RLS sin políticas y los índices | Arquitecto y desarrollo |
| 2 | Rutas `POST /c/api/eventos` y `POST /panel/api/eventos`, con lista cerrada, esquema de `props`, idempotencia por `evento_uuid`, estampado de `negocio_id` e `identidad_id` y límite por IP | Desarrollo |
| 3 | Emisión desde servidor y hook en cada evento de la sección 4, y `flujo_id` en `envio_codigo` | Desarrollo y arquitecto |
| 4 | `negocio.alta_ts`, `tanda` y `version_producto` escritos por el servidor al terminar N4 (PRD §8) y copiados al evento `negocio_alta_completada` | Desarrollo |
| 5 | La función de borrado de cuenta (D-026) con el `update evento_uso set flujo_id = null` de 3.3 | Arquitecto y desarrollo |
| 6 | Cronómetros del navegador: `duracion_s` (N1 a N4), `duracion_ms` (N5), `offline_since` (N5) | Desarrollo |
| 7 | Tabla `tarifa_codigo` y las tablas `ext_*` (sección 9) | Analista (migración propuesta) y desarrollo |
| 8 | Quitar del código `tarjeta_por_confirmar_creada` y `tarjeta_confirmada` si ya existían | Desarrollo |

### 8.2 Contrato de eventos (consulta de revisión, se corre en el entorno de pruebas)

```sql
-- 1) Propiedades obligatorias presentes.
with contrato(nombre, clave) as (values
  ('negocio_alta_completada','oficio'), ('negocio_alta_completada','tanda'),
  ('negocio_alta_completada','version_producto'), ('negocio_alta_completada','duracion_s'),
  ('resumen_semanal_visto','semana'),
  ('cliente_registrado','bienvenida'), ('cliente_registrado','identidad_nueva'),
  ('cliente_registrado','con_codigo'), ('cliente_registrado','so'),
  ('sello_registrado','modo'), ('sello_registrado','origen'),
  ('sello_bloqueado','motivo'), ('canje_registrado','modo'),
  ('sync_completada','aceptados'), ('sync_completada','rechazados'), ('sync_completada','descartados'),
  ('export_csv','archivo'), ('sellos_corregidos','delta'), ('sellos_corregidos','motivo'),
  ('sellos_corregidos','completa_tarjeta'), ('cuenta_cliente_borrada','negocios'),
  ('mostrador_reabierto_tras_caida','duracion_s'), ('mostrador_reabierto_tras_caida','pendientes'),
  ('registro_iniciado','con_sesion'), ('registro_iniciado','so'),
  ('codigo_pedido','proposito'), ('codigo_enviado','canal'), ('codigo_enviado','razon_canal'),
  ('codigo_enviado','proposito'), ('codigo_verificado','proposito'), ('codigo_verificado','canal'),
  ('codigo_fallido','fase'), ('codigo_fallido','motivo'), ('codigo_fallido','proposito'),
  ('pwa_instalada','so'), ('pwa_instalada','display_mode'), ('guia_instalacion_mostrada','so'),
  ('app_abierta','display_mode'), ('recuperacion_completada','proposito'))
select c.nombre, c.clave, count(*) as total, count(*) filter (where not (e.props ? c.clave)) as sin_clave
from contrato c join evento_uso e on e.nombre = c.nombre
group by c.nombre, c.clave
having count(*) filter (where not (e.props ? c.clave)) > 0;                  -- esperado: 0 filas

-- 2) Columnas obligatorias: negocio_id donde debe y flujo_id en los eventos de código.
select nombre, count(*) as sin_negocio from evento_uso
where nombre in ('negocio_alta_completada','resumen_semanal_visto','sello_registrado','canje_registrado',
                 'sync_completada','export_csv','sellos_corregidos','mostrador_reabierto_tras_caida','cliente_registrado')
  and negocio_id is null group by nombre;                                    -- esperado: 0 filas
select nombre, count(*) as sin_flujo from evento_uso
where nombre in ('registro_iniciado','codigo_pedido','codigo_reenviado','codigo_canal_cambiado','codigo_verificado')
  and flujo_id is null group by nombre;                                      -- esperado: 0 filas

-- 3) Identidad solo donde corresponde.
select nombre, count(*) from evento_uso
where identidad_id is not null
  and nombre not in ('cliente_registrado','codigo_verificado','recuperacion_completada','pwa_instalada',
                     'guia_instalacion_mostrada','install_token_canjeado','app_abierta')
group by nombre;                                                             -- esperado: 0 filas

-- 4) Privacidad: ningún teléfono, correo ni texto largo en props.
select id, nombre from evento_uso
where props::text ~ '(\+?52)?[0-9]{10}' or props::text ~ '@' or length(props::text) > 400;   -- esperado: 0 filas

-- 5) Nombres retirados o fuera de catálogo.
select nombre, count(*) from evento_uso
where nombre in ('negocio_alta','sello_otorgado','canje_confirmado','tarjeta_por_confirmar_creada','tarjeta_confirmada')
group by nombre;                                                             -- esperado: 0 filas
```

### 8.3 Pruebas funcionales de llegada (a mano, con el flujo real)

1. Registro completo en C1 con WhatsApp y con SMS (forzando el fallo): deben llegar `registro_iniciado`, `codigo_pedido`, `codigo_enviado`, `codigo_verificado` y `cliente_registrado` con el mismo `flujo_id`; con el fallo de WhatsApp, también `codigo_fallido` (`proveedor`) y `codigo_enviado` por SMS.
2. Código incorrecto cinco veces: `codigo_fallido` `incorrecto` con `intento_n` 1 a 5 y uno `bloqueado/cinco_fallos`.
3. Cuarto envío en una hora para el mismo teléfono: `codigo_fallido` `limite/telefono_hora`.
4. Alta de un negocio de prueba: `negocio_alta_completada` con `tanda` no nula, igual a la de `negocio`.
5. Mostrador sin conexión: sellar, cerrar y reabrir N5 con red: `mostrador_reabierto_tras_caida`, y después `sello_registrado` con `modo = sin_conexion` y `sync_completada`.
6. Corrección de +2 sellos: un `sellos_corregidos` sin nota ni nombre, y el evento de dominio `correccion` sin contar como visita en `v_visita`.
7. Borrado de cuenta (3.3): cero filas con la identidad y un `cuenta_cliente_borrada` sin negocio ni identidad.
8. Restablecer la contraseña y provocar el bloqueo: `contrasena_restablecida` y `acceso_bloqueado` sin correo.
9. Sin conexión en `/c/`: abrir la app no genera error de consola (la fixture `guard` de Playwright lo exige) y el evento perdido no se reintenta.
10. Cada escenario también se prueba con la sesión de un negocio distinto: nunca aparece `negocio_id` de otro.

---

## 9. Plantillas de los registros fuera de la app

Se llenan a mano o desde una hoja y se cargan con un guion de `docs/fase-8/datos/` (Fase 8; aún no existe). Formato: CSV UTF-8, fechas `AAAA-MM-DD`, montos en MXN sin IVA con punto decimal. `negocio_id` es el UUID de `negocio`.

**`visitas_dia.csv`** (RF-EVT-04, para G1-c). Una fila por negocio y día de sus días 1 a 14, **también los días con 0**.

| Columna | Valores |
|---|---|
| `negocio_id` | UUID |
| `fecha` | día local del negocio |
| `clientes_visitaron` | entero ≥ 0 (clientes distintos que pasaron ese día) |
| `fuente` | `tickets` o `conteo` |

**`pagos.csv`** (RF-COB-06, para G1-b y Gate 2). Solo dinero recibido.

| Columna | Valores |
|---|---|
| `negocio_id` | UUID |
| `fecha_pago` | día en que se recibió el dinero |
| `monto_sin_iva_mxn` | decimal |
| `metodo` | `stripe`, `mercado_pago`, `transferencia`, `efectivo` |
| `es_precio_piloto` | `si` o `no` (precio menor a 299; se reporta aparte, PQ-02) |
| `referencia` | texto corto (opcional; nunca datos de tarjeta) |

**`horas_fundador.csv`** (MET-12).

| Columna | Valores |
|---|---|
| `fecha` | día |
| `negocio_id` | UUID (vacío si no es de un negocio) |
| `minutos` | entero > 0 |
| `actividad` | `alta_asistida`, `soporte`, `cobro`, `entrevista`, `otro` |
| `canal_origen` | de dónde llegó el negocio. Lista de canales: **Por definir** (Fase 9 y 10) |

**`gasto_codigos.csv`** (conciliación del costo de MET-03).

| Columna | Valores |
|---|---|
| `fecha` | día de la recarga o del corte de la factura |
| `canal` | `whatsapp` o `sms` |
| `mensajes` | entero (según el proveedor) |
| `monto_sin_iva_mxn` | decimal |

**`recomendacion.csv`** (lectura complementaria de Gate 1: «¿lo recomendarías?»).

| Columna | Valores |
|---|---|
| `negocio_id` | UUID |
| `fecha` | día de la pregunta |
| `recomendaria` | `si` o `no` (formato de la escala: **Por definir**) |

Tablas de carga propuestas: `ext_visitas_dia`, `ext_pago`, `ext_horas_fundador`, `ext_gasto_codigos`, `ext_recomendacion`, con las mismas columnas y `negocio_id` como llave foránea. `tarifa_codigo(canal text primary key, mxn_sin_iva numeric)` guarda la tarifa vigente.

---

## 10. Cambios propuestos a otros documentos (los aprueba el coordinador y Aarón)

| Documento | Cambio propuesto |
|---|---|
| PRD §8 | Fila `evento_uso` (3.1). `envio_codigo` suma `flujo_id uuid` (para que el hook relacione el envío con el flujo del navegador) |
| PRD §2.3, MET-03 | Agregar: «Denominador: flujos con `registro_iniciado`. Se reporta la tasa total y la de sin sesión» |
| PRD §2.3, MET-05 a MET-07 | Textos de las secciones 6.5 y 6.6 de este documento |
| PRD, nota «Por alinear» de §8 | Quitar la mención de `07-entrega` §5: ya está alineado en lo de eventos |
| `docs/adr/001-modelo-pwa.md` §10 | La fila «Tarjetas `por_confirmar` que nunca se confirman» se retira (D-031) |
| PRD §12 | Cerrar la parte de eventos de PQ-18 y PQ-19; las PQ propuestas abajo |

### Texto de reemplazo para PRD RF-EVT-01 a 06 (§5.9)

> | RF-EVT-01 | **Producto** (nombres únicos para todo el proyecto; catálogo con atributos, emisor y privacidad en `docs/fase-7/medicion.md` §4): `resumen_semanal_visto` (negocio, `semana`) · `negocio_alta_completada` (oficio, fecha, **tanda**, versión del producto, `duracion_s`) · `tarjeta_configurada` · `qr_mostrador_descargado` · `cliente_registrado` (bienvenida sí/no, `identidad_nueva` sí/no, `con_codigo` sí/no, SO) · `sello_registrado` (en línea/sin conexión, origen, `duracion_ms`) · `sello_bloqueado` (motivo: límite/doble_escaneo) · `canje_registrado` (en línea/sin conexión) · `sync_completada` (aceptados, rechazados, descartados) · `por_revisar_resuelto` (resolución, motivo) · `accion_sugerida_click` (tipo) · `export_csv` (`archivo`: clientes/visitas) · `whatsapp_ayuda_click` · `activar_plan_click` | 07-entrega §5 |
>
> | RF-EVT-02 | **Instalación y sesión (ADR-001 §10):** `pwa_instalada` (SO, `display-mode: standalone`) · `guia_instalacion_mostrada` (SO) · `install_token_canjeado` · `recuperacion_completada` (`proposito`: registro/recuperación; verificar el código por un teléfono que ya tenía tarjetas, sin sesión en ese navegador) · `app_abierta` (identidad, `display-mode`). **Código de verificación (D-031):** `registro_iniciado` (C1 mostrada, `con_sesion`) · `codigo_pedido` · `codigo_enviado` (canal: whatsapp/sms; razón del canal) · `codigo_reenviado` · `codigo_canal_cambiado` · `codigo_verificado` · `codigo_fallido` (motivo: incorrecto/vencido/bloqueado/límite/proveedor). El abandono en el código no es un evento: se calcula de un `codigo_pedido` sin `codigo_verificado` tras 10 min. Los eventos de código **no llevan identidad ni teléfono** hasta verificar, y se unen por un `flujo_id` aleatorio. **Retirados por D-031:** `tarjeta_por_confirmar_creada` y `tarjeta_confirmada` | 07-entrega §5; ADR-001 §10; D-031; ADR-003; ADR-004 |
>
> | RF-EVT-03 | Ya no se usan los nombres anteriores del plan: `negocio_alta` → `negocio_alta_completada`, `sello_otorgado` → `sello_registrado`, `canje_confirmado` → `canje_registrado`. Tampoco se usan `tarjeta_por_confirmar_creada` ni `tarjeta_confirmada` (D-031) | 02-plan §4 (unificado 2026-10-21); D-031 |
>
> | RF-EVT-04 | Fuera de la app se registran los clientes que visitaron por día (tickets o conteo), los pagos (RF-COB-06), las horas del fundador y el gasto en códigos, con las plantillas de `docs/fase-7/medicion.md` §9 | 02-plan §4 |
>
> | RF-EVT-05 | **Analítica propia, sin cookies** y sin herramientas de analítica de terceros: los eventos se guardan en una tabla propia en Supabase (`evento_uso`), sin PostHog (RNF-STK-05). Ningún evento guarda teléfono (ni en claro ni con hash), nombre, correo, IP, user agent, el código tecleado ni texto libre. Solo los eventos que lo indican llevan `identidad_id`, y el borrado de cuenta (D-026) lo deja en nulo en la misma transacción. Los eventos los emite el servidor: el navegador solo los pide por una ruta propia y no fija la identidad. Antes del piloto, el aviso de privacidad debe cubrir los eventos de uso (RNF-PRI-07) y su plazo de conservación (**Por definir**, PQ-18) | D-018; D-023; D-026 |
>
> | RF-EVT-06 | **Operación y cuenta:** `mostrador_reabierto_tras_caida` (`duracion_s`, `pendientes`; D-015) · `sellos_corregidos` (`delta`, `motivo`, `completa_tarjeta`, `con_nota`; D-027) · `cuenta_cliente_borrada` (número de negocios; sin identidad, teléfono ni negocio; D-026) · `contrasena_restablecida` y `acceso_bloqueado` (sin correo ni IP; D-005 aclarado 2026-10-21). `export_csv` lleva el atributo `archivo` (clientes/visitas). Todos con nombre final | D-015; D-026; D-027; D-005 |

---

## 11. Dudas, PQ propuestas y Pendientes para otras fases

**PQ propuestas** (el coordinador asigna el ID):

| ID provisional | Pregunta | Quién |
|---|---|---|
| ~~PQ-32~~ | ~~**Convenciones de G1 que el PRD no fija**: día 1, las 4 semanas, «segunda visita sellada», «regresa» y si G1-d es global o mediana por negocio~~ **Cerrada (Aarón, 2026-10-22):** se aprueba la sección 7 con las convenciones de la aclaración de D-004 (PRD §2.2). G1-b y G1-c siguen Por definir | Aarón |
| PQ-33 | **Conservación de `evento_uso`** y del borrado: ¿se anonimizan (propuesta) o se borran los eventos con identidad? ¿Por cuánto tiempo se conservan? El aviso debe decirlo. Propuesta `[SUPUESTO]`: 13 meses, para cubrir Gate 2 y cohortes. Relacionada con PQ-04 y PQ-18 | Aarón y abogado |
| PQ-34 | **¿El borrado de cuenta limpia también `envio_codigo` y `codigo_intento` del teléfono?** Cierra el hilo `flujo_id` a teléfono (3.3), a costa de reiniciar los límites de envío de ese número | Arquitecto y abogado |
| PQ-35 | **Lista cerrada de motivos de corrección** (`sellos_corregidos.motivo`): el texto de la lista de N7 y sus códigos | Diseño de producto |
| ~~PQ-E~~ (aprobada por Aarón el 22 oct 2026) | **¿Se aprueban los atributos y el evento marcados «propuesto»?** Sin `registro_iniciado` MET-03 no tiene denominador; sin `duracion_s` y `duracion_ms`, MET-01 y MET-02 quedan «sin dato» | Coordinador |
| PQ-41 | **Captura del denominador de G1-c** (`ext_visitas_dia`, RF-EVT-04): cómo captura el dueño los clientes que visitan por día (pantalla o ajuste de N0/N8, o conteo externo), con qué frecuencia y qué pasa si falta el dato. Ver PRD §12 | Aarón, con el product designer; puede esperar a la Fase 8. También fija qué cuenta como «tener denominador» (7.3, hoy `[SUPUESTO]`). La base del 70 % ya está resuelta: evaluables de G1-c (aprobado por Aarón el 22 oct 2026) |
| PQ-43 (propuesta) | **Dos puntos que la regla del veredicto de Gate 1 (7.5, aprobada el 22 oct 2026) no precisa**: si hay 3 que cumplen y 1 en corte a la vez, la consulta da «se corta» porque evalúa el corte primero; y el mínimo de 8 de G1-c se mide en evaluables (como está) o en evaluables con denominador | Aarón y coordinador |

**Decisiones del fundador pendientes que afectan la medición:** precio especial de piloto y quién cuenta como pagador (PQ-01 y PQ-02, G1-b); captura del denominador de G1-c (PQ-41); costo real del WhatsApp por cliente nuevo, que se conocerá al usar la API (PQ-30; no se pide cotización a SMS Masivos); mecanismo del `install_token` (PQ-31, MET-06); umbrales de MET-10 y MET-11.

**Revisión con el desarrollador:** la lista de 8.1 y 8.3 está lista. No he podido verificar que existan eventos en `web/` (no era parte del brief y `web/` no se toca). La verificación real de llegada ocurre cuando exista la migración.

**Pendientes para la Fase 8:** guion de carga de los CSV en `docs/fase-8/datos/`, tablero con `dataviz`, plantillas `docs/fase-8/metricas/semana-XX.md` y `docs/fase-8/gate-1.md`, y las consultas de la sección 7 ya ejecutadas con datos reales.

**Pendientes para las Fases 9 y 10:** cohortes por semana de alta (`voltagent-research:cohort-analysis`), Gate 2 (clientes de pago, MRR, churn) y horas por canal.
