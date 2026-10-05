import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { switzerlandPlaces, switzerlandPosition } from '../src/data/switzerlandPlaces.js'
import { atlasNodeById, atlasAncestry, atlasListNodes, getAtlasMaterials, readAtlasSelection } from '../src/data/atlasContent.js'
import { searchSite } from '../src/data/siteSearch.js'

const geometry = JSON.parse(await readFile(new URL('../src/data/switzerlandMapPaths.json',import.meta.url),'utf8'))
const ids = ['saxer-lucke','fronalpstock','augstmatthorn','murren-gimmelwald','zermatt','bettmerhorn']
assert.deepEqual(switzerlandPlaces.map(place=>place.id),ids, 'Preserve the existing Swiss destination IDs')
assert.equal(atlasNodeById.switzerland.view,'terrain')
assert.deepEqual(atlasListNodes('switzerland').map(place=>place.id),ids)
assert.equal(geometry.viewBox,'0 0 800 600')
assert(geometry.countries.find(country=>country.id==='che')?.paths.length)
assert(geometry.lakes.length >= 2)
assert(geometry.countries.every(country=>country.paths.length && country.paths.every(path=>/^M[-\d., MLZ]+$/.test(path))))
for (const place of switzerlandPlaces) {
  assert.equal(atlasNodeById[place.id].view,'terrain')
  assert.equal(readAtlasSelection(`?atlas=${place.id}`),place.id)
  assert.deepEqual(atlasAncestry(place.id).map(node=>node.id),['world','europe','switzerland',place.id])
  assert.deepEqual(atlasListNodes(place.id).map(node=>node.id),ids)
  assert(place.coordinateSource.startsWith('https://api3.geo.admin.ch/'))
  assert(Number.isInteger(place.coordinateRecord))
  assert(place.lat>45.8 && place.lat<47.8 && place.lon>5.9 && place.lon<10.6)
  const position = switzerlandPosition(place), p=geometry.projection
  assert.equal(position.x,(place.lon-p.west)*p.scaleX/p.width*100)
  assert.equal(position.y,(p.north-place.lat)*p.scaleY/p.height*100)
  assert(Object.values(position).every(n=>n>0&&n<100))
  const materials=getAtlasMaterials(place.id)
  assert.deepEqual(materials.films.map(film=>film.youtubeId),place.filmIds)
  assert.deepEqual(materials.galleries.map(gallery=>gallery.id),['szwajcaria-2025'])
  assert(searchSite(place.name).some(result=>result.href===`/mapa?atlas=${place.id}`))
}
// The selected Fronalpstock is in Schwyz, not the namesake in Glarus.
assert.equal(switzerlandPlaces.find(place=>place.id==='fronalpstock').coordinateRecord,341831)
assert(switzerlandPlaces.find(place=>place.id==='fronalpstock').lon<8.7)
// Label offsets are UI-only; geographic dots never move with the viewport.
for (const width of [275,345,450,460,600,740]) {
  const points=switzerlandPlaces.map(place=>{const a=width<460?place.compactAnchor:place.anchor;return {id:place.id,x:a[0]/100*width,y:a[1]/100*width*.75}})
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++) {
    assert(Math.abs(points[i].x-points[j].x)>=44 || Math.abs(points[i].y-points[j].y)>=44,`Overlapping touch targets at ${width}: ${points[i].id}/${points[j].id}`)
  }
}
assert.equal(getAtlasMaterials('switzerland').films.length,8)
assert.equal(getAtlasMaterials('switzerland').photoCount,84)
console.log('PASS: six preserved Swiss destinations, sourced coordinates/projection, existing materials and non-overlapping 44px targets at six widths.')
