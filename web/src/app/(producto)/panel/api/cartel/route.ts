import { CABECERAS_SIN_CACHE } from "@/lib/supabase/cookies";
import {
  completarAlta,
  destinoQr,
  pdfCartel,
  pngCartel,
  registrarDescarga,
  tamanoCartel,
} from "@/lib/negocio/cartel";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const formato = url.searchParams.get("formato");
  const duracion = Number(url.searchParams.get("duracion_s") ?? "0");
  const alta = await completarAlta(Number.isFinite(duracion) ? duracion : 0);
  if (!alta) return Response.json({ ok: false }, { status: 401, headers: CABECERAS_SIN_CACHE });

  const destino = destinoQr(url.origin, alta.slug);
  if (formato === "png" || formato === "pdf") {
    await registrarDescarga(alta.id);
    if (formato === "png") {
      const png = await pngCartel(destino);
      return new Response(new Uint8Array(png), {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="cartel-${alta.slug}.png"`,
          "X-Qr-Destino": destino,
        },
      });
    }
    const pdf = await pdfCartel(destino, tamanoCartel(url.searchParams.get("tamano")));
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cartel-${alta.slug}.pdf"`,
        "X-Qr-Destino": destino,
      },
    });
  }

  return Response.json(
    {
      ok: true,
      slug: alta.slug,
      finPrueba: alta.fin_prueba,
      tanda: alta.tanda,
      version: alta.version_producto,
      destino,
    },
    { headers: CABECERAS_SIN_CACHE },
  );
}
