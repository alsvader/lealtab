import { describe, expect, inject, it } from "vitest";
import { CON_RLS, SOLO_SERVICIO, codigoDe, rest, type Opciones } from "./helpers";

const fx = inject("fx");
const A: Opciones = { rol: "authenticated", token: fx.usuario.duenoA.token };
const B: Opciones = { rol: "authenticated", token: fx.usuario.duenoB.token };
const P: Opciones = { rol: "authenticated", token: fx.usuario.duenoP.token };
const servicio: Opciones = { rol: "service" };

const ids = (filas: unknown, col = "id") => (filas as Record<string, string>[]).map((f) => f[col]).sort();

describe("dueño (R-30 a R-38)", () => {
  it("R-30: lee solo su negocio; el de B, por id, 0 filas", async () => {
    const todos = await rest.get("negocio?select=id", A);
    expect(todos.status).toBe(200);
    expect(ids(todos.body)).toEqual([fx.negocio.A]);
    const ajeno = await rest.get(`negocio?id=eq.${fx.negocio.B}`, A);
    expect([ajeno.status, ajeno.body]).toEqual([200, []]);
    // y a la inversa
    expect(ids((await rest.get("negocio?select=id", B)).body)).toEqual([fx.negocio.B]);
    const deA = await rest.get(`negocio?id=eq.${fx.negocio.A}`, B);
    expect(deA.body).toEqual([]);
  });

  it("lee solo su tarjeta_config y solo su propia fila de dueno_negocio", async () => {
    const cfg = await rest.get("tarjeta_config?select=negocio_id", A);
    expect(ids(cfg.body, "negocio_id")).toEqual([fx.negocio.A]);
    const d = await rest.get("dueno_negocio?select=user_id,negocio_id", A);
    // A tiene otros dos usuarios dueños (sin claim y con rol cruzado): no se ven entre sí.
    expect(d.body).toEqual([{ user_id: fx.usuario.duenoA.id, negocio_id: fx.negocio.A }]);
  });

  describe("R-31: UPDATE de negocio por columna", () => {
    it("nombre de su negocio: se aplica (y se restaura)", async () => {
      const r = await rest.patch<{ id: string; nombre: string }[]>(`negocio?id=eq.${fx.negocio.A}`, { nombre: "RLS A editado" }, A);
      expect(r.status).toBe(200);
      expect(r.body.map((f) => f.nombre)).toEqual(["RLS A editado"]);
      const resto = await rest.patch(`negocio?id=eq.${fx.negocio.A}`, { nombre: "RLS A" }, A);
      expect(resto.status).toBe(200);
    });

    it("las siete columnas permitidas se aplican", async () => {
      const r = await rest.patch<{ ciudad: string; giro: string; zona_horaria: string }[]>(
        `negocio?id=eq.${fx.negocio.A}`,
        { ciudad: "Paraíso", giro: "cafeteria", zona_horaria: "America/Cancun", logo_path: "rls/logo.png", whatsapp: "+529939990111", correo_dueno: "rls-nuevo@rls.lealtab.test" },
        A,
      );
      expect(r.status).toBe(200);
      expect(r.body).toHaveLength(1);
      await rest.patch(
        `negocio?id=eq.${fx.negocio.A}`,
        { ciudad: "Villahermosa", giro: "barberia", zona_horaria: "America/Mexico_City", logo_path: null, whatsapp: "+529939990999", correo_dueno: "rls-a@rls.lealtab.test" },
        A,
      );
    });

    for (const [col, valor] of [
      ["estado", "activo"], ["plan", "pro"], ["fin_prueba", "2030-01-01T00:00:00Z"], ["alta_ts", "2030-01-01T00:00:00Z"],
      ["tanda", 9], ["version_producto", "hack"], ["slug", "rls-hack"], ["creado_ts", "2030-01-01T00:00:00Z"],
      ["id", "11111111-1111-1111-1111-111111111111"], ["color", "#000000"],
    ] as const) {
      it(`${col}: 403 con 42501 (no está en el GRANT por columna)`, async () => {
        const r = await rest.patch(`negocio?id=eq.${fx.negocio.A}`, { [col]: valor }, A);
        expect([r.status, codigoDe(r.body)]).toEqual([403, "42501"]);
      });
    }

    it("tras todos los intentos, el negocio conserva sus valores de servidor", async () => {
      const r = await rest.get<Record<string, unknown>[]>(`negocio?id=eq.${fx.negocio.A}&select=slug,estado,plan,tanda,version_producto,nombre,color`, servicio);
      expect(r.body[0]).toMatchObject({ slug: "rls-a", estado: "activo", plan: "inicio", tanda: 1, version_producto: "0.0.0-rls", nombre: "RLS A" });
    });

    it("UPDATE sobre el negocio de B (id o filtro por slug): 200 con 0 filas y sin cambios", async () => {
      for (const consulta of [`negocio?id=eq.${fx.negocio.B}`, "negocio?slug=eq.rls-b"]) {
        const r = await rest.patch(consulta, { nombre: "HACKEADO" }, A);
        expect([r.status, r.body], consulta).toEqual([200, []]);
      }
      const b = await rest.get<{ nombre: string }[]>(`negocio?id=eq.${fx.negocio.B}&select=nombre`, servicio);
      expect(b.body[0].nombre).toBe("RLS B");
    });

    it("no puede mover su negocio a otro dueño ni dejarlo con datos inválidos (CHECK)", async () => {
      const r = await rest.patch(`negocio?id=eq.${fx.negocio.A}`, { whatsapp: "9931000000" }, A);
      expect([r.status, codigoDe(r.body)]).toEqual([400, "23514"]);
    });
  });

  it("R-32: tarjeta_cliente solo de su negocio; la llave, 0 filas", async () => {
    const r = await rest.get<{ negocio_id: string; id: string }[]>("tarjeta_cliente?select=id,negocio_id", A);
    expect(r.status).toBe(200);
    expect(r.body.every((f) => f.negocio_id === fx.negocio.A)).toBe(true);
    expect(r.body.map((f) => f.id)).toContain(fx.tarjeta.xA);
    expect(r.body.map((f) => f.id)).not.toContain(fx.tarjeta.xB);
    for (const id of [fx.tarjeta.xB, fx.tarjeta.yB]) {
      const ajena = await rest.get(`tarjeta_cliente?id=eq.${id}`, A);
      expect([ajena.status, ajena.body]).toEqual([200, []]);
    }
    for (const id of [fx.tarjeta.xA, fx.tarjeta.xB]) {
      const llave = await rest.get(`tarjeta_llave?tarjeta_id=eq.${id}`, A);
      expect([llave.status, llave.body], "llave").toEqual([200, []]);
    }
    expect((await rest.get("tarjeta_llave?select=*", A)).body).toEqual([]);
    const columnas = Object.keys((await rest.get<Record<string, unknown>[]>(`tarjeta_cliente?id=eq.${fx.tarjeta.xA}`, A)).body[0]);
    expect(columnas).not.toContain("llave_hmac");
  });

  it("R-33: no lee identidad, cliente_negocio ni mis_tarjetas; cliente_del_negocio no tiene identidad_id", async () => {
    for (const t of ["identidad", "cliente_negocio", "mis_tarjetas"]) {
      const r = await rest.get(`${t}?select=*`, A);
      expect([r.status, r.body], t).toEqual([200, []]);
    }
    const porId = await rest.get(`cliente_negocio?id=eq.${fx.clienteNegocio.xA}`, A);
    expect(porId.body).toEqual([]);
    const col = await rest.get("cliente_del_negocio?select=identidad_id", A);
    expect(col.status).toBe(400);
    expect(codigoDe(col.body)).toBe("42703");
  });

  it("R-34: cliente_del_negocio devuelve solo los clientes de su negocio, con WhatsApp y sin identidad_id", async () => {
    const r = await rest.get<Record<string, unknown>[]>("cliente_del_negocio?select=*", A);
    expect(r.status).toBe(200);
    expect(r.body.every((f) => f.negocio_id === fx.negocio.A)).toBe(true);
    expect(r.body.map((f) => f.id)).toContain(fx.clienteNegocio.xA);
    expect(r.body.map((f) => f.id)).not.toContain(fx.clienteNegocio.xB);
    expect(r.body.map((f) => f.id)).not.toContain(fx.clienteNegocio.yB);
    expect(Object.keys(r.body[0]).sort()).toEqual(["alta_ts", "id", "negocio_id", "nombre", "whatsapp"]);
    expect(r.body.find((f) => f.id === fx.clienteNegocio.xA)?.whatsapp).toBe(fx.tel.X);
    const deB = await rest.get(`cliente_del_negocio?negocio_id=eq.${fx.negocio.B}`, A);
    expect([deB.status, deB.body]).toEqual([200, []]);
    // B ve a sus clientes (X, Y y el borrable) y a ninguno de A.
    const alReves = (await rest.get<{ id: string; negocio_id: string }[]>("cliente_del_negocio?select=id,negocio_id", B)).body;
    expect(alReves.every((f) => f.negocio_id === fx.negocio.B)).toBe(true);
    expect(alReves.map((f) => f.id)).toEqual(expect.arrayContaining([fx.clienteNegocio.xB, fx.clienteNegocio.yB]));
    expect(alReves.map((f) => f.id)).not.toContain(fx.clienteNegocio.xA);
  });

  it("R-35 y R-36: ningún INSERT ni DELETE; UPDATE solo en las columnas del GRANT; las tablas de servicio, 403", async () => {
    for (const t of [...SOLO_SERVICIO, ...CON_RLS]) {
      const ins = await rest.post(t.nombre, {}, A);
      const del = await rest.delete(`${t.nombre}?${t.pk}=eq.${t.nil}`, A);
      expect([ins.status, codigoDe(ins.body)], `INSERT ${t.nombre}`).toEqual([403, "42501"]);
      expect([del.status, codigoDe(del.body)], `DELETE ${t.nombre}`).toEqual([403, "42501"]);
      if (t.nombre !== "negocio") {
        const upd = await rest.patch(`${t.nombre}?${t.pk}=eq.${t.nil}`, t.upd, A);
        expect([upd.status, codigoDe(upd.body)], `UPDATE ${t.nombre}`).toEqual([403, "42501"]);
      }
    }
    for (const t of SOLO_SERVICIO) {
      const r = await rest.get(`${t.nombre}?select=*`, A);
      expect([r.status, codigoDe(r.body)], `SELECT ${t.nombre}`).toEqual([403, "42501"]);
    }
  });

  it("no puede tocar filas reales de su negocio: sellos, tarjeta_config, cliente_negocio y borrar su negocio", async () => {
    const casos: [string, string, unknown][] = [
      ["PATCH", `tarjeta_cliente?id=eq.${fx.tarjeta.xA}`, { sellos: 99 }],
      ["PATCH", `tarjeta_config?negocio_id=eq.${fx.negocio.A}`, { sellos_meta: 4 }],
      ["PATCH", `cliente_negocio?id=eq.${fx.clienteNegocio.xA}`, { nombre: "Otro" }],
      ["DELETE", `negocio?id=eq.${fx.negocio.A}`, undefined],
      ["DELETE", `tarjeta_cliente?id=eq.${fx.tarjeta.xA}`, undefined],
      ["DELETE", `dueno_negocio?negocio_id=eq.${fx.negocio.A}`, undefined],
    ];
    for (const [metodo, consulta, body] of casos) {
      const r = metodo === "PATCH" ? await rest.patch(consulta, body, A) : await rest.delete(consulta, A);
      expect([r.status, codigoDe(r.body)], `${metodo} ${consulta}`).toEqual([403, "42501"]);
    }
    const intacta = await rest.get<{ sellos: number }[]>(`tarjeta_cliente?id=eq.${fx.tarjeta.xA}&select=sellos`, servicio);
    expect(intacta.body).toEqual([{ sellos: 3 }]);
  });

  it("R-38: con el negocio en pausa sigue leyendo clientes y tarjetas (exportación, RF-CLI-06)", async () => {
    const negocio = await rest.get<{ estado: string }[]>("negocio?select=id,estado", P);
    expect(negocio.body).toEqual([{ id: fx.negocio.P, estado: "pausa" }]);
    const clientes = await rest.get<{ id: string; whatsapp: string }[]>("cliente_del_negocio?select=id,whatsapp", P);
    expect(clientes.status).toBe(200);
    expect(clientes.body).toHaveLength(1);
    const tarjetas = await rest.get<{ id: string }[]>("tarjeta_cliente?select=id", P);
    expect(tarjetas.body).toEqual([{ id: fx.tarjeta.zP }]);
    const cfg = await rest.get("tarjeta_config?select=negocio_id", P);
    expect(cfg.body).toEqual([{ negocio_id: fx.negocio.P }]);
    // Y sigue sin ver nada de otros negocios.
    expect((await rest.get(`tarjeta_cliente?id=eq.${fx.tarjeta.xA}`, P)).body).toEqual([]);
  });

  it.todo("R-35/R-36/R-38 (diferidas): evento, dispositivo y por_revisar del dueño (migración 4, aún no creada)");
  it.todo("R-35: guardar tarjeta_config y resolver Por revisar solo por servidor.* (aún no existen)");
});
