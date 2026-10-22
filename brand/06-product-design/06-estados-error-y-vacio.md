# 06 · Estados de error, vacío y borde del MVP (v1)

Estado: ✅ **Aprobado (2026-10-20)**, incluido el modelo offline-first y el canje sin conexión con límite. Fecha: 20 oct 2026. Base: `../04-design-system/tokens.css` y estados de `03-cards-y-estados.md`: todo estado lleva **palabra + color** (Error = rojo/rosa claro, aviso = tostado/durazno claro, info = bosque/menta), voz de tú, cálida, con una acción clara.

Tableros en `estados/` (`.html` + `.png`):

**A. Mostrador** — `a-mostrador.png` (móvil 390)
| # | Estado | Salida |
|---|---|---|
| M1 | Sin permiso de cámara | Cómo permitirla + "Buscar por WhatsApp" |
| M2 | Cliente no encontrado | Revisar número o mostrar QR de mostrador para que se registre |
| M3 | QR no válido o de otro negocio | Dice de qué negocio es y pide abrir la tarjeta correcta en Mis tarjetas |
| M4a | Doble escaneo (bloqueo fijo de 2 min, siempre activo; D-014, 2026-10-21) | "Ya registrado": no se suma otro sello |
| M4b | Límite alcanzado | "Ya recibió su sello hoy" o "Próximo sello disponible a las HH:MM"; último sello y quién lo registró; el límite se cambia en Ajustes |
| M5 | Sin conexión: modo sin conexión activo | Sigue registrando sellos y canjes en la cola local; muestra "N pendientes de sincronizar" |
| M6 | Resultado de sincronización / conflicto | "5 sincronizados, 1 por revisar" con motivo; enlace a Clientes → Por revisar |

**B. Cliente y acceso** — `b-cliente-y-acceso.png` (móvil 390)
| # | Estado | Salida |
|---|---|---|
| ~~R1~~ | ~~WhatsApp ya registrado~~ **Retirado (D-031, 2026-10-22):** decía «Ya tienes cuenta» antes del código y la respuesta debe ser la misma para un teléfono nuevo y uno existente. **R1 pasa a ser «segundo negocio»:** con sesión no pide código; sin sesión es el mismo C1 en dos pasos y recupera todas las tarjetas. Ya no existe «tarjeta por confirmar». Diseño en `tarjeta-cliente/c1-segundo-negocio-y-recuperar` y `08-registro-con-codigo.md`; el wireframe viejo queda como historial |
| R2 | Número no válido | Error en línea: 10 dígitos con ejemplo. Con D-031 se suma el rechazo de números que no son móviles de México (`c1-registro-con-codigo`, C1·1c y C1·1d) |
| R3 | Navegador sin instalación PWA | Abrir en Safari/Chrome, copiar enlace o seguir sin instalar |
| R4 | Tarjeta sin internet | Tarjeta guardada, QR generado localmente, hora de actualización y "Puede haber sellos pendientes" |
| L1 | Código de acceso vencido (dueño) | Se envía uno nuevo al correo; Ayuda por WhatsApp |

**C. Vacíos y pausa** — `c-vacios-y-pausa.png` (escritorio)
| # | Estado | Salida |
|---|---|---|
| V1 | Inicio, primera semana sin datos | Registrar visita / descargar QR |
| V2 | Clientes vacío | Exportar CSV deshabilitado; descargar QR |
| V3 | Quién regresa vacío | "Sin datos aún": se calcula con 2–3 semanas de visitas |
| P1 | Prueba terminada, cuenta en pausa | Datos guardados, sin sellos nuevos; activar plan ($299 MXN/mes + IVA, sin contratos) y **exportar CSV disponible** |

## Decisiones para ti
1. ~~M5 sin sellos sin conexión~~ **Reemplazada por Aarón (2026-10-20):** la app es offline-first (ver modelo abajo).
2. ~~M4 ventana de 10 minutos~~ **Resuelto por Aarón (2026-10-20):** 1 sello por día por defecto, configurable en N8, más bloqueo fijo de 2 min (M4a/M4b; fijado el 2026-10-21).
3. ✅ **P1 "Activar mi plan"** abre WhatsApp para coordinar el pago (aprobado 2026-10-20).
4. ✅ **L1**: el código de acceso del dueño dura 10 minutos (aprobado 2026-10-20).
5. ✅ **Canje sin conexión**: permitido con límite (aprobado 2026-10-20).


