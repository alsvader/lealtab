# 07 · Entrega a desarrollo del MVP (v1)

Estado: **✅ Aprobado y Fase 6 cerrada (2026-10-20)**. Siguiente: Fase 7 (Desarrollo del MVP + piloto 0), que sale por criterio, sin fecha (ver `docs/02-plan-de-trabajo.md`).
> Historial: la fecha de producción original (8 nov 2026) ya no rige.
Vista general: `entrega/mapa-pantallas.png`. Decisiones completas: `01-mapa-de-flujos-mvp.md` §6. Tokens: `../04-design-system/tokens.css` (importar tal cual; no inventar hexes).

## 1. Índice de pantallas
| Id | Pantalla | Archivo (`.html` + `.png`) | Estados |
|---|---|---|---|
| N0 | Inicio · resumen semanal (pantalla al entrar) | `inicio/n0-inicio`, `inicio/n0-inicio-movil` | con datos · V1 primera semana |
| N1 | Cuenta (alta self-serve) | `alta/n1-cuenta` | normal · L1 código vencido |
| N2 | Tu negocio | `alta/n2-negocio` | normal |
| N3 | Tu tarjeta (+ vista previa) | `alta/n3-tarjeta`, `alta/n3-tarjeta-movil` | bienvenida on/off |
| N4 | QR de mostrador | `alta/n4-qr-mostrador` | normal |
| N5 | Mostrador | `panel/n5-mostrador` | escanear · confirmar · canjear · límite; M1–M6 en `estados/a-mostrador` |
| N6 | Quién regresa | `panel/n6-quien-regresa` | con datos · V3 vacío |
| N7 | Clientes + ficha + Por revisar | `inicio/n7-clientes` | con datos · V2 vacío |
| N8 | Ajustes | `inicio/n8-ajustes` | normal · P1 cuenta en pausa (`estados/c-vacios-y-pausa`) |
| C0 | Mis tarjetas | `tarjeta-cliente/c0-mis-tarjetas` | con tarjetas · vacío |
| C1–C4 | Registro · Instalar · Mi tarjeta · Recompensa | `tarjeta-cliente/tarjeta-con-leyenda` | R2–R4 en `estados/b-cliente-y-acceso`. **D-031 (propuesta, pieza 08):** C1 en dos pasos con código en `tarjeta-cliente/c1-registro-con-codigo`; R1 como segundo negocio y recuperación en `tarjeta-cliente/c1-segundo-negocio-y-recuperar`; C2 en iPhone con `install_token` en `tarjeta-cliente/c2-instalar-ios-install-token`. El R1 «WhatsApp ya registrado» de `b-cliente-y-acceso` queda retirado |

## 2. Componentes → tokens
| Componente | Tokens |
|---|---|
| Botón primary / secondary / ghost / destructive | `--color-bosque`/`--color-blanco-lino`/transparente/`--color-rojo`; borde `--border-product` noche; `--radius-control`; `--shadow-button`; foco `--focus-ring` |
| Campo | `--border-product` noche, error `--color-rojo`; `--radius-control`; `--font-size-input` (16 en todo tamaño de pantalla, evita zoom en iOS) |
| Card / panel | `--color-blanco-lino`, `--border-hair`/`--border-product`, `--radius-card`; dashboard plano (sin sombra) |
| Chip de estado | Frecuente `--color-menta`/`--color-bosque` · En riesgo `--color-durazno-claro`/`--color-tostado` · Error `--color-rosa-claro`/`--color-rojo`; `--radius-sticker`; siempre con palabra |
| Tabla | `th` Manrope 700 `--font-size-label` mayúsculas; filas `--border-hair`; seleccionada menta |
| Aro de progreso | carril `--color-menta`, avance `--color-bosque`, `--color-durazno` solo completo; siempre sobre blanco lino, nunca sobre bosque ni avance en lino |
| Indicador de sincronización | píldora `--radius-full`: en línea menta/bosque · sin conexión durazno claro/tostado |
| Tipografía | títulos `--font-display` 800 condensado; UI `--font-body` (Manrope) |

