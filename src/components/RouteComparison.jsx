import React, { useEffect, useRef, useState } from 'react'
import catalog from '../data/routeCatalog.json'
import { tripRoutes } from '../data/tripRoutes'
import { comparisonPaths, comparisonScale, highestPeak, routeHref } from '../data/routeAtlas'

const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })
export function RouteComparison({ selected, tracks, onChange }) {
  const container = useRef(null)
  const [width, setWidth] = useState(700)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(260, entry.contentRect.width)))
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  const ready = selected.length === 2 && selected.every(id => tracks[id])
  const scale = ready ? comparisonScale(selected.map(id => tracks[id])) : null
  return <section className="cz-route-comparison" id="porownanie" aria-labelledby="route-comparison-title">
    <div className="cz-route-comparison-heading"><div><p className="cz-route-eyebrow">Dwie trasy · jedna skala</p><h2 id="route-comparison-title">Porównanie tras</h2></div>{selected.length > 0 && <button type="button" onClick={() => onChange([])}>Wyczyść wybór</button>}</div>
    <p className="cz-route-comparison-intro">Wybierz dwie trasy z listy lub poniżej. Profile pokazują rzeczywisty dystans i wysokość na wspólnych osiach.</p>
    <div className="cz-route-compare-selects">{[0, 1].map(slot => <label key={slot} className={`cz-route-compare-slot is-${slot}`}><span>{slot === 0 ? 'A' : 'B'} · Trasa</span><select aria-label={`Trasa ${slot === 0 ? 'A' : 'B'} do porównania`} value={selected[slot] || ''} disabled={slot === 1 && !selected[0]} onChange={event => {
      const next = [...selected]; next[slot] = event.target.value; onChange(next.filter(Boolean))
    }}><option value="">{slot === 1 && !selected[0] ? 'Najpierw wybierz trasę A' : 'Wybierz trasę'}</option>{catalog.map(row => <option key={row.id} value={row.id} disabled={selected[1 - slot] === row.id}>{tripRoutes[row.id].title}</option>)}</select></label>)}</div>
    <div ref={container} className="cz-route-compare-chart">
      {ready ? <>
        <div className="cz-route-compare-axis"><span>Wysokość GPS · m n.p.m.</span><span>Dystans · km</span></div>
        <svg viewBox={`0 0 ${width} 260`} role="img" aria-label={`Profile tras ${selected.map(id => tripRoutes[id].title).join(' i ')} na wspólnej skali wysokości i dystansu`}>
          {[0, .25, .5, .75, 1].map(fraction => { const y = 220 - fraction * 190; return <g key={fraction}><line x1="52" x2={width - 18} y1={y} y2={y} /><text x="43" y={y + 4} textAnchor="end">{number(scale.low + fraction * (scale.high - scale.low))}</text></g> })}
          {selected.map((id, slot) => <g key={id} className={`cz-route-compare-profile is-${slot}`}>{comparisonPaths(tracks[id], scale, width).map((d, i) => <path key={i} d={d} vectorEffect="non-scaling-stroke" />)}</g>)}
          {[0, .5, 1].map(fraction => <text key={fraction} x={52 + fraction * (width - 70)} y="250" textAnchor={fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle'}>{number(scale.distance * fraction / 1000, 1)} km</text>)}
        </svg>
        <div className="cz-route-compare-details">{selected.map((id, slot) => { const row = catalog.find(row => row.id === id), route = tripRoutes[id], peak = highestPeak(route); return <article key={id} className={`cz-route-compare-slot is-${slot}`}>
          <span className="cz-route-compare-letter">{slot === 0 ? 'A' : 'B'}</span><h3>{route.title}</h3><p>{route.dates}</p>
          <dl><div><dt>Dystans GPS</dt><dd>{number(row.distance / 1000, 1)} km</dd></div><div><dt>Suma podejść · GPS</dt><dd>≈ {number(row.ascentEstimate)} m</dd></div><div><dt>{route.peaks.length > 1 ? `Najwyżej · ${peak.name}` : 'Wysokość szczytu'}</dt><dd>{number(peak.altitude)} m</dd></div></dl>
          <a href={routeHref(row, route)}>Trasa i wyprawa ↗</a>
        </article> })}</div>
        <p className="cz-route-catalog-note">Profile zachowują przerwy w nagraniu. Wysokości na wykresie pochodzą z GPS; wysokości szczytów podajemy osobno, według przyjętych pomiarów. Dystans i suma podejść nie określają trudności ani czasu przejścia.</p>
      </> : <div className="cz-route-compare-empty" role="status">{selected.length === 2 ? 'Wczytywanie profili…' : selected.length === 1 ? 'Wybierz drugą trasę, żeby zestawić profile.' : 'Dwa profile, dystanse i sumy podejść pojawią się tutaj po wyborze tras.'}</div>}
    </div>
  </section>
}
