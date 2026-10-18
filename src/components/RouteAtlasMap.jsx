import React, { useMemo } from 'react'
import { TatryTerrainMap } from './TatryTerrainMap'
import { buildTrackGeometry } from '../data/routeGeometry'
import { areaKey, areaCorners } from '../data/routeArea'
import { terrainSvgViewport, mercator } from '../data/terrainMap'
import { tripRoutes } from '../data/tripRoutes'

export default function RouteAtlasMap({ rows, tracks, selected, highlighted, profilePoint, onSelect, area, areaViewport, mapScope, onViewportChange }) {
  const geometries = useMemo(() => Object.fromEntries(rows.filter(row => tracks[row.id]).map(row => [row.id, buildTrackGeometry(tracks[row.id])])), [rows, tracks])
  const markers = useMemo(() => [...rows.map(row => ({ ...(tripRoutes[row.id].peaks[0] || tripRoutes[row.id].marker), id: `route-${row.id}`, name: `${tripRoutes[row.id].title} · ${tripRoutes[row.id].dates}`, icon: 'route' })), ...(profilePoint ? [{ ...profilePoint, id: 'profile-point', name: `${profilePoint.slot === 0 ? 'A' : 'B'} · ${(profilePoint.distance / 1000).toLocaleString('pl-PL', { maximumFractionDigits: 2 })} km · punkt profilu`, icon: 'city' }] : [])], [rows, profilePoint])
  const byId = useMemo(() => Object.fromEntries(markers.map(point => [point.id, point])), [markers])
  const overview = useMemo(() => Object.values(geometries).flatMap(geometry => geometry.points), [geometries])
  const focus = geometries[selected]?.points || (area ? areaCorners(area) : overview.length ? overview : Object.values(tripRoutes).map(route => route.peaks[0] || route.marker))
  const nw = area && mercator({ lng: area[0], lat: area[3] }), se = area && mercator({ lng: area[2], lat: area[1] })
  const active = highlighted || selected
  const overlay = (view, size) => <svg className="cz-route-atlas-overlay" viewBox={terrainSvgViewport(view, size).viewBox} preserveAspectRatio="none" aria-hidden="true">
    {area && <rect x={nw.x} y={nw.y} width={se.x - nw.x} height={se.y - nw.y} className="cz-route-area-outline" vectorEffect="non-scaling-stroke" />}
    {rows.slice().sort((a, b) => Number(a.id === active) - Number(b.id === active)).map(row => <g key={row.id} data-route={row.id} className={active === row.id ? 'is-highlighted' : active ? 'is-muted' : ''}>
      {geometries[row.id]?.paths.map((d, i) => <React.Fragment key={i}><path d={d} className="cz-route-atlas-halo" vectorEffect="non-scaling-stroke" /><path d={d} className="cz-route-atlas-line" vectorEffect="non-scaling-stroke" /></React.Fragment>)}
    </g>)}
  </svg>
  // Fit the complete trace on selection, not just its peak. Hover keeps the view.
  return <TatryTerrainMap key={`${mapScope}/${areaKey(area)}/${selected || 'overview'}/${profilePoint ? `${profilePoint.id}:${profilePoint.distance}` : ''}`} embedded regionId="route-atlas"
    points={markers} locations={markers} locationById={byId} overviewPoints={focus} selectedId={profilePoint ? 'profile-point' : null} focusZoom={13.5}
    initialViewport={!selected && areaViewport?.key === areaKey(area) ? areaViewport.view : null} onViewportChange={onViewportChange}
    initialTone="dark" resetLabel={selected ? 'Cała trasa' : area ? 'Wybrany obszar' : 'Wszystkie trasy'} renderOverlay={overlay}
    onSelect={id => { if (id !== 'profile-point') onSelect(id.replace(/^route-/, '')) }}
    surfaceLabel="Atlas tras GPX. Strzałki przesuwają mapę, plus i minus przybliżają, Home przywraca cały widok." />
}
