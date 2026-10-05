// Visit evidence: the descriptions and chapters of the owner's two Morocco films.
// Geographic positions are separate from label offsets; they do not describe a GPS track.
const vlog = 'McawfrouM_0'
const mountain = 'BiWk6apjJOg'
const place = (id, name, kind, icon, lat, lon, videoId, seconds, time, description, extra = {}) => ({
  id, name, kind, icon, lat, lon, parent: 'morocco', view: 'morocco',
  filmIds: [videoId], chapter: { videoId, seconds, time }, description, ...extra,
})
export const moroccoPlaces = [
  place('rabat','Rabat','Miasto','city',34.01325,-6.83255,vlog,354,'05:54','Pierwszy dzień podróży: Rabat i Fez.', { offset: [-22,-14], label: true, coordinateSource: 'https://www.geonames.org/2538475/' }),
  place('fez','Fez','Miasto','city',34.03313,-5.00028,vlog,354,'05:54','Pierwszy dzień podróży: Rabat i Fez.', { offset: [25,-15], label: true, coordinateSource: 'https://www.geonames.org/2548885/' }),
  place('azrou','Azrou','Miejsce','forest',33.43443,-5.22126,vlog,689,'11:29','Okolice Azrou — las cedrowy i małpy. Dzień 2.', { offset: [10,20], coordinateSource: 'https://www.geonames.org/2556464/', positionNote: 'Town-level location; the precise forest stop is not established.' }),
  place('merzouga','Merzouga','Miejsce','desert',31.09917,-4.01167,vlog,1326,'22:06','Sahara, quady i wielbłądy. Dzień 3.', { offset: [22,10], label: true, coordinateSource: 'https://en.wikipedia.org/wiki/Merzouga', positionNote: 'Town-level location; no exact camp is inferred.' }),
  place('todra','Wąwóz Todra','Wąwóz','canyon',31.59,-5.59,vlog,2260,'37:40','Wąwóz i trekking w okolicach Tinghir. Dzień 4.', { offset: [45,10], coordinateSource: 'https://en.wikipedia.org/wiki/Todgha_Gorge' }),
  place('ouarzazate','Warzazat','Miasto','film',30.91894,-6.89341,vlog,3032,'50:32','Warzazat i Ajt Bin Haddu. Dzień 5.', { offset: [28,42], coordinateSource: 'https://www.geonames.org/2540850/' }),
  place('ait-ben-haddou','Ajt Bin Haddu','Miejsce','castle',31.04693,-7.12913,vlog,3032,'50:32','Warzazat i Ajt Bin Haddu. Dzień 5.', { offset: [-8,-4], coordinateSource: 'https://www.geonames.org/2560358/' }),
  place('marrakesh','Marrakesz','Miasto','city',31.63416,-7.99994,vlog,3629,'1:00:29','Marrakesz — dzień 6 podróży.', { offset: [-36,-3], label: true, coordinateSource: 'https://www.geonames.org/2542997/' }),
  place('ouzoud','Wodospad Ouzoud','Wodospad','waterfall',32.0150,-6.7197,vlog,3726,'1:02:06','Wodospad Ouzoud. Dzień 7.', { offset: [0,-25], coordinateSource: 'https://geoparcmgoun.ma/discover/geosite-5' }),
  place('imlil','Imlil','Miejscowość','village',31.136817,-7.920757,mountain,59,'00:59','Początek wejścia na Toubkal. Dzień 8.', { group: 'morocco-atlas', coordinateSource: 'https://www.openstreetmap.org/node/87828616' }),
  place('refuge-du-toubkal','Refuge du Toubkal','Schronisko','hut',31.0635142,-7.9375557,mountain,864,'14:24','Schronisko podczas wejścia na Toubkal. Dzień 8.', { group: 'morocco-atlas', coordinateSource: 'https://www.openstreetmap.org/way/307322838' }),
  place('toubkal','Toubkal','Szczyt','mountain',31.0598318,-7.9149438,mountain,1514,'25:14','Na szczycie Toubkalu. Dzień 9.', { group: 'morocco-atlas', altitude:'4167 m', coordinateSource: 'https://www.openstreetmap.org/node/87828608' }),
]
export const moroccoAtlas = { id:'morocco-atlas', name:'Atlas Wysoki', kind:'Region', parent:'morocco', view:'morocco', icon:'mountain', lat:31.09, lon:-7.927, offset:[-25,46], filmIds:[mountain], related:['imlil','refuge-du-toubkal','toubkal'], description:'Imlil, schronisko i Toubkal — górska część podróży.', label:true }
export const isMoroccoAtlas = id => id === moroccoAtlas.id || moroccoPlaces.some(place => place.id === id && place.group === moroccoAtlas.id)
export const moroccoMapPlaces = id => isMoroccoAtlas(id) ? moroccoPlaces.filter(place => place.group) : [...moroccoPlaces.filter(place => !place.group), moroccoAtlas]
export const moroccoTerrainLocations = moroccoPlaces.filter(place => place.group).map(place => ({ ...place, lng: place.lon }))
export const moroccoTerrainById = Object.fromEntries(moroccoTerrainLocations.map(place => [place.id, place]))
export const moroccoPosition = ({lat,lon}) => ({x:((lon+13)*48+15)/640*100,y:((36.7-lat)*56+10)/480*100})
export const atlasFilmHref = (node, film) => node.chapter?.videoId === film.youtubeId ? `${film.youtubeUrl}&t=${node.chapter.seconds}s` : film.youtubeUrl
