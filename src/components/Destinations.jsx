import React from 'react'
import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { ExpeditionList } from './Expeditions'
import { FilmLink } from './SiteTools'
import { NotFound } from './NotFound'
import { destinations, destinationHref, getDestination } from '../data/destinations'
import { tripRoutes } from '../data/tripRoutes'
import '../destinations.css'

export function DestinationsIndex() {
  return <CollectionShell section="wyprawy" className="cz-directions">
    <header className="cz-directions-intro"><p className="cz-directions-kicker">Kraje i pasma</p><h1>Kierunki</h1><p>Wybierz miejsce. Wyprawy, fotografie, filmy i trasy zebrane razem.</p></header>
    <div className="cz-directions-grid">{destinations.map(item => {
      const data = getDestination(item.id)
      return <a key={item.id} href={destinationHref(item)} className="cz-direction-card">
        <div className="cz-direction-image"><ResponsivePhoto photo={data.cover} loading="lazy" sizes="(max-width:700px) 100vw, 50vw" /><span>{data.coverKind}</span></div>
        <div className="cz-direction-body"><small>{item.type} · {item.area}</small><h2>{item.name} <span aria-hidden="true">↗</span></h2><p>{item.description}</p><p className="cz-direction-counts">Wyprawy: {data.trips.length}{data.films.length > 0 && ` · Filmy: ${data.films.length}`}{data.tracks.length > 0 && ` · Trasy GPX: ${data.tracks.length}`}</p></div>
      </a>
    })}</div>
    <p className="cz-directions-note">Kierunki obejmują materiały dostępne na stronie. Jedna wyprawa może należeć do kilku krajów lub pasm.</p>
    <nav className="cz-directions-bottom"><a href="/mapa">Wszystkie miejsca na mapie ↗</a><a href="/wyprawy?widok=os">Oś podróży ↗</a></nav>
  </CollectionShell>
}

export function CountryDestination({ id }) {
  const data = getDestination(id)
  if (!data || data.existing) return <NotFound />
  return <CollectionShell section="wyprawy" detail className="cz-directions">
    <header className="cz-country-hero"><div><p className="cz-directions-kicker">{data.area}</p><h1>{data.name}</h1><p>{data.description}</p><a href={`/mapa?atlas=${data.atlas}`}>Zobacz na mapie ↗</a></div><figure><ResponsivePhoto photo={data.cover} full loading="eager" sizes="(max-width:700px) 100vw, 60vw" /><figcaption>{data.coverKind} · {data.name}</figcaption></figure></header>
    <nav className="cz-country-sections" aria-label={`Materiały: ${data.name}`}><a href="#wyprawy">Wyprawy · {data.trips.length}</a>{data.galleries.length > 0 && <a href="#fotografie">Galerie · {data.galleries.length}</a>}{data.films.length > 0 && <a href="#filmy">Filmy · {data.films.length}</a>}{data.tracks.length > 0 && <a href="#trasy">Trasy GPX · {data.tracks.length}</a>}</nav>
    <section id="wyprawy" className="cz-country-section"><h2>Wyprawy</h2>{id === 'szwajcaria' && <p className="cz-directions-note">Across the Alps obejmuje pięć krajów. Jego galeria i zwiastun pokazują całą podróż; poniższe trasy dotyczą Szwajcarii.</p>}<ExpeditionList expeditions={data.trips} /></section>
    {data.galleries.length > 0 && <section id="fotografie" className="cz-country-section"><h2>Galerie fotografii</h2><div className="cz-directions-grid">{data.galleries.map(trip => <a className="cz-direction-card" href={`/galerie/${trip.id}`} key={trip.id}><div className="cz-direction-image"><ResponsivePhoto photo={trip.gallery.photos.find(photo => photo.src === trip.gallery.coverImage) || trip.gallery.photos[0]} loading="lazy" sizes="(max-width:700px) 100vw, 50vw" /></div><div className="cz-direction-body"><h3>{trip.title} · {trip.year} ↗</h3><small>{trip.gallery.photos.length} fotografii</small></div></a>)}</div></section>}
    {data.films.length > 0 && <section id="filmy" className="cz-country-section"><h2>Filmy</h2><div className="cz-country-films">{data.films.map(film => <FilmLink href={film.youtubeUrl} key={film.youtubeId}><small>{film.format} · {film.duration}</small><h3>▷ {film.title}</h3><span>Obejrzyj ↗</span></FilmLink>)}</div>{id === 'maroko' && <a className="cz-directions-parent" href="/wyprawy/maroko-2025#kadry">Kadry z nagrań DJI przy wyprawie ↗</a>}</section>}
    {data.tracks.length > 0 && <section id="trasy" className="cz-country-section"><h2>Trasy GPX</h2><div className="cz-country-routes">{data.tracks.map(row => <a key={row.id} href={`/trasy?trasa=${row.id}#profil`}><span>{tripRoutes[row.id].title}<small>{tripRoutes[row.id].dates}</small></span><span>{(row.distance/1000).toLocaleString('pl-PL',{maximumFractionDigits:1})} km ↗</span></a>)}</div></section>}
    <a className="cz-directions-parent" href="/kierunki">Wszystkie kierunki ↗</a>
  </CollectionShell>
}
