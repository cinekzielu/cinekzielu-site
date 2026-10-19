import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import additions from '../src/data/auditedSummits.json' with { type: 'json' }
import { summits } from '../src/data/summits.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { summitRoutes, summitDayScopes } from '../src/data/relatedRoutes.js'
import { searchSite } from '../src/data/siteSearch.js'
import { TERRAIN_TILE_URL } from '../src/data/terrainMap.js'

assert.equal(additions.length, 8)
for (const item of additions) {
  const summit = summits.find(p => p.id === item.id)
  assert(summit && summit.altitude === item.altitude)
  assert(summit.ascents.some(a => a.routeId === item.routeId && a.orderDate === item.orderDate))
  assert(summitRoutes(item.id).some(r => r.id === item.routeId))
  const route = tripRoutes[item.routeId]
  assert(route.peaks.some(p => p.id === item.id))
  const track = JSON.parse(await readFile(new URL(`../src/data/tracks/${item.routeId}.json`, import.meta.url), 'utf8'))
  const distance = Math.min(...track.points.map(p => Math.hypot((p[0] - item.lat) * 111195, (p[1] - item.lng) * 111195 * Math.cos(item.lat * Math.PI / 180))))
  assert(distance < 40, `${item.name}: route misses geographic summit (${distance} m)`)
  if (!item.season) assert.equal(summit.ascents[0].season, null)
  const url = new URL(summit.mapHref, 'https://www.cinekzielu.pl')
  assert(['/mapa', '/trasy'].includes(url.pathname))
  if (url.pathname === '/trasy') assert(tripRoutes[url.searchParams.get('trasa')])
}
assert.equal(summitDayScopes['swinica-2025']['kasprowy-wierch'], '1')
assert(searchSite('Mały Lodowy').some(r => r.id === 'route:czerwona-lawka-2024'))
assert(!summits.flatMap(p => p.ascents).some(a => a.routeId === 'lodowy-proba-2024'))
for (const id of ['szatan', 'wysoka']) assert(summits.find(p => p.id === id).ascents.some(a => a.year === null), 'Do not date old films from a separate GPX')
assert.equal(TERRAIN_TILE_URL, 'https://tile.openmaps.fr/opentopomap/{z}/{x}/{y}.png')
console.log('PASS: eight evidence-based summits, geographic track checks, valid route links and search, correct day, unknowns and excluded attempt.')
