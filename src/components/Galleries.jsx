import { CollectionShell } from './CollectionShell'
import { CollectionFilters, useCollectionFilters } from './CollectionFilters'
import { findFilm } from '../data/filmCatalog'
import React from 'react'
import { PhotoGrid } from './PhotoGrid'
import { FilmLink } from './SiteTools'
import { ResponsivePhoto } from './ResponsivePhoto'
import { galleryData } from '../data/galleryData'
import { expeditionHref } from '../data/expeditionPages'
import { galleryHref, galleryMapLinks, photoCount, expeditionCount } from '../data/galleryNavigation'
import '../galleryStyles.css'

export function GalleryCards({ galleries = galleryData, compact = false }) {
  return (
    <div className={`cz-gallery-cards${compact ? ' cz-gallery-cards-compact' : ''}`}>
      {galleries.map((gallery, index) => (
        <a className="cz-gallery-card" key={gallery.id} href={galleryHref(gallery)} aria-label={`${gallery.title} ${gallery.year} — ${photoCount(gallery.photos.length)}`}>
          <div className="cz-gallery-cover"><ResponsivePhoto photo={gallery.photos.find(photo => photo.src === gallery.coverImage)} sizes={compact ? "(max-width:900px) calc(100vw - 40px), (max-width:1448px) 30vw, 440px" : "(max-width:600px) calc(100vw - 28px), (max-width:1448px) 46vw, 667px"} style={{ objectPosition: gallery.coverPosition }} loading={compact || index > 0 ? 'lazy' : 'eager'} /></div>
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
  const view = useCollectionFilters(galleryData)
  return <GalleryShell>
    <div className="cz-gallery-intro"><h1>Galerie</h1><span className="cz-gallery-count">{expeditionCount(galleryData.length)} · {photoCount(galleryData.reduce((sum, g) => sum + g.photos.length, 0))}</span></div>
    <CollectionFilters view={view} emptyLabel="Brak pasujących galerii" />
    <GalleryCards galleries={view.matches} />
  </GalleryShell>
}

export function GalleryPage({ slug }) {
  const gallery = galleryData.find(item => item.id === slug)
  if (!gallery) return <GalleryShell detail><div className="cz-gallery-intro"><h1>Nie znaleziono galerii</h1></div><a className="cz-gallery-text-link" href="/galerie">Zobacz wszystkie galerie →</a></GalleryShell>
  const next = galleryData[(galleryData.indexOf(gallery) + 1) % galleryData.length]
  return <GalleryShell detail>
    <div className="cz-gallery-intro"><h1>{gallery.title} <span className="cz-gallery-year">{gallery.year}</span></h1><span className="cz-gallery-count">{photoCount(gallery.photos.length)}</span></div>
    <nav className="cz-gallery-context" aria-label="Materiały z wyprawy">
      <a href={expeditionHref(gallery)}>O wyprawie ↗</a>
      {galleryMapLinks(gallery).map(place => <a key={place.id} href={place.href}>Na mapie: {place.label} ↗</a>)}
      {gallery.films.length > 0 && <FilmLink href={gallery.films[0].url} target="_blank" rel="noreferrer">{gallery.films[0].label === 'Zwiastun' ? 'Obejrzyj zwiastun' : 'Obejrzyj film'} ▷</FilmLink>}
      {gallery.films.length > 1 && <a href="#filmy">Wszystkie filmy ↓</a>}
    </nav>
    <PhotoGrid gallery={gallery} />
    {gallery.films.length > 1 && <section id="filmy" className="cz-gallery-films" aria-labelledby="gallery-films-title"><h2 id="gallery-films-title">Filmy z wyprawy</h2><div>{gallery.films.map(film => <FilmLink key={film.id} href={film.url} target="_blank" rel="noreferrer"><span>{film.label} · {findFilm(film.id)?.duration}</span>{film.title}<span aria-hidden="true">▷</span></FilmLink>)}</div></section>}
    <div className="cz-gallery-next"><span>Kolejna galeria</span><a href={galleryHref(next)}>{next.title} <span className="cz-gallery-year">{next.year}</span> ↗</a></div>
  </GalleryShell>
}
