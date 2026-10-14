import React from 'react'
import { useInitialLocation } from '../PageLocation'
import { atlasNodeById, getAtlasMaterials } from '../data/atlasContent'
import { sharedAtlasIds, atlasSharePath } from '../data/sharePages'
import { galleryHref, galleryLinkLabel } from '../data/galleryNavigation'
import { CollectionShell } from './CollectionShell'
import '../atlasOverview.css'

export function AtlasOverview() {
  const { search } = useInitialLocation()
  const requested = new URLSearchParams(search).get('atlas') || 'world'
  const id = sharedAtlasIds.includes(requested) ? requested : 'world'
  const place = atlasNodeById[id]
  const materials = getAtlasMaterials(id)
  const destinations = (id === 'world' ? ['europe', 'africa', 'tatry', 'alpy'] : sharedAtlasIds.filter(key => atlasNodeById[key].parent === id)).map(key => atlasNodeById[key]).filter(Boolean)
  return <div className="cz-atlas-overview">
    <p className="cz-atlas-overview-label">Atlas · {place.name}</p>
    <p>{place.description || 'Miejsca, fotografie i filmy z podróży.'}</p>
    {destinations.length > 0 && <nav aria-label="Obszary atlasu">{destinations.map(node => <a key={node.id} href={atlasSharePath(node.id)}>{node.name} ↗</a>)}</nav>}
    {materials.galleries.length > 0 && <div><h3>Wyprawy</h3><ul>{materials.galleries.slice(0, 3).map(gallery => <li key={gallery.id}><a href={`/wyprawy/${gallery.id}`}>{gallery.title} {gallery.year}</a> · <a href={galleryHref(gallery)}>{galleryLinkLabel(gallery)}</a></li>)}</ul><a href="/wyprawy">Wszystkie wyprawy ↗</a></div>}
    <p className="cz-atlas-overview-note">Interaktywna mapa wymaga JavaScript. Materiały możesz otworzyć przez powyższe linki.</p>
  </div>
}

export function MapPageOverview() {
  return <CollectionShell section="mapa" className="cz-map-page"><div className="cz-gallery-intro"><h1>Mapa wypraw</h1><span className="cz-gallery-count">Miejsca i materiały</span></div><p className="cz-map-page-intro">Wybierz miejsce na mapie lub znajdź je na liście.</p><AtlasOverview /></CollectionShell>
}
