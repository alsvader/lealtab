import { test, expect, cls, centerOn } from "./fixtures";

test.describe("Menú móvil (a 390 px)", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("abre, bloquea el scroll, cierra con Escape y con un enlace", async ({ page, press, openLanding, browserName }) => {
    await openLanding();
    const toggle = page.locator("#navToggle");
    const drawer = page.locator("#navDrawer");

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toHaveAttribute("aria-label", "Abrir menú");
    await expect(drawer).toBeHidden();

    await press(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("aria-label", "Cerrar menú");
    await expect(drawer).toBeVisible();
    await expect(page.locator("body")).toHaveClass(cls("nav-open"));
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    // El foco pasa al panel
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("navDrawer");

    // Escape cierra y devuelve el foco al botón (el teclado físico no aplica en táctil real, pero sí en la emulación)
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(drawer).toBeHidden();
    await expect(page.locator("body")).not.toHaveClass(cls("nav-open"));
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("navToggle");

    // Un enlace del menú cierra el panel y lleva a la sección
    await press(toggle);
    await expect(drawer).toBeVisible();
    await press(drawer.locator('a[href="#precios"]'));
    await expect(drawer).toBeHidden();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#precios$/);
    await expect.poll(() => page.evaluate(() => Math.round(document.getElementById("precios")!.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(120);
    expect(browserName).toBeTruthy();
  });

  test("el CTA del panel abre WhatsApp y el panel se cierra al pasar a escritorio", async ({ page, press, openLanding, isMobile }) => {
    await openLanding();
    const toggle = page.locator("#navToggle");
    const drawer = page.locator("#navDrawer");
    await press(toggle);
    await expect(drawer.locator("a.btn-cta, a[class*=btn-cta]").first()).toHaveAttribute("href", /wa\.me\/525588063606/);

    test.skip(isMobile, "El cambio de tamaño de ventana solo se prueba en escritorio");
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(toggle).toBeHidden();
    await expect(drawer).toBeHidden();
    await expect(page.locator("body")).not.toHaveClass(cls("nav-open"));
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeVisible();
  });
});

test.describe("Navegación de escritorio", () => {
  test.skip(({ isMobile }) => isMobile, "Los enlaces de escritorio no existen en móvil");
  test.use({ viewport: { width: 1280, height: 800 } });

  test("el menú cambia en 1024 px", async ({ page, openLanding }) => {
    await openLanding();
    await page.setViewportSize({ width: 1023, height: 800 });
    await expect(page.locator("#navToggle")).toBeVisible();
    await expect(page.locator('nav[aria-label="Principal"]')).toBeHidden();
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator("#navToggle")).toBeHidden();
    await expect(page.locator('nav[aria-label="Principal"]')).toBeVisible();
  });

  test("marca la sección activa con aria-current al recorrer la página", async ({ page, openLanding }) => {
    await openLanding();
    const links = page.locator('nav[aria-label="Principal"] a[href^="#"]');
    const current = () => page.evaluate(() => [...document.querySelectorAll('nav[aria-label="Principal"] a[aria-current="true"]')].map((a) => a.getAttribute("href")));
    for (const id of ["como-funciona", "precios"]) {
      await page.evaluate((id) => {
        const el = document.getElementById(id)!;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 40, behavior: "instant" });
      }, id);
      await expect.poll(current).toEqual([`#${id}`]);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(current).toEqual([]);
    expect(await links.count()).toBeGreaterThanOrEqual(3);
  });

  test("los enlaces llevan a su sección y el logo regresa al inicio", async ({ page, openLanding }) => {
    await openLanding();
    await page.locator('nav[aria-label="Principal"] a[href="#precios"]').click();
    await expect(page).toHaveURL(/#precios$/);
    await expect.poll(() => page.evaluate(() => Math.round(document.getElementById("precios")!.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(120);
    await page.locator("header a").first().click();
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 5000 }).toBeLessThanOrEqual(2);
  });

  test("el CTA del menú entra cuando sale el del hero", async ({ page, openLanding }) => {
    await openLanding();
    const navCta = page.locator("header .btn-cta, header [class*=btn-cta]").filter({ hasText: "Crea tu tarjeta gratis" }).first();
    await expect(navCta).toHaveCSS("opacity", "0");
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: "instant" }));
    await expect(navCta).toHaveCSS("opacity", "1");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(navCta).toHaveCSS("opacity", "0");
  });
});

test.describe("Accesibilidad por teclado", () => {
  test.skip(({ isMobile }) => isMobile, "Teclado: escritorio");

  test("el primer Tab abre 'Saltar al contenido' y lleva al contenido", async ({ page, openLanding, browserName }) => {
    await openLanding();
    // Safari (y su WebKit en macOS) solo enfoca enlaces con Opción+Tab, salvo que se active la preferencia
    await page.keyboard.press(browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab");
    const skip = page.getByRole("link", { name: "Saltar al contenido" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contenido$/);
    await expect(page.locator("main#contenido")).toBeFocused();
  });

  test("al centrar un bloque no hay desplazamiento horizontal", async ({ page, openLanding }) => {
    await openLanding();
    await centerOn(page.locator("#precios"));
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });
});
