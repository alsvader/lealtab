// Healthcheck del contenedor (compose.yaml y Dockerfile). No toca Supabase ni variables.
export function GET() {
  return Response.json({ ok: true });
}
