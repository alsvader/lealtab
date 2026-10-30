/** Cliente de POST /v2/otp. Supabase genera el código; aquí solo se envía. */

export const URL_OTP = "https://api.smsmasivos.com.mx/v2/otp";
export const EMPRESA = "LealTab";
/** GSM-7, sin acentos. WhatsApp ignora este texto y usa la plantilla del proveedor. */
export const MENSAJE_SMS = "{{company}}: tu clave es {{code}}. Vence en 10 min. No la compartas.";

const ESPERA_MS = 4_000;

export type CanalEnvio = "whatsapp" | "sms";
export type FetchOtp = (url: string, init?: RequestInit) => Promise<Response>;

export type ResultadoEnvio =
  | { ok: true; requestId: string | null }
  | { ok: false; status: number; reintentable: boolean };

export type PedidoEnvio = {
  telefono: string;
  codigo: string;
  canal: CanalEnvio;
  sandbox: boolean;
  apiKey: string;
  ahora?: Date;
  timeoutMs?: number;
  fetchImpl?: FetchOtp;
};

export function mensajeExpandido(codigo: string, empresa = EMPRESA): string {
  return MENSAJE_SMS.replaceAll("{{code}}", codigo).replaceAll("{{company}}", empresa);
}

/** `YYYY-MM-DD HH:mm:ss` en UTC, 10 minutos después de `desde`. */
export function venceEnDiezMinutos(desde: Date): string {
  const fin = new Date(desde.getTime() + 10 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${fin.getUTCFullYear()}-${p(fin.getUTCMonth() + 1)}-${p(fin.getUTCDate())} ${p(fin.getUTCHours())}:${p(fin.getUTCMinutes())}:${p(fin.getUTCSeconds())}`;
}

function esAbort(error: unknown): boolean {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}

export async function enviarOtp(pedido: PedidoEnvio): Promise<ResultadoEnvio> {
  const cuerpo: Record<string, unknown> = {
    phone_number: pedido.telefono.replace(/\D/g, "").slice(-10),
    country_code: "52",
    channel: pedido.canal,
    company: EMPRESA,
    message: MENSAJE_SMS,
    code_custom: pedido.codigo,
    expiration_date: venceEnDiezMinutos(pedido.ahora ?? new Date()),
  };
  if (pedido.sandbox) cuerpo.sandbox = true;

  const fetcher = pedido.fetchImpl ?? fetch;
  let respuesta: Response;
  try {
    respuesta = await fetcher(URL_OTP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: pedido.apiKey,
      },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(pedido.timeoutMs ?? ESPERA_MS),
    });
  } catch (error) {
    return { ok: false, status: 0, reintentable: esAbort(error) || error instanceof TypeError };
  }

  const texto = await respuesta.text();
  let datos: { error?: unknown; request_id?: unknown } = {};
  if (texto) {
    try {
      datos = JSON.parse(texto) as { error?: unknown; request_id?: unknown };
    } catch {
      return { ok: false, status: respuesta.status, reintentable: respuesta.status >= 500 };
    }
  }

  if (datos.error != null) {
    return { ok: false, status: respuesta.status, reintentable: respuesta.status >= 500 };
  }
  if (respuesta.status === 200 || respuesta.status === 201) {
    return { ok: true, requestId: typeof datos.request_id === "string" ? datos.request_id : null };
  }
  return { ok: false, status: respuesta.status, reintentable: respuesta.status >= 500 };
}
