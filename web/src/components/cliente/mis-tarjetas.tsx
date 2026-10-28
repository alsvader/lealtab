import Link from "next/link";
import { C0 } from "@/content/tarjeta";
import { inicialesNegocio } from "@/lib/negocio/alta";
import type { FichaCliente } from "@/lib/cliente/fichas";

export function MisTarjetas({ tarjetas }: { tarjetas: FichaCliente[] | null }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-space-4 bg-bg px-space-4 py-space-6 text-text">
      <p className="font-display text-h4 font-extrabold text-bosque">{C0.marca}</p>
      <h1 className="font-display text-h2 font-extrabold">{C0.titulo}</h1>
      {tarjetas === null ? (
        <Link className="inline-flex min-h-11 items-center font-semibold underline" href={C0.recuperarHref}>
          {C0.recuperar}
        </Link>
      ) : tarjetas.length === 0 ? (
        <section className="flex flex-col gap-space-3 rounded-card border-2 border-noche bg-surface p-space-5 text-center">
          <h2 className="font-display text-h3 font-extrabold">{C0.vacioTitulo}</h2>
          <p>{C0.vacio}</p>
        </section>
      ) : (
        <ul className="flex flex-col gap-space-3">
          {tarjetas.map((tarjeta) => {
            const llena = tarjeta.sellos >= tarjeta.meta;
            return (
              <li key={tarjeta.tarjetaId}>
                <Link
                  className="flex min-h-11 items-center gap-space-3 rounded-card border-2 border-noche bg-surface p-space-4"
                  href={`/c/${tarjeta.slug}`}
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-noche bg-menta font-display font-extrabold text-bosque" aria-hidden="true">
                    {inicialesNegocio(tarjeta.negocio)}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-display text-h4 font-extrabold">{tarjeta.negocio}</span>
                    <span>{llena ? C0.lista : C0.faltan(tarjeta.recompensa, tarjeta.meta - tarjeta.sellos)}</span>
                  </span>
                  <span aria-label={`${tarjeta.sellos} de ${tarjeta.meta} sellos`}>{tarjeta.sellos}/{tarjeta.meta}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
