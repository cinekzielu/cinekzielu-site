import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { CollectionShell } from './CollectionShell'
import { SaveButton } from './SavedItems'
import { TripRoute } from './TripRoute'
import { RoutePhotoPreview } from './RoutePhotoPreview'
import { SimilarRoutes } from './RelatedRoutes'
import { RouteCard } from './RouteCard'
import { summarizeRoutes } from '../data/routeSummary'
import { RouteComparison } from './RouteComparison'
import { useInitialLocation } from '../PageLocation'
import { tripRoutes } from '../data/tripRoutes'
import { highestPeak, readRouteAtlas, routeAtlasHref, routeHref, distanceFilters, ascentFilters, matchesRouteFilters, routeRegions, routeSorts, sortRoutes } from '../data/routeAtlas'
import catalog from '../data/routeCatalog.json'
import '../routeCatalog.css'

const AtlasMap = lazy(() => import('./RouteAtlasMap'))
const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })
export function RouteCatalog() {
  const initial = useInitialLocation()
  const mapSection = useRef(null)
  const searchRef = useRef(initial.search)
  const [state, setState] = useState(() => readRouteAtlas(initial.search))
  const [tracks, setTracks] = useState({})
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [hovered, setHovered] = useState(null)
  const [profilePoint, setProfilePoint] = useState(null)
  const { region, distance, ascent, selected, compare, view, sort } = state
  useEffect(() => {
    const sync = () => {
      if (searchRef.current === window.location.search) return
      searchRef.current = window.location.search
      setState(readRouteAtlas(window.location.search)); setHovered(null); setProfilePoint(null)
    }
    sync(); window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  useEffect(() => {
    let live = true
    setLoadError(false)
    const ids = view === 'map' ? catalog.map(row => row.id) : [...new Set(compare)]
    Promise.all(ids.filter(id => !tracks[id]).map(async id => [id, (await tripRoutes[id].load()).default]))
      .then(entries => { if (live) setTracks(current => ({ ...current, ...Object.fromEntries(entries) })) })
      .catch(() => { if (live) setLoadError(true) })
    return () => { live = false }
  }, [retry, view, compare.join(',')])
  const update = patch => {
    setProfilePoint(null)
    const next = readRouteAtlas(routeAtlasHref({ ...state, ...patch }).split('?')[1] || '')
    setState(next)
    let href = routeAtlasHref(next)
    const savedKm = new URLSearchParams(window.location.search).get('km')
    if (next.compare.length === 2 && next.compare.join(',') === compare.join(',') && next.compareDays.join(',') === state.compareDays.join(',') && /^\d+(\.\d{1,3})?$/.test(savedKm || '')) href += `&km=${savedKm}`
    if (window.location.pathname + window.location.search !== href) window.history.pushState({}, '', href)
    searchRef.current = window.location.search
  }
  const rows = useMemo(() => sortRoutes(catalog.filter(row => matchesRouteFilters(row, { region, distance, ascent })), sort), [region, distance, ascent, sort])
  const summary = useMemo(() => summarizeRoutes(rows), [rows])
  const filtered = region !== 'all' || distance !== 'all' || ascent !== 'all'
  const hiddenComparison = compare.some(id => !rows.some(row => row.id === id))
  const clearFilters = () => { setHovered(null); update({ region: 'all', distance: 'all', ascent: 'all' }) }
  const ready = rows.every(row => tracks[row.id])
  const selectedRow = catalog.find(row => row.id === selected)
  const toggleCompare = id => update({ compare: compare.includes(id) ? compare.filter(value => value !== id) : compare.length < 2 ? [...compare, id] : compare, compareDays: ['all', 'all'] })
  const selectRoute = id => {
    update({ selected: id })
    if (view === 'list') { requestAnimationFrame(() => document.getElementById('profil')?.scrollIntoView({ behavior: 'instant', block: 'start' })); return }
    if (window.matchMedia('(max-width: 820px)').matches) mapSection.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  const selectRegion = value => { setHovered(null); update({ region: value, selected: null }) }
  const showProfilePoint = point => {
    const row = catalog.find(entry => entry.id === point.id)
    update({ view: 'map', selected: point.id, ...(matchesRouteFilters(row, state) ? {} : { region: 'all', distance: 'all', ascent: 'all' }) })
    setHovered(null); setProfilePoint(point)
    requestAnimationFrame(() => { mapSection.current?.scrollIntoView({ behavior: 'instant', block: 'start' }); mapSection.current?.focus({ preventScroll: true }) })
  }
  return <CollectionShell section="wyprawy" detail className="cz-routes">
    <div className="cz-gallery-intro"><h1>Trasy</h1><span className="cz-gallery-count">{catalog.length} tras GPX · {routeRegions.join(' · ')}</span></div>
    <p className="cz-route-catalog-intro">Moje przejścia na mapie. Wybierz trasę, zobacz jej przebieg albo porównaj dwa profile wysokości.</p>
    <div className="cz-route-catalog-tools"><div role="group" aria-label="Pasmo tras">{[['all', 'Wszystkie'], ...routeRegions.map(name => [name, name])].map(([value, label]) => <button key={value} type="button" aria-pressed={region === value} onClick={() => selectRegion(value)}>{label}</button>)}</div><a href="#porownanie">Porównaj trasy <span>{compare.length}/2</span> ↓</a></div>
    <div className="cz-route-view-tools"><div role="group" aria-label="Widok tras">{[['map', 'Mapa'], ['list', 'Lista']].map(([value, label]) => <button type="button" key={value} aria-pressed={view === value} onClick={() => update({ view: value })}>{label}</button>)}</div><a href="#karta-trasy">Karta trasy ↓</a><label>Sortowanie<select value={sort} onChange={event => update({ sort: event.target.value })}>{routeSorts.map(entry => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label></div>
    <div className="cz-route-filters" role="group" aria-label="Filtry tras">
      <label>Dystans zapisu<select value={distance} onChange={event => { setHovered(null); update({ distance: event.target.value }) }}>{distanceFilters.map(entry => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label>
      <label>Suma podejść · GPS<select value={ascent} onChange={event => { setHovered(null); update({ ascent: event.target.value }) }}>{ascentFilters.map(entry => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label>
      <div><span role="status">Trasy: {rows.length} z {catalog.length}</span>{filtered && <button type="button" onClick={clearFilters}>Wyczyść filtry</button>}</div>
    </div>
    <section className="cz-route-summary" aria-label="Podsumowanie wybranych tras"><dl><div><dt>Zapisanych tras</dt><dd>{summary.count}</dd></div><div><dt>Łączny dystans · km</dt><dd>{number(summary.distance / 1000, 1)}</dd></div><div><dt>Suma podejść · m</dt><dd>≈ {number(summary.ascent)}</dd></div></dl><p>{filtered ? 'Podsumowanie tras zgodnych z filtrami.' : 'Podsumowanie dodanych zapisów GPS.'} Cała wyprawa liczona raz, bez ponownego doliczania jej dni.</p></section>
    {hiddenComparison && <p className="cz-route-filter-note">Wybrane porównanie pozostaje dostępne poniżej, także dla tras spoza filtrów. <a href="#porownanie">Przejdź do porównania ↓</a></p>}
    <div className={`cz-route-atlas-layout ${view === 'list' ? 'is-list' : ''}`}>
      {view === 'map' && <section ref={mapSection} tabIndex={-1} className="cz-route-atlas-map" aria-label="Mapa tras">
        <div className="cz-route-atlas-map-heading"><div><span className="cz-route-eyebrow">{selectedRow ? selectedRow.region : region === 'all' ? routeRegions.join(' · ') : region}</span><h2>{selected ? tripRoutes[selected].title : filtered ? 'Trasy z listy' : 'Wszystkie trasy'}</h2></div>{selected && <button type="button" onClick={() => { setHovered(null); update({ selected: null }) }}>Pokaż całą listę</button>}</div>
        {!rows.length ? <div className="cz-route-atlas-placeholder cz-route-filter-empty"><h3>Brak tras dla tych filtrów</h3><p>Zmień zakres dystansu lub podejść, albo pokaż wszystkie dostępne zapisy.</p><button type="button" onClick={clearFilters}>Pokaż wszystkie trasy</button></div> : ready ? <Suspense fallback={<div className="cz-route-atlas-placeholder" role="status">Wczytywanie mapy…</div>}><AtlasMap rows={rows} tracks={tracks} selected={selected} highlighted={hovered} profilePoint={profilePoint} onSelect={id => { setHovered(null); update({ selected: id }) }} /></Suspense> : <div className="cz-route-atlas-placeholder" role="status">{loadError ? <><p>Nie udało się wczytać tras. Lista i odnośniki do wypraw są dostępne poniżej.</p><button type="button" onClick={() => setRetry(value => value + 1)}>Spróbuj ponownie</button></> : 'Wczytywanie mapy i tras…'}</div>}
        {profilePoint && <div className={`cz-route-map-point cz-route-compare-slot is-${profilePoint.slot}`}><span>{profilePoint.slot === 0 ? 'A' : 'B'} · {number(profilePoint.distance / 1000, 2)} km · ≈ {number(profilePoint.elevation)} m n.p.m.</span><a href="#porownanie">Wróć do porównania ↓</a></div>}
        {!!rows.length && <div className="cz-route-atlas-map-caption"><span><i />{selected ? 'Wybrana trasa wyróżniona na złoto' : 'Kliknij punkt na mapie lub nazwę na liście'}</span>{selectedRow && <a href={routeHref(selectedRow, tripRoutes[selected])}>{selectedRow.trip ? 'Profil i wyprawa ↗' : 'Profil trasy ↓'}</a>}</div>}
        {selected && <a className="cz-route-related-jump" href="#podobne">Podobne przejścia ↓</a>}{selected && <RoutePhotoPreview key={selected} routeId={selected} />}
      </section>}
      <section className="cz-route-atlas-list" aria-label="Lista tras">
        <div className="cz-route-atlas-list-heading"><h2>Trasy</h2><span role="status">{rows.length} z {catalog.length} · {routeSorts.find(entry => entry.id === sort).label.toLocaleLowerCase('pl')}</span></div>
        {!rows.length && <div className="cz-route-compare-empty"><p>Brak tras dla tych filtrów.</p><button type="button" onClick={clearFilters}>Wyczyść filtry</button></div>}
        <div className="cz-route-catalog-list">{rows.map(row => {
          const route = tripRoutes[row.id], peak = highestPeak(route), slot = compare.indexOf(row.id)
          return <article className="cz-route-catalog-row" data-selected={selected === row.id} key={row.id} onMouseEnter={() => setHovered(row.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(row.id)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(null) }}>
            <button className="cz-route-pick" type="button" aria-label={`Pokaż trasę: ${route.title}`} aria-pressed={selected === row.id} onClick={() => selectRoute(row.id)}><span>{row.region} · {route.dates}</span><h3>{route.title}<span aria-hidden="true">↗</span></h3></button>
            <div className="cz-route-row-metrics"><span>{number(row.distance / 1000, 1)} <small>km</small></span><span>↗ ≈ {number(row.ascentEstimate)} <small>m</small></span>{peak && <span title={peak.name}>{peak.altitude.toLocaleString('pl-PL')} <small>m</small><small> szczyt</small></span>}</div>
            <div className="cz-route-row-actions">{view === 'list' && <button type="button" aria-label={`Na mapie: ${route.title}`} onClick={() => { update({ view: 'map', selected: row.id }); requestAnimationFrame(() => mapSection.current?.scrollIntoView({ behavior: 'instant', block: 'start' })) }}>Na mapie</button>}<a href={routeHref(row, route)}>{row.trip ? 'Trasa i wyprawa ↗' : 'Profil trasy ↗'}</a><button type="button" aria-label={`${slot >= 0 ? 'Usuń z porównania' : 'Porównaj'}: ${route.title}`} aria-pressed={slot >= 0} disabled={slot < 0 && compare.length === 2} onClick={() => toggleCompare(row.id)}>{slot >= 0 ? `${compare[0] === compare[1] ? 'A/B' : slot === 0 ? 'A' : 'B'} · Wybrana ✓` : 'Porównaj +'}</button><SaveButton itemKey={`route:${row.id}`} iconOnly /></div>
          </article>
        })}</div>
        <p className="cz-route-selection-note" role="status">{compare.length === 2 ? 'Porównanie jest gotowe poniżej. Trasy i dni możesz zmienić w jego ustawieniach.' : 'Zaznacz dwie trasy do porównania. Możesz łączyć różne pasma i lata.'}</p>
        <p className="cz-route-selection-note">To część moich górskich przejść. Kolejne trasy będą uzupełniane.</p>
      </section>
    </div>
    <RouteCard selected={selected} />
    {selected && <div id="profil"><SimilarRoutes routeId={selected} /><div id="profil-trasy"><TripRoute key={selected} routeId={selected} headingLevel={2} atlas /></div></div>}
    {loadError && view === 'list' && <div className="cz-route-compare-empty" role="status"><p>Nie udało się wczytać profili do porównania.</p><button className="cz-route-same-days" type="button" onClick={() => setRetry(value => value + 1)}>Spróbuj ponownie</button></div>}
    <RouteComparison selected={compare} tracks={tracks} atlasState={state} onShowPoint={showProfilePoint} onChange={(value, days = ['all', 'all']) => update({ compare: value, compareDays: days })} onDaysChange={compareDays => update({ compareDays })} />
    <p className="cz-route-catalog-note">Dystans i przybliżona suma podejść pochodzą z opublikowanych zapisów GPS. Suma podejść pomija drobne wahania wysokości poniżej 10 m i nie łączy przerw w nagraniu; może różnić się od statystyk Stravy. Wysokości szczytów są niezależne od GPS.</p>
    <nav className="cz-route-catalog-footer" aria-label="Powiązane zestawienia"><a href="/wyprawy">Wszystkie wyprawy ↗</a><a href="/szczyty">Moje szczyty ↗</a></nav>
  </CollectionShell>
}
