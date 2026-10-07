import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

export interface UseRevealOptions {
  /** Selector CSS de los elementos a observar (se busca dentro de `root`). */
  selector: string;
  /** Clase global que se agrega al entrar en pantalla, una sola vez. */
  visibleClass: string;
  /** IntersectionObserver `threshold`. */
  threshold: number;
  /** IntersectionObserver `rootMargin`. */
  rootMargin: string;
  /** Contenedor donde buscar `selector`; por defecto, todo el documento. */
  root?: RefObject<HTMLElement | null>;
  /**
   * Se llama una vez por elemento, justo después de agregar `visibleClass`
   * (también en el modo sin animación). Debe ser una función estable (módulo).
   */
  onReveal?: (el: HTMLElement, reduced: boolean) => void;
}

/**
 * Aparición una sola vez con IntersectionObserver. Es el equivalente en React de los
 * bloques "Scroll reveal for section titles" y "Aparición escalonada de bloques" de la v1.7:
 * - con `prefers-reduced-motion: reduce` (o sin IntersectionObserver) agrega la clase a
 *   todos los elementos de inmediato;
 * - si no, observa cada elemento y, al cruzar el umbral, agrega la clase y deja de observarlo.
 *
 * Solo toca `classList` del DOM: el elemento debe tener un `className` ESTÁTICO en React
 * (si el className cambia entre renders, React reescribe el atributo y borra la clase).
 */
export function useReveal({
  selector,
  visibleClass,
  threshold,
  rootMargin,
  root,
  onReveal,
}: UseRevealOptions): void {
  useEffect(() => {
    const scope: ParentNode = root?.current ?? document;
    const els = Array.from(scope.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => !el.classList.contains(visibleClass),
    );
    const reduced = prefersReducedMotion();
    const reveal = (el: HTMLElement) => {
      el.classList.add(visibleClass);
      onReveal?.(el, reduced);
    };

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          io.unobserve(entry.target);
        });
      },
      { threshold, rootMargin },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, visibleClass, threshold, rootMargin, root, onReveal]);
}
