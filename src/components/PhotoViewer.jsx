import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fittedPhotoSize, photoViewUrl } from '../data/photoView'
import { photoInquiry } from '../data/photoInquiry'
import '../photoViewer.css'

export function PhotoViewer({ gallery, current, onStep, onClose, shareable, trigger }) {
  const photo = gallery.photos[current]
  const frames = gallery.mediaKind === 'video-frames'
  const inquiry = frames ? null : photoInquiry(photo)
  const dialog = useRef(null), stage = useRef(null), gesture = useRef(null), linkInput = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [size, setSize] = useState({ width: 1, height: 1 })
  const [failed, setFailed] = useState(false)
  const [share, setShare] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')
  const shareRevision = useRef(0)
  useEffect(() => {
    if (share) { linkInput.current?.focus(); linkInput.current?.select() }
  }, [share])
  useEffect(() => {
    const element = dialog.current
    const bodyOverflow = document.body.style.overflow, rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = document.documentElement.style.overflow = 'hidden'
    element.showModal()
    return () => {
      shareRevision.current++
      element.close()
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow
      trigger.current?.focus({ preventScroll: true })
    }
  }, [])
  useLayoutEffect(() => {
    const element = stage.current
    const update = () => setSize(fittedPhotoSize(photo, element.clientWidth, element.clientHeight))
    const observer = new ResizeObserver(update)
    observer.observe(element)
    update()
    return () => observer.disconnect()
  }, [photo])
  useLayoutEffect(() => {
    stage.current.scrollLeft = (size.width * zoom - stage.current.clientWidth) / 2
    stage.current.scrollTop = (size.height * zoom - stage.current.clientHeight) / 2
  }, [zoom, size])
  const step = delta => { setZoom(1); setFailed(false); setShare(null); setCopyStatus(''); shareRevision.current++; gesture.current = null; onStep(delta) }
  const copyLink = async () => {
    const revision = ++shareRevision.current
    const url = photoViewUrl(window.location.href, photo)
    setShare(url)
    setCopyStatus('Link do zdjęcia — możesz go zaznaczyć i skopiować.')
    try {
      await navigator.clipboard.writeText(url)
      if (revision === shareRevision.current) setCopyStatus('Link skopiowany.')
    } catch { /* Manual field remains available when clipboard access is unavailable. */ }
  }
  const keyDown = event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input')) return
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault()
      if (zoom > 1) stage.current.scrollBy({ left: event.key === 'ArrowRight' ? 90 : event.key === 'ArrowLeft' ? -90 : 0, top: event.key === 'ArrowDown' ? 90 : event.key === 'ArrowUp' ? -90 : 0 })
      else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') step(event.key === 'ArrowRight' ? 1 : -1)
    }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(value => Math.min(3, value + 1)) }
    if (event.key === '-') { event.preventDefault(); setZoom(value => Math.max(1, value - 1)) }
    if (event.key === '0') { event.preventDefault(); setZoom(1) }
  }
  return <dialog ref={dialog} className="cz-lightbox cz-photo-viewer" aria-label={`${gallery.title} — podgląd ${frames ? 'kadru' : 'fotografii'}`} onCancel={event => { event.preventDefault(); onClose() }} onClose={onClose} onKeyDown={keyDown}>
    <div className="cz-lightbox-top"><span aria-live="polite">{String(current + 1).padStart(2, '0')} / {gallery.photos.length}</span><button autoFocus type="button" onClick={onClose}>Zamknij ×</button></div>
    <div className="cz-photo-viewer-tools" aria-label="Narzędzia podglądu">
      <div role="group" aria-label="Powiększenie zdjęcia"><button type="button" aria-label="Pomniejsz zdjęcie" disabled={zoom === 1 || failed} onClick={() => setZoom(value => Math.max(1, value - 1))}>−</button><button type="button" aria-label="Dopasuj całe zdjęcie" onClick={() => setZoom(1)}>{zoom === 1 ? 'Dopasuj' : `${zoom}×`}</button><button type="button" aria-label="Powiększ zdjęcie" disabled={zoom === 3 || failed} onClick={() => setZoom(value => Math.min(3, value + 1))}>+</button></div>
      <div className="cz-photo-viewer-actions">
        {shareable && <button type="button" onClick={copyLink}>Kopiuj link</button>}
        {inquiry && <a className="cz-photo-inquiry" href={inquiry.href} title={`Otwórz wiadomość do ${inquiry.email} z linkiem do zdjęcia`}>Zapytaj o zdjęcie ↗</a>}
      </div>
    </div>
    {share && <div className="cz-photo-share"><label>Link do zdjęcia<input ref={linkInput} readOnly value={share} onFocus={event => event.target.select()} onClick={event => event.currentTarget.select()} /></label><span role="status">{copyStatus}</span></div>}
    <div ref={stage} className={`cz-photo-viewport${zoom > 1 ? ' is-zoomed' : ''}`} onDoubleClick={() => !failed && setZoom(value => value === 1 ? 2 : 1)} onPointerDown={event => {
      if (event.target.closest('button, a') || !event.isPrimary || event.button !== 0) { gesture.current = null; return }
      gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: stage.current.scrollLeft, top: stage.current.scrollTop }
      if (event.pointerType === 'mouse') event.currentTarget.setPointerCapture(event.pointerId)
    }} onPointerMove={event => {
      const start = gesture.current
      if (!start || start.id !== event.pointerId || zoom === 1 || event.pointerType !== 'mouse') return
      stage.current.scrollLeft = start.left - (event.clientX - start.x)
      stage.current.scrollTop = start.top - (event.clientY - start.y)
    }} onPointerUp={event => {
      const start = gesture.current; gesture.current = null
      if (!start || start.id !== event.pointerId || zoom > 1 || (window.visualViewport?.scale || 1) > 1) return
      const dx = event.clientX - start.x, dy = event.clientY - start.y
      if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1)
    }} onPointerCancel={() => { gesture.current = null }}>
      <div className="cz-photo-canvas" style={{ width: size.width * zoom, height: size.height * zoom }}>
        {failed ? <div className="cz-photo-error" role="status"><p>Nie udało się wczytać zdjęcia.</p><button type="button" onClick={() => setFailed(false)}>Spróbuj ponownie</button></div> : <img key={photo.full} src={photo.full} alt={photo.alt} width={photo.width} height={photo.height} style={{ width: size.width * zoom, height: size.height * zoom }} decoding="async" draggable="false" onError={() => setFailed(true)} />}
      </div>
    </div>
    <div className="cz-lightbox-bottom"><button type="button" onClick={() => step(-1)} aria-label={frames ? 'Poprzedni kadr' : 'Poprzednie zdjęcie'}>←</button><span className="cz-photo-viewer-info"><span className="cz-lightbox-hint">{zoom > 1 ? 'Przeciągnij zdjęcie lub użyj strzałek' : 'Przesuń, użyj strzałek lub powiększ +'}</span>{photo.sourceHref && <a className="cz-lightbox-source" href={photo.sourceHref}>{photo.sourceLabel} ↗</a>}</span><button type="button" onClick={() => step(1)} aria-label={frames ? 'Następny kadr' : 'Następne zdjęcie'}>→</button></div>
  </dialog>
}
