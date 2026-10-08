import { ROADMAP } from "@/content/roadmap";
import { revealDelay } from "@/lib/reveal";
import { NoticeTile } from "./NoticeTile";
import styles from "./Roadmap.module.css";

/** 7. Lo que viene (v1.7 2194-2248): capítulo en bosque, sin cajas ni stickers repetidos. */
export function Roadmap() {
  return (
    <section className={styles.roadmap} id="lo-que-viene">
      <div className={`wrap ${styles["roadmap-grid"]}`}>
        <div className="reveal">
          <h2>{ROADMAP.heading}</h2>
          <p className="lead">{ROADMAP.lead}</p>
        </div>
        <ul className={styles["roadmap-list"]} role="list">
          <NoticeTile />
          {ROADMAP.items.map((item) => (
            <li
              key={item.title}
              className={styles["roadmap-item"]}
              data-reveal=""
              style={revealDelay(item.delay)}
            >
              <div className={styles["roadmap-top"]}>
                <span className={styles["roadmap-ico"]}>
                  <img src={item.icon} alt="" width={28} height={28} />
                </span>
                <span className={styles.tag}>{ROADMAP.tag}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