## 3. Entidades de datos
- **negocio**: id, nombre, giro, ciudad, zona_horaria, logo, plan, estado (prueba/activo/pausa), fin_prueba, whatsapp, correo_dueño.
- **tarjeta_config**: negocio_id, sellos_meta (4–12), recompensa, sello_bienvenida (bool), limite_modo (por_dia/cada_x_horas/sin_limite), limite_minutos (entero; en la interfaz son horas con hasta 2 decimales, 0 < X ≤ 24; la UI sugiere 2 h; PRD §8). *Validación (D-014, aclarado 2026-10-21): no se exige ≥2; el piso de cualquier regla es el bloqueo fijo de 2 min contra doble escaneo.*
- **identidad** (plataforma): id, whatsapp (E.164, **único identificador global**; identifica la cuenta en la PWA), auth_user_id (único; el usuario de Supabase Auth del cliente), verificado_ts, creada_ts. No guarda nombre ni sesiones: la sesión es de Supabase Auth y no existe `sesion_cliente` (D-031, 2026-10-22). *(D-019, 2026-10-21; sustituye la entidad `cliente` con nombre global.)*
- **cliente_negocio**: id, identidad_id, negocio_id, nombre (el que el cliente dio en ese negocio), aceptó_aviso_ts, alta_ts. Sin `estado`: ya no existe `por_confirmar` (D-031). Uno por identidad y negocio. Un negocio nunca ve los `cliente_negocio` de otro.
- **tarjeta_cliente**: id, cliente_negocio_id, negocio_id, sellos, meta_ciclo (meta de sellos de ese ciclo; D-027), creada_ts, ultima_visita_ts. Toda tarjeta aparece en Mis tarjetas: el alta exige el código del teléfono (D-031).
- **tarjeta_llave**: tarjeta_id, llave_hmac (secreto del QR). Sale de `tarjeta_cliente` para que el dueño no la lea (ADR-003 §2.6).
- Entidades de acceso (`install_token`, `envio_codigo`, `codigo_intento`, `dueno_negocio`) y vistas (`negocio_publico`, `cliente_del_negocio`): PRD §8 y ADR-003 §2.
- **dispositivo**: id, negocio_id, nombre ("iPhone caja"), llave_publica (ECDSA P-256).
- **evento** (sello/canje/corrección): event_id (UUID, idempotencia), tipo (sello/canje/`correccion`; una corrección guarda delta, sellos_antes, sellos_despues, motivo y nota, y es inmutable; D-027), tarjeta_id, qr_step, device_ts, recibido_ts, dispositivo_id, firma, origen (mostrador/bienvenida), estado (aceptado/rechazado/provisional).
- **canje**: evento con tipo=canje + recompensa entregada; reinicia sellos a 0.
- **por_revisar**: evento_id, motivo (límite, QR vencido, duplicado, doble canje, firma), resolución (aprobado/descartado), resuelto_por, resuelto_ts.

## 4. Reglas de negocio
- **Límite de sellos**: por defecto 1 por cliente por día, reinicio a medianoche en la zona del negocio; opcional 1 cada X horas (X libre; se sugiere 2 h) o sin límite (con advertencia). Bloqueo fijo de 2 min contra doble escaneo (D-014, 2026-10-21).
- **Sello de bienvenida**: si está activo, automático al crear la tarjeta (C1), sin staff.
- **En riesgo**: sin volver en más del doble de su intervalo habitual, mínimo 30 días. Frecuente: 2+ visitas en 30 días. Nuevo: primera visita en 30 días.
- **QR rotativo**: `card_id + paso + HMAC-SHA256(llave_tarjeta, card_id|business_id|paso)`, pasos de 60 s; en línea ±2 pasos; sin conexión gracia de 10 min.
- **Offline-first**: cola IndexedDB en mostrador, Background Sync, el servidor revalida (firma, QR, límite, duplicados) y es la fuente de verdad; rechazos a Por revisar. La PWA del cliente muestra caché y "Puede haber sellos pendientes".
- **Canje**: en línea siempre que la tarjeta esté completa; sin conexión solo si la caché se sincronizó en las últimas 24 h y máximo 1 canje por tarjeta en modo sin conexión.
- **Cuenta**: una sola cuenta compartida por negocio; "quién" = dispositivo. El dueño entra con código por correo (dura 10 min) o con contraseña, con restablecimiento por correo (D-005, actualizado 2026-10-21; N1 pendiente de ajuste).
- **Prueba / pausa**: 30 días gratis; al terminar, pausa sin sellos nuevos y exportación CSV disponible. "Activar mi plan" abre WhatsApp. Precio $299 MXN/mes + IVA, sin contratos.
- **"Hecho con LealTab"**: **siempre visible en todos los planes, Pro incluido**, en la tarjeta y en el cartel de mostrador (regla fija, Aarón 2026-10-20).
- **Resumen semanal**: solo en el panel, nunca por WhatsApp; es lo primero al entrar.

## 5. Eventos de analítica
Nombres únicos para todo el proyecto (los usan también `docs/02-plan-de-trabajo.md` y el PRD). Catálogo completo, con atributos, emisor y privacidad: `docs/fase-7/medicion.md` (actualizado el 2026-10-22 por D-024 a D-031). Tabla propia en Supabase, sin cookies ni terceros (D-018). Ningún evento lleva teléfono, nombre, correo, IP ni texto libre.

**Producto:** `resumen_semanal_visto` (negocio, `semana` ISO `AAAA-Www`) · `negocio_alta_completada` (oficio, fecha, **tanda**, versión del producto, `duracion_s`) · `tarjeta_configurada` · `qr_mostrador_descargado` · `cliente_registrado` (bienvenida sí/no, `identidad_nueva` sí/no, `con_codigo` sí/no, SO) · `sello_registrado` (en línea/sin conexión, origen, `duracion_ms`) · `sello_bloqueado` (motivo: límite/doble_escaneo) · `canje_registrado` (en línea/sin conexión) · `sync_completada` (aceptados, rechazados, descartados) · `por_revisar_resuelto` (resolución, motivo) · `accion_sugerida_click` (tipo) · `export_csv` (**`archivo`**: clientes/visitas) · `whatsapp_ayuda_click` · `activar_plan_click`.

