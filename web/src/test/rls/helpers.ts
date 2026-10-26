/**
 * Utilidades de las pruebas de RLS por la API REST (arquitectura.md §4.4).
 * Sin cliente de Supabase: solo `fetch` contra el gateway, para que valga contra quien se salta
 * nuestro servidor. Solo corre contra el Supabase LOCAL (ver `entornoLocal`).
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/** Carga `.env.local` sin pisar lo que ya esté en el entorno del proceso. */
function cargarEnvLocal(): void {
  const archivo = path.resolve(process.cwd(), ".env.local");
  if (!existsSync(archivo)) return;
  for (const linea of readFileSync(archivo, "utf8").split("\n")) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(linea.trim());
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

export interface EntornoRls {
  url: string;
  publishable: string;
  secret: string;
}

/**
 * Se niega a correr si LT_ENV no es "local" o si SUPABASE_URL no apunta a esta máquina.
 * Estas pruebas crean y borran usuarios: nunca deben tocar preview ni producción.
 */
export function entornoLocal(): EntornoRls {
  cargarEnvLocal();
  const ltEnv = process.env.LT_ENV ?? "";
  const url = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  if (ltEnv !== "local") {
    throw new Error(`test:rls se niega a correr: LT_ENV es "${ltEnv}" y debe ser "local".`);
  }
  if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(url)) {
    throw new Error(`test:rls se niega a correr: SUPABASE_URL (${url}) no es local.`);
  }
  const publishable = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
  const secret = process.env.SUPABASE_SECRET_KEY ?? "";
  if (!publishable || !secret) {
    throw new Error("Faltan SUPABASE_PUBLISHABLE_KEY o SUPABASE_SECRET_KEY. Corre pnpm db:up y pnpm db:env.");
  }
  return { url, publishable, secret };
}

export type Rol = "anon" | "authenticated" | "service";

export interface Respuesta<T = unknown> {
  status: number;
  body: T;
}

