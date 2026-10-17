import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { highestPeak, routeHref } from '../src/data/routeAtlas.js'
import { tripRoutes } from '../src/data/tripRoutes.js'
import { sitePages, pageStructuredData, getPageMetadata } from '../src/data/siteMetadata.js'
import { searchSite } from '../src/data/siteSearch.js'
import { galleryData } from '../src/data/galleryData.js'

assert.equal(catalog.length, 45)
assert.equal(new Set(catalog.map(row => row.id)).size, catalog.length)
assert.deepEqual(catalog.map(row => row.sortDate), catalog.map(row => row.sortDate).sort().reverse())
const page = await readFile(new URL('../dist/trasy.html', import.meta.url), 'utf8')
assert(page.includes('<h1>Trasy</h1>'))
assert.equal((page.match(/class="cz-route-catalog-row"/g) || []).length, catalog.length)
for (const row of catalog) {
  const route = tripRoutes[row.id]
  const source = row.id === 'dufourspitze' ? 'dufourTrack.json' : `tracks/${row.id}.json`
  const track = JSON.parse(await readFile(new URL(`../src/data/${source}`, import.meta.url), 'utf8'))
  assert.equal(row.distance, track.distance, `${row.id}: show the real GPS distance`)
  assert.equal(row.profiles.length, new Set(track.points.map(point => point[3])).size, 'Do not connect recording gaps')
  assert(row.profiles.every(segment => segment.split(' ').every(pair => pair.split(',').map(Number).every(Number.isFinite))))
  const href = routeHref(row, route)
  assert(page.includes(`href="${href}"`))
  if (row.trip) {
    const target = await readFile(new URL(`../dist/wyprawy/${row.trip}.html`, import.meta.url), 'utf8')
    assert(target.includes(`id="${route.anchor}"`))
  } else assert.equal(href, `/trasy?trasa=${row.id}#profil`)
  assert(searchSite(`${route.title} GPX`).some(item => item.kind === 'route' && item.href === href))
  const peak = highestPeak(route)
  if (peak) assert(page.replaceAll('<!-- -->', '').includes(`${peak.altitude.toLocaleString('pl-PL')} <small>m</small>`), 'Use catalogue summit height, not GPS maximum')
}
assert(sitePages.some(item => item.path === '/trasy'))
assert.equal(pageStructuredData(getPageMetadata('/trasy')).mainEntity.numberOfItems, catalog.length)
const summer = galleryData.find(item => item.id === 'baranie-rogi-lodowy-szczyt-2026')
const winter = galleryData.find(item => item.id === 'baranie-rogi-zima-2025')
assert.notEqual(summer.mediaKind, 'video-frames')
assert.equal(winter.mediaKind, 'video-frames')
for (const gallery of [summer, winter]) {
  const html = await readFile(new URL(`../dist/wyprawy/${gallery.id}.html`, import.meta.url), 'utf8')
  assert.equal((html.match(/id="dwa-sezony"/g) || []).length, 1)
  const comparison = html.split('id="dwa-sezony"')[1].split('</section>')[0]
  assert(comparison.includes('Fotografie · SONY') && comparison.includes('Kadry z nagrań · DJI'))
  assert(comparison.includes(summer.films[0].url.replaceAll('&', '&amp;')))
  assert(comparison.includes(winter.films[0].url.replaceAll('&', '&amp;')))
  assert(comparison.includes(`/wyprawy/${winter.id}#kadry`))
  assert(!comparison.includes(`/galerie/${winter.id}`), 'Video stills stay on the expedition page')
}
console.log('PASS: all real routes, dates, GPS distances, summit heights, recording gaps, search, anchors, structured data and correctly separated seasonal material.')
