# ADR-006: Esquema de datos del MVP, RLS por rol y GRANTs explícitos

- **Estado:** **Aceptado (22 oct 2026).** Baja el modelo del PRD §8 (v2.6) a tablas, políticas y funciones. Aprobado por Aarón el 22 oct 2026, con el brief `cimientos-entorno-esquema`.
- **Fecha:** 22 oct 2026
- **Decidió:** Aarón López Sosa (fundador)
- **Autor:** `lealtab-arquitecto`
- **Desarrolla:** [`docs/fase-7/arquitectura.md`](../fase-7/arquitectura.md) §3 (esquema y migraciones), §4 (RLS y pruebas) y §3.6 (funciones `servidor.*`).
- **Restricciones vigentes:**
  - D-031 y ADR-003 §2.1 a §2.8: el cliente es un usuario de Supabase Auth con teléfono verificado; `identidad` (sin nombre) y `cliente_negocio` por negocio; sin `por_confirmar`; sin `sesion_cliente`.
  - ADR-003 §2.5 y §2.6: dueño y cliente comparten `auth.users`, con el rol en `app_metadata.rol`; RLS con dos familias de políticas.
  - D-019 y RNF-PRI-02: el teléfono es el único identificador global; el dueño nunca ve `identidad` ni `tarjeta_llave`; la vista `cliente_del_negocio` no expone `identidad_id`; la única vista que cruza negocios es Mis tarjetas.
  - D-021 y D-010: una sucursal y una cuenta por negocio. Un dueño, un negocio en el MVP (aprobado el 22 oct 2026, PRD v2.6).
  - D-026: borrar la cuenta tiene efecto inmediato, en cascada sobre la identidad.
  - D-027: `meta_ciclo` por tarjeta; cambiar la meta nunca quita avance; las correcciones son eventos inmutables.
  - D-004 (aclarado): tanda y versión del producto leídas de `config_plataforma` y guardadas en `negocio`.
  - D-015 y D-014: lo que se valida en el servidor (la tabla `evento` y el mostrador) se difiere a su feature.
  - RNF-STK-15 y ADR-005: migraciones aditivas (*expand/contract*) en `web/supabase/migrations`.
  - ADR-004: `envio_codigo` y los límites del código.
  - RNF-PWA-03: formato del `slug` y lista de slugs reservados.

## 1. Contexto

El PRD §8 (v2.6) define el modelo base. Al bajarlo a tablas aparecieron cuatro huecos que Aarón resolvió el 22 oct 2026 (PRD v2.6, aclaración de D-004 y D-031):

- **`negocio.slug`** no estaba en §8, aunque RNF-PWA-03 lo exige en la URL `/c/{slug}/`. Se agrega como columna única e inmutable.
- **Color de marca.** `negocio_publico` lo pedía en ADR-003 §2.6, pero §8 no tenía columna. Se agrega como columna nulable en `negocio`.
- **Un negocio por dueño.** Se asume en el esquema (PRD v2.6). N5 y el resto del panel no necesitan selector de negocio.
- **Tablas que §8 no lista:** `config_plataforma`, `intento_acceso_dueno` (la exige RF-ALT-02c: 5 contraseñas fallidas pausan solo la contraseña 15 min) y `cuenta_pendiente_borrado` (ADR-003 §2.7). Más la vista `mis_tarjetas`, que ADR-003 llama «las funciones».

La redacción del modelo está en `arquitectura.md` §3. Este ADR fija lo que se decidió; los detalles de columnas, índices y pruebas están en esa sección.

## 2. Decisión

### 2.1 Esquemas

