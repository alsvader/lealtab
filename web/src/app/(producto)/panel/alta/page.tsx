import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PantallaCuenta } from "@/components/panel/pantalla-cuenta";
import { pasoPendienteDueno } from "@/lib/negocio/crear";

async function AltaConSesion() {
  await connection();
  const paso = await pasoPendienteDueno();
  if (paso) redirect(paso);
  return <PantallaCuenta />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AltaConSesion />
    </Suspense>
  );
}
