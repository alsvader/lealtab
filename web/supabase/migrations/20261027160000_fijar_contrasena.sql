-- Cambia la contraseña del dueño sin pasar por GoTrue.
-- updateUser revoca los demás refresh tokens aunque la casilla vaya desmarcada (RF-ALT-02b).
create function servidor.fijar_contrasena(p_user_id uuid, p_contrasena text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_contrasena is null or char_length(p_contrasena) < 8 or char_length(p_contrasena) > 72 then
    raise exception 'contraseña inválida' using errcode = '23514';
  end if;
  update auth.users
     set encrypted_password = extensions.crypt(p_contrasena, extensions.gen_salt('bf', 10)),
         updated_at = now()
   where id = p_user_id;
  if not found then
    raise exception 'sin usuario' using errcode = '23514';
  end if;
end
$$;

revoke all on function servidor.fijar_contrasena(uuid, text) from public, anon, authenticated;
grant execute on function servidor.fijar_contrasena(uuid, text) to service_role;
