import { expeditionPages, sortExpeditionsNewest } from './expeditionPages.js'
import { galleryAtlasIds } from './tripGeography.js'

// Reuse approved geographic membership. A shared country alone does not make
// two mountain regions the same area (for example, Gorce and Tatry).
const areas = new Set(['tatry', 'alpy', 'switzerland', 'morocco', 'jura'])
const areaIds = trip => [
  ...galleryAtlasIds(trip.gallery).filter(id => areas.has(id)),
  ...(trip.gallery.collectionRegion === 'gorce' ? ['gorce'] : []),
]
const places = trip => [trip.gallery.mapNodeId, ...(trip.gallery.mapPlaces || []).map(place => place.id)]
  .filter(id => !areas.has(id))
const winter = trip => trip.kind.startsWith('Zimow')

export function relatedExpeditions(expedition, items = expeditionPages) {
  if (!expedition) return []
  const currentAreas = areaIds(expedition)
  const currentPlaces = places(expedition)
  const score = candidate =>
    (places(candidate).some(id => currentPlaces.includes(id)) ? 8 : 0) +
    (winter(expedition) === winter(candidate) ? 6 : 0) +
    (candidate.year === expedition.year ? 2 : 0) +
    (candidate.kind === expedition.kind ? 1 : 0)
  const candidates = items.filter(candidate => candidate.id !== expedition.id &&
    areaIds(candidate).some(id => currentAreas.includes(id)))
  // Latest first breaks ties deterministically without mutating the catalogue.
  return sortExpeditionsNewest(candidates).sort((a, b) => score(b) - score(a)).slice(0, 3)
}
