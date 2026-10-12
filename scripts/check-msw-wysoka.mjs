import assert from 'node:assert/strict'
import { galleryData, photoGalleries } from '../src/data/galleryData.js'
import { findExpeditionPage } from '../src/data/expeditionPages.js'
import { getAtlasMaterials } from '../src/data/atlasContent.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { galleryHref } from '../src/data/galleryNavigation.js'
import { searchSite } from '../src/data/siteSearch.js'

const msw = findExpeditionPage('mieguszowiecki-posrednia-gran-2025')
const summer = findExpeditionPage('wysoka-ganek-rysy-2026')
assert.equal(msw.sortDate, '2025-07-05')
assert.equal(summer.sortDate, '2026-08-09')
assert.equal(msw.gallery.photos.length, 28)
assert.equal(summer.gallery.photos.length, 22)
assert.deepEqual(msw.gallery.films.map(f => f.id), ['PWbLPcNAh34', '04seL_yl4f0'])
for (const film of msw.gallery.films) assert.equal(filmCatalog.find(f => f.youtubeId === film.id).expeditionId, msw.id)
assert.deepEqual(summer.gallery.films, [], 'The winter Wysoka film is a different trip')
assert.notEqual(filmCatalog.find(f => f.youtubeId === 'jTsfNdsWHxg').expeditionId, summer.id)
for (const trip of [msw, summer]) {
  assert(galleryData.includes(trip.gallery))
  assert(!photoGalleries.includes(trip.gallery), 'Documentary material stays outside photography galleries')
  assert(galleryHref(trip.gallery).startsWith('/wyprawy/' + trip.id + '#'))
  assert(searchSite(trip.title).some(result => result.id === 'expedition:' + trip.id))
  for (const place of trip.gallery.mapPlaces) {
    assert(getAtlasMaterials(place.id, String(trip.year)).galleries.some(g => g.id === trip.id), place.id)
    assert(!getAtlasMaterials(place.id, String(trip.year === 2025 ? 2026 : 2025)).galleries.some(g => g.id === trip.id), 'Year isolation: ' + place.id)
  }
}
assert.equal(getAtlasMaterials('wysoka', '2026').films.length, 0)
assert(getAtlasMaterials('wysoka').films.some(f => f.youtubeId === 'jTsfNdsWHxg'))
console.log('PASS: two trips, five existing summit links, separate years, two verified July films, no summer/winter video mix or documentary photos in photography galleries.')
