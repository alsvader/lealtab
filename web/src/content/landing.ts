/**
 * Copy y datos de la landing (copia exacta de la v1.7).
 * Cada tarea agrega SOLO su bloque dentro de los marcadores de abajo.
 */

/** Enlaces del sitio, centralizados. */
export const LINKS = {
  /** PWA de LealTab (alta de negocio y acceso). */
  app: "https://app.lealtab.com",
  /**
   * WhatsApp con el mensaje precargado. Es el enlace tal cual está en la v1.7.
   * Número confirmado por el fundador (7 oct 2026).
   */
  whatsapp:
    "https://wa.me/525588063606?text=Hola%2C%20vi%20la%20p%C3%A1gina%20de%20LealTab%20y%20quiero%20saber%20m%C3%A1s%20sobre%20la%20tarjeta%20digital%20para%20mi%20negocio.",
  /** CTA "Crea tu tarjeta gratis": por ahora abre WhatsApp con el mensaje de alta precargado. */
  createCard:
    "https://wa.me/525588063606?text=" +
    encodeURIComponent("Hola, quiero crear mi tarjeta de lealtad digital con LealTab."),
  instagram: "https://www.instagram.com/getlealtab",
  /** Aviso de privacidad (página propia: src/app/aviso-de-privacidad). */
  privacy: "/aviso-de-privacidad",
  /** Términos y condiciones (página propia: src/app/terminos-y-condiciones). */
  terms: "/terminos-y-condiciones",
} as const;

// ───────────────────────── T2: Nav, Hero, Footer ─────────────────────────
// (vacío: lo agrega la tarea T2)

// ───────────────────────── T3: Cómo funciona, La tarjeta ─────────────────────────
// (vacío: lo agrega la tarea T3)

// ───────────────────────── T4: Para quién, Precios, Confianza, Lo que viene, Cierre + FAQ ─────────────────────────
// (vacío: lo agrega la tarea T4)
