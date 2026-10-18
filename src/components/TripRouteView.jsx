import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TatryTerrainMap } from './TatryTerrainMap'
import { terrainScreen, terrainSvgViewport } from '../data/terrainMap'
import { buildTrackGeometry, closestTrackIndex } from '../data/routeGeometry'
import { comparisonSample, estimateAscent } from '../data/routeAtlas'
import { routeDayView } from '../data/routeDays'

const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })
const km = value => `${number(value / 1000, 2)} km`

function TrackOverlay({ view, size, point, geometry }) {
  const { points, paths } = geometry
  const viewport = terrainSvgViewport(view, size)
  const start = terrainScreen(points[0], view, size), end = terrainScreen(points.at(-1), view, size), chosen = point && terrainScreen(point, view, size)
  return <>
    <svg className="cz-route-overlay" viewBox={viewport.viewBox} preserveAspectRatio="none" aria-hidden="true">
      {paths.map((d, index) => <React.Fragment key={index}><path d={d} className="cz-route-halo" vectorEffect="non-scaling-stroke" /><path d={d} className="cz-route-line" vectorEffect="non-scaling-stroke" /></React.Fragment>)}
    </svg>
    <svg className="cz-route-overlay" viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
      <circle cx={start.x} cy={start.y} r="5" className="cz-route-start" /><circle cx={end.x} cy={end.y} r="5" className="cz-route-end" />
      {chosen && <circle cx={chosen.x} cy={chosen.y} r="8" className="cz-route-active" />}
    </svg>
  </>
}

export default function TripRouteView({ track, route, headingLevel = 5, onReady }) {
  const [dayId, setDayId] = useState('all')
  const view = useMemo(() => routeDayView(track, route, dayId), [track, route, dayId])
  const day = track.days?.find(day => day.id === dayId)
  return <>
    {track.days && <div className="cz-route-day-picker">
      <div className="cz-route-day-buttons" role="group" aria-label="Cała wyprawa lub poszczególne dni">
        <button type="button" aria-pressed={dayId === 'all'} onClick={() => setDayId('all')}>Cała wyprawa</button>
        {track.days.map(day => <button key={day.id} type="button" aria-pressed={dayId === day.id} onClick={() => setDayId(day.id)}>Dzień {day.id} · {day.dates}</button>)}
      </div>
      <p className="cz-route-day-summary" role="status"><strong>{day ? day.title : 'Cała wyprawa'}</strong> · {km(view.track.distance)} · podejścia ≈ {number(estimateAscent(view.track.points))} m{day && ' · dystans od początku tego dnia'}</p>
    </div>}
    <RouteDayDetail key={dayId} track={view.track} route={view.route} headingLevel={headingLevel} onReady={onReady} day={day} />
  </>
}