| Esquema | Contenido | Exposición a la API |
|---|---|---|
| `public` | Tablas y vistas de negocio. Todas con RLS activo. | Sí, con los GRANTs explícitos de 2.4 |
| `privado` | Ayudantes de RLS (`privado.rol()`, `privado.negocios_del_dueno()`, `privado.es_dueno_de()`, `privado.mi_identidad_id()`, `privado.mis_cliente_negocio_ids()`, `privado.estado_efectivo()`). `SECURITY DEFINER`, `STABLE`, `search_path = ''` | **No expuesto.** `authenticated` tiene `USAGE` y `EXECUTE` solo sobre esta lista cerrada |
| `servidor` | Funciones `SECURITY DEFINER` de escritura: `crear_negocio`, `completar_alta`, `guardar_tarjeta_config`, `registrar_cliente`, `borrar_cuenta_cliente`, etc. (tabla de 3.6 de `arquitectura.md`) | Solo `service_role`. `REVOKE ALL … FROM PUBLIC, anon, authenticated; GRANT EXECUTE … TO service_role` |

**Matiz sobre ADR-003 §2.6 (aprobado por Aarón el 22 oct 2026).** ADR-003 dice «esquema no expuesto» para las funciones de escritura. Con `supabase-js` (en el servidor) una función solo se llama por RPC, y eso exige exponer su esquema en la API (`[api] schemas = ["public","servidor"]`; `arquitectura.md` §3.4). **Aprobado:** «expuesto» significa visible para la API REST de Supabase (PostgREST) que usa `supabase-js` desde el **servidor** de Next.js. El navegador nunca llama a Supabase (ADR-007). Solo `service_role` ejecuta las funciones de `servidor` (`REVOKE ALL … FROM PUBLIC, anon, authenticated`), y P-03, R-03 y R-27 lo prueban. Así el efecto de seguridad es el mismo que el de «no expuesto». ADR-003 §2.6 lleva una nota fechada que lo aclara. Alternativa descartada: conexión directa a Postgres desde Vercel con `pg`, que suma una credencial de ejecución y un *pooler* más.

### 2.2 Convenciones de migración

- Una migración por tema, nombre `AAAAMMDDHHMMSS_<tema>.sql` en UTC, `snake_case` sin acentos. Hacia adelante; nunca se edita después de entrar a `main` (se corrige con otra).
- Cada migración que crea una tabla trae, **en el mismo archivo**: `ENABLE ROW LEVEL SECURITY`; `REVOKE ALL … FROM anon, authenticated`; los `GRANT` que sí se quieren (a `authenticated`, por columna cuando aplique, y a `service_role`, porque `BYPASSRLS` no concede privilegios de tabla); y sus políticas. Así el resultado no depende de los privilegios por defecto del proyecto, que cambian el **30 oct 2026** (Supabase deja de exponer tablas nuevas a la API sin `GRANT` explícito; [changelog](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically)).
- Tipos: `text` con `CHECK` en lugar de `enum`. Claves `uuid` con `gen_random_uuid()`, salvo las bitácoras (`bigint generated always as identity`). Marcas de tiempo `timestamptz`.
- Nombres de dominio en español y `snake_case` (`cliente_negocio`, `evento_uso`).
- Postgres 17, igual que el proyecto alojado (`show server_version;` al crearlo) `[SUPUESTO]`.
- Funciones `SECURITY DEFINER` con `set search_path = ''`, nombres calificados (`public.tabla`, `extensions.hmac`), `REVOKE ALL … FROM PUBLIC` y `GRANT EXECUTE` solo a quien corresponde.
- Expand/contract (ADR-005 §2.5): una migración no rompe al código anterior.

### 2.3 Migraciones del feature `cimientos-entorno-esquema`

| # | Migración | Contenido |
|---|---|---|
| 1 | `extensiones_esquemas_roles` | `pgcrypto` en `extensions`; esquemas `privado` y `servidor`; `ALTER DEFAULT PRIVILEGES` que quitan `EXECUTE` a `PUBLIC`, `anon` y `authenticated` en `servidor`; `GRANT USAGE` sobre `privado` a `authenticated` |
| 2 | `plataforma_y_negocio` | `config_plataforma`, `negocio`, `dueno_negocio`, `tarjeta_config`; disparadores (slug inmutable, columnas de alta); ayudantes `privado.rol()`, `privado.negocios_del_dueno()`, `privado.es_dueno_de()`; políticas del dueño |
| 3 | `identidad_y_tarjetas` | `identidad`, `cliente_negocio`, `tarjeta_cliente`, `tarjeta_llave`; disparadores de exclusión mutua; ayudantes `privado.mi_identidad_id()` y `privado.mis_cliente_negocio_ids()`; políticas del cliente y del dueño |
| 5 | `acceso_codigos` | `install_token`, `envio_codigo`, `codigo_intento`, `intento_acceso_dueno`, `cuenta_pendiente_borrado` |
| 6 | `eventos_uso` | `evento_uso` según `docs/fase-7/medicion.md` §3.1, con claves foráneas `ON DELETE SET NULL` |
| 7 | `vistas` | `negocio_publico`, `cliente_del_negocio`, `mis_tarjetas` |
| 8 | `config_inicial` | Filas de `config_plataforma` y bucket `logos` (privado) |

