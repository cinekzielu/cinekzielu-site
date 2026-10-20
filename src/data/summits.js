import { expeditionPages } from './expeditionPages.js'
import { findFilm, normalizeFilmSearch } from './filmCatalog.js'
import { galleryHref, galleryLinkLabel } from './galleryNavigation.js'
import { alpsStory } from './alpsStory.js'
import { tatryLocationById } from './tatryAtlas.js'
import auditedSummits from './auditedSummits.json' with { type: 'json' }

// An explicit ascent register, not every mountain visible on the atlas.
// Dates describe the visit, never the film's publication. See docs/SUMMITS.md.
const trips = Object.fromEntries(expeditionPages.map(trip => [trip.id, trip]))
const visit = (tripId, season, filmIds = [], extra = {}) => {
  const trip = trips[tripId]
  return {
    tripId, year: String(trip.year), season, date: trip.date,
    // A trip's start date cannot identify a particular summit day.
    orderDate: trip.sortDate, tripTitle: trip.title, tripHref: `/wyprawy/${tripId}`,
    mediaHref: galleryHref(trip.gallery), mediaLabel: galleryLinkLabel(trip.gallery),
    filmIds, evidence: `expedition:${tripId}`, ...extra,
  }
}
const undatedWinter = filmId => ({ year: null, season: 'zima', date: 'Rok nieustalony', orderDate: null, filmIds: [filmId], evidence: `film:${filmId}` })
const peak = (id, name, altitude, ascents, extra = {}) => ({
  id, name, altitude, range: 'Tatry', rangeName: 'Tatry Wysokie',
  altitudeSource: tatryLocationById[id]?.source,
  ascents, ...extra,
})
const tanap = 'https://www.tanap.sk/wp-content/uploads/TATRY_2022-6.pdf'

// Named GPX activities checked locally against the geographic summit.
// A month alone does not establish summer/winter climbing conditions.
const recordedVisit = (routeId, orderDate, date, extra = {}) => ({
  routeId, routeHref: `/trasy?trasa=${routeId}#profil`, year: orderDate.slice(0, 4),
  orderDate, date, season: null, filmIds: [], evidence: `gpx:${routeId}`, ...extra,
})

