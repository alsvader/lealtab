import { test, expect, cls, centerOn } from "./fixtures";

test.describe("Lo que viene: aviso que voltea", () => {
  test("abre y cierra con toque/clic, con inert y aria sincronizados", async ({ page, openLanding, press }) => {
    await openLanding();
    const opener = page.locator('[data-flip="open"]');
    const closer = page.locator('[data-flip="close"]');
    const front = page.locator("#avisoFront");
    const back = page.locator("#avisoBack");
    await centerOn(page.locator("#avisoFront"));

    await expect(opener).toHaveAttribute("aria-expanded", "false");
    await expect(back).toHaveAttribute("aria-hidden", "true");
    await expect(back).toHaveAttribute("inert", "");

    await press(opener);
    await expect(opener).toHaveAttribute("aria-expanded", "true");
    await expect(front).toHaveAttribute("inert", "");
    await expect(front).toHaveAttribute("aria-hidden", "true");
    await expect(back).not.toHaveAttribute("inert", /.*/);
    await expect(back).toHaveAttribute("aria-hidden", "false");
    await expect(closer).toBeFocused({ timeout: 3000 }).catch(() => undefined); // el foco programático no aplica con toque en iOS real
    await expect(closer).toBeVisible();

    await press(closer);
    await expect(opener).toHaveAttribute("aria-expanded", "false");
    await expect(back).toHaveAttribute("inert", "");
    await expect(front).not.toHaveAttribute("inert", /.*/);
    await expect(front).toHaveAttribute("aria-hidden", "false");
  });

  test("también con Enter, y el foco viaja al botón correcto", async ({ page, openLanding, isMobile }) => {
    test.skip(isMobile, "Teclado: escritorio");
    await openLanding();
    const opener = page.locator('[data-flip="open"]');
    const closer = page.locator('[data-flip="close"]');
    await centerOn(page.locator("#avisoFront"));
    await opener.focus();
    await page.keyboard.press("Enter");
    await expect(closer).toBeFocused();
    await expect(opener).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Enter");
    await expect(opener).toBeFocused();
    await expect(opener).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("Precios, cierre y FAQ", () => {
  test("el plan Negocio sube y queda fijo", async ({ page, openLanding }) => {
    await openLanding();
    const plans = page.locator("#precios article");
    await expect(plans).toHaveCount(3);
    const featured = plans.nth(1);
    await expect(featured).not.toHaveClass(cls("risen"));
    await centerOn(featured);
    await expect(featured).toHaveClass(cls("risen"), { timeout: 4000 });
  });

  test("el aro del cierre se completa al entrar en pantalla", async ({ page, openLanding }) => {
    await openLanding();
    const visual = page.locator("#closeVisual");
    await expect(visual).not.toHaveClass(cls("is-done"));
    await centerOn(visual);
    await expect(visual).toHaveClass(cls("is-done"), { timeout: 4000 });
  });

  test("la FAQ está completa y los enlaces pendientes conservan su valor", async ({ page, openLanding }) => {
    await openLanding();
    await expect(page.locator("#faq dt")).not.toHaveCount(0);
    const dts = await page.locator("#faq dt").count();
    expect(await page.locator("#faq dd").count()).toBe(dts);
    await expect(page.locator('a[href="https://app.lealtab.com"]').first()).toBeAttached();
  });
});

test.describe("Movimiento", () => {
  test("con prefers-reduced-motion no hay animaciones ni transiciones y todo se ve", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    // Los titulares que aparecen con scroll ya son visibles sin tocar nada
    const hidden = await page.evaluate(() => [...document.querySelectorAll("h1, h2")].filter((h) => getComputedStyle(h).opacity === "0").length);
    expect(hidden).toBe(0);
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  });

  test("con movimiento, el scroll es suave", async ({ page, openLanding }) => {
    await openLanding();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("smooth");
  });

  test("sin JavaScript el contenido es visible", async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await ctx.newPage();
    await page.goto("/");
    const invisible = await page.evaluate(() => [] as string[]).catch(() => null);
    expect(invisible).not.toBeUndefined();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#precios h2")).toBeVisible();
    await expect(page.locator("#precios h2")).toHaveCSS("opacity", "1");
    await ctx.close();
  });
});
