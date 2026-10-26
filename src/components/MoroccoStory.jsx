import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { moroccoStory, moroccoStoryForPlace, moroccoStoryHash } from '../data/moroccoStory'
import { moroccoPlaces } from '../data/moroccoPlaces'
import { moroccoGallery } from '../data/moroccoGallery'
import { PhotoGrid } from './PhotoGrid'
import { ResponsivePhoto } from './ResponsivePhoto'
import { FilmLink } from './SiteTools'
import '../moroccoStory.css'
import { StoryStageNav } from './StoryStageNav'

const TerrainMap = lazy(() => import('./TatryTerrainMap').then(module => ({ default: module.TatryTerrainMap })))
const locations = moroccoPlaces.map(place => ({ ...place, lng: place.lon }))
const locationById = Object.fromEntries(locations.map(place => [place.id, place]))
const stageLinks = moroccoStory.map(stop => ({ id: stop.id, title: stop.title, href: moroccoStoryHash(stop) }))
const stopFromHash = () => moroccoStory.find(stop => moroccoStoryHash(stop) === window.location.hash)

export function MoroccoStoryHero() {
  return <header className="cz-story-hero">
    <ResponsivePhoto photo={moroccoGallery.photos[0]} full sizes="(max-width:1448px) 100vw, 1360px" loading="eager" fetchPriority="high" />
    <div className="cz-story-hero-content">
      <p className="cz-story-kicker">Podróż · 2025</p>
      <h1>Maroko</h1>
      <p className="cz-story-subtitle">Od miast po Toubkal.</p>
      <p className="cz-story-hero-meta">Dwa filmy. Dziesięć rozdziałów podróży.</p>
      <nav aria-label="Materiały z Maroka"><a className="cz-story-start" href="#opowiesc">Przejdź przez podróż ↓</a><a href="#filmy">Obejrzyj filmy ↗</a><a href="#kadry">40 kadrów ↓</a></nav>
    </div>
    <span className="cz-story-source">Kadr z nagrania DJI</span>
  </header>
}

