"use client";

import { useState } from "react";
import { inicialesNegocio } from "@/lib/negocio/alta";
import type { NegocioPublico } from "@/lib/negocio/publico-tipo";

/** Encabezado de /c/{slug}/registro. El nombre va al lado, así la imagen no se anuncia. */
export function MarcaNegocio({ negocio }: { negocio: NegocioPublico }) {
  const [logo, setLogo] = useState(negocio.tieneLogo);

  return (
    <header className="flex items-center gap-space-3">
      {logo ? (
        <img
          src={`/c/logo/${negocio.slug}`}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-full border-2 border-noche object-cover"
          onError={() => setLogo(false)}
        />
      ) : (
        <span
          className="inline-flex size-12 items-center justify-center rounded-full border-2 border-noche bg-menta font-display font-extrabold text-bosque"
          aria-hidden="true"
        >
          {inicialesNegocio(negocio.nombre)}
        </span>
      )}
      <p className="font-display text-h4 font-extrabold">{negocio.nombre}</p>
    </header>
  );
}
