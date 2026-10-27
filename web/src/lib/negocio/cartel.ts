import "server-only";
import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { env } from "@/lib/env";
import { VERSION_PRODUCTO } from "@/lib/version";
import { crearClienteServidor } from "@/lib/supabase/server";

export const TAMANOS = {
  carta: { ancho: 612, alto: 792 },
  media: { ancho: 612, alto: 396 },
  sticker: { ancho: 283, alto: 283 },
} as const;

export type TamanoCartel = keyof typeof TAMANOS;

/** El QR abre el registro del cliente en /c/{slug}. No suma sellos. */
export function destinoQr(origen: string, slug: string): string {
  return `${origen.replace(/\/$/, "")}/c/${slug}`;
}

export function tamanoCartel(valor: unknown): TamanoCartel {
  return valor === "media" || valor === "sticker" ? valor : "carta";
}

export type AltaCerrada = {
  id: string;
  slug: string;
  alta_ts: string;
  fin_prueba: string;
  tanda: number;
  version_producto: string;
};

function cabeceras() {
  return {
    Authorization: `Bearer ${env.supabaseSecretKey()}`,
    apikey: env.supabaseSecretKey(),
    "Content-Type": "application/json",
  };
}

export async function completarAlta(duracionSegundos: number): Promise<AltaCerrada | null> {
  const sesion = await crearClienteServidor("dueno");
  const { data, error } = await sesion.auth.getUser();
  if (error || !data.user) return null;
  const respuesta = await fetch(`${env.supabaseUrl()}/rest/v1/rpc/completar_alta`, {
    method: "POST",
    cache: "no-store",
    headers: { ...cabeceras(), "Content-Profile": "servidor" },
    body: JSON.stringify({
      p_user_id: data.user.id,
      p_version: VERSION_PRODUCTO,
      p_duracion_s: duracionSegundos,
    }),
  });
  if (!respuesta.ok) return null;
  return (await respuesta.json()) as AltaCerrada;
}

export async function registrarDescarga(negocioId: string): Promise<void> {
  await fetch(`${env.supabaseUrl()}/rest/v1/evento_uso`, {
    method: "POST",
    headers: { ...cabeceras(), Prefer: "return=minimal" },
    body: JSON.stringify({
      nombre: "qr_mostrador_descargado",
      negocio_id: negocioId,
      emisor: "panel",
      version_producto: VERSION_PRODUCTO,
      props: {},
    }),
  });
}

export async function pngCartel(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, { type: "png", margin: 1, width: 480, errorCorrectionLevel: "M" });
}

export async function pdfCartel(url: string, tamano: TamanoCartel): Promise<Uint8Array> {
  const { ancho, alto } = TAMANOS[tamano];
  const pdf = await PDFDocument.create();
  const pagina = pdf.addPage([ancho, alto]);
  const fuente = await pdf.embedFont(StandardFonts.Helvetica);
  const imagen = await pdf.embedPng(await pngCartel(url));
  const lado = Math.min(ancho, alto) * 0.45;
  pagina.drawImage(imagen, { x: (ancho - lado) / 2, y: alto * 0.32, width: lado, height: lado });
  const titulo = "Escaneame con tu camara";
  pagina.drawText(titulo, { x: 36, y: Math.max(72, alto * 0.18), size: 12, font: fuente, color: rgb(0.06, 0.16, 0.13) });
  pagina.drawText("Hecho con LealTab", { x: 36, y: 28, size: 11, font: fuente, color: rgb(0.06, 0.16, 0.13) });
  return pdf.save();
}
