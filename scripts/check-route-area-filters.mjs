import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { readRouteArea, areaKey, trackInArea, viewportArea } from '../src/data/routeArea.js'
import { routeMaterials } from '../src/data/routeMaterials.js'
import { matchesRouteFilters, readRouteAtlas, routeAtlasHref } from '../src/data/routeAtlas.js'
const box = [8,45,9,46]
const track = points => ({points})
assert(trackInArea(track([[45.5,7,1000,0,0],[45.5,10,1000,0,1]]),box), 'Crossing counts even without samples inside')
assert(!trackInArea(track([[45.5,7,1000,0,0],[45.5,10,1000,1,1]]),box), 'Recording gaps never count as a connecting segment')
assert(!trackInArea(track([[44,7,1000,0,0],[44,10,1000,0,1]]),box))
assert(trackInArea(track([[45,8,1000,0,0]]),box), 'Boundary is inclusive')
assert(!trackInArea(track([]),box))
assert(trackInArea(null,null))
for(const value of ['', '8,46,9,45','9,45,8,46','8,45,8,46','NaN,45,9,46','-181,45,9,46','8,-90,9,46','8,45,9,91']) assert.equal(readRouteArea(value),null)
assert.deepEqual(readRouteArea(areaKey(box)),box)
const state = readRouteAtlas('?rok=2025&materialy=oba&obszar=8,45,9,46&porownaj=dufourspitze,ganek-wysoka-rysy')
assert.deepEqual(readRouteAtlas(routeAtlasHref(state).split('?')[1]),state)
assert.equal(state.compare.length,2, 'Filters do not discard comparison')
assert.equal(readRouteAtlas('?rok=1900&materialy=invalid&obszar=bad').year,'all')
assert.equal(readRouteAtlas('?materialy=invalid').material,'all')
const row = id => {const value=catalog.find(r=>r.id===id);assert(value,id);return value}
assert.equal(routeMaterials(row('baranie-rogi-zima-2025')).photos,false, 'Video stills are not photographs')
assert.equal(routeMaterials(row('baranie-rogi-zima-2025')).film,true)
assert.equal(routeMaterials(row('ganek-wysoka-rysy')).photos,true, 'Expedition documentary photographs count')
assert.equal(routeMaterials(row('ganek-wysoka-rysy')).film,false)
assert(matchesRouteFilters(row('dufourspitze'),{year:'2026',material:'oba'}), 'Alps photographs and trailer are available')
assert(!matchesRouteFilters(row('dufourspitze'),{year:'2025'}))
assert(!matchesRouteFilters(row('baranie-rogi-zima-2025'),{material:'zdjecia'}))
assert(matchesRouteFilters(row('baranie-rogi-zima-2025'),{material:'film'}))
const bounds=viewportArea({x:0.52,y:0.35,zoom:10},{width:800,height:500})
assert(bounds && bounds[0]<bounds[2] && bounds[1]<bounds[3])
const zermatt=[7.6,45.8,7.9,46.1]
const found=[]
for(const entry of catalog){
 const data=JSON.parse(await readFile(new URL(`../src/data/${entry.id==='dufourspitze'?'dufourTrack.json':`tracks/${entry.id}.json`}`,import.meta.url),'utf8'))
 if(trackInArea(data,zermatt))found.push(entry.id)
}
assert(found.includes('dufourspitze'))
assert(!found.includes('ganek-wysoka-rysy'))
console.log('PASS: viewport bounds, segment intersection, GPS gaps, material provenance, recording year, URL and comparison preservation; Zermatt matches:',found.join(', '))

