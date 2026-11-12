-- Descarta el negocio de un alta que no se cerró, para poder crear otro nombre.
-- El slug no se edita. Si el alta ya se cerró o ya hay clientes, no borra nada.
create function servidor.descartar_negocio_incompleto(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_alta timestamptz;
  v_logo text;
begin
  select n.id, n.alta_ts, n.logo_path
    into v_id, v_alta, v_logo
  from public.negocio n
  join public.dueno_negocio d on d.negocio_id = n.id
  where d.user_id = p_user_id;

  if v_id is null then
    raise exception 'sin negocio' using errcode = '23514';
  end if;
  if v_alta is not null then
    raise exception 'el alta ya está cerrada' using errcode = '23514';
  end if;
  if exists (select 1 from public.cliente_negocio c where c.negocio_id = v_id) then
    raise exception 'el negocio ya tiene clientes' using errcode = '23514';
  end if;

  delete from public.negocio where id = v_id;

  return jsonb_build_object('id', v_id, 'logo_path', v_logo);
end
$$;

revoke all on function servidor.descartar_negocio_incompleto(uuid) from public, anon, authenticated;
grant execute on function servidor.descartar_negocio_incompleto(uuid) to service_role;
