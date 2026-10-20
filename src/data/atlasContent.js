import { supplementalSummitPlaces } from './supplementalSummitPlaces.js'
import { summits } from './summits.js'
import { summitRoutes } from './relatedRoutes.js'
import { tripRoutes } from './tripRoutes.js'
import { plannedSummits } from './plannedSummits.js'
import { travelAtlasData } from './travelData.js'
import { europeAtlasNodes } from './europeAtlasData.js'
import { galleryData } from './galleryData.js'
import { filmCatalog, normalizeFilmSearch } from './filmCatalog.js'
import { moroccoPlaces, moroccoAtlas, moroccoMapPlaces } from './moroccoPlaces.js'
import { switzerlandPlaces } from './switzerlandPlaces.js'
import { galleryAtlasIds, filmMatchesRegion } from './tripGeography.js'
import { countryPlaceIds } from './placeGeography.js'
import { sicilyPlaces, hungaryPlaces } from './summer2026Places.js'
import { alpsCountryIds, alpsPlaces } from './alpsPlaces.js'

// Content associations only. Geometry, SVG IDs and summit coordinates remain in their original sources.
const summitFilms = {
  lomnica: ['zb8zqv8gpZk'], koscielec: ['rs4zN-7f60Q', 'QRSSYlhRGMM'],
  'durny-szczyt': ['WGqn-Kley2w'], swinica: ['BJC4tc71d50', 'ITjvjmavnNs'],
  'lodowy-szczyt': ['eB5BItG2tfk'], 'baranie-rogi': ['85Up2O2uc50', '0AtU5c83Y0M'],
  'kiezmarski-szczyt': ['IxTLYy6bOKo'], konczysta: ['7x1YlCGZvtI'],
  szatan: ['sRjEFylb_b8'], 'posrednia-gran': ['04seL_yl4f0'],
  wysoka: ['jTsfNdsWHxg'], 'mieguszowiecki-szczyt-wielki': ['PWbLPcNAh34'],
}

const countries = europeAtlasNodes.filter(node => ['country', 'microstate'].includes(node.type)).map(node => ({
  id: node.id, name: node.label, kind: 'Kraj', parent: 'europe', view: 'terrain',
  ...(alpsCountryIds.includes(node.id) ? { related: ['alpy'], description: `Across the Alps 2026 · ${alpsPlaces.find(place => place.parent === node.id).name}. Miejsca i materiały z podróży.` } : {}),
  ...(node.id === 'romania' ? { description: 'Rowerowa wyprawa przez Rumunię w lipcu 2024. Zdjęcia z drogi i biwaków.' } : {}),
  ...(node.id === 'italy' ? { related:['sicily'], description:'Sycylia: Katania, Taormina i wulkaniczne krajobrazy Etny.' } : {}),
  ...(node.id === 'hungary' ? { regions:['wegry'], description:'Hungaroring — fotografie i film z weekendu Formuły 1.' } : {}),
  ...(node.id === 'switzerland' ? { regions: ['szwajcaria'], related:['alpy'], description:'Miejsca i materiały ze Szwajcarii. Wybierz rok lub zobacz wszystkie podróże.' } : {}),
  ...(node.id === 'poland' ? { regions: ['jura'], filmIds: ['rs4zN-7f60Q', 'QRSSYlhRGMM', 'BJC4tc71d50'], related: ['tatry', 'gorce', 'jura'] } : {}),
  ...(node.id === 'slovakia' ? { related: ['tatry'], filmIds: Object.entries(summitFilms).filter(([id]) => !['koscielec', 'swinica', 'mieguszowiecki-szczyt-wielki'].includes(id)).flatMap(([, films]) => films) } : {}),
}))

