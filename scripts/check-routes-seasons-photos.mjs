import assert from 'node:assert/strict'
import stages from '../src/data/alpsPhotoStages.json' with { type: 'json' }
import { alpsStoryGallery } from '../src/data/alpsStory.js'
import { getSeason, seasonYears } from '../src/data/seasons.js'
import { summits } from '../src/data/summits.js'
import { sitePages, pageStructuredData } from '../src/data/siteMetadata.js'
import { searchSite } from '../src/data/siteSearch.js'

assert.deepEqual(stages.flatMap(stage => stage.photos).sort((a,b) => a-b), Array.from({length:48},(_,i) => i+1))
assert.equal(stages.filter(stage=>stage.routeId).flatMap(stage=>stage.photos).length,43)
assert.equal(stages.filter(stage=>stage.routeId==='dufourspitze').flatMap(stage=>stage.photos).length,28)
assert(stages.every(stage=>stage.photos.every(n=>alpsStoryGallery.photos[n-1])))
const publicStages = JSON.stringify(stages)
assert(!/CIN\d|Foto[\\/]|\.jpg|gps|lat|lng|offset/i.test(publicStages),'Public groups must not expose original metadata or coordinates')
assert.equal(getSeason('2024'),null)
for (const year of seasonYears) {
  const season=getSeason(year)
  assert(season.trips.every(trip=>String(trip.year)===year))
  assert(season.ascents.every(ascent=>ascent.year===year))
  assert.equal(season.peaks.length,new Set(season.peaks.map(peak=>peak.id)).size)
  assert.equal(season.ascents.length,summits.flatMap(peak=>peak.ascents).filter(ascent=>ascent.year===year).length)
  assert(season.galleries.every(gallery=>!['video-frames','trip-photos'].includes(gallery.mediaKind)))
  assert(season.films.every(film=>season.trips.some(trip=>trip.id===film.expeditionId)))
  assert.equal(season.distance,season.tracks.reduce((sum,track)=>sum+track.distance,0))
  assert(season.photos.length>0 && season.photos.length<=6)
  assert(searchSite(`Sezon ${year}`).some(item=>item.href===`/sezony/${year}`))
  const meta=sitePages.find(page=>page.path===`/sezony/${year}`)
  assert.equal(pageStructuredData(meta).breadcrumb.itemListElement[1].name,'Sezony')
  console.log(`${year}: ${season.trips.length} trips, ${season.peaks.length} distinct peaks, ${season.ascents.length} ascents, ${season.photoCount} photographs, ${season.tracks.length} GPX`)
}
assert.equal(getSeason('2025').tracks.length,21)
assert.equal(getSeason('2026').tracks.length,12)
console.log('PASS: stage assignments, distinct year statistics, SEO/search.')
