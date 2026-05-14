import React, { useRef, useState } from 'react'
import { travelAtlasData } from '../data/travelData'
import { resolveTatryPointPosition } from '../data/atlasGeo'
import { tatryMapBasePlaceholder } from '../data/tatryMapBase'
import '../mapStyles.css'

const worldShapes = [
  { id: 'north-america', d: 'M50 92l18-18 30-16 36-10 40 2 32 12 20 18 4 22-14 14-22 6-12 10-16 4-18-2-16 8-18 4-18-8-20-12-16-20 0-14 10-10z' },
  { id: 'south-america', d: 'M162 172l18 8 16 18 10 20 2 24-4 28-10 26-14 22-10 12-10-4 0-18-8-18 2-24 10-22 8-18 0-14z' },
  { id: 'europe', d: 'M266 86l14-10 20-4 18 4 14 10 2 12-8 10-14 4-14 4-8 8-12-2-12-10-2-12z' },
  { id: 'africa', d: 'M282 126l18 6 18 16 12 24 2 30-8 34-14 30-14 20-12 10-10-10-2-22 2-26 8-28 10-22 8-16z' },
  { id: 'asia', d: 'M320 86l34-14 44-8 54 0 46 10 34 18 20 22 8 20-6 22-16 16-24 12-20 2-14 8-22 4-30-2-24-10-18-16-12-22-6-20 6-20z' },
  { id: 'oceania', d: 'M454 246l16-6 22 2 20 10 10 12-4 12-14 10-20 4-18-4-14-12z' },
]

const worldLabels = [
  { id: 'europe', label: 'Europa', x: 286, y: 72 },
  { id: 'asia', label: 'Azja', x: 402, y: 76 },
  { id: 'africa', label: 'Afryka', x: 302, y: 120 },
  { id: 'north-america', label: 'Ameryka Północna', x: 132, y: 44 },
  { id: 'south-america', label: 'Ameryka Południowa', x: 188, y: 158 },
  { id: 'oceania', label: 'Oceania', x: 490, y: 236 },
]

const europeCountries = [
  { id: 'germany', label: 'DE', labelX: 244, labelY: 132, d: 'M220 102l22-8 20 6 12 14-2 20-12 16-20 6-16-8-8-18 4-18z' },
  { id: 'poland', label: 'PL', labelX: 296, labelY: 126, d: 'M270 98l30-4 24 8 10 16-4 22-16 18-24 2-20-12-6-20 6-18z' },
  { id: 'slovakia', label: 'SK', labelX: 296, labelY: 178, d: 'M274 166l34-2 18 6 0 10-20 10-34 2-14-10z' },
  { id: 'switzerland', label: 'CH', labelX: 236, labelY: 178, d: 'M214 166l22-6 18 2 4 10-10 12-22 4-16-8z' },
  { id: 'austria', label: 'AT', labelX: 264, labelY: 198, d: 'M238 184l28-6 30 4 10 10-10 12-28 6-24-2-12-10z' },
  { id: 'slovenia', label: 'SI', labelX: 258, labelY: 218, d: 'M244 212l18-2 12 6 0 8-16 6-14-4z' },
]



const TatryMapBase = ({ baseData }) => {
  const layers = baseData.layers || {}
  const contourPath = layers.contour?.d || baseData.regionContour
  const reliefBands = layers.relief?.bands || baseData.reliefBands || []
  const topoHints = layers.relief?.topoHints || baseData.topoLines || []
  const ridgeLines = layers.ridges || baseData.ridgeLines || []
  const valleyLines = layers.valleys || (baseData.valleyLines || []).map((d) => ({ id: d, d }))
  const border = layers.border || baseData.borders?.[0]

  return (
    <svg className="tatryStructure" viewBox={baseData.viewBox} preserveAspectRatio="none" aria-hidden="true">
      {contourPath ? <path d={contourPath} className="tatryRegionContour" /> : null}
      {reliefBands.map((band) => <path key={band.id || band.d || band} d={band.d || band} className="tatryReliefBand" />)}
      {topoHints.map((line) => <path key={line.id || line.d || line} d={line.d || line} className="tatryTopoLine" />)}
      {ridgeLines.map((line) => <path key={line.id} d={line.d} className="tatryRidgeLine" />)}
      {valleyLines.map((line) => <path key={line.id || line.d} d={line.d || line} className="tatryValleyLine" />)}
      {border ? (
        <g key={border.id}>
          <path d={border.d} className="tatryBorder" />
          {border.labels?.map((label) => (
            <text key={`${border.id}-${label.text}-${label.y}`} x={label.x} y={label.y} className={`tatryBorderLabel ${label.variant === 'south' ? 'isSouth' : ''}`} textAnchor={label.anchor || 'start'}>{label.text}</text>
          ))}
        </g>
      ) : null}
    </svg>
  )
}

