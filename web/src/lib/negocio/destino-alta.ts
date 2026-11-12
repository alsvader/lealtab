export async function destinoTrasEntrada(): Promise<"/panel/negocio" | "/panel/tarjeta" | "/panel/cartel"> {
  const respuesta = await fetch("/panel/api/alta/paso");
  const cuerpo = (await respuesta.json().catch(() => null)) as { paso?: string } | null;
  if (cuerpo?.paso === "/panel/tarjeta" || cuerpo?.paso === "/panel/cartel") return cuerpo.paso;
  return "/panel/negocio";
}
