// Geographic reference points from OpenStreetMap, checked 2026-10-11.
// Visit evidence: reviewed photographs and the owner's Hungaroring film.
// Etna is a volcano reference, not a summit claim or a recorded walking route.
export const sicilyPlaces = [
  { id:'catania', name:'Katania', kind:'Miasto', parent:'sicily', view:'terrain', icon:'city', lat:37.5023612, lon:15.0873718, description:'Ulice, dachy i architektura Katanii. Fotografie z czerwca 2026.', coordinateSource:'https://www.openstreetmap.org/relation/39230' },
  { id:'taormina', name:'Taormina', kind:'Miasto', parent:'sicily', view:'terrain', icon:'city', lat:37.8512218, lon:15.2830191, description:'Nadmorski krajobraz i detale miasta z podróży po Sycylii.', coordinateSource:'https://www.openstreetmap.org/relation/39384' },
  { id:'etna', name:'Etna', kind:'Wulkan', parent:'sicily', view:'terrain', icon:'mountain', lat:37.7510251, lon:14.9940321, description:'Fotografie z wędrówki po zboczach Etny. Czarne skały, niska roślinność i chmury nad wulkanem.', coordinateSource:'https://www.openstreetmap.org/node/58999222' },
]
export const hungaryPlaces = [
  { id:'hungaroring', name:'Hungaroring', kind:'Tor wyścigowy', parent:'hungary', view:'terrain', icon:'race', lat:47.5826490, lon:19.2500236, filmIds:['eWK-80Idong'], description:'Weekend Formuły 1 w lipcu 2026. Fotografie z trybun i film z toru w Mogyoród.', coordinateSource:'https://www.openstreetmap.org/relation/3938368' },
]
