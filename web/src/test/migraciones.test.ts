import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

const web = path.resolve(import.meta.dirname, "../..");

function correr(script: string, env: Record<string, string | undefined>, args: string[] = []) {
  const limpio = { ...process.env };
  // Cadena vacía, no unset: .env.local no puede rellenar un candado ni una URL real.
  for (const clave of [
    "VERCEL",
    "VERCEL_ENV",
    "LT_OMITIR_BUILD",
    "LT_CONFIRMA_PRODUCCION",
    "SUPABASE_DB_URL_MIGRACIONES",
    "SUPABASE_DB_URL_PRUEBAS",
    "SUPABASE_REF_PRODUCCION",
    "SUPABASE_REF_PRUEBAS",
  ]) {
    limpio[clave] = "";
  }
  for (const [clave, valor] of Object.entries(env)) {
    if (valor === undefined) delete limpio[clave];
    else limpio[clave] = valor;
  }
  return spawnSync("sh", [path.join("scripts", script), ...args], {
    cwd: web,
    env: limpio,
    encoding: "utf8",
  });
}

describe("vercel-build.sh", () => {
  it("en preview imprime «Vista previa: sin migraciones» y termina en 0", () => {
    const r = correr("vercel-build.sh", { VERCEL_ENV: "preview", LT_OMITIR_BUILD: "1" });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain("Vista previa: sin migraciones");
    expect(r.stdout).not.toContain("Migraciones:");
  });

  it("en producción sin URL de migraciones falla y no llega al push", () => {
    const r = correr("vercel-build.sh", { VERCEL_ENV: "production", LT_OMITIR_BUILD: "1" });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain("Falta SUPABASE_DB_URL_MIGRACIONES");
    expect(r.stdout).not.toContain("Migraciones:");
  });

  it("rechaza saltarse el build cuando corre dentro de Vercel", () => {
    const r = correr("vercel-build.sh", { VERCEL: "1", VERCEL_ENV: "preview", LT_OMITIR_BUILD: "1" });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain("LT_OMITIR_BUILD no se permite en Vercel");
  });
});

describe("db-push.sh", () => {
  const ref = "abcdefghijklmnopqrst";
  const urlProd = `postgresql://postgres:secreta@127.0.0.1:1/postgres?ref=${ref}`;

  it("se niega a migrar producción fuera de Vercel sin LT_CONFIRMA_PRODUCCION=1", () => {
    const r = correr("db-push.sh", {
      SUPABASE_REF_PRODUCCION: ref,
      SUPABASE_DB_URL_MIGRACIONES: urlProd,
    });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain("LT_CONFIRMA_PRODUCCION=1");
    expect(r.stdout).not.toContain("secreta");
  });

  it("trata un host de Supabase alojado sin referencia de pruebas como producción", () => {
    const r = correr("db-push.sh", {
      SUPABASE_DB_URL_MIGRACIONES: "postgresql://postgres:secreta@db.supabase.co.invalid:5432/postgres",
    });
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain("LT_CONFIRMA_PRODUCCION=1");
  });

  it("falla si falta la URL de pruebas y no llama a la CLI", () => {
    const r = correr("db-push.sh", {}, ["--pruebas"]);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain("Falta SUPABASE_DB_URL_PRUEBAS");
  });
});
