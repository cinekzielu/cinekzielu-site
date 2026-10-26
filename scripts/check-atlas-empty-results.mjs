import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'
import { atlasContentNodes, searchAtlasNodes, hasAtlasMaterials, readAtlasYear } from '../src/data/atlasContent.js'

// Render the actual JSX and invoke its supplied callbacks without a browser.
// This checks recovery availability/dispatch, not DOM focus or keyboard behavior.
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' })
try {
  const { AtlasEmptyResults } = await server.ssrLoadModule('/src/components/AtlasEmptyResults.jsx')
  const children = node => !node || typeof node !== 'object' ? [] : [node, ...[node.props?.children].flat(Infinity).flatMap(children)]
  for (const query of ['', '   ', 'nieistniejace-miejsce']) for (const year of ['all', '2025']) for (const onlyMaterials of [false, true]) {
    const calls = []
    const tree = AtlasEmptyResults({ query, year, onlyMaterials, onClearQuery: () => calls.push('query'), onAllYears: () => calls.push('year'), onAllPlaces: () => calls.push('materials') })
    const buttons = children(tree).filter(node => node.type === 'button')
    const expected = [query.trim() && 'query', year !== 'all' && 'year', onlyMaterials && year === 'all' && 'materials'].filter(Boolean)
    for (const button of buttons) { assert.equal(button.props.type, 'button'); button.props.onClick() }
    assert.deepEqual(calls, expected)
    const html = renderToStaticMarkup(tree)
    assert.equal((html.match(/role="status"/g) || []).length, 1)
    assert(!html.includes('role="status"><button'), 'Actions are outside the live status message')
    if (query.trim()) assert(html.includes('wpisanej nazwy'))
  }
  // Real Tatry searches hidden by a valid year. Turning off the material-only
  // toggle cannot restore them; keeping the query and changing to all years can.
  const tatryNodes = atlasContentNodes.filter(node => node.parent === 'tatry')
  for (const [query, year, id] of [['Łomnica', '2024', 'lomnica'], ['Gerlach', '2026', 'gerlach'], ['Staroleśny', '2025', 'starolesny-szczyt']]) {
    assert.equal(readAtlasYear(`?atlas=tatry&rok=${year}`), year)
    const matches = searchAtlasNodes(query, tatryNodes)
    assert(matches.some(node => node.id === id), query)
    assert(matches.every(node => !hasAtlasMaterials(node.id, year)), `${query}: no materials in ${year}`)
    assert(hasAtlasMaterials(id, 'all'), `${query}: all years restores the matching place`)
    for (const onlyMaterials of [true, false]) {
      let selected
      const tree = AtlasEmptyResults({ query, year, onlyMaterials, onAllYears: () => { selected = ['tatry', 'all'] } })
      const buttons = children(tree).filter(node => node.type === 'button')
      const allYears = buttons.find(button => button.props.children === 'Pokaż wszystkie lata')
      assert(allYears, `${query}: year recovery available with material toggle ${onlyMaterials}`)
      assert(!buttons.some(button => button.props.children === 'Pokaż także miejsca bez materiałów'))
      allYears.props.onClick()
      assert.deepEqual(selected, ['tatry', 'all'])
    }
  }
  // Static integration guard only: this is not a DOM focus/history assertion.
  const tatrySource = await readFile(new URL('../src/components/TatryExplorer.jsx', import.meta.url), 'utf8')
  assert(tatrySource.includes('!currentNodes.length && <AtlasEmptyResults'))
  assert(tatrySource.includes('ref={searchInputRef} type="search"'))
  const allYearsHandler = tatrySource.split('\n').find(line => line.includes('onAllYears='))
  assert(allYearsHandler?.includes("onSelect(selectedId, 'all')"), 'Reuse existing selection/history handler')
  assert(!allYearsHandler.includes('setQuery'), 'All years keeps the searched name')
  assert(allYearsHandler.includes('searchInputRef.current?.focus({ preventScroll: true })'))
  assert(!tatrySource.includes('Zmień nazwę lub wyłącz filtr'))
  console.log('PASS: 12 empty-result states, contextual callbacks and status; 3 real Tatry searches hidden by year with both toggle states; static integration guard. No browser QA.')
} finally { await server.close() }
