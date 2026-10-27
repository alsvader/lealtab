-- Cierra el alta (feature alta-negocio, T6). Escribe las cuatro columnas juntas y el evento
-- negocio_alta_completada en la misma transacción. Si ya estaban escritas, no las cambia
-- ni repite el evento.
create function servidor.completar_alta(
  p_user_id uuid,
  p_version text,
  p_duracion_s int
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_alta timestamptz;
  v_fin timestamptz;
  v_tanda smallint;
  v_version text;
  v_slug text;
  v_giro text;
  v_duracion int := greatest(coalesce(p_duracion_s, 0), 0);
begin
  select n.id, n.alta_ts, n.fin_prueba, n.tanda, n.version_producto, n.slug, n.giro
    into v_id, v_alta, v_fin, v_tanda, v_version, v_slug, v_giro
  from public.negocio n
  join public.dueno_negocio d on d.negocio_id = n.id
  where d.user_id = p_user_id;

  if v_id is null then
    raise exception 'sin negocio' using errcode = '23514';
  end if;

  if v_alta is null then
    v_alta := now();
    v_fin := v_alta + interval '30 days';
    select (valor #>> '{}')::smallint into v_tanda
    from public.config_plataforma
    where clave = 'tanda_actual';
    if v_tanda is null then
      v_tanda := 1;
    end if;
    v_version := p_version;

    update public.negocio
       set alta_ts = v_alta,
           fin_prueba = v_fin,
           tanda = v_tanda,
           version_producto = v_version
     where id = v_id;

    insert into public.evento_uso (nombre, negocio_id, emisor, version_producto, props)
    values (
      'negocio_alta_completada',
      v_id,
      'servidor',
      v_version,
      jsonb_build_object(
        'oficio', v_giro,
        'tanda', v_tanda,
        'version_producto', v_version,
        'duracion_s', v_duracion
      )
    );
  end if;

  return jsonb_build_object(
    'id', v_id,
    'slug', v_slug,
    'alta_ts', v_alta,
    'fin_prueba', v_fin,
    'tanda', v_tanda,
    'version_producto', v_version
  );
end
$$;

revoke all on function servidor.completar_alta(uuid, text, int) from public, anon, authenticated;
grant execute on function servidor.completar_alta(uuid, text, int) to service_role;
