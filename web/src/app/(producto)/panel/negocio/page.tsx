import { Suspense } from "react";
import { connection } from "next/server";
import { FormularioNegocio } from "@/components/panel/formulario-negocio";
import { ResumenNegocio } from "@/components/panel/resumen-negocio";
import { MarcoAlta } from "@/components/panel/alta-marco";
import { leerFichaAlta } from "@/lib/negocio/crear";

async function Negocio() {
  await connection();
  const ficha = await leerFichaAlta();
  return (
    <MarcoAlta paso="negocio">
      {ficha ? <ResumenNegocio ficha={ficha} /> : <FormularioNegocio />}
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
