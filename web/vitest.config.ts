import path from "node:path";
import { defineConfig } from "vitest/config";

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
    environment: "node",
  },
});
