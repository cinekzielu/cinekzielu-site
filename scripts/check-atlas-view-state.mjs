import assert from 'node:assert/strict'
import { readTerrainView, readTerrainTone, setTerrainView, atlasViewHref } from '../src/data/atlasViewState.js'
import { readAtlasSelection, readAtlasYear } from '../src/data/atlasContent.js'
import { readAtlasContext } from '../src/data/atlasTerrain.js'
import {mercator, terrainScreen} from '../src/data/terrainMap.js'

for(const input of ['', '?kadr=', '?kadr=1,2', '?kadr=1,2,3,4', '?kadr=NaN,2,3','?kadr=Infinity,2,3','?kadr=86,2,3','?kadr=1,-181,3','?kadr=1,2,1.9','?kadr=1,2,17','?kadr=,2,3','?kadr=1e2,2,3']) assert.equal(readTerrainView(input),null,input)
for(const point of [{lat:49.245,lng:20.0123},{lat:46.86,lng:8.28},{lat:34.02,lng:-6.84},{lat:-85.0511,lng:-180},{lat:85.0511,lng:180}]) {
  for(const zoom of [2,8.537,13.5,16]) {
    const view={...mercator(point),zoom},params=new URLSearchParams('atlas=poland&rok=2026')
    setTerrainView(params,view,'natural')
    const saved=readTerrainView(params.toString())
    assert.equal(saved.tone,'natural')
    assert.equal(saved.view.zoom,zoom)
    const location=terrainScreen(point,saved.view,{width:390,height:430})
    assert(Math.abs(location.x-195)<.3 && Math.abs(location.y-215)<.3,'Restored center stays subpixel at max zoom')
    assert.equal(params.get('rok'),'2026')
  }
}
const exact=atlasViewHref('?atlas=saxer-lucke&obszar=alpy&rok=2025&miejsca=wszystkie&kadr=47.2,9.4,13.500&podklad=natural&unrelated=ignore')
const parsed=new URL(exact,'https://www.cinekzielu.pl')
assert.equal(parsed.pathname,'/mapa')
assert.equal(parsed.searchParams.get('obszar'),'alpy')
assert.equal(parsed.searchParams.get('rok'),'2025')
assert.equal(parsed.searchParams.get('miejsca'),'wszystkie')
assert.equal(parsed.searchParams.get('podklad'),'natural')
assert(!parsed.searchParams.has('unrelated'))
assert.equal(atlasViewHref('?atlas=tatry&kadr=broken'),'/mapa?atlas=tatry')
assert.equal(atlasViewHref(''),'/mapa')
assert.equal(readTerrainTone('?podklad=unknown'),null)
// Reopening and copying a stored URL must preserve both content context and frame.
// This is a serializer/parser regression, not a browser history or viewport test.
for (const search of [
  '?atlas=gerlach&rok=2025&kadr=49.164032,20.134060,15.000&podklad=natural',
  '?atlas=saxer-lucke&obszar=alpy&rok=2025&miejsca=wszystkie&kadr=47.2,9.4,13.500&podklad=dark',
  '?atlas=gerlach&rok=2024&obszar=morocco&kadr=49.164032,20.134060,15.000&podklad=natural',
]) {
  const expected = [readAtlasSelection(search), readAtlasYear(search), readAtlasContext(search)]
  const canonical = atlasViewHref(search)
  let current = canonical
  for (let cycle = 0; cycle < 25; cycle++) {
    const query = new URL(current, 'https://example.test').search
    const saved = readTerrainView(query)
    assert(saved, 'A valid saved frame remains readable')
    assert.deepEqual([readAtlasSelection(query), readAtlasYear(query), readAtlasContext(query)], expected)
    current = atlasViewHref(query, saved)
    assert.equal(current, canonical, 'Repeated copies must not drift or lose filters')
  }
}
const malformed = '?atlas=saxer-lucke&obszar=alpy&rok=2025&miejsca=wszystkie&kadr=broken'
const fallback = new URL(atlasViewHref(malformed), 'https://example.test').search
assert.equal(readTerrainView(fallback), null)
assert.equal(readAtlasSelection(fallback), 'saxer-lucke')
assert.equal(readAtlasContext(fallback), 'alpy')
assert.equal(readAtlasYear(fallback), '2025')
assert.equal(new URLSearchParams(fallback).get('miejsca'), 'wszystkie')
console.log('PASS: bounded map view URLs, subpixel coordinate round trips, country/area/year/filter preservation, invalid links ignored and unrelated parameters excluded.')