const levelNames = ['Świat', 'Kontynent', 'Kraj', 'Region specjalny', 'Szczyt']
const levelIcons = {
  world: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8M12 3.6c2.2 2.2 3.6 5.2 3.6 8.4S14.2 18.2 12 20.4M12 3.6C9.8 5.8 8.4 8.8 8.4 12s1.4 6.2 3.6 8.4" />
    </svg>
  ),
  europe: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.2 10.6 7.4 7.9l3-1.2 2.7.6 1.5 1.6 1.9.4 1.2 2-1 2-2.3 1.4-2.4.2-1.8 1.1-2.6-.3-1.8-1.5-.8-2.2z" />
    </svg>
  ),
  mountain: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.8 18.4 9.7 8.2l4 5.4 1.9-2.8 4.6 7.6H3.8z" />
      <path d="m9.7 8.2 1.3 1.8 1.4-2.2 1.3 1.8" />
    </svg>
  ),
}



const tatryLabelAliases = {
  'durny-szczyt': 'Durny',
  'lodowy-szczyt': 'Lodowy',
  'kiezmarski-szczyt': 'Kieżmarski',
  'baranie-rogi': 'Baranie Rogi',
  'jagniecy-szczyt': 'Jagnięcy',
  'slawkowski-szczyt': 'Sławkowski',
  'mieguszowiecki-szczyt-wielki': 'Mięguszowiecki',
  'starorobocianski-wierch': 'Starorobociański',
}


const tatryTierWeight = {
  featured: 3,
  primary: 2,
  secondary: 1,
}

const tatryFeaturedIds = new Set(['gerlach', 'lomnica', 'rysy', 'krywan', 'koscielec', 'kiezmarski-szczyt', 'lodowy-szczyt', 'durny-szczyt'])

const tatryClusterPriority = {
  'lomnica': 12,
  'gerlach': 11,
  'rysy': 10,
  'swinica': 9,
  'koscielec': 9,
  'krywan': 8,
  'kończysta': 7,
  'lodowy-szczyt': 7,
  'baranie-rogi': 6,
  'kiezmarski-szczyt': 6,
  'durny-szczyt': 5,
  wysoka: 10,
  'mieguszowiecki-szczyt-wielki': 9,
  giewont: 8,
  szatan: 8,
  ganek: 7,
  'posrednia-gran': 7,
  'slawkowski-szczyt': 6,
  'jagniecy-szczyt': 6,
  wolowiec: 5,
  'starorobocianski-wierch': 5,
}

