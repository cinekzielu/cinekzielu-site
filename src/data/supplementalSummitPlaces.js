import auditedSummits from './auditedSummits.json' with { type: 'json' }

// Reuse the reviewed geographic points, never coordinates inferred from photographs.
export const supplementalSummitPlaces = auditedSummits.filter(p => !['slawkowski-szczyt', 'giewont'].includes(p.id)).map(p => ({
  id: p.id, name: p.name, altitude: `${p.altitude} m`, kind: 'Szczyt',
  parent: p.range === 'Tatry' ? 'tatry' : 'switzerland', view: p.range === 'Tatry' ? 'tatry' : 'terrain',
  lat: p.lat, lng: p.lng, source: p.source, sourceName: 'OpenStreetMap',
}))

// OSM node 26864983, checked 2026-10-20 via Nominatim (natural=peak).
export const turbaczLocation = { id: 'turbacz', lat: 49.5428239, lng: 20.1113839,
  source: 'https://www.openstreetmap.org/node/26864983', sourceName: 'OpenStreetMap' }
