import { LINKS } from "./landing";

/** Copy del Hero (copia exacta de la v1.7, líneas 1816-1885). */
export const HERO = {
  title: "Haz que tus clientes siempre regresen.",
  lead: "Tu tarjeta de lealtad, ahora en el celular de tus clientes. La instalan con un toque, sin descargar nada.",
  cta: { href: LINKS.app, label: "Crea tu tarjeta gratis" },
  secondary: { href: "#como-funciona", label: "Ver cómo funciona ↓" },
  note: "Prueba gratis 30 días. Sin tarjeta de crédito.",
  phone: {
    ariaLabel: "Tarjeta digital de Barbería Norte en el celular: 4 de 5 visitas",
    initials: "BN",
    biz: "Barbería Norte",
    hello: "Hola, Andrés",
    sticker: "Casi premio",
    count: "4/5",
    rewardLine: "Llevas 4 de 5. El siguiente corte va por nuestra cuenta.",
    visitsLabel: "Tus visitas",
    visits: [
      { what: "Corte + barba", date: "2 oct" },
      { what: "Corte", date: "12 sep" },
      { what: "Corte", date: "22 ago" },
    ],
    code: "Mostrar mi código",
    sign: "Hecho con LealTab",
  },
} as const;
