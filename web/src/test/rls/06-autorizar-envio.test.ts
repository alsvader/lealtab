import { afterAll, expect, it } from "vitest";
import { codigoDe, entornoLocal, llamar, rest, type Opciones } from "./helpers";

const servicio: Opciones = { rol: "service" };
const perfil = { "Content-Profile": "servidor" };
const HORA = "+529931110201";
const DIA = "+529931110202";
const GLOBAL = "+529931110299";

type Autorizacion = { permitido: boolean; motivo: string | null };

function autorizar(telefono: string) {
  return llamar<Autorizacion>("POST", "/rest/v1/rpc/autorizar_envio_codigo", {
    ...servicio,
    body: { p_telefono: telefono },
    headers: perfil,
  });
}

async function limpiar(telefonos: string[]) {
  for (const telefono of telefonos) {
    await rest.delete(`envio_codigo?telefono=eq.${encodeURIComponent(telefono)}`, servicio);
  }
}

async function enviadosEn24h(): Promise<number> {
  const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const env = entornoLocal();
  const res = await fetch(
    `${env.url}/rest/v1/envio_codigo?select=id&resultado=neq.rechazado_limite&hook_ts=gte.${encodeURIComponent(desde)}`,
    {
      headers: {
        apikey: env.secret,
        Authorization: `Bearer ${env.secret}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
    },
  );
  const total = Number((res.headers.get("content-range") ?? "").split("/")[1]);
  return Number.isFinite(total) ? total : 0;
}

afterAll(() => limpiar([HORA, DIA, GLOBAL]));

it("rechaza el cuarto envío de la hora, el undécimo del día, el tope global y un teléfono ajeno", async () => {
  await limpiar([HORA, DIA, GLOBAL]);

  for (let i = 0; i < 3; i += 1) expect((await autorizar(HORA)).body.permitido).toBe(true);
  expect((await autorizar(HORA)).body).toMatchObject({ permitido: false, motivo: "hora" });

  const haceDosHoras = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  for (let i = 0; i < 10; i += 1) {
    const fila = await rest.post(
      "envio_codigo",
      { telefono: DIA, proposito: "registro", resultado: "enviado", hook_ts: haceDosHoras, creado_ts: haceDosHoras },
      servicio,
    );
    expect(fila.status, JSON.stringify(fila.body)).toBe(201);
  }
  expect((await autorizar(DIA)).body).toMatchObject({ permitido: false, motivo: "dia" });

  const tope = await rest.get<[{ valor: number }]>("config_plataforma?clave=eq.codigo_tope_dia&select=valor", servicio);
  expect(tope.body[0].valor).toBe(400);
  const faltan = Math.max(0, 400 - (await enviadosEn24h()));
  const globales: string[] = [];
  for (let i = 0; i < faltan; i += 1) {
    const telefono = `+52${9930000000 + i}`;
    globales.push(telefono);
    expect((await rest.post("envio_codigo", { telefono, proposito: "registro", resultado: "enviado", hook_ts: new Date().toISOString() }, servicio)).status).toBe(201);
  }
  expect((await autorizar(GLOBAL)).body).toMatchObject({ permitido: false, motivo: "global" });
  await limpiar(globales);

  const malo = await autorizar("9931112233");
  expect([malo.status, codigoDe(malo.body)]).toEqual([400, "23514"]);
}, 60_000);
