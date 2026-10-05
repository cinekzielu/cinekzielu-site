import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { CollectionFilters, useCollectionFilters } from './CollectionFilters'
import { findFilm } from '../data/filmCatalog'
import { FilmLink } from './SiteTools'
import React, { useEffect } from 'react'
import { expeditionPages, expeditionHref, findExpeditionPage, filmCount } from '../data/expeditionPages'
import { galleryHref, galleryMapLinks, photoCount } from '../data/galleryNavigation'
import '../expeditionStyles.css'

export function ExpeditionList({ expeditions = expeditionPages, compact = false }) {
  return <div className={`cz-expedition-list${compact ? ' is-compact' : ''}`}>
    {expeditions.map((expedition, index) => <a className="cz-expedition-row" key={expedition.id} href={expeditionHref(expedition)} aria-label={`Wyprawa: ${expedition.title} ${expedition.year}`}>
      <div className="cz-expedition-row-image"><ResponsivePhoto photo={expedition.gallery.photos.find(photo => photo.src === expedition.gallery.coverImage)} sizes="(max-width:520px) calc(100vw - 28px), (max-width:760px) 150px, (max-width:1000px) 220px, 260px" style={{ objectPosition: expedition.gallery.coverPosition }} loading={compact || index > 0 ? 'lazy' : 'eager'} /></div>
      <div className="cz-expedition-row-body">
        <span className="cz-expedition-eyebrow">{expedition.region} · {expedition.kind}</span>
        <h2>{expedition.title} <span>{expedition.year}</span></h2>
        <span className="cz-expedition-material-count">{photoCount(expedition.gallery.photos.length)}{expedition.gallery.films.length > 0 && ` · ${filmCount(expedition.gallery.films)}`}</span>
      </div>
      <span className="cz-expedition-row-arrow" aria-hidden="true">↗</span>
    </a>)}
  </div>
}

function ExpeditionShell({ children, detail = false }) {
  return <CollectionShell section="wyprawy" className="cz-expeditions" detail={detail}>{children}</CollectionShell>
}

export function ExpeditionIndex() {
  const view = useCollectionFilters(expeditionPages)
  return <ExpeditionShell>
    <div className="cz-gallery-intro"><h1>Wyprawy</h1><span className="cz-gallery-count">{[...view.options.years].reverse().join(' · ')}</span></div>
    <p className="cz-expedition-index-intro">Zdjęcia, filmy, miejsca.</p>
    <CollectionFilters view={view} emptyLabel="Brak pasujących wypraw" />
    <ExpeditionList expeditions={view.matches} />
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
  const preview = gallery.photos.filter(photo => photo.src !== gallery.coverImage).slice(0, 3)
  const next = expeditionPages[(expeditionPages.indexOf(expedition) + 1) % expeditionPages.length]
  return <ExpeditionShell detail>
    <article>
      <div className="cz-expedition-hero">
        <div className="cz-expedition-hero-image"><ResponsivePhoto photo={cover} full sizes="(max-width:760px) calc(100vw - 28px), (max-width:1240px) 55vw, 660px" fetchPriority="high" /></div>
        <div className="cz-expedition-hero-body">
          <p className="cz-expedition-eyebrow">{expedition.kind}</p>
          <h1>{expedition.title}<span>{expedition.year}</span></h1>
          <p className="cz-expedition-description">{expedition.description}</p>
          <dl className="cz-expedition-facts"><div><dt>Termin</dt><dd>{expedition.date}</dd></div><div><dt>Region</dt><dd>{expedition.region}</dd></div></dl>
          <nav className="cz-expedition-actions" aria-label="Materiały z wyprawy">
            <a className="cz-expedition-primary" href={galleryHref(gallery)}>Galeria · {photoCount(gallery.photos.length)} <span aria-hidden="true">↗</span></a>
            {gallery.films.length > 0 && <a href="#filmy">{gallery.films[0].label === 'Zwiastun' ? 'Zwiastun' : gallery.films.length === 1 ? 'Film z wyprawy' : 'Filmy z wyprawy'} ↓</a>}
            {galleryMapLinks(gallery).map(place => <a key={place.id} href={place.href}>Na mapie: {place.label} ↗</a>)}
          </nav>
        </div>
      </div>
      {gallery.films.length > 0 && <section id="filmy" className="cz-expedition-films" aria-labelledby="expedition-films-title">
        <div className="cz-expedition-section-heading"><h2 id="expedition-films-title">{gallery.films[0].label === 'Zwiastun' ? 'Zwiastun' : 'Filmy'}</h2><span>YouTube</span></div>
        <div className="cz-expedition-film-list">{gallery.films.map((film, index) => <FilmLink href={film.url} key={film.id} target="_blank" rel="noreferrer" aria-label={`${film.title} — ${film.label}, odtwórz film`}>
          <span className="cz-expedition-film-number">{String(index + 1).padStart(2, '0')}</span><div><span className="cz-expedition-film-label">{film.label} · {findFilm(film.id)?.duration}</span><h3>{film.title}</h3></div><span className="cz-expedition-film-play" aria-hidden="true">↗</span>
        </FilmLink>)}</div>
      </section>}
      <section className="cz-expedition-photos" aria-labelledby="expedition-photos-title">
        <div className="cz-expedition-section-heading"><h2 id="expedition-photos-title">Zdjęcia</h2><a href={galleryHref(gallery)}>Cała galeria · {photoCount(gallery.photos.length)} ↗</a></div>
        <a className="cz-expedition-photo-preview" href={galleryHref(gallery)} aria-label={`Zobacz galerię: ${expedition.title} ${expedition.year}`}>
          {preview.map(photo => <ResponsivePhoto key={photo.src} photo={photo} sizes="(max-width:520px) calc(100vw - 28px), (max-width:1448px) 32vw, 440px" loading="lazy" style={{ '--ratio': photo.width / photo.height }} />)}
        </a>
      </section>
    </article>
    <div className="cz-gallery-next"><span>Kolejna wyprawa</span><a href={expeditionHref(next)}>{next.title} <span className="cz-gallery-year">{next.year}</span> ↗</a></div>
  </ExpeditionShell>
}
