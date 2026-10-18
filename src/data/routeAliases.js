// Old shared links and saved items resolve to the complete journey.
const aliases = {
  'toubkal-podejscie-2025': 'toubkal-2025',
  'toubkal-zejscie-2025': 'toubkal-2025',
  'kasprowy-2025': 'swinica-2025',
  'lodowy-lato-2026': 'baranie-rogi-lato-2026',
}
export const canonicalRouteId = id => Object.hasOwn(aliases, id) ? aliases[id] : id
