"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { CLOSING } from "@/content/closing";
import styles from "./ClosingCta.module.css";

/**
 * Aro del cierre (v1.7 2535-2548): se completa y cambia a durazno al entrar en pantalla
 * (threshold 0.5, una sola vez; con reduced-motion o sin IntersectionObserver queda completo
 * de inmediato). Agrega `is-done` al contenedor y al aro, como la v1.7; ambos tienen
 * className estático.
 */
export function CloseVisual() {
  const visualRef = useRef<HTMLDivElement>(null);
  const aroRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;
    const finish = () => {
      visual.classList.add("is-done");
      aroRef.current?.classList.add("is-done");
    };
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      finish();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          finish();
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(visual);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={visualRef} className={styles["close-visual"]} id="closeVisual" aria-hidden="true">
      <svg ref={aroRef} className={styles["close-aro"]} viewBox="0 0 420 420">
        <g fill="none">
          <circle cx="207" cy="207" r="160" stroke="#0F2A22" strokeWidth="49" transform="translate(5 5)" />
          <circle cx="207" cy="207" r="160" stroke="#0F2A22" strokeWidth="49" />
          <circle cx="207" cy="207" r="160" stroke="#CFE3D6" strokeWidth="44" />
          <circle
            className={styles["fill-edge"]}
            cx="207"
            cy="207"
            r="160"
            pathLength="100"
            stroke="#0F2A22"
            strokeWidth="49"
            strokeLinecap="round"
            transform="rotate(-90 207 207)"
          />
          <circle
            className={styles.fill}
            cx="207"
            cy="207"
            r="160"
            pathLength="100"
            strokeWidth="44"
            strokeLinecap="round"
            transform="rotate(-90 207 207)"
          />
        </g>
      </svg>
      <div className={styles["close-count"]}>
        <span className={styles.num}>{CLOSING.visual.count}</span>
        <span className={styles.unit}>{CLOSING.visual.unit}</span>
      </div>
      <span className={styles["sticker-reward"]}>{CLOSING.visual.sticker}</span>
    </div>
  );
}
