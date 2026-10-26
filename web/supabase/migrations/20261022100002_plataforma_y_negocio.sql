-- Migración 2 (ADR-006 §2.3, §2.4, §2.6, §2.8): config_plataforma, negocio, dueno_negocio,
-- tarjeta_config, ayudantes privado.* del dueño y sus políticas.

-- ---------------------------------------------------------------- ayudantes
-- Invoker: lee el claim del JWT. Se usa como (select privado.rol()).
create function privado.rol()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'rol', '')
$$;

-- Estado con la prueba vencida tratada como pausa (RF-COB-03). Pura, sin tablas.
create function privado.estado_efectivo(p_estado text, p_fin_prueba timestamptz)
returns text
language sql
stable
set search_path = ''
as $$
  select case
    when p_estado = 'prueba' and p_fin_prueba is not null and p_fin_prueba < now() then 'pausa'
    else p_estado
  end
$$;

-- ---------------------------------------------------------------- config_plataforma
create table public.config_plataforma (
  clave          text primary key check (clave ~ '^[a-z0-9_]+$'),
  valor          jsonb not null,
  actualizado_ts timestamptz not null default now()
);
alter table public.config_plataforma enable row level security;
revoke all on table public.config_plataforma from anon, authenticated;
grant all on table public.config_plataforma to service_role;
-- Sin políticas: solo service_role.

-- ---------------------------------------------------------------- negocio
create table public.negocio (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                     check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 40)
                     check (slug not in ('recuperar','cuenta','privacidad','registro','api','logo',
                                         'iconos','offline','panel','c','admin')),
  nombre           text not null check (char_length(nombre) between 1 and 80),
  giro             text not null check (giro in ('barberia','estetica','tapioca','cafeteria','otro')),
  ciudad           text not null check (char_length(ciudad) between 1 and 80),
  -- Lista de México de PQ-22 (a); la lista final sigue Por definir (ADR-006 §3).
  zona_horaria     text not null default 'America/Mexico_City'
                     check (zona_horaria in ('America/Mexico_City','America/Cancun','America/Merida',
                       'America/Monterrey','America/Matamoros','America/Chihuahua',
                       'America/Ciudad_Juarez','America/Ojinaga','America/Mazatlan',
                       'America/Bahia_Banderas','America/Hermosillo','America/Tijuana')),
  logo_path        text check (logo_path is null or char_length(logo_path) <= 200),
  color            text check (color is null or color ~ '^#[0-9A-Fa-f]{6}$'),
  plan             text not null default 'inicio' check (plan in ('inicio','negocio','pro')),
  estado           text not null default 'prueba' check (estado in ('prueba','activo','pausa')),
  whatsapp         text not null check (whatsapp ~ '^\+52\d{10}$'),
  correo_dueno     text not null check (correo_dueno = lower(correo_dueno) and char_length(correo_dueno) between 3 and 254),
  creado_ts        timestamptz not null default now(),
  -- Los escribe solo servidor.completar_alta (feature alta-negocio).
  alta_ts          timestamptz,
  fin_prueba       timestamptz,
  tanda            smallint check (tanda is null or tanda >= 1),
  version_producto text check (version_producto is null or char_length(version_producto) between 1 and 40),
  constraint negocio_alta_completa check (
    (alta_ts is null and fin_prueba is null and tanda is null and version_producto is null)
    or (alta_ts is not null and fin_prueba is not null and tanda is not null and version_producto is not null)
  )
);
create index negocio_estado_idx on public.negocio (estado);
create index negocio_tanda_alta_idx on public.negocio (tanda, alta_ts);

-- El slug no cambia nunca; las columnas de alta no cambian una vez escritas.
create function privado.negocio_inmutables()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.slug is distinct from old.slug then
    raise exception 'negocio.slug es inmutable' using errcode = '23514';
  end if;
  if old.alta_ts is not null and (
       new.alta_ts is distinct from old.alta_ts
    or new.fin_prueba is distinct from old.fin_prueba
    or new.tanda is distinct from old.tanda
    or new.version_producto is distinct from old.version_producto) then
    raise exception 'las columnas de alta de negocio no cambian una vez escritas' using errcode = '23514';
  end if;
  return new;
