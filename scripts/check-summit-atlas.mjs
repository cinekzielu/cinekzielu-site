import assert from 'node:assert/strict'
import { summits } from '../src/data/summits.js'
import { atlasNodeById, getAtlasMaterials, hasAtlasMaterials, atlasYears, readAtlasYear } from '../src/data/atlasContent.js'
import { atlasTerrainProfile, readAtlasContext } from '../src/data/atlasTerrain.js'
import { tatryLocationById } from '../src/data/tatryAtlas.js'
import { summitRoutes } from '../src/data/relatedRoutes.js'
import { sharedAtlasIds } from '../src/data/sharePages.js'
import { supplementalSummitPlaces } from '../src/data/supplementalSummitPlaces.js'

assert.equal(summits.length, 43)
assert.equal(supplementalSummitPlaces.length, 10)
for (const peak of summits) {
  const node = atlasNodeById[peak.id]
  assert(node && node.kind === 'Szczyt', peak.id)
  assert.equal(node.altitude, `${peak.altitude} m`)
  const location = tatryLocationById[peak.id] || atlasTerrainProfile(peak.id)?.locationById[peak.id]
  assert(location && Number.isFinite(location.lat) && Number.isFinite(location.lng), `Missing pin: ${peak.id}`)
  assert(sharedAtlasIds.includes(peak.id), `Missing share destination: ${peak.id}`)
  assert(hasAtlasMaterials(peak.id), `Hidden by materials filter: ${peak.id}`)
  const materials = getAtlasMaterials(peak.id)
  assert.deepEqual(materials.routes.map(r => r.id).sort(), summitRoutes(peak.id).map(r => r.id).sort())
  for (const ascent of peak.ascents) {
    if (ascent.tripId) assert(materials.galleries.some(g => g.id === ascent.tripId), `${peak.id}: missing trip`)
    if (ascent.routeId) assert(materials.routes.some(r => r.id === ascent.routeId))
    for (const filmId of ascent.filmIds.filter(id => id !== 'l3KltGrKz2U')) assert(materials.films.some(f => f.youtubeId === filmId))
  }
}
for (const id of ['starolesny-szczyt', 'baraniec', 'grzes', 'rakon', 'maly-lodowy-szczyt', 'slawkowski-szczyt']) {
  const m = getAtlasMaterials(id)
  assert.equal(m.films.length, 0, 'No invented film for GPX-only summit')
  assert.equal(m.galleries.length, 0, 'No invented expedition')
  const year = m.routes[0].sortDate.slice(0,4)
  assert(atlasYears(id).includes(year))
  assert.equal(readAtlasYear(`?atlas=${id}&rok=${year}`), year)
  assert(hasAtlasMaterials(id,year))
  assert(!hasAtlasMaterials(id,'2026'))
}
for (const id of ['grzes','rakon','kasprowy-wierch']) for (const country of ['poland','slovakia']) assert.equal(readAtlasContext(`?atlas=${id}&obszar=${country}`),country)
for (const scope of ['switzerland','alpy']) assert(atlasTerrainProfile(scope).locationById.klingenstock)
for (const scope of ['poland','gorce']) assert(atlasTerrainProfile(scope).locationById.turbacz)
assert.equal(getAtlasMaterials('klingenstock').films[0].youtubeId,'KuZoxTnOmLs')
assert.equal(getAtlasMaterials('kasprowy-wierch').routes[0].id,'swinica-2025')
for (const id of ['dufourspitze','zugspitze','triglav','grossglockner','grauspitz']) assert(getAtlasMaterials('alpy','2026').routes.some(r => r.id === id))
assert(getAtlasMaterials('morocco-atlas').routes.some(r => r.id === 'toubkal-2025'))
assert(!getAtlasMaterials('matterhorn').routes.length)
assert(!getAtlasMaterials('wysoka','2025').films.length, 'GPX does not date the winter film')
console.log('PASS: all 43 summit pins, existing materials, GPS-only visibility/year filters, border/country/Alps context and no invented ascents.')
