/**
 * Copy y datos de "Confianza" (v1.7, `#confianza`). Texto idéntico al de la landing aprobada.
 * Los íconos son trazos SVG inline (`pathLength="1"`) que se dibujan al aparecer; `d` es el
 * atributo de cada `<path>` tal cual está en la v1.7.
 */

export interface TrustItem {
  /** Retraso del escalonado (ms), equivale a `style="--d: Xms"`. */
  delay: number;
  paths: readonly string[];
  title: string;
  text: string;
  /** Si existe, el párrafo termina con este enlace (usa `LINKS.privacy`). */
  link?: string;
}

export const TRUST = {
  heading: "Detrás de LealTab hay personas.",
  items: [
    {
      delay: 0,
      paths: [
        "M4.25 4L19.75 4A1.25 1.25 0 0 1 21 5.25L21 15.75A1.25 1.25 0 0 1 19.75 17L10.975 17A1.25 1.25 0 0 0 10.145 17.316L7.495 19.671A0.898 0.898 0 0 1 6 19L6 18.25A1.25 1.25 0 0 0 4.75 17L4.25 17A1.25 1.25 0 0 1 3 15.75L3 5.25A1.25 1.25 0 0 1 4.25 4Z",
        "M7.5 9H16.5",
        "M7.5 12.5H13",
      ],
      title: "Te atiende una persona, por WhatsApp.",
      text: "Escríbenos y te responde una persona real. Sin bots ni tickets.",
    },
    {
      delay: 90,
      paths: ["M12 4A3.5 3.5 0 1 1 12 11A3.5 3.5 0 1 1 12 4", "M5 20.5A7 7 0 0 1 19 20.5"],
      title: "Tus datos son tuyos.",
      text: "Tus clientes y su historial te pertenecen. Descárgalos cuando quieras.",
    },
    {
      delay: 180,
      paths: [
        "M3.5 3.5L3.5 19.25A1.25 1.25 0 0 0 4.75 20.5L20.5 20.5",
        "M8.5 16V13",
        "M13 16V9",
        "M17.5 16V5.5",
      ],
      title: "Ves quién regresa.",
      text: "Un tablero sencillo con tus clientes frecuentes y los que no han vuelto.",
    },
    {
      delay: 270,
      paths: ["M5 12.5L10 17.5L19.5 6.5"],
      title: "Privacidad clara.",
      text: "Te explicamos qué datos guardamos y para qué.",
      link: "Lee el aviso de privacidad →",
    },
  ] satisfies TrustItem[],
  whatsappCta: "Escríbenos por WhatsApp",
} as const;
