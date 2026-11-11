import { galleryData } from './galleryData.js'
import { alpsEpisodes } from './alpsEpisodes.js'

export const alpsStoryGallery = galleryData.find(gallery => gallery.id === 'alpy-2026')
const photos = numbers => numbers.map(number => alpsStoryGallery.photos[number - 1])

// Post-trip account and activity totals supplied by the author on 11 October 2026.
// Photo groups illustrate the stages; no exact summit dates or GPS tracks inferred.
export const alpsStory = [
  {
    id: 'triglav', title: 'Triglav', country: 'Słowenia', altitude: 2864,
    distance: 18.33, ascent: 2035, movingTime: '08:13:27',
    description: 'W pierwszym odcinku jedziemy do Słowenii i wchodzimy na Triglav. Po zejściu ruszamy pod Grossglockner.',
    photos: photos([2, 5, 7]),
    pause: { title: 'Pod Grossglockner', description: 'Ze Słowenii pojechaliśmy do Austrii, pod kolejny szczyt.', photos: [] },
    lat: 46.3782982, lng: 13.8365822, osmNode: 26864958,
  },
  {
    id: 'grossglockner', title: 'Grossglockner', country: 'Austria', altitude: 3798,
    distance: 20.16, ascent: 1878, movingTime: '08:09:41',
    description: 'Drugim celem był Grossglockner. Górną część trasy przeszliśmy we mgle.',
    photos: photos([10, 9, 11]),
    pause: { title: 'W drodze do Szwajcarii', description: 'Po Grossglocknerze ruszyliśmy do Szwajcarii. Kolejnym celem było Dufourspitze.', photos: photos([12, 13]) },
    lat: 47.0745464, lng: 12.6938826, osmNode: 26863041,
  },
  {
    id: 'dufourspitze', title: 'Dufourspitze', country: 'Szwajcaria', altitude: 4634,
    distance: 50.26, ascent: 4127, movingTime: '24:24:59',
    description: 'Etap na Dufourspitze podzieliliśmy na trzy dni: podejście do Monte Rosa Hütte, wejście na szczyt i powrót w stronę Zermatt.',
    statsNote: 'Dane obejmują cały trzydniowy etap: podejście, akcję szczytową i powrót. Czas to suma ruchu z tych dni.',
    photos: [],
    days: [
      { title: 'Podejście', description: 'W rejon Monte Rosa Hütte.', photos: photos([1, 14, 19]) },
      { title: 'Szczyt', description: 'Wejście na Dufourspitze.', photos: photos([25, 24, 28]) },
      { title: 'Powrót', description: 'Zejście w kierunku Zermatt.', photos: photos([38, 35, 36]) },
    ],
    pause: { title: 'Przerwa po Dufourspitze', description: 'Po zejściu odpoczęliśmy przed wyjazdem do Liechtensteinu.', photos: photos([41, 40]) },
    lat: 45.9369238, lng: 7.8667570, osmNode: 414760065,
  },
  {
    id: 'grauspitz', title: 'Grauspitz', country: 'Liechtenstein', altitude: 2599,
    distance: 17.21, ascent: 1410, movingTime: '04:44:25',
    description: 'Po Dufourspitze weszliśmy na Vorder Grauspitz w Liechtensteinie.',
    photos: photos([44, 43, 46]),
    pause: { title: 'Pod Zugspitze', description: 'Z Liechtensteinu pojechaliśmy do Niemiec, pod ostatni szczyt.', photos: [] },
    lat: 47.0527317, lng: 9.5812795, osmNode: 1966389671,
  },
  {
    id: 'zugspitze', title: 'Zugspitze', country: 'Niemcy', altitude: 2962,
    distance: 14.02, ascent: 1935, movingTime: '06:02:39',
    description: 'Wyjazd zakończyliśmy pieszym wejściem na Zugspitze. Ostatni odcinek prowadził po skałach, przy stalowych linach.',
    photos: photos([48, 47]),
    lat: 47.4212150, lng: 10.9862970, osmNode: 27384190,
  },
].map((chapter, index) => ({ ...chapter, number: String(index + 1).padStart(2, '0'), episode: alpsEpisodes[chapter.id] || null, episodeStatus: alpsEpisodes[chapter.id] ? 'Dostępny' : 'W przygotowaniu' }))

export const alpsTotals = { peaks: 5, countries: 5, participants: 4, distance: 119.98, ascent: 11385, movingTime: '51:35:11' }
export const alpsLocations = alpsStory.map(({ id, title, lat, lng, osmNode }) => ({ id, name: title, lat, lng, icon: 'mountain', coordinateSource: `https://www.openstreetmap.org/node/${osmNode}` }))
export const alpsLocationById = Object.fromEntries(alpsLocations.map(point => [point.id, point]))
export const alpsStoryHash = chapter => `#alpy-${chapter.id}`
// Preserve links to the first local draft after its editorial restructuring.
export const alpsLegacyChapters = { skaly: 'triglav', doliny: 'grossglockner', jezioro: 'dufourspitze', snieg: 'dufourspitze', lodowiec: 'dufourspitze', zielen: 'grauspitz', swiatlo: 'zugspitze' }
