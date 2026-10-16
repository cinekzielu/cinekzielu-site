import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { savedCatalog, savedByKey, savedPhotoKey, decodeSaved, encodeSaved, toggleSaved, savedComparisonHref } from '../src/data/savedItems.js'
import { photoGalleries, videoFrameCollections } from '../src/data/galleryData.js'
import { portfolioPhotos } from '../src/data/portfolioData.js'
import { getPageMetadata, sitePages, pageStructuredData } from '../src/data/siteMetadata.js'

assert.equal(savedCatalog.length, savedByKey.size, 'Stable bookmark IDs must be unique')
const [first, second] = savedCatalog
const keys = [first.key, second.key]
assert.deepEqual(decodeSaved(encodeSaved(keys)), keys)
assert.deepEqual(decodeSaved(JSON.stringify({ version: 1, items: [null, {}, first.key, first.key, 'trip:gone', 'https://bad.invalid'] })), [first.key])
for (const raw of [null, '', 'not json', '{}', 'null', '[]', '{"version":2,"items":[]}', '{"version":1,"items":"broken"}', 'x'.repeat(200001)]) assert.deepEqual(decodeSaved(raw), [])
assert.deepEqual(toggleSaved([first.key], first.key), [])
assert.deepEqual(toggleSaved([first.key], second.key), [second.key, first.key])
assert.deepEqual(toggleSaved(keys, 'unknown'), keys)
assert.equal(JSON.stringify(JSON.parse(encodeSaved(keys))), JSON.stringify({ version: 1, items: keys }), 'Store IDs only')
for (const photo of portfolioPhotos) {
  const key = savedPhotoKey(photo)
  assert(key, 'Portfolio photos have the same bookmarks as their source galleries')
  assert.equal(savedByKey.get(key).photo.full, photo.full)
}
for (const gallery of photoGalleries) for (const photo of gallery.photos) {
  const item = savedByKey.get(savedPhotoKey(photo))
  assert.equal(item.href.split('?')[0], `/galerie/${gallery.id}`)
  assert.equal(new URL(item.href, 'https://test.invalid').searchParams.get('zdjecie'), item.id)
}
for (const gallery of videoFrameCollections) for (const photo of gallery.photos) assert.equal(savedPhotoKey(photo), null, 'Video frames stay outside saved photographs')
const routes = savedCatalog.filter(item => item.type === 'route').map(item => item.key)
assert.equal(savedComparisonHref([routes[0]]), null)
assert.equal(savedComparisonHref(routes.slice(0, 3)), null)
assert.equal(savedComparisonHref([routes[0], routes[0]]), null)
assert.equal(new URL(savedComparisonHref([routes[0], first.key, routes[1]]), 'https://test.invalid').searchParams.get('porownaj'), routes.slice(0, 2).map(key => savedByKey.get(key).id).join(','))
assert.equal(getPageMetadata('/zapisane').noindex, true)
assert.equal(pageStructuredData(getPageMetadata('/zapisane')), null)
assert(!sitePages.some(page => page.path === '/zapisane'))
const html = await readFile(new URL('../dist/zapisane.html', import.meta.url), 'utf8')
assert(html.includes('content="noindex, follow"'))
assert(html.includes('<h1>Zapisane</h1>'))
assert(!html.includes('cz-saved-card-link'), 'No browser list is baked into public HTML')
assert(!(await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8')).includes('/zapisane'))
console.log(`PASS: ${savedCatalog.length} unique bookmarks, browser data validation, stable photo identity, video separation, comparison selection, private noindex page.`)
