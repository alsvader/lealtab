import { Suspense } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";
import { MarcoAlta } from "@/components/panel/alta-marco";
import { CartelMostrador } from "@/components/panel/cartel-mostrador";
import { completarAlta, destinoQr } from "@/lib/negocio/cartel";

async function CartelDatos() {
  // Sin `connection()`, el `.catch` de un prerender se quedaba en el HTML estático
  // y el cartel salía sin fecha aunque la sesión sí cerrara el alta.
  await connection();
  const alta = await completarAlta(0);
  const encabezados = await headers();
  const proto = encabezados.get("x-forwarded-proto") ?? "http";
  const host = encabezados.get("host") ?? "";
  const fin = alta
    ? new Date(alta.fin_prueba).toLocaleDateString("es-MX", { dateStyle: "long", timeZone: "America/Mexico_City" })
    : "";
  const destino = alta && host ? destinoQr(`${proto}://${host}`, alta.slug) : "";
  return <CartelMostrador fin={fin} destino={destino} />;
}

export default function Page() {
  return (
    <MarcoAlta paso="cartel">
      <Suspense fallback={null}>
        <CartelDatos />
      </Suspense>
    </MarcoAlta>
  );
}
