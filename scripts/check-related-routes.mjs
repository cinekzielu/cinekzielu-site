import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { summits } from '../src/data/summits.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { similarRoutes, summitRoutes, routeSeason, routeSummits, compareLink, summitCompareLink, summitDayScopes } from '../src/data/relatedRoutes.js'
import { readRouteAtlas } from '../src/data/routeAtlas.js'

const baseline = JSON.stringify({catalog, summits})
for (const row of catalog) {
  const suggestions = similarRoutes(row.id)
  assert.equal(suggestions.length, 3)
  assert.equal(new Set(suggestions.map(s=>s.row.id)).size, 3)
  assert(suggestions.every(s=>s.row.id!==row.id && s.reasons.length && Number.isFinite(s.score)))
  assert.deepEqual(suggestions, similarRoutes(row.id), 'Stable ranking')
  for(const suggestion of suggestions) {
    const state = readRouteAtlas(new URL(compareLink(row.id,suggestion.row.id),'https://example.com').search)
    assert.deepEqual(state.compare,[row.id,suggestion.row.id])
    assert.deepEqual(state.compareDays,['all','all'])
  }
}
assert.deepEqual(similarRoutes('unknown'), [])
assert.deepEqual(similarRoutes('toubkal-podejscie-2025'),similarRoutes('toubkal-2025'))
assert.equal(routeSeason('baranie-rogi-lato-2026'),'lato')
assert.equal(routeSeason('baranie-rogi-zima-2025'),'zima')
assert.equal(routeSeason('toubkal-2025'),null)
assert.equal(routeSeason('wysoka-2025'),null, 'No guessed year/season relationship to undated film')
assert.deepEqual(summitRoutes('baranie-rogi').map(r=>r.id),['baranie-rogi-lato-2026','baranie-rogi-zima-2025'])
assert.deepEqual(summitRoutes('baranie-rogi',{season:'zima'}).map(r=>r.id),['baranie-rogi-zima-2025'])
assert.equal(summitRoutes('baranie-rogi',{year:'2024'}).length,0)
assert.equal(summitRoutes('matterhorn').length,0)
assert.equal(summitRoutes('walentkowy-wierch').length,0,'A shared trip alone does not prove a GPX summit link')
assert.equal(summitRoutes('turbacz')[0].id,'turbacz-2026')
assert.equal(summitRoutes('wysoka',{year:'unknown'}).length,0)
for(const summit of summits) for(const row of summitRoutes(summit.id)) assert(routeSummits(row.id).some(p=>p.id===summit.id))
for(const [id,peaks] of Object.entries(summitDayScopes)) {
  const track=JSON.parse(await readFile(new URL(`../src/data/tracks/${id}.json`,import.meta.url)))
  for(const [peak,day] of Object.entries(peaks)) assert(track.days.find(d=>d.id===day)?.peakIds.includes(peak))
}
const summerWinter=readRouteAtlas(new URL(summitCompareLink('baranie-rogi','baranie-rogi-lato-2026','baranie-rogi-zima-2025'),'https://example.com').search)
assert.deepEqual(summerWinter.compareDays,['1','all'])
assert.equal(JSON.stringify({catalog,summits}),baseline,'Source data unchanged')
console.log(`PASS: ${catalog.length} deterministic suggestions, explicit summit/season links, day-aware comparison, filters, unknowns and unchanged source registers.`)
