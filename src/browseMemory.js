// Session-only navigation positions. No account, analytics, upload or persistent history.
const KEY = 'cz:browse:v1'
const PENDING = 'cz:browse:next'
const RETURN = 'cz:browse:return'
const TTL = 6 * 60 * 60 * 1000
const stateKey = '__czBrowse'
export function safeBrowseUrl(value, origin) {
  try {
    const url = new URL(value, origin)
    return url.origin === origin && /^https?:$/.test(url.protocol) ? url.pathname + url.search + url.hash : null
  } catch { return null }
}
export function browseLabel(url) {
  const [path, query = ''] = url.split('#')[0].split('?')
  if (path === '/wyprawy') return new URLSearchParams(query).get('widok') === 'os' ? 'osi podróży' : 'listy wypraw'
  if (path.startsWith('/wyprawy/')) return 'wyprawy'
  if (path === '/kierunki') return 'kierunków'
  if (path.startsWith('/kierunki/')) return 'kierunku'
  return ({ '/trasy':'tras', '/szczyty':'szczytów', '/galerie':'galerii', '/fotografia':'fotografii', '/filmy':'filmów', '/mapa':'mapy', '/':'strony głównej' })[path] || 'przeglądania'
}
const read = key => { try { return JSON.parse(sessionStorage.getItem(key)) } catch { return null } }
const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* Storage disabled: ordinary links still work. */ } }
const remove = key => { try { sessionStorage.removeItem(key) } catch { /* optional */ } }
const urlNow = () => location.pathname + location.search + location.hash
const newId = () => crypto.randomUUID()
let restorePosition = () => {}

