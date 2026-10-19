import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { getAlpsDestination, readAlpsYear } from '../src/data/alpsDestination.js'
import { sitePages } from '../src/data/siteMetadata.js'
import { searchSite } from '../src/data/siteSearch.js'

const all = getAlpsDestination(), old = getAlpsDestination('2025'), recent = getAlpsDestination('2026')
assert.deepEqual(all.trips.map(t => t.id).sort(), ['alpy-2026', 'szwajcaria-2025'])
assert.equal(all.photoCount, 84)
assert.equal(all.films.length, 8)
assert.equal(all.tracks.length, 11)
assert.equal(all.peaks.length, 8)
for (const [year, data] of [['2025', old], ['2026', recent]]) {
  const ids = new Set(data.trips.map(t => t.id))
  assert(data.trips.every(t => String(t.year) === year))
  assert(data.films.every(f => ids.has(f.expeditionId)))
  assert(data.tracks.every(t => t.region === 'Alpy' && t.sortDate.startsWith(year)))
  assert(data.peaks.every(p => p.ascents.every(a => ids.has(a.tripId))))
  assert(data.photos.every(p => data.trips.some(t => t.gallery.photos.some(g => g.full === p.full))))
  assert.equal(new Set(data.photos.map(p => p.full)).size, data.photos.length)
}
assert.equal(old.photoCount + recent.photoCount, all.photoCount)
assert.equal(old.tracks.length + recent.tracks.length, all.tracks.length)
assert(!all.peaks.some(p => p.id === 'matterhorn'), 'Planned objectives must not become climbed summits')
assert.equal(readAlpsYear('?rok=2025'), '2025')
for (const query of ['', '?rok=1900', '?rok=all', '?rok=2025<script>']) assert.equal(readAlpsYear(query), 'all')
assert(sitePages.some(p => p.path === '/kierunki/alpy'))
assert(searchSite('alpy').some(p => p.href === '/kierunki/alpy'))
const html = await readFile(new URL('../dist/kierunki/alpy.html', import.meta.url), 'utf8')
assert(html.includes('Across the Alps'))
assert(html.includes('/trasy?pasmo=Alpy'))
assert(html.includes('/filmy?miejsce=alpy'))
assert(html.includes('https://www.cinekzielu.pl/kierunki/alpy'))
console.log('Alps: year isolation, verified source links, counts, search and prerender passed.')
