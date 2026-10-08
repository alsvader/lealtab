import path from "node:path";
import { pathToFileURL } from "node:url";
import { test as base, expect, type Locator, type Page } from "@playwright/test";

/** La landing aprobada (v1.7), de referencia para las pruebas de paridad. */
export const V17_URL = pathToFileURL(
  path.resolve(__dirname, "../../brand/05-marketing/03-mockup-landing-v1.7.html"),
).href;

type Fixtures = {
  /** Toque en pantallas táctiles (Mobile Safari / Mobile Chrome), clic en las demás. */
  press: (target: Locator) => Promise<void>;
  /** Abre la landing y espera a que carguen las fuentes. */
  openLanding: (query?: string) => Promise<void>;
};

export const test = base.extend<Fixtures & { guard: void }>({
  // Cada prueba falla si hay errores/avisos de consola, excepciones o respuestas 4xx/5xx.
  guard: [
    async ({ page }, run) => {
      const problems: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") problems.push(`${m.type()}: ${m.text()}`);
      });
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
      page.on("response", (r) => {
        if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
      });
      page.on("requestfailed", (r) => problems.push(`requestfailed: ${r.url()}`));
      await run();
      expect(problems, "consola y red limpias").toEqual([]);
    },
    { auto: true },
  ],
  press: async ({ hasTouch }, run) => {
    await run((target) => (hasTouch ? target.tap() : target.click()));
  },
  openLanding: async ({ page }, run) => {
    await run(async (query = "") => {
      await page.goto(`/${query}`, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      // Espera a que React hidrate (antes de eso los clics y toques no hacen nada y la guía por SO no está aplicada)
      await page.waitForFunction(() => {
        const el = document.getElementById("navToggle");
        return !!el && Object.keys(el).some((k) => k.startsWith("__reactProps"));
      });
    });
  },
});

export { expect };
export type { Locator, Page };

/** Las clases de CSS Modules llevan prefijo con hash (`abc12_open`): se compara el final. */
export const cls = (name: string) => new RegExp(`(^|\\s|_)${name}(\\s|$)`);

/** Texto normalizado (espacios y saltos de línea colapsados). */
export const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** Lleva el elemento al centro de la ventana sin animación (el scroll suave de la página se omite). */
export async function centerOn(target: Locator) {
  await target.evaluate((el) => {
    const r = el.getBoundingClientRect();
    window.scrollTo({ top: r.top + window.scrollY + r.height / 2 - window.innerHeight / 2, behavior: "instant" });
  });
}
