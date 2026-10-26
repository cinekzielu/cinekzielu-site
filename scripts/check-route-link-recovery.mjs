import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { trackInArea } from '../src/data/routeArea.js'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { routeLinkRecovery } from '../src/data/routeLinkRecovery.js'
import { readRouteAtlas, routeAtlasHref, routeRegions, routeYears, distanceFilters, ascentFilters, materialFilters, matchesRouteFilters } from '../src/data/routeAtlas.js'

const query = href => new URL(href, 'https://example.test').search
for (const search of ['', '?trasa=', '?trasa=dufourspitze', '?trasa=toubkal-podejscie-2025']) assert.equal(routeLinkRecovery(search), null)
for (const id of ['missing', 'constructor', '__proto__', '<script>alert(1)</script>']) {
  const search = `?trasa=${encodeURIComponent(id)}&pasmo=Tatry&rok=2025&widok=lista&sortuj=shortest`
  const notice = routeLinkRecovery(search)
  assert(notice)
  assert.deepEqual(readRouteAtlas(query(notice.href)), readRouteAtlas(search))
  assert(!new URL(notice.href, 'https://example.test').searchParams.has('trasa'))
  assert(!notice.message.includes(id))
}
const variants = [
  ...routeRegions.map(region => ({ region })), ...routeYears.map(year => ({ year })),
  ...distanceFilters.map(({ id: distance }) => ({ distance })),
  ...ascentFilters.map(({ id: ascent }) => ({ ascent })),
  ...materialFilters.map(({ id: material }) => ({ material })),
]
let checked = 0, rejected = 0
for (const row of catalog) for (const filter of variants) {
  const original = { ...filter, selected: row.id, compare: ['dufourspitze', 'ganek-wysoka-rysy'], view: 'list', sort: 'shortest' }
  const search = query(routeAtlasHref(original))
  const notice = routeLinkRecovery(search)
  assert.equal(Boolean(notice), !matchesRouteFilters(row, original))
  if (notice) {
    const restored = readRouteAtlas(query(notice.href))
    assert.equal(restored.selected, row.id)
    assert.equal(restored.area, null)
    for (const key of ['region', 'year', 'distance', 'ascent', 'material']) assert.equal(restored[key], 'all')
    assert.deepEqual(restored.compare, original.compare)
    assert.equal(restored.view, original.view)
    assert.equal(restored.sort, original.sort)
    assert.equal(new URL(notice.href, 'https://example.test').hash, '#profil')
    rejected++
  }
  checked++
}
// Simultaneous conflicting filters plus a viewport must all be cleared explicitly.
const conflict = '?trasa=dufourspitze&pasmo=Tatry&rok=2024&dystans=do-20&podejscia=do-1500&materialy=oba&obszar=19,49,21,50'
assert.equal(readRouteAtlas(query(routeLinkRecovery(conflict).href)).selected, 'dufourspitze')
const comparisonQuery = '?trasa=missing&porownaj=dufourspitze,ganek-wysoka-rysy&km=12.345'
assert.equal(new URL(routeLinkRecovery(comparisonQuery).href, 'https://example.test').searchParams.get('km'), '12.345')
assert.equal(new URL(routeLinkRecovery(comparisonQuery.replace('12.345', 'bad')).href, 'https://example.test').searchParams.get('km'), null)
const dufour = JSON.parse(await readFile(new URL('../src/data/dufourTrack.json', import.meta.url), 'utf8'))
const outside = '?trasa=dufourspitze&obszar=19,49,21,50'
assert.equal(routeLinkRecovery(outside), null, 'Do not reject a viewport selection before its track is ready')
assert.equal(trackInArea(dufour, readRouteAtlas(outside).area), false)
assert(routeLinkRecovery(outside, true).message.includes('obszaru mapy'))
assert.equal(readRouteAtlas(query(routeLinkRecovery(outside, true).href)).area, null)
assert.equal(routeLinkRecovery('?trasa=dufourspitze', true), null)
const inside = '?trasa=dufourspitze&obszar=0,40,20,50'
assert.equal(trackInArea(dufour, readRouteAtlas(inside).area), true)
assert.equal(routeLinkRecovery(inside, false), null)
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { RouteLinkNotice } = await server.ssrLoadModule('/src/components/RouteLinkNotice.jsx')
  for (const search of ['?trasa=missing', conflict]) {
    const html = renderToStaticMarkup(RouteLinkNotice({ search }))
    assert(html.includes('role="status"'))
    assert.equal((html.match(/<a /g) || []).length, 1)
    assert(!html.includes('<button'))
  }
  assert.equal(RouteLinkNotice({ search: '?trasa=dufourspitze' }), null)
} finally { await server.close() }
console.log(`PASS: ${checked} real route/filter cases (${rejected} rejected selections recoverable), invalid IDs, aliases, compound filters, context and native recovery links. No browser QA.`)
