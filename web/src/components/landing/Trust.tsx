import { LINKS } from "@/content/landing";
import { TRUST } from "@/content/trust";
import { revealDelay } from "@/lib/reveal";
import styles from "./Trust.module.css";

/** 6. Confianza (v1.7 2154-2191): compromisos en cuadrícula, sin cajas. */
export function Trust() {
  return (
    <section className={styles["trust-sec"]} id="confianza">
      <div className="wrap">
        <h2 className="reveal">{TRUST.heading}</h2>
        <ul className={styles.trust} role="list">
          {TRUST.items.map((item) => (
            <li
              key={item.title}
              className={styles["trust-item"]}
              data-reveal=""
              style={revealDelay(item.delay)}
            >
              <svg className={styles.draw} viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <g
                  fill="none"
                  stroke="#0F2A22"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.paths.map((d) => (
                    <path key={d} pathLength="1" d={d} />
                  ))}
                </g>
              </svg>
              <div>
                <h3>{item.title}</h3>
                <p>
                  {item.text}
                  {"link" in item && item.link ? (
                    <>
                      {" "}
                      <a href={LINKS.privacy}>{item.link}</a>
                    </>
                  ) : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles["trust-cta"]}>
          <a
            className="btn btn-secondary btn-lg"
            href={LINKS.whatsapp}
            target="_blank"
            rel="noopener"
          >
            {TRUST.whatsappCta}
          </a>
        </div>
      </div>
    </section>
  );
}
