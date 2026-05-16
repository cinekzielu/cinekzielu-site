import React, { useRef, useState } from 'react'
import { travelAtlasData } from '../data/travelData'
import { resolveTatryPointPosition } from '../data/atlasGeo'
import tatryHillshadeDark from '../assets/maps/tatry-hillshade-dark.png.png'
import '../mapStyles.css'

import worldAtlasBaseAsset from '../assets/maps/world-atlas-dark.webp'

const worldShapes = [
  { id: 'north-america', d: 'M52 100l20-22 40-22 48-16 54 2 40 12 26 18 6 18-12 16-20 12-26 6-20 14-24 6-22-2-16 10-20 6-20-6-14-14-14-20z' },
  { id: 'south-america', d: 'M156 176l20 12 18 18 10 24 2 30-8 32-12 30-16 24-14 14-8-8 2-20-8-20 0-24 8-22 8-22 8-20 0-18z' },
  { id: 'europe', d: 'M254 86l16-10 22-4 22 6 14 10 0 10-10 10-14 6-14 4-12 10-14 0-10-8-2-12z' },
  { id: 'africa', d: 'M270 126l20 8 20 18 14 24 2 34-8 32-14 30-16 24-14 12-10-10-2-20 2-28 8-26 10-24 8-18z' },
  { id: 'asia', d: 'M304 76l36-14 46-8 58-2 56 8 38 16 24 20 10 22-8 24-22 18-24 10-24 6-20 10-24 4-28-2-22-8-20-16-16-20-10-22 4-22z' },
  { id: 'oceania', d: 'M446 230l18-8 24 0 22 8 12 12-2 12-14 10-20 6-20-4-16-12z' },
]

const continentMeta = [
  { id: 'europe', shapeId: 'europe', label: 'Europa', type: 'Kontynent', status: 'active', description: 'Aktywny kierunek atlasu. Wejście do krajów, regionów i szczytów.', position: { x: 283, y: 76 }, routePath: ['world', 'europe'], panelTags: ['active', 'wyprawy', 'film + galerie'] },
  { id: 'asia', shapeId: 'asia', label: 'Azja', type: 'Kontynent', status: 'planned', description: 'Kontynent przygotowany pod kolejne wyprawy i nowe wpisy w atlasie.', position: { x: 404, y: 93 }, routePath: null, panelTags: ['planned', 'future direction'] },
  { id: 'africa', shapeId: 'africa', label: 'Afryka', type: 'Kontynent', status: 'planned', description: 'Kolejny etap rozwoju atlasu. Warstwa gotowa pod dalsze kierunki.', position: { x: 302, y: 168 }, routePath: null, panelTags: ['planned', 'future expansion'] },
  { id: 'northAmerica', shapeId: 'north-america', label: 'Ameryka Płn.', type: 'Kontynent', status: 'planned', description: 'Kontynent dodany jako gotowy overlay i marker pod przyszłe treści.', position: { x: 124, y: 98 }, routePath: null, panelTags: ['planned', 'future direction'] },
  { id: 'southAmerica', shapeId: 'south-america', label: 'Ameryka Płd.', type: 'Kontynent', status: 'planned', description: 'Warstwa przygotowana pod kolejne wyprawy i panel kontynentu.', position: { x: 182, y: 236 }, routePath: null, panelTags: ['planned', 'future direction'] },
  { id: 'oceania', shapeId: 'oceania', label: 'Oceania', type: 'Kontynent', status: 'locked', description: 'Kierunek zaplanowany w atlasie — aktywacja po dodaniu materiałów.', position: { x: 474, y: 252 }, routePath: null, panelTags: ['locked', 'future direction'] },
]

