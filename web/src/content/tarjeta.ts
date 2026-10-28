/** C0, C3 y C4. Fuentes: pieza 02, RF-APP-09 a 12 y RF-TAR-07. */

export const C0 = {
  titulo: "Mis tarjetas",
  marca: "LealTab",
  faltan: (recompensa: string, n: number) => `${recompensa} · faltan ${n}`,
  lista: "Recompensa lista",
  vacioTitulo: "Aún no tienes tarjetas",
  vacio:
    "Cuando visites un negocio con LealTab, escanea el QR de su mostrador con tu cámara y tu tarjeta aparecerá aquí.",
  recuperar: "Recupera tus tarjetas",
  recuperarHref: "/c/recuperar",
} as const;

export const C3 = {
  muestra: "Muestra este código en mostrador",
  sellos: "sellos",
  faltan: (n: number, recompensa: string) =>
    n === 1 ? `Te falta 1 visita para tu ${recompensa}.` : `Te faltan ${n} visitas para tu ${recompensa}.`,
  cuenta: (sellos: number, meta: number) => `${sellos} de ${meta} sellos`,
  terminos: "Términos de la tarjeta",
  noCaducan: "Tus sellos y tu recompensa no caducan.",
  hecho: "Hecho con",
  marca: "LealTab",
} as const;

export const C4 = {
  listo: (recompensa: string) => `¡Tu ${recompensa} está listo!`,
  canje: "Muéstrale tu código al staff en tu próxima visita para canjearlo.",
  despues: "Después del canje",
  vuelve: (meta: number) => `Tu tarjeta vuelve a 0/${meta} y sigues juntando.`,
  lista: "Recompensa lista",
} as const;
