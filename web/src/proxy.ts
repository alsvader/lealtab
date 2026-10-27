import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/env";
import { CABECERAS_SIN_CACHE, aplicarOpciones, nombreCookie, rolDeRuta } from "@/lib/supabase/cookies";
import { crearClienteConAdaptador } from "@/lib/supabase/server";

/**
 * Renueva la sesión del rol que corresponde por ruta (`lt-cliente` en /c, `lt-dueno` en /panel)
 * y propaga las cookies nuevas a la petición y a la respuesta. NO autoriza: eso es de las guardas
 * del servidor (arquitectura.md §5.3). El alcance es solo /c y /panel; nunca la landing.
 */
export const config = {
  matcher: ["/c/:path*", "/panel/:path*"],
};

/** Rutas que manejan su propia cookie o no llevan sesión (arquitectura.md §5.5). */
const EXCLUIDAS = [/^\/(c|panel)\/api\/auth(\/|$)/, /^\/c\/manifest\.webmanifest$/, /^\/c\/sw\.js$/, /^\/c\/logo(\/|$)/];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rol = rolDeRuta(pathname);

  // Sin Supabase configurado, o en una ruta excluida, o una visita anónima: no hace nada.
  if (!rol || !supabaseConfigurado() || EXCLUIDAS.some((r) => r.test(pathname))) return NextResponse.next();
  const nombre = nombreCookie(rol);
  if (!request.cookies.getAll().some((c) => c.name === nombre || c.name.startsWith(`${nombre}.`))) {
    return NextResponse.next();
  }

  let respuesta = NextResponse.next({ request });
  const supabase = crearClienteConAdaptador(rol, {
    getAll: () => request.cookies.getAll().map(({ name, value }) => ({ name, value })),
    setAll: (aEscribir) => {
      for (const { name, value } of aEscribir) request.cookies.set(name, value);
      respuesta = NextResponse.next({ request });
      for (const { name, value, options } of aEscribir) {
        respuesta.cookies.set(name, value, aplicarOpciones(rol, options));
      }
      for (const [k, v] of Object.entries(CABECERAS_SIN_CACHE)) respuesta.headers.set(k, v);
    },
  });

  try {
    await supabase.auth.getClaims(); // valida y, si hace falta, renueva el token
  } catch {
    // Un fallo de Supabase no debe tirar la página; las guardas de servidor negarán el acceso.
  }
  return respuesta;
}
