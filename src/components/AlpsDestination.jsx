import React from 'react'
import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { PhotoGrid } from './PhotoGrid'
import { FilmLink } from './SiteTools'
import { usePageLocation } from '../PageLocation'
import { alpsYears, readAlpsYear, getAlpsDestination } from '../data/alpsDestination'
import { tripRoutes } from '../data/tripRoutes'
import '../alpsDestination.css'

const number = (n, digits = 0) => n.toLocaleString('pl-PL', { maximumFractionDigits: digits })
const cover = trip => trip.gallery.photos.find(photo => photo.src === trip.gallery.coverImage)
export function AlpsDestination() {
  const { search } = usePageLocation(), year = readAlpsYear(search)
  const data = getAlpsDestination(year), hero = data.trips[0]
  const yearQuery = year === 'all' ? '' : `&rok=${year}`
  return <CollectionShell section="wyprawy" detail className="cz-destination-alps">
    <header className="cz-destination-alps-hero"><div><p className="cz-destination-alps-eyebrow">Kierunki</p><h1>Alpy</h1><p>Szwajcaria 2025 i Across the Alps 2026. Wyprawy, fotografie i zapisane przejścia w jednym miejscu.</p><a href="/mapa?atlas=alpy">Otwórz mapę Alp ↗</a></div><a href={`/wyprawy/${hero.id}`} aria-label={`${hero.title} — zobacz wyprawę`}><ResponsivePhoto photo={cover(hero)} full loading="eager" fetchPriority="high" sizes="(max-width:700px) 100vw, 65vw" /></a></header>
    <div className="cz-destination-alps-browse"><nav aria-label="Rok wypraw w Alpach">{[['all','Wszystkie lata'],...alpsYears.map(value => [value,value])].map(([value,label]) => <a key={value} href={`/kierunki/alpy${value === 'all' ? '' : `?rok=${value}`}`} aria-current={year === value ? 'page' : undefined}>{label}</a>)}</nav><nav aria-label="Sekcje kierunku Alpy"><a href="#wyprawy">Wyprawy</a><a href="#fotografie">Fotografie</a><a href="#filmy">Filmy</a><a href="#szczyty">Szczyty</a><a href="#trasy">Trasy GPX</a></nav></div>
    <dl className="cz-destination-alps-stats"><div><dt>Wyprawy</dt><dd>{data.trips.length}</dd></div><div><dt>Fotografie</dt><dd>{data.photoCount}</dd></div><div><dt>Filmy i zwiastuny</dt><dd>{data.films.length}</dd></div><div><dt>Trasy GPX</dt><dd>{data.tracks.length}</dd></div></dl>
    <p className="cz-destination-alps-note">Materiały dodane na stronę{year !== 'all' ? ` z wypraw w ${year} roku` : ''}. Wybór roku zmienia poniższe zestawienia.</p>
    <section id="wyprawy" className="cz-destination-alps-section"><h2>Wyprawy</h2><div className="cz-destination-alps-trips">{data.trips.map(trip => <article key={trip.id}><a href={`/wyprawy/${trip.id}`} className="cz-destination-alps-trip-photo"><ResponsivePhoto photo={cover(trip)} loading="lazy" sizes="(max-width:700px) 100vw, 50vw" /></a><div><small>{trip.date}</small><h3><a href={`/wyprawy/${trip.id}`}>{trip.id === 'alpy-2026' ? 'Across the Alps' : trip.title} ↗</a></h3><p>{trip.description}</p><a href={`/galerie/${trip.id}`}>Galeria · {trip.gallery.photos.length} zdjęć ↗</a></div></article>)}</div></section>
    <section id="fotografie" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Wybrane fotografie</h2><a href="/fotografia">Portfolio ↗</a></div><PhotoGrid key={year} gallery={{ id:`kierunek-alpy-${year}`,title:'Alpy',year:year === 'all' ? '2025–2026' : year,photos:data.photos }} eagerFirst={false} /></section>
    <section id="filmy" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Filmy</h2><a href="/filmy?miejsce=alpy">Biblioteka filmów ↗</a></div><div className="cz-destination-alps-films">{data.films.map(film => <FilmLink key={film.youtubeId} href={film.youtubeUrl}><small>{film.format} · {film.duration}</small><h3><span aria-hidden="true">▷ </span>{film.title}</h3><span>Obejrzyj ↗</span></FilmLink>)}</div></section>
    <section id="szczyty" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Zdobyte szczyty</h2><a href={`/szczyty?pasmo=Alpy${yearQuery}`}>Moje szczyty ↗</a></div><div className="cz-destination-alps-peaks">{data.peaks.map(peak => <a key={peak.id} href={`/szczyty?pasmo=Alpy${yearQuery}#szczyt-${peak.id}`}><span>{peak.name}<small>{[...new Set(peak.ascents.map(ascent => ascent.year))].join(' · ')}</small></span><strong>{number(peak.altitude)} <small>m</small> ↗</strong></a>)}</div><p className="cz-destination-alps-note">Potwierdzone wejścia z zestawienia „Moje szczyty”. Wysokości według przyjętych pomiarów szczytów, niezależnie od GPS.</p></section>
    <section id="trasy" className="cz-destination-alps-section"><div className="cz-destination-alps-heading"><h2>Trasy GPX</h2><a href={`/trasy?pasmo=Alpy${yearQuery}`}>Mapa i porównanie tras ↗</a></div><p className="cz-destination-alps-note">Dostępne zapisy przejść. Wielodniowa wyprawa jest jednym wpisem; jej dni wybierzesz w atlasie tras.</p><div className="cz-destination-alps-routes">{data.tracks.map(row => <a key={row.id} href={`/trasy?pasmo=Alpy${yearQuery}&trasa=${row.id}`}><span>{tripRoutes[row.id].title}<small>{tripRoutes[row.id].dates}</small></span><span>{number(row.distance/1000,1)} km <small>↗ ≈ {number(row.ascentEstimate)} m podejść</small></span><span aria-hidden="true">↗</span></a>)}</div></section>
  </CollectionShell>
}
