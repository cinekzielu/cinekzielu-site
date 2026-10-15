// Author-selected future goals. Never an ascent register or a planned itinerary.
export const plannedSummits = [{
  id: 'matterhorn', name: 'Matterhorn', kind: 'Szczyt', status: 'planned', visited: false,
  altitude: '4478 m', elevation: 4478, range: 'Alpy', countryLabel: 'Szwajcaria · Włochy',
  parent: 'switzerland', countryIds: ['switzerland', 'italy'], view: 'terrain', icon: 'planned',
  lat: 45.97641372680664, lng: 7.658612251281738,
  description: 'Cel na przyszłość. Termin jeszcze nieustalony.',
  coordinateSource: 'https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=Matterhorn&type=locations&origins=gazetteer&limit=5',
  coordinateRecord: 149915,
  altitudeSource: 'https://www.sac-cas.ch/en/huts-and-tours/sac-route-portal/matterhorn-1138/alpinism/',
}]
export const isPlannedSummit = id => plannedSummits.some(peak => peak.id === id)
// Keep goals outside year-specific trip views, but visible alongside materials
// in the all-years atlas. They never qualify as published trip material.
export const showPlannedSummit = (id, year = 'all') => year === 'all' && isPlannedSummit(id)
