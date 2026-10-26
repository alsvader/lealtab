-- Complemento de las pruebas por REST (src/test/rls): lo que se verifica mejor dentro de la base.
--  * Toda función nueva nace sin EXECUTE para PUBLIC, anon ni authenticated (R-03 y R-27 mientras
--    no existan funciones servidor.*; las pruebas P-03 de 01 solo ven las funciones que ya hay).
--  * negocio_publico duplica el criterio de privado.estado_efectivo para no exigirle nada a anon
--    (migración 20261026100001): se comprueba que ambos coinciden en todos los casos.
begin;
select plan(9);

-- ---------------------------------------------------------------- privilegios por defecto
create function servidor.t_nueva() returns int language sql as 'select 1';
create function privado.t_nueva() returns int language sql as 'select 1';
create function public.t_nueva() returns int language sql as 'select 1';

select is(
  (select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where p.proname = 't_nueva' and n.nspname in ('servidor','privado','public')
      and (has_function_privilege('anon', p.oid, 'EXECUTE')
        or has_function_privilege('authenticated', p.oid, 'EXECUTE')
        or exists (select 1 from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a where a.grantee = 0))),
  0, 'una función nueva en servidor, privado o public nace sin EXECUTE para PUBLIC, anon ni authenticated');

select is(has_function_privilege('anon', 'servidor.t_nueva()', 'EXECUTE'), false, 'servidor: anon no ejecuta una función nueva');
select is(has_function_privilege('authenticated', 'servidor.t_nueva()', 'EXECUTE'), false, 'servidor: authenticated no ejecuta una función nueva');
select is(has_function_privilege('anon', 'public.t_nueva()', 'EXECUTE'), false, 'public: anon no ejecuta una función nueva');

-- ---------------------------------------------------------------- negocio_publico
insert into public.negocio (id, slug, nombre, giro, ciudad, whatsapp, correo_dueno, estado, alta_ts, fin_prueba, tanda, version_producto) values
  ('00000000-0000-0000-0000-0000000000c1', 'tp-activo',   'Activo',   'otro', 'V', '+529931234567', 'a@b.test', 'activo', now(), now() + interval '30 days', 1, 't'),
  ('00000000-0000-0000-0000-0000000000c2', 'tp-prueba',   'Prueba',   'otro', 'V', '+529931234567', 'a@b.test', 'prueba', now(), now() + interval '30 days', 1, 't'),
  ('00000000-0000-0000-0000-0000000000c3', 'tp-vencida',  'Vencida',  'otro', 'V', '+529931234567', 'a@b.test', 'prueba', now(), now() - interval '1 day', 1, 't'),
  ('00000000-0000-0000-0000-0000000000c4', 'tp-pausa',    'Pausa',    'otro', 'V', '+529931234567', 'a@b.test', 'pausa',  now(), now() + interval '30 days', 1, 't'),
  ('00000000-0000-0000-0000-0000000000c5', 'tp-activo-vencido', 'ActivoV', 'otro', 'V', '+529931234567', 'a@b.test', 'activo', now(), now() - interval '1 day', 1, 't'),
  ('00000000-0000-0000-0000-0000000000c6', 'tp-sinalta',  'Sin alta', 'otro', 'V', '+529931234567', 'a@b.test', 'prueba', null, null, null, null);
insert into public.tarjeta_config (negocio_id, recompensa)
  select id, 'Premio' from public.negocio where slug like 'tp-%';

-- La vista coincide con privado.estado_efectivo (alta completa y efectivo prueba o activo).
select set_eq(
  $$ select slug::text from public.negocio_publico where slug like 'tp-%' $$,
  $$ select n.slug::text from public.negocio n
      where n.slug like 'tp-%' and n.alta_ts is not null
        and privado.estado_efectivo(n.estado, n.fin_prueba) in ('prueba', 'activo') $$,
  'negocio_publico coincide con estado_efectivo en prueba, prueba vencida, pausa, activo y sin alta');

select set_eq(
  $$ select slug::text from public.negocio_publico where slug like 'tp-%' $$,
  $$ values ('tp-activo'), ('tp-prueba'), ('tp-activo-vencido') $$,
  'negocio_publico: activo y prueba vigente; fuera pausa, prueba vencida y sin alta');

-- Como anon, sin ninguna función ni esquema de privado.
set local role anon;
select lives_ok($$ select * from public.negocio_publico $$, 'anon lee negocio_publico (la vista no usa funciones de privado)');
select is((select count(*)::int from public.negocio_publico where slug like 'tp-%'), 3, 'anon ve tres negocios vigentes');
select throws_ok($$ select * from public.negocio $$, '42501', null, 'anon no lee negocio');
reset role;

select * from finish();
rollback;
