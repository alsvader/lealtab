import { connection } from "next/server";
import { entornoLocal } from "@/lib/env";

export async function GET() {
  await connection();
  if (!entornoLocal()) return new Response(null, { status: 404 });
  return Response.json({
    name: "LealTab prueba",
    start_url: "/c/prueba-auth",
    scope: "/c/prueba-auth",
    display: "standalone",
  });
}
