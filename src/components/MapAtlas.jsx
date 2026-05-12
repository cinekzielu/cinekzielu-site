import React from 'react'
import { travelAtlasData } from '../data/travelData'
import '../mapStyles.css'

const worldShapes = [
  { id: 'north-america', d: 'M56 94l34-28 54-12 60 22 18 34-18 28-42 16-36-10-16 10-32-10-24-34 2-16z' },
  { id: 'south-america', d: 'M182 186l30 10 22 38-10 50-24 42-30 20-22-12 8-44-14-28 10-38z' },
  { id: 'europe', d: 'M258 84l36-12 44 6 30 18 8 20-16 16-38 8-34-6-22-14-12-20z' },
  { id: 'africa', d: 'M288 144l30-8 34 16 20 34-8 52-24 54-34 20-26-14-8-58 16-54z' },
  { id: 'asia', d: 'M354 78l66-4 76 20 44 42-8 42-42 34-78 10-52-20-22-42 12-44z' },
  { id: 'oceania', d: 'M448 250l34-2 34 16 16 24-18 22-34 4-28-16-12-26z' },
]

const europeCountries = [
  { id: 'germany', d: 'M214 124l26-10 24 10 2 24-22 14-26-8-10-16z' },
  { id: 'poland', d: 'M252 118l34-8 24 14-6 26-30 10-24-12-2-18z' },
  { id: 'slovakia', d: 'M252 164l34-6 20 10-6 16-34 8-18-10z' },
  { id: 'switzerland', d: 'M214 168l24-4 14 10-8 14-24 4-12-8z' },
  { id: 'austria', d: 'M238 180l42-10 24 10-10 16-42 10-18-10z' },
  { id: 'slovenia', d: 'M246 208l24-2 10 10-8 10-26 2-8-10z' },
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

  const tags = [
    activeNode.visited ? 'odwiedzone' : 'w planach',
    activeNode.type || (activeNode.altitude ? 'szczyt' : atlasLevel === 0 ? 'atlas' : 'region'),
    activeFilm ? 'film' : null,
    activeNode.gallery?.length ? 'galeria' : 'galeria wkrótce',
  ].filter(Boolean)

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
              {worldShapes.map((shape) => {
                const continent = continents.find((c) => c.id === shape.id)
                return <path key={shape.id} d={shape.d} className={`atlasOutline ${continent?.visited ? 'isVisited' : 'isMuted'}`} onClick={() => continent && setAtlasPath((prev) => [...prev, continent.id])} />
              })}
            </svg>
          )}

          {activeId === 'europe' && (
            <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive">
              <path d="M170 66l102-26 106 18 56 52-10 96-78 52-112 12-94-36-36-70 16-68z" className="atlasOutline isDimmed" />
              {europeCountries.map((country) => {
                const data = atlasLookups.countries[country.id]
                return <path key={country.id} d={country.d} className={`atlasOutline atlasCountry ${data?.visited ? 'isVisited' : 'isMuted'}`} onClick={() => data && setAtlasPath((prev) => [...prev, data.id])} />
              })}
              <ellipse cx="278" cy="178" rx="48" ry="22" className="atlasTatryGlow" onClick={() => tatryRegion && setAtlasPath((prev) => [...prev, tatryRegion.id])} />
              <text x="278" y="182" textAnchor="middle" className="atlasInlineLabel">
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
