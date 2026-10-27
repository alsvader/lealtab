import { afterEach, describe, expect, inject, it } from "vitest";
import { NIL, SOLO_SERVICIO, TODAS_LAS_TABLAS, VISTAS_PRIVADAS, adminAuth, codigoDe, llamar, rest, type Opciones } from "./helpers";

const fx = inject("fx");
const anon: Opciones = { rol: "anon" };
const sesiones: Record<string, Opciones> = {
  anon,
  dueno: { rol: "authenticated", token: fx.usuario.duenoA.token },
  cliente: { rol: "authenticated", token: fx.usuario.clienteX.token },
};
const servicio: Opciones = { rol: "service" };

describe("esquemas privado y servidor no son accesibles por la API REST", () => {
  for (const [quien, o] of Object.entries(sesiones)) {
    describe(quien, () => {
      it("Accept-Profile: privado, GET de una tabla o vista: 406 (esquema no expuesto)", async () => {
        const r = await llamar("GET", "/rest/v1/negocio", { ...o, headers: { "Accept-Profile": "privado" } });
        expect([r.status, codigoDe(r.body)]).toEqual([406, "PGRST106"]);
      });
      it("Content-Profile: privado, POST de una tabla: 406", async () => {
        const r = await llamar("POST", "/rest/v1/negocio", { ...o, body: {}, headers: { "Content-Profile": "privado" } });
        expect([r.status, codigoDe(r.body)]).toEqual([406, "PGRST106"]);
      });
      for (const f of ["rol", "negocios_del_dueno", "es_dueno_de", "mi_identidad_id", "mis_cliente_negocio_ids", "estado_efectivo"]) {
        it(`RPC privado.${f}: con perfil privado, 406; sin perfil, 404 (no existe en public)`, async () => {
          const con = await llamar("POST", `/rest/v1/rpc/${f}`, { ...o, body: {}, headers: { "Content-Profile": "privado" } });
          expect([con.status, codigoDe(con.body)], "con perfil").toEqual([406, "PGRST106"]);
          const sin = await rest.rpc(f, {}, o);
          expect([sin.status, codigoDe(sin.body)], "sin perfil").toEqual([404, "PGRST202"]);
        });
      }
      it("esquema servidor (expuesto): ninguna tabla ni función de privado o public se alcanza con su perfil", async () => {
        const tabla = await llamar("GET", "/rest/v1/negocio?select=*", { ...o, headers: { "Accept-Profile": "servidor" } });
        expect([tabla.status, codigoDe(tabla.body)]).toEqual([404, "PGRST205"]);
        const fn = await llamar("POST", "/rest/v1/rpc/rol", { ...o, body: {}, headers: { "Content-Profile": "servidor" } });
        expect([fn.status, codigoDe(fn.body)]).toEqual([404, "PGRST202"]);
      });
      it("un esquema inventado tampoco: 406", async () => {
        const r = await llamar("GET", "/rest/v1/negocio", { ...o, headers: { "Accept-Profile": "auth" } });
        expect([r.status, codigoDe(r.body)]).toEqual([406, "PGRST106"]);
        const s = await llamar("GET", "/rest/v1/users", { ...o, headers: { "Accept-Profile": "storage" } });
        expect(s.status).toBe(406);
      });
    });
  }

  it("crear_negocio y completar_alta solo las ejecuta service_role", async () => {
    for (const [quien, o] of Object.entries(sesiones)) {
      for (const f of ["crear_negocio", "completar_alta"]) {
        const r = await llamar("POST", `/rest/v1/rpc/${f}`, {
          ...o,
          body: {},
          headers: { "Content-Profile": "servidor" },
        });
        expect([r.status, codigoDe(r.body)], `${quien} ${f}`).toEqual([404, "PGRST202"]);
      }
    }
    const servicioOk = await llamar("POST", "/rest/v1/rpc/completar_alta", {
      rol: "service",
      body: { p_user_id: NIL, p_version: "0.1.0", p_duracion_s: 0 },
      headers: { "Content-Profile": "servidor" },
    });
    expect([servicioOk.status, codigoDe(servicioOk.body)]).toEqual([400, "23514"]);
  });
});

