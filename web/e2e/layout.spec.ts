import { test, expect, V17_URL } from "./fixtures";

const SIZES: Array<[number, number]> = [
  [320, 700], [360, 740], [375, 812], [390, 844], [768, 1024], [844, 390], [1024, 768], [1280, 800], [1440, 900], [1920, 1080],
];

/** Mide cuando la altura ya no cambia (en la v1.7 las fuentes llegan de Google Fonts y document.fonts.ready puede resolverse antes). */
const overflow = (page: import("@playwright/test").Page) =>
  page.evaluate(async () => {
    const h = () => document.documentElement.scrollHeight;
    let last = -1;
    let stable = 0;
    for (let i = 0; i < 60 && stable < 5; i++) {
      await new Promise((r) => setTimeout(r, 120));
      stable = h() === last ? stable + 1 : 0;
      last = h();
    }
    return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h: h() };
  });

test.describe("Sin scroll horizontal y misma altura que la v1.7", () => {
  test.skip(({ isMobile }) => isMobile, "Los anchos se fuerzan en los proyectos de escritorio; los móviles se prueban abajo");

  for (const [w, h] of SIZES) {
    test(`${w}×${h}`, async ({ page, context, openLanding }, testInfo) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: w, height: h });
      await openLanding();
      const web = await overflow(page);

      const ref = await context.newPage();
      await ref.emulateMedia({ reducedMotion: "reduce" });
      await ref.setViewportSize({ width: w, height: h });
      await ref.goto(V17_URL, { waitUntil: "networkidle" });
      await ref.evaluate(() => document.fonts.ready);
      const v17 = await overflow(ref);
      await ref.close();

      // Paridad con la v1.7: ni más ancho ni más alto
      expect(web.sw).toBeLessThanOrEqual(Math.max(web.cw, v17.sw));
      expect(Math.abs(web.h - v17.h)).toBeLessThanOrEqual(1);
      if (v17.sw > v17.cw) {
        // Defecto heredado de la v1.7 (ver informe QA, ronda 2): a 320 px el hero se sale 33 px a la derecha
        testInfo.annotations.push({ type: "heredado de la v1.7", description: `scrollWidth ${v17.sw} > ${v17.cw} a ${w} px` });
        expect(w).toBeLessThan(360);
      } else {
        expect(web.sw).toBeLessThanOrEqual(web.cw);
      }
    });
  }
});

test.describe("Móvil (perfil del proyecto)", () => {
  test.skip(({ isMobile }) => !isMobile, "Solo proyectos móviles");

  test("sin scroll horizontal y con táctil", async ({ page, openLanding, hasTouch }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openLanding();
    const o = await overflow(page);
    expect(hasTouch).toBe(true);
    expect(o.sw).toBeLessThanOrEqual(o.cw);
    // El menú móvil (no los enlaces de escritorio) es el visible
    await expect(page.locator("#navToggle")).toBeVisible();
    await expect(page.locator('nav[aria-label="Principal"]')).toBeHidden();
  });
});
