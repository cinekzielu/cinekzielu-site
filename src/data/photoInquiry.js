import { photoGalleries } from './galleryData.js'
import { photoViewId, photoViewUrl } from './photoView.js'
import { author } from './authorData.js'
import { SITE_ORIGIN } from './siteMetadata.js'

export function photoInquiry(photo) {
  const gallery = photoGalleries.find(item => item.photos.some(candidate => candidate.full === photo.full))
  if (!gallery) return null
  const label = `${gallery.title} ${gallery.year}`
  const url = photoViewUrl(`${SITE_ORIGIN}/galerie/${gallery.id}`, photo)
  const subject = `Zapytanie o zdjęcie — ${label} — ${photoViewId(photo)}`
  const body = `Cześć,\n\nChcę zapytać o to zdjęcie:\n${label}\n${url}\n\n`
  return { url, email: author.email, href: `mailto:${author.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` }
}
