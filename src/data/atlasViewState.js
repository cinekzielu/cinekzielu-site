import { mercator, unproject, MIN_TERRAIN_ZOOM, MAX_TERRAIN_ZOOM } from './terrainMap.js'

export const ATLAS_SAVE_VIEW = 'cz-atlas-save-view'
export const ATLAS_VIEW_SAVED = 'cz-atlas-view-saved'

export function readTerrainView(search) {
  const params = new URLSearchParams(search)
  const values = params.get('kadr')?.split(',')
  if (values?.length !== 3 || values.some(value => !/^-?\d+(?:\.\d+)?$/.test(value))) return null
  const [lat, lng, zoom] = values.map(Number)
  if (![lat,lng,zoom].every(Number.isFinite) || Math.abs(lat) > 85.0511 || Math.abs(lng) > 180 || zoom < MIN_TERRAIN_ZOOM || zoom > MAX_TERRAIN_ZOOM) return null
  return { view:{...mercator({lat,lng}),zoom}, tone:readTerrainTone(search) }
}

export function readTerrainTone(search) {
  const tone = new URLSearchParams(search).get('podklad')
  return ['dark','natural'].includes(tone) ? tone : null
}

export function setTerrainView(params, view, tone) {
  const {lat,lng} = unproject(view)
  if (![lat,lng,view.zoom].every(Number.isFinite)) return params
  params.set('kadr',`${Math.max(-85.0511,Math.min(85.0511,lat)).toFixed(6)},${lng.toFixed(6)},${view.zoom.toFixed(3)}`)
  if (['dark','natural'].includes(tone)) params.set('podklad',tone)
  return params
}

// Sharing always opens the full atlas, including when copied from the homepage.
export function atlasViewHref(search, snapshot = null) {
  const source = new URLSearchParams(search), params = new URLSearchParams()
  for (const key of ['atlas','rok','obszar','miejsca']) if (source.has(key)) params.set(key,source.get(key))
  const saved = snapshot || readTerrainView(search)
  if (saved) setTerrainView(params,saved.view,saved.tone)
  return `/mapa${params.size ? `?${params}` : ''}`
}