**Diferidas, con su feature:**

- **Migración 4** (`sellos_y_mostrador`: `dispositivo`, `evento`, `por_revisar`, índices y disparadores de `correccion`) → `mostrador-n5`. Incluye las políticas del dueño sobre `evento`, `dispositivo` y `por_revisar`, y el canje como `evento` con `tipo = 'canje'`.
- **Migración 9** (`servidor_codigos`: `autorizar_envio_codigo` y `registrar_resultado_envio`) → `spike-auth-cliente`, porque es la lógica del hook.
- **Funciones `servidor.*`** de registro, borrado, canje, dispositivos, eventos y correcciones: cada una con su migración y su prueba de RLS, en el feature que la usa (`arquitectura.md` §3.6). No entran en cimientos.
- `seed.sql` queda vacío a propósito. Los datos de prueba los crea `scripts/seed-dev.ts` con la API de administración, no con SQL sobre `auth.users`.

Las pruebas de RLS de las tablas diferidas (R-xx de `arquitectura.md` §4.4) también se difieren.

### 2.4 Tablas

**Nuevas o ajustadas frente al PRD §8 (v2.6):**

- **`config_plataforma`** (`clave text PK`, `valor jsonb NN`, `actualizado_ts`). Sin políticas; solo `service_role`. Filas iniciales: `tanda_actual = 1`; `codigo_tope_dia = 400`; `codigo_aviso_dia = 200`; `codigo_por_telefono_hora = 3`; `codigo_por_telefono_dia = 10`; `codigo_por_ip_hora = 10`; `saldo_alerta = 300`. Son los valores aprobados el 22 oct (ADR-003 §2.8); quedan editables sin desplegar.
- **`intento_acceso_dueno`** (`correo`, `metodo` `contrasena`/`codigo`/`restablecer`, `resultado`, `ip_hash`). Solo `service_role`. Supabase no tiene bloqueo por correo; el bloqueo de 15 min para la contraseña se impone aquí.
- **`cuenta_pendiente_borrado`** (`auth_user_id PK` sin FK, `creado_ts`, `intentos`, `ultimo_error`). El cron reintenta `auth.admin.deleteUser`. También recoge usuarios con teléfono verificado y sin `identidad` tras 24 h (PQ-38). Solo `service_role`.
- **Vista `mis_tarjetas`** (ver 2.7).

**`negocio`** (PRD §8, v2.6):