const europeCountryMarkers = [
  { id: 'poland', name: 'Polska', flag: '🇵🇱', x: 334, y: 126, chipWidth: 104 },
  { id: 'slovakia', name: 'Słowacja', flag: '🇸🇰', x: 342, y: 160, chipWidth: 112 },
  { id: 'austria', name: 'Austria', flag: '🇦🇹', x: 297, y: 197, chipWidth: 104 },
  { id: 'switzerland', name: 'Szwajcaria', flag: '🇨🇭', x: 236, y: 195, chipWidth: 124 },
  { id: 'slovenia', name: 'Słowenia', flag: '🇸🇮', x: 330, y: 215, chipWidth: 112 },
  { id: 'germany', name: 'Niemcy', flag: '🇩🇪', x: 271, y: 130, chipWidth: 102 },
  { id: 'italy', name: 'Włochy', flag: '🇮🇹', x: 271, y: 252, chipWidth: 98 },
  { id: 'france', name: 'Francja', flag: '🇫🇷', x: 200, y: 176, chipWidth: 108 },
  { id: 'spain', name: 'Hiszpania', flag: '🇪🇸', x: 131, y: 236, chipWidth: 114 },
  { id: 'norway', name: 'Norwegia', flag: '🇳🇴', x: 240, y: 72, chipWidth: 116 },
]

const tatryMarkerPosition = { x: 332, y: 154 }


