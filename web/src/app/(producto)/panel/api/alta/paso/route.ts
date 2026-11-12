import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { pasoPendienteDueno } from "@/lib/negocio/crear";

export async function GET() {
  const paso = await pasoPendienteDueno();
  return Response.json({ paso: paso ?? "/panel/negocio" }, { headers: CABECERAS_SIN_CACHE });
}
