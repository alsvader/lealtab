import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { NOMBRES_ENTORNO } from "@/lib/env";
import { config, proxy } from "./proxy";

beforeEach(() => {
  for (const n of NOMBRES_ENTORNO) vi.stubEnv(n, "");
});
afterEach(() => vi.unstubAllEnvs());

describe("proxy.ts", () => {
  it("el matcher es solo /c y /panel", () => {
    expect(config.matcher).toEqual(["/c/:path*", "/panel/:path*"]);
  });

  it("sin Supabase configurado deja pasar sin tocar nada, incluso con cookie de sesión", async () => {
    const r = await proxy(new NextRequest("http://localhost/c", { headers: { cookie: "lt-cliente=basura" } }));
    expect(r.headers.get("x-middleware-next")).toBe("1");
    expect(r.headers.get("set-cookie")).toBeNull();
  });

  it("sin cookie de su rol, no hace nada (ni llama a Supabase)", async () => {
    vi.stubEnv("SUPABASE_URL", "http://127.0.0.1:1");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "sb_publishable_ficticia");
    vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_ficticia");
    const r = await proxy(new NextRequest("http://localhost/panel", { headers: { cookie: "lt-cliente=x" } }));
    expect(r.headers.get("set-cookie")).toBeNull();
    expect(r.headers.get("cache-control")).toBeNull();
  });
});
