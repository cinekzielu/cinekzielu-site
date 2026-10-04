import { CollectionShell } from './CollectionShell'
import { findFilm } from '../data/filmCatalog'
import React, { useEffect } from 'react'
import { expeditionPages, expeditionHref, findExpeditionPage, filmCount } from '../data/expeditionPages'
import { galleryHref, galleryMapHref, photoCount } from '../data/galleryNavigation'
import '../expeditionStyles.css'

export function ExpeditionList({ expeditions = expeditionPages, compact = false }) {
  return <div className={`cz-expedition-list${compact ? ' is-compact' : ''}`}>
    {expeditions.map((expedition, index) => <a className="cz-expedition-row" key={expedition.id} href={expeditionHref(expedition)} aria-label={`Wyprawa: ${expedition.title} ${expedition.year}`}>
      <div className="cz-expedition-row-image"><img src={expedition.gallery.coverImage} alt={expedition.gallery.coverAlt} width={expedition.gallery.coverWidth} height={expedition.gallery.coverHeight} loading={compact || index > 1 ? 'lazy' : 'eager'} decoding="async" /></div>
      <div className="cz-expedition-row-body">
        <span className="cz-expedition-eyebrow">{expedition.region} · {expedition.kind}</span>
        <h2>{expedition.title} <span>{expedition.year}</span></h2>
        <span className="cz-expedition-material-count">{photoCount(expedition.gallery.photos.length)} · {filmCount(expedition.gallery.films)}</span>
      </div>
      <span className="cz-expedition-row-arrow" aria-hidden="true">↗</span>
    </a>)}
  </div>
}

function ExpeditionShell({ children, detail = false }) {
  return <CollectionShell section="wyprawy" className="cz-expeditions" detail={detail}>{children}</CollectionShell>
}

export function ExpeditionIndex() {
  return <ExpeditionShell>
    <div className="cz-gallery-intro"><h1>Wyprawy</h1><span className="cz-gallery-count">2025 — 2026</span></div>
    <p className="cz-expedition-index-intro">Zdjęcia, filmy, miejsca.</p>
    <ExpeditionList />
  </ExpeditionShell>
}

export function ExpeditionPage({ slug }) {
  const expedition = findExpeditionPage(slug)
  useEffect(() => {
    if (window.location.hash !== '#filmy') return
    let frame
    const scrollToFilms = () => { frame = window.requestAnimationFrame(() => document.getElementById('filmy')?.scrollIntoView({ behavior: 'instant', block: 'start' })) }
    scrollToFilms()
    window.addEventListener('load', scrollToFilms, { once: true })
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('load', scrollToFilms) }
  }, [])
  if (!expedition) return <ExpeditionShell detail><div className="cz-gallery-intro"><h1>Nie znaleziono wyprawy</h1></div><a className="cz-gallery-text-link" href="/wyprawy">Zobacz wszystkie wyprawy →</a></ExpeditionShell>
  const { gallery } = expedition
  const cover = gallery.photos.find(photo => photo.src === gallery.coverImage)
  const coverWidthAt = max => Math.round(cover.width * Math.min(1, max / Math.max(cover.width, cover.height)))
  const preview = gallery.photos.filter(photo => photo.src !== gallery.coverImage).slice(0, 3)
  const next = expeditionPages[(expeditionPages.indexOf(expedition) + 1) % expeditionPages.length]
  return <ExpeditionShell detail>
    <article>
      <div className="cz-expedition-hero">
        <div className="cz-expedition-hero-image"><img src={cover.src} srcSet={`${cover.src} ${coverWidthAt(960)}w, ${cover.full} ${coverWidthAt(2000)}w`} sizes="(max-width:760px) calc(100vw - 28px), (max-width:1240px) 55vw, 660px" alt={cover.alt} width={cover.width} height={cover.height} fetchPriority="high" decoding="async" /></div>
        <div className="cz-expedition-hero-body">
          <p className="cz-expedition-eyebrow">{expedition.kind}</p>
          <h1>{expedition.title}<span>{expedition.year}</span></h1>
          <p className="cz-expedition-description">{expedition.description}</p>
          <dl className="cz-expedition-facts"><div><dt>Termin</dt><dd>{expedition.date}</dd></div><div><dt>Region</dt><dd>{expedition.region}</dd></div></dl>
          <nav className="cz-expedition-actions" aria-label="Materiały z wyprawy">
            <a className="cz-expedition-primary" href={galleryHref(gallery)}>Galeria · {photoCount(gallery.photos.length)} <span aria-hidden="true">↗</span></a>
            <a href="#filmy">{gallery.films[0].label === 'Zwiastun' ? 'Zwiastun' : gallery.films.length === 1 ? 'Film z wyprawy' : 'Filmy z wyprawy'} ↓</a>
            <a href={galleryMapHref(gallery)}>Na mapie: {gallery.mapLabel} ↗</a>
          </nav>
        </div>
      </div>
      <section id="filmy" className="cz-expedition-films" aria-labelledby="expedition-films-title">
        <div className="cz-expedition-section-heading"><h2 id="expedition-films-title">{gallery.films[0].label === 'Zwiastun' ? 'Zwiastun' : 'Filmy'}</h2><span>YouTube</span></div>
        <div className="cz-expedition-film-list">{gallery.films.map((film, index) => <a href={film.url} key={film.id} target="_blank" rel="noreferrer" aria-label={`${film.title} — ${film.label}, YouTube`}>
          <span className="cz-expedition-film-number">{String(index + 1).padStart(2, '0')}</span><div><span className="cz-expedition-film-label">{film.label} · {findFilm(film.id)?.duration}</span><h3>{film.title}</h3></div><span className="cz-expedition-film-play" aria-hidden="true">↗</span>
        </a>)}</div>
      </section>
      <section className="cz-expedition-photos" aria-labelledby="expedition-photos-title">
        <div className="cz-expedition-section-heading"><h2 id="expedition-photos-title">Zdjęcia</h2><a href={galleryHref(gallery)}>Cała galeria · {photoCount(gallery.photos.length)} ↗</a></div>
        <a className="cz-expedition-photo-preview" href={galleryHref(gallery)} aria-label={`Zobacz galerię: ${expedition.title} ${expedition.year}`}>
          {preview.map(photo => <img key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" style={{ '--ratio': photo.width / photo.height }} />)}
        </a>
      </section>
    </article>
    <div className="cz-gallery-next"><span>Kolejna wyprawa</span><a href={expeditionHref(next)}>{next.title} <span className="cz-gallery-year">{next.year}</span> ↗</a></div>
  </ExpeditionShell>
}
