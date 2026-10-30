import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { crearClienteServidor } from "@/lib/supabase/server";

export async function POST() {
  const sesion = await crearClienteServidor("cliente");
  await sesion.auth.signOut();
  return Response.json({ ok: true }, { headers: CABECERAS_SIN_CACHE });
}
