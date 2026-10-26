import { describe, expect, it } from "vitest";
import { CON_RLS, SOLO_SERVICIO, VISTAS_PRIVADAS, codigoDe, llamar, rest } from "./helpers";

const anon = { rol: "anon" as const };
const servicio = { rol: "service" as const };
const sinNegocioPublico = [...SOLO_SERVICIO, ...CON_RLS];

describe("anon (R-01 a R-04)", () => {
  describe("R-01: SELECT en cada tabla y vista, también negocio_publico (H-03)", () => {
    for (const t of sinNegocioPublico) {
      it(`${t.nombre}: 401 con 42501`, async () => {
        const r = await rest.get(`${t.nombre}?select=*`, anon);
        expect(r.status).toBe(401);
        expect(codigoDe(r.body)).toBe("42501");
      });
    }
    for (const v of [...VISTAS_PRIVADAS, "negocio_publico"]) {
      it(`${v}: 401 con 42501`, async () => {
        const r = await rest.get(`${v}?select=*`, anon);
        expect(r.status).toBe(401);
        expect(codigoDe(r.body)).toBe("42501");
      });
    }
  });

  describe("R-02: INSERT, UPDATE y DELETE", () => {
    for (const t of sinNegocioPublico) {
      it(`${t.nombre}: INSERT, UPDATE y DELETE dan 401 con 42501`, async () => {
        const ins = await rest.post(t.nombre, {}, anon);
        const upd = await rest.patch(`${t.nombre}?${t.pk}=eq.${t.nil}`, t.upd, anon);
        const del = await rest.delete(`${t.nombre}?${t.pk}=eq.${t.nil}`, anon);
        for (const r of [ins, upd, del]) {
          expect(r.status).toBe(401);
          expect(codigoDe(r.body)).toBe("42501");
        }
      });
    }
    it("las vistas no aceptan escrituras (son uniones: 500 con 55000, no actualizables)", async () => {
      const vistas: [string, string, string, unknown][] = [
        ["negocio_publico", "slug", "x", { nombre: "x" }],
        ["cliente_del_negocio", "nombre", "x", { nombre: "x" }],
        ["mis_tarjetas", "slug", "x", { sellos: 1 }],
      ];
      for (const [v, col, val, cambio] of vistas) {
        for (const r of [
          await rest.post(v, cambio, anon),
          await rest.patch(`${v}?${col}=eq.${val}`, cambio, anon),
          await rest.delete(`${v}?${col}=eq.${val}`, anon),
        ]) {
          expect(r.status, v).toBeGreaterThanOrEqual(400);
          expect(["42501", "55000"], v).toContain(codigoDe(r.body));
        }
      }
    });
  });

  describe("R-04: negocio_publico (H-03: anon sin nada; el servidor la lee con la llave de servicio)", () => {
    it("anon no la lista ni filtrando por slug", async () => {
      for (const q of ["negocio_publico?select=slug", "negocio_publico?slug=eq.rls-a"]) {
        const r = await rest.get(q, anon);
        expect(r.status, q).toBe(401);
        expect(codigoDe(r.body), q).toBe("42501");
      }
    });
    it("el servicio solo ve negocios vigentes con alta completa y sin columnas internas", async () => {
      const r = await rest.get<Record<string, unknown>[]>("negocio_publico?select=*&slug=like.rls-*&order=slug", servicio);
      expect(r.status).toBe(200);
      expect(r.body.map((x) => x.slug)).toEqual(["rls-a", "rls-b"]); // fuera: pausa (p), sin alta (s), prueba vencida (v)
      expect(Object.keys(r.body[0]).sort()).toEqual(
        ["color", "limite_minutos", "limite_modo", "logo_path", "nombre", "recompensa", "sello_bienvenida", "sellos_meta", "slug"],
      );
      for (const col of ["id", "correo_dueno", "whatsapp", "estado", "plan", "negocio_id"]) {
        const c = await rest.get(`negocio_publico?select=${col}`, servicio);
        expect(c.status, col).toBe(400);
        expect(codigoDe(c.body), col).toBe("42703");
      }
    });
    it("un negocio en pausa, sin alta o con la prueba vencida no aparece ni filtrando por su slug", async () => {
      for (const s of ["rls-p", "rls-s", "rls-v"]) {
        const r = await rest.get(`negocio_publico?slug=eq.${s}`, servicio);
        expect(r.status).toBe(200);
        expect(r.body).toEqual([]);
      }
    });
  });

  describe("H-01: registro de Auth cerrado", () => {
    it("GET /auth/v1/settings dice disable_signup true y sin autoconfirmación", async () => {
      const r = await llamar<{ disable_signup: boolean; mailer_autoconfirm: boolean; phone_autoconfirm: boolean }>(
        "GET", "/auth/v1/settings", anon);
      expect(r.status).toBe(200);
      expect(r.body.disable_signup).toBe(true);
      expect(r.body.mailer_autoconfirm).toBe(false);
      expect(r.body.phone_autoconfirm).toBe(false);
    });
    it("POST /auth/v1/signup con la llave publicable no crea la cuenta", async () => {
      const r = await llamar<{ error_code?: string; access_token?: string }>("POST", "/auth/v1/signup", {
        ...anon, body: { email: "rls-registro-abierto@rls.lealtab.test", password: "Rls-registro-1234" },
      });
      expect(r.status).toBeGreaterThanOrEqual(400);
      expect(r.body.access_token).toBeUndefined();
      expect(r.body.error_code).toBe("signup_disabled");
    });
    it("signup por teléfono tampoco", async () => {
      const r = await llamar<{ access_token?: string }>("POST", "/auth/v1/signup", {
        ...anon, body: { phone: "529939998888", password: "Rls-registro-1234" },
      });
      expect(r.status).toBeGreaterThanOrEqual(400);
      expect(r.body.access_token).toBeUndefined();
    });
  });

  it.todo("R-03: RPC de cualquier servidor.* falla para anon (aún no hay funciones servidor.*; ver 05-esquemas-servicio y 02_privilegios_por_defecto.test.sql)");
  it.todo("R-01/R-02 (diferidas): evento, dispositivo y por_revisar para anon (tablas de la migración 4, aún no creada)");
});
