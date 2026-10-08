import type { Metadata, Viewport } from "next";
import { archivo, manrope } from "./fonts";
import { OG_BASE, SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

const TITLE = "LealTab · Haz que tus clientes siempre regresen";
const DESCRIPTION =
  "Tu tarjeta de lealtad, ahora en el celular de tus clientes. Créala en minutos; tus clientes la instalan con un toque, sin descargar nada. Prueba gratis 30 días.";
const OG_DESCRIPTION =
  "Tu tarjeta de lealtad, ahora en el celular de tus clientes. Prueba gratis 30 días.";

// Mismo <head> que la v1.7 (+ íconos de brand/03-visual-identity/.../entregables/web/snippet.html)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { ...OG_BASE, title: TITLE, description: OG_DESCRIPTION },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F3EFE6",
};

// Antes de pintar: la clase `js` activa los estados iniciales de la capa de movimiento
// (sin JS, el contenido se ve completo). Igual que la v1.7.
const JS_CLASS_SCRIPT = 'document.documentElement.classList.add("js");';

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de <head> agrega la clase `js` antes de hidratar.
    // data-scroll-behavior: la v1.7 usa `scroll-behavior: smooth` en <html>; Next lo pide explícito.
    <html
      lang="es-MX"
      className={`${archivo.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_CLASS_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
