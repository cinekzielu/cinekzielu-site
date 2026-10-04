import React from 'react'
import { CollectionShell } from './CollectionShell'
import { MapAtlas } from './MapAtlas'

export function MapPage() {
  return <CollectionShell section="mapa" className="cz-map-page">
    <div className="cz-gallery-intro"><h1>Mapa wypraw</h1><span className="cz-gallery-count">Miejsca i materiały</span></div>
    <p className="cz-map-page-intro">Wybierz miejsce na mapie lub znajdź je na liście.</p>
    <MapAtlas standalone />
  </CollectionShell>
}
