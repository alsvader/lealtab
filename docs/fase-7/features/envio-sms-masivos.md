# Feature: Envío del código con SMS Masivos

**Estado:** En construcción (aprobado por Aarón el 30 oct 2026)
**Fase:** 7 · **Rama:** `feat/envio-sms-masivos` (sale de `feat/registro-cliente`: el hook todavía no está en `main`)
**Cubre:** RF-APP-15, RNF-STK-06 · **Pantallas:** ninguna · **Flujos:** el envío de F1 (registro) y de la recuperación, no las pantallas
**Restricciones:** D-024, D-031, ADR-003 §2.8, ADR-004 §2. El contrato de `POST /v2/otp` es el del brief `spike-auth-cliente` donde choque con el ADR, más lo confirmado en la referencia del proveedor el 30 oct 2026.

## Objetivo

Que el hook de Supabase deje de responder 501 en `sandbox` y `live` y llame a SMS Masivos con el código que generó Auth. En local el modo `stub` sigue igual y no gasta saldo. Un teléfono real solo recibe el código cuando el modo es `live` y la instancia self-host tiene el hook prendido.

## Fuentes

- Arquitectura: `docs/adr/004-proveedor-codigo.md` §2 y `docs/adr/003-sesion-cliente-y-codigo.md` §2.2 y §2.8.
- Contrato ya aprobado: `docs/fase-7/features/spike-auth-cliente.md`, sección «API de SMS Masivos».
- Referencia del proveedor, consultada el 30 oct 2026: [API](https://app.smsmasivos.com.mx/api-docs/api-reference). `sandbox: true` ejecuta el flujo y **no entrega** el mensaje ni descuenta saldo.
- Self-host: [Auth Hooks](https://supabase.com/docs/guides/self-hosting/self-hosted-auth-hooks) y [Phone sign-in y MFA](https://supabase.com/docs/guides/self-hosting/self-hosted-phone-mfa). Plantilla Docker `ENABLE_PHONE_AUTOCONFIRM=true`: con eso el hook no corre.
- Copy del SMS: ADR-004 §2.3, sin acentos. La plantilla de WhatsApp es fija del proveedor.
- Eventos: no emite eventos de `07-entrega` §5. Sigue escribiendo `envio_codigo`.
- Diseño: no aplica. El botón «Mejor recíbelo por SMS» no entra aquí.

## Alcance

### Dentro

- Cliente de `POST https://api.smsmasivos.com.mx/v2/otp` y su uso en `POST /api/hooks/send-sms` cuando `SMS_PROVIDER_MODE` es `sandbox` o `live`.
- Canal: `auto` empieza por WhatsApp y, si ese intento falla por entrega, pasa a SMS en la misma llamada. `canal_intencion = sms` manda solo SMS. El hook ya recibe esa intención desde `servidor.autorizar_envio_codigo`.
- Vigencia del OTP de Auth en el `config.toml` local: 600 segundos.
- Lista de variables del servicio `auth` para la instancia self-host. Aplicarlas en el servidor queda fuera de este repo: aquí no hay `docker-compose` de self-host.

### Fuera

- Cambiar el modo local de `stub` a `sandbox` o `live`. Las specs de producto siguen con el código fijo `847291` y sin llamar al proveedor.
- Abrir `[auth] enable_signup`. El alta por correo sigue cerrada.
- Quitar el Twilio de relleno del `config.toml` local. Ese stack del CLI apaga el teléfono si no hay un proveedor marcado.
- El botón de C1 y de `/c/recuperar` que escribe `canal_intencion = sms`. La columna ya existe; quien la llena es la pantalla, en otro feature.
- Cron de saldo, aviso por correo a Aarón y alerta de 3 fallos en 10 envíos (ADR-004 §2.4).
- Entrega real en Telcel, AT&T y Movistar, en iPhone y Android (spike T7). Hace falta la `apikey` y un teléfono.
- Editar `docs/decisiones.md`, el PRD o los ADR.

## Tareas

| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | Cliente `enviarOtp` en `web/src/lib/auth/sms-masivos.ts` | — | - `POST` a `https://api.smsmasivos.com.mx/v2/otp` con `apikey`, `phone_number` de 10 dígitos, `country_code` `"52"`, `company` `"LealTab"`, `message` con `{{code}}` y `{{company}}`, y `code_custom` de 6 dígitos (prueba con `fetch` simulado) <br> - El texto, ya sustituido, es GSM-7, sin acentos, y no pasa de 160 caracteres: `LealTab: tu clave es 123456. Vence en 10 min. No la compartas.` (prueba) <br> - No manda `code_length`, `code_format`, `code_rotate` ni `code_in_response` (prueba) <br> - `sandbox` manda `sandbox: true`. `live` no manda `sandbox` (prueba) <br> - HTTP 200 o 201 sin campo `error` es éxito y devuelve `request_id` si viene. HTTP 200 con `error` es fallo (prueba) <br> - Cada intento corta a los 4 s. El cuerpo de la respuesta no se escribe en el log (prueba) |
| T2 | El hook usa el cliente en `sandbox` y `live` | T1 | - `stub` sigue en 200, sin `fetch` al proveedor, y `envio_codigo.resultado = enviado` (spec y prueba actuales) <br> - `auto`: primer `channel` `whatsapp`. Si responde 502, otro 5xx o se agota el tiempo, un segundo intento `sms` en la misma llamada. 200 o 201 del segundo es éxito (prueba) <br> - `canal_intencion = sms`: un solo intento `sms` (prueba) <br> - 400 o 402 no cambian de canal. 429 no se reintenta. Si los dos intentos fallan, el hook responde distinto de 200 y no marca `enviado` (prueba) <br> - Éxito: 200 con cuerpo vacío, `canal` igual al que salió y `request_id` guardado. El log no lleva el código ni el teléfono (prueba) <br> - `SMS_PROVIDER_MODE=stub` con `LT_ENV` distinto de `local` sigue sin arrancar (prueba actual) |
| T3 | Vigencia de 10 min en el Auth local | — | - `[auth.sms]` en `web/supabase/config.toml` tiene `otp_expiry = 600`. El de correo no se usa como sustituto (revisión del archivo) <br> - `[auth] enable_signup` sigue en `false` y `[auth.sms.test_otp]` sigue en `529931009901 = "847291"` (revisión) <br> - `pnpm lint` y `pnpm typecheck` en `web/` |

## Contrato del envío

Confirmado en la referencia del 30 oct 2026. Manda sobre el ADR donde chocan.

- Encabezado `apikey`. El valor sale de `SMSMASIVOS_API_KEY` y no se imprime.
- `message` se manda también con WhatsApp: el proveedor lo ignora y usa su plantilla. `company` y `message` son obligatorios en los dos canales.
- `expiration_date` va 10 minutos adelante, en UTC, formato `YYYY-MM-DD HH:mm:ss`. Auth sigue siendo quien vence el código a los 600 s. Si el primer llamado real muestra otra zona, se corrige en T2 sin cambiar el texto.
- `sandbox: true` no entrega el SMS ni cobra. Sirve para probar la llamada. El teléfono solo recibe el código en `live`.
- No se llama a `POST /v2/otp/verify`.

## Self-host

Estas variables van en el servicio `auth` del compose del servidor. Ponerlas solo en `.env` no alcanza: el compose tiene que pasarlas. Después se recrea `auth`.

```bash
ENABLE_PHONE_SIGNUP=true
ENABLE_PHONE_AUTOCONFIRM=false
GOTRUE_EXTERNAL_PHONE_ENABLED=true
GOTRUE_SMS_AUTOCONFIRM=false
GOTRUE_HOOK_SEND_SMS_ENABLED=true
GOTRUE_HOOK_SEND_SMS_URI=https://<host-de-la-app>/api/hooks/send-sms
GOTRUE_HOOK_SEND_SMS_SECRETS=<v1,whsec_…>
GOTRUE_SMS_OTP_EXP=600
GOTRUE_SMS_OTP_LENGTH=6
GOTRUE_SMS_MAX_FREQUENCY=60s
GOTRUE_RATE_LIMIT_SMS_SENT=100
```

`http://` solo vale para `localhost`, `127.0.0.1`, `::1` y `host.docker.internal`. En el servidor la URI es HTTPS. No hace falta un proveedor nativo (Twilio, MessageBird, TextLocal o Vonage): el hook lo reemplaza. `GOTRUE_SMS_TEMPLATE` no la lee el hook.

## Por definir

- PQ-30 sigue abierta en la parte de teléfonos reales. Este feature no la cierra: T1 y T2 se prueban con `fetch` simulado.
- La zona de `expiration_date` queda en UTC hasta el primer llamado real.

## Pendientes para Aarón

1. Aprobar este brief antes de construir.
2. La `apikey` de sandbox o de live, fuera del repositorio, cuando se quiera un llamado real. No bloquea T1 a T3.
3. El compose de la instancia self-host, para pegar el bloque de arriba. No está en este repo.
4. Un móvil para el modo `live`. `sandbox` no entrega el mensaje.
