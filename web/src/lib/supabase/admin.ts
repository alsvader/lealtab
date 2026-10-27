import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Cliente con la llave secreta (`service_role`). Sin sesión y sin cookies.
 * Solo el servidor lo usa: crea usuarios, escribe `app_metadata.rol` y lee `negocio_publico`
 * (anon no tiene privilegios). Nunca se importa desde un componente de cliente.
 * Nota: `service_role` lee 0 filas de `cliente_del_negocio` y `mis_tarjetas` (H-19).
 */
export function crearClienteAdmin() {
  return createClient<Database>(env.supabaseUrl(), env.supabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
