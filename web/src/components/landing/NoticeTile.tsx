"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { ROADMAP } from "@/content/roadmap";
import { revealDelay } from "@/lib/reveal";
import styles from "./Roadmap.module.css";

/**
 * Mosaico de Avisos que voltea (v1.7 2581-2595). Al voltear se invierten `inert` y `aria-hidden`
 * de las dos caras y el foco pasa al botón de la cara visible (tras 200 ms, o 0 con reduced-motion).
 *
 * El <li> lleva `data-reveal` (el RevealObserver le agrega `is-in`), así que su className es
 * estático; el estado volteado viaja en `data-flipped`, que el CSS del módulo lee.
 */
export function NoticeTile() {
  const n = ROADMAP.notice;
  const [flipped, setFlipped] = useState(false);
  // Como en la v1.7, la cara frontal no lleva aria-hidden hasta la primera vez que se voltea
  const [touched, setTouched] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const focusTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(focusTimer.current), []);

  function flip(open: boolean) {
    setFlipped(open);
    setTouched(true);
    const target = open ? closeRef.current : openRef.current;
    window.clearTimeout(focusTimer.current);
    focusTimer.current = window.setTimeout(
      () => target?.focus({ preventScroll: true }),
      prefersReducedMotion() ? 0 : 200,
    );
  }

  return (
    <li
      className={`${styles["roadmap-item"]} ${styles["flip-tile"]}`}
      data-reveal=""
      data-flipped={flipped}
      style={revealDelay(n.delay)}
    >
      <div className="flip-inner">
        <div
          className="face face-front"
          id="avisoFront"
          inert={flipped}
          aria-hidden={flipped ? "true" : touched ? "false" : undefined}
        >
          <div className={styles["roadmap-top"]}>
            <span className={styles["roadmap-ico"]}>
              <img src={n.icon} alt="" width={28} height={28} />
            </span>
            <span className={styles.tag}>{ROADMAP.tag}</span>
          </div>
          <strong>{n.title}</strong>
          <p>{n.text}</p>
          <button
            ref={openRef}
            type="button"
            className={styles["tile-btn"]}
            data-flip="open"
            aria-controls="avisoBack"
            aria-expanded={flipped}
            onClick={() => flip(true)}
          >
            {n.open} <span aria-hidden="true">→</span>
          </button>
        </div>
        <div
          className="face face-back"
          id="avisoBack"
          inert={!flipped}
          aria-hidden={flipped ? "false" : "true"}
        >
          <span className={styles.tag}>{n.exampleTag}</span>
          <div className={styles.notif}>
            <span className="pwa-badge">{n.sample.badge}</span>
            <div>
              <b>{n.sample.business}</b>
              <span>{n.sample.message}</span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={styles["tile-btn"]}
            data-flip="close"
            onClick={() => flip(false)}
          >
            <span aria-hidden="true">←</span> {n.close}
          </button>
        </div>
      </div>
    </li>
  );
}
