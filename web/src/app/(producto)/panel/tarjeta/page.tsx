import { FormularioTarjeta } from "@/components/panel/formulario-tarjeta";
import { MarcoAlta } from "@/components/panel/alta-marco";

export default function Page() {
  return (
    <MarcoAlta paso="tarjeta">
      <FormularioTarjeta />
    </MarcoAlta>
  );
}
