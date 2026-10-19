import catalog from './routeCatalog.json' with { type: 'json' }
import { tripRoutes } from './tripRoutes.js'
import { summits } from './summits.js'
import { canonicalRouteId } from './routeAliases.js'

// Turbacz has a confirmed expedition/ascent but no summit marker in the GPX view.
// This association does not add coordinates or change the summit register.
const extraSummits = { 'turbacz-2026': ['turbacz'] }
export const routeSummits = id => summits.filter(peak => tripRoutes[id]?.peaks.some(p => p.id === peak.id) || extraSummits[id]?.includes(peak.id))
export function routeSeason(id) {
  const row = catalog.find(row => row.id === id)
  if (!row?.trip) return null
  const seasons = [...new Set(routeSummits(id).flatMap(peak => peak.ascents.filter(a => a.tripId === row.trip).map(a => a.season)).filter(Boolean))]
  return seasons.length === 1 ? seasons[0] : null
}
export const seasonLabel = season => season === 'lato' ? 'Lato' : season === 'zima' ? 'Zima' : 'Sezon nieopisany'
export const routeLink = id => `/trasy?trasa=${encodeURIComponent(id)}#profil`
export const compareLink = (a, b) => `/trasy?porownaj=${encodeURIComponent(`${a},${b}`)}#porownanie`
// Explicit summit/day associations verified against the existing track.days metadata.
export const summitDayScopes = {
  'baranie-rogi-lato-2026': { 'baranie-rogi': '1', 'lodowa-kopa': '2', 'lodowy-szczyt': '2' },
  'swinica-2025': { swinica: '2', 'kasprowy-wierch': '1' },
  'toubkal-2025': { toubkal: '2' },
}
export function summitCompareLink(peakId, a, b) {
  const params = new URLSearchParams({ porownaj: `${a},${b}` })
  for (const [id, key] of [[a, 'dzienA'], [b, 'dzienB']]) {
    const day = summitDayScopes[id]?.[peakId]
    if (day) params.set(key, day)
  }
  return `/trasy?${params}#porownanie`
}

export function summitRoutes(peakId, { year = 'all', season = 'all' } = {}) {
  // Route dates describe the recordings. Never fill unknown ascent years from them.
  return catalog.filter(row => routeSummits(row.id).some(peak => peak.id === peakId)
    && (year === 'all' || row.sortDate.slice(0, 4) === year)
    && (season === 'all' || routeSeason(row.id) === season))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate) || a.id.localeCompare(b.id))
}

const relativeGap = (a, b) => Math.abs(a - b) / Math.max(a, b, 1)
export function similarRoutes(routeId, limit = 3) {
  const source = catalog.find(row => row.id === canonicalRouteId(routeId))
  if (!source) return []
  const season = routeSeason(source.id)
  return catalog.filter(row => row.id !== source.id).map(row => {
    const distanceGap = relativeGap(source.distance, row.distance)
    const ascentGap = relativeGap(source.ascentEstimate, row.ascentEstimate)
    const sameRegion = row.region === source.region
    const sameSeason = Boolean(season && routeSeason(row.id) === season)
    const reasons = [sameRegion && row.region, distanceGap <= .25 && 'Zbliżony dystans', ascentGap <= .25 && 'Zbliżona suma podejść', sameSeason && seasonLabel(season)].filter(Boolean)
    return { row, reasons, score: (sameRegion ? 3 : 0) + (1 - distanceGap) * 2 + (1 - ascentGap) * 2 + (sameSeason ? 1 : 0) }
  }).filter(entry => entry.reasons.length)
    .sort((a, b) => b.score - a.score || b.row.sortDate.localeCompare(a.row.sortDate) || a.row.id.localeCompare(b.row.id))
    .slice(0, Math.max(0, Math.min(3, limit)))
}
