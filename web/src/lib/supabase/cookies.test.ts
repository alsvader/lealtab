import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOMBRES_ENTORNO } from "@/lib/env";
import {
  MAX_AGE_POR_DEFECTO,
  aplicarOpciones,
  nombreCookie,
  opcionesCookie,
  rolDeRuta,
} from "./cookies";

beforeEach(() => {
  for (const n of NOMBRES_ENTORNO) vi.stubEnv(n, "");
});
afterEach(() => vi.unstubAllEnvs());

describe("opcionesCookie", () => {
  it("cliente: lt-cliente, Path=/c, HttpOnly, Secure, Lax, 400 días", () => {
    expect(opcionesCookie("cliente")).toEqual({
      name: "lt-cliente",
      path: "/c",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 400 * 86400,
    });
  });

  it("dueño: lt-dueno, Path=/panel, HttpOnly, Secure, Lax, 30 días", () => {
    expect(opcionesCookie("dueno")).toEqual({
      name: "lt-dueno",
      path: "/panel",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 30 * 86400,
    });
  });

  it("el maxAge es configurable y los plazos por defecto son los de trabajo", () => {
    expect(opcionesCookie("cliente", { maxAge: 60 }).maxAge).toBe(60);
    expect(MAX_AGE_POR_DEFECTO).toEqual({ cliente: 34_560_000, dueno: 2_592_000 });
  });

  it("Secure sigue a cookieSecure(): solo LT_COOKIE_SECURE=0 con LT_ENV=local lo apaga", () => {
    vi.stubEnv("LT_COOKIE_SECURE", "0");
    expect(opcionesCookie("cliente").secure).toBe(true); // sin LT_ENV=local se ignora
    vi.stubEnv("LT_ENV", "production");
    expect(opcionesCookie("dueno").secure).toBe(true);
    vi.stubEnv("LT_ENV", "local");
    expect(opcionesCookie("dueno").secure).toBe(false);
  });

  it("los nombres son distintos entre sí", () => {
    expect(nombreCookie("cliente")).not.toBe(nombreCookie("dueno"));
  });
});

describe("aplicarOpciones", () => {
  it("impone HttpOnly, Path y SameSite aunque la biblioteca pida otros (httpOnly: false por defecto)", () => {
    const o = aplicarOpciones("cliente", {
      maxAge: 10,
      // @ts-expect-error simula lo que mandaría @supabase/ssr con sus valores por defecto
      httpOnly: false,
      path: "/",
    });
    expect(o).toMatchObject({ httpOnly: true, path: "/c", sameSite: "lax", secure: true, maxAge: 400 * 86400 });
    expect(o).not.toHaveProperty("name");
  });

  it("la vigencia la fija el rol, no la biblioteca (que manda 400 días siempre)", () => {
    expect(aplicarOpciones("dueno", { maxAge: 400 * 86400 }).maxAge).toBe(30 * 86400);
    expect(aplicarOpciones("cliente", undefined).maxAge).toBe(400 * 86400);
  });

  it("al borrar (maxAge 0) conserva el 0 y el mismo Path", () => {
    expect(aplicarOpciones("dueno", { maxAge: 0 })).toMatchObject({ maxAge: 0, path: "/panel", httpOnly: true });
  });
});

describe("rolDeRuta", () => {
  it.each([
    ["/c", "cliente"],
    ["/c/tarjeta", "cliente"],
    ["/panel", "dueno"],
    ["/panel/clientes", "dueno"],
    ["/", null],
    ["/cafe", null],
    ["/panelista", null],
    ["/api/salud", null],
  ])("%s → %s", (ruta, rol) => {
    expect(rolDeRuta(ruta)).toBe(rol);
  });
});