export const atlasContentNodes = [
  { id: 'world', name: 'Świat', kind: 'Mapa wypraw', view: 'world', all: true, description: 'Wybierz miejsce i zobacz materiały z podróży.' },
  { id: 'europe', name: 'Europa', kind: 'Kontynent', parent: 'world', view: 'europe', regions: ['tatry', 'szwajcaria', 'alpy', 'jura', 'wegry'], description: 'Góry, miasta i miejsca z podróży po Europie.' },
  { id: 'africa', name: 'Afryka', kind: 'Kontynent', parent: 'world', view: 'africa', regions: ['maroko'], related: ['morocco'], description: 'Filmy z podróży po Maroku.' },
  ...travelAtlasData.continents.filter(node => !['europe', 'africa'].includes(node.id)).map(node => ({ id: node.id, name: node.name, kind: 'Kontynent', parent: 'world', view: 'world' })),
  ...countries,
  { id:'sicily', name:'Sycylia', kind:'Region', parent:'italy', view:'terrain', description:'Katania, Taormina i zbocza Etny. Fotografie z podróży w czerwcu 2026.' },
  ...sicilyPlaces,
  ...hungaryPlaces,
  { id: 'tatry', name: 'Tatry', kind: 'Region', parent: 'europe', view: 'tatry', regions: ['tatry'], description: 'Zimowe wejścia, granie i filmy ze szczytów.' },
  { id: 'alpy', name: 'Alpy', kind: 'Region', parent: 'europe', view: 'terrain', regions: ['alpy'], related:alpsCountryIds, description: 'Alpy ponad granicami krajów. Wspólna mapa miejsc i wypraw z różnych lat.' },
  { id: 'jura', name: 'Jura', kind: 'Region', parent: 'poland', view: 'terrain', regions: ['jura'], description: 'Wspinanie w Dolinie Kobylańskiej.' },
  { id: 'gorce', name: 'Gorce', kind: 'Region', parent: 'poland', view: 'terrain', related: ['turbacz'], description: 'Zimowa wyprawa na Turbacz.' },
  { id: 'turbacz', name: 'Turbacz', kind: 'Szczyt', parent: 'gorce', view: 'terrain', description: 'Fotografie z zimowej wyprawy w styczniu 2026.' },
  { id: 'morocco', name: 'Maroko', kind: 'Kraj', parent: 'africa', view: 'terrain', regions: ['maroko'], related:['morocco-atlas'], description: 'Od Rabatu i Fezu przez Saharę po Atlas Wysoki. Wybierz ikonę miejsca i obejrzyj ten fragment podróży.' },
  ...travelAtlasData.summits.map(node => ({ id: node.id, name: node.id === 'kiezmarski-szczyt' ? 'Kieżmarski Szczyt' : node.name, kind: 'Szczyt', altitude: node.altitude, parent: 'tatry', view: 'tatry', filmIds: summitFilms[node.id] || [] })),
  { id: 'zabi-kon', name: 'Żabi Koń', kind: 'Szczyt', parent: 'tatry', view: 'tatry', filmIds: ['0YhbiEncSmo'] },
  { id: 'lodowa-kopa', name: 'Lodowa Kopa', kind: 'Szczyt', parent: 'tatry', view: 'tatry', filmIds: ['eB5BItG2tfk'], description: 'Na drodze na Lodowy Szczyt. Letnia wyprawa z 2026 roku.' },
  { id: 'huncowski-szczyt', name: 'Huncowski Szczyt', kind: 'Szczyt', parent: 'tatry', view: 'tatry', filmIds: ['IxTLYy6bOKo'], description: 'Zimowe wejście w drodze na Kieżmarski Szczyt.' },
  { id: 'szpiglasowy-wierch', name: 'Szpiglasowy Wierch', kind: 'Szczyt', parent: 'tatry', view: 'tatry', filmIds: ['ITjvjmavnNs'], description: 'Galeria z sierpnia 2025 i film z przejścia Liptowskich Murów w 2026.' },
  { id: 'liptowskie-mury', name: 'Liptowskie Mury', kind: 'Przejście grani', parent: 'tatry', view: 'tatry', filmIds: ['ITjvjmavnNs'] },
  { id: 'walentkowa-gran', name: 'Walentkowa Grań', kind: 'Przejście grani', parent: 'tatry', view: 'tatry', filmIds: ['ITjvjmavnNs'] },
  { id: 'walentkowy-wierch', name: 'Walentkowy Wierch', kind: 'Szczyt', parent: 'tatry', view: 'tatry', filmIds: ['ITjvjmavnNs'] },
  ...switzerlandPlaces.map(place => ({...place, view:'terrain'})),
  ...alpsPlaces,
  ...supplementalSummitPlaces,
  ...plannedSummits,
  {...moroccoAtlas, view:'terrain'},
  ...moroccoPlaces.map(place => ({...place, view:'terrain'})),
]

// The ascent register supplies confirmed film associations and official heights.
for (const summit of summits) {
  const node = atlasContentNodes.find(node => node.id === summit.id)
  if (!node) throw new Error(`Missing summit in atlas: ${summit.id}`)
  node.altitude = `${summit.altitude} m`
  node.filmIds = [...new Set([...(node.filmIds || []), ...summit.ascents.flatMap(a => a.filmIds).filter(id => filmCatalog.find(f => f.youtubeId === id)?.format !== 'Zwiastun')])]
}

