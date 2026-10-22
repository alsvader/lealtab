import { Suspense } from "react";
import { connection } from "next/server";
import { supabaseConfigurado } from "@/lib/env";

// Con cacheComponents, leer process.env se congelaría en el build: `connection()` lo
// deja para cada petición. El 503 de «sin configurar» lo decide T6 con proxy.ts;
// aquí la página responde 200.
async function Estado() {
  await connection();
  return <>{supabaseConfigurado() ? "LealTab" : "Producto no configurado"}</>;
}

export function EstadoProducto() {
  return (
    <main className="p-space-5 font-body text-body">
      <Suspense fallback={null}>
        <Estado />
      </Suspense>
    </main>
  );
}
