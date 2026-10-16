import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { sitePages, utilityPages, sharePageMetadata, SITE_ORIGIN } from '../src/data/siteMetadata.js'
import { sharePages } from '../src/data/sharePages.js'
import { photoGalleries } from '../src/data/galleryData.js'
import { summits } from '../src/data/summits.js'

const dist = new URL('../dist/', import.meta.url)
const read = file => readFile(new URL(file, dist), 'utf8')
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#(?:x27|39);/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const meta = (html, key) => decode(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1] || '')
const rootContent = html => html.match(/<div id="root">([\s\S]*?)<\/div><script id="cz-page-location"/)?.[1] || ''
const htmlByPath = new Map()
const resources = new Set()
const links = new Set()
let size = 0
for (const page of [...sitePages, ...utilityPages, ...sharePageMetadata]) {
  const html = await read(`${page.path === '/' ? 'index' : page.path.slice(1)}.html`)
  htmlByPath.set(page.path, html)
  size += Buffer.byteLength(html)
  assert(!html.includes('<div id="root"></div>'), `Empty shell: ${page.path}`)
  const body = rootContent(html)
  assert(body.length > 500, `Missing substantive initial markup: ${page.path}`)
  assert(/<h1(?:\s|>)/.test(body), `Heading must be inside rendered page: ${page.path}`)
  assert(/<a [^>]*href="\//.test(body), `Real internal links: ${page.path}`)
  assert(!body.includes('Nie znaleziono'), `Existing route rendered as 404: ${page.path}`)
  assert.equal(meta(html, 'og:url'), page.canonical)
  assert.equal(meta(html, 'og:title'), page.title)
  assert.equal(meta(html, 'description'), page.description)
  assert.equal(meta(html, 'og:image'), SITE_ORIGIN + page.image.src)
  assert.equal(meta(html, 'twitter:image'), SITE_ORIGIN + page.image.src)
  assert.equal(meta(html, 'robots').includes('noindex'), Boolean(page.noindex))
  assert.equal(html.match(/<title>/g)?.length, 1, `One title: ${page.path}`)
  assert.equal(html.match(/rel="canonical"/g)?.length, 1, `One canonical: ${page.path}`)
  assert(html.includes(`<link rel="canonical" href="${page.canonical}"`))
  const bootstrap = JSON.parse(html.match(/<script id="cz-page-location" type="application\/json">(.*?)<\/script>/s)?.[1] || 'null')
  assert.deepEqual(bootstrap, page.view || { pathname: page.path, search: '' }, `Hydration location: ${page.path}`)
  assert(!/(?:[CDG]:[\\/]Foto|[\\/]\.codex[\\/]|file:\/\/)/i.test(html), `Private path in ${page.path}`)
  for (const tag of html.matchAll(/<(?:img|script|link)\b[^>]*>/g)) {
    for (const match of tag[0].matchAll(/(?:src|href)="(\/(?!\/)[^"]*)"/g)) resources.add(decode(match[1]))
    const srcset = tag[0].match(/(?:srcSet|srcset|imageSrcSet|imagesrcset)="([^"]+)"/)
    if (srcset) for (const source of decode(srcset[1]).split(',')) {
      const url = source.trim().split(/\s+/)[0]
      if (url.startsWith('/')) resources.add(url)
    }
  }
  for (const match of body.matchAll(/<a\b[^>]*href="(\/(?!\/)[^"]*)"/g)) links.add(new URL(decode(match[1]), SITE_ORIGIN).pathname)
}
for (const resource of resources) {
  const pathname = new URL(resource, SITE_ORIGIN).pathname
  const file = new URL(pathname.slice(1), dist)
  assert((await stat(file)).isFile(), `Rendered asset missing: ${resource}`)
}
for (const path of links) {
  if (htmlByPath.has(path)) continue
  const extension = path.split('/').at(-1).includes('.') ? '' : '.html'
  assert((await stat(new URL(path.slice(1) + extension, dist))).isFile(), `Rendered internal target missing: ${path}`)
}
const summitBody = rootContent(htmlByPath.get('/szczyty'))
for (const summit of summits) {
  assert(summitBody.includes(`id="szczyt-${summit.id}"`))
  assert(summitBody.includes(summit.name), `${summit.name} must be crawlable without running JavaScript`)
}
for (const gallery of photoGalleries) {
  const body = rootContent(htmlByPath.get(`/galerie/${gallery.id}`))
  for (const photo of gallery.photos) assert(body.includes(`src="${photo.src}"`), `Gallery photograph missing from initial HTML: ${photo.src}`)
}
for (const page of sharePages.filter(item => item.kind === 'photo')) {
  const html = htmlByPath.get(page.path)
  assert.equal(meta(html, 'og:image'), SITE_ORIGIN + page.image.src, 'Selected photograph is the initial preview image')
}
const sitemap = await read('sitemap.xml')
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).sort(), sitePages.map(page => page.canonical).sort())
assert(!sitemap.includes('/udostepnij/'), 'Sharing variants must not multiply the public sitemap')
for (const id of ['cluj-napoca', 'rimetea', 'alba-iulia', 'transalpina', 'pestera-polovragi', 'curtea-de-arges', 'vidraru', 'transfagarasan', 'sibiu']) {
  assert(!htmlByPath.has(`/udostepnij/mapa/${id}`))
  assert(![...links].some(path => path === `/udostepnij/mapa/${id}`), `Paused map location leaked through static atlas navigation: ${id}`)
}
const missing = await read('404.html')
assert(meta(missing, 'robots').includes('noindex'))
assert(rootContent(missing).includes('Nie znaleziono'))
console.log(`PASS: ${sitePages.length} substantive pages + ${sharePageMetadata.length} contextual share responses, ${summits.length} crawlable peaks, ${resources.size} local assets, ${links.size} internal targets, correct initial metadata/bootstrap, sitemap and 404; ${(size / 1024 / 1024).toFixed(2)} MiB total HTML.`)
