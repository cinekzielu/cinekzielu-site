import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { getTatryDestination, readTatryFilters, tatryHref } from '../src/data/tatryDestination.js'
import { tripSeasons, filmYears, filmSeasons } from '../src/data/materialContext.js'
import { siteSearchIndex, searchSite } from '../src/data/siteSearch.js'
import { sitePages } from '../src/data/siteMetadata.js'
import { resolveFilmLink } from '../src/data/videoPlayer.js'

const all = getTatryDestination()
assert.equal(all.trips.length,14)
assert.equal(all.photoCount,120)
assert.equal(all.tracks.length,28)
assert.equal(all.films.length,16)
assert.equal(all.peaks.length,21)
assert(all.galleries.every(g => !['video-frames','trip-photos'].includes(g.mediaKind)))
assert(all.photos.every(p => all.galleries.some(g => g.photos.some(photo => photo.full === p.full))))
assert.deepEqual(tripSeasons(undefined),[])
assert.deepEqual(readTatryFilters('?rok=1900&sezon=jesien'),{year:'all',season:'all'})
assert.deepEqual(readTatryFilters(tatryHref({year:'2025',season:'zima'}).split('?')[1]),{year:'2025',season:'zima'})
for (const season of ['lato','zima']) {
  const selected = getTatryDestination({year:'2025',season})
  assert(selected.trips.every(t => String(t.year)==='2025' && tripSeasons(t.id).includes(season)))
  assert(selected.films.every(f => filmYears(f).includes('2025') && filmSeasons(f).includes(season)))
  assert(selected.tracks.every(r => r.sortDate.startsWith('2025') && tripSeasons(r.trip).includes(season)))
  assert(selected.peaks.every(p => p.ascents.every(a => a.year==='2025' && a.season===season)))
}
const old = getTatryDestination({year:'2024'})
assert.equal(old.tracks.length,8)
assert.equal(old.trips.length,0)
assert.equal(old.photos.length,0)
assert.equal(getTatryDestination({year:'2024',season:'zima'}).tracks.length,0)
const undated = getTatryDestination({year:'unknown',season:'zima'})
assert.equal(undated.films.length,2)
assert.equal(undated.peaks.length,2)
assert.equal(undated.tracks.length,0)
assert(!all.peaks.some(p=>p.id==='matterhorn'))

const winter = searchSite('Baranie zima 2025')
assert(winter.some(i=>i.id==='expedition:baranie-rogi-zima-2025'))
assert(!winter.some(i=>i.id.includes('lato-2026')))
const summer = searchSite('Baranie lato 2026').find(i=>i.id==='expedition:baranie-rogi-lodowy-szczyt-2026')
assert(summer.actions.some(a=>a.href==='/galerie/baranie-rogi-lodowy-szczyt-2026'))
assert(summer.actions.some(a=>a.href==='/trasy?trasa=baranie-rogi-lato-2026'))
assert(winter.find(i=>i.kind==='expedition').actions.some(a=>a.href==='/wyprawy/baranie-rogi-zima-2025#kadry'))
const szatan = siteSearchIndex.find(i=>i.id==='film:sRjEFylb_b8')
assert(szatan.badges.includes('Rok nieustalony'))
assert(szatan.badges.includes('Zima'))
assert(!szatan.badges.includes('2025'))
assert(siteSearchIndex.find(i=>i.id==='route:szatan-2025').badges.includes('Sezon nieopisany'))
const paths = new Set(sitePages.map(p=>p.path))
for (const item of siteSearchIndex) for (const action of item.actions) {
  assert(!action.href.includes('undefined') && !action.href.includes('/null'))
  assert(action.href.startsWith('/') ? paths.has(new URL(action.href,'https://example.test').pathname) : resolveFilmLink(action.href))
}
assert(searchSite('Tatry').some(i=>i.href==='/kierunki/tatry'))
const html=await readFile(new URL('../dist/kierunki/tatry.html',import.meta.url),'utf8')
assert(html.includes('https://www.cinekzielu.pl/kierunki/tatry'))
assert(html.includes('Zdobyte szczyty') && html.includes('Trasy GPX'))
console.log('PASS: Tatry year/season isolation, photographs vs frames, undated visits, GPX-only years, search context and direct material links.')
