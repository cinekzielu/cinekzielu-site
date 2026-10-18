import catalog from './routeCatalog.json' with { type: 'json' }
import { canonicalRouteId } from './routeAliases.js'
import importedRoutes from './importedRoutes.json' with { type: 'json' }

export const dayIds = new Map(importedRoutes.filter(route => route.dayIds).map(route => [route.id, route.dayIds]))

export const routeIds = new Set(catalog.map(row => row.id))
export const highestPeak = route => route.peaks.reduce((a, b) => !a || b.altitude > a.altitude ? b : a, null)
export const routeHref = (row, route) => row.trip ? `/wyprawy/${row.trip}#${route.anchor}` : `/trasy?trasa=${row.id}#profil`
export const routeRegions = [...new Set(catalog.map(row => row.region))].sort((a,b) => a.localeCompare(b, 'pl'))

export const distanceFilters = [
  { id: 'all', label: 'Dowolny dystans', min: -Infinity, max: Infinity },
  { id: 'do-20', label: 'Do 20 km', min: -Infinity, max: 20000 },
  { id: '20-40', label: 'Ponad 20 do 40 km', min: 20000, max: 40000 },
  { id: 'ponad-40', label: 'Ponad 40 km', min: 40000, max: Infinity },
]
export const ascentFilters = [
  { id: 'all', label: 'Dowolna suma podejść', min: -Infinity, max: Infinity },
  { id: 'do-1500', label: 'Do 1500 m', min: -Infinity, max: 1500 },
  { id: '1500-2500', label: 'Ponad 1500 do 2500 m', min: 1500, max: 2500 },
  { id: 'ponad-2500', label: 'Ponad 2500 m', min: 2500, max: Infinity },
]
export const routeSorts = [
  { id: 'newest', label: 'Od najnowszych' },
  { id: 'distance', label: 'Najdłuższe' },
  { id: 'shortest', label: 'Najkrótsze' },
  { id: 'ascent', label: 'Najwięcej podejść' },
]
export function sortRoutes(rows, sort = 'newest') {
  return [...rows].sort((a, b) => {
    const metric = sort === 'distance' ? b.distance - a.distance : sort === 'shortest' ? a.distance - b.distance : sort === 'ascent' ? b.ascentEstimate - a.ascentEstimate : 0
    return metric || b.sortDate.localeCompare(a.sortDate) || a.id.localeCompare(b.id)
  })
}
const inRange = (value, id, ranges) => {
  const range = ranges.find(entry => entry.id === id) || ranges[0]
  return value > range.min && value <= range.max
}
export function matchesRouteFilters(row, { region = 'all', distance = 'all', ascent = 'all' }) {
  return (region === 'all' || row.region === region) && inRange(row.distance, distance, distanceFilters) && inRange(row.ascentEstimate, ascent, ascentFilters)
}

export function readRouteAtlas(search) {
  const params = new URLSearchParams(search)
  const region = routeRegions.includes(params.get('pasmo')) ? params.get('pasmo') : 'all'
  const distance = distanceFilters.some(entry => entry.id === params.get('dystans')) ? params.get('dystans') : 'all'
  const ascent = ascentFilters.some(entry => entry.id === params.get('podejscia')) ? params.get('podejscia') : 'all'
  const requested = canonicalRouteId(params.get('trasa'))
  const selected = catalog.some(row => row.id === requested && matchesRouteFilters(row, { region, distance, ascent })) ? requested : null
  const view = params.get('widok') === 'lista' ? 'list' : 'map'
  const sort = routeSorts.some(entry => entry.id === params.get('sortuj')) ? params.get('sortuj') : 'newest'
  const compare = [], compareDays = ['all', 'all']
  const requests = (params.get('porownaj') || '').split(',').map(canonicalRouteId)
  for (const [index, id] of requests.entries()) {
    if (!routeIds.has(id)) continue
    const requestedDay = params.get(index === 0 ? 'dzienA' : 'dzienB')
    const day = dayIds.get(id)?.includes(requestedDay) ? requestedDay : 'all'
    if (compare.includes(id) && (!dayIds.has(id) || compareDays[0] === day)) continue
    compareDays[compare.length] = day
    compare.push(id)
    if (compare.length === 2) break
  }
  return { region, distance, ascent, selected, compare, compareDays, view, sort }
}
export function routeAtlasHref({ region, distance = 'all', ascent = 'all', selected, compare, compareDays = ['all', 'all'], view = 'map', sort = 'newest' }) {
  const params = new URLSearchParams()
  if (region !== 'all') params.set('pasmo', region)
  if (distance !== 'all') params.set('dystans', distance)
  if (ascent !== 'all') params.set('podejscia', ascent)
  if (view === 'list') params.set('widok', 'lista')
  if (sort !== 'newest' && routeSorts.some(entry => entry.id === sort)) params.set('sortuj', sort)
  if (selected) params.set('trasa', selected)
  if (compare.length) params.set('porownaj', compare.join(','))
  compareDays.forEach((day, slot) => { if (compare[slot] && dayIds.get(compare[slot])?.includes(day)) params.set(slot === 0 ? 'dzienA' : 'dzienB', day) })
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
