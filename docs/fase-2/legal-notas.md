# Notas legales: Aviso de privacidad y Términos y condiciones de lealtab.com

- **Fecha:** 7 oct 2026
- **Autor:** `lealtab-arquitecto`
- **Archivos de contenido:** `web/src/content/legal/privacy.ts` (PRIVACY) y `web/src/content/legal/terms.ts` (TERMS)
- **Modelo seguido:** https://olon.mx/terms/ y https://olon.mx/privacy/ (estructura, tono y nivel de detalle; sin copiar texto).

> **Estos textos deben revisarse con un abogado antes de publicarse.** No son asesoría legal. Redacté con la ley vigente y las decisiones del fundador; donde la ley y esas decisiones chocan, lo dejo como riesgo (sección 3).

## 1. Fuentes consultadas (7 oct 2026)

| Fuente | Uso |
|---|---|
| Texto vigente de la LFPDPPP, Cámara de Diputados (nueva ley publicada en el DOF el 20-03-2025; última reforma DOF 14-11-2025): https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf | **Fuente principal.** Leí el PDF completo (24 pp.). No revisé la edición original del DOF del 20-03-2025: el acceso a dof.gob.mx falló. |
| Art. 15 y 16 de la ley, transcritos en https://leyes-mx.com/ley_federal_de_proteccion_de_datos_personales_en_posesion_de_los_particulares/15.htm | Contraste secundario (coincide con el PDF). |
| Hogan Lovells, resumen de la nueva ley: https://www.hlc.com/es/publications/mexicos-new-federal-data-protection-law-what-it-means-for-companies | Cambios al aviso (se elimina listar transferencias en el aviso; amplía la figura del responsable). Secundaria. |
| KPMG, flash de la nueva ley: https://kpmg.com/mx/es/tendencias/2025/04/flash-nueva-ley-federal-de-proteccion-de-datos-personales-en-posesion-de-los-particulares.html | Consentimiento "libre, específico e informado"; autoridad nueva. Secundaria. |
| Sharkit, estado del Reglamento: https://sharkit.mx/nueva-lfpdppp-reglamento-pendiente/ | El reglamento nuevo sigue sin publicarse y el de 2011 se aplica de forma supletoria en lo que no contradiga la ley `[SUPUESTO: fuente secundaria; verificar en el DOF]`. |
| Sitio de la autoridad: https://www.gob.mx/buengobierno | Confirma que la Secretaría Anticorrupción y Buen Gobierno tiene hoy la protección de datos en posesión de particulares. |
| LFPC art. 2 (consumidor y microempresas): https://sdv.com.mx/compendio/ley-federal-de-proteccion-al-consumidor/articulo-2/ | Solo para el riesgo 7 (sección 3). Secundaria. |
| Olon, Términos y Aviso (URLs arriba) | Modelo de estructura. |
| `docs/fase-2/adr/001-modelo-pwa.md`, sección 6 | Roles responsable/encargado (propuesta pendiente de revisión legal). |
| `web/src/content/pricing.ts`, `closing.ts` (FAQ), `trust.ts`, `roadmap.ts`, `landing.ts` | Planes, precios, prueba, compromisos y enlaces. |

## 2. Checklist de requisitos de la LFPDPPP 2025 y cómo se cubrió