export function initializeBrowseMemory() {
  // If session storage is unavailable, keep native history/scroll behavior intact.
  try { sessionStorage.setItem(KEY + ':probe', '1'); sessionStorage.removeItem(KEY + ':probe') } catch { return }
  const originalPush = history.pushState.bind(history), originalReplace = history.replaceState.bind(history)
  let current = history.state?.[stateKey] || { id:newId(), url:urlNow() }
  let entries = read(KEY) || {}
  if (typeof entries !== 'object' || Array.isArray(entries)) entries = {}
  let restoring = false, timer, restoreTimer, stopped = false
  const validEntry = id => {
    const item = entries[id]
    return item && Date.now() - item.time < TTL && safeBrowseUrl(item.url, location.origin) === item.url && Number.isFinite(item.y) && item.y >= 0 ? item : null
  }
  const persist = () => {
    entries = Object.fromEntries(Object.entries(entries).filter(([,item]) => item && Date.now() - item.time < TTL).sort((a,b) => b[1].time-a[1].time).slice(0,50))
    write(KEY, entries)
  }
  const capture = anchor => {
    if (restoring) return
    const focused = anchor || (document.activeElement?.matches('main a[href]') ? document.activeElement : null)
    entries[current.id] = { url:urlNow(), y:Math.max(0,scrollY), returnId:current.returnId, time:Date.now(),
      ...(focused ? { href:focused.getAttribute('href'), ordinal:[...document.querySelectorAll('main a[href]')].filter(a => a.getAttribute('href') === focused.getAttribute('href')).indexOf(focused), offset:focused.getBoundingClientRect().top } : {}) }
    persist()
  }
  const incoming = read(PENDING)
  remove(PENDING)
  if (incoming && incoming.target === urlNow() && Date.now() - incoming.time < 30000 && validEntry(incoming.id)) current = { ...current, returnId:incoming.id }
  originalReplace({ ...history.state, [stateKey]:current }, '')
  const requested = read(RETURN)
  remove(RETURN)
  const returning = requested?.url === urlNow() ? validEntry(requested.id) : null
  if (returning) {
    current = { ...current, returnId:returning.returnId }
    originalReplace({ ...history.state, [stateKey]:current }, '')
    entries[current.id] = returning; persist()
  }
  let initialRestore = returning || (['back_forward','reload'].includes(performance.getEntriesByType('navigation')[0]?.type) ? validEntry(current.id) : null)
  const stop = () => { stopped = true; restoring = false; clearTimeout(restoreTimer) }
  const restore = snapshot => {
    if (!snapshot || snapshot.url !== urlNow()) return
    stop(); stopped = false; restoring = true
    const started = Date.now()
    const step = () => {
      if (stopped) return
      const links = snapshot.href ? [...document.querySelectorAll('main a[href]')].filter(a => a.getAttribute('href') === snapshot.href) : []
      const anchor = links[snapshot.ordinal || 0]
      // Preserve the selected card's viewport offset even after a responsive layout change.
      const y = anchor ? scrollY + anchor.getBoundingClientRect().top - snapshot.offset : snapshot.y
      window.scrollTo({ top:Math.max(0,y), behavior:'instant' })
      if (Date.now() - started < 2000) restoreTimer = setTimeout(step, 100)
      else { restoring = false; anchor?.focus({ preventScroll:true }) }
    }
    restoreTimer = setTimeout(step, 100)
  }
  restorePosition = () => { if (initialRestore) { restore(initialRestore); initialRestore = null } }
  history.pushState = (state, unused, url) => {
    capture()
    current = { id:newId(), returnId:current.returnId }
    originalPush({ ...state, [stateKey]:current }, unused, url)
    current.url = urlNow()
    originalReplace({ ...history.state, [stateKey]:current }, '')
  }
  history.replaceState = (state, unused, url) => {
    originalReplace({ ...state, [stateKey]:current }, unused, url)
    current.url = urlNow()
  }
  // Only ordinary, same-tab internal navigation creates a contextual return link.
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]')
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute('download') || anchor.hasAttribute('data-browse-return')) return
    const target = safeBrowseUrl(anchor.href, location.origin)
    if (!target) return
    capture(anchor.closest('main') ? anchor : null)
    if (target.split('#')[0] === urlNow().split('#')[0]) return
    write(PENDING, { target, id:current.id, time:Date.now() })
  })
  window.addEventListener('scroll', () => { clearTimeout(timer); timer = setTimeout(() => capture(), 180) }, { passive:true })
  window.addEventListener('pagehide', () => { clearTimeout(timer); capture(); stop() })
  window.addEventListener('pageshow', event => { if (event.persisted) restore(validEntry(current.id)) })
  window.addEventListener('popstate', () => {
    stop()
    current = history.state?.[stateKey] || { id:newId(), url:urlNow() }
    restore(validEntry(current.id))
    window.dispatchEvent(new Event('cz:browse-change'))
  })
  window.addEventListener('hashchange', () => {
    // Native anchor navigation creates a history entry outside pushState.
    // Give it its own position without changing Back's previous entry.
    if (current.url !== urlNow()) {
      current = { id:newId(), url:urlNow(), returnId:current.returnId }
      originalReplace({ ...history.state, [stateKey]:current }, '')
    }
  })
  window.addEventListener('wheel', stop, { passive:true })
  window.addEventListener('touchstart', stop, { passive:true })
  window.addEventListener('pointerdown', stop, { passive:true })
  window.addEventListener('keydown', stop)
  history.scrollRestoration = 'manual'
}
export const restoreBrowsePosition = () => restorePosition()
export function readBrowseReturn() {
  const id = history.state?.[stateKey]?.returnId
  const item = read(KEY)?.[id]
  if (!item || Date.now()-item.time >= TTL || safeBrowseUrl(item.url,location.origin) !== item.url || item.url === urlNow()) return null
  return { id, url:item.url, label:browseLabel(item.url) }
}
export function requestBrowseReturn(item) {
  if (safeBrowseUrl(item.url, location.origin) !== item.url) return
  write(RETURN, { id:item.id, url:item.url })
  remove(PENDING)
}