function RouteDayDetail({ track, route, headingLevel, onReady, day }) {
  const geometry = useMemo(() => buildTrackGeometry(track), [track])
  const { points, segments, profileY } = geometry
  const peaks = route.peaks
  const peakById = useMemo(() => Object.fromEntries(peaks.map(peak => [peak.id, peak])), [peaks])
  const peakIndices = useMemo(() => Object.fromEntries(peaks.map(peak => [peak.id, closestTrackIndex(points, peak)])), [points, peaks])
  const Heading = `h${headingLevel}`
  const inputId = `${route.id}-point`
  const [distance, setDistance] = useState(0)
  const [exactIndex, setExactIndex] = useState(null)
  const [focus, setFocus] = useState(null)
  const pointer = useRef(null)
  const profile = useRef(null)
  const [profileWidth, setProfileWidth] = useState(700)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => { if (entry.contentRect.width) setProfileWidth(entry.contentRect.width) })
    observer.observe(profile.current)
    onReady?.()
    return () => observer.disconnect()
  }, [])
  const profileSpan = Math.max(1, profileWidth - 66)
  const profileX = point => 52 + point.distance / track.distance * profileSpan
  const profilePaths = useMemo(() => segments.map(segment => segment.map((point, index) => `${index ? 'L' : 'M'}${52 + point.distance / track.distance * profileSpan},${profileY(point)}`).join(' ')), [profileSpan, geometry])
  const sample = comparisonSample(track, distance)
  const chosen = exactIndex !== null ? points[exactIndex] : sample.kind === 'point' ? { ...sample, ele: sample.elevation } : null
  const summary = `${km(distance)} · ${chosen ? `${number(chosen.ele)} m n.p.m.` : 'Przerwa w zapisie'}`
  const overlay = useMemo(() => (view, size) => <TrackOverlay view={view} size={size} point={chosen} geometry={geometry} />, [chosen, geometry])
  const choose = index => { setExactIndex(index); setDistance(points[index].distance) }
  const nearest = event => {
    setExactIndex(null)
    const rect = event.currentTarget.getBoundingClientRect()
    const distance = Math.max(0, Math.min(1, (event.clientX - rect.left - 52) / profileSpan)) * track.distance
    setDistance(distance)
  }
  return <div className="cz-route-view">
    {track.stages?.length > 1 && <ol className="cz-route-stages" aria-label="Odcinki połączonej trasy">
      {track.stages.map((stage, index) => <li key={stage.startIndex}><button type="button" onClick={() => { choose(stage.startIndex); setFocus({ ...points[stage.startIndex] }) }}>
        <span>{index + 1}. {stage.title}</span><small>{stage.dates} · {km(stage.distance)}</small>
      </button></li>)}
    </ol>}
    <TatryTerrainMap embedded regionId={`${route.id}-route`} points={peaks} locations={peaks} locationById={peakById} overviewPoints={points} selectedId={null}
      onSelect={id => { const index = peakIndices[id]; choose(index); setFocus({ ...points[index] }) }} resetLabel={day ? 'Trasa tego dnia' : 'Cała trasa'} initialTone="natural"
      surfaceLabel={`Trasa ${route.title} na mapie terenu. Strzałki przesuwają mapę, plus i minus przybliżają, Home pokazuje całą trasę.`}
      renderOverlay={overlay} trackFocus={focus} />
    <div className="cz-route-profile-heading"><Heading>Profil wysokości</Heading><span>Pomiar GPS · m n.p.m.</span></div>
    <svg ref={profile} className="cz-route-profile" viewBox={`0 0 ${profileWidth} 270`} preserveAspectRatio="none" role="img" aria-label={`Profil wysokości: ${route.title}`}
      onPointerDown={event => { pointer.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); nearest(event) }}
      onPointerMove={event => { if (event.pointerType === 'mouse' || pointer.current === event.pointerId) nearest(event) }}
      onPointerUp={() => { pointer.current = null }} onPointerCancel={() => { pointer.current = null }}>
      {[track.minElevation, (track.minElevation + track.maxElevation) / 2, track.maxElevation].map(ele => <g key={ele}><line x1="52" x2={profileWidth - 14} y1={profileY({ ele })} y2={profileY({ ele })} className="cz-route-grid" /><text x="42" y={profileY({ ele }) + 5} textAnchor="end">{number(ele)}</text></g>)}
      {profilePaths.map((d, index) => <path key={index} d={d} className="cz-route-profile-line" vectorEffect="non-scaling-stroke" />)}
      {[0, .5, 1].map(fraction => <text key={fraction} x={52 + fraction * profileSpan} y="258" textAnchor={fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle'}>{km(track.distance * fraction)}</text>)}
      <line x1={profileX({ distance })} x2={profileX({ distance })} y1="24" y2="230" className="cz-route-cursor" />{chosen && <circle cx={profileX(chosen)} cy={profileY(chosen)} r="5" className="cz-route-profile-dot" />}
    </svg>
    <div className="cz-route-scrubber"><div><label htmlFor={inputId}>Punkt na trasie</label><output htmlFor={inputId} aria-live="off">{summary}</output></div>
      <input id={inputId} type="range" min="0" max={track.distance} value={distance} step="10" aria-valuetext={summary} onChange={event => { setExactIndex(null); setDistance(Number(event.target.value)) }} />
      <div className="cz-route-actions"><button type="button" disabled={!chosen} onClick={() => setFocus({ ...chosen })}>Pokaż punkt na mapie</button>{peaks.map(peak => <button type="button" key={peak.id} onClick={() => { const index = peakIndices[peak.id]; choose(index); setFocus({ ...points[index] }) }}>{peak.name} · {peak.altitude} m</button>)}</div>
    </div>
    <p className="cz-route-note">Dystans profilu ({km(track.distance)}) jest liczony z GPS i może różnić się od statystyk aktywności. Wysokości na wykresie to odczyty GPS, a wysokości szczytów podajemy niezależnie od pomiaru.{segments.length > 1 && ' Przerwy i oznaczone skoki w zapisie pozostają rozdzielone.'}</p>
    {peaks.filter(peak => peak.heightNote).map(peak => <p className="cz-route-note" key={peak.id}>{peak.name}: {peak.heightNote}</p>)}
  </div>
}
