"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { N3 } from "@/content/alta";
import { botonPrimario, botonSecundario, Campo, campoClase } from "@/components/panel/alta-marco";

export function FormularioTarjeta() {
  const router = useRouter();
  const [sellos, setSellos] = useState(8);
  const [recompensa, setRecompensa] = useState("");
  const [bienvenida, setBienvenida] = useState(true);
  const [error, setError] = useState("");
  const [pendiente, setPendiente] = useState(false);

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    setPendiente(true);
    setError("");
    const respuesta = await fetch("/panel/api/tarjeta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sellos, recompensa, bienvenida }),
    });
    setPendiente(false);
    if (!respuesta.ok) {
      setError("Escribe la recompensa. Los sellos van de 4 a 12.");
      return;
    }
    router.push("/panel/cartel");
  }

  return (
    <>
      <form className="flex max-w-xl flex-1 flex-col gap-space-4" onSubmit={guardar}>
        <h1 className="font-display text-h2 font-extrabold">{N3.titulo}</h1>
        <p className="text-text-muted">{N3.bajada}</p>
        <div className="flex flex-col gap-space-2">
          <p className="text-ui font-semibold" id="sellos-etiqueta">
            {N3.sellos}
            <span className="mt-space-1 block font-normal text-text-muted">{N3.sellosAyuda}</span>
          </p>
          <div className="flex items-center gap-space-3" aria-labelledby="sellos-etiqueta">
            <button
              className={botonSecundario("min-w-11")}
              type="button"
              aria-label={N3.menos}
              onClick={() => setSellos((n) => Math.max(4, n - 1))}
            >
              −
            </button>
            <span className="min-w-11 text-center font-display text-h4 font-extrabold">{sellos}</span>
            <button
              className={botonSecundario("min-w-11")}
              type="button"
              aria-label={N3.mas}
              onClick={() => setSellos((n) => Math.min(12, n + 1))}
            >
              +
            </button>
          </div>
        </div>
        <Campo etiqueta={N3.recompensa}>
          <input
            className={campoClase}
            name="recompensa"
            required
            value={recompensa}
            onChange={(e) => setRecompensa(e.target.value)}
          />
        </Campo>
        <div className="flex items-center justify-between gap-space-4 rounded-card border-[1.5px] border-noche bg-surface p-space-4">
          <p id="bienvenida-texto">
            <span className="block font-bold">{N3.bienvenida}</span>
            <span className="text-text-muted">{N3.bienvenidaAyuda}</span>
          </p>
          <button
            className={`relative h-11 w-14 shrink-0 rounded-full border-2 border-noche ${bienvenida ? "bg-bosque" : "bg-surface"}`}
            type="button"
            role="switch"
            aria-checked={bienvenida}
            aria-labelledby="bienvenida-texto"
            onClick={() => setBienvenida((v) => !v)}
          />
        </div>
        {error ? (
          <p className="text-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex justify-between gap-space-3">
          <Link className={botonSecundario()} href="/panel/negocio">
            {N3.atras}
          </Link>
          <button className={botonPrimario()} type="submit" disabled={pendiente}>
            {N3.continuar}
          </button>
        </div>
      </form>
      <aside className="flex w-full max-w-sm flex-col items-center gap-space-3">
        <p className="text-text-muted">
          <strong className="text-text">{N3.previa}</strong> · {N3.previaAyuda}
        </p>
        <div className="flex w-full flex-col items-center gap-space-2 rounded-card border-2 border-noche bg-bg p-space-4">
          <p className="font-display text-stat font-extrabold">{bienvenida ? 1 : 0}/{sellos}</p>
          <p className="text-text-muted">{N3.sellosEtiqueta}</p>
        </div>
        {bienvenida ? (
          <p className="w-full rounded-control bg-menta px-space-3 py-space-2 font-semibold text-bosque">{N3.nota}</p>
        ) : null}
      </aside>
    </>
  );
}
