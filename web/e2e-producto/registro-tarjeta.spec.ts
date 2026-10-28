import { createClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";
const CODIGO = "847291";
const TEL = "9931009901";

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function servicio() {
  return {
    Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
    apikey: process.env.SUPABASE_SECRET_KEY!,
    "Content-Type": "application/json",
  };
}

async function rpc(nombre: string, body: unknown) {
  const respuesta = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/${nombre}`, {
    method: "POST",
    headers: { ...servicio(), "Content-Profile": "servidor" },
    body: JSON.stringify(body),
  });
  return { status: respuesta.status, body: (await respuesta.json()) as { id?: string; slug?: string } };
}

async function borrarTelefono() {
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const usuario of data.users) {
    if ((usuario.phone ?? "").replace(/^\+/, "") === `52${TEL}`) await admin().auth.admin.deleteUser(usuario.id);
  }
}

test("C0 lista o vacío, C3 rota el QR y C4 aparece con la meta llena", async ({ page }) => {
  await borrarTelefono();
  const correo = `c1d-${Date.now()}@lealtab.test`;
  const creado = await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true });
  expect(creado.error).toBeNull();
  const alta = await rpc("crear_negocio", {
    p_user_id: creado.data.user!.id,
    p_nombre: "Casa Alfa",
    p_giro: "cafeteria",
    p_ciudad: "Villahermosa",
    p_whatsapp: "+529931009900",
    p_correo: correo,
    p_zona: "America/Mexico_City",
    p_logo_path: null,
    p_slug_base: "casa-tarjeta",
  });
  expect(alta.status).toBe(200);
  expect((await fetch(`${process.env.SUPABASE_URL}/rest/v1/tarjeta_config`, {
    method: "POST",
    headers: { ...servicio(), Prefer: "return=minimal" },
    body: JSON.stringify({ negocio_id: alta.body.id, recompensa: "corte gratis", sellos_meta: 8, sello_bienvenida: true }),
  })).status).toBe(201);
  expect((await rpc("completar_alta", { p_user_id: creado.data.user!.id, p_version: "0.1.0", p_duracion_s: 1 })).status).toBe(200);

  const ajenas: string[] = [];
  page.on("request", (peticion) => {
    const url = peticion.url();
    if (url.includes(":54321") || url.includes("supabase.co")) ajenas.push(url);
  });

  try {
    await page.goto("/c");
    await expect(page.getByRole("heading", { name: "Mis tarjetas" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Recupera tus tarjetas" })).toBeVisible();
    await expect(page.getByText("Aún no tienes tarjetas")).toHaveCount(0);

    await page.goto(`/c/${alta.body.slug}/registro`);
    await page.getByLabel("Tu nombre").fill("Ana López");
    await page.getByLabel("Tu WhatsApp").fill(TEL);
    await page.getByRole("checkbox", { name: "Acepto el aviso de privacidad" }).check();
    await page.getByRole("button", { name: "Enviarme el código" }).click();
    await page.getByLabel("Código de 6 dígitos").fill(CODIGO);
    await page.getByRole("button", { name: "Crear mi tarjeta" }).click();
    await expect(page.getByText("Tu sello de bienvenida ya está aquí.")).toBeVisible();

    await page.goto("/c");
    await expect(page.getByRole("link", { name: /Casa Alfa/ })).toBeVisible();
    await expect(page.getByText("corte gratis · faltan 7")).toBeVisible();

    await page.clock.install({ time: new Date("2026-10-27T18:00:00Z") });
    await page.goto(`/c/${alta.body.slug}`);
    await expect(page.getByText("1/8")).toBeVisible();
    await expect(page.getByText("Te faltan 7 visitas para tu corte gratis.")).toBeVisible();
    await expect(page.getByText("1 sello por día").first()).toBeVisible();
    await expect(page.getByText("Hecho con LealTab").last()).toBeVisible();
    const qr = page.locator("[data-qr]");
    await expect.poll(async () => qr.getAttribute("data-qr")).not.toBe("");
    const primero = await qr.getAttribute("data-qr");
    const antes = ajenas.length;
    await page.clock.fastForward(60_000);
    await expect.poll(async () => qr.getAttribute("data-qr")).not.toBe(primero);
    expect(ajenas.length).toBe(antes);

    const tarjetaId = (primero ?? "").split("|")[0];
    expect((await fetch(`${process.env.SUPABASE_URL}/rest/v1/tarjeta_cliente?id=eq.${tarjetaId}`, {
      method: "PATCH",
      headers: { ...servicio(), Prefer: "return=minimal" },
      body: JSON.stringify({ sellos: 8 }),
    })).status).toBe(204);
    await page.goto(`/c/${alta.body.slug}`);
    await expect(page.getByRole("heading", { name: "¡Tu corte gratis está listo!" })).toBeVisible();
    await expect(page.getByText("8/8")).toBeVisible();
    await expect(page.getByText("Recompensa lista")).toBeVisible();

    await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?id=eq.${alta.body.id}`, { method: "DELETE", headers: servicio() });
    await page.goto("/c");
    await expect(page.getByRole("heading", { name: "Aún no tienes tarjetas" })).toBeVisible();
    expect(ajenas).toEqual([]);
  } finally {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}`, { method: "DELETE", headers: servicio() });
    await admin().auth.admin.deleteUser(creado.data.user!.id);
    await borrarTelefono();
  }
});
