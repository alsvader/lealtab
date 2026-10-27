import "server-only";
import { env } from "@/lib/env";
import { textoNegocio } from "@/lib/negocio/alta";
import { VERSION_PRODUCTO } from "@/lib/version";
import { crearClienteServidor } from "@/lib/supabase/server";

function cabeceras() {
  return {
    Authorization: `Bearer ${env.supabaseSecretKey()}`,
    apikey: env.supabaseSecretKey(),
    "Content-Type": "application/json",
  };
}

export function sellosValidos(valor: unknown): number | null {
  const n = typeof valor === "number" ? valor : typeof valor === "string" ? Number(valor) : NaN;
  if (!Number.isInteger(n) || n < 4 || n > 12) return null;
  return n;
}

export async function guardarTarjeta(entrada: {
  sellos: unknown;
  recompensa: unknown;
  bienvenida: unknown;
}): Promise<{ ok: true; primera: boolean } | { ok: false; status: number }> {
  const sellos = sellosValidos(entrada.sellos);
  const recompensa = textoNegocio(entrada.recompensa, 80);
  if (!sellos || !recompensa || typeof entrada.bienvenida !== "boolean") return { ok: false, status: 400 };

  const sesion = await crearClienteServidor("dueno");
  const { data, error } = await sesion.auth.getUser();
  if (error || !data.user) return { ok: false, status: 401 };

  const dueno = await fetch(
    `${env.supabaseUrl()}/rest/v1/dueno_negocio?user_id=eq.${data.user.id}&select=negocio_id`,
    { headers: cabeceras() },
  );
  const negocios = (await dueno.json()) as { negocio_id: string }[];
  const negocioId = negocios[0]?.negocio_id;
  if (!negocioId) return { ok: false, status: 409 };

  const previa = await fetch(
    `${env.supabaseUrl()}/rest/v1/tarjeta_config?negocio_id=eq.${negocioId}&select=negocio_id`,
    { headers: cabeceras() },
  );
  const ya = ((await previa.json()) as { negocio_id: string }[]).length > 0;
  const fila = {
    negocio_id: negocioId,
    sellos_meta: sellos,
    recompensa,
    sello_bienvenida: entrada.bienvenida,
  };
  const guardada = ya
    ? await fetch(`${env.supabaseUrl()}/rest/v1/tarjeta_config?negocio_id=eq.${negocioId}`, {
        method: "PATCH",
        headers: cabeceras(),
        body: JSON.stringify({
          sellos_meta: sellos,
          recompensa,
          sello_bienvenida: entrada.bienvenida,
          actualizado_ts: new Date().toISOString(),
        }),
      })
    : await fetch(`${env.supabaseUrl()}/rest/v1/tarjeta_config`, {
        method: "POST",
        headers: { ...cabeceras(), Prefer: "return=minimal" },
        body: JSON.stringify(fila),
      });
  if (!guardada.ok) return { ok: false, status: 500 };

  if (!ya) {
    const evento = await fetch(`${env.supabaseUrl()}/rest/v1/evento_uso`, {
      method: "POST",
      headers: { ...cabeceras(), Prefer: "return=minimal" },
      body: JSON.stringify({
        nombre: "tarjeta_configurada",
        negocio_id: negocioId,
        emisor: "panel",
        version_producto: VERSION_PRODUCTO,
        props: {},
      }),
    });
    if (!evento.ok) return { ok: false, status: 500 };
  }
  return { ok: true, primera: !ya };
}
