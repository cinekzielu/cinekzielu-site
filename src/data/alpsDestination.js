import { expeditionPages } from './expeditionPages.js'
import { tripGeography } from './tripGeography.js'
import { summits } from './summits.js'
import { filmCatalog } from './filmCatalog.js'
import { portfolioPhotos } from './portfolioData.js'
import routes from './routeCatalog.json' with { type: 'json' }

const alpineTrips = expeditionPages.filter(trip => tripGeography[trip.id]?.areas.includes('alpy'))
export const alpsYears = [...new Set(alpineTrips.map(trip => String(trip.year)))].sort().reverse()
export const readAlpsYear = search => {
  const year = new URLSearchParams(search).get('rok')
  return alpsYears.includes(year) ? year : 'all'
}
export function getAlpsDestination(year = 'all') {
  const trips = alpineTrips.filter(trip => year === 'all' || String(trip.year) === year)
  const ids = new Set(trips.map(trip => trip.id))
  const films = filmCatalog.filter(film => ids.has(film.expeditionId))
  const tracks = routes.filter(route => route.region === 'Alpy' && (year === 'all' || route.sortDate.startsWith(year)))
  const peaks = summits.map(peak => ({ ...peak, ascents: peak.ascents.filter(ascent => ids.has(ascent.tripId)) })).filter(peak => peak.range === 'Alpy' && peak.ascents.length).sort((a,b) => b.altitude - a.altitude)
  const photos = trips.flatMap(trip => {
    const gallery = trip.gallery
    const candidates = [gallery.photos.find(photo => photo.src === gallery.coverImage), ...portfolioPhotos.filter(photo => gallery.photos.some(item => item.full === photo.full)), ...gallery.photos].filter(Boolean)
    return [...new Map(candidates.map(photo => [photo.full, photo])).values()].slice(0, year === 'all' ? 3 : 6)
  })
  return { trips, films, tracks, peaks, photos, photoCount: trips.reduce((count,trip) => count + trip.gallery.photos.length, 0) }
}