| Requisito (artículo) | Dónde está en el aviso | Estado |
|---|---|---|
| Identidad **y domicilio** del responsable (15-I) | "Quién es el responsable": LealTab, Villahermosa, Tabasco, México; correo y WhatsApp | **Parcial por decisión del fundador** (sin domicilio completo, razón social ni RFC). Ver riesgo 1. |
| Datos tratados, identificando los sensibles (15-II, 8) | "Qué datos personales tratamos": IP, navegador, fecha y hora, página; datos de WhatsApp e Instagram; no se solicitan sensibles | Cubierto |
| Finalidades, distinguiendo las que requieren consentimiento (15-III, 7, 11) | "Para qué usamos tus datos": necesarias (tácito) y "por ahora ninguna" que requiera consentimiento | Cubierto |
| Opciones y medios para limitar el uso o la divulgación (15-IV) | "Limitar el uso de tus datos y revocar tu consentimiento" | Cubierto |
| Mecanismos, medios y procedimiento para derechos ARCO (15-V, 21-34) | "Tus derechos ARCO": canal (correo), requisitos de la solicitud (28), 20 días hábiles de respuesta y 15 para hacerla efectiva, ampliación una vez (31), gratuidad (34), causas de negativa (33), bloqueo y supresión (24) | Cubierto |
| Procedimiento y medio para comunicar cambios al aviso (15-VI) | "Cambios a este aviso" | Cubierto |
| Mecanismo y procedimiento para **revocar** el consentimiento (7, último párrafo) | Misma sección que limitar el uso | Cubierto. La ley no fija plazo para la revocación: apliqué 20 días hábiles, igual que ARCO. |
| Transferencias: cláusula de si el titular acepta o no (35) y excepciones (36) | "Con quién compartimos tus datos": no hay transferencias; si las hubiera, se actualiza el aviso y se ofrece aceptar o no | Cubierto |
| Medidas de seguridad, aviso de vulneraciones y confidencialidad (18, 19, 20) | "Cómo cuidamos tus datos" | Cubierto en términos generales |
| Conservación, bloqueo y supresión (10, 24) | "Cuánto tiempo conservamos tus datos" | Cubierto sin plazo numérico (decisión pendiente 11) |
| Autoridad y vía de queja (3, 40) | "Si no estás conforme": Secretaría Anticorrupción y Buen Gobierno, 15 días hábiles | Cubierto |
| Persona o área que atiende las solicitudes (29) | "ARCO": "el área de privacidad de LealTab" | Parcial: hay que designarla de verdad (riesgo 3) |
| Aviso **simplificado** al recabar por medios electrónicos, con enlace al integral (16-II) | No hay recolección en el sitio; la conversación de WhatsApp sí es un medio electrónico | **Pendiente fuera de mis archivos** (riesgo 4) |
| Cookies y analítica | "Cookies, analítica y recursos de terceros": no existen; si se agregan, se actualiza el aviso antes y se pide el consentimiento que corresponda | Cubierto |

## 3. Riesgos

1. **Falta el domicilio del responsable.** El art. 15-I exige "identidad y domicilio". Omitir un elemento del art. 15 es infracción (art. 58-V), con multa de 100 a 160,000 veces la UMA (art. 59-II). Omitido por decisión del fundador (como Olon). Que Olon lo haga no lo vuelve válido.
2. **No hay razón social ni RFC.** El texto no dice si el responsable es persona física o moral. Esto debilita la identificación del responsable (15-I), la exigibilidad de los Términos y la posibilidad de facturar (decisión pendiente 8).
3. **Persona o área de datos personales (art. 29).** El texto menciona "el área de privacidad", pero la ley pide designar a una persona o departamento. Hay que hacerlo internamente y que sea quien lea `contacto@lealtab.com`.
4. **Aviso simplificado en el WhatsApp de la landing (art. 16-II).** Recomiendo al coordinador y al desarrollador: una línea junto a los botones de WhatsApp ("Al escribirnos, conoces nuestro aviso de privacidad", con enlace) o un mensaje automático con el enlace en la primera respuesta. Hoy el único aviso es el enlace del pie.
5. **Roles responsable/encargado (Términos, "Los datos de tus clientes").** La ley nueva define "responsable" como cualquier particular que trate datos (art. 2, XIV y XVI), y Hogan Lovells subraya que ya no depende de que decida sobre el tratamiento. Eso puede dejar a LealTab como responsable, al menos de la cuenta del cliente final. El texto afirma el rol de encargado como lo propone el ADR-001 (sección 6, pendiente de revisión legal y validación 5.1 a). Si el abogado concluye otra cosa, hay que reescribir esa sección y publicar un aviso propio para clientes finales. Posible faltante: contrato o anexo de encargo (temas típicos: ayuda con derechos ARCO, subencargados, vulneraciones, devolución o supresión al terminar).
6. **Proveedor de alojamiento sin nombrar.** El texto lo describe sin nombre. Al elegirlo hay que (a) comprobar que no ponga cookies ni cargue recursos de terceros (p. ej., si va detrás de un CDN o WAF), porque "no usa cookies" quedaría falso; (b) decidir si se nombra en el aviso; y (c) saber si trata datos fuera de México.
7. **Posible trato de consumidor a microempresas.** El art. 2 de la LFPC puede dar acciones de consumidor a microempresas acreditadas. Hay que preguntar al abogado si las cláusulas de renuncia a fuero, limitación de responsabilidad y cambios unilaterales sirven frente a ellas, y si estos Términos son contrato de adhesión con obligación o conveniencia de registro ante Profeco. `[SUPUESTO]`: no verifiqué la norma de registro aplicable.
8. **Reglamento.** Según fuente secundaria, no hay reglamento nuevo y el de 2011 se aplica en lo que no contradiga la ley. Verificar en el DOF antes de publicar.
9. **Afirmaciones que dependen de la operación real** (confirmar o quitar): "no vendemos ni transferimos tus datos"; "los mensajes los atiende únicamente el equipo de LealTab"; "te respondemos en 20 días hábiles"; soporte "te atiende una persona" (viene de `trust.ts`).
10. **Inconsistencia de la landing (no es de mis archivos).** `roadmap.ts` lista "Varias sucursales" como "Próximamente", pero `pricing.ts` ofrece "Hasta 3 sucursales" en el plan Negocio. Los Términos copian `pricing.ts` y dicen que lo "Próximamente" no es parte del servicio. Conviene que el coordinador unifique el copy.
11. **Datos de Instagram.** La frase sobre mensajes por Instagram describe cómo funciona esa red en general; no es un hecho verificado de la landing. Confirmar.

