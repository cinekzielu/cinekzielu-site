import assert from 'node:assert/strict'
import { tatryLocations, tatryLocationById } from '../src/data/tatryAtlas.js'
import { atlasContentNodes, hasAtlasMaterials } from '../src/data/atlasContent.js'
import { mercator, unproject, worldSize, fitTerrain, terrainScreen, terrainMarkers, visibleTerrainTiles, reprojectTerrainTile, zoomTerrainAt, gestureTerrain, MIN_TERRAIN_ZOOM, MAX_TERRAIN_ZOOM } from '../src/data/terrainMap.js'

const close = (actual, expected, message) => assert(Math.abs(actual - expected) < 1e-7, `${message}: ${actual} != ${expected}`)
const peaks = atlasContentNodes.filter(node => node.parent === 'tatry' && node.kind === 'Szczyt')
assert.deepEqual(new Set(peaks.map(node => node.id)), new Set(tatryLocations.map(point => point.id)))
assert.equal(tatryLocations.length, new Set(tatryLocations.map(point => point.id)).size)
assert.equal(tatryLocationById['liptowskie-mury'], undefined, 'Ridge traversal has no invented summit pin')
assert(tatryLocationById.koscielec.lat > tatryLocationById.swinica.lat)
assert(tatryLocationById['durny-szczyt'].lat > tatryLocationById.lomnica.lat)
assert(tatryLocationById.wolowiec.lng < tatryLocationById['starorobocianski-wierch'].lng)
assert(tatryLocations.every(point => /^https:\/\/www.openstreetmap.org\/node\/\d+$/.test(point.source)))
assert.deepEqual(mercator({lat:0,lng:0}), {x:.5,y:.5})
for (const point of tatryLocations) {
  const inverse = unproject(mercator(point))
  close(inverse.lat, point.lat, 'Latitude round trip')
  close(inverse.lng, point.lng, 'Longitude round trip')
}

for (const size of [{width:274,height:430},{width:342,height:430},{width:798,height:520},{width:1400,height:800}]) {
  for (const points of [tatryLocations, tatryLocations.filter(point => hasAtlasMaterials(point.id))]) {
    const view = fitTerrain(points, size)
    const groups = terrainMarkers(points, view, size)
    assert.equal(groups.flatMap(group => group.points).length, points.length, 'Every overview summit is visible')
    for (const point of points) {
      const screen = terrainScreen(point,view,size)
      assert(screen.x >= 44 && screen.x <= size.width - 44 && screen.y >= 44 && screen.y <= size.height - 44)
      const closeView = {...mercator(point),zoom:MAX_TERRAIN_ZOOM}
      assert(terrainMarkers(points,closeView,size).some(g=>g.points.length===1&&g.points[0].id===point.id), 'Every summit is individually reachable at close zoom')
    }
    for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++)assert(Math.hypot(groups[i].x-groups[j].x,groups[i].y-groups[j].y)>=46)
  }
  for (const zoom of [9,12,13.4,14,15.9,16]) {
    const view = {...mercator(tatryLocationById.lomnica),zoom}
    const tiles = visibleTerrainTiles(view,size)
    assert(tiles.length <= (Math.ceil(size.width/181)+1)*(Math.ceil(size.height/181)+1), 'Only viewport tiles loaded')
    assert(tiles.every(tile => tile.size >= 181 && tile.size <= 363), 'Nearest raster level avoids blurry twofold enlargement')
    for (const corner of [[0,0],[size.width,0],[0,size.height],[size.width,size.height]]) {
      assert(tiles.some(tile => corner[0]>=tile.left && corner[0]<=tile.left+tile.size && corner[1]>=tile.top && corner[1]<=tile.top+tile.size), 'Tile coverage has no gaps')
    }
    const centerTile = tiles.find(tile=>size.width/2>=tile.left && size.width/2<tile.left+tile.size && size.height/2>=tile.top && size.height/2<tile.top+tile.size)
    const [z,x,y]=centerTile.key.split('/').map(Number)
    close(centerTile.left+(view.x*2**z-x)*centerTile.size,size.width/2,'Marker aligns with its tile in x')
    close(centerTile.top+(view.y*2**z-y)*centerTile.size,size.height/2,'Marker aligns with its tile in y')
    const anchor={x:size.width*.3,y:size.height*.6}
    const geo=unproject({x:view.x+(anchor.x-size.width/2)/worldSize(zoom),y:view.y+(anchor.y-size.height/2)/worldSize(zoom)})
    const next=zoomTerrainAt(view,zoom+1,anchor,size)
    const screen=terrainScreen(geo,next,size)
    close(screen.x,anchor.x,'Zoom keeps cursor location in x');close(screen.y,anchor.y,'Zoom keeps cursor location in y')
    const moved={x:anchor.x+68,y:anchor.y-35}
    for(const delta of [0,.7,-.9]) {
      const panned=gestureTerrain(view,anchor,moved,delta,size)
      const location=terrainScreen(geo,panned,size)
      close(location.x,moved.x,'Pan/pinch follows centroid in x');close(location.y,moved.y,'Pan/pinch follows centroid in y')
    }
    const cached=reprojectTerrainTile(centerTile,next,size)
    const tileCorner=terrainScreen(unproject({x:x/2**z,y:y/2**z}),next,size)
    close(cached.left,tileCorner.x,'Loaded tiles stay geographically aligned during zoom')
    close(cached.top,tileCorner.y,'Loaded tiles stay geographically aligned during zoom')
  }
}
assert.equal(zoomTerrainAt({x:.5,y:.5,zoom:MIN_TERRAIN_ZOOM},-100,{x:0,y:0},{width:300,height:400}).zoom,MIN_TERRAIN_ZOOM)
console.log(`PASS: ${tatryLocations.length} sourced pins; Mercator/tile alignment; viewport coverage; cursor zoom; drag/pinch anchors; zoom limits; all peaks reachable at 4 sizes.`)
