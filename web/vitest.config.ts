import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Next resuelve `server-only` internamente; en Vitest se sustituye por un módulo vacío.
      "server-only": path.resolve(__dirname, "src/test/server-only.ts"),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    // Las pruebas de RLS necesitan Supabase local: corren con pnpm test:rls (vitest.rls.config.ts).
    exclude: [...configDefaults.exclude, "src/test/rls/**"],
    environment: "node",
  },
});
