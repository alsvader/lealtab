"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { N1 } from "@/content/alta";
import { botonPrimario, Campo, campoClase } from "@/components/panel/alta-marco";

export function FormularioCuenta() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [fase, setFase] = useState<"datos" | "codigo">("datos");
  const [error, setError] = useState("");
  const [pendiente, setPendiente] = useState(false);

  async function pedir(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    const respuesta = await fetch("/panel/api/auth/codigo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ correo }),
    });
    setPendiente(false);
    if (!respuesta.ok) {
      setError(N1.correoInvalido);
      return;
    }
    setFase("codigo");
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
    setPendiente(false);
    if (!respuesta.ok) {
      setError(N1.codigoError);
      return;
    }
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
          <p id="codigo-error" className="text-error" role="alert">
            {error}
          </p>
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
