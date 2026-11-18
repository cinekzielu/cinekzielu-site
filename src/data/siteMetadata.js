import { destinations } from './destinations.js'
import routeCatalog from './routeCatalog.json' with { type: 'json' }
import { routeHref } from './routeAtlas.js'
import { tripRoutes } from './tripRoutes.js'
import { photoGalleries, videoFrameCollections } from './galleryData.js'
import { expeditionPages } from './expeditionPages.js'
import { shareImages } from './shareImages.js'
import { galleryCollectionCount, galleryItemCount } from './galleryNavigation.js'
import { author } from './authorData.js'
import { portfolioPhotos } from './portfolioData.js'
import { filmCatalog } from './filmCatalog.js'
import { summits } from './summits.js'
import { summitPages, summitPageHref } from './summitPages.js'
import { sharePages, photoShareImage, photoSharePath } from './sharePages.js'

export const SITE_ORIGIN = 'https://www.cinekzielu.pl'
export const normalizePagePath = path => path === '/' ? '/' : path.replace(/\/+$/, '')
const page = (path, title, description, image = shareImages.default) => ({ path, title, description, image, canonical: SITE_ORIGIN + path })

export const sitePages = [
  page('/', 'Cinek Zielu | Góry, podróże i film', 'Zdjęcia, filmy i trasy z moich wyjazdów. Tatry, Alpy, podróże i Hungaroring. Marcin Zieliński / Cinek Zielu.'),
  page('/fotografia', 'Fotografia — portfolio | Cinek Zielu', 'Moje ulubione zdjęcia z gór, podróży i Hungaroringu. Portfolio fotograficzne Marcina Zielińskiego / Cinek Zielu.', shareImages['alpy-2026']),
  page('/fotografia/sciana', 'Studio fotografii — Cinek Zielu', 'Sprawdź, jak moje fotografie wyglądają w ramkach. Wybierz zdjęcia, zmień ich rozmiary i ułóż je na wirtualnej ścianie.', shareImages['alpy-2026']),
  page('/o-mnie', 'Marcin Zieliński — o mnie i kontakt | Cinek Zielu', 'Marcin Zieliński, Cinek Zielu. Góry, fotografia i film. Kilka słów o autorze, kontakt i profile społecznościowe.', shareImages.about),
  page('/mapa', 'Mapa wypraw — Cinek Zielu', 'Miejsca z moich wyjazdów. Wybierz punkt na mapie, żeby zobaczyć zdjęcia, filmy i trasy.'),
  page('/filmy', 'Filmy z gór i podróży — Cinek Zielu', 'Moje filmy z Tatr, Alp, Jury, Maroka i Hungaroringu. Dłuższe filmy, krótkie nagrania i pierwszy odcinek Across the Alps.', shareImages['maroko-2025']),
  page('/szczyty', 'Moje szczyty — Cinek Zielu', 'Szczyty, na które wszedłem, latem i zimą. Daty wejść, zdjęcia, filmy i trasy z moich wypraw.', shareImages['konczysta-2026']),
  ...summitPages.map(item => page(item.path, item.title, item.description, item.id === 'gerlach' ? shareImages['gerlach-zima-2025'] : photoShareImage(item.cover))),
  page('/galerie', 'Galerie z wypraw — Cinek Zielu', `${galleryCollectionCount(photoGalleries)} z ${photoGalleries.length} wypraw. Moje zdjęcia z Alp, Tatr, Sycylii i Hungaroringu.`, shareImages['szwajcaria-2025']),
  page('/trasy', 'Trasy GPX — atlas przejść | Cinek Zielu', `Moje przejścia w Tatrach, Alpach, Gorcach i Atlasie Wysokim. ${routeCatalog.length} tras GPX do obejrzenia na mapie i porównania.`, shareImages['alpy-2026']),
  page('/kierunki', 'Kierunki — kraje i pasma | Cinek Zielu', 'Moje wyjazdy według krajów i pasm górskich. Wybierz miejsce, żeby zobaczyć zdjęcia, filmy i trasy.', shareImages['szwajcaria-2025']),
  ...destinations.filter(item => !item.existing).map(item => page(`/kierunki/${item.id}`, `${item.name} — wyprawy i materiały | Cinek Zielu`, `${item.description} Zdjęcia, filmy i trasy z moich wyjazdów.`, shareImages[item.coverTrip])),
  page('/kierunki/tatry', 'Tatry — letnie i zimowe wyprawy | Cinek Zielu', 'Moje wyjścia w polskie i słowackie Tatry, latem i zimą. Zdjęcia, filmy, szczyty i trasy GPX.', shareImages['konczysta-2026']),
  page('/kierunki/alpy', 'Alpy — wyprawy, fotografie i trasy | Cinek Zielu', 'Szwajcaria 2025 i Across the Alps 2026. Zdjęcia, filmy i trasy z moich wyjazdów w Alpy.', shareImages['alpy-2026']),
  page('/sezony', 'Sezony — wyprawy i fotografie | Cinek Zielu', 'Moje wyjazdy w 2025 i 2026 roku. Zdjęcia, filmy, zdobyte szczyty i trasy.', shareImages['alpy-2026']),
  ...['2026', '2025'].map(year => page(`/sezony/${year}`, `Sezon ${year} — Cinek Zielu`, `Moje wyjazdy w ${year} roku. Zdjęcia, filmy, zdobyte szczyty i trasy.`, shareImages[year === '2026' ? 'alpy-2026' : 'szwajcaria-2025'])),
  page('/wyprawy', 'Wyprawy — fotografie, filmy i miejsca | Cinek Zielu', 'Moje wyjazdy od najnowszych: góry, podróże rowerowe, Sycylia, Maroko i Hungaroring. Zdjęcia, filmy i trasy.', shareImages['alpy-2026']),
  page('/wyprawy/alpy-2027', 'Alpy 2027 — współpraca | Cinek Zielu', 'Latem 2027 celujemy w Matterhorn i Mont Blanc. Szukam partnera wyprawy. Zobacz, jaki sprzęt może nam się przydać i jak mogę pokazać go w filmie i na zdjęciach.', shareImages['alpy-2026']),
  ...photoGalleries.map(gallery => page(`/galerie/${gallery.id}`, `${gallery.title} ${gallery.year} — galeria | Cinek Zielu`, gallery.mediaKind === 'video-frames' ? `${gallery.title} ${gallery.year} — ${galleryItemCount(gallery)} z oryginalnych nagrań${gallery.sourceLabel ? ' ' + gallery.sourceLabel : ''} Marcina Zielińskiego. Zobacz galerię, filmy i miejsce na mapie.` : `${gallery.title} ${gallery.year}. ${galleryItemCount(gallery)} z mojego wyjazdu. Marcin Zieliński / Cinek Zielu.`, shareImages[gallery.id])),
  ...expeditionPages.map(expedition => page(`/wyprawy/${expedition.id}`, `${expedition.title} ${expedition.year} — wyprawa | Cinek Zielu`, expedition.description, shareImages[expedition.id])),
]

