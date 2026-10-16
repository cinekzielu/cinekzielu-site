import React, { useMemo } from 'react'
import { TatryTerrainMap } from './TatryTerrainMap'
import { buildTrackGeometry } from '../data/routeGeometry'
import { terrainSvgViewport } from '../data/terrainMap'
import { tripRoutes } from '../data/tripRoutes'

export default function RouteAtlasMap({ rows, tracks, selected, highlighted, onSelect }) {
  const geometries = useMemo(() => Object.fromEntries(rows.filter(row => tracks[row.id]).map(row => [row.id, buildTrackGeometry(tracks[row.id])])), [rows, tracks])
  const markers = useMemo(() => rows.map(row => ({ ...tripRoutes[row.id].peaks[0], id: `route-${row.id}`, name: tripRoutes[row.id].title, icon: 'route' })), [rows])
  const byId = useMemo(() => Object.fromEntries(markers.map(point => [point.id, point])), [markers])
  const overview = useMemo(() => Object.values(geometries).flatMap(geometry => geometry.points), [geometries])
  const focus = geometries[selected]?.points || overview
  const active = highlighted || selected
  const overlay = (view, size) => <svg className="cz-route-atlas-overlay" viewBox={terrainSvgViewport(view, size).viewBox} preserveAspectRatio="none" aria-hidden="true">
    {rows.slice().sort((a, b) => Number(a.id === active) - Number(b.id === active)).map(row => <g key={row.id} data-route={row.id} className={active === row.id ? 'is-highlighted' : active ? 'is-muted' : ''}>
      {geometries[row.id]?.paths.map((d, i) => <React.Fragment key={i}><path d={d} className="cz-route-atlas-halo" vectorEffect="non-scaling-stroke" /><path d={d} className="cz-route-atlas-line" vectorEffect="non-scaling-stroke" /></React.Fragment>)}
    </g>)}
  </svg>
  // Fit the complete trace on selection, not just its peak. Hover keeps the view.
  return <TatryTerrainMap key={`${rows.map(row => row.id).join(',')}/${selected || 'overview'}`} embedded regionId="route-atlas"
    points={markers} locations={markers} locationById={byId} overviewPoints={focus} selectedId={null}
    initialTone="dark" resetLabel={selected ? 'Cała trasa' : 'Wszystkie trasy'} renderOverlay={overlay}
    onSelect={id => onSelect(id.replace(/^route-/, ''))}
    surfaceLabel="Atlas tras GPX. Strzałki przesuwają mapę, plus i minus przybliżają, Home przywraca cały widok." />
}
