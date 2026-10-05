// Web Mercator coordinates are shared by the raster tiles and every marker.
export const TERRAIN_TILE_URL = 'https://tile.top-o-map.com/{z}/{x}/{y}.png'
export const MIN_TERRAIN_ZOOM = 2
export const MAX_TERRAIN_ZOOM = 16
export const clampTerrainZoom = zoom => Math.max(MIN_TERRAIN_ZOOM, Math.min(MAX_TERRAIN_ZOOM, zoom))
export const worldSize = zoom => 256 * 2 ** zoom
export function mercator({ lat, lng }) {
  const radians = Math.max(-85.0511, Math.min(85.0511, lat)) * Math.PI / 180
  return { x: (lng + 180) / 360, y: (1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2 }
}
export function unproject({ x, y }) {
  return { lng: x * 360 - 180, lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180 / Math.PI }
}
export function terrainScreen(point, view, size) {
  const world = mercator(point), scale = worldSize(view.zoom)
  return { x: size.width / 2 + (world.x - view.x) * scale, y: size.height / 2 + (world.y - view.y) * scale }
}

export function terrainSvgViewport(view, size) {
  const scale = worldSize(view.zoom)
  const width = size.width / scale, height = size.height / scale
  const left = view.x - width / 2, top = view.y - height / 2
  return { left, top, width, height, viewBox:`${left} ${top} ${width} ${height}` }
}
export function fitTerrain(points, size, maxZoom = 14) {
  if (!points.length) return {x:.5,y:.5,zoom:MIN_TERRAIN_ZOOM}
  const coords = points.map(mercator)
  const left = Math.min(...coords.map(p => p.x)), right = Math.max(...coords.map(p => p.x))
  const top = Math.min(...coords.map(p => p.y)), bottom = Math.max(...coords.map(p => p.y))
  const padding = size.width < 500 ? 46 : 75
  const scale = Math.min(Math.max(100, size.width - padding * 2) / Math.max(.00001, right - left), Math.max(100, size.height - padding * 2) / Math.max(.00001, bottom - top))
  return { x: (left + right) / 2, y: (top + bottom) / 2, zoom: Math.min(maxZoom, clampTerrainZoom(Math.log2(scale / 256))) }
}
export function zoomTerrainAt(view, zoom, anchor, size) {
  const nextZoom = clampTerrainZoom(zoom)
  const dx = anchor.x - size.width / 2, dy = anchor.y - size.height / 2
  return { x: view.x + dx / worldSize(view.zoom) - dx / worldSize(nextZoom), y: view.y + dy / worldSize(view.zoom) - dy / worldSize(nextZoom), zoom: nextZoom }
}
export function gestureTerrain(view, start, current, zoomDelta, size) {
  const zoom = clampTerrainZoom(view.zoom + zoomDelta)
  const before = worldSize(view.zoom), after = worldSize(zoom)
  return { x: view.x + (start.x - size.width / 2) / before - (current.x - size.width / 2) / after, y: view.y + (start.y - size.height / 2) / before - (current.y - size.height / 2) / after, zoom }
}
export function visibleTerrainTiles(view, size) {
  const z = Math.round(view.zoom), count = 2 ** z, tileSize = 256 * 2 ** (view.zoom - z)
  const left = view.x * count - size.width / (2 * tileSize), top = view.y * count - size.height / (2 * tileSize)
  const right = left + size.width / tileSize, bottom = top + size.height / tileSize
  const tiles = []
  for (let y = Math.max(0, Math.floor(top)); y <= Math.min(count - 1, Math.floor(bottom)); y++) {
    for (let x = Math.max(0, Math.floor(left)); x <= Math.min(count - 1, Math.floor(right)); x++) {
      const key = `${z}/${x}/${y}`
      tiles.push({ key, src: TERRAIN_TILE_URL.replace('{z}', z).replace('{x}', x).replace('{y}', y), left: (x - left) * tileSize, top: (y - top) * tileSize, size: tileSize })
    }
  }
  return tiles
}

// Reposition only previously loaded tiles during a zoom. This avoids a blank
// map while the new level loads, without prefetching additional map imagery.
export function reprojectTerrainTile(tile, view, size) {
  const [z, x, y] = tile.key.split('/').map(Number)
  const scale = worldSize(view.zoom), count = 2 ** z
  return { ...tile, left: size.width / 2 + (x / count - view.x) * scale, top: size.height / 2 + (y / count - view.y) * scale, size: scale / count }
}

// Only touch targets are grouped; labels and the base map never move away from
// their geographic positions. Close markers separate as the map is zoomed in.
export function terrainMarkers(points, view, size) {
  let groups = points.map(point => ({ points: [point], ...terrainScreen(point, view, size) })).filter(p => p.x > -50 && p.x < size.width + 50 && p.y > -50 && p.y < size.height + 50)
  let pair
  do {
    pair = null
    let best = 46
    for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
      const distance = Math.hypot(groups[i].x - groups[j].x, groups[i].y - groups[j].y)
      if (distance < best) { best = distance; pair = [i, j] }
    }
    if (pair) {
      const [i, j] = pair, members = [...groups[i].points, ...groups[j].points]
      const positions = members.map(point => terrainScreen(point, view, size))
      groups[i] = { points: members, x: positions.reduce((sum, p) => sum + p.x, 0) / members.length, y: positions.reduce((sum, p) => sum + p.y, 0) / members.length }
      groups.splice(j, 1)
    }
  } while (pair)
  return groups.map(group => ({ ...group, id: group.points.map(point => point.id).sort().join('+') }))
}
