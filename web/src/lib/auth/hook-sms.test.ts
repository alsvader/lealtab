import { Webhook } from "standardwebhooks";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CierreEnvio } from "./hook-sms";
import { lineaHookEnviado, recibirHook, telefonoMexico } from "./hook-sms";
import { URL_OTP, type FetchOtp } from "./sms-masivos";

const CRUDO = Buffer.from("0123456789abcdef0123456789abcdef").toString("base64");
const SECRETO = `v1,whsec_${CRUDO}`;

function firma(cuerpo: string) {
  const id = "msg_prueba";
  const ahora = new Date();
  const wh = new Webhook(CRUDO);
  return new Headers({
    "webhook-id": id,
    "webhook-timestamp": String(Math.floor(ahora.getTime() / 1000)),
    "webhook-signature": wh.sign(id, ahora, cuerpo),
  });
}

function entorno(modo: "stub" | "sandbox" | "live") {
  vi.stubEnv("SEND_SMS_HOOK_SECRET", SECRETO);
  vi.stubEnv("SMS_PROVIDER_MODE", modo);
  vi.stubEnv("LT_ENV", "local");
  vi.stubEnv("SMSMASIVOS_API_KEY", "llave-de-prueba");
}

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

const CARGA = JSON.stringify({ user: { phone: "+529931112233" }, sms: { otp: "847291" } });

function jsonRespuesta(status: number, datos: unknown) {
  return new Response(JSON.stringify(datos), { status, headers: { "Content-Type": "application/json" } });
}

describe("recibirHook", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("en stub no llama al proveedor y marca enviado", async () => {
    entorno("stub");
    const fetchImpl = vi.fn<FetchOtp>();
    const cerrar = vi.fn(async () => {});
    const respuesta = await recibirHook(CARGA, firma(CARGA), {
      autorizar: async () => ({ permitido: true, motivo: null, canal_intencion: "auto", id: 7 }),
      cerrar,
      fetchImpl,
    });
    expect(respuesta.status).toBe(200);
    expect(await respuesta.text()).toBe("");
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(cerrar).toHaveBeenCalledWith(7, { resultado: "enviado", canal: "whatsapp", requestId: null });
    const logs = vi.mocked(console.info).mock.calls.flat().join(" ");
    expect(logs).not.toContain("847291");
    expect(logs).not.toContain("9931112233");
  });

  it("en sandbox empieza por WhatsApp y, si no se entrega, reintenta por SMS", async () => {
    entorno("sandbox");
    const canales: string[] = [];
    const fetchImpl = vi.fn<FetchOtp>(async (url, init) => {
      expect(url).toBe(URL_OTP);
      const cuerpo = JSON.parse(String(init?.body)) as { channel: string; sandbox?: boolean; code_custom: string };
      canales.push(cuerpo.channel);
      expect(cuerpo.sandbox).toBe(true);
      expect(cuerpo.code_custom).toBe("847291");
      if (cuerpo.channel === "whatsapp") return jsonRespuesta(502, { error: "otp_send_failed" });
      return jsonRespuesta(200, { request_id: "req-sms" });
    });
    const cierres: CierreEnvio[] = [];
    const respuesta = await recibirHook(CARGA, firma(CARGA), {
      autorizar: async () => ({ permitido: true, motivo: null, canal_intencion: "auto", id: 8 }),
      cerrar: async (_id, cierre) => {
        cierres.push(cierre);
      },
      fetchImpl,
    });
    expect(respuesta.status).toBe(200);
    expect(canales).toEqual(["whatsapp", "sms"]);
    expect(cierres).toEqual([{ resultado: "enviado_por_respaldo", canal: "sms", requestId: "req-sms" }]);
  });

  it("con intención sms hace un solo intento y no cambia de canal", async () => {
    entorno("live");
    const fetchImpl = vi.fn<FetchOtp>(async (_url, init) => {
      const cuerpo = JSON.parse(String(init?.body)) as { channel: string; sandbox?: boolean };
      expect(cuerpo.channel).toBe("sms");
      expect(cuerpo.sandbox).toBeUndefined();
      return jsonRespuesta(201, { request_id: "req-live" });
    });
    const cerrar = vi.fn(async () => {});
    const respuesta = await recibirHook(CARGA, firma(CARGA), {
      autorizar: async () => ({ permitido: true, motivo: null, canal_intencion: "sms", id: 9 }),
      cerrar,
      fetchImpl,
    });
    expect(respuesta.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(cerrar).toHaveBeenCalledWith(9, { resultado: "enviado", canal: "sms", requestId: "req-live" });
  });

  it("400, 402 y 429 no cambian de canal", async () => {
    for (const status of [400, 402, 429]) {
      entorno("sandbox");
      const fetchImpl = vi.fn<FetchOtp>(async () => jsonRespuesta(status, { error: "otp" }));
      const respuesta = await recibirHook(CARGA, firma(CARGA), {
        autorizar: async () => ({ permitido: true, motivo: null, canal_intencion: "auto", id: 1 }),
        cerrar: async () => {},
        fetchImpl,
      });
      expect(fetchImpl).toHaveBeenCalledTimes(1);
      expect(respuesta.status).toBe(status);
      expect(await respuesta.text()).not.toContain("847291");
    }
  });

  it("si los dos canales fallan no marca enviado", async () => {
    entorno("sandbox");
    const cerrar = vi.fn(async () => {});
    const fetchImpl = vi.fn<FetchOtp>(async () => jsonRespuesta(502, { error: "otp_send_failed" }));
    const respuesta = await recibirHook(CARGA, firma(CARGA), {
      autorizar: async () => ({ permitido: true, motivo: null, canal_intencion: "auto", id: 4 }),
      cerrar,
      fetchImpl,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(respuesta.status).toBe(502);
    expect(cerrar).toHaveBeenCalledWith(4, { resultado: "fallido", canal: "sms", requestId: null });
  });

  it("stub fuera de local no arranca", async () => {
    vi.stubEnv("SMS_PROVIDER_MODE", "stub");
    vi.stubEnv("LT_ENV", "production");
    vi.stubEnv("SEND_SMS_HOOK_SECRET", SECRETO);
    await expect(recibirHook(CARGA, firma(CARGA))).rejects.toThrow(/stub/);
  });
});