export const summits = [
  ...auditedSummits.map(item => {
    const tripId = item.id === 'kasprowy-wierch' ? 'swinica-2025' : item.id === 'klingenstock' ? 'szwajcaria-2025' : null
    const trip = tripId ? visit(tripId, item.season, item.id === 'klingenstock' ? ['KuZoxTnOmLs'] : []) : {}
    return peak(item.id, item.name, item.altitude, [recordedVisit(item.routeId, item.orderDate, item.date, {
      ...trip, orderDate: item.orderDate, year: item.orderDate.slice(0, 4), date: item.date, season: item.season, evidence: `gpx:${item.routeId}`,
    })], {
      range: item.range, rangeName: item.rangeName, altitudeSource: item.altitudeSource,
      mapHref: `/mapa?atlas=${item.id}`,
    })
  }),
  ...alpsStory.map(chapter => peak(chapter.id, chapter.title, chapter.altitude, [visit('alpy-2026', 'lato', ['l3KltGrKz2U'], {
    orderDate: '2026-08', sequence: Number(chapter.number), tripHref: `/wyprawy/alpy-2026#alpy-${chapter.id}`,
  })], { range: 'Alpy', rangeName: 'Alpy', altitudeSource: `https://www.openstreetmap.org/node/${chapter.osmNode}` })),
  peak('toubkal', 'Toubkal', 4167, [visit('maroko-2025', null, ['BiWk6apjJOg'], { orderDate: '2025', date: '2025' })], { range: 'Atlas Wysoki', rangeName: 'Atlas Wysoki', altitudeSource: 'https://www.openstreetmap.org/node/87828608' }),
  peak('gerlach', 'Gerlach', 2654, [visit('gerlach-zima-2025', 'zima'), recordedVisit('gerlach-2024', '2024-09-12', '12 września 2024')], { altitudeSource: 'https://www.tatry.sk/wp-content/uploads/2026/02/mapa-zima-2025-26.pdf' }),
  peak('lomnica', 'Łomnica', 2634, [visit('durny-lomnica-2025', 'lato', ['zb8zqv8gpZk'])], { altitudeSource: tanap }),
  peak('durny-szczyt', 'Durny Szczyt', 2621, [visit('durny-lomnica-2025', 'lato', ['WGqn-Kley2w'])]),
  peak('lodowy-szczyt', 'Lodowy Szczyt', 2627, [visit('baranie-rogi-lodowy-szczyt-2026', 'lato', ['eB5BItG2tfk'], { sequence: 2 }), recordedVisit('lodowy-2025', '2025-02-22', '22 lutego 2025')], { altitudeSource: tanap }),
  peak('lodowa-kopa', 'Lodowa Kopa', 2602, [visit('baranie-rogi-lodowy-szczyt-2026', 'lato', ['eB5BItG2tfk'], { sequence: 1 })]),
  peak('wysoka', 'Wysoka', 2560, [visit('wysoka-ganek-rysy-2026', 'lato'), undatedWinter('jTsfNdsWHxg')], { altitudeSource: 'https://www.tatry.sk/wp-content/uploads/2026/02/mapa-zima-2025-26.pdf' }),
  peak('kiezmarski-szczyt', 'Kieżmarski Szczyt', 2556, [visit('kiezmarski-szczyt-zima-2025', 'zima', ['IxTLYy6bOKo'], { sequence: 2 })]),
  peak('huncowski-szczyt', 'Huncowski Szczyt', 2352, [visit('kiezmarski-szczyt-zima-2025', 'zima', ['IxTLYy6bOKo'], { sequence: 1 })]),
  peak('konczysta', 'Kończysta', 2536, [visit('konczysta-2026', 'zima', ['7x1YlCGZvtI'])]),
  peak('baranie-rogi', 'Baranie Rogi', 2526, [
    visit('baranie-rogi-lodowy-szczyt-2026', 'lato', ['85Up2O2uc50'], { sequence: 0 }),
    visit('baranie-rogi-zima-2025', 'zima', ['0AtU5c83Y0M']),
  ]),
  peak('rysy', 'Rysy', 2499, [visit('wysoka-ganek-rysy-2026', 'lato')], { heightNote: 'Wysokość wierzchołka granicznego, zgodnego z punktem na mapie.' }),
  peak('krywan', 'Krywań', 2494, [visit('krywan-2025', 'lato')]),
  peak('ganek', 'Ganek', 2462, [visit('wysoka-ganek-rysy-2026', 'lato')]),
  peak('posrednia-gran', 'Pośrednia Grań', 2441, [visit('mieguszowiecki-posrednia-gran-2025', 'lato', ['04seL_yl4f0'])]),
  peak('mieguszowiecki-szczyt-wielki', 'Mięguszowiecki Szczyt Wielki', 2438, [visit('mieguszowiecki-posrednia-gran-2025', 'lato', ['PWbLPcNAh34'])]),
  peak('szatan', 'Szatan', 2421, [undatedWinter('sRjEFylb_b8')]),
  peak('swinica', 'Świnica', 2302, [visit('liptowskie-mury-2026', 'lato', ['ITjvjmavnNs']), visit('swinica-2025', 'lato', ['BJC4tc71d50'])]),
  peak('zabi-kon', 'Żabi Koń', 2291, [visit('zabi-kon-2026', 'lato', ['0YhbiEncSmo'])]),
  peak('szpiglasowy-wierch', 'Szpiglasowy Wierch', 2172, [visit('liptowskie-mury-2026', 'lato', ['ITjvjmavnNs']), visit('szpiglasowy-wierch-2025', 'lato')]),
  peak('walentkowy-wierch', 'Walentkowy Wierch', 2156, [visit('liptowskie-mury-2026', 'lato', ['ITjvjmavnNs'])]),
  peak('koscielec', 'Kościelec', 2155, [visit('koscielec-2026', 'zima', ['rs4zN-7f60Q', 'QRSSYlhRGMM']), recordedVisit('koscielec-orla-2024', '2024-08-04', '4 sierpnia 2024')]),
  peak('fronalpstock', 'Fronalpstock', 1922, [visit('szwajcaria-2025', 'lato', ['KuZoxTnOmLs'], { orderDate: '2025', date: '2025' })], { range: 'Alpy', rangeName: 'Alpy', altitudeSource: 'https://www.myswitzerland.com/de-ch/erlebnisse/fronalpstock-panorama-aussicht/' }),
  peak('augstmatthorn', 'Augstmatthorn', 2136, [visit('szwajcaria-2025', 'lato', ['1b1K6CUmHMI'], { orderDate: '2025', date: '2025' })], { range: 'Alpy', rangeName: 'Alpy', altitudeSource: 'https://www.sac-cas.ch/en/huts-and-tours/sac-route-portal/augstmatthorn-106/mountain-hiking/' }),
  peak('bettmerhorn', 'Bettmerhorn', 2857, [visit('szwajcaria-2025', 'lato', ['ksi5aauYYBo'], { orderDate: '2025', date: '2025' })], { range: 'Alpy', rangeName: 'Alpy', altitudeSource: 'https://www.sac-cas.ch/de/huetten-und-touren/sac-tourenportal/bettmerhorn-166/berg-und-alpinwandern/' }),
  peak('turbacz', 'Turbacz', 1310, [visit('turbacz-2026', 'zima')], { range: 'Gorce', rangeName: 'Gorce', altitudeSource: 'https://gpn.gov.pl/pliki-do-pobrania/otworz/fd75999c-f10f-4b57-b36c-9f300ff6bd14.pdf' }),
]

