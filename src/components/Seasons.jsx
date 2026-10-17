import React from 'react'
import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { PhotoGrid } from './PhotoGrid'
import { FilmLink } from './SiteTools'
import { getSeason, seasonYears } from '../data/seasons'
import { tripRoutes } from '../data/tripRoutes'
import { expeditionCount } from '../data/galleryNavigation'
import '../seasons.css'

const number = (n, digits = 0) => n.toLocaleString('pl-PL', { maximumFractionDigits: digits })
export function SeasonsIndex() {
  return <CollectionShell section="wyprawy" className="cz-seasons"><div className="cz-gallery-intro"><h1>Sezony</h1><a href="/wyprawy">Wszystkie wyprawy ↗</a></div><p className="cz-season-lead">Wyprawy, zdobyte szczyty i materiały z poszczególnych lat.</p><div className="cz-season-year-grid">{seasonYears.map(year => {
    const season = getSeason(year)
    return <a href={`/sezony/${year}`} key={year} className="cz-season-year"><ResponsivePhoto photo={season.hero} sizes="(max-width:700px) 100vw, 50vw" loading="eager" /><div><h2>{year}</h2><p>{expeditionCount(season.trips.length)} · {season.peaks.length} szczytów w zestawieniu</p><span>Zobacz sezon ↗</span></div></a>
  })}</div><p className="cz-season-note">Zestawienia obejmują materiały dodane na stronę i mogą być uzupełniane.</p></CollectionShell>
}

export function SeasonPage({ year }) {
  const season = getSeason(year)
  if (!season) return <CollectionShell section="wyprawy"><h1>Nie znaleziono sezonu</h1><a href="/sezony">Zobacz sezony</a></CollectionShell>
  const { trips, peaks, tracks, films } = season
  const top = peaks[0]
  const longest = [...tracks].sort((a, b) => b.distance - a.distance)[0]
  return <CollectionShell section="wyprawy" detail className="cz-seasons">
    <nav className="cz-season-nav" aria-label="Wybierz sezon"><a href="/sezony">Sezony</a>{seasonYears.map(value => <a href={`/sezony/${value}`} key={value} aria-current={year === value ? 'page' : undefined}>{value}</a>)}</nav>
    <header className="cz-season-hero"><div><p className="cz-season-eyebrow">Sezon</p><h1>{year}</h1><p>Wyprawy i materiały z tego roku.</p><a href={`/wyprawy?rok=${year}`}>Zobacz wszystkie wyprawy ↗</a></div><a href={`/wyprawy/${season.heroTrip.id}`} aria-label={`Wyprawa: ${season.heroTrip.title}`}><ResponsivePhoto photo={season.hero} full sizes="(max-width:700px) 100vw, 65vw" loading="eager" fetchPriority="high" /></a></header>
    <dl className="cz-season-stats"><div><dt>Wyprawy na stronie</dt><dd>{trips.length}</dd></div><div><dt>Zdobyte szczyty</dt><dd>{peaks.length}</dd></div><div><dt>Opisane wejścia</dt><dd>{season.ascents.length}</dd></div><div><dt>Fotografie w galeriach</dt><dd>{season.photoCount}</dd></div></dl>
    <p className="cz-season-note">Stan materiałów dodanych na stronę. Ten sam szczyt liczymy raz; osobne wejścia osobno. Wejścia bez ustalonego roku nie trafiają do tych liczb.</p>
    <section className="cz-season-section" aria-labelledby="season-highlights"><h2 id="season-highlights">Wybrane wyprawy</h2><div className="cz-season-trip-grid">{season.selectedTrips.map(trip => <a href={`/wyprawy/${trip.id}`} key={trip.id}><ResponsivePhoto photo={trip.gallery.photos.find(photo => photo.src === trip.gallery.coverImage)} sizes="(max-width:700px) 100vw, 33vw" /><small>{trip.region} · {trip.date}</small><h3>{trip.title} ↗</h3></a>)}</div></section>
    <section className="cz-season-section" aria-labelledby="season-summits"><div className="cz-season-heading"><h2 id="season-summits">Szczyty</h2><a href={`/szczyty?rok=${year}`}>Pełne zestawienie ↗</a></div><p className="cz-season-note">Wejścia letnie: {season.summer} · zimowe: {season.winter}{season.unknownSeason > 0 && ` · sezon nieopisany: ${season.unknownSeason}`}</p><div className="cz-season-peak-grid"><a className="cz-season-highest" href={`/szczyty?rok=${year}#szczyt-${top.id}`}><small>Najwyższy zdobyty szczyt</small><h3>{top.name}</h3><strong>{number(top.altitude)} <small>m n.p.m.</small></strong></a><div>{peaks.slice(1, 6).map(peak => <a key={peak.id} href={`/szczyty?rok=${year}#szczyt-${peak.id}`}><span>{peak.name}<small>{peak.range}</small></span><span>{number(peak.altitude)} m ↗</span></a>)}</div></div></section>
    <section className="cz-season-section" aria-labelledby="season-tracks"><div className="cz-season-heading"><h2 id="season-tracks">Zapisane przejścia GPX</h2><a href="/trasy">Atlas tras ↗</a></div>{tracks.length ? <><dl className="cz-season-stats is-routes"><div><dt>Opublikowane zapisy</dt><dd>{tracks.length}</dd></div><div><dt>Dystans tych zapisów</dt><dd>{number(season.distance / 1000, 1)} <small>km</small></dd></div><div><dt>Przybliżona suma podejść GPS</dt><dd>≈ {number(season.ascentEstimate)} <small>m</small></dd></div></dl><p className="cz-season-note">To suma {tracks.length} dostępnych zapisów, nie wszystkich przejść w roku. Zapisy wielodniowe liczymy raz. Statystyki GPS mogą różnić się od Stravy.</p><a className="cz-season-feature-link" href={`/wyprawy/${longest.trip}#${tripRoutes[longest.id].anchor}`}>Najdłuższy dostępny zapis: {tripRoutes[longest.id].title} · {number(longest.distance / 1000, 1)} km <span>Zobacz trasę ↗</span></a></> : <p className="cz-season-note">Zapisy GPX z tego roku nie są jeszcze dodane. Wyprawy i materiały znajdziesz poniżej.</p>}</section>
    <section className="cz-season-section" aria-labelledby="season-photos"><div className="cz-season-heading"><h2 id="season-photos">Wybrane fotografie</h2><a href={`/galerie?rok=${year}`}>Galerie z tego roku ↗</a></div><PhotoGrid gallery={{ id:`sezon-${year}`, title:`Sezon ${year}`, year, photos:season.photos }} eagerFirst={false} /></section>
    {films.length > 0 && <section className="cz-season-section" aria-labelledby="season-films"><div className="cz-season-heading"><h2 id="season-films">Filmy z wypraw {year}</h2><a href="/filmy">Biblioteka filmów ↗</a></div><p className="cz-season-note">Rok dotyczy wyprawy, nie daty publikacji filmu.</p><div className="cz-season-film-grid">{films.slice(0, 4).map(film => <FilmLink key={film.youtubeId} href={film.youtubeUrl}><small>{film.format} · {film.duration}</small><h3>▷ {film.title}</h3></FilmLink>)}</div></section>}
    <section className="cz-season-section" aria-labelledby="season-all"><h2 id="season-all">Wszystkie wyprawy · {year}</h2><div className="cz-season-all">{trips.map(trip => <a key={trip.id} href={`/wyprawy/${trip.id}`}><span>{trip.title}<small>{trip.region}</small></span><span>{trip.date} ↗</span></a>)}</div></section>
  </CollectionShell>
}
