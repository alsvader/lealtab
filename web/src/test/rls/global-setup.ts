/**
 * Fixtures de las pruebas de RLS: usuarios reales (API de administración de Auth), sus JWT por
 * inicio de sesión con contraseña y las filas que cuelgan de ellos (llave secreta por REST).
 * Todo lo que crea lleva un prefijo ficticio y se borra al terminar (y al empezar, por si una
 * corrida anterior se cortó). Solo corre contra el Supabase local.
 */
import { randomBytes } from "node:crypto";
import type { TestProject } from "vitest/node";
import { adminAuth, entornoLocal, iniciarSesion, rest, type UsuarioAuth } from "./helpers";

const DOMINIO = "rls.lealtab.test";
const PREFIJO_TEL = "5299399"; // +52 993 99 9xxxx: números ficticios de estas pruebas
const SLUG = "rls-";

export interface Usuario {
  id: string;
  token: string;
}

export interface Fixtures {
  negocio: { A: string; B: string; P: string; S: string; V: string };
  usuario: Record<
    | "duenoA" | "duenoB" | "duenoP" | "clienteX" | "clienteY" | "clienteZ"
    | "manualCorreo" | "manualTelefono" | "rolDuenoSinFila" | "rolClienteSinFila"
    | "duenoSinClaim" | "clienteSinClaim" | "duenoConRolCliente" | "clienteConRolDueno" | "clienteBorrable",
    Usuario
  >;
  /** Usuario sin identidad ni dueno_negocio, sin sesión: para altas directas por el servicio. */
  libreId: string;
  /** Teléfonos E.164 de los clientes. */
  tel: { X: string; Y: string };
  tarjeta: { xA: string; xB: string; yB: string; zP: string; borrable: string };
  clienteNegocio: { xA: string; xB: string; yB: string };
}

declare module "vitest" {
  export interface ProvidedContext {
    fx: Fixtures;
    /** Contraseña (aleatoria por corrida) de todos los usuarios de prueba. */
    password: string;
  }
}

const servicio = { rol: "service" as const };

function exigir<T>(r: { status: number; body: T }, paso: string): T {
  if (r.status >= 300) throw new Error(`${paso}: ${r.status} ${JSON.stringify(r.body)}`);
  return r.body;
}

async function limpiar(): Promise<void> {
  exigir(await rest.delete(`negocio?slug=like.${SLUG}*`, servicio), "borrar negocios rls");
  const lista = exigir(await adminAuth.listar(), "listar usuarios").users;
  for (const u of lista) {
    if ((u.email ?? "").endsWith(`@${DOMINIO}`) || (u.phone ?? "").startsWith(PREFIJO_TEL)) {
      await adminAuth.borrar(u.id);
    }
  }
}

export default async function setup(project: TestProject): Promise<() => Promise<void>> {
  try {
    return await preparar(project);
  } catch (e) {
    // Vitest 5 falla al imprimir el stack de un error de globalSetup: se muestra el mensaje aquí.
    console.error(`\n[test:rls] no se pudieron preparar los fixtures: ${e instanceof Error ? e.message : String(e)}\n`);
    await limpiar().catch(() => undefined);
    throw e;
  }
}