export interface Opciones {
  /** anon: solo publishable. authenticated: publishable + JWT. service: llave secreta. */
  rol: Rol;
  token?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/** Llamada cruda. Devuelve el cuerpo ya interpretado (JSON o texto). */
export async function llamar<T = unknown>(
  metodo: string,
  ruta: string,
  { rol, token, body, headers = {} }: Opciones,
): Promise<Respuesta<T>> {
  const env = entornoLocal();
  const h: Record<string, string> = {
    apikey: rol === "service" ? env.secret : env.publishable,
    ...headers,
  };
  if (rol === "authenticated") {
    if (!token) throw new Error("rol authenticated sin token");
    h.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) h["Content-Type"] = "application/json";
  const res = await fetch(`${env.url}${ruta}`, {
    method: metodo,
    headers: h,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const texto = await res.text();
  let parsed: unknown = texto;
  try {
    parsed = texto ? JSON.parse(texto) : null;
  } catch {
    /* texto plano */
  }
  return { status: res.status, body: parsed as T };
}

const REPR = { Prefer: "return=representation" };

export const rest = {
  get: <T = unknown[]>(consulta: string, o: Opciones) => llamar<T>("GET", `/rest/v1/${consulta}`, o),
  post: <T = unknown>(tabla: string, body: unknown, o: Opciones) =>
    llamar<T>("POST", `/rest/v1/${tabla}`, { ...o, body, headers: { ...REPR, ...o.headers } }),
  patch: <T = unknown>(consulta: string, body: unknown, o: Opciones) =>
    llamar<T>("PATCH", `/rest/v1/${consulta}`, { ...o, body, headers: { ...REPR, ...o.headers } }),
  delete: <T = unknown>(consulta: string, o: Opciones) =>
    llamar<T>("DELETE", `/rest/v1/${consulta}`, { ...o, headers: { ...REPR, ...o.headers } }),
  rpc: <T = unknown>(funcion: string, body: unknown, o: Opciones) =>
    llamar<T>("POST", `/rest/v1/rpc/${funcion}`, { ...o, body }),
};

export interface UsuarioAuth {
  id: string;
  email?: string;
  phone?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

/** API de administración de Auth (llave secreta). */
export const adminAuth = {
  crear: (datos: Record<string, unknown>) =>
    llamar<UsuarioAuth & { msg?: string }>("POST", "/auth/v1/admin/users", { rol: "service", body: datos }),
  borrar: (id: string) => llamar("DELETE", `/auth/v1/admin/users/${id}`, { rol: "service" }),
  listar: () =>
    llamar<{ users: UsuarioAuth[] }>("GET", "/auth/v1/admin/users?page=1&per_page=1000", { rol: "service" }),
};

/** Inicio de sesión por contraseña: devuelve un JWT real. */
export async function iniciarSesion(credencial: { email?: string; phone?: string }, password: string): Promise<string> {
  const r = await llamar<{ access_token?: string; msg?: string; error_description?: string }>(
    "POST",
    "/auth/v1/token?grant_type=password",
    { rol: "anon", body: { ...credencial, password } },
  );
  if (r.status !== 200 || !r.body.access_token) {
    throw new Error(`inicio de sesión falló (${r.status}): ${r.body.msg ?? r.body.error_description ?? ""}`);
  }
  return r.body.access_token;
}

/** Contenido del JWT (sin verificar la firma; solo para inspeccionar claims). */
export function claims(token: string): { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown>; sub: string } {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
}

export const NIL = "00000000-0000-0000-0000-000000000000";

export interface Tabla {
  nombre: string;
  /** Columna y valor que no coinciden con ninguna fila: las escrituras nunca tocan datos reales. */
  pk: string;
  nil: string;
  /** Columna válida para un UPDATE de prueba. */
  upd: Record<string, unknown>;
}

/** Tablas que solo toca el servicio: ni anon ni authenticated tienen privilegios. */
export const SOLO_SERVICIO: Tabla[] = [
  { nombre: "config_plataforma", pk: "clave", nil: "inexistente", upd: { valor: "1" } },
  { nombre: "install_token", pk: "id", nil: NIL, upd: { usado_ts: "2026-01-01T00:00:00Z" } },
  { nombre: "envio_codigo", pk: "id", nil: "-1", upd: { resultado: "enviado" } },
  { nombre: "codigo_intento", pk: "id", nil: "-1", upd: { resultado: "correcto" } },
  { nombre: "intento_acceso_dueno", pk: "id", nil: "-1", upd: { resultado: "correcto" } },
  { nombre: "cuenta_pendiente_borrado", pk: "auth_user_id", nil: NIL, upd: { intentos: 1 } },
  { nombre: "evento_uso", pk: "id", nil: "-1", upd: { nombre: "x" } },
];

/** Tablas con SELECT para authenticated, filtradas por RLS. */
export const CON_RLS: Tabla[] = [
  { nombre: "negocio", pk: "id", nil: NIL, upd: { nombre: "x" } },
  { nombre: "dueno_negocio", pk: "user_id", nil: NIL, upd: { creado_ts: "2026-01-01T00:00:00Z" } },
  { nombre: "tarjeta_config", pk: "negocio_id", nil: NIL, upd: { recompensa: "x" } },
  { nombre: "identidad", pk: "id", nil: NIL, upd: { verificado_ts: "2026-01-01T00:00:00Z" } },
  { nombre: "cliente_negocio", pk: "id", nil: NIL, upd: { nombre: "x" } },
  { nombre: "tarjeta_cliente", pk: "id", nil: NIL, upd: { sellos: 99 } },
  { nombre: "tarjeta_llave", pk: "tarjeta_id", nil: NIL, upd: { creada_ts: "2026-01-01T00:00:00Z" } },
];

export const VISTAS_PRIVADAS = ["cliente_del_negocio", "mis_tarjetas"] as const;
export const TODAS_LAS_TABLAS: Tabla[] = [...SOLO_SERVICIO, ...CON_RLS];

/** Estado y código esperados cuando el privilegio no existe: 401 para anon, 403 para authenticated. */
export function denegado(rol: "anon" | "authenticated"): { status: number; code: string } {
  return { status: rol === "anon" ? 401 : 403, code: "42501" };
}

export function codigoDe(body: unknown): string | undefined {
  return typeof body === "object" && body !== null ? (body as { code?: string }).code : undefined;
}
