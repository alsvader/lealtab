"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ENTRADA, N1 } from "@/content/alta";
import { botonPrimario, botonSecundario, Campo, campoClase } from "@/components/panel/alta-marco";

type Modo = "codigo" | "contrasena" | "olvidar" | "nueva";

export function FormularioEntrada() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("codigo");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pedido, setPedido] = useState(false);
  const [contrasena, setContrasena] = useState("");
  const [ver, setVer] = useState(false);
  const [cerrarOtras, setCerrarOtras] = useState(false);
  const [error, setError] = useState("");
  const [pausa, setPausa] = useState(false);
  const [pendiente, setPendiente] = useState(false);

  function cambiarModo(siguiente: Modo) {
    setModo(siguiente);
    setError("");
    setPausa(false);
  }

  async function enviarCodigo(event: React.FormEvent) {
    event.preventDefault();
    setPendiente(true);
    setError("");
    const ruta = modo === "olvidar" ? "/panel/api/auth/restablecer/codigo" : "/panel/api/auth/codigo";
    const respuesta = await fetch(ruta, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ correo }),
    });
    setPendiente(false);
    if (!respuesta.ok) {
      setError(N1.correoInvalido);
      return;
    }
    if (modo === "olvidar") setModo("nueva");
    else setPedido(true);
  }

  async function entrarCodigo(event: React.FormEvent) {
    event.preventDefault();
    setPendiente(true);
    setError("");
    const respuesta = await fetch("/panel/api/auth/verificar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ correo, codigo }),
    });
    setPendiente(false);
    if (!respuesta.ok) {
      setError(N1.codigoError);
      return;
    }
    router.push("/panel/negocio");
  }

  async function entrarContrasena(event: React.FormEvent) {
    event.preventDefault();
    setPendiente(true);
    setError("");
    setPausa(false);
    const respuesta = await fetch("/panel/api/auth/contrasena", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });
    const cuerpo = (await respuesta.json().catch(() => null)) as { pausa?: boolean } | null;
    setPendiente(false);
    if (!respuesta.ok) {
      setPausa(cuerpo?.pausa === true);
      setError(cuerpo?.pausa ? ENTRADA.pausa : ENTRADA.error);
      return;
    }
    router.push("/panel/negocio");
  }

  async function guardar(event: React.FormEvent) {
    event.preventDefault();
    if (contrasena.length < 8 || contrasena.length > 72) {
      setError(ENTRADA.corta);
      return;
    }
    setPendiente(true);
    setError("");
    const respuesta = await fetch("/panel/api/auth/restablecer/confirmar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ correo, codigo, contrasena, cerrarOtras }),
    });
    setPendiente(false);
    if (!respuesta.ok) {
      setError(N1.codigoError);
      return;
    }
    router.push("/panel/negocio");
  }

  const pestana = (id: "codigo" | "contrasena", etiqueta: string) => (
    <button
      className={modo === id ? botonPrimario() : botonSecundario()}
      type="button"
      aria-pressed={modo === id}
      onClick={() => cambiarModo(id)}
    >
      {etiqueta}
    </button>
  );

  if (modo === "olvidar") {
    return (
      <form className="flex flex-col gap-space-4" onSubmit={enviarCodigo}>
        <h2 className="font-display text-h3 font-extrabold">{ENTRADA.nuevaTitulo}</h2>
        <p className="text-text-muted">{ENTRADA.nuevaAyuda}</p>
        <Campo etiqueta={N1.correo}>
          <input className={campoClase} type="email" autoComplete="username" inputMode="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </Campo>
        {error ? <p className="text-error" role="alert">{error}</p> : null}
        <button className={botonPrimario("self-start")} type="submit" disabled={pendiente}>{ENTRADA.enviarCodigo}</button>
        <button className="self-start underline" type="button" onClick={() => cambiarModo("contrasena")}>{ENTRADA.volver}</button>
      </form>
    );
  }

  if (modo === "nueva") {
    return (
      <form className="flex flex-col gap-space-4" onSubmit={guardar}>
        <h2 className="font-display text-h3 font-extrabold">{ENTRADA.revisa}</h2>
        <p className="text-text-muted">{ENTRADA.siTieneCuenta}</p>
        <Campo etiqueta={ENTRADA.codigoEtiqueta}>
          <input className={campoClase} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        </Campo>
        <Campo etiqueta={ENTRADA.contrasenaNueva} ayuda={ENTRADA.contrasenaAyuda}>
          <input className={campoClase} type={ver ? "text" : "password"} autoComplete="new-password" aria-invalid={error ? true : undefined} value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
        </Campo>
        <label className="flex items-start gap-space-2">
          <input type="checkbox" checked={cerrarOtras} onChange={(e) => setCerrarOtras(e.target.checked)} />
          <span>
            {ENTRADA.cerrarOtras}
            <span className="block text-text-muted">{ENTRADA.cerrarOtrasAyuda}</span>
          </span>
        </label>
        {error ? <p className="text-error" role="alert">{error}</p> : null}
        <button className={botonPrimario("self-start")} type="submit" disabled={pendiente}>{ENTRADA.guardar}</button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-space-4">
      <h2 className="font-display text-h3 font-extrabold">{ENTRADA.titulo}</h2>
      <div className="flex flex-wrap gap-space-2" aria-label={N1.pestanas}>
        {pestana("codigo", N1.conCodigo)}
        {pestana("contrasena", N1.conContrasena)}
      </div>
      {modo === "codigo" ? (
        <form className="flex flex-col gap-space-4" onSubmit={pedido ? entrarCodigo : enviarCodigo}>
          <Campo etiqueta={N1.correo}>
            <input className={campoClase} type="email" autoComplete="email" inputMode="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </Campo>
          {pedido ? (
            <Campo etiqueta={ENTRADA.codigoEtiqueta}>
              <input className={campoClase} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            </Campo>
          ) : (
            <p className="text-text-muted">{ENTRADA.codigoAyuda}</p>
          )}
          {error ? <p className="text-error" role="alert">{error}</p> : null}
          <button className={botonPrimario("self-start")} type="submit" disabled={pendiente} aria-busy={pendiente}>
            {pedido ? ENTRADA.entrar : ENTRADA.enviarCodigo}
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-space-4" onSubmit={entrarContrasena}>
          <Campo etiqueta={N1.correo}>
            <input className={campoClase} type="email" autoComplete="username" inputMode="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "entrada-error" : undefined} />
          </Campo>
          <Campo etiqueta={ENTRADA.contrasena}>
            <span className="flex gap-space-2">
              <input className={campoClase} type={ver ? "text" : "password"} autoComplete="current-password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "entrada-error" : undefined} />
              <button className={botonSecundario()} type="button" aria-pressed={ver} onClick={() => setVer((v) => !v)}>
                {ver ? ENTRADA.ocultar : ENTRADA.mostrar}
              </button>
            </span>
          </Campo>
          {error ? (
            <p id="entrada-error" className="text-error" role="alert">
              {pausa ? ENTRADA.pausa : ENTRADA.error}
            </p>
          ) : null}
          <button className={botonPrimario("self-start")} type="submit" disabled={pendiente} aria-busy={pendiente}>
            {pendiente ? ENTRADA.entrando : ENTRADA.entrar}
          </button>
          <button className="self-start underline" type="button" onClick={() => cambiarModo("olvidar")}>
            {ENTRADA.olvidaste}
          </button>
        </form>
      )}
    </div>
  );
}
