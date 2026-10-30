import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { CUERPO_CODIGO, CUERPO_RECHAZO, pedirCodigoCliente, telefonoDeEntrada } from "@/lib/auth/codigo-cliente";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { telefono?: unknown } | null;
  const telefono = telefonoDeEntrada(cuerpo?.telefono);
  if (!telefono) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  await pedirCodigoCliente(telefono).catch(() => undefined);
  return Response.json(CUERPO_CODIGO, { headers: CABECERAS_SIN_CACHE });
}
