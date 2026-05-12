import React from 'react'
import { travelAtlasData } from '../data/travelData'
import '../mapStyles.css'

const worldShapes = [
  { id: 'north-america', d: 'M46 96l24-26 44-24 56-8 44 8 26 18 8 18-10 20-22 12-24 2-12 12-18 2-20-6-20 8-22-4-20-14-8-18 8-8z' },
  { id: 'south-america', d: 'M170 170l18 14 18 24 8 24-2 30-10 30-12 20-14 14-12-6 2-24-8-22 4-22 10-24 0-18z' },
  { id: 'europe', d: 'M268 86l14-12 24-6 24 8 14 14-2 14-16 10-18 0-10 8-16-4-12-12-2-10z' },
  { id: 'africa', d: 'M286 126l20 8 20 20 10 34-2 34-12 38-20 30-20 14-12-16-6-30 6-42 8-34 8-24z' },
  { id: 'asia', d: 'M322 86l44-16 66-2 60 12 40 20 18 26 2 24-14 22-26 14-24 2-12 10-22 2-40-8-20-14-16-20-8-26 8-20z' },
  { id: 'oceania', d: 'M454 246l20-8 24 4 20 14 6 14-8 16-22 10-24-4-16-14z' },
]

const europeCountries = [
  { id: 'germany', label: 'Niemcy', labelX: 240, labelY: 139, d: 'M214 110l28-10 24 8 8 16-6 20-18 18-24 0-16-14-2-20z' },
  { id: 'poland', label: 'Polska', labelX: 297, labelY: 132, d: 'M272 104l36-6 22 10 8 20-6 22-26 16-28-4-12-20 6-18z' },
  { id: 'slovakia', label: 'Słowacja', labelX: 300, labelY: 186, d: 'M278 172l34-4 18 8-2 12-34 8-18-8z' },
  { id: 'switzerland', label: 'Szwajcaria', labelX: 239, labelY: 188, d: 'M218 174l20-8 16 4 0 14-20 8-18-6z' },
  { id: 'austria', label: 'Austria', labelX: 271, labelY: 206, d: 'M246 186l38-6 28 8 0 14-26 10-34 0-14-12z' },
  { id: 'slovenia', label: 'Słowenia', labelX: 274, labelY: 228, d: 'M256 218l18-4 14 8-2 10-18 4-14-8z' },
]

const tatrySummitFallback = [
  { id: 'gerlach', name: 'Gerlach', mapPosition: { x: 70, y: 34 } },
  { id: 'lomnica', name: 'Łomnica', mapPosition: { x: 58, y: 39 } },
  { id: 'durny-szczyt', name: 'Durny', mapPosition: { x: 76, y: 47 } },
  { id: 'krywan', name: 'Krywań', mapPosition: { x: 46, y: 53 } },
  { id: 'koscielec', name: 'Kościelec', mapPosition: { x: 33, y: 58 } },
  { id: 'swinica', name: 'Świnica', mapPosition: { x: 23, y: 64 } },
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
  const tatrySummits = tatrySummitFallback.map((summit) => atlasLookups.summits[summit.id] || summit)
  const activeFilm = activeNode.filmId ? atlasLookups.films[activeNode.filmId] : null

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
            </svg>
          )}

          {activeId === 'europe' && (
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive">
              <path d="M172 68l96-28 70 2 70 18 48 42 2 52-18 56-44 46-72 34-90 2-66-32-40-52-4-54 22-36z" className="atlasOutline isDimmed" />
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
              <circle cx="298" cy="192" r="12" className="atlasTatryGlow" onClick={() => tatryRegion && setAtlasPath((prev) => [...prev, tatryRegion.id])} />
              <circle cx="298" cy="192" r="20" className="atlasTatryRing" />
              <text x="298" y="220" textAnchor="middle" className="atlasInlineLabel">
                Tatry
              </text>
            </svg>
          )}

          {activeId === 'tatry' && (
            <div className="summitLayer">
              <svg className="ridgeLine" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M2 74 L12 64 L22 56 L30 60 L38 48 L48 56 L57 40 L66 52 L74 36 L82 46 L92 38 L98 44" />
              </svg>
              {tatrySummits.map((summit) => (
                <button
                  key={summit.id}
                  type="button"
                  className={`summitPoint ${activeId === summit.id ? 'isActive' : ''}`}
                  style={{ left: `${summit.mapPosition?.x ?? 50}%`, top: `${summit.mapPosition?.y ?? 50}%` }}
                  onClick={() => summit.id in atlasLookups.summits && setAtlasPath((prev) => [...prev, summit.id])}
                >
                  <span className="dot" />
                  <span className="label">{summit.name}</span>
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
        <p>{activeNode.description}</p>
        <div className="atlasTagRow">{tags.map((tag) => <span key={tag} className="atlasTag">{tag}</span>)}</div>
        {activeNode.countryIds && <p className="atlasMeta">Kraje: {activeNode.countryIds.map((id) => atlasLookups.countries[id]?.name).filter(Boolean).join(', ')}</p>}
        {activeId === 'europe' && <p className="atlasMeta">Wyróżniony region: <strong>Tatry</strong>.</p>}
        {activeId === 'tatry' && <p className="atlasMeta">Każdy szczyt ma miejsce na galerię, film i krótki opis trasy.</p>}
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