const summitRouteIndex = new Map(summits.map(peak => [peak.id, summitRoutes(peak.id)]))

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
// Show places inside the selected country/region, retaining siblings at a leaf.
export function atlasListNodes(id) {
  const path = atlasAncestry(id)
  if (id === 'alpy') return [...switzerlandPlaces, ...alpsPlaces, ...supplementalSummitPlaces.filter(p => p.parent === 'switzerland'), ...plannedSummits].map(place => atlasNodeById[place.id])
  if (path.some(node => node.id === 'morocco')) return moroccoMapPlaces(id).map(node => atlasNodeById[node.id])
  for (const ancestor of [...path].reverse()) {
    if (ancestor.id === 'world') return atlasQuickIds.map(key => atlasNodeById[key])
    if (ancestor.id === 'europe') return atlasContentNodes.filter(node => node.parent === 'europe' || node.id === 'jura')
    const children = atlasContentNodes.filter(node => node.parent === ancestor.id)
    if (children.length) return children
  }
  return []
}
export function getAtlasMaterials(id, year = 'all') {
  const node = atlasNodeById[id] || atlasNodeById.world
  const placeIds = new Set([id, ...(countryPlaceIds[id] || [])])
  if (['Region','Kontynent'].includes(node.kind)) {
    for (const place of atlasContentNodes) if (atlasAncestry(place.id).some(ancestor => ancestor.id === id) || (id === 'alpy' && place.parent === 'switzerland')) placeIds.add(place.id)
  }
  const range = { alpy: 'Alpy', 'morocco-atlas': 'Atlas Wysoki' }[id]
  if (range) for (const peak of summits) if (peak.range === range) placeIds.add(peak.id)
  const registered = summits.filter(peak => node.all || placeIds.has(peak.id))
  const ascents = registered.flatMap(peak => peak.ascents).filter(a => year === 'all' || (a.year || 'undated') === year)
  const routes = [...new Map(registered.flatMap(peak => summitRouteIndex.get(peak.id).filter(row => year === 'all' || row.sortDate.slice(0,4) === year)).map(row => [row.id, { ...row, title: tripRoutes[row.id].title, dates: tripRoutes[row.id].dates }])).values()].sort((a,b) => b.sortDate.localeCompare(a.sortDate))
  const placeFilms = new Set([...placeIds].flatMap(place => atlasNodeById[place]?.filmIds || []))
  const tripIds = new Set(galleryData.filter(gallery => galleryAtlasIds(gallery).some(place => placeIds.has(place))).map(gallery => gallery.id))
  for (const ascent of ascents) if (ascent.tripId) tripIds.add(ascent.tripId)
  const aggregateTrips = ['Kraj','Region','Kontynent'].includes(node.kind)
  const filmYear = film => String(galleryData.find(gallery => gallery.id === film.expeditionId)?.year || 'undated')
  const films = filmCatalog.filter(film => (node.all || node.regions?.some(region => filmMatchesRegion(film, region)) || placeFilms.has(film.youtubeId) || (aggregateTrips && tripIds.has(film.expeditionId))) && (year === 'all' || filmYear(film) === year))
  const relatedIds = new Set(films.map(film => film.expeditionId).filter(Boolean))
  const galleries = galleryData.filter(gallery => (node.all || relatedIds.has(gallery.id) || tripIds.has(gallery.id)) && (year === 'all' || String(gallery.year) === year))
  return { films, galleries, routes, photoCount: galleries.reduce((sum, gallery) => sum + gallery.photos.length, 0) }
}
export const atlasYears = id => {
  const { films, galleries, routes } = getAtlasMaterials(id)
  return [...new Set([...routes.map(row => row.sortDate.slice(0,4)), ...galleries.map(gallery => String(gallery.year)), ...films.map(film => String(galleryData.find(gallery => gallery.id === film.expeditionId)?.year || 'undated'))])].sort((a,b) => a === 'undated' ? 1 : b === 'undated' ? -1 : Number(b)-Number(a))
}
export const readAtlasYear = (search = window.location.search) => {
  const params = new URLSearchParams(search), year = params.get('rok'), id = readAtlasSelection(search)
  if (atlasNodeById[id].status === 'planned' || id === 'world' || atlasNodeById[id].kind === 'Kontynent') return 'all'
  const context = atlasNodeById[params.get('obszar')]
  const scope = context && ['Kraj','Region'].includes(context.kind) ? context.id : [...atlasAncestry(id)].reverse().find(node => ['Kraj','Region'].includes(node.kind))?.id || id
  return atlasYears(scope).includes(year) ? year : 'all'
}
export const hasAtlasMaterials = (id, year = 'all') => {
  const { films, galleries, routes } = getAtlasMaterials(id, year)
  return Boolean(films.length || galleries.length || routes.length)
}
export const searchAtlasNodes = (query, candidates = atlasContentNodes) => {
  const terms = normalizeFilmSearch(query).trim().split(/\s+/).filter(Boolean)
  return candidates.filter(node => terms.every(term => normalizeFilmSearch(atlasAncestry(node.id).map(item => item.name).join(' ')).includes(term)))
}
export const atlasHref = (id = 'world', year = 'all', context = null) => {
  const params = new URLSearchParams()
  if (id !== 'world') params.set('atlas', id)
  if (year !== 'all') params.set('rok',year)
  if (context) params.set('obszar',context)
  return `/mapa${params.size ? `?${params}` : ''}`
}
export const atlasFilmLibraryHref = (id) => {
  const node = atlasNodeById[id]
  if (node.regions?.length === 1) return `/filmy?miejsce=${node.regions[0]}`
  if (node.filmIds?.length) return `/filmy?szukaj=${encodeURIComponent(node.name)}`
  return '/filmy'
}
