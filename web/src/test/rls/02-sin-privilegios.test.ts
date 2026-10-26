import { describe, expect, inject, it } from "vitest";
import {
  CON_RLS, SOLO_SERVICIO, VISTAS_PRIVADAS, adminAuth, claims, codigoDe, iniciarSesion, llamar, rest, type Opciones,
} from "./helpers";

const fx = inject("fx");
const password = inject("password");
const comoUsuario = (token: string): Opciones => ({ rol: "authenticated", token });

/** Todo lo que puede leer un usuario sin filas: listas vacías, o 403 donde no hay privilegio. */
async function nadaVisible(token: string) {
  const o = comoUsuario(token);
  for (const t of CON_RLS) {
    const r = await rest.get(`${t.nombre}?select=*`, o);
    expect([r.status, r.body], t.nombre).toEqual([200, []]);
  }
  for (const v of VISTAS_PRIVADAS) {
    const r = await rest.get(`${v}?select=*`, o);
    expect([r.status, r.body], v).toEqual([200, []]);
  }
  for (const t of SOLO_SERVICIO) {
    const r = await rest.get(`${t.nombre}?select=*`, o);
    expect(r.status, t.nombre).toBe(403);
    expect(codigoDe(r.body), t.nombre).toBe("42501");
  }
}

/** Y no puede escribir en ninguna parte (el UPDATE de negocio.nombre es un permiso de columna que la RLS vacía). */
async function nadaEscribible(token: string) {
  const o = comoUsuario(token);
  for (const t of [...SOLO_SERVICIO, ...CON_RLS]) {
    const ins = await rest.post(t.nombre, {}, o);
    const del = await rest.delete(`${t.nombre}?${t.pk}=eq.${t.nil}`, o);
    expect(ins.status, `INSERT ${t.nombre}`).toBe(403);
    expect(del.status, `DELETE ${t.nombre}`).toBe(403);
    const upd = await rest.patch(`${t.nombre}?${t.pk}=eq.${t.nil}`, t.upd, o);
    if (t.nombre === "negocio") expect([upd.status, upd.body]).toEqual([200, []]);
    else expect(upd.status, `UPDATE ${t.nombre}`).toBe(403);
  }
  // Sobre filas reales de A, B y P: cero filas afectadas, sin cambios.
  for (const id of [fx.negocio.A, fx.negocio.B, fx.negocio.P]) {
    const r = await rest.patch(`negocio?id=eq.${id}`, { nombre: "HACKEADO" }, o);
    expect([r.status, r.body]).toEqual([200, []]);
  }
}

describe("usuarios sin filas o con claim falso (R-10 a R-14, R-28)", () => {
  const casos: [string, () => string][] = [
    ["R-10: usuario creado a mano con correo, sin claim", () => fx.usuario.manualCorreo.token],
    ["R-10: usuario creado a mano con teléfono, sin claim", () => fx.usuario.manualTelefono.token],
    ["R-11: rol=dueno forzado por admin, sin fila en dueno_negocio", () => fx.usuario.rolDuenoSinFila.token],
    ["R-12: rol=cliente forzado por admin, sin identidad", () => fx.usuario.rolClienteSinFila.token],
    ["con fila en dueno_negocio pero sin claim de rol", () => fx.usuario.duenoSinClaim.token],
    ["con identidad y tarjetas pero sin claim de rol (ventana tras verifyOtp)", () => fx.usuario.clienteSinClaim.token],
    ["dueño de verdad con claim rol=cliente (rol cruzado)", () => fx.usuario.duenoConRolCliente.token],
    ["cliente de verdad con claim rol=dueno (rol cruzado)", () => fx.usuario.clienteConRolDueno.token],
  ];
  for (const [titulo, token] of casos) {
    it(`${titulo}: no lee nada`, async () => nadaVisible(token()));
    it(`${titulo}: no escribe nada`, async () => nadaEscribible(token()));
  }

  it("los tokens traen el claim que se espera", () => {
    expect(claims(fx.usuario.manualCorreo.token).app_metadata?.rol).toBeUndefined();
    expect(claims(fx.usuario.duenoSinClaim.token).app_metadata?.rol).toBeUndefined();
    expect(claims(fx.usuario.rolDuenoSinFila.token).app_metadata?.rol).toBe("dueno");
    expect(claims(fx.usuario.duenoA.token).app_metadata?.rol).toBe("dueno");
    expect(claims(fx.usuario.clienteX.token).app_metadata?.rol).toBe("cliente");
  });

  it("R-13: editar user_metadata a {rol:'dueno'} no otorga nada, ni con fila de dueño y token nuevo", async () => {
    const u = fx.usuario.duenoSinClaim;
    const put = await llamar<{ user_metadata?: { rol?: string } }>("PUT", "/auth/v1/user", {
      rol: "authenticated", token: u.token, body: { data: { rol: "dueno" } },
    });
    expect(put.status).toBe(200);
    expect(put.body.user_metadata?.rol).toBe("dueno");
    const email = (await adminAuth.listar()).body.users.find((x) => x.id === u.id)!.email!;
    const nuevo = await iniciarSesion({ email }, password);
    expect(claims(nuevo).user_metadata?.rol).toBe("dueno");
    expect(claims(nuevo).app_metadata?.rol).toBeUndefined();
    await nadaVisible(nuevo);
    await nadaVisible(u.token);
  });

  it("R-14: escribir app_metadata por la API de Auth se ignora y el claim no cambia", async () => {
    const u = fx.usuario.clienteSinClaim;
    const put = await llamar("PUT", "/auth/v1/user", {
      rol: "authenticated", token: u.token, body: { app_metadata: { rol: "dueno" }, data: { nota: "x" } },
    });
    expect([200, 400, 403, 422]).toContain(put.status);
    const lista = (await adminAuth.listar()).body.users.find((x) => x.id === u.id)!;
    expect(lista.app_metadata?.rol).toBeUndefined();
    const nuevo = await iniciarSesion({ email: lista.email }, password);
    expect(claims(nuevo).app_metadata?.rol).toBeUndefined();
    await nadaVisible(nuevo);
  });

  it("R-28: un token vigente de una cuenta borrada ya no ve nada", async () => {
    const u = fx.usuario.clienteBorrable;
    const antes = await rest.get<unknown[]>("mis_tarjetas?select=tarjeta_id", comoUsuario(u.token));
    expect(antes.body).toHaveLength(1);
    const del = await adminAuth.borrar(u.id);
    expect(del.status).toBe(200);
    for (const consulta of ["mis_tarjetas?select=*", "tarjeta_cliente?select=*", "tarjeta_llave?select=*", "identidad?select=*", "cliente_negocio?select=*"]) {
      const r = await rest.get(consulta, comoUsuario(u.token));
      expect([r.status, r.body], consulta).toEqual([200, []]);
    }
  });

  it.todo("R-10 a R-12 (diferidas): evento, dispositivo y por_revisar (tablas de la migración 4, aún no creada)");
});
