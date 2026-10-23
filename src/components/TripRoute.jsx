import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { tripRoutes } from '../data/tripRoutes'
import { highestPeak } from '../data/routeAtlas'
import { RoutePhotoStages } from './AlpsPhotoStages'
import '../tripRoute.css'

const views = Object.fromEntries(Object.entries(tripRoutes).map(([id, route]) => [id, lazy(async () => {
  const [{ default: View }, { default: track }] = await Promise.all([import('./TripRouteView'), route.load()])
  return { default: props => <View {...props} track={track} route={route} /> }
})]))
export function TripRoute({ routeId, headingLevel = 4, atlas = false, showPhotos = true }) {
  const route = tripRoutes[routeId]
  const root = useRef(null)
  const anchorPending = useRef(false)
  const [nearby, setNearby] = useState(false)
  const [open, setOpen] = useState(true)
  const matchesAnchor = () => window.location.hash === `#${atlas ? 'profil' : route.anchor}` || (!atlas && route.legacyAnchors?.some(anchor => window.location.hash === `#${anchor}`))
  useEffect(() => {
    let frame
    const jump = () => {
      if (!matchesAnchor()) return
      anchorPending.current = true
      setNearby(true)
      frame = requestAnimationFrame(() => root.current?.scrollIntoView({ behavior: 'instant', block: 'start' }))
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '250px' })
    observer.observe(root.current)
    jump()
    window.addEventListener('hashchange', jump)
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('hashchange', jump) }
  }, [])
  const ready = () => {
    if (anchorPending.current && matchesAnchor()) {
      anchorPending.current = false
      root.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }
  const View = views[routeId], Heading = `h${headingLevel}`
  const highest = highestPeak(route)
  return <section ref={root} className="cz-trip-route" id={route.anchor} aria-labelledby={`${route.id}-route-title`}>
    <div className="cz-route-heading"><div><p className="cz-alps-kicker">{route.dates}</p><Heading id={`${route.id}-route-title`}>{route.title} — trasa i profil</Heading></div><button type="button" aria-expanded={open} aria-controls={`${route.id}-route-content`} onClick={() => setOpen(value => !value)}>{open ? 'Zwiń −' : 'Rozwiń +'}</button></div>
    <p className="cz-route-intro">{route.intro} Wybierz miejsce na profilu, żeby wskazać je na mapie.</p>
    {highest && <p className="cz-route-summit-height">{route.dayIds ? 'Najwyższy szczyt całej wyprawy' : route.peaks.length > 1 ? 'Najwyższy szczyt' : 'Wysokość szczytu'}: <strong>{highest.name} · {highest.altitude} m n.p.m.</strong></p>}
    <div id={`${route.id}-route-content`} hidden={!open}>
      {nearby && open ? <Suspense fallback={<p className="cz-route-loading" role="status">Wczytywanie trasy…</p>}><View headingLevel={headingLevel + 1} onReady={ready} /></Suspense> : <p className="cz-route-loading">Mapa i profil wczytają się po przewinięciu do tej sekcji.</p>}
      {showPhotos && nearby && open && <RoutePhotoStages key={routeId} routeId={routeId} />}
    </div>
    <a className="cz-route-strava" href="/trasy">Wszystkie trasy ↗</a>
    {route.stravaUrl && <a className="cz-route-strava" href={route.stravaUrl} target="_blank" rel="noreferrer">Zobacz aktywność na Stravie ↗</a>}
  </section>
}
