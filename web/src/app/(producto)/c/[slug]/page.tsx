import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { VistaTarjeta } from "@/components/cliente/vista-tarjeta";
import { leerTarjeta } from "@/lib/cliente/fichas";
import { leerNegocioPublico } from "@/lib/negocio/publico";

async function Tarjeta({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const tarjeta = await leerTarjeta(slug);
  if (tarjeta) return <VistaTarjeta tarjeta={tarjeta} />;
  const publico = await leerNegocioPublico(slug);
  if (!publico) notFound();
  redirect(`/c/${slug}/registro`);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <Tarjeta params={params} />
    </Suspense>
  );
}
