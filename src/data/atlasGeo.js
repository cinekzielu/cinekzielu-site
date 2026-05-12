const tatryGeoPoints = {
  swinica: { lat: 49.2318, lng: 20.0072, zone: 'western-tatras' },
  koscielec: { lat: 49.2323, lng: 20.0078, zone: 'western-tatras' },
  krywan: { lat: 49.1622, lng: 20.0006, zone: 'high-tatras-region' },
  lomnica: { lat: 49.1958, lng: 20.2184, zone: 'high-tatras-region' },
  gerlach: { lat: 49.1661, lng: 20.1341, zone: 'high-tatras-region' },
  'durny-szczyt': { lat: 49.202, lng: 20.2228, zone: 'belianske-tatras' },
}

const tatryUiLayout = {
  swinica: { nudge: { x: -1.3, y: 0.8 }, labelOffset: { x: -10, y: 1 }, tier: 'primary' },
  koscielec: { nudge: { x: 1.6, y: -0.4 }, labelOffset: { x: -14, y: -7 }, tier: 'secondary' },
  krywan: { nudge: { x: -0.9, y: 1.4 }, labelOffset: { x: -16, y: 10 }, tier: 'primary' },
  lomnica: { nudge: { x: 0.2, y: 0.8 }, labelOffset: { x: 8, y: -8 }, tier: 'primary' },
  gerlach: { nudge: { x: 0.8, y: -0.3 }, labelOffset: { x: 10, y: -12 }, tier: 'featured' },
  'durny-szczyt': { nudge: { x: 1.4, y: -0.7 }, labelOffset: { x: 10, y: 7 }, tier: 'secondary' },
}

const tatryBounds = {
  latMin: 49.12,
  latMax: 49.29,
  lngMin: 19.88,
  lngMax: 20.28,
}

const clampPercent = (value) => Math.max(0, Math.min(100, value))

const stylizeTatryProjection = (position) => {
  if (!position) return null
  const normalizedX = position.x / 100
  const axisX = 15 + normalizedX * 72
  const ridgeSlope = 65 - normalizedX * 28
  const corridorWave = Math.sin(normalizedX * Math.PI * 1.15) * 2.4
  const geoPull = ((position.y - 50) / 50) * 5.8
  return {
    x: clampPercent(axisX),
    y: clampPercent(ridgeSlope + corridorWave + geoPull),
  }
}

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
  const stylized = stylizeTatryProjection(projected)
  const nudgeX = ui?.nudge?.x || 0
  const nudgeY = ui?.nudge?.y || 0
  const mapPosition = stylized
    ? { x: clampPercent(stylized.x + nudgeX), y: clampPercent(stylized.y + nudgeY) }
    : ui?.mapPosition || projected || { x: 50, y: 50 }

  return {
    geo: geoPoint,
    projectedPosition: projected,
    uiPosition: ui?.mapPosition || null,
    labelOffset: ui?.labelOffset || { x: 0, y: 0 },
    tier: ui?.tier || 'secondary',
    mapPosition,
  }
}
