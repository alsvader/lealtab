import { describe, expect, it } from "vitest";
import { lineaHookEnviado, telefonoMexico } from "./hook-sms";

describe("telefonoMexico", () => {
  it("acepta 10 dígitos o +52 y rechaza el resto", () => {
    expect(telefonoMexico("9931112233")).toBe("+529931112233");
    expect(telefonoMexico("+52 993 111 2233")).toBe("+529931112233");
    expect(telefonoMexico("+14155550123")).toBeNull();
    expect(telefonoMexico("123")).toBeNull();
  });
});

describe("lineaHookEnviado", () => {
  it("no incluye el código ni el teléfono", () => {
    expect(lineaHookEnviado("847291", "+529931112233")).toBe("[HOOK] enviado");
  });
});
