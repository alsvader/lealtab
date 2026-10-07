"use client";

import { useLayoutEffect } from "react";
import { useReveal } from "@/hooks/useReveal";

/**
 * Portado de la v1.7 (líneas 2618-2660). Se monta UNA vez en la página y revela, sobre los
 * selectores globales, lo que las secciones marcan en su HTML (sin que ellas usen el hook):
 *
 *  1. `.reveal`        -> agrega `is-visible`   (threshold 0.2, rootMargin "0px 0px -40px 0px")
 *  2. `[data-reveal]`  -> agrega `is-in`        (threshold 0.15, rootMargin "0px 0px -8% 0px")
 *       + `[data-seen-group]` más cercano (paso de Cómo funciona) -> atributo `data-seen`
 *       + `[data-settle]` (plan Negocio) -> clase `risen` a los 760 ms, al terminar su animación
 *         (`animationend` propio) o de inmediato con reduced-motion.
 *
 * Con `prefers-reduced-motion: reduce` o sin IntersectionObserver todo se revela de inmediato.
 * Los selectores son de atributos/clases GLOBALES: no dependen de los nombres de CSS Modules.
 */

function settle(el: HTMLElement) {
  el.classList.add("risen");
}

function onStaggerReveal(el: HTMLElement, reduced: boolean) {
  // La interfaz del paso se activa al aparecer (v1.7: `.how-step.seen`)
  el.closest("[data-seen-group]")?.setAttribute("data-seen", "");

  // Negocio: al terminar de levantarse queda en estado fijo (así funciona su hover)
  if (el.hasAttribute("data-settle")) {
    if (reduced) {
      settle(el);
    } else {
      window.setTimeout(() => settle(el), 760); // respaldo de animationend
      el.addEventListener(
        "animationend",
        (e) => {
          if (e.target === el) settle(el); // solo la animación del propio elemento, no la de sus hijos
        },
        { once: true },
      );
    }
  }
}

export function RevealObserver() {
  // La clase `js` la pone el script inline de layout.tsx antes de pintar. En desarrollo
  // React Strict Mode vuelve a montar <html> y la borra; esto la restituye (en producción no hace nada).
  useLayoutEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  useReveal({
    selector: ".reveal",
    visibleClass: "is-visible",
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px",
  });

  useReveal({
    selector: "[data-reveal]",
    visibleClass: "is-in",
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px",
    onReveal: onStaggerReveal,
  });

  return null;
}
