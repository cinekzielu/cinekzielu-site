import assert from 'node:assert/strict'
import { readTerrainView, readTerrainTone, setTerrainView, atlasViewHref } from '../src/data/atlasViewState.js'
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
console.log('PASS: bounded map view URLs, subpixel coordinate round trips, country/area/year/filter preservation, invalid links ignored and unrelated parameters excluded.')
