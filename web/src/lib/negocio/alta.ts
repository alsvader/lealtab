/** Zonas IANA de México que acepta negocio.zona_horaria. */
export const ZONAS_MEXICO = [
  "America/Mexico_City",
  "America/Cancun",
  "America/Merida",
  "America/Monterrey",
  "America/Matamoros",
  "America/Chihuahua",
  "America/Ciudad_Juarez",
  "America/Ojinaga",
  "America/Mazatlan",
  "America/Bahia_Banderas",
  "America/Hermosillo",
  "America/Tijuana",
] as const;

const RESERVADOS = new Set(["recuperar", "cuenta", "privacidad", "registro", "api", "logo", "iconos", "offline", "panel", "c", "admin"]);

const GIROS = new Set(["barberia", "estetica", "tapioca", "cafeteria", "otro"]);

const ACENTOS: Record<string, string> = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u", ñ: "n",
};

/** Si la zona no es de México, queda la de la Ciudad de México. */
export function zonaNegocio(valor: unknown): string {
  return typeof valor === "string" && (ZONAS_MEXICO as readonly string[]).includes(valor)
    ? valor
    : "America/Mexico_City";
}

export function giroNegocio(valor: unknown): string | null {
  return typeof valor === "string" && GIROS.has(valor) ? valor : null;
}

/** Diez dígitos nacionales, o un E.164 +52 ya armado. */
export function whatsappNegocio(valor: unknown): string | null {
  if (typeof valor !== "string") return null;
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length === 10) return `+52${digitos}`;
  if (digitos.length === 12 && digitos.startsWith("52")) return `+${digitos}`;
  return null;
}

export type WhatsappCliente =
  | { ok: true; e164: string; nacional: string }
  | { ok: false; motivo: "corto" | "otro" };

/** Distingue un número corto de uno que no es de México, para el error del paso 1. */
export function whatsappCliente(valor: string): WhatsappCliente {
  const e164 = whatsappNegocio(valor);
  if (e164) return { ok: true, e164, nacional: e164.slice(3) };
  const digitos = valor.replace(/\D/g, "");
  const otroPais = digitos.length > 12 || (digitos.length >= 11 && !digitos.startsWith("52"));
  return { ok: false, motivo: otroPais ? "otro" : "corto" };
}

/** 9931234567 → «993 123 4567». */
export function mostrarWhatsapp(nacional: string): string {
  return `${nacional.slice(0, 3)} ${nacional.slice(3, 6)} ${nacional.slice(6)}`;
}

export function textoNegocio(valor: unknown, max: number): string | null {
  if (typeof valor !== "string") return null;
  const texto = valor.trim();
  if (texto.length < 1 || texto.length > max) return null;
  return texto;
}

/** Base del slug. La función de la base le pone sufijo si ya existe o está reservado. */
export function slugBase(nombre: string): string {
  const plano = nombre
    .toLowerCase()
    .split("")
    .map((c) => ACENTOS[c] ?? c)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  if (plano.length < 3 || RESERVADOS.has(plano)) return "negocio";
  return plano;
}

export function inicialesNegocio(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const letras = partes.slice(0, 2).map((p) => p[0]?.toLocaleUpperCase("es-MX") ?? "");
  const texto = letras.join("");
  return texto || "LT";
}
