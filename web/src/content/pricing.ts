/** Copy de "Precios" (v1.7, `#precios`). Texto idéntico al de la landing aprobada. */

export const PRICING = {
  heading: "Precios claros. Sin contratos ni pago inicial.",
  trial: "Pruébala gratis 30 días. Sin tarjeta de crédito.",
  cta: "Crea tu tarjeta gratis",
  note: "Sin contratos, cancelas cuando quieras. Todos los precios + IVA.",
  plans: {
    inicio: {
      name: "Inicio",
      price: "$299",
      unit: "MXN/mes + IVA",
      features: [
        "Hasta 200 clientes activos",
        "1 tarjeta de lealtad",
        "1 sucursal",
        "Soporte por WhatsApp",
      ],
    },
    negocio: {
      name: "Negocio",
      chip: "Recomendado",
      price: "$449",
      unit: "MXN/mes + IVA",
      features: [
        "Clientes activos ilimitados",
        "Varias tarjetas / recompensas",
        "Hasta 3 sucursales",
        "Soporte por WhatsApp",
      ],
    },
    pro: {
      name: "Pro",
      price: "Próximamente",
      features: ["Para cuando tu operación pida más"],
    },
  },
} as const;
