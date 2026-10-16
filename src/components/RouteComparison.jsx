import React, { useEffect, useRef, useState } from 'react'
import catalog from '../data/routeCatalog.json'
import { tripRoutes } from '../data/tripRoutes'
import { comparisonPaths, comparisonScale, comparisonSample, comparisonShareHref, readComparisonDistance, highestPeak, routeHref } from '../data/routeAtlas'

const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })
export function RouteComparison({ selected, tracks, onChange, onShowPoint, atlasState }) {
  const container = useRef(null)
  const shareInput = useRef(null)
  const [width, setWidth] = useState(700)
  const [distance, setDistance] = useState(0)
  const [share, setShare] = useState(null)
  const pair = selected.join(',')
  const ready = selected.length === 2 && selected.every(id => tracks[id])
  const maxDistance = ready ? Math.max(...selected.map(id => tracks[id].distance)) : 0
  const scale = ready ? comparisonScale(selected.map(id => tracks[id])) : null
  const samples = ready ? selected.map(id => comparisonSample(tracks[id], distance)) : []
  const searchRef = useRef(null)
  useEffect(() => {
    searchRef.current = window.location.search
    setDistance(readComparisonDistance(searchRef.current, maxDistance)); setShare(null)
  }, [pair, maxDistance])
  useEffect(() => {
    // Our own map selection changes the query without changing the profile cursor.
    searchRef.current = window.location.search
  }, [atlasState])
  useEffect(() => {
    const restore = () => {
      if (searchRef.current === window.location.search) return
      searchRef.current = window.location.search
      setDistance(readComparisonDistance(searchRef.current, maxDistance)); setShare(null)
    }
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [maxDistance])
  useEffect(() => { setShare(null) }, [distance, atlasState.region, atlasState.selected])
  useEffect(() => { if (share) { shareInput.current?.focus(); shareInput.current?.select() } }, [share])
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(260, entry.contentRect.width)))
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  const pointAtPointer = event => {
    if (event.type === 'pointermove' && event.pointerType !== 'mouse' && !event.buttons) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width * width
    setDistance(Math.min(maxDistance, Math.round(Math.max(0, (x - 52) / (width - 70) * scale.distance) / 10) * 10))
  }
  const copyComparison = async () => {
    const url = window.location.origin + comparisonShareHref(atlasState, distance)
    let copied = false
    try { await navigator.clipboard.writeText(url); copied = true } catch { /* Manual link remains available. */ }
    setShare({ url, copied })
  }
  return <section className="cz-route-comparison" id="porownanie" aria-labelledby="route-comparison-title">
    <div className="cz-route-comparison-heading"><div><p className="cz-route-eyebrow">Dwie trasy · jedna skala</p><h2 id="route-comparison-title">Porównanie tras</h2></div><div className="cz-route-comparison-actions">{ready && <button type="button" onClick={copyComparison}>Udostępnij porównanie ↗</button>}{selected.length > 0 && <button type="button" onClick={() => onChange([])}>Wyczyść wybór</button>}</div></div>
    {share && <div className="cz-route-share"><p role="status">{share.copied ? 'Link skopiowany. Możesz też skopiować go z pola poniżej.' : 'Skopiuj link z pola poniżej.'}</p><label>Link do porównania<input ref={shareInput} readOnly value={share.url} onFocus={event => event.target.select()} /></label><button type="button" onClick={() => setShare(null)}>Zamknij</button></div>}
    <p className="cz-route-comparison-intro">Wybierz dwie trasy z listy lub poniżej. Profile pokazują rzeczywisty dystans i wysokość na wspólnych osiach.</p>
    <div className="cz-route-compare-selects">{[0, 1].map(slot => <label key={slot} className={`cz-route-compare-slot is-${slot}`}><span>{slot === 0 ? 'A' : 'B'} · Trasa</span><select aria-label={`Trasa ${slot === 0 ? 'A' : 'B'} do porównania`} value={selected[slot] || ''} disabled={slot === 1 && !selected[0]} onChange={event => {
      const next = [...selected]; next[slot] = event.target.value; onChange(next.filter(Boolean))
    }}><option value="">{slot === 1 && !selected[0] ? 'Najpierw wybierz trasę A' : 'Wybierz trasę'}</option>{catalog.map(row => <option key={row.id} value={row.id} disabled={selected[1 - slot] === row.id}>{tripRoutes[row.id].title}</option>)}</select></label>)}</div>
    <div ref={container} className="cz-route-compare-chart">
      {ready ? <>
        <div className="cz-route-compare-axis"><span>Wysokość GPS · m n.p.m.</span><span>Dystans · km</span></div>
        <svg className="cz-route-interactive-profile" viewBox={`0 0 ${width} 260`} role="img" aria-label={`Profile tras ${selected.map(id => tripRoutes[id].title).join(' i ')} na wspólnej skali wysokości i dystansu`} onPointerDown={event => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); pointAtPointer(event) }} onPointerMove={pointAtPointer}>
          {[0, .25, .5, .75, 1].map(fraction => { const y = 220 - fraction * 190; return <g key={fraction}><line x1="52" x2={width - 18} y1={y} y2={y} /><text x="43" y={y + 4} textAnchor="end">{number(scale.low + fraction * (scale.high - scale.low))}</text></g> })}
          {selected.map((id, slot) => <g key={id} className={`cz-route-compare-profile is-${slot}`}>{comparisonPaths(tracks[id], scale, width).map((d, i) => <path key={i} d={d} vectorEffect="non-scaling-stroke" />)}</g>)}
          <line className="cz-route-profile-cursor" x1={52 + distance / scale.distance * (width - 70)} x2={52 + distance / scale.distance * (width - 70)} y1="20" y2="220" />
          {samples.map((sample, slot) => sample.kind === 'point' && <circle key={slot} className={`cz-route-profile-dot is-${slot}`} cx={52 + distance / scale.distance * (width - 70)} cy={220 - (sample.elevation - scale.low) / Math.max(1, scale.high - scale.low) * 190} r="5" />)}
          {[0, .5, 1].map(fraction => <text key={fraction} x={52 + fraction * (width - 70)} y="250" textAnchor={fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle'}>{number(scale.distance * fraction / 1000, 1)} km</text>)}
        </svg>
        <div className="cz-route-profile-control"><label htmlFor="route-comparison-distance">Punkt na trasach <strong>{number(distance / 1000, 2)} km</strong></label><input id="route-comparison-distance" type="range" min="0" max={maxDistance} step="10" value={distance} aria-valuetext={`${number(distance / 1000, 2)} kilometra od początku tras`} onChange={event => setDistance(Number(event.target.value))} /><p>Przesuń po wykresie lub użyj suwaka. Strzałki: 10 m.</p></div>
        <div className="cz-route-point-readouts">{samples.map((sample, slot) => <div className={`cz-route-compare-slot is-${slot}`} key={selected[slot]}><span>{slot === 0 ? 'A' : 'B'} · {tripRoutes[selected[slot]].title}</span><strong>{sample.kind === 'point' ? `≈ ${number(sample.elevation)} m n.p.m.` : sample.kind === 'gap' ? 'Przerwa w zapisie GPS' : 'Poza zapisem tej trasy'}</strong><button type="button" disabled={sample.kind !== 'point'} onClick={() => onShowPoint({ ...sample, id: selected[slot], slot })}>Pokaż na mapie ↑</button></div>)}</div>
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
