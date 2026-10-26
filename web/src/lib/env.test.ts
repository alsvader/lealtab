import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOMBRES_ENTORNO, cookieSecure, env, supabaseConfigurado } from "./env";

beforeEach(() => {
  for (const n of NOMBRES_ENTORNO) vi.stubEnv(n, "");
});
afterEach(() => vi.unstubAllEnvs());

describe("supabaseConfigurado", () => {
  it("es falso y no lanza sin variables", () => {
    expect(() => supabaseConfigurado()).not.toThrow();
    expect(supabaseConfigurado()).toBe(false);
  });

  it("es verdadero con las tres variables de Supabase", () => {
    vi.stubEnv("SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_ficticia");
    vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_ficticia");
    expect(supabaseConfigurado()).toBe(true);
  });

  it("es falso si la URL no es válida", () => {
    vi.stubEnv("SUPABASE_URL", "no-es-url");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "a");
    vi.stubEnv("SUPABASE_SECRET_KEY", "b");
    expect(supabaseConfigurado()).toBe(false);
  });
});

describe("getters perezosos", () => {
  it("lanzan un error claro solo al usarse", () => {
    expect(() => env.supabaseSecretKey()).toThrow(/SUPABASE_SECRET_KEY/);
  });
});

describe("SMS_PROVIDER_MODE", () => {
  it("stub con LT_ENV distinto de local falla", () => {
    vi.stubEnv("SMS_PROVIDER_MODE", "stub");
    vi.stubEnv("LT_ENV", "production");
    expect(() => env.smsProviderMode()).toThrow(/stub/);
  });

  it("stub con LT_ENV=local funciona", () => {
    vi.stubEnv("SMS_PROVIDER_MODE", "stub");
    vi.stubEnv("LT_ENV", "local");
    expect(env.smsProviderMode()).toBe("stub");
  });
});

describe("sin prefijo público", () => {
  it("ningún archivo de src/ usa variables con prefijo NEXT_PUBLIC_", () => {
    const prefijo = "NEXT_PUBLIC" + "_";
    const raiz = path.resolve(__dirname, "..");
    const ofensores: string[] = [];
    const recorrer = (dir: string) => {
      for (const nombre of readdirSync(dir)) {
        const ruta = path.join(dir, nombre);
        if (statSync(ruta).isDirectory()) recorrer(ruta);
        else if (/\.(tsx?|css|mjs|json)$/.test(nombre) && nombre !== "env.test.ts" && readFileSync(ruta, "utf8").includes(prefijo)) {
          ofensores.push(path.relative(raiz, ruta));
        }
      }
    };
    recorrer(raiz);
    expect(ofensores).toEqual([]);
  });
});

describe("cookieSecure (H-13)", () => {
  it("solo es false con LT_COOKIE_SECURE=0 y LT_ENV=local", () => {
    vi.stubEnv("LT_COOKIE_SECURE", "0");
    vi.stubEnv("LT_ENV", "local");
    expect(cookieSecure()).toBe(false);
  });
  it("con LT_ENV distinto de local o ausente, siempre true aunque LT_COOKIE_SECURE=0", () => {
    vi.stubEnv("LT_COOKIE_SECURE", "0");
    for (const e of ["production", "preview", ""]) {
      vi.stubEnv("LT_ENV", e);
      expect(cookieSecure(), e).toBe(true);
    }
  });
  it("por defecto es true", () => {
    vi.stubEnv("LT_ENV", "local");
    expect(cookieSecure()).toBe(true);
  });
});
