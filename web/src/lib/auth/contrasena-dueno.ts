import "server-only";
import { buscarPorCorreo, esCliente } from "@/lib/auth/codigo-dueno";
import {
  codigoReciente,
  contrasenaValida,
  enPausa,
  filasContrasena,
  registrarIntento,
} from "@/lib/auth/intentos-dueno";
import { env } from "@/lib/env";
import { crearClienteServidor } from "@/lib/supabase/server";
import { crearClienteSinSesion } from "@/lib/supabase/publico";

export const CUERPO_ENTRADA = { ok: true } as const;

export function cuerpoFallo(pausa: boolean) {
  return { ok: false as const, pausa };
}

/** Entra con contraseña. La pausa de 15 min solo afecta a este método. */
export async function entrarConContrasena(
  correo: string,
  contrasena: string,
): Promise<{ ok: true } | { ok: false; pausa: boolean }> {
  const filas = await filasContrasena(correo);
  if (enPausa(filas, Date.now())) {
    await registrarIntento(correo, "contrasena", "bloqueado");
    return cuerpoFallo(true);
  }

  const usuario = await buscarPorCorreo(correo);
  if (!usuario || (await esCliente(usuario))) {
    await registrarIntento(correo, "contrasena", "incorrecto");
    return cuerpoFallo(enPausa(await filasContrasena(correo), Date.now()));
  }

  const supabase = await crearClienteServidor("dueno");
  const { error } = await supabase.auth.signInWithPassword({ email: correo, password: contrasena });
  if (error) {
    await registrarIntento(correo, "contrasena", "incorrecto");
    return cuerpoFallo(enPausa(await filasContrasena(correo), Date.now()));
  }
  await registrarIntento(correo, "contrasena", "correcto");
  return CUERPO_ENTRADA;
}

/** Guarda el hash sin revocar sesiones. GoTrue lo hace solo al usar updateUser. */
async function fijarContrasena(userId: string, contrasena: string): Promise<boolean> {
  const respuesta = await fetch(`${env.supabaseUrl()}/rest/v1/rpc/fijar_contrasena`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${env.supabaseSecretKey()}`,
      apikey: env.supabaseSecretKey(),
      "Content-Type": "application/json",
      "Content-Profile": "servidor",
    },
    body: JSON.stringify({ p_user_id: userId, p_contrasena: contrasena }),
  });
  return respuesta.ok;
}

/** Con sesión y un código reciente, guarda la contraseña. */
export async function crearContrasena(contrasena: string): Promise<"ok" | "invalida" | "sin-sesion"> {
  if (!contrasenaValida(contrasena)) return "invalida";
  const supabase = await crearClienteServidor("dueno");
  const { data, error } = await supabase.auth.getUser();
  const correo = data.user?.email?.toLowerCase();
  if (error || !data.user || !correo || !(await codigoReciente(correo))) return "sin-sesion";
  if (!(await fijarContrasena(data.user.id, contrasena))) return "sin-sesion";
  return "ok";
}

/** Pide el código de restablecimiento. La respuesta del llamador no dice si el correo existe. */
export async function pedirRestablecer(correo: string): Promise<void> {
  const usuario = await buscarPorCorreo(correo);
  if (!usuario || (await esCliente(usuario))) return;
  const { error } = await crearClienteSinSesion().auth.resetPasswordForEmail(correo);
  if (error && error.status !== 429 && !/after \d+ seconds/i.test(error.message)) {
    throw new Error(error.message);
  }
}

/** Verifica el código, guarda la contraseña y deja la sesión. */
export async function confirmarRestablecer(
  correo: string,
  codigo: string,
  contrasena: string,
  cerrarOtras: boolean,
): Promise<"ok" | "invalida" | "rechazado"> {
  if (!contrasenaValida(contrasena)) return "invalida";
  const supabase = await crearClienteServidor("dueno");
  const { data, error } = await supabase.auth.verifyOtp({ email: correo, token: codigo, type: "recovery" });
  if (error || !data.user || (await esCliente(data.user))) {
    if (data.user) await supabase.auth.signOut();
    return "rechazado";
  }
  if (!(await fijarContrasena(data.user.id, contrasena))) return "rechazado";
  await registrarIntento(correo, "restablecer", "correcto");
  if (cerrarOtras) await supabase.auth.signOut({ scope: "others" });
  return "ok";
}
