import http from "node:http";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { APIRequestContext, APIResponse, Page } from "@playwright/test";
import { esCookieDueno, expect, test } from "./fixtures";

/**
 * Ataques locales de alta-negocio (T1–T6). Chromium.
 * No es el happy path: eso vive en alta-completo.spec.ts.
 */

const CLAVE = "clave-valida-1";
const MAILPIT = "http://127.0.0.1:54324";
const PUERTO = Number(process.env.E2E_PRODUCTO_PORT ?? 3140);
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const RUTAS = ["/panel/entrar", "/panel/alta", "/panel/negocio", "/panel/tarjeta", "/panel/cartel"] as const;
const MARCA = "AdvFuga7kQ";
const TEL_FUGA = "9930007711";

const correos = new Set<string>();
let logosIniciales: Set<string> | null = null;

type FilasNegocio = {
  id: string;
  logo_path: string | null;
  correo_dueno: string;
  slug: string;
  plan: string;
  estado: string;
  alta_ts: string | null;
  fin_prueba: string | null;
  tanda: number | null;
  version_producto: string | null;
  zona_horaria: string;
  color: string | null;
  whatsapp: string;
  nombre: string;
  ciudad: string;
};

function anotar(email: string | null | undefined) {
  const correo = email?.trim().toLowerCase();
  if (!correo?.startsWith("adv-") || !correo.endsWith("@lealtab.test")) return;
  correos.add(correo);
}

function correo(etiqueta: string) {
  const email = `adv-${etiqueta}-${Date.now()}-${Math.floor(Math.random() * 100000)}@lealtab.test`;
  anotar(email);
  return email;
}

function publicable() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error("Falta SUPABASE_PUBLISHABLE_KEY");
  return key;
}

function servicioHeaders() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("Falta SUPABASE_SECRET_KEY");
  return { Authorization: `Bearer ${key}`, apikey: key, "Content-Type": "application/json" };
}

function restUrl(path: string) {
  const base = process.env.SUPABASE_URL;
  if (!base) throw new Error("Falta SUPABASE_URL");
  return `${base}/rest/v1/${path}`;
}

let clienteAdmin: SupabaseClient | null = null;
function admin() {
  if (clienteAdmin) return clienteAdmin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY");
  clienteAdmin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return clienteAdmin;
}

async function leerNegocios(filtro: string) {
  const res = await fetch(restUrl(`negocio?${filtro}&select=id,logo_path,correo_dueno,slug,plan,estado,alta_ts,fin_prueba,tanda,version_producto,zona_horaria,color,whatsapp,nombre,ciudad`), {
    headers: servicioHeaders(),
  });
  if (!res.ok) throw new Error(`lectura negocio ${res.status}`);
  return (await res.json()) as FilasNegocio[];
}

async function leerEventos(negocioId: string) {
  const res = await fetch(restUrl(`evento_uso?negocio_id=eq.${negocioId}&select=nombre,props`), { headers: servicioHeaders() });
  if (!res.ok) throw new Error(`lectura eventos ${res.status}`);
  return (await res.json()) as { nombre: string; props: Record<string, unknown> }[];
}

async function leerTarjetas(negocioId: string) {
  const res = await fetch(restUrl(`tarjeta_config?negocio_id=eq.${negocioId}&select=sellos_meta,recompensa,sello_bienvenida`), {
    headers: servicioHeaders(),
  });
  if (!res.ok) throw new Error(`lectura tarjeta ${res.status}`);
  return (await res.json()) as { sellos_meta: number; recompensa: string; sello_bienvenida: boolean }[];
}

async function nombresLogo() {
  const { data, error } = await admin().storage.from("logos").list("", { limit: 1000 });
  if (error || !data) return null;
  return new Set(data.map((f) => f.name));
}

async function barrer() {
  const negocios = await leerNegocios("correo_dueno=like.adv-%25");
  for (const fila of negocios) {
    const eventos = await fetch(restUrl(`evento_uso?negocio_id=eq.${fila.id}`), { method: "DELETE", headers: servicioHeaders() });
    if (!eventos.ok && eventos.status !== 404) throw new Error(`no se borraron eventos ${eventos.status}`);
    if (fila.logo_path?.startsWith("logos/")) {
      await admin().storage.from("logos").remove([fila.logo_path.slice("logos/".length)]);
    }
    const borrado = await fetch(restUrl(`negocio?id=eq.${fila.id}`), { method: "DELETE", headers: servicioHeaders() });
    if (!borrado.ok && borrado.status !== 404) throw new Error(`no se borró negocio ${borrado.status}`);
  }
  const intentos = await fetch(restUrl("intento_acceso_dueno?correo=like.adv-%25"), { method: "DELETE", headers: servicioHeaders() });
  if (!intentos.ok && intentos.status !== 404) throw new Error(`no se borraron intentos ${intentos.status}`);
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin().auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error("no se pudo listar usuarios");
    for (const u of data.users) {
      const email = u.email?.toLowerCase();
      if (email?.startsWith("adv-") && email.endsWith("@lealtab.test")) await admin().auth.admin.deleteUser(u.id);
    }
    if (data.users.length < 200) break;
  }
}

async function cuerpo(respuesta: APIResponse) {
  return {
    status: respuesta.status(),
    texto: await respuesta.text(),
    cookies: respuesta.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value),
  };
}

function cookieViva(valores: string[]) {
  return valores.some((c) => esCookieDueno(c.split("=")[0] ?? "") && !/Max-Age=0/i.test(c));
}

async function codigoEnMailpit(email: string) {
  const hasta = Date.now() + 20_000;
  while (Date.now() < hasta) {
    const lista = await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`);
    if (lista.ok) {
      const json = (await lista.json()) as { messages?: { ID: string }[] };
      const id = json.messages?.[0]?.ID;
      if (id) {
        const mensaje = await fetch(`${MAILPIT}/api/v1/message/${id}`);
        const data = (await mensaje.json()) as { Text?: string; HTML?: string };
        const crudo = `${data.Text ?? ""}\n${data.HTML ?? ""}`;
        const encontrado = crudo.match(/\b(\d{6})\b/);
        if (encontrado) return { codigo: encontrado[1], crudo };
      }
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Mailpit no recibió código para ${email}`);
}

async function crearDueno(etiqueta: string, extra?: { app_metadata?: Record<string, unknown> }) {
  const email = correo(etiqueta);
  const creado = await admin().auth.admin.createUser({
    email,
    password: CLAVE,
    email_confirm: true,
    app_metadata: extra?.app_metadata,
  });
  expect(creado.error, email).toBeNull();
  return { email, id: creado.data.user!.id };
}

async function entrar(request: APIRequestContext, email: string, clave = CLAVE) {
  const res = await request.post("/panel/api/auth/contrasena", { data: { correo: email, contrasena: clave } });
  expect(res.status(), "entrar").toBe(200);
}

