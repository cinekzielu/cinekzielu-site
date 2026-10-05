import { countryBounds } from './terrainCountryBounds.js'
import { atlasAncestry, atlasNodeById } from './atlasContent.js'
import { switzerlandPlaces } from './switzerlandPlaces.js'
import { moroccoPlaces, isMoroccoAtlas } from './moroccoPlaces.js'
import { tatryLocations } from './tatryAtlas.js'
import { countryPlaceIds } from './placeGeography.js'

const swiss = switzerlandPlaces.map(place => ({...place,lng:place.lon}))
const morocco = moroccoPlaces.map(place => ({...place,lng:place.lon}))
const countries = {
  switzerland: swiss,
  morocco,
  poland: tatryLocations.filter(point => countryPlaceIds.poland.includes(point.id)),
  slovakia: tatryLocations.filter(point => countryPlaceIds.slovakia.includes(point.id)),
}
const regionBounds = {
  alpy: [[43.8,5.2],[48.4,16.5]],
  jura: [[50.02,19.1],[50.85,20.05]],
  gorce: [[49.44,19.9],[49.68,20.35]],
}
const corners = bounds => bounds.map(([lat,lng]) => ({lat,lng}))

// Countries and mountain areas are stable geographic views, independent of trips.
// An area viewport is not a recorded route; only sourced locations become pins.
export function atlasTerrainProfile(id) {
  const path = atlasAncestry(id)
  let scope
  if (isMoroccoAtlas(id)) scope = 'morocco-atlas'
  else scope = [...path].reverse().find(node => node.kind === 'Kraj' || node.kind === 'Region')?.id
  if (!scope || scope === 'tatry') return null
  const node = atlasNodeById[scope]
  const locations = scope === 'alpy' ? swiss : scope === 'morocco-atlas' ? morocco.filter(point => point.group) : countries[scope] || []
  const bounds = countryBounds[scope] || regionBounds[scope]
  return {
    id:scope, name:node.name, locations, countryId:node.kind === 'Kraj' ? scope : null,
    locationById:Object.fromEntries(locations.map(point => [point.id,point])),
    overview:bounds ? corners(bounds) : locations,
    resetLabel:node.kind === 'Kraj' ? 'Cały kraj' : 'Cały obszar',
    focusZoom:scope === 'morocco' ? 11 : 13.5,
  }
}

export function readAtlasContext(search) {
  const params = new URLSearchParams(search)
  const scope = params.get('obszar'), id = params.get('atlas')
  const profile = scope && atlasTerrainProfile(scope)
  return profile?.id === scope && profile.locations.some(point => point.id === id) ? scope : null
}
