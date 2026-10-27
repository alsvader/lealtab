import { createClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";

function correoNuevo() {
  return `t6-${Date.now()}-${Math.floor(Math.random() * 1000)}@lealtab.test`;
}

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function servicio() {
  return {
    Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
    apikey: process.env.SUPABASE_SECRET_KEY!,
  };
}

test("el cartel cierra el alta, no suma sellos y cada descarga cuenta un evento", async ({ page, request }) => {
  const correo = correoNuevo();
  expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
  expect((await request.post("/panel/api/auth/contrasena", { data: { correo, contrasena: CLAVE } })).status()).toBe(200);
  const negocio = await request.post("/panel/api/negocio", {
    multipart: {
      nombre: `Casa ${Date.now()}`,
      giro: "cafeteria",
      ciudad: "Villahermosa",
      whatsapp: "9931112255",
      zona: "America/Mexico_City",
    },
  });
  expect(negocio.status()).toBe(200);

  const alta = await request.get("/panel/api/cartel?duracion_s=42");
  expect(alta.status()).toBe(200);
  const cuerpo = await alta.json();
  expect(cuerpo.tanda).toBe(1);
  expect(cuerpo.version).toBe("0.1.0");
  expect(cuerpo.destino).toContain(`/c/${cuerpo.slug}`);
  expect(cuerpo.destino).not.toContain("sello");
  const dias = (Date.parse(cuerpo.finPrueba) - Date.now()) / 86_400_000;
  expect(dias).toBeGreaterThan(29);
  expect(dias).toBeLessThan(31);
  expect((await request.get("/panel/api/cartel?duracion_s=99")).status()).toBe(200);

  await page.goto("/panel/cartel");
  await expect(page.getByText("Hecho con LealTab")).toBeVisible();
  const png = await request.get("/panel/api/cartel?formato=png&tamano=carta");
  const pdf = await request.get("/panel/api/cartel?formato=pdf&tamano=sticker");
  expect(png.headers()["content-type"]).toContain("image/png");
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect(png.headers()["x-qr-destino"]).toBe(cuerpo.destino);
  expect(png.headers()["x-qr-destino"]).not.toContain("sello");
  const pdfBytes = Buffer.from(await pdf.body());
  expect(pdfBytes.subarray(0, 5).toString()).toBe("%PDF-");

  const negocioId = (
    (await (
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}&select=id,alta_ts,fin_prueba,tanda,version_producto`, {
        headers: servicio(),
      })
    ).json()) as { id: string; alta_ts: string; tanda: number; version_producto: string }[]
  )[0];
  const eventos = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/evento_uso?negocio_id=eq.${negocioId.id}&select=nombre,props`,
      { headers: servicio() },
    )
  ).json()) as { nombre: string; props: Record<string, unknown> }[];
  const altas = eventos.filter((e) => e.nombre === "negocio_alta_completada");
  const descargas = eventos.filter((e) => e.nombre === "qr_mostrador_descargado");
  expect(altas).toHaveLength(1);
  expect(altas[0].props).toMatchObject({ oficio: "cafeteria", tanda: 1, version_producto: "0.1.0", duracion_s: 42 });
  expect(altas[0].props).not.toHaveProperty("correo");
  expect(altas[0].props).not.toHaveProperty("nombre");
  expect(descargas).toHaveLength(2);
  expect(negocioId.tanda).toBe(1);
  expect(negocioId.version_producto).toBe("0.1.0");
  expect(negocioId.alta_ts).toBeTruthy();

  const sesion = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
  await sesion.auth.signInWithPassword({ email: correo, password: CLAVE });
  const token = (await sesion.auth.getSession()).data.session?.access_token;
  const parche = await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?id=eq.${negocioId.id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.SUPABASE_PUBLISHABLE_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ alta_ts: new Date().toISOString(), tanda: 9 }),
  });
  expect(parche.ok).toBe(false);

  await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?id=eq.${negocioId.id}`, {
    method: "DELETE",
    headers: servicio(),
  });
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of data.users.filter((u) => u.email === correo)) await admin().auth.admin.deleteUser(u.id);
});
