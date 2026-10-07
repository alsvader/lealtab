import type { AnchorHTMLAttributes, ReactNode } from "react";

type BtnCtaProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  children: ReactNode;
  /** "sm" = variante chica del menú (flecha de 18 px, clase global `btn-cta-sm`). */
  size?: "default" | "sm";
};

/**
 * Botón firma de la v1.7: etiqueta en bosque + flecha en bloque noche.
 * Estilos globales `.btn-cta*` (globals.css). Pasa `className` para sumar clases de módulo
 * y cualquier atributo de <a> (href, data-hero-cta, target, rel...).
 */
export function BtnCta({ children, size = "default", className, ...rest }: BtnCtaProps) {
  const icon = size === "sm" ? 18 : 22;
  const classes = ["btn-cta", size === "sm" ? "btn-cta-sm" : null, className]
    .filter(Boolean)
    .join(" ");
  return (
    <a className={classes} {...rest}>
      <span className="btn-cta-label">{children}</span>
      <span className="btn-cta-arrow" aria-hidden="true">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}
