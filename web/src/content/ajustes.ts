import { ZONAS_MEXICO } from "@/lib/negocio/alta";

export const AJUSTES = {
  titulo: "Ajustes",
  seccion: "Negocio",
  zona: "Zona horaria",
  zonaAyuda: "Se usa para el límite de sellos y la semana. Cambiarla no recalcula el pasado.",
  guardar: "Guardar zona",
  listo: "Listo. La zona quedó guardada.",
  error: "Elige una zona de México.",
  sinSesion: "Entra a tu panel para ver los ajustes.",
  entrar: "Entrar",
  sinNegocio: "Primero termina el alta de tu negocio.",
  alta: "Ir al alta",
  cartel: "Volver al cartel",
} as const;

export const GIRO_ETIQUETA: Record<string, string> = {
  barberia: "Barbería",
  estetica: "Estética o salón",
  tapioca: "Tapioca",
  cafeteria: "Cafetería",
  otro: "Otro",
};

export const ETIQUETA_ZONA: Record<(typeof ZONAS_MEXICO)[number], string> = {
  "America/Mexico_City": "Ciudad de México",
  "America/Cancun": "Cancún",
  "America/Merida": "Mérida",
  "America/Monterrey": "Monterrey",
  "America/Matamoros": "Matamoros",
  "America/Chihuahua": "Chihuahua",
  "America/Ciudad_Juarez": "Ciudad Juárez",
  "America/Ojinaga": "Ojinaga",
  "America/Mazatlan": "Mazatlán",
  "America/Bahia_Banderas": "Bahía de Banderas",
  "America/Hermosillo": "Hermosillo",
  "America/Tijuana": "Tijuana",
};