| Columna | Restricción |
|---|---|
| `id` | `uuid PK` |
| `slug` | `text NN unique`, `^[a-z0-9]+(-[a-z0-9]+)*$`, de 3 a 40 caracteres, fuera de la lista reservada (`recuperar`, `cuenta`, `privacidad`, `registro`, `api`, `logo`, `iconos`, `offline`, `panel`, `c`, `admin`). **Inmutable** por disparador |
| `nombre` | `text NN`, de 1 a 80 |
| `giro` | `text NN`: `barberia`, `estetica`, `tapioca`, `cafeteria`, `otro` (RF-ALT-05) |
| `ciudad` | `text NN`, de 1 a 80 |
| `zona_horaria` | `text NN default 'America/Mexico_City'`, una de las 12 zonas de México (lista **Por definir**, PQ-22 a) |
| `logo_path` | `text` nulo, ruta en el bucket privado `logos`: `{negocio_id}/logo.<ext>` |
| `color` | `text` nulo: color de marca en hex de 6 dígitos, `CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$')`, por ejemplo `#0F5132`. Nulo hasta que N2 o N3 lo capturen. Lo expone `negocio_publico`. El formato es el recomendado y queda así salvo que Aarón lo cambie (22 oct 2026) |
| `plan` | `text NN default 'inicio'`: `inicio`, `negocio`, `pro` (solo `inicio` se usa) |
| `estado` | `text NN default 'prueba'`: `prueba`, `activo`, `pausa` |
| `whatsapp` | `text NN`, E.164 mexicano `^\+52\d{10}$`; es el del negocio, no una `identidad` |
| `correo_dueno` | `text NN`, minúsculas. Correo de contacto; ver PQ-N6 en Por definir |
| `creado_ts` | `timestamptz NN default now()` |
| `alta_ts`, `fin_prueba`, `tanda`, `version_producto` | Nulos hasta terminar N4. Los escribe **solo** `servidor.completar_alta`: `alta_ts = now()`, `fin_prueba = alta_ts + 30 días` (D-004), `tanda` leída de `config_plataforma` en la misma transacción, `version_producto` de `package.json`. `CHECK` de que los cuatro son nulos o los cuatro tienen valor; una vez escritos no cambian |

Índices: `slug` (único), `(estado)`, `(tanda, alta_ts)`.

Con esto se **cierra «Por conciliar»** del PRD §8: la tanda y la versión viven en `negocio` y son la fuente de verdad del Gate 1; el evento `negocio_alta_completada` solo las repite.

**`dueno_negocio`**: `user_id NN FK auth.users ON DELETE CASCADE`, `negocio_id NN FK negocio ON DELETE CASCADE`, `creado_ts`, `PK (negocio_id, user_id)` y **`UNIQUE (user_id)`**: un dueño, un negocio (PRD v2.6). Disparador de exclusión mutua con `identidad` (2.6).

**`tarjeta_config`**: `negocio_id PK FK negocio ON DELETE CASCADE`; `sellos_meta smallint NN default 8` entre 4 y 12 `[SUPUESTO: el valor por defecto viene de los ejemplos del diseño]`; `recompensa text NN` (de 1 a 80); `sello_bienvenida boolean NN default true`; `limite_modo` (`por_dia`, `cada_x_horas`, `sin_limite`); `limite_minutos integer` entre 1 y 1,440; `CHECK ((limite_modo = 'cada_x_horas') = (limite_minutos IS NOT NULL))`; `actualizado_ts`. El límite efectivo es `max(limite_minutos, 2)` (D-014). Escribe solo por `servidor.guardar_tarjeta_config`, porque cambiar `sellos_meta` recalcula `meta_ciclo` (D-027).

**`identidad`** (ADR-003 §2.1): `id uuid PK`, `whatsapp text NN unique` (E.164), `auth_user_id uuid NN unique FK auth.users ON DELETE CASCADE`, `verificado_ts NN`, `creada_ts NN default now()`. **Sin nombre** (D-019). Supabase guarda el teléfono sin el `+`; la comparación normaliza (`src/lib/auth/telefono.ts`, con prueba).

**`cliente_negocio`**: `id uuid PK`, `identidad_id FK identidad ON DELETE CASCADE`, `negocio_id FK negocio ON DELETE CASCADE`, `nombre text NN` (de 1 a 60), `acepto_aviso_ts NN`, `alta_ts NN default now()`, `UNIQUE (identidad_id, negocio_id)`, índice `(negocio_id, alta_ts)`. **Sin `estado`** (D-031).

**`tarjeta_cliente`**: `id uuid PK`, `cliente_negocio_id NN unique FK cliente_negocio ON DELETE CASCADE` (una tarjeta por cliente y negocio, RF-TAR-01), `negocio_id NN FK negocio` (copia para RLS), `sellos smallint NN default 0` (≥ 0), `meta_ciclo smallint NN` entre 4 y 12 (D-027), `creada_ts`, `ultima_visita_ts`, `ultimo_sello_ts`. `sellos` es un resultado calculado por el servidor, no un dato que alguien edite. Índice `(negocio_id)`.

