import { summitPageHref } from '../data/summitPages'
import { plannedSummits } from '../data/plannedSummits'
import { normalizeFilmSearch } from '../data/filmCatalog'
import { PlannedSummits } from './PlannedSummits'
import { SummitRoutes } from './RelatedRoutes'
import React, { useEffect, useRef, useState } from 'react'
import { Mountain, Snowflake, Sun, Search, X, ArrowUpRight, Play, Camera, MapPin } from 'lucide-react'
import { CollectionShell } from './CollectionShell'
import { FilmLink } from './SiteTools'
import { summits, summitSeasons, summitRanges, summitYears, defaultSummitFilters, readSummitFilters, summitFiltersHref, filterSummits, ascentFilms, summitCountLabel } from '../data/summits'
import '../summitStyles.css'

import { useInitialLocation } from '../PageLocation'

const readFilters = () => readSummitFilters(window.location.search)
const height = number => number.toLocaleString('pl-PL')

function Ascent({ ascent, name }) {
  const Icon = ascent.season === 'zima' ? Snowflake : ascent.season === 'lato' ? Sun : Mountain
  return <li className="cz-summit-ascent">
    <div className="cz-summit-visit"><span className={`cz-summit-season is-${ascent.season || 'unknown'}`}><Icon size={14} aria-hidden="true" />{ascent.season === 'zima' ? 'Zima' : ascent.season === 'lato' ? 'Lato' : 'Wejście'}</span><span>{ascent.date}</span></div>
    <nav className="cz-summit-links" aria-label={`Materiały: ${name}, ${ascent.date}, ${ascent.season || 'wejście'}`}>
      {ascent.mediaHref && <a href={ascent.mediaHref} aria-label={`${ascent.mediaLabel}: ${ascent.tripTitle}, ${ascent.year}`}><Camera size={14} aria-hidden="true" />{ascent.mediaLabel}</a>}
      {ascentFilms(ascent).map(film => <FilmLink key={film.id} href={film.youtubeUrl} aria-label={`${film.title} — odtwórz film`}><Play size={13} aria-hidden="true" />{film.format === 'Zwiastun' ? 'Zwiastun' : film.format === 'Krótki film' ? 'Krótki film' : 'Film'}</FilmLink>)}
      {ascent.routeHref && <a href={ascent.routeHref}><MapPin size={14} aria-hidden="true" />Trasa GPX</a>}
      {ascent.tripHref && <a href={ascent.tripHref} aria-label={`Wyprawa: ${ascent.tripTitle}, ${ascent.year}`}>Wyprawa <ArrowUpRight size={14} aria-hidden="true" /></a>}
    </nav>
  </li>
}

