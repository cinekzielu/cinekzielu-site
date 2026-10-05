import React, { useId } from 'react'
import africaMap from '../data/africaMapPaths.json'
import './africaMap.css'
import { AtlasMapSurface } from './AtlasMapSurface'

export function AfricaMap({ selectedCountry, onSelect, summary }) {
  const prefix = `africa-${useId().replace(/:/g, '')}`
  const active = selectedCountry === 'morocco'
  const marker = africaMap.moroccoMarker
  return <div className={`cz-africa-sheet${active ? ' is-morocco-selected' : ''}`}>
    <svg viewBox={africaMap.viewBox} role="img" aria-label="Mapa Afryki. Maroko oznaczone złotem; pozostałe kraje bez oznaczeń wypraw." className="cz-africa-svg">
      <AtlasMapSurface prefix={prefix} />
      <rect width="460" height="460" fill={`url(#${prefix}-sea)`} />
      <g className="cz-africa-grid" aria-hidden="true">
        {[0, 20, 40].map(lon => <path key={`lon-${lon}`} d={`M${40 + (lon + 21) * 5},30 V425`} />)}
        {[-20, 0, 20].map(lat => <path key={`lat-${lat}`} d={`M40,${30 + (41 - lat) * 5} H425`} />)}
      </g>
      <g aria-hidden="true">
        {africaMap.countries.map(country => <g key={country.id} className={country.atlasId ? 'cz-africa-country has-materials' : 'cz-africa-country'} onClick={country.atlasId ? () => onSelect(country.atlasId) : undefined}>
          {country.paths.map((d, index) => <path key={index} d={d} fill={`url(#${prefix}-${country.atlasId ? 'gold' : 'land'})`} filter={`url(#${prefix}-grain)`} fillRule="evenodd" />)}
        </g>)}
      </g>
      <g className="cz-africa-ocean" aria-hidden="true"><text x="54" y="252" transform="rotate(-90 54 252)">OCEAN ATLANTYCKI</text><text x="411" y="313" transform="rotate(-90 411 313)">OCEAN INDYJSKI</text></g>
      <text className="cz-africa-name" x="40" y="431" aria-hidden="true">AFRYKA</text>
    </svg>
    <button className="cz-africa-marker" type="button" style={{ left: `${marker.x / 460 * 100}%`, top: `${marker.y / 460 * 100}%` }} aria-label="Wybierz: Maroko" aria-pressed={active} onClick={() => onSelect('morocco')}><span>Maroko <span aria-hidden="true">↗</span></span><small>{summary}</small></button>
  </div>
}
