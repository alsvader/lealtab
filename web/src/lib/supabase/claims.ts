import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { RolSesion } from "./cookies";

export type SesionValidada = { sub: string; rol: RolSesion };

/** Lo único que se necesita del cliente (cualquier `SupabaseClient` lo cumple). */
type ConAuth = { auth: Pick<SupabaseClient["auth"], "getClaims"> };

/**
 * Lee `sub` y `rol` de la sesión **validada** en el servidor (`getClaims()` verifica la firma
 * y la vigencia del JWT; nunca se lee la cookie a mano). Devuelve `null` si no hay sesión,
 * si el token no es válido o si el rol no es el esperado (negar por defecto).
 * No sustituye a `getUser()` en acciones sensibles (detecta sesiones cerradas en otro dispositivo).
 */
export async function leerSesion(supabase: ConAuth, rolEsperado: RolSesion): Promise<SesionValidada | null> {
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  const rol = (data.claims.app_metadata as { rol?: unknown } | undefined)?.rol;
  if (rol !== rolEsperado || typeof data.claims.sub !== "string") return null;
  return { sub: data.claims.sub, rol: rolEsperado };
}
