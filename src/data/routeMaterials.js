import { galleryData } from './galleryData.js'

// Availability belongs to the linked expedition, not an inferred GPS/photo match.
export function routeMaterials(row) {
  const gallery = galleryData.find(item => item.id === row?.trip)
  return {
    photos: Boolean(gallery?.photos.length && gallery.mediaKind !== 'video-frames'),
    film: Boolean(gallery?.films.length),
  }
}
export const materialFilters = [
  { id: 'all', label: 'Wszystkie materiały' },
  { id: 'zdjecia', label: 'Ze zdjęciami' },
  { id: 'film', label: 'Z filmem lub zwiastunem' },
  { id: 'oba', label: 'Zdjęcia i film' },
]
