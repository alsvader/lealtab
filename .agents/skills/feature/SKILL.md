---
name: feature
description: Flujo de LealTab para construir un feature nuevo con el orquestador (Opus) y subagentes (Sonnet), con aprobación de Aarón en el brief y en el cierre. Úsalo cuando Aarón pida un feature, una pantalla (N0–N8, C0–C5), un flujo (F1–F10) o un requisito del PRD (RF-…, RNF-…) que haya que implementar en web/, o cuando escriba /feature <descripción>.
---

# /feature: flujo de feature de LealTab

Eres el **orquestador**: planeas, delegas, verificas e integras. Los subagentes hacen el trabajo. Las reglas del orquestador (cómo delegar, cómo verificar, modelo y effort) están en `CLAUDE.md`, y las del proyecto en `AGENTS.md`.

Pedido: `$ARGUMENTS`

Lleva el avance con una lista de tareas, un paso por elemento. Al terminar cada paso, avisa a Aarón en una línea qué sigue.

## Paso 0. Contexto

1. `mem_search` con las palabras clave del pedido, por si hay trabajo previo.
2. Ubica en las fuentes (`AGENTS.md` §2):
   - los RF y RNF del PRD que cubre;
   - las pantallas y estados, con su pieza en `brand/06-product-design/` y su wireframe;
   - los eventos de `07-entrega` §5;
   - las D- que lo restringen y las PQ abiertas que lo afectan.
3. Revisa qué existe ya en `web/` (rutas, componentes, migraciones) y en `docs/fase-N/`.
4. Elige un `slug` corto en inglés o español sin acentos (por ejemplo, `registro-cliente-c1`).

Para búsquedas amplias usa `Explore` con `model: "sonnet"`; para leer 2 o 3 archivos conocidos, léelos tú.

## Paso 1. Alcance

Pregúntale a `lealtab-coordinador` si el feature es de la fase actual y del alcance del MVP, y qué PQ bloquean o condicionan. Si lo que pide es de otra fase, está fuera de alcance o requiere reabrir una decisión, **detente** y preséntale a Aarón el veredicto del coordinador con las opciones.

## Paso 2. Definición (solo lo que falte)

Lanza **en paralelo**, en un solo mensaje, solo lo que el feature necesita y no está definido:

| Falta | Agente |
|---|---|
| Pantalla o estado sin diseño, o criterios de aceptación de UI | `lealtab-product-designer` |
| Textos de interfaz o plantillas que no están en `07-entrega` §6 | `lealtab-copywriter` |
| Tablas, RLS, auth, sin conexión, QR o HMAC, integración externa | `lealtab-arquitecto` |
| Eventos que emite el feature y sus propiedades | `lealtab-analista-metricas` |

Si todo está definido, sáltate este paso y dilo en el brief. Revisa lo que entreguen contra las fuentes antes de pasarlo al brief.

## Paso 3. Brief, con aprobación de Aarón

Escribe tú `docs/fase-N/features/<slug>.md` con la plantilla de abajo. Divide el trabajo en **tareas chicas y desplegables**, cada una con sus criterios de aceptación verificables (cómo se comprueba: spec, comando, captura).

**⏸ Detente y pide a Aarón que apruebe el brief.** No implementes nada antes. Si pide cambios, ajusta el brief y vuelve a pedir la aprobación.

## Paso 4. Implementación

1. Crea la rama `feat/<slug>` desde `main`, si no existe.
2. Por cada tarea del brief, invoca a `lealtab-desarrollador` con un brief autocontenido:
   - la tarea y sus criterios de aceptación;
   - los IDs que cubre;
   - los archivos que debe leer: la pieza de diseño, el ADR o la arquitectura, `web/AGENTS.md`;
   - los skills que corresponden: `impeccable` para UI, `tailwind-design-system` para tokens y shadcn, `docker-patterns` para Docker;
   - las pruebas que debe dejar;
   - qué no tocar.
3. Las tareas independientes van en paralelo, con `isolation: "worktree"` si tocan código a la vez. Las dependientes, en orden.
4. Cuando el desarrollador reporte, lee su diff antes de seguir. Si algo no cumple, corrígelo con `SendMessage` al mismo agente.

## Paso 5. Verificación