**`tarjeta_llave`**: `tarjeta_id PK FK tarjeta_cliente ON DELETE CASCADE`, `llave_hmac bytea NN` (32 bytes de `extensions.gen_random_bytes`), `creada_ts`. Es **otra tabla** porque dueño y cliente son `authenticated` y no se separan con permisos de columna (ADR-003 §2.6).

**`install_token`** (migración 5): `id uuid PK`, `token_hash bytea NN unique` (SHA-256; nunca el token), `identidad_id FK identidad ON DELETE CASCADE`, `creado_ts`, `vence_ts NN` (creado + 24 h), `usado_ts`. **Campos Por definir** (PQ-31, SP-2).

**`envio_codigo`** (migración 5; ADR-003 §2.8, ADR-004): `id bigint identity PK`, `creado_ts NN`, `hook_ts`, `telefono text NN` (E.164), `proposito` (`registro`, `recuperacion`, `install`), `canal_intencion` (`auto`, `sms`), `canal` (`whatsapp`, `sms`), `resultado` (`solicitado`, `enviado`, `enviado_por_respaldo`, `fallido`, `rechazado_limite`), `motivo_rechazo`, `flujo_id uuid`, `request_id text`, `ip_hash bytea` (HMAC-SHA256 de la IP con `IP_HASH_PEPPER`). Índices `(telefono, creado_ts)`, `(ip_hash, creado_ts)`, `(creado_ts)`, `(flujo_id)`. Se conserva 30 días `[SUPUESTO]` (PQ-N7).

**`codigo_intento`** (migración 5): `id bigint identity PK`, `telefono NN`, `creado_ts NN`, `resultado` (`incorrecto`, `correcto`, `vencido`, `bloqueado`), `flujo_id`. Índice `(telefono, creado_ts desc)`. Cuenta los 5 intentos y el bloqueo de 15 min.

**`evento_uso`** (migración 6): según `medicion.md` §3.1, con dos precisiones: `negocio_id` e `identidad_id` son `ON DELETE SET NULL`, y `props` cumple `CHECK (jsonb_typeof(props) = 'object' AND pg_column_size(props) < 2048)`. Sin políticas; `REVOKE ALL FROM anon, authenticated`. La lista cerrada de nombres vive en `src/lib/eventos.ts` (feature `alta-negocio`).

**Borrado de la cuenta (D-026) y `evento_uso`.** Dentro de `servidor.borrar_cuenta_cliente`, antes de borrar la `identidad`: `update evento_uso set flujo_id = null where identidad_id = :id`; al borrarla, `ON DELETE SET NULL` deja `identidad_id` en nulo; y se inserta `cuenta_cliente_borrada` sin `negocio_id` ni `identidad_id`. La prueba P-09 cuenta las filas con `identidad_id` o `flujo_id` no nulos tras el borrado y debe dar 0.

### 2.5 Exclusión mutua identidad y dueño

Un mismo `auth.users.id` no puede estar en `identidad` y en `dueno_negocio` (ADR-003 §2.5). Disparadores `CONSTRAINT TRIGGER … DEFERRABLE` sobre `identidad` y `dueno_negocio` que rechazan la inserción si el usuario ya está en la otra tabla. Además, `servidor.crear_negocio` y `servidor.registrar_cliente` se niegan antes de escribir. Prueba R-15 y pgTAP.

### 2.6 RLS: dos familias de políticas

- Todas las tablas con RLS activo; sin `FORCE`.
- Todas las políticas son `to authenticated` y pertenecen a una de dos familias: **dueño** o **cliente**. Cada una exige, en la misma condición, el rol en `app_metadata` **y** la pertenencia por filas. No se usan políticas restrictivas globales, porque se aplicarían también a la otra familia en tablas que ven las dos (ADR-003 §2.6).
- Cada política usa `(select auth.uid())` y `(select privado.rol())`; hay índices en `dueno_negocio(user_id)` e `identidad(auth_user_id)` (únicos).
- El rol no es la barrera principal. Cualquiera con la llave pública puede crear un usuario en Supabase. Un usuario sin fila en `dueno_negocio` o en `identidad` no ve nada, tenga el claim que tenga.
- Una sesión sin claim de rol (la primera, justo después de `verifyOtp`) no ve nada hasta que el servidor escribe el rol y refresca la sesión (ADR-003 §2.5).
- Las políticas del dueño **no dependen de `negocio.estado`**: con la cuenta en pausa sigue leyendo clientes y eventos para exportar (RF-COB-03, RF-CLI-06).

