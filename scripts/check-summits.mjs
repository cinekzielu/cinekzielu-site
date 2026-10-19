import assert from 'node:assert/strict'
import { summits, filterSummits, defaultSummitFilters as defaults, readSummitFilters, summitFiltersHref, ascentFilms, ascentDateBounds } from '../src/data/summits.js'
import { atlasNodeById } from '../src/data/atlasContent.js'
import { sitePages } from '../src/data/siteMetadata.js'
import { resolveFilmLink } from '../src/data/videoPlayer.js'

const paths = new Set(sitePages.map(page => page.path))
const select = patch => filterSummits({ ...defaults, ...patch })
assert(paths.has('/szczyty'))
assert.equal(summits.length, 39)
assert.equal(new Set(summits.map(peak => peak.id)).size, summits.length)
for (const peak of summits) {
  if (!peak.mapHref?.startsWith('/trasy?')) assert.equal(atlasNodeById[peak.id]?.kind, 'Szczyt', peak.id)
  assert(Number.isInteger(peak.altitude) && peak.altitude > 1000 && peak.altitude < 5000, peak.id)
  assert(peak.altitudeSource?.startsWith('https://'), peak.id)
  assert(peak.ascents.length)
  assert.equal(new Set(peak.ascents.map(ascent => ascent.evidence)).size, peak.ascents.length)
  for (const ascent of peak.ascents) {
    assert(ascent.evidence)
    assert([null, 'lato', 'zima'].includes(ascent.season))
    assert.equal(ascent.year, ascent.orderDate?.slice(0, 4) || null)
    if (ascent.year == null) assert.equal(ascent.date, 'Rok nieustalony')
    for (const href of [ascent.tripHref, ascent.mediaHref].filter(Boolean)) assert(paths.has(new URL(href, 'http://localhost').pathname), href)
    for (const film of ascentFilms(ascent)) assert(film && resolveFilmLink(film.youtubeUrl)?.film.youtubeId === film.youtubeId)
  }
}
// Do not turn a nearby landmark, viewpoint or ridge into a claimed ascent.
for (const id of ['etna', 'matterhorn', 'saxer-lucke', 'liptowskie-mury', 'giewont']) assert(!summits.some(peak => peak.id === id))
const heights = select({}).map(peak => peak.altitude)
assert.deepEqual(heights, [...heights].sort((a, b) => b - a))
assert.equal(select({})[0].id, 'dufourspitze')
assert.equal(select({ sort: 'latest' })[0].id, 'zabi-kon')
assert.equal(select({ sort: 'latest' }).at(-1).id, 'szatan')
assert.equal(select({ query: 'Baranie', year: '2025', season: 'lato' }).length, 0)
assert.equal(select({ query: 'Baranie', year: '2026', season: 'zima' }).length, 0)
assert.deepEqual(select({ query: 'Baranie', season: 'zima' })[0].ascents.map(ascent => ascent.filmIds), [['0AtU5c83Y0M']])
assert.deepEqual(select({ query: 'Baranie', season: 'lato' })[0].ascents.map(ascent => ascent.filmIds), [['85Up2O2uc50']])
assert.equal(select({ query: 'Wysoka', year: '2026', season: 'zima' }).length, 0)
assert.equal(select({ query: 'Wysoka', year: '2026' })[0].ascents[0].filmIds.length, 0)
assert.equal(select({ year: 'unknown' }).length, 2)
assert.deepEqual(select({ query: 'Swinica' }), select({ query: 'Świnica' }))
assert.equal(select({ query: 'qwerty-no-peak' }).length, 0)
assert.equal(select({ range: 'Alpy', season: 'zima' }).length, 0)
assert.equal(select({ range: 'Gorce' })[0].id, 'turbacz')
const selection = { query: 'Pośrednia Grań', range: 'Tatry', year: '2025', season: 'lato', sort: 'latest' }
assert.deepEqual(readSummitFilters(new URL(summitFiltersHref(selection), 'http://localhost').search), selection)
assert.deepEqual(readSummitFilters('?pasmo=nope&rok=1991&sezon=nope&sort=nope'), defaults)
assert.equal(readSummitFilters('?q=' + 'a'.repeat(150)).query.length, 100)
assert.deepEqual(ascentDateBounds({ orderDate: '2026-08' }), [Date.UTC(2026, 7, 1), Date.UTC(2026, 7, 31)])
assert.deepEqual(ascentDateBounds({ orderDate: '2025' }), [Date.UTC(2025, 0, 1), Date.UTC(2025, 11, 31)])
assert.equal(ascentDateBounds({ orderDate: null }), null)
console.log(`Summits OK: ${summits.length} peaks, ${summits.reduce((count, peak) => count + peak.ascents.length, 0)} ascent records; filters, chronology, evidence and material links.`)
