import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { atlasContentNodes, atlasNodeById, atlasAncestry, atlasListNodes, getAtlasMaterials, readAtlasSelection, searchAtlasNodes } from '../src/data/atlasContent.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { moroccoPlaces, moroccoMapPlaces, moroccoPosition, moroccoTerrainLocations, atlasFilmHref } from '../src/data/moroccoPlaces.js'
import { mercator, unproject } from '../src/data/terrainMap.js'

assert.equal(new Set(atlasContentNodes.map(node => node.id)).size, atlasContentNodes.length)
const filmIds = new Set(filmCatalog.map(film => film.youtubeId))
for (const node of atlasContentNodes) {
  const path = atlasAncestry(node.id)
  assert.equal(path[0].id, 'world', `Disconnected place: ${node.id}`)
  assert.equal(path.at(-1).id, node.id)
  assert.equal(readAtlasSelection(`?atlas=${node.id}`), node.id)
  for (const id of node.filmIds || []) assert(filmIds.has(id), `Unknown film: ${id}`)
}
assert.equal(readAtlasSelection('?atlas=unknown'), 'world')
assert.equal(readAtlasSelection('?atlas=%3Cscript%3E'), 'world')
assert.equal(searchAtlasNodes('konczysta')[0].id, 'konczysta')
assert.equal(searchAtlasNodes('murren')[0].id, 'murren-gimmelwald')
for (const [id, expected] of Object.entries({ world: [28, 15, 322], europe: [26, 14, 282], poland: [7, 5, 77], tatry: [16, 11, 182], krywan: [0, 1, 8], 'zabi-kon': [1, 1, 13], switzerland: [8, 2, 84], alpy: [8, 2, 84], morocco: [2, 1, 40], konczysta: [1, 1, 24], koscielec: [2, 1, 17], swinica: [2, 2, 29], 'baranie-rogi': [2, 2, 34], 'lodowy-szczyt': [1, 1, 14], 'durny-szczyt': [1, 0, 0], gerlach: [0, 1, 22], 'lodowa-kopa': [1, 1, 14], 'szpiglasowy-wierch': [1, 2, 36], 'huncowski-szczyt': [1, 1, 20], 'kiezmarski-szczyt': [1, 1, 20], 'walentkowy-wierch': [1, 1, 21], 'walentkowa-gran': [1, 1, 21], gorce: [0, 1, 16], turbacz: [0, 1, 16] })) {
  const result = getAtlasMaterials(id)
  assert.deepEqual([result.films.length, result.galleries.length, result.photoCount], expected, id)
}
assert.deepEqual(atlasListNodes('poland').map(node => node.id), ['jura', 'gorce'])
assert.deepEqual(atlasListNodes('gorce').map(node => node.id), ['turbacz'])
assert.deepEqual(atlasListNodes('turbacz').map(node => node.id), ['turbacz'])
assert.equal(atlasListNodes('switzerland').length, 6)
assert.deepEqual(atlasListNodes('fronalpstock'), atlasListNodes('switzerland'))
assert(atlasListNodes('tatry').some(node => node.id === 'walentkowy-wierch'))
const source = await readFile(new URL('../src/assets/maps/world-continent-overlays.svg', import.meta.url))
const paths = JSON.parse(await readFile(new URL('../src/data/worldOverlayPaths.json', import.meta.url), 'utf8'))
assert.equal(paths.sourceSha256, createHash('sha256').update(source).digest('hex'), 'Regenerate world overlay paths after changing the manual SVG')
assert.equal(paths.continents.length, 6)
assert(paths.continents.every(continent => continent.paths.length > 0))
// World -> Africa -> Morocco -> a verified place, retaining direct URLs.
assert.equal(atlasNodeById.africa.view, 'africa')
for (const id of ['morocco', 'morocco-atlas', ...moroccoPlaces.map(place => place.id)]) assert.equal(atlasNodeById[id].view, 'terrain', id)
assert.deepEqual(atlasAncestry('toubkal').map(node => node.id), ['world', 'africa', 'morocco', 'toubkal'])
assert.deepEqual(atlasListNodes('africa').map(node => node.id), ['morocco'])
assert.deepEqual(getAtlasMaterials('africa').films.map(film => film.youtubeId), getAtlasMaterials('morocco').films.map(film => film.youtubeId))
const africa = JSON.parse(await readFile(new URL('../src/data/africaMapPaths.json', import.meta.url), 'utf8'))
assert.deepEqual(africa.countries.filter(country => country.atlasId).map(country => country.atlasId), ['morocco'], 'Only confirmed African direction should be marked')
assert.equal(new Set(africa.countries.map(country => country.id)).size, africa.countries.length)
assert(africa.countries.every(country => country.paths.length && country.paths.every(path => /^M[-\d., MLZ]+$/.test(path))))
for (const coordinate of Object.values(africa.moroccoMarker)) assert(Number.isFinite(coordinate) && coordinate > 0 && coordinate < 460)
assert.equal(moroccoPlaces.length, 12)
assert.equal(moroccoMapPlaces('morocco').length, 10)
assert.deepEqual(atlasListNodes('morocco-atlas').map(node => node.id), ['imlil','refuge-du-toubkal','toubkal'])
assert.deepEqual(atlasListNodes('toubkal'), atlasListNodes('morocco-atlas'))
for (const place of moroccoPlaces) {
  assert(place.coordinateSource.startsWith('https://'))
  assert(place.lat > 30 && place.lat < 35 && place.lon > -9 && place.lon < -3)
  const position = moroccoPosition(place)
  assert(Object.values(position).every(value => value > 0 && value < 100))
  const [film] = getAtlasMaterials(place.id).films
  const duration = film.duration.split(':').reduce((sum, part) => sum*60+Number(part), 0)
  const chapter = place.chapter.time.split(':').reduce((sum, part) => sum*60+Number(part), 0)
  assert.equal(place.chapter.seconds, chapter, place.id)
  assert(chapter >= 0 && chapter < duration, place.id)
  const url = new URL(atlasFilmHref(place, film))
  assert.equal(url.searchParams.get('v'), place.chapter.videoId)
  assert.equal(url.searchParams.get('t'), `${chapter}s`)
}
assert.equal(atlasFilmHref(atlasNodeById.morocco, filmCatalog[0]), filmCatalog[0].youtubeUrl)
for (const point of moroccoTerrainLocations) {
  const restored = unproject(mercator(point))
  assert(Math.abs(restored.lat-point.lat)<1e-9 && Math.abs(restored.lng-point.lon)<1e-9)
}
const refined = JSON.parse(await readFile(new URL('../src/data/worldRefinedPaths.json', import.meta.url), 'utf8'))
const raster = await readFile(new URL('../src/assets/maps/world-atlas-dark.webp', import.meta.url))
assert.equal(refined.sourceImageSha256, createHash('sha256').update(raster).digest('hex'))
assert.equal(refined.viewBox, '0 0 1672 941')
assert.deepEqual(refined.continents.map(item => item.id).sort(), paths.continents.map(item => item.id).sort())
const inside = ([x,y], path) => {
  const points = [...path.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(match => [+match[1],+match[2]])
  let hit = false
  for (let i=0,j=points.length-1;i<points.length;j=i++) {
    const [xi,yi]=points[i], [xj,yj]=points[j]
    if ((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) hit=!hit
  }
  return hit
}
const hits = point => refined.continents.filter(continent => continent.paths.some(path => inside(point,path))).map(continent => continent.id)
for (const [id, anchors] of Object.entries({africa:[[800,450],[900,650],[1003,697]],europe:[[759,366],[901,175],[720,200]],asia:[[1200,300],[1137,500]],'north-america':[[300,350],[620,150]],'south-america':[[515,652],[469,821]],oceania:[[1390,725],[1548,838]]})) {
  for (const anchor of anchors) assert.deepEqual(hits(anchor),[id],`${id} ${anchor}`)
}
for (const ocean of [[670,500],[1100,700],[400,600],[1090,550],[1470,580],[1600,300],[1200,750]]) assert.deepEqual(hits(ocean),[],`Ocean must not activate a continent: ${ocean}`)
console.log(`Atlas OK: ${atlasContentNodes.length} places, 12 Morocco chapter links, continent land/sea hit areas, source fingerprints and verified material counts.`)
