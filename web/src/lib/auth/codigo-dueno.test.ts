import { describe, expect, it } from "vitest";
import { codigoNormalizado, correoNormalizado } from "./codigo-dueno";

describe("correoNormalizado", () => {
  it("acepta un correo y lo pasa a minúsculas", () => {
    expect(correoNormalizado("  Ana@LealTab.test ")).toBe("ana@lealtab.test");
  });

  it("rechaza lo que no es un correo, sin decir si existe", () => {
    expect(correoNormalizado("no-es-correo")).toBeNull();
    expect(correoNormalizado("")).toBeNull();
    expect(correoNormalizado(12)).toBeNull();
  });
});

describe("codigoNormalizado", () => {
  it("solo acepta 6 dígitos", () => {
    expect(codigoNormalizado("123456")).toBe("123456");
    expect(codigoNormalizado("12345")).toBeNull();
    expect(codigoNormalizado("1234567")).toBeNull();
    expect(codigoNormalizado("12a456")).toBeNull();
  });
});
