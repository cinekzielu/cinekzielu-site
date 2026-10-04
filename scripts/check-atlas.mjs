import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { atlasContentNodes, atlasAncestry, getAtlasMaterials, readAtlasSelection, searchAtlasNodes } from '../src/data/atlasContent.js'
import { filmCatalog } from '../src/data/filmCatalog.js'

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
for (const [id, expected] of Object.entries({ world: [28, 4, 129], europe: [26, 4, 129], tatry: [16, 2, 45], switzerland: [7, 1, 36], alpy: [1, 1, 48], morocco: [2, 0, 0], konczysta: [1, 1, 24], koscielec: [2, 0, 0], 'durny-szczyt': [1, 0, 0], gerlach: [0, 0, 0] })) {
  const result = getAtlasMaterials(id)
  assert.deepEqual([result.films.length, result.galleries.length, result.photoCount], expected, id)
}
const source = await readFile(new URL('../src/assets/maps/world-continent-overlays.svg', import.meta.url))
const paths = JSON.parse(await readFile(new URL('../src/data/worldOverlayPaths.json', import.meta.url), 'utf8'))
assert.equal(paths.sourceSha256, createHash('sha256').update(source).digest('hex'), 'Regenerate world overlay paths after changing the manual SVG')
assert.equal(paths.continents.length, 6)
assert(paths.continents.every(continent => continent.paths.length > 0))
console.log(`Atlas OK: ${atlasContentNodes.length} places, verified materials, direct links, search and source SVG fingerprint.`)
