import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect, V17_URL } from "./fixtures";

type Count = Record<string, { impact: string | null | undefined; nodes: number; help: string }>;

async function scan(page: Page): Promise<Count> {
  const r = await new AxeBuilder({ page }).analyze();
  const out: Count = {};
  for (const v of r.violations) out[v.id] = { impact: v.impact, nodes: v.nodes.length, help: v.help };
  return out;
}

/** Reglas nuevas en web/ o con más nodos que en la v1.7 (lo heredado de la v1.7 no hace fallar la prueba). */
function newIn(web: Count, v17: Count) {
  return Object.entries(web)
    .filter(([id, v]) => !v17[id] || v.nodes > v17[id].nodes)
    .map(([id, v]) => `${id} (${v.impact}): ${v.nodes} nodos vs ${v17[id]?.nodes ?? 0} en la v1.7. ${v.help}`);
}

for (const scenario of ["página completa", "menú móvil abierto"] as const) {
  test.describe(`axe · ${scenario}`, () => {
    if (scenario === "menú móvil abierto") test.use({ viewport: { width: 390, height: 800 } });

    test("web/ no agrega violaciones respecto a la v1.7", async ({ page, context, openLanding, press }, testInfo) => {
      const open = async (p: Page) => {
        if (scenario !== "menú móvil abierto") return;
        await press(p.locator("#navToggle"));
        await expect(p.locator("#navDrawer")).toBeVisible();
        await p.waitForTimeout(400); // transición del panel
      };
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openLanding();
      await open(page);
      const web = await scan(page);

      const ref = await context.newPage();
      await ref.emulateMedia({ reducedMotion: "reduce" });
      await ref.goto(V17_URL, { waitUntil: "networkidle" });
      await ref.evaluate(() => document.fonts.ready);
      await open(ref);
      const v17 = await scan(ref);
      await ref.close();

      const inherited = Object.keys(web).filter((id) => v17[id]);
      if (inherited.length) testInfo.annotations.push({ type: "heredado de la v1.7", description: inherited.map((id) => `${id}: ${web[id].nodes}`).join(", ") });
      expect(newIn(web, v17), "violaciones nuevas en web/").toEqual([]);
    });
  });
}
