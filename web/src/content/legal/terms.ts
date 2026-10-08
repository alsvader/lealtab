import type { LegalDocument } from "@/content/legal/types";

/**
 * Términos y condiciones de LealTab (lealtab.com y plataforma).
 * Planes, precios, prueba gratis y compromisos: copiados de pricing.ts, closing.ts (FAQ) y trust.ts.
 * Las cláusulas que la landing no define (cobro, reembolsos, plazos de aviso, conservación tras cancelar,
 * referencia de cliente, suspensión) están redactadas con una opción conservadora y quedan como
 * decisiones pendientes del fundador en docs/fase-2/legal-notas.md.
 * Debe revisarse con un abogado antes de publicarse.
 */

const EMAIL = { text: "contacto@lealtab.com", href: "mailto:contacto@lealtab.com" };
const WHATSAPP = { text: "+52 55 8806 3606", href: "https://wa.me/525588063606" };
const PRIVACY_LINK = { text: "Aviso de privacidad", href: "/aviso-de-privacidad" };

export const TERMS: LegalDocument = {
  title: "Términos y condiciones",
  description:
    "Las reglas para usar lealtab.com y la plataforma LealTab: planes, prueba gratis de 30 días, cancelación, tus datos y tu responsabilidad.",
  updatedAt: "7 de octubre de 2026",
  updatedAtIso: "2026-10-07",
  intro: [
    {
      type: "p",
      content: [
        "El servicio LealTab lo presta LealTab, con ubicación en Villahermosa, Tabasco, México. Puedes contactarnos por correo en ",
        EMAIL,
        " o por WhatsApp al ",
        WHATSAPP,
        ".",
      ],
    },
    {
      type: "p",
      content: [
        "Estos términos son entre tú, como dueño o representante de un negocio, y LealTab. Los escribimos en lenguaje sencillo. Léelos antes de crear tu tarjeta.",
      ],
    },
  ],
  sections: [
    {
      id: "aceptacion-de-los-terminos",
      heading: "Aceptación de los términos",
      blocks: [
        {
          type: "p",
          content: [
            "Al usar lealtab.com o la plataforma (app.lealtab.com), o al crear tu cuenta, aceptas estos Términos y condiciones y nuestro ",
            PRIVACY_LINK,
            ". Si no estás de acuerdo, no uses el servicio.",
          ],
        },
        {
          type: "p",
          content: [
            "El aviso de privacidad de lealtab.com cubre a quienes visitan la página. Cuando te registres en la plataforma verás su propio aviso de privacidad.",
          ],
        },
      ],
    },
    {
      id: "que-es-lealtab-y-que-incluye",
      heading: "Qué es LealTab y qué incluye",
      blocks: [
        {
          type: "p",
          content: [
            "LealTab es una plataforma para que tu negocio ofrezca una tarjeta de lealtad digital a sus clientes. Tus clientes la abren desde el navegador de cualquier celular, iPhone o Android, sin descargar nada de una tienda de apps, y pueden agregarla a su pantalla de inicio.",
          ],
        },
        {
          type: "p",
          content: [
            "Tú ves en un tablero sencillo a tus clientes frecuentes y a los que no han vuelto. Lo que incluye tu servicio depende del plan que elijas (ver “Planes, prueba gratis y pagos”).",
          ],
        },
        {
          type: "p",
          content: [
            "Las funciones que la página marca como “Próximamente” no forman parte del servicio mientras no estén disponibles, y no te prometemos una fecha para ellas.",
          ],
        },
        {
          type: "p",
          content: [
            "LealTab no es un punto de venta ni emite facturas por las ventas de tu negocio. Las recompensas de tu programa las defines y las cumples tú. LealTab solo te da la herramienta para registrarlas.",
          ],
        },
      ],
    },
    {
      id: "tu-cuenta-y-quienes-la-usan",
      heading: "Tu cuenta y quienes la usan",
      blocks: [
        {
          type: "p",
          content: [
            "Para usar la plataforma debes registrarte con información veraz y mantenerla actualizada. Si registras un negocio, declaras que tienes capacidad legal para contratar y facultades para obligarlo.",
          ],
        },
        {
          type: "p",
          content: ["Eres responsable de:"],
        },
        {
          type: "ul",
          items: [
            ["Mantener la confidencialidad de tus datos de acceso."],
            [
              "Todo lo que ocurra en tu cuenta, incluidas las acciones de las personas que autorices para operar tu tarjeta, como tus cajeros o colaboradores. Lo que ellos hagan se entiende hecho bajo tu responsabilidad.",
            ],
            [
              "Avisarnos de inmediato si sospechas que alguien usó tu cuenta sin autorización. Escríbenos por WhatsApp o a ",
              EMAIL,
              ".",
            ],
          ],
        },
        {
          type: "p",
          content: ["Tú decides quién opera tu tarjeta."],
        },
      ],
    },
    {
      id: "planes-prueba-gratis-y-pagos",
      heading: "Planes, prueba gratis y pagos",
      blocks: [
        {
          type: "p",
          content: [
            "Hoy ofrecemos estos planes. Los precios están en pesos mexicanos (MXN), por mes, más IVA:",
          ],
        },
        {
          type: "ul",
          items: [
            [
              "Inicio: $299 MXN al mes + IVA. Incluye hasta 200 clientes activos, 1 tarjeta de lealtad, 1 sucursal y soporte por WhatsApp.",
            ],
            [
              "Negocio: $449 MXN al mes + IVA. Incluye clientes activos ilimitados, varias tarjetas y recompensas, hasta 3 sucursales y soporte por WhatsApp.",
            ],
            ["Pro: próximamente. Todavía no está disponible ni tiene precio."],
          ],
        },
        {
          type: "p",
          content: [
            "Pruébala gratis 30 días, sin tarjeta de crédito. No hay contratos ni pago inicial.",
          ],
        },
        {
          type: "p",
          content: [
            "Te avisamos antes de que termine tu prueba. Si eliges un plan, todo sigue igual. Si no, tu tarjeta se pausa y puedes descargar tus datos.",
          ],
        },
        {
          type: "p",
          content: [
            "Los planes se cobran por mes. Antes de que termine tu prueba te indicamos por WhatsApp o por correo cómo hacer tu pago. Si un pago no se realiza, tu tarjeta se pausa hasta que te pongas al corriente, y mientras tanto puedes descargar tus datos.",
          ],
        },
        {
          type: "p",
          content: [
            "Podemos cambiar los precios. Si lo hacemos, te avisaremos por correo o por WhatsApp con al menos 30 días de anticipación y el nuevo precio aplicará a partir de tu siguiente mes. Si no estás de acuerdo, puedes cancelar antes de que aplique.",
          ],
        },
      ],
    },
    {
      id: "cancelacion-y-tus-datos-al-terminar",
      heading: "Cancelación y qué pasa con tus datos",
      blocks: [
        {
          type: "p",
          content: [
            "Puedes cancelar cuando quieras. No hay contratos ni plazos forzosos. Para cancelar, escríbenos por WhatsApp o a ",
            EMAIL,
            ".",
          ],
        },
        {
          type: "p",
          content: [
            "Tu plan sigue activo hasta el final del mes que ya pagaste. No hacemos reembolsos por periodos parciales no usados. Durante la prueba gratis no se te cobra nada.",
          ],
        },
        {
          type: "p",
          content: [
            "Cuando cancelas, o cuando termina tu prueba sin que elijas un plan, tu tarjeta se pausa y puedes descargar tus datos. Tus clientes y su historial son tuyos.",
          ],
        },
        {
          type: "p",
          content: [
            "Conservamos tus datos durante 30 días después de la cancelación para que puedas descargarlos o reactivar tu cuenta. Pasado ese plazo podemos eliminarlos de forma permanente, salvo los que la ley nos obligue a conservar.",
          ],
        },
      ],
    },
    {
      id: "disponibilidad-soporte-y-servicios-de-terceros",
      heading: "Disponibilidad, soporte y servicios de terceros",
      blocks: [
        {
          type: "p",
          content: [
            "Nos esforzamos por que LealTab funcione todos los días, pero no garantizamos un nivel de disponibilidad específico. Si vamos a hacer un mantenimiento que afecte el servicio, intentaremos avisarte con anticipación.",
          ],
        },
        {
          type: "p",
          content: [
            "LealTab depende de internet, del celular y el navegador de tus clientes, y de proveedores externos, como el alojamiento y la conectividad. No controlamos esos factores y no somos responsables por las interrupciones que vengan de ellos.",
          ],
        },
        {
          type: "p",
          content: [
            "El soporte es por WhatsApp y te atiende una persona. No garantizamos un tiempo de respuesta específico.",
          ],
        },
        {
          type: "p",
          content: [
            "La página enlaza a servicios de terceros, como WhatsApp e Instagram. Cada uno tiene sus propios términos y políticas, y no los controlamos.",
          ],
        },
      ],
    },
    {
      id: "uso-aceptable",
      heading: "Uso aceptable",
      blocks: [
        {
          type: "p",
          content: ["Al usar LealTab te comprometes a no:"],
        },
        {
          type: "ul",
          items: [
            ["Intentar entrar a cuentas o datos de otros negocios o usuarios."],
            ["Usar el servicio para actividades que violen las leyes mexicanas."],
            [
              "Falsificar o manipular sellos, visitas, canjes o códigos QR, ni intentar saltarte los controles de seguridad del servicio.",
            ],
            ["Hacer ingeniería inversa, descompilar o intentar extraer el código del software."],
            ["Subir contenido ilícito, malicioso o que infrinja derechos de terceros."],
            ["Enviar spam ni usar acciones automatizadas que no autoricemos."],
          ],
        },
        {
          type: "p",
          content: [
            "Si incumples estas reglas, podemos pausar o cerrar tu cuenta. Cuando sea posible te avisaremos antes y podrás descargar tus datos.",
          ],
        },
      ],
    },
    {
      id: "propiedad-intelectual-y-tu-marca",
      heading: "Propiedad intelectual y tu marca",
      blocks: [
        {
          type: "p",
          content: [
            "El software de LealTab, su diseño, su código, su marca, sus logotipos y el contenido original de la página son de LealTab y están protegidos por las leyes mexicanas. Mientras tengas tu cuenta, te damos un permiso limitado, personal y no transferible para usar el servicio. No te transferimos ningún derecho sobre ellos.",
          ],
        },
        {
          type: "p",
          content: [
            "Tu nombre comercial, tu logotipo y el contenido que subas siguen siendo tuyos. Nos autorizas a mostrarlos en tu tarjeta y en la plataforma, solo para prestarte el servicio. Declaras que tienes derecho a usarlos.",
          ],
        },
        {
          type: "p",
          content: [
            "No usaremos tu nombre ni tu logotipo como referencia de cliente, en la página o en otros materiales, sin tu permiso previo.",
          ],
        },
      ],
    },
    {
      id: "los-datos-de-tus-clientes",
      heading: "Los datos de tus clientes",
      blocks: [
        {
          type: "p",
          content: [
            "Cuando registras a tus clientes en tu programa de lealtad, por ejemplo con su nombre y su número de WhatsApp, tú eres el responsable del tratamiento de esos datos conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
          ],
        },
        {
          type: "p",
          content: [
            "LealTab actúa como encargado: trata esos datos por cuenta tuya, solo para operar tu programa (identificar a tus clientes, registrar sus sellos y visitas y mostrarles su tarjeta) y según lo que tú hagas en la plataforma. No usamos esos datos para fines propios ni los compartimos con otros negocios ni con terceros, salvo lo necesario para prestarte el servicio o lo que la ley nos exija.",
          ],
        },
        {
          type: "p",
          content: ["Por eso, tú te encargas de:"],
        },
        {
          type: "ul",
          items: [
            [
              "Informar a tus clientes cómo tratas sus datos y contar con su consentimiento cuando la ley lo exija.",
            ],
            ["Pedir solo los datos que necesites para tu programa."],
            ["Atender las solicitudes de tus clientes sobre sus datos."],
          ],
        },
        {
          type: "p",
          content: [
            "Tus clientes y su historial son tuyos. Puedes descargarlos cuando quieras.",
          ],
        },
      ],
    },
    {
      id: "limitacion-de-responsabilidad",
      heading: "Limitación de responsabilidad",
      blocks: [
        {
          type: "p",
          content: [
            "LealTab es una herramienta. No garantizamos que tus clientes regresen más ni que aumenten tus ventas.",
          ],
        },
        {
          type: "p",
          content: [
            "En la medida en que la ley lo permita, LealTab no responde por daños indirectos, incidentales, especiales o consecuentes, como la pérdida de ganancias, de clientes, de datos o de uso. Tampoco responde por las recompensas, promociones o acuerdos entre tu negocio y tus clientes, ni por lo que hagan las personas que operan tu cuenta.",
          ],
        },
        {
          type: "p",
          content: [
            "Nada de esto limita la responsabilidad que la ley no permita limitar.",
          ],
        },
        {
          type: "p",
          content: [
            "Te recomendamos descargar tus datos con regularidad y conservar respaldos propios de la información importante de tu negocio.",
          ],
        },
      ],
    },
    {
      id: "ley-aplicable-y-tribunales",
      heading: "Ley aplicable y tribunales",
      blocks: [
        {
          type: "p",
          content: [
            "Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier controversia, tú y LealTab se someten a los tribunales competentes de Villahermosa, Tabasco, México, y renuncian a cualquier otro fuero que pudiera corresponderles por su domicilio presente o futuro.",
          ],
        },
      ],
    },
    {
      id: "cambios-a-estos-terminos",
      heading: "Cambios a estos términos",
      blocks: [
        {
          type: "p",
          content: [
            "Podemos actualizar estos términos. Si el cambio te afecta, te avisaremos por correo, por WhatsApp o dentro de la plataforma con al menos 15 días de anticipación. La fecha de “Última actualización” siempre indica la versión vigente.",
          ],
        },
        {
          type: "p",
          content: [
            "Si sigues usando LealTab después de que el cambio aplique, entendemos que lo aceptas. Si no estás de acuerdo, puedes cancelar cuando quieras.",
          ],
        },
        {
          type: "p",
          content: [
            "Los cambios de precio siguen lo que se explica en “Planes, prueba gratis y pagos”.",
          ],
        },
      ],
    },
    {
      id: "contacto",
      heading: "Contacto",
      blocks: [
        {
          type: "p",
          content: ["¿Dudas sobre estos términos? Escríbenos:"],
        },
        {
          type: "ul",
          items: [
            ["Correo: ", EMAIL],
            ["WhatsApp: ", WHATSAPP],
          ],
        },
        {
          type: "p",
          content: [
            "Para saber cómo tratamos los datos de quienes visitan lealtab.com, consulta el ",
            PRIVACY_LINK,
            ".",
          ],
        },
      ],
    },
  ],
};
