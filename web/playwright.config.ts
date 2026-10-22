import { defineConfig, devices } from "@playwright/test";

/**
 * Pruebas e2e de la landing (ver README, sección "Pruebas e2e").
 * Corren contra el build de producción (`next build` + `next start`) en un puerto propio.
 */
const PORT = Number(process.env.E2E_PORT ?? 3120);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  timeout: 45_000,
  expect: { timeout: 7_000 },
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    locale: "es-MX",
  },
  webServer: {
    // Build + start de producción. En local reutiliza un servidor ya levantado en ese puerto.
    command: `pnpm build && pnpm exec next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    // Cadenas vacías: Next no pisa lo ya definido en process.env, así el e2e no depende de web/.env.local.
    env: Object.fromEntries(
      [
        "SUPABASE_URL",
        "SUPABASE_PUBLISHABLE_KEY",
        "SUPABASE_SECRET_KEY",
        "SUPABASE_DB_URL",
        "SUPABASE_DB_URL_MIGRACIONES",
        "SEND_SMS_HOOK_SECRET",
        "SMSMASIVOS_API_KEY",
        "RESEND_API_KEY",
        "IP_HASH_PEPPER",
        "CRON_SECRET",
      ].map((k) => [k, ""]),
    ),
    stdout: "ignore",
    stderr: "pipe",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 13"] } },
    { name: "Mobile Chrome", use: { ...devices["Pixel 7"] } },
  ],
});
