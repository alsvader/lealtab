-- H-03 (revisión de seguridad): anon no necesita nada. El navegador nunca llama a Supabase; la
-- landing y el registro leen el negocio por el servidor con la llave de servicio. Con el SELECT
-- abierto, `GET /rest/v1/negocio_publico` listaba todos los negocios (nombre, slug, recompensa...).
-- Sigue disponible para authenticated y service_role.
revoke select on public.negocio_publico from anon;

-- H-10: las tablas y secuencias nuevas de public no nacen con ALL para anon ni authenticated
-- (valor por defecto de Supabase). Cada migración concede explícitamente lo que necesita.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
