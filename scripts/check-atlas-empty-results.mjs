import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { renderToStaticMarkup } from 'react-dom/server'

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
  console.log('PASS: 12 empty-result states, contextual recovery callbacks, native buttons and separate status message. No browser QA.')
} finally { await server.close() }
