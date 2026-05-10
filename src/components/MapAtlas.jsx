import React from 'react'
import { travelAtlasData } from '../data/travelData'
import '../mapStyles.css'

const worldShapes = [
  { id: 'north-america', d: 'M88 102l52-38 46 22 8 42-34 26-48-8-28-44z' },
  { id: 'south-america', d: 'M170 190l34 16 8 42-24 66-32 12-20-30 10-62z' },
  { id: 'europe', d: 'M280 96l32-10 32 10 14 22-10 18-44 6-30-12-8-20z' },
  { id: 'africa', d: 'M302 148l26-8 28 14 2 38-16 62-24 34-28-16 4-62z' },
  { id: 'asia', d: 'M358 96l76 8 50 36-16 44-56 20-58-28-10-34z' },
  { id: 'oceania', d: 'M454 262l34 10 14 24-22 16-34-10-8-22z' },
]
const europeCountries = [
  { id: 'germany', d: 'M214 118l28-8 22 10-4 24-26 10-24-12z' },
  { id: 'poland', d: 'M248 114l30-6 18 16-8 24-26 6-18-14z' },
  { id: 'slovakia', d: 'M250 156l34-4 16 8-8 14-34 8-14-10z' },
  { id: 'switzerland', d: 'M214 160l24-2 10 10-8 12-22 4-10-10z' },
  { id: 'austria', d: 'M238 170l42-8 16 10-10 14-42 8-12-10z' },
  { id: 'slovenia', d: 'M244 196l24-2 8 8-8 10-24 2-8-8z' },
]
const tatrySummitFallback = [
  { id: 'gerlach', name: 'Gerlach', mapPosition: { x: 68, y: 34 } },
  { id: 'lomnica', name: 'Łomnica', mapPosition: { x: 56, y: 40 } },
  { id: 'koscielec', name: 'Kościelec', mapPosition: { x: 36, y: 46 } },
  { id: 'durny-szczyt', name: 'Durny', mapPosition: { x: 70, y: 54 } },
  { id: 'krywan', name: 'Krywań', mapPosition: { x: 48, y: 60 } },
  { id: 'swinica', name: 'Świnica', mapPosition: { x: 26, y: 64 } },
]

export function MapAtlas({ atlasPath, setAtlasPath, activeNode, atlasLookups }) {
  const atlasLevel = atlasPath.length - 1
  const activeId = atlasPath[atlasPath.length - 1]
  const continents = travelAtlasData.continents
  const breadcrumb = atlasPath.map((id) => ({ id, name: id === 'world' ? 'Świat' : atlasLookups.continents[id]?.name || atlasLookups.countries[id]?.name || atlasLookups.specialRegions[id]?.name || atlasLookups.summits[id]?.name || id }))
  const countriesForContinent = travelAtlasData.countries.filter((country) => country.continentId === activeId)
  const tatryRegion = travelAtlasData.specialRegions.find((region) => region.id === 'tatry')
  const tatrySummits = tatrySummitFallback.map((summit) => atlasLookups.summits[summit.id] || summit)
  const activeFilm = activeNode.filmId ? atlasLookups.films[activeNode.filmId] : null
  const tags = [
    activeNode.visited ? 'visited' : 'planned',
    activeNode.type || (activeNode.altitude ? 'summit' : atlasLevel === 0 ? 'atlas' : 'region'),
    activeFilm ? 'film' : null,
    activeNode.gallery?.length ? 'gallery' : 'gallery soon',
  ].filter(Boolean)

  return <div className="atlasLayout cinematicAtlas"><div className={`atlasMapWrap atlasZoomLevel${atlasLevel}`}><div className="atlasToolbar"><div className="chips atlasCrumbs">{breadcrumb.map((item, i) => <span key={item.id}>{item.name}{i < breadcrumb.length - 1 ? ' / ' : ''}</span>)}</div>{atlasLevel > 0 && <button className="smallButton" type="button" onClick={() => setAtlasPath((prev) => prev.slice(0, -1))}>Wróć poziom wyżej</button>}</div><div className="atlasStage cinematicStage">{activeId === 'world' && <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive">{worldShapes.map((shape) => { const continent = continents.find((c) => c.id === shape.id); return <path key={shape.id} d={shape.d} className={`atlasOutline ${continent?.visited ? 'isVisited' : 'isMuted'}`} onClick={() => continent && setAtlasPath((prev) => [...prev, continent.id])} /> })}</svg>}{activeId === 'europe' && <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive"><path d="M182 72l96-20 90 24 42 56-30 78-66 28-88 10-86-36-24-58 24-50z" className="atlasOutline isDimmed" />{europeCountries.map((country) => { const data = atlasLookups.countries[country.id]; return <path key={country.id} d={country.d} className={`atlasOutline atlasCountry ${data?.visited ? 'isVisited' : 'isMuted'}`} onClick={() => data && setAtlasPath((prev) => [...prev, data.id])} /> })}<ellipse cx="274" cy="168" rx="42" ry="20" className="atlasTatryGlow" onClick={() => tatryRegion && setAtlasPath((prev) => [...prev, tatryRegion.id])} /></svg>}{activeId === 'tatry' && <div className="summitLayer"><svg className="ridgeLine" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M4 70 L15 54 L24 62 L35 48 L45 56 L56 41 L68 52 L78 39 L90 48 L96 42" /></svg>{tatrySummits.map((summit) => <button key={summit.id} type="button" className={`summitPoint ${activeId === summit.id ? 'isActive' : ''}`} style={{ left: `${summit.mapPosition?.x ?? 50}%`, top: `${summit.mapPosition?.y ?? 50}%` }} onClick={() => summit.id in atlasLookups.summits && setAtlasPath((prev) => [...prev, summit.id])}><span className="dot" /><span className="label">{summit.name}</span></button>)}</div>}{activeId === 'africa' && <svg viewBox="0 0 560 360" className="atlasSvg atlasSvgInteractive"><path d="M264 44l50 12 46 56 12 58-18 88-44 52-54-20-22-72 10-84z" className="atlasOutline isVisited" /></svg>}{activeId !== 'world' && activeId !== 'europe' && activeId !== 'tatry' && activeId !== 'africa' && <div className="atlasFallback">Wybierz kolejny poziom atlasu z panelu po prawej.</div>}</div></div><article className="mapCard isActiveRegion atlasDetailCard"><p className="atlasEyebrow">Poziom {atlasLevel}: {activeNode.name}</p><h3>{activeNode.name}</h3><p>{activeNode.description}</p><div className="atlasTagRow">{tags.map((tag) => <span key={tag} className="atlasTag">{tag}</span>)}</div>{activeNode.countryIds && <p className="atlasMeta">Kraje: {activeNode.countryIds.map((id) => atlasLookups.countries[id]?.name).filter(Boolean).join(', ')}</p>}{activeId === 'europe' && <p className="atlasMeta">Wyróżniony region: <strong>Tatry</strong>.</p>}{activeId === 'tatry' && <p className="atlasMeta">Każdy szczyt ma gotowe sloty pod: galerię, vlog, route, elevation i description.</p>}{atlasLevel === 1 && countriesForContinent.length > 0 && <p className="atlasMeta">Widoczne kraje: {countriesForContinent.map((country) => country.name).join(', ')}</p>}{activeFilm && <a className="smallButton atlasCta" href={activeFilm.url} target="_blank" rel="noreferrer">Obejrzyj film: {activeFilm.title}</a>}{!activeNode.gallery?.length && <p className="atlasSoon">Galeria wkrótce.</p>}</article></div>
}
