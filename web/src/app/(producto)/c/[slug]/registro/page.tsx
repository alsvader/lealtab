import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { FormularioRegistro } from "@/components/cliente/formulario-registro";
import { FormularioSegundo } from "@/components/cliente/formulario-segundo";
import { TarjetaExistente } from "@/components/cliente/tarjeta-existente";
import { contextoRegistro } from "@/lib/cliente/fichas";
import { leerNegocioPublico } from "@/lib/negocio/publico";

async function Registro({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const negocio = await leerNegocioPublico(slug);
  if (!negocio) notFound();
  const contexto = await contextoRegistro(slug);
  if (contexto.tipo === "ya") return <TarjetaExistente negocio={negocio} sellos={contexto.sellos} meta={contexto.meta} />;
  if (contexto.tipo === "segundo") {
    return <FormularioSegundo negocio={negocio} nombrePrevio={contexto.nombrePrevio} last4={contexto.last4} />;
  }
  return <FormularioRegistro negocio={negocio} />;
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <Registro params={params} />
    </Suspense>
  );
}
