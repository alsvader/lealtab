/**
 * Datos de prueba para desarrollo local (arquitectura.md §3.5).
 * Crea dueños, negocios, clientes y tarjetas con la API de administración de Supabase.
 * Se niega a correr si LT_ENV no es exactamente "local". Idempotente: borra lo suyo y lo recrea.
 * Uso: pnpm db:seed (necesita `pnpm db:up` y `pnpm db:env`).
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const CONTRASENA_LOCAL = "LealTab-local-1"; // solo local; nunca se usa fuera de este script
const VERSION = "0.1.0";

function entorno(nombre: string): string {
  const valor = process.env[nombre]?.trim();
  if (!valor) throw new Error(`Falta ${nombre}. Corre pnpm db:env.`);
  return valor;
}

if (process.env.LT_ENV !== "local") {
  console.error(`seed-dev se niega a correr: LT_ENV es "${process.env.LT_ENV ?? ""}" y debe ser "local".`);
  process.exit(1);
}
const url = entorno("SUPABASE_URL");
if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(url)) {
  console.error(`seed-dev se niega a correr: SUPABASE_URL (${url}) no es local.`);
  process.exit(1);
}

const admin = createClient(url, entorno("SUPABASE_SECRET_KEY"), {
  auth: { persistSession: false, autoRefreshToken: false },
});

function ok<T>(r: { data: T; error: { message: string } | null }, paso: string): NonNullable<T> {
  if (r.error) throw new Error(`${paso}: ${r.error.message}`);
  if (r.data === null || r.data === undefined) throw new Error(`${paso}: sin datos`);
  return r.data;
}

function sinDatos(r: { error: { message: string } | null }, paso: string): void {
  if (r.error) throw new Error(`${paso}: ${r.error.message}`);
}

function usuario(r: Awaited<ReturnType<typeof admin.auth.admin.createUser>>, paso: string) {
  if (r.error) throw new Error(`${paso}: ${r.error.message}`);
  if (!r.data.user) throw new Error(`${paso}: sin usuario`);
  return r.data.user;
}

const duenos = [
  { correo: "velez@lealtab.test", slug: "barberia-velez", nombre: "Barbería Vélez", giro: "barberia", whatsapp: "+529931000101", recompensa: "Un corte gratis", meta: 8 },
  { correo: "mia@lealtab.test", slug: "tapioca-mia", nombre: "Tapioca Mía", giro: "tapioca", whatsapp: "+529931000102", recompensa: "Una tapioca grande gratis", meta: 6 },
] as const;

const clientes = [
  { nombre: "Ana Prueba", tel: "+529931000201", en: [["barberia-velez", 3]] },
  { nombre: "Beto Prueba", tel: "+529931000202", en: [["barberia-velez", 7], ["tapioca-mia", 2]] },
  { nombre: "Carla Prueba", tel: "+529931000203", en: [["tapioca-mia", 5]] },
] as const;

async function borrarPrevio() {
  const slugs = duenos.map((d) => d.slug);
  const del = await admin.from("negocio").delete().in("slug", slugs);
  if (del.error) throw new Error(`borrar negocios: ${del.error.message}`);
  const correos = new Set<string>(duenos.map((d) => d.correo));
  const telefonos = new Set<string>(clientes.map((c) => c.tel.replace("+", "")));
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(`listar usuarios: ${error.message}`);
  for (const u of data.users) {
    if ((u.email && correos.has(u.email)) || (u.phone && telefonos.has(u.phone))) {
      const r = await admin.auth.admin.deleteUser(u.id);
      if (r.error) throw new Error(`borrar usuario: ${r.error.message}`);
    }
  }
}

async function main() {
  await borrarPrevio();
  const tanda = ok(await admin.from("config_plataforma").select("valor").eq("clave", "tanda_actual").single(), "tanda").valor;

  const negocioId = new Map<string, string>();
  const metaPorNegocio = new Map<string, number>();
  for (const d of duenos) {
    const u = usuario(
      await admin.auth.admin.createUser({
        email: d.correo,
        password: CONTRASENA_LOCAL,
        email_confirm: true,
        app_metadata: { rol: "dueno" },
      }),
      `crear dueño ${d.correo}`,
    );
    const ahora = new Date();
    const n = ok(
      await admin
        .from("negocio")
        .insert({
          slug: d.slug, nombre: d.nombre, giro: d.giro, ciudad: "Villahermosa", whatsapp: d.whatsapp,
          correo_dueno: d.correo, color: "#0F5132",
          alta_ts: ahora.toISOString(), fin_prueba: new Date(ahora.getTime() + 30 * 86400000).toISOString(),
          tanda: Number(tanda), version_producto: VERSION,
        })
        .select("id")
        .single(),
      `crear negocio ${d.slug}`,
    );
    sinDatos(await admin.from("dueno_negocio").insert({ user_id: u.id, negocio_id: n.id }), "dueno_negocio");
    sinDatos(await admin.from("tarjeta_config").insert({ negocio_id: n.id, sellos_meta: d.meta, recompensa: d.recompensa }), "tarjeta_config");
    negocioId.set(d.slug, n.id);
    metaPorNegocio.set(d.slug, d.meta);
  }

  for (const c of clientes) {
    const u = usuario(
      await admin.auth.admin.createUser({
        phone: c.tel.replace("+", ""), phone_confirm: true,
        app_metadata: { rol: "cliente" },
      }),
      `crear cliente ${c.nombre}`,
    );
    const ident = ok(
      await admin.from("identidad").insert({ whatsapp: c.tel, auth_user_id: u.id, verificado_ts: new Date().toISOString() }).select("id").single(),
      "identidad",
    );
    for (const [slug, sellos] of c.en) {
      const nid = negocioId.get(slug)!;
      const cn = ok(
        await admin.from("cliente_negocio").insert({ identidad_id: ident.id, negocio_id: nid, nombre: c.nombre, acepto_aviso_ts: new Date().toISOString() }).select("id").single(),
        "cliente_negocio",
      );
      const t = ok(
        await admin.from("tarjeta_cliente").insert({ cliente_negocio_id: cn.id, negocio_id: nid, sellos, meta_ciclo: metaPorNegocio.get(slug)! }).select("id").single(),
        "tarjeta_cliente",
      );
      // bytea por PostgREST: cadena hexadecimal con \x
      sinDatos(await admin.from("tarjeta_llave").insert({ tarjeta_id: t.id, llave_hmac: `\\x${randomBytes(32).toString("hex")}` }), "tarjeta_llave");
    }
  }
  console.log(`Semilla lista: ${duenos.length} negocios (dueños: ${duenos.map((d) => d.correo).join(", ")}; contraseña local ${CONTRASENA_LOCAL}) y ${clientes.length} clientes.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
