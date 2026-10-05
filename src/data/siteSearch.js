import { atlasContentNodes, atlasAncestry, atlasHref, getAtlasMaterials, hasAtlasMaterials } from './atlasContent.js'
import { expeditionPages, expeditionHref } from './expeditionPages.js'
import { galleryData } from './galleryData.js'
import { galleryHref, photoCount } from './galleryNavigation.js'
import { filmCatalog, filmRegionLabel, normalizeFilmSearch } from './filmCatalog.js'
import { galleryAtlasIds } from './tripGeography.js'

export const searchKinds = [{ id:'all', label:'Wszystko' }, { id:'place', label:'Miejsca' }, { id:'expedition', label:'Wyprawy' }, { id:'gallery', label:'Galerie' }, { id:'film', label:'Filmy' }]
export const normalizeSearch = value => normalizeFilmSearch(value || '').replace(/[^a-z0-9]+/g,' ').trim()
const placeWords = ids => ids.flatMap(id => atlasAncestry(id).map(place => place.name)).join(' ')
const filmPlaces = film => atlasContentNodes.filter(place => place.filmIds?.includes(film.youtubeId))
const filmTripWords = film => {
  const gallery = galleryData.find(item => item.id === film.expeditionId)
  return gallery ? `${gallery.year} ${placeWords(galleryAtlasIds(gallery))}` : ''
}
const entry = data => ({ ...data, normalizedTitle:normalizeSearch(data.title), searchText:normalizeSearch(`${data.title} ${data.subtitle} ${data.keywords || ''}`) })

export const siteSearchIndex = [
  ...atlasContentNodes.filter(place => place.id !== 'world' && hasAtlasMaterials(place.id)).map(place => {
    const materials = getAtlasMaterials(place.id)
    return entry({ id:`place:${place.id}`, kind:'place', title:place.name, href:atlasHref(place.id), subtitle:[place.kind, materials.galleries.length && `${materials.galleries.length} gal.`, materials.films.length && `${materials.films.length} film.`].filter(Boolean).join(' · '), keywords:`${placeWords([place.id])} ${place.description || ''}` })
  }),
  ...expeditionPages.map(trip => entry({ id:`expedition:${trip.id}`, kind:'expedition', title:`${trip.title} ${trip.year}`, href:expeditionHref(trip), subtitle:`${trip.region} · ${trip.kind}`, image:trip.gallery.coverImage, keywords:`${trip.description} ${placeWords(galleryAtlasIds(trip.gallery))}` })),
  ...galleryData.map(gallery => entry({ id:`gallery:${gallery.id}`, kind:'gallery', title:`${gallery.title} ${gallery.year}`, href:galleryHref(gallery), subtitle:photoCount(gallery.photos.length), image:gallery.coverImage, keywords:placeWords(galleryAtlasIds(gallery)) })),
  ...filmCatalog.map(film => entry({ id:`film:${film.youtubeId}`, kind:'film', title:film.title, href:film.youtubeUrl, film, subtitle:`${filmRegionLabel(film.region)} · ${film.format} · ${film.duration}`, image:film.thumbnail, keywords:`${film.searchTerms || ''} ${film.series || ''} ${filmTripWords(film)} ${filmPlaces(film).map(place => place.name).join(' ')}` })),
]

export function searchSite(query) {
  const normalized = normalizeSearch(query)
  if (!normalized) return []
  const terms = normalized.split(' ')
  return siteSearchIndex.filter(item => terms.every(term => item.searchText.includes(term))).map(item => {
    const score = item.normalizedTitle === normalized ? 100 : item.normalizedTitle.startsWith(normalized) ? 90 : item.normalizedTitle.includes(normalized) ? 80 : terms.every(term => item.normalizedTitle.includes(term)) ? 60 : 10
    if (item.kind !== 'film') return { ...item, score }
    // A place query may take the matching film straight to its verified chapter.
    const chapters = filmPlaces(item.film).filter(place => place.chapter && normalizeSearch(place.name).includes(normalized))
    const chapter = (chapters.find(place => normalizeSearch(place.name) === normalized) || chapters[0])?.chapter
    return { ...item, score, ...(chapter ? { href:`${item.film.youtubeUrl}&t=${chapter.seconds}s`, chapter } : {}) }
  }).sort((a,b) => b.score-a.score || a.title.localeCompare(b.title,'pl'))
}
