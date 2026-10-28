"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { REGISTRO, SEGUNDO } from "@/content/registro";
import { inicialesNegocio } from "@/lib/negocio/alta";
import type { NegocioPublico } from "@/lib/negocio/publico-tipo";

const campo = "min-h-12 w-full rounded-control border-2 bg-surface px-space-3 font-body text-text";
const boton =
  "inline-flex min-h-12 w-full items-center justify-center rounded-control border-2 border-noche bg-bosque px-space-4 font-body text-ui font-bold text-lino shadow-button disabled:opacity-70";

export function FormularioSegundo({
  negocio,
  nombrePrevio,
  last4,
}: {
  negocio: NegocioPublico;
  nombrePrevio: string | null;
  last4: string;
}) {
  const [nombre, setNombre] = useState(nombrePrevio ?? "");
  const [acepto, setAcepto] = useState(false);
  const [pendiente, setPendiente] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState<"nombre" | "casilla" | null>(null);
  const [lista, setLista] = useState(false);
  const [bienvenida, setBienvenida] = useState(false);
  const [sinRed, setSinRed] = useState(false);
  const enviando = useRef(false);
  const router = useRouter();
  const nombreRef = useRef<HTMLInputElement>(null);
  const casillaRef = useRef<HTMLInputElement>(null);

  async function agregar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current) return;
    const limpio = nombre.trim();
    if (limpio.length < 1 || limpio.length > 60) {
      setError("nombre");
      setMensaje(SEGUNDO.nombreError);
      nombreRef.current?.focus();
      return;
    }
    if (!acepto) {
      setError("casilla");
      setMensaje(SEGUNDO.casillaError(negocio.nombre));
      casillaRef.current?.focus();
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSinRed(true);
      return;
    }
    enviando.current = true;
    setPendiente(true);
    setMensaje("");
    setError(null);
    setSinRed(false);
    try {
      const respuesta = await fetch("/c/api/auth/segundo-negocio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: negocio.slug, nombre: limpio, acepto: true }),
      });
      if (!respuesta.ok) {
        setMensaje(SEGUNDO.guardarError);
        return;
      }
      const cuerpo = (await respuesta.json()) as { bienvenida?: boolean };
      setBienvenida(cuerpo.bienvenida === true);
      setLista(true);
    } catch {
      setSinRed(true);
    } finally {
      enviando.current = false;
      setPendiente(false);
    }
  }

  async function otroNumero() {
    await fetch("/c/api/auth/salir", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-space-4 bg-bg px-space-4 py-space-6 text-text">
      <header className="flex items-center gap-space-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-noche bg-menta font-display font-extrabold text-bosque" aria-hidden="true">
          {inicialesNegocio(negocio.nombre)}
        </span>
        <p className="font-display text-h4 font-extrabold">{negocio.nombre}</p>
      </header>
      {lista ? (
        <section aria-live="polite" className="flex flex-col gap-space-3">
          <h1 className="font-display text-h2 font-extrabold">{bienvenida ? SEGUNDO.bienvenida : SEGUNDO.listo(negocio.nombre)}</h1>
          <Pie />
        </section>
      ) : (
        <form className="flex flex-col gap-space-4" onSubmit={agregar} noValidate>
          <h1 className="font-display text-h2 font-extrabold">{SEGUNDO.titulo(negocio.nombre)}</h1>
          <p>{SEGUNDO.subtitulo}</p>
          <p>{SEGUNDO.cuenta(last4)}</p>
          <button className="inline-flex min-h-11 items-center text-left font-semibold underline" type="button" aria-label={SEGUNDO.otroEtiqueta} onClick={otroNumero}>
            {SEGUNDO.otro}
          </button>
          <label className="flex flex-col gap-space-2 text-ui font-semibold" htmlFor="segundo-nombre">
            {SEGUNDO.nombre(negocio.nombre)}
            <span className="font-normal text-text-muted">{nombrePrevio ? SEGUNDO.nombreAyuda : SEGUNDO.nombreAyudaVacio}</span>
            <input
              ref={nombreRef}
              id="segundo-nombre"
              className={`${campo} ${error === "nombre" ? "border-error" : "border-noche"}`}
              name="nombre"
              autoComplete="name"
              readOnly={pendiente}
              aria-invalid={error === "nombre" || undefined}
              aria-describedby={error === "nombre" ? "segundo-error" : undefined}
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
          </label>
          <p>
            <strong>{SEGUNDO.avisoTitulo}</strong> {SEGUNDO.aviso(negocio.nombre)}{" "}
            <a className="inline-flex min-h-11 items-center underline" href={SEGUNDO.avisoHref}>
              {SEGUNDO.avisoEnlace}
            </a>
          </p>
          <label className="flex min-h-11 items-center gap-space-3 text-ui font-semibold" htmlFor="segundo-aviso">
            <input
              ref={casillaRef}
              id="segundo-aviso"
              className="size-5"
              type="checkbox"
              checked={acepto}
              disabled={pendiente}
              aria-invalid={error === "casilla" || undefined}
              aria-describedby={error === "casilla" ? "segundo-error" : undefined}
              onChange={(event) => setAcepto(event.target.checked)}
            />
            {SEGUNDO.casilla(negocio.nombre)}
          </label>
          {mensaje ? (
            <p id="segundo-error" className="text-error" role="alert">
              {mensaje}
            </p>
          ) : null}
          {sinRed ? (
            <div role="alert" className="rounded-card border-2 border-noche bg-durazno-claro p-space-4">
              <p className="font-bold">{SEGUNDO.sinConexion}</p>
              <p>{SEGUNDO.sinConexionCuerpo}</p>
            </div>
          ) : null}
          <button className={boton} type="submit" disabled={pendiente} aria-busy={pendiente || undefined}>
            {pendiente ? SEGUNDO.agregando : SEGUNDO.agregar}
          </button>
          <Pie />
        </form>
      )}
    </main>
  );
}

function Pie() {
  return (
    <p className="mt-auto pt-space-4 text-center text-ui">
      {REGISTRO.hecho} <strong>{REGISTRO.marca}</strong>
    </p>
  );
}
