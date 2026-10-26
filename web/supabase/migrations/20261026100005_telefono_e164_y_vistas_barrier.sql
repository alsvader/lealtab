-- H-04: los límites por teléfono (3/h, 10/día, bloqueo de 15 min) cuentan por cadena; si se admiten
-- variantes de formato se eluden. Solo E.164 de México, igual que negocio.whatsapp.
-- Las tablas están vacías en este punto.
alter table public.envio_codigo
  add constraint envio_codigo_telefono_e164 check (telefono ~ '^\+52\d{10}$');
alter table public.codigo_intento
  add constraint codigo_intento_telefono_e164 check (telefono ~ '^\+52\d{10}$');

-- H-08: defensa en profundidad. Las vistas definer filtran con WHERE; security_barrier impide que
-- el planificador evalúe un operador del llamante antes que el filtro de la vista.
alter view public.negocio_publico set (security_barrier = true);
alter view public.cliente_del_negocio set (security_barrier = true);
alter view public.mis_tarjetas set (security_barrier = true);
