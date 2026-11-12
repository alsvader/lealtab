"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { N1, N2 } from "@/content/alta";
import { GIRO_ETIQUETA } from "@/content/ajustes";
import { botonPrimario, botonSecundario } from "@/components/panel/alta-marco";
import { inicialesNegocio, mostrarWhatsapp } from "@/lib/negocio/alta";
import type { FichaAlta } from "@/lib/negocio/ficha-alta";

function whatsappVisible(valor: string): string {
  if (valor.startsWith("+52") && valor.length === 13) return mostrarWhatsapp(valor.slice(3));
  return valor;
}

export function ResumenNegocio({ ficha }: { ficha: FichaAlta }) {
  const router = useRouter();
  const [confirmar, setConfirmar] = useState(false);
  const [error, setError] = useState("");
  const [pendiente, setPendiente] = useState(false);
  const giro = GIRO_ETIQUETA[ficha.giro] ?? ficha.giro;

  async function eliminar() {
    setPendiente(true);
    setError("");
    const respuesta = await fetch("/panel/api/negocio", { method: "DELETE" });
    setPendiente(false);
    if (!respuesta.ok) {
      setError(N2.eliminarError);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex max-w-xl flex-1 flex-col gap-space-4">
      <h1 className="font-display text-h2 font-extrabold">{N2.titulo}</h1>
      <p className="text-text-muted">
        <strong className="text-text">{N2.guardado}</strong> {ficha.puedeEliminar ? N2.guardadoAyuda : null}
      </p>
      <dl className="flex flex-col gap-space-4">
        <div>
          <dt className="text-ui font-semibold">{N2.nombre}</dt>
          <dd>{ficha.nombre}</dd>
        </div>
        <div>
          <dt className="text-ui font-semibold">{N2.giro}</dt>
          <dd>{giro}</dd>
        </div>
        <div>
          <dt className="text-ui font-semibold">{N2.ciudad}</dt>
          <dd>{ficha.ciudad}</dd>
        </div>
        <div>
          <dt className="text-ui font-semibold">{N1.whatsapp}</dt>
          <dd>{whatsappVisible(ficha.whatsapp)}</dd>
        </div>
        <div>
          <dt className="text-ui font-semibold">{N2.logo}</dt>
          <dd>
            <span className="grid size-11 place-items-center overflow-hidden rounded-control bg-noche font-bold text-lino">
              {ficha.logo ? (
                <img alt="" className="size-full object-cover" src={`/c/logo/${ficha.slug}`} />
              ) : (
                inicialesNegocio(ficha.nombre)
              )}
            </span>
          </dd>
        </div>
      </dl>
      {error ? (
        <p className="text-error" role="alert">
          {error}
        </p>
      ) : null}
      {confirmar ? (
        <div className="flex flex-col items-start gap-space-3" role="alert">
          <p>{N2.eliminarAviso}</p>
          <div className="flex flex-wrap gap-space-3">
            <button className={botonPrimario()} type="button" onClick={eliminar} disabled={pendiente}>
              {N2.eliminarConfirmar}
            </button>
            <button className={botonSecundario()} type="button" onClick={() => setConfirmar(false)} disabled={pendiente}>
              {N2.cancelar}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-space-3">
          <Link className={botonPrimario()} href={ficha.siguiente}>
            {N2.continuar}
          </Link>
          {ficha.puedeEliminar ? (
            <button className={botonSecundario()} type="button" onClick={() => setConfirmar(true)}>
              {N2.eliminar}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
