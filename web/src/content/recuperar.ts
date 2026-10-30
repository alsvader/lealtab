/** Recuperación. Fuente: docs/fase-7/microcopy.md §3. */

export const RECUPERAR = {
  titulo: "Recupera tus tarjetas",
  cuerpo: "Escribe tu WhatsApp. Te mandamos un código para entrar a todas tus tarjetas.",
  whatsapp: "Tu WhatsApp",
  ayuda: "10 dígitos. Si cambiaste de teléfono, escribe tu número de antes.",
  enviar: "Enviarme el código",
  enviando: "Enviando código…",
  enviandoVivo: "Enviando tu código.",
  telefonoCorto: "Error: escribe tus 10 dígitos, por ejemplo 993 123 4567.",
  telefonoOtro: "Error: por ahora solo aceptamos celulares de México, de 10 dígitos. Por ejemplo, 993 123 4567.",
  telefonoServidor: "Por ahora solo aceptamos celulares de México, de 10 dígitos. Revisa tu número.",
  sinNumero: "¿Ya no tienes ese número?",
  sinNumeroTitulo: "Si ya no tienes ese número",
  sinNumeroCuerpo:
    "No podemos pasar tus sellos a un número nuevo. Puedes empezar de cero con tu número de ahora: escanea el QR de tu negocio y regístrate.",
  codigoTitulo: "Escribe tu código",
  codigoCuerpo: (telefono: string) => `Te lo mandamos por WhatsApp al ${telefono}. Dura 10 minutos.`,
  codigoEtiqueta: "Código de 6 dígitos",
  entrar: "Entrar",
  verificando: "Verificando…",
  verificandoVivo: "Verificando tu código.",
  codigoError: "Ese código no es el correcto. Revisa los 6 dígitos.",
  cambiar: "Cambiar número",
  listo: "Listo, aquí están tus tarjetas.",
  listoVivo: "Número verificado. Aquí están tus tarjetas.",
  seguro: "Más seguro",
  seguroCuerpo:
    "Por tu seguridad, cerramos tus tarjetas en otros teléfonos y navegadores. Si las necesitas ahí, entra de nuevo con un código.",
  entendido: "Entendido",
  pregunta: "Pregunta en el mostrador de un negocio donde tengas tu tarjeta: ahí te ayudan.",
  sinConexion: "Sin conexión",
  sinConexionCuerpo:
    "Para crear tu tarjeta hace falta internet. Lo que escribiste se queda aquí; inténtalo cuando vuelva la señal.",
  hecho: "Hecho con",
  marca: "LealTab",
  prefijo: "+52",
} as const;
