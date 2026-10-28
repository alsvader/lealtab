import { Suspense } from "react";
import { connection } from "next/server";
import { MisTarjetas } from "@/components/cliente/mis-tarjetas";
import { tarjetasDeLaSesion } from "@/lib/cliente/fichas";
import { supabaseConfigurado } from "@/lib/env";

async function Lista() {
  await connection();
  if (!supabaseConfigurado()) return <main className="p-space-5">Producto no configurado</main>;
  return <MisTarjetas tarjetas={await tarjetasDeLaSesion()} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Lista />
    </Suspense>
  );
}
