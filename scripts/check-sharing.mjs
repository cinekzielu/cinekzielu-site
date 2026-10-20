import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { sitePages, sharePageMetadata, getPageMetadata, pageStructuredData, SITE_ORIGIN } from '../src/data/siteMetadata.js'
import { sharePages, sharedAtlasIds, resolvePageView, resolveSharePage, photoSharePath, collectionSharePath, atlasSharePath, atlasShareHref } from '../src/data/sharePages.js'
import { atlasViewHref } from '../src/data/atlasViewState.js'
import { mercator } from '../src/data/terrainMap.js'
import { photoGalleries, videoFrameCollections } from '../src/data/galleryData.js'
import { portfolioPhotos, photographyCollections } from '../src/data/portfolioData.js'
import { photoViewId } from '../src/data/photoView.js'
import { author } from '../src/data/authorData.js'
import { summits } from '../src/data/summits.js'

const root = new URL('../public/', import.meta.url)
const photos = photoGalleries.flatMap(gallery => gallery.photos.map(photo => ({ gallery, photo })))
assert.equal(sitePages.length, 48, 'Share views must not add trips or canonical landing pages')
assert.equal(sharePages.length, photos.length + photographyCollections.length + sharedAtlasIds.length)
assert.equal(new Set(sharePages.map(page => page.path)).size, sharePages.length)
assert.equal(sharePageMetadata.length, sharePages.length)
assert.equal(sharedAtlasIds.length, 95)
const canonicalPaths = new Set(sitePages.map(page => page.path))
function webpDimensions(bytes) {
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF')
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP')
  const chunk = bytes.toString('ascii', 12, 16)
  if (chunk === 'VP8X') return [bytes.readUIntLE(24, 3) + 1, bytes.readUIntLE(27, 3) + 1]
  if (chunk === 'VP8 ') return [bytes.readUInt16LE(26) & 0x3fff, bytes.readUInt16LE(28) & 0x3fff]
  if (chunk === 'VP8L') { const bits = bytes.readUInt32LE(21); return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1] }
  throw new Error(`Unexpected WebP chunk ${chunk}`)
}
for (const entry of sharePages) {
  assert(!canonicalPaths.has(entry.path))
  assert(canonicalPaths.has(entry.view.pathname), `Share view resolves to a real page: ${entry.path}`)
  assert.deepEqual(resolvePageView(entry.path), entry.view)
  assert.equal(resolveSharePage(entry.path + '/'), entry)
  const metadata = getPageMetadata(entry.path)
  assert.equal(metadata.share, true)
  assert.equal(metadata.noindex, true, 'Do not index duplicates of existing galleries/maps')
  assert.equal(metadata.canonical, SITE_ORIGIN + entry.path)
  assert.equal(metadata.image.src, entry.image.src)
  assert.equal(pageStructuredData(metadata), null)
  assert(!metadata.title.includes('Nie znaleziono'))
  assert((await stat(new URL(entry.image.src.slice(1), root))).size > 1000)
  if (entry.kind === 'photo' || entry.kind === 'collection') {
    const actual = webpDimensions(await readFile(new URL(entry.image.src.slice(1), root)))
    assert.deepEqual([entry.image.width, entry.image.height], actual, `Advertise actual export dimensions: ${entry.path}`)
  }
}
for (const { gallery, photo } of photos) {
  const path = photoSharePath(gallery.id, photo)
  assert.equal(photoSharePath(photo), path)
  const entry = resolveSharePage(path)
  assert.equal(entry.image.src, photo.full, 'Share selected photograph, not the gallery cover')
  assert.equal(new URLSearchParams(entry.view.search).get('zdjecie'), photoViewId(photo))
  assert.equal(entry.view.pathname, `/galerie/${gallery.id}`)
}
for (const photo of portfolioPhotos) {
  const entry = resolveSharePage(photoSharePath(photo))
  assert.equal(entry.view.pathname, photo.sourceHref)
  assert.equal(entry.image.src, photo.full)
}
for (const collection of photographyCollections) {
  const entry = resolveSharePage(collectionSharePath(collection.id))
  assert.equal(entry.image.src, collection.photos[0].full)
  assert.equal(new URLSearchParams(entry.view.search).get('kolekcja'), collection.id)
}
for (const video of videoFrameCollections) assert.equal(photoSharePath(video.id, video.photos[0]), null, 'No video stills in photographic share catalogue')
for (const id of ['cluj-napoca', 'rimetea', 'alba-iulia', 'transalpina', 'pestera-polovragi', 'curtea-de-arges', 'vidraru', 'transfagarasan', 'sibiu']) {
  assert.equal(atlasSharePath(id), null, 'Paused Romania map must not become public through share routes')
}
const mapView = resolvePageView(atlasSharePath('switzerland'), '?atlas=romania&kadr=46.5,8.2,7&podklad=dark&rok=2025&obszar=alpy&zdjecie=unknown')
assert.equal(mapView.pathname, '/mapa')
const mapParams = new URLSearchParams(mapView.search)
assert.equal(mapParams.get('atlas'), 'switzerland')
assert.equal(mapParams.get('kadr'), '46.5,8.2,7')
assert.equal(mapParams.get('podklad'), 'dark')
assert.equal(mapParams.get('rok'), '2025')
assert.equal(mapParams.get('obszar'), 'alpy')
assert(!mapParams.has('zdjecie'))
const snapshot = { view: { ...mercator({ lat: 46.5, lng: 8.2 }), zoom: 7 }, tone: 'natural' }
const navigationHref = atlasViewHref('?atlas=switzerland&rok=2025&obszar=alpy&miejsca=wszystkie', snapshot)
const sharedHref = atlasShareHref(navigationHref)
const sharedUrl = new URL(sharedHref, 'http://127.0.0.1:8767')
assert.equal(sharedUrl.origin, 'http://127.0.0.1:8767', 'Preview sharing must keep the current host')
assert.equal(sharedUrl.pathname, atlasSharePath('switzerland'))
assert(!sharedUrl.searchParams.has('atlas'), 'The stable share path already identifies the place')
assert.equal(sharedUrl.searchParams.get('kadr'), '46.500000,8.200000,7.000')
assert.equal(sharedUrl.searchParams.get('podklad'), 'natural')
assert.equal(sharedUrl.searchParams.get('rok'), '2025')
assert.equal(sharedUrl.searchParams.get('obszar'), 'alpy')
assert.equal(sharedUrl.searchParams.get('miejsca'), 'wszystkie')
const restoredMap = resolvePageView(sharedUrl.pathname, sharedUrl.search)
assert.equal(restoredMap.pathname, '/mapa')
assert.deepEqual(Object.fromEntries(new URLSearchParams(restoredMap.search)), Object.fromEntries(new URL(navigationHref, SITE_ORIGIN).searchParams))
assert.equal(atlasShareHref('/mapa?atlas=sibiu&rok=2024'), '/mapa?atlas=sibiu&rok=2024', 'Paused map nodes retain their old local link only')
assert.equal(atlasShareHref('/mapa?atlas=missing'), '/mapa?atlas=missing')
assert.equal(resolveSharePage('/udostepnij/zdjecie/krywan-2025/removed-portrait'), null)
assert.equal(photoSharePath('krywan-2025', { full: '/removed.webp' }), null)
assert.equal(getPageMetadata('/udostepnij/unknown').share, undefined)
assert.equal(getPageMetadata('/udostepnij/unknown').noindex, true)
assert.equal(getPageMetadata('/constructor').noindex, true)
assert.deepEqual(resolvePageView('/szczyty', '?pasmo=Tatry'), { pathname: '/szczyty', search: '?pasmo=Tatry' })

