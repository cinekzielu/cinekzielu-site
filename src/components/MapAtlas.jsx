import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { travelAtlasData } from '../data/travelData'
import { resolveTatryPointPosition } from '../data/atlasGeo'
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

const tatryContours = [
  { id: 'tatry-outer', d: 'M5 63 L9 57 L14 55 L18 50 L23 48 L29 43 L36 41 L43 37 L49 35 L56 33 L63 30 L70 28 L76 27 L82 24 L87 24 L91 26 L94 31 L93 36 L90 40 L85 43 L80 45 L75 49 L68 52 L60 55 L53 58 L44 62 L34 65 L25 68 L17 69 L10 68 Z' },
  { id: 'tatry-inner', d: 'M12 60 L18 56 L24 53 L30 48 L37 45 L44 41 L51 39 L58 36 L65 33 L72 31 L78 30 L83 30 L86 32 L84 36 L79 39 L73 42 L67 46 L59 49 L51 53 L42 56 L33 60 L24 63 L17 64 Z' },
]

const tatryGuideLines = [
  { id: 'main-ridge', d: 'M10 60 L16 57 L23 54 L30 50 L38 46 L46 42 L54 39 L62 35 L70 32 L78 30 L85 30' },
  { id: 'north-ridge', d: 'M13 55 L20 52 L28 48 L36 44 L45 40 L54 36 L63 33 L72 30 L80 28' },
  { id: 'south-ridge', d: 'M9 64 L17 63 L25 60 L34 57 L43 53 L52 50 L61 46 L70 43 L78 39 L86 35' },
  { id: 'cross-valley-west', d: 'M26 48 L23 55 L20 61' },
  { id: 'cross-valley-central', d: 'M47 41 L44 49 L41 56' },
  { id: 'cross-valley-east', d: 'M69 33 L66 40 L63 47' },
]

const tatryBorderPLSK = 'M11 58 L18 55 L26 51 L35 47 L44 43 L53 39 L62 36 L70 33 L78 31 L86 32'
const tatryTopoLines = [
  'M8 64 C18 59, 25 57, 35 52 C47 45, 61 42, 73 35 C79 31, 84 30, 89 31',
  'M9 67 C19 62, 31 59, 40 55 C51 49, 64 44, 75 38 C81 35, 86 34, 91 35',
  'M11 70 C23 66, 35 62, 45 58 C56 53, 67 47, 79 42 C86 39, 91 39, 94 41',
  'M14 73 C25 70, 37 67, 48 63 C61 58, 73 52, 84 47',
  'M18 76 C30 74, 42 71, 54 67 C65 63, 76 57, 87 53',
]


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


const TATRY_MIN_ZOOM = 1
const TATRY_MAX_ZOOM = 2.2
const TATRY_ZOOM_STEP = 0.2
const TATRY_WHEEL_STEP = 0.12

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const tatryLabelAliases = {
  'durny-szczyt': 'Durny',
  'lodowy-szczyt': 'Lodowy',
  'kiezmarski-szczyt': 'Kieżmarski',
  'baranie-rogi': 'Baranie Rogi',
}

const tatryTierWeight = {
  featured: 3,
  primary: 2,
  secondary: 1,
}

