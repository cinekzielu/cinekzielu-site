import assert from 'node:assert/strict'
import { siteSearchIndex, searchSite, normalizeSearch } from '../src/data/siteSearch.js'
import { resolveFilmLink, durationSeconds, readVideoTime, formatVideoTime } from '../src/data/videoPlayer.js'
import { atlasContentNodes, atlasNodeById } from '../src/data/atlasContent.js'
import { sitePages } from '../src/data/siteMetadata.js'
import { filmCatalog } from '../src/data/filmCatalog.js'

assert.equal(normalizeSearch('Łódź, ŚWINICA!'), 'lodz swinica')
assert.deepEqual(searchSite('swinica'), searchSite('Świnica'))
assert.deepEqual(new Set(searchSite('swinica').map(item => item.kind)), new Set(['place','expedition','gallery','film']))
assert(searchSite('lodowa kopa').some(item => item.title === 'Lodowa Kopa'))
assert.deepEqual(searchSite(''), [])
assert.deepEqual(searchSite('   '), [])
assert.deepEqual(searchSite('qwertyzzzz'), [])
assert.equal(new Set(siteSearchIndex.map(item => item.id)).size, siteSearchIndex.length)

const paths = new Set(sitePages.map(page => page.path))
for (const item of siteSearchIndex) {
  if (item.kind === 'film') {
    assert.equal(resolveFilmLink(item.href)?.film.youtubeId, item.film.youtubeId)
  } else {
    const url = new URL(item.href, 'https://www.cinekzielu.pl')
    assert(paths.has(url.pathname), `Search result must have an existing page: ${item.href}`)
    if (item.kind === 'place') assert(atlasNodeById[url.searchParams.get('atlas')])
  }
}
// Exact place names beat substring matches (Toubkal must not open the refuge chapter).
for (const place of atlasContentNodes.filter(item => item.chapter)) {
  const result = searchSite(place.name).find(item => item.id === `film:${place.chapter.videoId}`)
  assert(result, `Missing film for ${place.name}`)
  assert.equal(resolveFilmLink(result.href).start, place.chapter.seconds, place.name)
}
assert.equal(searchSite('Toubkal').find(item => item.kind === 'film').chapter.seconds, 1514)
assert.equal(searchSite('Ouzoud').find(item => item.kind === 'film').chapter.seconds, 3726)

const film = filmCatalog.find(item => item.youtubeId === 'McawfrouM_0')
for (const link of [film.youtubeUrl, `https://youtu.be/${film.youtubeId}`, `https://www.youtube.com/shorts/${film.youtubeId}`]) {
  assert.equal(resolveFilmLink(link)?.film, film)
}
assert.equal(resolveFilmLink(`${film.youtubeUrl}&t=1h2m6s`).start, 3726)
assert.equal(resolveFilmLink(`${film.youtubeUrl}&start=354`).start, 354)
assert.equal(resolveFilmLink(`${film.youtubeUrl}&t=999999`).start, durationSeconds(film.duration)-1)
assert.equal(resolveFilmLink(`${film.youtubeUrl}&t=-1`).start, 0)
for (const link of [null, '/filmy', 'javascript:alert(1)', `https://youtube.com.example.org/watch?v=${film.youtubeId}`, 'https://www.youtube.com/watch?v=unknown1234', film.youtubeUrl.replace('https:', 'http:')]) {
  assert.equal(resolveFilmLink(link), null)
}
assert.equal(readVideoTime('25m14s'), 1514)
assert.equal(readVideoTime('nonsense'), 0)
assert.equal(formatVideoTime(3726), '1:02:06')
assert.equal(formatVideoTime(1514), '25:14')
console.log(`PASS: ${siteSearchIndex.length} search entries, every route and verified chapter, Polish queries and safe film links.`)
