import React from 'react'
import { travelAtlasData } from '../data/travelData'
import '../mapStyles.css'

const worldShapes = [
  { id: 'north-america', d: 'M62 98l30-30 42-14 52-6 40 14 20 24-4 22-24 20-34 6-26-8-24 12-36-6-22-18 4-16z' },
  { id: 'south-america', d: 'M176 170l18 10 16 20 10 28-2 34-10 30-18 28-20 16-14-10 4-24-8-30 6-28 8-24z' },
  { id: 'europe', d: 'M266 88l22-12 24-2 22 10 12 16-4 14-20 12-30 4-24-8-12-16z' },
  { id: 'africa', d: 'M278 132l24 2 24 16 14 30-2 38-14 42-24 32-20 10-14-16-6-42 8-44 10-32z' },
  { id: 'asia', d: 'M328 88l44-14 66 0 56 14 36 24 14 24-2 24-24 24-42 14-58 2-38-10-24-18-14-26 10-32z' },
  { id: 'oceania', d: 'M448 248l22-6 24 8 22 18-8 22-28 10-24-8-16-18z' },
]

const europeCountries = [
  { id: 'germany', d: 'M226 124l30-12 22 12 0 28-22 16-28-8-10-18z' },
  { id: 'poland', d: 'M280 120l38-8 22 14-4 30-34 12-24-10-4-20z' },
  { id: 'slovakia', d: 'M286 170l30-6 16 10-4 14-28 8-18-8z' },
  { id: 'switzerland', d: 'M236 178l18-6 14 8-6 12-20 6-12-8z' },
  { id: 'austria', d: 'M264 182l34-8 26 10-8 14-36 10-20-10z' },
  { id: 'slovenia', d: 'M268 210l18-4 12 8-4 10-20 4-10-8z' },
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
              <path d="M178 64l86-22 74 4 62 20 42 42-4 62-26 52-54 34-68 26-84-4-58-32-34-46-2-62 18-46z" className="atlasOutline isDimmed" />
              {europeCountries.map((country) => {
                const data = atlasLookups.countries[country.id]
                return <path key={country.id} d={country.d} className={`atlasOutline atlasCountry ${data?.visited ? 'isVisited' : 'isMuted'}`} onClick={() => data && setAtlasPath((prev) => [...prev, data.id])} />
              })}
              <circle cx="300" cy="195" r="13" className="atlasTatryGlow" onClick={() => tatryRegion && setAtlasPath((prev) => [...prev, tatryRegion.id])} />
              <text x="300" y="220" textAnchor="middle" className="atlasInlineLabel">
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
