import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { correoNormalizado } from "@/lib/auth/codigo-dueno";
import { contrasenaValida } from "@/lib/auth/intentos-dueno";
import { cuerpoFallo, entrarConContrasena } from "@/lib/auth/contrasena-dueno";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as { correo?: unknown; contrasena?: unknown } | null;
  const correo = correoNormalizado(cuerpo?.correo);
  const contrasena = typeof cuerpo?.contrasena === "string" ? cuerpo.contrasena : "";
  if (!correo || !contrasenaValida(contrasena)) {
    return Response.json(cuerpoFallo(false), { status: 400, headers: CABECERAS_SIN_CACHE });
  }
  const resultado = await entrarConContrasena(correo, contrasena).catch(() => cuerpoFallo(false));
  return Response.json(resultado, { status: resultado.ok ? 200 : 401, headers: CABECERAS_SIN_CACHE });
}
