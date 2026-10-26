-- Pruebas estructurales (arquitectura.md §4.3: P-01 a P-08, sin P-09 que espera borrar_cuenta_cliente).
begin;
select plan(24);

-- P-01: toda tabla de public tiene RLS activo.
select is(
  (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r','p') and not c.relrowsecurity),
  0, 'P-01: toda tabla de public tiene RLS activo');

-- P-02: anon solo tiene SELECT sobre negocio_publico.
select set_eq(
  $$ select table_name::text || ':' || privilege_type::text from information_schema.role_table_grants
      where grantee = 'anon' and table_schema in ('public','privado','servidor') $$,
  $$ values ('negocio_publico:SELECT') $$,
  'P-02: anon solo tiene SELECT sobre negocio_publico');

select is(
  (select count(*)::int from information_schema.role_column_grants
    where grantee = 'anon' and table_schema = 'public' and table_name <> 'negocio_publico'),
  0, 'P-02: anon sin privilegios de columna fuera de negocio_publico');

-- authenticated: exactamente los GRANT esperados.
select set_eq(
  $$ select table_name::text || ':' || privilege_type::text from information_schema.role_table_grants
      where grantee = 'authenticated' and table_schema = 'public' $$,
  $$ values ('negocio:SELECT'),('dueno_negocio:SELECT'),('tarjeta_config:SELECT'),
            ('identidad:SELECT'),('cliente_negocio:SELECT'),('tarjeta_cliente:SELECT'),
            ('tarjeta_llave:SELECT'),('negocio_publico:SELECT'),('cliente_del_negocio:SELECT'),
            ('mis_tarjetas:SELECT') $$,
  'authenticated solo tiene SELECT en las tablas y vistas esperadas');

select set_eq(
  $$ select column_name::text from information_schema.role_column_grants
      where grantee = 'authenticated' and table_schema = 'public' and table_name = 'negocio'
        and privilege_type = 'UPDATE' $$,
  $$ values ('nombre'),('giro'),('ciudad'),('zona_horaria'),('logo_path'),('whatsapp'),('correo_dueno') $$,
  'el dueño solo actualiza las siete columnas permitidas de negocio');

select is(
  (select count(*)::int from information_schema.role_table_grants
    where grantee = 'authenticated' and table_schema = 'public'
      and table_name in ('evento_uso','config_plataforma','install_token','envio_codigo',
                         'codigo_intento','intento_acceso_dueno','cuenta_pendiente_borrado')),
  0, 'authenticated sin privilegios sobre las tablas solo de servicio');

select is(
  (select count(*)::int from information_schema.role_usage_grants
    where grantee in ('anon','authenticated') and object_schema = 'public' and object_type = 'SEQUENCE'),
  0, 'anon y authenticated sin privilegios sobre secuencias');

-- service_role puede operar todas las tablas (BYPASSRLS no concede privilegios de tabla).
select is(
  (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r'
      and not has_table_privilege('service_role', c.oid, 'SELECT,INSERT,UPDATE,DELETE')),
  0, 'service_role tiene privilegios sobre todas las tablas');

-- P-03: funciones.
select is(
  (select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public','privado','servidor')
      and (has_function_privilege('anon', p.oid, 'EXECUTE')
           or exists (select 1 from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a where a.grantee = 0))),
  0, 'P-03: ninguna función es ejecutable por PUBLIC o anon');

select set_eq(
  $$ select p.proname::text from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname in ('public','privado','servidor') and has_function_privilege('authenticated', p.oid, 'EXECUTE') $$,
  $$ values ('rol'),('negocios_del_dueno'),('es_dueno_de'),('mi_identidad_id'),
            ('mis_cliente_negocio_ids'),('estado_efectivo') $$,
  'P-03: authenticated solo ejecuta los ayudantes de privado');

select is(
  (select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'servidor' and (has_function_privilege('authenticated', p.oid, 'EXECUTE') or has_function_privilege('anon', p.oid, 'EXECUTE'))),
  0, 'servidor: sin EXECUTE para anon ni authenticated');

select is(
  (select has_schema_privilege('authenticated', 'servidor', 'USAGE')
       or has_schema_privilege('anon', 'servidor', 'USAGE')
       or has_schema_privilege('anon', 'privado', 'USAGE')),
  false, 'anon y authenticated sin USAGE en servidor; anon sin USAGE en privado');

-- P-04: SECURITY DEFINER con search_path fijado.
select is(
  (select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public','privado','servidor') and p.prosecdef
      and not coalesce(p.proconfig::text ilike '%search_path=%', false)),
  0, 'P-04: toda SECURITY DEFINER fija search_path');

-- P-05: vistas definer.
select set_eq(
  $$ select c.relname::text from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'v'
        and not coalesce(c.reloptions::text ilike '%security_invoker=true%', false) $$,
  $$ values ('negocio_publico'),('cliente_del_negocio'),('mis_tarjetas') $$,
  'P-05: las tres vistas son las únicas definer de public');

select is(
  (select count(*)::int from information_schema.columns
    where table_schema = 'public' and table_name in ('negocio_publico','cliente_del_negocio','mis_tarjetas')
      and column_name = 'identidad_id'),
  0, 'P-05: ninguna vista expone identidad_id');

-- P-06: claves foráneas.
select set_eq(
  $$ select conrelid::regclass::text || '.' || a.attname::text || ':' || c.confdeltype::text
       from pg_constraint c join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
      where c.contype = 'f' and c.conrelid in ('public.evento_uso'::regclass, 'public.identidad'::regclass, 'public.dueno_negocio'::regclass)
        and a.attname in ('negocio_id','identidad_id','auth_user_id','user_id') $$,
  $$ values ('evento_uso.negocio_id:n'),('evento_uso.identidad_id:n'),
            ('identidad.auth_user_id:c'),('dueno_negocio.user_id:c'),('dueno_negocio.negocio_id:c') $$,
  'P-06: FK de evento_uso SET NULL; identidad y dueno_negocio CASCADE');

-- P-07: políticas todas to authenticated, sin using (true).
select is(
  (select count(*)::int from pg_policies where schemaname = 'public'
     and (roles <> '{authenticated}'::name[] or qual ~* '^\(?\s*true\s*\)?$' or with_check ~* '^\(?\s*true\s*\)?$')),
  0, 'P-07: toda política es to authenticated y ninguna usa (true)');

select is(
  (select count(*)::int from pg_policies where schemaname = 'public'
     and qual not like '%privado.rol()%'),
  0, 'toda política exige el rol y la pertenencia por filas');

-- P-08: CHECK, inmutabilidad y exclusión mutua (datos de prueba dentro de la transacción).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000000a1', 'dueno@prueba.test'),
  ('00000000-0000-0000-0000-0000000000a2', 'cliente@prueba.test');

select throws_ok(
  $$ insert into public.negocio (slug, nombre, giro, ciudad, color, whatsapp, correo_dueno)
     values ('tacos-uno', 'Tacos', 'otro', 'Villahermosa', 'verde', '+529931234567', 'a@b.test') $$,
  '23514', null, 'CHECK del color rechaza un valor que no es hex de 6 dígitos');

select lives_ok(
  $$ insert into public.negocio (id, slug, nombre, giro, ciudad, color, whatsapp, correo_dueno)
     values ('00000000-0000-0000-0000-0000000000b1', 'tacos-uno', 'Tacos', 'otro', 'Villahermosa', '#0F5132', '+529931234567', 'a@b.test') $$,
  'un negocio válido con color hex se inserta');

select throws_ok(
  $$ update public.negocio set slug = 'tacos-dos' where id = '00000000-0000-0000-0000-0000000000b1' $$,
  '23514', 'negocio.slug es inmutable', 'negocio.slug es inmutable');

select throws_ok(
  $$ insert into public.negocio (slug, nombre, giro, ciudad, whatsapp, correo_dueno)
     values ('panel', 'X', 'otro', 'Y', '+529931234567', 'a@b.test') $$,
  '23514', null, 'el slug reservado se rechaza');

-- Exclusión mutua en ambos sentidos.
insert into public.dueno_negocio (user_id, negocio_id)
  values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000b1');
select throws_ok(
  $$ insert into public.identidad (whatsapp, auth_user_id, verificado_ts)
     values ('+529931110000', '00000000-0000-0000-0000-0000000000a1', now()) $$,
  '23514', 'un usuario no puede ser dueño y cliente a la vez', 'un dueño no puede tener identidad');

insert into public.identidad (whatsapp, auth_user_id, verificado_ts)
  values ('+529931110001', '00000000-0000-0000-0000-0000000000a2', now());
select throws_ok(
  $$ insert into public.dueno_negocio (user_id, negocio_id)
     values ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-0000000000b1') $$,
  '23514', 'un usuario no puede ser dueño y cliente a la vez', 'una identidad no puede ser dueño');

select * from finish();
rollback;
