import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { routeDayView } from '../src/data/routeDays.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { readRouteAtlas, comparisonShareHref, estimateAscent, highestPeak } from '../src/data/routeAtlas.js'
import { cleanSavedKeys } from '../src/data/savedItems.js'

const cases = { 'toubkal-2025': [3476,36197.6], 'swinica-2025':[4036,39098.7], 'baranie-rogi-lato-2026':[3525,36972.7] }
for (const [id, [count,distance]] of Object.entries(cases)) {
  const track=JSON.parse(await readFile(new URL(`../src/data/tracks/${id}.json`,import.meta.url)))
  const route=tripRoutes[id], original=JSON.stringify(track)
  assert.equal(track.points.length,count); assert.equal(track.distance,distance)
  assert.equal(routeDayView(track,route,'all').track,track)
  assert.equal(routeDayView(track,route,'invalid').track,track)
  let next=0, total=0, ascent=0
  for (const day of track.days) {
    assert.equal(day.startIndex,next)
    const view=routeDayView(track,route,day.id), points=view.track.points
    assert.equal(points.length,day.endIndex-day.startIndex+1)
    assert.equal(points[0][4],0)
    assert.equal(points.at(-1)[4],view.track.distance)
    assert.equal(view.track.dates,day.dates)
    assert.deepEqual(view.route.peaks.map(peak=>peak.id),day.peakIds)
    assert.equal(view.track.minElevation,Math.min(...points.map(p=>p[2])))
    assert.equal(view.track.maxElevation,Math.max(...points.map(p=>p[2])))
    for (let i=0;i<points.length;i++) {
      assert.deepEqual(points[i].slice(0,4),track.points[day.startIndex+i].slice(0,4))
      if (i && points[i][3]!==points[i-1][3]) assert.equal(points[i][4],points[i-1][4])
    }
    for (const stage of view.track.stages) assert(stage.startIndex>=0 && stage.endIndex<points.length)
    if (next) {
      assert.notEqual(track.points[next][3],track.points[next-1][3])
      assert.equal(track.points[next][4],track.points[next-1][4])
    }
    if (id==='toubkal-2025' && day.id==='1') assert.equal(highestPeak(view.route),null)
    if (id==='baranie-rogi-lato-2026') assert.equal(highestPeak(view.route).altitude,day.id==='1'?2526:2627)
    next=day.endIndex+1;total+=view.track.distance;ascent+=estimateAscent(points)
  }
  assert.equal(next,count);assert.equal(Math.round(total*10)/10,distance)
  assert(Math.abs(ascent-estimateAscent(track.points))<=10,'Only independent rounding can differ')
  assert.equal(JSON.stringify(track),original,'Day slicing never edits the complete track')
}
for (const [old,canonical] of [['kasprowy-2025','swinica-2025'],['lodowy-lato-2026','baranie-rogi-lato-2026']]) {
  assert.equal(readRouteAtlas(`?trasa=${old}`).selected,canonical)
  assert.deepEqual(cleanSavedKeys([`route:${old}`,`route:${canonical}`]),[`route:${canonical}`])
  assert(tripRoutes[canonical].legacyAnchors.includes(`trasa-${old}`))
}
const state=readRouteAtlas('?porownaj=baranie-rogi-lato-2026,baranie-rogi-zima-2025&dzienA=1&dzienB=999')
assert.deepEqual(state.compareDays,['1','all'])
const link=new URL(comparisonShareHref(state,12340),'https://www.cinekzielu.pl')
assert.deepEqual(readRouteAtlas(link.search),state)
assert.equal(link.searchParams.get('km'),'12.34')
assert.deepEqual(readRouteAtlas('?porownaj=toubkal-2025,swinica-2025&dzienA=2&dzienB=1').compareDays,['2','1'])
assert.deepEqual(readRouteAtlas('?porownaj=dufourspitze,swinica-2025&dzienA=2&dzienB=3').compareDays,['all','all'])
console.log('PASS: three complete journeys, six day views, rebased distances, preserved samples/gaps, correct peaks, aliases and shareable day comparisons.')