const getTatryCollisionLayout = (points) => {
  const anchorScaleX = 5.2
  const anchorScaleY = 4.6
  const variantOrder = [
    (base) => ({ x: base.x, y: base.y }),
    (base) => ({ x: base.x + 14, y: base.y - 8 }),
    (base) => ({ x: base.x - 14, y: base.y - 8 }),
    (base) => ({ x: base.x + 16, y: base.y + 10 }),
    (base) => ({ x: base.x - 18, y: base.y + 10 }),
    (base) => ({ x: base.x + 24, y: base.y }),
    (base) => ({ x: base.x - 24, y: base.y }),
    (base) => ({ x: base.x, y: base.y - 14 }),
    (base) => ({ x: base.x, y: base.y + 14 }),
  ]

  const labelBoxes = []
  const byPriority = [...points].sort((a, b) => (tatryTierWeight[b.tier] || 0) - (tatryTierWeight[a.tier] || 0))

  return byPriority.map((point) => {
    const fullName = point.name
    const shortName = tatryLabelAliases[point.id] || point.name
    const baseOffset = point.labelOffset || { x: 0, y: 0 }

    const pickVariant = (name) => {
      const textWidth = Math.max(52, Math.min(132, name.length * 6.3 + 24))
      const textHeight = 22
      let selected = variantOrder[0](baseOffset)
      let selectedCollisions = Number.POSITIVE_INFINITY
      let selectedDistance = Number.POSITIVE_INFINITY

      variantOrder.forEach((variant) => {
        const offset = variant(baseOffset)
        const centerX = (point.mapPosition?.x ?? 50) * anchorScaleX + offset.x + textWidth / 2
        const centerY = (point.mapPosition?.y ?? 50) * anchorScaleY + offset.y
        const candidate = {
          left: centerX - textWidth / 2,
          right: centerX + textWidth / 2,
          top: centerY - textHeight / 2,
          bottom: centerY + textHeight / 2,
        }

        const collisions = labelBoxes.reduce((count, box) => {
          const overlapX = candidate.left < box.right && candidate.right > box.left
          const overlapY = candidate.top < box.bottom && candidate.bottom > box.top
          return overlapX && overlapY ? count + 1 : count
        }, 0)

        const distance = Math.abs(offset.x - baseOffset.x) + Math.abs(offset.y - baseOffset.y)
        if (collisions < selectedCollisions || (collisions === selectedCollisions && distance < selectedDistance)) {
          selected = offset
          selectedCollisions = collisions
          selectedDistance = distance
        }
      })

      labelBoxes.push({
        left: (point.mapPosition?.x ?? 50) * anchorScaleX + selected.x,
        right: (point.mapPosition?.x ?? 50) * anchorScaleX + selected.x + textWidth,
        top: (point.mapPosition?.y ?? 50) * anchorScaleY + selected.y - textHeight / 2,
        bottom: (point.mapPosition?.y ?? 50) * anchorScaleY + selected.y + textHeight / 2,
      })

      return { offset: selected, collisions: selectedCollisions }
    }

    const full = pickVariant(fullName)
    const shouldCompact = full.collisions > 0 && shortName !== fullName
    const compact = shouldCompact ? pickVariant(shortName) : null
    const finalName = compact ? shortName : fullName
    const finalOffset = compact ? compact.offset : full.offset

    return {
      ...point,
      displayName: finalName,
      labelOffset: finalOffset,
      visualPriority: tatryTierWeight[point.tier] || 1,
    }
  }).sort((a, b) => a.visualPriority - b.visualPriority)
}

