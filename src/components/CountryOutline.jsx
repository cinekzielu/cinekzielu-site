import React, { useEffect, useState } from 'react'
import { terrainSvgViewport } from '../data/terrainMap'

const cache = new Map()

// The outline and the tiles share normalized Web Mercator coordinates.
// Updating the viewport keeps the path stable while panning and zooming.
export function CountryOutline({ countryId, view, size }) {
  const [geometry, setGeometry] = useState(() => cache.get(countryId) || null)
  useEffect(() => {
    const controller = new AbortController()
    const cached = cache.get(countryId)
    setGeometry(cached || null)
    if (!cached) fetch(`/assets/maps/country-outlines/${countryId}.json`, { signal:controller.signal })
      .then(response => { if (!response.ok) throw new Error('Outline unavailable'); return response.json() })
      .then(data => {
        if (controller.signal.aborted || data.id !== countryId || data.format !== 'normalized-web-mercator' || typeof data.path !== 'string') return
        cache.set(countryId,data); setGeometry(data)
      })
      .catch(() => { /* Terrain and markers remain usable when an outline cannot load. */ })
    return () => controller.abort()
  }, [countryId])
  if (!geometry || geometry.id !== countryId) return null
  const { left, top, width, height, viewBox } = terrainSvgViewport(view,size)
  const outside = `M${left},${top}h${width}v${height}h${-width}Z${geometry.path}`
  return <svg className="cz-terrain-country-outline" data-country={countryId} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path className="cz-terrain-country-outside" d={outside} fillRule="evenodd" />
    <path className="cz-terrain-country-halo" d={geometry.path} vectorEffect="non-scaling-stroke" />
    <path className="cz-terrain-country-border" d={geometry.path} vectorEffect="non-scaling-stroke" />
  </svg>
}
