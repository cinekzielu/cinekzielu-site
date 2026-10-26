import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import catalog from '../src/data/routeCatalog.json' with { type: 'json' }
import { comparisonSample, comparisonShareHref, readRouteAtlas } from '../src/data/routeAtlas.js'
import { routeSampleDescription, comparisonPointDescription } from '../src/data/routePointDescription.js'

const tracks = Object.fromEntries(await Promise.all(catalog.map(async row => [row.id, JSON.parse(await readFile(new URL(`../src/data/${row.id === 'dufourspitze' ? 'dufourTrack.json' : `tracks/${row.id}.json`}`, import.meta.url)))])))
let points = 0
for (const track of Object.values(tracks)) {
  for (const fraction of [0, .25, .5, .75, 1]) {
    const distance = track.distance * fraction, sample = comparisonSample(track, distance)
    const description = comparisonPointDescription(distance, [sample, comparisonSample(track, track.distance + 1)])
    assert(description.includes(`A: ${routeSampleDescription(sample)}`))
    assert(description.includes('B: Poza zapisem tej trasy'))
    if (sample.kind === 'point') assert(description.includes(sample.elevation.toLocaleString('pl-PL', { maximumFractionDigits: 0 })))
    points++
  }
}
const gapped = { points: [[46, 9, 1000, 0, 0], [46, 9, 1200, 0, 500], [47, 10, 1700, 1, 700], [47, 10, 1800, 1, 900]] }
assert.equal(routeSampleDescription(comparisonSample(gapped, 600)), 'Przerwa w zapisie GPS')
assert.equal(routeSampleDescription(comparisonSample({ points: [] }, 0)), 'Brak danych punktu')
assert.equal(comparisonPointDescription(600, [comparisonSample(gapped, 600), comparisonSample(gapped, 900)]), '0,6 km od początku tras. A: Przerwa w zapisie GPS. B: ≈ 1800 m n.p.m.')

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { RouteComparison } = await server.ssrLoadModule('/src/components/RouteComparison.jsx')
  const { RouteComparisonShare } = await server.ssrLoadModule('/src/components/RouteComparisonShare.jsx')
  const state = readRouteAtlas('?porownaj=toubkal-2025,swinica-2025&dzienA=1&dzienB=2')
  const href = comparisonShareHref(state, 600)
  const share = { href, url: 'https://example.test' + href, copied: true }
  const showShare = (result, currentHref) => renderToStaticMarkup(React.createElement(RouteComparisonShare, { result, href: currentHref, onClose() {} }))
  assert(showShare(share, href).includes('Link skopiowany.'))
  assert(showShare({ ...share, copied: false }, href).includes('Skopiuj link z pola poniżej.'))
  assert.equal(showShare(null, href), '')
  for (const patch of [
    { year: '2025' }, { material: 'oba' }, { area: [8, 45, 9, 46] },
    { region: 'Tatry' }, { distance: 'do-20' }, { ascent: 'do-1500' },
    { view: 'list' }, { sort: 'shortest' }, { selected: 'swinica-2025' },
    { compare: ['dufourspitze', 'ganek-wysoka-rysy'], compareDays: ['all', 'all'] },
    { compareDays: ['2', '1'] },
  ]) {
    const nextHref = comparisonShareHref({ ...state, ...patch }, 600)
    assert.notEqual(nextHref, href)
    // Both an already displayed result and a late completion of the old copy
    // carry the old href, so neither can claim success for the new view.
    assert.equal(showShare(share, nextHref), '')
    assert.equal(showShare({ ...share, copied: false }, nextHref), '')
    const nextResult = { href: nextHref, url: 'https://example.test' + nextHref, copied: true }
    assert(showShare(nextResult, nextHref).includes('Link skopiowany.'))
  }
  assert.equal(showShare(share, comparisonShareHref(state, 800)), '')

  const pair = ['dufourspitze', 'ganek-wysoka-rysy']
  const render = (selected, loaded, loadError = false, days = ['all', 'all']) => renderToStaticMarkup(React.createElement(RouteComparison, {
    selected, tracks: loaded, loadError, onRetry() {}, onChange() {}, onDaysChange() {}, onShowPoint() {},
    atlasState: { ...readRouteAtlas(''), compare: selected, compareDays: days },
  }))
  for (const loadError of [false, true]) {
    assert(render([], {}, loadError).includes('po wyborze tras'))
    assert(render([pair[0]], {}, loadError).includes('Wybierz drugą trasę'))
    assert(!render([pair[0]], {}, loadError).includes('Nie udało się wczytać profili'))
  }
  for (const loaded of [{}, { [pair[0]]: tracks[pair[0]] }]) {
    const loading = render(pair, loaded)
    assert(loading.includes('Wczytywanie profili…'))
    const failed = render(pair, loaded, true)
    assert(failed.includes('Nie udało się wczytać profili do porównania.'))
    assert(failed.includes('Spróbuj ponownie'))
    assert(failed.includes('role="status"'))
    assert(!failed.includes('Wczytywanie profili…'))
    // A retry clears the error before successful data arrives.
    assert(render(pair, loaded, false).includes('Wczytywanie profili…'))
  }
  for (const loadError of [false, true]) {
    const ready = render(pair, tracks, loadError)
    assert(ready.includes('class="cz-route-interactive-profile"'))
    assert(!ready.includes('Nie udało się wczytać profili'))
    assert(!ready.includes('Wczytywanie profili…'))
    const value = ready.match(/aria-valuetext="([^"]+)"/)[1]
    assert.equal(value, comparisonPointDescription(0, pair.map(id => comparisonSample(tracks[id], 0))))
    assert(ready.includes(`>${routeSampleDescription(comparisonSample(tracks[pair[0]], 0))}</strong>`))
  }
  const days = render(['toubkal-2025', 'toubkal-2025'], tracks, false, ['1', '2'])
  assert(days.includes('aria-valuetext="0 km od początku tras. A:'))
  assert(days.includes('B: ≈'))
} finally { await server.close() }
const parent = await readFile(new URL('../src/components/RouteCatalog.jsx', import.meta.url), 'utf8')
assert(parent.includes('<RouteComparison loadError={loadError} onRetry='), 'Existing fetch state and retry must reach the comparison')
assert(!parent.includes('Porównanie jest gotowe poniżej.'), 'Choosing two IDs does not prove their tracks are loaded')
console.log(`PASS: ${points} real GPS point descriptions; gap/outside/missing states; SSR empty/single/pending/partial/failure/retry/ready and two-day comparison; share feedback across 11 state changes and cursor movement, including late results. No browser or screen-reader QA.`)
