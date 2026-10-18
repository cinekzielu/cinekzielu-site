import { mercator, unproject, terrainSvgViewport } from './terrainMap.js'

// URL order: west, south, east, north. Bounds describe a viewport, not a GPS fix.
export function readRouteArea(value) {
  if (typeof value !== 'string' || !/^-?\d+(?:\.\d+)?,\-?\d+(?:\.\d+)?,\-?\d+(?:\.\d+)?,\-?\d+(?:\.\d+)?$/.test(value)) return null
  const area = value.split(',').map(Number), [west, south, east, north] = area
  return area.every(Number.isFinite) && west >= -180 && east <= 180 && south >= -85.0511 && north <= 85.0511 && west < east && south < north ? area : null
}
export const areaKey = area => area ? area.map(n => Number(n.toFixed(5))).join(',') : ''
export const areaCorners = area => [{ lng: area[0], lat: area[1] }, { lng: area[2], lat: area[3] }]
export function viewportArea(view, size) {
  const box = terrainSvgViewport(view, size)
  const nw = unproject({ x: Math.max(0, box.left), y: Math.max(0, box.top) })
  const se = unproject({ x: Math.min(1, box.left + box.width), y: Math.min(1, box.top + box.height) })
  const values = [nw.lng, Math.max(-85.0511, se.lat), se.lng, Math.min(85.0511, nw.lat)]
  return readRouteArea(areaKey(values))
}
// Slab clipping detects crossings even when neither sample lies inside the box.
function crosses(a, b, box) {
  let low = 0, high = 1
  for (const [key, min, max] of [['x', box.left, box.right], ['y', box.top, box.bottom]]) {
    const delta = b[key] - a[key]
    if (!delta) { if (a[key] < min || a[key] > max) return false; continue }
    let start = (min - a[key]) / delta, end = (max - a[key]) / delta
    if (start > end) [start, end] = [end, start]
    low = Math.max(low, start); high = Math.min(high, end)
    if (low > high) return false
  }
  return true
}
export function trackInArea(track, area) {
  if (!area) return true
  if (!track?.points?.length) return false
  const nw = mercator({ lng: area[0], lat: area[3] }), se = mercator({ lng: area[2], lat: area[1] })
  const box = { left: nw.x, right: se.x, top: nw.y, bottom: se.y }
  let previous = null, section = null
  for (const [lat, lng,, part] of track.points) {
    const point = mercator({ lat, lng })
    if (crosses(point, point, box) || previous && part === section && crosses(previous, point, box)) return true
    previous = point; section = part
  }
  return false
}
