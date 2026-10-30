import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { codigoNormalizado } from "@/lib/auth/codigo-dueno";
import { CUERPO_CODIGO, CUERPO_RECHAZO, registrarCliente, telefonoDeEntrada, verificarCodigoCliente } from "@/lib/auth/codigo-cliente";

type Cuerpo = { telefono?: unknown; codigo?: unknown; nombre?: unknown; slug?: unknown; acepto?: unknown; cerrarOtras?: unknown };

export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as Cuerpo | null;
  const telefono = telefonoDeEntrada(cuerpo?.telefono);
  const codigo = codigoNormalizado(cuerpo?.codigo);
  if (!telefono || !codigo) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });

  const slug = typeof cuerpo?.slug === "string" ? cuerpo.slug : "";
  const nombre = typeof cuerpo?.nombre === "string" ? cuerpo.nombre.trim() : "";
  if (slug && (cuerpo?.acepto !== true || nombre.length < 1 || nombre.length > 60)) {
    return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  }

  const userId = await verificarCodigoCliente(telefono, codigo, cuerpo?.cerrarOtras === true).catch(() => null);
  if (!userId) return Response.json(CUERPO_RECHAZO, { status: 401, headers: CABECERAS_SIN_CACHE });
  if (!slug) return Response.json(CUERPO_CODIGO, { headers: CABECERAS_SIN_CACHE });

  const tarjeta = await registrarCliente(userId, slug, nombre);
  if (!tarjeta) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  return Response.json({ ok: true, sellos: tarjeta.sellos, bienvenida: tarjeta.bienvenida }, { headers: CABECERAS_SIN_CACHE });
}
