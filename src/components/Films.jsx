import React, { useEffect, useRef, useState } from 'react'
import { Play, Search, X } from 'lucide-react'
import { filmCatalog, filmRegions, filmRegionLabel } from '../data/filmCatalog'
import { filmFormats, filmLengths, defaultFilmFilters, readFilmFilters, filmLibraryHref, filterFilmLibrary } from '../data/filmLibrary'
import { CollectionShell } from './CollectionShell'
import { FilmLink } from './SiteTools'
import { galleryData } from '../data/galleryData'
import { galleryHref, galleryLinkLabel } from '../data/galleryNavigation'
import '../filmStyles.css'

import { useInitialLocation } from '../PageLocation'

const readFilters = () => readFilmFilters(window.location.search)

function FilmCard({ film, index }) {
  const [failedImage, setFailedImage] = useState(false)
  const material = galleryData.find(item => item.id === film.expeditionId)
  return <article className="cz-film-card">
    <FilmLink className="cz-film-main" href={film.youtubeUrl} target="_blank" rel="noreferrer" aria-label={`${film.title} — ${film.format}, ${film.duration}, odtwórz film`}>
      <div className="cz-film-image">
        {!failedImage && <img src={film.thumbnail} alt="" width="1280" height="720" loading={index < 3 ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedImage(true)} />}
        <span className={`cz-film-play${failedImage ? ' is-fallback' : ''}`} aria-hidden="true"><Play size={22} strokeWidth={1.4} /></span>
        <span className="cz-film-duration">{film.duration}</span>
        <span className="cz-film-format">{film.format === 'Film' ? 'Pełny film' : film.format}</span>
      </div>
      <div className="cz-film-meta"><span>{film.series || filmRegionLabel(film.region)}</span></div>
      <h2>{film.title}<span aria-hidden="true">↗</span></h2>
    </FilmLink>
    {film.expeditionId && <div className="cz-film-related"><a href={`/wyprawy/${film.expeditionId}`}>Wyprawa ↗</a>{material && <a href={galleryHref(material)}>{galleryLinkLabel(material)} ↗</a>}</div>}
  </article>
}

export function FilmIndex() {
  const initial = useInitialLocation()
  const [filters, setFilters] = useState(() => readFilmFilters(initial.search))
  const searchInput = useRef(null)
  useEffect(() => {
    const sync = () => setFilters(readFilters())
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const updateFilters = (next, push = false) => {
    const url = filmLibraryHref(next)
    if (window.location.pathname + window.location.search !== url) window.history[push ? 'pushState' : 'replaceState']({}, '', url)
    setFilters(next)
  }
  const films = filterFilmLibrary(filters)
  const filtered = filters.region !== 'wszystkie' || filters.query.trim() || filters.format !== 'wszystkie' || filters.length !== 'wszystkie'
  return <CollectionShell section="filmy" className="cz-films">
    <div className="cz-gallery-intro"><h1>Filmy</h1><span className="cz-gallery-count">{filmCatalog.length} filmów</span></div>
    <p className="cz-film-intro">Z gór i podróży. Długie wyprawy, krótkie formy.</p>
    <div className="cz-film-tools">
      <div className="cz-film-filters" role="group" aria-label="Filtruj filmy według miejsca">{filmRegions.map(region => <button type="button" key={region.id} aria-pressed={filters.region === region.id} onClick={() => updateFilters({ ...filters, region: region.id }, true)}>{region.label}</button>)}</div>
      <div className="cz-film-search"><Search size={16} aria-hidden="true" /><input ref={searchInput} type="search" aria-label="Szukaj filmu" placeholder="Szukaj filmu…" value={filters.query} onChange={event => updateFilters({ ...filters, query: event.target.value })} />{filters.query && <button type="button" aria-label="Wyczyść wyszukiwanie" onClick={() => { updateFilters({ ...filters, query: '' }); searchInput.current?.focus() }}><X size={16} /></button>}</div>
    </div>
    <div className="cz-film-options">
      <div className="cz-film-filters cz-film-formats" role="group" aria-label="Format filmu">{filmFormats.map(format => <button type="button" key={format.id} aria-pressed={filters.format === format.id} onClick={() => updateFilters({ ...filters, format: format.id }, true)}>{format.label}</button>)}</div>
      <label className="cz-film-length">Długość<select value={filters.length} onChange={event => updateFilters({ ...filters, length: event.target.value }, true)}>{filmLengths.map(length => <option key={length.id} value={length.id}>{length.label}</option>)}</select></label>
    </div>
    <div className="cz-film-results"><span role="status" aria-live="polite" aria-atomic="true">{filtered ? `Wyniki: ${films.length} z ${filmCatalog.length}` : 'Wszystkie filmy · od najnowszych'}</span>{filtered && <button type="button" onClick={() => updateFilters({ ...defaultFilmFilters }, true)}>Wyczyść filtry</button>}</div>
    {films.length ? <div className="cz-film-grid">{films.map((film, index) => <FilmCard key={film.id} film={film} index={index} />)}</div> : <div className="cz-film-empty"><h2>Brak pasujących filmów</h2><p>Zmień miejsce, format, długość lub wyszukiwaną nazwę.</p><button type="button" onClick={() => updateFilters({ ...defaultFilmFilters }, true)}>Pokaż wszystkie filmy</button></div>}
    <div className="cz-film-channel"><span>Więcej na kanale</span><a href="https://www.youtube.com/@cinek_zielu/videos" target="_blank" rel="noreferrer">Cinek Zielu na YouTube ↗</a></div>
  </CollectionShell>
}
