import "server-only";

/**
 * Variables de entorno del producto (arquitectura.md §2.4).
 * Lectura perezosa: nada se lee ni se valida al importar el módulo, así que
 * `pnpm build` y `pnpm lint` corren sin variables. Cada getter lanza un error
 * claro solo cuando se usa. Ninguna variable lleva prefijo público: el navegador
 * no habla con Supabase (RNF-STK-10).
 */

export const NOMBRES_ENTORNO = [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_DB_URL",
  "SUPABASE_DB_URL_MIGRACIONES",
  "SEND_SMS_HOOK_SECRET",
  "SMS_PROVIDER_MODE",
  "SMSMASIVOS_API_KEY",
  "RESEND_API_KEY",
  "ALERT_EMAIL_TO",
  "IP_HASH_PEPPER",
  "CRON_SECRET",
  "LT_ENV",
  "LT_COOKIE_SECURE",
] as const;

export type NombreEntorno = (typeof NOMBRES_ENTORNO)[number];

export type LtEnv = "local" | "preview" | "production";
export type SmsProviderMode = "stub" | "sandbox" | "live";

export class EntornoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntornoError";
  }
}

/** Valor sin espacios, o `undefined` si falta o está vacío. */
function leer(nombre: NombreEntorno): string | undefined {
  const valor = process.env[nombre]?.trim();
  return valor ? valor : undefined;
}

/** Valor obligatorio: lanza un error claro, sin mostrar el valor. */
export function requerida(nombre: NombreEntorno): string {
  const valor = leer(nombre);
  if (!valor) {
    throw new EntornoError(`Falta la variable de entorno ${nombre}. Revisa .env.local.example.`);
  }
  return valor;
}

function url(nombre: NombreEntorno): string {
  const valor = requerida(nombre);
  try {
    new URL(valor);
  } catch {
    throw new EntornoError(`${nombre} no es una URL válida.`);
  }
  return valor;
}

/** ¿Están las variables de Supabase que el producto necesita? Nunca lanza. */
export function supabaseConfigurado(): boolean {
  const urlValida = (() => {
    const v = leer("SUPABASE_URL");
    if (!v) return false;
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  })();
  return urlValida && !!leer("SUPABASE_PUBLISHABLE_KEY") && !!leer("SUPABASE_SECRET_KEY");
}

export function ltEnv(): LtEnv {
  const valor = requerida("LT_ENV");
  if (valor !== "local" && valor !== "preview" && valor !== "production") {
    throw new EntornoError("LT_ENV debe ser local, preview o production.");
  }
  return valor;
}

/** `stub` se niega a arrancar si `LT_ENV` no es `local`. */
export function smsProviderMode(): SmsProviderMode {
  const valor = requerida("SMS_PROVIDER_MODE");
  if (valor !== "stub" && valor !== "sandbox" && valor !== "live") {
    throw new EntornoError("SMS_PROVIDER_MODE debe ser stub, sandbox o live.");
  }
  if (valor === "stub" && ltEnv() !== "local") {
    throw new EntornoError("SMS_PROVIDER_MODE=stub solo se permite con LT_ENV=local.");
  }
  return valor;
}

/** Cookies `Secure`: `0` solo para HTTP en Chrome local; por defecto, seguras. */
export function cookieSecure(): boolean {
  return leer("LT_COOKIE_SECURE") !== "0";
}

export const env = {
  supabaseUrl: () => url("SUPABASE_URL"),
  supabasePublishableKey: () => requerida("SUPABASE_PUBLISHABLE_KEY"),
  supabaseSecretKey: () => requerida("SUPABASE_SECRET_KEY"),
  supabaseDbUrl: () => url("SUPABASE_DB_URL"),
  supabaseDbUrlMigraciones: () => url("SUPABASE_DB_URL_MIGRACIONES"),
  sendSmsHookSecret: () => requerida("SEND_SMS_HOOK_SECRET"),
  smsProviderMode,
  smsMasivosApiKey: () => requerida("SMSMASIVOS_API_KEY"),
  resendApiKey: () => requerida("RESEND_API_KEY"),
  alertEmailTo: () => requerida("ALERT_EMAIL_TO"),
  ipHashPepper: () => requerida("IP_HASH_PEPPER"),
  cronSecret: () => requerida("CRON_SECRET"),
  ltEnv,
  cookieSecure,
};
