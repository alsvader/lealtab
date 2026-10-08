/** Copy de "Cierre + FAQ" (v1.7, `#cta-final` y `#faq`). Texto idéntico al de la landing aprobada. */

export const CLOSING = {
  heading: "Crea tu tarjeta hoy.",
  lead: "Es gratis empezar.",
  cta: "Crea tu tarjeta gratis",
  waHint: { before: "¿Dudas? ", link: "Escríbenos por WhatsApp", after: "." },
  visual: { count: "5/5", unit: "cortes", sticker: "¡Recompensa lista!" },
} as const;

export const FAQ = {
  heading: "Preguntas frecuentes",
  items: [
    {
      q: "¿Mis clientes tienen que descargar algo?",
      a: 'No. Escanean tu QR, tocan "Agregar a inicio" y la tarjeta queda en su pantalla. Sin tienda de apps.',
    },
    {
      q: "¿Funciona en iPhone y Android?",
      a: "Sí. Funciona en cualquier celular con navegador, iPhone o Android.",
    },
    {
      q: "¿Qué pasa cuando termina la prueba?",
      a: "Te avisamos antes de que termine. Si eliges un plan, todo sigue igual. Si no, tu tarjeta se pausa y puedes descargar tus datos.",
    },
    {
      q: "¿Puedo cancelar cuando quiera?",
      a: "Sí. No hay contratos ni plazos forzosos. Cancelas cuando quieras.",
    },
    {
      q: "¿Mis datos son míos?",
      a: "Sí. Tus clientes y su historial son tuyos y los descargas cuando quieras.",
    },
  ],
} as const;
