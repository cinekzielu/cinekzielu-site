import React, { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { alpsStory, alpsStoryGallery, alpsStoryHash, alpsTotals, alpsLocations, alpsLocationById, alpsLegacyChapters } from '../data/alpsStory'
import { ResponsivePhoto } from './ResponsivePhoto'
import { PhotoGrid } from './PhotoGrid'
import { FilmLink } from './SiteTools'
import '../alpsStory.css'

const TerrainMap = lazy(() => import('./TatryTerrainMap').then(module => ({ default: module.TatryTerrainMap })))
const number = (value, digits = 0) => value.toLocaleString('pl-PL', { minimumFractionDigits: digits, maximumFractionDigits: digits })
const chapterFromHash = () => {
  const id = window.location.hash.replace('#alpy-', '')
  return alpsStory.find(chapter => chapter.id === (alpsLegacyChapters[id] || id))
}
const StoryPhotos = ({ title, photos, featured = true }) => <PhotoGrid featured={featured} eagerFirst={false} gallery={{ ...alpsStoryGallery, title, photos }} />

export function AlpsStoryHero() {
  return <header className="cz-alps-hero">
    <ResponsivePhoto photo={alpsStoryGallery.photos[27]} full sizes="(max-width:1448px) 100vw, 1360px" loading="eager" fetchPriority="high" />
    <div className="cz-alps-hero-copy"><p className="cz-alps-kicker">Alpy · sierpień 2026</p><h1>Across<br />the Alps</h1><p>4 osoby. 5 krajów. 5 zdobytych szczytów.</p>
      <nav aria-label="Materiały z Alp"><a href="#opowiesc">Zobacz opowieść ↓</a><FilmLink href={alpsStoryGallery.films[0].url}>▷ Obejrzyj zwiastun</FilmLink><a href="/galerie/alpy-2026">48 fotografii ↗</a></nav>
    </div>
  </header>
}

export function AlpsStory() {
  const [active, setActive] = useState(alpsStory[0].id)
  const [mapOpen, setMapOpen] = useState(() => window.matchMedia('(min-width:701px)').matches)
  const [nearby, setNearby] = useState(false)
  const [mapSelected, setMapSelected] = useState(null)
  const root = useRef(null)
  useEffect(() => {
    document.documentElement.classList.add('cz-alps-page')
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '300px' })
    observer.observe(root.current)
    let frame = null
    const update = () => {
      frame = null
      if (document.querySelector('dialog[open]')) return
      const line = window.innerHeight * .4
      const sections = [...root.current.querySelectorAll('[data-alps-chapter]')]
      const current = sections.filter(section => section.getBoundingClientRect().top <= line).at(-1) || sections[0]
      if (current) setActive(current.dataset.alpsChapter)
    }
    const scroll = () => { if (frame === null) frame = requestAnimationFrame(update) }
    const hash = () => {
      const chapter = chapterFromHash()
      if (chapter) document.getElementById(`alpy-${chapter.id}`)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      update()
    }
    hash()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    window.addEventListener('hashchange', hash)
    return () => { observer.disconnect(); document.documentElement.classList.remove('cz-alps-page'); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); window.removeEventListener('hashchange', hash); if (frame !== null) cancelAnimationFrame(frame) }
  }, [])
  const pickPeak = id => {
    const chapter = alpsStory.find(item => item.id === id)
    if (!chapter) return
    setMapSelected(id)
    window.location.hash = alpsStoryHash(chapter)
    // Selecting the same marker must still return to its chapter.
    document.getElementById(`alpy-${id}`)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }
  return <section className="cz-alps-story" id="opowiesc" ref={root} aria-labelledby="alps-story-title">
    <div className="cz-alps-intro"><div><p className="cz-alps-kicker">Pięć najwyższych szczytów pięciu państw</p><h2 id="alps-story-title">Od Triglavu<br />po Zugspitze.</h2></div><p>W sierpniu ruszyliśmy przez Alpy samochodem Maxa. Między wejściami były przejazdy, gotowanie, odpoczynek i noce w aucie. Z pięciu celów udało się zdobyć wszystkie pięć.</p></div>
    <dl className="cz-alps-totals">
      <div><dt>Zdobyte szczyty</dt><dd>{alpsTotals.peaks} / 5</dd></div>
      <div><dt>Dystans w górach</dt><dd>{number(alpsTotals.distance, 2)} <small>km</small></dd></div>
      <div><dt>Suma podejść</dt><dd>+{number(alpsTotals.ascent)} <small>m</small></dd></div>
      <div><dt>Łączny czas ruchu</dt><dd>{alpsTotals.movingTime}</dd></div>
    </dl>
    <div className="cz-alps-map" id="alpy-mapa">
      <button className="cz-alps-map-toggle" aria-expanded={mapOpen} aria-controls="alps-map-content" onClick={() => setMapOpen(value => !value)}><span>Pięć szczytów na mapie</span><span>{mapOpen ? 'Zwiń −' : 'Rozwiń +'}</span></button>
      <div id="alps-map-content" hidden={!mapOpen}>
        {nearby && mapOpen && <Suspense fallback={<p className="cz-alps-description">Wczytywanie mapy…</p>}><TerrainMap embedded points={alpsLocations} locations={alpsLocations} locationById={alpsLocationById} overviewPoints={alpsLocations} selectedId={mapSelected} onSelect={pickPeak} regionId="alps-story" initialTone="dark" focusZoom={9} resetLabel="Pięć szczytów" surfaceLabel="Mapa pięciu szczytów wyprawy Across the Alps. Wybierz szczyt, aby przejść do jego rozdziału. Strzałki przesuwają, plus i minus zmieniają skalę." /></Suspense>}
        <div className="cz-alps-map-footer"><span>Wybierz szczyt, aby przejść do opowieści.</span><a href="/mapa?atlas=alpy">Cały atlas Alp ↗</a></div>
      </div>
    </div>
    <div className="cz-alps-layout">
      <nav className="cz-alps-rail" aria-label="Rozdziały Alp">{alpsStory.map(chapter => <a key={chapter.id} href={alpsStoryHash(chapter)} aria-current={active === chapter.id ? 'step' : undefined}><span>{chapter.number}</span><span>{chapter.title}<small>{chapter.country} · {chapter.altitude} m</small></span></a>)}<a className="cz-alps-atlas" href="#alpy-mapa">Mapa pięciu szczytów ↑</a></nav>
      <div className="cz-alps-chapters">{alpsStory.map(chapter => <React.Fragment key={chapter.id}><section id={`alpy-${chapter.id}`} data-alps-chapter={chapter.id} aria-labelledby={`alps-title-${chapter.id}`}>
        <header><span className="cz-alps-number">{chapter.number} / 05</span><div><p className="cz-alps-kicker">{chapter.country} · {chapter.altitude} m n.p.m.</p><h3 id={`alps-title-${chapter.id}`}>{chapter.title}</h3></div></header>
        <p className="cz-alps-description">{chapter.description}</p>
        <dl className="cz-alps-stage-stats"><div><dt>Dystans</dt><dd>{number(chapter.distance, 2)} km</dd></div><div><dt>Podejścia</dt><dd>+{number(chapter.ascent)} m</dd></div><div><dt>Czas ruchu</dt><dd>{chapter.movingTime}</dd></div></dl>
        {chapter.statsNote && <p className="cz-alps-stats-note">{chapter.statsNote}</p>}
        {chapter.photos.length > 0 && <StoryPhotos title={chapter.title} photos={chapter.photos} />}
        {chapter.days?.map((day, index) => <div className="cz-alps-day" key={day.title}><p className="cz-alps-kicker">Dzień {index + 1} / 3</p><h4>{day.title}</h4><p className="cz-alps-description">{day.description}</p><StoryPhotos title={`Dufourspitze · ${day.title}`} photos={day.photos} /></div>)}
      </section>{chapter.pause && <aside className="cz-alps-pause" aria-label={`Przerwa po ${chapter.title}`}><p className="cz-alps-kicker">Między szczytami · {chapter.number} → {String(Number(chapter.number) + 1).padStart(2, '0')}</p><h3>{chapter.pause.title}</h3><p className="cz-alps-description">{chapter.pause.description}</p>{chapter.pause.photos.length > 0 && <StoryPhotos title={chapter.pause.title} photos={chapter.pause.photos} featured={false} />}</aside>}</React.Fragment>)}</div>
    </div>
    <section className="cz-alps-crew" aria-labelledby="alps-crew-title"><p className="cz-alps-kicker">Ekipa</p><h2 id="alps-crew-title">Marcin, Max, Karol i Agata.</h2><p>Cztery osoby, jeden samochód i sporo zmian planu. Zdjęcia i filmowa dokumentacja: Cinek Zielu.</p><p className="cz-alps-crew-aside">Według naszych mało naukowych obliczeń: około 10 kg makaronu, 500 razy „SIUUU” i 3 kryzysy egzystencjalne.</p></section>
    <section className="cz-alps-series" aria-labelledby="alps-series-title"><p className="cz-alps-kicker">Seria filmowa</p><h2 id="alps-series-title">Pięć szczytów. Pięć odcinków.</h2><p>Odcinki Across the Alps powstają. Dufourspitze połączy trzy dni w jeden film.</p><ol>{alpsStory.map(chapter => <li key={chapter.id}><span>{chapter.number}</span><strong>{chapter.title}</strong><small>{chapter.episodeStatus}</small></li>)}</ol><a href="#filmy">Obejrzyj zwiastun ↓</a></section>
    <div className="cz-alps-ending"><p className="cz-alps-kicker">Cała kolekcja</p><h2>48 fotografii z Alp.</h2><a href="/galerie/alpy-2026">Otwórz galerię ↗</a></div>
  </section>
}
