const PASO_MS = 60_000;

/** Paso del QR: floor(t / 60 s). RF-SEL-04. */
export function pasoDe(ahora = Date.now()): number {
  return Math.floor(ahora / PASO_MS);
}

/** Lo que va dentro del QR: tarjeta, paso y MAC. El MAC cubre tarjeta|negocio|paso. */
export function contenidoQr(tarjetaId: string, paso: number, mac: string): string {
  return `${tarjetaId}|${paso}|${mac}`;
}

export function mensajeQr(tarjetaId: string, negocioId: string, paso: number): string {
  return `${tarjetaId}|${negocioId}|${paso}`;
}
