import { test, expect, cls, centerOn } from "./fixtures";

test.describe("Cómo funciona", () => {
  test("el paso a la vista se marca y el contador avanza", async ({ page, openLanding }) => {
    await openLanding();
    const steps = page.locator("#como-funciona [data-step]");
    await expect(steps).toHaveCount(3);
    for (const n of [1, 2, 3, 1]) {
      await centerOn(steps.nth(n - 1));
      await expect(page.locator("#howStep")).toHaveText(String(n));
      await expect(steps.nth(n - 1)).toHaveClass(cls("is-active"));
      for (const other of [1, 2, 3].filter((x) => x !== n)) await expect(steps.nth(other - 1)).not.toHaveClass(cls("is-active"));
    }
  });

  test("editor vivo: nombre, recompensa y visitas alimentan la vista previa", async ({ page, openLanding, press }) => {
    await openLanding();
    await centerOn(page.locator("#edPreview"));
    const name = page.locator("#edName");
    await name.fill("Café Aurora");
    await expect(page.locator("#pvName")).toHaveText("Café Aurora");
    await name.fill("   ");
    await expect(page.locator("#pvName")).toHaveText("Tu negocio");

    await page.locator("#edReward").fill("Café Americano gratis");
    await expect(page.locator("#pvReward")).toHaveText("Al completar 5: café Americano gratis");
    await expect(page.locator("#pvCount")).toHaveText("0/5");
    await expect(page.locator("#edVisits")).toHaveText("5");

    const plus = page.locator("#edPlus");
    const minus = page.locator("#edMinus");
    await press(plus);
    await press(plus);
    await expect(page.locator("#edVisits")).toHaveText("7");
    await expect(page.locator("#pvCount")).toHaveText("0/7");
    await expect(page.locator("#pvReward")).toHaveText("Al completar 7: café Americano gratis");

    for (let i = 0; i < 5; i++) await press(plus);
    await expect(page.locator("#edVisits")).toHaveText("12");
    await expect(plus).toBeDisabled();
    await expect(minus).toBeEnabled();

    for (let i = 0; i < 9; i++) await press(minus);
    await expect(page.locator("#edVisits")).toHaveText("3");
    await expect(minus).toBeDisabled();
    await expect(plus).toBeEnabled();
    await expect(page.locator("#pvCount")).toHaveText("0/3");

    await page.locator("#edReward").fill("");
    await expect(page.locator("#pvReward")).toHaveText("Al completar 3: tu recompensa");
  });

  test("selector de color: clic y flechas con vuelta", async ({ page, openLanding, press, isMobile }) => {
    await openLanding();
    await centerOn(page.locator("#edPreview"));
    const radios = page.locator('[role="radio"][data-c]');
    const count = await radios.count();
    expect(count).toBeGreaterThanOrEqual(3);
    const preview = page.locator("#edPreview");
    const checked = () => page.evaluate(() => [...document.querySelectorAll('[role="radio"][data-c]')].map((r) => r.getAttribute("aria-checked")));
    const colorOf = (i: number) => radios.nth(i).getAttribute("data-c");

    await press(radios.nth(1));
    await expect(preview).toHaveAttribute("data-c", (await colorOf(1))!);
    expect((await checked())[1]).toBe("true");
    expect((await checked()).filter((x) => x === "true")).toHaveLength(1);
    // Solo el elegido está en el orden de tabulación
    expect(await page.evaluate(() => [...document.querySelectorAll('[role="radio"][data-c]')].map((r) => (r as HTMLElement).tabIndex))).toEqual(
      Array.from({ length: count }, (_, i) => (i === 1 ? 0 : -1)),
    );

    test.skip(isMobile, "Las flechas del teclado se prueban en escritorio");
    await radios.nth(1).focus();
    await page.keyboard.press("ArrowRight");
    await expect(radios.nth(2)).toBeFocused();
    await expect(preview).toHaveAttribute("data-c", (await colorOf(2))!);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(radios.nth(count - 1)).toBeFocused(); // vuelta
    await expect(preview).toHaveAttribute("data-c", (await colorOf(count - 1))!);
    await page.keyboard.press("ArrowDown");
    await expect(radios.nth(0)).toBeFocused();
  });

  test("filas de clientes: tocar abre el motivo, una a la vez, y volver a tocar lo cierra", async ({ page, openLanding, press, hasTouch }) => {
    await openLanding();
    const rows = page.locator("#como-funciona table tbody tr");
    await expect(rows).toHaveCount(3);
    await centerOn(page.locator("#como-funciona table"));
    const why = (i: number) => rows.nth(i).locator("td").last().locator("span").nth(1);
    for (let i = 0; i < 3; i++) await expect(why(i)).toHaveCSS("opacity", "0");

    await press(rows.nth(0));
    await expect(why(0)).toHaveCSS("opacity", "1");
    await expect(why(0)).toHaveText("Le falta 1 corte");
    await press(rows.nth(1));
    await expect(why(1)).toHaveCSS("opacity", "1");
    await expect(why(0)).toHaveCSS("opacity", "0");
    await press(rows.nth(1));
    await expect(rows.nth(1)).not.toHaveClass(cls("is-open"));
    if (!hasTouch) {
      await page.mouse.move(1, 1); // sin hover, el motivo solo se ve con la fila abierta (con toque el :hover se queda pegado)
      await expect(why(1)).toHaveCSS("opacity", "0");
    }
    await press(rows.nth(2));
    await expect(why(2)).toHaveCSS("opacity", "1");
    await expect(why(2)).toHaveText("Hace 41 días que no viene");
    await expect(rows.nth(2)).toHaveClass(cls("is-open"));
    await expect(rows.nth(0)).not.toHaveClass(cls("is-open"));
  });
});
