import { test, expect, V17_URL, norm } from "./fixtures";

/** Todo el texto que ve (o lee) una persona: texto visible y atributos accesibles. */
async function extract(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const attrs: string[] = [];
    document.querySelectorAll("[alt], [aria-label], [title]").forEach((e) => {
      for (const a of ["alt", "aria-label", "title"]) if (e.hasAttribute(a)) attrs.push(`${e.tagName.toLowerCase()}[${a}]=${e.getAttribute(a)}`);
    });
    // Todo el texto, incluido el que está oculto a propósito (motivos de las filas, recompensa lista, etc.)
    const hiddenToo: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = n.parentElement;
      if (!p || ["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT"].includes(p.tagName)) continue;
      const t = (n.textContent ?? "").replace(/\s+/g, " ").trim();
      if (t) hiddenToo.push(t);
    }
    return { title: document.title, text: document.body.innerText, attrs: attrs.sort(), all: hiddenToo.join(" | ") };
  });
}

test.describe("Paridad de copy con la v1.7", () => {
  test("innerText, texto oculto, atributos y título son iguales", async ({ page, context, openLanding }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openLanding();
    const web = await extract(page);

    const ref = await context.newPage();
    await ref.emulateMedia({ reducedMotion: "reduce" });
    await ref.goto(V17_URL, { waitUntil: "networkidle" });
    await ref.evaluate(() => document.fonts.ready);
    const v17 = await extract(ref);
    await ref.close();

    expect(norm(v17.text).length).toBeGreaterThan(2000); // la extracción no está vacía
    expect(norm(web.text)).toBe(norm(v17.text));
    expect(web.all).toBe(v17.all);
    expect(web.attrs).toEqual(v17.attrs);
    expect(web.title).toBe(v17.title);
  });
});
