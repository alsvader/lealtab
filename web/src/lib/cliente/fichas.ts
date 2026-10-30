import "server-only";
import { bytesDeBytea, hexDe } from "@/lib/qr/hmac";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { crearClienteServidor } from "@/lib/supabase/server";

export type FichaCliente = {
  tarjetaId: string;
  negocioId: string;
  slug: string;
  negocio: string;
  nombre: string;
  sellos: number;
  meta: number;
  recompensa: string;
  limiteModo: string;
  limiteMinutos: number | null;
};

export type TarjetaVista = FichaCliente & { llaveHex: string };

export type ContextoRegistro =
  | { tipo: "nueva" }
  | { tipo: "ya"; sellos: number; meta: number }
  | { tipo: "segundo"; last4: string; nombrePrevio: string | null };

/** La vista mis_tarjetas mira el rol del JWT. Aquí leemos con la llave de servicio, solo del usuario ya comprobado. */
async function fichasDe(userId: string): Promise<FichaCliente[]> {
  const admin = crearClienteAdmin();
  const { data: identidad } = await admin.from("identidad").select("id").eq("auth_user_id", userId).maybeSingle();
  if (!identidad) return [];
  const { data: fichas } = await admin
    .from("cliente_negocio")
    .select("id, nombre, negocio_id, alta_ts")
    .eq("identidad_id", identidad.id)
    .order("alta_ts", { ascending: false });
  if (!fichas?.length) return [];
  const ids = fichas.map((f) => f.negocio_id);
  const negocios = await admin.from("negocio").select("id, slug, nombre").in("id", ids);
  const configs = await admin.from("tarjeta_config").select("negocio_id, recompensa, limite_modo, limite_minutos").in("negocio_id", ids);
  const tarjetas = await admin
    .from("tarjeta_cliente")
    .select("id, cliente_negocio_id, sellos, meta_ciclo")
    .in("cliente_negocio_id", fichas.map((f) => f.id));
  const porNegocio = new Map((negocios.data ?? []).map((n) => [n.id, n]));
  const porConfig = new Map((configs.data ?? []).map((c) => [c.negocio_id, c]));
  const porFicha = new Map((tarjetas.data ?? []).map((t) => [t.cliente_negocio_id, t]));
  return fichas.flatMap((ficha) => {
    const negocio = porNegocio.get(ficha.negocio_id);
    const tarjeta = porFicha.get(ficha.id);
    const config = porConfig.get(ficha.negocio_id);
    if (!negocio || !tarjeta || !config) return [];
    return [{
      tarjetaId: tarjeta.id,
      negocioId: negocio.id,
      slug: negocio.slug,
      negocio: negocio.nombre,
      nombre: ficha.nombre,
      sellos: tarjeta.sellos,
      meta: tarjeta.meta_ciclo,
      recompensa: config.recompensa,
      limiteModo: config.limite_modo,
      limiteMinutos: config.limite_minutos,
    }];
  });
}

async function usuarioCliente() {
  const sesion = await crearClienteServidor("cliente");
  const { data, error } = await sesion.auth.getUser();
  if (error || !data.user || data.user.app_metadata?.rol !== "cliente") return null;
  return data.user;
}

export async function contextoRegistro(slug: string): Promise<ContextoRegistro> {
  const usuario = await usuarioCliente();
  if (!usuario) return { tipo: "nueva" };
  const fichas = await fichasDe(usuario.id);
  const esta = fichas.find((f) => f.slug === slug);
  if (esta) return { tipo: "ya", sellos: esta.sellos, meta: esta.meta };
  const digitos = (usuario.phone ?? "").replace(/\D/g, "");
  const nacional = digitos.startsWith("52") && digitos.length === 12 ? digitos.slice(2) : digitos;
  return { tipo: "segundo", last4: nacional.slice(-4), nombrePrevio: fichas[0]?.nombre ?? null };
}

export async function tarjetasDeLaSesion(): Promise<FichaCliente[] | null> {
  const usuario = await usuarioCliente();
  if (!usuario) return null;
  return fichasDe(usuario.id);
}

export async function leerTarjeta(slug: string): Promise<TarjetaVista | null> {
  const usuario = await usuarioCliente();
  if (!usuario) return null;
  const ficha = (await fichasDe(usuario.id)).find((f) => f.slug === slug);
  if (!ficha) return null;
  const { data } = await crearClienteAdmin().from("tarjeta_llave").select("llave_hmac").eq("tarjeta_id", ficha.tarjetaId).maybeSingle();
  if (!data?.llave_hmac) return null;
  const bytes = bytesDeBytea(data.llave_hmac);
  if (!bytes || bytes.length !== 32) return null;
  return { ...ficha, llaveHex: hexDe(bytes) };
}

/** «1 sello por día», «1 sello cada N horas», o nada si es sin límite. X fraccionario sigue por definir. */
export function lineaLimite(modo: string, minutos: number | null): string | null {
  if (modo === "sin_limite") return null;
  if (modo === "por_dia") return "1 sello por día";
  if (modo === "cada_x_horas" && minutos && minutos % 60 === 0) {
    const horas = minutos / 60;
    return horas === 1 ? "1 sello cada 1 hora" : `1 sello cada ${horas} horas`;
  }
  return null;
}