const home = pageStructuredData(getPageMetadata('/'))
assert.equal(home['@type'], 'WebSite')
assert.equal(home.name, 'Cinek Zielu', 'Site name is the brand rather than an SEO title')
assert.deepEqual(home.author.sameAs, author.socials.map(item => item.href))
assert.equal(pageStructuredData(getPageMetadata('/o-mnie')).mainEntity['@id'], home.author['@id'])
for (const gallery of photoGalleries) {
  const schema = pageStructuredData(getPageMetadata(`/galerie/${gallery.id}`))
  assert.equal(schema['@type'], 'ImageGallery')
  assert.equal(schema.image.length, gallery.photos.length)
  assert.equal(schema.mainEntity.numberOfItems, gallery.photos.length)
  schema.image.forEach((image, index) => {
    assert.equal(image.contentUrl, SITE_ORIGIN + gallery.photos[index].full)
    assert.equal(image.creditText, author.name)
    assert.equal(image.creator['@id'], home.author['@id'])
    assert(!image.license && !image.acquireLicensePage, 'No unapproved licensing or shop claims')
  })
}
const summitSchema = pageStructuredData(getPageMetadata('/szczyty'))
assert.equal(summitSchema.mainEntity.numberOfItems, summits.length)
for (const page of sitePages) {
  const schema = pageStructuredData(page)
  const json = JSON.stringify(schema)
  assert.equal(schema.url, page.canonical)
  assert(!json.includes('VideoObject'), 'Video dates and dedicated watch pages are not inferred')
  assert(!json.includes('uploadDate') && !json.includes('datePublished'))
  assert(!json.includes('D:\\') && !json.includes('G:\\') && !json.includes('file://'))
}
console.log(`PASS: ${photos.length} exact photo previews, ${photographyCollections.length} collections, ${sharedAtlasIds.length} published atlas links; route preservation, export dimensions, excluded materials and structured data.`)