export function SummitsPage() {
  const initial = useInitialLocation()
  const [filters, setFilters] = useState(() => readSummitFilters(initial.search))
  const input = useRef(null)
  useEffect(() => {
    const sync = () => setFilters(readFilters())
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const update = (patch, push = true) => {
    const next = { ...filters, ...patch }
    const href = summitFiltersHref(next)
    if (window.location.pathname + window.location.search !== href) window.history[push ? 'pushState' : 'replaceState']({}, '', href)
    setFilters(next)
  }
  const matches = filterSummits(filters)
  const filtered = filters.query.trim() || filters.range !== 'all' || filters.year !== 'all' || filters.season !== 'all'
  const plannedMatches = plannedSummits.filter(peak => filters.year === 'all' && filters.season === 'all' && (filters.range === 'all' || filters.range === peak.range) && normalizeFilmSearch(peak.name).includes(normalizeFilmSearch(filters.query).trim()))
  const highest = [...summits].sort((a, b) => b.altitude - a.altitude)[0]
  return <CollectionShell section="szczyty" className="cz-summits">
    <div className="cz-gallery-intro"><h1>Moje szczyty</h1><span className="cz-gallery-count">{summitCountLabel(summits.length)}</span></div>
    <div className="cz-summit-intro"><p>Letnie i zimowe wejścia. Zdjęcia, filmy i wyprawy w jednym miejscu. <a href="/trasy">Trasy GPX ↗</a></p><a href={summitPageHref(highest.id) || `/szczyty?q=${encodeURIComponent(highest.name)}`} className="cz-summit-highest"><Mountain size={24} strokeWidth={1.2} aria-hidden="true" /><span><small>Najwyżej</small>{highest.name} <strong>{height(highest.altitude)} m</strong></span><ArrowUpRight size={16} aria-hidden="true" /></a></div>
    {plannedMatches.length > 0 && <PlannedSummits peaks={plannedMatches} />}
    <div className="cz-summit-tools">
      <div className="cz-summit-seasons" role="group" aria-label="Rodzaj wejścia">{summitSeasons.map(season => <button key={season.id} type="button" aria-pressed={filters.season === season.id} onClick={() => update({ season: season.id })}>{season.id === 'zima' && <Snowflake size={14} aria-hidden="true" />}{season.id === 'lato' && <Sun size={14} aria-hidden="true" />}{season.label}</button>)}</div>
      <div className="cz-summit-search"><Search size={16} aria-hidden="true" /><input ref={input} type="search" value={filters.query} maxLength={100} aria-label="Szukaj szczytu" placeholder="Szukaj szczytu…" onChange={event => update({ query: event.target.value }, false)} />{filters.query && <button type="button" aria-label="Wyczyść nazwę szczytu" onClick={() => { update({ query: '' }, false); input.current?.focus() }}><X size={16} /></button>}</div>
    </div>
    <div className="cz-summit-options">
      <label>Pasmo<select aria-label="Pasmo" value={filters.range} onChange={event => update({ range: event.target.value })}><option value="all">Wszystkie</option>{summitRanges.map(range => <option key={range}>{range}</option>)}</select></label>
      <label>Rok wejścia<select aria-label="Rok wejścia" value={filters.year} onChange={event => update({ year: event.target.value })}><option value="all">Wszystkie lata</option>{summitYears.map(year => <option key={year}>{year}</option>)}<option value="unknown">Rok nieustalony</option></select></label>
      <label className="cz-summit-sort">Sortowanie<select aria-label="Sortowanie" value={filters.sort} onChange={event => update({ sort: event.target.value })}><option value="height">Od najwyższych</option><option value="latest">Ostatnio zdobyte</option></select></label>
    </div>
    <div className="cz-summit-results"><span role="status" aria-live="polite" aria-atomic="true">{filtered && plannedMatches.length ? `Zdobyte: ${matches.length} · W planach: ${plannedMatches.length}` : filtered ? `${summitCountLabel(matches.length)} z ${summits.length}` : `${summitCountLabel(matches.length)} · ${filters.sort === 'height' ? 'od najwyższych' : 'według dat wypraw'}`}</span>{filtered && <button type="button" onClick={() => update({ ...defaultSummitFilters, sort: filters.sort })}>Wyczyść filtry</button>}</div>
    {filters.sort === 'latest' && <p className="cz-summit-date-note">Znany tylko miesiąc lub rok: wpis na końcu tego okresu. Wejścia bez daty na końcu listy.</p>}
    {matches.length ? <div className="cz-summit-list">{matches.map(summit => <article id={`szczyt-${summit.id}`} className="cz-summit-row" key={summit.id}>
      <div className="cz-summit-heading"><div><span className="cz-summit-range">{summit.rangeName}</span><h2><a href={summitPageHref(summit.id, filters.year) || summit.mapHref || `/mapa?atlas=${summit.id}`}>{summit.name}</a></h2>{summit.heightNote && <small className="cz-summit-height-note">{summit.heightNote}</small>}</div><div className="cz-summit-altitude"><span>{height(summit.altitude)}</span> m<a href={summit.mapHref || `/mapa?atlas=${summit.id}`} aria-label={`${summit.name} na mapie`}><MapPin size={13} aria-hidden="true" /> Na mapie</a></div></div>
      {summit.id === 'baranie-rogi' && <a className="cz-baranie-map-link" href="/wyprawy/baranie-rogi-lodowy-szczyt-2026#dwa-sezony">Baranie Rogi · lato i zima ↗</a>}
      <ul className="cz-summit-ascents">{summit.ascents.map(ascent => <Ascent key={ascent.evidence} ascent={ascent} name={summit.name} />)}</ul>
      <SummitRoutes summit={summit} filters={filters} expanded={matches.length <= 3} />
    </article>)}</div> : !plannedMatches.length && <div className="cz-summit-empty"><Mountain size={32} strokeWidth={1} aria-hidden="true" /><h2>Brak pasujących szczytów</h2><p>Zmień nazwę, pasmo, rok lub rodzaj wejścia.</p><button type="button" onClick={() => update(defaultSummitFilters)}>Pokaż wszystkie szczyty</button></div>}
    <details className="cz-summit-notes"><summary>O zestawieniu i wysokościach</summary><p>Zestawienie obejmuje wejścia opisane w wyprawach, filmach i nazwanych zapisach GPX zweryfikowanych przy szczycie. Ten sam szczyt może mieć kilka wejść. Daty odnoszą się do wypraw, a letni lub zimowy charakter wejścia do materiałów z wyjazdu. Brak sezonu lub roku oznacza, że nie został jeszcze opisany. Sam miesiąc zapisu GPX nie rozstrzyga o letnim lub zimowym charakterze wejścia.</p><p>Wysokości podano w pełnych metrach. Rysy: wierzchołek graniczny oznaczony na mapie.</p><ul>{summits.map(summit => <li key={summit.id}><a href={summit.altitudeSource} target="_blank" rel="noreferrer">{summit.name} · {height(summit.altitude)} m ↗</a></li>)}</ul><p>Dane wysokości m.in. © autorzy OpenStreetMap, <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">ODbL</a>; SAC, TANAP i oficjalne materiały regionalne.</p></details>
  </CollectionShell>
}
