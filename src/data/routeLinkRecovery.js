import catalog from './routeCatalog.json' with { type: 'json' }
import { canonicalRouteId } from './routeAliases.js'
import { readRouteAtlas, routeAtlasHref } from './routeAtlas.js'
import { tripRoutes } from './tripRoutes.js'

// Explain rejected direct selections without silently changing the active filters.
export function routeLinkRecovery(search, outsideArea = false) {
  const raw = new URLSearchParams(search).get('trasa')
  if (!raw) return null
  const id = canonicalRouteId(raw)
  const row = catalog.find(route => route.id === id)
  const state = readRouteAtlas(search)
  const hrefFor = next => {
    const href = routeAtlasHref(next)
    const km = new URLSearchParams(search).get('km')
    return next.compare.length === 2 && /^\d+(\.\d{1,3})?$/.test(km || '') ? `${href}&km=${km}` : href
  }
  if (!row) return {
    message: 'Link wskazuje trasę, której nie ma w katalogu. Pozostałe filtry pozostają aktywne.',
    label: 'Usuń błędny wybór trasy',
    href: hrefFor(state),
  }
  if (state.selected && (!outsideArea || !state.area)) return null
  return {
    message: outsideArea && state.area ? `Trasa „${tripRoutes[id].title}” nie przecina wybranego obszaru mapy.` : `Trasa „${tripRoutes[id].title}” jest ukryta przez wybrane filtry.`,
    label: 'Otwórz tę trasę bez filtrów',
    href: `${hrefFor({ ...state, selected: id, region: 'all', distance: 'all', ascent: 'all', year: 'all', material: 'all', area: null })}#profil`,
  }
}