function ficha(nombre: string, extra: Record<string, string> = {}) {
  return {
    nombre,
    giro: "cafeteria",
    ciudad: "Villahermosa",
    whatsapp: "9931112266",
    zona: "America/Mexico_City",
    ...extra,
  };
}

async function restAtaque(method: string, path: string, token: string, body?: unknown) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: publicable(),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, texto: await res.text() };
}

async function rpcAtaque(token: string, fn: string, body: unknown) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: publicable(),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Content-Profile": "servidor",
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, texto: await res.text() };
}

async function tokenDe(email: string, clave = CLAVE) {
  const cliente = createClient(process.env.SUPABASE_URL!, publicable(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await cliente.auth.signInWithPassword({ email, password: clave });
  if (error || !data.session) throw new Error("no hubo access token");
  return data.session.access_token;
}

function rolDelToken(token: string) {
  const parte = token.split(".")[1] ?? "";
  const json = JSON.parse(Buffer.from(parte, "base64url").toString("utf8")) as { app_metadata?: { rol?: unknown } };
  return json.app_metadata?.rol;
}

function vigilar(page: Page) {
  const dialogos: string[] = [];
  page.on("dialog", (d) => {
    dialogos.push(d.message());
    void d.dismiss();
  });
  return dialogos;
}

function httpGet(path: string, headers: Record<string, string>) {
  return new Promise<{ status: number; body: string; headers: http.IncomingHttpHeaders }>((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port: PUERTO, path, method: "GET", headers }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () =>
        resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8"), headers: res.headers }),
      );
    });
    req.on("error", reject);
    req.end();
  });
}

