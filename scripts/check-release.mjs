import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { sitePages, legacyRedirects, SITE_ORIGIN } from '../src/data/siteMetadata.js'
import { atlasNodeById } from '../src/data/atlasContent.js'
import { galleryData, photoGalleries } from '../src/data/galleryData.js'
import { expeditionPages } from '../src/data/expeditionPages.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { portfolioPhotos } from '../src/data/portfolioData.js'
import { author } from '../src/data/authorData.js'

const root = new URL('../', import.meta.url)
const read = file => readFile(new URL(file, root), 'utf8')
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const attribute = (html, key) => decode(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1] || '')
const canonicalPaths = new Set(sitePages.map(page => page.path))
assert.equal(canonicalPaths.size, 7 + photoGalleries.length + expeditionPages.length)
assert.equal(new Set(sitePages.map(page => page.title)).size, sitePages.length)
assert(portfolioPhotos.length >= 15 && portfolioPhotos.length <= 20)
assert.equal(new Set(portfolioPhotos.map(photo => photo.full)).size, portfolioPhotos.length)
for (const photo of portfolioPhotos) {
  assert(galleryData.some(gallery => `/galerie/${gallery.id}` === photo.sourceHref && gallery.photos.some(item => item.full === photo.full)), 'Portfolio must reference a current, non-excluded gallery photo')
}
assert(canonicalPaths.has('/fotografia') && canonicalPaths.has('/o-mnie'))
assert.equal(author.email, 'cinekzielu@gmail.com', 'Use the owner-confirmed contact address')
for (const page of sitePages) {
  const html = await read(`dist/${page.path === '/' ? 'index' : page.path.slice(1)}.html`)
  assert.equal(decode(html.match(/<title>(.*?)<\/title>/)?.[1] || ''), page.title, page.path)
  assert.equal(html.match(/<title>/g)?.length, 1)
  assert.equal(html.match(/rel="canonical"/g)?.length, 1)
  assert(html.includes(`href="${page.canonical}"`), page.path)
  assert.equal(attribute(html, 'og:url'), page.canonical)
  assert.equal(attribute(html, 'og:title'), page.title)
  assert.equal(attribute(html, 'description'), page.description)
  assert.equal(attribute(html, 'og:image'), SITE_ORIGIN + page.image.src)
  assert.equal(attribute(html, 'twitter:image'), SITE_ORIGIN + page.image.src)
  assert(!attribute(html, 'robots').includes('noindex'))
  const schema = JSON.parse(html.match(/<script id="cz-page-schema" type="application\/ld\+json">(.*?)<\/script>/s)?.[1] || '')
  assert.equal(schema.url, page.canonical)
  const photo = await stat(new URL('public' + page.image.src, root))
  assert(photo.size > 1000 && photo.size < 1500000, page.image.src)
  // Optional local HTTP check proves sharing metadata exists before JavaScript runs.
  if (process.env.RELEASE_PREVIEW_URL) {
    const response = await fetch(process.env.RELEASE_PREVIEW_URL + page.path)
    assert.equal(response.status, 200, page.path)
    const served = await response.text()
    assert.equal(attribute(served, 'og:title'), page.title, `Initial HTML: ${page.path}`)
    assert.equal(attribute(served, 'og:image'), SITE_ORIGIN + page.image.src)
  }
}
const deployment = JSON.parse(await read('vercel.json'))
assert.equal(deployment.cleanUrls, true)
assert.equal(deployment.trailingSlash, false)
assert(!deployment.rewrites?.length, 'Do not replace per-page HTML with one shared index')
for (const [source, destination] of Object.entries(legacyRedirects)) {
  const target = new URL(destination, SITE_ORIGIN)
  assert(canonicalPaths.has(target.pathname), destination)
  if (target.searchParams.has('atlas')) assert(atlasNodeById[target.searchParams.get('atlas')], destination)
  if (source !== '/index.html') assert(deployment.redirects.some(rule => rule.source === source && rule.destination === destination && rule.permanent), source)
}
const sitemap = await read('dist/sitemap.xml')
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).sort(), sitePages.map(page => page.canonical).sort())
assert((await read('dist/robots.txt')).includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`))
assert(attribute(await read('dist/404.html'), 'robots').includes('noindex'))
for (const gallery of galleryData) {
  assert(expeditionPages.some(expedition => expedition.id === gallery.id))
  assert(atlasNodeById[gallery.mapNodeId])
  for (const place of gallery.mapPlaces || []) assert(atlasNodeById[place.id], place.id)
  for (const film of gallery.films) assert(filmCatalog.some(item => item.youtubeId === film.id), film.id)
  for (const photo of gallery.photos) {
    await stat(new URL('public' + photo.src, root))
    await stat(new URL('public' + photo.full, root))
    await stat(new URL('public' + photo.mobileSrc, root))
  }
}
const originalHero = await stat(new URL('public/images/hero.jpg', root))
for (const size of [720, 1280]) assert((await stat(new URL(`public/images/optimized/hero-${size}.webp`, root))).size < originalHero.size / 20)
console.log(`PASS: ${sitePages.length} unique page heads, sharing images, sitemap, 404, ${Object.keys(legacyRedirects).length} legacy aliases, gallery/film links and hero size${process.env.RELEASE_PREVIEW_URL ? '; initial HTML verified over HTTP' : ''}.`)
