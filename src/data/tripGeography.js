// Geographic membership is independent of a trip's year or primary collection.
import { alpsCountryIds, alpsPlaces } from './alpsPlaces.js'
// The five 2026 visits were confirmed in the author's post-trip account.
export const tripGeography = {
  'szwajcaria-2025': { countries: ['switzerland'], areas: ['alpy'], filmRegions: ['szwajcaria', 'alpy'] },
  'alpy-2026': { countries: alpsCountryIds, places: alpsPlaces.map(place => place.id), areas: ['alpy'], filmRegions: ['szwajcaria', 'alpy'] },
}

export const galleryAtlasIds = gallery => [...new Set([
  ...gallery.atlasNodeIds,
  ...(tripGeography[gallery.id]?.countries || []),
  ...(tripGeography[gallery.id]?.areas || []),
  ...(tripGeography[gallery.id]?.places || []),
])]
export const filmMatchesRegion = (film, region) => film.region === region || Boolean(tripGeography[film.expeditionId]?.filmRegions.includes(region))
