import React, { useEffect, useRef, useState } from 'react'
import { ResponsivePhoto } from './ResponsivePhoto'
import { slideshowChapters } from '../data/slideshowNavigation'
import '../photoSlideshow.css'

export function PhotoSlideshowButton({ photos, stage, title = 'Across the Alps', tripHref = '/wyprawy/alpy-2026', chapters = [] }) {
  const [open, setOpen] = useState(null)
  const trigger = useRef(null)
  return <div className="cz-slideshow-entry">
    <button ref={trigger} type="button" disabled={!photos.length} onClick={() => setOpen({photos:[...photos], title, stage, tripHref, chapters})}>▷ Pokaz fotografii</button>
    <span>{stage || title} · {photos.length} {photos.length === 1 ? 'zdjęcie' : photos.length % 10 >= 2 && photos.length % 10 <= 4 && !(photos.length % 100 >= 12 && photos.length % 100 <= 14) ? 'zdjęcia' : 'zdjęć'}</span>
    {open && <PhotoSlideshow {...open} trigger={trigger} onClose={() => setOpen(null)} />}
  </div>
}

function PhotoSlideshow({ photos, stage, title, tripHref, chapters, trigger, onClose }) {
  const dialog = useRef(null), gesture = useRef(null)
  const [index, setIndex] = useState(0), [playing, setPlaying] = useState(false)
  const [seconds, setSeconds] = useState(8), [loaded, setLoaded] = useState(''), [failed, setFailed] = useState('')
  const [fullscreen, setFullscreen] = useState(false), [fullscreenAvailable, setFullscreenAvailable] = useState(false), [notice, setNotice] = useState('')
  const [thumbnails,setThumbnails] = useState(false)
  const strip = useRef(null)
  const jumps = slideshowChapters(photos,chapters)
  const activeChapter = jumps.find(chapter=>chapter.indices.includes(index))
  const jump = target => {setPlaying(false);setIndex(target)}
  useEffect(()=>{if(thumbnails)strip.current?.querySelector('[aria-current="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'})},[index,thumbnails])
  const photo = photos[index], last = index === photos.length - 1
  const move = delta => { setPlaying(false); setIndex(value => (value + delta + photos.length) % photos.length) }
  const play = () => {
    if (photos.length < 2) return
    if (playing) setPlaying(false)
    else { if (last) setIndex(0); setPlaying(true) }
  }
  useEffect(() => {
    const element = dialog.current
    const overflow = document.body.style.overflow, rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = document.documentElement.style.overflow = 'hidden'
    element.showModal()
    setFullscreenAvailable(Boolean(document.fullscreenEnabled && element.requestFullscreen))
    const visibility = () => { if (document.hidden) setPlaying(false) }
    const screen = () => setFullscreen(document.fullscreenElement === element)
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('fullscreenchange', screen)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      document.removeEventListener('fullscreenchange', screen)
      if (document.fullscreenElement === element) document.exitFullscreen().catch(() => {})
      element.close()
      document.body.style.overflow = overflow; document.documentElement.style.overflow = rootOverflow
      trigger.current?.focus({ preventScroll: true })
    }
  }, [])
  useEffect(() => {
    if (!playing || loaded !== photo.full || failed === photo.full) return
    const timer = window.setTimeout(() => {
      if (last) setPlaying(false)
      else setIndex(value => value + 1)
    }, seconds * 1000)
    return () => window.clearTimeout(timer)
  }, [playing, index, loaded, failed, seconds, photo.full, last])
  useEffect(() => {
    if (loaded !== photo.full || last) return
    const next = new Image(); next.src = photos[index + 1].full
  }, [index, loaded, photo.full, last, photos])
  const toggleFullscreen = async () => {
    setNotice('')
    try { if (document.fullscreenElement === dialog.current) await document.exitFullscreen(); else await dialog.current.requestFullscreen() }
    catch { setNotice('Pełny ekran jest niedostępny. Pokaz pozostaje w oknie przeglądarki.') }
  }
  const keyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('select, input')) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) }
    if (event.code === 'Space' && !event.target.closest('button, a')) { event.preventDefault(); play() }
  }
  return <dialog ref={dialog} className="cz-slideshow" aria-label={`${title} — pokaz fotografii`} onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={keyDown}>
    <header className="cz-slideshow-top"><div><strong>{title}</strong>{stage && <span>{stage}</span>}</div><div className="cz-slideshow-top-actions">{fullscreenAvailable && <button type="button" onClick={toggleFullscreen}>{fullscreen ? 'Wyjdź z pełnego ekranu' : 'Pełny ekran'}</button>}<button type="button" autoFocus onClick={onClose} aria-label="Zamknij pokaz fotografii">Zamknij ×</button></div></header>
    <div className="cz-slideshow-stage" tabIndex={0} aria-label="Fotografia. Strzałki zmieniają zdjęcia, spacja uruchamia lub zatrzymuje pokaz." onPointerDown={event => {
      if (!event.isPrimary || event.button !== 0) return
      gesture.current = { id:event.pointerId, x:event.clientX, y:event.clientY }
    }} onPointerUp={event => {
      const start = gesture.current; gesture.current = null
      if (!start || start.id !== event.pointerId || (window.visualViewport?.scale || 1) > 1) return
      const dx = event.clientX - start.x, dy = event.clientY - start.y
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
    }} onPointerCancel={() => { gesture.current = null }}>
      {failed === photo.full ? <div className="cz-slideshow-message" role="status"><p>Nie udało się wczytać zdjęcia.</p><button type="button" onClick={() => { setFailed(''); setLoaded('') }}>Spróbuj ponownie</button></div> : <>
        <img key={photo.full} src={photo.full} alt={photo.alt} width={photo.width} height={photo.height} draggable="false" decoding="async" onLoad={() => setLoaded(photo.full)} onError={() => { setFailed(photo.full); setPlaying(false) }} />
        {loaded !== photo.full && <span className="cz-slideshow-loading" role="status">Wczytywanie zdjęcia…</span>}
      </>}
    </div>
    {thumbnails && <nav className="cz-slideshow-drawer" id="slideshow-thumbnails" aria-label="Miniatury fotografii">
      {jumps.length > 1 && <label>Etap<select aria-label="Przejdź do etapu" value={activeChapter?.id || ''} onChange={event=>{const chapter=jumps.find(item=>item.id===event.target.value);if(chapter)jump(chapter.indices[0])}}><option value="" disabled>Wybierz etap</option>{jumps.map(chapter=><option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></label>}
      <div ref={strip} className="cz-slideshow-thumbs">{photos.map((item,i)=><button type="button" key={item.full} aria-current={index===i ? 'true' : undefined} aria-label={`Przejdź do zdjęcia ${i+1}: ${item.alt}`} onClick={()=>jump(i)}><ResponsivePhoto photo={item} sizes="96px" loading="lazy"/><span>{String(i+1).padStart(2,'0')}</span></button>)}</div>
    </nav>}
    <footer className="cz-slideshow-bottom"><div className="cz-slideshow-controls"><button type="button" aria-label="Poprzednie zdjęcie" disabled={photos.length < 2} onClick={() => move(-1)}>←</button><span className="cz-slideshow-count" aria-live={playing ? 'off' : 'polite'}>{String(index + 1).padStart(2,'0')} / {photos.length}</span><button type="button" aria-label="Następne zdjęcie" disabled={photos.length < 2} onClick={() => move(1)}>→</button><button className="cz-slideshow-play" type="button" disabled={failed === photo.full || photos.length < 2} onClick={play}>{playing ? 'Ⅱ Pauza' : last ? '▷ Od początku' : '▷ Odtwórz'}</button><button type="button" aria-expanded={thumbnails} aria-controls="slideshow-thumbnails" onClick={()=>setThumbnails(value=>!value)}>{thumbnails ? 'Schowaj miniatury' : 'Miniatury'}</button><label>Tempo<select aria-label="Czas wyświetlania zdjęcia" disabled={photos.length < 2} value={seconds} onChange={event => setSeconds(Number(event.target.value))}><option value={5}>5 s</option><option value={8}>8 s</option><option value={12}>12 s</option></select></label></div>{tripHref ? <a href={tripHref}>O wyprawie ↗</a> : photo.sourceHref ? <a href={photo.sourceHref}>Otwórz zdjęcie ↗</a> : null}</footer>
    {notice && <p className="cz-slideshow-notice" role="status">{notice}</p>}
  </dialog>
}
