import type { Metadata, Viewport } from "next";
import { archivo, manrope } from "../fonts";
import "@/styles/tokens.css";
import "@/styles/producto.css";

export const metadata: Metadata = {
  title: "LealTab",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: "#F3EFE6",
};

export default function ProductoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${archivo.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
