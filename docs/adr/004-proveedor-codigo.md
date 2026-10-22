# ADR-004: Proveedor del código de registro y recuperación (SMS Masivos)

- **Estado:** **Aceptado con condiciones (2026-10-21).** La elección del proveedor y el diseño están aprobados. No se construye la recuperación hasta cerrar PQ-30 y la prueba técnica del hook (sección 3).
- **Fecha:** 21 oct 2026. **Ajustado el 22 oct 2026** por D-031 y el ADR-003 reescrito: el código ahora se usa también en cada registro del cliente. Solo cambian los límites, el flujo del hook, el costo y R-18; la elección del proveedor sigue igual.
- **Decidió:** Aarón López Sosa (fundador)
- **Autor:** `lealtab-arquitecto`
- **Restricciones vigentes:**
  - D-011: código de recuperación por WhatsApp con la API de WhatsApp Business; respaldo por SMS con el mismo proveedor (aclaración del 21 oct 2026). La API no se usa para nada más (aclarado por D-031: el código cubre registro y recuperación).
  - D-018: sin cookies ni recursos de terceros.
  - D-023 y ADR-002: hook de teléfono/OTP de Supabase Auth con un proveedor externo.
  - RNF-STK-06 y RNF-STK-10.
  - ADR-003 (reescrito el 22 oct 2026) y D-031: el cliente usa Supabase Auth con teléfono verificado por OTP desde el registro; los límites por teléfono ahora cubren registros.
- **Decisiones del 21 oct 2026:** D-024 en `docs/decisiones.md`, con aclaración a D-011. PQ-13, PQ-22 (f) y PQ-23.
- **Detalle técnico:** `docs/fase-7/propuestas/pq-arquitectura.md` §7 y §9. Si choca con `aprobaciones-2026-10-21.md`, manda este ADR, que sigue ese archivo.

## 1. Contexto

