"use client";

import { useEffect, useRef, useState } from "react";
import { BtnCta } from "@/components/ui/BtnCta";
import { NAV, NAV_LINKS } from "@/content/nav";
import styles from "./Nav.module.css";

/** v1.7: matchMedia("(min-width: 1024px)") cierra el menú móvil al pasar a escritorio. */
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Nav + menú móvil a pantalla completa (v1.7 líneas 1776-1811 y JS 2354-2392, 2606-2616).
 *  - Menú: abrir/cerrar con el botón, Escape (devuelve el foco al botón), clic en un enlace y
 *    resize a >= 1024 px. Mientras está abierto `body` lleva la clase global `nav-open`.
 *  - Sección activa: observa los ids de NAV_LINKS (#como-funciona, #precios...) y marca
 *    aria-current="true" en el enlace de escritorio y en el del menú móvil.
 *  - CTA del menú: oculto mientras el CTA del hero (`[data-hero-cta]`) está a la vista.
 *    El HTML del servidor ya lleva `hero-cta-visible`; el CSS solo lo aplica bajo `.js`
 *    (clase puesta antes de pintar), así que sin JS el CTA se ve, igual que en la v1.7.
 *
 * Fuera de la home (páginas legales): `basePath="/"` antepone la ruta de la home a los enlaces de
 * sección (`#precios` pasa a `/#precios`) y el logo lleva a `/`. Ahí no hay secciones ni Hero, así que
 * no se observa nada: ningún enlace queda marcado y el CTA del menú se ve desde el HTML del servidor.
 * La home no pasa la prop y su HTML no cambia.
 */
export function Nav({ basePath }: { basePath?: string }) {
  const offHome = basePath !== undefined;
  const [open, setOpen] = useState(false);
  const [heroCtaVisible, setHeroCtaVisible] = useState(!offHome);
  const [activeIds, setActiveIds] = useState<ReadonlySet<string>>(() => new Set());
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Menú abierto: bloquea el scroll (clase global en <body>) y enfoca el panel
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    if (open) drawerRef.current?.focus();
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  // Escape cierra el menú y devuelve el foco al botón
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Al llegar a escritorio el menú móvil se cierra
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Sección activa (Cómo funciona o Precios...)
  useEffect(() => {
    if (offHome || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        setActiveIds((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.id);
            else next.delete(entry.target.id);
          });
          return next;
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [offHome]);

  // El CTA del menú entra cuando el del hero sale de la vista
  useEffect(() => {
    if (offHome) return; // sin Hero: el CTA ya nace visible (estado inicial)
    const heroCta = document.querySelector("[data-hero-cta]");
    if (!heroCta || !("IntersectionObserver" in window)) {
      // Sin observador no se puede saber: el CTA del menú se queda visible (como en la v1.7).
      // Es el único caso en que hay que corregir el estado inicial desde fuera de React (API del navegador).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeroCtaVisible(false);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setHeroCtaVisible(entries[0].isIntersecting),
      { rootMargin: "-76px 0px 0px 0px" }, // descuenta la altura del menú
    );
    io.observe(heroCta);
    return () => io.disconnect();
  }, [offHome]);

  /** Clic en un enlace del menú móvil: cierra y suelta el scroll antes de que el navegador salte al ancla. */
  const closeFromLink = () => {
    document.body.classList.remove("nav-open");
    setOpen(false);
  };

  const current = (href: string) => (activeIds.has(href.slice(1)) ? "true" : undefined);
  /** Enlace de sección: `#precios` en la home, `/#precios` fuera de ella. */
  const sectionHref = (href: string) => (offHome ? `${basePath}${href}` : href);

  return (
    <header className={`${styles.nav}${heroCtaVisible ? ` ${styles["hero-cta-visible"]}` : ""}`}>
      <div className={`wrap ${styles["nav-inner"]}`}>
        <a className={styles["nav-home"]} href={offHome ? basePath : NAV.homeHref} aria-label={NAV.homeLabel}>
          <img
            className={styles["nav-logo"]}
            src={NAV.logo.src}
            alt={NAV.logo.alt}
            width={NAV.logo.width}
            height={NAV.logo.height}
          />
        </a>
        <nav className={styles["nav-links"]} aria-label={NAV.linksLabel}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={sectionHref(link.href)} aria-current={current(link.href)}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={styles["nav-actions"]}>
          <a className={styles["nav-login"]} href={NAV.login.href}>
            {NAV.login.label}
          </a>
          <BtnCta size="sm" className={styles["nav-cta-desktop"]} href={NAV.ctaDesktop.href}>
            {NAV.ctaDesktop.label}
          </BtnCta>
          <BtnCta size="sm" className={styles["nav-cta-mobile"]} href={NAV.ctaMobile.href}>
            {NAV.ctaMobile.label}
          </BtnCta>
          <button
            ref={toggleRef}
            className={styles["nav-toggle"]}
            type="button"
            aria-label={open ? NAV.toggleLabelClose : NAV.toggleLabelOpen}
            aria-expanded={open ? "true" : "false"}
            aria-controls="navDrawer"
            id="navToggle"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div
        ref={drawerRef}
        className={`${styles["nav-drawer"]}${open ? ` ${styles.open}` : ""}`}
        id="navDrawer"
        tabIndex={-1}
      >
        <div className={`${styles["nav-drawer-inner"]} wrap`}>
          <nav className={styles["nav-drawer-links"]} aria-label={NAV.drawerLinksLabel}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={sectionHref(link.href)} aria-current={current(link.href)} onClick={closeFromLink}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className={styles["nav-drawer-foot"]}>
            <BtnCta href={NAV.drawer.cta.href} onClick={closeFromLink}>
              {NAV.drawer.cta.label}
            </BtnCta>
            <p className={styles.note}>{NAV.drawer.note}</p>
            <a className={styles["nav-login"]} href={NAV.drawer.login.href} onClick={closeFromLink}>
              {NAV.drawer.login.label}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
