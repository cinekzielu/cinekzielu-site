// Fetch data rather than importing it as executable code: a failed network
// request can be retried without keeping a rejected module in the browser cache.
export function createRouteTrackLoader(resolveUrl, request = (...args) => fetch(...args), timeoutMs = 20000) {
  const cache = new Map()
  return id => {
    if (cache.has(id)) return cache.get(id)
    const pending = (async () => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const response = await request(resolveUrl(id), { signal: controller.signal })
        if (!response.ok) throw new Error(`Route data unavailable (${response.status})`)
        const track = await response.json()
        if (!Array.isArray(track.points) || !track.points.length || !Number.isFinite(track.distance)) throw new Error('Invalid route data')
        return { default: track }
      } finally { clearTimeout(timer) }
    })()
    cache.set(id, pending)
    pending.catch(() => { if (cache.get(id) === pending) cache.delete(id) })
    return pending
  }
}

// These URLs are resolved only when an interactive view requests a track.
// Build-time rendering never fetches them. Vite emits the existing JSON files
// as hashed assets; no route coordinates or recordings are changed.
export const loadRouteTrack = createRouteTrackLoader(id => id === 'dufourspitze'
  ? new URL('./dufourTrack.json', import.meta.url).href
  : new URL(`./tracks/${id}.json`, import.meta.url).href)
// Spatial filters need traces even in list mode. Comparisons remain available
// outside the current metadata filters; an offscreen map alone needs no traces.
export function requiredRouteTracks(candidateIds, { view, area, compare }, mapNearby) {
  return [...new Set([
    ...((view === 'map' && mapNearby) || area ? candidateIds : []),
    ...compare,
  ])]
}
