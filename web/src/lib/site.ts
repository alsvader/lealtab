import type { Metadata } from "next";

/**
 * Origen público canónico del sitio (el mismo `metadataBase` del layout raíz).
 * Debe ser `www`: el apex responde 308 → www, y los scrapers de redes sociales
 * no siguen redirecciones al descargar `og:image`.
 */
export const SITE_URL = "https://www.lealtab.com";

/** Base de Open Graph compartida por todas las páginas (Next reemplaza el objeto completo por página). */
export const OG_BASE = {
  // `satisfies` deja el tipo literal ("website") sin volverlo de solo lectura.
  type: "website",
  locale: "es_MX",
  siteName: "LealTab",
  images: [
    {
      url: "/og/lealtab-og-1200x630.png",
      width: 1200,
      height: 630,
      alt: "LealTab: Haz que tus clientes siempre regresen.",
    },
  ],
} satisfies NonNullable<Metadata["openGraph"]>;
