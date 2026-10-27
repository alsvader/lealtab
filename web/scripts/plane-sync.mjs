// Sincroniza las tareas de un brief de feature con work items de Plane.
//
// Uso (desde web/):
//   pnpm plane:sync crear ../docs/fase-N/features/<slug>.md [--dry-run]
//   pnpm plane:sync estado ../docs/fase-N/features/<slug>.md T3 "In Progress" [--dry-run]
//
// «crear» corre cuando Aarón aprueba el brief: un work item por tarea, en Todo.
// «estado» corre cada vez que esa tarea cambia de estado. Nombres exactos del proyecto:
//   Todo, In Progress, In QA, Blocked, Done, Cancelled.
//   In Progress  se empieza a implementar
//   In QA        entregada, entra a verificación
//   Done         la verificación de esa tarea pasó
//   Blocked      espera una decisión de Aarón o un bloqueo externo
//   Cancelled    sale del alcance
//
// El brief es la fuente de verdad. Cada tarea se identifica con external_id = "<slug>/<T#>",
// así que volver a correr «crear» no duplica nada. La clave va en PLANE_API_KEY (.env.local).

import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ENV_FILE = fileURLToPath(new URL('../.env.local', import.meta.url))
const RAIZ = fileURLToPath(new URL('../..', import.meta.url))
const BASE = process.env.PLANE_BASE_URL ?? 'https://plane.jemartinez.dev'
const SLUG = process.env.PLANE_WORKSPACE_SLUG ?? 'villadev'
const PROYECTO = process.env.PLANE_PROJECT_ID ?? '143eebdf-d498-413c-b168-8bf6294fd5fb'
const API = `${BASE}/api/v1/workspaces/${SLUG}/projects/${PROYECTO}`
const ORIGEN = 'lealtab-brief'
const ESTADO_INICIAL = 'Todo'
const PAUSA_MS = 1100 // Plane permite 60 peticiones por minuto por clave.

const [comando, ...resto] = process.argv.slice(2)
const dryRun = resto.includes('--dry-run')
const args = resto.filter(a => a !== '--dry-run')

function cargarClave() {
  try {
    process.loadEnvFile(ENV_FILE)
  } catch {
    // Sin .env.local, la clave puede venir ya en el entorno.
  }
  const clave = process.env.PLANE_API_KEY
  if (!clave) throw new Error('Falta PLANE_API_KEY en web/.env.local')
  return clave
}