const TatryMapBase = () => (
  <div className="tatryBaseMap" aria-hidden="true">
    <img src={tatryHillshadeDark} alt="" className="tatryBaseMapImage" />
  </div>
)

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
  const [hoveredContinent, setHoveredContinent] = useState(null)
  const continents = travelAtlasData.continents
  const continentMetaByShapeId = new Map(continentMeta.map((item) => [item.shapeId, item]))
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

  const isWorldView = activeId === 'world'
  const hoveredContinentMeta = isWorldView ? continentMeta.find((item) => item.id === hoveredContinent) || null : null
  const worldPanel = hoveredContinentMeta
    ? {
      name: hoveredContinentMeta.label,
      description: hoveredContinentMeta.description,
      typeLabel: 'Kontynent',
      tags: hoveredContinentMeta.panelTags,
      isEurope: hoveredContinentMeta.id === 'europe',
      status: hoveredContinentMeta.status,
      typeLabel: hoveredContinentMeta.type,
    }
    : {
      name: 'Europa',
      description: continentMetaByShapeId.get('europe')?.description,
      typeLabel: continentMetaByShapeId.get('europe')?.type,
      tags: continentMetaByShapeId.get('europe')?.panelTags,
      isEurope: true,
      status: 'active',
    }
  const tags = isWorldView
    ? ['Europa aktywna', 'kolejne regiony w planach', 'galerie wkrótce']
    : [activeNode.visited ? 'odwiedzone' : 'w planach', activeFilm ? 'film' : null, activeNode.gallery?.length ? 'galeria' : 'galeria wkrótce'].filter(Boolean)
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
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive atlasWorldSvg">
              <defs>
                <radialGradient id="worldEuropeGlow" cx="52%" cy="42%" r="30%">
                  <stop offset="0%" stopColor="rgba(245,225,188,.24)" />
                  <stop offset="100%" stopColor="rgba(245,225,188,0)" />
                </radialGradient>
                <radialGradient id="worldBoardGlow" cx="50%" cy="44%" r="60%">
                  <stop offset="0%" stopColor="rgba(245,223,183,.08)" />
                  <stop offset="100%" stopColor="rgba(245,223,183,0)" />
                </radialGradient>
              </defs>
              <path d="M38 178h484" className="atlasLatLine" />
              <g className="worldBase" aria-hidden="true">
                {worldAtlasBaseAsset ? (
                  <>
                    <image href={worldAtlasBaseAsset} x="10" y="10" width="540" height="340" preserveAspectRatio="xMidYMid slice" className="worldBaseImage" />
                    <rect x="10" y="10" width="540" height="340" rx="18" className="worldBaseFrame" />
                  </>
                ) : (
                  <>
                    <rect x="10" y="10" width="540" height="340" rx="18" className="worldBoardFrame" />
                    <rect x="18" y="18" width="524" height="324" rx="14" className="worldBoardInset" />
                    <ellipse cx="282" cy="178" rx="228" ry="126" className="worldBoardAtmosphere" />
                    <path d="M38 98h484M38 258h484M72 54v252M190 42v272M290 34v286M390 42v272M488 54v252" className="worldContourLines" />
                    <rect x="10" y="10" width="540" height="340" rx="18" className="worldPlaceholderSvg" />
                  </>
                )}
              </g>
              <g className="continentOverlays">
              {worldShapes.map((shape) => {
                const meta = continentMetaByShapeId.get(shape.id)
                const continent = continents.find((c) => c.id === meta?.routePath?.[1])
                const isEurope = meta?.id === 'europe'
                const isHovered = hoveredContinent === meta?.id
                return <path key={shape.id} d={shape.d} className={`atlasOutline continentOverlay ${continent?.visited ? 'isVisited' : 'isMuted'} ${isEurope ? 'isAtlasActive' : ''} ${isHovered ? 'isHovered' : ''}`} onMouseEnter={() => meta && setHoveredContinent(meta.id)} onMouseLeave={() => setHoveredContinent(null)} onFocus={() => meta && setHoveredContinent(meta.id)} onBlur={() => setHoveredContinent(null)} onClick={() => meta?.status === 'active' && continent && setAtlasPath((prev) => [...prev, continent.id])} />
              })}
              </g>
              <circle cx="286" cy="104" r="2.35" className={`atlasEuropePulseDot ${hoveredContinent && hoveredContinent !== 'europe' ? 'isSubdued' : ''}`} />
              <g className="continentMarkers">
              {continentMeta.map((region) => (
                <g key={region.id} className={`continentMarkerChip ${region.id === 'europe' ? 'isActive' : ''} ${hoveredContinent === region.id ? 'isHovered' : ''}`}>
                  <circle cx={region.position.x - 8} cy={region.position.y - 4} r={region.id === 'europe' ? 2.6 : 2.1} className="continentMarkerDot" />
                  <text data-id={region.shapeId} x={region.position.x} y={region.position.y} className={`atlasWorldLabel continentMarker ${region.id === 'europe' ? 'isActive' : ''} ${hoveredContinent === region.id ? 'isHovered' : ''}`}>
                    {region.label}
                  </text>
                </g>
              ))}
              </g>
            </svg>
          )}

          {activeId === 'europe' && (
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive atlasWorldSvg">
              <defs>
                <linearGradient id="europeMassFill" x1="96" y1="38" x2="470" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(149,119,81,.38)" />
                  <stop offset="46%" stopColor="rgba(86,68,48,.28)" />
                  <stop offset="100%" stopColor="rgba(38,30,21,.16)" />
                </linearGradient>
                <radialGradient id="europeHighlight" cx="54%" cy="44%" r="68%">
                  <stop offset="0%" stopColor="rgba(242,221,181,.12)" />
                  <stop offset="100%" stopColor="rgba(242,221,181,0)" />
                </radialGradient>
              </defs>
              <rect x="22" y="20" width="516" height="318" rx="20" className="atlasEuropeFrame" />
              <path d="M88 76l24-10 34 2 26 20 18 22 22 6 22-10 18-22 24-18 26 2 20 18 26 8 24 18 20 0 22-16 20 6 12 16 18 8 14 20-4 16 12 18 22 8 18 22 4 24-16 24-26 14-34 2-26 10-26-4-18 8-14 16-22 2-22-10-18 6-10 18-18 10-32 4-26-8-18-20-22-6-16-14-24-6-20-18-24-8-12-22 4-30 14-20 16-22-8-24z" className="atlasEuropeMass" />
              <path d="M84 78l28-18 38 2 30 20 20 24 20 6 20-10 20-22 24-16 30 2 20 14 24 8 24 16 26 0 20-14 24 6 16 16 18 8 14 20-2 16 12 18 18 8 20 20 10 26-14 28-22 16-30 8-30 4-24 8-24 0-18 12-16 14-20 0-22-8-18 6-12 16-20 10-32 8-28-6-20-18-22-8-14-14-22-8-20-16-24-8-14-20 0-30 12-24 14-18-10-26z" className="atlasOutline isDimmed atlasEuropeSilhouette" />
              <path d="M121 97l14 8 20 20 32 6 20-6 20-20 20-8 18 16 22 10 24 2 20 14 26 6 18 16 20 0 16 10M106 142l22 10 30 2 26 10 30 0 24 8 28 2 26 8 26 2 26 14 30 4M96 190l30 8 32-2 30 10 32 4 28 10 30 8 30 0 24 10 28 2M138 232l26 2 24 10 26 0 22 10 22 8 28 2 22 10 28 2M258 90l10 18 2 24 16 18 20 12 20 4 22 10 16 20M338 86l12 16 8 20 18 12 18 12 12 18 18 8 12 20" className="atlasEuropeGuideLines" />
              <ellipse cx="286" cy="176" rx="168" ry="102" className="atlasEuropeHighlight" />
              {europeCountryMarkers.map((country) => {
                const data = atlasLookups.countries[country.id]
                const isTatryBorderCountry = country.id === 'poland' || country.id === 'slovakia'
                return (
                  <g key={country.id} className={`atlasCountryMarker ${isTatryBorderCountry ? 'isTatryBorderCountry' : ''}`}>
                    <circle cx={country.x - 9} cy={country.y - 2} r="3.2" className={`atlasCountryDot ${data?.visited ? 'isVisited' : 'isMuted'}`} />
                    <foreignObject x={country.x} y={country.y - 14} width={country.chipWidth || 104} height="26">
                      <button type="button" className="atlasCountryChip" onClick={() => data && setAtlasPath((prev) => [...prev, data.id])}>
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </button>
                    </foreignObject>
                  </g>
                )
              })}
              <g className="atlasTatryMarker" onClick={() => tatryRegion && setAtlasPath((prev) => [...prev, tatryRegion.id])} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && tatryRegion && setAtlasPath((prev) => [...prev, tatryRegion.id])}>
                <circle cx={tatryMarkerPosition.x} cy={tatryMarkerPosition.y} r="9" className="atlasTatryGlow" />
                <circle cx={tatryMarkerPosition.x} cy={tatryMarkerPosition.y} r="17" className="atlasTatryRing" />
                <path d={`M${tatryMarkerPosition.x - 8} ${tatryMarkerPosition.y + 6}l7-12 4 6 4-7 8 13z`} className="atlasTatryMountain" />
                <text x={tatryMarkerPosition.x} y={tatryMarkerPosition.y + 24} textAnchor="middle" className="atlasInlineLabel">
                  Tatry
                </text>
              </g>
            </svg>
          )}

          {activeId === 'tatry' && (
            <div className="summitLayer tatryLayer">
              <div className="tatryViewport">
              <div className="tatryScene">
              <TatryMapBase />
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
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive atlasWorldSvg">
              <path d="M264 44l50 12 46 56 12 58-18 88-44 52-54-20-22-72 10-84z" className="atlasOutline isVisited" />
            </svg>
          )}

          {activeId !== 'world' && activeId !== 'europe' && activeId !== 'tatry' && activeId !== 'africa' && <div className="atlasFallback">Wybierz kolejny poziom z panelu po prawej.</div>}
        </div>
      </div>

      <article className="mapCard isActiveRegion atlasDetailCard">
        <p className="atlasEyebrow">{isWorldView ? 'Atlas signature view' : 'Atlas entry'}</p>
        <p className="atlasLevelLabel">{levelNames[atlasLevel] || `Poziom ${atlasLevel}`}</p>
        <h3>{isWorldView && worldPanel ? worldPanel.name : activeNode.name}</h3>
        <p className="atlasLead">{isWorldView ? (worldPanel?.description || 'Wybierz kontynent, aby odkrywać wyprawy, regiony i szczyty.') : activeNode.description}</p>
        {isWorldView && <p className="atlasPointType">{worldPanel?.typeLabel || 'Świat'}</p>}
        {nodeType && <p className="atlasPointType">{typeLabelMap[nodeType] || 'Punkt atlasu'}</p>}
        <div className="atlasTagRow">{(worldPanel?.tags || tags).map((tag) => <span key={tag} className="atlasTag">{tag}</span>)}</div>
        {worldPanel?.isEurope && <p className="atlasMeta">Europa jest aktywnym kierunkiem i prowadzi do kolejnego poziomu atlasu.</p>}
        {activeNode.countryIds && <p className="atlasMeta">Kraje: {activeNode.countryIds.map((id) => atlasLookups.countries[id]?.name).filter(Boolean).join(', ')}</p>}
        {activeId === 'europe' && <p className="atlasMeta">Europa to kontynent wypraw — od Skandynawii i Alp po Bałkany i Tatry. Kraje są zaznaczone subtelnymi markerami flagowymi.</p>}
        {activeId === 'tatry' && <p className="atlasMeta">Tatry to region graniczny Polski i Słowacji — wspólna oś wypraw z przejściem do szczegółowego widoku szczytów.</p>}
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
