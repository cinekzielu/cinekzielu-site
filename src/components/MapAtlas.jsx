import React from 'react'
import { travelAtlasData } from '../data/travelData'
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

const tatryAxes = [
  { id: 'core-ridge', d: 'M12 62 L22 58 L34 54 L46 50 L59 46 L72 41 L86 35' },
  { id: 'western-arm', d: 'M18 66 L26 62 L34 58 L43 54' },
  { id: 'high-tatras', d: 'M45 52 L56 47 L68 42 L79 37' },
  { id: 'belianske-arm', d: 'M73 40 L82 43 L90 46' },
]

const tatryRegions = [
  { id: 'western-tatras', label: 'Tatry Zachodnie', x: 29, y: 66, width: 24, height: 11 },
  { id: 'high-tatras-region', label: 'Tatry Wysokie', x: 62, y: 50, width: 30, height: 12 },
  { id: 'belianske-tatras', label: 'Tatry Bielskie', x: 84, y: 52, width: 18, height: 9 },
]

const tatryPointLayout = [
  { id: 'swinica', name: 'Świnica', mapPosition: { x: 22, y: 61 }, labelOffset: { x: -8, y: 2 }, zone: 'western-tatras', tier: 'primary', pointType: 'summit' },
  { id: 'koscielec', name: 'Kościelec', mapPosition: { x: 35, y: 56 }, labelOffset: { x: -10, y: -2 }, zone: 'western-tatras', tier: 'secondary', pointType: 'summit' },
  { id: 'krywan', name: 'Krywań', mapPosition: { x: 49, y: 50 }, labelOffset: { x: -5, y: -8 }, zone: 'high-tatras-region', tier: 'primary', pointType: 'summit' },
  { id: 'lomnica', name: 'Łomnica', mapPosition: { x: 63, y: 44 }, labelOffset: { x: 4, y: -8 }, zone: 'high-tatras-region', tier: 'primary', pointType: 'summit' },
  { id: 'gerlach', name: 'Gerlach', mapPosition: { x: 71, y: 39 }, labelOffset: { x: 4, y: -8 }, zone: 'high-tatras-region', tier: 'featured', pointType: 'summit' },
  { id: 'durny-szczyt', name: 'Durny', mapPosition: { x: 82, y: 44 }, labelOffset: { x: 5, y: 4 }, zone: 'belianske-tatras', tier: 'secondary', pointType: 'summit' },
]

const levelNames = ['Świat', 'Kontynent', 'Kraj', 'Region specjalny', 'Szczyt']

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
  const tatryPoints = tatryPointLayout.map((point) => ({ ...point, ...(atlasLookups.summits[point.id] || atlasLookups.places[point.id] || {}) }))
  const activeFilm = activeNode.filmId ? atlasLookups.films[activeNode.filmId] : null
  const nodeType = activeNode.atlasType || activeNode.type || null
  const typeLabelMap = { summit: 'Szczyt', trail: 'Szlak / przejście', viewpoint: 'Punkt widokowy', place: 'Miejsce', city: 'Miasto', hut: 'Schronisko', region: 'Region', country: 'Kraj', continent: 'Kontynent' }

  const tags = [activeNode.visited ? 'odwiedzone' : 'w planach', activeFilm ? 'film' : null, activeNode.gallery?.length ? 'galeria' : 'galeria wkrótce'].filter(Boolean)

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
                {tatryRegions.map((region) => (
                  <ellipse key={region.id} cx={region.x} cy={region.y} rx={region.width / 2} ry={region.height / 2} className="tatryZone" />
                ))}
                {tatryAxes.map((axis) => (
                  <path key={axis.id} d={axis.d} className="tatryAxis" />
                ))}
              </svg>
              {tatryRegions.map((region) => (
                <p key={region.id} className="tatryZoneLabel" style={{ left: `${region.x}%`, top: `${region.y + region.height * 0.8}%` }}>
                  {region.label}
                </p>
              ))}
              {tatryPoints.map((summit) => (
                <button
                  key={summit.id}
                  type="button"
                  className={`summitPoint summitTier${summit.tier || 'secondary'} pointType${summit.pointType || summit.atlasType || summit.type || 'place'} ${activeId === summit.id ? 'isActive' : ''}`}
                  style={{ left: `${summit.mapPosition?.x ?? 50}%`, top: `${summit.mapPosition?.y ?? 50}%` }}
                  onClick={() => summit.id in atlasLookups.summits && setAtlasPath((prev) => [...prev, summit.id])}
                >
                  <span className="dot" />
                  <span className="label" style={{ transform: `translate(${summit.labelOffset?.x ?? 0}px, ${summit.labelOffset?.y ?? 0}px)` }}>{summit.name}</span>
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
        {activeId === 'tatry' && <p className="atlasMeta">Układ pasma pokazuje osie Tatr i strefy pod dalsze dokładanie szczytów, galerii i opisów tras.</p>}
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
