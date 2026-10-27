import type { NextConfig } from "next";

// Cabeceras solo del producto (ADR-007 §2.7): la landing no se toca.
// CSP sin `script-src` (con una política estricta Next exige nonces y choca con `cacheComponents`)
// y solo en producción, para no romper el HMR.
const CSP =
  "connect-src 'self'; img-src 'self' data: blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'";

const cabecerasProducto = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // La cámara (escáner de N5) solo del propio origen; nada más.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: CSP }] : []),
];

const nextConfig: NextConfig = {
  // Solo el Dockerfile lo activa (NEXT_OUTPUT=standalone); Vercel y el build normal no cambian.
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  cacheComponents: true,
  async headers() {
    return ["/c/:path*", "/panel/:path*", "/api/:path*"].map((source) => ({ source, headers: cabecerasProducto }));
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Tailwind v4 solo procesa el CSS global. Los CSS Modules (`*.module.css`) se excluyen:
      // si pasan por este loader, Turbopack los trata como CSS global y `:global(...)`,
      // los nombres de clase locales y las @keyframes locales dejan de funcionar.
      "*.css": {
        condition: { not: { path: "*.module.css" } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
