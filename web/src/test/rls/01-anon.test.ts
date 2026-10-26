import { describe, expect, it } from "vitest";
import { CON_RLS, SOLO_SERVICIO, VISTAS_PRIVADAS, codigoDe, rest } from "./helpers";

const anon = { rol: "anon" as const };
const sinNegocioPublico = [...SOLO_SERVICIO, ...CON_RLS];

describe("anon (R-01 a R-04)", () => {
  describe("R-01: SELECT en cada tabla y vista, salvo negocio_publico", () => {
    for (const t of sinNegocioPublico) {
      it(`${t.nombre}: 401 con 42501`, async () => {
        const r = await rest.get(`${t.nombre}?select=*`, anon);
        expect(r.status).toBe(401);
        expect(codigoDe(r.body)).toBe("42501");
      });
    }
    for (const v of VISTAS_PRIVADAS) {
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

  describe("R-04: negocio_publico", () => {
    it("solo expone las columnas esperadas y solo negocios vigentes con alta completa", async () => {
      const r = await rest.get<Record<string, unknown>[]>("negocio_publico?select=*&slug=like.rls-*&order=slug", anon);
      expect(r.status).toBe(200);
      expect(r.body.map((x) => x.slug)).toEqual(["rls-a", "rls-b"]); // fuera: pausa (p), sin alta (s), prueba vencida (v)
      expect(Object.keys(r.body[0]).sort()).toEqual(
        ["color", "limite_minutos", "limite_modo", "logo_path", "nombre", "recompensa", "sello_bienvenida", "sellos_meta", "slug"],
      );
    });
    it("no expone columnas internas por nombre (correo, whatsapp, id, estado)", async () => {
      for (const col of ["id", "correo_dueno", "whatsapp", "estado", "plan", "negocio_id"]) {
        const r = await rest.get(`negocio_publico?select=${col}`, anon);
        expect(r.status, col).toBe(400);
        expect(codigoDe(r.body), col).toBe("42703");
      }
    });
    it("un negocio en pausa, sin alta o con la prueba vencida no aparece ni filtrando por su slug", async () => {
      for (const s of ["rls-p", "rls-s", "rls-v"]) {
        const r = await rest.get(`negocio_publico?slug=eq.${s}`, anon);
        expect(r.status).toBe(200);
        expect(r.body).toEqual([]);
      }
    });
  });

  it.todo("R-03: RPC de cualquier servidor.* falla para anon (aún no hay funciones servidor.*; ver 05-esquemas-servicio y 02_privilegios_por_defecto.test.sql)");
  it.todo("R-01/R-02 (diferidas): evento, dispositivo y por_revisar para anon (tablas de la migración 4, aún no creada)");
});
