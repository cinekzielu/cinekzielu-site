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
