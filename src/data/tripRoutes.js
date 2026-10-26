import { alpsStory, alpsLocationById } from './alpsStory.js'
import { tatryLocationById } from './tatryAtlas.js'
import { summits } from './summits.js'
import importedRoutes from './importedRoutes.json' with { type: 'json' }
import { loadRouteTrack } from './routeTrackLoader.js'

const dates = { triglav: '18 sierpnia 2026', grossglockner: '19 sierpnia 2026', dufourspitze: '22–24 sierpnia 2026', grauspitz: '26 sierpnia 2026', zugspitze: '28 sierpnia 2026' }
export const tripRoutes = Object.fromEntries(alpsStory.map(chapter => [chapter.id, {
  id: chapter.id, title: chapter.title, anchor: chapter.id === 'dufourspitze' ? 'dufour-trasa' : `${chapter.id}-trasa`, dates: dates[chapter.id],
  peaks: [{ ...alpsLocationById[chapter.id], altitude: chapter.altitude }],
  intro: chapter.id === 'dufourspitze' ? 'Zapis trzech dni: podejścia, wejścia na szczyt i powrotu.' : 'Zapis trasy z tej wyprawy.',
  stravaUrl: chapter.id === 'dufourspitze' ? 'https://www.strava.com/activities/19880087238' : null,
  load: () => loadRouteTrack(chapter.id),
}]))
tripRoutes['ganek-wysoka-rysy'] = {
  id: 'ganek-wysoka-rysy', title: 'Ganek, Wysoka i Rysy', anchor: 'trasa', dates: '9–10 sierpnia 2026',
  intro: 'Wspólny zapis Ganku, Wysokiej i Rysów. Powrót zakończył się po północy.',
  peaks: ['ganek', 'wysoka', 'rysy'].map(id => { const peak = summits.find(item => item.id === id); return { ...tatryLocationById[id], name: peak.name, altitude: peak.altitude, heightNote: peak.heightNote } }),
  load: () => loadRouteTrack('ganek-wysoka-rysy'),
}

for (const route of importedRoutes) {
  tripRoutes[route.id] = { ...route, load: () => loadRouteTrack(route.id) }
}
