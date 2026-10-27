import { createClient } from "@supabase/supabase-js";
import { expect, test } from "./fixtures";

const CLAVE = "clave-valida-1";
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function correoNuevo() {
  return `t4-${Date.now()}-${Math.floor(Math.random() * 1000)}@lealtab.test`;
}

function admin() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function entrar(request: { post: (url: string, opts: { data: unknown }) => Promise<{ status: () => number }> }, correo: string) {
  expect((await request.post("/panel/api/auth/contrasena", { data: { correo, contrasena: CLAVE } })).status()).toBe(200);
}

async function limpiar(correo: string) {
  const cliente = admin();
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?correo_dueno=eq.${encodeURIComponent(correo)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      apikey: process.env.SUPABASE_SECRET_KEY!,
    },
  });
  const { data } = await cliente.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of data.users.filter((u) => u.email === correo)) await cliente.auth.admin.deleteUser(u.id);
}

test.describe("alta del negocio", () => {
  test("guarda la zona, el rol y las iniciales, y el dueño no escribe slug ni alta", async ({ request }) => {
    const correo = correoNuevo();
    expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
    await entrar(request, correo);
    const nombre = `Taller ${Date.now()}`;
    const creado = await request.post("/panel/api/negocio", {
      multipart: {
        nombre,
        giro: "barberia",
        ciudad: "Villahermosa",
        whatsapp: "9931112233",
        zona: "America/Bogota",
        slug: "no-debe-usarse",
      },
    });
    expect(creado.status()).toBe(200);
    const cuerpo = await creado.json();
    expect(cuerpo.ok).toBe(true);
    expect(cuerpo.slug).toMatch(/^taller-/);
    expect(cuerpo.slug).not.toBe("no-debe-usarse");
    expect(cuerpo.zona).toBe("America/Mexico_City");
    expect(cuerpo.iniciales).toHaveLength(2);
    expect(cuerpo.rol).toBe("dueno");
    expect((await request.get(`/c/logo/${cuerpo.slug}`)).status()).toBe(404);

    const sesion = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!);
    expect((await sesion.auth.signInWithPassword({ email: correo, password: CLAVE })).error).toBeNull();
    const token = (await sesion.auth.getSession()).data.session?.access_token;
    const parche = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/negocio?slug=eq.${cuerpo.slug}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.SUPABASE_PUBLISHABLE_KEY!,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ slug: "otro-slug", plan: "pro", estado: "activo", alta_ts: new Date().toISOString(), tanda: 2 }),
      },
    );
    expect(parche.ok).toBe(false);
    const fila = await (
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?slug=eq.${cuerpo.slug}&select=slug,plan,estado,alta_ts,tanda`, {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
          apikey: process.env.SUPABASE_SECRET_KEY!,
        },
      })
    ).json();
    expect(fila[0]).toMatchObject({ slug: cuerpo.slug, plan: "inicio", estado: "prueba", alta_ts: null, tanda: null });
    await limpiar(correo);
  });

  test("el logo se sirve desde /c/logo y la zona de Cancún se conserva", async ({ request }) => {
    const correo = correoNuevo();
    expect((await admin().auth.admin.createUser({ email: correo, password: CLAVE, email_confirm: true })).error).toBeNull();
    await entrar(request, correo);
    const creado = await request.post("/panel/api/negocio", {
      multipart: {
        nombre: "Tapioca Mía",
        giro: "tapioca",
        ciudad: "Cancún",
        whatsapp: "+529931110099",
        zona: "America/Cancun",
        logo: { name: "logo.png", mimeType: "image/png", buffer: PNG },
      },
    });
    expect(creado.status()).toBe(200);
    const { slug, zona } = await creado.json();
    expect(zona).toBe("America/Cancun");
    const logo = await request.get(`/c/logo/${slug}`);
    expect(logo.status()).toBe(200);
    expect(logo.headers()["content-type"]).toContain("image/png");
    expect(logo.url()).not.toContain("supabase");
    await limpiar(correo);
  });
});
