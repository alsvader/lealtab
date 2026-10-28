import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { entornoLocal } from "@/lib/env";
import { PRUEBA_AUTH } from "@/content/prueba-auth";
import { FormularioPrueba } from "@/components/panel/formulario-prueba";

async function Formulario() {
  await connection();
  if (!entornoLocal()) notFound();
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-space-4 bg-bg px-space-4 py-space-6 text-text">
      <h1 className="font-display text-h2 font-extrabold">{PRUEBA_AUTH.titulo}</h1>
      <FormularioPrueba />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Formulario />
    </Suspense>
  );
}
