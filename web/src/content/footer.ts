import { LINKS } from "./landing";
import { NAV_LINKS } from "./nav";

/** Copy del Footer (copia exacta de la v1.7, líneas 2305-2348). */
export const FOOTER = {
  homeHref: "#hero",
  homeLabel: "LealTab, ir al inicio",
  logo: {
    src: "/brand/logo/lealtab-horizontal-lino.svg",
    alt: "LealTab",
    width: 180,
    height: 36,
  },
  tagline: "Haz que tus clientes siempre regresen.",
  columns: [
    {
      title: "Producto",
      links: NAV_LINKS.map(({ href, label }) => ({ href, label, external: false })),
    },
    {
      title: "Contacto",
      links: [
        { href: LINKS.whatsapp, label: "WhatsApp", external: true },
        { href: LINKS.instagram, label: "Instagram @getlealtab", external: true },
      ],
    },
    {
      title: "Cuenta",
      links: [
        { href: LINKS.createCard, label: "Crea tu tarjeta gratis", external: true },
      ],
    },
  ],
  copyright: "© 2026 LealTab",
  legalLabel: "Legal",
  legal: [
    { href: LINKS.privacy, label: "Aviso de privacidad" },
    { href: LINKS.terms, label: "Términos y condiciones" },
  ],
} as const;
