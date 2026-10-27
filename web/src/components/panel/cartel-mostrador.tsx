"use client";

import { useState } from "react";
import Link from "next/link";
import { N4 } from "@/content/alta";
import { botonPrimario, botonSecundario } from "@/components/panel/alta-marco";

const TAMANOS = [
  { valor: "carta", etiqueta: "Carta (cartel)" },
  { valor: "media", etiqueta: "Media carta" },
  { valor: "sticker", etiqueta: "Sticker 10 cm" },
] as const;

export function CartelMostrador({ fin, destino }: { fin: string; destino: string }) {
  const [tamano, setTamano] = useState<(typeof TAMANOS)[number]["valor"]>("carta");
  const archivo = (formato: "pdf" | "png") => `/panel/api/cartel?formato=${formato}&tamano=${tamano}`;

  return (
    <>
      <div className="flex max-w-xl flex-1 flex-col gap-space-4">
        <h1 className="font-display text-h2 font-extrabold">{N4.titulo}</h1>
        <p className="text-text-muted">{N4.bajada}</p>
        <fieldset className="flex flex-col gap-space-2">
          <legend className="text-ui font-semibold">{N4.tamano}</legend>
          <div className="flex flex-wrap gap-space-2">
            {TAMANOS.map((opcion) => (
              <label key={opcion.valor} className={tamano === opcion.valor ? botonPrimario() : botonSecundario()}>
                <input
                  className="sr-only"
                  type="radio"
                  name="tamano"
                  checked={tamano === opcion.valor}
                  onChange={() => setTamano(opcion.valor)}
                />
                {opcion.etiqueta}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-space-3">
          <a className={botonPrimario()} href={archivo("pdf")}>
            {N4.pdf}
          </a>
          <a className={botonSecundario()} href={archivo("png")}>
            {N4.png}
          </a>
        </div>
        <ul className="flex flex-col gap-space-2 rounded-card border-[1.5px] border-noche bg-surface p-space-4">
          <li>{N4.pegalo}</li>
          <li>{fin ? `Tu mes de prueba termina el ${fin}.` : N4.prueba}</li>
        </ul>
        <Link className={botonSecundario("self-start")} href="/panel/tarjeta">
          {N4.atras}
        </Link>
      </div>
      <aside className="flex w-full max-w-xs flex-col items-center gap-space-3 rounded-control border-2 border-noche bg-surface p-space-5 text-center">
        <p className="font-bold">{N4.escanear}</p>
        <p className="text-text-muted">{destino ? "El QR abre el registro de tu negocio." : N4.escanearAyuda}</p>
        <p className="mt-auto text-caption">{N4.hecho}</p>
      </aside>
    </>
  );
}
