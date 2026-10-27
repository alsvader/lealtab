import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const RUTAS = ["/panel/entrar", "/panel/alta", "/panel/negocio", "/panel/tarjeta", "/panel/cartel"] as const;
const PASOS = ["1. Cuenta", "2. Tu negocio", "3. Tu tarjeta", "4. QR de mostrador"];

test.describe("cascarón de N1 a N4", () => {
  for (const ruta of RUTAS) {
    test(`${ruta} responde 200 con la barra de pasos`, async ({ page }) => {
      const res = await page.goto(ruta);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("navigation", { name: "Pasos del alta" })).toBeVisible();
      for (const paso of PASOS) {
        await expect(page.getByRole("link", { name: paso })).toBeVisible();
      }
    });
  }

  test("Ayuda por WhatsApp abre wa.me sin texto de mensaje", async ({ page }) => {
    await page.goto("/panel/alta");
    const ayuda = page.getByRole("link", { name: "Ayuda por WhatsApp" });
    const href = await ayuda.getAttribute("href");
    expect(href?.startsWith("https://wa.me/")).toBe(true);
    expect(href?.includes("text=")).toBe(false);
    await expect(page.getByRole("heading", { name: "Empieza gratis hoy" })).toBeVisible();
  });

  test("el alta no agrega violaciones de axe", async ({ page }) => {
    await page.goto("/panel/alta");
    const resultado = await new AxeBuilder({ page }).analyze();
    expect(resultado.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
