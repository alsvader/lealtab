import { LINKS } from "@/content/landing";
import { PRICING } from "@/content/pricing";
import { BtnCta } from "@/components/ui/BtnCta";
import { revealDelay } from "@/lib/reveal";
import styles from "./Pricing.module.css";

/** Palomita de la lista de cada plan (v1.7: SVG inline decorativo). */
function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/** 5. Precios (v1.7 2105-2151): prueba arriba, Negocio destacado sin durazno. */
export function Pricing() {
  const { inicio, negocio, pro } = PRICING.plans;
  return (
    <section className={styles["pricing-sec"]} id="precios">
      <div className="wrap">
        <div className={styles["pricing-head"]}>
          <h2 className="reveal">{PRICING.heading}</h2>
          <div className={styles.trial}>
            <p>{PRICING.trial}</p>
            <BtnCta href={LINKS.app}>{PRICING.cta}</BtnCta>
          </div>
        </div>

        <div className={styles.pricing}>
          <article
            className={`${styles.plan} ${styles["order-inicio"]}`}
            data-reveal=""
            style={revealDelay(0)}
          >
            <div className={styles["plan-top"]}>
              <span className={styles["plan-name"]}>{inicio.name}</span>
            </div>
            <div className={styles["plan-price"]}>
              {inicio.price}
              <small>{inicio.unit}</small>
            </div>
            <ul>
              {inicio.features.map((f) => (
                <li key={f}>
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <a className="btn btn-secondary btn-lg" href={LINKS.app}>
              {PRICING.cta}
            </a>
          </article>

          {/* data-settle: el RevealObserver le agrega `risen` al terminar de levantarse (v1.7 2655) */}
          <article
            className={`${styles.plan} ${styles.featured} ${styles["order-negocio"]}`}
            data-reveal=""
            data-settle=""
            style={revealDelay(0)}
          >
            <div className={styles["plan-top"]}>
              <span className={styles["plan-name"]}>{negocio.name}</span>
              <span className={styles["plan-chip"]}>{negocio.chip}</span>
            </div>
            <div className={styles["plan-price"]}>
              {negocio.price}
              <small>{negocio.unit}</small>
            </div>
            <ul>
              {negocio.features.map((f) => (
                <li key={f}>
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <BtnCta href={LINKS.app}>{PRICING.cta}</BtnCta>
          </article>

          <article
            className={`${styles.plan} ${styles.muted} ${styles["order-pro"]}`}
            data-reveal=""
            style={revealDelay(240)}
          >
            <div className={styles["plan-top"]}>
              <span className={styles["plan-name"]}>{pro.name}</span>
            </div>
            <div className={styles["plan-price"]}>{pro.price}</div>
            <ul>
              {pro.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </article>
        </div>

        <p className={styles["pricing-note"]}>{PRICING.note}</p>
      </div>
    </section>
  );
}
