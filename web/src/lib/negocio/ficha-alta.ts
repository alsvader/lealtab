export type FichaAlta = {
  nombre: string;
  giro: string;
  ciudad: string;
  whatsapp: string;
  slug: string;
  logo: boolean;
  puedeEliminar: boolean;
  siguiente: "/panel/tarjeta" | "/panel/cartel";
};
