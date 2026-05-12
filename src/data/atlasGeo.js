const tatryGeoPoints = {
  swinica: { lat: 49.2318, lng: 20.0072, zone: 'western-tatras' },
  koscielec: { lat: 49.2323, lng: 20.0078, zone: 'western-tatras' },
  krywan: { lat: 49.1622, lng: 20.0006, zone: 'high-tatras-region' },
  lomnica: { lat: 49.1958, lng: 20.2184, zone: 'high-tatras-region' },
  gerlach: { lat: 49.1661, lng: 20.1341, zone: 'high-tatras-region' },
  'durny-szczyt': { lat: 49.202, lng: 20.2228, zone: 'belianske-tatras' },
}

const tatryUiLayout = {
  swinica: { mapPosition: { x: 22, y: 61 }, labelOffset: { x: -8, y: 2 }, tier: 'primary' },
  koscielec: { mapPosition: { x: 35, y: 56 }, labelOffset: { x: -10, y: -2 }, tier: 'secondary' },
  krywan: { mapPosition: { x: 49, y: 50 }, labelOffset: { x: -5, y: -8 }, tier: 'primary' },
  lomnica: { mapPosition: { x: 63, y: 44 }, labelOffset: { x: 4, y: -8 }, tier: 'primary' },
  gerlach: { mapPosition: { x: 71, y: 39 }, labelOffset: { x: 4, y: -8 }, tier: 'featured' },
  'durny-szczyt': { mapPosition: { x: 82, y: 44 }, labelOffset: { x: 5, y: 4 }, tier: 'secondary' },
}

const tatryBounds = {
  latMin: 49.12,
  latMax: 49.29,
  lngMin: 19.88,
  lngMax: 20.28,
}

const clampPercent = (value) => Math.max(0, Math.min(100, value))

export function projectGeoToTatryLayout({ lat, lng }, bounds = tatryBounds) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null
  const x = ((lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100
  const y = ((bounds.latMax - lat) / (bounds.latMax - bounds.latMin)) * 100
  return { x: clampPercent(x), y: clampPercent(y) }
}

export function getTatryGeoPoint(pointId) {
  return tatryGeoPoints[pointId] || null
}

export function getTatryUiLayout(pointId) {
  return tatryUiLayout[pointId] || null
}

export function resolveTatryPointPosition(pointId) {
  const geoPoint = getTatryGeoPoint(pointId)
  const ui = getTatryUiLayout(pointId)
  const projected = geoPoint ? projectGeoToTatryLayout(geoPoint) : null

  return {
    geo: geoPoint,
    projectedPosition: projected,
    uiPosition: ui?.mapPosition || null,
    labelOffset: ui?.labelOffset || { x: 0, y: 0 },
    tier: ui?.tier || 'secondary',
    mapPosition: ui?.mapPosition || projected || { x: 50, y: 50 },
  }
}
