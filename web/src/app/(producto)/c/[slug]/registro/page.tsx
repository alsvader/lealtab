import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { FormularioRegistro } from "@/components/cliente/formulario-registro";
import { leerNegocioPublico } from "@/lib/negocio/publico";

async function Registro({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const negocio = await leerNegocioPublico(slug);
  if (!negocio) notFound();
  return <FormularioRegistro negocio={negocio} />;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <Registro params={params} />
    </Suspense>
  );
}
