import { expeditionPages } from './expeditionPages.js'
import { summits } from './summits.js'
import { filmCatalog } from './filmCatalog.js'
import { portfolioPhotos } from './portfolioData.js'
import { isVideoCollection, isTripPhotoCollection } from './galleryNavigation.js'
import { tripSeasons, filmYears, filmSeasons } from './materialContext.js'
import routes from './routeCatalog.json' with { type:'json' }

const trips = expeditionPages.filter(trip => trip.region.startsWith('Tatry'))
const tracks = routes.filter(route => route.region === 'Tatry')
export const tatryYears = [...new Set([...trips.map(trip => String(trip.year)), ...tracks.map(route => route.sortDate.slice(0,4))])].sort().reverse()
export function readTatryFilters(search) {
  const params = new URLSearchParams(search)
  return { year:[...tatryYears,'unknown'].includes(params.get('rok')) ? params.get('rok') : 'all', season:['lato','zima'].includes(params.get('sezon')) ? params.get('sezon') : 'all' }
}
export function tatryHref({ year='all', season='all' } = {}) {
  const params = new URLSearchParams()
  if (year !== 'all') params.set('rok',year)
  if (season !== 'all') params.set('sezon',season)
  return '/kierunki/tatry' + (params.size ? `?${params}` : '')
}
export function getTatryDestination({ year='all', season='all' } = {}) {
  const matchesYear = values => year === 'all' || (year === 'unknown' ? values.length === 0 : values.includes(year))
  const matchesSeason = values => season === 'all' || values.includes(season)
  const selectedTrips = trips.filter(trip => matchesYear([String(trip.year)]) && matchesSeason(tripSeasons(trip.id)))
  const galleries = selectedTrips.map(trip => trip.gallery).filter(gallery => !isVideoCollection(gallery) && !isTripPhotoCollection(gallery))
  const assets = new Set(galleries.flatMap(gallery => gallery.photos.map(photo => photo.full)))
  const photos = [...new Map([...portfolioPhotos.filter(photo => assets.has(photo.full)), ...galleries.map(gallery => gallery.photos.find(photo => photo.src === gallery.coverImage))].filter(Boolean).map(photo => [photo.full,photo])).values()].slice(0,6)
  const films = filmCatalog.filter(film => film.region === 'tatry' && matchesYear(filmYears(film)) && matchesSeason(filmSeasons(film)))
  const selectedTracks = tracks.filter(route => matchesYear([route.sortDate.slice(0,4)]) && matchesSeason(tripSeasons(route.trip)))
  const peaks = summits.filter(peak => peak.range === 'Tatry').map(peak => ({ ...peak, ascents:peak.ascents.filter(ascent => matchesYear(ascent.year ? [ascent.year] : []) && matchesSeason(ascent.season ? [ascent.season] : [])) })).filter(peak => peak.ascents.length).sort((a,b) => b.altitude-a.altitude)
  return { trips:selectedTrips, galleries, photos, films, tracks:selectedTracks, peaks, photoCount:galleries.reduce((n,gallery)=>n+gallery.photos.length,0), unclassifiedTracks:tracks.filter(route => !tripSeasons(route.trip).length).length }
}
