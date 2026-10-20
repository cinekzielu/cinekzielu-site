import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { summits } from '../src/data/summits.js'
import { getAtlasMaterials } from '../src/data/atlasContent.js'
import { readAtlasContext } from '../src/data/atlasTerrain.js'
import { searchSite } from '../src/data/siteSearch.js'
const id = 'malolaczniak-giewont-2024'
const route = tripRoutes[id]
assert.equal(route.title, 'Ciemniak, Małołączniak, Kopa Kondracka i Giewont')
assert.equal(route.dates, '26 października 2024')
assert.deepEqual(route.peaks.map(p => p.altitude), [2096, 2096, 2005, 1894])
assert.equal(route.trip, null)
const track = JSON.parse(await readFile(new URL(`../src/data/tracks/${id}.json`, import.meta.url), 'utf8'))
assert.equal(track.distance, 22386.8)
assert.equal(track.points.length, 2329)
assert(track.points.every(p => p.length === 5 && p.every(Number.isFinite)))
for (const peakId of ['ciemniak', 'malolaczniak', 'kopa-kondracka', 'giewont']) {
  const peak = summits.find(p => p.id === peakId)
  assert(peak.ascents.some(a => a.routeId === id && a.orderDate === '2024-10-26'))
  assert.equal(peak.ascents[0].season, null)
  assert(getAtlasMaterials(peakId, '2024').routes.some(r => r.id === id))
  assert(!getAtlasMaterials(peakId, '2025').routes.some(r => r.id === id))
}
assert.equal(readAtlasContext('?atlas=malolaczniak&obszar=poland'), 'poland')
assert.equal(readAtlasContext('?atlas=malolaczniak&obszar=slovakia'), 'slovakia')
for (const q of ['Marcin sam w górach', 'Małołączniak', 'Giewont', 'Ciemniak', 'Kopa Kondracka']) assert(searchSite(q).some(r => r.id === `route:${id}`), q)
console.log('PASS: identified GPX, four summit links, country/year contexts, original-name search, sanitized track and official heights.')
