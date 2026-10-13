import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { PhotoGrid } from './PhotoGrid'
import { CollectionFilters, useCollectionFilters } from './CollectionFilters'
import { findFilm } from '../data/filmCatalog'
import { FilmLink } from './SiteTools'
import React, { useEffect, useState } from 'react'
import { expeditionPages, expeditionHref, findExpeditionPage, filmCount, sortExpeditionsNewest } from '../data/expeditionPages'
import { galleryHref, galleryMapLinks, galleryItemCount, isVideoCollection, isTripPhotoCollection } from '../data/galleryNavigation'
import { relatedExpeditions } from '../data/relatedExpeditions'
import { MoroccoStory, MoroccoStoryHero } from './MoroccoStory'
import { TravelTimeline } from './TravelTimeline'
import { AlpsStory, AlpsStoryHero } from './AlpsStory'
import '../expeditionStyles.css'

export function ExpeditionList({ expeditions = expeditionPages, compact = false }) {
  return <div className={`cz-expedition-list${compact ? ' is-compact' : ''}`}>
    {sortExpeditionsNewest(expeditions).map((expedition, index) => <a className="cz-expedition-row" key={expedition.id} href={expeditionHref(expedition)} aria-label={`Wyprawa: ${expedition.title} ${expedition.year}`}>
      <div className="cz-expedition-row-image"><ResponsivePhoto photo={expedition.gallery.photos.find(photo => photo.src === expedition.gallery.coverImage)} sizes="(max-width:520px) calc(100vw - 28px), (max-width:760px) 150px, (max-width:1000px) 220px, 260px" style={{ objectPosition: expedition.gallery.coverPosition }} loading={compact || index > 0 ? 'lazy' : 'eager'} /></div>
      <div className="cz-expedition-row-body">
        <span className="cz-expedition-eyebrow">{expedition.region} · {expedition.kind}</span>
        <h2>{expedition.title} <span>{expedition.year}</span></h2>
        <span className="cz-expedition-material-count">{galleryItemCount(expedition.gallery)}{expedition.gallery.films.length > 0 && ` · ${filmCount(expedition.gallery.films)}`}</span>
      </div>
      <span className="cz-expedition-row-arrow" aria-hidden="true">↗</span>
    </a>)}
  </div>
}

function ExpeditionShell({ children, detail = false }) {
  return <CollectionShell section="wyprawy" className="cz-expeditions" detail={detail}>{children}</CollectionShell>
}

function RelatedExpeditions({ expedition }) {
  const related = relatedExpeditions(expedition)
  return <section id="powiazane" className="cz-related-expeditions" aria-label="Powiązane wyprawy">
    {related.length > 0 && <>
      <div className="cz-expedition-section-heading"><h2>Z tej samej okolicy</h2></div>
      <div className="cz-related-grid">{related.map(trip => <a className="cz-related-card" key={trip.id} href={expeditionHref(trip)}>
        <div className="cz-related-image"><ResponsivePhoto photo={trip.gallery.photos.find(photo => photo.src === trip.gallery.coverImage)} sizes="(max-width:600px) calc(100vw - 28px), (max-width:1448px) 31vw, 437px" style={{ objectPosition: trip.gallery.coverPosition }} loading="lazy" /></div>
        <div className="cz-related-caption"><span className="cz-expedition-eyebrow">{trip.region} · {trip.kind}</span><h3>{trip.title} <span>{trip.year}</span></h3><div><span className="cz-expedition-material-count">{galleryItemCount(trip.gallery)}{trip.gallery.films.length > 0 && ` · ${filmCount(trip.gallery.films)}`}</span><span aria-hidden="true">↗</span></div></div>
      </a>)}</div>
    </>}
    <a className="cz-related-all" href="/wyprawy">Wszystkie wyprawy ↗</a>
  </section>
}

