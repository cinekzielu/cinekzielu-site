// Geographic membership is independent of a trip's year or primary collection.
// Switzerland in Across the Alps 2026 was confirmed by the owner on 2026-10-04.
// This is country/region coverage, not evidence of any particular summit visit.
export const tripGeography = {
  'szwajcaria-2025': { countries: ['switzerland'], areas: ['alpy'], filmRegions: ['szwajcaria', 'alpy'] },
  'alpy-2026': { countries: ['switzerland'], areas: ['alpy'], filmRegions: ['szwajcaria', 'alpy'] },
}

export const galleryAtlasIds = gallery => [...new Set([
  ...gallery.atlasNodeIds,
  ...(tripGeography[gallery.id]?.countries || []),
  ...(tripGeography[gallery.id]?.areas || []),
])]
export const filmMatchesRegion = (film, region) => film.region === region || Boolean(tripGeography[film.expeditionId]?.filmRegions.includes(region))
