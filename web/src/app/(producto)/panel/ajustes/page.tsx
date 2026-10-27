import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { AJUSTES } from "@/content/ajustes";
import { FormularioZona } from "@/components/panel/formulario-zona";
import { leerNegocioDueno } from "@/lib/negocio/ajustes";

async function AjustesDatos() {
  await connection();
  const negocio = await leerNegocioDueno();
  if (negocio === "sin-sesion") {
    return (
      <div className="flex max-w-xl flex-col gap-space-4">
        <h1 className="font-display text-h2 font-extrabold">{AJUSTES.titulo}</h1>
        <p>{AJUSTES.sinSesion}</p>
        <Link className="underline" href="/panel/entrar">
          {AJUSTES.entrar}
        </Link>
      </div>
    );
  }
  if (negocio === "sin-negocio") {
    return (
      <div className="flex max-w-xl flex-col gap-space-4">
        <h1 className="font-display text-h2 font-extrabold">{AJUSTES.titulo}</h1>
        <p>{AJUSTES.sinNegocio}</p>
        <Link className="underline" href="/panel/alta">
          {AJUSTES.alta}
        </Link>
      </div>
    );
  }
  return <FormularioZona negocio={negocio} />;
}

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col bg-bg px-space-4 py-space-6 text-text">
      <Suspense fallback={null}>
        <AjustesDatos />
      </Suspense>
    </main>
  );
}