export function MoroccoStory() {
  const [activeId, setActiveId] = useState(moroccoStory[0].places[0].id)
  const [mapOpen, setMapOpen] = useState(false)
  const [nearby, setNearby] = useState(false)
  const root = useRef(null)
  const active = moroccoStoryForPlace(activeId) || moroccoStory[0]

  useEffect(() => {
    document.documentElement.classList.add('cz-story-page')
    const media = window.matchMedia('(min-width:901px)')
    const resize = () => setMapOpen(media.matches)
    resize()
    media.addEventListener('change', resize)
    const loader = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearby(true); loader.disconnect() }
    }, { rootMargin: '400px' })
    loader.observe(root.current)
    // Determine the chapter crossing the upper reading line; scrolling never
    // changes browser history or keyboard focus.
    let scheduled = null
    const update = () => {
      scheduled = null
      if (document.querySelector('dialog[open]')) return
      const sections = [...root.current.querySelectorAll('[data-story-stop]')]
      // A hash target sits below the sticky mobile navigation. On short screens
      // that can be lower than the proportional reading line (e.g. landscape).
      const anchorOffset = sections[0] ? parseFloat(getComputedStyle(sections[0]).scrollMarginTop) || 0 : 0
      const line = Math.max(window.innerHeight * .38, anchorOffset + 8)
      const current = sections.filter(section => section.getBoundingClientRect().top <= line).at(-1) || sections[0]
      if (current) {
        const stop = moroccoStory.find(item => item.id === current.dataset.storyStop)
        setActiveId(previous => stop.places.some(place => place.id === previous) ? previous : stop.places[0].id)
      }
    }
    const scroll = () => { if (scheduled === null) scheduled = requestAnimationFrame(update) }
    const hash = () => {
      const stop = stopFromHash()
      if (stop) { setActiveId(stop.places[0].id); document.getElementById(moroccoStoryHash(stop).slice(1))?.scrollIntoView({ behavior: 'instant' }) }
    }
    hash()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    window.addEventListener('hashchange', hash)
    return () => { document.documentElement.classList.remove('cz-story-page'); loader.disconnect(); media.removeEventListener('change', resize); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); window.removeEventListener('hashchange', hash); if (scheduled !== null) cancelAnimationFrame(scheduled) }
  }, [])

  const pickPlace = id => {
    const stop = moroccoStoryForPlace(id)
    if (!stop) return
    setActiveId(id)
    if (window.matchMedia('(max-width:900px)').matches) setMapOpen(false)
    // Native anchors retain Back navigation, while marker selection preserves
    // the chosen pin when two cities share one chapter.
    window.history.pushState(null, '', moroccoStoryHash(stop))
    document.getElementById(moroccoStoryHash(stop).slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }

  return <section id="opowiesc" className="cz-story" ref={root} aria-labelledby="cz-story-title">
    <div className="cz-story-intro"><p className="cz-story-kicker">Maroko · 2025</p><h2 id="cz-story-title">Miejsca po drodze</h2><p>Od Rabatu i Fezu przez Saharę po Atlas Wysoki. Wybierz rozdział albo przewijaj dalej.</p></div>
    <nav className="cz-story-chapters" aria-label="Rozdziały podróży">{moroccoStory.map(stop => <a key={stop.id} href={moroccoStoryHash(stop)} aria-current={active.id === stop.id ? 'step' : undefined}><span>{stop.number}</span>{stop.title}</a>)}</nav>
    <div className="cz-story-layout">
      <aside className="cz-story-map">
        <StoryStageNav stages={stageLinks} activeId={active.id} label="Etapy Maroka" onNavigate={() => setMapOpen(false)} />
        <button className="cz-story-map-toggle" type="button" aria-expanded={mapOpen} aria-controls="cz-story-map-content" onClick={() => setMapOpen(value => !value)}>{mapOpen ? 'Zwiń mapę' : 'Pokaż mapę'}<span>{active.number} / 10 · {active.title} {mapOpen ? '−' : '+'}</span></button>
        <div id="cz-story-map-content" hidden={!mapOpen}>
          <div className="cz-story-map-heading"><span>{active.number} / 10</span><strong>{active.title}</strong></div>
          {nearby && mapOpen && <Suspense fallback={<div className="cz-story-map-loading">Wczytywanie mapy…</div>}><TerrainMap embedded points={locations} selectedId={activeId} onSelect={pickPlace} locations={locations} locationById={locationById} regionId="morocco" resetLabel="Cała podróż" surfaceLabel="Miejsca podróży po Maroku. Wybierz punkt, aby przejść do rozdziału. Strzałki przesuwają mapę, plus i minus zmieniają skalę." initialTone="dark" overviewPoints={locations} focusZoom={active.places[0].group ? 12 : 7.5} countryId="morocco" /></Suspense>}
          <div className="cz-story-map-footer"><span>Punkty miejsc, nie ślad GPS.</span><a href={`/mapa?atlas=${activeId}&obszar=morocco`}>Otwórz w atlasie ↗</a></div>
        </div>
      </aside>
      <div className="cz-story-stops">{moroccoStory.map(stop => <section key={stop.id} id={moroccoStoryHash(stop).slice(1)} data-story-stop={stop.id} tabIndex={-1} className={`cz-story-stop${active.id === stop.id ? ' is-active' : ''}`} aria-labelledby={`story-title-${stop.id}`}>
        <div className="cz-story-stop-heading"><span className="cz-story-number">{stop.number}</span><div><p className="cz-story-kicker">Maroko · część {stop.filmPart}</p><h3 id={`story-title-${stop.id}`}>{stop.title}</h3></div></div>
        <p className="cz-story-description">{stop.description}</p>
        <PhotoGrid eagerFirst={false} gallery={{ ...moroccoGallery, title: stop.title, photos: stop.photos }} />
        <div className="cz-story-stop-footer"><span>Kadry z nagrań DJI</span><FilmLink href={stop.filmHref}>▷ Obejrzyj od {stop.chapter.time}</FilmLink></div>
      </section>)}</div>
    </div>
    <div className="cz-story-end"><p className="cz-story-kicker">Dalej w filmach</p><h2>Cała podróż, w dwóch częściach.</h2><a href="#filmy">Wybierz film ↓</a></div>
  </section>
}
