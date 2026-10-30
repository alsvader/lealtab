import { createClient } from "@supabase/supabase-js";
import { esCookieCliente, expect, test } from "./fixtures";

const TELEFONO = "+529931009901";
const CODIGO = "847291";

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function cuerpo(respuesta: { status: () => number; text: () => Promise<string> }) {
  return { status: respuesta.status(), texto: await respuesta.text() };
}

async function borrarTelefono() {
  const cliente = admin();
  const { data } = await cliente.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const usuario of data.users) {
    const plano = (usuario.phone ?? "").replace(/^\+/, "");
    if (plano === "529931009901") await cliente.auth.admin.deleteUser(usuario.id);
  }
}

test("la respuesta es la misma si el teléfono existe o no, y el código deja la cookie", async ({ request }) => {
  await borrarTelefono();
  const nuevo = await cuerpo(await request.post("/c/api/auth/codigo", { data: { telefono: "9931008801" } }));
  const repetido = await cuerpo(await request.post("/c/api/auth/codigo", { data: { telefono: "9931008801" } }));
  const otro = await cuerpo(await request.post("/c/api/auth/codigo", { data: { telefono: "9931008802" } }));
  expect(nuevo.status).toBe(200);
  expect(repetido).toEqual(nuevo);
  expect(otro).toEqual(nuevo);

  expect((await request.post("/c/api/auth/codigo", { data: { telefono: TELEFONO } })).status()).toBe(200);
  const ver = await request.post("/c/api/auth/verificar", { data: { telefono: TELEFONO, codigo: CODIGO } });
  expect(ver.status()).toBe(200);
  const cookies = ver.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value);
  const cliente = cookies.filter((c) => esCookieCliente(c.split("=")[0]));
  expect(cliente.length).toBeGreaterThan(0);
  for (const c of cliente) {
    expect(c).toMatch(/HttpOnly/i);
    expect(c).toMatch(/Path=\/c/i);
  }
  await borrarTelefono();
});

test("un dueño no puede volverse cliente", async ({ request }) => {
  await borrarTelefono();
  const creado = await admin().auth.admin.createUser({
    email: `dueno-tel-${Date.now()}@lealtab.test`,
    password: "clave-valida-1",
    email_confirm: true,
    phone: TELEFONO,
    phone_confirm: true,
    app_metadata: { rol: "dueno" },
  });
  expect(creado.error).toBeNull();
  expect((await request.post("/c/api/auth/codigo", { data: { telefono: TELEFONO } })).status()).toBe(200);
  const ver = await request.post("/c/api/auth/verificar", { data: { telefono: TELEFONO, codigo: CODIGO } });
  expect(ver.status()).toBe(401);
  const despues = await admin().auth.admin.getUserById(creado.data.user!.id);
  expect(despues.data.user?.app_metadata?.rol).toBe("dueno");
  await admin().auth.admin.deleteUser(creado.data.user!.id);
});

test("la página de prueba no llama a Supabase", async ({ page }) => {
  const llamadas: string[] = [];
  page.on("request", (peticion) => {
    const url = peticion.url();
    if (url.includes(":54321") || url.includes("supabase.co")) llamadas.push(url);
  });
  const res = await page.goto("/c/prueba-auth");
  expect(res?.status()).toBe(200);
  await expect(page.getByLabel(/WhatsApp/)).toBeVisible();
  const manifest = await page.request.get("/c/prueba-auth/manifest.webmanifest");
  expect(manifest.status()).toBe(200);
  const cuerpo = await manifest.json();
  expect(cuerpo.scope).toBe("/c/prueba-auth");
  expect(cuerpo.start_url).toBe("/c/prueba-auth");
  expect(llamadas).toEqual([]);
});
