import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { CUERPO_RECHAZO, registrarCliente } from "@/lib/auth/codigo-cliente";
import { crearClienteServidor } from "@/lib/supabase/server";

type Cuerpo = { slug?: unknown; nombre?: unknown; acepto?: unknown };

/** Alta en otro negocio con la sesión ya abierta. No pide código. */
export async function POST(request: Request) {
  const cuerpo = (await request.json().catch(() => null)) as Cuerpo | null;
  const slug = typeof cuerpo?.slug === "string" ? cuerpo.slug : "";
  const nombre = typeof cuerpo?.nombre === "string" ? cuerpo.nombre.trim() : "";
  if (!slug || cuerpo?.acepto !== true || nombre.length < 1 || nombre.length > 60) {
    return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  }

  const sesion = await crearClienteServidor("cliente");
  const { data, error } = await sesion.auth.getUser();
  if (error || !data.user || data.user.app_metadata?.rol !== "cliente") {
    return Response.json(CUERPO_RECHAZO, { status: 401, headers: CABECERAS_SIN_CACHE });
  }

  const tarjeta = await registrarCliente(data.user.id, slug, nombre);
  if (!tarjeta) return Response.json(CUERPO_RECHAZO, { status: 400, headers: CABECERAS_SIN_CACHE });
  return Response.json({ ok: true, sellos: tarjeta.sellos, bienvenida: tarjeta.bienvenida }, { headers: CABECERAS_SIN_CACHE });
}
