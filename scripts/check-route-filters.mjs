import assert from 'node:assert/strict'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { distanceFilters, ascentFilters, matchesRouteFilters, readRouteAtlas, routeAtlasHref, comparisonShareHref, readComparisonDistance } from '../src/data/routeAtlas.js'

const ids = state => catalog.filter(row => matchesRouteFilters(row, state)).map(row => row.id)
assert.deepEqual(ids({ distance: 'do-20' }), ['zugspitze', 'grauspitz', 'triglav'])
assert.deepEqual(ids({ distance: '20-40' }), ['grossglockner'])
assert.deepEqual(ids({ distance: 'ponad-40' }), ['dufourspitze', 'ganek-wysoka-rysy'])
assert.deepEqual(ids({ ascent: 'do-1500' }), ['grauspitz'])
assert.deepEqual(ids({ ascent: 'ponad-2500' }), ['dufourspitze'])
assert.deepEqual(ids({ region: 'Tatry', distance: 'do-20' }), [])
assert.deepEqual(ids({ distance: 'ponad-40', ascent: '1500-2500' }), ['ganek-wysoka-rysy'])
for (const value of [0,19999,20000,20001,40000,40001]) {
  const row = { distance: value, ascentEstimate: 1500, region: 'Alpy' }
  assert.equal(distanceFilters.slice(1).filter(range => matchesRouteFilters(row, { distance: range.id })).length, 1, 'Each boundary belongs to exactly one distance band')
}
for (const value of [0,1499,1500,1501,2500,2501]) {
  const row = { distance: 10000, ascentEstimate: value, region: 'Alpy' }
  assert.equal(ascentFilters.slice(1).filter(range => matchesRouteFilters(row, { ascent: range.id })).length, 1, 'Ascent bands neither overlap nor omit a boundary')
}
const state = readRouteAtlas('?dystans=do-20&podejscia=do-1500&trasa=grauspitz&porownaj=dufourspitze,ganek-wysoka-rysy')
assert.deepEqual(readRouteAtlas(new URL(routeAtlasHref(state), 'https://www.cinekzielu.pl').search), state)
assert.deepEqual(state.compare, ['dufourspitze','ganek-wysoka-rysy'], 'Filters must not discard comparison selections')
assert.equal(readRouteAtlas('?trasa=dufourspitze&dystans=do-20').selected, null, 'Hidden route must not remain selected on the filtered map')
const invalid = readRouteAtlas('?dystans=Infinity&podejscia=-1')
assert.equal(invalid.distance, 'all'); assert.equal(invalid.ascent, 'all')
const shared = new URL(comparisonShareHref(state, 27600), 'https://www.cinekzielu.pl')
assert.deepEqual(readRouteAtlas(shared.search), state)
assert.equal(readComparisonDistance(shared.search, 60000), 27600)
console.log('PASS: actual filtered routes, combined empty results, exact boundaries, invalid values, filtered selection and shared cross-filter comparisons.')
