import { test as base, expect, type APIRequestContext, type APIResponse } from "@playwright/test";

export const CLIENTE_SEMILLA = "+529931000201"; // Ana Prueba
export const DUENO_SEMILLA = "velez@lealtab.test";

/** Nombres de las cookies de sesión, con sus trozos (`nombre.0`, `nombre.1`). */
export const esCookieCliente = (n: string) => /^lt-cliente(\.\d+)?$/.test(n);
export const esCookieDueno = (n: string) => /^lt-dueno(\.\d+)?$/.test(n);

export const test = base.extend<{
  /** Falla si la página escribe un error de consola o una excepción. No mira 4xx: la ruta de desarrollo los usa. */
  guard: void;
  /** Abre sesión con la ruta de desarrollo (solo LT_ENV=local) en el contexto del navegador. */
  abrirSesion: (rol: "cliente" | "dueno") => Promise<APIResponse>;
}>({
  guard: [
    async ({ page }, run) => {
      const problems: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") problems.push(`error: ${m.text()}`);
      });
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
      await run();
      expect(problems, "consola limpia").toEqual([]);
    },
    { auto: true },
  ],
  abrirSesion: async ({ context }, run) => {
    await run(async (rol) => {
      const res = await (context.request as APIRequestContext).post(
        rol === "cliente" ? "/c/api/auth/dev-sesion" : "/panel/api/auth/dev-sesion",
        { data: { usuario: rol === "cliente" ? CLIENTE_SEMILLA : DUENO_SEMILLA } },
      );
      expect(
        res.status(),
        `dev-sesion ${rol}: ${await res.text()}. ¿Supabase local arriba (pnpm db:up), .env.local con LT_ENV=local y semilla (pnpm db:seed)?`,
      ).toBe(200);
      return res;
    });
  },
});

export { expect };
