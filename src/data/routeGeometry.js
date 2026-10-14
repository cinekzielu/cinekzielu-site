import { mercator } from './terrainMap.js'

export function buildTrackGeometry(track) {
  const points = track.points.map(([lat, lng, ele, section, distance]) => ({ lat, lng, ele, section, distance }))
  const segments = []
  for (const point of points) {
    if (!segments.length || segments.at(-1)[0].section !== point.section) segments.push([])
    segments.at(-1).push(point)
  }
  const paths = segments.map(segment => segment.map((point, index) => { const { x, y } = mercator(point); return `${index ? 'L' : 'M'}${x},${y}` }).join(' '))
  const profileY = point => 222 - (point.ele - track.minElevation) / Math.max(1, track.maxElevation - track.minElevation) * 190
  return { points, segments, paths, profileY }
}

// Match to the existing summit location, not to the highest noisy GPS sample.
export function closestTrackIndex(points, peak) {
  const scale = Math.cos(peak.lat * Math.PI / 180)
  const score = point => (point.lat - peak.lat) ** 2 + ((point.lng - peak.lng) * scale) ** 2
  return points.reduce((best, point, index) => score(point) < score(points[best]) ? index : best, 0)
}
