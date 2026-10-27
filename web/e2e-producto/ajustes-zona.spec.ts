import { createClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";

function correoNuevo() {
  return `zona-${Date.now()}-${Math.floor(Math.random() * 1000)}@lealtab.test`;
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

test("el dueño cambia la zona en Ajustes y una zona ajena no se guarda", async ({ page }) => {
  const api = page.request;
  const correo = correoNuevo();
  expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
  expect((await api.post("/panel/api/ajustes/zona", { data: { zona: "America/Tijuana" } })).status()).toBe(401);
  expect((await api.post("/panel/api/auth/contrasena", { data: { correo, contrasena: CLAVE } })).status()).toBe(200);
  expect((await api.post("/panel/api/ajustes/zona", { data: { zona: "America/Tijuana" } })).status()).toBe(401);
  expect(
    (
      await api.post("/panel/api/negocio", {
        multipart: {
          nombre: `Zona ${Date.now()}`,
          giro: "cafeteria",
          ciudad: "Villahermosa",
          whatsapp: "9931114455",
          zona: "America/Mexico_City",
        },
      })
    ).status(),
  ).toBe(200);

  expect((await api.post("/panel/api/ajustes/zona", { data: { zona: "America/New_York" } })).status()).toBe(400);
  expect((await api.post("/panel/api/ajustes/zona", { data: { zona: "America/Tijuana" } })).status()).toBe(200);

  await page.goto("/panel/ajustes");
  await expect(page.getByRole("heading", { name: "Ajustes" })).toBeVisible();
  await expect(page.getByLabel(/Zona horaria/)).toHaveValue("America/Tijuana");
  await page.getByLabel(/Zona horaria/).selectOption("America/Cancun");
  await page.getByRole("button", { name: "Guardar zona" }).click();
  await expect(page.getByText("Listo. La zona quedó guardada.")).toBeVisible();

  const filas = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}&select=zona_horaria`,
      { headers: servicio() },
    )
  ).json()) as { zona_horaria: string }[];
  expect(filas[0]?.zona_horaria).toBe("America/Cancun");

  await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}`, {
    method: "DELETE",
    headers: servicio(),
  });
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of data.users.filter((u) => u.email === correo)) await admin().auth.admin.deleteUser(u.id);
});
