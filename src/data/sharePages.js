import { photoGalleries } from './galleryData.js'
import { photographyCollections } from './portfolioData.js'
import { photoViewId } from './photoView.js'
import { atlasNodeById, getAtlasMaterials } from './atlasContent.js'
import { shareImages } from './shareImages.js'

// Explicit share destinations; includes the reviewed summit atlas additions.
// Adding new places to this list is a separate editorial/publication decision.
export const sharedAtlasIds = [
  'malolaczniak', 'ciemniak', 'kopa-kondracka',
  'starolesny-szczyt', 'baraniec', 'grzes', 'rakon', 'maly-lodowy-szczyt', 'kasprowy-wierch', 'klingenstock',
  'matterhorn', 'world', 'europe', 'africa', 'north-america', 'south-america', 'asia', 'oceania',
  'poland', 'slovakia', 'switzerland', 'austria', 'germany', 'slovenia', 'italy',
  'hungary', 'france', 'norway', 'spain', 'romania', 'greece', 'liechtenstein',
  'sicily', 'catania', 'taormina', 'etna', 'hungaroring', 'tatry', 'alpy', 'jura',
  'gorce', 'turbacz', 'morocco', 'lomnica', 'koscielec', 'gerlach', 'durny-szczyt',
  'krywan', 'swinica', 'lodowy-szczyt', 'baranie-rogi', 'kiezmarski-szczyt',
  'konczysta', 'rysy', 'giewont', 'szatan', 'jagniecy-szczyt', 'posrednia-gran',
  'slawkowski-szczyt', 'ganek', 'wysoka', 'mieguszowiecki-szczyt-wielki',
  'wolowiec', 'starorobocianski-wierch', 'zabi-kon', 'lodowa-kopa',
  'huncowski-szczyt', 'szpiglasowy-wierch', 'liptowskie-mury', 'walentkowa-gran',
  'walentkowy-wierch', 'saxer-lucke', 'fronalpstock', 'augstmatthorn',
  'murren-gimmelwald', 'zermatt', 'bettmerhorn', 'triglav', 'grossglockner',
  'dufourspitze', 'grauspitz', 'zugspitze', 'morocco-atlas', 'rabat', 'fez',
  'azrou', 'merzouga', 'todra', 'ouarzazate', 'ait-ben-haddou', 'marrakesh',
  'ouzoud', 'imlil', 'refuge-du-toubkal', 'toubkal',
]

// Full photographs here are the already published 2000px web exports, not
// camera originals. The share check compares these dimensions with each file.
export function photoShareImage(photo) {
  const scale = Math.min(1, 2000 / Math.max(photo.width, photo.height))
  return { src: photo.full, width: Math.round(photo.width * scale), height: Math.round(photo.height * scale), alt: photo.alt }
}

const imagePages = photoGalleries.flatMap(gallery => gallery.photos.map(photo => {
  const photoId = photoViewId(photo)
  return {
    path: `/udostepnij/zdjecie/${gallery.id}/${photoId}`,
    kind: 'photo', galleryId: gallery.id, photoId,
    title: `${gallery.title} ${gallery.year} — fotografia | Cinek Zielu`,
    description: `${photo.alt}. Fotografia Marcina Zielińskiego z kolekcji ${gallery.title} ${gallery.year}.`,
    image: photoShareImage(photo),
    view: { pathname: `/galerie/${gallery.id}`, search: `?zdjecie=${encodeURIComponent(photoId)}` },
  }
}))
const collectionPages = photographyCollections.filter(collection => collection.photos.length).map(collection => ({
  path: `/udostepnij/kolekcja/${collection.id}`, kind: 'collection', collectionId: collection.id,
  title: `${collection.title} — fotografie | Cinek Zielu`,
  description: `${collection.title}. Wybrane fotografie Marcina Zielińskiego z Tatr i Alp.`,
  image: photoShareImage(collection.photos[0]),
  view: { pathname: '/fotografia', search: `?kolekcja=${encodeURIComponent(collection.id)}` },
}))
const mapPages = sharedAtlasIds.map(id => {
  const place = atlasNodeById[id]
  if (!place) throw new Error(`Missing published atlas place: ${id}`)
  const materials = getAtlasMaterials(id)
  const gallery = materials.galleries.find(item => shareImages[item.id])
  return {
    path: `/udostepnij/mapa/${id}`, kind: 'atlas', atlasId: id,
    title: `${place.name} — ${place.status === 'planned' ? 'w planach' : 'mapa'} | Cinek Zielu`,
    description: `${place.name} w atlasie Cinek Zielu. ${place.description || 'Zobacz miejsce na mapie i powiązane materiały.'}`,
    image: ['world', 'europe'].includes(id) ? shareImages.default : shareImages[gallery?.id] || shareImages.default,
    view: { pathname: '/mapa', search: `?atlas=${encodeURIComponent(id)}` },
  }
})

// Separate from the public page inventory and sitemap: these are share views
// of existing content, not new galleries, trips, map places or SEO landing pages.
export const sharePages = [...imagePages, ...collectionPages, ...mapPages]
const byPath = new Map(sharePages.map(page => [page.path, page]))
const photoPaths = new Map(imagePages.map(page => [`${page.galleryId}/${page.photoId}`, page.path]))
const atlasPaths = new Map(mapPages.map(page => [page.atlasId, page.path]))
const collectionPaths = new Map(collectionPages.map(page => [page.collectionId, page.path]))
export const resolveSharePage = pathname => byPath.get(pathname.replace(/\/+$/, '')) || null

export function photoSharePath(galleryId, photo) {
  // Portfolio images carry sourceHref; plain gallery images can be resolved by
  // the unique public full image without relying on their current display order.
  if (!photo && galleryId && typeof galleryId === 'object') { photo = galleryId; galleryId = null }
  if (!photo?.full) return null
  const sourceId = galleryId || photo.sourceHref?.match(/^\/galerie\/([^/?#]+)/)?.[1]
    || photoGalleries.find(gallery => gallery.photos.some(item => item.full === photo.full))?.id
  return photoPaths.get(`${sourceId}/${photoViewId(photo)}`) || null
}
export const collectionSharePath = id => collectionPaths.get(id) || null
export const atlasSharePath = id => atlasPaths.get(id) || null

// Accept the existing atlasViewHref output after its camera snapshot has been
// serialized. Navigation links remain unchanged; only explicit sharing uses it.
export function atlasShareHref(href) {
  const url = new URL(href, 'https://www.cinekzielu.pl')
  if (url.pathname !== '/mapa') return href
  const path = atlasSharePath(url.searchParams.get('atlas') || 'world')
  if (!path) return href
  const params = new URLSearchParams(resolvePageView(path, url.search).search)
  params.delete('atlas')
  return path + (params.size ? `?${params}` : '')
}

export function resolvePageView(pathname, search = '') {
  const page = resolveSharePage(pathname)
  if (!page) return { pathname, search }
  const params = new URLSearchParams(page.view.search)
  // A map link may retain its camera and filters. The path is authoritative for
  // the place/image/collection; unrelated query values cannot change its meaning.
  if (page.kind === 'atlas') {
    const incoming = new URLSearchParams(search)
    for (const key of ['rok', 'obszar', 'podklad', 'kadr', 'miejsca']) {
      const value = incoming.get(key)
      if (value && value.length <= 160) params.set(key, value)
    }
  }
  return { pathname: page.view.pathname, search: params.size ? `?${params}` : '' }
}
