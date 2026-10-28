-- Registro del cliente (feature registro-cliente, T1).
-- Crea identidad, ficha, tarjeta y llave. El sello de bienvenida, si el negocio lo tiene
-- prendido, nace en la tarjeta. La segunda llamada no suma otro. La fila del evento espera
-- a la tabla evento, que entra con el mostrador.
create function servidor.registrar_cliente(
  p_user_id uuid,
  p_slug text,
  p_nombre text,
  p_acepto boolean
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone text;
  v_whatsapp text;
  v_negocio uuid;
  v_meta smallint;
  v_bienvenida boolean;
  v_identidad uuid;
  v_ficha uuid;
  v_tarjeta uuid;
  v_sellos smallint;
  v_nueva boolean := false;
  v_nombre text;
begin
  if p_acepto is not true then
    raise exception 'falta el aviso' using errcode = '23514';
  end if;
  v_nombre := btrim(coalesce(p_nombre, ''));
  if char_length(v_nombre) < 1 or char_length(v_nombre) > 60 then
    raise exception 'nombre inválido' using errcode = '23514';
  end if;
  if exists (select 1 from public.dueno_negocio d where d.user_id = p_user_id) then
    raise exception 'el usuario ya es dueño' using errcode = '23514';
  end if;

  select u.phone into v_phone from auth.users u where u.id = p_user_id;
  v_phone := regexp_replace(coalesce(v_phone, ''), '^\+', '');
  if v_phone !~ '^52\d{10}$' then
    raise exception 'teléfono inválido' using errcode = '23514';
  end if;
  v_whatsapp := '+' || v_phone;

  select n.id, t.sellos_meta, t.sello_bienvenida
    into v_negocio, v_meta, v_bienvenida
  from public.negocio n
  join public.tarjeta_config t on t.negocio_id = n.id
  where n.slug = p_slug
    and n.alta_ts is not null
    and (n.estado = 'activo' or (n.estado = 'prueba' and (n.fin_prueba is null or n.fin_prueba >= now())));
  if v_negocio is null then
    raise exception 'negocio no disponible' using errcode = '23514';
  end if;

  insert into public.identidad (whatsapp, auth_user_id, verificado_ts)
  values (v_whatsapp, p_user_id, now())
  on conflict (auth_user_id) do update set whatsapp = excluded.whatsapp
  returning id into v_identidad;

  insert into public.cliente_negocio (identidad_id, negocio_id, nombre, acepto_aviso_ts)
  values (v_identidad, v_negocio, v_nombre, now())
  on conflict (identidad_id, negocio_id) do nothing
  returning id into v_ficha;

  if v_ficha is null then
    select c.id into v_ficha
      from public.cliente_negocio c
     where c.identidad_id = v_identidad and c.negocio_id = v_negocio;
  else
    v_nueva := true;
  end if;

  v_sellos := case when v_nueva and v_bienvenida then 1 else 0 end;

  insert into public.tarjeta_cliente (cliente_negocio_id, negocio_id, sellos, meta_ciclo, ultimo_sello_ts)
  values (
    v_ficha,
    v_negocio,
    v_sellos,
    v_meta,
    case when v_sellos = 1 then now() else null end
  )
  on conflict (cliente_negocio_id) do nothing
  returning id, sellos into v_tarjeta, v_sellos;

  if v_tarjeta is null then
    select t.id, t.sellos into v_tarjeta, v_sellos
      from public.tarjeta_cliente t
     where t.cliente_negocio_id = v_ficha;
    v_nueva := false;
  end if;

  insert into public.tarjeta_llave (tarjeta_id, llave_hmac)
  values (v_tarjeta, extensions.gen_random_bytes(32))
  on conflict (tarjeta_id) do nothing;

  return jsonb_build_object(
    'tarjeta_id', v_tarjeta,
    'sellos', v_sellos,
    'nueva', v_nueva,
    'bienvenida', v_bienvenida and v_nueva
  );
end
$$;

revoke all on function servidor.registrar_cliente(uuid, text, text, boolean) from public, anon, authenticated;
grant execute on function servidor.registrar_cliente(uuid, text, text, boolean) to service_role;
