/**
 * Textos de C1 paso 1. Fuente: docs/fase-7/microcopy.md §1.1 y §1.2.
 * La frase legal del envío al proveedor sigue en PQ-18 y no se inventa aquí.
 */

export const REGISTRO = {
  paso: "Paso 1 de 2",
  titulo: (recompensa: string) => `Junta sellos y gana ${recompensa}`,
  subtitulo: "Tu tarjeta digital siempre a un toque.",
  nombre: "Tu nombre",
  whatsapp: "Tu WhatsApp",
  whatsappAyuda:
    "10 dígitos. Si ya usas LealTab en otro negocio, escribe el mismo número y ahí tendrás todas tus tarjetas.",
  avisoTitulo: "Tus datos, claros.",
  aviso: (negocio: string) =>
    `${negocio} usará tu nombre y WhatsApp solo para tu tarjeta de lealtad. No los vendemos ni los compartimos.`,
  avisoEnlace: "Lee el aviso de privacidad",
  avisoHref: "/aviso-de-privacidad",
  casilla: "Acepto el aviso de privacidad",
  enviar: "Enviarme el código",
  bajoBoton: "Te mandamos un código por WhatsApp para confirmar que el número es tuyo.",
  enviando: "Enviando código…",
  enviandoVivo: "Enviando tu código.",
  nombreError: "Error: escribe tu nombre.",
  telefonoCorto: "Error: escribe tus 10 dígitos, por ejemplo 993 123 4567.",
  telefonoOtro: "Error: por ahora solo aceptamos celulares de México, de 10 dígitos. Por ejemplo, 993 123 4567.",
  telefonoServidor: "Por ahora solo aceptamos celulares de México, de 10 dígitos. Revisa tu número.",
  casillaError: "Error: para continuar, acepta el aviso de privacidad.",
  sinConexion: "Sin conexión",
  sinConexionCuerpo:
    "Para crear tu tarjeta hace falta internet. Lo que escribiste se queda aquí; inténtalo cuando vuelva la señal.",
  intentar: "Intentar de nuevo",
  codigoTitulo: "Escribe tu código",
  codigoCuerpo: (telefono: string) => `Te lo mandamos por WhatsApp al ${telefono}. Dura 10 minutos.`,
  codigoEtiqueta: "Código de 6 dígitos",
  crear: "Crear mi tarjeta",
  verificando: "Verificando…",
  verificandoVivo: "Verificando tu código.",
  codigoError: "Ese código no es el correcto. Revisa los 6 dígitos.",
  cambiar: "Cambiar número",
  pregunta: (negocio: string) => `Pregunta en el mostrador de ${negocio}: ahí te ayudan.`,
  listaTitulo: "Tu tarjeta está lista",
  listaCuerpo: (negocio: string) => `Número verificado. Tu tarjeta de ${negocio} ya está en tu celular.`,
  bienvenida: "Tu sello de bienvenida ya está aquí.",
  sellos: (n: number, meta: number) => `${n}/${meta}`,
  yaTienes: (negocio: string) => `Ya tienes tu tarjeta de ${negocio}.`,
  hecho: "Hecho con",
  marca: "LealTab",
  prefijo: "+52",
} as const;

/** R1 con sesión. Fuente: microcopy.md §2.1. */
export const SEGUNDO = {
  titulo: (negocio: string) => `Agrega tu tarjeta de ${negocio}`,
  subtitulo: "Ya tienes tu cuenta de LealTab. Solo confirma tu nombre para este negocio.",
  cuenta: (last4: string) => `Entraste con el número que termina en ${last4}.`,
  otro: "¿No eres tú? Usar otro número",
  otroEtiqueta: "Usar otro número de WhatsApp",
  nombre: (negocio: string) => `Tu nombre en ${negocio}`,
  nombreAyuda: "Usamos el último nombre que diste. Puedes cambiarlo: cada negocio guarda el que le das aquí y ningún otro negocio lo ve.",
  nombreAyudaVacio: "Cada negocio guarda el nombre que le das aquí. Ningún otro negocio lo ve.",
  avisoTitulo: "Tus datos, claros.",
  aviso: (negocio: string) =>
    `${negocio} usará tu nombre y WhatsApp solo para tu tarjeta de lealtad. No los vendemos ni los compartimos.`,
  avisoEnlace: "Lee el aviso de privacidad",
  avisoHref: "/aviso-de-privacidad",
  casilla: (negocio: string) => `Acepto el aviso de privacidad de ${negocio}`,
  casillaError: (negocio: string) => `Error: para continuar, acepta el aviso de privacidad de ${negocio}.`,
  agregar: "Agregar mi tarjeta",
  agregando: "Agregando…",
  nombreError: "Error: escribe tu nombre.",
  guardarError: "No pudimos agregar tu tarjeta. No se guardó nada. Inténtalo de nuevo.",
  sinConexion: "Sin conexión",
  sinConexionCuerpo: "Para agregar tu tarjeta hace falta internet. Inténtalo cuando vuelva la señal.",
  listo: (negocio: string) => `Listo, agregamos tu tarjeta de ${negocio} a Mis tarjetas.`,
  bienvenida: "Listo. Tu sello de bienvenida ya está aquí.",
} as const;
