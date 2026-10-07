import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { galleryData } from '../src/data/galleryData.js'
import { galleryCollectionCount, galleryItemCount, galleryMediaLabel } from '../src/data/galleryNavigation.js'
import { getAtlasMaterials } from '../src/data/atlasContent.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { expeditionPages } from '../src/data/expeditionPages.js'
import { collectionOptions, filterCollections } from '../src/data/collectionFilters.js'
import { searchSite } from '../src/data/siteSearch.js'
import { sitePages } from '../src/data/siteMetadata.js'

const gallery = galleryData.find(item => item.id === 'maroko-2025')
assert.equal(gallery.mediaKind, 'video-frames')
assert.equal(gallery.sourceLabel, 'DJI')
assert.equal(gallery.photos.length, 40)
assert.equal(galleryItemCount(gallery), '40 kadrów')
assert.equal(galleryCollectionCount(galleryData), '220 zdjęć · 102 kadry')
assert.equal(galleryMediaLabel([gallery]), 'Kadry')
assert.equal(galleryMediaLabel(galleryData), 'Zdjęcia i kadry')
assert.equal(galleryData.filter(item => item.mediaKind !== 'video-frames').length, 11)
assert.equal(galleryData.slice(0, 3).some(item => item.id === gallery.id), false, 'Keep the approved homepage selection')
assert.equal(expeditionPages.filter(trip => trip.id === gallery.id).length, 1)
assert.deepEqual(gallery.films.map(film => film.id), ['McawfrouM_0', 'BiWk6apjJOg'])
for (const link of gallery.films) assert.equal(filmCatalog.find(film => film.youtubeId === link.id).expeditionId, gallery.id)
for (const id of ['africa', 'morocco']) {
  const material = getAtlasMaterials(id, '2025')
  assert.deepEqual(material.galleries.map(item => item.id), [gallery.id])
  assert.equal(material.films.length, 2)
  assert.equal(material.photoCount, 40)
}
assert.equal(getAtlasMaterials('morocco', '2026').photoCount, 0)
assert(collectionOptions(galleryData).places.some(place => place.id === 'maroko'))
assert.deepEqual(filterCollections(galleryData, {place:'maroko', year:'2025'}).map(item => item.id), [gallery.id])
assert(searchSite('DJI').some(item => item.id === 'expedition:maroko-2025'))
for (const path of ['/wyprawy/maroko-2025']) {
  const metadata = sitePages.find(page => page.path === path)
  assert(metadata.description.includes('kadr'))
  assert.equal(metadata.image.src, '/share/maroko-2025.jpg')
}
assert.equal(sitePages.length, 33)
const hashes = new Set()
for (const photo of gallery.photos) {
  assert.equal(photo.width / photo.height, 16 / 9)
  for (const key of ['src', 'full', 'mobileSrc']) {
    const url = new URL('../public' + photo[key], import.meta.url)
    const bytes = await readFile(url)
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP')
    assert(bytes.length > 1000 && bytes.length < 1500000)
    if (key === 'full') hashes.add(createHash('sha256').update(bytes).digest('hex'))
  }
}
assert.equal(hashes.size, gallery.photos.length, 'No duplicated exported frames')
assert.equal((await stat(new URL('../public/share/maroko-2025.jpg', import.meta.url))).size, 113390)
assert(!/"[A-Z]:|DJI_[0-9]|[.]MP4|native-4k|private[/]/i.test(JSON.stringify(gallery)), 'Keep private source paths out of public data')
console.log('PASS: Morocco 40 unique DJI frames, responsive exports, two film links, country/year filters, search, sharing metadata and existing 220 photos.')
