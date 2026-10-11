import assert from 'node:assert/strict'
import { expeditionPages, findExpeditionPage } from '../src/data/expeditionPages.js'
import { relatedExpeditions } from '../src/data/relatedExpeditions.js'
import { galleryAtlasIds } from '../src/data/tripGeography.js'

const before = JSON.stringify(expeditionPages)
const ids = id => relatedExpeditions(findExpeditionPage(id)).map(trip => trip.id)
assert.deepEqual(ids('szwajcaria-2025'), ['alpy-2026'])
assert.deepEqual(ids('alpy-2026'), ['szwajcaria-2025'])
assert.deepEqual(ids('gerlach-zima-2025').slice(0, 2), ['kiezmarski-szczyt-zima-2025', 'baranie-rogi-zima-2025'])
assert.deepEqual(ids('maroko-2025'), [])
assert.deepEqual(ids('turbacz-2026'), [])
assert(ids('baranie-rogi-lodowy-szczyt-2026').includes('baranie-rogi-zima-2025'), 'Same summit across seasons remains relevant')
assert.deepEqual(relatedExpeditions(undefined), [])
assert.deepEqual(relatedExpeditions(findExpeditionPage('gerlach-zima-2025'), []), [])
for (const trip of expeditionPages) {
  const related = relatedExpeditions(trip)
  assert(related.length <= 3)
  assert.equal(new Set(related.map(item => item.id)).size, related.length)
  assert(!related.some(item => item.id === trip.id))
  for (const item of related) {
    assert(expeditionPages.includes(item))
    assert(galleryAtlasIds(item.gallery).some(id => ['tatry', 'alpy', 'switzerland'].includes(id) && galleryAtlasIds(trip.gallery).includes(id)))
    assert(item.gallery.photos.some(photo => photo.src === item.gallery.coverImage))
  }
  if (trip.region.startsWith('Tatry') && !trip.kind.startsWith('Zimow') && trip.id !== 'baranie-rogi-lodowy-szczyt-2026') {
    assert(related.every(item => !item.kind.startsWith('Zimow')))
  }
  assert.deepEqual(relatedExpeditions(trip), related)
}
assert.equal(JSON.stringify(expeditionPages), before)
console.log('PASS: same-area recommendations, winter grouping, summer peers, Swiss/Alps pair, isolated regions, no self/duplicates, deterministic order and no catalogue mutation.')
