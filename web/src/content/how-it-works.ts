/** Copy y datos de Cómo funciona (v1.7 líneas 1888-1991). */

export const HOW_STEP_COUNT = 3;

/** Límites del selector de visitas del editor (v1.7: VMIN/VMAX). */
export const EDITOR_VISITS = { initial: 5, min: 3, max: 12 } as const;

export const EDITOR_DEFAULTS = { name: "Barbería Norte", reward: "Corte gratis" } as const;

export type SwatchKey = "bosque" | "noche" | "menta" | "gris";

export const SWATCHES: { key: SwatchKey; label: string }[] = [
  { key: "bosque", label: "Bosque" },
  { key: "noche", label: "Noche" },
  { key: "menta", label: "Menta" },
  { key: "gris", label: "Gris noche" },
];

/** Texto de la recompensa en la vista previa (v1.7 `rewardText`). */
export function rewardText(visits: number, reward: string): string {
  const r = reward.trim() || "tu recompensa";
  return `Al completar ${visits}: ${r.charAt(0).toLocaleLowerCase("es-MX")}${r.slice(1)}`;
}

export const CLIENT_ROWS = [
  { name: "Andrés S.", visits: "4", last: "hace 5 d", chip: "casi", chipLabel: "Casi premio", why: "Le falta 1 corte" },
  { name: "Luis H.", visits: "14", last: "hace 6 d", chip: "frecuente", chipLabel: "Frecuente", why: "Viene cada semana" },
  { name: "Carlos P.", visits: "6", last: "hace 41 d", chip: "riesgo", chipLabel: "Te extrañamos", why: "Hace 41 días que no viene" },
] as const;
