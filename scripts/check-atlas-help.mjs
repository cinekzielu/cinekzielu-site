import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { atlasHelpTopics, atlasHelpViews } from '../src/data/atlasHelp.js'
import { readAtlasSelection, readAtlasYear, getAtlasMaterials } from '../src/data/atlasContent.js'
import { getPageMetadata } from '../src/data/siteMetadata.js'

// Validate actionable examples against the real catalogue, not duplicated IDs.
for (const example of atlasHelpViews) {
  const url = new URL(example.href, 'https://example.test')
  assert.equal(url.pathname, '/mapa')
  assert.equal(readAtlasSelection(url.search), url.searchParams.get('atlas'), example.href)
  assert.equal(readAtlasYear(url.search), url.searchParams.get('rok'), example.href)
  const materials = getAtlasMaterials(readAtlasSelection(url.search), readAtlasYear(url.search))
  assert(materials.films.length + materials.galleries.length + materials.routes.length > 0, example.href)
}
for (const { link } of atlasHelpTopics.filter(topic => topic.link)) {
  assert.equal(getPageMetadata(link.href).noindex, undefined, link.href)
  assert((await stat(new URL(`../dist${link.href}.html`, import.meta.url))).isFile(), link.href)
}

// The same native, initially closed help is present in the prerendered fallback.
const html = await readFile(new URL('../dist/mapa.html', import.meta.url), 'utf8')
assert.equal((html.match(/class="cz-atlas-help"/g) || []).length, 1)
const help = html.match(/<details class="cz-atlas-help">([\s\S]*?)<\/details>/)?.[1]
assert(help, 'Help must be a native, closed disclosure without requiring JavaScript')
assert(help.includes('<summary>Jak korzystać z atlasu</summary>'))
for (const topic of atlasHelpTopics) assert(help.includes(topic.title))
for (const example of atlasHelpViews) {
  assert(help.includes(`href="${example.href.replaceAll('&', '&amp;')}"`), example.href)
}
assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1)
console.log('PASS: native atlas help in initial HTML, valid filtered examples with existing materials, catalogue target and one H1.')