end
$$;
create trigger negocio_inmutables
  before update on public.negocio
  for each row execute function privado.negocio_inmutables();

alter table public.negocio enable row level security;
revoke all on table public.negocio from anon, authenticated;
grant all on table public.negocio to service_role;
grant select on table public.negocio to authenticated;
grant update (nombre, giro, ciudad, zona_horaria, logo_path, whatsapp, correo_dueno)
  on table public.negocio to authenticated;

-- ---------------------------------------------------------------- dueno_negocio
create table public.dueno_negocio (
  user_id    uuid not null references auth.users (id) on delete cascade,
  negocio_id uuid not null references public.negocio (id) on delete cascade,
  creado_ts  timestamptz not null default now(),
  primary key (negocio_id, user_id),
  constraint dueno_negocio_un_negocio unique (user_id)
);
alter table public.dueno_negocio enable row level security;
revoke all on table public.dueno_negocio from anon, authenticated;
grant all on table public.dueno_negocio to service_role;
grant select on table public.dueno_negocio to authenticated;

-- ---------------------------------------------------------------- ayudantes del dueño
create function privado.negocios_del_dueno()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select d.negocio_id from public.dueno_negocio d where d.user_id = (select auth.uid())
$$;

create function privado.es_dueno_de(p_negocio_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.dueno_negocio d
    where d.user_id = (select auth.uid()) and d.negocio_id = p_negocio_id
  )
$$;

-- ---------------------------------------------------------------- tarjeta_config
create table public.tarjeta_config (
  negocio_id       uuid primary key references public.negocio (id) on delete cascade,
  -- [SUPUESTO] 8 por defecto: ejemplos del diseño.
  sellos_meta      smallint not null default 8 check (sellos_meta between 4 and 12),
  recompensa       text not null check (char_length(recompensa) between 1 and 80),
  sello_bienvenida boolean not null default true,
  limite_modo      text not null default 'por_dia' check (limite_modo in ('por_dia','cada_x_horas','sin_limite')),
  limite_minutos   integer check (limite_minutos between 1 and 1440),
  actualizado_ts   timestamptz not null default now(),
  constraint tarjeta_config_limite check ((limite_modo = 'cada_x_horas') = (limite_minutos is not null))
);
alter table public.tarjeta_config enable row level security;
revoke all on table public.tarjeta_config from anon, authenticated;
grant all on table public.tarjeta_config to service_role;
grant select on table public.tarjeta_config to authenticated;

-- ---------------------------------------------------------------- permisos de los ayudantes
revoke all on function privado.rol() from public;
revoke all on function privado.estado_efectivo(text, timestamptz) from public;
revoke all on function privado.negocios_del_dueno() from public;
revoke all on function privado.es_dueno_de(uuid) from public;
revoke all on function privado.negocio_inmutables() from public;
grant execute on function privado.rol() to authenticated, service_role;
grant execute on function privado.estado_efectivo(text, timestamptz) to authenticated, service_role;
grant execute on function privado.negocios_del_dueno() to authenticated, service_role;
grant execute on function privado.es_dueno_de(uuid) to authenticated, service_role;

-- ---------------------------------------------------------------- políticas (familia dueño)
-- No dependen de negocio.estado: con la cuenta en pausa el dueño sigue leyendo (RF-COB-03).
create policy dueno_lee on public.negocio for select to authenticated
  using (
    (select privado.rol()) = 'dueno'
    and id in (select privado.negocios_del_dueno())
  );

create policy dueno_actualiza on public.negocio for update to authenticated
  using (
    (select privado.rol()) = 'dueno'
    and id in (select privado.negocios_del_dueno())
  )
  with check (
    (select privado.rol()) = 'dueno'
    and id in (select privado.negocios_del_dueno())
  );

create policy dueno_lee_su_fila on public.dueno_negocio for select to authenticated
  using (
    (select privado.rol()) = 'dueno'
    and user_id = (select auth.uid())
  );

create policy dueno_lee on public.tarjeta_config for select to authenticated
  using (
    (select privado.rol()) = 'dueno'
    and negocio_id in (select privado.negocios_del_dueno())
  );
