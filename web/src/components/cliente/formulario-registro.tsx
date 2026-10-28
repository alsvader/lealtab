"use client";

import { useRef, useState } from "react";
import { REGISTRO } from "@/content/registro";
import { inicialesNegocio, mostrarWhatsapp, whatsappCliente } from "@/lib/negocio/alta";
import type { NegocioPublico } from "@/lib/negocio/publico-tipo";

const campo =
  "min-h-12 w-full rounded-control border-2 bg-surface px-space-3 font-body text-text";
const boton =
  "inline-flex min-h-12 w-full items-center justify-center rounded-control border-2 border-noche bg-bosque px-space-4 font-body text-ui font-bold text-lino shadow-button disabled:opacity-70";

type ErrorCampo = "nombre" | "telefono" | "casilla" | null;

export function FormularioRegistro({ negocio }: { negocio: NegocioPublico }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [paso, setPaso] = useState<"datos" | "codigo">("datos");
  const [nacional, setNacional] = useState("");
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState<ErrorCampo>(null);
  const [mensaje, setMensaje] = useState("");
  const [sinRed, setSinRed] = useState(false);
  const enviando = useRef(false);
  const nombreRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const casillaRef = useRef<HTMLInputElement>(null);

  function fallar(campo: ErrorCampo, texto: string, foco: HTMLElement | null) {
    setError(campo);
    setMensaje(texto);
    foco?.focus();
  }

  async function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current) return;
    setSinRed(false);
    const limpio = nombre.trim();
    if (limpio.length < 1 || limpio.length > 60) {
      fallar("nombre", REGISTRO.nombreError, nombreRef.current);
      return;
    }
    const numero = whatsappCliente(telefono);
    if (!numero.ok) {
      fallar("telefono", numero.motivo === "otro" ? REGISTRO.telefonoOtro : REGISTRO.telefonoCorto, telefonoRef.current);
      return;
    }
    if (!acepto) {
      fallar("casilla", REGISTRO.casillaError, casillaRef.current);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSinRed(true);
      return;
    }

    enviando.current = true;
    setPendiente(true);
    setError(null);
    setMensaje("");
    try {
      const respuesta = await fetch("/c/api/auth/codigo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ telefono: numero.e164 }),
      });
      if (!respuesta.ok) {
        fallar("telefono", REGISTRO.telefonoServidor, telefonoRef.current);
        return;
      }
      sessionStorage.setItem(
        `lt-registro:${negocio.slug}`,
        JSON.stringify({ nombre: limpio, telefono: numero.nacional, paso: "codigo" }),
      );
      setNacional(numero.nacional);
      setPaso("codigo");
    } catch {
      setSinRed(true);
    } finally {
      enviando.current = false;
      setPendiente(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-space-4 bg-bg px-space-4 py-space-6 text-text">
      <header className="flex items-center gap-space-3">
        <span
          className="inline-flex size-12 items-center justify-center rounded-full border-2 border-noche bg-menta font-display font-extrabold text-bosque"
          aria-hidden="true"
        >
          {inicialesNegocio(negocio.nombre)}
        </span>
        <p className="font-display text-h4 font-extrabold">{negocio.nombre}</p>
      </header>

      {paso === "codigo" ? (
        <section className="flex flex-col gap-space-3" aria-live="polite">
          <h1 className="font-display text-h2 font-extrabold">{REGISTRO.codigoTitulo}</h1>
          <p>{REGISTRO.codigoCuerpo(mostrarWhatsapp(nacional))}</p>
          <Pie />
        </section>
      ) : (
        <form className="flex flex-col gap-space-4" onSubmit={enviar} noValidate>
          <div>
            <p className="font-bold">{REGISTRO.paso}</p>
            <div className="mt-space-2 flex gap-space-2" aria-hidden="true">
              <span className="h-2 flex-1 rounded-full bg-bosque" />
              <span className="h-2 flex-1 rounded-full bg-border" />
            </div>
          </div>
          <h1 className="font-display text-h2 font-extrabold">{REGISTRO.titulo(negocio.recompensa)}</h1>
          <p>{REGISTRO.subtitulo}</p>

          <label className="flex flex-col gap-space-2 text-ui font-semibold" htmlFor="registro-nombre">
            {REGISTRO.nombre}
            <input
              ref={nombreRef}
              id="registro-nombre"
              className={`${campo} ${error === "nombre" ? "border-error" : "border-noche"}`}
              name="nombre"
              autoComplete="name"
              readOnly={pendiente}
              aria-invalid={error === "nombre" || undefined}
              aria-describedby={error === "nombre" ? "registro-error" : undefined}
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-space-2 text-ui font-semibold" htmlFor="registro-whatsapp">
            {REGISTRO.whatsapp}
            <span
              className={`flex min-h-12 overflow-hidden rounded-control border-2 bg-surface ${error === "telefono" ? "border-error" : "border-noche"}`}
            >
              <span className="inline-flex items-center border-r-2 border-noche px-space-3 font-bold" aria-hidden="true">
                {REGISTRO.prefijo}
              </span>
              <input
                ref={telefonoRef}
                id="registro-whatsapp"
                className="min-h-12 w-full border-0 bg-transparent px-space-3 font-body text-text outline-none"
                name="whatsapp"
                inputMode="tel"
                autoComplete="tel-national"
                readOnly={pendiente}
                aria-invalid={error === "telefono" || undefined}
                aria-describedby={error === "telefono" ? "registro-error registro-whatsapp-ayuda" : "registro-whatsapp-ayuda"}
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
              />
            </span>
          </label>
          <p id="registro-whatsapp-ayuda" className="text-ui text-text-muted">
            {REGISTRO.whatsappAyuda}
          </p>

          <p>
            <strong>{REGISTRO.avisoTitulo}</strong> {REGISTRO.aviso(negocio.nombre)}{" "}
            <a className="inline-flex min-h-11 items-center underline" href={REGISTRO.avisoHref}>
              {REGISTRO.avisoEnlace}
            </a>
          </p>

          <label className="flex min-h-11 items-center gap-space-3 text-ui font-semibold" htmlFor="registro-aviso">
            <input
              ref={casillaRef}
              id="registro-aviso"
              className="size-5"
              type="checkbox"
              name="acepto"
              checked={acepto}
              disabled={pendiente}
              aria-invalid={error === "casilla" || undefined}
              aria-describedby={error === "casilla" ? "registro-error" : undefined}
              onChange={(event) => setAcepto(event.target.checked)}
            />
            {REGISTRO.casilla}
          </label>

          {mensaje ? (
            <p id="registro-error" className="text-error" role="alert">
              {mensaje}
            </p>
          ) : null}
          {sinRed ? (
            <div role="alert" className="flex flex-col gap-space-3 rounded-card border-2 border-noche bg-durazno-claro p-space-4">
              <p className="font-bold">{REGISTRO.sinConexion}</p>
              <p>{REGISTRO.sinConexionCuerpo}</p>
            </div>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {pendiente ? REGISTRO.enviandoVivo : ""}
          </p>

          <button className={boton} type="submit" disabled={pendiente} aria-busy={pendiente || undefined}>
            {pendiente ? REGISTRO.enviando : REGISTRO.enviar}
          </button>
          <p className="text-center text-ui">{REGISTRO.bajoBoton}</p>
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
