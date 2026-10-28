import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { afterAll, expect, it } from "vitest";

function cargarEnvLocal(): void {
  const archivo = path.resolve(process.cwd(), ".env.local");
  if (!existsSync(archivo)) return;
  for (const linea of readFileSync(archivo, "utf8").split("\n")) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(linea.trim());
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

cargarEnvLocal();

const TELEFONO = "+529931009901";
const CODIGO = "847291";
const url = process.env.SUPABASE_URL ?? "";
const apikey = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
const secreto = process.env.SUPABASE_SECRET_KEY ?? "";

function auth(ruta: string, cuerpo: unknown) {
  return fetch(`${url}${ruta}`, {
    method: "POST",
    headers: { apikey, Authorization: `Bearer ${apikey}`, "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
}

afterAll(async () => {
  if (!url || !secreto) return;
  const admin = createClient(url, secreto, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const usuario of data.users.filter((u) => u.phone === "529931009901" || u.phone === TELEFONO)) {
    await admin.auth.admin.deleteUser(usuario.id);
  }
});

it("un teléfono de test_otp entra con el código fijo y no abre el registro por correo", async () => {
  expect(url, "falta SUPABASE_URL").toMatch(/^https?:\/\/(127\.0\.0\.1|localhost)/);
  expect(apikey, "falta SUPABASE_PUBLISHABLE_KEY").toBeTruthy();

  const adminPrevio = createClient(url, secreto, { auth: { persistSession: false, autoRefreshToken: false } });
  const alta = await adminPrevio.auth.admin.createUser({ phone: TELEFONO, phone_confirm: true });
  expect(alta.error, alta.error?.message).toBeNull();

  const pedido = await auth("/auth/v1/otp", { phone: TELEFONO, create_user: false });
  const pedidoTexto = await pedido.text();
  expect(pedido.status, pedidoTexto).toBe(200);

  const ver = await auth("/auth/v1/verify", { phone: TELEFONO, token: CODIGO, type: "sms" });
  const verTexto = await ver.text();
  expect(ver.status, verTexto).toBe(200);
  expect(verTexto).not.toContain("smsmasivos");

  const correo = await auth("/auth/v1/signup", { email: "no-debe-crearse@lealtab.test", password: "clave-valida-1" });
  expect(correo.status).toBeGreaterThanOrEqual(400);

  const admin = createClient(url, secreto, { auth: { persistSession: false, autoRefreshToken: false } });
  const correoDueno = `dueno-sigue-${Date.now()}@lealtab.test`;
  const creado = await admin.auth.admin.createUser({
    email: correoDueno,
    password: "clave-valida-1",
    email_confirm: true,
  });
  expect(creado.error).toBeNull();
  const entrada = await auth("/auth/v1/token?grant_type=password", {
    email: correoDueno,
    password: "clave-valida-1",
  });
  expect(entrada.status, await entrada.text()).toBe(200);
  if (creado.data.user) await admin.auth.admin.deleteUser(creado.data.user.id);
});
