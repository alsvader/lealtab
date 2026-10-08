import type { LegalDocument } from "@/content/legal/types";

/**
 * Aviso de privacidad de lealtab.com (solo visitantes de la landing).
 * Base legal: LFPDPPP publicada en el DOF el 20 de marzo de 2025 (arts. 7, 11, 15, 16, 18-20, 24, 28-35, 40).
 * Debe revisarse con un abogado antes de publicarse (ver docs/fase-2/legal-notas.md).
 */

const EMAIL = { text: "contacto@lealtab.com", href: "mailto:contacto@lealtab.com" };
const WHATSAPP = { text: "+52 55 8806 3606", href: "https://wa.me/525588063606" };
const INSTAGRAM = { text: "@getlealtab", href: "https://www.instagram.com/getlealtab" };
const TERMS_LINK = { text: "Términos y condiciones", href: "/terminos-y-condiciones" };
const LEY_LINK = {
  text: "Ley Federal de Protección de Datos Personales en Posesión de los Particulares",
  href: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf",
};
const SECRETARIA_LINK = {
  text: "Secretaría Anticorrupción y Buen Gobierno",
  href: "https://www.gob.mx/buengobierno",
};

export const PRIVACY: LegalDocument = {
  title: "Aviso de privacidad",
  description:
    "Cómo trata LealTab los datos personales de quienes visitan lealtab.com y cómo ejercer tus derechos de acceso, rectificación, cancelación y oposición.",
  updatedAt: "7 de octubre de 2026",
  updatedAtIso: "2026-10-07",
  intro: [
    {
      type: "p",
      content: [
        "Este aviso explica cómo trata LealTab los datos personales de quienes visitan lealtab.com. Lo escribimos en lenguaje sencillo para que sepas qué pasa con tus datos.",
      ],
    },
    {
      type: "p",
      content: [
        "Se rige por la ",
        LEY_LINK,
        " (la “Ley”), publicada en el Diario Oficial de la Federación el 20 de marzo de 2025.",
      ],
    },
  ],
  sections: [
    {
      id: "quien-es-el-responsable",
      heading: "Quién es el responsable de tus datos",
      blocks: [
        {
          type: "p",
          content: [
            "El responsable del tratamiento de tus datos personales es LealTab, con ubicación en Villahermosa, Tabasco, México.",
          ],
        },
        {
          type: "p",
          content: ["Puedes contactarnos por correo en ", EMAIL, " o por WhatsApp al ", WHATSAPP, "."],
        },
      ],
    },
    {
      id: "a-quien-aplica-este-aviso",
      heading: "A quién aplica este aviso",
      blocks: [
        {
          type: "p",
          content: [
            "Este aviso aplica solo a las personas que visitan lealtab.com, que es una página informativa. Aquí no hay registro ni formularios: los botones “Crea tu tarjeta gratis” y “Entrar” te llevan a app.lealtab.com, que es otro sitio.",
          ],
        },
        {
          type: "p",
          content: [
            "No cubre la plataforma (app.lealtab.com), ni a los dueños de negocio como usuarios de la plataforma, ni a los clientes finales que usan una tarjeta de lealtad. La plataforma tendrá su propio aviso de privacidad, que verás cuando te registres.",
          ],
        },
        {
          type: "p",
          content: [
            "Si nos escribes por WhatsApp desde esta página, esa conversación sí queda cubierta por este aviso.",
          ],
        },
        {
          type: "p",
          content: [
            "Tampoco cubre los servicios de terceros a los que enlaza la página, como WhatsApp e Instagram. Cada uno tiene sus propias políticas de privacidad. El uso de lealtab.com y de la plataforma también se rige por nuestros ",
            TERMS_LINK,
            ".",
          ],
        },
      ],
    },
    {
      id: "datos-que-tratamos",
      heading: "Qué datos personales tratamos",
      blocks: [
        {
          type: "p",
          content: ["Solo tratamos estos datos, y solo en los casos que se describen:"],
        },
        {
          type: "ul",
          items: [
            [
              "Datos técnicos de tu visita. El proveedor de alojamiento del sitio puede registrar tu dirección IP, el navegador que usas, la fecha y hora de tu visita y la página que pediste. Lo hace por seguridad y para que el sitio funcione.",
            ],
            [
              "Datos de tu conversación por WhatsApp. Si das clic en el botón de WhatsApp y nos escribes, recibimos el nombre de tu perfil, tu número de teléfono y lo que nos escribas. El botón abre un mensaje ya redactado que puedes cambiar o no enviar.",
            ],
            [
              "Datos de tu mensaje por Instagram. Si nos escribes en Instagram (",
              INSTAGRAM,
              "), recibimos lo que nos envíes y los datos de tu perfil que esa red social nos muestre.",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "En el sitio no hay formularios, así que no te pedimos nombre, correo ni teléfono dentro de lealtab.com. Tampoco pedimos datos financieros ni de pago.",
          ],
        },
        {
          type: "p",
          content: [
            "No solicitamos datos personales sensibles, es decir, los que tocan la parte más íntima de una persona, como salud, origen racial o étnico, creencias religiosas, opiniones políticas o preferencia sexual. Te pedimos no enviarlos en tus mensajes.",
          ],
        },
      ],
    },
    {
      id: "para-que-usamos-tus-datos",
      heading: "Para qué usamos tus datos",
      blocks: [
        {
          type: "p",
          content: ["Finalidades necesarias. Usamos tus datos para lo siguiente:"],
        },
        {
          type: "ul",
          items: [
            ["Mantener lealtab.com disponible y seguro, y detectar y evitar usos indebidos del sitio."],
            [
              "Responder tus mensajes por WhatsApp o Instagram, resolver tus dudas sobre LealTab y dar seguimiento a lo que nos pidas.",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "Para estas finalidades no te pedimos un consentimiento por separado. Si visitas la página o nos escribes después de tener acceso a este aviso, entendemos que lo conoces y aceptas esos usos (consentimiento tácito). Si no estás de acuerdo, puedes limitar el uso de tus datos o revocar tu consentimiento como se explica más abajo.",
          ],
        },
        {
          type: "p",
          content: [
            "Finalidades que requieren tu consentimiento. Por ahora, ninguna. No usamos tus datos para publicidad ni los vendemos. No te enviaremos promociones ni mensajes masivos sin que antes nos des tu consentimiento.",
          ],
        },
        {
          type: "p",
          content: [
            "Si algún día quisiéramos usar tus datos para otra finalidad, te lo diremos y te pediremos tu consentimiento antes de hacerlo.",
          ],
        },
      ],
    },
    {
      id: "con-quien-compartimos-tus-datos",
      heading: "Con quién compartimos tus datos",
      blocks: [
        {
          type: "p",
          content: [
            "No vendemos tus datos ni los transferimos a terceros para que los usen por su cuenta.",
          ],
        },
        {
          type: "p",
          content: [
            "Sí intervienen estos servicios, necesarios para que el sitio y nuestros canales de contacto funcionen:",
          ],
        },
        {
          type: "ul",
          items: [
            [
              "El proveedor de alojamiento, que aloja lealtab.com y puede registrar los datos técnicos de tu visita. Los trata por cuenta de LealTab.",
            ],
            [
              "WhatsApp e Instagram, si decides escribirnos por ahí. Cada servicio procesa tus mensajes conforme a sus propias políticas de privacidad. Esa relación es entre tú y ellos.",
            ],
          ],
        },
        {
          type: "p",
          content: ["Algunos de estos servicios pueden guardar o procesar datos fuera de México."],
        },
        {
          type: "p",
          content: [
            "También podemos entregar información cuando una autoridad competente nos lo exija conforme a la ley.",
          ],
        },
        {
          type: "p",
          content: [
            "Si en el futuro transferimos tus datos a terceros, actualizaremos este aviso y te daremos la opción de aceptar o no la transferencia, salvo en los casos en que la Ley permite hacerla sin tu consentimiento.",
          ],
        },
      ],
    },
    {
      id: "limitar-el-uso-y-revocar-tu-consentimiento",
      heading: "Limitar el uso de tus datos y revocar tu consentimiento",
      blocks: [
        {
          type: "p",
          content: ["Tú decides. Estas son tus opciones para limitar el uso o la divulgación de tus datos:"],
        },
        {
          type: "ul",
          items: [
            [
              "No nos escribas. Puedes leer toda la página sin darnos ningún dato personal, aparte de los datos técnicos que registra el proveedor de alojamiento.",
            ],
            [
              "Pídenos que dejemos de contactarte o que no usemos tus datos para una finalidad, escribiéndonos a ",
              EMAIL,
              " o por WhatsApp.",
            ],
            [
              "Revisa la configuración de privacidad de WhatsApp e Instagram para controlar lo que esos servicios hacen con tus datos.",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "Puedes revocar tu consentimiento en cualquier momento. La revocación no tiene efectos retroactivos: no cambia lo que hicimos con tus datos antes de que la pidieras.",
          ],
        },
        {
          type: "p",
          content: [
            "Para revocarlo, escríbenos a ",
            EMAIL,
            " con el asunto “Revocación de consentimiento”. Indica tu nombre, el número de WhatsApp o el usuario de Instagram desde el que nos contactaste y qué uso quieres detener. Te respondemos en un máximo de 20 días hábiles.",
          ],
        },
        {
          type: "p",
          content: [
            "Si revocas tu consentimiento para las finalidades necesarias, ya no podremos atender tu conversación.",
          ],
        },
      ],
    },
    {
      id: "derechos-arco",
      heading: "Tus derechos de acceso, rectificación, cancelación y oposición (ARCO)",
      blocks: [
        {
          type: "p",
          content: ["Tienes derecho a:"],
        },
        {
          type: "ul",
          items: [
            ["Acceso: saber qué datos tuyos tenemos y cómo los tratamos."],
            ["Rectificación: pedir que corrijamos tus datos si son inexactos, están incompletos o desactualizados."],
            [
              "Cancelación: pedir que eliminemos tus datos de nuestros archivos, registros, expedientes y sistemas. Primero los bloqueamos durante el plazo legal en que podrían surgir responsabilidades por su tratamiento y después los suprimimos. Te avisamos cuando lo hagamos.",
            ],
            ["Oposición: pedir que dejemos de tratar tus datos cuando tengas una causa legítima."],
          ],
        },
        {
          type: "p",
          content: [
            "Cómo hacer tu solicitud. Escríbenos a ",
            EMAIL,
            ". Las atiende el área de privacidad de LealTab. Puedes pedir ayuda por WhatsApp, pero para dejar constancia y poder responderte, presenta tu solicitud por correo. Incluye:",
          ],
        },
        {
          type: "ul",
          items: [
            ["Tu nombre y un correo u otro medio para recibir nuestra respuesta."],
            [
              "Un documento que acredite tu identidad, por ejemplo una copia de tu identificación oficial. Si actúas en nombre de otra persona, también el documento que acredite tu representación.",
            ],
            [
              "La descripción clara y precisa de los datos sobre los que quieres ejercer el derecho. No hace falta si solo pides acceso.",
            ],
            ["El derecho que quieres ejercer o lo que nos pides."],
            [
              "Cualquier dato que nos ayude a encontrar tu información, como el número o usuario desde el que nos escribiste y la fecha aproximada. Si pides una rectificación, indica también las correcciones y adjunta el documento que las respalde.",
            ],
          ],
        },
        {
          type: "p",
          content: [
            "Plazos. Te comunicamos nuestra decisión en un máximo de 20 días hábiles contados desde que recibimos tu solicitud. Si procede, la hacemos efectiva dentro de los 15 días hábiles siguientes a nuestra respuesta. Si las circunstancias lo justifican, podemos ampliar estos plazos una sola vez por un periodo igual, y te lo avisaremos.",
          ],
        },
        {
          type: "p",
          content: [
            "Costo. Ejercer tus derechos es gratis. Solo podríamos cobrarte los costos de reproducción, copias o envío.",
          ],
        },
        {
          type: "p",
          content: [
            "Podemos negar tu solicitud, total o parcialmente, en los casos que prevé la Ley. Por ejemplo, si no acreditas tu identidad, si no tenemos tus datos o si se afectan derechos de terceros. Siempre te explicamos el motivo.",
          ],
        },
      ],
    },
    {
      id: "si-no-estas-conforme",
      heading: "Si no estás conforme con nuestra respuesta",
      blocks: [
        {
          type: "p",
          content: [
            "Si no te respondemos a tiempo o no estás conforme con la respuesta, puedes presentar una solicitud de protección de datos ante la ",
            SECRETARIA_LINK,
            ". Desde 2025 es la autoridad que vigila el cumplimiento de la Ley, en lugar del INAI.",
          ],
        },
        {
          type: "p",
          content: [
            "Debes presentarla dentro de los 15 días hábiles siguientes a la fecha en que te comuniquemos la respuesta. Si no te respondemos, puedes presentarla cuando venza el plazo que tenemos para dártela.",
          ],
        },
      ],
    },
    {
      id: "cookies-y-analitica",
      heading: "Cookies, analítica y recursos de terceros",
      blocks: [
        {
          type: "p",
          content: [
            "lealtab.com no usa cookies, ni propias ni de terceros. Tampoco usa herramientas de analítica ni carga recursos de terceros: las tipografías están alojadas en el mismo sitio.",
          ],
        },
        {
          type: "p",
          content: [
            "Los datos técnicos que puede registrar el proveedor de alojamiento, que describimos arriba, no son cookies, pero sí son datos de tu visita.",
          ],
        },
        {
          type: "p",
          content: [
            "Más adelante podríamos agregar analítica o cookies. Si lo hacemos, actualizaremos este aviso antes de activarlas y te pediremos el consentimiento que corresponda.",
          ],
        },
      ],
    },
    {
      id: "como-cuidamos-tus-datos",
      heading: "Cómo cuidamos tus datos",
      blocks: [
        {
          type: "p",
          content: [
            "Aplicamos medidas de seguridad administrativas, técnicas y físicas para proteger tus datos contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado. Los mensajes que recibimos los atiende únicamente el equipo de LealTab.",
          ],
        },
        {
          type: "p",
          content: [
            "Establecemos controles para que quienes intervengan en el tratamiento de tus datos guarden confidencialidad, incluso cuando dejen de trabajar con nosotros.",
          ],
        },
        {
          type: "p",
          content: [
            "Si ocurre una vulneración de seguridad que afecte de forma significativa tus derechos patrimoniales o morales, te lo informaremos de inmediato por el medio por el que nos contactaste, para que puedas tomar medidas para defender tus derechos.",
          ],
        },
      ],
    },
    {
      id: "cuanto-tiempo-conservamos-tus-datos",
      heading: "Cuánto tiempo conservamos tus datos",
      blocks: [
        {
          type: "p",
          content: [
            "Conservamos tus datos solo el tiempo necesario para las finalidades de este aviso y para cumplir obligaciones legales. Cuando dejan de ser necesarios, los bloqueamos si hace falta y después los eliminamos.",
          ],
        },
        {
          type: "p",
          content: [
            "Los registros técnicos del proveedor de alojamiento se conservan según los plazos de ese proveedor.",
          ],
        },
      ],
    },
    {
      id: "cambios-a-este-aviso",
      heading: "Cambios a este aviso",
      blocks: [
        {
          type: "p",
          content: [
            "Si cambiamos este aviso, publicaremos la versión nueva en esta página y actualizaremos la fecha de “Última actualización”. Así te comunicamos los cambios.",
          ],
        },
        {
          type: "p",
          content: [
            "Si el cambio modifica las finalidades para las que usamos tus datos, o si empezamos a usar analítica o cookies, lo publicaremos antes de que aplique y, cuando la Ley lo exija, te pediremos otra vez tu consentimiento. Si nos escribiste, también podremos avisarte por el mismo medio por el que nos contactaste.",
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
          content: [
            "Para cualquier duda sobre este aviso, para ejercer tus derechos o para revocar tu consentimiento, escríbenos:",
          ],
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
          content: ["También puedes consultar nuestros ", TERMS_LINK, "."],
        },
      ],
    },
  ],
};
