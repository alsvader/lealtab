import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { guardarTarjeta } from "@/lib/negocio/tarjeta";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as {
    sellos?: unknown;
    recompensa?: unknown;
    bienvenida?: unknown;
  } | null;
  const resultado = await guardarTarjeta({
    sellos: cuerpo?.sellos,
    recompensa: cuerpo?.recompensa,
    bienvenida: cuerpo?.bienvenida,
  });
  return Response.json(resultado, {
    status: resultado.ok ? 200 : resultado.status,
    headers: CABECERAS_SIN_CACHE,
  });
}
