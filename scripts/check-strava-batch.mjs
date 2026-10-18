import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import routes from '../src/data/importedRoutes.json' with { type: 'json' }
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { tripRoutes } from '../src/data/tripRoutes.js'
import { highestPeak, readRouteAtlas, routeHref, matchesRouteFilters } from '../src/data/routeAtlas.js'

assert.equal(routes.length,35)
assert.equal(catalog.length,41)
assert.equal(routes.filter(row=>row.trip).length,23)
assert.deepEqual([...new Set(catalog.map(row=>row.region))].sort(),['Alpy','Atlas Wysoki','Gorce','Tatry'])
for (const region of ['Atlas Wysoki','Gorce']) {
  assert.equal(readRouteAtlas(`?pasmo=${encodeURIComponent(region)}`).region,region)
  assert(catalog.some(row=>matchesRouteFilters(row,{region})))
}
const attempt=tripRoutes['lodowy-proba-2024']
assert.equal(highestPeak(attempt),null,'An attempt is never counted as a reached summit')
assert(attempt.intro.includes('przed szczytem'))
assert.equal(routeHref(catalog.find(row=>row.id===attempt.id),attempt),'/trasy?trasa=lodowy-proba-2024#profil')
assert.equal(highestPeak(tripRoutes['toubkal-2025']).altitude,4167)
assert.equal(highestPeak(tripRoutes['baranie-rogi-zima-2025']).altitude,2526,'Use the existing verified height, not the activity filename')
assert.equal(highestPeak(tripRoutes['bettmerhorn-2025']).altitude,2857)
assert.equal(tripRoutes['gerlach-2024'].dates,'12 września 2024','Midnight UTC crossing must use local date')
for (const route of routes) {
  const track=JSON.parse(await readFile(new URL(`../src/data/tracks/${route.id}.json`,import.meta.url),'utf8'))
  assert.equal(route.dates,track.dates)
  assert.equal(route.marker.lat,track.points[0][0])
  assert.equal(route.marker.lng,track.points[0][1])
  assert(!/\.gpx|Users|Downloads|heart|cadence|token|T\d\d:\d\d/.test(JSON.stringify(route)))
}
assert(!routes.some(route=>/jasniak|marcin-sam/.test(route.id)),'Unresolved activity names stay private')
console.log('PASS: 39 source recordings grouped into 35 imports, 41 total, trip and standalone routes, new regions, unsuccessful attempt, combined Toubkal, verified heights and local dates.')
