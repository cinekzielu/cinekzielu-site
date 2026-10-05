import assert from 'node:assert/strict'
import { atlasContentNodes, atlasNodeById, getAtlasMaterials, atlasYears, readAtlasYear, atlasHref } from '../src/data/atlasContent.js'
import { atlasTerrainProfile, readAtlasContext } from '../src/data/atlasTerrain.js'
import { fitTerrain, terrainScreen, visibleTerrainTiles } from '../src/data/terrainMap.js'
import { galleryData } from '../src/data/galleryData.js'
import { filterCollections } from '../src/data/collectionFilters.js'
import { filterFilms } from '../src/data/filmCatalog.js'
import { searchSite } from '../src/data/siteSearch.js'

for (const id of ['switzerland','alpy']) {
  const all=getAtlasMaterials(id), old=getAtlasMaterials(id,'2025'), current=getAtlasMaterials(id,'2026')
  assert.deepEqual([all.films.length,all.galleries.length,all.photoCount],[8,2,84])
  assert.deepEqual([old.films.length,old.galleries.length,old.photoCount],[7,1,36])
  assert.deepEqual([current.films.length,current.galleries.length,current.photoCount],[1,1,48])
  assert.equal(current.films[0].youtubeId,'l3KltGrKz2U')
  assert.equal(current.galleries[0].id,'alpy-2026')
  assert.equal(new Set(all.films.map(film=>film.youtubeId)).size,all.films.length)
  assert.deepEqual(atlasYears(id),['2026','2025'])
  const profile=atlasTerrainProfile(id)
  assert.equal(profile.locations.filter(point => getAtlasMaterials(point.id,'2026').films.length).length,0,'Country-level 2026 evidence must not become summit visits')
}
assert.equal(getAtlasMaterials('lomnica','2025').films.length,0,'A publication year is not an expedition year')
assert.equal(getAtlasMaterials('lomnica','undated').films.length,1)
assert.equal(readAtlasYear('?atlas=switzerland&rok=2026'),'2026')
assert.equal(readAtlasYear('?rok=garbage'),'all')
assert.equal(readAtlasContext('?atlas=saxer-lucke&obszar=alpy'),'alpy')
assert.equal(readAtlasContext('?atlas=koscielec&obszar=poland'),'poland')
assert.equal(readAtlasContext('?atlas=rabat&obszar=switzerland'),null)
assert.equal(readAtlasContext('?atlas=saxer-lucke&obszar=unknown'),null)
assert.equal(atlasHref('saxer-lucke','2025','alpy'),'/mapa?atlas=saxer-lucke&rok=2025&obszar=alpy')
for (const region of ['szwajcaria','alpy']) {
  assert.equal(filterFilms(region,'').length,8)
  assert.deepEqual(filterCollections(galleryData,{place:region,year:'2026'}).map(g=>g.id),['alpy-2026'])
  assert.equal(filterCollections(galleryData,{place:region,year:'wszystkie'}).length,2)
}
assert(searchSite('Szwajcaria 2026').some(result=>result.href==='/galerie/alpy-2026'))
assert(searchSite('Szwajcaria 2026').some(result=>result.id==='film:l3KltGrKz2U'))
for(const id of ['poland','slovakia']) {
  const country=getAtlasMaterials(id)
  for(const point of atlasTerrainProfile(id).locations) {
    const material=getAtlasMaterials(point.id)
    assert(material.films.every(film=>country.films.some(item=>item.youtubeId===film.youtubeId)),`${id}: includes films of ${point.id}`)
    assert(material.galleries.every(gallery=>country.galleries.some(item=>item.id===gallery.id)),`${id}: includes galleries of ${point.id}`)
  }
}
for (const node of atlasContentNodes.filter(node=>node.kind==='Kraj')) {
  assert.equal(node.view,'terrain')
  const profile=atlasTerrainProfile(node.id)
  assert.equal(profile.id,node.id)
  assert(profile.overview.length>=2)
  for(const size of [{width:274,height:430},{width:342,height:430},{width:800,height:520}]) {
    const view=fitTerrain(profile.overview,size)
    for(const point of profile.overview) {
      const screen=terrainScreen(point,view,size)
      assert(screen.x>=43&&screen.x<=size.width-43&&screen.y>=43&&screen.y<=size.height-43,`${node.id}: full country at ${size.width}px`)
    }
    const tiles=visibleTerrainTiles(view,size)
    assert(tiles.length<30,'Only visible tiles, including low-zoom country views')
  }
}
assert.equal(atlasNodeById.world.view,'world')
assert.equal(atlasNodeById.europe.view,'europe')
assert.equal(atlasNodeById.africa.view,'africa')
assert.equal(atlasNodeById.tatry.view,'tatry')
assert.equal(atlasTerrainProfile('toubkal').id,'morocco-atlas')
assert.equal(atlasTerrainProfile('rabat').id,'morocco')
assert.equal(atlasTerrainProfile('fronalpstock').id,'switzerland')
assert.equal(atlasTerrainProfile('koscielec'),null,'Default Tatra links retain accepted explorer')
console.log('PASS: country/area profiles, all-year and per-year materials, no invented 2026 pins, cross-area deep links, shared collection filters and full country coverage at 3 widths.')
