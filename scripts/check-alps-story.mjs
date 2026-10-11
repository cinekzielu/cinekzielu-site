import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { alpsStory, alpsStoryGallery, alpsStoryHash, alpsTotals, alpsLocations, alpsLegacyChapters } from '../src/data/alpsStory.js'
import { findFilm } from '../src/data/filmCatalog.js'

assert.deepEqual(alpsStory.map(chapter => chapter.id), ['triglav', 'grossglockner', 'dufourspitze', 'grauspitz', 'zugspitze'])
assert.equal(alpsStoryGallery.photos.length, 48)
assert.equal(new Set(alpsStory.map(alpsStoryHash)).size, 5)
assert.equal(new Set(alpsStory.map(chapter => chapter.country)).size, 5)
assert.equal(alpsStory.reduce((sum, chapter) => sum + Math.round(chapter.distance * 100), 0), Math.round(alpsTotals.distance * 100))
assert.equal(alpsStory.reduce((sum, chapter) => sum + chapter.ascent, 0), alpsTotals.ascent)
const seconds = value => value.split(':').map(Number).reduce((sum, part) => sum * 60 + part, 0)
assert.equal(alpsStory.reduce((sum, chapter) => sum + seconds(chapter.movingTime), 0), seconds(alpsTotals.movingTime))
assert.equal(alpsStory.filter(chapter => chapter.pause).length, 4)
assert.equal(alpsStory[2].days.length, 3)
assert(alpsStory[2].description.includes('Agata została w Monte Rosa Hütte'))
const photos = alpsStory.flatMap(chapter => [...chapter.photos, ...(chapter.days || []).flatMap(day => day.photos), ...(chapter.pause?.photos || [])])
assert.equal(photos.length, 24)
assert.equal(new Set(photos.map(photo => photo.src)).size, 24)
for (const photo of photos) {
  assert(alpsStoryGallery.photos.includes(photo))
  for (const field of ['src', 'full', 'mobileSrc']) assert(existsSync(`public${photo[field]}`))
}
for (const chapter of alpsStory) {
  assert.equal(chapter.episodeStatus, 'W przygotowaniu')
  assert.equal(chapter.episodeUrl, undefined)
  assert.equal(chapter.isoDate, undefined)
}
for (const id of Object.values(alpsLegacyChapters)) assert(alpsStory.some(chapter => chapter.id === id))
assert.equal(alpsLocations.length, 5)
for (const point of alpsLocations) {
  assert(point.lat > 45 && point.lat < 48 && point.lng > 7 && point.lng < 15)
  assert(point.coordinateSource.startsWith('https://www.openstreetmap.org/node/'))
}
assert.equal(alpsStoryGallery.films.length, 1)
assert.equal(alpsStoryGallery.films[0].label, 'Zwiastun')
assert.equal(findFilm(alpsStoryGallery.films[0].id).duration, '1:34')
console.log('PASS: five confirmed summits in order, four pauses, three-day Dufour block, exact activity totals, 24 existing photos, five map sources, legacy anchors and unpublished episode status.')
