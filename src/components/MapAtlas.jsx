import { showPlannedSummit } from '../data/plannedSummits'
import '../plannedSummits.css'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { galleryHref, galleryItemCount, galleryMediaLabel, galleryLinkLabel } from '../data/galleryNavigation'
import { Search, Play, Mountain } from 'lucide-react'
import { atlasContentNodes, atlasNodeById, atlasQuickIds, readAtlasSelection, atlasAncestry, atlasListNodes, getAtlasMaterials, hasAtlasMaterials, searchAtlasNodes, atlasYears, readAtlasYear } from '../data/atlasContent'
import { TatryExplorer } from './TatryExplorer'
import { AfricaMap } from './AfricaMap'
import { FilmLink } from './SiteTools'
import { atlasTerrainProfile, readAtlasContext } from '../data/atlasTerrain'
import { TatryTerrainMap } from './TatryTerrainMap'
import { atlasFilmHref } from '../data/moroccoPlaces'
import { atlasViewHref, ATLAS_SAVE_VIEW, ATLAS_VIEW_SAVED } from '../data/atlasViewState'
import { routeAtlasHref } from '../data/routeAtlas'
import { summitPageHref } from '../data/summitPages'
import '../mapStyles.css'
import '../atlasExplorer.css'

import worldAtlasBaseAsset from '../assets/maps/world-atlas-dark.webp'
import europeAtlasDarkAsset from '../assets/maps/europe-atlas-dark.webp'
import worldOverlayPaths from '../data/worldRefinedPaths.json'
import europeCountryOverlaysSvgRaw from '../assets/maps/europe-country-overlays.svg?raw'
import { europeMapLabels } from '../data/europeMapLabels'

const worldShapes = [
  { id: 'north-america', d: 'M52 100l20-22 40-22 48-16 54 2 40 12 26 18 6 18-12 16-20 12-26 6-20 14-24 6-22-2-16 10-20 6-20-6-14-14-14-20z' },
  { id: 'south-america', d: 'M156 176l20 12 18 18 10 24 2 30-8 32-12 30-16 24-14 14-8-8 2-20-8-20 0-24 8-22 8-22 8-20 0-18z' },
  { id: 'europe', d: 'M254 86l16-10 22-4 22 6 14 10 0 10-10 10-14 6-14 4-12 10-14 0-10-8-2-12z' },
  { id: 'africa', d: 'M270 126l20 8 20 18 14 24 2 34-8 32-14 30-16 24-14 12-10-10-2-20 2-28 8-26 10-24 8-18z' },
  { id: 'asia', d: 'M304 76l36-14 46-8 58-2 56 8 38 16 24 20 10 22-8 24-22 18-24 10-24 6-20 10-24 4-28-2-22-8-20-16-16-20-10-22 4-22z' },
  { id: 'oceania', d: 'M446 230l18-8 24 0 22 8 12 12-2 12-14 10-20 6-20-4-16-12z' },
]



const normalizeMapNodeId = (value) => {
  if (!value) return null
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
}

const europeNodeIdAliases = new Map([
  ['tatry-region', 'tatry'],
  ['tatry', 'tatry'],
])

const resolveEuropeNodeId = (value) => {
  const normalized = normalizeMapNodeId(value)
  if (!normalized) return null
  return europeNodeIdAliases.get(normalized) || normalized
}

