import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { tarjetasDeLaSesion } from "@/lib/cliente/fichas";

export async function GET() {
  const tarjetas = await tarjetasDeLaSesion();
  if (!tarjetas) return Response.json({ ok: false }, { status: 401, headers: CABECERAS_SIN_CACHE });
  return Response.json(
    { ok: true, tarjetas: tarjetas.map((t) => ({ negocio: t.negocio, slug: t.slug, sellos: t.sellos, meta: t.meta })) },
    { headers: CABECERAS_SIN_CACHE },
  );
}
