"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AYUDA_WHATSAPP, ENTRADA, N1 } from "@/content/alta";
import { botonPrimario, botonSecundario, Campo, campoClase } from "@/components/panel/alta-marco";

export function FormularioCuenta() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [ver, setVer] = useState(false);
  const [fase, setFase] = useState<"datos" | "codigo">("datos");
  const [error, setError] = useState("");
  const [pendiente, setPendiente] = useState(false);

  function contrasenaOpcional(): string | null {
    if (contrasena.length === 0) return "";
    if (contrasena.length < 8 || contrasena.length > 72) return null;
    return contrasena;
  }

  async function pedirCodigo(): Promise<boolean> {
    const respuesta = await fetch("/panel/api/auth/codigo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ correo }),
    });
    if (!respuesta.ok) {
      setError(N1.correoInvalido);
      return false;
    }
    return true;
  }

  async function pedir(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (contrasenaOpcional() === null) {
      setError(ENTRADA.corta);
      return;
    }
    setPendiente(true);
    setError("");
    const datos = new FormData(event.currentTarget);
    sessionStorage.setItem(
      "lt-alta",
      JSON.stringify({
        nombre: String(datos.get("nombre") ?? ""),
        whatsapp: String(datos.get("whatsapp") ?? ""),
      }),
    );
    const ok = await pedirCodigo();
    setPendiente(false);
    if (ok) setFase("codigo");
  }

  async function otro() {
    setPendiente(true);
    setError("");
    setCodigo("");
    await pedirCodigo();
    setPendiente(false);
  }

  async function verificar(event: React.FormEvent) {
    event.preventDefault();
    setPendiente(true);
    setError("");
    const respuesta = await fetch("/panel/api/auth/verificar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ correo, codigo }),
    });
    if (!respuesta.ok) {
      setPendiente(false);
      setError(N1.codigoNoValido);
      return;
    }
    const clave = contrasenaOpcional();
    if (clave) {
      const creada = await fetch("/panel/api/auth/contrasena/crear", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contrasena: clave }),
      });
      if (!creada.ok) {
        setPendiente(false);
        setError(ENTRADA.corta);
        return;
      }
    }
    setPendiente(false);
    router.push("/panel/negocio");
  }

  if (fase === "codigo") {
    return (
      <form className="flex flex-col gap-space-4" onSubmit={verificar}>
        <p className="text-text-muted">{N1.codigo}</p>
        <Campo etiqueta={N1.codigoEtiqueta}>
          <input
            className={campoClase}
            name="codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "codigo-error" : undefined}
            value={codigo}
            onChange={(event) => setCodigo(event.target.value)}
          />
        </Campo>
        {error ? (
          <div id="codigo-error" className="flex flex-col items-start gap-space-3" role="alert">
            <p className="font-bold">Código vencido</p>
            <p className="text-error">{error}</p>
            <button className={botonSecundario()} type="button" onClick={otro} disabled={pendiente}>
              {N1.pedirOtro}
            </button>
            <a className="underline" href={AYUDA_WHATSAPP.href} rel="noopener noreferrer" target="_blank">
              {AYUDA_WHATSAPP.label}
            </a>
          </div>
        ) : null}
        <button className={botonPrimario("self-start")} type="submit" disabled={pendiente}>
          {N1.entrar}
        </button>
      </form>
    );
  }

  return (
    <form className="flex flex-col gap-space-4" onSubmit={pedir}>
      <Campo etiqueta={N1.nombre}>
        <input className={campoClase} name="nombre" autoComplete="name" />
      </Campo>
      <Campo etiqueta={N1.correo}>
        <input
          className={campoClase}
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "correo-error" : undefined}
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
        />
      </Campo>
      <Campo etiqueta={N1.whatsapp} ayuda={N1.whatsappAyuda}>
        <input className={campoClase} name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" />
      </Campo>
      <details className="rounded-control border-2 border-noche bg-surface px-space-3 py-space-2">
        <summary className="min-h-11 cursor-pointer py-space-2 font-semibold">{N1.crearContrasena}</summary>
        <div className="flex flex-col gap-space-3 pb-space-3">
          <p className="text-text-muted">{N1.crearContrasenaAyuda}</p>
          <Campo etiqueta={ENTRADA.contrasena} ayuda={ENTRADA.contrasenaAyuda}>
            <span className="flex gap-space-2">
              <input
                className={campoClase}
                type={ver ? "text" : "password"}
                autoComplete="new-password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                aria-invalid={error ? true : undefined}
              />
              <button className={botonSecundario()} type="button" aria-pressed={ver} onClick={() => setVer((v) => !v)}>
                {ver ? ENTRADA.ocultar : ENTRADA.mostrar}
              </button>
            </span>
          </Campo>
        </div>
      </details>
      {error ? (
        <p id="correo-error" className="text-error" role="alert">
          {error}
        </p>
      ) : null}
      <button className={botonPrimario("self-start")} type="submit" disabled={pendiente}>
        {N1.crear}
      </button>
    </form>
  );
}
