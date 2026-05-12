import { travelAtlasData } from './travelData'
import { galleryCollections } from './galleryData'
import { expeditionsData } from './expeditionsData'

const buildLookup = (items) => Object.fromEntries(items.map((item) => [item.id ?? item.slug, item]))

const atlasLookups = {
  continents: buildLookup(travelAtlasData.continents),
  countries: buildLookup(travelAtlasData.countries),
  specialRegions: buildLookup(travelAtlasData.specialRegions),
  places: buildLookup(travelAtlasData.places),
  summits: buildLookup(travelAtlasData.summits),
  films: buildLookup(travelAtlasData.films),
}

const expeditions = expeditionsData.map((expedition) => {
  const atlasNode = expedition.atlasNodeId
    ? atlasLookups.summits[expedition.atlasNodeId] || atlasLookups.places[expedition.atlasNodeId] || null
    : null

  const atlasFilm = expedition.atlasFilmId ? atlasLookups.films[expedition.atlasFilmId] : null

  return {
    ...expedition,
    filmUrl: atlasFilm?.url || expedition.filmUrl,
    atlasNode,
    atlasFilm,
  }
})

const galleriesBySlug = buildLookup(galleryCollections)
const expeditionsBySlug = buildLookup(expeditions)

export const contentData = {
  atlas: travelAtlasData,
  atlasLookups,
  galleries: galleryCollections,
  galleriesBySlug,
  expeditions,
  expeditionsBySlug,
}
