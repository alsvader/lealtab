import { createClient } from "@supabase/supabase-js";
import { esCookieCliente, expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";
const CODIGO = "847291";

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
    if ((usuario.phone ?? "").replace(/^\+/, "") === "529931009901") await admin().auth.admin.deleteUser(usuario.id);
  }
}

async function negocioPublico() {
  const correo = `c1b-${Date.now()}@lealtab.test`;
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
    p_slug_base: "casa-codigo",
  });
  expect(alta.status, JSON.stringify(alta.body)).toBe(200);
  const config = await fetch(`${process.env.SUPABASE_URL}/rest/v1/tarjeta_config`, {
    method: "POST",
    headers: { ...servicio(), Prefer: "return=minimal" },
    body: JSON.stringify({ negocio_id: alta.body.id, recompensa: "un café", sellos_meta: 8, sello_bienvenida: true }),
  });
  expect(config.status).toBe(201);
  expect((await rpc("completar_alta", { p_user_id: creado.data.user!.id, p_version: "0.1.0", p_duracion_s: 1 })).status).toBe(200);
  return { correo, slug: alta.body.slug!, dueno: creado.data.user!.id };
}

async function limpiar(datos: { correo: string; dueno: string }) {
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(datos.correo)}`, {
    method: "DELETE",
    headers: servicio(),
  });
  await admin().auth.admin.deleteUser(datos.dueno);
  await borrarTelefono();
}

test("el código de prueba deja la cookie y crea la tarjeta", async ({ page }) => {
  await borrarTelefono();
  const datos = await negocioPublico();
  const llamadas: string[] = [];
  page.on("request", (peticion) => {
    const url = peticion.url();
    if (url.includes(":54321") || url.includes("supabase.co")) llamadas.push(url);
  });

  try {
    await page.goto(`/c/${datos.slug}/registro`);
    await page.getByLabel("Tu nombre").fill("Ana López");
    await page.getByLabel("Tu WhatsApp").fill("993 100 9901");
    await page.getByRole("checkbox", { name: "Acepto el aviso de privacidad" }).check();
    await page.getByRole("button", { name: "Enviarme el código" }).click();
    await expect(page.getByRole("heading", { name: "Escribe tu código" })).toBeVisible();
    await page.getByLabel("Código de 6 dígitos").fill(CODIGO);
    await page.getByRole("button", { name: "Crear mi tarjeta" }).click();

    const tarjeta = page.getByRole("article", { name: "Tu tarjeta está lista" });
    await expect(tarjeta).toBeVisible();
    await expect(tarjeta.getByText("1/8")).toBeVisible();
    await expect(tarjeta.getByText("Tu sello de bienvenida ya está aquí.")).toBeVisible();
    await expect(tarjeta.getByText("Hecho con LealTab")).toBeVisible();

    const cookies = await page.context().cookies();
    const cliente = cookies.filter((c) => esCookieCliente(c.name));
    expect(cliente.length).toBeGreaterThan(0);
    for (const c of cliente) {
      expect(c.httpOnly).toBe(true);
      expect(c.path).toBe("/c");
    }
    expect(llamadas).toEqual([]);
  } finally {
    await limpiar(datos);
  }
});
