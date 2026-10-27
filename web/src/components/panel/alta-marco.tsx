import Link from "next/link";
import { AYUDA_WHATSAPP, PASOS, type PasoId } from "@/content/alta";

const control =
  "inline-flex min-h-11 items-center justify-center rounded-control border-2 border-noche px-space-4 font-body text-ui font-bold";

export function botonPrimario(extra = "") {
  return `${control} bg-bosque text-lino shadow-button ${extra}`;
}

export function botonSecundario(extra = "") {
  return `${control} bg-surface text-text ${extra}`;
}

export function MarcoAlta({ paso, children }: { paso: PasoId; children: React.ReactNode }) {
  const indice = PASOS.findIndex((p) => p.id === paso);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-text">
      <header className="flex flex-wrap items-center justify-between gap-space-3 border-b-[1.5px] border-noche bg-surface px-space-4 py-space-4 sm:px-space-6">
        <p className="font-display text-h4 font-extrabold text-bosque">LealTab</p>
        <nav aria-label="Pasos del alta" className="flex flex-wrap gap-space-2">
          {PASOS.map((p, i) => {
            const actual = i === indice;
            const listo = i < indice;
            return (
              <Link
                key={p.id}
                href={p.href}
                aria-current={actual ? "step" : undefined}
                className={`${control} text-caption ${
                  actual ? "bg-noche text-lino" : listo ? "bg-menta text-bosque" : "bg-surface text-text"
                }`}
              >
                {p.etiqueta}
              </Link>
            );
          })}
        </nav>
        <a className={botonSecundario("text-bosque")} href={AYUDA_WHATSAPP.href} rel="noopener noreferrer" target="_blank">
          {AYUDA_WHATSAPP.label}
        </a>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-space-6 px-space-4 py-space-6 lg:flex-row lg:px-space-7">
        {children}
      </main>
    </div>
  );
}

export function Campo({
  etiqueta,
  ayuda,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-space-2 text-ui font-semibold">
      <span>
        {etiqueta}
        {ayuda ? <span className="mt-space-1 block font-normal text-text-muted">{ayuda}</span> : null}
      </span>
      {children}
    </label>
  );
}

export const campoClase =
  "min-h-11 w-full rounded-control border-2 border-noche bg-surface px-space-3 font-body text-input text-text";
