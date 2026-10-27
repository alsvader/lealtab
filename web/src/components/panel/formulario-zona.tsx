"use client";

import { useState } from "react";
import Link from "next/link";
import { AJUSTES, ETIQUETA_ZONA, GIRO_ETIQUETA } from "@/content/ajustes";
import { ZONAS_MEXICO } from "@/lib/negocio/alta";
import { botonPrimario, Campo, campoClase } from "@/components/panel/alta-marco";

export function FormularioZona({
  negocio,
}: {
  negocio: { nombre: string; giro: string; ciudad: string; zona: string };
}) {
  const [zona, setZona] = useState(negocio.zona);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [pendiente, setPendiente] = useState(false);

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    setPendiente(true);
    setMensaje("");
    setError("");
    const respuesta = await fetch("/panel/api/ajustes/zona", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ zona }),
    });
    setPendiente(false);
    if (!respuesta.ok) {
      setError(AJUSTES.error);
      return;
    }
    setMensaje(AJUSTES.listo);
  }

  return (
    <form className="flex max-w-xl flex-col gap-space-4" onSubmit={guardar}>
      <h1 className="font-display text-h2 font-extrabold">{AJUSTES.titulo}</h1>
      <section className="flex flex-col gap-space-2 rounded-card border-[1.5px] border-noche bg-surface p-space-4">
        <h2 className="font-display text-h4 font-extrabold">{AJUSTES.seccion}</h2>
        <p className="font-bold">{negocio.nombre}</p>
        <p className="text-text-muted">{GIRO_ETIQUETA[negocio.giro] ?? negocio.giro}</p>
        <p className="text-text-muted">{negocio.ciudad}</p>
      </section>
      <Campo etiqueta={AJUSTES.zona} ayuda={AJUSTES.zonaAyuda}>
        <select className={campoClase} value={zona} onChange={(event) => setZona(event.target.value)}>
          {ZONAS_MEXICO.map((valor) => (
            <option key={valor} value={valor}>
              {ETIQUETA_ZONA[valor]}
            </option>
          ))}
        </select>
      </Campo>
      {error ? (
        <p className="text-error" role="alert">
          {error}
        </p>
      ) : null}
      {mensaje ? <p role="status">{mensaje}</p> : null}
      <button className={botonPrimario("self-start")} type="submit" disabled={pendiente}>
        {AJUSTES.guardar}
      </button>
      <Link className="self-start underline" href="/panel/cartel">
        {AJUSTES.cartel}
      </Link>
    </form>
  );
}
