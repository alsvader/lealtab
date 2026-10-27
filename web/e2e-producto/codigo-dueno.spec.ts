import { createClient } from "@supabase/supabase-js";
import { esCookieDueno, expect, test } from "./fixtures";

const MAILPIT = "http://127.0.0.1:54324";

function admin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function correoNuevo() {
  return `t2-${Date.now()}-${Math.floor(Math.random() * 1000)}@lealtab.test`;
}

async function cuerpo(respuesta: { status: () => number; text: () => Promise<string> }) {
  return { status: respuesta.status(), texto: await respuesta.text() };
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
        const texto = `${data.Text ?? ""}\n${data.HTML ?? ""}`;
        const encontrado = texto.match(/\b(\d{6})\b/);
        if (encontrado) {
          expect(texto).toContain("6 dígitos");
          return encontrado[1];
        }
      }
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Mailpit no recibió un código de 6 dígitos para ${correo}`);
}

test.describe("código por correo del dueño", () => {
  test("la respuesta es la misma si el correo existe o no, y el código deja la cookie", async ({ request }) => {
    const primero = correoNuevo();
    const segundo = correoNuevo();
    const a = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: primero } }));
    const b = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: primero } }));
    const c = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: segundo } }));
    expect(a.status).toBe(200);
    expect(b).toEqual(a);
    expect(c).toEqual(a);

    const codigo = await codigoEnMailpit(primero);
    const ver = await request.post("/panel/api/auth/verificar", { data: { correo: primero, codigo } });
    expect(ver.status()).toBe(200);
    const cookies = ver.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value);
    const dueno = cookies.filter((c) => esCookieDueno(c.split("=")[0]));
    expect(dueno.length).toBeGreaterThan(0);
    for (const c of dueno) {
      expect(c).toMatch(/HttpOnly/i);
      expect(c).toMatch(/Path=\/panel/i);
    }

    const cliente = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
      auth: { persistSession: false },
    });
    const { data } = await cliente.auth.admin.listUsers({ page: 1, perPage: 1000 });
    for (const u of data.users.filter((u) => u.email === primero || u.email === segundo)) {
      await cliente.auth.admin.deleteUser(u.id);
    }
  });

  test("un cliente no puede volverse dueño", async ({ request }) => {
    const correo = correoNuevo();
    const creado = await admin().auth.admin.createUser({
      email: correo,
      email_confirm: true,
      app_metadata: { rol: "cliente" },
    });
    expect(creado.error).toBeNull();
    const pedido = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: correoNuevo() } }));
    const cliente = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo } }));
    expect(cliente).toEqual(pedido);

    const ver = await request.post("/panel/api/auth/verificar", { data: { correo, codigo: "000000" } });
    expect(ver.status()).toBe(401);
    const cookies = ver.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie");
    expect(cookies.some((h) => esCookieDueno(h.value.split("=")[0]) && !/Max-Age=0/i.test(h.value))).toBe(false);

    const despues = await admin().auth.admin.getUserById(creado.data.user!.id);
    expect(despues.data.user?.app_metadata?.rol).toBe("cliente");
    await admin().auth.admin.deleteUser(creado.data.user!.id);
  });
});
