import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { readRouteAtlas, highestPeak } from '../src/data/routeAtlas.js'
import { cleanSavedKeys, decodeSaved } from '../src/data/savedItems.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }

const track = JSON.parse(await readFile(new URL('../src/data/tracks/toubkal-2025.json', import.meta.url)))
assert.equal(track.dates, '4–5 maja 2025')
assert.equal(track.points.length, 3476, 'Keep every previously published point')
assert.deepEqual(track.stages.map(stage => stage.distance), [16950.8, 9288.1, 9958.7])
assert.equal(track.distance, 36197.6, 'No additional distance across recording boundaries')
let next = 0
for (const stage of track.stages) {
  assert.equal(stage.startIndex, next)
  const first = track.points[stage.startIndex], last = track.points[stage.endIndex]
  assert.equal(Math.round((last[4] - first[4]) * 10) / 10, stage.distance)
  if (next) {
    assert.notEqual(first[3], track.points[next - 1][3], 'Never draw a line across separate recordings')
    assert.equal(first[4], track.points[next - 1][4])
  }
  next = stage.endIndex + 1
}
assert.equal(next, track.points.length)
assert.equal(highestPeak(tripRoutes['toubkal-2025']).altitude, 4167)
assert.equal(catalog.filter(row => row.id.startsWith('toubkal')).length, 1)
for (const old of ['toubkal-podejscie-2025', 'toubkal-zejscie-2025']) {
  assert.equal(readRouteAtlas(`?trasa=${old}`).selected, 'toubkal-2025')
  assert.deepEqual(readRouteAtlas(`?porownaj=${old},toubkal-2025,dufourspitze`).compare, ['toubkal-2025', 'dufourspitze'])
  assert(tripRoutes['toubkal-2025'].legacyAnchors.includes(`trasa-${old}`))
  assert.deepEqual(decodeSaved(JSON.stringify({version:1,items:[`route:${old}`]})), ['route:toubkal-2025'])
}
assert.deepEqual(cleanSavedKeys(['route:toubkal-podejscie-2025','route:toubkal-2025','route:toubkal-zejscie-2025']), ['route:toubkal-2025'])
console.log('PASS: complete three-stage track, exact distances, separate segments, official peak height, no duplicate catalog entries, legacy links and saved-item migration.')