ADR-002 dejó «Por definir» el proveedor del código por WhatsApp. Aarón eligió **SMS Masivos** (https://www.smsmasivos.com.mx/), integrado con el *Send SMS hook* de Supabase Auth.

Lo verificado el 21 oct 2026:

- **Hook de Supabase.** Recibe el usuario y el código (`sms.otp`, de 6 dígitos) y puede ser un endpoint HTTP. Responder 200 vacío basta; otro código hace fallar la solicitud. El hook decide el canal real ([docs](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook)). Los proveedores nativos de teléfono y el canal `whatsapp` de Supabase solo existen con Twilio ([login por teléfono](https://supabase.com/docs/guides/auth/phone-login)); con SMS Masivos no hay proveedor nativo.
- **API de SMS Masivos.** REST con encabezado `apikey`. `POST /v2/otp` envía por `sms`, `whatsapp` o `voice`, y `code_custom` permite enviar **un código que ya existe**. Verificar con su API es gratis, pero aquí no se usa. Errores útiles: `402 otp_insufficient_credits`, `429 otp_throttled`, `502 otp_send_failed` ([referencia](https://app.smsmasivos.com.mx/api-docs/api-reference), [errores y límites](https://app.smsmasivos.com.mx/api-docs/errors)).
- **Dos «WhatsApp» distintos.** El de `/v2/otp` (`channel: whatsapp`) usa una plantilla fija descrita como «integración oficial», sin cuenta de Meta propia. El de `/whatsapp/send` se conecta escaneando un QR «igual que WhatsApp Web», con límite de 1 envío cada 60 s y advertencia de bloqueo de línea: **no sirve** y no es la API de D-011 ([WhatsApp](https://app.smsmasivos.com.mx/api-docs/whatsapp)).
- **Precio.** SMS: MXN 0.90 (recarga de 500 o más), 0.77 (1,000+), 0.68 (10,000+), antes de IVA; compra mínima de 500 mensajes ([precios](https://www.smsmasivos.com.mx/precios-sms-masivos)). El WhatsApp OTP **no tiene precio publicado**.
- **Datos.** Servidores en Estados Unidos; actúa como encargado; conserva número, contenido y metadatos de entrega hasta 3 meses ([aviso de privacidad](https://www.smsmasivos.com.mx/aviso-de-privacidad)). Las cookies que menciona son de su sitio web; el flujo es de servidor a servidor.
- **SMS.** Alfabeto GSM-7 (sin «á», «é», «ó»), con `{{code}}` y `{{company}}` obligatorios.

### Opciones consideradas

| | SMS Masivos | Meta Cloud API directo | Twilio Verify |
|---|---|---|---|
| Cuenta de Meta propia | No (según el proveedor) | Sí: portafolio, WABA, número y verificación del negocio | Sí: remitente propio |
| Respaldo SMS | Sí, misma API | Otro proveedor | Solo en una función piloto con ventas |
| Plantilla de WhatsApp | Fija, del proveedor | La crea LealTab | Automática |
| Punto débil | Confirmar que su WhatsApp es el oficial; precio sin publicar; remitente ajeno | Trámite de Meta | Costo por verificación más tarifas de Meta y Twilio |

Descartadas: WhatsApp directo con Meta, Twilio Verify y 360dialog. SMS Masivos ahorra el trámite con Meta (que toca RNF-PRI-08: razón social y RFC) y trae el respaldo SMS en la misma API. El riesgo es de confirmación, no de diseño.

## 2. Decisión

1. **Proveedor: SMS Masivos**, con el hook de SMS de Supabase Auth. **Supabase genera y verifica el código; el hook solo lo envía.** Nunca se llama a `/v2/otp/verify`.
2. **Endpoint del hook:** `/api/hooks/send-sms` (ruta de Next.js). Verifica la firma del hook (Standard Webhooks, secreto en variables de entorno), normaliza el teléfono (deja 10 dígitos si empieza con `52`; cualquier otro país se rechaza) y llama a `POST /v2/otp` con:
   - `phone_number` y `country_code: 52`;
   - `company: "LealTab"`;
   - `code_custom` igual al código de Supabase y `code_rotate: true`;
   - `expiration_date` a 10 min;
   - `channel` y el texto del SMS.

   Responde 200 si el envío salió. Nunca se usa `code_in_response` ni se registra el código en los logs.
3. **Cómo decide el hook el canal** (principal WhatsApp, respaldo SMS):
   - Supabase siempre pide el canal por defecto: `signInWithOtp` se llama **sin `channel`**. El hook decide el canal real, lo que elimina el riesgo de depender del canal `whatsapp` de Supabase.
   - **Primer envío:** WhatsApp.
   - **Fallo inmediato** (`502`, `5xx` o tiempo agotado): el hook reintenta **en la misma llamada** por SMS.
   - **El cliente lo pide:** tras 30 a 60 s, C1 y `/c/recuperar` ofrecen «Mejor recíbelo por SMS». El servidor anota la intención (`auto` o `sms`) en `envio_codigo` y el hook la lee.
   - **Sin créditos o sin servicio en los dos canales:** el hook responde error, la pantalla dice «No pudimos enviarte el código. Intenta en unos minutos» y se avisa a Aarón por correo. **No se pueden registrar clientes nuevos ni entrar sin sesión** (R-18); quien ya tiene sesión y los sellos no se afectan (RF-SEL-02).
   - SMS (GSM-7, menos de 160 caracteres): `{{company}}: tu clave es {{code}}. Vence en 10 min. No la compartas.` El texto de WhatsApp es fijo y no lo controlamos; `lealtab-copywriter` lo revisa cuando el proveedor lo entregue.
4. **Registro y alertas.**
   - `envio_codigo` guarda fecha, teléfono, canal, resultado y `request_id` del proveedor.
   - Un cron de Vercel consulta `GET /credits/consult` cada día y avisa a Aarón por correo si el saldo baja de un umbral (300 mensajes, aprobado el 22 oct 2026; era 100) o si fallan 3 de los últimos 10 envíos.
   - Gatillo para reconsiderar con una D- nueva: 5 % o más de recuperaciones fallidas en los dos canales, o una caída del proveedor de más de un día. Entonces se evalúa otro proveedor.
5. **Secretos y entornos.** La `apikey` de producción va en variables de entorno de Vercel solo de producción. Las vistas previas usan otra llave con `sandbox: 1` (100 envíos de prueba al día).
6. **Correo del dueño.** Los correos de Auth del dueño (código y restablecimiento) salen por **SMTP propio con Resend** (PQ-28). El código del cliente y el correo del dueño son flujos y proveedores distintos.
7. **Datos tratados en Estados Unidos.** SMS Masivos, Supabase (`us-east-1`, `[SUPUESTO]` hasta medir la latencia a Tabasco) y Vercel (`iad1`) tratan datos en EE. UU. SMS Masivos los conserva hasta 3 meses (número y contenido, que incluye un código ya caducado). Se declara en el aviso de privacidad y se ata al contrato de encargo (PQ-18, RNF-PRI-08, D-017).
8. **El hook es el punto de paso obligado de los límites** (ADR-003 §2.8), porque quien tiene la llave pública puede llamar a Auth sin pasar por nuestro servidor. Antes de enviar, el hook rechaza (responde error) si:
   - el teléfono no es un móvil de México de 10 dígitos;
   - el teléfono ya tiene 3 envíos en la última hora o 10 en el día (cuenta `envio_codigo`);
   - el total del día llegó al tope global (400, aprobado el 22 oct 2026, con aviso a Aarón a los 200).

   Registra cada envío (propósito `registro`, `recuperacion` o `install`). Los límites por IP y los 5 intentos por código los aplica el servidor en `/c/api/auth/*`; el hook no recibe la IP.
9. **Subir los límites de Supabase** (SMS por hora de 30 a `[SUPUESTO]` 100; topes por IP de `/otp`, `/verify` y `/token`, compartidos si las llamadas salen de Vercel) y confirmar la vigencia de 10 min: ADR-003 §2.8 y prueba 3.
10. **Reglas del código** (vigencia, intentos, límites): ADR-003.
11. **El hook corre dentro de la transacción de Supabase y antes de guardar el código** (`phone.go`, ver ADR-003 §1). Un reintento por SMS en la misma llamada alarga esa transacción; el tiempo máximo del hook no está documentado, así que se mide en la prueba 4 de abajo.

## 3. Por definir

**Condiciones para pasar a «Aceptado» sin reservas:**

- **PQ-30, confirmaciones por escrito de SMS Masivos antes de construir la recuperación:**
  1. Que el OTP por WhatsApp (`/v2/otp`, `channel: whatsapp`) usa la **API oficial de Meta** (WhatsApp Business), como pide D-011. Si usa una ruta no oficial, no se acepta y se reabre la elección de proveedor con Aarón.
  2. El **texto exacto de la plantilla** y el **remitente** que verá el cliente (no será un número de LealTab; `[SUPUESTO]`).
  3. La **cotización** del WhatsApp OTP y del SMS para el volumen del piloto.
  4. Si hay **webhooks de entrega**. La documentación del OTP solo muestra `GET /v2/otp/status` (`[SUPUESTO]`: sin webhooks). Si no hay, el estado de entrega se consulta o se omite.
- **Prueba técnica del hook sin proveedor nativo (*spike*), con salida definida** (es la prueba 1 del ADR-003; ahora bloquea también el registro del cliente):
  1. Que `signInWithOtp` con teléfono llegue al hook sin proveedor de teléfono nativo y sin `channel`. La lectura del código de Supabase indica que con el hook habilitado no se consulta ningún proveedor, pero no se confirmó que `/otp` no exija el interruptor del proveedor.
  2. Que `code_custom` de 6 dígitos con `channel: whatsapp` y `code_rotate: true` entregue exactamente el código de Supabase, también en reenvíos.
  3. Entrega real en Telcel, AT&T y Movistar, en iPhone y Android, por los dos canales.
  4. Tiempo de respuesta de la API frente al tiempo máximo del hook (no documentado).
  - **Si el hook no se dispara** sin proveedor nativo: las salidas están en ADR-003 §3 (proveedor nominal de relleno, o código propio sin Supabase Auth, que contradice D-031 y D-023). No se elige sin la prueba; se avisa al coordinador para llevarlo a Aarón.
- **Costo.** El WhatsApp no tiene precio publicado. Hasta la cotización, RNF-REN-06 queda sin cambio (PQ-29).
- **Cuenta y operación.** Quién abre la cuenta de SMS Masivos y con qué datos fiscales (RNF-PRI-08); primera recarga mínima de 500 mensajes (MXN 450 + IVA al precio de 0.90).
- **Aviso de privacidad y consulta legal** (D-017, PQ-18): nombrar a SMS Masivos como encargado, la conservación de 3 meses y la transferencia a EE. UU.

## 4. Consecuencias

- **Un solo proveedor para los dos canales:** punto único de falla, mitigado con las alertas de saldo y de fallos. Con D-031 el impacto es mayor (bloquea registros). Cambiar de proveedor es cambiar un endpoint.
- **Costo (corregido el 22 oct 2026).** Cada registro consume un código. Piloto (`[SUPUESTO]`): 10 a 14 negocios × 200 clientes = 2,000 a 2,800 altas; con 1.3 envíos por alta (reintentos y recuperaciones), 2,600 a 3,640 envíos. Todo en SMS y antes de IVA: MXN 2,002 a 3,276 (USD 108 a 177 a MXN 18.5), una sola vez a lo largo del piloto. Sustituye al cálculo anterior de unos MXN 380, que cubría solo recuperaciones. El costo con WhatsApp depende de la cotización (PQ-30). Detalle en ADR-003 §4.
- **R-18 sube de peso.** El proveedor está ahora en la ruta crítica del **registro** y de la entrada sin sesión: si se cae o se queda sin saldo, no se registran clientes nuevos. El umbral de alerta de saldo sube de 100 a `[SUPUESTO]` 300 mensajes para cubrir un día de arranque. El gatillo de reconsiderar proveedor sigue igual.
- **Solo México:** números de 10 dígitos (RF-APP-03); el hook rechaza otro prefijo, lo que también frena el envío masivo a otros países.
- **Privacidad.** Hay datos en el extranjero y un encargado más. Las cookies del sitio de SMS Masivos no nos afectan: el cliente nunca lo visita (RNF-STK-10).
- **Texto de WhatsApp ajeno.** La plantilla es del proveedor; la marca LealTab solo aparece como `company` en el SMS. Hay que validar que el remitente no desconfíe al cliente.
- **El hook queda en la ruta crítica del registro y la recuperación,** pero no de los sellos: un fallo del proveedor no detiene el mostrador.
- **Fuentes** (consultadas el 21 oct 2026): las URL citadas arriba y en `pq-arquitectura.md` §12.
