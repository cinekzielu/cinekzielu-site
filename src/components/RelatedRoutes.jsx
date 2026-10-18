import React, { useEffect, useRef } from 'react'
import { tripRoutes } from '../data/tripRoutes'
import { similarRoutes, routeSummits, summitRoutes, routeSeason, seasonLabel, routeLink, compareLink, summitCompareLink } from '../data/relatedRoutes'
import '../relatedRoutes.css'

const number = (value, digits = 0) => value.toLocaleString('pl-PL', { maximumFractionDigits: digits })
function Metrics({ row }) {
  return <p className="cz-related-metrics"><span>{number(row.distance / 1000, 1)} km</span><span>↗ ≈ {number(row.ascentEstimate)} m</span><span>{seasonLabel(routeSeason(row.id))}</span></p>
}

export function SimilarRoutes({ routeId }) {
  const root = useRef(null)
  useEffect(() => {
    let frame
    const jump = () => {
      if (window.location.hash === '#podobne') frame = requestAnimationFrame(() => root.current?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    }
    jump()
    window.addEventListener('hashchange', jump)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', jump) }
  }, [routeId])
  const suggestions = similarRoutes(routeId)
  const peaks = routeSummits(routeId)
  return <section ref={root} id="podobne" className="cz-related" aria-labelledby="similar-routes-title">
    <div className="cz-related-heading"><div><span className="cz-related-kicker">{tripRoutes[routeId].title}</span><h2 id="similar-routes-title">Podobne przejścia</h2></div><a href="#profil-trasy">Przejdź do profilu ↓</a></div>
    <p className="cz-related-intro">Według pasma, dystansu, sumy podejść i opisanego sezonu. Podobne liczby nie oznaczają podobnej trudności technicznej.</p>
    <div className="cz-related-grid">{suggestions.map(({ row, reasons }) => <article key={row.id}>
      <span className="cz-related-date">{tripRoutes[row.id].dates}</span>
      <h3><a href={routeLink(row.id)}>{tripRoutes[row.id].title}</a></h3>
      <Metrics row={row} />
      <p className="cz-related-reasons">{reasons.join(' · ')}</p>
      <nav aria-label={`Przejście: ${tripRoutes[row.id].title}`}><a href={routeLink(row.id)}>Zobacz trasę ↗</a><a className="cz-related-compare" href={compareLink(routeId, row.id)} aria-label={`Porównaj ${tripRoutes[routeId].title} z ${tripRoutes[row.id].title}`}>Porównaj ↗</a></nav>
    </article>)}</div>
    {peaks.length > 0 && <nav className="cz-related-peaks" aria-label="Szczyty tej trasy"><span>Moje szczyty:</span>{peaks.map(peak => <a key={peak.id} href={`/szczyty?q=${encodeURIComponent(peak.name)}#szczyt-${peak.id}`}>{peak.name} ↗</a>)}</nav>}
  </section>
}

export function SummitRoutes({ summit, filters, expanded }) {
  const rows = summitRoutes(summit.id, filters)
  if (!rows.length) return null
  return <details className="cz-summit-routes" open={expanded}>
    <summary>Przejścia z GPS <span>{rows.length}</span></summary>
    <p>Daty dotyczą zapisów GPS; materiały z opisanych wejść są powyżej.</p>
    <div>{rows.map(row => <article key={row.id}>
      <div><span className="cz-related-date">{tripRoutes[row.id].dates}</span><h3><a href={routeLink(row.id)}>{tripRoutes[row.id].title}</a></h3><Metrics row={row} /></div>
      <nav aria-label={`GPS: ${tripRoutes[row.id].title}`}><a href={routeLink(row.id)}>Mapa i profil ↗</a>{row.trip && <a href={`/wyprawy/${row.trip}#${tripRoutes[row.id].anchor}`}>Trasa w wyprawie ↗</a>}</nav>
    </article>)}</div>
    {rows.length === 2 && <><a className="cz-summit-routes-compare" href={summitCompareLink(summit.id, rows[0].id, rows[1].id)}>Porównaj te przejścia ↗</a><p>W zapisie wielodniowym porównanie wybiera dzień z tym szczytem.</p></>}
  </details>
}
