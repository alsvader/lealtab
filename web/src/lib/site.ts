import type { Metadata } from "next";

/** Origen público del sitio (el mismo `metadataBase` del layout raíz). */
export const SITE_URL = "https://lealtab.com";

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
