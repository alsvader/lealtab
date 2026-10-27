import "server-only";
import { crearClienteAdmin } from "@/lib/supabase/admin";

const PAUSA_MS = 15 * 60 * 1000;
const CODIGO_RECIENTE_MS = 10 * 60 * 1000;

export type MetodoIntento = "contrasena" | "codigo" | "restablecer";
export type ResultadoIntento = "incorrecto" | "correcto" | "bloqueado";
export type FilaIntento = { resultado: string; creado_ts: string };

/** 8 a 72 caracteres, sin reglas de mayúsculas, números o símbolos. Los espacios cuentan. */
export function contrasenaValida(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  if (valor.length < 8 || valor.length > 72) return null;
  return valor;
}

export function cerrarOtrasSesiones(valor: unknown): boolean {
  return valor === true;
}

/**
 * Pausa de 15 min desde el fallo más reciente, cuando hay 5 incorrectos seguidos
 * (un acierto corta la racha). Los intentos ya bloqueados no alargan la pausa.
 */
export function enPausa(filas: FilaIntento[], ahora: number): boolean {
  const incorrectos: number[] = [];
  for (const fila of filas) {
    if (fila.resultado === "correcto") break;
    if (fila.resultado === "incorrecto") incorrectos.push(new Date(fila.creado_ts).getTime());
  }
  if (incorrectos.length < 5) return false;
  return ahora - incorrectos[0] < PAUSA_MS;
}

export async function registrarIntento(
  correo: string,
  metodo: MetodoIntento,
  resultado: ResultadoIntento,
): Promise<void> {
  const { error } = await crearClienteAdmin()
    .from("intento_acceso_dueno")
    .insert({ correo, metodo, resultado });
  if (error) console.error("intento_acceso_dueno", error.message);
}

export async function filasContrasena(correo: string): Promise<FilaIntento[]> {
  const { data } = await crearClienteAdmin()
    .from("intento_acceso_dueno")
    .select("resultado, creado_ts")
    .eq("correo", correo)
    .eq("metodo", "contrasena")
    .order("creado_ts", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function codigoReciente(correo: string, ahora = Date.now()): Promise<boolean> {
  const { data } = await crearClienteAdmin()
    .from("intento_acceso_dueno")
    .select("creado_ts")
    .eq("correo", correo)
    .in("metodo", ["codigo", "restablecer"])
    .eq("resultado", "correcto")
    .order("creado_ts", { ascending: false })
    .limit(1);
  const ts = data?.[0]?.creado_ts;
  return !!ts && ahora - new Date(ts).getTime() < CODIGO_RECIENTE_MS;
}