## 4. Decisiones pendientes del fundador

Cada una está redactada con la opción que indico (conservadora, y en varias, la de Olon). Si eliges otra, hay que cambiar el texto.

| # | Tema | Opción redactada | Dónde |
|---|---|---|---|
| 1 | Cómo y cuándo se cobra | Cobro mensual; antes de terminar la prueba se indica por WhatsApp o correo cómo pagar. No se promete pago anticipado ni medios concretos. | Términos, Planes |
| 2 | Falta de pago | La tarjeta se pausa hasta ponerse al corriente; se pueden descargar los datos. No se borra. | Términos, Planes |
| 3 | Cambio de precios | Aviso de al menos **30 días** (como Olon), por correo o WhatsApp; aplica desde el siguiente mes; el cliente puede cancelar antes. | Términos, Planes |
| 4 | Reembolsos | **Sin reembolsos** por periodos parciales; el plan sigue hasta el fin del mes pagado; la prueba no cobra. | Términos, Cancelación |
| 5 | Conservación tras cancelar | **30 días** (como Olon) para descargar o reactivar; luego se pueden eliminar, salvo lo que la ley obligue a conservar. | Términos, Cancelación |
| 6 | Cómo cancelar | Por WhatsApp o correo (no se afirma que exista botón en el panel). | Términos, Cancelación |
| 7 | Cambios a los Términos | Aviso de al menos **15 días** (como Olon), por correo, WhatsApp o dentro de la plataforma; seguir usando = aceptar. | Términos, Cambios |
| 8 | Factura (CFDI) de la suscripción | **No se menciona** ni se promete (no hay razón social ni RFC). Solo se dice que LealTab no factura las ventas del negocio. | Términos, Qué es LealTab |
| 9 | Referencia de cliente (Olon la autoriza al contratar) | **No se usa** el nombre ni el logo del negocio sin permiso previo. | Términos, Propiedad intelectual |
| 10 | Suspensión por incumplimiento | Se puede pausar o cerrar la cuenta; se avisa antes cuando sea posible. | Términos, Uso aceptable |
| 11 | Plazo de conservación en el aviso | Sin número: "el tiempo necesario" y luego bloqueo y supresión. Conviene fijar uno (por ejemplo, 12 meses desde el último mensaje) `[SUPUESTO: sugerencia, no decisión]`. | Aviso, Conservación |
| 12 | Finalidades secundarias | **Ninguna.** Se compromete a no mandar promociones ni mensajes masivos sin consentimiento previo. | Aviso, Para qué usamos tus datos |
| 13 | Tiempo de soporte | Sin tiempos garantizados. | Términos, Disponibilidad |
| 14 | Revocación del consentimiento | 20 días hábiles (espejo de ARCO). | Aviso |

## 5. Pendientes para otras fases o agentes

- **Aviso de privacidad de la plataforma (app.lealtab.com)** y, si el abogado lo exige, aviso para clientes finales: fase de la plataforma (relacionado con ADR-001, validación 5.1 a).
- **Aviso simplificado** junto al CTA de WhatsApp: desarrollador de la landing (riesgo 4).
- **Cuando se agregue analítica o cookies** (PRD sección 7): actualizar el aviso antes de activarlas y diseñar el consentimiento.
