import assert from 'node:assert/strict'
import { plannedSummits, showPlannedSummit } from '../src/data/plannedSummits.js'
import { summits } from '../src/data/summits.js'
import { atlasNodeById, getAtlasMaterials, readAtlasYear } from '../src/data/atlasContent.js'
import { atlasTerrainProfile, readAtlasContext } from '../src/data/atlasTerrain.js'
import { searchSite } from '../src/data/siteSearch.js'
import { sharePages } from '../src/data/sharePages.js'

assert.equal(summits.length,43)
assert.equal(summits.flatMap(peak => peak.ascents).length,50)
for (const peak of plannedSummits) {
  assert(!summits.some(done => done.id === peak.id),'A goal is not a completed ascent')
  assert.equal(atlasNodeById[peak.id].status,'planned')
  assert(!peak.visit && !peak.ascents && !peak.filmIds && !peak.year)
  assert.deepEqual(getAtlasMaterials(peak.id),{films:[],galleries:[],routes:[],photoCount:0})
  assert(showPlannedSummit(peak.id)); assert(!showPlannedSummit(peak.id,'2026'))
  assert.equal(readAtlasYear(`?atlas=${peak.id}&rok=2026`),'all')
  for (const scope of [...peak.countryIds,'alpy']) {
    assert.equal(atlasTerrainProfile(scope).locations.filter(p => p.id === peak.id).length,1)
    assert.equal(readAtlasContext(`?atlas=${peak.id}&obszar=${scope}`),scope)
  }
  const result=searchSite(peak.name).find(row=>row.id===`planned:${peak.id}`)
  assert(result?.subtitle.startsWith('W planach'))
  const share=sharePages.find(page=>page.atlasId===peak.id)
  assert(share.title.includes('w planach'))
}
assert.equal(plannedSummits[0].elevation,4478)
assert.equal(plannedSummits[0].coordinateRecord,149915)
console.log('PASS: goals isolated from 43 summits/50 ascents and media; country/region pins, year filters, search and share status.')
