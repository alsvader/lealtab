import { mensajeQr } from "./paso";

/** HMAC-SHA256 en hex. Sirve en el navegador (WebCrypto) y en Node. */
export async function hmacPaso(llave: Uint8Array, tarjetaId: string, negocioId: string, paso: number): Promise<string> {
  const raw = llave.buffer.slice(llave.byteOffset, llave.byteOffset + llave.byteLength) as ArrayBuffer;
  const clave = await crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const firma = await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(mensajeQr(tarjetaId, negocioId, paso)));
  return [...new Uint8Array(firma)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function bytesDeBytea(valor: string): Uint8Array | null {
  const hex = valor.startsWith("\\x") ? valor.slice(2) : /^[0-9a-fA-F]+$/.test(valor) && valor.length % 2 === 0 ? valor : "";
  if (!hex || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

export function hexDe(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function bytesDeHex(hex: string): Uint8Array {
  return bytesDeBytea(hex) ?? new Uint8Array();
}
