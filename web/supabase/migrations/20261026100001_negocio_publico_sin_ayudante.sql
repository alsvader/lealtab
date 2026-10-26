-- Corrección hacia adelante de la migración 7 (hallazgo de las pruebas de RLS por REST, T5).
-- Defecto: negocio_publico llamaba a privado.estado_efectivo(). Postgres revisa EXECUTE de las
-- funciones de una vista con el rol que consulta (no con el propietario) y anon no tiene USAGE en
-- privado ni EXECUTE en la función, así que `GET /rest/v1/negocio_publico` como anon daba 401
-- «permission denied for function estado_efectivo». La landing y el registro (C1) no podían leer
-- el negocio. En lugar de abrirle privado a anon (P-02 y P-03 exigen que anon no tenga nada),
-- la vista incorpora el mismo criterio sin llamar a ninguna función propia:
--   estado = 'activo'  o  estado = 'prueba' con fin_prueba nulo o aún no vencido.
-- (privado.estado_efectivo trata la prueba vencida como pausa, RF-COB-03.)
create or replace view public.negocio_publico
  with (security_invoker = false)
as
select n.slug, n.nombre, n.logo_path, n.color,
       t.sellos_meta, t.recompensa, t.sello_bienvenida, t.limite_modo, t.limite_minutos
from public.negocio n
join public.tarjeta_config t on t.negocio_id = n.id
where n.alta_ts is not null
  and (
    n.estado = 'activo'
    or (n.estado = 'prueba' and (n.fin_prueba is null or n.fin_prueba >= now()))
  );