const parseEuropeOverlayShapes = (svgRaw) => {
  if (!svgRaw) return null
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgRaw, 'image/svg+xml')
    const svgRoot = doc.querySelector('svg')
    if (!svgRoot) return null

    if (doc.querySelector('parsererror')) {
      if (import.meta.env.DEV) console.warn('[europe overlay] SVG parsererror detected, skipping overlay')
      return { viewBox: '0 0 560 360', shapes: [], countryOverlayShapes: [], specialRegionOverlayShapes: [] }
    }

    const viewBox = svgRoot.getAttribute('viewBox') || '0 0 560 360'

    const getNodeOverlayId = (node) => {
      const rawId = node.getAttribute('id')
        || node.getAttribute('inkscape:label')
        || node.getAttribute('label')
        || node.getAttribute('data-id')
        || node.getAttribute('data-name')

      return normalizeMapNodeId(rawId)
    }

    const nodes = new Map()
    const addShape = (id, paths) => {
      const normalizedId = resolveEuropeNodeId(id)
      const cleanPaths = (paths || []).map((d) => d?.trim()).filter(Boolean)
      if (!normalizedId || cleanPaths.length === 0) return
      if (!nodes.has(normalizedId)) nodes.set(normalizedId, [])
      nodes.get(normalizedId).push(...cleanPaths)
    }

    doc.querySelectorAll('g').forEach((groupNode) => {
      const id = getNodeOverlayId(groupNode)
      if (!id) return
      const groupPaths = [...groupNode.querySelectorAll('path')]
        .map((pathNode) => pathNode.getAttribute('d'))
        .filter(Boolean)
      addShape(id, groupPaths)
    })

    doc.querySelectorAll('path').forEach((pathNode) => {
      const id = getNodeOverlayId(pathNode)
      const d = pathNode.getAttribute('d')
      if (!id || !d) return
      addShape(id, [d])
    })

    const shapes = [...nodes.entries()]
      .map(([id, paths]) => ({ id, paths: [...new Set(paths)] }))
      .filter((shape) => shape.paths.length > 0)

    const specialRegionOverlayIds = new Set(['tatry'])
    const countryOverlayShapes = []
    const specialRegionOverlayShapes = []
    shapes.forEach((shape) => {
      if (specialRegionOverlayIds.has(shape.id)) {
        specialRegionOverlayShapes.push(shape)
      } else {
        countryOverlayShapes.push(shape)
      }
    })

    if (import.meta.env.DEV && shapes.length === 0) {
      console.warn('[europe overlay] no supported path overlays detected')
    }

    return { viewBox, shapes, countryOverlayShapes, specialRegionOverlayShapes }
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[europe overlay] parse failed', error)
    return { viewBox: '0 0 560 360', shapes: [], countryOverlayShapes: [], specialRegionOverlayShapes: [] }
  }
}
const continentMeta = [
  { shapeId: 'europe', label: 'Europa', position: { x: 294, y: 107 } },
  { shapeId: 'asia', label: 'Azja', position: { x: 410, y: 116 } },
  { shapeId: 'africa', label: 'Afryka', position: { x: 294, y: 184 } },
  { shapeId: 'north-america', label: 'Ameryka Płn.', position: { x: 122, y: 116 } },
  { shapeId: 'south-america', label: 'Ameryka Płd.', position: { x: 180, y: 248 } },
  { shapeId: 'oceania', label: 'Oceania', position: { x: 476, y: 270 } },
]

