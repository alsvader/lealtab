import { describe, expect, it } from "vitest";
import { bytesDeHex, hmacPaso } from "./hmac";
import { contenidoQr, pasoDe } from "./paso";

describe("paso del QR", () => {
  it("cambia cada 60 segundos", () => {
    expect(pasoDe(0)).toBe(0);
    expect(pasoDe(59_999)).toBe(0);
    expect(pasoDe(60_000)).toBe(1);
  });

  it("el MAC cambia con el paso y no con el orden de los campos", async () => {
    const llave = bytesDeHex("11".repeat(32));
    const a = await hmacPaso(llave, "tarjeta", "negocio", 1);
    const b = await hmacPaso(llave, "tarjeta", "negocio", 2);
    expect(a).toHaveLength(64);
    expect(b).not.toBe(a);
    expect(contenidoQr("tarjeta", 1, a)).toBe(`tarjeta|1|${a}`);
  });
});