**Instalación y sesión (ADR-001 §10):** `pwa_instalada` (SO, `display-mode: standalone`) · `guia_instalacion_mostrada` (SO) · `install_token_canjeado` · `recuperacion_completada` (verificar el código por un teléfono que ya tenía tarjetas, sin sesión en ese navegador) · `app_abierta` (identidad, `display-mode`) para medir el segundo negocio en la app ya instalada en ≤7 días. `cliente_registrado` lleva `identidad_nueva` (sí/no) para contar clientes con ≥2 negocios.

**Código de verificación (D-031, ADR-003, ADR-004):** `registro_iniciado` (C1 mostrada, `con_sesion`) · `codigo_pedido` · `codigo_enviado` (canal: whatsapp/sms) · `codigo_reenviado` · `codigo_canal_cambiado` · `codigo_verificado` · `codigo_fallido` (motivo: incorrecto/vencido/bloqueado/límite/proveedor). El abandono en el código no es un evento: se calcula (un `codigo_pedido` sin `codigo_verificado` tras la vigencia).

**Operación y cuenta:** `mostrador_reabierto_tras_caida` (`duracion_s`, `pendientes`; D-015) · `sellos_corregidos` (diferencia, motivo; D-027) · `cuenta_cliente_borrada` (número de negocios, sin identidad; D-026) · `contrasena_restablecida` y `acceso_bloqueado` (dueño, sin correo ni IP; D-005).

**Retirados (D-031):** `tarjeta_por_confirmar_creada` y `tarjeta_confirmada` (ya no existe el estado «por confirmar»; MET-08 también se retira).

Reemplazan los nombres anteriores del plan: `negocio_alta` → `negocio_alta_completada`, `sello_otorgado` → `sello_registrado`, `canje_confirmado` → `canje_registrado`.

## 6. Copy clave
"Empieza gratis hoy" · "Sin llamada de ventas y sin tarjeta de crédito" · "Crear mi tarjeta" · "Tus datos, claros." · "Tenla siempre a un toque" · "Muestra este código en mostrador" · "¡Tu corte gratis está listo!" · "Confirmar +1 sello" · "Confirmar canje" · "Ya recibió su sello hoy. El siguiente, desde mañana." · "Próximo sello disponible a las HH:MM" · "Ya registrado" · "Modo sin conexión activo" · "N pendientes de sincronizar" · "Puede haber sellos pendientes" · "Por revisar" · "Tu semana en {negocio}" · "Acción sugerida" · "Tus datos son tuyos: expórtalos cuando quieras" · "Ayuda por WhatsApp" · "Hecho con LealTab". Voz de tú, español de México.

## 7. Accesibilidad
- Estado siempre con palabra + color, nunca solo color o ícono.
- Contraste AA: texto noche sobre lino/blanco lino; lino sobre bosque/noche.
- Foco visible `--focus-ring` en todo control; orden de tabulación lógico; objetivos táctiles ≥ 44 px.
- Inputs 16 px, `inputmode="tel"` y `autocomplete` en WhatsApp; errores asociados con `aria-describedby`. El código de verificación es un solo campo de 6 dígitos con `inputmode="numeric"` y `autocomplete="one-time-code"`; su cuenta regresiva de reenvío no anuncia cada segundo, solo cuando queda disponible (pieza 08).
- Aro: `role="img"` con `aria-label="4 de 8 sellos"`; QR con alternativa de búsqueda por WhatsApp.
- Resultados de escaneo y sincronización anunciados con `aria-live="polite"`; respetar `prefers-reduced-motion`.

## 8. Preguntas abiertas
1. ~~Ventana exacta del bloqueo de doble escaneo: ¿1 o 2 min?~~ **Cerrada (Aarón, 2026-10-21): fija en 2 min** (D-014).
2. Retención y borrado de datos cuando un cliente elimina su cuenta (C5) y el texto final del aviso de privacidad (legal). Siguen abiertos: PQ-04 y PQ-18.
3. ~~Plantilla del mensaje de "Escribir por WhatsApp" desde N7~~ **Cerrada (D-030, 2026-10-21):** tres plantillas fijas.
4. ~~¿Se muestran los términos del límite de sellos en C3 o solo en el aviso de la tarjeta?~~ **Cerrada (PQ-06, 2026-10-21):** una línea bajo el QR de C3 y una hoja «Términos de la tarjeta» dentro de C3.
5. **D-031 (2026-10-22):** el diseño de C1 en dos pasos, R1 y la recuperación (pieza 08) está **propuesto, pendiente de aprobación**. Siguen por probar el canje del `install_token` de iOS (PQ-31, respaldo diseñado), el hook de SMS sin proveedor nativo (PQ-30) y el costo y la API oficial del WhatsApp (PQ-30).
## Pregunta para ti
¿Apruebas esta entrega para que pase a la Fase 7 (Desarrollo)?
