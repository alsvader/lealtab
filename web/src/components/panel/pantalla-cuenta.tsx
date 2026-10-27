import Link from "next/link";
import { N1 } from "@/content/alta";
import { MarcoAlta } from "@/components/panel/alta-marco";
import { FormularioCuenta } from "@/components/panel/formulario-cuenta";

export function PantallaCuenta() {
  return (
    <MarcoAlta paso="cuenta">
      <div className="flex max-w-xl flex-1 flex-col gap-space-4">
        <h1 className="font-display text-h2 font-extrabold">{N1.titulo}</h1>
        <p className="text-text-muted">{N1.bajada}</p>
        <p className="font-semibold">{N1.conCodigo}</p>
        <FormularioCuenta />
        <p className="text-text-muted">
          Te enviamos un código a tu correo para entrar, sin contraseña. Al continuar aceptas los{" "}
          <Link className="underline" href="/terminos-y-condiciones">
            {N1.terminos}
          </Link>{" "}
          y el{" "}
          <Link className="underline" href="/aviso-de-privacidad">
            {N1.aviso}
          </Link>
          .
        </p>
      </div>
      <aside className="flex h-fit w-full max-w-md flex-col gap-space-3 rounded-card border-[1.5px] border-noche bg-surface p-space-5">
        <h2 className="font-display text-h4 font-extrabold">{N1.pruebaTitulo}</h2>
        <ul className="flex flex-col gap-space-2">
          {N1.prueba.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </MarcoAlta>
  );
}

