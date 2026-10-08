import { CLOSING, FAQ } from "@/content/closing";
import { LINKS } from "@/content/landing";
import { BtnCta } from "@/components/ui/BtnCta";
import { CloseVisual } from "./CloseVisual";
import styles from "./ClosingCta.module.css";

/** 8. Cierre + FAQ (v1.7 2251-2301): el aro se completa en durazno; la FAQ lleva id="faq". */
export function ClosingCta() {
  return (
    <section className={styles["cta-final"]} id="cta-final">
      <div className="wrap">
        <div className={styles["close-grid"]}>
          <div>
            <h2 className="reveal">{CLOSING.heading}</h2>
            <p className="lead">{CLOSING.lead}</p>
            <BtnCta href={LINKS.createCard} target="_blank" rel="noopener">{CLOSING.cta}</BtnCta>
            <p className={styles["wa-hint"]}>
              {CLOSING.waHint.before}
              <a href={LINKS.whatsapp} target="_blank" rel="noopener">
                {CLOSING.waHint.link}
              </a>
              {CLOSING.waHint.after}
            </p>
          </div>
          <CloseVisual />
        </div>

        <div className={styles.faq} id="faq">
          <h2>{FAQ.heading}</h2>
          <dl className={styles["faq-list"]}>
            {FAQ.items.map((item) => (
              <div key={item.q} className={styles["faq-item"]}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
