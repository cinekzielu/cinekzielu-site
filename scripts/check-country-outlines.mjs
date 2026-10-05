import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { atlasContentNodes } from '../src/data/atlasContent.js'
import { atlasTerrainProfile } from '../src/data/atlasTerrain.js'
import { mercator, terrainScreen, terrainSvgViewport, fitTerrain, gestureTerrain, zoomTerrainAt } from '../src/data/terrainMap.js'

const outlines = new Map()
for (const node of atlasContentNodes.filter(node => node.kind === 'Kraj')) {
  const profile = atlasTerrainProfile(node.id)
  assert.equal(profile.countryId,node.id)
  const data = JSON.parse(await readFile(new URL(`../public/assets/maps/country-outlines/${node.id}.json`,import.meta.url),'utf8'))
  assert.equal(data.id,node.id)
  assert.equal(data.format,'normalized-web-mercator')
  assert.equal(data.license,'public domain')
  const rings = [...data.path.matchAll(/M([^Z]+)Z/g)].map(match => match[1].split('L').map(pair => pair.split(',').map(Number)))
  assert.equal(rings.length,data.rings)
  assert(data.polygons > 0 && data.polygons <= data.rings)
  for (const ring of rings) {
    assert(ring.length >= 4)
    assert.deepEqual(ring[0],ring.at(-1),'Closed geographic ring')
    assert(ring.flat().every(n => Number.isFinite(n) && n >= 0 && n <= 1))
  }
  outlines.set(node.id,rings)
  for (const size of [{width:274,height:430},{width:800,height:520}]) {
    const fitted = fitTerrain(profile.overview,size)
    for (const zoom of [fitted.zoom,8,13.5,16]) {
      const initial = {...fitted,zoom}
      const panned = gestureTerrain(initial,{x:80,y:90},{x:140,y:190},0,size)
      const zoomed = zoomTerrainAt(panned,zoom+0.5,{x:60,y:120},size)
      for (const view of [initial,panned,zoomed]) {
        const viewport = terrainSvgViewport(view,size)
        for (const point of profile.overview) {
          const projected = mercator(point), screen = terrainScreen(point,view,size)
          assert(Math.abs((projected.x-viewport.left)/viewport.width*size.width-screen.x)<1e-6,'Outline x tracks tiles and markers')
          assert(Math.abs((projected.y-viewport.top)/viewport.height*size.height-screen.y)<1e-6,'Outline y tracks tiles and markers')
        }
      }
    }
  }
}
assert.equal(outlines.size,14)
function contains(id,point) {
  const {x,y}=mercator(point)
  let inside=false
  for(const ring of outlines.get(id)) for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
    const [xi,yi]=ring[i], [xj,yj]=ring[j]
    if((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) inside=!inside
  }
  return inside
}
assert(contains('poland',{lat:52.23,lng:21.01}))
assert(!contains('poland',{lat:52.52,lng:13.405}))
assert(contains('switzerland',{lat:46.948,lng:7.447}))
assert(!contains('switzerland',{lat:48.208,lng:16.373}))
assert(contains('slovenia',{lat:46.057,lng:14.505}))
assert(contains('morocco',{lat:34.02,lng:-6.84}))
for(const id of ['alpy','jura','gorce','morocco-atlas']) assert.equal(atlasTerrainProfile(id).countryId,null)
assert.equal(atlasTerrainProfile('tatry'),null)
assert.equal(atlasTerrainProfile('saxer-lucke').countryId,'switzerland')
console.log('Country outlines OK: 14 countries, geographic containment, closed rings, viewport alignment after pan/zoom, separate regions.')
