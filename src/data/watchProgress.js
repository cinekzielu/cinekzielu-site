import { filmCatalog } from './filmCatalog.js'

export const watchProgressKey = 'cz:watch-progress:v1'
export const watchProgressEvent = 'cz:watch-progress'
const known = new Set(filmCatalog.map(film => film.youtubeId))
const usable = row => known.has(row?.id) && Number.isFinite(row.position) && Number.isFinite(row.duration)
  && row.duration > 0 && row.duration < 86400 && row.position >= 10
  && row.position < row.duration - Math.min(15, row.duration * .03) && Number.isFinite(row.updated)

export function parseWatchProgress(raw) {
  try {
    const data = JSON.parse(raw)
    if (data?.version !== 1 || !Array.isArray(data.items)) return []
    const seen = new Set()
    return data.items.filter(usable).sort((a,b) => b.updated - a.updated).filter(row => {
      if (seen.has(row.id)) return false
      seen.add(row.id); return true
    }).slice(0, 12).map(({ id, position, duration, updated }) => ({ id, position, duration, updated }))
  } catch { return [] }
}

// Storage access can be blocked. In that case progress lasts for this page only.
export function createWatchStore(getStorage, notify = () => {}) {
  let fallback = [], persistent = true
  const read = () => {
    if (!persistent) return fallback
    try { const storage = getStorage(); if (!storage) throw new Error('Unavailable'); return parseWatchProgress(storage.getItem(watchProgressKey)) }
    catch { persistent = false; return fallback }
  }
  const write = items => {
    fallback = items
    try { getStorage().setItem(watchProgressKey, JSON.stringify({ version: 1, items })); persistent = true }
    catch { persistent = false }
    notify()
  }
  return {
    read,
    isPersistent: () => persistent,
    remove: id => write(read().filter(row => row.id !== id)),
    clear: () => write([]),
    save(id, position, duration) {
      if (!known.has(id) || !Number.isFinite(position) || !Number.isFinite(duration) || duration <= 0 || position < 0 || duration >= 86400) return
      const row = { id, position: Math.floor(position), duration, updated: Date.now() }
      const existing = read()
      if (existing.some(item => item.id === id && item.position === row.position && item.duration === duration)) return
      const rest = existing.filter(item => item.id !== id)
      if (!usable(row) && rest.length === existing.length) return
      write(usable(row) ? [row, ...rest].slice(0, 12) : rest)
    },
  }
}
export const watchStore = createWatchStore(() => window.localStorage, () => window.dispatchEvent(new Event(watchProgressEvent)))

// Only confirmed playback enables saving; opening a chapter or a blocked embed does not.
export function trackPlayback(id, store = watchStore) {
  let played = false, ended = false
  const capture = player => {
    if (!played || ended) return
    try { store.save(id, player.getCurrentTime(), player.getDuration()) } catch { /* unavailable player */ }
  }
  return {
    capture,
    state(event) {
      if (event.data === 0) { ended = true; store.remove(id) }
      else if (event.data === 1) { played = true; ended = false; capture(event.target) }
      else if (event.data === 2) capture(event.target)
    },
  }
}
