import React, { useEffect, useRef, useState } from 'react'
import { Minus, Plus, Maximize2, Mountain, House, Tent, X, MapPin, Route, Waves, Snowflake, Trees, Castle, Camera } from 'lucide-react'
import { atlasNodeById } from '../data/atlasContent'
import { tatryLocations, tatryLocationById } from '../data/tatryAtlas'
import { mercator, unproject, worldSize, fitTerrain, terrainMarkers, visibleTerrainTiles, reprojectTerrainTile, gestureTerrain, zoomTerrainAt, clampTerrainZoom, MIN_TERRAIN_ZOOM, MAX_TERRAIN_ZOOM } from '../data/terrainMap'
import '../tatryTerrain.css'
import { CountryOutline } from './CountryOutline'

const centerOf = entries => ({ x: entries.reduce((sum, point) => sum + point.x, 0) / entries.length, y: entries.reduce((sum, point) => sum + point.y, 0) / entries.length })
const pointDistance = entries => entries.length < 2 ? 0 : Math.hypot(entries[0].x - entries[1].x, entries[0].y - entries[1].y)
const markerIcons = { mountain:Mountain, village:House, hut:Tent, city:MapPin, route:Route, lakes:Waves, glacier:Snowflake, forest:Trees, castle:Castle, film:Camera, waterfall:Waves }
const initialView = (id, points, size, locations, locationById, overview, focusZoom) => locationById[id] ? { ...mercator(locationById[id]), zoom: focusZoom } : fitTerrain(overview || (points.length ? points : locations), size)

