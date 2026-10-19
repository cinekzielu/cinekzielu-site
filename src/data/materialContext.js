import { expeditionPages } from './expeditionPages.js'
import { summits } from './summits.js'
import { filmCatalog } from './filmCatalog.js'
import { galleryHref, galleryLinkLabel } from './galleryNavigation.js'
import routes from './routeCatalog.json' with { type: 'json' }
import { tripRoutes } from './tripRoutes.js'

export const tripById = Object.fromEntries(expeditionPages.map(trip => [trip.id, trip]))
const unique = values => [...new Set(values.filter(Boolean))]
const visits = summits.flatMap(peak => peak.ascents)
export const tripSeasons = id => id ? unique(visits.filter(visit => visit.tripId === id).map(visit => visit.season)) : []
export const seasonLabel = season => ({ lato:'Lato', zima:'Zima' }[season] || 'Sezon nieopisany')
export const filmVisits = film => visits.filter(visit => visit.filmIds.includes(film.youtubeId))
export const filmYears = film => film.expeditionId && tripById[film.expeditionId] ? [String(tripById[film.expeditionId].year)] : unique(filmVisits(film).map(visit => visit.year))
export const filmSeasons = film => film.expeditionId ? tripSeasons(film.expeditionId) : unique(filmVisits(film).map(visit => visit.season))

// These labels describe recorded visits, never a season inferred from a calendar month.
export function searchContext(item) {
  const [type, id] = item.id.split(':')
  const row = type === 'route' ? routes.find(route => route.id === id) : null
  const film = type === 'film' ? item.film : null
  const trip = tripById[type === 'expedition' || type === 'gallery' ? id : row?.trip || film?.expeditionId]
  const years = row ? [row.sortDate.slice(0,4)] : film ? filmYears(film) : trip ? [String(trip.year)] : []
  const seasons = film ? filmSeasons(film) : trip ? tripSeasons(trip.id) : []
  const linkedRoutes = row ? [row] : trip ? routes.filter(route => route.trip === trip.id) : []
  const films = film ? [film] : trip ? filmCatalog.filter(entry => entry.expeditionId === trip.id) : []
  const gallery = trip?.gallery
  const badges = [...years, ...seasons.map(seasonLabel)]
  if (row || trip || film) {
    if (!years.length) badges.push('Rok nieustalony')
    if (!seasons.length) badges.push('Sezon nieopisany')
    if (gallery?.photos.length) badges.push(`${galleryLinkLabel(gallery)} · ${gallery.photos.length}`)
    if (films.length) badges.push(`Film${films.length > 1 ? 'y' : ''} · ${films.length}`)
    if (linkedRoutes.length) badges.push(`GPX · ${linkedRoutes.length}`)
  }
  const actions = []
  if (gallery?.photos.length) actions.push({ href:galleryHref(gallery), label:galleryLinkLabel(gallery) })
  if (films.length) actions.push({ href:films.length === 1 ? films[0].youtubeUrl : `/wyprawy/${trip.id}#filmy`, label:films.length === 1 ? 'Obejrzyj film' : `Filmy (${films.length})` })
  for (const route of linkedRoutes.slice(0,2)) actions.push({ href:`/trasy?trasa=${route.id}`, label:linkedRoutes.length === 1 ? 'Zobacz trasę' : `Trasa: ${tripRoutes[route.id].title}` })
  return { badges, actions, contextWords:[...years, ...seasons.flatMap(season => season === 'zima' ? ['zima','zimą','zimowe'] : ['lato','latem','letnie'])].join(' ') }
}