export const summitSeasons = [{ id: 'all', label: 'Wszystkie wejścia' }, { id: 'lato', label: 'Letnie' }, { id: 'zima', label: 'Zimowe' }]
export const summitRanges = [...new Set(summits.map(summit => summit.range))]
export const summitYears = [...new Set(summits.flatMap(summit => summit.ascents.map(ascent => ascent.year)).filter(Boolean))].sort().reverse()
export const defaultSummitFilters = { query: '', range: 'all', year: 'all', season: 'all', sort: 'height' }
export function readSummitFilters(search) {
  const params = new URLSearchParams(search)
  const option = (key, choices, fallback) => choices.includes(params.get(key)) ? params.get(key) : fallback
  return { query: (params.get('q') || '').slice(0, 100), range: option('pasmo', summitRanges, 'all'), year: option('rok', [...summitYears, 'unknown'], 'all'), season: option('sezon', ['lato', 'zima'], 'all'), sort: option('sort', ['latest'], 'height') }
}
export function summitFiltersHref(filters) {
  const params = new URLSearchParams()
  for (const [key, name] of [['query', 'q'], ['range', 'pasmo'], ['year', 'rok'], ['season', 'sezon'], ['sort', 'sort']]) {
    if (filters[key] && filters[key] !== defaultSummitFilters[key]) params.set(name, filters[key])
  }
  return '/szczyty' + (params.size ? `?${params}` : '')
}
// Partial dates form intervals. Month/year-only visits close their period in
// the list. The UI states this convention; no precise summit date is inferred.
export function ascentDateBounds(ascent) {
  if (!ascent.orderDate) return null
  const [year, month, day] = ascent.orderDate.split('-').map(Number)
  return [Date.UTC(year, (month || 1) - 1, day || 1), Date.UTC(year, (month || 12) - 1, day || new Date(Date.UTC(year, month || 12, 0)).getUTCDate())]
}
export function compareAscents(a, b) {
  const left = ascentDateBounds(a), right = ascentDateBounds(b)
  if (!left || !right) return left ? -1 : right ? 1 : 0
  if (a.tripId === b.tripId && a.sequence != null && b.sequence != null) return b.sequence - a.sequence
  return right[0] - left[0] || left[1] - right[1]
}
export function filterSummits(filters) {
  const terms = normalizeFilmSearch(filters.query).trim().split(/\s+/).filter(Boolean)
  return summits.filter(summit => (filters.range === 'all' || summit.range === filters.range) && terms.every(term => normalizeFilmSearch(`${summit.name} ${summit.rangeName}`).includes(term)))
    .map(summit => ({ ...summit, ascents: summit.ascents.filter(ascent => (filters.year === 'all' || (ascent.year || 'unknown') === filters.year) && (filters.season === 'all' || ascent.season === filters.season)).sort(compareAscents) }))
    .filter(summit => summit.ascents.length)
    .sort((a, b) => (filters.sort === 'latest' ? compareAscents(a.ascents[0], b.ascents[0]) : b.altitude - a.altitude) || b.altitude - a.altitude || a.name.localeCompare(b.name, 'pl'))
}
export const ascentFilms = ascent => ascent.filmIds.map(findFilm)
export const summitCountLabel = count => `${count} ${count === 1 ? 'szczyt' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'szczyty' : 'szczytów'}`
