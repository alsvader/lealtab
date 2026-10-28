"use client";

import { useRef, useState } from "react";
import { RECUPERAR } from "@/content/recuperar";
import { mostrarWhatsapp, whatsappCliente } from "@/lib/negocio/alta";

const campo = "min-h-12 w-full rounded-control border-2 bg-surface px-space-3 font-body text-text";
const boton =
  "inline-flex min-h-12 w-full items-center justify-center rounded-control border-2 border-noche bg-bosque px-space-4 font-body text-ui font-bold text-lino shadow-button disabled:opacity-70";

type Tarjeta = { negocio: string; slug: string; sellos: number; meta: number };

export function FormularioRecuperar() {
  const [telefono, setTelefono] = useState("");
  const [e164, setE164] = useState("");
  const [nacional, setNacional] = useState("");
  const [codigo, setCodigo] = useState("");
  const [paso, setPaso] = useState<"telefono" | "codigo" | "lista">("telefono");
  const [pendiente, setPendiente] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [sinRed, setSinRed] = useState(false);
  const [aviso, setAviso] = useState(true);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const enviando = useRef(false);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const codigoRef = useRef<HTMLInputElement>(null);

  async function pedir(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current) return;
    const numero = whatsappCliente(telefono);
    if (!numero.ok) {
      setMensaje(numero.motivo === "otro" ? RECUPERAR.telefonoOtro : RECUPERAR.telefonoCorto);
      telefonoRef.current?.focus();
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setSinRed(true);
      return;
    }
    enviando.current = true;
    setPendiente(true);
    setMensaje("");
    setSinRed(false);
    try {
      const respuesta = await fetch("/c/api/auth/codigo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ telefono: numero.e164 }),
      });
      if (!respuesta.ok) {
        setMensaje(RECUPERAR.telefonoServidor);
        telefonoRef.current?.focus();
        return;
      }
      setE164(numero.e164);
      setNacional(numero.nacional);
      setCodigo("");
      setPaso("codigo");
    } catch {
      setSinRed(true);
    } finally {
      enviando.current = false;
      setPendiente(false);
    }
  }

  async function entrar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando.current) return;
    if (!/^\d{6}$/.test(codigo)) {
      setMensaje(RECUPERAR.codigoError);
      codigoRef.current?.focus();
      return;
    }
    enviando.current = true;
    setPendiente(true);
    setMensaje("");
    try {
      const respuesta = await fetch("/c/api/auth/verificar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ telefono: e164, codigo, cerrarOtras: true }),
      });
      if (!respuesta.ok) {
        setMensaje(respuesta.status === 401 ? RECUPERAR.codigoError : RECUPERAR.pregunta);
        codigoRef.current?.focus();
        return;
      }
      const lista = await fetch("/c/api/tarjetas");
      if (!lista.ok) {
        setMensaje(RECUPERAR.pregunta);
        return;
      }
      const cuerpo = (await lista.json()) as { tarjetas?: Tarjeta[] };
      setTarjetas(cuerpo.tarjetas ?? []);
      setPaso("lista");
    } catch {
      setSinRed(true);
    } finally {
      enviando.current = false;
      setPendiente(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-space-4 bg-bg px-space-4 py-space-6 text-text">
      {paso === "lista" ? (
        <section aria-live="polite" className="flex flex-col gap-space-4">
          <h1 className="font-display text-h2 font-extrabold">{RECUPERAR.listo}</h1>
          <p className="sr-only">{RECUPERAR.listoVivo}</p>
          {aviso ? (
            <div className="flex flex-col gap-space-3 rounded-card border-2 border-noche bg-durazno-claro p-space-4">
              <p className="font-bold">{RECUPERAR.seguro}</p>
              <p>{RECUPERAR.seguroCuerpo}</p>
              <button className="inline-flex min-h-11 items-center font-bold underline" type="button" onClick={() => setAviso(false)}>
                {RECUPERAR.entendido}
              </button>
            </div>
          ) : null}
          <ul className="flex flex-col gap-space-3">
            {tarjetas.map((tarjeta) => (
              <li key={tarjeta.slug} className="rounded-card border-2 border-noche bg-surface p-space-4">
                <p className="font-display text-h4 font-extrabold">{tarjeta.negocio}</p>
                <p className="font-display text-stat font-extrabold">
                  {tarjeta.sellos}/{tarjeta.meta}
                </p>
              </li>
            ))}
          </ul>
          <Pie />
        </section>
      ) : paso === "codigo" ? (
        <form className="flex flex-col gap-space-4" onSubmit={entrar} noValidate>
          <h1 className="font-display text-h2 font-extrabold">{RECUPERAR.codigoTitulo}</h1>
          <p>{RECUPERAR.codigoCuerpo(mostrarWhatsapp(nacional))}</p>
          <label className="flex flex-col gap-space-2 text-ui font-semibold" htmlFor="recuperar-codigo">
            {RECUPERAR.codigoEtiqueta}
            <input
              ref={codigoRef}
              id="recuperar-codigo"
              className={`${campo} border-noche`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              readOnly={pendiente}
              aria-invalid={mensaje ? true : undefined}
              aria-describedby={mensaje ? "recuperar-error" : undefined}
              value={codigo}
              onChange={(event) => setCodigo(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
          {mensaje ? (
            <p id="recuperar-error" className="text-error" role="alert">
              {mensaje}
            </p>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {pendiente ? RECUPERAR.verificandoVivo : ""}
          </p>
          <button className={boton} type="submit" disabled={pendiente} aria-busy={pendiente || undefined}>
            {pendiente ? RECUPERAR.verificando : RECUPERAR.entrar}
          </button>
          <button className="inline-flex min-h-11 items-center font-semibold underline" type="button" onClick={() => setPaso("telefono")}>
            {RECUPERAR.cambiar}
          </button>
          <Pie />
        </form>
      ) : (
        <form className="flex flex-col gap-space-4" onSubmit={pedir} noValidate>
          <h1 className="font-display text-h2 font-extrabold">{RECUPERAR.titulo}</h1>
          <p>{RECUPERAR.cuerpo}</p>
          <label className="flex flex-col gap-space-2 text-ui font-semibold" htmlFor="recuperar-whatsapp">
            {RECUPERAR.whatsapp}
            <span className="flex min-h-12 overflow-hidden rounded-control border-2 border-noche bg-surface">
              <span className="inline-flex items-center border-r-2 border-noche px-space-3 font-bold" aria-hidden="true">
                {RECUPERAR.prefijo}
              </span>
              <input
                ref={telefonoRef}
                id="recuperar-whatsapp"
                className="min-h-12 w-full border-0 bg-transparent px-space-3 font-body text-text outline-none"
                inputMode="tel"
                autoComplete="tel-national"
                readOnly={pendiente}
                aria-invalid={mensaje ? true : undefined}
                aria-describedby={mensaje ? "recuperar-error recuperar-ayuda" : "recuperar-ayuda"}
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
              />
            </span>
          </label>
          <p id="recuperar-ayuda" className="text-ui text-text-muted">
            {RECUPERAR.ayuda}
          </p>
          {mensaje ? (
            <p id="recuperar-error" className="text-error" role="alert">
              {mensaje}
            </p>
          ) : null}
          {sinRed ? (
            <div role="alert" className="rounded-card border-2 border-noche bg-durazno-claro p-space-4">
              <p className="font-bold">{RECUPERAR.sinConexion}</p>
              <p>{RECUPERAR.sinConexionCuerpo}</p>
            </div>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {pendiente ? RECUPERAR.enviandoVivo : ""}
          </p>
          <button className={boton} type="submit" disabled={pendiente} aria-busy={pendiente || undefined}>
            {pendiente ? RECUPERAR.enviando : RECUPERAR.enviar}
          </button>
          <details className="rounded-card border-2 border-noche bg-surface p-space-4">
            <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold">{RECUPERAR.sinNumero}</summary>
            <h2 className="mt-space-3 font-display text-h4 font-extrabold">{RECUPERAR.sinNumeroTitulo}</h2>
            <p className="mt-space-2">{RECUPERAR.sinNumeroCuerpo}</p>
          </details>
          <Pie />
        </form>
      )}
    </main>
  );
}

function Pie() {
  return (
    <p className="mt-auto pt-space-4 text-center text-ui">
      {RECUPERAR.hecho} <strong>{RECUPERAR.marca}</strong>
    </p>
  );
}
