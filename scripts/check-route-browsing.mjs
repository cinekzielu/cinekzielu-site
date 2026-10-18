import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import stages from '../src/data/alpsPhotoStages.json' with { type: 'json' }
import { readRouteAtlas, routeAtlasHref, comparisonShareHref, sortRoutes } from '../src/data/routeAtlas.js'
import { routeDayView } from '../src/data/routeDays.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { photoViewId, linkedPhotoIndex } from '../src/data/photoView.js'
import { alpsStoryGallery } from '../src/data/alpsStory.js'

const same = readRouteAtlas('?widok=lista&sortuj=shortest&pasmo=Tatry&porownaj=baranie-rogi-lato-2026,baranie-rogi-lato-2026&dzienA=1&dzienB=2')
assert.deepEqual(same.compare, ['baranie-rogi-lato-2026', 'baranie-rogi-lato-2026'])
assert.deepEqual(same.compareDays, ['1','2'])
assert.equal(same.view,'list'); assert.equal(same.sort,'shortest')
assert.deepEqual(readRouteAtlas(new URL(routeAtlasHref(same),'https://example.com').search),same)
assert.deepEqual(readRouteAtlas(new URL(comparisonShareHref(same,14000),'https://example.com').search),same)
for (const id of ['toubkal-2025','swinica-2025','baranie-rogi-lato-2026']) {
  const fullAndDay = readRouteAtlas(`?porownaj=${id},${id}&dzienB=2`)
  assert.equal(fullAndDay.compare.length,2)
  assert.deepEqual(readRouteAtlas(`?porownaj=${id},${id}&dzienA=2&dzienB=2`).compare,[id])
  const track=JSON.parse(await readFile(new URL(`../src/data/tracks/${id}.json`,import.meta.url)))
  const days=['1','2'].map(day=>routeDayView(track,tripRoutes[id],day))
  assert.notEqual(days[0].track.distance,days[1].track.distance)
  assert.notDeepEqual(days[0].track.points,days[1].track.points)
}
assert.deepEqual(readRouteAtlas('?porownaj=dufourspitze,dufourspitze&dzienA=1&dzienB=2').compare,['dufourspitze'])
assert.deepEqual(readRouteAtlas('?porownaj=kasprowy-2025,swinica-2025&dzienA=1&dzienB=2').compare,['swinica-2025','swinica-2025'])
assert.equal(readRouteAtlas('?widok=oops&sortuj=no').view,'map')
assert.equal(readRouteAtlas('?widok=oops&sortuj=no').sort,'newest')
const original = JSON.stringify(catalog)
for (const [sort,field,direction] of [['distance','distance',-1],['shortest','distance',1],['ascent','ascentEstimate',-1]]) {
  const rows=sortRoutes(catalog,sort)
  assert.equal(rows.length,catalog.length)
  for (let i=1;i<rows.length;i++) assert((rows[i][field]-rows[i-1][field])*direction>=0)
}
assert.equal(JSON.stringify(catalog),original)
const newest=sortRoutes(catalog)
for(let i=1;i<newest.length;i++) assert(newest[i].sortDate<=newest[i-1].sortDate)
for (const stage of stages.filter(s=>s.routeId)) {
  assert(tripRoutes[stage.routeId])
  for (const n of stage.photos) { const photo=alpsStoryGallery.photos[n-1]; assert(photo?.full); assert.equal(linkedPhotoIndex(alpsStoryGallery.photos, `?etap=${stage.id}&zdjecie=${photoViewId(photo)}`),n-1) }
  assert(!('lat' in stage) && !('lng' in stage),'No invented photo coordinates')
}
console.log('PASS: list sorting, stable URL/history/share state, distinct days of one journey, aliases, unchanged catalogs and verified Alps photo groups.')
