import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { codigoNormalizado } from "@/lib/auth/codigo-dueno";
import { CUERPO_CODIGO, CUERPO_RECHAZO, telefonoDeEntrada, verificarCodigoCliente } from "@/lib/auth/codigo-cliente";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { telefono?: unknown; codigo?: unknown } | null;
  const telefono = telefonoDeEntrada(cuerpo?.telefono);
  const codigo = codigoNormalizado(cuerpo?.codigo);
  if (!telefono || !codigo) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  const ok = await verificarCodigoCliente(telefono, codigo).catch(() => false);
  if (!ok) return Response.json(CUERPO_RECHAZO, { status: 401, headers: CABECERAS_SIN_CACHE });
  return Response.json(CUERPO_CODIGO, { headers: CABECERAS_SIN_CACHE });
}
