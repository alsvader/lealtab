import { esCookieCliente, esCookieDueno, expect, test } from "./fixtures";

// Las cookies llevan Secure (LT_COOKIE_SECURE=1). Chromium acepta Secure sobre http://localhost;
// WebKit (Safari) no: no la guarda ni la envía por HTTP. Por eso las pruebas que dependen de
// que el navegador devuelva la cookie se saltan en WebKit (se prueban con HTTPS en el piloto: RNF-PWA-07).
// Verificado (Playwright 1.61.1): WebKit sí la guarda, pero no la envía de vuelta por http://localhost.
const sinSecureEnWebkit = (name: string) => name === "webkit" || name === "Mobile Safari";

function setCookies(res: { headersArray(): { name: string; value: string }[] }) {
  return res.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value);
}

test.describe("atributos de las cookies de sesión", () => {
  test("lt-cliente sale HttpOnly, Secure, SameSite=Lax, Path=/c y Max-Age de 400 días", async ({ abrirSesion }) => {
    const res = await abrirSesion("cliente");
    const cookies = setCookies(res).filter((c) => esCookieCliente(c.split("=")[0]));
    console.log("Set-Cookie (cliente, sin valor):", cookies.map((c) => c.replace(/=[^;]*/, "=<valor>")));
    expect(cookies.length).toBeGreaterThan(0);
    for (const c of cookies) {
      expect(c).toMatch(/;\s*HttpOnly/i);
      expect(c).toMatch(/;\s*Secure/i);
      expect(c).toMatch(/;\s*SameSite=Lax/i);
      expect(c).toMatch(/;\s*Path=\/c(;|$)/i);
      expect(c).toMatch(/;\s*Max-Age=34560000/i);
    }
    // Nada más que las cookies de sesión del rol.
    expect(setCookies(res).every((c) => esCookieCliente(c.split("=")[0]))).toBe(true);
    expect(res.headers()["cache-control"]).toContain("no-store");
  });

  test("lt-dueno sale HttpOnly, Secure, SameSite=Lax, Path=/panel y Max-Age de 30 días", async ({ abrirSesion }) => {
    const res = await abrirSesion("dueno");
    const cookies = setCookies(res).filter((c) => esCookieDueno(c.split("=")[0]));
    console.log("Set-Cookie (dueño, sin valor):", cookies.map((c) => c.replace(/=[^;]*/, "=<valor>")));
    expect(cookies.length).toBeGreaterThan(0);
    for (const c of cookies) {
      expect(c).toMatch(/;\s*HttpOnly/i);
      expect(c).toMatch(/;\s*Secure/i);
      expect(c).toMatch(/;\s*SameSite=Lax/i);
      expect(c).toMatch(/;\s*Path=\/panel(;|$)/i);
      expect(c).toMatch(/;\s*Max-Age=2592000/i);
    }
    expect(setCookies(res).every((c) => esCookieDueno(c.split("=")[0]))).toBe(true);
  });

  test("el navegador las guarda con el mismo Path y JavaScript no las ve", async ({ page, context, abrirSesion }, info) => {
    test.skip(sinSecureEnWebkit(info.project.name), "WebKit no guarda cookies Secure por http://localhost");
    await abrirSesion("cliente");
    await abrirSesion("dueno");
    const guardadas = await context.cookies();
    const cli = guardadas.filter((c) => esCookieCliente(c.name));
    const due = guardadas.filter((c) => esCookieDueno(c.name));
    expect(cli.length).toBeGreaterThan(0);
    expect(due.length).toBeGreaterThan(0);
    for (const c of cli) expect(c).toMatchObject({ path: "/c", httpOnly: true, secure: true, sameSite: "Lax" });
    for (const c of due) expect(c).toMatchObject({ path: "/panel", httpOnly: true, secure: true, sameSite: "Lax" });
    await page.goto("/c");
    expect(await page.evaluate(() => document.cookie)).not.toContain("lt-");
  });
});

