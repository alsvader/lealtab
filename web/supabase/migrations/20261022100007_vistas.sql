-- Migración 7 (ADR-006 §2.7): vistas. Sin security_invoker (corren con los privilegios del
-- propietario) y filtran dentro de la propia vista. Excepción documentada del asesor de
-- seguridad de Supabase; la cubren las pruebas P-05 y R-xx.
-- Los filtros llaman a funciones de privado, que se evalúan con el invoker (authenticated/anon)
-- porque las vistas definer ejecutan funciones como el propietario pero auth.uid()/auth.jwt()
-- leen la configuración de la petición, no el rol.

create view public.negocio_publico
  with (security_invoker = false)
as
select n.slug, n.nombre, n.logo_path, n.color,
       t.sellos_meta, t.recompensa, t.sello_bienvenida, t.limite_modo, t.limite_minutos
from public.negocio n
join public.tarjeta_config t on t.negocio_id = n.id
where n.alta_ts is not null
  and privado.estado_efectivo(n.estado, n.fin_prueba) in ('prueba', 'activo');

-- Sin identidad_id (RNF-PRI-02).
create view public.cliente_del_negocio
  with (security_invoker = false)
as
select c.id, c.negocio_id, c.nombre, i.whatsapp, c.alta_ts
from public.cliente_negocio c
join public.identidad i on i.id = c.identidad_id
where privado.rol() = 'dueno'
  and c.negocio_id in (select privado.negocios_del_dueno());

create view public.mis_tarjetas
  with (security_invoker = false)
as
select tc.id as tarjeta_id, n.slug, n.nombre as negocio_nombre, n.logo_path,
       privado.estado_efectivo(n.estado, n.fin_prueba) as estado_negocio,
       tc.sellos, tc.meta_ciclo, tc.ultima_visita_ts,
       cfg.recompensa, cfg.limite_modo, cfg.limite_minutos,
       c.nombre as cliente_nombre, c.acepto_aviso_ts, c.alta_ts
from public.tarjeta_cliente tc
join public.cliente_negocio c on c.id = tc.cliente_negocio_id
join public.negocio n on n.id = tc.negocio_id
left join public.tarjeta_config cfg on cfg.negocio_id = n.id
where privado.rol() = 'cliente'
  and c.id in (select privado.mis_cliente_negocio_ids());

revoke all on public.negocio_publico, public.cliente_del_negocio, public.mis_tarjetas
  from public, anon, authenticated;
grant select on public.negocio_publico to anon, authenticated, service_role;
grant select on public.cliente_del_negocio to authenticated, service_role;
grant select on public.mis_tarjetas to authenticated, service_role;
