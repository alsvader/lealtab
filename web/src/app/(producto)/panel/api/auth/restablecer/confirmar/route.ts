import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { CUERPO_RECHAZO, codigoNormalizado, correoNormalizado } from "@/lib/auth/codigo-dueno";
import { cerrarOtrasSesiones, contrasenaValida } from "@/lib/auth/intentos-dueno";
import { confirmarRestablecer } from "@/lib/auth/contrasena-dueno";

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as {
    correo?: unknown;
    codigo?: unknown;
    contrasena?: unknown;
    cerrarOtras?: unknown;
  } | null;
  const correo = correoNormalizado(cuerpo?.correo);
  const codigo = codigoNormalizado(cuerpo?.codigo);
  const contrasena = typeof cuerpo?.contrasena === "string" ? cuerpo.contrasena : "";
  if (!correo || !codigo) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  if (!contrasenaValida(contrasena)) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  const resultado = await confirmarRestablecer(correo, codigo, contrasena, cerrarOtrasSesiones(cuerpo?.cerrarOtras)).catch(
    () => "rechazado" as const,
  );
  if (resultado !== "ok") return Response.json(CUERPO_RECHAZO, { status: 401, headers: CABECERAS_SIN_CACHE });
  return Response.json({ ok: true }, { headers: CABECERAS_SIN_CACHE });
}
