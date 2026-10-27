import { manejarDevSesion } from "@/lib/supabase/dev-sesion";

// Solo desarrollo: 404 salvo con LT_ENV=local (ver src/lib/supabase/dev-sesion.ts).
export function POST(request: Request) {
  return manejarDevSesion("dueno", request);
}
