import "server-only";
import { Webhook } from "standardwebhooks";
import { env } from "@/lib/env";
import { enviarOtp, type CanalEnvio, type FetchOtp, type ResultadoEnvio } from "@/lib/auth/sms-masivos";

export type AutorizacionEnvio = {
  permitido: boolean;
  motivo: string | null;
  canal_intencion: string;
  id: number;
};

/** El secreto del panel viene como `v1,whsec_…`. La librería quiere el base64. */
export function secretoWebhook(valor: string): string {
  const sinVersion = valor.replace(/^v1,/, "");
  return sinVersion.startsWith("whsec_") ? sinVersion.slice("whsec_".length) : sinVersion;
}

/** 10 dígitos nacionales, o un E.164 +52 ya armado. */
export function telefonoMexico(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 10) return `+52${digitos}`;
  if (digitos.length === 12 && digitos.startsWith("52")) return `+${digitos}`;
  return null;
}

/** Línea fija. No incluye el código ni el teléfono: el test lo exige. */
export function lineaHookEnviado(otp: string, telefono: string): string {
  const linea = "[HOOK] enviado";
  const nacional = telefono.replace(/\D/g, "").slice(-10);
  if ((otp && linea.includes(otp)) || (nacional.length === 10 && linea.includes(nacional))) {
    throw new Error("el log no puede llevar el código ni el teléfono");
  }
  return linea;
}

export function firmaValida(cuerpo: string, encabezados: Headers): boolean {
  try {
    const wh = new Webhook(secretoWebhook(env.sendSmsHookSecret()));
    wh.verify(cuerpo, {
      "webhook-id": encabezados.get("webhook-id") ?? "",
      "webhook-timestamp": encabezados.get("webhook-timestamp") ?? "",
      "webhook-signature": encabezados.get("webhook-signature") ?? "",
    });
    return true;
  } catch {
    return false;
  }
}

async function rpc<T>(nombre: string, body: unknown): Promise<T | null> {
  const respuesta = await fetch(`${env.supabaseUrl()}/rest/v1/rpc/${nombre}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey()}`,
      apikey: env.supabaseSecretKey(),
      "Content-Type": "application/json",
      "Content-Profile": "servidor",
    },
    body: JSON.stringify(body),
  });
  if (!respuesta.ok) return null;
  return (await respuesta.json()) as T;
}

export function autorizarEnvio(telefono: string): Promise<AutorizacionEnvio | null> {
  return rpc("autorizar_envio_codigo", { p_telefono: telefono });
}

export type CierreEnvio = {
  resultado: "enviado" | "enviado_por_respaldo" | "fallido";
  canal: CanalEnvio | null;
  requestId: string | null;
};

export async function cerrarEnvio(id: number, cierre: CierreEnvio): Promise<void> {
  await fetch(`${env.supabaseUrl()}/rest/v1/envio_codigo?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey()}`,
      apikey: env.supabaseSecretKey(),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      resultado: cierre.resultado,
      canal: cierre.canal,
      request_id: cierre.requestId,
    }),
  });
}

export type DependenciasHook = {
  autorizar?: (telefono: string) => Promise<AutorizacionEnvio | null>;
  cerrar?: (id: number, cierre: CierreEnvio) => Promise<void>;
  fetchImpl?: FetchOtp;
};

type Carga = { user?: { phone?: string }; sms?: { otp?: string } };

/** Un 200 del proveedor con `error` no puede volver como 200: Auth lo tomaría como envío hecho. */
function respuestaFallo(resultado: ResultadoEnvio): Response {
  const status = !resultado.ok && resultado.status >= 400 ? resultado.status : 502;
  return Response.json({ error: { http_code: status, message: "envio" } }, { status });
}

export async function recibirHook(
  cuerpo: string,
  encabezados: Headers,
  deps?: DependenciasHook,
): Promise<Response> {
  env.smsProviderMode();
  if (!firmaValida(cuerpo, encabezados)) return new Response(null, { status: 401 });

  let carga: Carga;
  try {
    carga = JSON.parse(cuerpo) as Carga;
  } catch {
    return new Response(null, { status: 400 });
  }
  const telefono = telefonoMexico(carga.user?.phone);
  const otp = carga.sms?.otp ?? "";
  if (!telefono || !/^\d{6}$/.test(otp)) {
    return Response.json({ error: { http_code: 400, message: "telefono" } }, { status: 400 });
  }

  const autorizado = await (deps?.autorizar ?? autorizarEnvio)(telefono);
  if (!autorizado) return Response.json({ error: { http_code: 400, message: "telefono" } }, { status: 400 });
  if (!autorizado.permitido) {
    return Response.json({ error: { http_code: 429, message: "limite" } }, { status: 429 });
  }

  const cerrar = deps?.cerrar ?? cerrarEnvio;
  if (env.smsProviderMode() === "stub") {
    console.info(lineaHookEnviado(otp, telefono));
    await cerrar(autorizado.id, { resultado: "enviado", canal: "whatsapp", requestId: null });
    return new Response(null, { status: 200 });
  }

  const sandbox = env.smsProviderMode() === "sandbox";
  const apiKey = env.smsMasivosApiKey();
  const primero: CanalEnvio = autorizado.canal_intencion === "sms" ? "sms" : "whatsapp";
  const intento = (canal: CanalEnvio) =>
    enviarOtp({
      telefono,
      codigo: otp,
      canal,
      sandbox,
      apiKey,
      fetchImpl: deps?.fetchImpl,
    });

  const inicial = await intento(primero);
  if (inicial.ok) {
    console.info(lineaHookEnviado(otp, telefono));
    await cerrar(autorizado.id, { resultado: "enviado", canal: primero, requestId: inicial.requestId });
    return new Response(null, { status: 200 });
  }

  if (primero === "whatsapp" && inicial.reintentable) {
    const respaldo = await intento("sms");
    if (respaldo.ok) {
      console.info(lineaHookEnviado(otp, telefono));
      await cerrar(autorizado.id, {
        resultado: "enviado_por_respaldo",
        canal: "sms",
        requestId: respaldo.requestId,
      });
      return new Response(null, { status: 200 });
    }
    await cerrar(autorizado.id, { resultado: "fallido", canal: "sms", requestId: null });
    return respuestaFallo(respaldo);
  }

  await cerrar(autorizado.id, { resultado: "fallido", canal: primero, requestId: null });
  return respuestaFallo(inicial);
}
