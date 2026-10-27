import "server-only";
import { env } from "@/lib/env";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { crearClienteSinSesion } from "@/lib/supabase/publico";
import { registrarIntento } from "@/lib/auth/intentos-dueno";
import { crearClienteServidor } from "@/lib/supabase/server";

/** Misma respuesta si el correo existe, si no existe o si ya es cliente. */
export const CUERPO_CODIGO = { ok: true } as const;
export const CUERPO_RECHAZO = { ok: false } as const;

/** Correo en minúsculas, o null si no tiene forma de correo. */
export function correoNormalizado(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const correo = valor.trim().toLowerCase();
  if (correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return null;
  return correo;
}

export function codigoNormalizado(valor: unknown): string | null {
  if (typeof valor !== "string" || !/^\d{6}$/.test(valor)) return null;
  return valor;
}

type UsuarioAuth = { id: string; email?: string | null; app_metadata?: Record<string, unknown> };

function rolDe(usuario: UsuarioAuth): string | undefined {
  const rol = usuario.app_metadata?.rol;
  return typeof rol === "string" ? rol : undefined;
}

export async function buscarPorCorreo(correo: string): Promise<UsuarioAuth | null> {
  const respuesta = await fetch(
    `${env.supabaseUrl()}/auth/v1/admin/users?filter=${encodeURIComponent(correo)}`,
    {
      headers: {
        Authorization: `Bearer ${env.supabaseSecretKey()}`,
        apikey: env.supabaseSecretKey(),
      },
    },
  );
  if (!respuesta.ok) return null;
  const cuerpo = (await respuesta.json()) as { users?: UsuarioAuth[] };
  return cuerpo.users?.find((u) => u.email?.toLowerCase() === correo) ?? null;
}

/** Un cliente (rol o fila en identidad) no puede recibir sesión de dueño. */
export async function esCliente(usuario: UsuarioAuth): Promise<boolean> {
  if (rolDe(usuario) === "cliente") return true;
  const { data } = await crearClienteAdmin().from("identidad").select("id").eq("auth_user_id", usuario.id).maybeSingle();
  return !!data;
}

/**
 * Crea la cuenta en el servidor (el registro de Auth está cerrado) y pide el código.
 * Si el correo ya es de un cliente, no manda nada. El llamador responde igual en todos los casos.
 */
export async function pedirCodigoDueno(correo: string): Promise<void> {
  const admin = crearClienteAdmin();
  let usuario = await buscarPorCorreo(correo);
  if (usuario && (await esCliente(usuario))) return;

  if (!usuario) {
    const creado = await admin.auth.admin.createUser({ email: correo, email_confirm: true });
    if (creado.error || !creado.data.user) {
      usuario = await buscarPorCorreo(correo);
      if (!usuario || (await esCliente(usuario))) return;
    }
  }

  const { error } = await crearClienteSinSesion().auth.signInWithOtp({
    email: correo,
    options: { shouldCreateUser: false },
  });
  if (error) {
    // Supabase no deja pedir otro código antes de 60 s. La respuesta sigue siendo la misma.
    if (error.status === 429 || /after \d+ seconds/i.test(error.message)) return;
    throw new Error(error.message);
  }
}

/** Verifica el código y deja la cookie del dueño. Rechaza si esa cuenta ya es cliente. */
export async function verificarCodigoDueno(correo: string, codigo: string): Promise<boolean> {
  const supabase = await crearClienteServidor("dueno");
  const { data, error } = await supabase.auth.verifyOtp({ email: correo, token: codigo, type: "email" });
  if (error || !data.user) return false;
  if (await esCliente(data.user)) {
    await supabase.auth.signOut();
    return false;
  }
  await registrarIntento(data.user.email?.toLowerCase() ?? correo, "codigo", "correcto");
  return true;
}
