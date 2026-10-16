import catalog from './routeCatalog.json' with { type: 'json' }

export const routeIds = new Set(catalog.map(row => row.id))
export const highestPeak = route => route.peaks.reduce((a, b) => a.altitude > b.altitude ? a : b)
export const routeHref = (row, route) => `/wyprawy/${row.trip}#${route.anchor}`

export function readRouteAtlas(search) {
  const params = new URLSearchParams(search)
  const region = ['Alpy', 'Tatry'].includes(params.get('pasmo')) ? params.get('pasmo') : 'all'
  const selected = catalog.some(row => row.id === params.get('trasa') && (region === 'all' || row.region === region)) ? params.get('trasa') : null
  return { region, selected, compare: [...new Set((params.get('porownaj') || '').split(',').filter(id => routeIds.has(id)))].slice(0, 2) }
}
export function routeAtlasHref({ region, selected, compare }) {
  const params = new URLSearchParams()
  if (region !== 'all') params.set('pasmo', region)
  if (selected) params.set('trasa', selected)
  if (compare.length) params.set('porownaj', compare.join(','))
  return `/trasy${params.size ? `?${params}` : ''}`
}

// The published tracks are simplified GPS samples, not calibrated activity stats.
// Use 10 m hysteresis to ignore small vertical jitter, resetting at recording gaps.
export function estimateAscent(points, threshold = 10) {
  let total = 0, base = null, high = null, section = null
  for (const point of points) {
    const ele = point[2]
    if (point[3] !== section || base === null) {
      if (high !== null && high - base >= threshold) total += high - base
      base = high = ele; section = point[3]
    } else if (ele > high) high = ele
    else if (high - ele >= threshold) {
      if (high - base >= threshold) total += high - base
      base = high = ele
    } else if (ele < base) base = ele
  }
  if (high !== null && high - base >= threshold) total += high - base
  return Math.round(total / 10) * 10
}

export function comparisonScale(tracks) {
  return {
    distance: Math.ceil(Math.max(...tracks.map(t => t.distance)) / 1000) * 1000,
    low: Math.floor(Math.min(...tracks.map(t => t.minElevation)) / 500) * 500,
    high: Math.ceil(Math.max(...tracks.map(t => t.maxElevation)) / 500) * 500,
  }
}
export function comparisonPaths(track, scale, width = 700) {
  const paths = []
  let lastSection = null
  for (const [,, elevation, section, distance] of track.points) {
    const point = `${(52 + distance / scale.distance * (width - 70)).toFixed(2)},${(220 - (elevation - scale.low) / Math.max(1, scale.high - scale.low) * 190).toFixed(2)}`
    if (section !== lastSection) { paths.push(`M${point}`); lastSection = section }
    else paths[paths.length - 1] += ` L${point}`
  }
  return paths
}

// Interpolate only inside one recorded section; never bridge a recording gap.
export function comparisonSample(track, distance) {
  const points = track.points
  if (!points.length || !Number.isFinite(distance)) return { kind: 'missing' }
  if (distance < points[0][4] || distance > points.at(-1)[4]) return { kind: 'outside' }
  let low = 0, high = points.length - 1
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (points[mid][4] < distance) low = mid + 1
    else high = mid
  }
  const right = points[low], left = points[Math.max(0, low - 1)]
  if (right[4] === distance) return { kind: 'point', lat: right[0], lng: right[1], elevation: right[2], distance }
  if (left[3] !== right[3]) return { kind: 'gap' }
  const fraction = (distance - left[4]) / (right[4] - left[4])
  return { kind: 'point', lat: left[0] + (right[0] - left[0]) * fraction, lng: left[1] + (right[1] - left[1]) * fraction, elevation: left[2] + (right[2] - left[2]) * fraction, distance }
}

export function readComparisonDistance(search, maxDistance) {
  const value = new URLSearchParams(search).get('km')
  if (!value || !/^\d+(\.\d{1,3})?$/.test(value)) return 0
  const distance = Number(value) * 1000
  return Number.isFinite(distance) ? Math.max(0, Math.min(maxDistance, distance)) : 0
}

export function comparisonShareHref(state, distance) {
  const href = routeAtlasHref(state)
  if (state.compare.length !== 2) return href
  return `${href}&km=${(Math.max(0, distance) / 1000).toFixed(2)}#porownanie`
}
