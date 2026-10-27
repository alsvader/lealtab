import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";
const OTRA = "mi barberia";

function correoNuevo() {
  return `t3-${Date.now()}-${Math.floor(Math.random() * 1000)}@lealtab.test`;
}

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function publico() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

async function borrar(cliente: SupabaseClient, correo: string) {
  const { data } = await cliente.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of data.users.filter((u) => u.email === correo)) await cliente.auth.admin.deleteUser(u.id);
}

async function codigoEnMailpit(correo: string): Promise<string> {
  const hasta = Date.now() + 20_000;
  while (Date.now() < hasta) {
    const lista = await fetch(`http://127.0.0.1:54324/api/v1/search?query=${encodeURIComponent(`to:${correo}`)}`);
    if (lista.ok) {
      const json = (await lista.json()) as { messages?: { ID: string }[] };
      const id = json.messages?.[0]?.ID;
      if (id) {
        const mensaje = await fetch(`http://127.0.0.1:54324/api/v1/message/${id}`);
        const data = (await mensaje.json()) as { Text?: string; HTML?: string };
        const encontrado = `${data.Text ?? ""}\n${data.HTML ?? ""}`.match(/\b(\d{6})\b/);
        if (encontrado) return encontrado[1];
      }
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`sin código para ${correo}`);
}

test.describe("contraseña del dueño", () => {
  test("el error no dice si el correo existe", async ({ request }) => {
    const correo = correoNuevo();
    const fantasma = correoNuevo();
    const creado = await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true });
    expect(creado.error).toBeNull();
    const noExiste = await request.post("/panel/api/auth/contrasena", { data: { correo: fantasma, contrasena: CLAVE } });
    const mal = await request.post("/panel/api/auth/contrasena", { data: { correo, contrasena: "clave-equivocada" } });
    expect(noExiste.status()).toBe(mal.status());
    expect(await noExiste.text()).toBe(await mal.text());
    expect(await mal.text()).not.toContain(correo);
    expect(await mal.text()).not.toContain(fantasma);
    await borrar(admin(), correo);
  });

  test("cinco fallos pausan la contraseña y el código sigue sirviendo", async ({ request }) => {
    const correo = correoNuevo();
    expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
    expect((await request.post("/panel/api/auth/contrasena", { data: { correo, contrasena: CLAVE } })).status()).toBe(200);
    for (let i = 0; i < 5; i++) {
      const fallo = await request.post("/panel/api/auth/contrasena", { data: { correo, contrasena: "clave-equivocada" } });
      expect(fallo.status()).toBe(401);
    }
    const pausada = await request.post("/panel/api/auth/contrasena", { data: { correo, contrasena: CLAVE } });
    expect(pausada.status()).toBe(401);
    expect(await pausada.json()).toMatchObject({ ok: false, pausa: true });

    expect((await request.post("/panel/api/auth/codigo", { data: { correo } })).status()).toBe(200);
    const codigo = await codigoEnMailpit(correo);
    expect((await request.post("/panel/api/auth/verificar", { data: { correo, codigo } })).status()).toBe(200);
    expect((await request.post("/panel/api/auth/contrasena/crear", { data: { contrasena: "barber" } })).status()).toBe(400);
    expect((await request.post("/panel/api/auth/contrasena/crear", { data: { contrasena: "mi barberia" } })).status()).toBe(200);
    await borrar(admin(), correo);
  });

  test("restablecer responde igual si el correo existe o no", async ({ request }) => {
    const correo = correoNuevo();
    expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
    const existe = await request.post("/panel/api/auth/restablecer/codigo", { data: { correo } });
    const no = await request.post("/panel/api/auth/restablecer/codigo", { data: { correo: correoNuevo() } });
    expect(existe.status()).toBe(200);
    expect(await no.text()).toBe(await existe.text());
    await borrar(admin(), correo);
  });

  test("guarda una contraseña de 8 a 72 sin cerrar las otras sesiones si la casilla no viene", async ({ request }) => {
    const correo = correoNuevo();
    expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
    const sesion = publico();
    expect((await sesion.auth.signInWithPassword({ email: correo, password: CLAVE })).error).toBeNull();
    expect((await request.post("/panel/api/auth/restablecer/codigo", { data: { correo } })).status()).toBe(200);
    const codigo = await codigoEnMailpit(correo);
    expect((await request.post("/panel/api/auth/restablecer/confirmar", { data: { correo, codigo, contrasena: "barber" } })).status()).toBe(400);
    expect((await request.post("/panel/api/auth/restablecer/confirmar", { data: { correo, codigo, contrasena: OTRA } })).status()).toBe(200);
    expect((await sesion.auth.refreshSession()).error).toBeNull();
    expect((await publico().auth.signInWithPassword({ email: correo, password: CLAVE })).error).not.toBeNull();
    expect((await publico().auth.signInWithPassword({ email: correo, password: OTRA })).error).toBeNull();
    await borrar(admin(), correo);
  });

  test("la casilla de cerrar otras sesiones nace desmarcada", async ({ page }) => {
    await page.goto("/panel/entrar");
    await page.getByRole("tab", { name: "Con contraseña" }).click();
    await page.getByRole("button", { name: "¿Olvidaste tu contraseña?" }).click();
    await page.getByLabel("Correo").fill("casilla@lealtab.test");
    await page.getByRole("button", { name: "Enviar código" }).click();
    await expect(page.getByRole("checkbox")).not.toBeChecked();
  });

  test("con la casilla marcada también se cierra la otra sesión", async ({ request }) => {
    const correo = correoNuevo();
    expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
    const otra = publico();
    expect((await otra.auth.signInWithPassword({ email: correo, password: CLAVE })).error).toBeNull();
    expect((await request.post("/panel/api/auth/restablecer/codigo", { data: { correo } })).status()).toBe(200);
    const cierre = await request.post("/panel/api/auth/restablecer/confirmar", {
      data: { correo, codigo: await codigoEnMailpit(correo), contrasena: `${OTRA} 2`, cerrarOtras: true },
    });
    expect(cierre.status()).toBe(200);
    expect((await otra.auth.refreshSession()).error).not.toBeNull();
    await borrar(admin(), correo);
  });
});
