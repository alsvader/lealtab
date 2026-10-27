"use client";

import { useState } from "react";
import Link from "next/link";
import { N1 } from "@/content/alta";
import { FormularioCuenta } from "@/components/panel/formulario-cuenta";
import { FormularioEntrada } from "@/components/panel/formulario-entrada";
import { botonPrimario, botonSecundario } from "@/components/panel/alta-marco";

export function PestanasCuenta() {
  const [modo, setModo] = useState<"codigo" | "contrasena">("codigo");

  return (
    <div className="flex flex-col gap-space-4">
      <div className="flex flex-wrap gap-space-2" role="tablist" aria-label={N1.pestanas}>
        <button
          className={modo === "codigo" ? botonPrimario() : botonSecundario()}
          type="button"
          role="tab"
          aria-selected={modo === "codigo"}
          onClick={() => setModo("codigo")}
        >
          {N1.conCodigo}
        </button>
        <button
          className={modo === "contrasena" ? botonPrimario() : botonSecundario()}
          type="button"
          role="tab"
          aria-selected={modo === "contrasena"}
          onClick={() => setModo("contrasena")}
        >
          {N1.conContrasena}
        </button>
      </div>
      {modo === "codigo" ? <FormularioCuenta /> : <FormularioEntrada soloContrasena />}
      {modo === "codigo" ? (
        <p className="text-text-muted">
          Te enviamos un código a tu correo para entrar. Al continuar aceptas los{" "}
          <Link className="underline" href="/terminos-y-condiciones">
            {N1.terminos}
          </Link>{" "}
          y el{" "}
          <Link className="underline" href="/aviso-de-privacidad">
            {N1.aviso}
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
