import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { CollectionShell } from './CollectionShell'
import { RouteComparison } from './RouteComparison'
import { useInitialLocation } from '../PageLocation'
import { tripRoutes } from '../data/tripRoutes'
import { highestPeak, readRouteAtlas, routeAtlasHref, routeHref } from '../data/routeAtlas'
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
  const { region, selected, compare } = state
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
    Promise.all(catalog.map(async row => [row.id, (await tripRoutes[row.id].load()).default]))
      .then(entries => { if (live) setTracks(Object.fromEntries(entries)) })
      .catch(() => { if (live) setLoadError(true) })
    return () => { live = false }
  }, [retry])
  const update = patch => {
    setProfilePoint(null)
    const next = { ...state, ...patch }
    setState(next)
    const href = routeAtlasHref(next)
    if (window.location.pathname + window.location.search !== href) window.history.pushState({}, '', href)
    searchRef.current = window.location.search
  }
  const rows = useMemo(() => catalog.filter(row => region === 'all' || row.region === region), [region])
  const ready = rows.every(row => tracks[row.id])
  const selectedRow = catalog.find(row => row.id === selected)
  const toggleCompare = id => update({ compare: compare.includes(id) ? compare.filter(value => value !== id) : compare.length < 2 ? [...compare, id] : compare })
  const selectRoute = id => {
    update({ selected: id })
    if (window.matchMedia('(max-width: 820px)').matches) mapSection.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  const selectRegion = value => { setHovered(null); update({ region: value, selected: null }) }
  const showProfilePoint = point => {
    const row = catalog.find(entry => entry.id === point.id)
    update({ selected: point.id, region: region === 'all' || region === row.region ? region : 'all' })
    setHovered(null); setProfilePoint(point)
    mapSection.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    mapSection.current?.focus({ preventScroll: true })
  }
  return <CollectionShell section="wyprawy" detail className="cz-routes">
    <div className="cz-gallery-intro"><h1>Trasy</h1><span className="cz-gallery-count">6 zapisów GPX · Alpy i Tatry</span></div>
    <p className="cz-route-catalog-intro">Moje przejścia na mapie. Wybierz trasę, zobacz jej przebieg albo porównaj dwa profile wysokości.</p>
    <div className="cz-route-catalog-tools"><div role="group" aria-label="Pasmo tras">{[['all', 'Wszystkie'], ['Alpy', 'Alpy'], ['Tatry', 'Tatry']].map(([value, label]) => <button key={value} type="button" aria-pressed={region === value} onClick={() => selectRegion(value)}>{label}</button>)}</div><a href="#porownanie">Porównaj trasy <span>{compare.length}/2</span> ↓</a></div>
    <div className="cz-route-atlas-layout">
      <section ref={mapSection} tabIndex={-1} className="cz-route-atlas-map" aria-label="Mapa tras">
        <div className="cz-route-atlas-map-heading"><div><span className="cz-route-eyebrow">{selectedRow ? selectedRow.region : region === 'all' ? 'Alpy · Tatry' : region}</span><h2>{selected ? tripRoutes[selected].title : 'Wszystkie trasy'}</h2></div>{selected && <button type="button" onClick={() => { setHovered(null); update({ selected: null }) }}>Pokaż wszystkie</button>}</div>
        {ready ? <Suspense fallback={<div className="cz-route-atlas-placeholder" role="status">Wczytywanie mapy…</div>}><AtlasMap rows={rows} tracks={tracks} selected={selected} highlighted={hovered} profilePoint={profilePoint} onSelect={id => { setHovered(null); update({ selected: id }) }} /></Suspense> : <div className="cz-route-atlas-placeholder" role="status">{loadError ? <><p>Nie udało się wczytać tras. Lista i odnośniki do wypraw są dostępne poniżej.</p><button type="button" onClick={() => setRetry(value => value + 1)}>Spróbuj ponownie</button></> : 'Wczytywanie mapy i tras…'}</div>}
        {profilePoint && <div className={`cz-route-map-point cz-route-compare-slot is-${profilePoint.slot}`}><span>{profilePoint.slot === 0 ? 'A' : 'B'} · {number(profilePoint.distance / 1000, 2)} km · ≈ {number(profilePoint.elevation)} m n.p.m.</span><a href="#porownanie">Wróć do porównania ↓</a></div>}
        <div className="cz-route-atlas-map-caption"><span><i />{selected ? 'Wybrana trasa wyróżniona na złoto' : 'Kliknij punkt na mapie lub nazwę na liście'}</span>{selectedRow && <a href={routeHref(selectedRow, tripRoutes[selected])}>Profil i wyprawa ↗</a>}</div>
      </section>
      <section className="cz-route-atlas-list" aria-label="Lista tras">
        <div className="cz-route-atlas-list-heading"><h2>Trasy</h2><span role="status">{rows.length} z {catalog.length} · od najnowszych</span></div>
        <div className="cz-route-catalog-list">{rows.map(row => {
          const route = tripRoutes[row.id], peak = highestPeak(route), slot = compare.indexOf(row.id)
          return <article className="cz-route-catalog-row" data-selected={selected === row.id} key={row.id} onMouseEnter={() => setHovered(row.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(row.id)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(null) }}>
            <button className="cz-route-pick" type="button" aria-label={`Pokaż trasę: ${route.title}`} aria-pressed={selected === row.id} onClick={() => selectRoute(row.id)}><span>{row.region} · {route.dates}</span><h3>{route.title}<span aria-hidden="true">↗</span></h3></button>
            <div className="cz-route-row-metrics"><span>{number(row.distance / 1000, 1)} <small>km</small></span><span>↗ ≈ {number(row.ascentEstimate)} <small>m</small></span><span title={peak.name}>{peak.altitude.toLocaleString('pl-PL')} <small>m</small><small> szczyt</small></span></div>
            <div className="cz-route-row-actions"><a href={routeHref(row, route)}>Trasa i wyprawa ↗</a><button type="button" aria-label={`${slot >= 0 ? 'Usuń z porównania' : 'Porównaj'}: ${route.title}`} aria-pressed={slot >= 0} disabled={slot < 0 && compare.length === 2} onClick={() => toggleCompare(row.id)}>{slot >= 0 ? `${slot === 0 ? 'A' : 'B'} · Wybrana ✓` : 'Porównaj +'}</button></div>
          </article>
        })}</div>
        <p className="cz-route-selection-note" role="status">{compare.length === 2 ? 'Wybrano dwie trasy. Usuń jedną z wyboru, aby dodać inną.' : 'Zaznacz dwie trasy do porównania. Możesz łączyć Alpy i Tatry.'}</p>
        <p className="cz-route-selection-note">To część moich górskich przejść. Kolejne trasy będą uzupełniane.</p>
      </section>
    </div>
    <RouteComparison selected={compare} tracks={tracks} atlasState={state} onShowPoint={showProfilePoint} onChange={value => update({ compare: value })} />
    <p className="cz-route-catalog-note">Dystans i przybliżona suma podejść pochodzą z opublikowanych zapisów GPS. Suma podejść pomija drobne wahania wysokości poniżej 10 m i nie łączy przerw w nagraniu; może różnić się od statystyk Stravy. Wysokości szczytów są niezależne od GPS.</p>
    <nav className="cz-route-catalog-footer" aria-label="Powiązane zestawienia"><a href="/wyprawy">Wszystkie wyprawy ↗</a><a href="/szczyty">Moje szczyty ↗</a></nav>
  </CollectionShell>
}
