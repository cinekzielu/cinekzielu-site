import assert from 'node:assert/strict'
import { filmCatalog, filterFilms } from '../src/data/filmCatalog.js'
import { defaultFilmFilters, filmLengths, filmDurationSeconds, readFilmFilters, filmLibraryHref, filterFilmLibrary } from '../src/data/filmLibrary.js'
import { searchSite } from '../src/data/siteSearch.js'
import { getAtlasMaterials, atlasNodeById } from '../src/data/atlasContent.js'
import { getDestination } from '../src/data/destinations.js'
import { resolveFilmLink } from '../src/data/videoPlayer.js'

const select = options => filterFilmLibrary({ ...defaultFilmFilters, ...options })
assert.equal(filmDurationSeconds('1:09:33'), 4173)
assert.equal(filmDurationSeconds('1:34'), 94)
assert.deepEqual(select({}), filmCatalog)
assert.deepEqual(select({ region: 'alpy' }), filterFilms('alpy', ''))
assert.deepEqual(select({ format: 'zwiastun' }).map(film => film.youtubeId), ['l3KltGrKz2U'])
assert.equal(select({ format: 'krotki' }).length, 4)
assert(select({ format: 'film' }).every(film => film.format === 'Film'))
assert.equal(select({ region: 'maroko', length: 'ponad-40', format: 'film' })[0].youtubeId, 'McawfrouM_0')
assert.equal(select({ region: 'maroko', format: 'zwiastun' }).length, 0)
assert.equal(select({ query: 'koscielec', format: 'krotki', length: 'do-5' }).length, 1)
for (const seconds of [1, 299, 300, 301, 1199, 1200, 1201, 2399, 2400, 2401, 4173]) {
  const matching = filmLengths.slice(1).filter(range => (range.min === undefined || seconds > range.min) && (range.max === undefined || seconds <= range.max))
  assert.equal(matching.length, 1, `Exactly one duration bucket for ${seconds}s`)
}
const buckets = filmLengths.slice(1).flatMap(range => select({ length: range.id }).map(film => film.id))
assert.equal(buckets.length, filmCatalog.length)
assert.equal(new Set(buckets).size, filmCatalog.length)
const filters = { region: 'tatry', query: 'Kościelec zimą', format: 'krotki', length: 'do-5' }
assert.deepEqual(readFilmFilters(new URL(filmLibraryHref(filters), 'https://example.org').search), filters)
assert.deepEqual(readFilmFilters('?miejsce=unknown&format=unknown&czas=unknown'), defaultFilmFilters)
assert.equal(filmLibraryHref(defaultFilmFilters), '/filmy')
const triglav = select({ query: 'Triglav', format: 'film', region: 'alpy', length: '20-40' })
assert.deepEqual(triglav.map(f => f.youtubeId), ['C8weHwRNLiE'])
assert.equal(triglav[0].publishedAt, '2026-11-11')
assert.equal(triglav[0].duration, '39:33')
assert.equal(select({ query: 'Triglav', region: 'szwajcaria' }).length, 0)
assert(!getDestination('szwajcaria').films.some(f => f.youtubeId === triglav[0].youtubeId))
for (const id of ['slovenia', 'triglav', 'alpy', 'europe', 'world']) assert(getAtlasMaterials(id, '2026').films.some(f => f.youtubeId === triglav[0].youtubeId), id)
for (const id of ['switzerland', 'austria', 'germany', 'liechtenstein', 'dufourspitze', 'grossglockner', 'grauspitz', 'zugspitze']) assert(!getAtlasMaterials(id).films.some(f => f.youtubeId === triglav[0].youtubeId), id)
assert.equal(atlasNodeById.triglav.chapter.seconds, 1478)
const result = searchSite('Triglav').find(item => item.id === 'film:C8weHwRNLiE')
assert.equal(resolveFilmLink(result.href).start, 1478)
assert(result.actions.some(action => action.href === '/galerie/alpy-2026?etap=triglav'))
assert.deepEqual(result.actions.filter(action => action.href.startsWith('/trasy')).map(action => action.href), ['/trasy?trasa=triglav'])
assert(!searchSite('Dufourspitze').some(item => item.id === 'film:C8weHwRNLiE'))
assert.deepEqual(triglav[0].chapters.map(part => part.seconds), [0,57,207,615,1478,2282])
assert(triglav[0].chapters.every(part => part.seconds < filmDurationSeconds(triglav[0].duration)))
console.log('PASS: format and duration combinations, hour-long films, disjoint boundaries, Polish search, country compatibility, URL round trips and invalid filter defaults.')
