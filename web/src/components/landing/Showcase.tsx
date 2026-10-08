"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import {
  BIZ,
  BIZ_TABS,
  OS_STEPS,
  SELECT_BIZ_EVENT,
  bizMsg,
  type BizKey,
  type OsKey,
  type SelectBizDetail,
} from "@/content/showcase";
import { QR_PATH, QR_VIEWBOX } from "@/content/qr-demo";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { revealDelay } from "@/lib/reveal";
import { restartAnimation } from "@/lib/restart-animation";
import s from "./Showcase.module.css";

/**
 * Guía según el celular (v1.7 líneas 2550-2566). `?os=ios|android` fuerza el sistema.
 * useSyncExternalStore: en el servidor y en la hidratación es null (igual que el HTML de la v1.7
 * antes de correr su script); después de montar lee la URL y el userAgent.
 */
function detectOs(): OsKey | null {
  const forced = (window.location.search.match(/[?&]os=(ios|android)/) || [])[1] as OsKey | undefined;
  if (forced) return forced;
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  return /Android/i.test(ua) ? "android" : null;
}
const noopSubscribe = () => () => {};
const serverOs = (): OsKey | null => null;

export function Showcase() {
  // Estado de la demo (v1.7: `demo = { key, n }`, más el volteo del panel)
  const [key, setKey] = useState<BizKey>("barberia");
  const [n, setN] = useState<number>(BIZ.barberia.n);
  const [codeOpen, setCodeOpen] = useState(false);
  // El ícono de la pantalla de inicio solo lleva color propio después de elegir un negocio (como en la v1.7)
  const [picked, setPicked] = useState(false);
  const [swapTick, setSwapTick] = useState(0);
  const os = useSyncExternalStore(noopSubscribe, detectOs, serverOs);

  const cardRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<SVGCircleElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const b = BIZ[key];
  const done = n >= b.total;

  // Al cambiar de negocio vuelve a su estado inicial (v1.7 `setBiz`)
  const selectBiz = useCallback((next: BizKey) => {
    const nb = BIZ[next];
    if (!nb) return;
    if (!prefersReducedMotion()) setSwapTick((t) => t + 1);
    setKey(next);
    setN(nb.n);
    setCodeOpen(false);
    setPicked(true);
  }, []);

  // Fundido corto del panel y el encabezado (después del commit, para no perder la clase)
  useEffect(() => {
    if (swapTick === 0) return;
    restartAnimation(headRef.current, s.swap);
    restartAnimation(panelRef.current, s.swap);
  }, [swapTick]);

  // Contrato con "Para quién": `lt:select-biz` selecciona el negocio y resalta la tarjeta (v1.7 línea 2472)
  useEffect(() => {
    const timers = new Set<number>();
    const onSelect = (e: Event) => {
      const next = (e as CustomEvent<SelectBizDetail>).detail?.key;
      if (!next || !Object.hasOwn(BIZ, next)) return;
      selectBiz(next);
      if (!prefersReducedMotion()) {
        const id = window.setTimeout(() => {
          timers.delete(id);
          restartAnimation(cardRef.current, s.spotlight);
        }, 450);
        timers.add(id);
      }
    };
    window.addEventListener(SELECT_BIZ_EVENT, onSelect);
    return () => {
      window.removeEventListener(SELECT_BIZ_EVENT, onSelect);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [selectBiz]);

  // Suma una visita: el aro avanza; al completarse se vuelve durazno y aparece "¡Recompensa lista!"
  function addVisit() {
    if (done) {
      selectBiz(key);
      return;
    }
    setCodeOpen(false);
    const next = n + 1;
    setN(next);
    if (!prefersReducedMotion()) {
      restartAnimation(numRef.current, s.bump);
      if (next >= b.total) restartAnimation(fillRef.current, s.pulse);
    }
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const j = (i + d + BIZ_TABS.length) % BIZ_TABS.length;
    tabRefs.current[j]?.focus();
    selectBiz(BIZ_TABS[j].key);
  }

  return (
    <section className={s.showcase} id="la-tarjeta">
      <div className="wrap">
        <div className={s["showcase-grid"]}>
          <div>
            <h2 className="reveal">Tu tarjeta digital siempre a un toque.</h2>
            <p className="lead">Con tu logo, tus colores y tu recompensa. Se ve tan bien como tu negocio.</p>
            <div className={s["biz-switch"]} role="tablist" aria-label="Ejemplos de tarjeta">
              {BIZ_TABS.map((t, i) => (
                <button
                  key={t.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={key === t.key}
                  aria-controls="bizcard"
                  data-biz={t.key}
                  onClick={() => selectBiz(t.key)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className={s["showcase-note"]}>Elige un negocio para ver su tarjeta.</p>
          </div>

          <div className={s["bizcard-wrap"]} data-reveal style={revealDelay(100)}>
            <article
              ref={cardRef}
              className={`${s.bizcard}${done ? ` ${s["is-complete"]}` : ""}`}
              id="bizcard"
              role="tabpanel"
              data-theme={key}
              aria-live="polite"
            >
              <div className={s["bizcard-head"]} ref={headRef}>
                <span className={s["bizcard-badge"]} data-k="initials">{b.initials}</span>
                <span className={s["bizcard-name"]} data-k="name">{b.name}</span>
              </div>
              <div className={`${s["bizcard-panel"]}${codeOpen ? " is-flipped" : ""}`} ref={panelRef}>
                <div className="flip-inner">
                  <div className="face face-front">
                    <div className="aro-ui" aria-hidden="true">
                      <svg viewBox="0 0 100 100">
                        <g fill="none" strokeWidth="11">
                          <circle className="track" cx="50" cy="50" r="43" />
                          <circle
                            ref={fillRef}
                            className="fill aro-biz-fill"
                            cx="50"
                            cy="50"
                            r="43"
                            pathLength={100}
                            strokeLinecap="round"
                            strokeDasharray={`${((n / b.total) * 100).toFixed(1)} 100`}
                            transform="rotate(-90 50 50)"
                          />
                        </g>
                      </svg>
                      <span className="aro-ui-num" ref={numRef}>
                        <span data-k="count">{`${n}/${b.total}`}</span>
                        <small data-k="unit">{b.unit}</small>
                      </span>
                    </div>
                    <p className={s["bizcard-msg"]} data-k="msg">{bizMsg(b, n)}</p>
                  </div>
                  <div className="face face-back" id="codeFace" aria-hidden={!codeOpen}>
                    <svg className={s.qr} viewBox={QR_VIEWBOX} aria-hidden="true">
                      <rect x="-1" y="-1" width="23" height="23" fill="#FFFDF8" />
                      <path d={QR_PATH} fill="#0F2A22" />
                    </svg>
                    <p><strong data-k="name">{b.name}</strong><span>Muéstralo en caja.</span></p>
                  </div>
                </div>
                <span className={s["sticker-done"]} aria-hidden="true">¡Recompensa lista!</span>
              </div>
              <button
                type="button"
                className={s["bizcard-btn"]}
                id="codeBtn"
                aria-controls="codeFace"
                aria-expanded={codeOpen}
                onClick={() => setCodeOpen((open) => !open)}
              >
                {codeOpen ? "Ocultar mi código" : "Mostrar mi código"}
              </button>
              <p className={s["bizcard-sign"]}>Hecho con LealTab</p>
            </article>
            <div className={s["visit-demo"]}>
              <button type="button" className="btn btn-secondary btn-md" id="visitBtn" onClick={addVisit}>
                <span className={s.plus} aria-hidden="true" hidden={done}>+</span>{" "}
                <span id="visitLbl">{done ? "Empezar de nuevo" : "Suma una visita"}</span>
              </button>
              <p>Así suma tu cajero cada visita.</p>
            </div>
          </div>
        </div>

        <div className={s.install}>
          <div data-reveal style={revealDelay(0)}>
            <h3>En su pantalla de inicio.</h3>
            <p className={s["install-copy"]}>Tu negocio, con su propio ícono, junto a las apps de tu cliente. Nada que buscar entre pestañas.</p>
            <div className={s.homegrid} aria-hidden="true">
              <div className={s.tile}><span className={`${s.ico} ${s.ghost}`}></span></div>
              <div className={s.tile}>
                <span
                  className={`${s.ico} ${s["is-biz"]}`}
                  id="homeIcon"
                  style={picked ? { background: b.icoBg, color: b.icoFg } : undefined}
                >
                  {b.initials}
                </span>
                <span id="homeLabel">{b.label}</span>
              </div>
              {Array.from({ length: 6 }, (_, i) => (
                <div className={s.tile} key={i}><span className={`${s.ico} ${s.ghost}`}></span></div>
              ))}
            </div>
          </div>
          <div data-reveal style={revealDelay(120)}>
            <h3>Cómo se instala.</h3>
            <ol className={s["steps-os"]}>
              {OS_STEPS.map((step) => {
                const mine = os === step.os;
                return (
                  <li
                    key={step.os}
                    data-os={step.os}
                    className={os ? (mine ? s["is-mine"] : s["is-dim"]) : undefined}
                  >
                    <strong>
                      {step.name}
                      {mine ? <span className={s["mine-tag"]}>{step.tag}</span> : null}
                    </strong>
                    <p>{step.text}</p>
                  </li>
                );
              })}
            </ol>
            <p className={s["install-foot"]}>Funciona en cualquier celular. Sin tienda de apps, sin cuentas que crear.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
