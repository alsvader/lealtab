export type NegocioPublico = {
  slug: string;
  nombre: string;
  recompensa: string;
  sellosMeta: number;
  /** Si hay archivo en Storage. La ruta no sale al navegador. */
  tieneLogo: boolean;
};
