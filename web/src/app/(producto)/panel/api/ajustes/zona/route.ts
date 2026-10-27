import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { guardarZonaDueno } from "@/lib/negocio/ajustes";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { zona?: unknown } | null;
  const resultado = await guardarZonaDueno(cuerpo?.zona);
  if (resultado === "ok") return Response.json({ ok: true }, { headers: CABECERAS_SIN_CACHE });
  const status = resultado === "invalida" ? 400 : 401;
  return Response.json({ ok: false }, { status, headers: CABECERAS_SIN_CACHE });
}
