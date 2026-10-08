import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { PRIVACY } from "../src/content/legal/privacy";
import { TERMS } from "../src/content/legal/terms";
import { NAV_LINKS } from "../src/content/nav";
import { test, expect } from "./fixtures";

const PAGES = [
  { path: "/aviso-de-privacidad", doc: PRIVACY, footerLabel: "Aviso de privacidad" },
  { path: "/terminos-y-condiciones", doc: TERMS, footerLabel: "Términos y condiciones" },
] as const;

/** Espera a que la página legal esté lista (fuentes cargadas). Sin scroll suave: el ancla llega al instante. */
async function openLegal(page: Page, path: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // Como openLanding (fixtures.ts): espera a que React hidrate el menú; antes, un toque no lo abre ni mueve el foco
  await page.waitForFunction(() => {
    const el = document.getElementById("navToggle");
    return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
  });
}

const topOf = (page: Page, id: string) =>
  page.evaluate((id) => Math.round(document.getElementById(id)!.getBoundingClientRect().top), id);

for (const { path, doc, footerLabel } of PAGES) {
  test.describe(`Página legal · ${path}`, () => {
    test("carga con su título, fecha, introducción y metadatos", async ({ page, request }) => {
      await openLegal(page, path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(doc.title);
      await expect(page).toHaveTitle(`${doc.title} · LealTab`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", doc.description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.lealtab.com${path}`);
      // OG heredado del layout
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "es-MX");

      const time = page.locator("main time");
      await expect(time).toHaveAttribute("datetime", doc.updatedAtIso);
      await expect(time).toHaveText(doc.updatedAt);
      await expect(page.getByText("Última actualización:")).toBeVisible();

      // Un solo h1, secciones numeradas con <h2 id>
      await expect(page.locator("h1")).toHaveCount(1);
      const h2 = page.locator("main h2");
      await expect(h2).toHaveCount(doc.sections.length);
      for (const [i, s] of doc.sections.entries()) {
        const h = page.locator(`h2#${s.id}`);
        await expect(h).toContainText(`${i + 1}.`);
        await expect(h).toContainText(s.heading);
      }
      expect((await request.get(path)).status()).toBe(200);
    });

    test("el índice enlaza cada sección y el ancla funciona", async ({ page, press }) => {
      await openLegal(page, path);
      const toc = page.getByRole("navigation", { name: "Contenido" });
      const links = toc.locator("a");
      await expect(links).toHaveCount(doc.sections.length);
      for (const [i, s] of doc.sections.entries()) {
        const link = links.nth(i);
        await expect(link).toHaveAttribute("href", `#${s.id}`);
        await expect(link).toContainText(`${i + 1}.`);
        await expect(link).toContainText(s.heading);
      }
      // Primera, una intermedia y la última: el encabezado queda bajo el menú fijo y a la vista
      const picks = [0, Math.floor(doc.sections.length / 2), doc.sections.length - 1];
      for (const i of picks) {
        const s = doc.sections[i];
        await press(links.nth(i));
        await expect(page).toHaveURL(new RegExp(`${path}#${s.id}$`));
        await expect.poll(() => topOf(page, s.id), { timeout: 5000 }).toBeGreaterThanOrEqual(60);
        expect(await topOf(page, s.id)).toBeLessThan(160);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      }
    });

    test("los enlaces del texto: externos en pestaña nueva, el resto no", async ({ page }) => {
      await openLegal(page, path);
      const externals = page.locator('main a[href^="http"]');
      for (const a of await externals.all()) {
        await expect(a).toHaveAttribute("target", "_blank");
        await expect(a).toHaveAttribute("rel", /noopener/);
        await expect(a).toHaveAttribute("rel", /noreferrer/);
      }
      for (const a of await page.locator('main a[href^="mailto:"], main a[href^="/"]').all()) {
        await expect(a).not.toHaveAttribute("target", /.+/);
        await expect(a).not.toHaveAttribute("rel", /.+/);
      }
    });

    test("'Volver al inicio' lleva a la home", async ({ page, press }) => {
      await openLegal(page, path);
      const back = page.getByRole("link", { name: "Volver al inicio" });
      await expect(back).toHaveCount(2);
      await press(back.first());
      await expect(page).toHaveURL("/");
      await expect(page.locator("#hero")).toBeVisible();
    });

    test("el enlace del footer en la home lleva a la página", async ({ page, openLanding, press }) => {
      await openLanding();
      const link = page.getByRole("navigation", { name: "Legal" }).getByRole("link", { name: footerLabel });
      await expect(link).toHaveAttribute("href", path);
      await link.scrollIntoViewIfNeeded();
      await press(link);
      await expect(page).toHaveURL(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(doc.title);
    });

    test("axe: sin violaciones", async ({ page }) => {
      await openLegal(page, path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.length} nodos. ${v.help}`)).toEqual([]);
    });
  });
}

test("el enlace de Confianza lleva al aviso de privacidad", async ({ page, openLanding, press }) => {
  await openLanding();
  const link = page.locator("#confianza").getByRole("link", { name: "Lee el aviso de privacidad →" });
  await expect(link).toHaveAttribute("href", "/aviso-de-privacidad");
  await link.scrollIntoViewIfNeeded();
  await press(link);
  await expect(page).toHaveURL("/aviso-de-privacidad");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(PRIVACY.title);
});

test.describe("Nav y Footer fuera de la home", () => {
  test("el logo y los enlaces de sección apuntan a la home (/#…)", async ({ page }) => {
    await openLegal(page, PAGES[0].path);
    const header = page.locator("header");
    await expect(header.locator('a[aria-label="LealTab, ir al inicio"]')).toHaveAttribute("href", "/");
    for (const { href, label } of NAV_LINKS) {
      // Se repite en el menú de escritorio y en el menú móvil
      const hrefs = await header.getByRole("link", { name: label, includeHidden: true }).evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      expect(hrefs, label).toEqual([`/${href}`, `/${href}`]);
    }
    const footer = page.locator("footer");
    await expect(footer.locator('a[aria-label="LealTab, ir al inicio"]')).toHaveAttribute("href", "/");
    for (const { href, label } of NAV_LINKS) {
      await expect(footer.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", `/${href}`);
    }
    // Los demás enlaces no cambian
    await expect(footer.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
    await expect(footer.getByRole("link", { name: "Aviso de privacidad" })).toHaveAttribute("href", "/aviso-de-privacidad");
  });

  test("el menú no marca ninguna sección y el CTA está visible", async ({ page, isMobile }) => {
    await openLegal(page, PAGES[0].path);
    await expect(page.locator('header [aria-current="true"]')).toHaveCount(0);
    const cta = page.locator("header .btn-cta-sm").filter({ hasText: isMobile ? "Empieza gratis" : "Crea tu tarjeta gratis" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveCSS("opacity", "1");
    expect((await cta.boundingBox())!.width).toBeGreaterThan(100);
    // Sigue igual tras hidratar y al hacer scroll
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    await expect(page.locator('header [aria-current="true"]')).toHaveCount(0);
    await expect(cta).toHaveCSS("opacity", "1");
  });

  test("desde una página legal, cada enlace del menú lleva a su sección de la home", async ({ page, press, isMobile }) => {
    for (const { href, label } of NAV_LINKS) {
      await openLegal(page, PAGES[1].path);
      const id = href.slice(1);
      if (isMobile) {
        await press(page.locator("#navToggle"));
        await expect(page.locator("#navDrawer")).toBeVisible();
        await press(page.locator("#navDrawer").getByRole("link", { name: label }));
      } else {
        await press(page.getByRole("navigation", { name: "Principal", exact: true }).getByRole("link", { name: label }));
      }
      await expect(page).toHaveURL(new RegExp(`/#${id}$`));
      await expect(page.locator(`#${id}`)).toBeAttached();
      await expect.poll(() => topOf(page, id), { timeout: 8000 }).toBeLessThan(160);
      expect(await topOf(page, id)).toBeGreaterThanOrEqual(-5);
    }
  });

  test("el logo regresa a la home", async ({ page, press }) => {
    await openLegal(page, PAGES[0].path);
    await press(page.locator('header a[aria-label="LealTab, ir al inicio"]'));
    await expect(page).toHaveURL("/");
    await expect(page.locator("#hero")).toBeVisible();
  });

  test("menú móvil: abre y cierra en una página legal", async ({ page, press }) => {
    test.skip(!page.viewportSize() || page.viewportSize()!.width >= 1024, "Solo en móvil");
    await openLegal(page, PAGES[0].path);
    const toggle = page.locator("#navToggle");
    await press(toggle);
    await expect(page.locator("#navDrawer")).toBeVisible();
    // Como en nav.spec.ts: Escape solo después de que el foco llegó al panel (bajo carga, WebKit tarda)
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("navDrawer");
    await page.keyboard.press("Escape");
    await expect(page.locator("#navDrawer")).toBeHidden();
  });
});

test("sitemap.xml y robots.txt listan las tres rutas", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["https://www.lealtab.com/", "https://www.lealtab.com/aviso-de-privacidad", "https://www.lealtab.com/terminos-y-condiciones"]) {
    expect(sitemap).toContain(`<loc>${p}</loc>`);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://www.lealtab.com/sitemap.xml");
  expect(robots).toMatch(/Allow: \//);
});
