import { describe, expect, it } from "vitest";
import { destinoQr, tamanoCartel, vistaPreviaQr } from "./cartel";

describe("destinoQr", () => {
  it("apunta al registro del negocio y no a un sello", () => {
    expect(destinoQr("http://localhost:3140", "casa-norte")).toBe("http://localhost:3140/c/casa-norte");
    expect(destinoQr("http://localhost:3140/", "casa-norte")).not.toContain("sello");
  });
});

describe("vistaPreviaQr", () => {
  it("devuelve un PNG del registro y no cuenta como descarga", async () => {
    const url = destinoQr("http://localhost:3140", "casa-norte");
    const imagen = await vistaPreviaQr(url);
    expect(imagen.startsWith("data:image/png;base64,")).toBe(true);
    expect(imagen).not.toContain("/panel/api/cartel");
  });
});

describe("tamanoCartel", () => {
  it("solo acepta carta, media y sticker", () => {
    expect(tamanoCartel("media")).toBe("media");
    expect(tamanoCartel("sticker")).toBe("sticker");
    expect(tamanoCartel("gigante")).toBe("carta");
  });
});
