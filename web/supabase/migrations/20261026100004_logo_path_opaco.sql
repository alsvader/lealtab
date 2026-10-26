-- H-03 y H-07: logo_path ya no usa negocio_id (id interno que las vistas devolvían dentro de la ruta).
-- Nueva forma: `logos/<uuid>.<png|jpg|webp>`, con un uuid propio de cada logo (lo genera el servidor
-- al subirlo; es opaco y no se relaciona con negocio.id ni con el slug). Es lo más simple: no
-- agrega columnas y el CHECK impide `..`, `/` inicial, otras carpetas y extensiones raras.
-- (Un dueño aún podría apuntar al uuid de otro logo, pero es inadivinable y no se expone por anon;
-- el servidor, además, solo debe firmar rutas que él mismo guardó.)
-- La tabla negocio no tiene filas con logo en este punto del MVP.
update public.negocio set logo_path = null where logo_path is not null;
alter table public.negocio
  add constraint negocio_logo_path_forma check (
    logo_path is null
    or logo_path ~ '^logos/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$'
  );
