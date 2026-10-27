import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { aplicarOpciones, opcionesCookie, type RolSesion } from "./cookies";
import type { Database } from "./database.types";

type Galleta = { name: string; value: string; options: { maxAge?: number } };

export type AdaptadorCookies = {
  getAll: () => { name: string; value: string }[];
  setAll?: (cookies: Galleta[], headers: Record<string, string>) => void | Promise<void>;
};

/**
 * Cliente con la sesión del rol sobre un adaptador de cookies propio (lo usan `proxy.ts` y las
 * rutas que escriben en su propia respuesta). Usa la llave publicable: la RLS manda, la llave no.
 * Crea un cliente nuevo por petición; nunca lo compartas.
 */
export function crearClienteConAdaptador(rol: RolSesion, cookiesAdaptador: AdaptadorCookies) {
  return createServerClient<Database>(env.supabaseUrl(), env.supabasePublishableKey(), {
    cookieOptions: opcionesCookie(rol),
    cookies: {
      getAll: cookiesAdaptador.getAll,
      setAll: (aEscribir, cabeceras) =>
        cookiesAdaptador.setAll?.(
          aEscribir.map((c) => ({ ...c, options: { maxAge: c.options?.maxAge } })),
          cabeceras,
        ),
    },
  });
}

/**
 * Cliente con la sesión del rol para RSC, Server Actions y rutas (`cookies()` de Next).
 * En un componente de servidor no se pueden escribir cookies: el error se ignora porque
 * `proxy.ts` ya renovó la sesión. En rutas y acciones sí se escriben (con `HttpOnly`, `Path` del rol).
 * Las rutas que abren o cierran sesión deben agregar `CABECERAS_SIN_CACHE` a su respuesta.
 */
export async function crearClienteServidor(rol: RolSesion) {
  const almacen = await cookies();
  return crearClienteConAdaptador(rol, {
    getAll: () => almacen.getAll().map(({ name, value }) => ({ name, value })),
    setAll: (aEscribir) => {
      try {
        for (const { name, value, options } of aEscribir) {
          almacen.set(name, value, aplicarOpciones(rol, options));
        }
      } catch {
        // Componente de servidor: el proxy renueva la sesión.
      }
    },
  });
}