describe("R-40: service_role (control positivo)", () => {
  it("lee todas las tablas y las vistas con la llave secreta", async () => {
    for (const t of TODAS_LAS_TABLAS) {
      const r = await rest.get(`${t.nombre}?select=*&limit=1`, servicio);
      expect(r.status, t.nombre).toBe(200);
    }
    for (const v of [...VISTAS_PRIVADAS, "negocio_publico"]) {
      expect((await rest.get(`${v}?select=*&limit=1`, servicio)).status, v).toBe(200);
    }
    const negocios = await rest.get<unknown[]>("negocio?slug=like.rls-*&select=id", servicio);
    expect(negocios.body).toHaveLength(5);
  });

  it("H-04: envio_codigo y codigo_intento solo aceptan teléfonos E.164 de México", async () => {
    for (const malo of ["+52 993 123 4567", "529931234567", "9931234567", "+5299312345678"]) {
      const a = await rest.post("envio_codigo", { telefono: malo, proposito: "registro" }, servicio);
      const b = await rest.post("codigo_intento", { telefono: malo, resultado: "incorrecto" }, servicio);
      for (const r of [a, b]) {
        expect(r.status, malo).toBe(400);
        expect(codigoDe(r.body), malo).toBe("23514");
      }
    }
  });

  it("escribe y borra en las tablas de servicio", async () => {
    const clave = "rls_prueba";
    const ins = await rest.post("config_plataforma", { clave, valor: "1" }, servicio);
    expect(ins.status).toBe(201);
    const upd = await rest.patch(`config_plataforma?clave=eq.${clave}`, { valor: "2" }, servicio);
    expect([upd.status, (upd.body as unknown[]).length]).toEqual([200, 1]);
    const del = await rest.delete(`config_plataforma?clave=eq.${clave}`, servicio);
    expect([del.status, (del.body as unknown[]).length]).toEqual([200, 1]);
    for (const t of SOLO_SERVICIO) {
      const r = await rest.patch(`${t.nombre}?${t.pk}=eq.${t.nil === "-1" ? "-1" : t.nil}`, t.upd, servicio);
      expect(r.status, t.nombre).toBe(200);
    }
    const ev = await rest.post("evento_uso", { nombre: "rls_prueba", emisor: "servidor", version_producto: "0.0.0-rls" }, servicio);
    expect(ev.status).toBe(201);
    expect((await rest.delete("evento_uso?nombre=eq.rls_prueba", servicio)).status).toBe(200);
  });

  it("modifica columnas que el dueño no puede (estado) y las restaura", async () => {
    const r = await rest.patch(`negocio?id=eq.${fx.negocio.B}`, { estado: "pausa" }, servicio);
    expect(r.status).toBe(200);
    await rest.patch(`negocio?id=eq.${fx.negocio.B}`, { estado: "activo" }, servicio);
  });
});

