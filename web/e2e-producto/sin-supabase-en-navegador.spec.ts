import { esCookieCliente, esCookieDueno, expect, test } from "./fixtures";

// RNF-STK-10 y ADR-003 §2.4: el navegador nunca habla con Supabase. Se observa toda petición
// (documentos, scripts, fetch, imágenes) durante la navegación, con las dos sesiones abiertas.
const PROHIBIDO = /(127\.0\.0\.1|localhost):54321|supabase/i;

test("el navegador no hace ninguna petición a Supabase al navegar por /, /c y /panel", async ({
  page,
  context,
  abrirSesion,
}, info) => {
  await abrirSesion("cliente");
  await abrirSesion("dueno");
  const conSesion = (await context.cookies()).some((c) => esCookieCliente(c.name) || esCookieDueno(c.name));
  if (info.project.name === "webkit" || info.project.name === "Mobile Safari") {
    test.skip(!conSesion, "WebKit no guarda cookies Secure por http://localhost");
  }

  const urls: string[] = [];
  page.on("request", (req) => urls.push(req.url()));
  for (const ruta of ["/", "/c", "/panel", "/aviso-de-privacidad"]) {
    await page.goto(ruta, { waitUntil: "networkidle" });
  }
  expect(urls.length).toBeGreaterThan(4);
  expect(urls.filter((u) => PROHIBIDO.test(u))).toEqual([]);
  // Todo va al origen de la app.
  const origen = new URL(page.url()).origin;
  expect(urls.filter((u) => !u.startsWith(origen) && !u.startsWith("data:") && !u.startsWith("blob:"))).toEqual([]);
});

test("la ruta de desarrollo y la API del producto responden desde el servidor: el navegador ve solo el origen de la app", async ({
  request,
}) => {
  const res = await request.post("/c/api/auth/dev-sesion", { data: { usuario: "jefe@empresa.com" } });
  expect(res.status()).toBe(400); // local, pero solo usuarios de la semilla
  expect(res.url().startsWith("http://localhost:")).toBe(true);
});
