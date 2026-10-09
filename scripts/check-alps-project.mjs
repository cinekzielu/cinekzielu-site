import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { build } from 'vite'
import { alpsProject } from '../src/data/alpsProject.js'
import { expeditionPages, findExpeditionPage } from '../src/data/expeditionPages.js'
import { expeditionsData } from '../src/data/expeditionsData.js'
import { filmCatalog } from '../src/data/filmCatalog.js'
import { searchSite } from '../src/data/siteSearch.js'
import { atlasHref, readAtlasSelection, readAtlasYear, getAtlasMaterials } from '../src/data/atlasContent.js'
import { getPageMetadata } from '../src/data/siteMetadata.js'
import { filterCollections } from '../src/data/collectionFilters.js'

const trip = findExpeditionPage('alpy-2026')
assert.equal(expeditionPages.filter(item => item.id === trip.id).length, 1, 'Extend the existing page, without a duplicate')
assert.equal(expeditionsData.filter(item => item.id === trip.id).length, 1, 'Legacy catalog has the same stable ID')
assert.equal(trip.project, alpsProject)
assert.equal(trip.gallery.photos.length, 48)
assert(trip.gallery.relatedExpeditionIds.includes(trip.id))
assert.equal(trip.gallery.coverImage, expeditionsData.find(item => item.id === trip.id).coverImage)
assert.equal(filterCollections(expeditionPages, { place: 'alpy', year: '2026' })[0], trip)
for (const name of ['Across the Alps', ...alpsProject.summits.map(summit => summit.name)]) {
  assert(searchSite(name).some(item => item.kind === 'expedition' && item.href === '/wyprawy/alpy-2026'), `Missing project search result: ${name}`)
}
const map = new URL(atlasHref(alpsProject.atlas.id, alpsProject.atlas.year), 'https://www.cinekzielu.pl')
assert.equal(readAtlasSelection(map.search), 'alpy')
assert.equal(readAtlasYear(map.search), '2026')
assert.deepEqual(getAtlasMaterials('alpy', '2026').galleries.map(item => item.id), [trip.id])
assert.equal(getPageMetadata('/wyprawy/alpy-2026').canonical, 'https://www.cinekzielu.pl/wyprawy/alpy-2026')
assert(getPageMetadata('/wyprawy/alpy-2026').title.includes('Across the Alps'))
assert.equal(alpsProject.films.length, 7)
assert(alpsProject.films.every(item => item.filmId === null), 'Unpublished series must not have fabricated IDs')
assert.equal(filmCatalog.filter(film => film.expeditionId === trip.id).length, 1, 'Keep only the established teaser in the published catalog')

// Render the real React components without a browser or a preview server.
// Temporary bundles stay below ignored node_modules and resolve installed React.
const outDir = await mkdtemp(path.resolve('node_modules/.alps-check-'))
const previousWindow = globalThis.window
// Existing PhotoGrid reads a media query while rendering; this is a static
// desktop fixture, not a browser, layout or interaction test.
globalThis.window = { matchMedia: () => ({ matches: false }) }
try {
  await build({ configFile: false, logLevel: 'silent', build: {
    ssr: true, outDir, copyPublicDir: false,
    rollupOptions: { input: {
      expeditions: path.resolve('src/components/Expeditions.jsx'),
      project: path.resolve('src/components/ExpeditionProject.jsx'),
      galleries: path.resolve('src/components/Galleries.jsx'),
      content: path.resolve('src/data/contentData.js'),
    }, output: { entryFileNames: '[name].mjs' } },
  } })
  const { ExpeditionPage, ExpeditionList } = await import(pathToFileURL(path.join(outDir, 'expeditions.mjs')))
  const { ExpeditionProjectFilms } = await import(pathToFileURL(path.join(outDir, 'project.mjs')))
  const { GalleryPage } = await import(pathToFileURL(path.join(outDir, 'galleries.mjs')))
  const { contentData } = await import(pathToFileURL(path.join(outDir, 'content.mjs')))
  assert.equal(contentData.expeditionsBySlug[trip.id].galleryCollectionSlug, trip.id, 'Legacy gallery relation resolves')
  const html = renderToStaticMarkup(React.createElement(ExpeditionPage, { slug: trip.id }))
  for (const text of ['Across the Alps', '119,98', '11 385', 'godz. 35 min', ...alpsProject.summits.map(summit => summit.name)]) assert(html.includes(text), text)
  assert(html.includes('href="/galerie/alpy-2026"'))
  assert(html.includes('href="/mapa?atlas=alpy&amp;rok=2026"'))
  assert(html.includes('15 lipca 2026, przed wyjazdem'))
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length, 'Unique section IDs')
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(anchor), `Broken anchor: ${anchor}`)
  const plan = renderToStaticMarkup(React.createElement(ExpeditionProjectFilms, { project: alpsProject }))
  assert.equal((plan.match(/class="cz-project-film-status"/g) || []).length, 7)
  assert(!/<a\b|<iframe\b/.test(plan), 'Pending films are plain text, with no play buttons or fake links')
  // A missing or unrelated catalog entry must never become a playable episode.
  for (const filmId of ['unknown-film', filmCatalog[0].youtubeId]) {
    const invalid = { ...alpsProject, films: [{ ...alpsProject.films[0], filmId }] }
    assert(!/<a\b/.test(renderToStaticMarkup(React.createElement(ExpeditionProjectFilms, { project: invalid }))))
  }
  // Exercise the publication branch using the existing verified teaser as a fixture only.
  const publishedFixture = { ...alpsProject, films: [{ ...alpsProject.films[0], filmId: alpsProject.preTripFilmId }] }
  assert(renderToStaticMarkup(React.createElement(ExpeditionProjectFilms, { project: publishedFixture })).includes('href="https://www.youtube.com/watch?v=l3KltGrKz2U"'))
  const list = renderToStaticMarkup(React.createElement(ExpeditionList))
  assert.equal((list.match(/href="\/wyprawy\/alpy-2026"/g) || []).length, 1)
  assert(list.includes('Across the Alps') && list.includes('seria w przygotowaniu'))
  assert(renderToStaticMarkup(React.createElement(GalleryPage, { slug: trip.id })).includes('href="/wyprawy/alpy-2026"'))
  for (const other of expeditionPages.filter(item => item.id !== trip.id)) {
    const page = renderToStaticMarkup(React.createElement(ExpeditionPage, { slug: other.id }))
    assert(!page.includes('cz-project-stats'), `Project UI leaked into ${other.id}`)
    assert(page.includes(other.title))
    if (other.gallery.films.length) assert(page.includes('id="filmy"'), `Existing film anchor lost: ${other.id}`)
  }
  assert(renderToStaticMarkup(React.createElement(ExpeditionPage, { slug: 'missing-trip' })).includes('Nie znaleziono wyprawy'))
} finally {
  if (previousWindow === undefined) delete globalThis.window
  else globalThis.window = previousWindow
  await rm(outDir, { recursive: true, force: true })
}
console.log(`PASS: Alpy catalog, 48-photo gallery, 5 summit searches, atlas/year, metadata, 7 non-playable pending slots, future publication links, anchors and all ${expeditionPages.length} expedition renders.`)
