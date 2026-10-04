import { travelAtlasData } from './travelData.js'
import { europeAtlasNodes } from './europeAtlasData.js'
import { galleryData } from './galleryData.js'
import { filmCatalog, normalizeFilmSearch } from './filmCatalog.js'

// Content associations only. Geometry, SVG IDs and summit coordinates remain in their original sources.
const summitFilms = {
  lomnica: ['zb8zqv8gpZk'], koscielec: ['rs4zN-7f60Q', 'QRSSYlhRGMM'],
  'durny-szczyt': ['WGqn-Kley2w'], swinica: ['BJC4tc71d50'],
  'lodowy-szczyt': ['eB5BItG2tfk'], 'baranie-rogi': ['85Up2O2uc50', '0AtU5c83Y0M'],
  'kiezmarski-szczyt': ['IxTLYy6bOKo'], konczysta: ['7x1YlCGZvtI'],
  szatan: ['sRjEFylb_b8'], 'posrednia-gran': ['04seL_yl4f0'],
  wysoka: ['jTsfNdsWHxg'], 'mieguszowiecki-szczyt-wielki': ['PWbLPcNAh34'],
}

const countries = europeAtlasNodes.filter(node => ['country', 'microstate'].includes(node.type)).map(node => ({
  id: node.id, name: node.label, kind: 'Kraj', parent: 'europe', view: 'europe',
  ...(node.id === 'switzerland' ? { regions: ['szwajcaria'] } : {}),
  ...(node.id === 'poland' ? { regions: ['jura'], filmIds: ['rs4zN-7f60Q', 'QRSSYlhRGMM', 'BJC4tc71d50'], related: ['tatry', 'jura'] } : {}),
  ...(node.id === 'slovakia' ? { related: ['tatry'], filmIds: Object.entries(summitFilms).filter(([id]) => !['koscielec', 'swinica', 'mieguszowiecki-szczyt-wielki'].includes(id)).flatMap(([, films]) => films) } : {}),
}))

export const atlasContentNodes = [
  { id: 'world', name: 'Świat', kind: 'Mapa wypraw', view: 'world', all: true, description: 'Wybierz miejsce i zobacz materiały z podróży.' },
  { id: 'europe', name: 'Europa', kind: 'Kontynent', parent: 'world', view: 'europe', regions: ['tatry', 'szwajcaria', 'alpy', 'jura'], description: 'Tatry, Alpy i wspinanie na Jurze.' },
  { id: 'africa', name: 'Afryka', kind: 'Kontynent', parent: 'world', view: 'world', regions: ['maroko'], related: ['morocco'], description: 'Filmy z podróży po Maroku.' },
  ...travelAtlasData.continents.filter(node => !['europe', 'africa'].includes(node.id)).map(node => ({ id: node.id, name: node.name, kind: 'Kontynent', parent: 'world', view: 'world' })),
  ...countries,
  { id: 'tatry', name: 'Tatry', kind: 'Region', parent: 'europe', view: 'tatry', regions: ['tatry'], description: 'Zimowe wejścia, granie i filmy ze szczytów.' },
  { id: 'alpy', name: 'Alpy', kind: 'Region', parent: 'europe', view: 'europe', regions: ['alpy'], description: 'Fotografie z wyprawy w 2026 roku i jej zwiastun.' },
  { id: 'jura', name: 'Jura', kind: 'Region', parent: 'poland', view: 'europe', regions: ['jura'], description: 'Wspinanie w Dolinie Kobylańskiej.' },
  { id: 'morocco', name: 'Maroko', kind: 'Kraj', parent: 'africa', view: 'world', regions: ['maroko'], description: 'Podróż przez Maroko i wejście na Toubkal.' },
  ...travelAtlasData.summits.map(node => ({ id: node.id, name: node.id === 'kiezmarski-szczyt' ? 'Kieżmarski Szczyt' : node.name, kind: 'Szczyt', altitude: node.altitude, parent: 'tatry', view: 'tatry', filmIds: summitFilms[node.id] || [] })),
  { id: 'zabi-kon', name: 'Żabi Koń', kind: 'Szczyt', parent: 'tatry', view: 'tatry', filmIds: ['0YhbiEncSmo'] },
  { id: 'liptowskie-mury', name: 'Liptowskie Mury', kind: 'Przejście grani', parent: 'tatry', view: 'tatry', filmIds: ['ITjvjmavnNs'] },
  ...[
    ['saxer-lucke', 'Saxer Lücke', 'BZOKvQHvtCk'], ['fronalpstock', 'Fronalpstock', 'KuZoxTnOmLs'],
    ['augstmatthorn', 'Augstmatthorn', '1b1K6CUmHMI'], ['murren-gimmelwald', 'Mürren–Gimmelwald', 'qOHEK1qbjIU'],
    ['zermatt', 'Zermatt', 'nt6Upyoop1g'], ['bettmerhorn', 'Bettmerhorn', 'ksi5aauYYBo'],
  ].map(([id, name, filmId]) => ({ id, name, kind: 'Miejsce', parent: 'switzerland', view: 'europe', filmIds: [filmId] })),
  { id: 'toubkal', name: 'Toubkal', kind: 'Szczyt', parent: 'morocco', view: 'world', filmIds: ['BiWk6apjJOg'] },
]

export const atlasNodeById = Object.fromEntries(atlasContentNodes.map(node => [node.id, node]))
export const atlasQuickIds = ['tatry', 'switzerland', 'alpy', 'morocco', 'jura']
export const readAtlasSelection = (search = window.location.search) => {
  const id = new URLSearchParams(search).get('atlas')
  return atlasNodeById[id] ? id : 'world'
}
export function atlasAncestry(id) {
  const result = []
  let node = atlasNodeById[id]
  while (node) { result.unshift(node); node = atlasNodeById[node.parent] }
  return result
}
export function getAtlasMaterials(id) {
  const node = atlasNodeById[id] || atlasNodeById.world
  const films = filmCatalog.filter(film => node.all || node.regions?.includes(film.region) || node.filmIds?.includes(film.youtubeId))
  const relatedIds = new Set(films.map(film => film.expeditionId).filter(Boolean))
  const galleries = galleryData.filter(gallery => node.all || relatedIds.has(gallery.id) || gallery.atlasNodeIds.includes(id))
  return { films, galleries, photoCount: galleries.reduce((sum, gallery) => sum + gallery.photos.length, 0) }
}
export const hasAtlasMaterials = (id) => {
  const { films, galleries } = getAtlasMaterials(id)
  return Boolean(films.length || galleries.length)
}
export const searchAtlasNodes = (query, candidates = atlasContentNodes) => {
  const terms = normalizeFilmSearch(query).trim().split(/\s+/).filter(Boolean)
  return candidates.filter(node => terms.every(term => normalizeFilmSearch(atlasAncestry(node.id).map(item => item.name).join(' ')).includes(term)))
}
export const atlasHref = (id = 'world') => `/mapa${id === 'world' ? '' : `?atlas=${encodeURIComponent(id)}`}`
export const atlasFilmLibraryHref = (id) => {
  const node = atlasNodeById[id]
  if (node.regions?.length === 1) return `/filmy?miejsce=${node.regions[0]}`
  if (node.filmIds?.length) return `/filmy?szukaj=${encodeURIComponent(node.name)}`
  return '/filmy'
}
