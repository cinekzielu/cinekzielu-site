import assert from 'node:assert/strict'
import { photoGalleries } from '../src/data/galleryData.js'
import { portfolioPhotos, photographyCollections } from '../src/data/portfolioData.js'
import { photoViewId, linkedPhotoIndex, photoViewUrl, fittedPhotoSize } from '../src/data/photoView.js'

for (const photos of [...photoGalleries.map(gallery => gallery.photos), portfolioPhotos, ...photographyCollections.map(collection => collection.photos)]) {
  assert.equal(new Set(photos.map(photoViewId)).size, photos.length, 'Photo ids must be unique within each shareable collection')
  photos.forEach((photo, index) => {
    const url = new URL(photoViewUrl('https://www.cinekzielu.pl/fotografia?kolekcja=granie#kolekcja', photo))
    assert.equal(linkedPhotoIndex(photos, url.search), index)
    assert.equal(linkedPhotoIndex([...photos].reverse(), url.search), photos.length - index - 1)
    assert.equal(url.searchParams.get('kolekcja'), 'granie')
    assert.equal(url.hash, '#kolekcja')
    for (const [width, height] of [[1200, 700], [296, 500], [700, 220]]) {
      const fit = fittedPhotoSize(photo, width, height)
      assert(fit.width <= width + 0.001 && fit.height <= height + 0.001)
      assert(Math.abs(fit.width / fit.height - photo.width / photo.height) < 0.001)
    }
  })
  assert.equal(linkedPhotoIndex(photos, '?zdjecie=missing'), null)
  assert.equal(linkedPhotoIndex(photos, ''), null)
  assert.equal(linkedPhotoIndex(photos, '?zdjecie=%3Cscript%3E'), null)
}
console.log('PASS: stable unique photo links across galleries/portfolio/collections, reorder resilience, unrelated URL context, unknown ids and responsive aspect-preserving fit.')
