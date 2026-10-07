import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Search, ArrowUpRight } from 'lucide-react'
import { atlasContentNodes, atlasNodeById, getAtlasMaterials, hasAtlasMaterials, searchAtlasNodes } from '../data/atlasContent'
import { galleryCollectionCount } from '../data/galleryNavigation'
import { tatryLocations, tatryLocationById } from '../data/tatryAtlas'
import { TatryTerrainMap } from './TatryTerrainMap'
import '../tatryExplorer.css'

const nodes = atlasContentNodes.filter(node => node.parent === 'tatry').sort((a, b) => a.name.localeCompare(b.name, 'pl'))
const materialLabel = (id, year) => {
  const { films, galleries } = getAtlasMaterials(id, year)
  return [galleries.length && `${galleryCollectionCount(galleries)}`, films.length && `${films.length} ${films.length === 1 ? 'film' : 'filmy'}`].filter(Boolean).join(' · ') || 'Brak materiałów'
}

export function TatryExplorer({ selectedId, onSelect, onlyMaterials, setOnlyMaterials, onShowMaterials, year = 'all' }) {
  const [query, setQuery] = useState('')
  const [focusRequest, setFocusRequest] = useState(0)
  const mapRef = useRef(null)
  const currentNodes = useMemo(() => searchAtlasNodes(query, nodes).filter(node => (!onlyMaterials && year === 'all') || hasAtlasMaterials(node.id, year) || node.id === selectedId), [query, onlyMaterials, selectedId, year])
  const points = tatryLocations.filter(point => currentNodes.some(node => node.id === point.id))
  useEffect(() => { setQuery('') }, [selectedId])
  useEffect(() => {
    if (!focusRequest) return
    if (tatryLocationById[selectedId]) {
      mapRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
      mapRef.current?.querySelector('.cz-terrain-surface')?.focus({ preventScroll: true })
    } else onShowMaterials()
  }, [focusRequest])

  return <section className="cz-tatry" aria-label="Atlas Tatr" ref={mapRef}>
    <TatryTerrainMap points={points} selectedId={selectedId} onSelect={onSelect} focusRequest={focusRequest} />
    <div className="cz-tatry-hint"><span>Przeciągnij mapę · przybliż + / −<span className="cz-tatry-wheel-hint"> · Ctrl + kółko</span></span><span>N ↑</span></div>
    <div className="cz-tatry-selection">
      <div><small>{selectedId === 'tatry' ? `Miejsca z materiałami: ${nodes.filter(node => hasAtlasMaterials(node.id, year)).length}` : atlasNodeById[selectedId].kind === 'Przejście grani' ? 'Przejście grani' : 'Wybrane miejsce'}</small><strong>{selectedId === 'tatry' ? 'Szczyty i granie' : atlasNodeById[selectedId].name}</strong></div>
      <button type="button" className="cz-tatry-materials" onClick={onShowMaterials}>Materiały <ArrowUpRight size={15} aria-hidden="true" /></button>
    </div>
    <div className="cz-tatry-search-row">
      <div className="cz-atlas-search"><Search size={16} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Szukaj szczytu lub grani w Tatrach" placeholder="Szukaj szczytu lub grani…" /></div>
      <label className="cz-tatry-filter"><input type="checkbox" checked={onlyMaterials} onChange={event => setOnlyMaterials(event.target.checked)} />Z materiałami</label>
    </div>
    <div className="cz-tatry-places" role="group" aria-label="Miejsca w Tatrach">
      {currentNodes.map(node => <button type="button" key={node.id} aria-pressed={selectedId === node.id} onClick={() => { setQuery(''); setFocusRequest(current => current + 1); onSelect(node.id) }}>
        <span className={`cz-tatry-list-dot ${hasAtlasMaterials(node.id, year) ? 'has-materials' : ''}`} aria-hidden="true" />
        <span><strong>{node.name}</strong><small>{materialLabel(node.id, year)}</small></span><ArrowUpRight size={14} aria-hidden="true" />
      </button>)}
    </div>
    {!currentNodes.length && <p className="cz-atlas-empty-search" role="status">Brak wyników. Zmień nazwę lub wyłącz filtr „Z materiałami”.</p>}
    {atlasNodeById[selectedId].kind === 'Przejście grani' && <p className="cz-tatry-source">{atlasNodeById[selectedId].name}: przejście grani — materiały znajdziesz w panelu wyprawy.</p>}
  </section>
}
