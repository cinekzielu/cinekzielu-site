import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { readRouteAtlas, routeHref } from '../src/data/routeAtlas.js'
import { routeLink } from '../src/data/relatedRoutes.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { summits } from '../src/data/summits.js'
import { atlasContentNodes, atlasNodeById, getAtlasMaterials, hasAtlasMaterials, atlasYears, readAtlasYear } from '../src/data/atlasContent.js'
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

// Follow atlas associations through the real route parser and expedition targets.
// A valid catalogue alone does not prove atlas/year associations select that route.
let scopes = 0, links = 0
const uniqueRoutes = new Set(), expeditionTargets = new Map()
for (const node of atlasContentNodes) for (const year of ['all', ...atlasYears(node.id)]) {
  const { routes } = getAtlasMaterials(node.id, year)
  assert.equal(new Set(routes.map(row => row.id)).size, routes.length, `${node.id}/${year}: duplicate route`)
  scopes++
  for (const row of routes) {
    const context = `${node.id}/${year}/${row.id}`
    const url = new URL(routeLink(row.id), 'https://example.test')
    assert.equal(url.pathname, '/trasy', context)
    assert.equal(url.hash, '#profil', context)
    assert.equal(readRouteAtlas(url.search).selected, row.id, context)
    if (year !== 'all') {
      assert.equal(row.sortDate.slice(0, 4), year, context)
      url.searchParams.set('rok', year)
      const filtered = readRouteAtlas(url.search)
      assert.equal(filtered.year, year, context)
      assert.equal(filtered.selected, row.id, context)
    }
    const route = tripRoutes[row.id]
    assert(route && row.title === route.title && row.dates === route.dates, context)
    const destination = new URL(routeHref(row, route), 'https://example.test')
    if (row.trip) {
      if (!expeditionTargets.has(destination.pathname)) expeditionTargets.set(destination.pathname,
        await readFile(new URL(`../dist${destination.pathname}.html`, import.meta.url), 'utf8'))
      assert(destination.hash, context)
      assert(expeditionTargets.get(destination.pathname).includes(`id="${decodeURIComponent(destination.hash.slice(1))}"`), context)
    } else {
      assert.equal(destination.hash, '#profil', context)
      assert.equal(readRouteAtlas(destination.search).selected, row.id, context)
    }
    uniqueRoutes.add(row.id); links++
  }
}
console.log(`PASS: ${scopes} atlas place/year scopes, ${links} GPX associations, ${uniqueRoutes.size} unique routes and ${expeditionTargets.size} built expedition targets. Parser/HTML checks, not browser navigation.`)

for (const [place, route] of [['saxer-lucke','saxer-lucke-2025'],['murren-gimmelwald','murren-2025'],['zermatt','zermatt-2025']]) {
  assert.deepEqual(getAtlasMaterials(place, '2025').routes.map(row => row.id), [route])
  assert.equal(getAtlasMaterials(place, '2026').routes.length, 0)
  for (const scope of ['switzerland','alpy','europe','world']) assert(getAtlasMaterials(scope, '2025').routes.some(row => row.id === route), `${scope}/${route}`)
  assert.equal(summitRoutes(place).length, 0, 'Place link must not invent a summit ascent')
}
assert(!getAtlasMaterials('lodowy-szczyt').routes.some(row => row.id === 'lodowy-proba-2024'))
console.log('PASS: three explicit Swiss place routes, year and ancestor scopes, no invented summit ascents.')
