import "server-only";
import { ZONAS_MEXICO } from "@/lib/negocio/alta";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { crearClienteServidor } from "@/lib/supabase/server";

async function negocioIdDelDueno(): Promise<string | "sin-sesion" | "sin-negocio"> {
  const sesion = await crearClienteServidor("dueno");
  const { data, error } = await sesion.auth.getUser();
  if (error || !data.user) return "sin-sesion";
  const { data: vinculo } = await crearClienteAdmin()
    .from("dueno_negocio")
    .select("negocio_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return vinculo?.negocio_id ?? "sin-negocio";
}

export type NegocioAjustes = {
  nombre: string;
  giro: string;
  ciudad: string;
  zona: string;
};

export async function leerNegocioDueno(): Promise<NegocioAjustes | "sin-sesion" | "sin-negocio"> {
  const id = await negocioIdDelDueno();
  if (id === "sin-sesion" || id === "sin-negocio") return id;
  const { data } = await crearClienteAdmin()
    .from("negocio")
    .select("nombre, giro, ciudad, zona_horaria")
    .eq("id", id)
    .maybeSingle();
  if (!data) return "sin-negocio";
  return { nombre: data.nombre, giro: data.giro, ciudad: data.ciudad, zona: data.zona_horaria };
}

/** Solo una zona de la lista. No sustituye una zona ajena por la de la Ciudad de México. */
export async function guardarZonaDueno(zona: unknown): Promise<"ok" | "invalida" | "sin-sesion"> {
  if (typeof zona !== "string" || !(ZONAS_MEXICO as readonly string[]).includes(zona)) return "invalida";
  const id = await negocioIdDelDueno();
  if (id === "sin-sesion" || id === "sin-negocio") return "sin-sesion";
  const { error } = await crearClienteAdmin().from("negocio").update({ zona_horaria: zona }).eq("id", id);
  if (error) return "sin-sesion";
  return "ok";
}
