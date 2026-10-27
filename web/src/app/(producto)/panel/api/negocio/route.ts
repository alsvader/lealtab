import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import { crearNegocioDelDueno } from "@/lib/negocio/crear";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ ok: false }, { status: 400, headers: CABECERAS_SIN_CACHE });
  const archivo = form.get("logo");
  let logo: { type: string; bytes: Uint8Array } | null = null;
  if (archivo instanceof File && archivo.size > 0) {
    logo = { type: archivo.type, bytes: new Uint8Array(await archivo.arrayBuffer()) };
  }
  const resultado = await crearNegocioDelDueno({
    nombre: form.get("nombre"),
    giro: form.get("giro"),
    ciudad: form.get("ciudad"),
    whatsapp: form.get("whatsapp"),
    zona: form.get("zona"),
    logo,
  });
  return Response.json(resultado, { status: resultado.ok ? 200 : resultado.status, headers: CABECERAS_SIN_CACHE });
}
