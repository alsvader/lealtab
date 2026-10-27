import "server-only";
import { buscarPorCorreo, esCliente } from "@/lib/auth/codigo-dueno";
import {
  codigoReciente,
  contrasenaValida,
  enPausa,
  filasContrasena,
  registrarIntento,
} from "@/lib/auth/intentos-dueno";
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

/** Con sesión y un código reciente, guarda la contraseña. */
export async function crearContrasena(contrasena: string): Promise<"ok" | "invalida" | "sin-sesion"> {
  if (!contrasenaValida(contrasena)) return "invalida";
  const supabase = await crearClienteServidor("dueno");
  const { data, error } = await supabase.auth.getUser();
  const correo = data.user?.email?.toLowerCase();
  if (error || !correo || !(await codigoReciente(correo))) return "sin-sesion";
  const guardada = await supabase.auth.updateUser({ password: contrasena });
  if (guardada.error) return "sin-sesion";
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
  const guardada = await supabase.auth.updateUser({ password: contrasena });
  if (guardada.error) return "rechazado";
  await registrarIntento(correo, "restablecer", "correcto");
  // GoTrue ya revoca los otros refresh tokens al cambiar la contraseña.
  // La casilla igual pide el cierre explícito por si esa versión deja de hacerlo.
  if (cerrarOtras) await supabase.auth.signOut({ scope: "others" });
  return "ok";
}
