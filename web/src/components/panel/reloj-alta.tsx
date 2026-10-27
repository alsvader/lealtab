"use client";

import { useEffect } from "react";
import { COOKIE_DURACION_ALTA } from "@/lib/negocio/duracion-alta";

const ACUMULADO = "lt-alta-visible";

let oyentes = 0;
let inicio: number | null = null;

function leerAcumulado(): number {
  const n = Number(sessionStorage.getItem(ACUMULADO) ?? "0");
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Segundos con la pestaña visible desde que se mostró N1. No cuenta el tiempo en segundo plano. */
export function duracionAltaSegundos(): number {
  const parcial = inicio == null || document.hidden ? 0 : Math.round((Date.now() - inicio) / 1000);
  return leerAcumulado() + Math.max(0, parcial);
}

function cerrarTramo() {
  if (inicio == null) return;
  sessionStorage.setItem(ACUMULADO, String(duracionAltaSegundos()));
  inicio = null;
}

export function publicarDuracionAlta(): number {
  const total = duracionAltaSegundos();
  document.cookie = `${COOKIE_DURACION_ALTA}=${total}; Path=/panel; SameSite=Lax; Max-Age=86400`;
  return total;
}

function alCambiarVisibilidad() {
  if (document.hidden) {
    cerrarTramo();
    publicarDuracionAlta();
    return;
  }
  inicio = Date.now();
}

/** Acumula el tiempo visible del alta. Varias copias del marco comparten un solo reloj. */
export function RelojAlta() {
  useEffect(() => {
    oyentes += 1;
    if (oyentes === 1) {
      if (!document.hidden) inicio = Date.now();
      document.addEventListener("visibilitychange", alCambiarVisibilidad);
      window.addEventListener("pagehide", publicarDuracionAlta);
    }
    const pulso = window.setInterval(publicarDuracionAlta, 1000);
    return () => {
      window.clearInterval(pulso);
      oyentes -= 1;
      if (oyentes === 0) {
        cerrarTramo();
        publicarDuracionAlta();
        document.removeEventListener("visibilitychange", alCambiarVisibilidad);
        window.removeEventListener("pagehide", publicarDuracionAlta);
      }
    };
  }, []);
  return null;
}
