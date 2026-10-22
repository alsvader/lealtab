import { expect, test } from "./fixtures";

// La suite e2e corre sin variables de Supabase. El 503 llega en T6 (proxy.ts).
for (const ruta of ["/c", "/panel"]) {
  test(`${ruta} muestra «Producto no configurado» sin Supabase`, async ({ page }) => {
    const res = await page.goto(ruta);
    expect(res?.status()).toBe(200);
    await expect(page.getByText("Producto no configurado")).toBeVisible();
  });
}
