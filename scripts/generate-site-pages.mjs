import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sitePages, getPageMetadata, legacyRedirects, pageStructuredData, SITE_ORIGIN } from '../src/data/siteMetadata.js'

const project = fileURLToPath(new URL('../', import.meta.url))
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
export function renderHead(page) {
  const image = SITE_ORIGIN + page.image.src
  const fields = [
    ['name', 'description', page.description], ['name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'],
    ['property', 'og:title', page.title], ['property', 'og:description', page.description], ['property', 'og:url', page.canonical],
    ['property', 'og:type', 'website'], ['property', 'og:site_name', 'Cinek Zielu'], ['property', 'og:locale', 'pl_PL'],
    ['property', 'og:image', image], ['property', 'og:image:width', page.image.width], ['property', 'og:image:height', page.image.height], ['property', 'og:image:alt', page.image.alt],
    ['name', 'twitter:card', 'summary_large_image'], ['name', 'twitter:title', page.title], ['name', 'twitter:description', page.description], ['name', 'twitter:image', image], ['name', 'twitter:image:alt', page.image.alt],
  ]
  const schema = pageStructuredData(page)
  return ['<!-- site-metadata:start -->', `<title>${escape(page.title)}</title>`, `<link rel="canonical" href="${escape(page.canonical)}" />`,
    ...fields.map(([attribute,key,value]) => `<meta ${attribute}="${key}" content="${escape(value)}" />`),
    ...(schema ? [`<script id="cz-page-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`] : []),
    '<!-- site-metadata:end -->'].join('\n    ')
}
export async function generateSitePages() {
  const dist = path.join(project, 'dist')
  const template = await readFile(path.join(dist, 'index.html'), 'utf8')
  const metadataBlock = /<!-- site-metadata:start -->[\s\S]*?<!-- site-metadata:end -->/
  if (!metadataBlock.test(template)) throw new Error('Metadata markers missing from built HTML')
  const documentFor = page => template.replace(metadataBlock, () => renderHead(page))
  for (const page of sitePages) {
    const file = path.join(dist, page.path === '/' ? 'index.html' : page.path.slice(1) + '.html')
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, documentFor(page))
  }
  for (const [from, target] of Object.entries(legacyRedirects)) {
    if (from.startsWith('/index')) continue
    const file = path.join(dist, from.slice(1) + '.html')
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, documentFor(getPageMetadata(from)).replace('</head>', `<meta http-equiv="refresh" content="0;url=${escape(target)}" /></head>`))
  }
  await writeFile(path.join(dist, '404.html'), documentFor(getPageMetadata('/404')))
  await writeFile(path.join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + sitePages.map(page => `  <url><loc>${escape(page.canonical)}</loc></url>`).join('\n') + '\n</urlset>\n')
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`)
  console.log(`Static metadata: ${sitePages.length} pages, legacy redirects, 404, sitemap and robots.txt.`)
}
