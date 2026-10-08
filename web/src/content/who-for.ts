/** Copy de "Para quién" (v1.7, `#para-quien`). Texto idéntico al de la landing aprobada. */

import type { BizKey } from "@/content/showcase";

export interface WhoRow {
  /** Clave del negocio; viaja en el evento `lt:select-biz` hacia "La tarjeta". */
  key: BizKey;
  art: { src: string; alt: string };
  title: string;
  text: string;
}

export const WHO_FOR = {
  heading: "Hecha para negocios donde el cliente vuelve.",
  linkLabel: "Ver su tarjeta",
  rows: [
    {
      key: "barberia",
      art: {
        src: "/brand/illustrations/lt-ilustracion-barberia-sin-sombra.svg",
        alt: "Ilustración de barbería: máquina para cortar, tijeras y navaja",
      },
      title: "Barberías",
      text: "Al quinto corte, el sexto es gratis. Y la tarjeta ya no se pierde en la cartera.",
    },
    {
      key: "estetica",
      art: {
        src: "/brand/illustrations/lt-ilustracion-estetica-sin-sombra.svg",
        alt: "Ilustración de estética y salón de belleza: secadora, esmalte y cepillo",
      },
      title: "Estéticas y salones de belleza",
      text: "Tus clientas ven cuántas visitas les faltan. Tú ves quién dejó de venir.",
    },
    {
      key: "tapioca",
      art: {
        src: "/brand/illustrations/lt-ilustracion-tapioca-sin-sombra.svg",
        alt: "Ilustración de tapioca: vaso con popote ancho y perlas",
      },
      title: "Tapiocas",
      text: "Cada tapioca suma. Tus clientes ven cuántas les faltan.",
    },
  ] satisfies WhoRow[],
  more: {
    question: "¿Tienes una cafetería, un gimnasio u otro negocio al que tus clientes vuelven?",
    emphasis: "También es para ti.",
  },
} as const;