## Modelo sin conexión primero (offline-first) · decisión de Aarón 2026-10-20

Reemplaza la propuesta "no registrar sellos sin conexión". **El servidor es la fuente de verdad**; el mostrador y la tarjeta trabajan con datos en caché y sincronizan.

**1. Cola local en el dispositivo de mostrador (IndexedDB).** Cada sello o canje se guarda como evento con: `event_id` (UUID v4, llave de idempotencia), `tipo` (sello/canje), `card_id`, `qr_step` leído, `device_ts` (hora del dispositivo), `device_id`, y `firma` ECDSA P-256 con una llave del dispositivo creada con WebCrypto (no exportable) y registrada en el servidor al iniciar sesión. Reenviar un evento nunca duplica: el servidor ignora un `event_id` ya aplicado.

**2. QR rotativo validable sin conexión.** El QR del cliente lleva `card_id + paso + HMAC-SHA256(llave_tarjeta, card_id|business_id|paso)`, con pasos de 60 s calculados en el teléfono del cliente (funciona aunque el cliente no tenga internet). El mostrador guarda en caché cifrada las llaves de las tarjetas de su negocio (se refrescan en cada sincronización). En línea acepta ±2 pasos; **sin conexión, ventana de gracia de 10 min** por desfase de relojes. Tarjetas nuevas aún no en caché: el sello se acepta como **provisional** y se valida al sincronizar. Una captura de pantalla vieja (> 10 min) se rechaza.

**3. Chequeo local de límite y doble escaneo.** Con los datos en caché (último sello por tarjeta + eventos en cola) el mostrador aplica la regla configurada (1 por día / 1 cada X horas / sin límite) y el bloqueo de 2 min, igual que en línea (M4a, M4b).

**4. Sincronización al reconectar.** Background Sync del service worker (y reintento al abrir la app, con espera exponencial) envía la cola en orden. El servidor vuelve a validar: firma del dispositivo, ventana del QR, límite (usando `device_ts`, acotado a la hora de recepción menos 72 h), y duplicados entre dispositivos. Resultado por evento: **aceptado** o **rechazado con motivo**. Los rechazados no se borran: van a **Clientes → Por revisar**, donde el dueño puede *Aprobar de todos modos* o *Descartar* (queda en la bitácora).

**5. Tarjeta del cliente (PWA) sin conexión.** Muestra la última tarjeta guardada, su QR (se sigue generando localmente) y la hora de actualización. Si el mostrador le dio un sello sin conexión, la tarjeta lo verá al sincronizar el mostrador; la tarjeta nunca suma sellos por su cuenta. Mientras la tarjeta esté desactualizada muestra "Puede haber sellos pendientes".

**6. Reglas de conflicto.** Gana el servidor. Orden por `device_ts` validado; empate → primero recibido. Si dos dispositivos dan sello al mismo cliente el mismo día, se acepta el primero y el otro va a Por revisar. El conteo de la tarjeta siempre se recalcula en el servidor.

**7. Canje sin conexión — propuesta: permitido con límite.** Se permite canjear sin conexión solo si la tarjeta está completa en la caché **y** esa caché se sincronizó en las últimas 24 h, y como máximo 1 canje por tarjeta mientras dure el modo sin conexión. Riesgo: un doble canje si el cliente canjea en dos dispositivos del mismo negocio sin conexión al mismo tiempo (raro con un mostrador por negocio en el MVP); el segundo va a Por revisar y el negocio absorbe ese costo. Alternativa más segura descartada: bloquear canjes sin conexión (frustra al cliente en el momento del premio).

**Pantallas afectadas:** N5 lleva indicador de sincronización (En línea · Sincronizado / Sin conexión · N pendientes / Sincronizando); M5 pasa a modo sin conexión activo; nuevo M6 resultado de sincronización con conflicto; N7 suma la vista **Por revisar**; R4 muestra la tarjeta con estado pendiente.

