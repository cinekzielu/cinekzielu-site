import { expeditionPages } from './expeditionPages.js'
import { summits } from './summits.js'
import { filmCatalog } from './filmCatalog.js'
import { portfolioPhotos } from './portfolioData.js'
import { isVideoCollection, isTripPhotoCollection } from './galleryNavigation.js'
import routes from './routeCatalog.json' with { type: 'json' }

export const seasonYears = ['2026', '2025']
const featured = {
  '2026': ['alpy-2026', 'katania-2026', 'hungaroring-2026'],
  '2025': ['szwajcaria-2025', 'maroko-2025', 'durny-lomnica-2025'],
}
export function getSeason(year) {
  if (!seasonYears.includes(String(year))) return null
  const trips = expeditionPages.filter(trip => String(trip.year) === String(year))
  const tripIds = new Set(trips.map(trip => trip.id))
  const peaks = summits.map(peak => ({ ...peak, ascents: peak.ascents.filter(ascent => ascent.year === String(year)) })).filter(peak => peak.ascents.length).sort((a, b) => b.altitude - a.altitude)
  const ascents = peaks.flatMap(peak => peak.ascents)
  const films = filmCatalog.filter(film => tripIds.has(film.expeditionId))
  const tracks = routes.filter(route => route.sortDate.startsWith(String(year)) && tripIds.has(route.trip))
  const galleries = trips.map(trip => trip.gallery).filter(gallery => !isVideoCollection(gallery) && !isTripPhotoCollection(gallery))
  const assets = new Set(galleries.flatMap(gallery => gallery.photos.map(photo => photo.full)))
  const selectedTrips = featured[year].map(id => trips.find(trip => trip.id === id)).filter(Boolean)
  const heroTrip = selectedTrips[0]
  const photos = [...new Map([
    ...portfolioPhotos.filter(photo => assets.has(photo.full)),
    ...galleries.map(gallery => gallery.photos.find(photo => photo.src === gallery.coverImage)).filter(Boolean),
  ].map(photo => [photo.full, photo])).values()].slice(0, 6)
  return {
    year: String(year), trips, peaks, ascents, films, tracks, galleries, photos, selectedTrips,
    hero: heroTrip.gallery.photos.find(photo => photo.src === heroTrip.gallery.coverImage),
    heroTrip,
    photoCount: galleries.reduce((sum, gallery) => sum + gallery.photos.length, 0),
    summer: ascents.filter(ascent => ascent.season === 'lato').length,
    winter: ascents.filter(ascent => ascent.season === 'zima').length,
    unknownSeason: ascents.filter(ascent => !ascent.season).length,
    distance: tracks.reduce((sum, track) => sum + track.distance, 0),
    ascentEstimate: tracks.reduce((sum, track) => sum + track.ascentEstimate, 0),
  }
}
