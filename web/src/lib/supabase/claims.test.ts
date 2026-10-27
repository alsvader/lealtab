import { describe, expect, it } from "vitest";
import { leerSesion } from "./claims";

const con = (claims: unknown, error: unknown = null) => ({
  auth: { getClaims: async () => ({ data: claims ? { claims } : null, error }) },
}) as unknown as Parameters<typeof leerSesion>[0];

describe("leerSesion", () => {
  it("devuelve sub y rol de un token validado con el rol esperado", async () => {
    expect(await leerSesion(con({ sub: "u1", app_metadata: { rol: "dueno" } }), "dueno")).toEqual({ sub: "u1", rol: "dueno" });
  });
  it("niega con otro rol, sin rol, con error o sin sesión", async () => {
    expect(await leerSesion(con({ sub: "u1", app_metadata: { rol: "cliente" } }), "dueno")).toBeNull();
    expect(await leerSesion(con({ sub: "u1" }), "cliente")).toBeNull();
    expect(await leerSesion(con({ sub: "u1", user_metadata: { rol: "dueno" } }), "dueno")).toBeNull();
    expect(await leerSesion(con(null, new Error("jwt inválido")), "cliente")).toBeNull();
  });
});
