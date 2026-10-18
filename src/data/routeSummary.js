import catalog from './routeCatalog.json' with { type: 'json' }
import { canonicalRouteId } from './routeAliases.js'

// Totals always refer to complete recordings, including when given old day links.
export function summarizeRoutes(rows) {
  const ids = new Set(rows.map(row => canonicalRouteId(row.id)))
  return catalog.filter(row => ids.has(row.id)).reduce((sum, row) => ({
    count: sum.count + 1,
    distance: sum.distance + row.distance,
    ascent: sum.ascent + row.ascentEstimate,
  }), { count: 0, distance: 0, ascent: 0 })
}
