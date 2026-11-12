import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const RUTAS = ["/panel/entrar", "/panel/alta", "/panel/negocio", "/panel/tarjeta", "/panel/cartel"] as const;
const PASOS = ["1. Cuenta", "2. Tu negocio", "3. Tu tarjeta", "4. QR de mostrador"];
const ACTUAL: Record<(typeof RUTAS)[number], string> = {
  "/panel/entrar": "1. Cuenta",
  "/panel/alta": "1. Cuenta",
  "/panel/negocio": "2. Tu negocio",
  "/panel/tarjeta": "3. Tu tarjeta",
  "/panel/cartel": "4. QR de mostrador",
};

test.describe("cascarón de N1 a N4", () => {
  for (const ruta of RUTAS) {
    test(`${ruta} responde 200 con la barra de pasos`, async ({ page }) => {
      const res = await page.goto(ruta);
      expect(res?.status()).toBe(200);
      const barra = page.getByRole("navigation", { name: "Pasos del alta" });
      await expect(barra).toBeVisible();
      await expect(barra.getByRole("link")).toHaveCount(0);
      for (const paso of PASOS) {
        await expect(barra.getByText(paso, { exact: true })).toBeVisible();
      }
      await expect(barra.getByText(ACTUAL[ruta], { exact: true })).toHaveAttribute("aria-current", "step");
    });
  }

  test("el paso 2 no regresa a la cuenta", async ({ page }) => {
    await page.goto("/panel/negocio");
    await expect(page.locator('a[href="/panel/alta"]')).toHaveCount(0);
  });

  test("Ayuda por WhatsApp abre wa.me sin texto de mensaje", async ({ page }) => {
    await page.goto("/panel/alta");
    const ayuda = page.getByRole("link", { name: "Ayuda por WhatsApp" });
    const href = await ayuda.getAttribute("href");
    expect(href?.startsWith("https://wa.me/")).toBe(true);
    expect(href?.includes("text=")).toBe(false);
    await expect(page.getByRole("heading", { name: "Empieza gratis hoy" })).toBeVisible();
    await expect(page.getByRole("tablist", { name: "Cómo quieres entrar" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Con contraseña" })).toBeVisible();
    await expect(page.getByText("Crear también una contraseña (opcional)")).toBeVisible();
  });

  test("el alta no agrega violaciones de axe", async ({ page }) => {
    await page.goto("/panel/alta");
    const resultado = await new AxeBuilder({ page }).analyze();
    expect(resultado.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
