import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { summarizeRoutes } from '../src/data/routeSummary.js'
import { cardGeometry } from '../src/data/routeCardDrawing.js'

assert.deepEqual(summarizeRoutes([]), { count: 0, distance: 0, ascent: 0 })
assert.deepEqual(summarizeRoutes([...catalog, ...catalog]), summarizeRoutes(catalog))
for (const [alias, canonical] of [['toubkal-podejscie-2025','toubkal-2025'],['toubkal-zejscie-2025','toubkal-2025'],['kasprowy-2025','swinica-2025'],['lodowy-lato-2026','baranie-rogi-lato-2026']]) {
  const row = catalog.find(r => r.id === canonical)
  assert.deepEqual(summarizeRoutes([row, {id:alias}]), summarizeRoutes([row]))
}
for (const region of new Set(catalog.map(row => row.region))) {
  const rows = catalog.filter(row => row.region === region)
  const summary = summarizeRoutes(rows)
  assert.equal(summary.count, rows.length)
  assert.equal(summary.distance, rows.reduce((sum,row) => sum + row.distance, 0))
  assert.equal(summary.ascent, rows.reduce((sum,row) => sum + row.ascentEstimate, 0))
}
for (const row of catalog) {
  const file = row.id === 'dufourspitze' ? 'dufourTrack.json' : `tracks/${row.id}.json`
  const track = JSON.parse(await readFile(new URL(`../src/data/${file}`, import.meta.url)))
  const geometry = cardGeometry(track)
  const sections = track.points.filter((p,i)=>!i || p[3] !== track.points[i-1][3]).length
  assert.equal(geometry.segments.length, sections, `${row.id}: no line across gaps`)
  assert.equal(geometry.segments.flat().length,track.points.length)
  for (const point of geometry.segments.flat()) {
    const [x,y] = geometry.map(point), [px,py] = geometry.profile(point)
    assert(x >= 139.99 && x <= 940.01 && y >= 354.99 && y <= 785.01, row.id)
    assert(px >= 99.99 && px <= 980.01 && py >= 954.99 && py <= 1100.01, row.id)
  }
}
console.log('PASS: filtered totals, merged-route deduplication, all 41 card geometries and recording gaps.')
