const tatryGeoPoints = {
  swinica: { lat: 49.2318, lng: 20.0072, zone: 'western-tatras' },
  koscielec: { lat: 49.2323, lng: 20.0078, zone: 'western-tatras' },
  krywan: { lat: 49.1622, lng: 20.0006, zone: 'high-tatras-region' },
  lomnica: { lat: 49.1958, lng: 20.2184, zone: 'high-tatras-region' },
  gerlach: { lat: 49.1661, lng: 20.1341, zone: 'high-tatras-region' },
  'durny-szczyt': { lat: 49.202, lng: 20.2228, zone: 'belianske-tatras' },
  'lodowy-szczyt': { lat: 49.1937, lng: 20.215, zone: 'high-tatras-region' },
  'baranie-rogi': { lat: 49.2106, lng: 20.2242, zone: 'belianske-tatras' },
  'kiezmarski-szczyt': { lat: 49.1955, lng: 20.2325, zone: 'belianske-tatras' },
  konczysta: { lat: 49.1587, lng: 20.0991, zone: 'high-tatras-region' },
  rysy: { lat: 49.1794, lng: 20.0881, zone: 'high-tatras-region' },
  giewont: { lat: 49.2509, lng: 19.9346, zone: 'western-tatras' },
  szatan: { lat: 49.1624, lng: 20.1072, zone: 'high-tatras-region' },
  'jagniecy-szczyt': { lat: 49.2147, lng: 20.2104, zone: 'belianske-tatras' },
  'posrednia-gran': { lat: 49.1817, lng: 20.1703, zone: 'high-tatras-region' },
  'slawkowski-szczyt': { lat: 49.1672, lng: 20.1861, zone: 'high-tatras-region' },
  ganek: { lat: 49.156, lng: 20.1297, zone: 'high-tatras-region' },
  wysoka: { lat: 49.1602, lng: 20.1426, zone: 'high-tatras-region' },
  'mieguszowiecki-szczyt-wielki': { lat: 49.1798, lng: 20.0582, zone: 'high-tatras-region' },
  wolowiec: { lat: 49.2238, lng: 19.8249, zone: 'western-tatras' },
  'starorobocianski-wierch': { lat: 49.2231, lng: 19.7972, zone: 'western-tatras' },
}

const tatryUiLayout = {
  swinica: { nudge: { x: -1.3, y: 0.8 }, labelOffset: { x: -10, y: 1 }, tier: 'primary' },
  koscielec: { nudge: { x: 0.8, y: -0.7 }, labelOffset: { x: -13, y: -6 }, tier: 'secondary' },
  krywan: { nudge: { x: -0.4, y: 0.4 }, labelOffset: { x: -15, y: 10 }, tier: 'primary' },
  lomnica: { nudge: { x: 0.7, y: -0.2 }, labelOffset: { x: 9, y: -8 }, tier: 'primary' },
  gerlach: { nudge: { x: 0.9, y: -0.7 }, labelOffset: { x: 9, y: -12 }, tier: 'featured' },
  'durny-szczyt': { nudge: { x: 1.6, y: -1 }, labelOffset: { x: -28, y: 9 }, tier: 'secondary' },
  'lodowy-szczyt': { nudge: { x: 0.2, y: -0.6 }, labelOffset: { x: 14, y: -10 }, tier: 'primary' },
  'baranie-rogi': { nudge: { x: 0.9, y: -0.6 }, labelOffset: { x: 13, y: -2 }, tier: 'secondary' },
  'kiezmarski-szczyt': { nudge: { x: 1.4, y: -0.3 }, labelOffset: { x: 13, y: 8 }, tier: 'primary' },
  konczysta: { nudge: { x: -0.3, y: 0.4 }, labelOffset: { x: -16, y: 10 }, tier: 'secondary' },
  rysy: { nudge: { x: 0.1, y: -0.5 }, labelOffset: { x: -13, y: -10 }, tier: 'featured' },
  giewont: { nudge: { x: -0.2, y: -0.2 }, labelOffset: { x: -14, y: -8 }, tier: 'primary' },
  szatan: { nudge: { x: 0.3, y: 0.5 }, labelOffset: { x: 12, y: -8 }, tier: 'secondary' },
  'jagniecy-szczyt': { nudge: { x: 0.6, y: -0.1 }, labelOffset: { x: 14, y: 6 }, tier: 'secondary' },
  'posrednia-gran': { nudge: { x: 0.3, y: 0.2 }, labelOffset: { x: 12, y: -12 }, tier: 'secondary' },
  'slawkowski-szczyt': { nudge: { x: 0.4, y: 0.5 }, labelOffset: { x: 14, y: 10 }, tier: 'secondary' },
  ganek: { nudge: { x: 0.2, y: 0.2 }, labelOffset: { x: -20, y: 10 }, tier: 'secondary' },
  wysoka: { nudge: { x: 0.3, y: 0.3 }, labelOffset: { x: -20, y: -10 }, tier: 'primary' },
  'mieguszowiecki-szczyt-wielki': { nudge: { x: -0.2, y: 0.2 }, labelOffset: { x: -24, y: 9 }, tier: 'primary' },
  wolowiec: { nudge: { x: -0.7, y: -0.1 }, labelOffset: { x: -15, y: -9 }, tier: 'secondary' },
  'starorobocianski-wierch': { nudge: { x: -0.9, y: 0.1 }, labelOffset: { x: -18, y: 8 }, tier: 'secondary' },
}

export const tatryBounds = {
  latMin: 49.12,
  latMax: 49.29,
  lngMin: 19.76,
  lngMax: 20.28,
}

export const tatryProjectionConfig = {
  bounds: tatryBounds,
  coordinateSpace: 'tatry-scene-normalized-percent',
  projectionMode: 'normalized-bounds-then-stylized-ridge-layout',
  background: {
    width: 3208,
    height: 2000,
    aspectRatio: 3208 / 2000,
  },
  stylizedLayout: {
    axisXStart: 12,
    axisXSpan: 80,
    ridgeYStart: 62,
    ridgeYSpan: 26,
    corridorWaveAmplitude: 1.1,
    geoPull: 9.2,
  },
}

const clampPercent = (value) => Math.max(0, Math.min(100, value))

const stylizeTatryProjection = (position) => {
  if (!position) return null
  const normalizedX = position.x / 100
  const layout = tatryProjectionConfig.stylizedLayout
  const axisX = layout.axisXStart + normalizedX * layout.axisXSpan
  const ridgeSlope = layout.ridgeYStart - normalizedX * layout.ridgeYSpan
  const corridorWave = Math.sin(normalizedX * Math.PI * 1.05) * layout.corridorWaveAmplitude
  const geoPull = ((position.y - 50) / 50) * layout.geoPull
  return {
    x: clampPercent(axisX),
    y: clampPercent(ridgeSlope + corridorWave + geoPull),
  }
}

export function projectGeoToTatryLayout({ lat, lng }, bounds = tatryProjectionConfig.bounds) {
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
