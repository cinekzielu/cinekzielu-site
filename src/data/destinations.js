import { expeditionPages } from './expeditionPages.js'
import { filterCollections } from './collectionFilters.js'
import { filmCatalog } from './filmCatalog.js'
import { isVideoCollection, isTripPhotoCollection } from './galleryNavigation.js'
import routes from './routeCatalog.json' with { type: 'json' }

// Existing material only. Country collections may link a journey spanning several countries.
export const destinations = [
  { id:'tatry', name:'Tatry', type:'Pasmo', area:'Polska i Słowacja', atlas:'tatry', coverTrip:'konczysta-2026', description:'Letnie granie, zimowe wejścia i zapisane przejścia.', region:'Tatry', existing:true },
  { id:'alpy', name:'Alpy', type:'Pasmo', area:'Europa', atlas:'alpy', coverTrip:'alpy-2026', description:'Szwajcaria i pięć szczytów Across the Alps.', region:'Alpy', existing:true },
  { id:'szwajcaria', name:'Szwajcaria', type:'Kraj', area:'Europa', atlas:'switzerland', coverTrip:'szwajcaria-2025', description:'Jeziora, górskie szlaki i Dufourspitze.', country:'Szwajcaria' },
  { id:'maroko', name:'Maroko', type:'Kraj', area:'Afryka', atlas:'morocco', coverTrip:'maroko-2025', description:'Podróż przez Maroko i wejście na Toubkal.', country:'Maroko' },
  { id:'wlochy', name:'Włochy', type:'Kraj', area:'Sycylia', atlas:'italy', coverTrip:'katania-2026', description:'Katania, wybrzeże Taorminy i zbocza Etny.', country:'Włochy' },
  { id:'wegry', name:'Węgry', type:'Kraj', area:'Hungaroring', atlas:'hungary', coverTrip:'hungaroring-2026', description:'Weekend wyścigowy i fotografie z toru.', country:'Węgry' },
]
export const destinationHref = destination => `/kierunki/${destination.id}`
export function getDestination(id) {
  const destination = destinations.find(item => item.id === id)
  if (!destination) return null
  const trips = filterCollections(expeditionPages, { place:id, year:'wszystkie' })
  const tripIds = new Set(trips.map(trip => trip.id))
  const films = filmCatalog.filter(film => tripIds.has(film.expeditionId) || film.region === id)
  const tracks = routes.filter(route => destination.region ? route.region === destination.region : route.country.split(/\s*[·/,]\s*/).includes(destination.country))
  const galleries = trips.filter(trip => !isVideoCollection(trip.gallery) && !isTripPhotoCollection(trip.gallery))
  const coverTrip = trips.find(trip => trip.id === destination.coverTrip)
  const cover = coverTrip.gallery.photos.find(photo => photo.src === coverTrip.gallery.coverImage) || coverTrip.gallery.photos[0]
  return { ...destination, trips, films, tracks, galleries, cover,
    coverKind: isVideoCollection(coverTrip.gallery) ? 'Kadr z filmu' : 'Fotografia',
  }
}
