import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Lectura puntual de `prefers-reduced-motion` (equivale a la variable `reduce`
 * que la v1.7 calculaba una vez al cargar). Úsala dentro de efectos y manejadores
 * de eventos; en el render usa `useReducedMotion()`. En el servidor siempre es false.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/** Valor reactivo de `prefers-reduced-motion: reduce` (false en el servidor y en la hidratación). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
