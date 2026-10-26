import assert from 'node:assert/strict'
import { initializeBrowseMemory, readBrowseReturn, requestBrowseReturn, browseLabel } from '../src/browseMemory.js'

assert.equal(browseLabel('/szczyty/gerlach?rok=2025#wejscia'), 'szczytu')
assert.equal(browseLabel('/szczyty?rok=2025#szczyt-gerlach'), 'szczytów')

const store = new Map()
globalThis.sessionStorage = { getItem:key => store.get(key) || null, setItem:(key,value) => store.set(key,value), removeItem:key => store.delete(key) }
let documentEvents, windowEvents
function page(url) {
  globalThis.location = new URL(url, 'https://www.cinekzielu.pl')
  globalThis.scrollY = 640
  documentEvents = {}; windowEvents = {}
  globalThis.document = { activeElement:null, querySelectorAll:() => [], addEventListener:(name,fn) => { documentEvents[name] = fn } }
  globalThis.window = { addEventListener:(name,fn) => { windowEvents[name] = fn }, dispatchEvent:() => {} }
  globalThis.history = {
    state:null, scrollRestoration:'auto',
    replaceState(state, _, url) { this.state=state; if (url) globalThis.location=new URL(url,location) },
    pushState(state, _, url) { this.state=state; globalThis.location=new URL(url,location) },
  }
  initializeBrowseMemory()
}
function click(target, extra = {}) {
  const anchor = { href:new URL(target,location).href, target:'', hasAttribute:() => false, closest:() => null }
  documentEvents.click({ target:{ closest:() => anchor }, button:0, ...extra })
  windowEvents.pagehide()
}
const source = '/wyprawy?widok=os&rok=2025&miejsce=tatry'
page(source)
const firstId = history.state.__czBrowse.id
history.pushState({ filter:'kept' }, '', source + '&test=1')
assert.notEqual(history.state.__czBrowse.id, firstId)
assert.equal(history.state.filter, 'kept')
history.replaceState({ marker:'kept' }, '', source)
assert.equal(history.state.marker, 'kept')
click('/wyprawy/krywan-2025')
page('/wyprawy/krywan-2025')
assert.equal(readBrowseReturn().url, source)
click('/galerie/krywan-2025')
page('/galerie/krywan-2025')
assert.equal(readBrowseReturn().url, '/wyprawy/krywan-2025')
requestBrowseReturn(readBrowseReturn())
windowEvents.pagehide()
page('/wyprawy/krywan-2025')
assert.equal(readBrowseReturn().url, source, 'Nested return retains the original filtered timeline')
requestBrowseReturn(readBrowseReturn())
windowEvents.pagehide()
page(source)
assert.equal(readBrowseReturn(), null)
click('https://example.com/')
assert(!store.has('cz:browse:next'))
click('/kierunki', { ctrlKey:true })
assert(!store.has('cz:browse:next'), 'Modified clicks do not transfer a stale return context')
const beforeHash = history.state.__czBrowse.id
click(source + '#podroze-2025')
assert(!store.has('cz:browse:next'), 'Same-page anchors are not a page departure')
location.hash = 'podroze-2025'
windowEvents.hashchange()
assert.notEqual(history.state.__czBrowse.id, beforeHash, 'Anchor entry has an independent position')
globalThis.sessionStorage.setItem = () => { throw new Error('Storage blocked') }
page('/trasy')
assert.equal(history.scrollRestoration, 'auto', 'Unavailable storage keeps native scroll restoration')
assert.equal(history.state, null)
console.log('Browse memory OK: unique history entries, state preservation, nested return chain, modifier/external links, storage-disabled fallback.')
