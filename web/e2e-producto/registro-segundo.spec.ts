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

async function negocio(nombre: string, base: string) {
  const correo = `c1c-${base}-${Date.now()}@lealtab.test`;
  const creado = await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true });
  expect(creado.error).toBeNull();
  const alta = await rpc("crear_negocio", {
    p_user_id: creado.data.user!.id,
    p_nombre: nombre,
    p_giro: "cafeteria",
    p_ciudad: "Villahermosa",
    p_whatsapp: "+529931009900",
    p_correo: correo,
    p_zona: "America/Mexico_City",
    p_logo_path: null,
    p_slug_base: base,
  });
  expect(alta.status, JSON.stringify(alta.body)).toBe(200);
  const config = await fetch(`${process.env.SUPABASE_URL}/rest/v1/tarjeta_config`, {
    method: "POST",
    headers: { ...servicio(), Prefer: "return=minimal" },
    body: JSON.stringify({ negocio_id: alta.body.id, recompensa: "un café", sellos_meta: 8, sello_bienvenida: true }),
  });
  expect(config.status).toBe(201);
  expect((await rpc("completar_alta", { p_user_id: creado.data.user!.id, p_version: "0.1.0", p_duracion_s: 1 })).status).toBe(200);
  return { correo, slug: alta.body.slug!, dueno: creado.data.user!.id, id: alta.body.id! };
}

async function nombresPorSlug() {
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  const usuario = data.users.find((u) => (u.phone ?? "").replace(/^\+/, "") === `52${TEL}`);
  expect(usuario).toBeTruthy();
  const identidad = (await (
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/identidad?auth_user_id=eq.${usuario!.id}&select=id`, { headers: servicio() })
  ).json()) as { id: string }[];
  const fichas = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/cliente_negocio?identidad_id=eq.${identidad[0].id}&select=nombre,negocio_id`,
      { headers: servicio() },
    )
  ).json()) as { nombre: string; negocio_id: string }[];
  const negocios = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/negocio?id=in.(${fichas.map((f) => f.negocio_id).join(",")})&select=id,slug`,
      { headers: servicio() },
    )
  ).json()) as { id: string; slug: string }[];
  const slugDe = new Map(negocios.map((n) => [n.id, n.slug]));
  return new Map(fichas.map((f) => [slugDe.get(f.negocio_id), f.nombre]));
}

async function limpiar(datos: { correo: string; dueno: string }[]) {
  for (const dato of datos) {
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(dato.correo)}`, {
      method: "DELETE",
      headers: servicio(),
    });
    await admin().auth.admin.deleteUser(dato.dueno);
  }
  await borrarTelefono();
}

test("con sesión el segundo negocio no pide código ni pisa el nombre, y sin sesión recuperar devuelve las tarjetas", async ({ page, browser }) => {
  await borrarTelefono();
  const alfa = await negocio("Casa Alfa", "casa-alfa");
  const beta = await negocio("Casa Beta", "casa-beta");
  const llamadas: string[] = [];
  let codigos = 0;
  page.on("request", (peticion) => {
    const url = peticion.url();
    if (url.includes(":54321") || url.includes("supabase.co")) llamadas.push(url);
    if (peticion.method() === "POST" && url.includes("/c/api/auth/codigo")) codigos += 1;
  });

  try {
    await page.goto(`/c/${alfa.slug}/registro`);
    await page.getByLabel("Tu nombre").fill("Ana López");
    await page.getByLabel("Tu WhatsApp").fill(TEL);
    await page.getByRole("checkbox", { name: "Acepto el aviso de privacidad" }).check();
    await page.getByRole("button", { name: "Enviarme el código" }).click();
    await page.getByLabel("Código de 6 dígitos").fill(CODIGO);
    await page.getByRole("button", { name: "Crear mi tarjeta" }).click();
    await expect(page.getByText("Tu sello de bienvenida ya está aquí.")).toBeVisible();

    codigos = 0;
    await page.goto(`/c/${beta.slug}/registro`);
    await expect(page.getByRole("heading", { name: "Agrega tu tarjeta de Casa Beta" })).toBeVisible();
    await expect(page.getByText("Entraste con el número que termina en 9901.")).toBeVisible();
    await expect(page.locator("#segundo-nombre")).toHaveValue("Ana López");
    await expect(page.getByRole("checkbox")).not.toBeChecked();
    await expect(page.getByLabel("Código de 6 dígitos")).toHaveCount(0);
    await page.locator("#segundo-nombre").fill("Luis Vega");
    await page.getByRole("checkbox", { name: "Acepto el aviso de privacidad de Casa Beta" }).check();
    await page.getByRole("button", { name: "Agregar mi tarjeta" }).click();
    await expect(page.getByRole("heading", { name: "Listo. Tu sello de bienvenida ya está aquí." })).toBeVisible();
    expect(codigos).toBe(0);

    const guardados = await nombresPorSlug();
    expect(guardados.get(alfa.slug)).toBe("Ana López");
    expect(guardados.get(beta.slug)).toBe("Luis Vega");

    await page.goto(`/c/${alfa.slug}/registro`);
    await expect(page.getByRole("heading", { name: "Ya tienes tu tarjeta de Casa Alfa." })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enviarme el código" })).toHaveCount(0);

    const contexto = await browser.newContext();
    const limpia = await contexto.newPage();
    const ajenas: string[] = [];
    limpia.on("request", (peticion) => {
      const url = peticion.url();
      if (url.includes(":54321") || url.includes("supabase.co")) ajenas.push(url);
    });
    await limpia.goto(`/c/recuperar`);
    await expect(limpia.getByRole("heading", { name: "Recupera tus tarjetas" })).toBeVisible();
    await limpia.getByLabel("Tu WhatsApp").fill(TEL);
    await limpia.getByRole("button", { name: "Enviarme el código" }).click();
    await limpia.getByLabel("Código de 6 dígitos").fill(CODIGO);
    await limpia.getByRole("button", { name: "Entrar" }).click();
    await expect(limpia.getByRole("heading", { name: "Listo, aquí están tus tarjetas." })).toBeVisible();
    await expect(limpia.getByText("Casa Alfa")).toBeVisible();
    await expect(limpia.getByText("Casa Beta")).toBeVisible();
    expect(ajenas).toEqual([]);
    await contexto.close();
    expect(llamadas).toEqual([]);
  } finally {
    await limpiar([alfa, beta]);
  }
});
