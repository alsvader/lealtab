/**
 * Contrato con "Para quién" (T4) y datos de La tarjeta (v1.7 líneas 2417-2423 y 1994-2068).
 */

/** Claves de los ejemplos de negocio. */
export type BizKey = "barberia" | "estetica" | "tapioca";

/**
 * Evento que dispara "Para quién" al hacer clic en un `.who-link`:
 *   window.dispatchEvent(new CustomEvent(SELECT_BIZ_EVENT, { detail: { key } satisfies SelectBizDetail }))
 * La tarjeta (Showcase) lo escucha y selecciona ese negocio.
 */
export const SELECT_BIZ_EVENT = "lt:select-biz";

export interface SelectBizDetail {
  key: BizKey;
}

export interface Biz {
  name: string;
  initials: string;
  label: string;
  /** Visitas del estado inicial. */
  n: number;
  total: number;
  unit: string;
  reward: string;
  /** Mensaje aprobado del estado inicial. */
  msg: string;
  /** Mensaje con la tarjeta completa. */
  done: string;
  icoBg: string;
  icoFg: string;
}

export const BIZ: Record<BizKey, Biz> = {
  barberia: { name: "Barbería Norte", initials: "BN", label: "Norte", n: 4, total: 5, unit: "cortes", reward: "corte gratis", msg: "Llevas 4 de 5. El siguiente corte va por nuestra cuenta.", done: "Tu siguiente corte va por nuestra cuenta.", icoBg: "#0F4D3A", icoFg: "#F3EFE6" },
  estetica: { name: "Estética Luna", initials: "EL", label: "Luna", n: 2, total: 6, unit: "visitas", reward: "tratamiento de regalo", msg: "2 de 6 visitas. Tu tratamiento de regalo te espera.", done: "Tu tratamiento de regalo te espera.", icoBg: "#F3EFE6", icoFg: "#0F2A22" },
  tapioca: { name: "Tapioca Sol", initials: "TS", label: "Sol", n: 7, total: 10, unit: "tapiocas", reward: "tapioca gratis", msg: "7 de 10. Te faltan 3 para tu tapioca gratis.", done: "Tu siguiente tapioca va por nuestra cuenta.", icoBg: "#0F2A22", icoFg: "#F3EFE6" },
};

/** Orden de las pestañas del selector. */
export const BIZ_TABS: { key: BizKey; label: string }[] = [
  { key: "barberia", label: "Barbería" },
  { key: "estetica", label: "Estética" },
  { key: "tapioca", label: "Tapioca" },
];

/** Mensaje de la tarjeta según las visitas (v1.7 `bizMsg`). */
export function bizMsg(b: Biz, n: number): string {
  if (n === b.n) return b.msg; // mensaje aprobado del estado inicial
  if (n >= b.total) return b.done;
  const k = b.total - n;
  return `${n} de ${b.total}. Te ${k === 1 ? "falta 1" : `faltan ${k}`} para tu ${b.reward}.`;
}

/** Guía de instalación según el celular. */
export type OsKey = "ios" | "android";

export const OS_STEPS: { os: OsKey; name: string; text: string; tag: string }[] = [
  { os: "ios", name: "iPhone", text: 'Abre el enlace, toca Compartir y luego "Agregar a inicio".', tag: "Estás en iPhone" },
  { os: "android", name: "Android", text: 'Abre el enlace, toca el menú ⋮ y luego "Instalar app" o "Agregar a la pantalla principal".', tag: "Estás en Android" },
];
