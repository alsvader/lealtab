import { describe, expect, it } from "vitest";
import { destinoQr, tamanoCartel } from "./cartel";

describe("destinoQr", () => {
  it("apunta al registro del negocio y no a un sello", () => {
    expect(destinoQr("http://localhost:3140", "casa-norte")).toBe("http://localhost:3140/c/casa-norte");
    expect(destinoQr("http://localhost:3140/", "casa-norte")).not.toContain("sello");
  });
});

describe("tamanoCartel", () => {
  it("solo acepta carta, media y sticker", () => {
    expect(tamanoCartel("media")).toBe("media");
    expect(tamanoCartel("sticker")).toBe("sticker");
    expect(tamanoCartel("gigante")).toBe("carta");
  });
});
