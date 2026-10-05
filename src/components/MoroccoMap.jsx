import React, { useEffect, useId, useRef, useState } from 'react'
import { Landmark, Trees, Sun, Mountain, Film, Castle, Waves, ArrowUpRight } from 'lucide-react'
import moroccoMap from '../data/moroccoMapPaths.json'
import { moroccoMapPlaces, moroccoPosition } from '../data/moroccoPlaces'
import { AtlasMapSurface } from './AtlasMapSurface'
import './moroccoMap.css'

const icons = { city: Landmark, forest: Trees, desert: Sun, canyon: Mountain, film: Film, castle: Castle, waterfall: Waves, mountain: Mountain }
const compactOffsets = { rabat: [-30,-26], fez:[30,-20], azrou:[16,23], merzouga:[44,64], todra:[48,25], ouzoud:[-5,-25] }

export function MoroccoMap({ selectedId, onSelect }) {
  const prefix = `morocco-${useId().replace(/:/g, '')}`
  const sheet = useRef(null)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 460))
    observer.observe(sheet.current)
    return () => observer.disconnect()
  }, [])
  const places = moroccoMapPlaces(selectedId)
  return <div className="cz-morocco-sheet" ref={sheet}>
    <svg viewBox={moroccoMap.viewBox} className="cz-morocco-svg" role="img" aria-label="Mapa miejsc odwiedzonych w Maroku">
      <AtlasMapSurface prefix={prefix} />
      <rect width="640" height="480" fill={`url(#${prefix}-sea)`} />
      <g aria-hidden="true">{moroccoMap.countries.map(country => <g key={country.id} className={`cz-morocco-land ${country.id === 'mar' ? 'is-morocco' : ''}`}>
        {country.paths.map((d, i) => <path key={i} d={d} fill={`url(#${prefix}-${country.id === 'mar' ? 'gold' : 'land'})`} filter={`url(#${prefix}-grain)`} />)}
      </g>)}</g>
      <g className="cz-morocco-grid" aria-hidden="true">{[80,200,320,440,560].map(x => <path key={x} d={`M${x} 0 V480`} />)}{[120,240,360].map(y => <path key={y} d={`M0 ${y} H640`} />)}</g>
      <g className="cz-morocco-base-labels" aria-hidden="true">
        <text x="89" y="249" transform="rotate(-48 89 249)">OCEAN ATLANTYCKI</text><text x="522" y="412">ALGIERIA</text>
        <text x="70" y="445" className="cz-morocco-region-label">MAROKO</text>
      </g>
    </svg>
    <div className="cz-morocco-caption"><span>Miejsca z podróży</span><small>12 miejsc · 2 filmy</small></div>
    <div className="cz-morocco-points" role="group" aria-label="Miejsca w Maroku">
      {places.map(place => {
        const position = moroccoPosition(place)
        const [dx,dy] = (compact && compactOffsets[place.id]) || place.offset || [0,0]
        const Icon = icons[place.icon] || Mountain
        const active = place.id === selectedId
        return <div key={place.id} className={`cz-morocco-point${active ? ' is-selected' : ''}${place.label ? ' has-label' : ''}`} style={{ left:`${position.x}%`,top:`${position.y}%`, '--marker-x':`${dx}px`, '--marker-y':`${dy}px` }}>
          {(dx || dy) ? <><i className="cz-morocco-location" aria-hidden="true" /><i className="cz-morocco-leader" aria-hidden="true" style={{ width:Math.hypot(dx,dy), transform:`rotate(${Math.atan2(dy,dx)}rad)` }} /></> : null}
          <button type="button" className="cz-morocco-pin" aria-label={`Wybierz: ${place.name}${place.id === 'morocco-atlas' ? ' — Imlil, schronisko i Toubkal' : ''}`} aria-pressed={active} onClick={() => onSelect(place.id)}>
            <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
            {place.id === 'morocco-atlas' && <span className="cz-morocco-cluster-count">3</span>}
            <span className="cz-morocco-pin-label">{place.name}{place.id === 'morocco-atlas' && <ArrowUpRight size={11} aria-hidden="true" />}{place.altitude && <small>{place.altitude}</small>}</span>
          </button>
        </div>
      })}
    </div>
    <p className="cz-morocco-hint">Wybierz ikonę · Atlas Wysoki ma osobne zbliżenie</p>
  </div>
}
