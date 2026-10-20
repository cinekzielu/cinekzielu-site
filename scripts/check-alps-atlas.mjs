import assert from 'node:assert/strict'
import { alpsStory } from '../src/data/alpsStory.js'
import { alpsPlaces, alpsCountryIds } from '../src/data/alpsPlaces.js'
import { atlasNodeById, getAtlasMaterials, atlasListNodes, readAtlasYear } from '../src/data/atlasContent.js'
import { atlasTerrainProfile, readAtlasContext } from '../src/data/atlasTerrain.js'
import { countryPlaceIds } from '../src/data/placeGeography.js'
import { europeAtlasNodes } from '../src/data/europeAtlasData.js'
import { galleryData } from '../src/data/galleryData.js'
import { filterCollections } from '../src/data/collectionFilters.js'
import { searchSite } from '../src/data/siteSearch.js'

const expected = [
  ['triglav', 'slovenia', 18.33, 2035, '08:13:27'],
  ['grossglockner', 'austria', 20.16, 1878, '08:09:41'],
  ['dufourspitze', 'switzerland', 50.26, 4127, '24:24:59'],
  ['grauspitz', 'liechtenstein', 17.21, 1410, '04:44:25'],
  ['zugspitze', 'germany', 14.02, 1935, '06:02:39'],
]
assert.equal(alpsCountryIds.length, 5)
assert.equal(alpsPlaces.length, 5)
for (const [id, country, distance, ascent, movingTime] of expected) {
  const node = atlasNodeById[id], chapter = alpsStory.find(item => item.id === id)
  assert.equal(node.parent, country)
  assert.equal(node.altitude, `${chapter.altitude} m`)
  assert.deepEqual([node.visit.distance, node.visit.ascent, node.visit.movingTime], [distance, ascent, movingTime])
  assert.equal(node.visit.href, `/wyprawy/alpy-2026#alpy-${id}`)
  assert.equal(node.coordinateSource, `https://www.openstreetmap.org/node/${chapter.osmNode}`)
  assert.deepEqual([node.lat, node.lng], [chapter.lat, chapter.lng])
  assert(countryPlaceIds[country].includes(id))
  assert.equal(atlasTerrainProfile(id).id, country)
  assert.equal(europeAtlasNodes.find(item => item.id === country).status, 'visited')
  assert.equal(readAtlasContext(`?atlas=${id}&obszar=alpy&rok=2026`), 'alpy')
  assert.equal(readAtlasYear(`?atlas=${id}&obszar=alpy&rok=2026`), '2026')
  assert.equal(getAtlasMaterials(id, '2025').galleries.length, 0)
  const current = getAtlasMaterials(id, '2026')
  assert.deepEqual(current.galleries.map(item => item.id), ['alpy-2026'])
  assert.equal(current.photoCount, 48, 'Whole-trip gallery counted once')
  assert.equal(current.films.length, 0, 'No invented released summit episode')
  assert.equal(getAtlasMaterials(country, '2026').films[0].youtubeId, 'l3KltGrKz2U')
  assert.equal(getAtlasMaterials(country, '2026').photoCount, 48)
  assert(searchSite(`${node.name} 2026`).some(item => item.id === `place:${id}`))
  assert(searchSite(node.name).some(item => item.id === 'expedition:alpy-2026'))
}
assert.match(atlasNodeById.dufourspitze.visit.note, /trzydniowy/)
assert.equal(atlasTerrainProfile('alpy').locations.length, 13)
assert.equal(atlasListNodes('alpy').length, 13)
assert.equal(atlasTerrainProfile('switzerland').locations.length, 9)
for (const place of ['slowenia', 'austria', 'niemcy', 'liechtenstein']) {
  assert.deepEqual(filterCollections(galleryData, {place, year:'wszystkie'}).map(item => item.id), ['alpy-2026'])
}
for (const id of ['world', 'europe', 'alpy', ...alpsCountryIds]) {
  const data = getAtlasMaterials(id)
  assert.equal(new Set(data.galleries.map(item => item.id)).size, data.galleries.length)
}
console.log('PASS: five sourced summits/countries, activity facts and chapter links, year isolation, no duplicate materials, filters and search.')
