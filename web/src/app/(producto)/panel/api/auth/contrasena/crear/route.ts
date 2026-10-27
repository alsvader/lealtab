import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { CUERPO_RECHAZO } from "@/lib/auth/codigo-dueno";
import { contrasenaValida } from "@/lib/auth/intentos-dueno";
import { crearContrasena } from "@/lib/auth/contrasena-dueno";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { contrasena?: unknown } | null;
  const contrasena = typeof cuerpo?.contrasena === "string" ? cuerpo.contrasena : "";
  if (!contrasenaValida(contrasena)) {
    return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  }
  const resultado = await crearContrasena(contrasena);
  if (resultado !== "ok") return Response.json(CUERPO_RECHAZO, { status: 401, headers: CABECERAS_SIN_CACHE });
  return Response.json({ ok: true }, { headers: CABECERAS_SIN_CACHE });
}
