/** Copy de "Lo que viene" (v1.7, `#lo-que-viene`). Texto idéntico al de la landing aprobada. */

export interface RoadmapItem {
  /** Retraso del escalonado (ms), equivale a `style="--d: Xms"`. */
  delay: number;
  icon: string;
  title: string;
  text: string;
}

export const ROADMAP = {
  heading: "Lo que viene.",
  lead: "Lo construimos contigo. Si estás en el piloto, tu opinión decide qué sigue.",
  tag: "Próximamente",
  /** Mosaico que voltea (primer elemento de la lista). */
  notice: {
    delay: 0,
    icon: "/brand/icons/lt-icono-aviso.svg",
    title: "Avisos",
    text: "Para que tus clientes vuelvan en el momento justo.",
    open: "Ver un ejemplo",
    exampleTag: "Ejemplo de aviso",
    sample: {
      badge: "BN",
      business: "Barbería Norte",
      message: "Hace 3 semanas de tu último corte. ¿Te apartamos lugar?",
    },
    close: "Volver",
  },
  items: [
    {
      delay: 90,
      icon: "/brand/icons/lt-icono-calendario.svg",
      title: "Campañas",
      text: "Llena los días flojos con una promoción para tus clientes de siempre.",
    },
    {
      delay: 180,
      icon: "/brand/icons/lt-icono-negocio.svg",
      title: "Varias sucursales",
      text: "Todas tus sucursales en una sola cuenta.",
    },
    {
      delay: 270,
      icon: "/brand/icons/lt-icono-cartera.svg",
      title: "Apple y Google Wallet",
      text: "Tu tarjeta también en la cartera del celular.",
    },
  ] satisfies RoadmapItem[],
} as const;
