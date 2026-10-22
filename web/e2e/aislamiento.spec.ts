import { test, expect } from "./fixtures";

// ADR-007: la landing y el producto no comparten CSS ni layout raíz.

/** Hojas de estilo enlazadas en la página, con su contenido. */
async function cssDe(page: import("@playwright/test").Page): Promise<string> {
  const hrefs = await page.$$eval('link[rel="stylesheet"]', (ls) => ls.map((l) => (l as HTMLLinkElement).href));
  const bodies = await Promise.all(hrefs.map((h) => page.request.get(h).then((r) => r.text())));
  return bodies.join("\n");
}

// Marcas de cada hoja: .skip-link y .btn-cta son de globals.css (landing); producto.css no los trae.
const MARCA_LANDING = /\.skip-link|\.btn-cta/;

test.describe("Aislamiento landing / producto", () => {
  test("una ruta inexistente responde 404 y la landing sigue sana", async ({ page, request }) => {
    const r = await request.get("/esta-ruta-no-existe");
    expect(r.status()).toBe(404);
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("robots.txt bloquea /c/, /panel/ y /api/", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    for (const ruta of ["/c/", "/panel/", "/api/"]) expect(txt).toContain(`Disallow: ${ruta}`);
    expect(txt).toContain("Allow: /");
  });

  for (const ruta of ["/c", "/panel"]) {
    test(`${ruta} lleva noindex`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    });

    test(`${ruta} no carga el CSS de la landing`, async ({ page }) => {
      await page.goto(ruta);
      expect(await cssDe(page)).not.toMatch(MARCA_LANDING);
      await expect(page.locator("body")).toContainText("Producto no configurado");
    });
  }

  test("la landing no carga el CSS del producto", async ({ page }) => {
    await page.goto("/");
    const css = await cssDe(page);
    expect(css).toMatch(MARCA_LANDING);
    // producto.css agrega esta regla base de campos; globals.css no.
    expect(css).not.toContain("font-size:var(--font-size-input)");
  });
});
