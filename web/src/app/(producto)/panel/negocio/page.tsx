import { FormularioNegocio } from "@/components/panel/formulario-negocio";
import { MarcoAlta } from "@/components/panel/alta-marco";

export default function Page() {
  return (
    <MarcoAlta paso="negocio">
      <FormularioNegocio />
    </MarcoAlta>
  );
}
