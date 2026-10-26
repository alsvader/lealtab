-- Migración 8 (ADR-006 §2.3, §2.4): filas iniciales de config_plataforma y bucket logos.
-- Valores aprobados el 22 oct 2026 (ADR-003 §2.8); editables sin desplegar.

insert into public.config_plataforma (clave, valor) values
  ('tanda_actual', '1'),
  ('codigo_tope_dia', '400'),
  ('codigo_aviso_dia', '200'),
  ('codigo_por_telefono_hora', '3'),
  ('codigo_por_telefono_dia', '10'),
  ('codigo_por_ip_hora', '10'),
  ('saldo_alerta', '300')
on conflict (clave) do nothing;

-- Bucket privado de logos. En local lo crea config.toml después de las migraciones; en
-- producción lo crea esto. Si el esquema storage aún no existe, no se hace nada.
do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('logos', 'logos', false, 524288, array['image/png','image/jpeg','image/webp'])
    on conflict (id) do nothing;
  end if;
end
$$;
