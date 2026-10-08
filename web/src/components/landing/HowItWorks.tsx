"use client";

import { useEffect, useRef, useState } from "react";
import { BtnCta } from "@/components/ui/BtnCta";
import { LINKS } from "@/content/landing";
import { CLIENT_ROWS, HOW_STEP_COUNT } from "@/content/how-it-works";
import { QR_PATH, QR_VIEWBOX } from "@/content/qr-demo";
import { revealDelay } from "@/lib/reveal";
import { restartAnimation } from "@/lib/restart-animation";
import { LiveEditor } from "./LiveEditor";
import s from "./HowItWorks.module.css";

/**
 * Cómo funciona (v1.7 líneas 1888-1991 y JS 2392-2415).
 * El paso que cruza el centro de la pantalla se marca y el aro avanza.
 * "Visto" (la interfaz del paso se activa) es el atributo `data-seen`: lo pone el RevealObserver
 * al aparecer cada bloque `[data-reveal]` y este componente al activarse el paso (nunca por className).
 */
export function HowItWorks() {
  const [step, setStep] = useState(1);
  // Filas de clientes: tocar una muestra el motivo de su estado; tocarla otra vez la cierra (v1.7 2596-2603)
  const [openRow, setOpenRow] = useState<string | null>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const statRef = useRef<HTMLDivElement>(null);
  const shownStep = useRef(step);

  // El paso a la vista se marca: IntersectionObserver con la banda central de la pantalla
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = stepRefs.current.filter((el): el is HTMLLIElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // La interfaz del paso activo se queda "activada"; al cambiar de paso la cifra rebota
  useEffect(() => {
    stepRefs.current[step - 1]?.setAttribute("data-seen", "");
    if (shownStep.current !== step) {
      shownStep.current = step;
      restartAnimation(statRef.current, s.bump);
    }
  }, [step]);

  const dash = `${((step / HOW_STEP_COUNT) * 100).toFixed(1)} 100`;

  return (
    <section className={s.how} id="como-funciona">
      <div className="wrap">
        <div className={s["how-grid"]}>
          <div className={s["how-aside"]}>
            <span className="label">Cómo funciona</span>
            <h2>Tres pasos y tu tarjeta de cartón se queda en el cajón.</h2>
            <div className={s["how-meter"]} aria-hidden="true">
              <svg width="116" height="116" viewBox="0 0 124 124">
                <g fill="none">
                  <circle cx="58" cy="58" r="44" stroke="#0F2A22" strokeWidth="22" transform="translate(6.5 6.5)" />
                  <circle cx="58" cy="58" r="44" stroke="#0F2A22" strokeWidth="22" />
                  <circle cx="58" cy="58" r="44" stroke="#CFE3D6" strokeWidth="16" />
                  <circle className={`${s["aro-step"]} aro-step-edge`} cx="58" cy="58" r="44" pathLength={100} stroke="#0F2A22" strokeWidth="22" strokeLinecap="round" strokeDasharray={dash} transform="rotate(-90 58 58)" />
                  <circle className={s["aro-step"]} cx="58" cy="58" r="44" pathLength={100} stroke="#0F4D3A" strokeWidth="16" strokeLinecap="round" strokeDasharray={dash} transform="rotate(-90 58 58)" />
                </g>
              </svg>
              <div>
                <div className={s.stat} ref={statRef}><span id="howStep">{step}</span> de 3</div>
                <span className="caption">pasos</span>
              </div>
            </div>
            <BtnCta className={s["how-cta-desktop"]} href={LINKS.createCard} target="_blank" rel="noopener">Crea tu tarjeta gratis</BtnCta>
          </div>

          <ol className={s["how-steps"]} role="list">
            <li
              ref={(el) => {
                stepRefs.current[0] = el;
              }}
              className={`${s["how-step"]}${step === 1 ? " is-active" : ""}`}
              data-step="1"
              data-seen=""
              data-seen-group=""
            >
              <h3>Crea tu tarjeta.</h3>
              <p>Sube tu logo, elige tus colores y define tu recompensa. Lista en minutos.</p>
              <p className={s["ui-hint"]}>Pruébalo: cambia el nombre, el color, las visitas o la recompensa.</p>
              <LiveEditor />
            </li>

            <li
              ref={(el) => {
                stepRefs.current[1] = el;
              }}
              className={`${s["how-step"]}${step === 2 ? " is-active" : ""}`}
              data-step="2"
              data-seen-group=""
            >
              <h3>Tu cliente escanea el QR.</h3>
              <p>Toca &quot;Agregar a inicio&quot; y su tarjeta queda en su pantalla, como una app. Sin tienda de apps.</p>
              <div className={`${s.ui} ${s["ui-split"]}`} aria-hidden="true" data-reveal style={revealDelay(0)}>
                <div className={s["ui-qr"]}>
                  <span className={s.biz}>Barbería Norte</span>
                  <svg viewBox={QR_VIEWBOX} aria-hidden="true">
                    <rect x="-1" y="-1" width="23" height="23" fill="#FFFDF8" />
                    <path d={QR_PATH} fill="#0F2A22" />
                  </svg>
                  <span className={s["ui-k"]}>Escanea y guarda tu tarjeta</span>
                </div>
                <div className={s["ui-sheet"]}>
                  <div className={s.row}><span>Compartir</span><img src="/brand/icons/lt-icono-compartir.svg" alt="" /></div>
                  <div className={`${s.row} ${s["is-on"]}`}><span>Agregar a inicio</span><img src="/brand/icons/lt-icono-agregar.svg" alt="" /></div>
                  <div className={s.app}><span className="pwa-badge">BN</span><span className={s["ui-k"]}>Barbería Norte, ya en su pantalla de inicio</span></div>
                </div>
              </div>
            </li>

            <li
              ref={(el) => {
                stepRefs.current[2] = el;
              }}
              className={`${s["how-step"]}${step === 3 ? " is-active" : ""}`}
              data-step="3"
              data-seen-group=""
            >
              <h3>Suma visitas y ve quién regresa.</h3>
              <p>Cada visita completa el aro. Tú ves quién vuelve y quién no.</p>
              <div className={s.ui} aria-hidden="true" data-reveal style={revealDelay(0)}>
                <table className={s["ui-table"]}>
                  <caption>Clientes · últimos 30 días</caption>
                  <thead>
                    <tr><th>Cliente</th><th className={s["hide-sm"]}>Visitas</th><th>Última</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                    {CLIENT_ROWS.map((r) => (
                      <tr
                        key={r.name}
                        className={openRow === r.name ? s["is-open"] : undefined}
                        onClick={() => setOpenRow((cur) => (cur === r.name ? null : r.name))}
                      >
                        <td>{r.name}</td>
                        <td className={s["hide-sm"]}>{r.visits}</td>
                        <td>{r.last}</td>
                        <td><span className={`${s.chip} ${s[`chip-${r.chip}`]}`}>{r.chipLabel}</span><span className={s.why}>{r.why}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </li>
          </ol>
        </div>
        <div className={s["how-cta-mobile"]}>
          <BtnCta className={s["how-cta-mobile-btn"]} href={LINKS.createCard} target="_blank" rel="noopener">Crea tu tarjeta gratis</BtnCta>
        </div>
      </div>
    </section>
  );
}
