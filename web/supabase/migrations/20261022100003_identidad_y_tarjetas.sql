-- Migración 3 (ADR-006 §2.3, §2.4, §2.5, §2.6): identidad, cliente_negocio, tarjeta_cliente,
-- tarjeta_llave, exclusión mutua con dueno_negocio, ayudantes del cliente y políticas.
-- Datos mínimos (RNF-PRI-01 y 02): identidad guarda solo teléfono E.164 y auth_user_id;
-- cliente_negocio guarda nombre y consentimiento.

-- ---------------------------------------------------------------- identidad
create table public.identidad (
  id           uuid primary key default gen_random_uuid(),
  -- E.164 con '+'. Supabase Auth guarda el teléfono sin '+': se normaliza al comparar
  -- (src/lib/auth/telefono.ts, feature de registro).
  whatsapp     text not null unique check (whatsapp ~ '^\+52\d{10}$'),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  verificado_ts timestamptz not null,
  creada_ts    timestamptz not null default now()
);
alter table public.identidad enable row level security;
revoke all on table public.identidad from anon, authenticated;
grant all on table public.identidad to service_role;
grant select on table public.identidad to authenticated;

-- ---------------------------------------------------------------- cliente_negocio
create table public.cliente_negocio (
  id              uuid primary key default gen_random_uuid(),
  identidad_id    uuid not null references public.identidad (id) on delete cascade,
  negocio_id      uuid not null references public.negocio (id) on delete cascade,
  nombre          text not null check (char_length(nombre) between 1 and 60),
  acepto_aviso_ts timestamptz not null,
  alta_ts         timestamptz not null default now(),
  constraint cliente_negocio_unico unique (identidad_id, negocio_id),
  constraint cliente_negocio_id_negocio unique (id, negocio_id)  -- apoyo de la FK compuesta de tarjeta_cliente
);
create index cliente_negocio_negocio_alta_idx on public.cliente_negocio (negocio_id, alta_ts);
alter table public.cliente_negocio enable row level security;
revoke all on table public.cliente_negocio from anon, authenticated;
grant all on table public.cliente_negocio to service_role;
grant select on table public.cliente_negocio to authenticated;

-- ---------------------------------------------------------------- tarjeta_cliente
create table public.tarjeta_cliente (
  id                uuid primary key default gen_random_uuid(),
  cliente_negocio_id uuid not null unique,
  negocio_id        uuid not null references public.negocio (id) on delete cascade,
  sellos            smallint not null default 0 check (sellos >= 0),
  meta_ciclo        smallint not null check (meta_ciclo between 4 and 12),
  creada_ts         timestamptz not null default now(),
  ultima_visita_ts  timestamptz,
  ultimo_sello_ts   timestamptz,
  -- La copia de negocio_id para RLS no puede discrepar del cliente_negocio.
  constraint tarjeta_cliente_cliente_negocio_fk foreign key (cliente_negocio_id, negocio_id)
    references public.cliente_negocio (id, negocio_id) on delete cascade
);
create index tarjeta_cliente_negocio_idx on public.tarjeta_cliente (negocio_id);
alter table public.tarjeta_cliente enable row level security;
revoke all on table public.tarjeta_cliente from anon, authenticated;
grant all on table public.tarjeta_cliente to service_role;
grant select on table public.tarjeta_cliente to authenticated;

-- ---------------------------------------------------------------- tarjeta_llave
create table public.tarjeta_llave (
  tarjeta_id uuid primary key references public.tarjeta_cliente (id) on delete cascade,
  llave_hmac bytea not null check (octet_length(llave_hmac) = 32),
  creada_ts  timestamptz not null default now()
);
alter table public.tarjeta_llave enable row level security;
revoke all on table public.tarjeta_llave from anon, authenticated;
grant all on table public.tarjeta_llave to service_role;
grant select on table public.tarjeta_llave to authenticated;

-- ---------------------------------------------------------------- ayudantes del cliente
create function privado.mi_identidad_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select i.id from public.identidad i where i.auth_user_id = (select auth.uid())
$$;

create function privado.mis_cliente_negocio_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.id
  from public.cliente_negocio c
  join public.identidad i on i.id = c.identidad_id
  where i.auth_user_id = (select auth.uid())
$$;

-- ---------------------------------------------------------------- exclusión mutua
-- Un auth.users.id no puede estar en identidad y en dueno_negocio (ADR-003 §2.5).
-- El candado asesor serializa a dos transacciones que inserten al mismo usuario en ambas tablas.
create function privado.excluir_dueno_e_identidad()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
  v_otra boolean;
begin
  if tg_table_name = 'identidad' then
    v_user := new.auth_user_id;
  else
    v_user := new.user_id;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user::text, 0));

  if tg_table_name = 'identidad' then
    v_otra := exists (select 1 from public.dueno_negocio d where d.user_id = v_user);
  else
    v_otra := exists (select 1 from public.identidad i where i.auth_user_id = v_user);
  end if;

  if v_otra then
    raise exception 'un usuario no puede ser dueño y cliente a la vez' using errcode = '23514';
  end if;
  return null;
end
$$;

create constraint trigger identidad_excluye_dueno
  after insert or update of auth_user_id on public.identidad
  deferrable initially immediate
  for each row execute function privado.excluir_dueno_e_identidad();

create constraint trigger dueno_excluye_identidad
  after insert or update of user_id on public.dueno_negocio
  deferrable initially immediate
  for each row execute function privado.excluir_dueno_e_identidad();

-- ---------------------------------------------------------------- permisos de los ayudantes
revoke all on function privado.mi_identidad_id() from public;
revoke all on function privado.mis_cliente_negocio_ids() from public;
revoke all on function privado.excluir_dueno_e_identidad() from public;
grant execute on function privado.mi_identidad_id() to authenticated, service_role;
grant execute on function privado.mis_cliente_negocio_ids() to authenticated, service_role;

-- ---------------------------------------------------------------- políticas
-- Familia cliente: rol de app_metadata y pertenencia por filas.
create policy cliente_lee_la_suya on public.identidad for select to authenticated
  using (
    (select privado.rol()) = 'cliente'
    and auth_user_id = (select auth.uid())
  );

create policy cliente_lee_las_suyas on public.cliente_negocio for select to authenticated
  using (
    (select privado.rol()) = 'cliente'
    and id in (select privado.mis_cliente_negocio_ids())
  );

create policy cliente_lee_las_suyas on public.tarjeta_cliente for select to authenticated
  using (
    (select privado.rol()) = 'cliente'
    and cliente_negocio_id in (select privado.mis_cliente_negocio_ids())
  );

create policy cliente_lee_la_suya on public.tarjeta_llave for select to authenticated
  using (
    (select privado.rol()) = 'cliente'
    and tarjeta_id in (
      select t.id from public.tarjeta_cliente t
      where t.cliente_negocio_id in (select privado.mis_cliente_negocio_ids())
    )
  );

-- Familia dueño: solo tarjeta_cliente (sin llave, sin identidad; cliente_negocio va por la vista).
create policy dueno_lee on public.tarjeta_cliente for select to authenticated
  using (
    (select privado.rol()) = 'dueno'
    and negocio_id in (select privado.negocios_del_dueno())
  );