const getTatryCollisionLayout = (points) => {
  const anchorScaleX = 5.2
  const anchorScaleY = 4.6
  const pointPadding = 7
  const textHeight = 24
  const mapBounds = { left: 14, right: 504, top: 14, bottom: 444 }
  const variantOrder = [
    (base) => ({ x: base.x + 18, y: base.y - 8, anchor: 'east' }),
    (base) => ({ x: base.x - 18, y: base.y - 8, anchor: 'west' }),
    (base) => ({ x: base.x + 16, y: base.y + 11, anchor: 'east' }),
    (base) => ({ x: base.x - 16, y: base.y + 11, anchor: 'west' }),
    (base) => ({ x: base.x + 6, y: base.y - 18, anchor: 'north' }),
    (base) => ({ x: base.x - 6, y: base.y + 18, anchor: 'south' }),
    (base) => ({ x: base.x + 28, y: base.y - 2, anchor: 'east' }),
    (base) => ({ x: base.x - 28, y: base.y - 2, anchor: 'west' }),
    (base) => ({ x: base.x + 29, y: base.y - 17, anchor: 'east' }),
    (base) => ({ x: base.x - 29, y: base.y - 17, anchor: 'west' }),
    (base) => ({ x: base.x + 29, y: base.y + 17, anchor: 'east' }),
    (base) => ({ x: base.x - 29, y: base.y + 17, anchor: 'west' }),
    (base) => ({ x: base.x + 40, y: base.y + 2, anchor: 'east' }),
    (base) => ({ x: base.x - 40, y: base.y + 2, anchor: 'west' }),
  ]

  const labelBoxes = []
  const mapPoints = points.map((point) => ({
    id: point.id,
    x: (point.mapPosition?.x ?? 50) * anchorScaleX,
    y: (point.mapPosition?.y ?? 50) * anchorScaleY,
  }))

  const byPriority = [...points].sort((a, b) => {
    const tierDelta = (tatryTierWeight[b.tier] || 0) - (tatryTierWeight[a.tier] || 0)
    if (tierDelta !== 0) return tierDelta
    return (tatryClusterPriority[b.id] || 0) - (tatryClusterPriority[a.id] || 0)
  })

  return byPriority.map((point) => {
    const fullName = point.name
    const shortName = tatryLabelAliases[point.id] || point.name
    const baseOffset = point.labelOffset || { x: 0, y: 0 }

    const pickVariant = (name) => {
      const textWidth = Math.max(52, Math.min(138, name.length * 6 + 24))
      let selected = variantOrder[0](baseOffset)
      let selectedScore = Number.POSITIVE_INFINITY
      let selectedDistance = Number.POSITIVE_INFINITY

      variantOrder.forEach((variant) => {
        const offset = variant(baseOffset)
        const anchorX = (point.mapPosition?.x ?? 50) * anchorScaleX + offset.x
        const anchorY = (point.mapPosition?.y ?? 50) * anchorScaleY + offset.y
        const candidate = {
          left: anchorX,
          right: anchorX + textWidth,
          top: anchorY - textHeight / 2,
          bottom: anchorY + textHeight / 2,
        }

        const labelPenalty = labelBoxes.reduce((sum, box) => {
          const overlapX = candidate.left < box.right && candidate.right > box.left
          const overlapY = candidate.top < box.bottom && candidate.bottom > box.top
          if (!overlapX || !overlapY) return sum
          const overlapWidth = Math.min(candidate.right, box.right) - Math.max(candidate.left, box.left)
          const overlapHeight = Math.min(candidate.bottom, box.bottom) - Math.max(candidate.top, box.top)
          return sum + overlapWidth * overlapHeight
        }, 0)

        const pointPenalty = mapPoints.reduce((sum, mapPoint) => {
          if (mapPoint.id === point.id) return sum
          const nearX = mapPoint.x >= candidate.left - pointPadding && mapPoint.x <= candidate.right + pointPadding
          const nearY = mapPoint.y >= candidate.top - pointPadding && mapPoint.y <= candidate.bottom + pointPadding
          return nearX && nearY ? sum + 110 : sum
        }, 0)

        const leaderLength = Math.hypot(offset.x, offset.y)
        const leaderCutoff = Math.max(0, leaderLength - 36)
        const edgeOverflow = Math.max(0, mapBounds.left - candidate.left) + Math.max(0, candidate.right - mapBounds.right) + Math.max(0, mapBounds.top - candidate.top) + Math.max(0, candidate.bottom - mapBounds.bottom)
        const angle = Math.abs(Math.atan2(offset.y, offset.x || 0.001))
        const straightLinePenalty = angle < 0.1 || angle > 3 ? 3 : 0
        const longLeaderPenalty = leaderCutoff * 0.9
        const cardinalBonus = ['east', 'west'].includes(offset.anchor) ? -4 : 0
        const distance = Math.abs(offset.x - baseOffset.x) + Math.abs(offset.y - baseOffset.y)
        const score = (labelPenalty * 1.45) + (pointPenalty * 1.15) + straightLinePenalty + longLeaderPenalty + (edgeOverflow * 1.6) + cardinalBonus

        if (score < selectedScore || (score === selectedScore && distance < selectedDistance)) {
          selected = offset
          selectedScore = score
          selectedDistance = distance
        }
      })

      labelBoxes.push({
        left: (point.mapPosition?.x ?? 50) * anchorScaleX + selected.x,
        right: (point.mapPosition?.x ?? 50) * anchorScaleX + selected.x + textWidth,
        top: (point.mapPosition?.y ?? 50) * anchorScaleY + selected.y - textHeight / 2,
        bottom: (point.mapPosition?.y ?? 50) * anchorScaleY + selected.y + textHeight / 2,
      })

      return { offset: selected, score: selectedScore }
    }

    const full = pickVariant(fullName)
    const shouldCompact = full.score > 75 && shortName !== fullName
    const compact = shouldCompact ? pickVariant(shortName) : null

    return {
      ...point,
      displayName: compact ? shortName : fullName,
      labelOffset: compact ? compact.offset : full.offset,
      labelAnchor: (compact ? compact.offset : full.offset).anchor || 'east',
      visualPriority: tatryTierWeight[point.tier] || 1,
    }
  }).sort((a, b) => a.visualPriority - b.visualPriority)
}

