/**
 * Textos de N1 a N4, tomados de los wireframes aprobados.
 * Pieza 04 (`alta/*.html`) y N1 con contraseña (`docs/fase-7/propuestas/diseno/n1-cuenta-contrasena.html`).
 */

export const PASOS = [
  { id: "cuenta", etiqueta: "1. Cuenta", href: "/panel/alta" },
  { id: "negocio", etiqueta: "2. Tu negocio", href: "/panel/negocio" },
  { id: "tarjeta", etiqueta: "3. Tu tarjeta", href: "/panel/tarjeta" },
  { id: "cartel", etiqueta: "4. QR de mostrador", href: "/panel/cartel" },
] as const;

export type PasoId = (typeof PASOS)[number]["id"];

/** Mismo número público de la landing. Sin texto precargado: la analítica no recibe el mensaje. */
export const AYUDA_WHATSAPP = {
  label: "Ayuda por WhatsApp",
  href: "https://wa.me/525588063606",
} as const;

export const N1 = {
  titulo: "Empieza gratis hoy",
  bajada: "Crea tu cuenta y tu tarjeta en minutos. Sin llamada de ventas y sin tarjeta de crédito.",
  nombre: "Tu nombre",
  correo: "Correo",
  whatsapp: "WhatsApp del negocio",
  whatsappAyuda: "Para soporte y avisos de tu cuenta",
  crear: "Crear cuenta",
  codigoEtiqueta: "Código",
  entrar: "Entrar",
  codigoError: "No pudimos comprobar el código. Revisa los dígitos e inténtalo otra vez.",
  codigoNoValido: "Ese código no es correcto o ya venció. Revisa los 6 dígitos o pide uno nuevo.",
  pedirOtro: "Pedir otro código",
  crearContrasena: "Crear también una contraseña (opcional)",
  crearContrasenaAyuda: "Sin contraseña, entras siempre con un código por correo.",
  correoInvalido: "Escribe un correo válido.",
  codigo:
    "Te enviamos un código a tu correo para entrar, sin contraseña. Al continuar aceptas los términos y el aviso de privacidad.",
  terminos: "términos",
  aviso: "aviso de privacidad",
  pruebaTitulo: "Tu mes de prueba incluye",
  prueba: [
    "Un mes completo gratis, sin tarjeta de crédito",
    "Precios públicos: desde $299 al mes (+IVA)",
    "Tus datos son tuyos: exporta tus clientes en CSV cuando quieras",
    "Si no continúas, tu cuenta se pausa y conservas tu exportación",
    "Soporte por WhatsApp con una persona real",
  ],
  pestanas: "Cómo quieres entrar",
  conCodigo: "Con código",
  conContrasena: "Con contraseña",
} as const;

export const ENTRADA = {
  titulo: "Entra a tu panel",
  enviarCodigo: "Enviar código",
  codigoAyuda: "Te mandamos un código de 6 dígitos que dura 10 minutos.",
  revisa: "Revisa tu correo",
  siTieneCuenta: "Si ese correo tiene cuenta, te enviamos un código de 6 dígitos. Dura 10 minutos.",
  codigoEtiqueta: "Código de 6 dígitos",
  contrasena: "Contraseña",
  mostrar: "Mostrar contraseña",
  ocultar: "Ocultar contraseña",
  entrar: "Entrar",
  entrando: "Entrando…",
  error: "Correo o contraseña incorrectos.",
  pausa: "Contraseña en pausa. Fallaste 5 veces. Mientras tanto, entra con un código.",
  olvidaste: "¿Olvidaste tu contraseña?",
  conCodigo: "Mejor entro con un código",
  nuevaTitulo: "Crea una contraseña nueva",
  nuevaAyuda: "Te mandamos un código de 6 dígitos al correo de tu cuenta. Sirve también si todavía no tienes contraseña.",
  volver: "Volver a entrar",
  contrasenaNueva: "Contraseña nueva",
  contrasenaAyuda: "Mínimo 8 caracteres.",
  corta: "Usa al menos 8 caracteres.",
  cerrarOtras: "Cerrar sesión en mis otros dispositivos",
  cerrarOtrasAyuda: "Si no la marcas, el mostrador sigue abierto.",
  guardar: "Guardar contraseña",
  guardada: "Listo, ya entraste. La próxima vez puedes entrar con tu contraseña o con un código.",
} as const;

export const N2 = {
  titulo: "Cuéntanos de tu negocio",
  bajada: "Así lo verán tus clientes en su tarjeta.",
  nombre: "Nombre del negocio",
  giro: "Giro",
  giros: ["Barbería", "Estética o salón", "Tapioca", "Cafetería", "Otro"],
  ciudad: "Ciudad",
  logo: "Logo",
  logoAyuda: "Opcional. Si no tienes, usamos tus iniciales.",
  logoZona: "Arrastra tu logo o elige un archivo. PNG o JPG.",
  atras: "Atrás",
  continuar: "Continuar",
} as const;

export const N3 = {
  titulo: "Configura tu tarjeta",
  bajada: "Puedes cambiarla después. Los cambios no afectan los sellos ya ganados.",
  sellos: "Número de sellos",
  sellosAyuda: "Entre 4 y 12",
  menos: "Quitar un sello",
  mas: "Agregar un sello",
  recompensa: "Recompensa",
  bienvenida: "Sello de bienvenida",
  bienvenidaAyuda: "Tu cliente recibe su primer sello automáticamente al crear su tarjeta.",
  atras: "Atrás",
  continuar: "Guardar y continuar",
  previa: "Vista previa en vivo",
  previaAyuda: "así la ve tu cliente al registrarse",
  sellosEtiqueta: "sellos",
  nota: "Tu sello de bienvenida ya está aquí",
} as const;

export const N4 = {
  titulo: "Listo. Imprime tu QR de mostrador",
  bajada:
    "Tus clientes lo escanean con la cámara para crear su tarjeta. Para sumar sellos, tú escaneas el código de su tarjeta desde Mostrador.",
  tamano: "Tamaño",
  tamanos: ["Carta (cartel)", "Media carta", "Sticker 10 cm"],
  pdf: "Descargar PDF",
  png: "Descargar PNG",
  pegalo: "Pégalo junto a la caja, a la altura de los ojos",
  prueba: "Tu mes de prueba empieza cuando terminas este paso.",
  mostrador: "Ir a Mostrador",
  escanear: "Escanéame con tu cámara",
  escanearAyuda: "Tu tarjeta digital siempre a un toque.",
  hecho: "Hecho con LealTab",
  atras: "Atrás",
} as const;
