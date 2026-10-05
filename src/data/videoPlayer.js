import { filmCatalog } from './filmCatalog.js'

export const durationSeconds = value => value.split(':').reduce((total,part) => total*60+Number(part),0)
export function readVideoTime(value = '') {
  if (/^\d+$/.test(value)) return Number(value)
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  return match ? Number(match[1] || 0)*3600+Number(match[2] || 0)*60+Number(match[3] || 0) : 0
}
export function resolveFilmLink(href) {
  if (!href) return null
  try {
    const url = new URL(href)
    if (url.protocol !== 'https:' || !['www.youtube.com','youtube.com','m.youtube.com','youtu.be'].includes(url.hostname)) return null
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:shorts|embed)\/([\w-]{11})$/)?.[1]
    const film = filmCatalog.find(item => item.youtubeId === id)
    if (!film) return null
    const start = Math.max(0, Math.min(durationSeconds(film.duration)-1, readVideoTime(url.searchParams.get('t') || url.searchParams.get('start') || '')))
    return { film, start, href:film.youtubeUrl+(start ? `&t=${start}s` : '') }
  } catch { return null }
}
export function formatVideoTime(seconds) {
  const s = Math.max(0,Math.floor(seconds)), minutes=Math.floor(s/60), hours=Math.floor(minutes/60)
  return hours ? `${hours}:${String(minutes%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}` : `${minutes}:${String(s%60).padStart(2,'0')}`
}

let apiPromise
export function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve,reject) => {
    const previous = window.onYouTubeIframeAPIReady
    let timer
    const finish = () => { clearTimeout(timer); resolve(window.YT); if (typeof previous === 'function') previous() }
    window.onYouTubeIframeAPIReady = finish
    const script = document.createElement('script')
    script.src='https://www.youtube.com/iframe_api'; script.async=true
    const fail = () => { clearTimeout(timer); apiPromise=null; reject(new Error('YouTube player unavailable')) }
    script.onerror=fail
    timer=window.setTimeout(fail,15000)
    document.head.appendChild(script)
  })
  return apiPromise
}
