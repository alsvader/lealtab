import { Webhook } from "standardwebhooks";
import { expect, test } from "./fixtures";

const TELEFONO = "+529931110288";

function secretoBase(): string {
  const valor = process.env.SEND_SMS_HOOK_SECRET ?? "";
  const sinVersion = valor.replace(/^v1,/, "");
  return sinVersion.startsWith("whsec_") ? sinVersion.slice("whsec_".length) : sinVersion;
}

function firmado(cuerpo: string, firma?: string) {
  const id = `msg_${Date.now()}`;
  const ahora = new Date();
  const wh = new Webhook(secretoBase());
  return {
    data: cuerpo,
    headers: {
      "content-type": "application/json",
      "webhook-id": id,
      "webhook-timestamp": String(Math.floor(ahora.getTime() / 1000)),
      "webhook-signature": firma ?? wh.sign(id, ahora, cuerpo),
    },
  };
}

function servicio() {
  return {
    Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
    apikey: process.env.SUPABASE_SECRET_KEY!,
  };
}

test("el hook rechaza una firma mala y con una buena marca el envío sin filtrar el código", async ({ request }) => {
  const carga = JSON.stringify({ user: { phone: TELEFONO }, sms: { otp: "847291" } });
  const mala = await request.post("/api/hooks/send-sms", firmado(carga, "v1,firma-mala"));
  const textoMalo = await mala.text();
  expect(mala.status()).toBe(401);
  expect(textoMalo).not.toContain("whsec");
  expect(textoMalo).not.toContain("847291");

  const buena = await request.post("/api/hooks/send-sms", firmado(carga));
  expect(buena.status()).toBe(200);

  const filas = (await (
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/envio_codigo?telefono=eq.${encodeURIComponent(TELEFONO)}&select=resultado,canal`,
      { headers: servicio() },
    )
  ).json()) as { resultado: string; canal: string }[];
  expect(filas.some((f) => f.resultado === "enviado" && f.canal === "whatsapp")).toBe(true);

  await fetch(`${process.env.SUPABASE_URL}/rest/v1/envio_codigo?telefono=eq.${encodeURIComponent(TELEFONO)}`, {
    method: "DELETE",
    headers: servicio(),
  });
});
