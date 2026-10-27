import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOMBRES_ENTORNO } from "@/lib/env";

// Si la guarda fallara, estas llamadas revelarían que se intentó tocar Supabase.
const admin = vi.fn();
const servidor = vi.fn();
vi.mock("./admin", () => ({ crearClienteAdmin: admin }));
vi.mock("./server", () => ({ crearClienteServidor: servidor }));

const { devSesionPermitida, manejarDevSesion } = await import("./dev-sesion");

const pedir = (cuerpo: unknown) =>
  new Request("http://localhost/c/api/auth/dev-sesion", { method: "POST", body: JSON.stringify(cuerpo) });

function supabaseLocal() {
  vi.stubEnv("SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_ficticia");
  vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_ficticia");
}

beforeEach(() => {
  for (const n of NOMBRES_ENTORNO) vi.stubEnv(n, "");
  admin.mockReset();
  servidor.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("ruta de desarrollo dev-sesion", () => {
  it.each(["preview", "production", "", "Local", "local "])("con LT_ENV=%j responde 404 y no toca Supabase", async (valor) => {
    supabaseLocal();
    vi.stubEnv("LT_ENV", valor);
    expect(devSesionPermitida()).toBe(valor.trim() === "local");
    if (valor.trim() === "local") return; // "local " se recorta como lo hace env.ts
    for (const rol of ["cliente", "dueno"] as const) {
      const r = await manejarDevSesion(rol, pedir({ usuario: "velez@lealtab.test" }));
      expect(r.status).toBe(404);
    }
    expect(admin).not.toHaveBeenCalled();
    expect(servidor).not.toHaveBeenCalled();
  });

  it("sin LT_ENV responde 404", async () => {
    supabaseLocal();
    expect((await manejarDevSesion("dueno", pedir({ usuario: "velez@lealtab.test" }))).status).toBe(404);
  });

  it("con LT_ENV=local pero sin Supabase configurado responde 404", async () => {
    vi.stubEnv("LT_ENV", "local");
    expect((await manejarDevSesion("dueno", pedir({ usuario: "velez@lealtab.test" }))).status).toBe(404);
    expect(admin).not.toHaveBeenCalled();
  });

  it.each(["https://abc.supabase.co", "http://127.0.0.1.malo.test", "http://localhost.evil.test:54321"])(
    "con LT_ENV=local pero SUPABASE_URL=%s (no local) responde 404",
    async (url) => {
      supabaseLocal();
      vi.stubEnv("LT_ENV", "local");
      vi.stubEnv("SUPABASE_URL", url);
      expect(devSesionPermitida()).toBe(false);
      expect((await manejarDevSesion("dueno", pedir({ usuario: "velez@lealtab.test" }))).status).toBe(404);
      expect(admin).not.toHaveBeenCalled();
    },
  );

  it("en local solo acepta usuarios de la semilla (400 si no)", async () => {
    supabaseLocal();
    vi.stubEnv("LT_ENV", "local");
    expect(devSesionPermitida()).toBe(true);
    for (const usuario of ["jefe@empresa.com", "", 5, "+525500000000"]) {
      const r = await manejarDevSesion(usuario === "+525500000000" ? "cliente" : "dueno", pedir({ usuario }));
      expect(r.status).toBe(400);
    }
    expect(admin).not.toHaveBeenCalled();
    expect(servidor).not.toHaveBeenCalled();
  });
});
