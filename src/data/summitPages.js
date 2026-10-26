import { summits, summitYears, compareAscents, ascentFilms } from './summits.js'
import { expeditionPages } from './expeditionPages.js'
import { alpsStory } from './alpsStory.js'
import { summitRoutes } from './relatedRoutes.js'
import { galleryHref, galleryLinkLabel } from './galleryNavigation.js'

// These pages collect existing ascent records; they do not add new ascents or
// infer summit dates from GPS recordings or trip photographs.
const descriptions = {
  gerlach: 'Zimowa wyprawa z 2025 roku i zapis przejścia z września 2024. Wejścia, kadry z nagrań oraz dostępne trasy GPX.',
  'baranie-rogi': 'Letnie i zimowe wejścia z 2026 i 2025 roku. Fotografie, kadry z nagrań, filmy oraz zapisy przejść.',
  dufourspitze: 'Etap Across the Alps 2026 w masywie Monte Rosa. Opis wejścia, materiały z wyprawy oraz trzydniowy zapis GPS.',
}
const tripById = new Map(expeditionPages.map(trip => [trip.id, trip]))
const dufour = alpsStory.find(chapter => chapter.id === 'dufourspitze')
const tripCover = (trip, id) => id === 'dufourspitze'
  ? dufour.days[1].photos[2]
  : trip.gallery.photos.find(photo => photo.src === trip.gallery.coverImage) || trip.gallery.photos[0]

export const summitPages = Object.entries(descriptions).map(([id, description]) => {
  const summit = summits.find(peak => peak.id === id)
  const trip = tripById.get(summit.ascents.find(ascent => ascent.tripId).tripId)
  return {
    id, path: `/szczyty/${id}`, summit,
    title: `${summit.name} — wejścia i materiały | Cinek Zielu`, description,
    cover: tripCover(trip, id),
    coverLabel: id === 'dufourspitze' ? 'Dufourspitze · etap Across the Alps 2026' : `${trip.title} · ${trip.year}`,
    coverHref: id === 'dufourspitze' ? '/wyprawy/alpy-2026#alpy-dufourspitze' : galleryHref(trip.gallery),
  }
})

export const findSummitPage = id => summitPages.find(page => page.id === id)
const validYear = year => year === 'undated' ? 'unknown' : [...summitYears, 'unknown'].includes(year) ? year : 'all'
export const readSummitPageYear = search => validYear(new URLSearchParams(search).get('rok'))
export const summitPageHref = (id, year = 'all') => {
  const page = findSummitPage(id)
  if (!page) return null
  const selected = validYear(year)
  return page.path + (selected === 'all' ? '' : `?rok=${selected}`)
}
export const summitPageMapHref = (id, year = 'all') => {
  const selected = validYear(year)
  const params = new URLSearchParams({ atlas: id })
  if (selected !== 'all') params.set('rok', selected === 'unknown' ? 'undated' : selected)
  return `/mapa?${params}`
}
export const summitPageListHref = (id, year = 'all') => {
  const selected = validYear(year)
  const hasRow = findSummitPage(id)?.summit.ascents.some(ascent => selected === 'all' || (ascent.year || 'unknown') === selected)
  return `/szczyty${selected === 'all' ? '' : `?rok=${selected}`}${hasRow ? `#szczyt-${id}` : ''}`
}

export function getSummitPageContent(id, year = 'all') {
  const page = findSummitPage(id)
  if (!page) return null
  const selected = validYear(year)
  const ascents = page.summit.ascents.filter(ascent => selected === 'all' || (ascent.year || 'unknown') === selected).sort(compareAscents)
  const trips = [...new Set(ascents.map(ascent => ascent.tripId).filter(Boolean))].map(tripId => {
    const trip = tripById.get(tripId)
    return {
      ...trip,
      photo: tripCover(trip, id),
      href: id === 'dufourspitze' ? '/wyprawy/alpy-2026#alpy-dufourspitze' : galleryHref(trip.gallery),
      linkLabel: id === 'dufourspitze' ? 'Zdjęcia i opis etapu' : galleryLinkLabel(trip.gallery),
      scope: id === 'dufourspitze' ? 'Zdjęcia etapu Dufourspitze; pełna galeria i zwiastun obejmują całą wyprawę Across the Alps.' : trip.gallery.mediaKind === 'video-frames' ? 'Kadry z nagrań wyprawy.' : 'Fotografie z całej wyprawy, obejmującej także Lodowy Szczyt.',
    }
  })
  const films = [...new Map(ascents.flatMap(ascentFilms).map(film => [film.youtubeId, film])).values()]
  const routes = summitRoutes(id, { year: selected })
  const years = [...new Set([...page.summit.ascents.map(ascent => ascent.year || 'unknown'), ...summitRoutes(id).map(route => route.sortDate.slice(0, 4))])].sort().reverse()
  return { ...page, year: selected, ascents, trips, films, routes, years }
}
