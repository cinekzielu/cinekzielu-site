import { photoGalleries, videoFrameCollections } from './galleryData.js'
import { expeditionPages } from './expeditionPages.js'
import { shareImages } from './shareImages.js'
import { galleryCollectionCount, galleryItemCount } from './galleryNavigation.js'

export const SITE_ORIGIN = 'https://www.cinekzielu.pl'
export const normalizePagePath = path => path === '/' ? '/' : path.replace(/\/+$/, '')
const page = (path, title, description, image = shareImages.default) => ({ path, title, description, image, canonical: SITE_ORIGIN + path })

export const sitePages = [
  page('/', 'Cinek Zielu | Góry, podróże i film', 'Marcin Zieliński — fotografie i filmy z gór i podróży. Odkryj wyprawy, galerie i miejsca na mapie.'),
  page('/fotografia', 'Fotografia — portfolio | Cinek Zielu', 'Wybrane fotografie Marcina Zielińskiego. Góry, podróże i przyroda w osiemnastu kadrach.', shareImages['alpy-2026']),
  page('/o-mnie', 'Marcin Zieliński — o mnie i kontakt | Cinek Zielu', 'Marcin Zieliński, Cinek Zielu. Góry, fotografia i film. Kilka słów o autorze, kontakt i profile społecznościowe.', shareImages.about),
  page('/mapa', 'Mapa wypraw — Cinek Zielu', 'Odkrywaj wyprawy, filmy i galerie na mapie. Tatry, Szwajcaria, Alpy, Maroko i Jura.'),
  page('/filmy', 'Filmy z gór i podróży — Cinek Zielu', 'Filmy z Tatr, Szwajcarii, Alp, Jury i Maroka. Wybierz miejsce, znajdź film i zobacz fotografie z wyprawy.'),
  page('/galerie', 'Galerie z wypraw — Cinek Zielu', `${galleryCollectionCount(photoGalleries)} z ${photoGalleries.length} wypraw. Szwajcaria, Alpy, Tatry i Gorce w fotografiach Marcina Zielińskiego.`, shareImages['alpy-2026']),
  page('/wyprawy', 'Wyprawy — fotografie, filmy i miejsca | Cinek Zielu', 'Wyprawy w Alpy, Tatry, Gorce, do Szwajcarii i Maroka. Fotografie, kadry z nagrań, filmy oraz miejsca na mapie — Cinek Zielu.', shareImages['alpy-2026']),
  ...photoGalleries.map(gallery => page(`/galerie/${gallery.id}`, `${gallery.title} ${gallery.year} — galeria | Cinek Zielu`, gallery.mediaKind === 'video-frames' ? `${gallery.title} ${gallery.year} — ${galleryItemCount(gallery)} z oryginalnych nagrań${gallery.sourceLabel ? ' ' + gallery.sourceLabel : ''} Marcina Zielińskiego. Zobacz galerię, filmy i miejsce na mapie.` : `${gallery.title} ${gallery.year} — ${gallery.photos.length} fotografii z wyprawy. Zobacz galerię${gallery.films.length ? ', filmy' : ''} i miejsce na mapie. Fotografie Marcina Zielińskiego.`, shareImages[gallery.id])),
  ...expeditionPages.map(expedition => page(`/wyprawy/${expedition.id}`, `${expedition.title} ${expedition.year} — ${expedition.project?.name || 'wyprawa'} | Cinek Zielu`, expedition.project ? expedition.description : `${expedition.description} Zobacz ${expedition.gallery.mediaKind === 'video-frames' ? 'kadry z nagrań' : 'galerię zdjęć'}${expedition.gallery.films.length ? ', filmy' : ''} i miejsce na mapie.`, shareImages[expedition.id])),
]

// Old draft URLs lead to verified material instead of unfinished story pages.
export const legacyRedirects = {
  ...Object.fromEntries(videoFrameCollections.map(item => [`/galerie/${item.id}`, `/wyprawy/${item.id}#kadry`])),
  '/index': '/',
  '/index.html': '/',
  '/wyprawy/switzerland-trip': '/wyprawy/szwajcaria-2025',
  '/wyprawy/gerlach-winter': '/wyprawy/gerlach-zima-2025',
  '/wyprawy/lomnica-expedition': '/mapa?atlas=lomnica',
  '/wyprawy/lomnica': '/mapa?atlas=lomnica',
  '/wyprawy/durny-szczyt': '/mapa?atlas=durny-szczyt',
  '/wyprawy/koscielec-winter': '/wyprawy/koscielec-2026',
  '/wyprawy/morocco-toubkal': '/mapa?atlas=morocco',
  '/wyprawy/zermatt': '/mapa?atlas=zermatt',
  '/wyprawy/romania-transfagarasan': '/mapa?atlas=romania',
}
const byPath = Object.fromEntries(sitePages.map(item => [item.path, item]))
export function getPageMetadata(pathname) {
  const path = normalizePagePath(pathname)
  const redirect = legacyRedirects[path]
  const known = byPath[redirect?.split(/[?#]/)[0] || path]
  return known || { ...page(path, 'Nie znaleziono strony — Cinek Zielu', 'Ten adres nie prowadzi do istniejącej strony. Zobacz wyprawy, filmy lub galerie Cinek Zielu.'), noindex: true }
}
export function pageStructuredData(metadata) {
  if (metadata.noindex) return null
  const base = { '@context': 'https://schema.org', '@type': metadata.path === '/' ? 'WebSite' : 'WebPage', name: metadata.title, url: metadata.canonical, description: metadata.description, inLanguage: 'pl', author: { '@type': 'Person', name: 'Marcin Zieliński' } }
  const parts = metadata.path.split('/').filter(Boolean)
  if (parts.length === 2) {
    base.breadcrumb = { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Cinek Zielu', item: SITE_ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: parts[0] === 'galerie' ? 'Galerie' : 'Wyprawy', item: SITE_ORIGIN + '/' + parts[0] },
      { '@type': 'ListItem', position: 3, name: metadata.title.split(' — ')[0], item: metadata.canonical },
    ] }
  }
  return base
}
