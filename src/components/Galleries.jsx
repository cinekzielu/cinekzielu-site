import { CollectionShell } from './CollectionShell'
import { findFilm } from '../data/filmCatalog'
import React, { useEffect, useRef, useState } from 'react'
import { galleryData } from '../data/galleryData'
import { expeditionHref } from '../data/expeditionPages'
import { galleryHref, galleryMapHref, photoCount } from '../data/galleryNavigation'
import '../galleryStyles.css'

export function GalleryCards({ galleries = galleryData, compact = false }) {
  return (
    <div className={`cz-gallery-cards${compact ? ' cz-gallery-cards-compact' : ''}`}>
      {galleries.map((gallery, index) => (
        <a className="cz-gallery-card" key={gallery.id} href={galleryHref(gallery)} aria-label={`${gallery.title} ${gallery.year} — ${photoCount(gallery.photos.length)}`}>
          <div className="cz-gallery-cover"><img src={gallery.coverImage} alt={gallery.coverAlt} width={gallery.coverWidth} height={gallery.coverHeight} loading={compact || index > 1 ? 'lazy' : 'eager'} decoding="async" /></div>
          <div className="cz-gallery-caption">
            <h2>{gallery.title} <span className="cz-gallery-year">{gallery.year}</span></h2>
            <span className="cz-gallery-count">{photoCount(gallery.photos.length)}</span>
            <span className="cz-gallery-arrow" aria-hidden="true">↗</span>
          </div>
        </a>
      ))}
    </div>
  )
}

function GalleryShell({ children, detail = false }) {
  return <CollectionShell section="galerie" className="cz-galleries" detail={detail}>{children}</CollectionShell>
}

export function GalleryIndex() {
  return <GalleryShell><div className="cz-gallery-intro"><h1>Galerie</h1><span className="cz-gallery-count">{galleryData.length} wyprawy · {photoCount(galleryData.reduce((sum, g) => sum + g.photos.length, 0))}</span></div><GalleryCards /></GalleryShell>
}

function useColumns() {
  const get = () => window.matchMedia('(max-width:600px)').matches ? 1 : window.matchMedia('(max-width:900px)').matches ? 2 : 3
  const [columns, setColumns] = useState(get)
  useEffect(() => {
    const queries = [window.matchMedia('(max-width:600px)'), window.matchMedia('(max-width:900px)')]
    const update = () => setColumns(get())
    queries.forEach(query => query.addEventListener('change', update))
    return () => queries.forEach(query => query.removeEventListener('change', update))
  }, [])
  return columns
}

function PhotoGrid({ gallery }) {
  const columns = useColumns()
  const [current, setCurrent] = useState(null)
  const dialog = useRef(null)
  const isOpen = current !== null
  const photo = isOpen ? gallery.photos[current] : null
  const step = (delta) => setCurrent(index => (index + delta + gallery.photos.length) % gallery.photos.length)
  useEffect(() => {
    if (!isOpen) return
    const element = dialog.current
    const oldOverflow = document.body.style.overflow
    const oldRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    element.showModal()
    return () => { element.close(); document.body.style.overflow = oldOverflow; document.documentElement.style.overflow = oldRootOverflow }
  }, [isOpen])
  const rows = []
  for (let index = 0; index < gallery.photos.length; index += columns) rows.push(gallery.photos.slice(index, index + columns))
  return <>
    <section className="cz-gallery-grid" aria-label={`${gallery.title} — zdjęcia z wyprawy`}>
      {rows.map((row, rowIndex) => <div className="cz-photo-row" key={rowIndex}>
        {row.map((item, column) => {
          const index = rowIndex * columns + column
          return <button className="cz-photo" type="button" key={item.src} style={{ '--ratio': item.width / item.height }} onClick={() => setCurrent(index)} aria-label={`Otwórz zdjęcie ${String(index + 1).padStart(2, '0')} z ${gallery.photos.length}`}>
            <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
          </button>
        })}
      </div>)}
    </section>
    <dialog className="cz-lightbox" ref={dialog} aria-label={`${gallery.title} — podgląd fotografii`} onClose={() => setCurrent(null)} onKeyDown={event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1) }
    }}>
      <div className="cz-lightbox-top"><span aria-live="polite">{isOpen && `${String(current + 1).padStart(2, '0')} / ${gallery.photos.length}`}</span><button type="button" autoFocus onClick={() => setCurrent(null)}>Zamknij ×</button></div>
      <div className="cz-lightbox-stage">{photo && <img src={photo.full} alt={photo.alt} />}</div>
      <div className="cz-lightbox-bottom"><button type="button" onClick={() => step(-1)} aria-label="Poprzednie zdjęcie">←</button><button type="button" onClick={() => step(1)} aria-label="Następne zdjęcie">→</button></div>
    </dialog>
  </>
}

export function GalleryPage({ slug }) {
  const gallery = galleryData.find(item => item.id === slug)
  if (!gallery) return <GalleryShell detail><div className="cz-gallery-intro"><h1>Nie znaleziono galerii</h1></div><a className="cz-gallery-text-link" href="/galerie">Zobacz wszystkie galerie →</a></GalleryShell>
  const next = galleryData[(galleryData.indexOf(gallery) + 1) % galleryData.length]
  return <GalleryShell detail>
    <div className="cz-gallery-intro"><h1>{gallery.title} <span className="cz-gallery-year">{gallery.year}</span></h1><span className="cz-gallery-count">{photoCount(gallery.photos.length)}</span></div>
    <nav className="cz-gallery-context" aria-label="Materiały z wyprawy">
      <a href={expeditionHref(gallery)}>O wyprawie ↗</a>
      <a href={galleryMapHref(gallery)}>Na mapie: {gallery.mapLabel} ↗</a>
      <a href={gallery.films[0].url} target="_blank" rel="noreferrer">{gallery.films[0].label === 'Zwiastun' ? 'Zwiastun na YouTube' : 'Film na YouTube'} ↗</a>
      {gallery.films.length > 1 && <a href="#filmy">Wszystkie filmy ↓</a>}
    </nav>
    <PhotoGrid gallery={gallery} />
    {gallery.films.length > 1 && <section id="filmy" className="cz-gallery-films" aria-labelledby="gallery-films-title"><h2 id="gallery-films-title">Filmy z wyprawy</h2><div>{gallery.films.map(film => <a key={film.id} href={film.url} target="_blank" rel="noreferrer"><span>{film.label} · {findFilm(film.id)?.duration}</span>{film.title}<span aria-hidden="true">↗</span></a>)}</div></section>}
    <div className="cz-gallery-next"><span>Kolejna galeria</span><a href={galleryHref(next)}>{next.title} <span className="cz-gallery-year">{next.year}</span> ↗</a></div>
  </GalleryShell>
}