Ejemplo ilustrativo de la familia de cada rol (la migración lo define y lo revisa `security-review`):

```sql
-- Dueño: membresía por filas y claim, en la misma política.
create policy dueno_lee on tarjeta_cliente to authenticated
  using (
    (select privado.rol()) = 'dueno'
    and negocio_id in (select privado.negocios_del_dueno())
  );

-- Cliente: pertenencia por identidad y claim.
create policy cliente_lee_suyas on tarjeta_cliente to authenticated
  using (
    (select privado.rol()) = 'cliente'
    and cliente_negocio_id in (select privado.mis_cliente_negocio_ids())
  );
```

**Matriz de acceso** (resumen de `arquitectura.md` §4.2 para las tablas de cimientos; `R` lectura, `E` escritura, `—` sin acceso; «Servicio» es `service_role`, que ignora la RLS):

| Tabla o vista | `anon` | Cliente | Dueño | Servicio |
|---|---|---|---|---|
| `config_plataforma` | — | — | — | R E |
| `negocio` | — | — | R de su negocio. E solo en `nombre`, `giro`, `ciudad`, `zona_horaria`, `logo_path`, `whatsapp`, `correo_dueno` (GRANT por columna) | R E |
| `dueno_negocio` | — | — | R de su propia fila | R E |
| `tarjeta_config` | — | — | R de su negocio; escribe por `servidor` | R E |
| `identidad` | — | R de su fila | — | R E |
| `cliente_negocio` | — | R de sus filas | — (usa `cliente_del_negocio`) | R E |
| `tarjeta_cliente` | — | R de las suyas | R de su negocio, sin la llave | R E |
| `tarjeta_llave` | — | R de la suya | — (el mostrador la recibe por endpoint, PQ-42) | R E |
| `install_token`, `envio_codigo`, `codigo_intento`, `intento_acceso_dueno`, `cuenta_pendiente_borrado`, `evento_uso` | — | — | — | R E |
| `negocio_publico` (vista) | R | R | R | R |
| `cliente_del_negocio` (vista) | — | 0 filas | R de su negocio | R |
| `mis_tarjetas` (vista) | — | R de las suyas | 0 filas | R |
| Funciones `servidor.*` | — | — | — | Ejecuta |
| Ayudantes `privado.*` | — | Ejecuta | Ejecuta | Ejecuta |

Sin `anon` en ninguna tabla salvo la vista `negocio_publico`.

### 2.7 Vistas

Las tres vistas se crean **sin** `security_invoker` (con los privilegios del propietario, que ignora la RLS de las tablas base) y **filtran dentro de la propia vista**. Son la excepción documentada del asesor de seguridad de Supabase, cubierta por pruebas (P-05).

| Vista | Columnas | Filtro | Acceso |
|---|---|---|---|
| `negocio_publico` | `slug`, `nombre`, `logo_path`, `color`, `sellos_meta`, `recompensa`, `sello_bienvenida`, `limite_modo`, `limite_minutos` | `alta_ts` no nulo y estado efectivo `prueba` o `activo` (una `fin_prueba` vencida cuenta como pausa) | `SELECT` a `anon` y `authenticated` |
| `cliente_del_negocio` | `id` (de `cliente_negocio`), `negocio_id`, `nombre`, `whatsapp`, `alta_ts` | `privado.rol() = 'dueno'` y `negocio_id` en `privado.negocios_del_dueno()`. **No expone `identidad_id`** (RNF-PRI-02) | `SELECT` a `authenticated`; sin `anon` |
| `mis_tarjetas` | `tarjeta_id`, `slug`, `negocio_nombre`, `logo_path`, `estado_negocio`, `sellos`, `meta_ciclo`, `ultima_visita_ts`, `recompensa`, `limite_modo`, `limite_minutos`, `cliente_nombre`, `acepto_aviso_ts`, `alta_ts` | `privado.rol() = 'cliente'` y la fila pertenece a `auth.uid()`. Incluye negocios en pausa (la tarjeta no desaparece) | `SELECT` a `authenticated`; sin `anon` |

