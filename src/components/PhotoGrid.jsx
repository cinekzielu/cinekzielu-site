import React, { useEffect, useRef, useState } from 'react'
import { ResponsivePhoto } from './ResponsivePhoto'
import { PhotoViewer } from './PhotoViewer'
import { linkedPhotoIndex, photoViewUrl } from '../data/photoView'

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

export function PhotoGrid({ gallery, featured = false, previewLimit = null, eagerFirst = true, shareable = false }) {
  const isVideoFrames = gallery.mediaKind === 'video-frames'
  const columns = useColumns(featured)
  const [current, setCurrent] = useState(() => shareable ? linkedPhotoIndex(gallery.photos, window.location.search) : null)
  const trigger = useRef(null)
  const updateLinkedUrl = photo => {
    if (!shareable || !new URLSearchParams(window.location.search).has('zdjecie')) return
    const url = new URL(window.location.href)
    if (photo) url.searchParams.set('zdjecie', new URL(photoViewUrl(url.href, photo)).searchParams.get('zdjecie'))
    else url.searchParams.delete('zdjecie')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }
  const close = () => { setCurrent(null); updateLinkedUrl(null) }
  const step = delta => {
    const next = (current + delta + gallery.photos.length) % gallery.photos.length
    updateLinkedUrl(gallery.photos[next]); setCurrent(next)
  }
  useEffect(() => {
    if (!shareable) return
    const sync = () => setCurrent(linkedPhotoIndex(gallery.photos, window.location.search))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [shareable, gallery.photos])

  const visiblePhotos = previewLimit === null ? gallery.photos : gallery.photos.slice(0, previewLimit)
  const rows = featured ? [{ start: 0, items: visiblePhotos.slice(0, 1) }] : []
  for (let index = featured ? 1 : 0; index < visiblePhotos.length; index += columns) rows.push({ start: index, items: visiblePhotos.slice(index, index + columns) })
  return <>
    <section className={`cz-gallery-grid${featured ? ' cz-portfolio-grid' : ''}`} aria-label={featured ? 'Wybrane fotografie' : `${gallery.title} — ${isVideoFrames ? 'kadry z nagrań' : 'zdjęcia z wyprawy'}`}>
      {rows.map(row => <div className="cz-photo-row" key={row.start}>
        {row.items.map((item, column) => {
          const index = row.start + column
          const lead = featured && index === 0
          const rowRatio = row.items.reduce((sum, image) => sum + image.width / image.height, 0)
          const fraction = (item.width / item.height) / rowRatio
          const sizes = columns === 1 || lead ? '(max-width:600px) calc(100vw - 28px), (max-width:900px) calc(100vw - 40px), (max-width:1448px) calc(100vw - 88px), 1360px' : `(max-width:900px) calc(${100 * fraction}vw - ${(40 + 12 * (row.items.length - 1)) * fraction}px), (max-width:1448px) calc(${100 * fraction}vw - ${(88 + 16 * (row.items.length - 1)) * fraction}px), ${(1360 - 16 * (row.items.length - 1)) * fraction}px`
          return <button className="cz-photo" type="button" key={item.src} style={{ '--ratio': item.width / item.height }} onClick={event => { trigger.current = event.currentTarget; setCurrent(index) }} aria-label={`Otwórz ${isVideoFrames ? 'kadr' : 'zdjęcie'} ${String(index + 1).padStart(2, '0')} z ${gallery.photos.length}`}>
            <ResponsivePhoto photo={item} full={featured} sizes={sizes} loading={eagerFirst && index === 0 ? 'eager' : 'lazy'} fetchPriority={eagerFirst && index === 0 ? 'high' : undefined} />
          </button>
        })}
      </div>)}
    </section>
    {current !== null && <PhotoViewer gallery={gallery} current={current} onStep={step} onClose={close} shareable={shareable} trigger={trigger} />}
  </>
}
