import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import {
  CUERPO_CODIGO,
  CUERPO_RECHAZO,
  codigoNormalizado,
  correoNormalizado,
  verificarCodigoDueno,
} from "@/lib/auth/codigo-dueno";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { correo?: unknown; codigo?: unknown } | null;
  const correo = correoNormalizado(cuerpo?.correo);
  const codigo = codigoNormalizado(cuerpo?.codigo);
  if (!correo || !codigo) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  const ok = await verificarCodigoDueno(correo, codigo).catch(() => false);
  if (!ok) return Response.json(CUERPO_RECHAZO, { status: 401, headers: CABECERAS_SIN_CACHE });
  return Response.json(CUERPO_CODIGO, { headers: CABECERAS_SIN_CACHE });
}
