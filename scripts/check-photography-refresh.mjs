import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { photoGalleries } from '../src/data/galleryData.js'
import { portfolioPhotos, photographyCollections, homePhotographyCollections } from '../src/data/portfolioData.js'
import { curatedGalleryPhotos, gallerySelectionMode } from '../src/data/gallerySelection.js'
import { photoViewId } from '../src/data/photoView.js'
import { sharePages, photoSharePath } from '../src/data/sharePages.js'

const hung = photoGalleries.find(g => g.id === 'hungaroring-2026')
assert.equal(hung.photos.length, 40)
assert.equal(curatedGalleryPhotos(hung).length, 16)
assert.equal(gallerySelectionMode(hung), 'selected')
assert.equal(gallerySelectionMode(hung, '?wybor=wszystkie'), 'all')
assert.equal(gallerySelectionMode(hung, '?wybor=invalid'), 'selected')
assert.equal(gallerySelectionMode(hung, '?zdjecie=hungaroring-01'), 'all', 'Old shared photos still open')
assert.equal(gallerySelectionMode(hung, '?zdjecie=hungaroring-25'), 'selected')
assert.equal(gallerySelectionMode(hung, '?zdjecie=nonexistent'), 'selected')
for (let n=1; n<=40; n++) assert(hung.photos.some(p=>photoViewId(p)===`hungaroring-${String(n).padStart(2,'0')}`))
assert.equal(hung.coverImage, curatedGalleryPhotos(hung)[0].src)
assert.equal(portfolioPhotos.length, 34)
assert.equal(new Set(portfolioPhotos.map(p=>p.full)).size, 34)
assert.deepEqual(photographyCollections.map(c=>c.id), ['jeziora','motorsport','granie','zima','sycylia'])
assert.deepEqual(homePhotographyCollections.map(c=>c.id), ['jeziora','motorsport','zima'])
assert.equal(photographyCollections.find(c=>c.id==='motorsport').photos.length, 6)
for (const collection of photographyCollections) {
  assert(collection.description && collection.photos.length >= 5)
  assert(sharePages.some(p=>p.collectionId===collection.id))
  for (const photo of collection.photos) {
    assert(portfolioPhotos.some(p=>p.full===photo.full))
    assert(sharePages.some(p=>p.path===photoSharePath(photo)))
  }
}
const stages = JSON.parse(await readFile(new URL('../src/data/alpsPhotoStages.json', import.meta.url)))
for (const [id, numbers] of [['grossglockner',[49]],['dufour-podejscie',[50]],['dufour-szczyt',[51,52]]]) {
  assert(numbers.every(n=>stages.find(s=>s.id===id).photos.includes(n)))
}
for (const photo of [...curatedGalleryPhotos(hung), ...photoGalleries.find(g=>g.id==='alpy-2026').photos.slice(48)]) {
  for (const key of ['src','full','mobileSrc']) {
    const bytes=await readFile(new URL('../public'+photo[key],import.meta.url))
    assert(!bytes.includes(Buffer.from('EXIF')), 'No source EXIF/GPS in exports')
    assert.equal(bytes.toString('ascii',8,12),'WEBP')
  }
}
console.log('PASS: curated Hungaroring/legacy links, 34 unique portfolio photos, five collections, F1 on homepage, four dated Alps additions and metadata-free WebP exports.')
