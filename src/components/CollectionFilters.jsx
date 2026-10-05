import React, { useEffect, useMemo, useRef, useState } from 'react'
import { allCollectionFilters, collectionOptions, readCollectionFilters, collectionFilterSearch, filterCollections } from '../data/collectionFilters'
import '../collectionFilters.css'

export function useCollectionFilters(items) {
  const options = useMemo(() => collectionOptions(items), [items])
  const [filters, setFilters] = useState(() => readCollectionFilters(window.location.search, options))
  useEffect(() => {
    const sync = () => setFilters(readCollectionFilters(window.location.search, options))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [options])

  const update = next => {
    const search = collectionFilterSearch(next)
    if (search !== window.location.search) window.history.pushState({}, '', window.location.pathname + search)
    setFilters(next)
  }
  return { filters, options, update, matches: filterCollections(items, filters), total: items.length }
}

export function CollectionFilters({ view, emptyLabel }) {
  const allButton = useRef(null)
  const { filters, options, update, matches, total } = view
  const filtered = filters.place !== 'wszystkie' || filters.year !== 'wszystkie'
  const reset = () => { update(allCollectionFilters); allButton.current?.focus() }
  return <>
    <div className="cz-collection-filters">
      <div className="cz-collection-places" role="group" aria-label="Filtruj według miejsca">
        <button ref={allButton} type="button" aria-pressed={filters.place === 'wszystkie'} onClick={() => update({ ...filters, place: 'wszystkie' })}>Wszystkie</button>
        {options.places.map(place => <button type="button" key={place.id} aria-pressed={filters.place === place.id} onClick={() => update({ ...filters, place: place.id })}>{place.label}</button>)}
      </div>
      <label className="cz-collection-year">Rok
        <select aria-label="Rok wyprawy" value={filters.year} onChange={event => update({ ...filters, year: event.target.value })}>
          <option value="wszystkie">Wszystkie lata</option>
          {options.years.map(year => <option value={year} key={year}>{year}</option>)}
        </select>
      </label>
    </div>
    <div className="cz-collection-results">
      <span role="status" aria-live="polite" aria-atomic="true">{filtered ? `Wyniki: ${matches.length} z ${total}` : `Cała kolekcja · ${total}`}</span>
      {filtered && <button type="button" onClick={reset}>Wyczyść filtry</button>}
    </div>
    {!matches.length && <div className="cz-collection-empty"><h2>{emptyLabel}</h2><p>Zmień miejsce lub rok albo wyczyść filtry.</p></div>}
  </>
}
