import React from 'react'
import '../atlasEmptyResults.css'

// Keep recovery next to the empty list. Changing the year uses the atlas's
// existing selection handler; the material toggle cannot remove a year filter.
export function AtlasEmptyResults({ query, year, onlyMaterials, onClearQuery, onAllYears, onAllPlaces }) {
  const searching = Boolean(query.trim())
  return <div className="cz-atlas-empty-search">
    <p role="status">{searching ? 'Brak miejsc pasujących do wpisanej nazwy i wybranych filtrów.' : year !== 'all' ? 'Brak oznaczonych miejsc dla tego roku.' : 'Brak miejsc dla wybranych filtrów.'}</p>
    <div className="cz-atlas-empty-actions">
      {searching && <button type="button" onClick={onClearQuery}>Wyczyść wyszukiwanie</button>}
      {year !== 'all' && <button type="button" onClick={onAllYears}>Pokaż wszystkie lata</button>}
      {onlyMaterials && year === 'all' && <button type="button" onClick={onAllPlaces}>Pokaż także miejsca bez materiałów</button>}
    </div>
  </div>
}
