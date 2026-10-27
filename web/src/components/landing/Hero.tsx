import { BtnCta } from "@/components/ui/BtnCta";
import { HERO } from "@/content/hero";
import { revealDelay } from "@/lib/reveal";
import styles from "./Hero.module.css";

/**
 * Hero (v1.7 líneas 1816-1885): lema + aro protagonista + celular con la tarjeta.
 * Server Component: toda la secuencia de entrada y los hovers son CSS.
 * Contrato: el CTA principal lleva `data-hero-cta` (el Nav lo observa).
 */
export function Hero() {
  const { phone } = HERO;
  return (
    <section className={styles.hero} id="hero">
      <div className={`wrap ${styles["hero-grid"]}`}>
        <div className={styles["hero-copy"]}>
          <h1 className={`${styles["hero-title"]} ${styles["hero-seq"]}`} style={revealDelay(0)}>
            {HERO.title}
          </h1>
          <p className={`lead ${styles["hero-seq"]}`} style={revealDelay(150)}>
            {HERO.lead}
          </p>
          <div className={`${styles["hero-ctas"]} ${styles["hero-seq"]}`} style={revealDelay(300)}>
            <BtnCta href={HERO.cta.href} data-hero-cta>
              {HERO.cta.label}
            </BtnCta>
            <a className="link-arrow" href={HERO.secondary.href}>
              {HERO.secondary.label}
            </a>
          </div>
          <p className={`${styles["hero-note"]} ${styles["hero-seq"]}`} style={revealDelay(450)}>
            {HERO.note}
          </p>
        </div>

        <div className={styles["hero-visual"]}>
          {/* Aro grande 4/5: la visita 5 por completarse en durazno (decisión de Aarón, 7 oct 2026) */}
          <svg className={styles["hero-aro"]} viewBox="0 0 420 420" aria-hidden="true">
            <g fill="none">
              <circle cx="207" cy="207" r="160" stroke="#0F2A22" strokeWidth="49" transform="translate(5 5)" />
              <circle cx="207" cy="207" r="160" stroke="#0F2A22" strokeWidth="49" />
              <circle cx="207" cy="207" r="160" stroke="#CFE3D6" strokeWidth="44" />
              <circle
                className={styles["aro-fill-edge"]}
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
                className={styles["aro-fill"]}
                cx="207"
                cy="207"
                r="160"
                pathLength="100"
                stroke="#0F4D3A"
                strokeWidth="44"
                strokeLinecap="round"
                transform="rotate(-90 207 207)"
              />
              <g transform="rotate(-90 207 207)">
                <circle
                  className={styles["aro-tip-edge"]}
                  cx="207"
                  cy="207"
                  r="160"
                  pathLength="100"
                  stroke="#0F2A22"
                  strokeWidth="49"
                  strokeLinecap="round"
                  strokeDasharray="3 97"
                  strokeDashoffset="-86"
                />
                <circle
                  className={styles["aro-tip"]}
                  cx="207"
                  cy="207"
                  r="160"
                  pathLength="100"
                  stroke="#FF9F6E"
                  strokeWidth="44"
                  strokeLinecap="round"
                  strokeDasharray="3 97"
                  strokeDashoffset="-86"
                />
              </g>
            </g>
          </svg>

          <div className={styles.phone} role="img" aria-label={phone.ariaLabel}>
            <div className={styles["phone-notch"]} aria-hidden="true"></div>
            <div className={styles["phone-screen"]} aria-hidden="true">
              <div className={styles["pwa-head"]}>
                <span className="pwa-badge">{phone.initials}</span>
                <div>
                  <div className={styles["pwa-biz"]}>{phone.biz}</div>
                  <div className={styles["pwa-hello"]}>{phone.hello}</div>
                </div>
              </div>
              <div className={styles["loyalty-card"]}>
                <span className={styles.sticker}>{phone.sticker}</span>
                <div className="aro-ui" aria-hidden="true">
                  <svg viewBox="0 0 100 100">
                    <g fill="none" strokeWidth="12">
                      <circle className="track" cx="50" cy="50" r="42" />
                      <circle
                        className="fill"
                        cx="50"
                        cy="50"
                        r="42"
                        pathLength="100"
                        strokeLinecap="round"
                        strokeDasharray="80 100"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        className="tip"
                        cx="50"
                        cy="50"
                        r="42"
                        pathLength="100"
                        strokeLinecap="round"
                        strokeDasharray="3 97"
                        strokeDashoffset="-86"
                        transform="rotate(-90 50 50)"
                      />
                    </g>
                  </svg>
                  <span className="aro-ui-num">{phone.count}</span>
                </div>
                <p className={styles["reward-line"]}>{phone.rewardLine}</p>
              </div>
              <div className={styles.visits}>
                <span className="label">{phone.visitsLabel}</span>
                <ul>
                  {phone.visits.map((v, i) => (
                    <li key={i}>
                      <span>{v.what}</span>
                      <span>{v.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <span className={styles["pwa-code"]}>{phone.code}</span>
              <p className={styles["pwa-sign"]}>{phone.sign}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
