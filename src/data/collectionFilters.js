import { galleryAtlasIds } from './tripGeography.js'

const places = [
  { id: 'tatry', label: 'Tatry', nodeId: 'tatry' },
  { id: 'gorce', label: 'Gorce', regionId: 'gorce' },
  { id: 'alpy', label: 'Alpy', nodeId: 'alpy' },
  { id: 'szwajcaria', label: 'Szwajcaria', nodeId: 'switzerland' },
  { id: 'maroko', label: 'Maroko', nodeId: 'morocco' },
  { id: 'jura', label: 'Jura', nodeId: 'jura' },
]
const galleryOf = item => item.gallery || item
const matchesPlace = (item, place) => place.regionId
  ? galleryOf(item).collectionRegion === place.regionId
  : galleryAtlasIds(galleryOf(item)).includes(place.nodeId)
export const allCollectionFilters = { place: 'wszystkie', year: 'wszystkie' }

export function collectionOptions(items) {
  return {
    places: places.filter(place => items.some(item => matchesPlace(item, place))),
    years: [...new Set(items.map(item => String(item.year)))].sort((a, b) => Number(b) - Number(a)),
  }
}

export function readCollectionFilters(search, options) {
  const params = new URLSearchParams(search)
  return {
    place: options.places.some(place => place.id === params.get('miejsce')) ? params.get('miejsce') : 'wszystkie',
    year: options.years.includes(params.get('rok')) ? params.get('rok') : 'wszystkie',
  }
}

export function collectionFilterSearch(filters) {
  const params = new URLSearchParams()
  if (filters.place !== 'wszystkie') params.set('miejsce', filters.place)
  if (filters.year !== 'wszystkie') params.set('rok', filters.year)
  return params.size ? `?${params}` : ''
}

export function filterCollections(items, filters) {
  const place = places.find(item => item.id === filters.place)
  return items.filter(item => (!place || matchesPlace(item, place)) &&
    (filters.year === 'wszystkie' || String(item.year) === filters.year))
}
