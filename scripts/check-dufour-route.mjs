import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fitTerrain, terrainScreen, mercator, terrainSvgViewport } from '../src/data/terrainMap.js'

const raw = fs.readFileSync(new URL('../src/data/dufourTrack.json', import.meta.url), 'utf8')
const track = JSON.parse(raw)
const points = track.points.map(([lat, lng, ele, section, distance]) => ({ lat, lng, ele, section, distance }))
assert.equal(points.length, 5253)
assert.equal(new Set(points.map(point => point.section)).size, 5)
assert.equal(track.distance, 56400.1)
assert.equal(Math.max(...points.map(point => point.ele)), 4648)
assert.equal(Math.min(...points.map(point => point.ele)), 1622)
assert.equal(points[0].distance, 0)
assert.equal(points.at(-1).distance, track.distance)
assert.ok(!/2026-08-\d\dT|heart|cadence|token|Downloads|Users|\.gpx/i.test(raw))
for (let i = 0; i < points.length; i++) {
  const point = points[i]
  assert.ok(point.lat > 45.8 && point.lat < 46.1 && point.lng > 7.6 && point.lng < 8)
  assert.ok(Object.values(point).every(Number.isFinite))
  if (i) {
    assert.ok(point.distance >= points[i - 1].distance)
    // A recording gap contributes no invented connecting distance.
    if (point.section !== points[i - 1].section) assert.equal(point.distance, points[i - 1].distance)
  }
}
for (const size of [{ width: 760, height: 440 }, { width: 244, height: 360 }]) {
  const view = fitTerrain(points, size)
  const viewport = terrainSvgViewport(view, size)
  for (const point of points) {
    const screen = terrainScreen(point, view, size), world = mercator(point)
    assert.ok(screen.x >= 0 && screen.x <= size.width && screen.y >= 0 && screen.y <= size.height)
    assert.ok(Math.abs(screen.x - (world.x - viewport.left) / viewport.width * size.width) < 1e-6)
    assert.ok(Math.abs(screen.y - (world.y - viewport.top) / viewport.height * size.height) < 1e-6)
  }
}
const story = fs.readFileSync(new URL('../src/components/AlpsStory.jsx', import.meta.url), 'utf8')
assert.ok(story.includes("chapter.id === 'dufourspitze' && <DufourRoute />"))
console.log('Dufour GPX: valid compact data, preserved gaps/distances, shared terrain projection at desktop/mobile and chapter integration passed.')
