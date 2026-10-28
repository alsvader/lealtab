import { describe, expect, it } from "vitest";
import { giroNegocio, inicialesNegocio, mostrarWhatsapp, slugBase, whatsappCliente, whatsappNegocio, zonaNegocio } from "./alta";

describe("zonaNegocio", () => {
  it("conserva una zona de México y usa Ciudad de México si no lo es", () => {
    expect(zonaNegocio("America/Cancun")).toBe("America/Cancun");
    expect(zonaNegocio("America/Bogota")).toBe("America/Mexico_City");
    expect(zonaNegocio(undefined)).toBe("America/Mexico_City");
  });
});

describe("slugBase e iniciales", () => {
  it("pasa el nombre a un slug y toma las dos primeras iniciales", () => {
    expect(slugBase("Barbería Vélez")).toBe("barberia-velez");
    expect(slugBase("Panel")).toBe("negocio");
    expect(inicialesNegocio("Barbería Vélez")).toBe("BV");
  });
});

describe("whatsapp y giro", () => {
  it("normaliza el teléfono y solo acepta los giros del esquema", () => {
    expect(whatsappNegocio("993 111 2233")).toBe("+529931112233");
    expect(whatsappNegocio("+52 993 111 2233")).toBe("+529931112233");
    expect(whatsappNegocio("123")).toBeNull();
    expect(giroNegocio("estetica")).toBe("estetica");
    expect(giroNegocio("gym")).toBeNull();
    expect(whatsappCliente("993 123 4567")).toEqual({ ok: true, e164: "+529931234567", nacional: "9931234567" });
    expect(whatsappCliente("+52 993-123-4567")).toEqual({ ok: true, e164: "+529931234567", nacional: "9931234567" });
    expect(whatsappCliente("99312")).toEqual({ ok: false, motivo: "corto" });
    expect(whatsappCliente("+1 415 555 2671")).toMatchObject({ ok: false, motivo: "otro" });
    expect(mostrarWhatsapp("9931234567")).toBe("993 123 4567");
  });
});
