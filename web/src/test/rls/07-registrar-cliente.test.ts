import { afterAll, expect, it } from "vitest";
import { adminAuth, codigoDe, llamar, rest, type Opciones } from "./helpers";

const servicio: Opciones = { rol: "service" };
const perfil = { "Content-Profile": "servidor" };
const DUENO = "reg-dueno@lealtab.test";
const CLAVE = "clave-valida-1";
const TEL_BIENVENIDA = "+529931009911";
const TEL_SIN = "+529931009912";
let slug = "";
let negocioId = "";
const usuarios: string[] = [];

function rpc<T>(nombre: string, body: unknown) {
  return llamar<T>("POST", `/rest/v1/rpc/${nombre}`, { ...servicio, body, headers: perfil });
}

async function usuario(datos: Record<string, unknown>) {
  const creado = await adminAuth.crear({ ...datos, email_confirm: true, phone_confirm: true });
  expect(creado.status, JSON.stringify(creado.body)).toBe(200);
  expect(creado.body.msg ?? null).toBeNull();
  usuarios.push(creado.body.id);
  return creado.body.id;
}

afterAll(async () => {
  if (negocioId) await rest.delete(`negocio?id=eq.${negocioId}`, servicio);
  for (const id of usuarios) await adminAuth.borrar(id);
});

it("crea la tarjeta con un sello de bienvenida y no lo repite", async () => {
  const dueno = await usuario({ email: DUENO, password: CLAVE });
  const alta = await rpc<{ id: string; slug: string }>("crear_negocio", {
    p_user_id: dueno,
    p_nombre: "Casa Registro",
    p_giro: "cafeteria",
    p_ciudad: "Villahermosa",
    p_whatsapp: "+529931009900",
    p_correo: DUENO,
    p_zona: "America/Mexico_City",
    p_logo_path: null,
    p_slug_base: "casa-registro",
  });
  expect(alta.status, JSON.stringify(alta.body)).toBe(200);
  slug = alta.body.slug;
  negocioId = alta.body.id;
  expect((await rest.post("tarjeta_config", { negocio_id: negocioId, recompensa: "Un café", sello_bienvenida: true }, servicio)).status).toBe(201);
  expect((await rpc("completar_alta", { p_user_id: dueno, p_version: "0.1.0", p_duracion_s: 1 })).status).toBe(200);

  const cliente = await usuario({ phone: TEL_BIENVENIDA });
  const primera = await rpc<{ tarjeta_id: string; sellos: number; nueva: boolean; bienvenida: boolean }>("registrar_cliente", {
    p_user_id: cliente,
    p_slug: slug,
    p_nombre: "Ana Cliente",
    p_acepto: true,
  });
  expect(primera.status, JSON.stringify(primera.body)).toBe(200);
  expect(primera.body).toMatchObject({ sellos: 1, nueva: true, bienvenida: true });

  const llave = await rest.get<{ llave_hmac: string }[]>(`tarjeta_llave?tarjeta_id=eq.${primera.body.tarjeta_id}&select=llave_hmac`, servicio);
  expect(llave.body).toHaveLength(1);

  const segunda = await rpc<{ sellos: number; nueva: boolean }>("registrar_cliente", {
    p_user_id: cliente,
    p_slug: slug,
    p_nombre: "Ana Otra",
    p_acepto: true,
  });
  expect(segunda.body).toMatchObject({ sellos: 1, nueva: false });

  const duenoCliente = await rpc("registrar_cliente", {
    p_user_id: dueno,
    p_slug: slug,
    p_nombre: "No debo",
    p_acepto: true,
  });
  expect([duenoCliente.status, codigoDe(duenoCliente.body)]).toEqual([400, "23514"]);

  await rest.patch(`tarjeta_config?negocio_id=eq.${negocioId}`, { sello_bienvenida: false }, servicio);
  const sin = await usuario({ phone: TEL_SIN });
  const cero = await rpc<{ sellos: number; bienvenida: boolean }>("registrar_cliente", {
    p_user_id: sin,
    p_slug: slug,
    p_nombre: "Luis",
    p_acepto: true,
  });
  expect(cero.body).toMatchObject({ sellos: 0, bienvenida: false });
});
