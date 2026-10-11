import { galleryData } from './galleryData.js'

export const alpsStoryGallery = galleryData.find(gallery => gallery.id === 'alpy-2026')
const photos = numbers => numbers.map(number => alpsStoryGallery.photos[number - 1])

// Post-trip account and activity totals supplied by the author on 11 October 2026.
// Photo groups illustrate the stages; no exact summit dates or GPS tracks inferred.
export const alpsStory = [
  {
    id: 'triglav', title: 'Triglav', country: 'Słowenia', altitude: 2864,
    distance: 18.33, ascent: 2035, movingTime: '08:13:27',
    description: 'Pierwszy szczyt. Ruszyliśmy przy czołówkach, jeszcze po ciemku. Długie podejście z doliny, skalne odcinki, ferraty i ekspozycja — tak zaczęło się Across the Alps.',
    photos: photos([2, 5, 7]),
    pause: { title: 'Od razu w drogę', description: 'Po zejściu z Triglavu pojechaliśmy prosto pod Grossglockner. Nocleg w samochodzie na parkingu. Budzik miał zadzwonić o północy, ale obudziliśmy się o szóstej rano.', photos: [] },
    lat: 46.3782982, lng: 13.8365822, osmNode: 26864958,
  },
  {
    id: 'grossglockner', title: 'Grossglockner', country: 'Austria', altitude: 3798,
    distance: 20.16, ascent: 1878, movingTime: '08:09:41',
    description: 'Mimo późniejszego startu podejście szło szybko. Od około 3000 metrów góry przykryła gęsta mgła. Na grani trochę kolejek, widoków prawie zero, ale przeszliśmy bez deszczu. Drugi szczyt zdobyty.',
    photos: photos([10, 9, 11]),
    pause: { title: 'Między Austrią a Szwajcarią', description: 'Przejazdy, jedzenie i odpoczynek też były częścią tej podróży. Kolejny cel to Monte Rosa — najdłuższy górski etap całego wyjazdu.', photos: photos([12, 13]) },
    lat: 47.0745464, lng: 12.6938826, osmNode: 26863041,
  },
  {
    id: 'dufourspitze', title: 'Dufourspitze', country: 'Szwajcaria', altitude: 4634,
    distance: 50.26, ascent: 4127, movingTime: '24:24:59',
    description: 'Główny cel wyjazdu i trzy dni w masywie Monte Rosa. Lodowiec, szczeliny, śnieg i najwyższy punkt całej wyprawy. Podczas akcji szczytowej Agata została w Monte Rosa Hütte; na Dufourspitze ruszyliśmy z Maxem i Karolem.',
    statsNote: 'Dane obejmują cały trzydniowy etap: podejście, akcję szczytową i powrót. Czas to suma ruchu z tych dni.',
    photos: [],
    days: [
      { title: 'Podejście', description: 'W rejon Monte Rosa Hütte.', photos: photos([1, 14, 19]) },
      { title: 'Szczyt', description: 'Akcja szczytowa na Dufourspitze.', photos: photos([25, 24, 28]) },
      { title: 'Powrót', description: 'Zejście w kierunku Zermatt.', photos: photos([38, 35, 36]) },
    ],
    pause: { title: 'Chwila oddechu', description: 'Po trzech dniach w górach — odpoczynek i dalsza droga. Przed nami Liechtenstein i czwarty szczyt.', photos: photos([41, 40]) },
    lat: 45.9369238, lng: 7.8667570, osmNode: 414760065,
  },
  {
    id: 'grauspitz', title: 'Grauspitz', country: 'Liechtenstein', altitude: 2599,
    distance: 17.21, ascent: 1410, movingTime: '04:44:25',
    description: 'Po lodowcach przyszła spokojniejsza odsłona Alp. Vorder Grauspitz: mniej infrastruktury, zielone zbocza, spotkane po drodze krowy i czwarty zdobyty szczyt.',
    photos: photos([44, 43, 46]),
    pause: { title: 'Jeszcze jedna noc w aucie', description: 'Spod Grauspitz pojechaliśmy pod Zugspitze. Znów spaliśmy w samochodzie. Tym razem ruszyliśmy około 2:30 — przed nami ostatnie wejście.', photos: [] },
    lat: 47.0527317, lng: 9.5812795, osmNode: 1966389671,
  },
  {
    id: 'zugspitze', title: 'Zugspitze', country: 'Niemcy', altitude: 2962,
    distance: 14.02, ascent: 1935, movingTime: '06:02:39',
    description: 'Najpierw czołówki, później świt. Piesze wejście, skalna końcówka, stalowe liny i ekspozycja. Zugspitze było ostatnim celem: pięć najwyższych szczytów pięciu krajów zdobytych.',
    photos: photos([48, 47]),
    lat: 47.4212150, lng: 10.9862970, osmNode: 27384190,
  },
].map((chapter, index) => ({ ...chapter, number: String(index + 1).padStart(2, '0'), episodeStatus: 'W przygotowaniu' }))

export const alpsTotals = { peaks: 5, countries: 5, participants: 4, distance: 119.98, ascent: 11385, movingTime: '51:35:11' }
export const alpsLocations = alpsStory.map(({ id, title, lat, lng, osmNode }) => ({ id, name: title, lat, lng, icon: 'mountain', coordinateSource: `https://www.openstreetmap.org/node/${osmNode}` }))
export const alpsLocationById = Object.fromEntries(alpsLocations.map(point => [point.id, point]))
export const alpsStoryHash = chapter => `#alpy-${chapter.id}`
// Preserve links to the first local draft after its editorial restructuring.
export const alpsLegacyChapters = { skaly: 'triglav', doliny: 'grossglockner', jezioro: 'dufourspitze', snieg: 'dufourspitze', lodowiec: 'dufourspitze', zielen: 'grauspitz', swiatlo: 'zugspitze' }
