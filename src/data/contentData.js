import { travelAtlasData } from './travelData'
import { galleryData } from './galleryData'
import { expeditionsData } from './expeditionsData'

const buildLookup = (items) => Object.fromEntries(items.map((item) => [item.id, item]))

const atlasLookups = {
  continents: buildLookup(travelAtlasData.continents),
  countries: buildLookup(travelAtlasData.countries),
  specialRegions: buildLookup(travelAtlasData.specialRegions),
  places: buildLookup(travelAtlasData.places),
  summits: buildLookup(travelAtlasData.summits),
  films: buildLookup(travelAtlasData.films),
}

const expeditions = expeditionsData.map((expedition) => {
  const atlasNode = expedition.mapNodeId
    ? atlasLookups.summits[expedition.mapNodeId] || atlasLookups.places[expedition.mapNodeId] || null
    : null

  return {
    ...expedition,
    slug: expedition.id,
    filmUrl: expedition.youtubeUrl,
    atlasNode,
    atlasNodeId: expedition.mapNodeId,
    galleryCollectionSlug: expedition.galleryId,
    heroImage: expedition.coverImage,
    mood: expedition.shortDescription,
    stats: {
      region: expedition.region,
      filmFormat: expedition.type,
      height: expedition.routeInfo?.elevationGain ?? 'wkrótce',
    },
  }
})

const galleryCollections = galleryData.map((gallery) => ({
  ...gallery,
  slug: gallery.id,
  description: gallery.subtitle,
  cover: gallery.coverImage,
  photos: [],
}))

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
