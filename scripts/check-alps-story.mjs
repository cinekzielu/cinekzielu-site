import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { alpsStory, alpsStoryGallery, alpsStoryHash, alpsTotals, alpsLocations, alpsLegacyChapters, getLatestAlpsChapter, latestAlpsChapter } from '../src/data/alpsStory.js'
import { alpsEpisodes } from '../src/data/alpsEpisodes.js'
import { findFilm } from '../src/data/filmCatalog.js'
import { homeUpdates } from '../src/data/homeUpdates.js'
import { tripRoutes } from '../src/data/tripRoutes.js'

assert.deepEqual(alpsStory.map(chapter => chapter.id), ['triglav', 'grossglockner', 'dufourspitze', 'grauspitz', 'zugspitze'])
assert.equal(alpsStoryGallery.photos.length, 52)
assert.equal(new Set(alpsStory.map(alpsStoryHash)).size, 5)
assert.equal(new Set(alpsStory.map(chapter => chapter.country)).size, 5)
assert.equal(alpsStory.reduce((sum, chapter) => sum + Math.round(chapter.distance * 100), 0), Math.round(alpsTotals.distance * 100))
assert.equal(alpsStory.reduce((sum, chapter) => sum + chapter.ascent, 0), alpsTotals.ascent)
const seconds = value => value.split(':').map(Number).reduce((sum, part) => sum * 60 + part, 0)
assert.equal(alpsStory.reduce((sum, chapter) => sum + seconds(chapter.movingTime), 0), seconds(alpsTotals.movingTime))
assert.equal(alpsStory.filter(chapter => chapter.pause).length, 4)
assert.equal(alpsStory[2].days.length, 3)
const photos = alpsStory.flatMap(chapter => [...chapter.photos, ...(chapter.days || []).flatMap(day => day.photos), ...(chapter.pause?.photos || [])])
assert.equal(photos.length, 24)
assert.equal(new Set(photos.map(photo => photo.src)).size, 24)
for (const photo of photos) {
  assert(alpsStoryGallery.photos.includes(photo))
  for (const field of ['src', 'full', 'mobileSrc']) assert(existsSync(`public${photo[field]}`))
}
for (const chapter of alpsStory) {
  assert.equal(chapter.episode, alpsEpisodes[chapter.id] || null)
  assert.ok(chapter.photos.length || chapter.days?.some(day => day.photos.length))
  assert.equal(typeof tripRoutes[chapter.id].load, 'function')
  assert.equal(chapter.episodeUrl, undefined)
  assert.equal(chapter.isoDate, undefined)
}
for (const id of Object.values(alpsLegacyChapters)) assert(alpsStory.some(chapter => chapter.id === id))
assert.equal(alpsLocations.length, 5)
for (const point of alpsLocations) {
  assert(point.lat > 45 && point.lat < 48 && point.lng > 7 && point.lng < 15)
  assert(point.coordinateSource.startsWith('https://www.openstreetmap.org/node/'))
}
const episodes = Object.entries(alpsEpisodes).sort(([, a], [, b]) => a.episodeNumber - b.episodeNumber)
assert.equal(alpsStoryGallery.films.length, episodes.length + 1)
for (const [index, [id, episode]] of episodes.entries()) {
  const chapter = alpsStory.find(item => item.id === id)
  assert.equal(Number(chapter.number), episode.episodeNumber)
  assert.match(episode.publishedAt, /^\d{4}-\d{2}-\d{2}$/)
  assert.equal(alpsStoryGallery.films[index].id, episode.youtubeId)
  assert.equal(alpsStoryGallery.films[index].url, episode.youtubeUrl)
  assert.equal(alpsStoryGallery.films[index].label, `Odcinek ${episode.episodeNumber}/5`)
}
assert.equal(alpsEpisodes.triglav.youtubeId, 'C8weHwRNLiE')
assert.equal(findFilm('C8weHwRNLiE').duration, '39:33')
const trailer = alpsStoryGallery.films.at(-1)
assert.equal(trailer.id, 'l3KltGrKz2U')
assert.equal(trailer.label, 'Zwiastun')
assert.equal(findFilm(trailer.id).duration, '1:34')

const latestUpdate = homeUpdates.find(item => item.kind === 'film')
assert.equal(latestUpdate.id, `alps-episode-${latestAlpsChapter.id}`)
assert.equal(latestUpdate.href, latestAlpsChapter.episode.youtubeUrl)
assert.equal(latestUpdate.publishedAt, latestAlpsChapter.episode.publishedAt)

// A later confirmed EP02 should take over even when the list is not in series order.
const grossglocknerFixture = {
  ...alpsStory.find(item => item.id === 'grossglockner'),
  episode: { publishedAt: '2027-01-02', youtubeUrl: 'https://example.invalid/grossglockner-fixture' },
}
const triglav = alpsStory.find(item => item.id === 'triglav')
const missingUrl = { id: 'dufourspitze', episode: { publishedAt: '2027-01-03' } }
const missingDate = { id: 'grauspitz', episode: { youtubeUrl: 'https://example.invalid/unpublished-fixture' } }
assert.equal(getLatestAlpsChapter([grossglocknerFixture, triglav, missingUrl, missingDate]), grossglocknerFixture)
assert.equal(getLatestAlpsChapter([triglav, grossglocknerFixture]), grossglocknerFixture)
assert.equal(getLatestAlpsChapter([missingUrl, missingDate]), null)
console.log('PASS: five Alps stages with photos and routes, published films and trailer, homepage date and URL, and a future EP02 fixture.')
