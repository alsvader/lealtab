import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { FormularioNegocio } from "@/components/panel/formulario-negocio";
import { MarcoAlta } from "@/components/panel/alta-marco";
import { pasoPendienteDueno } from "@/lib/negocio/crear";

async function Negocio() {
  await connection();
  const paso = await pasoPendienteDueno();
  if (paso === "/panel/tarjeta" || paso === "/panel/cartel") redirect(paso);
  return (
    <MarcoAlta paso="negocio">
      <FormularioNegocio />
    </MarcoAlta>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Negocio />
    </Suspense>
  );
}
