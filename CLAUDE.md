@AGENTS.md

# Claude Code en LealTab

Las reglas del proyecto, las fuentes de verdad y la guía de skills están en `AGENTS.md` (importado arriba). Este archivo agrega solo lo propio de Claude Code.

## Orquestador y subagentes

- **La sesión principal es el orquestador**, con Opus 5.5 y effort high (`.claude/settings.json`). Planea, delega, verifica e integra.
- El orquestador **no escribe código de producto ni documentos de fase** si hay un subagente para eso. Sí puede:
  - leer y revisar;
  - correr los comandos de verificación;
  - hacer ajustes triviales de integración (un import, un typo);
  - escribir el brief del feature.
- **El modelo del subagente depende de la tarea** (decisión de Aarón, 22 oct 2026):
  - **Haiku** (`model: "haiku"`) cuando la tarea es **escribir o actualizar documentación**: aplicar decisiones a PRD, `decisiones.md`, ADR o `AGENTS.md`, redactar microcopy, alinear referencias, propuestas de reemplazo.
  - **Sonnet 5.5** (`model: "sonnet"`) cuando es **código o análisis**: implementación, QA, arquitectura y revisión de seguridad, investigación con fuentes, diseño de eventos y consultas.
  - Se pasa `model` en cada invocación, porque el frontmatter de `.claude/agents/` fija Sonnet. Effort `medium` salvo que Aarón pida otro.
  - El orquestador sigue verificando cada diff: con Haiku, el reporte de un agente vale aún menos como prueba.
- Los subagentes no lanzan otros subagentes (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1`): toda la delegación pasa por el orquestador.

### Qué subagente usar

| `subagent_type` | Cuándo | Entrega |
|---|---|---|
| `lealtab-coordinador` | ¿Es de la fase y del MVP?, gates, decisiones, PQ, estado | Veredicto de alcance, propuestas de D- y PQ |
| `lealtab-arquitecto` | Esquema, RLS, auth, PWA, sin conexión, QR y HMAC, WhatsApp, ADRs | `docs/fase-7/arquitectura.md`, `docs/adr/NNN-*.md` |
| `lealtab-product-designer` | Falta una pantalla o un estado, criterios de aceptación, revisión de la UI construida | Pieza en `brand/06-product-design/` o revisión contra la pieza |
| `lealtab-copywriter` | Falta microcopy, plantillas de WhatsApp, guiones | `docs/fase-7/microcopy.md` |
| `lealtab-analista-metricas` | Eventos que emite el feature, consultas, gates | `docs/fase-7/medicion.md`, revisión de instrumentación |
| `lealtab-desarrollador` | Implementar una tarea del brief, con pruebas | Código en `web/` |
| `lealtab-qa` | Verificar una tarea o el feature completo | `docs/fase-N/qa/<slug>.md` con veredicto y evidencia |
| `lealtab-investigador-clientes` | Entrevistas, playbook y reclutamiento del piloto | `docs/fase-7/entrevistas/` |
| `lealtab-investigador` | IMPI y WIPO, competencia, comparar proveedores | Informe con fuentes |
| `lealtab-growth` | Solo en la Fase 10 | `docs/fase-10/` |
| `documentation-engineer` (plugin `voltagent-dev-exp`) | Revisar o reestructurar documentación (AGENTS.md, CLAUDE.md, READMEs) | Análisis o borrador; `model: "haiku"` |
| `Explore` | Búsquedas amplias de solo lectura | Hallazgos con rutas |

### Cómo delegar

- **Brief autocontenido:** el subagente solo sabe lo que le escribes. Incluye:
  - objetivo;
  - IDs (RF-, RNF-, D-, PQ-) y pantallas;
  - archivos que debe leer;
  - criterios de aceptación verificables;
  - qué **no** debe tocar.
- **Una tarea por invocación** del desarrollador, chica y desplegable.
- **En paralelo** lo que sea independiente (por ejemplo, diseño, copy y eventos en la definición), en un solo mensaje.
- `isolation: "worktree"` cuando dos desarrolladores tocan código al mismo tiempo.
- **Correcciones con `SendMessage` al mismo agente**, para que conserve su contexto. No abras un agente nuevo para corregir.
- Todos los agentes `lealtab-*` terminan con *Resumen, Archivos, Evidencia, Dudas y PQ, Fuera de alcance detectado*. Si falta una sección, pídela.

### Verificación del orquestador (confiar, pero verificar)

El reporte de un subagente no es prueba. Antes de dar algo por bueno:
1. Lee el diff completo (`git diff`).
2. Vuelve a correr tú en `web/`: `pnpm lint && pnpm typecheck && pnpm build` y las specs de Playwright del feature.
3. Coteja cada criterio de aceptación del brief con su evidencia.
4. Con `git status`, confirma que no cambiaron `brand/`, el PRD, los ADR, `docs/decisiones.md` ni los informes 01 a 03, salvo que el brief lo pida.
5. Con la UI hecha, revisa al menos una captura por pantalla y estado.
6. Si algo falla, regresa la tarea con feedback concreto: archivo, criterio y qué esperabas. **Máximo 3 rondas por tarea**; después, escala a Aarón con el diagnóstico.

### Puntos de aprobación de Aarón

1. **El brief del feature**, antes de implementar.
2. **El cierre**, antes del commit o el PR.

Fuera de esos dos puntos el flujo corre solo. Detente antes si aparece una decisión que no está en las fuentes, algo fuera de fase o fuera de alcance, o un cambio a documentos protegidos.

## Flujo de feature: `/feature`

Para cada feature nuevo usa el skill `/feature` (`.agents/skills/feature/SKILL.md`). Tiene los pasos completos, la plantilla del brief y la del reporte de QA. Al aprobar el brief corre `pnpm plane:sync crear` y, cada vez que cambia el estado de una tarea, `pnpm plane:sync estado`. El detalle y los nombres de estado están en el skill.

## Memoria (engram)

- Al iniciar un feature o un tema con historia: `mem_search` con palabras clave del pedido.
- `mem_save` en cuanto haya una decisión de Aarón, un hallazgo no obvio, un bug con su causa o un feature cerrado. Para cada feature usa el topic_key `feature/<slug>`.
- Antes de cerrar la sesión: `mem_session_summary`.

## Git

- Commit, push o PR **solo después de la aprobación de cierre** de Aarón.
- Sigue la convención de `AGENTS.md` §4: español, en presente, sin prefijos y citando IDs.
- Nunca uses `--no-verify`, `--force` ni `reset --hard` sin que Aarón lo pida.
