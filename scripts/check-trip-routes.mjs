import assert from 'node:assert/strict'
import fs from 'node:fs'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { buildTrackGeometry, closestTrackIndex } from '../src/data/routeGeometry.js'
import { fitTerrain, terrainScreen, mercator, terrainSvgViewport } from '../src/data/terrainMap.js'

const expected = { triglav: [1662, 2864], grossglockner: [1759, 3798], dufourspitze: [5253, 4634], grauspitz: [1418, 2599], zugspitze: [1442, 2962], 'ganek-wysoka-rysy': [3865, 2560] }
const result = []
assert.equal(Object.keys(tripRoutes).length, 6)
for (const [id, route] of Object.entries(tripRoutes)) {
  const raw = fs.readFileSync(new URL(id === 'dufourspitze' ? '../src/data/dufourTrack.json' : `../src/data/tracks/${id}.json`, import.meta.url), 'utf8')
  const track = JSON.parse(raw), geometry = buildTrackGeometry(track)
  const { points, segments, paths } = geometry
  assert.equal(points.length, expected[id][0])
  assert.equal(Math.max(...route.peaks.map(peak => peak.altitude)), expected[id][1])
  assert.equal(track.dates, route.dates)
  assert.equal(points.at(-1).distance, track.distance)
  assert.equal(track.minElevation, Math.min(...points.map(point => point.ele)))
  assert.equal(track.maxElevation, Math.max(...points.map(point => point.ele)))
  assert.equal(paths.length, segments.length)
  assert.ok(!/\d{4}-\d\d-\d\dT|heart|cadence|token|Downloads|Users|\.gpx/i.test(raw))
  for (let i = 0; i < points.length; i++) {
    assert.ok(Object.values(points[i]).every(Number.isFinite))
    assert.ok(Math.abs(points[i].lat) <= 90 && Math.abs(points[i].lng) <= 180)
    if (i) {
      assert.ok(points[i].distance >= points[i - 1].distance)
      if (points[i].section !== points[i - 1].section) assert.equal(points[i].distance, points[i - 1].distance)
    }
  }
  const matches = route.peaks.map(peak => {
    const point = points[closestTrackIndex(points, peak)]
    const metres = Math.hypot((point.lat - peak.lat) * 111195, (point.lng - peak.lng) * 111195 * Math.cos(peak.lat * Math.PI / 180))
    assert.ok(metres < 150, `${id}/${peak.id} is not near the recorded track: ${metres}m`)
    return { peak: peak.id, nearestMetres: Math.round(metres) }
  })
  for (const size of [{ width: 900, height: 440 }, { width: 244, height: 360 }]) {
    const view = fitTerrain(points, size), viewport = terrainSvgViewport(view, size)
    for (const point of points) {
      const screen = terrainScreen(point, view, size), world = mercator(point)
      assert.ok(screen.x >= 0 && screen.x <= size.width && screen.y >= 0 && screen.y <= size.height)
      assert.ok(Math.abs(screen.x - (world.x - viewport.left) / viewport.width * size.width) < 1e-6)
    }
  }
  result.push({ id, points: points.length, segments: segments.length, matches })
}
console.log(JSON.stringify({ passed: true, routes: result }, null, 2))
