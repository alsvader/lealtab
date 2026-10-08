import { LINKS } from "./landing";

/** Copy del Nav y del menú móvil (copia exacta de la v1.7, líneas 1776-1811). */

/** Enlaces de sección. Se repiten en el menú de escritorio, el menú móvil y la columna "Producto" del footer. */
export const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#la-tarjeta", label: "La tarjeta" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "Preguntas" },
] as const;

export const NAV = {
  logo: {
    src: "/brand/logo/lealtab-horizontal-noche.svg",
    alt: "LealTab",
    width: 140,
    height: 28,
  },
  homeHref: "#hero",
  homeLabel: "LealTab, ir al inicio",
  linksLabel: "Principal",
  drawerLinksLabel: "Principal (móvil)",
  login: { href: LINKS.app, label: "Entrar" },
  ctaDesktop: { href: LINKS.createCard, label: "Crea tu tarjeta gratis" },
  ctaMobile: { href: LINKS.createCard, label: "Empieza gratis" },
  toggleLabelOpen: "Abrir menú",
  toggleLabelClose: "Cerrar menú",
  drawer: {
    cta: { href: LINKS.createCard, label: "Crea tu tarjeta gratis" },
    note: "Prueba gratis 30 días. Sin tarjeta de crédito.",
    login: { href: LINKS.app, label: "¿Ya tienes cuenta? Entrar" },
  },
} as const;