Lanza en paralelo:
- `lealtab-qa`: el gate técnico completo sobre la rama. Escribe `docs/fase-N/qa/<slug>.md`.
- `lealtab-product-designer`, si hubo UI: revisión contra la pieza y sus estados, con `impeccable` en modo audit. Debe reportar las diferencias con su severidad.
- `lealtab-analista-metricas`, si el feature emite eventos: nombres y propiedades exactos de `07-entrega` §5, sin cookies ni terceros.

Luego verifica tú, con los 6 puntos de `CLAUDE.md`, «Verificación del orquestador». Si algo falla, vuelve al paso 4 con feedback concreto. Máximo 3 rondas por tarea; después, escala a Aarón.

## Paso 6. Cierre, con aprobación de Aarón

1. Presenta a Aarón:
   - qué se hizo, tarea por tarea;
   - la evidencia: comandos con su resultado, el reporte de QA y las capturas;
   - las diferencias aceptadas;
   - las pruebas pendientes en dispositivo real (iPhone con iOS 18 y 26, Android con Chrome, navegadores integrados de WhatsApp e Instagram);
   - las PQ o decisiones que necesita tomar.
2. **⏸ Detente y pide la aprobación del cierre.**
3. Con la aprobación: haz commit en `feat/<slug>` siguiendo `AGENTS.md` §4 y citando los IDs. Abre el PR si Aarón lo pide.
4. Las PQ o D nuevas se proponen a `lealtab-coordinador`; no edites tú `decisiones.md` ni el PRD.
5. `mem_save` con el resumen del feature (topic_key `feature/<slug>`): qué se hizo, las decisiones y los hallazgos no obvios.

---

## Plantilla: brief del feature (`docs/fase-N/features/<slug>.md`)

```markdown
# Feature: <nombre>

**Estado:** Borrador para aprobación | Aprobado | En construcción | Cerrado
**Fase:** N · **Rama:** `feat/<slug>`
**Cubre:** RF-…, RNF-… · **Pantallas:** N…/C… · **Flujos:** F…
**Restricciones:** D-…, ADR-…

## Objetivo
Qué gana el dueño o el cliente, en 2 o 3 líneas.

## Fuentes
- Pieza de diseño: `brand/06-product-design/…` (§…)
- Arquitectura: `docs/fase-7/arquitectura.md` (§…) o «no aplica»
- Copy: `07-entrega` §6 / `docs/fase-7/microcopy.md`
- Eventos: `07-entrega` §5 → `evento_a`, `evento_b`

## Alcance
### Dentro
- …
### Fuera
- … (con la fase o el gate en que se desbloquea)

## Tareas
| # | Tarea | Depende de | Criterios de aceptación (cómo se verifica) |
|---|---|---|---|
| T1 | … | — | - … (spec `e2e/…`) <br> - … (`pnpm typecheck`) |
| T2 | … | T1 | - … |

## Por definir
- PQ-… : cómo se resuelve en este feature (opción más simple y aislada) o qué bloquea.

## Pendientes para Aarón
- Decisiones que hay que tomar antes de construir.
```

## Plantilla: reporte de QA (`docs/fase-N/qa/<slug>.md`)

Está basada en `docs/fase-2/qa-landing-nextjs.md`.

```markdown
# QA: <feature>

**Veredicto:** APROBADA | APROBADA CON PENDIENTES | RECHAZADA
**Rama y commit:** `feat/<slug>` @ <sha> · **Brief:** `docs/fase-N/features/<slug>.md`

## 1. Gate técnico
| Comprobación | Resultado |
|---|---|
| `pnpm lint` | ✅ / ❌ (salida relevante) |
| `pnpm typecheck` | |
| `pnpm build` | |
| `pnpm test:e2e` (5 proyectos) | N pasaron, N omitidas, N fallaron |
| axe en las pantallas nuevas | Violaciones: … |
| Sin scroll horizontal desde 320 px | |
| Consola limpia (fixture `guard`) | |
| `/` (landing) sigue funcionando | |
| Specs nuevas que cubren el feature | `e2e/…` |

## 2. Criterios de aceptación
| Tarea | Criterio | Evidencia | ✅/❌ |
|---|---|---|---|

## 3. Checklist de UX y accesibilidad (ui-ux-pro-max)
44 px, inputs de 16 px (`--font-size-input`), foco visible, palabra y color, `aria-live`, `prefers-reduced-motion`.

## 4. Fallas encontradas
| # | Severidad | Dónde | Qué pasa | Cómo reproducir |
|---|---|---|---|---|

## 5. Diferencias aceptadas

## 6. Pendientes para el fundador (dispositivo real)

## 7. Archivos y capturas
```
