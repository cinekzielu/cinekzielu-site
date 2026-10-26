import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { summits } from '../src/data/summits.js'
import { summitPages, findSummitPage, summitPageHref, summitPageMapHref, summitPageListHref, readSummitPageYear, getSummitPageContent } from '../src/data/summitPages.js'
import { summitRoutes } from '../src/data/relatedRoutes.js'

assert.deepEqual(summitPages.map(page => page.id), ['gerlach', 'baranie-rogi', 'dufourspitze'])
for (const page of summitPages) {
  assert.equal(page.summit, summits.find(summit => summit.id === page.id))
  assert.equal(summitPageHref(page.id), page.path)
  assert(page.coverLabel)
  assert(existsSync(`public${page.cover.src}`), page.cover.src)
  const content = getSummitPageContent(page.id)
  assert.deepEqual(content.routes, summitRoutes(page.id))
  assert.deepEqual(new Set(content.ascents.map(ascent => ascent.evidence)), new Set(page.summit.ascents.map(ascent => ascent.evidence)))
  for (const year of ['2024', '2025', '2026']) {
    const filtered = getSummitPageContent(page.id, year)
    assert(filtered.ascents.every(ascent => ascent.year === year))
    assert(filtered.trips.every(trip => String(trip.year) === year))
    assert(filtered.routes.every(route => route.sortDate.startsWith(year)))
    for (const film of filtered.films) assert(filtered.ascents.some(ascent => ascent.filmIds.includes(film.youtubeId)))
    assert.equal(new URL(summitPageMapHref(page.id, year), 'https://example.test').searchParams.get('rok'), year)
    assert.equal(new URL(summitPageListHref(page.id, year), 'https://example.test').hash, filtered.ascents.length ? `#szczyt-${page.id}` : '')
  }
}
assert.equal(findSummitPage('not-a-summit'), undefined)
assert.equal(summitPageHref('not-a-summit'), null)
assert.equal(getSummitPageContent('not-a-summit'), null)
assert.equal(readSummitPageYear('?rok=2025'), '2025')
assert.equal(readSummitPageYear('?rok=1999'), 'all')
assert.equal(readSummitPageYear('?rok=unknown'), 'unknown')
assert.equal(readSummitPageYear('?rok=undated'), 'unknown')
assert.equal(summitPageHref('gerlach', 'undated'), '/szczyty/gerlach?rok=unknown')
assert.equal(summitPageHref('gerlach', 'bad'), '/szczyty/gerlach')
assert.equal(summitPageMapHref('gerlach', 'unknown'), '/mapa?atlas=gerlach&rok=undated')
const olderDufour = getSummitPageContent('dufourspitze', '2025')
assert.equal(olderDufour.year, '2025')
assert.deepEqual([olderDufour.ascents.length, olderDufour.trips.length, olderDufour.films.length, olderDufour.routes.length], [0, 0, 0, 0])
const gerlach2024 = getSummitPageContent('gerlach', '2024')
assert.equal(gerlach2024.ascents[0].season, null)
assert.equal(gerlach2024.trips.length, 0)
assert.equal(gerlach2024.films.length, 0)
const dufour = getSummitPageContent('dufourspitze')
assert.equal(dufour.ascents[0].date, '18–28 sierpnia 2026')
assert.equal(dufour.trips[0].href, '/wyprawy/alpy-2026#alpy-dufourspitze')
assert.equal(dufour.films[0].format, 'Zwiastun')
assert(dufour.trips[0].scope.includes('całą wyprawę'))
console.log('Summit pages OK: 3 existing peaks, original ascent dates, scoped years/materials, safe fallback links and no new media.')
