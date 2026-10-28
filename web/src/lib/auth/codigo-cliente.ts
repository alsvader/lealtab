import "server-only";
import { env } from "@/lib/env";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { crearClienteSinSesion } from "@/lib/supabase/publico";
import { crearClienteServidor } from "@/lib/supabase/server";
import { telefonoMexico } from "@/lib/auth/hook-sms";

export const CUERPO_CODIGO = { ok: true } as const;
export const CUERPO_RECHAZO = { ok: false } as const;

type UsuarioTelefono = { id: string; rol: string | null };

async function usuarioPorTelefono(telefono: string): Promise<UsuarioTelefono | null> {
  const respuesta = await fetch(`${env.supabaseUrl()}/rest/v1/rpc/usuario_por_telefono`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey()}`,
      apikey: env.supabaseSecretKey(),
      "Content-Type": "application/json",
      "Content-Profile": "servidor",
    },
    body: JSON.stringify({ p_telefono: telefono }),
  });
  if (!respuesta.ok) return null;
  const cuerpo = (await respuesta.json()) as { id?: string | null; rol?: string | null };
  if (!cuerpo.id) return null;
  return { id: cuerpo.id, rol: cuerpo.rol ?? null };
}

/**
 * Crea la cuenta en el servidor (el registro de Auth está cerrado) y pide el código.
 * Si el teléfono ya es de un dueño, no manda nada. El llamador responde igual en todos los casos.
 */
export async function pedirCodigoCliente(telefono: string): Promise<void> {
  const admin = crearClienteAdmin();
  const usuario = await usuarioPorTelefono(telefono);
  if (!usuario) {
    const creado = await admin.auth.admin.createUser({ phone: telefono, phone_confirm: true });
    if (creado.error) return;
  }
  const { error } = await crearClienteSinSesion().auth.signInWithOtp({
    phone: telefono,
    options: { shouldCreateUser: false },
  });
  if (error && error.status !== 429 && !/after \d+ seconds/i.test(error.message)) return;
}

/** Verifica el código y deja la cookie del cliente. Rechaza si esa cuenta ya es dueño. */
export async function verificarCodigoCliente(telefono: string, codigo: string, cerrarOtras = false): Promise<string | null> {
  const supabase = await crearClienteServidor("cliente");
  const { data, error } = await supabase.auth.verifyOtp({ phone: telefono, token: codigo, type: "sms" });
  if (error || !data.user) return null;
  const rol = data.user.app_metadata?.rol;
  if (rol === "dueno") {
    await supabase.auth.signOut();
    return null;
  }
  const meta = { ...(data.user.app_metadata ?? {}), rol: "cliente" };
  const puesto = await crearClienteAdmin().auth.admin.updateUserById(data.user.id, { app_metadata: meta });
  if (puesto.error) return null;
  const refrescada = await supabase.auth.refreshSession();
  if (refrescada.error) return null;
  if (cerrarOtras) await supabase.auth.signOut({ scope: "others" });
  return data.user.id;
}

export type TarjetaRegistrada = { sellos: number; bienvenida: boolean };

/** Crea la ficha y la tarjeta. La segunda llamada no suma otro sello. */
export async function registrarCliente(userId: string, slug: string, nombre: string): Promise<TarjetaRegistrada | null> {
  const respuesta = await fetch(`${env.supabaseUrl()}/rest/v1/rpc/registrar_cliente`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey()}`,
      apikey: env.supabaseSecretKey(),
      "Content-Type": "application/json",
      "Content-Profile": "servidor",
    },
    body: JSON.stringify({ p_user_id: userId, p_slug: slug, p_nombre: nombre, p_acepto: true }),
  });
  if (!respuesta.ok) return null;
  const cuerpo = (await respuesta.json()) as { sellos?: number; bienvenida?: boolean };
  if (typeof cuerpo.sellos !== "number") return null;
  return { sellos: cuerpo.sellos, bienvenida: cuerpo.bienvenida === true };
}

export function telefonoDeEntrada(valor: unknown): string | null {
  return telefonoMexico(valor);
}
