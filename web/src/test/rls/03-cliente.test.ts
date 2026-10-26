import { describe, expect, inject, it } from "vitest";
import { CON_RLS, SOLO_SERVICIO, codigoDe, rest, type Opciones } from "./helpers";

const fx = inject("fx");
const X: Opciones = { rol: "authenticated", token: fx.usuario.clienteX.token };
const Y: Opciones = { rol: "authenticated", token: fx.usuario.clienteY.token };

const ids = (filas: unknown) => (filas as { id: string }[]).map((f) => f.id).sort();

describe("cliente (R-20 a R-27)", () => {
  it("R-20: tarjeta_cliente devuelve solo las suyas; la ajena, 0 filas", async () => {
    const mias = await rest.get("tarjeta_cliente?select=id,sellos,negocio_id", X);
    expect(mias.status).toBe(200);
    expect(ids(mias.body)).toEqual([fx.tarjeta.xA, fx.tarjeta.xB].sort());
    const ajena = await rest.get(`tarjeta_cliente?id=eq.${fx.tarjeta.yB}`, X);
    expect([ajena.status, ajena.body]).toEqual([200, []]);
    const deP = await rest.get(`tarjeta_cliente?id=eq.${fx.tarjeta.zP}`, X);
    expect([deP.status, deP.body]).toEqual([200, []]);
    const delNegocioDeLaAjena = await rest.get(`tarjeta_cliente?negocio_id=eq.${fx.negocio.P}`, X);
    expect(delNegocioDeLaAjena.body).toEqual([]);
  });

  it("R-21: tarjeta_llave devuelve solo la suya (la necesita para el QR sin conexión)", async () => {
    const r = await rest.get<{ tarjeta_id: string }[]>("tarjeta_llave?select=tarjeta_id", X);
    expect(r.status).toBe(200);
    expect(r.body.map((f) => f.tarjeta_id).sort()).toEqual([fx.tarjeta.xA, fx.tarjeta.xB].sort());
    const ajena = await rest.get(`tarjeta_llave?tarjeta_id=eq.${fx.tarjeta.yB}`, X);
    expect([ajena.status, ajena.body]).toEqual([200, []]);
    // Y ve la suya y nada de X.
    const deY = await rest.get<{ tarjeta_id: string }[]>("tarjeta_llave?select=tarjeta_id", Y);
    expect(deY.body.map((f) => f.tarjeta_id)).toEqual([fx.tarjeta.yB]);
  });

  it("R-22: identidad devuelve solo su fila; filtrando por el WhatsApp de otro, 0 filas", async () => {
    const mia = await rest.get<{ whatsapp: string }[]>("identidad?select=whatsapp,auth_user_id", X);
    expect(mia.status).toBe(200);
    expect(mia.body).toHaveLength(1);
    expect(mia.body[0].whatsapp).toBe(fx.tel.X);
    const ajena = await rest.get(`identidad?whatsapp=eq.${encodeURIComponent(fx.tel.Y)}`, X);
    expect([ajena.status, ajena.body]).toEqual([200, []]);
  });

  it("R-23: cliente_negocio devuelve solo las suyas; las de otro, 0 filas", async () => {
    const mias = await rest.get("cliente_negocio?select=id", X);
    expect(ids(mias.body)).toEqual([fx.clienteNegocio.xA, fx.clienteNegocio.xB].sort());
    const ajena = await rest.get(`cliente_negocio?id=eq.${fx.clienteNegocio.yB}`, X);
    expect([ajena.status, ajena.body]).toEqual([200, []]);
    const delNegocio = await rest.get(`cliente_negocio?negocio_id=eq.${fx.negocio.B}&select=id`, X);
    expect(ids(delNegocio.body)).toEqual([fx.clienteNegocio.xB]); // en B hay dos clientes (X e Y): solo ve el suyo
  });

  it("R-24: no lee negocio, tarjeta_config, dueno_negocio ni cliente_del_negocio", async () => {
    for (const t of ["negocio", "tarjeta_config", "dueno_negocio", "cliente_del_negocio"]) {
      const r = await rest.get(`${t}?select=*`, X);
      expect([r.status, r.body], t).toEqual([200, []]);
    }
    for (const t of SOLO_SERVICIO) {
      const r = await rest.get(`${t.nombre}?select=*`, X);
      expect(r.status, t.nombre).toBe(403);
      expect(codigoDe(r.body), t.nombre).toBe("42501");
    }
  });

  it("R-25: ningún INSERT, UPDATE ni DELETE, ni siquiera sellos = 99 sobre su tarjeta", async () => {
    const sellos = await rest.patch(`tarjeta_cliente?id=eq.${fx.tarjeta.xA}`, { sellos: 99 }, X);
    expect(sellos.status).toBe(403);
    expect(codigoDe(sellos.body)).toBe("42501");
    for (const t of [...SOLO_SERVICIO, ...CON_RLS]) {
      const ins = await rest.post(t.nombre, {}, X);
      const del = await rest.delete(`${t.nombre}?${t.pk}=eq.${t.nil}`, X);
      expect([ins.status, codigoDe(ins.body)], `INSERT ${t.nombre}`).toEqual([403, "42501"]);
      expect([del.status, codigoDe(del.body)], `DELETE ${t.nombre}`).toEqual([403, "42501"]);
      if (t.nombre !== "negocio") {
        const upd = await rest.patch(`${t.nombre}?${t.pk}=eq.${t.nil}`, t.upd, X);
        expect([upd.status, codigoDe(upd.body)], `UPDATE ${t.nombre}`).toEqual([403, "42501"]);
      }
    }
    // Tampoco se borra su identidad ni se reescribe su cliente_negocio por una fila real.
    const delIdentidad = await rest.delete(`identidad?whatsapp=eq.${encodeURIComponent(fx.tel.X)}`, X);
    expect(delIdentidad.status).toBe(403);
    const nombre = await rest.patch(`cliente_negocio?id=eq.${fx.clienteNegocio.xA}`, { nombre: "Otro" }, X);
    expect(nombre.status).toBe(403);
    const vigente = await rest.get<{ sellos: number }[]>(`tarjeta_cliente?id=eq.${fx.tarjeta.xA}&select=sellos`, X);
    expect(vigente.body[0].sellos).toBe(3);
  });

  it("no puede cambiar negocio.nombre de un negocio ajeno ni del suyo (el permiso de columna no basta sin RLS)", async () => {
    for (const id of [fx.negocio.A, fx.negocio.B]) {
      const r = await rest.patch(`negocio?id=eq.${id}`, { nombre: "HACKEADO" }, X);
      expect([r.status, r.body]).toEqual([200, []]);
    }
    const lectura = await rest.get<{ nombre: string }[]>(`negocio?id=eq.${fx.negocio.A}&select=nombre`, { rol: "service" });
    expect(lectura.body[0].nombre).toBe("RLS A");
  });

  it("R-26: mis_tarjetas devuelve solo las suyas, sin identidad_id", async () => {
    const r = await rest.get<Record<string, unknown>[]>("mis_tarjetas?select=*&order=slug", X);
    expect(r.status).toBe(200);
    expect(r.body.map((f) => f.tarjeta_id).sort()).toEqual([fx.tarjeta.xA, fx.tarjeta.xB].sort());
    expect(r.body.map((f) => f.slug)).toEqual(["rls-a", "rls-b"]);
    expect(Object.keys(r.body[0]).sort()).toEqual([
      "acepto_aviso_ts", "alta_ts", "cliente_nombre", "estado_negocio", "limite_minutos", "limite_modo", "logo_path",
      "meta_ciclo", "negocio_nombre", "recompensa", "sellos", "slug", "tarjeta_id", "ultima_visita_ts",
    ]);
    const deY = await rest.get<Record<string, unknown>[]>("mis_tarjetas?select=tarjeta_id,slug", Y);
    expect(deY.body).toEqual([{ tarjeta_id: fx.tarjeta.yB, slug: "rls-b" }]);
    const sinIdentidad = await rest.get("mis_tarjetas?select=identidad_id", X);
    expect(sinIdentidad.status).toBe(400);
    expect(codigoDe(sinIdentidad.body)).toBe("42703");
  });

  it("mis_tarjetas muestra el estado efectivo de la cuenta (pausa) en la tarjeta del cliente", async () => {
    const Z: Opciones = { rol: "authenticated", token: fx.usuario.clienteZ.token };
    const r = await rest.get<{ estado_negocio: string }[]>("mis_tarjetas?select=estado_negocio", Z);
    expect(r.body).toEqual([{ estado_negocio: "pausa" }]);
  });

  it.todo("R-27: RPC servidor.* falla para cliente (aún no hay funciones servidor.*; ver 02_privilegios_por_defecto.test.sql)");
  it.todo("R-24/R-25 (diferidas): evento, por_revisar y dispositivo para el cliente (migración 4, aún no creada)");
});

