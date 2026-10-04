import { getPageMetadata, pageStructuredData, SITE_ORIGIN } from './data/siteMetadata.js'

export function applyPageMetadata(pathname = window.location.pathname) {
  const page = getPageMetadata(pathname)
  document.title = page.title
  const image = SITE_ORIGIN + page.image.src
  const tags = [
    ['name', 'description', page.description], ['name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'],
    ['property', 'og:title', page.title], ['property', 'og:description', page.description], ['property', 'og:url', page.canonical],
    ['property', 'og:type', 'website'], ['property', 'og:site_name', 'Cinek Zielu'], ['property', 'og:locale', 'pl_PL'],
    ['property', 'og:image', image], ['property', 'og:image:width', page.image.width], ['property', 'og:image:height', page.image.height], ['property', 'og:image:alt', page.image.alt],
    ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', page.title], ['name', 'twitter:description', page.description], ['name', 'twitter:image', image], ['name', 'twitter:image:alt', page.image.alt],
  ]
  for (const [attribute, key, value] of tags) {
    let tag = document.querySelector(`meta[${attribute}="${key}"]`)
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, key); document.head.append(tag) }
    tag.content = String(value)
  }
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
  canonical.href = page.canonical
  const data = pageStructuredData(page)
  let schema = document.getElementById('cz-page-schema')
  if (data) {
    if (!schema) { schema = document.createElement('script'); schema.type = 'application/ld+json'; schema.id = 'cz-page-schema'; document.head.append(schema) }
    schema.textContent = JSON.stringify(data)
  } else schema?.remove()
}
