import React, { useEffect, useRef, useState } from 'react'
import { ResponsivePhoto } from './ResponsivePhoto'

function useColumns(featured) {
  const get = () => window.matchMedia('(max-width:600px)').matches ? 1 : featured || window.matchMedia('(max-width:900px)').matches ? 2 : 3
  const [columns, setColumns] = useState(get)
  useEffect(() => {
    const queries = [window.matchMedia('(max-width:600px)'), window.matchMedia('(max-width:900px)')]
    const update = () => setColumns(get())
    queries.forEach(query => query.addEventListener('change', update))
    return () => queries.forEach(query => query.removeEventListener('change', update))
  }, [featured])
  return columns
}

export function PhotoGrid({ gallery, featured = false }) {
  const columns = useColumns(featured)
  const [current, setCurrent] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const dialog = useRef(null)
  const trigger = useRef(null)
  const gesture = useRef(null)
  const isOpen = current !== null
  const photo = isOpen ? gallery.photos[current] : null
  const step = delta => {
    setImageFailed(false)
    setCurrent(index => index === null ? null : (index + delta + gallery.photos.length) % gallery.photos.length)
  }
  useEffect(() => {
    if (!isOpen) return
    const element = dialog.current
    const oldOverflow = document.body.style.overflow
    const oldRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = oldOverflow
      document.documentElement.style.overflow = oldRootOverflow
      trigger.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  const rows = featured ? [{ start: 0, items: gallery.photos.slice(0, 1) }] : []
  for (let index = featured ? 1 : 0; index < gallery.photos.length; index += columns) rows.push({ start: index, items: gallery.photos.slice(index, index + columns) })
  const finishGesture = event => {
    const start = gesture.current
    gesture.current = null
    if (!start || start.id !== event.pointerId || (window.visualViewport?.scale || 1) > 1) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1)
  }
  return <>
    <section className={`cz-gallery-grid${featured ? ' cz-portfolio-grid' : ''}`} aria-label={featured ? 'Wybrane fotografie' : `${gallery.title} — zdjęcia z wyprawy`}>
      {rows.map(row => <div className="cz-photo-row" key={row.start}>
        {row.items.map((item, column) => {
          const index = row.start + column
          const lead = featured && index === 0
          const rowRatio = row.items.reduce((sum, image) => sum + image.width / image.height, 0)
          const fraction = (item.width / item.height) / rowRatio
          const sizes = columns === 1 || lead ? '(max-width:600px) calc(100vw - 28px), (max-width:900px) calc(100vw - 40px), (max-width:1448px) calc(100vw - 88px), 1360px' : `(max-width:900px) calc(${100 * fraction}vw - ${(40 + 12 * (row.items.length - 1)) * fraction}px), (max-width:1448px) calc(${100 * fraction}vw - ${(88 + 16 * (row.items.length - 1)) * fraction}px), ${(1360 - 16 * (row.items.length - 1)) * fraction}px`
          return <button className="cz-photo" type="button" key={item.src} style={{ '--ratio': item.width / item.height }} onClick={event => { trigger.current = event.currentTarget; setImageFailed(false); setCurrent(index) }} aria-label={`Otwórz zdjęcie ${String(index + 1).padStart(2, '0')} z ${gallery.photos.length}`}>
            <ResponsivePhoto photo={item} full={featured} sizes={sizes} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : undefined} />
          </button>
        })}
      </div>)}
    </section>
    <dialog className="cz-lightbox" ref={dialog} aria-label={`${gallery.title} — podgląd fotografii`} onClose={() => setCurrent(null)} onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1) }
    }}>
      <div className="cz-lightbox-top"><span aria-live="polite" aria-atomic="true">{isOpen && `${String(current + 1).padStart(2, '0')} / ${gallery.photos.length}`}</span><button type="button" autoFocus onClick={() => setCurrent(null)}>Zamknij ×</button></div>
      <div className="cz-lightbox-stage" onPointerDown={event => {
        if (event.target.closest('button, a')) return
        if (!event.isPrimary || event.button !== 0) { gesture.current = null; return }
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
      }} onPointerUp={finishGesture} onPointerCancel={() => { gesture.current = null }}>
        {photo && (imageFailed ? <div className="cz-photo-error" role="status"><p>Nie udało się wczytać zdjęcia.</p><button type="button" onClick={() => setImageFailed(false)}>Spróbuj ponownie</button></div> : <img key={photo.full} src={photo.full} alt={photo.alt} width={photo.width} height={photo.height} decoding="async" draggable="false" onError={() => setImageFailed(true)} />)}
      </div>
      <div className="cz-lightbox-bottom"><button type="button" onClick={() => step(-1)} aria-label="Poprzednie zdjęcie">←</button>{photo?.sourceHref ? <a className="cz-lightbox-source" href={photo.sourceHref}>{photo.sourceLabel} ↗</a> : <span className="cz-lightbox-hint">Przesuń lub użyj strzałek</span>}<button type="button" onClick={() => step(1)} aria-label="Następne zdjęcie">→</button></div>
    </dialog>
  </>
}
