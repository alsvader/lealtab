import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { MENSAJE_SMS, URL_OTP, enviarOtp, mensajeExpandido, venceEnDiezMinutos, type FetchOtp } from "./sms-masivos";

const AHORA = new Date("2026-10-30T06:00:00.000Z");

function pedido(sobre: Partial<Parameters<typeof enviarOtp>[0]> = {}) {
  return {
    telefono: "+529931112233",
    codigo: "123456",
    canal: "whatsapp" as const,
    sandbox: false,
    apiKey: "llave-de-prueba",
    ahora: AHORA,
    ...sobre,
  };
}

describe("mensaje", () => {
  it("sustituye el código y cabe en un SMS GSM-7", () => {
    const texto = mensajeExpandido("123456");
    expect(texto).toBe("LealTab: tu clave es 123456. Vence en 10 min. No la compartas.");
    expect(texto.length).toBeLessThanOrEqual(160);
    expect(texto).not.toMatch(/[áéíóúñÁÉÍÓÚÑ]/);
    expect(MENSAJE_SMS).toContain("{{code}}");
    expect(MENSAJE_SMS).toContain("{{company}}");
  });

  it("calcula la vigencia 10 minutos adelante en UTC", () => {
    expect(venceEnDiezMinutos(AHORA)).toBe("2026-10-30 06:10:00");
  });
});

describe("enviarOtp", () => {
  it("manda code_custom y no los campos que chocan con él", async () => {
    const fetchImpl = vi.fn<FetchOtp>(async () => Response.json({ request_id: "req-1" }, { status: 201 }));
    const resultado = await enviarOtp(pedido({ fetchImpl, sandbox: true, canal: "sms" }));

    expect(resultado).toEqual({ ok: true, requestId: "req-1" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    if (!init) throw new Error("falta la petición");
    expect(url).toBe(URL_OTP);
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers.apikey).toBe("llave-de-prueba");
    const cuerpo = JSON.parse(String(init.body)) as Record<string, unknown>;
    expect(cuerpo).toEqual({
      phone_number: "9931112233",
      country_code: "52",
      channel: "sms",
      company: "LealTab",
      message: MENSAJE_SMS,
      code_custom: "123456",
      expiration_date: "2026-10-30 06:10:00",
      sandbox: true,
    });
    expect(cuerpo).not.toHaveProperty("code_length");
    expect(cuerpo).not.toHaveProperty("code_format");
    expect(cuerpo).not.toHaveProperty("code_rotate");
    expect(cuerpo).not.toHaveProperty("code_in_response");
  });

  it("en live no manda sandbox", async () => {
    const fetchImpl = vi.fn<FetchOtp>(async () => new Response("{}", { status: 200 }));
    await enviarOtp(pedido({ fetchImpl, sandbox: false }));
    const init = fetchImpl.mock.calls[0][1];
    if (!init?.body) throw new Error("falta el cuerpo");
    expect(JSON.parse(String(init.body))).not.toHaveProperty("sandbox");
  });

  it("un HTTP 200 con error es fallo y no se reintenta", async () => {
    const fetchImpl = vi.fn<FetchOtp>(async () => Response.json({ error: "auth_invalid" }, { status: 200 }));
    await expect(enviarOtp(pedido({ fetchImpl }))).resolves.toEqual({
      ok: false,
      status: 200,
      reintentable: false,
    });
  });

  it("502 se puede reintentar y 402 o 429 no", async () => {
    const casos = [
      { status: 502, reintentable: true },
      { status: 402, reintentable: false },
      { status: 429, reintentable: false },
      { status: 400, reintentable: false },
    ];
    for (const caso of casos) {
      const fetchImpl = vi.fn<FetchOtp>(async () => Response.json({ error: "x" }, { status: caso.status }));
      await expect(enviarOtp(pedido({ fetchImpl }))).resolves.toMatchObject({
        ok: false,
        status: caso.status,
        reintentable: caso.reintentable,
      });
    }
  });

  it("al agotarse el tiempo responde reintentable y no escribe el cuerpo", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchImpl = vi.fn<FetchOtp>((_url, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(Object.assign(new Error("tiempo"), { name: "TimeoutError" }));
        });
      });
    });
    await expect(enviarOtp(pedido({ fetchImpl, timeoutMs: 15 }))).resolves.toEqual({
      ok: false,
      status: 0,
      reintentable: true,
    });
    const volcado = `${info.mock.calls}${error.mock.calls}`;
    expect(volcado).not.toContain("123456");
    expect(volcado).not.toContain("9931112233");
    info.mockRestore();
    error.mockRestore();
  });
});

describe("config local del SMS", () => {
  it("vence a los 600 segundos y no abre el alta por correo", () => {
    const toml = readFileSync(path.resolve(__dirname, "../../../supabase/config.toml"), "utf8");
    const auth = toml.split(/^\[auth\]$/m)[1]?.split(/^\[/m)[0] ?? "";
    const sms = toml.split(/^\[auth\.sms\]$/m)[1]?.split(/^\[/m)[0] ?? "";
    expect(auth).toContain("enable_signup = false");
    expect(sms).toMatch(/otp_expiry\s*=\s*600/);
    expect(toml).toContain('529931009901 = "847291"');
  });
});
