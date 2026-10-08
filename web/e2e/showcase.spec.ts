import { test, expect, cls, centerOn } from "./fixtures";

const BIZ = {
  barberia: { name: "Barbería Norte", initials: "BN", label: "Norte", n: 4, total: 5, msg: "Llevas 4 de 5. El siguiente corte va por nuestra cuenta.", done: "Tu siguiente corte va por nuestra cuenta.", next: "5 de 5" },
  estetica: { name: "Estética Luna", initials: "EL", label: "Luna", n: 2, total: 6, msg: "2 de 6 visitas. Tu tratamiento de regalo te espera.", done: "Tu tratamiento de regalo te espera.", next: "" },
  tapioca: { name: "Tapioca Sol", initials: "TS", label: "Sol", n: 7, total: 10, msg: "7 de 10. Te faltan 3 para tu tapioca gratis.", done: "Tu siguiente tapioca va por nuestra cuenta.", next: "" },
} as const;
type Key = keyof typeof BIZ;
const KEYS = Object.keys(BIZ) as Key[];

test.describe("La tarjeta", () => {
  test("el selector cambia la marca, el mensaje, el ícono y el aro", async ({ page, openLanding, press }) => {
    await openLanding();
    await centerOn(page.locator("#bizcard"));
    const card = page.locator("#bizcard");
    for (const k of [...KEYS, "barberia" as Key]) {
      const b = BIZ[k];
      await press(page.locator(`[role=tab][data-biz=${k}]`));
      await expect(card).toHaveAttribute("data-theme", k);
      for (const other of KEYS) await expect(page.locator(`[role=tab][data-biz=${other}]`)).toHaveAttribute("aria-selected", String(other === k));
      await expect(card.locator('[data-k="name"]').first()).toHaveText(b.name);
      await expect(card.locator('[data-k="count"]').first()).toHaveText(`${b.n}/${b.total}`);
      await expect(card.locator('[data-k="msg"]').first()).toHaveText(b.msg);
      await expect(page.locator("#homeIcon")).toHaveText(b.initials);
      await expect(page.locator("#homeLabel")).toHaveText(b.label);
      await expect(page.locator("#visitLbl")).toHaveText("Suma una visita");
    }
  });

  test("flechas del selector (con vuelta)", async ({ page, openLanding, isMobile }) => {
    test.skip(isMobile, "Teclado: escritorio");
    await openLanding();
    await centerOn(page.locator("#bizcard"));
    const tab = (k: Key) => page.locator(`[role=tab][data-biz=${k}]`);
    await tab("barberia").focus();
    await page.keyboard.press("ArrowRight");
    await expect(tab("estetica")).toBeFocused();
    await expect(page.locator("#bizcard")).toHaveAttribute("data-theme", "estetica");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight"); // vuelta a barbería
    await expect(tab("barberia")).toBeFocused();
    await expect(page.locator("#bizcard")).toHaveAttribute("data-theme", "barberia");
    await page.keyboard.press("ArrowLeft"); // vuelta al final
    await expect(tab("tapioca")).toBeFocused();
    await expect(page.locator("#bizcard")).toHaveAttribute("data-theme", "tapioca");
  });

  for (const k of KEYS) {
    test(`Suma una visita hasta completar y Empezar de nuevo (${k})`, async ({ page, openLanding, press }) => {
      await openLanding();
      await centerOn(page.locator("#bizcard"));
      const b = BIZ[k];
      const card = page.locator("#bizcard");
      await press(page.locator(`[role=tab][data-biz=${k}]`));
      const btn = page.locator("#visitBtn");
      for (let n = b.n + 1; n <= b.total; n++) {
        await press(btn);
        await expect(card.locator('[data-k="count"]').first()).toHaveText(`${n}/${b.total}`);
        if (n < b.total) {
          await expect(btn).toContainText("Suma una visita");
          await expect(card).not.toHaveClass(cls("is-complete"));
        }
      }
      await expect(card).toHaveClass(cls("is-complete"));
      await expect(page.locator("#visitLbl")).toHaveText("Empezar de nuevo");
      await expect(card.locator('[data-k="msg"]').first()).toHaveText(b.done);
      await press(btn);
      await expect(page.locator("#visitLbl")).toHaveText("Suma una visita");
      await expect(card).not.toHaveClass(cls("is-complete"));
      await expect(card.locator('[data-k="count"]').first()).toHaveText(`${b.n}/${b.total}`);
      await expect(card.locator('[data-k="msg"]').first()).toHaveText(b.msg);
    });
  }

  test("Mostrar mi código voltea el panel; sumar una visita o cambiar de negocio lo cierra", async ({ page, openLanding, press }) => {
    await openLanding();
    await centerOn(page.locator("#bizcard"));
    const code = page.locator("#codeBtn");
    const face = page.locator("#codeFace");
    await expect(code).toHaveText("Mostrar mi código");
    await expect(code).toHaveAttribute("aria-expanded", "false");
    await expect(face).toHaveAttribute("aria-hidden", "true");

    await press(code);
    await expect(code).toHaveText("Ocultar mi código");
    await expect(code).toHaveAttribute("aria-expanded", "true");
    await expect(face).toHaveAttribute("aria-hidden", "false");
    await press(code);
    await expect(code).toHaveText("Mostrar mi código");
    await expect(face).toHaveAttribute("aria-hidden", "true");

    await press(code);
    await press(page.locator("#visitBtn")); // sumar una visita cierra el código
    await expect(code).toHaveText("Mostrar mi código");
    await expect(code).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator('#bizcard [data-k="count"]').first()).toHaveText("5/5");

    await press(code);
    await press(page.locator("[role=tab][data-biz=tapioca]")); // cambiar de negocio también
    await expect(code).toHaveText("Mostrar mi código");
    await expect(code).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#bizcard")).toHaveAttribute("data-theme", "tapioca");
  });
});

test.describe("Para quién: Ver su tarjeta", () => {
  for (const k of KEYS) {
    test(`lleva a La tarjeta con ${k} seleccionado y aplica el spotlight`, async ({ page, openLanding, press }) => {
      await openLanding();
      const link = page.locator(`a[data-biz=${k}][href="#la-tarjeta"]`);
      await link.scrollIntoViewIfNeeded();
      await press(link);
      await expect(page.locator("#bizcard")).toHaveAttribute("data-theme", k);
      await expect(page.locator(`[role=tab][data-biz=${k}]`)).toHaveAttribute("aria-selected", "true");
      await expect(page).toHaveURL(/#la-tarjeta$/);
      // El spotlight entra a ~450 ms (con movimiento)
      await expect(page.locator("#bizcard")).toHaveClass(cls("spotlight"), { timeout: 3000 });
      // Termina el scroll suave con La tarjeta en pantalla
      await expect
        .poll(() => page.evaluate(() => Math.round(document.getElementById("la-tarjeta")!.getBoundingClientRect().top)), { timeout: 6000 })
        .toBeLessThan(120);
      await expect(page.locator("#bizcard")).toBeInViewport();
    });
  }

  test("con prefers-reduced-motion no hay spotlight, pero sí cambio de negocio", async ({ page, press, openLanding }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openLanding();
    const link = page.locator("a[data-biz=tapioca][href='#la-tarjeta']");
    await link.scrollIntoViewIfNeeded();
    await press(link);
    await expect(page.locator("#bizcard")).toHaveAttribute("data-theme", "tapioca");
    await page.waitForTimeout(900);
    await expect(page.locator("#bizcard")).not.toHaveClass(cls("spotlight"));
  });
});
