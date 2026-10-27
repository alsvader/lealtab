import "server-only";
import { entornoLocal, env, supabaseConfigurado } from "@/lib/env";
import { crearClienteAdmin } from "./admin";
import { CABECERAS_SIN_CACHE, type RolSesion } from "./cookies";
import { crearClienteServidor } from "./server";

/**
 * Ruta de prueba SOLO PARA DESARROLLO: abre sesión con un usuario de la semilla (`pnpm db:seed`)
 * y deja la cookie del rol, para probar cookies y proxy sin las pantallas de acceso.
 * Responde 404 salvo con `LT_ENV=local`, Supabase configurado y `SUPABASE_URL` local.
 * No es una función del producto: las pantallas de acceso las hacen `spike-auth-cliente` y `alta-negocio`.
 */

const CONTRASENA_LOCAL = "LealTab-local-1"; // la misma de scripts/seed-dev.ts; solo local
const CORREO_SEMILLA = /^[a-z0-9.-]+@lealtab\.test$/;
const TELEFONO_SEMILLA = /^\+52993100\d{4}$/;
const URL_LOCAL = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/;

const noEncontrado = () => new Response(null, { status: 404 });
const json = (cuerpo: unknown, status = 200) =>
  Response.json(cuerpo, { status, headers: CABECERAS_SIN_CACHE });

/** ¿Está permitido usar la ruta de desarrollo? Nunca lanza. */
export function devSesionPermitida(): boolean {
  if (!entornoLocal() || !supabaseConfigurado()) return false;
  try {
    return URL_LOCAL.test(env.supabaseUrl());
  } catch {
    return false;
  }
}

export async function manejarDevSesion(rol: RolSesion, request: Request): Promise<Response> {
  if (!devSesionPermitida()) return noEncontrado();

  const cuerpo = (await request.json().catch(() => null)) as { usuario?: unknown } | null;
  const usuario = typeof cuerpo?.usuario === "string" ? cuerpo.usuario : "";
  const valido = rol === "dueno" ? CORREO_SEMILLA.test(usuario) : TELEFONO_SEMILLA.test(usuario);
  if (!valido) return json({ error: "usuario de semilla inválido" }, 400);

  const admin = crearClienteAdmin();
  let correo = usuario;
  if (rol === "cliente") {
    // Los clientes de la semilla solo tienen teléfono y el acceso por teléfono sigue apagado en local:
    // se les da un correo y una contraseña ficticios para poder abrir sesión desde aquí.
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) return json({ error: "no se pudo listar usuarios" }, 500);
    const u = data.users.find((x) => x.phone === usuario.replace("+", ""));
    if (!u) return json({ error: "no existe en la semilla; corre pnpm db:seed" }, 404);
    correo = `${usuario.replace("+", "")}@lealtab.test`;
    const r = await admin.auth.admin.updateUserById(u.id, { email: correo, email_confirm: true, password: CONTRASENA_LOCAL });
    if (r.error) return json({ error: "no se pudo preparar el usuario" }, 500);
  }

  const supabase = await crearClienteServidor(rol);
  const { data, error } = await supabase.auth.signInWithPassword({ email: correo, password: CONTRASENA_LOCAL });
  if (error || !data.user) return json({ error: "no se pudo iniciar sesión; ¿corriste pnpm db:seed?" }, 401);
  const rolToken = (data.user.app_metadata as { rol?: unknown }).rol;
  if (rolToken !== rol) return json({ error: "el usuario no tiene ese rol" }, 403);
  return json({ ok: true, rol });
}
