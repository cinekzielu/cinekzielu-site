import { alpsStory, alpsStoryHash } from './alpsStory.js'

// Author-confirmed visits (August 2026); coordinates and activity facts are
// shared with the published story. These points do not describe a GPS route.
const countryByPeak = {
  triglav: 'slovenia', grossglockner: 'austria', dufourspitze: 'switzerland',
  grauspitz: 'liechtenstein', zugspitze: 'germany',
}
export const alpsCountryIds = [...new Set(Object.values(countryByPeak))]
export const alpsPlaces = alpsStory.map(chapter => ({
  id: chapter.id, name: chapter.title, kind: 'Szczyt', view: 'terrain',
  parent: countryByPeak[chapter.id], altitude: `${chapter.altitude} m`,
  lat: chapter.lat, lng: chapter.lng, icon: 'mountain', related: ['alpy'],
  coordinateSource: `https://www.openstreetmap.org/node/${chapter.osmNode}`,
  description: `${chapter.country} · Across the Alps 2026. ${chapter.id === 'grauspitz' ? 'Vorder Grauspitz.' : 'Szczyt zdobyty podczas sierpniowej wyprawy.'}`,
  visit: {
    year: '2026', expeditionId: 'alpy-2026', number: chapter.number,
    distance: chapter.distance, ascent: chapter.ascent, movingTime: chapter.movingTime,
    note: chapter.statsNote || 'Dane z aktywności podczas tego etapu wyprawy.',
    href: `/wyprawy/alpy-2026${alpsStoryHash(chapter)}`,
  },
}))
