import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRouteTrackLoader, requiredRouteTracks } from '../src/data/routeTrackLoader.js'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }

const track = { points: [[46, 9, 1200, 0, 0]], distance: 0 }
const selection = { view: 'map', area: null, selected: null, compare: [] }
assert.deepEqual(requiredRouteTracks(['triglav', 'dufourspitze'], selection, false), [], 'Offscreen maps must not request traces')
assert.deepEqual(requiredRouteTracks(['triglav'], selection, true), ['triglav'], 'Map requests respect metadata filters')
assert.deepEqual(requiredRouteTracks(['triglav'], { ...selection, view: 'list', compare: ['dufourspitze', 'dufourspitze'] }, true), ['dufourspitze'], 'List comparison requests only distinct selected recordings')
assert.deepEqual(requiredRouteTracks(['triglav'], { ...selection, view: 'list', area: [6, 43, 15, 50], compare: ['ganek-wysoka-rysy'] }, false), ['triglav', 'ganek-wysoka-rysy'], 'Spatial filtering loads matching traces while preserving comparison outside metadata filters')
let calls = 0, release
const load = createRouteTrackLoader(id => id, async () => {
  calls++
  await new Promise(resolve => { release = resolve })
  return { ok: true, json: async () => track }
})
const first = load('triglav'), second = load('triglav')
assert.equal(first, second, 'Concurrent map/profile/card requests must share one download')
release()
assert.equal((await first).default, track)
assert.equal(await load('triglav'), await second, 'Successful data remains cached')
assert.equal(calls, 1)

for (const failure of ['http', 'json', 'data']) {
  let attempts = 0
  const retry = createRouteTrackLoader(id => id, async () => {
    attempts++
    if (attempts > 1) return { ok: true, json: async () => track }
    return { ok: failure !== 'http', status: 503, json: async () => {
      if (failure === 'json') throw new SyntaxError('Invalid JSON')
      return { points: [], distance: 0 }
    } }
  })
  await assert.rejects(retry('route'))
  assert.equal((await retry('route')).default, track, `${failure} failure must not poison retries`)
  assert.equal(attempts, 2)
}

let aborted = false
const timeout = createRouteTrackLoader(id => id, (_, { signal }) => new Promise((resolve, reject) => {
  signal.addEventListener('abort', () => { aborted = true; reject(new Error('Aborted')) }, { once: true })
}), 5)
await assert.rejects(timeout('slow'), /Aborted/)
assert(aborted, 'A stalled request must stop waiting and expose retry')

// Validate the new transport against every unchanged source recording.
const fromDisk = createRouteTrackLoader(id => new URL(`../src/data/${id === 'dufourspitze' ? 'dufourTrack.json' : `tracks/${id}.json`}`, import.meta.url), async url => ({ ok: true, json: async () => JSON.parse(await readFile(url, 'utf8')) }))
for (const row of catalog) {
  const result = await fromDisk(row.id)
  assert.equal(result.default.distance, row.distance)
  assert(result.default.points.length > 0)
}
console.log('PASS: request scope, spatial filtering and comparison, shared pending/resolved downloads, HTTP/JSON/data recovery, timeout, all 42 source recordings.')