async function preparar(project: TestProject): Promise<() => Promise<void>> {
  entornoLocal(); // se niega a seguir si no es local
  await limpiar();

  const password = `Rls-${randomBytes(12).toString("hex")}`;
  const ahora = Date.now();
  const iso = (ms: number) => new Date(ms).toISOString();
  let n = 0;

  // Los teléfonos de los clientes se crean con la API de administración. El inicio de sesión por
  // teléfono sigue apagado en el Supabase local (GOTRUE_EXTERNAL_PHONE_ENABLED=false: el proveedor
  // llega con el feature de registro), así que cada usuario también lleva un correo ficticio y el
  // JWT sale de ahí. Las políticas no miran el correo ni el teléfono del token.
  async function crearUsuario(rol: string | null, via: "email" | "phone", nombre: string): Promise<UsuarioAuth & { cred: { email: string } }> {
    n += 1;
    const cred = { email: `rls-${nombre.toLowerCase()}@${DOMINIO}` };
    const cuerpo: Record<string, unknown> = { ...cred, password, email_confirm: true };
    if (via === "phone") {
      cuerpo.phone = `${PREFIJO_TEL}${String(n).padStart(5, "0")}`;
      cuerpo.phone_confirm = true;
    }
    if (rol) cuerpo.app_metadata = { rol };
    const u = exigir(await adminAuth.crear(cuerpo), `crear ${nombre}`);
    return { ...u, cred };
  }

  async function conSesion(rol: string | null, via: "email" | "phone", nombre: string): Promise<Usuario & { phone?: string }> {
    const u = await crearUsuario(rol, via, nombre);
    return { id: u.id, token: await iniciarSesion(u.cred, password), phone: u.phone };
  }

  // --- negocios
  const base = (slug: string, estado: string, extra: Record<string, unknown>) => ({
    slug: `${SLUG}${slug}`, nombre: `RLS ${slug.toUpperCase()}`, giro: "barberia", ciudad: "Villahermosa",
    whatsapp: "+529939990999", correo_dueno: `rls-${slug}@${DOMINIO}`, estado,
    ...extra,
  });
  const alta = { alta_ts: iso(ahora), fin_prueba: iso(ahora + 30 * 864e5), tanda: 1, version_producto: "0.0.0-rls" };
  const filas = [
    base("a", "activo", alta),
    base("b", "activo", alta),
    base("p", "pausa", alta),
    base("s", "prueba", { alta_ts: null, fin_prueba: null, tanda: null, version_producto: null }), // sin alta_ts: alta incompleta
    base("v", "prueba", { ...alta, fin_prueba: iso(ahora - 864e5) }), // prueba vencida: pausa efectiva
  ];
  const negs = exigir(await rest.post<{ id: string; slug: string }[]>("negocio", filas, servicio), "negocios");
  const idDe = (s: string) => negs.find((x) => x.slug === `${SLUG}${s}`)!.id;
  const negocio = { A: idDe("a"), B: idDe("b"), P: idDe("p"), S: idDe("s"), V: idDe("v") };
  exigir(
    await rest.post("tarjeta_config", Object.values(negocio).map((id) => ({ negocio_id: id, recompensa: "Premio RLS" })), servicio),
    "tarjeta_config",
  );

  // --- dueños
  const duenoA = await conSesion("dueno", "email", "duenoA");
  const duenoB = await conSesion("dueno", "email", "duenoB");
  const duenoP = await conSesion("dueno", "email", "duenoP");
  const duenoSinClaim = await conSesion(null, "email", "duenoSinClaim");
  const duenoConRolCliente = await conSesion("cliente", "email", "duenoConRolCliente");
  exigir(
    await rest.post("dueno_negocio", [
      { user_id: duenoA.id, negocio_id: negocio.A },
      { user_id: duenoB.id, negocio_id: negocio.B },
      { user_id: duenoP.id, negocio_id: negocio.P },
      { user_id: duenoSinClaim.id, negocio_id: negocio.A },
      { user_id: duenoConRolCliente.id, negocio_id: negocio.A },
    ], servicio),
    "dueno_negocio",
  );

  // --- clientes
  async function cliente(rol: string | null, nombre: string, en: { negocio: string; sellos: number }[]) {
    const u = await conSesion(rol, "phone", nombre);
    const tel = `+${u.phone}`;
    const ident = exigir(
      await rest.post<{ id: string }[]>("identidad", { whatsapp: tel, auth_user_id: u.id, verificado_ts: iso(ahora) }, servicio),
      `identidad ${nombre}`,
    )[0];
    const cn: string[] = [];
    const tj: string[] = [];
    for (const e of en) {
      const c = exigir(
        await rest.post<{ id: string }[]>("cliente_negocio",
          { identidad_id: ident.id, negocio_id: e.negocio, nombre: `Cliente ${nombre}`, acepto_aviso_ts: iso(ahora) }, servicio),
        `cliente_negocio ${nombre}`,
      )[0];
      const t = exigir(
        await rest.post<{ id: string }[]>("tarjeta_cliente",
          { cliente_negocio_id: c.id, negocio_id: e.negocio, sellos: e.sellos, meta_ciclo: 8 }, servicio),
        `tarjeta ${nombre}`,
      )[0];
      exigir(
        await rest.post("tarjeta_llave", { tarjeta_id: t.id, llave_hmac: `\\x${randomBytes(32).toString("hex")}` }, servicio),
        `llave ${nombre}`,
      );
      cn.push(c.id);
      tj.push(t.id);
    }
    return { u, tel, cn, tj };
  }

  const X = await cliente("cliente", "clienteX", [{ negocio: negocio.A, sellos: 3 }, { negocio: negocio.B, sellos: 5 }]);
  const Y = await cliente("cliente", "clienteY", [{ negocio: negocio.B, sellos: 2 }]);
  const Z = await cliente("cliente", "clienteZ", [{ negocio: negocio.P, sellos: 1 }]);
  const clienteSinClaim = await cliente(null, "clienteSinClaim", [{ negocio: negocio.A, sellos: 4 }]);
  const clienteConRolDueno = await cliente("dueno", "clienteConRolDueno", [{ negocio: negocio.A, sellos: 4 }]);
  const borrable = await cliente("cliente", "clienteBorrable", [{ negocio: negocio.B, sellos: 6 }]);

  // --- usuarios creados a mano, sin filas
  const manualCorreo = await conSesion(null, "email", "manualCorreo");
  const manualTelefono = await conSesion(null, "phone", "manualTelefono");
  const rolDuenoSinFila = await conSesion("dueno", "email", "rolDuenoSinFila");
  const rolClienteSinFila = await conSesion("cliente", "phone", "rolClienteSinFila");
  const libre = await crearUsuario(null, "email", "libre");

  const t = (u: { id: string; token: string }): Usuario => ({ id: u.id, token: u.token });
  const fx: Fixtures = {
    negocio,
    usuario: {
      duenoA: t(duenoA), duenoB: t(duenoB), duenoP: t(duenoP),
      clienteX: t(X.u), clienteY: t(Y.u), clienteZ: t(Z.u),
      manualCorreo: t(manualCorreo), manualTelefono: t(manualTelefono),
      rolDuenoSinFila: t(rolDuenoSinFila), rolClienteSinFila: t(rolClienteSinFila),
      duenoSinClaim: t(duenoSinClaim), clienteSinClaim: t(clienteSinClaim.u),
      duenoConRolCliente: t(duenoConRolCliente), clienteConRolDueno: t(clienteConRolDueno.u),
      clienteBorrable: t(borrable.u),
    },
    libreId: libre.id,
    tel: { X: X.tel, Y: Y.tel },
    tarjeta: { xA: X.tj[0], xB: X.tj[1], yB: Y.tj[0], zP: Z.tj[0], borrable: borrable.tj[0] },
    clienteNegocio: { xA: X.cn[0], xB: X.cn[1], yB: Y.cn[0] },
  };
  project.provide("fx", fx);
  project.provide("password", password);

  return async () => {
    await limpiar();
  };
}
