"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { N1, N2 } from "@/content/alta";
import { botonPrimario, botonSecundario, Campo, campoClase } from "@/components/panel/alta-marco";
import { inicialesNegocio } from "@/lib/negocio/alta";

const GIROS = [
  { valor: "barberia", etiqueta: "Barbería" },
  { valor: "estetica", etiqueta: "Estética o salón" },
  { valor: "tapioca", etiqueta: "Tapioca" },
  { valor: "cafeteria", etiqueta: "Cafetería" },
  { valor: "otro", etiqueta: "Otro" },
] as const;

export function FormularioNegocio() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [giro, setGiro] = useState<string>("barberia");
  const [error, setError] = useState("");
  const [pendiente, setPendiente] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (logoRef.current) URL.revokeObjectURL(logoRef.current);
    };
  }, []);

  function elegirLogo(event: React.ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0];
    if (logoRef.current) URL.revokeObjectURL(logoRef.current);
    const siguiente = archivo && archivo.type.startsWith("image/") ? URL.createObjectURL(archivo) : null;
    logoRef.current = siguiente;
    setLogoUrl(siguiente);
  }

  async function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendiente(true);
    setError("");
    const guardado = leerAlta();
    const form = new FormData(event.currentTarget);
    form.set("nombre", nombre || guardado.nombre);
    form.set("whatsapp", whatsapp || guardado.whatsapp);
    form.set("giro", giro);
    form.set("zona", Intl.DateTimeFormat().resolvedOptions().timeZone);
    const respuesta = await fetch("/panel/api/negocio", { method: "POST", body: form });
    setPendiente(false);
    if (!respuesta.ok) {
      setError("Revisa el nombre, la ciudad y el WhatsApp de 10 dígitos.");
      return;
    }
    router.push("/panel/tarjeta");
  }

  return (
    <form className="flex max-w-xl flex-1 flex-col gap-space-4" onSubmit={enviar}>
      <h1 className="font-display text-h2 font-extrabold">{N2.titulo}</h1>
      <p className="text-text-muted">{N2.bajada}</p>
      <Campo etiqueta={N2.nombre}>
        <input className={campoClase} name="nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </Campo>
      <fieldset className="flex flex-col gap-space-2">
        <legend className="text-ui font-semibold">{N2.giro}</legend>
        <div className="flex flex-wrap gap-space-2">
          {GIROS.map((opcion) => (
            <label key={opcion.valor} className={giro === opcion.valor ? botonPrimario() : botonSecundario()}>
              <input
                className="sr-only"
                type="radio"
                name="giro-ui"
                checked={giro === opcion.valor}
                onChange={() => setGiro(opcion.valor)}
              />
              {opcion.etiqueta}
            </label>
          ))}
        </div>
      </fieldset>
      <Campo etiqueta={N2.ciudad}>
        <input className={campoClase} name="ciudad" required autoComplete="address-level2" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
      </Campo>
      <Campo etiqueta={N1.whatsapp} ayuda="10 dígitos. Lo pedimos en la cuenta y aquí lo confirmas.">
        <input className={campoClase} name="whatsapp-ui" inputMode="tel" autoComplete="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
      </Campo>
      <Campo etiqueta={N2.logo} ayuda={N2.logoAyuda}>
        <span className="flex items-center gap-space-3 rounded-control border-2 border-dashed border-gris-noche p-space-4">
          <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-control bg-noche font-bold text-lino" aria-hidden="true">
            {logoUrl ? <img alt="" className="size-full object-cover" src={logoUrl} /> : inicialesNegocio(nombre)}
          </span>
          <span className="flex min-w-0 flex-col gap-space-2 font-normal text-text-muted">
            <span>{N2.logoZona}</span>
            <input name="logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={elegirLogo} />
          </span>
        </span>
      </Campo>
      {error ? (
        <p className="text-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex justify-end gap-space-3">
        <button className={botonPrimario()} type="submit" disabled={pendiente}>
          {N2.continuar}
        </button>
      </div>
    </form>
  );
}

function leerAlta(): { nombre: string; whatsapp: string } {
  try {
    const datos = JSON.parse(sessionStorage.getItem("lt-alta") ?? "{}") as { nombre?: string; whatsapp?: string };
    return { nombre: datos.nombre ?? "", whatsapp: datos.whatsapp ?? "" };
  } catch {
    return { nombre: "", whatsapp: "" };
  }
}
