import { defineConfig } from "vitest/config";

// Pruebas de RLS por la API REST (src/test/rls). Necesitan Supabase local arriba (pnpm db:up).
// Los archivos corren uno tras otro: comparten los usuarios que crea el globalSetup.
export default defineConfig({
  test: {
    include: ["src/test/rls/**/*.test.ts"],
    environment: "node",
    globalSetup: ["src/test/rls/global-setup.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 120_000,
  },
});
