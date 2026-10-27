/** Segundos de panel visible que el navegador acumula de N1 a N4. No es HttpOnly: lo escribe el cliente. */
export const COOKIE_DURACION_ALTA = "lt-alta-seg";

/** Entero de 0 a 24 h. Cualquier otro valor cuenta como 0. */
export function duracionDeCookie(valor: string | undefined): number {
  const n = Number(valor);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.floor(n), 86_400);
}
