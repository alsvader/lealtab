import { C3, C4 } from "@/content/tarjeta";
import { inicialesNegocio } from "@/lib/negocio/alta";
import { lineaLimite } from "@/lib/cliente/fichas";
import type { TarjetaVista } from "@/lib/cliente/fichas";
import { QrRotativo } from "./qr-rotativo";

export function VistaTarjeta({ tarjeta }: { tarjeta: TarjetaVista }) {
  const llena = tarjeta.sellos >= tarjeta.meta;
  const limite = lineaLimite(tarjeta.limiteModo, tarjeta.limiteMinutos);
  const faltan = Math.max(tarjeta.meta - tarjeta.sellos, 0);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-space-4 bg-bg px-space-4 py-space-6 text-text">
      <header className="flex items-center gap-space-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-noche bg-menta font-display font-extrabold text-bosque" aria-hidden="true">
          {inicialesNegocio(tarjeta.negocio)}
        </span>
        <h1 className="font-display text-h3 font-extrabold">{tarjeta.negocio}</h1>
      </header>
      <section className="flex flex-col items-center gap-space-3 rounded-card border-2 border-noche bg-surface p-space-4 text-center">
        <p className="font-display text-stat font-extrabold" aria-label={C3.cuenta(tarjeta.sellos, tarjeta.meta)}>
          {tarjeta.sellos}/{tarjeta.meta}
        </p>
        <p>{C3.sellos}</p>
        {llena ? (
          <>
            <p className="font-bold">{C4.lista}</p>
            <h2 className="font-display text-h2 font-extrabold">{C4.listo(tarjeta.recompensa)}</h2>
            <p>{C4.canje}</p>
          </>
        ) : (
          <p>
            <strong>{C3.faltan(faltan, tarjeta.recompensa)}</strong>
          </p>
        )}
      </section>
      <section className="flex flex-col items-center gap-space-3 rounded-card border-2 border-noche bg-surface p-space-4">
        <p className="font-bold">{C3.muestra}</p>
        <QrRotativo tarjetaId={tarjeta.tarjetaId} negocioId={tarjeta.negocioId} llaveHex={tarjeta.llaveHex} />
        {limite ? <p>{limite}</p> : null}
        <details className="w-full">
          <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold underline">{C3.terminos}</summary>
          <div className="mt-space-3 flex flex-col gap-space-2">
            {limite ? <p>{limite}</p> : null}
            <p>{C3.noCaducan}</p>
            <p>
              {C3.hecho} <strong>{C3.marca}</strong>
            </p>
          </div>
        </details>
      </section>
      {llena ? (
        <section className="rounded-card border-2 border-noche bg-durazno-claro p-space-4">
          <p className="font-bold">{C4.despues}</p>
          <p>{C4.vuelve(tarjeta.meta)}</p>
        </section>
      ) : null}
      <p className="text-center text-ui">
        {C3.hecho} <strong>{C3.marca}</strong>
      </p>
    </main>
  );
}