describe("R-15: un usuario no puede ser dueño y cliente (exclusión mutua)", () => {
  const creados: { tabla: string; consulta: string }[] = [];
  afterEach(async () => {
    for (const c of creados.splice(0)) await rest.delete(c.consulta, servicio);
  });

  it("meter en dueno_negocio a quien ya tiene identidad: 400 con 23514", async () => {
    const r = await rest.post("dueno_negocio", { user_id: fx.usuario.clienteY.id, negocio_id: fx.negocio.A }, servicio);
    expect([r.status, codigoDe(r.body)]).toEqual([400, "23514"]);
    expect((r.body as { message: string }).message).toMatch(/dueño y cliente/);
    const filas = await rest.get(`dueno_negocio?user_id=eq.${fx.usuario.clienteY.id}`, servicio);
    expect(filas.body).toEqual([]);
  });

  it("meter en identidad a quien ya es dueño: 400 con 23514", async () => {
    const r = await rest.post(
      "identidad",
      { whatsapp: "+529939990777", auth_user_id: fx.usuario.duenoB.id, verificado_ts: new Date().toISOString() },
      servicio,
    );
    expect([r.status, codigoDe(r.body)]).toEqual([400, "23514"]);
    expect((await rest.get(`identidad?auth_user_id=eq.${fx.usuario.duenoB.id}`, servicio)).body).toEqual([]);
  });

  it("también al reasignar: UPDATE de auth_user_id hacia un dueño o de user_id hacia un cliente", async () => {
    const a = await rest.patch(`identidad?auth_user_id=eq.${fx.usuario.clienteY.id}`, { auth_user_id: fx.usuario.duenoB.id }, servicio);
    expect([a.status, codigoDe(a.body)]).toEqual([400, "23514"]);
    const b = await rest.patch(
      `dueno_negocio?user_id=eq.${fx.usuario.duenoB.id}`, { user_id: fx.usuario.clienteY.id }, servicio,
    );
    expect([b.status, codigoDe(b.body)]).toEqual([400, "23514"]);
  });

  it("control: un usuario libre sí puede ser una sola de las dos cosas, y un dueño no puede tener dos negocios", async () => {
    const ok = await rest.post("dueno_negocio", { user_id: fx.libreId, negocio_id: fx.negocio.B }, servicio);
    expect(ok.status).toBe(201);
    creados.push({ tabla: "dueno_negocio", consulta: `dueno_negocio?user_id=eq.${fx.libreId}` });
    const dos = await rest.post("dueno_negocio", { user_id: fx.libreId, negocio_id: fx.negocio.A }, servicio);
    expect(dos.status).toBe(409); // unique (user_id)
    const identidadDelDueno = await rest.post(
      "identidad", { whatsapp: "+529939990778", auth_user_id: fx.libreId, verificado_ts: new Date().toISOString() }, servicio,
    );
    expect([identidadDelDueno.status, codigoDe(identidadDelDueno.body)]).toEqual([400, "23514"]);
  });

  it("la exclusión también corre si se crea al usuario por la API de administración (sin atajos)", async () => {
    const u = await adminAuth.crear({ email: "rls-exclusion@rls.lealtab.test", password: "Rls-exclusion-1", email_confirm: true });
    expect(u.status).toBe(200);
    try {
      expect((await rest.post("identidad", { whatsapp: "+529939990779", auth_user_id: u.body.id, verificado_ts: new Date().toISOString() }, servicio)).status).toBe(201);
      const d = await rest.post("dueno_negocio", { user_id: u.body.id, negocio_id: fx.negocio.A }, servicio);
      expect([d.status, codigoDe(d.body)]).toEqual([400, "23514"]);
    } finally {
      await adminAuth.borrar(u.body.id);
    }
  });
});

describe("normalización: identidad.whatsapp solo acepta +52 y diez dígitos", () => {
  const invalidos = ["9931000999", "529931000999", "+5299310009", "+52993100099999", "+14155550123", "+52 993 100 0999", "+52993100099a", "", "+520000000000x"];
  for (const tel of invalidos) {
    it(`rechaza "${tel}"`, async () => {
      const r = await rest.post("identidad", { whatsapp: tel, auth_user_id: fx.libreId, verificado_ts: new Date().toISOString() }, servicio);
      expect([r.status, codigoDe(r.body)]).toEqual([400, "23514"]);
    });
  }

  it("acepta +52 con diez dígitos (control) y rechaza el duplicado", async () => {
    const tel = "+529939990888";
    const ok = await rest.post("identidad", { whatsapp: tel, auth_user_id: fx.libreId, verificado_ts: new Date().toISOString() }, servicio);
    expect(ok.status).toBe(201);
    try {
      const dup = await rest.post("identidad", { whatsapp: tel, auth_user_id: fx.usuario.manualCorreo.id, verificado_ts: new Date().toISOString() }, servicio);
      expect([dup.status, codigoDe(dup.body)]).toEqual([409, "23505"]);
    } finally {
      await rest.delete(`identidad?whatsapp=eq.${encodeURIComponent(tel)}`, servicio);
    }
  });

  it("negocio.whatsapp y la fila nula de la tarjeta siguen la misma regla", async () => {
    const r = await rest.patch(`negocio?id=eq.${NIL}`, { whatsapp: "9931000999" }, servicio);
    expect([r.status, r.body]).toEqual([200, []]); // sin filas no valida; el CHECK se prueba con una fila real abajo
    const real = await rest.patch(`negocio?id=eq.${fx.negocio.S}`, { whatsapp: "9931000999" }, servicio);
    expect([real.status, codigoDe(real.body)]).toEqual([400, "23514"]);
  });
});
