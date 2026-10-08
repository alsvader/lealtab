import { WHO_FOR } from "@/content/who-for";
import { revealDelay } from "@/lib/reveal";
import { WhoLink } from "./WhoLink";
import styles from "./WhoFor.module.css";

/** 4. Para quién (v1.7 2071-2102): filas alternadas, ilustraciones como objetos. */
export function WhoFor() {
  return (
    <section className={styles.who} id="para-quien">
      <div className="wrap">
        <h2 className="reveal">{WHO_FOR.heading}</h2>
        <ul className={styles["who-list"]} role="list">
          {WHO_FOR.rows.map((row) => (
            <li key={row.key} className={styles["who-row"]} data-reveal="" style={revealDelay(0)}>
              <div className={styles["who-art"]}>
                <img src={row.art.src} alt={row.art.alt} width={400} height={320} />
              </div>
              <div>
                <h3>{row.title}</h3>
                <p>{row.text}</p>
                <WhoLink bizKey={row.key} className={styles["who-link"]}>
                  {WHO_FOR.linkLabel} <span aria-hidden="true">→</span>
                </WhoLink>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles["who-more"]} data-reveal="" style={revealDelay(0)}>
          {WHO_FOR.more.question} <strong>{WHO_FOR.more.emphasis}</strong>
        </p>
      </div>
    </section>
  );
}
