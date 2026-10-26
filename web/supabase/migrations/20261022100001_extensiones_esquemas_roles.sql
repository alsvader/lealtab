-- Migración 1 (ADR-006 §2.3): extensiones, esquemas y privilegios por defecto.
create extension if not exists pgcrypto with schema extensions;

-- privado: ayudantes de RLS. No expuesto en la API.
create schema if not exists privado;
revoke all on schema privado from public, anon;
grant usage on schema privado to authenticated, service_role;

-- servidor: funciones SECURITY DEFINER de escritura. Visible para la API (config.toml),
-- pero solo service_role las ejecuta (ADR-006 §2.1).
create schema if not exists servidor;
revoke all on schema servidor from public, anon, authenticated;
grant usage on schema servidor to service_role;

-- Toda función nueva nace sin EXECUTE para PUBLIC, anon y authenticated.
-- El propietario de las migraciones es postgres; las funciones se crean con ese rol.
alter default privileges in schema servidor revoke execute on functions from public, anon, authenticated;
alter default privileges in schema privado revoke execute on functions from public, anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
