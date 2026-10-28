import "server-only";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import type { NegocioPublico } from "./publico-tipo";

export type { NegocioPublico };

/** Lo que ve C1. anon no puede leer la vista: la lee el servidor con la llave de servicio. */
export async function leerNegocioPublico(slug: string): Promise<NegocioPublico | null> {
  const { data } = await crearClienteAdmin()
    .from("negocio_publico")
    .select("slug, nombre, recompensa, sellos_meta")
    .eq("slug", slug)
    .maybeSingle();
  if (!data?.slug || !data.nombre || !data.recompensa || data.sellos_meta == null) return null;
  return { slug: data.slug, nombre: data.nombre, recompensa: data.recompensa, sellosMeta: data.sellos_meta };
}
