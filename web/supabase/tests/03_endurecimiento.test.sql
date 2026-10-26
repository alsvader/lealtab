-- Correcciones de la revisión de seguridad (T5b): H-04, H-07, H-08 y H-10.
begin;
select plan(12);

-- H-10: una tabla y una secuencia nuevas en public no nacen con privilegios para anon ni authenticated.
create table public.t_nueva_tabla (id bigint generated always as identity primary key);
select is(
  (select count(*)::int from information_schema.role_table_grants
    where table_schema = 'public' and table_name = 't_nueva_tabla' and grantee in ('anon','authenticated')),
  0, 'H-10: una tabla nueva de public nace sin privilegios para anon ni authenticated');
select is(has_sequence_privilege('anon', 'public.t_nueva_tabla_id_seq', 'USAGE')
       or has_sequence_privilege('authenticated', 'public.t_nueva_tabla_id_seq', 'USAGE'),
  false, 'H-10: una secuencia nueva de public nace sin USAGE para anon ni authenticated');

-- H-08: las tres vistas tienen security_barrier.
select is(
  (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'v'
      and c.relname in ('negocio_publico','cliente_del_negocio','mis_tarjetas')
      and coalesce(c.reloptions::text ilike '%security_barrier=true%', false)),
  3, 'H-08: las tres vistas definer tienen security_barrier');

-- H-04: teléfonos solo en E.164 de México.
select lives_ok($$ insert into public.envio_codigo (telefono, proposito) values ('+529931234567', 'registro') $$,
  'H-04: envio_codigo acepta +52 y 10 dígitos');
select throws_ok($$ insert into public.envio_codigo (telefono, proposito) values ('+52 993 123 4567', 'registro') $$,
  '23514', null, 'H-04: envio_codigo rechaza espacios');
select throws_ok($$ insert into public.envio_codigo (telefono, proposito) values ('529931234567', 'registro') $$,
  '23514', null, 'H-04: envio_codigo rechaza sin +');
select throws_ok($$ insert into public.codigo_intento (telefono, resultado) values ('9931234567', 'incorrecto') $$,
  '23514', null, 'H-04: codigo_intento rechaza sin lada del país');
select lives_ok($$ insert into public.codigo_intento (telefono, resultado) values ('+529931234567', 'incorrecto') $$,
  'H-04: codigo_intento acepta E.164 de México');

-- H-07: forma de logo_path.
insert into public.negocio (id, slug, nombre, giro, ciudad, whatsapp, correo_dueno)
  values ('00000000-0000-0000-0000-0000000000d1', 'tp-logo', 'Logo', 'otro', 'V', '+529931234567', 'a@b.test');
select lives_ok($$ update public.negocio set logo_path = 'logos/3f2a9c1e-5b7d-4e8a-9c0f-1a2b3c4d5e6f.png' where slug = 'tp-logo' $$,
  'H-07: logo_path acepta logos/<uuid>.png');
select throws_ok($$ update public.negocio set logo_path = '../otro/logo.png' where slug = 'tp-logo' $$,
  '23514', null, 'H-07: logo_path rechaza ..');
select throws_ok($$ update public.negocio set logo_path = '/logos/3f2a9c1e-5b7d-4e8a-9c0f-1a2b3c4d5e6f.png' where slug = 'tp-logo' $$,
  '23514', null, 'H-07: logo_path rechaza / inicial');
select throws_ok($$ update public.negocio set logo_path = '00000000-0000-0000-0000-0000000000d1/logo.png' where slug = 'tp-logo' $$,
  '23514', null, 'H-07: logo_path rechaza la forma vieja con negocio_id');

select * from finish();
rollback;
