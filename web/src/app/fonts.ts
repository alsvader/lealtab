import { Archivo, Manrope } from "next/font/google";

/**
 * Archivo es variable: pesos 100-900 por defecto + eje de ancho (`wdth` 62-125).
 * La landing usa `font-variation-settings: "wdth" 75, "wght" 800` y
 * `font-stretch: condensed`, así que el eje `wdth` tiene que llegar al navegador.
 * La variable CSS alimenta `--font-display` en src/styles/tokens.css.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
  // La landing usa Archivo condensado (wdth 75). El fallback automático de next/font imita
  // a Arial de ancho normal (más ancho); sin él, la cadena cae a "Arial Narrow" como en tokens.css.
  // OJO: Turbopack (Next 16.4.0) ignora esta opción y sigue generando "Archivo Fallback";
  // con webpack sí se respeta. Solo afecta el instante previo a que cargue la fuente.
  adjustFontFallback: false,
});

/** Manrope 400-700 (variable, pero se fija el rango usado). Alimenta `--font-body`. */
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
  // Sin "Manrope Fallback" (Arial), los glifos que Manrope no trae (p. ej. "→") caen a
  // system-ui como en la v1.7. Turbopack 16.4 la ignora; por eso tokens.css nombra la familia directamente.
  adjustFontFallback: false,
});
