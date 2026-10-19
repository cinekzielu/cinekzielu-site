import React, { useEffect, useState } from 'react'
import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { PhotoGrid } from './PhotoGrid'
import { FilmLink } from './SiteTools'
import { usePageLocation } from '../PageLocation'
import { tatryYears, readTatryFilters, tatryHref, getTatryDestination } from '../data/tatryDestination'
import { tripSeasons, seasonLabel, filmYears, filmSeasons } from '../data/materialContext'
import { galleryHref, galleryLinkLabel, galleryItemCount } from '../data/galleryNavigation'
import { tripRoutes } from '../data/tripRoutes'
import '../alpsDestination.css'
import '../tatryDestination.css'

const count = value => value.toLocaleString('pl-PL', { maximumFractionDigits:1 })
const cover = gallery => gallery.photos.find(photo => photo.src === gallery.coverImage)
const Empty = ({ children }) => <p className="cz-tatry-empty">{children}</p>
export function TatryDestination() {
  const { search } = usePageLocation(), filters = readTatryFilters(search)
  const data = getTatryDestination(filters)
  const [allTrips,setAllTrips] = useState(false), [allFilms,setAllFilms] = useState(false)
  useEffect(() => { setAllTrips(false); setAllFilms(false) }, [filters.year,filters.season])
  const hero = cover(data.galleries[0] || getTatryDestination().galleries[0])
  const summitQuery = new URLSearchParams({ pasmo:'Tatry' })
  if (filters.year !== 'all') summitQuery.set('rok',filters.year)
  if (filters.season !== 'all') summitQuery.set('sezon',filters.season)
  return <CollectionShell section="wyprawy" detail className="cz-destination-alps cz-tatry-destination">
    <header className="cz-destination-alps-hero"><div><p className="cz-destination-alps-eyebrow">Kierunki</p><h1>Tatry</h1><p>Letnie i zimowe wejścia. Wyprawy, fotografie, filmy i zapisane trasy po polskiej i słowackiej stronie Tatr.</p><a href="/mapa?atlas=tatry">Otwórz mapę Tatr ↗</a></div><ResponsivePhoto photo={hero} full loading="eager" fetchPriority="high" sizes="(max-width:700px) 100vw, 65vw" /></header>
    <div className="cz-destination-alps-browse"><nav aria-label="Sezon wejść w Tatrach">{[['all','Wszystkie wejścia'],['lato','Letnie'],['zima','Zimowe']].map(([value,label]) => <a key={value} href={tatryHref({...filters,season:value})} aria-current={filters.season === value ? 'page' : undefined}>{label}</a>)}</nav><label className="cz-tatry-year">Rok<select value={filters.year} onChange={event => { window.location.href = tatryHref({...filters,year:event.target.value}) }}><option value="all">Wszystkie lata</option>{tatryYears.map(year => <option key={year}>{year}</option>)}<option value="unknown">Rok nieustalony</option></select></label></div>
    <nav className="cz-tatry-sections" aria-label="Sekcje kierunku Tatry">{[['wyprawy','Wyprawy'],['fotografie','Fotografie'],['filmy','Filmy'],['szczyty','Szczyty'],['trasy','Trasy GPX']].map(([id,label]) => <a href={`#${id}`} key={id}>{label} ↓</a>)}</nav>
    <dl className="cz-destination-alps-stats"><div><dt>Wyprawy</dt><dd>{data.trips.length}</dd></div><div><dt>Fotografie w galeriach</dt><dd>{data.photoCount}</dd></div><div><dt>Filmy</dt><dd>{data.films.length}</dd></div><div><dt>Trasy GPX</dt><dd>{data.tracks.length}</dd></div></dl>
    <p className="cz-destination-alps-note">Wybór roku i sezonu obejmuje wszystkie sekcje. Lato i zima oznaczają opisane wejścia, nie sam miesiąc zapisu GPS. Trasy bez opisanego sezonu są widoczne przy „Wszystkie wejścia”.</p>
    {(filters.year !== 'all' || filters.season !== 'all') && <a className="cz-tatry-reset" href="/kierunki/tatry">Wyczyść wybór ×</a>}
    <section id="wyprawy" className="cz-destination-alps-section"><h2>Wyprawy</h2>{!data.trips.length && <Empty>Brak stron wypraw dla tego wyboru. Pozostałe dostępne materiały znajdziesz poniżej.</Empty>}<div className="cz-destination-alps-trips">{data.trips.slice(0,allTrips ? undefined : 6).map(trip => <article key={trip.id}><a href={`/wyprawy/${trip.id}`} className="cz-destination-alps-trip-photo"><ResponsivePhoto photo={cover(trip.gallery)} loading="lazy" sizes="(max-width:700px) 100vw, 50vw" /></a><div><small>{trip.date} · {tripSeasons(trip.id).map(seasonLabel).join(' / ')}</small><h3><a href={`/wyprawy/${trip.id}`}>{trip.title} ↗</a></h3><p>{trip.description}</p><a href={galleryHref(trip.gallery)}>{galleryLinkLabel(trip.gallery)} · {galleryItemCount(trip.gallery)} ↗</a></div></article>)}</div>{data.trips.length > 6 && <button className="cz-tatry-more" aria-expanded={allTrips} onClick={()=>setAllTrips(value=>!value)}>{allTrips ? 'Pokaż mniej' : `Pozostałe wyprawy (${data.trips.length-6}) ↓`}</button>}</section>
    <section id="fotografie" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Wybrane fotografie</h2><a href="/fotografia">Portfolio ↗</a></div>{data.photos.length ? <PhotoGrid key={`${filters.year}-${filters.season}`} gallery={{id:'kierunek-tatry',title:'Tatry',photos:data.photos}} eagerFirst={false}/> : <Empty>Brak galerii fotograficznych dla tego wyboru.</Empty>}<p className="cz-destination-alps-note">Kadry z filmów i zdjęcia dokumentujące wyprawy pozostają na stronach poszczególnych wyjazdów.</p></section>
    <section id="filmy" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Filmy</h2><a href="/filmy?miejsce=tatry">Biblioteka filmów ↗</a></div>{!data.films.length && <Empty>Brak filmów dla tego wyboru.</Empty>}<div className="cz-destination-alps-films">{data.films.slice(0,allFilms ? undefined : 6).map(film => <FilmLink key={film.youtubeId} href={film.youtubeUrl}><small>{filmYears(film).join(' / ') || 'Rok nieustalony'} · {filmSeasons(film).map(seasonLabel).join(' / ') || 'Sezon nieopisany'} · {film.duration}</small><h3>▷ {film.title}</h3><span>Obejrzyj ↗</span></FilmLink>)}</div>{data.films.length > 6 && <button className="cz-tatry-more" aria-expanded={allFilms} onClick={()=>setAllFilms(value=>!value)}>{allFilms ? 'Pokaż mniej filmów' : `Pozostałe filmy (${data.films.length-6}) ↓`}</button>}</section>
    <section id="szczyty" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Zdobyte szczyty</h2><a href={`/szczyty?${summitQuery}`}>Moje szczyty ↗</a></div>{!data.peaks.length && <Empty>Brak opisanych wejść dla tego wyboru.</Empty>}<div className="cz-destination-alps-peaks">{data.peaks.map(peak=><a key={peak.id} href={`/szczyty?${summitQuery}#szczyt-${peak.id}`}><span>{peak.name}<small>{[...new Set(peak.ascents.map(ascent=>`${ascent.year || 'Rok nieustalony'} · ${seasonLabel(ascent.season)}`))].join(' / ')}</small></span><strong>{count(peak.altitude)} <small>m</small> ↗</strong></a>)}</div></section>
    <section id="trasy" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Trasy GPX</h2><a href="/trasy?pasmo=Tatry">Pełny atlas tras Tatr ↗</a></div>{!data.tracks.length && <Empty>Brak zapisów z potwierdzonym rokiem i sezonem dla tego wyboru.</Empty>}<div className="cz-destination-alps-routes">{data.tracks.map(route=><a key={route.id} href={`/trasy?pasmo=Tatry&trasa=${route.id}`}><span>{tripRoutes[route.id].title}<small>{tripRoutes[route.id].dates} · {tripSeasons(route.trip).map(seasonLabel).join(' / ') || 'Sezon nieopisany'}</small></span><span>{count(route.distance/1000)} km<small>↗ ≈ {count(route.ascentEstimate)} m podejść</small></span><span aria-hidden="true">↗</span></a>)}</div></section>
  </CollectionShell>
}