export function MapAtlas({ standalone = false }) {
  const [selectedId, setSelectedId] = useState(readAtlasSelection)
  const [year, setYear] = useState(readAtlasYear)
  const [contextId, setContextId] = useState(() => readAtlasContext(window.location.search))
  const [showAllFilms, setShowAllFilms] = useState(false)
  const [showAllTrips, setShowAllTrips] = useState(false)
  const [showAllRoutes, setShowAllRoutes] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [query, setQuery] = useState('')
  const [onlyMaterials, setOnlyMaterialsState] = useState(() => new URLSearchParams(window.location.search).get('miejsca') !== 'wszystkie')
  const [historyRevision, setHistoryRevision] = useState(0)
  const [, setViewRevision] = useState(0)
  const [zoom, setZoom] = useState(1)
  const scrollRef = useRef(null)
  const zoomCenter = useRef({ x: .5, y: .5 })
  const panelRef = useRef(null)
  const atlasRef = useRef(null)
  const mapRef = useRef(null)
  const sectionNavRef = useRef(null)
  const sectionId = useId()
  const selected = atlasNodeById[selectedId]
  const ancestry = contextId ? [...atlasAncestry(contextId), selected] : atlasAncestry(selectedId)
  const terrain = useMemo(() => atlasTerrainProfile(contextId || selectedId), [selectedId, contextId])
  const view = terrain ? 'terrain' : selected.view
  const isTerrain = view === 'terrain' && Boolean(terrain)
  const yearScope = terrain?.id || (view === 'tatry' ? 'tatry' : selectedId)
  const years = atlasYears(yearScope)
  const materials = getAtlasMaterials(selectedId, year)
  const routeRegion = selectedId === 'tatry' ? 'Tatry' : selectedId === 'alpy' ? 'Alpy' : null
  useEffect(() => {
    const nav = sectionNavRef.current
    const root = atlasRef.current
    const measure = () => root?.style.setProperty('--atlas-section-nav-height', `${nav?.offsetHeight || 0}px`)
    measure()
    const observer = new ResizeObserver(measure)
    if (nav) observer.observe(nav)
    return () => observer.disconnect()
  }, [])
  useEffect(() => { setShowAllTrips(false); setShowAllRoutes(false) }, [selectedId, year, contextId])
  const terrainPoints = (terrain?.locations || []).filter(point => (!onlyMaterials && year === 'all') || hasAtlasMaterials(point.id, year) || showPlannedSummit(point.id, year))
  const selectedCountry = ancestry.find(node => node.kind === 'Kraj')?.id
  const selectedContinent = ancestry.find(node => node.kind === 'Kontynent')?.id
  const worldOverlay = worldOverlayPaths
  const europeOverlay = useMemo(() => parseEuropeOverlayShapes(europeCountryOverlaysSvgRaw), [])
  const worldOverlays = worldOverlay?.continents.length ? worldOverlay.continents : worldShapes.map(shape => ({ ...shape, paths: [shape.d] }))
  useEffect(() => {
    const sync = () => { setSelectedId(readAtlasSelection()); setContextId(readAtlasContext(window.location.search)); setYear(readAtlasYear()); setOnlyMaterialsState(new URLSearchParams(window.location.search).get('miejsca') !== 'wszystkie'); setHistoryRevision(value => value + 1); setShowAllFilms(false); setHoveredId(null); setQuery('') }
    const saved = () => setViewRevision(value => value + 1)
    window.addEventListener('popstate', sync)
    window.addEventListener(ATLAS_VIEW_SAVED,saved)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener(ATLAS_VIEW_SAVED,saved) }
  }, [])
  useEffect(() => {
    if (standalone || window.location.hash !== '#map') return
    let frame
    const scroll = () => { frame = requestAnimationFrame(() => document.getElementById('map')?.scrollIntoView({ block: 'start', behavior: 'instant' })) }
    scroll()
    window.addEventListener('load', scroll, { once: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('load', scroll) }
  }, [standalone])
  useEffect(() => {
    const compactEurope = view === 'europe' && scrollRef.current?.clientWidth < 520
    zoomCenter.current = compactEurope ? { x: .46, y: .6 } : { x: .5, y: .5 }
    setZoom(compactEurope ? 2 : 1)
    scrollRef.current?.scrollTo({ left: 0, top: 0 })
  }, [view, terrain?.id])
  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    scroller.scrollLeft = zoomCenter.current.x * scroller.scrollWidth - scroller.clientWidth / 2
    scroller.scrollTop = zoomCenter.current.y * scroller.scrollHeight - scroller.clientHeight / 2
  }, [zoom])
  const select = (id, requestedYear = year) => {
    if (!atlasNodeById[id]) return
    window.dispatchEvent(new Event(ATLAS_SAVE_VIEW))
    const defaultProfile = atlasTerrainProfile(id)
    const nextContext = terrain?.locations.some(point => point.id === id) && defaultProfile?.id !== terrain.id ? terrain.id : null
    const scope = nextContext || defaultProfile?.id || (atlasNodeById[id].view === 'tatry' ? 'tatry' : id)
    const nextYear = atlasNodeById[id].status === 'planned' || id === 'world' || atlasNodeById[id].kind === 'Kontynent' ? 'all' : requestedYear === 'all' || atlasYears(scope).includes(requestedYear) ? requestedYear : 'all'
    const url = new URL(window.location.href)
    if (id !== selectedId || nextContext !== contextId) url.searchParams.delete('kadr')
    if (!defaultProfile && atlasNodeById[id].view !== 'tatry') url.searchParams.delete('podklad')
    if (nextContext) url.searchParams.set('obszar',nextContext); else url.searchParams.delete('obszar')
    if (nextYear === 'all') url.searchParams.delete('rok'); else url.searchParams.set('rok', nextYear)
    if (id === 'world') url.searchParams.delete('atlas'); else url.searchParams.set('atlas', id)
    if (!standalone) url.hash = 'map'
    const next = url.pathname + url.search + url.hash
    if (next !== window.location.pathname + window.location.search + window.location.hash) window.history.pushState({}, '', next)
    setSelectedId(id); setContextId(nextContext); setYear(nextYear); setShowAllFilms(false); setHoveredId(null); setQuery('')
  }
  const setOnlyMaterials = value => {
    window.dispatchEvent(new Event(ATLAS_SAVE_VIEW))
    const url = new URL(window.location.href)
    if (value) url.searchParams.delete('miejsca'); else url.searchParams.set('miejsca','wszystkie')
    window.history.replaceState(window.history.state,'',url.pathname + url.search + url.hash)
    setOnlyMaterialsState(value)
  }
  const activateKey = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(id) }
  }
  const changeZoom = (next) => {
    const scroller = scrollRef.current
    if (scroller) zoomCenter.current = { x: (scroller.scrollLeft + scroller.clientWidth / 2) / scroller.scrollWidth, y: (scroller.scrollTop + scroller.clientHeight / 2) / scroller.scrollHeight }
    setZoom(Math.max(1, Math.min(2.5, next)))
  }
  let candidates = atlasListNodes(selectedId)
  if (terrain) candidates = [...new Map([...atlasListNodes(terrain.id), ...terrain.locations.map(point => atlasNodeById[point.id])].map(node => [node.id,node])).values()]
  if (query.trim()) candidates = searchAtlasNodes(query, atlasContentNodes.filter(node => node.id !== 'world'))
  const listed = candidates.filter(node => (!onlyMaterials && year === 'all') || hasAtlasMaterials(node.id, year) || showPlannedSummit(node.id, year) || node.id === selectedId)
  const typeLabel = (count, one, few, many) => `${count} ${count === 1 ? one : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? few : many}`
  const filmLabel = count => typeLabel(count, 'film', 'filmy', 'filmów')
  const summary = selected.status === 'planned' ? 'W planach' : `${materials.galleries.length ? typeLabel(materials.galleries.length, 'wyprawa', 'wyprawy', 'wypraw') + ' · ' : ''}${filmLabel(materials.films.length)}${materials.routes.length ? ` · ${materials.routes.length} GPX` : ''}`
  const showPanel = () => { panelRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' }); panelRef.current?.focus({ preventScroll: true }) }
  const showMap = () => {
    // Keep the mounted map, its viewport and the current history entry intact.
    mapRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
    const target = mapRef.current?.querySelector('.cz-terrain-surface') || mapRef.current
    target?.focus({ preventScroll: true })
  }

  return <div className={`cz-atlas ${standalone ? 'is-standalone' : ''}`} ref={atlasRef}>
    <div className="cz-atlas-topline">
      <div className="cz-atlas-quick" role="group" aria-label="Szybki wybór miejsca">
        <button type="button" onClick={() => select('world')} aria-pressed={selectedId === 'world'}>Świat</button>
        {atlasQuickIds.map(id => <button type="button" key={id} onClick={() => select(id)} aria-pressed={ancestry.some(node => node.id === id)}>{atlasNodeById[id].name}</button>)}
      </div>
      {!standalone && <a className="cz-atlas-expand" href={atlasViewHref(window.location.search)}>Otwórz mapę ↗</a>}
    </div>
    <nav className="cz-atlas-section-nav" ref={sectionNavRef} aria-label="Mapa i materiały wybranego miejsca">
      <div className="cz-atlas-section-context"><strong>{selected.name}</strong><small>{year === 'all' ? 'Wszystkie lata' : year === 'undated' ? 'Rok nieustalony' : year}</small></div>
      <div className="cz-atlas-section-actions">
        <button type="button" onClick={showMap} aria-controls={`${sectionId}-map`} aria-label={`Przejdź do mapy: ${selected.name}`}>Mapa <span aria-hidden="true">↑</span></button>
        <button type="button" onClick={showPanel} aria-controls={`${sectionId}-materials`} aria-label={`Przejdź do materiałów: ${selected.name}`}>{selected.status === 'planned' ? 'Cel' : 'Materiały'} <span aria-hidden="true">↓</span></button>
      </div>
    </nav>
    <div className="atlasLayout cinematicAtlas">
      <div className="atlasMapWrap" ref={mapRef} id={`${sectionId}-map`} tabIndex={-1} role="region" aria-label={`Mapa: ${selected.name}`}>
        <div className="cz-atlas-mapbar">
          <nav className="cz-atlas-breadcrumb" aria-label="Położenie na mapie">{ancestry.map((node, index) => <React.Fragment key={node.id}>{index > 0 && <span aria-hidden="true">/</span>}<button type="button" aria-current={node.id === selectedId ? 'location' : undefined} onClick={() => select(node.id)}>{node.name}</button></React.Fragment>)}</nav>
          {(isTerrain || view === 'tatry') && years.some(value => value !== 'undated') && <label className="cz-atlas-year">Rok wyprawy<select aria-label="Rok wyprawy na mapie" value={year} onChange={event => select(hasAtlasMaterials(selectedId,event.target.value) ? selectedId : yearScope,event.target.value)}><option value="all">Wszystkie lata</option>{years.map(value => <option key={value} value={value}>{value === 'undated' ? 'Bez ustalonego roku' : value}</option>)}</select></label>}
          {view !== 'tatry' && !isTerrain && <div className="cz-atlas-zoom" role="group" aria-label="Skala mapy"><button type="button" aria-label="Pomniejsz mapę" disabled={zoom === 1} onClick={() => changeZoom(zoom - .5)}>−</button><button type="button" aria-label="Przywróć skalę mapy" onClick={() => changeZoom(1)}>{Math.round(zoom * 100)}%</button><button type="button" aria-label="Powiększ mapę" disabled={zoom === 2.5} onClick={() => changeZoom(zoom + .5)}>+</button></div>}
        </div>
        {view !== 'tatry' && !isTerrain && <>
        <div className="cz-atlas-canvas-wrap">
        {view === 'europe' && <nav className="cz-atlas-regions" aria-label="Regiony górskie">
          <span>Regiony</span>
          {['tatry', 'alpy'].map(id => <button type="button" key={id} aria-label={`Otwórz region: ${atlasNodeById[id].name}`} aria-pressed={selectedId === id} onClick={() => select(id)}><Mountain size={17} aria-hidden="true" /><span>{atlasNodeById[id].name}</span><span aria-hidden="true">↗</span></button>)}
        </nav>}
        <div className={`cz-atlas-scroll ${zoom > 1 ? 'is-zoomed' : ''}`} ref={scrollRef}>
          <div className={`atlasStage cinematicStage ${view === 'europe' ? 'isEuropeView' : view === 'africa' ? 'isAfricaView' : view === 'morocco' ? 'isMoroccoView' : view === 'switzerland' ? 'isSwitzerlandView' : ''}`} style={{ '--atlas-zoom': zoom }}>
            {view === 'world' && <svg viewBox="0 0 560 360" className="atlasSvg atlasWorldSvg" role="group" aria-label="Mapa świata — wybierz kontynent">
              <image href={worldAtlasBaseAsset} x="10" y="10" width="540" height="340" preserveAspectRatio="xMidYMid slice" />
              <svg x="10" y="10" width="540" height="340" viewBox={worldOverlay?.viewBox || '0 0 560 360'} preserveAspectRatio="xMidYMid slice" className="worldContinentsOverlaySvg">
                {worldOverlays.map(shape => <g key={shape.id} role="button" tabIndex={0} aria-label={`Wybierz: ${atlasNodeById[shape.id]?.name}`} aria-pressed={selectedContinent === shape.id} onClick={() => select(shape.id)} onKeyDown={event => activateKey(event, shape.id)} onMouseEnter={() => setHoveredId(shape.id)} onMouseLeave={() => setHoveredId(null)} onFocus={() => setHoveredId(shape.id)} onBlur={() => setHoveredId(null)} className={`cz-atlas-world-target ${selectedContinent === shape.id ? 'is-selected' : ''} ${hoveredId === shape.id ? 'is-hovered' : ''} ${hasAtlasMaterials(shape.id) ? 'has-materials' : ''}`}>
                  {shape.paths.map((d, i) => <path key={i} d={d} className="atlasOutline continentOverlay" />)}
                </g>)}
              </svg>
              {continentMeta.map(continent => <g key={continent.shapeId} className="cz-atlas-continent-label" aria-hidden="true"><circle cx={continent.position.x - 8} cy={continent.position.y - 4} r={hasAtlasMaterials(continent.shapeId) ? 3 : 2} /><text x={continent.position.x} y={continent.position.y}>{continent.label}</text></g>)}
            </svg>}
            {view === 'africa' && <AfricaMap selectedCountry={selectedCountry} onSelect={select} summary={filmLabel(getAtlasMaterials('morocco').films.length)} />}
            {view === 'europe' && <svg viewBox="0 0 560 360" className="atlasSvg atlasWorldSvg isEuropeView" role="group" aria-label="Mapa Europy — wybierz kraj">
              <image href={europeAtlasDarkAsset} x="22" y="20" width="516" height="318" preserveAspectRatio="xMidYMid slice" />
              {europeOverlay && <svg x="22" y="20" width="516" height="318" viewBox={europeOverlay.viewBox} preserveAspectRatio="xMidYMid slice" className="europeCountryOverlaySvg">
                {europeOverlay.countryOverlayShapes.filter(shape => europeMapLabels[shape.id]).map(shape => <g key={shape.id} data-country={shape.id} role="button" tabIndex={0} aria-label={`Wybierz: ${atlasNodeById[shape.id].name}`} onClick={() => select(shape.id)} onKeyDown={event => activateKey(event, shape.id)} onMouseEnter={() => setHoveredId(shape.id)} onMouseLeave={event => { if (event.relatedTarget?.closest?.(`[data-country-label="${shape.id}"]`)) return; setHoveredId(null) }} onFocus={() => setHoveredId(shape.id)} onBlur={() => setHoveredId(null)} className={`europeCountryOverlayGroup ${selectedCountry === shape.id ? 'isSelected' : ''} ${hoveredId === shape.id ? 'isHovered' : ''}`}>
                  {shape.paths.map((d, i) => <path key={i} d={d} className={`europeCountryOverlayPath ${hasAtlasMaterials(shape.id) ? 'has-materials' : ''}`} />)}
                  <title>{atlasNodeById[shape.id].name}</title>
                </g>)}
                {Object.entries(europeMapLabels).map(([id, marker]) => {
                  const available = hasAtlasMaterials(id)
                  const hovered = hoveredId === id
                  const [x, y] = marker.point
                  const [lx, ly] = marker.label
                  const leader = Math.hypot(lx - x, ly - y) > 10
                  return <g key={id} className={`cz-europe-marker ${hovered ? 'is-hovered' : ''}`} data-country-label={id}>
                    {(available || hovered) && leader && <line x1={x} y1={y} x2={lx} y2={ly} className="cz-europe-leader" />}
                    <circle cx={x} cy={y} r={id === 'liechtenstein' ? 1.3 : 1.5} className={`cz-europe-dot ${available ? 'has-materials' : ''}`} />
                    {(available || hovered) && <g role={available ? "button" : undefined} tabIndex={available ? -1 : undefined} aria-hidden={!available || undefined} style={{ pointerEvents: available ? "all" : "none" }} aria-label={`Wybierz: ${atlasNodeById[id].name}`} onClick={() => select(id)} onKeyDown={event => activateKey(event, id)} onMouseEnter={() => setHoveredId(id)} onMouseLeave={event => { if (event.relatedTarget?.closest?.(`[data-country="${id}"]`)) return; setHoveredId(null) }} className="cz-europe-label">
                      <rect x={lx - marker.width / 2} y={ly - 5} width={marker.width} height="10" rx="1" />
                      <text x={lx} y={ly} dominantBaseline="central" textAnchor="middle">{atlasNodeById[id].name}</text>
                    </g>}
                  </g>
                })}
              </svg>}
            </svg>}

          </div>
        </div>
        </div>
        <div className="cz-atlas-legend"><span><i /> {['morocco','switzerland'].includes(view) ? 'Miejsca z filmów' : 'Dostępne materiały'}</span>{!['morocco','switzerland'].includes(view) && <span><i className="is-empty" /> Pozostałe miejsca</span>}{['africa','morocco','switzerland'].includes(view) && <a className="cz-atlas-map-source" href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth ↗</a>}{view === 'morocco' && <a className="cz-atlas-map-source" href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames ↗</a>}{view === 'switzerland' && <a className="cz-atlas-map-source" href="https://www.swisstopo.admin.ch/en/landscape-model-swissnames3d" target="_blank" rel="noreferrer">swisstopo ↗</a>}<span className="cz-atlas-map-note">{zoom > 1 ? 'Przewijaj powiększoną mapę' : 'Mapa poglądowa'}</span></div>
        </>}
        {view === 'tatry' && <TatryExplorer key={`tatry/${historyRevision}`} selectedId={selectedId} onSelect={select} onlyMaterials={onlyMaterials} setOnlyMaterials={setOnlyMaterials} onShowMaterials={showPanel} year={year} />}
        {isTerrain && <section className="cz-atlas-terrain" aria-label={`Mapa obszaru: ${terrain.name}`}>
          {atlasNodeById[terrain.id].related?.length > 0 && <nav className="cz-atlas-area-links" aria-label="Powiązane obszary"><span>Obszary</span>{atlasNodeById[terrain.id].related.map(id => <button type="button" key={id} onClick={() => select(id)}>{atlasNodeById[id].name} ↗</button>)}</nav>}
          {terrain.id === 'morocco-atlas' && <button type="button" className="cz-atlas-area-return" onClick={() => select('morocco')}>← Całe Maroko</button>}
          <TatryTerrainMap key={`${terrain.id}/${historyRevision}`} countryId={terrain.countryId} points={terrainPoints} locations={terrain.locations} locationById={terrain.locationById} overviewPoints={terrain.overview} focusZoom={terrain.focusZoom} selectedId={selectedId} onSelect={select} regionId={terrain.id} resetLabel={terrain.resetLabel} surfaceLabel={`Mapa terenu: ${terrain.name}. Przesuwaj palcem lub strzałkami. Plus i minus przybliżają, Home pokazuje cały obszar.`} initialTone="dark" />
          <div className="cz-atlas-terrain-hint"><span>Przeciągnij mapę · przybliż + / −</span><span>{terrain.locations.some(point => showPlannedSummit(point.id, year)) ? '☆ Cel w planach' : 'Miejsca z materiałami'}</span></div>
          {!terrainPoints.length && (materials.films.length > 0 || materials.galleries.length > 0) && <p className="cz-atlas-map-pending">Materiały znajdziesz w panelu wypraw. Miejsca tej podróży nie są jeszcze oznaczone na mapie.</p>}
        </section>}
        {view !== 'tatry' && <>
        <div className="cz-atlas-picker">
          <div className="cz-atlas-picker-heading"><h3>Wybierz miejsce</h3><label><input type="checkbox" checked={onlyMaterials} onChange={event => setOnlyMaterials(event.target.checked)} /> {listed.some(node => node.status === 'planned') ? 'Materiały i plany' : 'Z materiałami'}</label></div>
          <div className="cz-atlas-search"><Search size={16} aria-hidden="true" /><input type="search" aria-label="Szukaj miejsca na mapie" placeholder="Szukaj miejsca…" value={query} onChange={event => setQuery(event.target.value)} /></div>
          <div className="cz-atlas-place-list" role="group" aria-label="Miejsca na mapie">{listed.map(node => {
            const data = getAtlasMaterials(node.id, year)
            return <button type="button" key={node.id} className={node.status === 'planned' ? 'is-planned' : undefined} aria-pressed={node.id === selectedId} onClick={() => select(node.id)}><span>{node.status === 'planned' && '☆ '}{node.name}</span><small>{node.status === 'planned' ? 'W planach' : data.films.length || data.galleries.length ? [data.galleries.length && typeLabel(data.galleries.length, 'wyprawa', 'wyprawy', 'wypraw'), data.films.length && filmLabel(data.films.length)].filter(Boolean).join(' · ') : 'Brak materiałów'}</small></button>
          })}</div>
          {!listed.length && <p className="cz-atlas-empty-search" role="status">{year === 'all' ? 'Brak wyników. Zmień nazwę lub wyłącz filtr „Z materiałami”.' : 'Brak oznaczonych miejsc dla tego roku. Wybierz inny rok lub wszystkie lata.'}</p>}
        </div></>}
      </div>
      <aside className="cz-atlas-detail" ref={panelRef} id={`${sectionId}-materials`} tabIndex={-1} aria-label={`Materiały: ${selected.name}`}>
        <button type="button" className="cz-atlas-panel-return" onClick={showMap}>Wróć do mapy ↑</button>
        {selected.status === 'planned' && <span className="cz-atlas-planned-status">☆ W planach</span>}
        <p className="cz-atlas-kicker">{selected.kind}{selected.altitude ? ` · ${selected.altitude}` : ''}</p>
        <h3>{selected.name}</h3>
        {summitPageHref(selectedId, year) && <a className="cz-atlas-summit-page" href={summitPageHref(selectedId, year)}>Wejścia i materiały szczytu ↗</a>}
        {selected.description && <p className="cz-atlas-description">{selected.description}</p>}
        {selected.visit && (year === 'all' || year === selected.visit.year) && <section className="cz-atlas-visit" aria-label="Dane wejścia">
          <p>Across the Alps · {selected.visit.year} · {selected.visit.number}/05</p>
          <h4>Zdobyty w sierpniu {selected.visit.year}</h4>
          <dl>
            <div><dt>Dystans</dt><dd>{selected.visit.distance.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} km</dd></div>
            <div><dt>Podejścia</dt><dd>+{selected.visit.ascent.toLocaleString('pl-PL')} m</dd></div>
            <div><dt>Czas w ruchu</dt><dd>{selected.visit.movingTime}</dd></div>
          </dl>
          <small>{selected.visit.note}</small>
          <a href={selected.visit.href}>Zobacz rozdział: {selected.name} →</a>
        </section>}
        {selected.status === 'planned' && <div className="cz-atlas-planned-note"><span>{selected.countryLabel}</span><p>Planowane wejście — poza listą zdobytych szczytów.</p><a href="/szczyty#w-planach">Moje szczyty · w planach ↗</a><a href={selected.altitudeSource} target="_blank" rel="noreferrer">Wysokość: SAC ↗</a></div>}
        {selected.status !== 'planned' && (materials.galleries.length > 0 || materials.films.length > 0) && <div className="cz-atlas-stats"><div><strong>{materials.galleries.length}</strong><span>Wyprawy</span></div><div><strong>{materials.films.length}</strong><span>Filmy</span></div><div><strong>{materials.photoCount}</strong><span>{galleryMediaLabel(materials.galleries)}</span></div></div>}
        {selected.related?.length > 0 && <div className="cz-atlas-related">{selected.related.map(id => <button type="button" key={id} onClick={() => select(id)}>{atlasNodeById[id].name} →</button>)}</div>}
        {materials.galleries.length > 0 && <section className="cz-atlas-trips" aria-label="Wyprawy"><h4>Wyprawy</h4>{materials.galleries.slice(0, showAllTrips ? undefined : 3).map(gallery => <article key={gallery.id}>
          <a href={`/wyprawy/${gallery.id}`} tabIndex={-1} aria-hidden="true"><img src={gallery.coverImage} alt="" width={gallery.coverWidth} height={gallery.coverHeight} loading="lazy" /></a>
          <div><a className="cz-atlas-trip-title" href={`/wyprawy/${gallery.id}`}>{gallery.title} <span>{gallery.year}</span> ↗</a><a className="cz-atlas-gallery-link" href={galleryHref(gallery)}>{selected.visit?.expeditionId === gallery.id ? 'Galeria całej wyprawy' : galleryLinkLabel(gallery)} · {galleryItemCount(gallery)} ↗</a></div>
        </article>)}{materials.galleries.length > 3 && <button type="button" className="cz-atlas-library" aria-expanded={showAllTrips} onClick={() => setShowAllTrips(value => !value)}>{showAllTrips ? 'Zwiń wyprawy' : `Pokaż wszystkie wyprawy (${materials.galleries.length})`}</button>}</section>}
        {materials.routes.length > 0 && (routeRegion || selected.kind === 'Szczyt' || (!materials.galleries.length && !materials.films.length)) && <section className="cz-atlas-routes" aria-label={`Trasy GPX: ${selected.name}`}><h4>{routeRegion ? 'Wybrane trasy GPX' : <>Trasy GPX <span>{materials.routes.length}</span></>}</h4>
          {materials.routes.slice(0, !routeRegion && showAllRoutes ? undefined : 3).map(route => <article key={route.id}><a href={`/trasy?trasa=${route.id}#profil`}>{route.title} ↗</a><small>{route.dates} · {(route.distance / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 1 })} km · ↗ ≈ {route.ascentEstimate.toLocaleString('pl-PL')} m</small></article>)}
          {routeRegion && <a className="cz-atlas-region-routes" href={routeAtlasHref({ region: routeRegion, year })}>Zobacz trasy tego regionu ↗</a>}
          {!routeRegion && materials.routes.length > 3 && <button type="button" className="cz-atlas-library" aria-expanded={showAllRoutes} onClick={() => setShowAllRoutes(value => !value)}>{showAllRoutes ? 'Zwiń trasy' : `Pokaż wszystkie trasy (${materials.routes.length})`}</button>}
          <p>Daty dotyczą zapisów GPS.</p>{selected.kind === 'Szczyt' && !summitPageHref(selectedId) && <a href={`/szczyty?q=${encodeURIComponent(selected.name)}#szczyt-${selected.id}`}>Zobacz opisane wejścia ↗</a>}
        </section>}
        {materials.films.length > 0 && <section className="cz-atlas-films" aria-label="Filmy z tego miejsca"><h4>{selected.chapter ? 'Ten moment w filmie' : 'Filmy'} <span>{materials.films.length}</span></h4>{materials.films.slice(0, showAllFilms ? undefined : 3).map(film => <FilmLink key={film.id} href={atlasFilmHref(selected, film)} target="_blank" rel="noreferrer"><Play size={15} aria-hidden="true" /><span>{film.title}<small>{selected.chapter?.videoId === film.youtubeId ? `Oglądaj od ${selected.chapter.time}` : `${film.format} · ${film.duration}`}</small></span><span aria-hidden="true">▷</span></FilmLink>)}{materials.films.length > 3 && <button type="button" className="cz-atlas-library" aria-expanded={showAllFilms} onClick={() => setShowAllFilms(value => !value)}>{showAllFilms ? 'Zwiń filmy' : `Pokaż wszystkie filmy (${materials.films.length})`}</button>}</section>}
        {selected.status !== 'planned' && !materials.films.length && !materials.galleries.length && !materials.routes.length && <div className="cz-atlas-no-content"><p>{year === 'all' ? 'Nie ma jeszcze opublikowanych materiałów z tego miejsca.' : 'Brak materiałów z wybranego roku.'}</p><button type="button" onClick={() => select(selected.parent || 'world')}>← {atlasNodeById[selected.parent || 'world'].name}</button></div>}
      </aside>
    </div>
    <span className="cz-atlas-announcement" role="status" aria-live="polite" aria-atomic="true">{selected.name}: {summary}</span>
  </div>
}
