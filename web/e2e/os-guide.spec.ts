import { test, expect, cls } from "./fixtures";

const IPHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
const ANDROID_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36";

async function guide(page: import("@playwright/test").Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("li[data-os]")].map((li) => ({
      os: li.getAttribute("data-os"),
      cls: li.getAttribute("class") || "",
      tag: li.querySelector("strong span")?.textContent ?? null,
    })),
  );
}

test.describe("Guía 'Cómo se instala' por sistema operativo", () => {
  test("?os=ios marca iPhone y atenúa Android", async ({ page, openLanding }) => {
    await openLanding("?os=ios");
    const g = await guide(page);
    expect(g.find((x) => x.os === "ios")!.cls).toMatch(cls("is-mine"));
    expect(g.find((x) => x.os === "ios")!.tag).toBe("Estás en iPhone");
    expect(g.find((x) => x.os === "android")!.cls).toMatch(cls("is-dim"));
    expect(g.find((x) => x.os === "android")!.tag).toBeNull();
  });

  test("?os=android marca Android y atenúa iPhone", async ({ page, openLanding }) => {
    await openLanding("?os=android");
    const g = await guide(page);
    expect(g.find((x) => x.os === "android")!.cls).toMatch(cls("is-mine"));
    expect(g.find((x) => x.os === "android")!.tag).toBe("Estás en Android");
    expect(g.find((x) => x.os === "ios")!.cls).toMatch(cls("is-dim"));
  });

  test("?os=windows se ignora: queda lo que diga el user agent (igual que la v1.7)", async ({ page, openLanding }) => {
    await openLanding();
    const plain = await guide(page);
    await openLanding("?os=windows");
    expect(await guide(page)).toEqual(plain);
  });

  test("con el user agent real del proyecto (sin ?os=)", async ({ page, openLanding, browserName, isMobile }, testInfo) => {
    await openLanding();
    const g = await guide(page);
    const mine = g.filter((x) => x.cls.match(cls("is-mine"))).map((x) => x.os);
    const ua = await page.evaluate(() => navigator.userAgent);
    if (/iPhone/.test(ua)) expect(mine).toEqual(["ios"]);
    else if (/Android/.test(ua)) expect(mine).toEqual(["android"]);
    else expect(mine).toEqual([]);
    // Mobile Safari es iPhone y Mobile Chrome es Android; los de escritorio no marcan nada
    if (testInfo.project.name === "Mobile Safari") expect(mine).toEqual(["ios"]);
    if (testInfo.project.name === "Mobile Chrome") expect(mine).toEqual(["android"]);
    if (!isMobile) expect(mine).toEqual([]);
    expect(browserName).toBeTruthy();
  });

  test.describe("user agent de iPhone en escritorio", () => {
    test.use({ userAgent: IPHONE_UA });
    test("detecta iPhone", async ({ page, openLanding, isMobile }) => {
      test.skip(isMobile, "Ya cubierto por el user agent real del proyecto");
      await openLanding();
      const g = await guide(page);
      expect(g.filter((x) => x.cls.match(cls("is-mine"))).map((x) => x.os)).toEqual(["ios"]);
    });
  });

  test.describe("user agent de Android en escritorio", () => {
    test.use({ userAgent: ANDROID_UA });
    test("detecta Android", async ({ page, openLanding, isMobile }) => {
      test.skip(isMobile, "Ya cubierto por el user agent real del proyecto");
      await openLanding();
      const g = await guide(page);
      expect(g.filter((x) => x.cls.match(cls("is-mine"))).map((x) => x.os)).toEqual(["android"]);
    });
  });
});
