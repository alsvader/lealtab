# Investigación: límite de sellos y antifraude en la competencia

Fecha: 20 oct 2026 · Para el pendiente 4 de la revisión de docs (reglas contra el abuso de sellos)
Decisión ya tomada por Aarón: **el QR del cliente cambia de código**. Falta decidir el límite de frecuencia.

## Hallazgos por plataforma

| Plataforma | Límite de frecuencia | ¿Configurable por negocio? | Otros controles antifraude | Fuente |
|---|---|---|---|---|
| **Stamp Me** (AU, vende en MX) | Tiempo de espera entre sellos por cliente: puede ser 30 s, 2 min, 2 h, 12 h… **Por defecto: sin límite.** Sugieren 12 h para "un sello por día". El cliente ve un error con cuánto le falta esperar | Sí, por tarjeta | Alta con OTP por teléfono; candado de cuentas múltiples en el mismo equipo; cupón de canje animado con hora (contra capturas); "OneStamps" de un solo uso; cambiar el Stamp Code periódicamente; alerta de sellos; recomiendan poner el T&C del límite en la tarjeta | [Qué es](https://help.stampme.com/en/articles/6151143-what-is-a-time-delay-between-stamping), [Cómo se configura](https://help.stampme.com/en/articles/6151156-how-to-set-up-a-time-delay-between-stamp-collections), [Prevenir abuso](https://help.stampme.com/en/articles/6204197-how-to-prevent-misuse-with-stamping-and-reward-redemptions) |
| **Boomerangme** | "Limitar sellos por día" (por cliente, se reinicia a las 12:00 a. m.) y "Restringir a 1 check-in por cliente por día" | Sí, por tarjeta | Modo kiosco con retraso contra acumulaciones duplicadas a la misma tarjeta; permisos admin/gerente; confirmación de sello en el escáner | [Stamp](https://docs.boomerangme.cards/cards-creation/stamp), [Kiosk mode](https://docs.boomerangme.cards/scanner-app/kiosk-mode) |
| **Loopy Loyalty** (PassKit) | **No encontrado**: sellos ilimitados; no documenta límite por día ni enfriamiento | — | "Confirmar transacción" antes del sello; un login por empleado; Face ID/Touch ID; GPS registrado en cada sello; quitar sellos solo hasta el último canje; todo queda en bitácora; inscripción única por campo (evita duplicados) | [Stamper app](https://docs.loopyloyalty.com/en/articles/10502182-using-the-ios-stamper-app), [Novedades](https://docs.loopyloyalty.com/en/articles/1043131-what-s-new-in-loopy-loyalty) |
| **Passcreator** | No hay límite por día en la función de sellos; existe una función aparte "Válido una vez por día" | Sí (activar o no) | Valor máximo de sellos | [Funcionalidades](https://www.passcreator.com/en/docs/building-passes/templates/pass-functionalities) |
| **SMS Masivos** (MX) | "Máximo de compras/canjes" que un cliente acumula **en el mismo día** | Sí | Compra mínima para dar sello | [Configuración](https://help.smsmasivos.com.mx/es/article/paso-1-como-se-configuran-las-tarjetas-de-lealtad-17cbleb/) |
| **Lealify** (MX) | "Tiempo mínimo entre visitas" en el kiosco. Valor y si es configurable: **no encontrado** | No encontrado | El cliente se identifica con su teléfono | [Tarjeta de sellos](https://lealify.com/tarjeta-de-sellos-digital/) |
| **Fideliza** (fideliza.app, MX) | **No encontrado** | — | Código único por cliente; cupón de canje de un solo uso | [Tarjeta de sellos](https://fideliza.app/tarjeta-de-sellos-digital) |
| **FidelyT** (Yucatán) | **No encontrado** | — | No encontrado | [Sitio](https://www.fidelyt.com/) |
| **Stampify** | **No encontrado** (no documenta límite) | — | Cada sello con hora y empleado que lo dio | [FAQ](https://stampify.co/faq) |
| **Leal, Fidely, Comeback, Toki, PassKit** | No investigado a fondo / no encontrado en esta ronda | — | — | — |

Referencia útil (no es competidor directo): Revly (Ecuador) recomienda techos de sellos por transacción, por hora y por día, y transacciones por pase por hora/día, "calibrados muy por encima del comportamiento legítimo" para que lo anómalo genere alerta. [Blog](https://revly.ec/blog/fraude-interno-programa-de-lealtad-mostrador/)

## Lo que dice el mercado

1. **Nadie usa un límite por semana.** Lo que existe es "por día" (Boomerangme, SMS Masivos, Passcreator) o un tiempo de espera configurable entre sellos (Stamp Me, Lealify).
2. **Siempre es configurable por negocio**, y varios lo dejan apagado por defecto (Stamp Me, Loopy).
3. El antifraude fuerte no está en el límite, sino en: **confirmación del staff + quién dio cada sello + bitácora + QR/cupón que no sirve como captura.**

## Recomendación para el MVP

- **Valor por defecto: 1 sello por cliente por día** (en la zona horaria del negocio; se reinicia a medianoche). Si el staff intenta dar otro, ve "Ya recibió su sello hoy; el siguiente desde mañana".
- **Configurable en Ajustes de la tarjeta (N8)** con opciones simples: *1 por día* (por defecto) · *1 cada X horas* (para cafeterías con dos visitas al día; mínimo sugerido 2 h) · *Sin límite* (con aviso).
  No ofrecer "1 por semana": rompe a cafeterías y tapiocas, y en barberías (cada 2–4 semanas) no aporta nada extra.
- **Siempre activo, aunque elijan "Sin límite": un enfriamiento técnico de 1–2 minutos** contra el doble escaneo accidental.
- Complementos (casi todos ya en el diseño): QR rotativo (aprobado), confirmación del sello en N5 Mostrador, registro de quién dio cada sello y a qué hora, y que el límite aparezca en los términos de la tarjeta del cliente.
- Para v1 (no MVP): alerta en el panel por patrones raros (muchos sellos a pocas tarjetas o fuera de horario), siguiendo a Stamp Me y Revly.

Pendiente de Aarón: aprobar el default de 1 por día y las tres opciones.
