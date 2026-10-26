import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { summarizeRoutes } from '../src/data/routeSummary.js'
import { routeCardDescription } from '../src/data/routeCardDescription.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { highestPeak, dayIds, estimateAscent } from '../src/data/routeAtlas.js'
import { cardGeometry, drawRouteCard } from '../src/data/routeCardDrawing.js'

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
  assert.equal(row.distance, track.distance, `${row.id}: card and profile distances agree`)
  assert.equal(row.ascentEstimate, estimateAscent(track.points), `${row.id}: catalog ascent matches GPS estimator`)
  const route = tripRoutes[row.id], peak = highestPeak(route), days = dayIds.get(row.id)?.length || 0
  const description = routeCardDescription(route, row, peak, days)
  assert(description.includes(route.title) && description.includes(route.dates))
  assert(description.includes(days > 1 ? `Cały zapis obejmujący ${days} dni.` : 'Cały zapis trasy.'))
  assert(description.includes('około'))
  assert(peak ? description.includes(peak.name) && description.includes('niezależna od GPS') : description.includes('Brak przypisanego szczytu.'))
  // Record actual drawing text calls, without simulating font layout or pixels.
  const drawn = []
  const ctx = new Proxy({ fillText: text => drawn.push(text), measureText: text => ({ width: text.length * 18 }) }, { get: (target, key) => key in target ? target[key] : () => {} })
  drawRouteCard({ getContext: () => ctx }, route, row, track, peak)
  const distanceText = `${(row.distance / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} km`
  const ascentText = row.ascentEstimate.toLocaleString('pl-PL')
  assert(drawn.includes(distanceText) && description.includes(distanceText))
  assert(drawn.includes(`≈ ${ascentText} m`) && description.includes(`około ${ascentText} m`))
  if (peak) assert(drawn.includes(`${peak.altitude.toLocaleString('pl-PL')} m`))
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
const source = await readFile(new URL('../src/components/RouteCard.jsx', import.meta.url), 'utf8')
assert(source.includes('id="route-card-description"'))
assert(source.includes('aria-describedby="route-card-description"'))
console.log('PASS: 42 card descriptions agree with GPS/catalog and drawing text, complete-day scope, unknown summits, filtered totals, deduplication, geometries and recording gaps. No browser or pixel QA.')
