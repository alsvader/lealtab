-- Límites del código del cliente (spike-auth-cliente, T2).
-- 3 por hora y 10 al día por teléfono, 400 al día entre todos. Los números salen de config_plataforma.
create function servidor.autorizar_envio_codigo(p_telefono text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id bigint;
  v_canal text;
  v_hora int;
  v_dia int;
  v_global int;
  v_lim_hora int := 3;
  v_lim_dia int := 10;
  v_lim_global int := 400;
  v_motivo text;
begin
  if p_telefono is null or p_telefono !~ '^\+52\d{10}$' then
    raise exception 'teléfono inválido' using errcode = '23514';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_telefono, 0));

  select coalesce((valor #>> '{}')::int, v_lim_hora) into v_lim_hora
    from public.config_plataforma where clave = 'codigo_por_telefono_hora';
  select coalesce((valor #>> '{}')::int, v_lim_dia) into v_lim_dia
    from public.config_plataforma where clave = 'codigo_por_telefono_dia';
  select coalesce((valor #>> '{}')::int, v_lim_global) into v_lim_global
    from public.config_plataforma where clave = 'codigo_tope_dia';

  select e.id, e.canal_intencion into v_id, v_canal
    from public.envio_codigo e
   where e.telefono = p_telefono
     and e.resultado = 'solicitado'
     and e.hook_ts is null
     and e.creado_ts > now() - interval '2 minutes'
   order by e.creado_ts desc
   limit 1;

  if v_id is null then
    insert into public.envio_codigo (telefono, proposito, canal_intencion)
    values (p_telefono, 'registro', 'auto')
    returning id, canal_intencion into v_id, v_canal;
  end if;

  select count(*) into v_hora
    from public.envio_codigo e
   where e.telefono = p_telefono
     and e.id <> v_id
     and e.hook_ts > now() - interval '1 hour'
     and e.resultado <> 'rechazado_limite';

  select count(*) into v_dia
    from public.envio_codigo e
   where e.telefono = p_telefono
     and e.id <> v_id
     and e.hook_ts > now() - interval '24 hours'
     and e.resultado <> 'rechazado_limite';

  select count(*) into v_global
    from public.envio_codigo e
   where e.id <> v_id
     and e.hook_ts > now() - interval '24 hours'
     and e.resultado <> 'rechazado_limite';

  if v_hora >= v_lim_hora then
    v_motivo := 'hora';
  elsif v_dia >= v_lim_dia then
    v_motivo := 'dia';
  elsif v_global >= v_lim_global then
    v_motivo := 'global';
  end if;

  if v_motivo is not null then
    update public.envio_codigo
       set hook_ts = now(), resultado = 'rechazado_limite', motivo_rechazo = v_motivo
     where id = v_id;
  else
    update public.envio_codigo set hook_ts = now() where id = v_id;
  end if;

  return jsonb_build_object(
    'permitido', v_motivo is null,
    'motivo', v_motivo,
    'canal_intencion', v_canal,
    'id', v_id
  );
end
$$;

revoke all on function servidor.autorizar_envio_codigo(text) from public, anon, authenticated;
grant execute on function servidor.autorizar_envio_codigo(text) to service_role;

-- Busca al usuario de Auth por teléfono, con o sin el signo +. Solo service_role.
create function servidor.usuario_por_telefono(p_telefono text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_rol text;
  v_plano text;
begin
  if p_telefono is null or p_telefono !~ '^\+52\d{10}$' then
    raise exception 'teléfono inválido' using errcode = '23514';
  end if;
  v_plano := regexp_replace(p_telefono, '^\+', '');
  select u.id, u.raw_app_meta_data ->> 'rol'
    into v_id, v_rol
    from auth.users u
   where u.phone = p_telefono or u.phone = v_plano
   limit 1;
  if v_id is null then
    return jsonb_build_object('id', null, 'rol', null);
  end if;
  return jsonb_build_object('id', v_id, 'rol', v_rol);
end
$$;

revoke all on function servidor.usuario_por_telefono(text) from public, anon, authenticated;
grant execute on function servidor.usuario_por_telefono(text) to service_role;