test.describe("ataques al alta del negocio", () => {
  test.describe.configure({ timeout: 120_000 });
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "chromium", "Solo Chromium");
  });
  test.beforeAll(async () => {
    logosIniciales = await nombresLogo();
  });
  test.afterEach(async () => {
    await barrer();
  });
  test.afterAll(async () => {
    await barrer();
    const ahora = await nombresLogo();
    if (logosIniciales && ahora) {
      const nuevos = [...ahora].filter((n) => !logosIniciales?.has(n));
      if (nuevos.length) await admin().storage.from("logos").remove(nuevos);
    }
  });

  test("T1 rutas sin sesión, ayuda y XSS", async ({ page, request, browser }) => {
    const dialogos = vigilar(page);
    const externas: string[] = [];
    page.on("request", (peticion) => {
      const url = new URL(peticion.url());
      if (url.port === "54321" || url.hostname.endsWith("supabase.co")) externas.push(`${url.origin}${url.pathname}`);
    });

    const { email } = await crearDueno("fuga");
    await entrar(request, email);
    const creado = await request.post("/panel/api/negocio", {
      multipart: ficha(`<script>alert(1)</script> ${MARCA}`, { whatsapp: TEL_FUGA, ciudad: "Villahermosa" }),
    });
    expect(creado.status()).toBe(200);
    const json = (await creado.json()) as { slug: string; iniciales: string };
    expect(json.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(json.iniciales).not.toContain("<script");

    for (const ruta of RUTAS) {
      const res = await page.goto(`${ruta}?nombre=%3Cscript%3Ealert(1)%3C/script%3E&ciudad=%3Cimg%20src=x%20onerror=alert(1)%3E`);
      expect(res?.status(), ruta).toBe(200);
      const href = await page.getByRole("link", { name: "Ayuda por WhatsApp" }).getAttribute("href");
      expect(href, ruta).toBe("https://wa.me/525588063606");
      const html = await page.content();
      expect(html, ruta).not.toContain(MARCA);
      expect(html, ruta).not.toContain(email);
      expect(html, ruta).not.toContain(TEL_FUGA);
      expect(html, ruta).not.toContain("+52" + TEL_FUGA);
      expect(html, ruta).not.toContain(json.slug);
      expect(html, ruta).not.toContain("<script>alert(1)</script>");
      expect(html, ruta).not.toContain("onerror=alert");
    }

    await page.goto("/panel/negocio");
    await page.evaluate((marca) => {
      sessionStorage.setItem("lt-alta", JSON.stringify({ nombre: `<img src=x onerror=alert(1)> ${marca}`, whatsapp: "9930007711" }));
    }, MARCA);
    await page.reload();
    await page.getByLabel("Nombre del negocio").fill(`<script>alert(1)</script> ${MARCA}`);
    expect(await page.content()).not.toContain("<script>alert(1)</script>");
    expect(dialogos, "no hubo alert").toEqual([]);
    expect(externas, "el navegador no llama a Supabase").toEqual([]);

    const limpio = await browser.newContext();
    const sinSesion = await limpio.request.post("/panel/api/negocio", { multipart: ficha(MARCA, { whatsapp: TEL_FUGA }) });
    expect(sinSesion.status()).toBe(401);
    expect(await sinSesion.text()).not.toContain(MARCA);
    expect(await leerNegocios(`nombre=eq.${encodeURIComponent(MARCA)}`)).toEqual([]);
    expect(await leerNegocios(`correo_dueno=eq.${encodeURIComponent(email)}`)).toHaveLength(1);
    await limpio.close();
  });

  test("T2 el cuerpo no dice si el correo existe", async ({ request }) => {
    const existente = correo("existe");
    expect((await admin().auth.admin.createUser({ email: existente, email_confirm: true })).error).toBeNull();
    const desconocido = correo("nuevo");
    const base = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: desconocido } }));
    const otra = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: existente } }));
    const mayus = await cuerpo(
      await request.post("/panel/api/auth/codigo", { data: { correo: `  ${existente.toUpperCase()}  ` } }),
    );
    const mayusNueva = correo("mayus");
    const mayusDesconocida = await cuerpo(
      await request.post("/panel/api/auth/codigo", { data: { correo: `  ${mayusNueva.toUpperCase()}  ` } }),
    );
    const rara = "adv-sqli'@lealtab.test";
    anotar(rara);
    const sqli = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: rara } }));
    expect(base.status).toBe(200);
    expect(otra).toMatchObject({ status: base.status, texto: base.texto });
    expect(mayus).toMatchObject({ status: base.status, texto: base.texto });
    expect(mayusDesconocida).toMatchObject({ status: base.status, texto: base.texto });
    expect(sqli).toMatchObject({ status: base.status, texto: base.texto });
    expect(base.texto).not.toContain(existente);
    expect(base.texto).not.toContain("no existe");

    const invalidos = [
      {},
      { correo: "" },
      { correo: "   " },
      { correo: "no-es-correo" },
      { correo: `${"a".repeat(300)}@lealtab.test` },
      { correo: "adv-nl@lealtab.test\nBcc:adv-bcc@lealtab.test" },
      { correo: ["adv-lista@lealtab.test"] },
      { correo: 123 },
      { correo: null },
    ];
    anotar("adv-bcc@lealtab.test");
    anotar("adv-lista@lealtab.test");
    const firmas = [];
    for (const data of invalidos) {
      const res = await request.post("/panel/api/auth/codigo", { data });
      const leido = await cuerpo(res);
      firmas.push(`${leido.status} ${leido.texto}`);
      expect(JSON.stringify(res.headers())).not.toMatch(/bcc/i);
    }
    expect(new Set(firmas).size, firmas.join(" | ")).toBe(1);
    expect(firmas[0]).not.toBe(`${base.status} ${base.texto}`);
    expect(firmas[0]?.startsWith("400")).toBe(true);

    const restableceSi = await cuerpo(await request.post("/panel/api/auth/restablecer/codigo", { data: { correo: existente } }));
    const restableceNo = await cuerpo(
      await request.post("/panel/api/auth/restablecer/codigo", { data: { correo: correo("sin-reset") } }),
    );
    expect(restableceSi.status).toBe(200);
    expect(restableceNo.texto).toBe(restableceSi.texto);
  });

  test("T2 replay, cruce de códigos, 000000 y cookie", async ({ page, browser }) => {
    const dialogos = vigilar(page);
    const a = correo("otp-a");
    const b = correo("otp-b");
    const c = correo("otp-c");
    expect((await requestCodigo(page.request, a)).status).toBe(200);
    expect((await requestCodigo(page.request, b)).status).toBe(200);
    expect((await requestCodigo(page.request, c)).status).toBe(200);
    const codigoA = await codigoEnMailpit(a);
    const codigoB = await codigoEnMailpit(b);
    expect(codigoA.crudo).not.toMatch(/https?:\/\//i);
    expect(codigoA.crudo).toContain(codigoA.codigo);

    const cruce = await browser.newContext();
    const cruceB = await cuerpo(await cruce.request.post("/panel/api/auth/verificar", { data: { correo: b, codigo: codigoA.codigo } }));
    const cruceA = await cuerpo(await cruce.request.post("/panel/api/auth/verificar", { data: { correo: a, codigo: codigoB.codigo } }));
    expect(cruceB.status).toBe(401);
    expect(cruceA.status).toBe(401);
    expect(cookieViva(cruceB.cookies)).toBe(false);
    expect(cruceB.texto).toBe(cruceA.texto);
    await cruce.close();

    for (const codigo of ["000000", "111111"]) {
      const malo = await cuerpo(await page.request.post("/panel/api/auth/verificar", { data: { correo: c, codigo } }));
      expect(malo.status, codigo).toBe(401);
      expect(cookieViva(malo.cookies)).toBe(false);
    }
    const corto = await cuerpo(await page.request.post("/panel/api/auth/verificar", { data: { correo: c, codigo: "12345" } }));
    expect(corto.status).toBe(400);
    expect(cookieViva(corto.cookies)).toBe(false);
    const tipo = await cuerpo(await page.request.post("/panel/api/auth/verificar", { data: { correo: c, codigo: 123456 } }));
    expect(tipo.status).toBe(400);
    expect(cookieViva(tipo.cookies)).toBe(false);

    const bueno = await cuerpo(await page.request.post("/panel/api/auth/verificar", { data: { correo: a, codigo: codigoA.codigo } }));
    expect(bueno.status).toBe(200);
    expect(cookieViva(bueno.cookies)).toBe(true);
    for (const c of bueno.cookies.filter((v) => esCookieDueno(v.split("=")[0] ?? ""))) {
      expect(c).toMatch(/HttpOnly/i);
      expect(c).toMatch(/Path=\/panel/i);
      expect(c).toMatch(/Secure/i);
    }

    const replay = await browser.newContext();
    const repetido = await cuerpo(
      await replay.request.post("/panel/api/auth/verificar", { data: { correo: a, codigo: codigoA.codigo } }),
    );
    expect(repetido.status).toBe(401);
    expect(cookieViva(repetido.cookies)).toBe(false);
    await replay.close();

    await page.goto("/panel/entrar");
    expect(await page.evaluate(() => document.cookie)).not.toContain("lt-dueno");
    const galletas = await page.context().cookies();
    const dueno = galletas.filter((g) => esCookieDueno(g.name));
    expect(dueno.length).toBeGreaterThan(0);
    for (const g of dueno) {
      expect(g.httpOnly).toBe(true);
      expect(g.secure).toBe(true);
      expect(g.path).toBe("/panel");
      expect(g.sameSite).toBe("Lax");
    }
    const cookiesEnC: string[] = [];
    page.on("request", (peticion) => {
      const url = new URL(peticion.url());
      if (url.pathname === "/c" || url.pathname === "/c/") cookiesEnC.push(peticion.headers()["cookie"] ?? "");
    });
    await page.goto("/c");
    expect(cookiesEnC.join(";")).not.toContain("lt-dueno");
    expect(dialogos).toEqual([]);
  });

  test("T2 un cliente no pasa a dueño y el signup global sigue apagado", async ({ request }) => {
    const cliente = await crearDueno("cliente", { app_metadata: { rol: "cliente" } });
    const referencia = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: correo("ref-codigo") } }));
    const pedido = await cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: cliente.email } }));
    expect(pedido).toMatchObject({ status: referencia.status, texto: referencia.texto });
    const ver = await cuerpo(await request.post("/panel/api/auth/verificar", { data: { correo: cliente.email, codigo: "000000" } }));
    expect(ver.status).toBe(401);
    expect(cookieViva(ver.cookies)).toBe(false);

    const fantasma = correo("fantasma-clave");
    const dueno = await crearDueno("dueno-clave");
    const claveCliente = await cuerpo(
      await request.post("/panel/api/auth/contrasena", { data: { correo: cliente.email, contrasena: CLAVE } }),
    );
    const claveMal = await cuerpo(
      await request.post("/panel/api/auth/contrasena", { data: { correo: dueno.email, contrasena: "clave-equivocada" } }),
    );
    const claveNo = await cuerpo(
      await request.post("/panel/api/auth/contrasena", { data: { correo: fantasma, contrasena: CLAVE } }),
    );
    expect(claveCliente.status).toBe(401);
    expect(claveCliente.texto).toBe(claveMal.texto);
    expect(claveCliente.texto).toBe(claveNo.texto);
    expect(cookieViva(claveCliente.cookies)).toBe(false);
    expect(claveCliente.texto).not.toContain(cliente.email);
    const despues = await admin().auth.admin.getUserById(cliente.id);
    expect(despues.data.user?.app_metadata?.rol).toBe("cliente");

    const directo = createClient(process.env.SUPABASE_URL!, publicable(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const sesion = await directo.auth.signInWithPassword({ email: cliente.email, password: CLAVE });
    expect(sesion.error).toBeNull();
    const token = sesion.data.session?.access_token ?? "";
    const sube = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      method: "PUT",
      headers: { apikey: publicable(), Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ app_metadata: { rol: "dueno" }, data: { rol: "dueno" } }),
    });
    expect(sube.ok || sube.status === 200 || sube.status === 422 || sube.status === 400 || sube.status === 403).toBe(true);
    const rol = await admin().auth.admin.getUserById(cliente.id);
    expect(rol.data.user?.app_metadata?.rol).toBe("cliente");
    const lectura = await restAtaque("GET", "negocio?select=correo_dueno,nombre", token);
    expect(lectura.texto).not.toContain("velez");
    if (lectura.status === 200) expect(JSON.parse(lectura.texto)).toEqual([]);

    const alta = await request.post("/panel/api/negocio", { multipart: ficha("No Debe") });
    expect(alta.status()).toBe(401);

    const signupEmail = correo("signup");
    const signup = await fetch(`${process.env.SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { apikey: publicable(), "Content-Type": "application/json" },
      body: JSON.stringify({ email: signupEmail, password: CLAVE }),
    });
    expect(signup.status).toBeGreaterThanOrEqual(400);
    const otpEmail = correo("otp-directo");
    const otp = createClient(process.env.SUPABASE_URL!, publicable(), { auth: { persistSession: false } });
    await otp.auth.signInWithOtp({ email: otpEmail, options: { shouldCreateUser: true } });
    const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
    expect(data.users.some((u) => u.email === signupEmail || u.email === otpEmail)).toBe(false);

    const dev = await request.post("/panel/api/auth/dev-sesion", { data: { usuario: cliente.email } });
    expect(dev.status()).not.toBe(200);
  });

  test("T3 longitud, pausa genérica, cruce de restablecer y crear sin sesión", async ({ page, browser }) => {
    const corto = "abcdefg";
    const largo = ` ${"b".repeat(72)}`;
    expect(corto).toHaveLength(7);
    expect(largo).toHaveLength(73);
    const de8 = "  abcdef";
    const de72 = ` ${"b".repeat(70)} `;
    expect(de8).toHaveLength(8);
    expect(de72).toHaveLength(72);

    const dueno = await crearDueno("largo");
    const fantasma = correo("largo-no");
    const sieteDueno = await cuerpo(await page.request.post("/panel/api/auth/contrasena", { data: { correo: dueno.email, contrasena: corto } }));
    const sieteNo = await cuerpo(await page.request.post("/panel/api/auth/contrasena", { data: { correo: fantasma, contrasena: corto } }));
    const setentaDueno = await cuerpo(
      await page.request.post("/panel/api/auth/contrasena", { data: { correo: dueno.email, contrasena: largo } }),
    );
    const setentaNo = await cuerpo(
      await page.request.post("/panel/api/auth/contrasena", { data: { correo: fantasma, contrasena: largo } }),
    );
    expect(sieteDueno.status).toBe(400);
    expect(sieteDueno.texto).toBe(sieteNo.texto);
    expect(setentaDueno.texto).toBe(sieteDueno.texto);
    expect(setentaNo.texto).toBe(sieteDueno.texto);
    expect(sieteDueno.texto).not.toContain(dueno.email);

    const limpio = await browser.newContext();
    const sinSesion = await cuerpo(await limpio.request.post("/panel/api/auth/contrasena/crear", { data: { contrasena: de8 } }));
    expect(sinSesion.status).toBe(401);
    await limpio.close();

    expect((await page.request.post("/panel/api/auth/codigo", { data: { correo: dueno.email } })).status()).toBe(200);
    const codigo = await codigoEnMailpit(dueno.email);
    expect((await page.request.post("/panel/api/auth/verificar", { data: { correo: dueno.email, codigo: codigo.codigo } })).status()).toBe(200);
    expect((await page.request.post("/panel/api/auth/contrasena/crear", { data: { contrasena: corto } })).status()).toBe(400);
    expect((await page.request.post("/panel/api/auth/contrasena/crear", { data: { contrasena: largo } })).status()).toBe(400);
    expect((await page.request.post("/panel/api/auth/contrasena/crear", { data: { contrasena: de8 } })).status()).toBe(200);
    expect((await page.request.post("/panel/api/auth/contrasena/crear", { data: { contrasena: de72 } })).status()).toBe(200);
    const entra72 = await browser.newContext();
    expect((await entra72.request.post("/panel/api/auth/contrasena", { data: { correo: dueno.email, contrasena: de72 } })).status()).toBe(200);
    await entra72.close();

    const pausado = await crearDueno("pausa");
    const ghost = correo("pausa-no");
    const primeros: string[] = [];
    const sextos: string[] = [];
    for (const email of [pausado.email, ghost]) {
      let sexto = "";
      for (let i = 0; i < 6; i += 1) {
        const res = await cuerpo(
          await page.request.post("/panel/api/auth/contrasena", { data: { correo: email, contrasena: "clave-equivocada" } }),
        );
        if (i === 0) primeros.push(`${res.status} ${res.texto}`);
        if (i === 5) sexto = `${res.status} ${res.texto}`;
      }
      sextos.push(sexto);
    }
    expect(primeros[0]).toBe(primeros[1]);
    expect(sextos[0]).toBe(sextos[1]);
    expect(sextos[0]).toContain('"pausa":true');
    expect(sextos[0]).not.toContain(pausado.email);
    expect(sextos[0]).not.toContain("no existe");

    const a = await crearDueno("reset-a");
    const b = await crearDueno("reset-b");
    expect((await page.request.post("/panel/api/auth/restablecer/codigo", { data: { correo: a.email } })).status()).toBe(200);
    expect((await page.request.post("/panel/api/auth/restablecer/codigo", { data: { correo: b.email } })).status()).toBe(200);
    const codA = await codigoEnMailpit(a.email);
    const codB = await codigoEnMailpit(b.email);
    const cruzado = await cuerpo(
      await page.request.post("/panel/api/auth/restablecer/confirmar", {
        data: { correo: b.email, codigo: codA.codigo, contrasena: "otra clave" },
      }),
    );
    expect(cruzado.status).toBe(401);
    const sigue = await browser.newContext();
    expect((await sigue.request.post("/panel/api/auth/contrasena", { data: { correo: b.email, contrasena: CLAVE } })).status()).toBe(200);
    await sigue.close();

    const otra = createClient(process.env.SUPABASE_URL!, publicable(), {
      auth: { persistSession: true, autoRefreshToken: false },
    });
    expect((await otra.auth.signInWithPassword({ email: a.email, password: CLAVE })).error).toBeNull();
    const confirma = await page.request.post("/panel/api/auth/restablecer/confirmar", {
      data: { correo: a.email, codigo: codA.codigo, contrasena: "clave nueva" },
    });
    expect(confirma.status()).toBe(200);
    const refresco = await otra.auth.refreshSession();
    expect(refresco.error === null).toBe(false);
  });

  test("T3 llenar la ventana de bloqueos no levanta la pausa", async ({ request }) => {
    const { email } = await crearDueno("bypass");
    for (let i = 0; i < 5; i += 1) {
      const fallo = await request.post("/panel/api/auth/contrasena", { data: { correo: email, contrasena: "clave-equivocada" } });
      expect(fallo.status()).toBe(401);
    }
    const sexta = await cuerpo(await request.post("/panel/api/auth/contrasena", { data: { correo: email, contrasena: CLAVE } }));
    expect(sexta.status).toBe(401);
    expect(sexta.texto).toContain('"pausa":true');
    for (let i = 0; i < 10; i += 1) {
      const extra = await request.post("/panel/api/auth/contrasena", { data: { correo: email, contrasena: "clave-equivocada" } });
      expect(extra.status()).toBe(401);
    }
    const despues = await cuerpo(await request.post("/panel/api/auth/contrasena", { data: { correo: email, contrasena: CLAVE } }));
    expect(despues.status, "la pausa de 15 min sigue").toBe(401);
    expect(despues.texto).toContain('"pausa":true');
  });

  test("T4 masa de campos, zona, whatsapp, segundo alta y RPC", async ({ request, browser }) => {
    const email = (await crearDueno("masa")).email;
    await entrar(request, email);
    const jsonMal = await request.post("/panel/api/negocio", {
      data: ficha("Json"),
      headers: { "content-type": "application/json" },
    });
    expect(jsonMal.status()).toBe(400);
    const corto = await request.post("/panel/api/negocio", { multipart: ficha("Corto", { whatsapp: "993111223" }) });
    expect(corto.status()).toBe(400);
    const giro = await request.post("/panel/api/negocio", { multipart: ficha("Giro", { giro: "barberia' OR '1'='1" }) });
    expect(giro.status()).toBe(400);
    expect(await leerNegocios(`correo_dueno=eq.${encodeURIComponent(email)}`)).toEqual([]);

    const correoInyectado = correo("masa-otro");
    const creado = await request.post("/panel/api/negocio", {
      multipart: ficha(`Casa ${MARCA}`, {
        zona: "America/New_York",
        whatsapp: "9931112233",
        slug: "slug-inyectado",
        alta_ts: new Date().toISOString(),
        tanda: "9",
        plan: "pro",
        estado: "activo",
        color: "#112233",
        correo_dueno: correoInyectado,
        id: "00000000-0000-0000-0000-000000000000",
      }),
    });
    expect(creado.status()).toBe(200);
    const cuerpoAlta = (await creado.json()) as { slug: string; zona: string; rol: string };
    expect(cuerpoAlta.zona).toBe("America/Mexico_City");
    expect(cuerpoAlta.slug).not.toBe("slug-inyectado");
    expect(cuerpoAlta.rol).toBe("dueno");
    const filas = await leerNegocios(`correo_dueno=eq.${encodeURIComponent(email)}`);
    expect(filas).toHaveLength(1);
    expect(filas[0]).toMatchObject({
      plan: "inicio",
      estado: "prueba",
      alta_ts: null,
      tanda: null,
      version_producto: null,
      fin_prueba: null,
      zona_horaria: "America/Mexico_City",
      color: null,
      whatsapp: "+529931112233",
      correo_dueno: email,
    });
    expect(await leerNegocios(`correo_dueno=eq.${encodeURIComponent(correoInyectado)}`)).toEqual([]);
    expect(await leerNegocios("slug=eq.slug-inyectado")).toEqual([]);

    const segundo = await request.post("/panel/api/negocio", { multipart: ficha("Segundo local") });
    expect(segundo.status()).toBe(409);
    expect(await leerNegocios(`correo_dueno=eq.${encodeURIComponent(email)}`)).toHaveLength(1);

    const carrera = (await crearDueno("carrera")).email;
    const ctx = await browser.newContext();
    await entrar(ctx.request, carrera);
    const [r1, r2] = await Promise.all([
      ctx.request.post("/panel/api/negocio", { multipart: ficha("Carrera Uno") }),
      ctx.request.post("/panel/api/negocio", { multipart: ficha("Carrera Dos", { whatsapp: "9931112244" }) }),
    ]);
    expect([r1.status(), r2.status()].filter((s) => s === 200).length).toBeLessThanOrEqual(1);
    expect((await leerNegocios(`correo_dueno=eq.${encodeURIComponent(carrera)}`)).length).toBeLessThanOrEqual(1);
    await ctx.close();

    const token = await tokenDe(email);
    expect(rolDelToken(token)).toBe("dueno");
    const rpc = await rpcAtaque(token, "crear_negocio", {
      p_user_id: (await admin().auth.admin.getUserById((await idDe(email))!)).data.user?.id,
      p_nombre: "Hack",
      p_giro: "barberia",
      p_ciudad: "X",
      p_whatsapp: "+529931110099",
      p_correo: correo("rpc"),
      p_zona: "America/New_York",
      p_logo_path: null,
      p_slug_base: "hack-adv",
    });
    const firmaRpc = {
      p_nombre: "Hack",
      p_giro: "barberia",
      p_ciudad: "X",
      p_whatsapp: "+529931110099",
      p_correo: correo("rpc-anon"),
      p_zona: "America/Mexico_City",
      p_logo_path: null,
      p_slug_base: "hack-adv",
    };
    const anon = await rpcAtaque(publicable(), "crear_negocio", {
      ...firmaRpc,
      p_user_id: "00000000-0000-0000-0000-000000000000",
    });
    const completa = await rpcAtaque(token, "completar_alta", { p_user_id: await idDe(email), p_version: "9.9.9", p_duracion_s: -1 });
    const codigoRpc = (r: { status: number; texto: string }) => {
      try {
        return { status: r.status, code: String((JSON.parse(r.texto) as { code?: string }).code ?? "") };
      } catch {
        return { status: r.status, code: "" };
      }
    };
    for (const [quien, respuesta] of [
      ["dueño", rpc],
      ["anon", anon],
      ["completar_alta", completa],
    ] as const) {
      const visto = codigoRpc(respuesta);
      expect(visto.status, quien).toBeGreaterThanOrEqual(400);
      expect(["42501", "PGRST202"], quien).toContain(visto.code);
    }
    expect((await leerNegocios(`correo_dueno=eq.${encodeURIComponent(email)}`))[0]?.alta_ts).toBeNull();
    expect(await leerNegocios("slug=eq.hack-adv")).toEqual([]);
  });

  test("T4 logo, storage e IDOR", async ({ browser }) => {
    const a = await crearDueno("idor-a");
    const b = await crearDueno("idor-b");
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    await entrar(ctxA.request, a.email);
    await entrar(ctxB.request, b.email);

    const antes = await nombresLogo();
    const gif = await ctxA.request.post("/panel/api/negocio", {
      multipart: {
        ...ficha("Logo Gif"),
        logo: { name: "logo.gif", mimeType: "image/gif", buffer: Buffer.from("GIF89a") },
      },
    });
    const svg = await ctxA.request.post("/panel/api/negocio", {
      multipart: {
        ...ficha("Logo Svg"),
        logo: {
          name: "logo.svg",
          mimeType: "image/svg+xml",
          buffer: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>`),
        },
      },
    });
    const html = await ctxA.request.post("/panel/api/negocio", {
      multipart: {
        ...ficha("Logo Html"),
        logo: { name: "logo.html", mimeType: "text/html", buffer: Buffer.from("<script>alert(1)</script>") },
      },
    });
    const charset = await ctxA.request.post("/panel/api/negocio", {
      multipart: {
        ...ficha("Logo Charset"),
        logo: { name: "logo.png", mimeType: "image/png; charset=utf-8", buffer: PNG },
      },
    });
    for (const res of [gif, svg, html, charset]) expect(res.status()).toBe(400);
    expect(await leerNegocios(`correo_dueno=eq.${encodeURIComponent(a.email)}`)).toEqual([]);
    const despuesMalos = await nombresLogo();
    if (antes && despuesMalos) {
      expect([...despuesMalos].filter((n) => !antes.has(n))).toEqual([]);
    }

    const creado = await ctxB.request.post("/panel/api/negocio", {
      multipart: {
        ...ficha(`Barbería ${MARCA}`, { whatsapp: "9931112255" }),
        logo: { name: "../../../etc/passwd.png", mimeType: "image/png", buffer: PNG },
      },
    });
    expect(creado.status()).toBe(200);
    const { slug } = (await creado.json()) as { slug: string };
    const filaB = (await leerNegocios(`correo_dueno=eq.${encodeURIComponent(b.email)}`))[0];
    expect(filaB?.logo_path).toMatch(/^logos\/[0-9a-f-]{36}\.png$/);
    expect(filaB?.logo_path).not.toContain("..");
    const logo = await ctxA.request.get(`/c/logo/${slug}`);
    expect(logo.status()).toBe(200);
    expect(logo.headers()["content-type"]).toContain("image/png");
    expect(logo.headers()["x-content-type-options"]).toBe("nosniff");
    expect(logo.url()).not.toContain("supabase");
    const archivo = filaB!.logo_path!.slice("logos/".length);
    const publico = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/public/logos/${archivo}`);
    expect(publico.status).not.toBe(200);
    const bytesB = Buffer.from(await logo.body());

    const inyectado = await ctxA.request.get(`/c/logo/${encodeURIComponent(`${slug},id.eq.${filaB?.id}`)}`);
    expect(inyectado.status()).not.toBe(200);
    const traversal = await ctxA.request.get("/c/logo/..%2F..%2Fetc/passwd");
    expect(traversal.status()).not.toBe(200);
    expect(await traversal.text()).not.toContain("root:");
    expect(Buffer.from(await (await ctxA.request.get(`/c/logo/${slug}`)).body()).equals(bytesB)).toBe(true);

    const negocioA = await ctxA.request.post("/panel/api/negocio", { multipart: ficha("Casa A", { whatsapp: "9931112277" }) });
    expect(negocioA.status()).toBe(200);
    const tokenA = await tokenDe(a.email);
    const tokenB = await tokenDe(b.email);
    expect(rolDelToken(tokenA)).toBe("dueno");
    const propias = JSON.parse((await restAtaque("GET", "negocio?select=correo_dueno,nombre,slug", tokenA)).texto) as {
      correo_dueno: string;
    }[];
    expect(propias.map((f) => f.correo_dueno)).toEqual([a.email]);
    const ajena = await restAtaque("GET", `negocio?slug=eq.${slug}&select=*`, tokenA);
    expect(ajena.status === 200 ? JSON.parse(ajena.texto) : []).toEqual([]);
    const amplio = await restAtaque("PATCH", `negocio?id=neq.${(await leerNegocios(`correo_dueno=eq.${encodeURIComponent(a.email)}`))[0]?.id}`, tokenA, {
      ciudad: "AdvPateo9",
      nombre: "Pateado",
    });
    expect(amplio.texto).not.toContain("AdvPateo9");
    expect((await leerNegocios(`correo_dueno=eq.${encodeURIComponent(b.email)}`))[0]?.ciudad).toBe("Villahermosa");
    const borra = await restAtaque("DELETE", `negocio?id=eq.${filaB?.id}`, tokenA);
    expect(borra.texto).not.toContain(filaB!.id);
    expect(await leerNegocios(`id=eq.${filaB?.id}`)).toHaveLength(1);
    const inserta = await restAtaque("POST", "negocio", tokenA, {
      slug: "slug-inyectado",
      nombre: "Inyectado",
      giro: "barberia",
      ciudad: "X",
      whatsapp: "+529931110088",
      correo_dueno: a.email,
      plan: "pro",
      estado: "activo",
    });
    expect(inserta.status).toBeGreaterThanOrEqual(400);
    expect(await leerNegocios("slug=eq.slug-inyectado")).toEqual([]);
    const mueve = await restAtaque("POST", "dueno_negocio", tokenA, { user_id: a.id, negocio_id: filaB?.id });
    expect(mueve.status).toBeGreaterThanOrEqual(400);
    const listaStorage = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/list/logos`, {
      method: "POST",
      headers: { apikey: publicable(), Authorization: `Bearer ${tokenA}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prefix: "", limit: 100 }),
    });
    const textoLista = await listaStorage.text();
    expect(listaStorage.status === 200 && textoLista.includes(archivo)).toBe(false);
    const descarga = await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/logos/${archivo}`, {
      headers: { apikey: publicable(), Authorization: `Bearer ${tokenA}` },
    });
    expect(descarga.status).not.toBe(200);
    const anon = await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio?select=correo_dueno`, {
      headers: { apikey: publicable(), Authorization: `Bearer ${publicable()}` },
    });
    expect(anon.status).toBeGreaterThanOrEqual(400);
    expect(await anon.text()).not.toContain(b.email);
    const vistaB = JSON.parse((await restAtaque("GET", "negocio?select=correo_dueno", tokenB)).texto) as { correo_dueno: string }[];
    expect(vistaB.map((f) => f.correo_dueno)).toEqual([b.email]);
    const polyDueno = await crearDueno("poly");
    const ctxPoly = await browser.newContext();
    await entrar(ctxPoly.request, polyDueno.email);
    const poly = await ctxPoly.request.post("/panel/api/negocio", {
      multipart: {
        ...ficha("Logo Poly", { whatsapp: "9931112200" }),
        logo: { name: "logo.png", mimeType: "image/png", buffer: Buffer.from("<script>alert(1)</script>") },
      },
    });
    test.info().annotations.push({ type: "polyglot", description: String(poly.status()) });
    if (poly.status() === 200) {
      const slugPoly = ((await poly.json()) as { slug: string }).slug;
      const img = await ctxPoly.request.get(`/c/logo/${slugPoly}`);
      expect(img.headers()["content-type"] ?? "").toContain("image/png");
      expect(img.headers()["x-content-type-options"]).toBe("nosniff");
      expect(img.url()).not.toContain("supabase");
    } else {
      expect(poly.status()).toBe(400);
    }
    await ctxPoly.close();
    await ctxA.close();
    await ctxB.close();
  });

  test("T5 sellos, color, evento único e IDOR de tarjeta", async ({ browser }) => {
    const a = await crearDueno("tar-a");
    const b = await crearDueno("tar-b");
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    await entrar(ctxA.request, a.email);
    await entrar(ctxB.request, b.email);
    expect((await ctxA.request.post("/panel/api/negocio", { multipart: ficha("Casa Tarjeta A") })).status()).toBe(200);
    expect((await ctxB.request.post("/panel/api/negocio", { multipart: ficha("Casa Tarjeta B", { whatsapp: "9931112288" }) })).status()).toBe(200);
    const idA = (await leerNegocios(`correo_dueno=eq.${encodeURIComponent(a.email)}`))[0]!.id;
    const idB = (await leerNegocios(`correo_dueno=eq.${encodeURIComponent(b.email)}`))[0]!.id;

    const malos = [
      { sellos: 3, recompensa: "Café", bienvenida: true },
      { sellos: 13, recompensa: "Café", bienvenida: true },
      { sellos: -1, recompensa: "Café", bienvenida: true },
      { sellos: 4.5, recompensa: "Café", bienvenida: true },
      { sellos: "3", recompensa: "Café", bienvenida: true },
      { sellos: 8, recompensa: "   ", bienvenida: true },
      { sellos: 8, recompensa: "", bienvenida: true },
      { sellos: 8, recompensa: "x".repeat(81), bienvenida: true },
      { sellos: 8, recompensa: "Café", bienvenida: "true" },
      { sellos: 8, recompensa: "<script>alert(1)</script>", bienvenida: 1, color: "#ff0000", negocio_id: idB },
    ];
    for (const data of malos) {
      const res = await ctxA.request.post("/panel/api/tarjeta", { data });
      expect(res.status(), JSON.stringify(data.sellos)).toBe(400);
    }
    expect(await leerTarjetas(idA)).toEqual([]);
    expect(await leerTarjetas(idB)).toEqual([]);
    expect((await leerEventos(idA)).filter((e) => e.nombre === "tarjeta_configurada")).toHaveLength(0);

    const tokenA = await tokenDe(a.email);
    const inserta = await restAtaque("POST", "tarjeta_config", tokenA, {
      negocio_id: idB,
      sellos_meta: 8,
      recompensa: "HackB",
      sello_bienvenida: true,
    });
    expect(inserta.status).toBeGreaterThanOrEqual(400);
    expect(await leerTarjetas(idB)).toEqual([]);

    const primeraB = await ctxB.request.post("/panel/api/tarjeta", {
      data: { sellos: 8, recompensa: "SecretoB9", bienvenida: true, color: "#ff0000" },
    });
    expect(primeraB.status()).toBe(200);
    expect(await primeraB.json()).toMatchObject({ ok: true, primera: true });
    const roba = await ctxA.request.post("/panel/api/tarjeta", {
      data: { sellos: 12, recompensa: "HackB", bienvenida: false, color: "#ff0000", negocio_id: idB },
    });
    expect(roba.status()).toBe(200);
    expect(await leerTarjetas(idB)).toEqual([{ sellos_meta: 8, recompensa: "SecretoB9", sello_bienvenida: true }]);
    expect((await leerNegocios(`id=eq.${idB}`))[0]?.color).toBeNull();
    expect((await leerNegocios(`id=eq.${idA}`))[0]?.color).toBeNull();
    const parche = await restAtaque("PATCH", `tarjeta_config?negocio_id=eq.${idB}`, tokenA, { recompensa: "Pateada", sellos_meta: 4 });
    expect(parche.status >= 400 || parche.texto === "[]").toBe(true);
    expect((await leerTarjetas(idB))[0]?.recompensa).toBe("SecretoB9");

    const segundaB = await ctxB.request.post("/panel/api/tarjeta", {
      data: { sellos: 6, recompensa: "SecretoB9", bienvenida: false, color: "red" },
    });
    expect(segundaB.status()).toBe(200);
    expect(await segundaB.json()).toMatchObject({ primera: false });
    expect((await leerEventos(idB)).filter((e) => e.nombre === "tarjeta_configurada")).toHaveLength(1);
    expect((await leerTarjetas(idA))[0]).toMatchObject({ sellos_meta: 12, recompensa: "HackB" });
    await ctxA.close();
    await ctxB.close();
  });

  test("T6 cartel sin sesión, idempotencia, columnas y QR", async ({ page, browser }) => {
    const { email } = await crearDueno("cartel");
    const ctx = await browser.newContext();
    await entrar(ctx.request, email);
    expect((await ctx.request.post("/panel/api/negocio", { multipart: ficha(`Casa ${MARCA}`, { whatsapp: "9931112299" }) })).status()).toBe(200);
    expect((await ctx.request.post("/panel/api/tarjeta", { data: { sellos: 8, recompensa: "Un café", bienvenida: false } })).status()).toBe(200);
    const fila = (await leerNegocios(`correo_dueno=eq.${encodeURIComponent(email)}`))[0]!;
    expect(fila.alta_ts).toBeNull();

    const post = await ctx.request.post(`/panel/api/cartel?duracion_s=-5`);
    expect(post.status() === 404 || post.status() === 405).toBe(true);
    expect((await leerNegocios(`id=eq.${fila.id}`))[0]?.alta_ts).toBeNull();

    const sin = await browser.newContext();
    const anon = await sin.request.get("/panel/api/cartel?duracion_s=-5");
    expect(anon.status()).toBe(401);
    expect(await anon.text()).toBe('{"ok":false}');
    const pngAnon = await sin.request.get("/panel/api/cartel?formato=png&duracion_s=-5");
    expect(pngAnon.status()).toBe(401);
    const antes = (await leerEventos(fila.id)).map((e) => e.nombre);
    expect(antes.filter((n) => n === "negocio_alta_completada" || n === "qr_mostrador_descargado")).toEqual([]);
    expect((await leerNegocios(`id=eq.${fila.id}`))[0]?.alta_ts).toBeNull();

    const alta = await ctx.request.get("/panel/api/cartel?duracion_s=-5&version=hack");
    expect(alta.status()).toBe(200);
    const cuerpoAlta = (await alta.json()) as { destino: string; slug: string; version: string };
    expect(cuerpoAlta.destino).toBe(`http://localhost:${PUERTO}/c/${cuerpoAlta.slug}`);
    expect(cuerpoAlta.destino).not.toContain("sello");
    expect(cuerpoAlta.version).not.toBe("hack");
    const eventos1 = await leerEventos(fila.id);
    const altas1 = eventos1.filter((e) => e.nombre === "negocio_alta_completada");
    expect(altas1).toHaveLength(1);
    expect(altas1[0]?.props).toMatchObject({ duracion_s: 0, oficio: "cafeteria" });
    expect(altas1[0]?.props).not.toHaveProperty("correo");
    expect(altas1[0]?.props).not.toHaveProperty("nombre");
    expect(JSON.stringify(altas1[0]?.props)).not.toContain(email);
    expect(JSON.stringify(altas1[0]?.props)).not.toContain(MARCA);
    const altaTs = (await leerNegocios(`id=eq.${fila.id}`))[0]?.alta_ts;

    const segunda = await ctx.request.get("/panel/api/cartel?duracion_s=99");
    expect(segunda.status()).toBe(200);
    expect((await leerEventos(fila.id)).filter((e) => e.nombre === "negocio_alta_completada")).toHaveLength(1);
    expect((await leerNegocios(`id=eq.${fila.id}`))[0]?.alta_ts).toBe(altaTs);
    expect((await leerEventos(fila.id)).find((e) => e.nombre === "negocio_alta_completada")?.props.duracion_s).toBe(0);

    const pngSin = await sin.request.get("/panel/api/cartel?formato=png");
    expect(pngSin.status()).toBe(401);
    expect((await leerEventos(fila.id)).filter((e) => e.nombre === "qr_mostrador_descargado")).toHaveLength(0);

    const png = await ctx.request.get("/panel/api/cartel?formato=png&tamano=../../../../etc/passwd");
    const pdf = await ctx.request.get("/panel/api/cartel?formato=pdf&tamano=sticker");
    expect(png.status()).toBe(200);
    expect(png.headers()["x-qr-destino"]).toBe(cuerpoAlta.destino);
    expect(png.headers()["x-qr-destino"]).not.toContain("sello");
    expect(png.headers()["content-disposition"] ?? "").not.toMatch(/[\r\n]/);
    expect(pdf.headers()["x-qr-destino"]).not.toContain("sello");
    expect((await leerEventos(fila.id)).filter((e) => e.nombre === "qr_mostrador_descargado")).toHaveLength(2);

    const token = await tokenDe(email);
    for (const campo of [
      { alta_ts: new Date().toISOString() },
      { tanda: 9 },
      { fin_prueba: new Date(Date.now() + 86_400_000).toISOString() },
      { version_producto: "hack" },
      { plan: "pro", estado: "activo" },
    ]) {
      const parche = await restAtaque("PATCH", `negocio?id=eq.${fila.id}`, token, campo);
      expect(parche.status, JSON.stringify(campo)).toBeGreaterThanOrEqual(400);
    }
    const quieta = (await leerNegocios(`id=eq.${fila.id}`))[0]!;
    expect(quieta.alta_ts).toBe(altaTs);
    expect(quieta.tanda).toBe(1);
    expect(quieta.version_producto).not.toBe("hack");
    expect(quieta.plan).toBe("inicio");
    expect(quieta.estado).toBe("prueba");

    const enorme = await ctx.request.get("/panel/api/cartel?duracion_s=999999999999");
    const textoEnorme = await enorme.text();
    expect([200, 401]).toContain(enorme.status());
    expect(textoEnorme).not.toMatch(/postgres|syntax|integer/i);
    expect((await leerNegocios(`id=eq.${fila.id}`))[0]?.alta_ts).toBe(altaTs);

    const pubAnon = await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio_publico?slug=eq.${quieta.slug}&select=*`, {
      headers: { apikey: publicable() },
    });
    const textoAnon = await pubAnon.text();
    expect(pubAnon.status).toBeGreaterThanOrEqual(400);
    expect(textoAnon).not.toContain(email);
    expect(textoAnon).not.toContain(MARCA);
    const pub = await fetch(`${process.env.SUPABASE_URL}/rest/v1/negocio_publico?slug=eq.${quieta.slug}&select=*`, {
      headers: { apikey: publicable(), Authorization: `Bearer ${token}` },
    });
    const textoPub = await pub.text();
    expect(textoPub).not.toContain(email);
    expect(textoPub).not.toContain("9931112299");
    expect(textoPub).not.toContain("correo_dueno");
    expect(textoPub).not.toContain("whatsapp");

    await entrar(page.request, email);
    await page.goto("/panel/cartel");
    const href = await page.getByRole("link", { name: "Descargar PNG" }).getAttribute("href");
    expect(href).toBe("/panel/api/cartel?formato=png&tamano=carta");
    expect(href).not.toContain("sello");
    await ctx.close();
    await sin.close();
  });

  test("T6 el host de la petición no cambia el destino del QR", async ({ browser }) => {
    const { email } = await crearDueno("host");
    const ctx = await browser.newContext();
    await entrar(ctx.request, email);
    expect((await ctx.request.post("/panel/api/negocio", { multipart: ficha("Casa Host") })).status()).toBe(200);
    const estado = await ctx.request.storageState();
    const cookie = estado.cookies.filter((c) => esCookieDueno(c.name)).map((c) => `${c.name}=${c.value}`).join("; ");
    expect(cookie.length).toBeGreaterThan(0);
    const crudo = await httpGet("/panel/api/cartel?formato=png&tamano=carta", {
      cookie,
      host: "evil.example",
      "x-forwarded-host": "evil.example",
      "x-forwarded-proto": "https",
      forwarded: "host=evil.example;proto=https",
    });
    const destino = String(crudo.headers["x-qr-destino"] ?? "");
    expect(destino).not.toContain("evil.example");
    expect(crudo.body).not.toContain("<script>alert");
    if (crudo.status === 200) {
      expect(destino).toContain("/c/");
      expect(destino).not.toContain("sello");
    }
    await ctx.close();
  });

  test("no quedan filas adv", async () => {
    await barrer();
    expect(await leerNegocios("correo_dueno=like.adv-%25")).toEqual([]);
    const intentos = await fetch(restUrl("intento_acceso_dueno?correo=like.adv-%25&select=id"), { headers: servicioHeaders() });
    expect(intentos.ok).toBe(true);
    expect(await intentos.json()).toEqual([]);
    const { data, error } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
    expect(error).toBeNull();
    expect(data.users.filter((u) => u.email?.toLowerCase().startsWith("adv-"))).toEqual([]);
  });
});

async function requestCodigo(request: APIRequestContext, email: string) {
  return cuerpo(await request.post("/panel/api/auth/codigo", { data: { correo: email } }));
}

async function idDe(email: string) {
  const { data } = await admin().auth.admin.listUsers({ page: 1, perPage: 1000 });
  return data.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
}