async function api(clave, metodo, ruta, cuerpo) {
  const res = await fetch(`${API}${ruta}`, {
    method: metodo,
    headers: { 'X-API-Key': clave, 'Content-Type': 'application/json' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  if (!res.ok) throw new Error(`${metodo} ${ruta} → ${res.status}: ${await res.text()}`)
  return res.status === 204 ? null : res.json()
}

const pausa = ms => new Promise(r => setTimeout(r, ms))

function rutaEnRepo(ruta) {
  const abs = resolve(ruta)
  const prefijo = RAIZ.endsWith('/') ? RAIZ : `${RAIZ}/`
  return abs.startsWith(prefijo) ? abs.slice(prefijo.length) : abs
}

function limpiar(texto) {
  return texto.replace(/[`*]/g, '').trim()
}

function escapar(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

// Lee la tabla «## Tareas» del brief. Cada fila: # | Tarea | Depende de | Criterios.
function leerTareas(rutaBrief) {
  const slug = basename(rutaBrief, '.md')
  const texto = readFileSync(rutaBrief, 'utf8')
  const seccion = texto.split(/^## Tareas\s*$/m)[1]?.split(/^## /m)[0]
  if (!seccion) throw new Error(`${slug}: el brief no tiene la sección «## Tareas»`)

  return seccion.split('\n').flatMap(linea => {
    const fila = linea.match(/^\|\s*(T\d+)\s*\|(.*)\|\s*$/)
    if (!fila) return []
    const [titulo = '', dependencias = '', criterios = ''] = fila[2].split(' | ').map(c => c.trim())
    return [{
      slug,
      id: fila[1],
      titulo: limpiar(titulo),
      dependencias: limpiar(dependencias),
      criterios: criterios
        .split('<br>')
        .map(c => c.replace(/^\s*-\s*/, '').trim())
        .filter(Boolean),
    }]
  })
}

function externalId(tarea) {
  return `${tarea.slug}/${tarea.id}`
}

function descripcionHtml(tarea) {
  const dependencias = tarea.dependencias && tarea.dependencias !== '—' && tarea.dependencias !== '-'
    ? `<p><strong>Depende de:</strong> ${escapar(tarea.dependencias)}</p>`
    : ''
  const criterios = tarea.criterios.map(c => `<li>${escapar(c)}</li>`).join('')
  return `<p><strong>Brief:</strong> ${escapar(tarea.brief)}</p>${dependencias}` +
    `<p><strong>Criterios de aceptación</strong></p><ul>${criterios}</ul>`
}

async function estadosPorNombre(clave) {
  const datos = await api(clave, 'GET', '/states/')
  const lista = datos.results ?? datos
  return new Map(lista.map(e => [e.name, e]))
}

// Trae todos los work items del proyecto y los indexa por external_id, solo los de este origen.
async function workItemsPorExternalId(clave) {
  const indice = new Map()
  let cursor = ''
  do {
    const pagina = await api(clave, 'GET', `/work-items/?per_page=100${cursor ? `&cursor=${cursor}` : ''}`)
    for (const item of pagina.results ?? []) {
      if (item.external_source === ORIGEN && item.external_id) indice.set(item.external_id, item)
    }
    cursor = pagina.next_page_results ? pagina.next_cursor : ''
  } while (cursor)
  return indice
}

async function crear(clave, tareas) {
  const estados = await estadosPorNombre(clave)
  const inicial = estados.get(ESTADO_INICIAL)
  if (!inicial) throw new Error(`El proyecto no tiene el estado «${ESTADO_INICIAL}»`)
  const existentes = await workItemsPorExternalId(clave)

  for (const tarea of tareas) {
    const ext = externalId(tarea)
    const nombre = `[${tarea.slug}] ${tarea.id} · ${tarea.titulo}`
    if (existentes.has(ext)) {
      console.log(`= ${ext} ya existe en Plane, no se toca`)
      continue
    }
    if (dryRun) {
      console.log(`+ (simulación) ${ext} · ${nombre}`)
      continue
    }
    await api(clave, 'POST', '/work-items/', {
      name: nombre,
      description_html: descripcionHtml(tarea),
      state: inicial.id,
      external_id: ext,
      external_source: ORIGEN,
    })
    console.log(`+ ${ext} creado`)
    await pausa(PAUSA_MS)
  }
}

async function cambiarEstado(clave, tareas, idTarea, nombreEstado) {
  const tarea = tareas.find(t => t.id === idTarea)
  if (!tarea) throw new Error(`El brief no tiene la tarea ${idTarea}`)
  const estados = await estadosPorNombre(clave)
  const estado = estados.get(nombreEstado)
  if (!estado) throw new Error(`El proyecto no tiene el estado «${nombreEstado}». Estados: ${[...estados.keys()].join(', ')}`)
  const existentes = await workItemsPorExternalId(clave)
  const ext = externalId(tarea)
  const item = existentes.get(ext)
  if (!item) throw new Error(`${ext} no existe en Plane. Corre «crear» primero`)

  if (dryRun) {
    console.log(`~ (simulación) ${ext}: ${nombreEstado}`)
    return
  }
  await api(clave, 'PATCH', `/work-items/${item.id}/`, { state: estado.id })
  console.log(`~ ${ext} → ${nombreEstado}`)
}

async function main() {
  if (!['crear', 'estado'].includes(comando) || !args[0]) {
    throw new Error('Uso: crear <brief.md> | estado <brief.md> <T#> "<Estado>"  [--dry-run]')
  }
  const clave = cargarClave()
  const rutaBrief = resolve(process.cwd(), args[0])
  const brief = rutaEnRepo(rutaBrief)
  const tareas = leerTareas(rutaBrief).map(tarea => ({ ...tarea, brief }))

  if (comando === 'crear') {
    await crear(clave, tareas)
  } else {
    if (!args[1] || !args[2]) throw new Error('Falta la tarea (T#) o el estado')
    await cambiarEstado(clave, tareas, args[1], args[2])
  }
}

main().catch(err => {
  console.error(err.message)
  process.exitCode = 1
})
