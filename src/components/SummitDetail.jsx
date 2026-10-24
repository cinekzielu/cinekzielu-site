import React from 'react'
import { ArrowUpRight, Camera, MapPin, Mountain, Play, Snowflake, Sun } from 'lucide-react'
import { CollectionShell } from './CollectionShell'
import { ResponsivePhoto } from './ResponsivePhoto'
import { FilmLink } from './SiteTools'
import { SummitRoutes } from './RelatedRoutes'
import { NotFound } from './NotFound'
import { usePageLocation } from '../PageLocation'
import { getSummitPageContent, readSummitPageYear, summitPageHref, summitPageMapHref, summitPageListHref } from '../data/summitPages'
import '../summitDetail.css'

const yearLabel = year => year === 'all' ? 'Wszystkie lata' : year === 'unknown' ? 'Rok nieustalony' : year
const number = value => value.toLocaleString('pl-PL')

export function SummitDetail({ id }) {
  const { search } = usePageLocation()
  const year = readSummitPageYear(search)
  const data = getSummitPageContent(id, year)
  if (!data) return <NotFound />
  const { summit, ascents, trips, films, routes } = data
  const years = [...new Set([...data.years, ...(year !== 'all' ? [year] : [])])].sort().reverse()
  const hasContent = ascents.length || trips.length || routes.length || films.length
  return <CollectionShell section="szczyty" detail className="cz-summit-detail">
    <nav className="cz-summit-detail-back" aria-label="Szczyt w atlasie i zestawieniu">
      <a href={summitPageListHref(id, year)}>← Wszystkie szczyty</a>
      <a href={summitPageMapHref(id, year)}><MapPin size={15} aria-hidden="true" /> Na mapie ↗</a>
    </nav>
    <header className="cz-summit-detail-hero">
      <div><p className="cz-summit-detail-kicker">{summit.rangeName}</p><h1>{summit.name}</h1><p className="cz-summit-detail-description">{data.description}</p></div>
      <div className="cz-summit-detail-height"><Mountain size={27} strokeWidth={1.2} aria-hidden="true" /><span>{number(summit.altitude)} <small>m n.p.m.</small></span><a href={summit.altitudeSource} target="_blank" rel="noreferrer">Źródło wysokości ↗</a></div>
    </header>
    {summit.heightNote && <p className="cz-summit-detail-note">{summit.heightNote}</p>}
    <div className="cz-summit-detail-navigation">
      <nav className="cz-summit-detail-years" aria-label={`Rok wejść i materiałów: ${summit.name}`}>{['all', ...years].map(value => <a key={value} href={summitPageHref(id, value)} aria-current={year === value ? 'page' : undefined}>{yearLabel(value)}</a>)}</nav>
      {hasContent ? <nav className="cz-summit-detail-sections" aria-label="Sekcje szczytu">{ascents.length > 0 && <a href="#wejscia">Wejścia</a>}{trips.length > 0 && <a href="#materialy">Materiały z wypraw</a>}{films.length > 0 && <a href="#filmy">Filmy</a>}{routes.length > 0 && <a href="#trasy">Trasy GPX</a>}</nav> : null}
    </div>
    {year !== 'all' && <p className="cz-summit-detail-note">Wybrany rok: <strong>{yearLabel(year)}</strong>. Wybór dotyczy poniższych wejść, materiałów i zapisów GPS.</p>}
    {!hasContent && <section className="cz-summit-detail-empty"><h2>Brak materiałów dla tego roku</h2><p>Wybierz inny rok, aby zobaczyć opisane wejścia i dostępne materiały.</p><a href={summitPageHref(id)}>Pokaż wszystkie lata ↗</a></section>}
    {ascents.length > 0 && <section id="wejscia" tabIndex={-1} className="cz-summit-detail-section" aria-labelledby="summit-ascents-title"><div className="cz-summit-detail-section-heading"><h2 id="summit-ascents-title">Wejścia</h2><span>{ascents.length === 1 ? '1 opisane wejście' : `${ascents.length} opisane wejścia`}</span></div><ol className="cz-summit-detail-ascents">{ascents.map(ascent => {
      const Icon = ascent.season === 'zima' ? Snowflake : ascent.season === 'lato' ? Sun : Mountain
      return <li key={ascent.evidence}><div className="cz-summit-detail-ascent-meta"><span><Icon size={16} aria-hidden="true" />{ascent.season === 'zima' ? 'Zima' : ascent.season === 'lato' ? 'Lato' : 'Sezon nieopisany'}</span><strong>{ascent.date}</strong></div><div><h3>{ascent.tripTitle || 'Wejście potwierdzone zapisem GPS'}</h3><p>{ascent.tripId ? id === 'dufourspitze' ? 'Daty dotyczą całej wyprawy Across the Alps; zapis GPS etapu jest poniżej.' : 'Data według opisu wyprawy.' : 'Data według zapisu przejścia. Pora roku nie określa warunków wejścia.'}</p><nav aria-label={`Wejście: ${summit.name}, ${ascent.date}`}>{ascent.tripHref && <a href={ascent.tripHref}>{id === 'dufourspitze' ? 'Opis etapu' : 'Zobacz wyprawę'} <ArrowUpRight size={14} aria-hidden="true" /></a>}{ascent.mediaHref && <a href={ascent.mediaHref}><Camera size={14} aria-hidden="true" />{ascent.mediaLabel}</a>}{ascent.routeHref && <a href={ascent.routeHref}><MapPin size={14} aria-hidden="true" />Mapa i profil GPX</a>}</nav></div></li>
    })}</ol>{id === 'baranie-rogi' && year === 'all' && <a className="cz-summit-detail-inline-link" href="/wyprawy/baranie-rogi-lodowy-szczyt-2026#dwa-sezony">Baranie Rogi · lato i zima ↗</a>}</section>}
    {trips.length > 0 && <section id="materialy" tabIndex={-1} className="cz-summit-detail-section" aria-labelledby="summit-materials-title"><h2 id="summit-materials-title">Materiały z wypraw</h2><p className="cz-summit-detail-note">Powiązane wyprawy i ich istniejące zdjęcia lub kadry z nagrań. Materiały obejmują także podejście, zejście i pozostałe etapy podróży.</p><div className="cz-summit-detail-materials">{trips.map(trip => <article key={trip.id}><a className="cz-summit-detail-photo" href={trip.href} tabIndex={-1} aria-hidden="true"><ResponsivePhoto photo={trip.photo} loading="lazy" sizes="(max-width:600px) calc(100vw - 28px), (max-width:760px) calc(100vw - 40px), (max-width:900px) calc((100vw - 64px) / 2), (max-width:1212px) calc((100vw - 112px) / 2), 550px" /></a><div><span className="cz-summit-detail-kicker">{trip.date} · {trip.gallery.mediaKind === 'video-frames' ? 'Kadry z nagrań' : 'Fotografie'}</span><h3><a href={trip.href}>{id === 'dufourspitze' ? 'Dufourspitze · Across the Alps' : trip.title} ↗</a></h3><p>{trip.scope}</p><a className="cz-summit-detail-inline-link" href={trip.href}>{trip.linkLabel} ↗</a></div></article>)}</div></section>}
    {films.length > 0 && <section id="filmy" tabIndex={-1} className="cz-summit-detail-section" aria-labelledby="summit-films-title"><h2 id="summit-films-title">Filmy</h2><div className="cz-summit-detail-films">{films.map(film => <FilmLink key={film.youtubeId} href={film.youtubeUrl}><Play size={20} aria-hidden="true" /><span><small>{film.format} · {film.duration}</small><strong>{film.title}</strong>{film.format === 'Zwiastun' && <small>Materiał z całej wyprawy Across the Alps.</small>}</span><ArrowUpRight size={17} aria-hidden="true" /></FilmLink>)}</div></section>}
    {routes.length > 0 && <section id="trasy" tabIndex={-1} className="cz-summit-detail-section" aria-labelledby="summit-routes-title"><h2 id="summit-routes-title">Trasy GPX</h2><p className="cz-summit-detail-note">Istniejące zapisy przejść związane ze szczytem. Otwórz trasę, aby zobaczyć mapę, profil wysokości i dostępne dni.</p><SummitRoutes summit={summit} filters={{ year }} expanded /></section>}
    <p className="cz-summit-detail-footnote">Daty i sezon wejścia pochodzą z zestawienia „Moje szczyty”. Data wyprawy może obejmować kilka dni; dokładniejsze daty zapisów GPS są pokazane oddzielnie.</p>
    <nav className="cz-summit-detail-back cz-summit-detail-bottom" aria-label="Dalsze przeglądanie"><a href={summitPageMapHref(id, year)}><MapPin size={15} aria-hidden="true" />{summit.name} na mapie ↗</a><a href={summitPageListHref(id, year)}>Wszystkie szczyty ↗</a></nav>
  </CollectionShell>
}
