import React from 'react'
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
  { id: 'tatry-outer', d: 'M7 67 L11 60 L18 55 L27 51 L38 47 L49 43 L58 40 L67 36 L76 33 L84 31 L91 33 L95 38 L94 45 L88 52 L80 58 L70 63 L59 67 L46 71 L35 74 L23 76 L12 74 Z' },
  { id: 'tatry-inner', d: 'M14 64 L21 58 L31 53 L42 49 L53 45 L63 42 L72 39 L80 36 L87 36 L89 40 L84 46 L76 51 L66 56 L55 60 L43 64 L32 67 L22 69 Z' },
]

const tatryGuideLines = [
  { id: 'spine-nw-se', d: 'M13 63 L26 55 L41 48 L56 42 L72 36 L86 34' },
  { id: 'southern-belt', d: 'M11 70 L24 67 L37 64 L50 61 L64 57 L78 52 L88 47' },
  { id: 'northern-edge', d: 'M17 59 L31 52 L47 46 L62 40 L77 35 L89 34' },
]

const tatryBorderPLSK = 'M12 60 L25 55 L40 49 L55 44 L69 39 L82 36 L92 37'


const levelNames = ['Świat', 'Kontynent', 'Kraj', 'Region specjalny', 'Szczyt']

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
  const continents = travelAtlasData.continents
  const getNodeName = (id) =>
    id === 'world'
      ? 'Świat'
      : atlasLookups.continents[id]?.name || atlasLookups.countries[id]?.name || atlasLookups.specialRegions[id]?.name || atlasLookups.summits[id]?.name || atlasLookups.places[id]?.name || id

  const breadcrumb = atlasPath.map((id) => ({ id, name: getNodeName(id) }))
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
    return {
      ...point,
      hasLeader: leaderLength >= 13,
      leaderLength,
      leaderAngle: Math.atan2(offsetY, offsetX),
    }
  })

  return (
    <div className="atlasLayout cinematicAtlas">
      <div className={`atlasMapWrap atlasZoomLevel${atlasLevel}`}>
        <div className="atlasToolbar">
          <div className="atlasCrumbTrail" aria-label="Nawigacja atlasu">
            {breadcrumb.map((item, i) => (
              <button key={item.id} className={`atlasCrumb ${i === breadcrumb.length - 1 ? 'isCurrent' : ''}`} type="button" onClick={() => setAtlasPath((prev) => prev.slice(0, i + 1))}>
                <span className="atlasCrumbLevel">{levelNames[i] || `Poziom ${i}`}</span>
                <span className="atlasCrumbName">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="atlasStage cinematicStage">
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
              <svg className="tatryStructure" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {tatryContours.map((shape) => (
                  <path key={shape.id} d={shape.d} className={`tatryContour ${shape.id === 'tatry-outer' ? 'isOuter' : 'isInner'}`} />
                ))}
                {tatryGuideLines.map((line) => (
                  <path key={line.id} d={line.d} className="tatryGuideLine" />
                ))}
                <path d={tatryBorderPLSK} className="tatryBorder" />
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
