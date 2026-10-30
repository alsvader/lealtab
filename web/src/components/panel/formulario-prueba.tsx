"use client";

import { useState } from "react";
import { PRUEBA_AUTH } from "@/content/prueba-auth";
import { campoClase } from "@/components/panel/alta-marco";

export function FormularioPrueba() {
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function pedir(event: React.FormEvent) {
    event.preventDefault();
    setMensaje("");
    const respuesta = await fetch("/c/api/auth/codigo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ telefono }),
    });
    setMensaje(respuesta.ok ? "Si el número es de México, te enviamos un código." : "Revisa los 10 dígitos.");
  }

  return (
    <form className="flex flex-col gap-space-4" onSubmit={pedir}>
      <label className="flex flex-col gap-space-2 text-ui font-semibold">
        {PRUEBA_AUTH.telefono}
        <span className="font-normal text-text-muted">{PRUEBA_AUTH.ayuda}</span>
        <input
          className={campoClase}
          name="telefono"
          inputMode="tel"
          autoComplete="tel"
          value={telefono}
          onChange={(event) => setTelefono(event.target.value)}
        />
      </label>
      <button
        className="inline-flex min-h-11 items-center justify-center rounded-control border-2 border-noche bg-bosque px-space-4 font-bold text-lino"
        type="submit"
      >
        {PRUEBA_AUTH.pedir}
      </button>
      {mensaje ? <p role="status">{mensaje}</p> : null}
    </form>
  );
}
