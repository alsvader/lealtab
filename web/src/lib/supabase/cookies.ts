import "server-only";
import type { CookieOptionsWithName } from "@supabase/ssr";
import { cookieSecure } from "@/lib/env";

/**
 * Cookies de sesión del producto (ADR-003 §2.4, arquitectura.md §5.1).
 * Dos cookies de primera parte, escritas solo por el servidor, con nombre y `Path` distintos:
 * la del cliente nunca viaja a `/panel/` ni a la landing, y la del dueño nunca viaja a `/c/`.
 */
export type RolSesion = "cliente" | "dueno";

const DIA = 24 * 60 * 60;

/** Vigencia de trabajo en segundos. [SUPUESTO] 400 días es el máximo que aceptan los navegadores. */
export const MAX_AGE_POR_DEFECTO: Record<RolSesion, number> = {
  cliente: 400 * DIA,
  dueno: 30 * DIA,
};

const BASE: Record<RolSesion, { name: string; path: string }> = {
  cliente: { name: "lt-cliente", path: "/c" },
  dueno: { name: "lt-dueno", path: "/panel" },
};

export function nombreCookie(rol: RolSesion): string {
  return BASE[rol].name;
}

/** Prefijo de ruta del rol: `/c` o `/panel`. */
export function rutaCookie(rol: RolSesion): string {
  return BASE[rol].path;
}

/**
 * Opciones fijas de la cookie del rol. `@supabase/ssr` trae `httpOnly: false` por defecto
 * (verificado en 0.12.7): aquí se fija en `true` y `aplicarOpciones` lo impone en cada escritura.
 */
export function opcionesCookie(rol: RolSesion, extra: { maxAge?: number } = {}): CookieOptionsWithName {
  return {
    name: BASE[rol].name,
    path: BASE[rol].path,
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    maxAge: extra.maxAge ?? MAX_AGE_POR_DEFECTO[rol],
  };
}

/**
 * Opciones que se pasan a la respuesta en cada `setAll`: las del rol, sin `name`, y solo
 * solo se respeta el `maxAge` 0 (borrar la cookie); cualquier otro lo fija el rol, porque la
 * biblioteca manda siempre sus 400 días. Así ninguna escritura sale sin `HttpOnly`, con otro
 * `Path` ni con otra vigencia.
 */
export function aplicarOpciones(
  rol: RolSesion,
  pedidas: { maxAge?: number } | undefined,
): Omit<CookieOptionsWithName, "name"> {
  const { name: _name, ...fijas } = opcionesCookie(rol, pedidas?.maxAge === 0 ? { maxAge: 0 } : {});
  void _name;
  return fijas;
}

/** `true` si la ruta es del rol: `/c` o `/c/...` (no `/cafe`), `/panel` o `/panel/...`. */
export function rolDeRuta(pathname: string): RolSesion | null {
  for (const rol of ["cliente", "dueno"] as const) {
    const base = BASE[rol].path;
    if (pathname === base || pathname.startsWith(`${base}/`)) return rol;
  }
  return null;
}

/** Cabeceras que `@supabase/ssr` pide copiar a toda respuesta que escribe la sesión (CDN). */
export const CABECERAS_SIN_CACHE = {
  "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
  Expires: "0",
  Pragma: "no-cache",
} as const;
