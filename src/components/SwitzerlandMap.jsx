import React, { useEffect, useId, useRef, useState } from 'react'
import { Mountain, Route, Waves, Snowflake } from 'lucide-react'
import geometry from '../data/switzerlandMapPaths.json'
import { switzerlandPlaces, switzerlandPosition } from '../data/switzerlandPlaces'
import { AtlasMapSurface } from './AtlasMapSurface'
import './switzerlandMap.css'

const icons = { mountain:Mountain, route:Route, lakes:Waves, glacier:Snowflake }

export function SwitzerlandMap({ selectedId, onSelect }) {
  const prefix = `swiss-${useId().replace(/:/g,'')}`
  const sheet = useRef(null)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 460))
    observer.observe(sheet.current)
    return () => observer.disconnect()
  }, [])
  const anchor = place => compact ? place.compactAnchor : place.anchor
  return <div className="cz-swiss-sheet" ref={sheet}>
    <svg viewBox={geometry.viewBox} className="cz-swiss-svg" role="img" aria-label="Mapa sześciu miejsc z podróży po Szwajcarii">
      <AtlasMapSurface prefix={prefix} />
      <rect width="800" height="600" fill={`url(#${prefix}-sea)`} />
      <g aria-hidden="true">{geometry.countries.map(country => <g key={country.id} className={`cz-swiss-land${country.id === 'che' ? ' is-switzerland' : ''}`}>
        {country.paths.map((d,index) => <path key={index} d={d} fill={`url(#${prefix}-${country.id === 'che' ? 'gold' : 'land'})`} fillRule="evenodd" filter={`url(#${prefix}-grain)`} />)}
      </g>)}</g>
      <g className="cz-swiss-lakes" aria-hidden="true">{geometry.lakes.flatMap((lake,index) => lake.paths.map((d,part) => <path key={`${index}/${part}`} d={d} fillRule="evenodd" />))}</g>
      <g className="cz-swiss-grid" aria-hidden="true">{[160,320,480,640].map(x => <path key={x} d={`M${x} 0V600`} />)}{[150,300,450].map(y => <path key={y} d={`M0 ${y}H800`} />)}</g>
      <g className="cz-swiss-neighbours" aria-hidden="true"><text x="160" y="235">FRANCJA</text><text x="450" y="75">NIEMCY</text><text x="723" y="210">AUSTRIA</text><text x="660" y="535">WŁOCHY</text></g>
      <g className="cz-swiss-leaders" aria-hidden="true">{switzerlandPlaces.map(place => {
        const position = switzerlandPosition(place), active = place.id === selectedId
        return <g key={place.id} className={active ? 'is-selected' : ''}><path d={`M${position.x*8} ${position.y*6}L${anchor(place)[0]*8} ${anchor(place)[1]*6}`} /><circle cx={position.x*8} cy={position.y*6} r={active ? 3.5 : 2.5} /></g>
      })}</g>
    </svg>
    <div className="cz-swiss-caption"><span>Szwajcaria <b>2025</b></span><small>{switzerlandPlaces.length} miejsc z podróży</small></div>
    <div className="cz-swiss-points" role="group" aria-label="Miejsca w Szwajcarii">
      {switzerlandPlaces.map(place => {
        const Icon = icons[place.icon], active = selectedId === place.id
        return <button key={place.id} type="button" className={`cz-swiss-pin${active ? ' is-selected' : ''}`} data-label-position={place.id === 'augstmatthorn' ? 'above' : undefined} style={{left:`${anchor(place)[0]}%`,top:`${anchor(place)[1]}%`}} onClick={() => onSelect(place.id)} aria-label={`Wybierz: ${place.name}`} aria-pressed={active}>
          <span className="cz-swiss-pin-circle"><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span>
          <span className="cz-swiss-pin-label">{place.name}</span>
        </button>
      })}
    </div>
    <span className="cz-swiss-north" aria-hidden="true">↑<small>N</small></span>
  </div>
}