// Share variants have their own initial HTML/preview but must not multiply the
// canonical collection inventory or compete with it in search engine results.
export const sharePageMetadata = sharePages.map(item => ({
  ...page(item.path, item.title, item.description, item.image),
  noindex: true, share: true, shareKind: item.kind, view: item.view,
}))

// Old draft URLs lead to verified material instead of unfinished story pages.
export const legacyRedirects = {
  ...Object.fromEntries(videoFrameCollections.map(item => [`/galerie/${item.id}`, `/wyprawy/${item.id}#kadry`])),
  '/index': '/',
  '/index.html': '/',
  '/wyprawy/switzerland-trip': '/wyprawy/szwajcaria-2025',
  '/wyprawy/gerlach-winter': '/wyprawy/gerlach-zima-2025',
  '/wyprawy/lomnica-expedition': '/wyprawy/durny-lomnica-2025',
  '/wyprawy/lomnica': '/wyprawy/durny-lomnica-2025',
  '/wyprawy/durny-szczyt': '/wyprawy/durny-lomnica-2025',
  '/wyprawy/koscielec-winter': '/wyprawy/koscielec-2026',
  '/wyprawy/morocco-toubkal': '/mapa?atlas=morocco',
  '/wyprawy/zermatt': '/mapa?atlas=zermatt',
  '/wyprawy/romania-transfagarasan': '/wyprawy/rumunia-2024',
}
// Browser-private lists are useful pages, but not public search results.
export const utilityPages = [{ ...page('/zapisane', 'Zapisane | Cinek Zielu', 'Wyprawy, trasy i fotografie zapisane w tej przeglądarce.'), noindex: true }]
const byPath = new Map([...sitePages, ...utilityPages].map(item => [item.path, item]))
const sharedByPath = new Map(sharePageMetadata.map(item => [item.path, item]))
export function getPageMetadata(pathname) {
  const path = normalizePagePath(pathname)
  if (sharedByPath.has(path)) return sharedByPath.get(path)
  const redirect = legacyRedirects[path]
  const known = byPath.get(redirect?.split(/[?#]/)[0] || path)
  return known || { ...page(path, 'Nie znaleziono strony — Cinek Zielu', 'Ten adres nie prowadzi do istniejącej strony. Zobacz wyprawy, filmy lub galerie Cinek Zielu.'), noindex: true }
}
export function pageStructuredData(metadata) {
  if (metadata.noindex) return null
  const person = {
    '@type': 'Person', '@id': `${SITE_ORIGIN}/o-mnie#autor`, name: author.name,
    alternateName: 'Cinek Zielu', url: `${SITE_ORIGIN}/o-mnie`,
    image: SITE_ORIGIN + shareImages.about.src, sameAs: author.socials.map(profile => profile.href),
  }
  const isHome = metadata.path === '/'
  const base = {
    '@context': 'https://schema.org', '@type': isHome ? 'WebSite' : 'WebPage',
    '@id': isHome ? `${SITE_ORIGIN}/#website` : `${metadata.canonical}#page`,
    name: isHome ? 'Cinek Zielu' : metadata.title,
    url: metadata.canonical, description: metadata.description, inLanguage: 'pl-PL',
    author: person,
    ...(isHome ? { alternateName: 'Marcin Zieliński — Cinek Zielu', publisher: person }
      : { isPartOf: { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: 'Cinek Zielu', url: `${SITE_ORIGIN}/` } }),
  }
  const imageObject = photo => {
    const image = photoShareImage(photo)
    return {
      '@type': 'ImageObject', '@id': SITE_ORIGIN + photo.full + '#image',
      contentUrl: SITE_ORIGIN + photo.full, thumbnailUrl: SITE_ORIGIN + photo.src,
      url: SITE_ORIGIN + photoSharePath(photo), name: photo.alt, caption: photo.alt,
      width: image.width, height: image.height, creator: { '@id': person['@id'] }, creditText: author.name,
    }
  }
  const itemList = items => ({ '@type': 'ItemList', numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, ...item })) })
  base[isHome ? 'image' : 'primaryImageOfPage'] = { '@type': 'ImageObject', contentUrl: SITE_ORIGIN + metadata.image.src,
    width: metadata.image.width, height: metadata.image.height, caption: metadata.image.alt }
  if (metadata.path === '/o-mnie') { base['@type'] = 'ProfilePage'; base.mainEntity = person }
  const gallery = photoGalleries.find(item => metadata.path === `/galerie/${item.id}`)
  const photographs = gallery?.photos || (metadata.path === '/fotografia' ? portfolioPhotos : null)
  if (photographs) {
    base['@type'] = 'ImageGallery'
    base.image = photographs.map(imageObject)
    base.mainEntity = itemList(base.image.map(item => ({ item: { '@id': item['@id'] } })))
  } else if (metadata.path === '/galerie') {
    base['@type'] = 'CollectionPage'
    base.mainEntity = itemList(photoGalleries.map(item => ({ name: `${item.title} ${item.year}`, url: `${SITE_ORIGIN}/galerie/${item.id}` })))
  } else if (metadata.path === '/wyprawy') {
    base['@type'] = 'CollectionPage'
    base.mainEntity = itemList(expeditionPages.map(item => ({ name: `${item.title} ${item.year}`, url: `${SITE_ORIGIN}/wyprawy/${item.id}` })))
  } else if (metadata.path === '/trasy') {
    base['@type'] = 'CollectionPage'
    base.mainEntity = itemList(routeCatalog.map(row => ({ name: tripRoutes[row.id].title, url: SITE_ORIGIN + routeHref(row, tripRoutes[row.id]) })))
  } else if (metadata.path === '/filmy') {
    base['@type'] = 'CollectionPage'
    base.mainEntity = itemList(filmCatalog.map(film => ({ name: film.title, url: film.youtubeUrl })))
  } else if (metadata.path === '/szczyty') {
    base['@type'] = 'CollectionPage'
    base.mainEntity = itemList([...summits].sort((a, b) => b.altitude - a.altitude).map(summit => ({
      name: `${summit.name} · ${summit.altitude} m`, url: SITE_ORIGIN + (summitPageHref(summit.id) || `/szczyty#szczyt-${summit.id}`),
    })))
  }
  const parts = metadata.path.split('/').filter(Boolean)
  if (parts.length === 2) {
    base.breadcrumb = { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Cinek Zielu', item: SITE_ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: ({ fotografia: 'Fotografia', galerie: 'Galerie', sezony: 'Sezony', szczyty: 'Szczyty', kierunki: 'Kierunki' })[parts[0]] || 'Wyprawy', item: SITE_ORIGIN + '/' + parts[0] },
      { '@type': 'ListItem', position: 3, name: metadata.title.split(' — ')[0], item: metadata.canonical },
    ] }
  }
  return base
}
