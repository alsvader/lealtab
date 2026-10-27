import { describe, expect, it } from "vitest";
import { duracionDeCookie } from "./duracion-alta";

describe("duracionDeCookie", () => {
  it("acepta un entero y rechaza lo demás", () => {
    expect(duracionDeCookie("42")).toBe(42);
    expect(duracionDeCookie("42.9")).toBe(42);
    expect(duracionDeCookie("-1")).toBe(0);
    expect(duracionDeCookie("no")).toBe(0);
    expect(duracionDeCookie(undefined)).toBe(0);
    expect(duracionDeCookie("999999")).toBe(86_400);
  });
});
