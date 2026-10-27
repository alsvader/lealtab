import { describe, expect, it } from "vitest";
import { cerrarOtrasSesiones, contrasenaValida, enPausa } from "./intentos-dueno";

const ahora = Date.parse("2026-10-26T22:00:00Z");
const min = 60 * 1000;

describe("contrasenaValida", () => {
  it("acepta 8 a 72 caracteres sin pedir números ni símbolos", () => {
    expect(contrasenaValida("mi barberia")).toBe("mi barberia");
    expect(contrasenaValida("a".repeat(8))).toBe("a".repeat(8));
    expect(contrasenaValida("a".repeat(72))).toBe("a".repeat(72));
  });

  it("rechaza menos de 8 y más de 72", () => {
    expect(contrasenaValida("barber")).toBeNull();
    expect(contrasenaValida("a".repeat(73))).toBeNull();
    expect(contrasenaValida(12345678)).toBeNull();
  });
});

describe("enPausa", () => {
  it("no pausa con menos de 5 fallos, ni si un acierto corta la racha", () => {
    const fallos = Array.from({ length: 4 }, (_, i) => ({
      resultado: "incorrecto",
      creado_ts: new Date(ahora - i * min).toISOString(),
    }));
    expect(enPausa(fallos, ahora)).toBe(false);
    expect(
      enPausa(
        [{ resultado: "incorrecto", creado_ts: new Date(ahora).toISOString() }, { resultado: "correcto", creado_ts: new Date(ahora - min).toISOString() }],
        ahora,
      ),
    ).toBe(false);
  });

  it("pausa 15 minutos desde el quinto fallo y no se alarga con intentos bloqueados", () => {
    const filas = [
      { resultado: "bloqueado", creado_ts: new Date(ahora).toISOString() },
      ...Array.from({ length: 5 }, (_, i) => ({
        resultado: "incorrecto",
        creado_ts: new Date(ahora - (i + 1) * min).toISOString(),
      })),
    ];
    expect(enPausa(filas, ahora)).toBe(true);
    expect(enPausa(filas, ahora + 16 * min)).toBe(false);
  });
});

describe("cerrarOtrasSesiones", () => {
  it("solo es verdadero cuando el cliente lo marca", () => {
    expect(cerrarOtrasSesiones(undefined)).toBe(false);
    expect(cerrarOtrasSesiones(false)).toBe(false);
    expect(cerrarOtrasSesiones("true")).toBe(false);
    expect(cerrarOtrasSesiones(true)).toBe(true);
  });
});
