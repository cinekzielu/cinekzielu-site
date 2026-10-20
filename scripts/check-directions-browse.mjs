import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { destinations, getDestination, destinationHref } from '../src/data/destinations.js'
import { sitePages } from '../src/data/siteMetadata.js'
import { searchSite } from '../src/data/siteSearch.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { safeBrowseUrl, browseLabel } from '../src/browseMemory.js'

assert.equal(destinations.length, 6)
assert(!destinations.some(item => item.id === 'rumunia'))
for (const item of destinations) {
  const data = getDestination(item.id)
  assert(data.trips.length && data.cover.src)
  assert(sitePages.some(page => page.path === destinationHref(item)))
  assert(searchSite(item.name).some(result => result.href === destinationHref(item)))
  assert.equal(new Set(data.films.map(film => film.youtubeId)).size, data.films.length)
  assert(data.tracks.every(row => tripRoutes[row.id]))
  assert(data.galleries.every(trip => !['video-frames','trip-photos'].includes(trip.gallery.mediaKind)))
  const html = await readFile(new URL(`../dist/kierunki/${item.id}.html`, import.meta.url),'utf8')
  assert(html.includes('<h1'))
  assert(!html.includes('← Wróć do'), 'Private return context must not enter public HTML')
}
assert.deepEqual(getDestination('maroko').tracks.map(row => row.id), ['toubkal-2025'])
assert.equal(getDestination('maroko').galleries.length, 0)
assert.equal(getDestination('maroko').coverKind, 'Kadr z filmu')
assert.equal(getDestination('wlochy').films.length, 0)
const swiss = getDestination('szwajcaria')
assert(swiss.tracks.some(row => row.id === 'dufourspitze'))
assert(!swiss.tracks.some(row => ['triglav','grossglockner','zugspitze','grauspitz'].includes(row.id)))
assert.equal(getDestination('unknown'), null)
const origin = 'https://www.cinekzielu.pl'
assert.equal(safeBrowseUrl('/wyprawy?widok=os&rok=2025#podroze-2025', origin), '/wyprawy?widok=os&rok=2025#podroze-2025')
for (const url of ['https://evil.example/path','//evil.example/path','javascript:alert(1)','data:text/html,test']) assert.equal(safeBrowseUrl(url, origin), null)
assert.equal(browseLabel('/wyprawy?widok=os#podroze-2026'), 'osi podróży')
assert.equal(browseLabel('/trasy?trasa=dufourspitze#profil'), 'tras')
assert.equal(browseLabel('/galerie?rok=2025'), 'galerii')
console.log('Directions OK: six destinations, country-specific GPX, existing films and photography separation; same-origin return URLs and labels.')
