import { createClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";

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

async function negocioPublico() {
  const correo = `c1-${Date.now()}@lealtab.test`;
  const creado = await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true });
  expect(creado.error).toBeNull();
  const alta = await rpc("crear_negocio", {
    p_user_id: creado.data.user!.id,
    p_nombre: "Casa Registro",
    p_giro: "cafeteria",
    p_ciudad: "Villahermosa",
    p_whatsapp: "+529931009900",
    p_correo: correo,
    p_zona: "America/Mexico_City",
    p_logo_path: null,
    p_slug_base: "casa-registro",
  });
  expect(alta.status, JSON.stringify(alta.body)).toBe(200);
  const config = await fetch(`${process.env.SUPABASE_URL}/rest/v1/tarjeta_config`, {
    method: "POST",
    headers: { ...servicio(), Prefer: "return=minimal" },
    body: JSON.stringify({ negocio_id: alta.body.id, recompensa: "un café", sello_bienvenida: true }),
  });
  expect(config.status).toBe(201);
  const fin = await rpc("completar_alta", { p_user_id: creado.data.user!.id, p_version: "0.1.0", p_duracion_s: 1 });
  expect(fin.status).toBe(200);
  return { correo, slug: alta.body.slug!, dueno: creado.data.user!.id };
}

async function borrarTelefono(telefono: string) {
  const plano = telefono.replace(/^\+/, "");
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const usuario of data.users) {
    const suyo = (usuario.phone ?? "").replace(/^\+/, "");
    if (suyo === plano) await admin().auth.admin.deleteUser(usuario.id);
  }
}

async function limpiar(datos: { correo: string; dueno: string; telefonos: string[] }) {
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(datos.correo)}`, {
    method: "DELETE",
    headers: servicio(),
  });
  await admin().auth.admin.deleteUser(datos.dueno);
  for (const telefono of datos.telefonos) await borrarTelefono(telefono);
}

test("el paso 1 pide nombre, WhatsApp y la casilla, y sin casilla no envía", async ({ page }) => {
  const datos = await negocioPublico();
  const llamadas: string[] = [];
  let envios = 0;
  page.on("request", (peticion) => {
    const url = peticion.url();
    if (url.includes(":54321") || url.includes("supabase.co")) llamadas.push(url);
    if (peticion.method() === "POST" && url.includes("/c/api/auth/codigo")) envios += 1;
  });

  await page.goto(`/c/${datos.slug}/registro`);
  await expect(page.getByRole("heading", { name: "Junta sellos y gana un café" })).toBeVisible();
  await expect(page.getByLabel("Tu nombre")).toBeVisible();
  await expect(page.getByLabel("Tu WhatsApp")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Acepto el aviso de privacidad" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enviarme el código" })).toBeVisible();
  await expect(page.getByText("Hecho con LealTab")).toBeVisible();

  try {
    await page.getByLabel("Tu nombre").fill("Ana López");
    await page.getByLabel("Tu WhatsApp").fill("993 100 8811");
    await page.getByRole("button", { name: "Enviarme el código" }).click();
    await expect(page.locator("#registro-error")).toHaveText("Error: para continuar, acepta el aviso de privacidad.");
    expect(envios).toBe(0);
    expect(llamadas).toEqual([]);
  } finally {
    await limpiar({ ...datos, telefonos: [] });
  }
});

test("la pantalla siguiente es la misma si el teléfono ya existía o no", async ({ page }) => {
  const datos = await negocioPublico();
  const existente = `993100${String(Date.now()).slice(-4)}`;
  const nuevo = `993200${String(Date.now()).slice(-4)}`;
  expect((await admin().auth.admin.createUser({ phone: `+52${existente}`, phone_confirm: true })).error).toBeNull();
  let envios = 0;
  page.on("request", (peticion) => {
    if (peticion.method() === "POST" && peticion.url().includes("/c/api/auth/codigo")) envios += 1;
  });

  async function avanzar(nacional: string) {
    const antes = envios;
    await page.goto(`/c/${datos.slug}/registro`);
    await page.getByLabel("Tu nombre").fill("Ana López");
    await page.getByLabel("Tu WhatsApp").fill(nacional);
    await page.getByRole("checkbox", { name: "Acepto el aviso de privacidad" }).check();
    await page.getByRole("button", { name: "Enviarme el código" }).click();
    await expect(page.getByRole("heading", { name: "Escribe tu código" })).toBeVisible();
    expect(envios).toBe(antes + 1);
    const texto = await page.locator("main").innerText();
    expect(texto.toLowerCase()).not.toContain("ya tienes");
    return texto.replaceAll(nacional.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"), "{tel}");
  }

  try {
    const primera = await avanzar(existente);
    const segunda = await avanzar(nuevo);
    expect(segunda).toBe(primera);
  } finally {
    await limpiar({ ...datos, telefonos: [`+52${existente}`, `+52${nuevo}`] });
  }
});