export function MapAtlas({ atlasPath, setAtlasPath, activeNode, atlasLookups }) {
  const atlasLevel = atlasPath.length - 1
  const activeId = atlasPath[atlasPath.length - 1]
  const stageRef = useRef(null)
  const [hoveredSummitId, setHoveredSummitId] = useState(null)
  const continents = travelAtlasData.continents
  const getNodeName = (id) =>
    id === 'world'
      ? 'Świat'
      : atlasLookups.continents[id]?.name || atlasLookups.countries[id]?.name || atlasLookups.specialRegions[id]?.name || atlasLookups.summits[id]?.name || atlasLookups.places[id]?.name || id

  const breadcrumb = atlasPath.map((id) => ({ id, name: getNodeName(id) }))
  const getCrumbIcon = (id, level) => {
    if (id === 'world') return levelIcons.world
    if (id === 'europe' || level === 1) return levelIcons.europe
    return levelIcons.mountain
  }
  const countriesForContinent = travelAtlasData.countries.filter((country) => country.continentId === activeId)
  const tatryRegion = travelAtlasData.specialRegions.find((region) => region.id === 'tatry')
  const tatryPointIds = tatryRegion?.summitIds || []
  const tatryPoints = tatryPointIds.map((pointId) => {
    const atlasPoint = atlasLookups.summits[pointId] || atlasLookups.places[pointId] || { id: pointId }
    const position = resolveTatryPointPosition(pointId)
    return {
      ...atlasPoint,
      zone: position.geo?.zone || null,
      geo: atlasPoint.geo || position.geo,
      projectedPosition: position.projectedPosition,
      mapPosition: position.mapPosition,
      labelOffset: position.labelOffset,
      tier: position.tier,
    }
  })
  const activeFilm = activeNode.filmId ? atlasLookups.films[activeNode.filmId] : null
  const nodeType = activeNode.atlasType || activeNode.type || null
  const typeLabelMap = { summit: 'Szczyt', trail: 'Szlak / przejście', viewpoint: 'Punkt widokowy', place: 'Miejsce', city: 'Miasto', hut: 'Schronisko', region: 'Region', country: 'Kraj', continent: 'Kontynent' }

  const tags = [activeNode.visited ? 'odwiedzone' : 'w planach', activeFilm ? 'film' : null, activeNode.gallery?.length ? 'galeria' : 'galeria wkrótce'].filter(Boolean)
  const tatryPointsWithLeaders = getTatryCollisionLayout(tatryPoints).map((point) => {
    const offsetX = point.labelOffset?.x ?? 0
    const offsetY = point.labelOffset?.y ?? 0
    const leaderLength = Math.hypot(offsetX, offsetY)
    const isFeatured = point.tier === 'featured' || tatryFeaturedIds.has(point.id)
    return {
      ...point,
      isFeatured,
      hasLeader: leaderLength >= 11 && (isFeatured || point.tier === 'primary'),
      leaderLength,
      leaderAngle: Math.atan2(offsetY, offsetX),
      isSecondary: !isFeatured && point.tier !== 'primary',
    }
  })

  return (
    <div className="atlasLayout cinematicAtlas">
      <div className={`atlasMapWrap atlasZoomLevel${atlasLevel}`}>
        <div className="atlasToolbar">
          <div className="atlasCrumbTrail" aria-label="Nawigacja atlasu">
            {breadcrumb.map((item, i) => (
              <button key={item.id} className={`atlasCrumb ${i === breadcrumb.length - 1 ? 'isCurrent' : ''}`} type="button" onClick={() => setAtlasPath((prev) => prev.slice(0, i + 1))}>
                <span className="atlasCrumbIcon">{getCrumbIcon(item.id, i)}</span>
                <span className="atlasCrumbBody">
                  <span className="atlasCrumbLevel">{levelNames[i] || `Poziom ${i}`}</span>
                  <span className="atlasCrumbName">{item.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="atlasStage cinematicStage" ref={stageRef}>
          {activeId === 'world' && (
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive">
              <path d="M38 178h484" className="atlasLatLine" />
              {worldShapes.map((shape) => {
                const continent = continents.find((c) => c.id === shape.id)
                return <path key={shape.id} d={shape.d} className={`atlasOutline ${continent?.visited ? 'isVisited' : 'isMuted'}`} onClick={() => continent && setAtlasPath((prev) => [...prev, continent.id])} />
              })}
              {worldLabels.map((region) => (
                <text key={region.id} x={region.x} y={region.y} className={`atlasWorldLabel ${activeId === 'world' && region.id === 'europe' ? 'isActive' : ''}`}>
                  {region.label}
                </text>
              ))}
            </svg>
          )}

          {activeId === 'europe' && (
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive">
              <path d="M174 66l86-24 74-2 70 14 54 40 8 58-18 58-46 52-70 34-86 4-72-28-48-54-4-58 20-36z" className="atlasOutline isDimmed" />
              {europeCountries.map((country) => {
                const data = atlasLookups.countries[country.id]
                return (
                  <g key={country.id}>
                    <path d={country.d} className={`atlasOutline atlasCountry ${data?.visited ? 'isVisited' : 'isMuted'}`} onClick={() => data && setAtlasPath((prev) => [...prev, data.id])} />
                    <text x={country.labelX} y={country.labelY} className="atlasCountryLabel">
                      {country.label}
                    </text>
                  </g>
                )
              })}
              <circle cx="302" cy="168" r="9" className="atlasTatryGlow" onClick={() => tatryRegion && setAtlasPath((prev) => [...prev, tatryRegion.id])} />
              <circle cx="302" cy="168" r="15" className="atlasTatryRing" />
              <text x="302" y="191" textAnchor="middle" className="atlasInlineLabel">
                Tatry
              </text>
            </svg>
          )}

          {activeId === 'tatry' && (
            <div className="summitLayer tatryLayer">
              <div className="tatryViewport">
              <div className="tatryScene">
              <TatryMapBase baseData={tatryMapBasePlaceholder} />
              {tatryPointsWithLeaders.map((summit) => (
                <div
                  key={summit.id}
                  className={`summitPoint summitTier${summit.tier || 'secondary'} ${summit.isFeatured ? 'isFeaturedLabel' : 'isSecondaryLabel'} pointType${summit.pointType || summit.atlasType || summit.type || 'place'} ${activeId === summit.id ? 'isActive' : ''} ${hoveredSummitId === summit.id ? 'isHovered' : ''}`}
                  style={{ left: `${summit.mapPosition?.x ?? 50}%`, top: `${summit.mapPosition?.y ?? 50}%` }}
                >
                  <button
                    type="button"
                    className="summitHitArea"
                    aria-label={`Punkt: ${summit.displayName || summit.name}`}
                    onClick={() => summit.id in atlasLookups.summits && setAtlasPath((prev) => [...prev, summit.id])}
                    onMouseEnter={() => setHoveredSummitId(summit.id)}
                    onMouseLeave={() => setHoveredSummitId(null)}
                    onFocus={() => setHoveredSummitId(summit.id)}
                    onBlur={() => setHoveredSummitId(null)}
                  >
                    <span className="dot" />
                  </button>
                  {summit.hasLeader && <span className="leader" style={{ '--leader-length': `${Math.max(7, Math.min(30, summit.leaderLength - 4))}px`, '--leader-angle': `${summit.leaderAngle}rad` }} />}
                  <button
                    type="button"
                    className={`label anchor${summit.labelAnchor || 'east'} ${(!summit.isFeatured && activeId !== summit.id && hoveredSummitId !== summit.id) ? 'isHidden' : ''}`}
                    style={{ transform: `translate(${summit.labelOffset?.x ?? 0}px, ${summit.labelOffset?.y ?? 0}px)` }}
                    onClick={() => summit.id in atlasLookups.summits && setAtlasPath((prev) => [...prev, summit.id])}
                    onMouseEnter={() => setHoveredSummitId(summit.id)}
                    onMouseLeave={() => setHoveredSummitId(null)}
                    onFocus={() => setHoveredSummitId(summit.id)}
                    onBlur={() => setHoveredSummitId(null)}
                  >{summit.displayName || summit.name}</button>
                </div>
              ))}
              </div>
              </div>
            </div>
          )}

          {activeId === 'africa' && (
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive">
              <path d="M264 44l50 12 46 56 12 58-18 88-44 52-54-20-22-72 10-84z" className="atlasOutline isVisited" />
            </svg>
          )}

          {activeId !== 'world' && activeId !== 'europe' && activeId !== 'tatry' && activeId !== 'africa' && <div className="atlasFallback">Wybierz kolejny poziom z panelu po prawej.</div>}
        </div>
      </div>

      <article className="mapCard isActiveRegion atlasDetailCard">
        <p className="atlasEyebrow">Atlas entry</p>
        <p className="atlasLevelLabel">{levelNames[atlasLevel] || `Poziom ${atlasLevel}`}</p>
        <h3>{activeNode.name}</h3>
        <p className="atlasLead">{activeNode.description}</p>
        {nodeType && <p className="atlasPointType">{typeLabelMap[nodeType] || 'Punkt atlasu'}</p>}
        <div className="atlasTagRow">{tags.map((tag) => <span key={tag} className="atlasTag">{tag}</span>)}</div>
        {activeNode.countryIds && <p className="atlasMeta">Kraje: {activeNode.countryIds.map((id) => atlasLookups.countries[id]?.name).filter(Boolean).join(', ')}</p>}
        {activeId === 'europe' && <p className="atlasMeta">Wyróżniony region: <strong>Tatry</strong>.</p>}
        {activeId === 'tatry' && <p className="atlasMeta">Widok Tatr działa teraz w układzie hybrydowym: osobna baza mapy (placeholder pod docelowe geodata) oraz niezależny overlay interaktywnych szczytów.</p>}
        {atlasLevel === 1 && countriesForContinent.length > 0 && <p className="atlasMeta">Widoczne kraje: {countriesForContinent.map((country) => country.name).join(', ')}</p>}
        {activeFilm && (
          <a className="smallButton atlasCta" href={activeFilm.url} target="_blank" rel="noreferrer">
            Obejrzyj film — {activeFilm.title}
          </a>
        )}
        {!activeNode.gallery?.length && <p className="atlasSoon">Galeria wkrótce.</p>}
      </article>
    </div>
  )
}
