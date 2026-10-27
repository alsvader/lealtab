import { createClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";

function correoNuevo() {
  return `t5-${Date.now()}-${Math.floor(Math.random() * 1000)}@lealtab.test`;
}

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function negocioDePrueba(request: { post: (url: string, opts: { data?: unknown; multipart?: Record<string, string> }) => Promise<{ status: () => number; json: () => Promise<{ slug: string }> }> }) {
  const correo = correoNuevo();
  expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
  expect((await request.post("/panel/api/auth/contrasena", { data: { correo, contrasena: CLAVE } })).status()).toBe(200);
  const creado = await request.post("/panel/api/negocio", {
    multipart: {
      nombre: `Casa ${Date.now()}`,
      giro: "cafeteria",
      ciudad: "Villahermosa",
      whatsapp: "9931112244",
      zona: "America/Mexico_City",
    },
  });
  expect(creado.status()).toBe(200);
  return { correo, slug: (await creado.json()).slug };
}

async function limpiar(correo: string) {
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      apikey: process.env.SUPABASE_SECRET_KEY!,
    },
  });
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of data.users.filter((u) => u.email === correo)) await admin().auth.admin.deleteUser(u.id);
}

async function eventos(correo: string) {
  const filas = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}&select=id`,
      { headers: { Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`, apikey: process.env.SUPABASE_SECRET_KEY! } },
    )
  ).json()) as { id: string }[];
  const lista = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/evento_uso?negocio_id=eq.${filas[0].id}&nombre=eq.tarjeta_configurada&select=id`,
      { headers: { Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`, apikey: process.env.SUPABASE_SECRET_KEY! } },
    )
  ).json()) as { id: number }[];
  return lista.length;
}

test.describe("tarjeta N3", () => {
  test("la vista previa muestra 1/N y la bienvenida solo con el interruptor, y no hay color", async ({ page }) => {
    await page.goto("/panel/tarjeta");
    await expect(page.getByText("1/8")).toBeVisible();
    await expect(page.getByText("Tu sello de bienvenida ya está aquí")).toBeVisible();
    await expect(page.getByLabel(/color/i)).toHaveCount(0);
    await page.getByRole("switch").click();
    await expect(page.getByText("1/8")).toHaveCount(0);
    await expect(page.getByText("Tu sello de bienvenida ya está aquí")).toHaveCount(0);
    await expect(page.getByText("0/8")).toBeVisible();
  });

  test("guardar dos veces no duplica tarjeta_configurada", async ({ request }) => {
    const { correo } = await negocioDePrueba(request);
    const cuerpo = { sellos: 8, recompensa: "Un café", bienvenida: true };
    const primera = await request.post("/panel/api/tarjeta", { data: cuerpo });
    const segunda = await request.post("/panel/api/tarjeta", { data: { ...cuerpo, sellos: 6, bienvenida: false } });
    expect(primera.status()).toBe(200);
    expect(await primera.json()).toMatchObject({ ok: true, primera: true });
    expect(segunda.status()).toBe(200);
    expect(await segunda.json()).toMatchObject({ ok: true, primera: false });
    expect(await eventos(correo)).toBe(1);
    await limpiar(correo);
  });
});
