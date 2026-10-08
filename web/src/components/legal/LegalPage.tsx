import { Fragment } from "react";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { SkipLink } from "@/components/landing/SkipLink";
import type { Inline, LegalBlock, LegalDocument } from "@/content/legal/types";
import styles from "./LegalPage.module.css";

/** Ruta de la home: los enlaces de sección del Nav y del Footer cuelgan de ella. */
const HOME = "/";

const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** Texto plano o enlace: http(s) abre en pestaña nueva; `mailto:`, `tel:`, anclas y rutas internas, no. */
function Inlines({ items }: { items: Inline[] }) {
  return items.map((item, i) => {
    if (typeof item === "string") return <Fragment key={i}>{item}</Fragment>;
    if (isExternal(item.href)) {
      return (
        <a key={i} href={item.href} target="_blank" rel="noopener noreferrer">
          {item.text}
          <span className={styles["sr-only"]}> (se abre en una pestaña nueva)</span>
        </a>
      );
    }
    return (
      <a key={i} href={item.href}>
        {item.text}
      </a>
    );
  });
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return blocks.map((block, i) =>
    block.type === "p" ? (
      <p key={i}>
        <Inlines items={block.content} />
      </p>
    ) : (
      <ul key={i}>
        {block.items.map((item, j) => (
          <li key={j}>
            <Inlines items={item} />
          </li>
        ))}
      </ul>
    ),
  );
}

/**
 * Página de lectura para un documento legal (aviso de privacidad, términos y condiciones).
 * Server Component. Reutiliza Nav y Footer de la landing con `basePath="/"` para que sus enlaces
 * de sección lleven a `/#…`. Sin animaciones de aparición. En escritorio el índice queda a la
 * izquierda y fijo; en móvil va entre la introducción y las secciones.
 */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <>
      <SkipLink />
      <Nav basePath={HOME} />
      <main id="contenido" tabIndex={-1}>
        <div className={`wrap ${styles.page}`}>
          <div className={styles.layout}>
            <header className={styles.head}>
              <a className={styles.back} href={HOME}>
                <span aria-hidden="true">←</span> <span className={styles["back-text"]}>Volver al inicio</span>
              </a>
              <h1>{doc.title}</h1>
              <p className={styles.updated}>
                Última actualización: <time dateTime={doc.updatedAtIso}>{doc.updatedAt}</time>
              </p>
              <div className={styles.intro}>
                <Blocks blocks={doc.intro} />
              </div>
            </header>

            <nav className={styles.toc} aria-labelledby="indice-titulo">
              <p className={styles["toc-title"]} id="indice-titulo">
                Contenido
              </p>
              <ol role="list">
                {doc.sections.map((section, i) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span className={styles["toc-num"]}>{i + 1}.</span>{" "}
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className={styles.body}>
              {doc.sections.map((section, i) => (
                <section key={section.id} className={styles.section} aria-labelledby={section.id}>
                  <h2 id={section.id}>
                    <span className={styles.num}>{i + 1}.</span> <span>{section.heading}</span>
                  </h2>
                  <div className={styles.prose}>
                    <Blocks blocks={section.blocks} />
                  </div>
                </section>
              ))}
              <p className={styles.end}>
                <a className={styles.back} href={HOME}>
                  <span aria-hidden="true">←</span> <span className={styles["back-text"]}>Volver al inicio</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer basePath={HOME} />
    </>
  );
}
