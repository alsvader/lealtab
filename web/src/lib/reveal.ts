import type { CSSProperties } from "react";

/**
 * Retraso del escalonado para elementos con `data-reveal` (equivale a `style="--d: 90ms"`).
 * Uso: <div data-reveal style={revealDelay(90)}>
 */
export function revealDelay(ms: number): CSSProperties {
  return { "--d": `${ms}ms` } as CSSProperties;
}
