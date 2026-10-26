-- Migración 6 (ADR-006 §2.4; medicion.md §3.1): evento_uso. Analítica propia (D-018).
-- Solo service_role; sin políticas.

create table public.evento_uso (
  id               bigint generated always as identity primary key,
  evento_uuid      uuid unique,  -- idempotencia de lo que emite el navegador
  nombre           text not null check (nombre ~ '^[a-z]+(_[a-z]+)*$'),
  ocurrido_ts      timestamptz not null default now(),
  negocio_id       uuid references public.negocio (id) on delete set null,
  identidad_id     uuid references public.identidad (id) on delete set null,  -- anonimiza al borrar la cuenta
  flujo_id         uuid,
  emisor           text not null check (emisor in ('cliente','panel','servidor','hook')),
  version_producto text not null check (char_length(version_producto) between 1 and 40),
  props            jsonb not null default '{}'::jsonb
                     check (jsonb_typeof(props) = 'object' and pg_column_size(props) < 2048)
);
create index evento_uso_nombre_idx on public.evento_uso (nombre, ocurrido_ts);
create index evento_uso_negocio_idx on public.evento_uso (negocio_id, nombre, ocurrido_ts);
create index evento_uso_flujo_idx on public.evento_uso (flujo_id) where flujo_id is not null;
create index evento_uso_identidad_idx on public.evento_uso (identidad_id, nombre) where identidad_id is not null;

alter table public.evento_uso enable row level security;
revoke all on table public.evento_uso from anon, authenticated;
grant all on table public.evento_uso to service_role;
revoke all on sequence public.evento_uso_id_seq from anon, authenticated;
grant usage, select on sequence public.evento_uso_id_seq to service_role;
