import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { moroccoStory, moroccoStoryForPlace, moroccoStoryHash } from '../src/data/moroccoStory.js'
import { moroccoGallery } from '../src/data/moroccoGallery.js'
import { moroccoPlaces } from '../src/data/moroccoPlaces.js'

assert.equal(moroccoStory.length, 10)
assert.equal(new Set(moroccoStory.map(moroccoStoryHash)).size, 10)
assert.deepEqual(moroccoStory.flatMap(stop => stop.places.map(place => place.id)), moroccoPlaces.map(place => place.id))
const previousTimes = new Map()
for (const stop of moroccoStory) {
  const chapter = stop.places[0].chapter
  assert.equal(stop.chapter, chapter)
  const link = new URL(stop.filmHref)
  assert.equal(link.searchParams.get('v'), chapter.videoId)
  assert.equal(link.searchParams.get('t'), `${chapter.seconds}s`)
  assert.ok(moroccoGallery.films.some(film => film.id === chapter.videoId))
  assert.ok(chapter.seconds >= (previousTimes.get(chapter.videoId) || 0))
  previousTimes.set(chapter.videoId, chapter.seconds)
  for (const place of stop.places) assert.equal(moroccoStoryForPlace(place.id), stop)
  for (const photo of stop.photos) {
    assert.ok(photo && moroccoGallery.photos.includes(photo), `Missing existing frame for ${stop.id}`)
    for (const key of ['src', 'full', 'mobileSrc']) assert.ok(existsSync(`public${photo[key]}`), photo[key])
  }
}
assert.equal(moroccoGallery.photos.length, 40)
assert.equal(moroccoStoryForPlace('unknown'), undefined)
console.log('Morocco story: 10 chapters, 12 existing places, 14 existing frames, timestamps and all image variants verified.')
