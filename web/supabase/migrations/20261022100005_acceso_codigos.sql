-- Migración 5 (ADR-006 §2.3, §2.4): tablas de acceso y códigos. Solo service_role; sin políticas.
-- Campos de install_token provisionales hasta SP-2 / PQ-31 (se ajustan con una migración corta).

create table public.install_token (
  id           uuid primary key default gen_random_uuid(),
  token_hash   bytea not null unique check (octet_length(token_hash) = 32),  -- SHA-256; nunca el token
  identidad_id uuid not null references public.identidad (id) on delete cascade,
  creado_ts    timestamptz not null default now(),
  vence_ts     timestamptz not null,
  usado_ts     timestamptz,
  constraint install_token_vigencia check (vence_ts > creado_ts)
);
create index install_token_identidad_idx on public.install_token (identidad_id);

create table public.envio_codigo (
  id              bigint generated always as identity primary key,
  creado_ts       timestamptz not null default now(),
  hook_ts         timestamptz,
  telefono        text not null check (char_length(telefono) between 8 and 20),
  proposito       text not null check (proposito in ('registro','recuperacion','install')),
  canal_intencion text not null default 'auto' check (canal_intencion in ('auto','sms')),
  canal           text check (canal in ('whatsapp','sms')),
  resultado       text not null default 'solicitado'
                    check (resultado in ('solicitado','enviado','enviado_por_respaldo','fallido','rechazado_limite')),
  motivo_rechazo  text,
  flujo_id        uuid,
  request_id      text,
  ip_hash         bytea  -- HMAC-SHA256 de la IP con IP_HASH_PEPPER; solo para el límite por IP
);
create index envio_codigo_telefono_idx on public.envio_codigo (telefono, creado_ts);
create index envio_codigo_ip_idx on public.envio_codigo (ip_hash, creado_ts);
create index envio_codigo_creado_idx on public.envio_codigo (creado_ts);
create index envio_codigo_flujo_idx on public.envio_codigo (flujo_id);

create table public.codigo_intento (
  id        bigint generated always as identity primary key,
  telefono  text not null check (char_length(telefono) between 8 and 20),
  creado_ts timestamptz not null default now(),
  resultado text not null check (resultado in ('incorrecto','correcto','vencido','bloqueado')),
  flujo_id  uuid
);
create index codigo_intento_telefono_idx on public.codigo_intento (telefono, creado_ts desc);

create table public.intento_acceso_dueno (
  id        bigint generated always as identity primary key,
  creado_ts timestamptz not null default now(),
  correo    text not null check (correo = lower(correo)),
  metodo    text not null check (metodo in ('contrasena','codigo','restablecer')),
  resultado text not null check (resultado in ('incorrecto','correcto','bloqueado')),
  ip_hash   bytea
);
create index intento_acceso_dueno_correo_idx on public.intento_acceso_dueno (correo, creado_ts desc);

-- Sin FK a auth.users: el usuario ya no tiene identidad (ADR-003 §2.7).
create table public.cuenta_pendiente_borrado (
  auth_user_id uuid primary key,
  creado_ts    timestamptz not null default now(),
  intentos     integer not null default 0 check (intentos >= 0),
  ultimo_error text
);

-- RLS activo, sin políticas, sin privilegios para anon ni authenticated.
alter table public.install_token enable row level security;
alter table public.envio_codigo enable row level security;
alter table public.codigo_intento enable row level security;
alter table public.intento_acceso_dueno enable row level security;
alter table public.cuenta_pendiente_borrado enable row level security;

revoke all on table public.install_token, public.envio_codigo, public.codigo_intento,
  public.intento_acceso_dueno, public.cuenta_pendiente_borrado from anon, authenticated;
grant all on table public.install_token, public.envio_codigo, public.codigo_intento,
  public.intento_acceso_dueno, public.cuenta_pendiente_borrado to service_role;
-- Las tablas con identity: USAGE para el servicio, nada para anon ni authenticated.
revoke all on sequence public.envio_codigo_id_seq, public.codigo_intento_id_seq, public.intento_acceso_dueno_id_seq from anon, authenticated;
grant usage, select on sequence public.envio_codigo_id_seq, public.codigo_intento_id_seq, public.intento_acceso_dueno_id_seq to service_role;
