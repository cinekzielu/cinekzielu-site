import React, { useEffect, useState } from 'react'
import { CollectionShell } from './CollectionShell'
import { useInitialLocation } from '../PageLocation'
import { tripRoutes } from '../data/tripRoutes'
import catalog from '../data/routeCatalog.json'
import '../routeCatalog.css'

const readRegion = search => ['Alpy', 'Tatry'].includes(new URLSearchParams(search).get('pasmo')) ? new URLSearchParams(search).get('pasmo') : 'all'
export function RouteCatalog() {
  const initial = useInitialLocation()
  const [region, setRegion] = useState(() => readRegion(initial.search))
  useEffect(() => {
    const sync = () => setRegion(readRegion(window.location.search))
    sync(); window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const select = value => {
    setRegion(value)
    const href = value === 'all' ? '/trasy' : `/trasy?pasmo=${value}`
    if (window.location.pathname + window.location.search !== href) window.history.pushState({}, '', href)
  }
  const rows = catalog.filter(row => region === 'all' || row.region === region)
  return <CollectionShell section="wyprawy" detail className="cz-routes">
    <div className="cz-gallery-intro"><h1>Trasy</h1><span className="cz-gallery-count">Alpy · Tatry</span></div>
    <p className="cz-route-catalog-intro">Zapisy moich przejść. Mapa terenu, profil wysokości i materiały z wyprawy.</p>
    <div className="cz-route-catalog-tools"><div role="group" aria-label="Pasmo tras">{[['all', 'Wszystkie'], ['Alpy', 'Alpy'], ['Tatry', 'Tatry']].map(([value, label]) => <button key={value} type="button" aria-pressed={region === value} onClick={() => select(value)}>{label}</button>)}</div><span role="status" aria-live="polite">{rows.length} z {catalog.length} · od najnowszych</span></div>
    <div className="cz-route-catalog-list">{rows.map(row => {
      const route = tripRoutes[row.id]
      const peak = route.peaks.reduce((a, b) => a.altitude > b.altitude ? a : b)
      return <a className="cz-route-catalog-row" key={row.id} href={`/wyprawy/${row.trip}#${route.anchor}`}>
        <div className="cz-route-catalog-name"><span>{row.country} · {route.dates}</span><h2>{route.title}</h2><small>{row.region}{route.peaks.length > 1 ? ' · trzy szczyty' : ' · Across the Alps'}</small></div>
        <svg viewBox="0 0 200 54" className="cz-route-sparkline" aria-hidden="true"><path d="M0 52H200" className="cz-route-sparkline-base" />{row.profiles.map((points, i) => <polyline points={points} key={i} />)}</svg>
        <div className="cz-route-catalog-stat"><strong>{peak.altitude.toLocaleString('pl-PL')} <small>m</small></strong><span>{route.peaks.length > 1 ? peak.name : 'wysokość szczytu'}</span></div>
        <div className="cz-route-catalog-stat"><strong>{(row.distance / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} <small>km</small></strong><span>zapis GPS</span></div>
        <span className="cz-route-catalog-arrow" aria-hidden="true">↗</span><span className="cz-route-catalog-open">Zobacz trasę</span>
      </a>
    })}</div>
    <p className="cz-route-catalog-note">Wysokości dotyczą szczytów. Dystans i profile pochodzą z zapisów GPS i mogą różnić się od statystyk aktywności. Małe profile mają osobne skale — pokazują przebieg wysokości, nie trudność tras.</p>
    <nav className="cz-route-catalog-footer" aria-label="Powiązane zestawienia"><a href="/wyprawy">Wszystkie wyprawy ↗</a><a href="/szczyty">Moje szczyty ↗</a></nav>
  </CollectionShell>
}
