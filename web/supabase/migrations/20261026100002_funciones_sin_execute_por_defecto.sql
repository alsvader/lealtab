-- Corrección hacia adelante de la migración 1 (hallazgo de supabase/tests/02_*.test.sql, T5).
-- Defecto: la migración 1 decía «toda función nueva nace sin EXECUTE para PUBLIC, anon y
-- authenticated», pero `alter default privileges in schema X revoke ... from public` no quita nada:
-- un privilegio por defecto de un esquema solo SUMA a los globales, y por defecto Postgres da
-- EXECUTE a PUBLIC (y anon y authenticated son miembros de PUBLIC) en toda función nueva. Una
-- función nueva en `public` (expuesta como RPC por la API) o en `privado` quedaba ejecutable por
-- anon y authenticated si su migración olvidaba el REVOKE. Hoy ninguna función existente tiene el
-- problema (P-03 lo comprueba) y `servidor` sigue protegida por el USAGE del esquema.
-- Se quita el EXECUTE de PUBLIC a nivel global para las funciones que cree `postgres` (el rol de
-- las migraciones) y se repite el revoke por esquema para anon y authenticated.
-- Efecto lateral: una migración futura que haga `create extension` como postgres creará funciones
-- sin EXECUTE para PUBLIC; si hace falta, esa migración debe concederlo a mano.
alter default privileges for role postgres revoke execute on functions from public;
alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated;
alter default privileges for role postgres in schema servidor revoke execute on functions from anon, authenticated;
alter default privileges for role postgres in schema privado revoke execute on functions from anon, authenticated;