`negocio_publico` es lo único que `anon` lee. Incluye `sello_bienvenida` porque C1 lo necesita.

### 2.8 Ayudantes `privado.*` y GRANTs explícitos

- `privado.rol()`: `coalesce(auth.jwt() -> 'app_metadata' ->> 'rol', '')`, invoker.
- `privado.negocios_del_dueno()`: `setof uuid` con los `negocio_id` de `dueno_negocio` donde `user_id = auth.uid()`.
- `privado.es_dueno_de(uuid)`, `privado.mi_identidad_id()`, `privado.mis_cliente_negocio_ids()`, `privado.estado_efectivo(negocio)` (la persistencia del `estado` vencido la hace el cron; RF-COB-03).
- `authenticated` tiene `EXECUTE` sobre esa lista cerrada y nada más de `privado` (P-03).
- GRANTs por columna: la única escritura directa del dueño es `update (nombre, giro, ciudad, zona_horaria, logo_path, whatsapp, correo_dueno) on public.negocio to authenticated`. Todo lo demás pasa por `servidor.*`.
- Ningún rol nuevo: `anon`, `authenticated`, `service_role` (los de Supabase) y `supabase_auth_admin` solo si se adopta el *custom access token hook* (SP-5).

### 2.9 Pruebas

- **Estructurales (pgTAP, `supabase/tests/`, `pnpm test:db`):** P-01 a P-10 de `arquitectura.md` §4.3. Incluyen: RLS activo en toda tabla de `public`; `anon` sin privilegios salvo `negocio_publico`; ninguna función ejecutable por `PUBLIC` o `anon`; `search_path` fijado en toda `SECURITY DEFINER`; las tres vistas son las únicas *definer* y ninguna expone `identidad_id`; `CHECK` de la meta, el límite, el teléfono, el `slug` y la inmutabilidad de las correcciones.
- **REST directa (`tests/rls/`, `pnpm test:rls`):** llamadas con `fetch` a `${SUPABASE_URL}/rest/v1/…`, con `apikey` publicable y `Authorization: Bearer` del usuario. **No** pasan por la app. Resultado esperado: 401 o 403 (`42501`), o lista vacía; nunca datos ajenos. Casos R-01 a R-40 de §4.4, salvo los de tablas diferidas. Entre ellos: usuario creado a mano sin filas (R-10), con claim forzado (R-11, R-12), con `user_metadata` en `dueno` (R-13), cliente que lee a otro cliente (R-20 a R-27), dueño que lee `identidad` o `tarjeta_llave` (R-32, R-33), y dueño con negocio en pausa que sigue exportando (R-38).

### 2.10 Pruebas que exigen `security-review` antes de cerrar

(1) Migraciones 2, 3, 5, 6 y 7 completas: políticas, GRANTs por columna y vistas *definer*. (2) Ayudantes `SECURITY DEFINER` y `search_path`. (3) La exclusión mutua. (4) El camino que escribe `app_metadata.rol` y la ventana de la primera sesión sin rol. (5) El riesgo aceptado de ADR-003 §2.8 (intentos por código que no cubren a quien verifica directo en Supabase). El resultado queda en `docs/fase-7/qa/cimientos-entorno-esquema.md`.

## 3. Por definir

