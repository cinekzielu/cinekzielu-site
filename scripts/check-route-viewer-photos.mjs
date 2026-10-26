import assert from 'node:assert/strict'
import { routePhotoGroups } from '../src/data/routePhotoGroups.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { galleryData } from '../src/data/galleryData.js'
import { storyPhotoAssets } from '../src/data/storyPhotoAssets.js'

const existing = new Set([...galleryData.flatMap(gallery => gallery.photos), ...Object.values(storyPhotoAssets)].map(photo => photo.src))
for (const id of Object.keys(tripRoutes)) {
  const groups = routePhotoGroups(id)
  assert.equal(new Set(groups.map(group => group.id)).size, groups.length, id)
  for (const group of groups) {
    assert(group.photos.length > 0, id)
    assert.equal(new Set(group.photos.map(photo => photo.src)).size, group.photos.length, id)
    for (const photo of group.photos) assert(existing.has(photo.src), `${id}: a photo must already exist in the repository catalogues`)
  }
}
assert.deepEqual(routePhotoGroups('dufourspitze').map(group => group.photos.length), [14,15,9])
assert.equal(routePhotoGroups('triglav')[0].photos.length, 11)
assert.equal(routePhotoGroups('grossglockner')[0].photos.length, 8)
assert.equal(routePhotoGroups('grauspitz')[0].photos.length, 8)
assert.equal(routePhotoGroups('zugspitze')[0].photos.length, 7)
assert.deepEqual(routePhotoGroups('baranie-rogi-lato-2026', '1').map(group => group.id), ['baranie-dzien-1'])
assert.deepEqual(routePhotoGroups('baranie-rogi-lato-2026', '2').map(group => group.id), ['baranie-dzien-2'])
assert.equal(routePhotoGroups('baranie-rogi-lato-2026').flatMap(group => group.photos).length, 8)
assert.deepEqual(routePhotoGroups('unknown-route'), [])
console.log(`PASS: ${Object.keys(tripRoutes).length} existing routes, original photo associations, unified Alps groups, Baranie day filtering and missing-material fallback.`)
