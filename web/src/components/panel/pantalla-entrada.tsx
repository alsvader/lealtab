import { MarcoAlta } from "@/components/panel/alta-marco";
import { FormularioEntrada } from "@/components/panel/formulario-entrada";

export function PantallaEntrada() {
  return (
    <MarcoAlta paso="cuenta">
      <div className="flex max-w-xl flex-1 flex-col">
        <FormularioEntrada />
      </div>
    </MarcoAlta>
  );
}
