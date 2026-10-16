import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { estimateAscent, comparisonScale, comparisonPaths, readRouteAtlas, routeAtlasHref, highestPeak } from '../src/data/routeAtlas.js'
import { tripRoutes } from '../src/data/tripRoutes.js'

const sample = (elevation, section = 0, distance = 0) => [46, 9, elevation, section, distance]
assert.equal(estimateAscent([100,103,106,109,112,115,120].map(e => sample(e))), 20, 'Gradual ascent must accumulate')
assert.equal(estimateAscent([100,103,99,102,98,101,100].map(e => sample(e))), 0, 'GPS jitter is not an ascent')
assert.equal(estimateAscent([sample(100),sample(130),sample(1000,1),sample(1020,1)]), 50, 'Do not bridge missing recordings')
assert.equal(estimateAscent([200,180,160,140].map(e => sample(e))), 0, 'Descent is not ascent')
assert.equal(estimateAscent([100,150,100,150].map(e => sample(e))), 100)

const invalid = readRouteAtlas('?pasmo=unknown&trasa=made-up&porownaj=zugspitze,zugspitze,triglav,grauspitz')
assert.deepEqual(invalid, { region:'all', selected:null, compare:['zugspitze','triglav'] })
assert.equal(readRouteAtlas('?pasmo=Tatry&trasa=dufourspitze').selected, null)
const state = { region:'Tatry', selected:'ganek-wysoka-rysy', compare:['dufourspitze','ganek-wysoka-rysy'] }
assert.deepEqual(readRouteAtlas(routeAtlasHref(state).split('?')[1]), state, 'Selections survive URL roundtrip, including cross-region comparison')

const tracks = await Promise.all(catalog.map(async row => JSON.parse(await readFile(new URL(`../src/data/${row.id === 'dufourspitze' ? 'dufourTrack.json' : `tracks/${row.id}.json`}`, import.meta.url), 'utf8'))))
const scale = comparisonScale(tracks)
for (const [i, track] of tracks.entries()) {
  assert.equal(catalog[i].ascentEstimate, estimateAscent(track.points))
  assert(track.distance <= scale.distance && track.minElevation >= scale.low && track.maxElevation <= scale.high)
  assert.equal(comparisonPaths(track, scale).length, new Set(track.points.map(p => p[3])).size)
  assert(!comparisonPaths(track, scale).join('').match(/NaN|Infinity/))
  assert(highestPeak(tripRoutes[catalog[i].id]).altitude > 2500)
}
const short = { distance:1000,minElevation:1000,maxElevation:2000,points:[sample(1000,0,0),sample(2000,0,1000)] }
const long = { ...short,distance:2000,points:[...short.points,sample(1000,0,2000)] }
const shared = comparisonScale([short,long])
assert.equal(comparisonPaths(long,shared)[0].split(' L')[1],comparisonPaths(short,shared)[0].split(' L')[1], 'Same distance/elevation must occupy exactly the same coordinate on both profiles')
const html = await readFile(new URL('../dist/trasy.html',import.meta.url),'utf8')
assert(html.includes('id="porownanie"') && html.includes('aria-label="Mapa tras"'))
assert.equal((html.match(/class="cz-route-catalog-row"/g)||[]).length,6)
assert(html.includes('Suma podejść') || html.includes('suma podejść'))
console.log('PASS: ascent noise and gaps, URL validation/history state, all six real tracks, shared distance/elevation scales and server-rendered list.')