test.describe("aislamiento de cookies por ruta", () => {
  test("lt-cliente no viaja a /panel, lt-dueno no viaja a /c y ninguna a la landing; conviven sin pisarse", async ({
    page,
    abrirSesion,
  }, info) => {
    test.skip(sinSecureEnWebkit(info.project.name), "WebKit no envía cookies Secure por http://localhost");
    await abrirSesion("cliente");
    await abrirSesion("dueno");

    const vistas = new Map<string, string>(); // ruta de la navegación → cabecera cookie
    page.on("request", async (req) => {
      if (req.resourceType() !== "document") return;
      const { cookie } = await req.allHeaders();
      vistas.set(new URL(req.url()).pathname, cookie ?? "");
    });
    for (const ruta of ["/c", "/panel", "/"]) {
      const res = await page.goto(ruta);
      expect(res?.status()).toBe(200);
    }
    await expect.poll(() => vistas.size).toBe(3);

    expect(vistas.get("/c")).toMatch(/lt-cliente/);
    expect(vistas.get("/c")).not.toMatch(/lt-dueno/);
    expect(vistas.get("/panel")).toMatch(/lt-dueno/);
    expect(vistas.get("/panel")).not.toMatch(/lt-cliente/);
    expect(vistas.get("/")).toBe("");
  });

  test("las dos sesiones siguen vivas tras visitar ambas áreas (ninguna pisa a la otra)", async ({ context, page, abrirSesion }, info) => {
    test.skip(sinSecureEnWebkit(info.project.name), "WebKit no guarda cookies Secure por http://localhost");
    await abrirSesion("dueno");
    await abrirSesion("cliente");
    await page.goto("/panel");
    await page.goto("/c");
    const nombres = (await context.cookies()).map((c) => c.name);
    expect(nombres.some(esCookieCliente)).toBe(true);
    expect(nombres.some(esCookieDueno)).toBe(true);
  });

  test("la sesión del dueño no abre la del cliente: una cookie de dueño en /c no existe (Path) y la de cliente no está en /panel", async ({
    context,
    abrirSesion,
  }, info) => {
    test.skip(sinSecureEnWebkit(info.project.name), "WebKit no guarda cookies Secure por http://localhost");
    await abrirSesion("dueno");
    expect((await context.cookies("http://localhost:3140/c")).some((c) => esCookieDueno(c.name))).toBe(false);
    await abrirSesion("cliente");
    expect((await context.cookies("http://localhost:3140/panel")).some((c) => esCookieCliente(c.name))).toBe(false);
    expect((await context.cookies("http://localhost:3140/")).filter((c) => c.name.startsWith("lt-"))).toEqual([]);
  });
});

test.describe("proxy y rutas fuera del producto", () => {
  test("la landing y /api/salud no reciben Set-Cookie, ni con sesiones abiertas", async ({ request, abrirSesion }) => {
    await abrirSesion("cliente");
    await abrirSesion("dueno");
    for (const ruta of ["/", "/api/salud", "/robots.txt", "/sitemap.xml", "/aviso-de-privacidad"]) {
      const res = await request.get(ruta);
      expect(res.status(), ruta).toBe(200);
      expect(setCookies(res), ruta).toEqual([]);
    }
  });

  test("una cookie de sesión basura no tira la página (el proxy la ignora)", async ({ context, page }, info) => {
    test.skip(sinSecureEnWebkit(info.project.name), "WebKit no envía cookies Secure por http://localhost");
    await context.addCookies([
      { name: "lt-cliente", value: "basura", url: "http://localhost:3140/c", httpOnly: true, secure: true, sameSite: "Lax" },
      { name: "lt-dueno", value: "base64-basura", url: "http://localhost:3140/panel", httpOnly: true, secure: true, sameSite: "Lax" },
    ]);
    for (const ruta of ["/c", "/panel"]) {
      const res = await page.goto(ruta);
      expect(res?.status(), ruta).toBe(200);
    }
  });

  test("una sesión válida pasa por el proxy y la página responde 200 con cabeceras de seguridad del producto", async ({
    page,
    abrirSesion,
  }, info) => {
    test.skip(sinSecureEnWebkit(info.project.name), "WebKit no envía cookies Secure por http://localhost");
    await abrirSesion("cliente");
    const res = await page.goto("/c");
    expect(res?.status()).toBe(200);
    const h = res!.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["content-security-policy"]).toContain("connect-src 'self'");
    expect(h["content-security-policy"]).not.toContain("script-src");
    // La landing no lleva esas cabeceras.
    const landing = await page.goto("/");
    expect(landing!.headers()["content-security-policy"]).toBeUndefined();
  });
});
