-- Alta del negocio (feature alta-negocio, T4).
-- El servidor crea negocio y dueno_negocio. No escribe alta_ts, fin_prueba, tanda ni
-- version_producto: eso es completar_alta. El slug lo elige esta función, no el cliente.
create function servidor.crear_negocio(
  p_user_id uuid,
  p_nombre text,
  p_giro text,
  p_ciudad text,
  p_whatsapp text,
  p_correo text,
  p_zona text,
  p_logo_path text,
  p_slug_base text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_base text;
  v_slug text;
  v_n int := 2;
  v_id uuid;
begin
  if exists (select 1 from public.identidad i where i.auth_user_id = p_user_id) then
    raise exception 'el usuario ya es cliente' using errcode = '23514';
  end if;
  if exists (select 1 from public.dueno_negocio d where d.user_id = p_user_id) then
    raise exception 'el usuario ya tiene negocio' using errcode = '23514';
  end if;

  v_base := lower(coalesce(p_slug_base, ''));
  if v_base !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or char_length(v_base) < 3 then
    v_base := 'negocio';
  end if;
  v_base := left(v_base, 40);
  v_slug := v_base;

  while v_slug in ('recuperar','cuenta','privacidad','registro','api','logo','iconos','offline','panel','c','admin')
     or exists (select 1 from public.negocio n where n.slug = v_slug)
  loop
    v_slug := left(v_base, 36) || '-' || v_n::text;
    v_n := v_n + 1;
    if v_n > 100 then
      raise exception 'no hay slug libre' using errcode = '23514';
    end if;
  end loop;

  insert into public.negocio (slug, nombre, giro, ciudad, zona_horaria, logo_path, whatsapp, correo_dueno)
  values (v_slug, btrim(p_nombre), p_giro, btrim(p_ciudad), p_zona, p_logo_path, p_whatsapp, lower(p_correo))
  returning id into v_id;

  insert into public.dueno_negocio (user_id, negocio_id)
  values (p_user_id, v_id);

  return jsonb_build_object('id', v_id, 'slug', v_slug);
end
$$;

revoke all on function servidor.crear_negocio(uuid, text, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function servidor.crear_negocio(uuid, text, text, text, text, text, text, text, text)
  to service_role;
