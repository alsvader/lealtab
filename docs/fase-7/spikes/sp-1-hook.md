# SP-1 · Hook de SMS sin proveedor nativo

**Fecha:** 2026-10-27
**Entorno local:** Supabase CLI 2.121.0, Auth de ese CLI, `LT_ENV=local`, `SMS_PROVIDER_MODE=stub`.
**No se usó** el proyecto alojado ni teléfonos reales.

## Objetivo

Ver si, en local, el código fijo de `test_otp` entra sin llamar a SMS Masivos, si el hook rechaza una firma mala y si los límites de envío se cumplen. La entrega real y el iPhone quedan pendientes.

## Lo que pasó en esta máquina

| Criterio | Resultado | Evidencia |
|---|---|---|
| El registro por correo sigue cerrado y una cuenta que ya existe entra con contraseña | Pasa | `src/test/sms-test-otp.test.ts` |
| `test_otp` deja entrar con el código fijo. El servidor crea al usuario; `create_user: true` no se usa | Pasa | La misma prueba |
| Sin un proveedor marcado, GoTrue apaga el teléfono (`phone_provider_disabled`), aunque el hook exista | Pasa, como hallazgo | Twilio queda con credenciales de relleno que no se usan. Si `[auth] enable_signup` es `true`, también se abre el alta por correo. Por eso sigue en `false` |
| 4.º envío en una hora, 11.º del día y tope de 400 | Pasa | `src/test/rls/06-autorizar-envio.test.ts` |
| Un teléfono que no es `+52` y 10 dígitos no pasa | Pasa | La misma prueba, `23514` |
| `anon` y `authenticated` no ejecutan las funciones | Pasa | `src/test/rls/05-esquemas-servicio.test.ts` |
| Firma mala del hook: 401, sin el secreto ni el código | Pasa | `e2e-producto/hook-sms.spec.ts` |
| Firma buena: 200 y `envio_codigo.resultado = enviado` | Pasa | La misma spec |
| El log del stub es `[HOOK] enviado`, sin código ni teléfono | Pasa | `src/lib/auth/hook-sms.test.ts` |
| `stub` con `LT_ENV` distinto de `local` no arranca | Pasa | `src/lib/env.test.ts` |
| `/c/api/auth/codigo` responde igual si el teléfono existe o no | Pasa | `e2e-producto/codigo-cliente.spec.ts` |
| El código deja `lt-cliente` `HttpOnly` y `Path=/c` | Pasa | La misma spec |
| Un dueño no pasa a `rol = cliente` | Pasa | La misma spec |
| La página de prueba no llama a Supabase y el manifest solo cubre `/c/prueba-auth` | Pasa | La misma spec. Sin `LT_ENV=local` la página llama a `notFound()`; el servidor de e2e siempre es local, y `entornoLocal()` se prueba en `env.test.ts` |

`test_otp` no llama al hook. El hook se probó con una carga firmada a mano, como prevé la arquitectura §6.3.

## API de SMS Masivos

Consultada el 27 oct 2026. El envío vivo todavía no se llama. Cuando se llame: `POST /v2/otp`, sin `code_length` ni `code_format` junto a `code_custom`, sin `code_rotate` para rotar un código igual, y sin `POST /v2/otp/verify`. WhatsApp ignora `message` y `company`.

## Pendiente de dispositivo y de proyecto alojado

| Prueba | Estado |
|---|---|
| SP-1: que el proyecto alojado llame al hook sin proveedor nativo | Pendiente. Hace falta `lealtab-pruebas` y un túnel HTTPS |
| SP-1: entrega real, Telcel, AT&T y Movistar, en iPhone y Android, por WhatsApp y SMS | Pendiente de dispositivo |
| SP-1: tiempo máximo del hook (PQ-39) | Pendiente del alojado |
| SP-2: `install_token` en iOS 18 y 26, y si `signOut others` mata la PWA (PQ-31, PQ-36) | Pendiente de dispositivo |
| SP-3 C6: caducidad de la cookie en Safari | Pendiente de dispositivo |
| SP-4: subir los límites de Auth en el plan gratuito | Pendiente del alojado |

## Decisión

En local el camino queda armado: el servidor crea al usuario de teléfono, Supabase solo verifica el código, y el hook solo lo enviaría. No se elige la salida del ADR-003 §3 (proveedor de relleno como camino real, o código propio) hasta la prueba en el proyecto alojado.
