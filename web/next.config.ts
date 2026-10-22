import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo el Dockerfile lo activa (NEXT_OUTPUT=standalone); Vercel y el build normal no cambian.
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  cacheComponents: true,
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
