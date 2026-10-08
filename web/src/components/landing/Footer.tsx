import { FOOTER } from "@/content/footer";
import styles from "./Footer.module.css";

/**
 * Footer (v1.7 líneas 2305-2348): bosque, logo lino, enlaces por columnas. Server Component.
 * Fuera de la home (páginas legales) `basePath="/"` antepone la ruta de la home a los enlaces de
 * sección (`#precios` pasa a `/#precios`) y el logo lleva a `/`. La home no pasa la prop.
 */
export function Footer({ basePath }: { basePath?: string }) {
  /** Los enlaces `#sección` se resuelven contra la home; el resto queda igual. */
  const resolve = (href: string) => (basePath !== undefined && href.startsWith("#") ? `${basePath}${href}` : href);
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles["footer-grid"]}>
          <div>
            <a className={styles["footer-home"]} href={basePath ?? FOOTER.homeHref} aria-label={FOOTER.homeLabel}>
              <img
                className={styles["footer-logo"]}
                src={FOOTER.logo.src}
                alt={FOOTER.logo.alt}
                width={FOOTER.logo.width}
                height={FOOTER.logo.height}
              />
            </a>
            <p className={styles["footer-tagline"]}>{FOOTER.tagline}</p>
          </div>
          <div className={styles["footer-cols"]}>
            {FOOTER.columns.map((col) => (
              <nav key={col.title} className={styles["footer-col"]} aria-label={col.title}>
                <h3>{col.title}</h3>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener">
                          {link.label}
                        </a>
                      ) : (
                        <a href={resolve(link.href)}>{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className={styles["footer-legal"]}>
          <p>{FOOTER.copyright}</p>
          <nav className={styles["footer-legal-links"]} aria-label={FOOTER.legalLabel}>
            {FOOTER.legal.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