export function ExpeditionIndex() {
  const view = useCollectionFilters(expeditionPages, { preserveSearchKeys: ['widok'] })
  const readMode = () => new URLSearchParams(window.location.search).get('widok') === 'os' ? 'os' : 'lista'
  const [mode, setMode] = useState(readMode)
  useEffect(() => {
    const sync = () => setMode(readMode())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const changeMode = next => {
    if (next === mode) return
    const params = new URLSearchParams(window.location.search)
    if (next === 'os') params.set('widok', 'os')
    else params.delete('widok')
    window.history.pushState({}, '', window.location.pathname + (params.size ? `?${params}` : ''))
    setMode(next)
  }
  return <ExpeditionShell>
    <div className="cz-gallery-intro"><h1>Wyprawy</h1><span className="cz-gallery-count">{[...view.options.years].join(' · ')}</span></div>
    <p className="cz-expedition-index-intro">Od najnowszych. Zdjęcia, filmy, miejsca. <a href="/szczyty">Moje szczyty ↗</a></p>
    <div className="cz-trip-view-switch" role="group" aria-label="Widok wypraw">
      <button type="button" aria-pressed={mode === 'lista'} onClick={() => changeMode('lista')}>Lista</button>
      <button type="button" aria-pressed={mode === 'os'} onClick={() => changeMode('os')}>Oś podróży</button>
    </div>
    <CollectionFilters view={view} emptyLabel="Brak pasujących wypraw" />
    {mode === 'os' ? <TravelTimeline expeditions={view.matches} /> : <ExpeditionList expeditions={view.matches} />}
  </ExpeditionShell>
}

export function ExpeditionPage({ slug }) {
  const expedition = findExpeditionPage(slug)
  const [allFrames, setAllFrames] = useState(false)
  useEffect(() => {
    const sectionId = window.location.hash.slice(1)
    if (!['filmy', 'kadry', 'zdjecia', 'powiazane', 'opowiesc'].includes(sectionId)) return
    let frame
    const scrollToFilms = () => { frame = window.requestAnimationFrame(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'instant', block: 'start' })) }
    scrollToFilms()
    window.addEventListener('load', scrollToFilms, { once: true })
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('load', scrollToFilms) }
  }, [])
  if (!expedition) return <ExpeditionShell detail><div className="cz-gallery-intro"><h1>Nie znaleziono wyprawy</h1></div><a className="cz-gallery-text-link" href="/wyprawy">Zobacz wszystkie wyprawy →</a></ExpeditionShell>
  const { gallery } = expedition
  const videoFrames = isVideoCollection(gallery)
  const tripPhotos = isTripPhotoCollection(gallery)
  const hasStory = expedition.id === 'maroko-2025'
  const hasAlpsStory = expedition.id === 'alpy-2026'
  const cover = gallery.photos.find(photo => photo.src === gallery.coverImage)
  const preview = gallery.previewPhotoIndices
    ? gallery.previewPhotoIndices.map(index => gallery.photos[index]).filter(Boolean)
    : gallery.photos.filter(photo => photo.src !== gallery.coverImage).slice(0, 3)
  return <ExpeditionShell detail>
    <article>
      {hasStory ? <MoroccoStoryHero /> : hasAlpsStory ? <AlpsStoryHero /> : <div className="cz-expedition-hero">
        <div className="cz-expedition-hero-image"><ResponsivePhoto photo={cover} full sizes="(max-width:760px) calc(100vw - 28px), (max-width:1240px) 55vw, 660px" fetchPriority="high" /></div>
        <div className="cz-expedition-hero-body">
          <p className="cz-expedition-eyebrow">{expedition.kind}</p>
          <h1>{expedition.title}<span>{expedition.year}</span></h1>
          <p className="cz-expedition-description">{expedition.description}</p>
          <dl className="cz-expedition-facts"><div><dt>Termin</dt><dd>{expedition.date}</dd></div><div><dt>Region</dt><dd>{expedition.region}</dd></div></dl>
          <nav className="cz-expedition-actions" aria-label="Materiały z wyprawy">
            {videoFrames && gallery.films.length > 0
              ? <FilmLink className="cz-expedition-primary" href={gallery.films[0].url}>{gallery.films.length > 1 ? 'Obejrzyj pierwszą część' : 'Obejrzyj film'} <span aria-hidden="true">▷</span></FilmLink>
              : <a className="cz-expedition-primary" href={galleryHref(gallery)}>{tripPhotos ? 'Zdjęcia z wyprawy' : videoFrames ? 'Kadry z wyprawy' : 'Galeria'} · {galleryItemCount(gallery)} <span aria-hidden="true">↗</span></a>}
            {videoFrames && gallery.films.length > 0 && <a href="#kadry">Kadry z wyprawy ↓</a>}
            {gallery.films.length > 0 && <a href="#filmy">{gallery.films[0].label === 'Zwiastun' ? 'Zwiastun' : gallery.films.length === 1 ? 'Film z wyprawy' : 'Filmy z wyprawy'} ↓</a>}
            {galleryMapLinks(gallery).map(place => <a key={place.id} href={place.href}>Na mapie: {place.label} ↗</a>)}
          </nav>
        </div>
      </div>}
      {hasStory && <MoroccoStory />}
      {hasAlpsStory && <AlpsStory />}
      {expedition.id === 'rumunia-2024' && <section className="cz-trip-preparation" aria-labelledby="trip-preparation-title">
        <img src="/assets/photos/romania-pakowanie.webp" width="1182" height="1200" loading="lazy" alt="Rower, sakwy i wyposażenie przygotowane do wyprawy po Rumunii" />
        <div><p className="cz-expedition-eyebrow">Rumunia 2024</p><h2 id="trip-preparation-title">Przed wyjazdem</h2><p>Rower, sakwy, namiot i rzeczy na drogę. Tak wyglądały przygotowania do lipcowej wyprawy.</p><a href="#zdjecia">Zdjęcia z podróży ↓</a></div>
      </section>}
      {gallery.films.length > 0 && <section id="filmy" className="cz-expedition-films" aria-labelledby="expedition-films-title">
        <div className="cz-expedition-section-heading"><h2 id="expedition-films-title">{gallery.films[0].label === 'Zwiastun' ? 'Zwiastun' : 'Filmy'}</h2><span>YouTube</span></div>
        <div className="cz-expedition-film-list">{gallery.films.map((film, index) => <FilmLink href={film.url} key={film.id} target="_blank" rel="noreferrer" aria-label={`${film.title} — ${film.label}, odtwórz film`}>
          <span className="cz-expedition-film-number">{String(index + 1).padStart(2, '0')}</span><div><span className="cz-expedition-film-label">{film.label} · {findFilm(film.id)?.duration}</span><h3>{film.title}</h3></div><span className="cz-expedition-film-play" aria-hidden="true">↗</span>
        </FilmLink>)}</div>
      </section>}
      {videoFrames || tripPhotos ? <section id={tripPhotos ? "zdjecia" : "kadry"} className="cz-expedition-photos cz-expedition-frames" aria-labelledby="expedition-frames-title">
        <div className="cz-expedition-section-heading"><h2 id="expedition-frames-title">{tripPhotos ? "Zdjęcia z wyprawy" : "Kadry z wyprawy"}</h2><span>{galleryItemCount(gallery)} · {gallery.sourceLabel}</span></div>
        <p className="cz-expedition-frames-intro">{tripPhotos ? (gallery.photoIntro || 'Wybrane zdjęcia z wyprawy.') : gallery.films.length ? 'Kilka ujęć z drogi. Cała historia w filmie.' : 'Wybrane ujęcia z nagrań wyprawy.'}</p>
        <div id="expedition-frame-grid"><PhotoGrid gallery={gallery} previewLimit={allFrames ? null : 3} /></div>
        <button type="button" className="cz-expedition-frames-toggle" aria-expanded={allFrames} aria-controls="expedition-frame-grid" onClick={() => setAllFrames(value => !value)}>{allFrames ? (tripPhotos ? 'Zwiń zdjęcia ↑' : 'Zwiń kadry ↑') : `Zobacz wszystkie ${tripPhotos ? 'zdjęcia' : 'kadry'} · ${gallery.photos.length} ↓`}</button>
      </section> : <section className="cz-expedition-photos" aria-labelledby="expedition-photos-title">
        <div className="cz-expedition-section-heading"><h2 id="expedition-photos-title">{gallery.mediaKind === 'video-frames' ? `Kadry z nagrań${gallery.sourceLabel ? ' ' + gallery.sourceLabel : ''}` : 'Zdjęcia'}</h2><a href={galleryHref(gallery)}>Cała galeria · {galleryItemCount(gallery)} ↗</a></div>
        <a className="cz-expedition-photo-preview" href={galleryHref(gallery)} aria-label={`Zobacz galerię: ${expedition.title} ${expedition.year}`}>
          {preview.map(photo => <ResponsivePhoto key={photo.src} photo={photo} sizes="(max-width:520px) calc(100vw - 28px), (max-width:1448px) 32vw, 440px" loading="lazy" style={{ '--ratio': photo.width / photo.height }} />)}
        </a>
      </section>}
    </article>
    <RelatedExpeditions expedition={expedition} />
  </ExpeditionShell>
}