export function MapAtlas({ atlasPath, setAtlasPath, activeNode, atlasLookups }) {
  const atlasLevel = atlasPath.length - 1
  const activeId = atlasPath[atlasPath.length - 1]
  const stageRef = useRef(null)
  const [tatryZoom, setTatryZoom] = useState(TATRY_MIN_ZOOM)
  const [tatryPan, setTatryPan] = useState({ x: 0, y: 0 })
  const [isDraggingTatry, setIsDraggingTatry] = useState(false)
  const dragStateRef = useRef(null)
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
  const tatryPanLimits = useMemo(() => {
    const horizontal = Math.max(0, ((tatryZoom - 1) * 44) / tatryZoom)
    const vertical = Math.max(0, ((tatryZoom - 1) * 36) / tatryZoom)
    return { x: horizontal, y: vertical }
  }, [tatryZoom])

  const applyTatryPan = useCallback((nextPan) => {
    setTatryPan({
      x: clamp(nextPan.x, -tatryPanLimits.x, tatryPanLimits.x),
      y: clamp(nextPan.y, -tatryPanLimits.y, tatryPanLimits.y),
    })
  }, [tatryPanLimits.x, tatryPanLimits.y])

  const resetTatryViewport = useCallback(() => {
    setTatryZoom(TATRY_MIN_ZOOM)
    setTatryPan({ x: 0, y: 0 })
    setIsDraggingTatry(false)
    dragStateRef.current = null
  }, [])

  const updateTatryZoom = useCallback((nextZoom) => {
    const clampedZoom = clamp(nextZoom, TATRY_MIN_ZOOM, TATRY_MAX_ZOOM)
    setTatryZoom(clampedZoom)
    if (clampedZoom <= TATRY_MIN_ZOOM) {
      setTatryPan({ x: 0, y: 0 })
      return
    }
    setTatryPan((prev) => ({
      x: clamp(prev.x, -Math.max(0, ((clampedZoom - 1) * 44) / clampedZoom), Math.max(0, ((clampedZoom - 1) * 44) / clampedZoom)),
      y: clamp(prev.y, -Math.max(0, ((clampedZoom - 1) * 36) / clampedZoom), Math.max(0, ((clampedZoom - 1) * 36) / clampedZoom)),
    }))
  }, [])

  useEffect(() => {
    if (activeId !== 'tatry') {
      resetTatryViewport()
    }
  }, [activeId, resetTatryViewport])

  const tatryPointsWithLeaders = getTatryCollisionLayout(tatryPoints).map((point) => {
    const offsetX = point.labelOffset?.x ?? 0
    const offsetY = point.labelOffset?.y ?? 0
    const leaderLength = Math.hypot(offsetX, offsetY)
    return {
      ...point,
      hasLeader: leaderLength >= 13,
      leaderLength,
      leaderAngle: Math.atan2(offsetY, offsetX),
    }
  })

  const tatryTransformStyle = { transform: `translate(${tatryPan.x}%, ${tatryPan.y}%) scale(${tatryZoom})` }

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
              <div className="tatryControls" role="group" aria-label="Nawigacja Tatr">
                <button type="button" className="tatryControlButton" onClick={() => updateTatryZoom(tatryZoom + TATRY_ZOOM_STEP)} aria-label="Przybliż Tatry">+</button>
                <button type="button" className="tatryControlButton" onClick={() => updateTatryZoom(tatryZoom - TATRY_ZOOM_STEP)} aria-label="Oddal Tatry">−</button>
                <button type="button" className="tatryControlButton isReset" onClick={resetTatryViewport} disabled={tatryZoom === 1 && tatryPan.x === 0 && tatryPan.y === 0} aria-label="Resetuj widok Tatr">Reset</button>
              </div>
              <div
                className={`tatryViewport ${tatryZoom > 1 ? 'isZoomed' : ''} ${isDraggingTatry ? 'isDragging' : ''}`}
                onWheel={(event) => {
                  event.preventDefault()
                  const delta = event.deltaY > 0 ? -TATRY_WHEEL_STEP : TATRY_WHEEL_STEP
                  updateTatryZoom(tatryZoom + delta)
                }}
                onPointerDown={(event) => {
                  if (tatryZoom <= 1) return
                  dragStateRef.current = { x: event.clientX, y: event.clientY, panX: tatryPan.x, panY: tatryPan.y }
                  setIsDraggingTatry(true)
                  event.currentTarget.setPointerCapture(event.pointerId)
                }}
                onPointerMove={(event) => {
                  if (!dragStateRef.current || tatryZoom <= 1) return
                  const stageRect = stageRef.current?.getBoundingClientRect()
                  if (!stageRect) return
                  const deltaX = ((event.clientX - dragStateRef.current.x) / stageRect.width) * 100
                  const deltaY = ((event.clientY - dragStateRef.current.y) / stageRect.height) * 100
                  applyTatryPan({ x: dragStateRef.current.panX + deltaX, y: dragStateRef.current.panY + deltaY })
                }}
                onPointerUp={() => {
                  dragStateRef.current = null
                  setIsDraggingTatry(false)
                }}
                onPointerCancel={() => {
                  dragStateRef.current = null
                  setIsDraggingTatry(false)
                }}
              >
              <div className="tatryScene" style={tatryTransformStyle}>
              <svg className="tatryStructure" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {tatryContours.map((shape) => (
                  <path key={shape.id} d={shape.d} className={`tatryContour ${shape.id === 'tatry-outer' ? 'isOuter' : 'isInner'}`} />
                ))}
                {tatryGuideLines.map((line) => (
                  <path key={line.id} d={line.d} className="tatryGuideLine" />
                ))}
                <path d={tatryBorderPLSK} className="tatryBorder" />
                {tatryTopoLines.map((line, index) => <path key={line} d={line} className={`tatryTopoLine tatryTopoLine${index + 1}`} />)}
                <text x="91" y="38" className="tatryBorderLabel" textAnchor="end">PL</text>
                <text x="90" y="46" className="tatryBorderLabel isSouth" textAnchor="end">SK</text>
              </svg>
              {tatryPointsWithLeaders.map((summit) => (
                <button
                  key={summit.id}
                  type="button"
                  className={`summitPoint summitTier${summit.tier || 'secondary'} pointType${summit.pointType || summit.atlasType || summit.type || 'place'} ${activeId === summit.id ? 'isActive' : ''}`}
                  style={{ left: `${summit.mapPosition?.x ?? 50}%`, top: `${summit.mapPosition?.y ?? 50}%` }}
                  onClick={() => summit.id in atlasLookups.summits && setAtlasPath((prev) => [...prev, summit.id])}
                >
                  <span className="dot" />
                  {summit.hasLeader && <span className="leader" style={{ '--leader-length': `${Math.max(8, summit.leaderLength - 6)}px`, '--leader-angle': `${summit.leaderAngle}rad` }} />}
                  <span className="label" style={{ transform: `translate(${summit.labelOffset?.x ?? 0}px, ${summit.labelOffset?.y ?? 0}px)` }}>{summit.displayName || summit.name}</span>
                </button>
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
        {activeId === 'tatry' && <p className="atlasMeta">Widok Tatr został dopracowany do spokojniejszej, atlasowej kompozycji top-down: czytelniejsze etykiety, subtelniejsze markery i dyskretna granica PL–SK wspierają orientację bez technicznego szumu.</p>}
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