export function TatryTerrainMap({ points, selectedId, onSelect, focusRequest = 0, locations = tatryLocations, locationById = tatryLocationById, regionId = 'tatry', resetLabel = 'Całe Tatry', surfaceLabel = 'Mapa terenu Tatr. Przesuwaj palcem lub strzałkami. Plus i minus przybliżają, Home pokazuje całe Tatry.', initialTone = 'natural', overviewPoints = null, focusZoom = 14, countryId = null }) {
  const [size, setSize] = useState({ width: 800, height: 500 })
  const [view, setView] = useState(() => initialView(selectedId, points, { width: 800, height: 500 }, locations, locationById, overviewPoints, focusZoom))
  const [tone, setTone] = useState(initialTone)
  const [hovered, setHovered] = useState(null)
  const [tileStatus, setTileStatus] = useState({})
  const [retry, setRetry] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [fullscreenError, setFullscreenError] = useState(false)
  const [nearbyChoices, setNearbyChoices] = useState(null)
  const surface = useRef(null), frame = useRef(null)
  const viewRef = useRef(view), sizeRef = useRef(size)
  const gesture = useRef(null), pointers = useRef(new Map()), interacted = useRef(false)
  const selectionFromMap = useRef(null)
  const previousSelection = useRef(`${selectedId}/${focusRequest}`)
  const lastLoadedTiles = useRef([])
  const pointsRef = useRef(points), selectedRef = useRef(selectedId)
  const pendingFrame = useRef(null), pendingView = useRef(null)
  pointsRef.current = points; selectedRef.current = selectedId; sizeRef.current = size

  const commit = next => {
    const safe = { x: Math.max(0, Math.min(1, next.x)), y: Math.max(0, Math.min(1, next.y)), zoom: clampTerrainZoom(next.zoom) }
    viewRef.current = safe; setView(safe)
  }
  const schedule = next => {
    pendingView.current = next
    if (pendingFrame.current !== null) return
    pendingFrame.current = requestAnimationFrame(() => { pendingFrame.current = null; commit(pendingView.current) })
  }
  const zoom = (delta, anchor = { x: sizeRef.current.width / 2, y: sizeRef.current.height / 2 }) => {
    interacted.current = true; setHovered(null); setNearbyChoices(null)
    commit(zoomTerrainAt(viewRef.current, viewRef.current.zoom + delta, anchor, sizeRef.current))
  }
  const reset = () => {
    interacted.current = true; setHovered(null); setNearbyChoices(null)
    commit(fitTerrain(overviewPoints || locations, sizeRef.current))
  }
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const next = { width: entry.contentRect.width, height: entry.contentRect.height }
      if (!next.width || !next.height) return
      setSize(next); sizeRef.current = next
      if (!interacted.current) commit(initialView(selectedRef.current, pointsRef.current, next, locations, locationById, overviewPoints, focusZoom))
    })
    observer.observe(surface.current)
    return () => { observer.disconnect(); if (pendingFrame.current !== null) cancelAnimationFrame(pendingFrame.current) }
  }, [])
  useEffect(() => {
    const selectionKey = `${selectedId}/${focusRequest}`
    if (previousSelection.current === selectionKey) return
    previousSelection.current = selectionKey
    const point = locationById[selectedId]
    setNearbyChoices(null)
    if (selectionFromMap.current === selectedId) { selectionFromMap.current = null; return }
    if (point) { interacted.current = true; commit({ ...mercator(point), zoom: Math.max(focusZoom, viewRef.current.zoom) }) }
    else if (selectedId === regionId) reset()
  }, [selectedId, focusRequest])
  useEffect(() => {
    const element = surface.current
    const wheel = event => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      zoom(Math.max(-.5, Math.min(.5, -event.deltaY / 250)), { x: event.clientX - rect.left, y: event.clientY - rect.top })
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [])
  useEffect(() => {
    const changed = () => {
      const active = document.fullscreenElement === frame.current
      setExpanded(active)
      if (active) surface.current?.focus({ preventScroll: true })
      else frame.current?.querySelector('.cz-terrain-expand')?.focus({ preventScroll: true })
    }
    document.addEventListener('fullscreenchange', changed)
    return () => document.removeEventListener('fullscreenchange', changed)
  }, [])
  const toggleFullscreen = async () => {
    setFullscreenError(false)
    try {
      if (document.fullscreenElement === frame.current) await document.exitFullscreen()
      else await frame.current.requestFullscreen()
    } catch { setFullscreenError(true) }
  }

  const startGesture = () => {
    const positions = [...pointers.current.values()]
    if (!positions.length) { gesture.current = null; setDragging(false); return }
    gesture.current = { center: centerOf(positions), distance: pointDistance(positions), view: viewRef.current }
  }
  const pointerDown = event => {
    if (event.target.closest('button,a') || (event.pointerType === 'mouse' && event.button !== 0)) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointers.current.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top })
    event.currentTarget.setPointerCapture(event.pointerId)
    interacted.current = true; setHovered(null); setDragging(true); startGesture()
  }
  const pointerMove = event => {
    if (!pointers.current.has(event.pointerId)) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointers.current.set(event.pointerId, { x: event.clientX - rect.left, y: event.clientY - rect.top })
    const positions = [...pointers.current.values()], current = centerOf(positions), start = gesture.current
    if (!start) return
    const distance = pointDistance(positions)
    schedule(gestureTerrain(start.view, start.center, current, distance && start.distance ? Math.log2(distance / start.distance) : 0, sizeRef.current))
  }
  const pointerEnd = event => {
    if (!pointers.current.has(event.pointerId)) return
    if (pendingFrame.current !== null) { cancelAnimationFrame(pendingFrame.current); pendingFrame.current = null; commit(pendingView.current) }
    pointers.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    startGesture()
  }
  const pick = group => {
    if (group.points.length === 1) { selectionFromMap.current = group.points[0].id === selectedId ? null : group.points[0].id; onSelect(group.points[0].id); return }
    if (viewRef.current.zoom >= MAX_TERRAIN_ZOOM - .1) { setNearbyChoices(group.points); return }
    const fitted = fitTerrain(group.points, sizeRef.current, MAX_TERRAIN_ZOOM)
    interacted.current = true; setHovered(null)
    commit({ ...fitted, zoom: Math.max(fitted.zoom, Math.min(MAX_TERRAIN_ZOOM, viewRef.current.zoom + 1)) })
    surface.current?.focus({ preventScroll: true })
  }
  const keyDown = event => {
    if (event.target !== event.currentTarget) return
    const offsets = { ArrowLeft: [-80, 0], ArrowRight: [80, 0], ArrowUp: [0, -80], ArrowDown: [0, 80] }
    if (offsets[event.key]) {
      event.preventDefault(); interacted.current = true
      const [dx, dy] = offsets[event.key], current = viewRef.current, scale = worldSize(current.zoom)
      commit({ ...current, x: current.x + dx / scale, y: current.y + dy / scale })
    } else if (['+', '=', '-', 'Home'].includes(event.key)) {
      event.preventDefault()
      if (event.key === 'Home') reset(); else zoom(event.key === '-' ? -1 : 1)
    }
  }

  const tiles = visibleTerrainTiles(view, size)
  const failed = tiles.filter(tile => tileStatus[tile.key] === 'error').length
  const loaded = tiles.filter(tile => tileStatus[tile.key] === 'loaded').length
  const backdrop = lastLoadedTiles.current.filter(tile => !tiles.some(current => current.key === tile.key)).map(tile => reprojectTerrainTile(tile, view, size)).filter(tile => tile.left < size.width && tile.top < size.height && tile.left + tile.size > 0 && tile.top + tile.size > 0)
  useEffect(() => { if (loaded === tiles.length) lastLoadedTiles.current = tiles }, [tiles, loaded])
  const groups = terrainMarkers(points, view, size)
  const activeGroup = groups.find(group => group.points.some(point => point.id === selectedId))
  const labelGroup = groups.find(group => group.id === hovered) || activeGroup
  const label = labelGroup ? labelGroup.points.length === 1 ? atlasNodeById[labelGroup.points[0].id].name : labelGroup === activeGroup && !hovered ? atlasNodeById[selectedId].name : `${labelGroup.points.slice(0, 2).map(point => atlasNodeById[point.id].name).join(' · ')}${labelGroup.points.length > 2 ? '…' : ''}` : null
  const labelWidth = label ? Math.min(200, Math.max(90, label.length * 6 + 20)) : 0
  const latitude = unproject(view).lat
  const metersPerPixel = 40075016.686 * Math.cos(latitude * Math.PI / 180) / worldSize(view.zoom)
  const scaleDistance = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000].filter(distance => distance / metersPerPixel <= 90).pop() || 50

  return <div ref={frame} className={`cz-terrain-frame ${expanded ? 'is-expanded' : ''} is-${tone}`}>
    <div className={`cz-terrain-surface ${dragging ? 'is-dragging' : ''}`} ref={surface} tabIndex={0} role="region" aria-label={surfaceLabel}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd} onKeyDown={keyDown}
      onDoubleClick={event => { if (event.target.closest('button,a')) return; const rect = event.currentTarget.getBoundingClientRect(); zoom(1, { x: event.clientX - rect.left, y: event.clientY - rect.top }) }}>
      {countryId && <CountryOutline countryId={countryId} view={view} size={size} />}
      <div className="cz-terrain-tiles" aria-hidden="true">
        {backdrop.map(tile => <img key={`backdrop/${tile.key}`} src={tile.src} alt="" draggable={false} referrerPolicy="strict-origin-when-cross-origin" style={{ left: tile.left, top: tile.top, width: tile.size + .5, height: tile.size + .5 }} />)}
        {tiles.map(tile => <img key={`${retry}/${tile.key}`} src={tile.src} alt="" draggable={false} referrerPolicy="strict-origin-when-cross-origin" style={{ left: tile.left, top: tile.top, width: tile.size + .5, height: tile.size + .5 }}
        onLoad={() => setTileStatus(current => current[tile.key] === 'loaded' ? current : { ...current, [tile.key]: 'loaded' })}
        onError={() => setTileStatus(current => current[tile.key] === 'error' ? current : { ...current, [tile.key]: 'error' })} />)}</div>
      {groups.map(group => { const Icon = markerIcons[group.points[0].icon] || Mountain; return <button type="button" key={group.id} style={{ left: group.x, top: group.y }} className={`cz-terrain-marker ${group.points.length > 1 ? 'is-stack' : ''} ${activeGroup === group ? 'is-active' : ''}`}
        tabIndex={group.x >= 22 && group.x <= size.width - 22 && group.y >= 22 && group.y <= size.height - 22 ? 0 : -1}
        aria-label={group.points.length === 1 ? `Wybierz: ${atlasNodeById[group.points[0].id].name}` : `Przybliż ${regionId === 'tatry' ? 'szczyty' : 'miejsca'}: ${group.points.map(point => atlasNodeById[point.id].name).join(', ')}`}
        aria-pressed={group.points.length === 1 ? group.points[0].id === selectedId : undefined}
        onClick={() => pick(group)} onPointerEnter={() => !dragging && setHovered(group.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(group.id)} onBlur={() => setHovered(null)}><span>{group.points.length > 1 ? group.points.length : <Icon size={13} aria-hidden="true" />}</span></button>})}
      {label && <div className="cz-terrain-label" style={{ width: labelWidth, left: Math.max(8, Math.min(size.width - labelWidth - 8, labelGroup.x - labelWidth / 2)), top: Math.max(64, labelGroup.y - 56) }}>{label}{labelGroup.points.length > 1 && <small>Kliknij, aby przybliżyć</small>}</div>}
      {nearbyChoices && <div className="cz-terrain-nearby"><button className="cz-terrain-close" aria-label="Zamknij wybór miejsca" onClick={() => setNearbyChoices(null)}><X size={15} /></button>{nearbyChoices.map(point => <button type="button" key={point.id} onClick={() => { selectionFromMap.current = point.id; onSelect(point.id); setNearbyChoices(null) }}>{atlasNodeById[point.id].name} →</button>)}</div>}
    </div>
    <div className="cz-terrain-top">
      <button type="button" className="cz-terrain-reset" onClick={reset}><Mountain size={15} aria-hidden="true" />{resetLabel}</button>
      <div className="cz-terrain-tone" role="group" aria-label="Kolor mapy"><button type="button" aria-pressed={tone === 'dark'} onClick={() => setTone('dark')}>Ciemna</button><button type="button" aria-pressed={tone === 'natural'} onClick={() => setTone('natural')}>Naturalna</button></div>
    </div>
    <div className="cz-terrain-controls" role="group" aria-label="Sterowanie mapą terenu">
      <button type="button" aria-label="Przybliż teren" disabled={view.zoom >= MAX_TERRAIN_ZOOM} onClick={() => zoom(1)}><Plus size={18} /></button>
      <button type="button" aria-label="Oddal teren" disabled={view.zoom <= MIN_TERRAIN_ZOOM} onClick={() => zoom(-1)}><Minus size={18} /></button>
      {document.fullscreenEnabled && <button type="button" className="cz-terrain-expand" aria-label={expanded ? 'Zamknij duży widok mapy' : 'Duży widok mapy'} aria-pressed={expanded} onClick={toggleFullscreen}>{expanded ? <X size={17} /> : <Maximize2 size={17} />}</button>}
    </div>
    {loaded < tiles.length && !failed && <div className="cz-terrain-loading" role="status">Wczytywanie mapy…</div>}
    {failed > 0 && <div className="cz-terrain-error" role="status"><span>{loaded ? 'Część mapy nie została wczytana.' : 'Podkład mapy jest chwilowo niedostępny.'}</span><button type="button" onClick={() => { setTileStatus({}); setRetry(current => current + 1) }}>Ponów</button></div>}
    {fullscreenError && <div className="cz-terrain-error" role="status">Pełny ekran jest niedostępny w tej przeglądarce.<button type="button" onClick={() => setFullscreenError(false)}>Zamknij</button></div>}
    <div className="cz-terrain-scale" aria-hidden="true"><span>{scaleDistance >= 1000 ? `${scaleDistance / 1000} km` : `${scaleDistance} m`}</span><i style={{ width: scaleDistance / metersPerPixel }} /></div>
    <div className="cz-terrain-attribution">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · SRTM · <a href="https://opentopomap.org/about" target="_blank" rel="noreferrer">OpenTopoMap (CC BY-SA)</a> · <a href="https://top-o-map.com/" target="_blank" rel="noreferrer">Top-O-Map</a>{countryId && <> · <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Obrys: Natural Earth</a></>}</div>
  </div>
}
