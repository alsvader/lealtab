# Feature: Spike de auth del cliente

**Estado:** Aprobado por Aarón (27 oct 2026)
**Fase:** 7 · **Rama:** `feat/spike-auth-cliente` (se crea al aprobar)
**Cubre:** RNF-STK-06; RNF-PWA-05 (solo la página y el manifest de prueba); RF-APP-15 (el envío del código, no la pantalla C1) · **Pantallas:** ninguna de producto · **Flujos:** ninguno cerrado
**Restricciones:** D-031, D-023, D-024, ADR-003, ADR-004. H-01 sigue: el registro por correo permanece cerrado.

## Objetivo

Saber si Supabase llama al hook de SMS sin un proveedor nativo y si el código que llega es el mismo que generó Auth. En local se deja el hook, los límites y una página de prueba. La entrega real por operador y el iPhone quedan para cuando exista el proyecto alojado de pruebas y los teléfonos.

## Fuentes

- Arquitectura: `docs/fase-7/arquitectura.md` §5.2, §5.6, §6 y §8 (SP-1 a SP-4).
- El código desechable del spike no se despliega (`arquitectura.md` §8). El hook sí vive en la app, porque `registro-cliente` lo va a usar.
- C1, R1 y el copy del cliente no entran aquí. Están en `brand/06-product-design/08-registro-con-codigo.md` y se construyen en `registro-cliente`.

## Alcance

### Dentro

- Hook `POST /api/hooks/send-sms` en modo `stub` en local: verifica la firma, solo acepta móviles de México y no escribe el código en los logs.
- `servidor.autorizar_envio_codigo`: 3 por hora y 10 al día por teléfono, tope global de 400 al día.
- `POST /c/api/auth/codigo` y `POST /c/api/auth/verificar` con `test_otp` en local. Cookie `lt-cliente`. El servidor pone `rol = cliente` si el usuario no es dueño. La respuesta no dice si el teléfono ya existía.
- Página y manifest de prueba, solo con `LT_ENV=local`, para el iPhone. No es C1.
- Informe `docs/fase-7/spikes/sp-1-hook.md` con lo que se pudo probar en esta máquina.

### Fuera

- `servidor.registrar_cliente`, C0, C1, C3, C4 y el sello de bienvenida. Eso es `registro-cliente`, y espera a que SP-1 pase.
- Entrega real por Telcel, AT&T y Movistar, el túnel HTTPS y el proyecto `lealtab-pruebas`. SP-1 (3), SP-2, SP-3 C6 y SP-4. Quedan en el informe como pendientes; no bloquean el código local.
- SP-5 (hook del token) es opcional y no entra.
- SP-6 (escáner) entra en `mostrador-n5`.
- Reabrir `[auth] enable_signup`. El registro por correo sigue cerrado. El usuario de teléfono lo crea el servidor, igual que al dueño: GoTrue no deja crear por OTP si el registro global está cerrado, y abrirlo también abre el alta por correo.

## Tareas

| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | Configurar el hook y `test_otp` en `config.toml` local, sin proveedor real y sin abrir el registro por correo | — | - `[auth] enable_signup` sigue en `false` y `POST /auth/v1/signup` no crea cuenta (spec) <br> - Una cuenta de correo que ya existe sigue entrando con contraseña (spec) <br> - Twilio queda con credenciales de relleno: sin un proveedor marcado, GoTrue apaga el teléfono aunque el hook exista <br> - El servidor crea al usuario de teléfono y `test_otp` lo deja entrar con el código fijo, sin llamar a SMS Masivos (spec). `create_user: true` no se usa: con el registro global cerrado GoTrue responde `signup_disabled` |
| T2 | `servidor.autorizar_envio_codigo` y la bitácora en `envio_codigo` | T1 | - El 4.º envío en una hora y el 11.º del día se rechazan (prueba) <br> - El tope de 400 al día se rechaza (prueba) <br> - Un teléfono que no es `+52` y 10 dígitos no pasa (prueba) <br> - `anon` y `authenticated` no ejecutan la función (prueba RLS) |
| T3 | `POST /api/hooks/send-sms` en modo `stub` | T2 | - Firma mala: 401, sin cuerpo que explique el secreto (spec) <br> - Firma buena y teléfono de México: 200 y `envio_codigo.resultado = enviado` (spec) <br> - El log no contiene el código ni el teléfono completo (spec) <br> - Con `LT_ENV` distinto de `local`, el modo `stub` no arranca (prueba) |
| T4 | `POST /c/api/auth/codigo` y `…/verificar` | T1, T3 | - La respuesta es la misma si el teléfono existe o no (spec) <br> - El código de `test_otp` deja `lt-cliente` `HttpOnly` y `Path=/c` (spec) <br> - Un usuario que ya es dueño no pasa a `rol = cliente` (spec) <br> - El navegador no llama a Supabase (spec) |
| T5 | Página `/c/prueba-auth` y manifest de prueba, solo en local | T4 | - Con `LT_ENV=local` la página responde 200 y pide el teléfono (spec) <br> - Sin `LT_ENV=local` responde 404 (spec) <br> - El manifest solo tiene alcance en esa ruta de prueba (revisión) |
| T6 | Informe SP-1 | T1 a T5 | - `docs/fase-7/spikes/sp-1-hook.md` con lo local en pasa o no pasa, y la entrega real, el alojado y los iPhone marcados como pendientes de dispositivo |

## API de SMS Masivos

Consultada el 27 oct 2026 en [la documentación](https://app.smsmasivos.com.mx/api-docs). El envío vivo no entra en T1 (ahí el código es `test_otp` y no sale de la máquina). Cuando el hook llame al proveedor, el contrato es este, no el de la arquitectura donde choque:

- `POST https://api.smsmasivos.com.mx/v2/otp` con el encabezado `apikey`.
- Obligatorios: `phone_number` (10 dígitos, sin `+52`), `country_code` `"52"`, `company` y `message`.
- `message` lleva `{{code}}` y `{{company}}`, solo GSM-7, y no pasa de 160 caracteres ya sustituidos. El texto del SMS sigue siendo el de la arquitectura, sin acentos.
- `channel`: `whatsapp` ignora `message` y `company`. Sale la plantilla fija, remitente `Authenticate`. `sms` usa `message`. `voice` no se usa.
- `code_custom` es el código de Supabase: 4 a 10 caracteres, letras o números. No se manda junto con `code_length` ni `code_format` (si no, `400 otp_invalid_param`).
- Con `code_custom`, repetir el mismo código no rota la ronda aunque se envíe `code_rotate: true`. Un código distinto sí abre otra ronda. No se usa `code_rotate` para eso.
- No se llama a `POST /v2/otp/verify` ni se pide `code_in_response`. Quien verifica es Supabase.
- Si el envío responde `402 otp_insufficient_credits` o `502 otp_send_failed`, el código quedó registrado allá pero no se entregó: se reintenta el envío, no se verifica.
- Su cooldown es de 30 s. El nuestro y el de Supabase siguen en 60 s.
- `sandbox: 1` no gasta créditos.

## Por definir

- PQ-30, PQ-31, PQ-36 y PQ-39 no se cierran en este brief. El informe deja la evidencia local y señala qué falta medir en el proyecto alojado y en los teléfonos.
- Si `test_otp` no llama al hook, T3 se prueba con una carga firmada a mano, como dice la arquitectura §6.3. No se inventa otro camino.

## Pendientes para Aarón

1. Aprobar este brief antes de construir.
2. El proyecto Supabase de pruebas y un túnel HTTPS, cuando se quiera la parte de SP-1 que no cabe en local.
3. Un iPhone con iOS 18 y otro con iOS 26, y un Android, para la entrega real. No bloquean T1 a T6.
