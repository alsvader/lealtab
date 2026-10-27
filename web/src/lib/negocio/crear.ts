import "server-only";
import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";
import { esCliente } from "@/lib/auth/codigo-dueno";
import { giroNegocio, inicialesNegocio, slugBase, textoNegocio, whatsappNegocio, zonaNegocio } from "@/lib/negocio/alta";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { crearClienteServidor } from "@/lib/supabase/server";

const LOGO_MAX = 512 * 1024;
const TIPOS: Record<string, "png" | "jpg" | "webp"> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export type AltaNegocio = {
  nombre: unknown;
  giro: unknown;
  ciudad: unknown;
  whatsapp: unknown;
  zona: unknown;
  logo?: { type: string; bytes: Uint8Array } | null;
};

export async function crearNegocioDelDueno(alta: AltaNegocio): Promise<
  | { ok: true; slug: string; zona: string; iniciales: string; rol: string }
  | { ok: false; status: number }
> {
  const nombre = textoNegocio(alta.nombre, 80);
  const ciudad = textoNegocio(alta.ciudad, 80);
  const giro = giroNegocio(alta.giro);
  const whatsapp = whatsappNegocio(alta.whatsapp);
  if (!nombre || !ciudad || !giro || !whatsapp) return { ok: false, status: 400 };

  const sesion = await crearClienteServidor("dueno");
  const { data, error } = await sesion.auth.getUser();
  const usuario = data.user;
  const correo = usuario?.email?.toLowerCase();
  if (error || !usuario || !correo) return { ok: false, status: 401 };
  if (await esCliente(usuario)) return { ok: false, status: 403 };

  const zona = zonaNegocio(alta.zona);
  const logo = await guardarLogo(alta.logo ?? null);
  if (logo === "invalido") return { ok: false, status: 400 };

  const creado = await fetch(`${env.supabaseUrl()}/rest/v1/rpc/crear_negocio`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey()}`,
      apikey: env.supabaseSecretKey(),
      "Content-Type": "application/json",
      "Content-Profile": "servidor",
    },
    body: JSON.stringify({
      p_user_id: usuario.id,
      p_nombre: nombre,
      p_giro: giro,
      p_ciudad: ciudad,
      p_whatsapp: whatsapp,
      p_correo: correo,
      p_zona: zona,
      p_logo_path: logo,
      p_slug_base: slugBase(nombre),
    }),
  });
  if (!creado.ok) return { ok: false, status: 409 };

  const cuerpo = (await creado.json()) as { slug?: string };
  const admin = crearClienteAdmin();
  const meta = { ...(usuario.app_metadata ?? {}), rol: "dueno" };
  const rolPuesto = await admin.auth.admin.updateUserById(usuario.id, { app_metadata: meta });
  if (rolPuesto.error) return { ok: false, status: 500 };
  const refrescada = await sesion.auth.refreshSession();
  const rol = refrescada.data.user?.app_metadata?.rol;
  return {
    ok: true,
    slug: cuerpo.slug ?? "",
    zona,
    iniciales: inicialesNegocio(nombre),
    rol: typeof rol === "string" ? rol : "dueno",
  };
}

async function guardarLogo(logo: AltaNegocio["logo"]): Promise<string | null | "invalido"> {
  if (!logo) return null;
  const ext = TIPOS[logo.type];
  if (!ext || logo.bytes.byteLength === 0 || logo.bytes.byteLength > LOGO_MAX) return "invalido";
  const ruta = `logos/${randomUUID()}.${ext}`;
  const admin = crearClienteAdmin();
  const subida = await admin.storage.from("logos").upload(ruta.slice("logos/".length), logo.bytes, {
    contentType: logo.type,
    upsert: false,
  });
  if (subida.error) return "invalido";
  return ruta;
}

export async function bytesDeLogo(slug: string): Promise<{ bytes: Blob; type: string } | null> {
  const respuesta = await fetch(
    `${env.supabaseUrl()}/rest/v1/negocio?slug=eq.${encodeURIComponent(slug)}&select=logo_path`,
    {
      headers: {
        Authorization: `Bearer ${env.supabaseSecretKey()}`,
        apikey: env.supabaseSecretKey(),
      },
    },
  );
  if (!respuesta.ok) return null;
  const filas = (await respuesta.json()) as { logo_path: string | null }[];
  const ruta = filas[0]?.logo_path;
  if (!ruta?.startsWith("logos/")) return null;
  const archivo = await crearClienteAdmin().storage.from("logos").download(ruta.slice("logos/".length));
  if (archivo.error || !archivo.data) return null;
  const type = ruta.endsWith(".png") ? "image/png" : ruta.endsWith(".webp") ? "image/webp" : "image/jpeg";
  return { bytes: archivo.data, type };
}