- **Uso del color de marca (PQ-N2, parcial).** El formato (hex de 6 dígitos con `CHECK`, nulable) y la exposición en `negocio_publico` ya están decididos (22 oct 2026). **Falta:** cómo lo capturan N2 y N3 (feature `alta-negocio`) y si `theme-color` por negocio (RNF-PWA-06) lo usa; mientras tanto usa el de LealTab.
- **Lista de las 12 zonas horarias** de `negocio.zona_horaria` (PQ-22 a). La lista de referencia está en `docs/fase-7/propuestas/pq-arquitectura.md` §1, que es historial.
- **`install_token`** (PQ-31, SP-2): campos finales y mecanismo A o B. Se cierra antes de la migración 5 o se agrega después con una migración corta.
- **Retención** de `envio_codigo` y `codigo_intento` (30 días `[SUPUESTO]`) y de `install_token` vencidos (propuesta: 7 días, PQ-N7; entra al aviso con PQ-18 y PQ-33).
- **Qué pasa con `envio_codigo` y `codigo_intento` tras el borrado de la cuenta** (PQ-34), y el plazo legal de borrado y los eventos que se conservan sin datos personales (PQ-04).
- **Usuarios con teléfono verificado y sin `identidad` tras 24 h** (PQ-38): el cron los pasa a `cuenta_pendiente_borrado`. Confirmar el plazo.
- **Correo del dueño** (PQ-N6): `negocio.correo_dueno` y `auth.users.email` pueden no coincidir. Decidir antes de `ajustes-y-cuenta`.
- **Motivo de rechazo `cuenta_pausada`** (PQ-N4) y `evento.origen = 'panel'` (propuesta, el PRD lista dos): van en la migración 4 de `mostrador-n5`, no aquí.
- **Llaves HMAC para el mostrador sin conexión** (PQ-42): `tarjeta_llave` no la lee el dueño por REST. El mostrador las recibe por un endpoint de `servidor.llaves_del_negocio`. Lo resuelve ADR-008 (`mostrador-n5`).
- **Mecanismo de rol** por *custom access token hook* (SP-5): hoy se queda `app_metadata` escrito por el servidor. Si el spike lo cambia, no cambian las políticas.
- **Región de Supabase** (`us-east-1` `[SUPUESTO]`) y los datos fuera de México (PQ-18).

## 4. Consecuencias

- **Un solo sistema de autenticación.** Dueño y cliente comparten `auth.users`; el costo es separarlos bien (2.5 y 2.6) y que la seguridad dependa de políticas probadas en la API directa.
- **El esquema `servidor` queda expuesto en la API.** Solo `service_role` ejecuta sus funciones, con pruebas de R-03, R-27 y P-03. Es una lectura distinta de ADR-003 §2.6 que Aarón aprobó el 22 oct 2026 (§2.1).
- **Las migraciones son aditivas.** Las tablas diferidas se agregan en su feature sin tocar el esquema de cimientos, y cada una trae su RLS y su prueba.
- **La vista `negocio_publico` es la única superficie pública.** Su columna `color` y su filtro (fin de prueba vencido cuenta como pausa) deben quedar en pruebas R-04.
- **Un negocio por dueño.** Se relaja después con una migración (quitar `UNIQUE (user_id)`) si se decide.
- **Los sellos de la persona borrada desaparecen de los conteos** (cascada en `tarjeta_cliente` y `evento`), a menos que PQ-04 resuelva otra cosa; el cambio a `SET NULL` es una migración corta.
- **Riesgo aceptado** (ADR-003 §2.8): quien llame a Supabase directo puede probar códigos más allá de los 5 intentos del servidor. Lo cubren la RLS por membresía, la vigencia de 10 min y el límite por IP de `/verify`; pasa a `security-review`.
- **Tiempo de vida del token.** Un access token viejo vive hasta 1 hora tras cerrar sesiones; la RLS por filas lo vuelve inocuo porque la fila ya no existe o el usuario ya no es miembro.

## Fuentes

- `docs/prd/PRD-lealtab-mvp.md` v2.6 §8 y aclaraciones del 22 oct 2026.
- `docs/fase-7/arquitectura.md` §3 y §4 (22 oct 2026).
- https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically (cambio del 30 oct 2026, consultado el 22 oct 2026).
- ADR-003 (§2.1 a §2.8) y ADR-004.
