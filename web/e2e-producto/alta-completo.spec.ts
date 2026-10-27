import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const MAILPIT = "http://127.0.0.1:54324";

function admin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function servicio() {
  return {
    Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
    apikey: process.env.SUPABASE_SECRET_KEY!,
  };
}

async function codigoEnMailpit(correo: string): Promise<string> {
  const hasta = Date.now() + 20_000;
  while (Date.now() < hasta) {
    const lista = await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:${correo}`)}`);
    if (lista.ok) {
      const json = (await lista.json()) as { messages?: { ID: string }[] };
      const id = json.messages?.[0]?.ID;
      if (id) {
        const mensaje = await fetch(`${MAILPIT}/api/v1/message/${id}`);
        const data = (await mensaje.json()) as { Text?: string; HTML?: string };
        const encontrado = `${data.Text ?? ""}\n${data.HTML ?? ""}`.match(/\b(\d{6})\b/);
        if (encontrado) return encontrado[1];
      }
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Mailpit no recibió un código de 6 dígitos para ${correo}`);
}

test("un alta completo, de N1 a N4, pasa con el código de Mailpit", async ({ page }, info) => {
  test.skip(
    info.project.name === "webkit" || info.project.name === "Mobile Safari",
    "WebKit no guarda cookies Secure por http://localhost",
  );
  test.setTimeout(60_000);
  const marca = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const correo = `t7-${marca}@lealtab.test`;
  const negocio = `Casa Demo ${marca}`;
  const llamadasSupabase: string[] = [];
  page.on("request", (peticion) => {
    const url = peticion.url();
    if (url.includes(":54321") || url.includes("supabase.co")) llamadasSupabase.push(url);
  });

  await page.goto("/panel/alta");
  await expect(page.getByRole("heading", { name: "Empieza gratis hoy" })).toBeVisible();
  await page.getByLabel("Tu nombre").fill("Ana Dueña");
  await page.getByLabel(/^Correo/).fill(correo);
  await page.getByLabel(/WhatsApp del negocio/).fill("9931113344");
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page.getByText("Te enviamos un código a tu correo")).toBeVisible();

  const codigo = await codigoEnMailpit(correo);
  await page.getByLabel("Código").fill(codigo);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/panel\/negocio$/);
  await expect(page.getByRole("heading", { name: "Cuéntanos de tu negocio" })).toBeVisible();
  await page.getByLabel("Nombre del negocio").fill(negocio);
  await expect(page.getByText("CD", { exact: true })).toBeVisible();
  await page.getByText("Cafetería", { exact: true }).click();
  await page.getByLabel("Ciudad").fill("Villahermosa");
  await page.getByLabel(/WhatsApp del negocio/).fill("9931113344");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page).toHaveURL(/\/panel\/tarjeta$/);
  await expect(page.getByText("1/8")).toBeVisible();
  await expect(page.getByText("Tu sello de bienvenida ya está aquí")).toBeVisible();
  await page.getByRole("button", { name: "Quitar un sello" }).click();
  await expect(page.getByText("1/7")).toBeVisible();
  await page.getByRole("switch", { name: /Sello de bienvenida/ }).click();
  await expect(page.getByText("0/7")).toBeVisible();
  await expect(page.getByText("Tu sello de bienvenida ya está aquí")).toHaveCount(0);
  await page.getByRole("switch", { name: /Sello de bienvenida/ }).click();
  await page.getByLabel("Recompensa").fill("Un café de cortesía");
  await expect(page.getByLabel("color", { exact: false })).toHaveCount(0);
  await page.getByRole("button", { name: "Guardar y continuar" }).click();

  await expect(page).toHaveURL(/\/panel\/cartel$/);
  await expect(page.getByRole("heading", { name: "Listo. Imprime tu QR de mostrador" })).toBeVisible();
  await expect(page.getByText("Hecho con LealTab")).toBeVisible();
  await expect(page.getByText(/Tu mes de prueba termina el /)).toBeVisible();
  await expect(page.getByText("El QR abre el registro de tu negocio.")).toBeVisible();

  const [pdf] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Descargar PDF" }).click(),
  ]);
  const pdfRuta = await pdf.path();
  expect(pdfRuta).toBeTruthy();
  expect((await readFile(pdfRuta!)).subarray(0, 5).toString()).toBe("%PDF-");

  const [png] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Descargar PNG" }).click(),
  ]);
  const pngRuta = await png.path();
  expect(pngRuta).toBeTruthy();
  expect((await readFile(pngRuta!)).subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");

  expect(llamadasSupabase, "el navegador no llama a Supabase").toEqual([]);

  const filas = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}&select=id,slug,alta_ts,fin_prueba,tanda,version_producto,giro`,
      { headers: servicio() },
    )
  ).json()) as {
    id: string;
    slug: string;
    alta_ts: string;
    fin_prueba: string;
    tanda: number;
    version_producto: string;
    giro: string;
  }[];
  expect(filas).toHaveLength(1);
  const alta = filas[0];
  expect(alta.giro).toBe("cafeteria");
  expect(alta.tanda).toBe(1);
  expect(alta.version_producto).toBe("0.1.0");
  expect(alta.slug.startsWith("casa-")).toBe(true);
  const dias = (Date.parse(alta.fin_prueba) - Date.parse(alta.alta_ts)) / 86_400_000;
  expect(dias).toBeGreaterThan(29);
  expect(dias).toBeLessThan(31);

  const eventos = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/evento_uso?negocio_id=eq.${alta.id}&select=nombre,props`,
      { headers: servicio() },
    )
  ).json()) as { nombre: string; props: Record<string, unknown> }[];
  const configuradas = eventos.filter((e) => e.nombre === "tarjeta_configurada");
  const completadas = eventos.filter((e) => e.nombre === "negocio_alta_completada");
  const descargas = eventos.filter((e) => e.nombre === "qr_mostrador_descargado");
  expect(configuradas).toHaveLength(1);
  expect(completadas).toHaveLength(1);
  expect(completadas[0].props).toMatchObject({
    oficio: "cafeteria",
    tanda: 1,
    version_producto: "0.1.0",
  });
  expect(completadas[0].props.duracion_s).toBeGreaterThan(0);
  expect(completadas[0].props).not.toHaveProperty("correo");
  expect(completadas[0].props).not.toHaveProperty("nombre");
  expect(descargas).toHaveLength(2);

  await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?id=eq.${alta.id}`, {
    method: "DELETE",
    headers: servicio(),
  });
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of data.users.filter((u) => u.email === correo)) await admin().auth.admin.deleteUser(u.id);
});
