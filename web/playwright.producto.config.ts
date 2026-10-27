import { defineConfig, devices } from "@playwright/test";

/**
 * Pruebas e2e del PRODUCTO (/c y /panel), separadas de la suite de la landing (`playwright.config.ts`).
 * A diferencia de la de la landing, esta SÍ necesita el entorno: `.env.local` con Supabase local
 * (`pnpm db:up`, `pnpm db:env`) y la semilla (`pnpm db:seed`). Corre contra `next build` + `next start`
 * en el puerto 3140 (`E2E_PRODUCTO_PORT` lo cambia). Ver README, «Pruebas e2e del producto».
 */
try {
  process.loadEnvFile(".env.local"); // Node >= 22; las variables ya exportadas en la terminal mandan
} catch {
  // Sin .env.local las pruebas fallarán con un mensaje claro en la fixture.
}

const PORT = Number(process.env.E2E_PRODUCTO_PORT ?? 3140);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e-producto",
  outputDir: "./test-results-producto",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 7_000 },
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    locale: "es-MX",
  },
  webServer: {
    // `next build` y `next start` leen web/.env.local. Cookies `Secure` con `localhost` (Chrome lo trata como seguro).
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: `${BASE_URL}/api/salud`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: { LT_ENV: "local", LT_COOKIE_SECURE: "1" },
    stdout: "ignore",
    stderr: "pipe",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // WebKit no envía cookies Secure por http://localhost: esas pruebas se saltan (RNF-PWA-07).
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 13"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 7"] } },
  ],
});
