import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { CUERPO_CODIGO, CUERPO_RECHAZO, correoNormalizado } from "@/lib/auth/codigo-dueno";
import { pedirRestablecer } from "@/lib/auth/contrasena-dueno";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { correo?: unknown } | null;
  const correo = correoNormalizado(cuerpo?.correo);
  if (!correo) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  try {
    await pedirRestablecer(correo);
  } catch (error) {
    console.error("pedirRestablecer", error instanceof Error ? error.message : "error");
  }
  return Response.json(CUERPO_CODIGO, { headers: CABECERAS_SIN_CACHE });
}
