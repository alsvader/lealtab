"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { EDITOR_DEFAULTS, EDITOR_VISITS, SWATCHES, rewardText, type SwatchKey } from "@/content/how-it-works";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { revealDelay } from "@/lib/reveal";
import { restartAnimation } from "@/lib/restart-animation";
import s from "./HowItWorks.module.css";

/**
 * Editor vivo del paso 1 de Cómo funciona (v1.7 líneas 2480-2548 y 1913-1943).
 * Nombre, color, visitas y recompensa alimentan la vista previa.
 * `pop` y `bump` se reinician con restartAnimation (los elementos tienen className estático).
 */
export function LiveEditor() {
  const [name, setName] = useState<string>(EDITOR_DEFAULTS.name);
  const [reward, setReward] = useState<string>(EDITOR_DEFAULTS.reward);
  const [visits, setVisits] = useState<number>(EDITOR_VISITS.initial);
  const [color, setColor] = useState<SwatchKey>("bosque");

  const previewRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function changeVisits(next: number) {
    if (next < EDITOR_VISITS.min || next > EDITOR_VISITS.max) return;
    setVisits(next);
    if (!prefersReducedMotion()) restartAnimation(countRef.current, s.bump);
  }

  function pickColor(key: SwatchKey, focus?: boolean) {
    setColor(key);
    if (!prefersReducedMotion()) restartAnimation(previewRef.current, s.pop);
    if (focus) swatchRefs.current[SWATCHES.findIndex((o) => o.key === key)]?.focus();
  }

  function onSwatchKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    pickColor(SWATCHES[(i + d + SWATCHES.length) % SWATCHES.length].key, true);
  }

  return (
    <div className={`${s.ui} ${s["ui-split"]} ${s["ui-live"]}`} data-reveal style={revealDelay(0)}>
      <div>
        <div className={s["ui-field"]}>
          <label htmlFor="edName">Nombre del negocio</label>
          <input
            id="edName"
            className={s["ui-input"]}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className={s["ui-field"]}>
          <span className={s.lbl} id="edColorLbl">Color</span>
          <div className={s["ui-swatches"]} role="radiogroup" aria-labelledby="edColorLbl">
            {SWATCHES.map((o, i) => (
              <button
                key={o.key}
                ref={(el) => {
                  swatchRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={color === o.key}
                aria-label={o.label}
                data-c={o.key}
                tabIndex={color === o.key ? 0 : -1}
                onClick={() => pickColor(o.key)}
                onKeyDown={(e) => onSwatchKeyDown(e, i)}
              />
            ))}
          </div>
        </div>
        <div className={s["ui-field"]}>
          <span className={s.lbl} id="edVisitsLbl">Visitas para tu recompensa</span>
          <div className={s["ui-stepper"]} role="group" aria-labelledby="edVisitsLbl">
            <button type="button" id="edMinus" aria-label="Menos visitas" disabled={visits <= EDITOR_VISITS.min} onClick={() => changeVisits(visits - 1)}>−</button>
            <output id="edVisits" aria-live="polite">{visits}</output>
            <button type="button" id="edPlus" aria-label="Más visitas" disabled={visits >= EDITOR_VISITS.max} onClick={() => changeVisits(visits + 1)}>+</button>
          </div>
        </div>
        <div className={s["ui-field"]}>
          <label htmlFor="edReward">Recompensa</label>
          <input
            id="edReward"
            className={s["ui-input"]}
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            maxLength={32}
            autoComplete="off"
          />
        </div>
      </div>
      <div className={s["ui-preview"]} id="edPreview" data-c={color} ref={previewRef}>
        <span className={s.k}>Vista previa</span>
        <span className={s.biz} id="pvName">{name.trim() || "Tu negocio"}</span>
        <span className={s.stat} id="pvCount" ref={countRef}>{`0/${visits}`}</span>
        <span className={s.k}>visitas</span>
        <span className={s["pv-reward"]} id="pvReward">{rewardText(visits, reward)}</span>
      </div>
    </div>
  );
}
