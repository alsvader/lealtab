import { REGISTRO } from "@/content/registro";
import { inicialesNegocio } from "@/lib/negocio/alta";
import type { NegocioPublico } from "@/lib/negocio/publico-tipo";

export function TarjetaExistente({ negocio, sellos, meta }: { negocio: NegocioPublico; sellos: number; meta: number }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-space-4 bg-bg px-space-4 py-space-6 text-text">
      <header className="flex items-center gap-space-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-noche bg-menta font-display font-extrabold text-bosque" aria-hidden="true">
          {inicialesNegocio(negocio.nombre)}
        </span>
        <p className="font-display text-h4 font-extrabold">{negocio.nombre}</p>
      </header>
      <article aria-label={REGISTRO.listaTitulo} className="flex flex-col gap-space-3 rounded-card border-2 border-noche bg-surface p-space-4 shadow-card">
        <h1 className="font-display text-h2 font-extrabold">{REGISTRO.yaTienes(negocio.nombre)}</h1>
        <p className="font-display text-stat font-extrabold">{REGISTRO.sellos(sellos, meta)}</p>
        <p className="text-center text-ui">
          {REGISTRO.hecho} <strong>{REGISTRO.marca}</strong>
        </p>
      </article>
    </main>
  );
}
