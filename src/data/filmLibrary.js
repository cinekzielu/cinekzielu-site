import { filterFilms, filmRegions } from './filmCatalog.js'

export const filmFormats = [
  { id: 'wszystkie', label: 'Wszystkie formaty' },
  { id: 'film', label: 'Pełne filmy', value: 'Film' },
  { id: 'krotki', label: 'Krótkie formy', value: 'Krótki film' },
  { id: 'zwiastun', label: 'Zwiastuny', value: 'Zwiastun' },
]
export const filmLengths = [
  { id: 'wszystkie', label: 'Dowolna długość' },
  { id: 'do-5', label: 'Do 5 minut', max: 300 },
  { id: '5-20', label: 'Ponad 5–20 minut', min: 300, max: 1200 },
  { id: '20-40', label: 'Ponad 20–40 minut', min: 1200, max: 2400 },
  { id: 'ponad-40', label: 'Ponad 40 minut', min: 2400 },
]
export const defaultFilmFilters = { region: 'wszystkie', query: '', format: 'wszystkie', length: 'wszystkie' }
const validId = (items, value) => items.some(item => item.id === value) ? value : 'wszystkie'
export const filmDurationSeconds = duration => duration.split(':').reduce((total, part) => total * 60 + Number(part), 0)
export function readFilmFilters(search) {
  const params = new URLSearchParams(search)
  return {
    region: validId(filmRegions, params.get('miejsce')), query: params.get('szukaj') || '',
    format: validId(filmFormats, params.get('format')), length: validId(filmLengths, params.get('czas')),
  }
}
export function filmLibraryHref(filters) {
  const params = new URLSearchParams()
  for (const [field, key] of [['region', 'miejsce'], ['format', 'format'], ['length', 'czas']]) {
    if (filters[field] !== 'wszystkie') params.set(key, filters[field])
  }
  if (filters.query.trim()) params.set('szukaj', filters.query)
  return `/filmy${params.size ? `?${params}` : ''}`
}
export function filterFilmLibrary(filters) {
  const format = filmFormats.find(item => item.id === filters.format)
  const length = filmLengths.find(item => item.id === filters.length)
  return filterFilms(filters.region, filters.query).filter(film => {
    const seconds = filmDurationSeconds(film.duration)
    return (!format?.value || film.format === format.value)
      && (length?.min === undefined || seconds > length.min)
      && (length?.max === undefined || seconds <= length.max)
  })
}
