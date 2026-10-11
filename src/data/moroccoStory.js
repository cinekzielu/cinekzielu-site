import { moroccoPlaces } from './moroccoPlaces.js'
import { moroccoGallery } from './moroccoGallery.js'

// Chapter order/times: the two verified films (docs/MOROCCO_ATLAS.md).
// Frame associations: reviewed landmarks and dated original-clip provenance;
// broad stops remain broad, never a claimed camera position or GPS track.
const definitions = [
  ['miasta', 'Rabat i Fez', ['rabat', 'fez'], [19, 4], 'Pierwszy dzień. Rabat i Fez, od placów po wąskie uliczki.'],
  ['cedry', 'Okolice Azrou', ['azrou'], [22], 'Las cedrowy i małpy. Drugi dzień podróży.'],
  ['sahara', 'Sahara', ['merzouga'], [7, 24], 'Wydmy i wielbłądy w okolicach Merzougi.'],
  ['wawoz', 'Wąwóz Todra', ['todra'], [25], 'Wąwóz i trekking w okolicach Tinghir.'],
  ['gliniane-miasta', 'Warzazat i Ajt Bin Haddu', ['ouarzazate', 'ait-ben-haddou'], [11, 12], 'Piąty dzień. Warzazat i zabudowa Ajt Bin Haddu.'],
  ['marrakesz', 'Marrakesz', ['marrakesh'], [31], 'Szósty dzień w mieście. Uliczki, targ i kolorowe stoiska.'],
  ['wodospad', 'Ouzoud', ['ouzoud'], [13], 'Wodospad Ouzoud. Ostatni rozdział pierwszego filmu.'],
  ['podejscie', 'Z Imlil w góry', ['imlil'], [37], 'Początek wejścia na Toubkal. Ósmy dzień podróży.'],
  ['schronisko', 'Refuge du Toubkal', ['refuge-du-toubkal'], [38], 'Schronisko podczas wejścia na Toubkal.'],
  ['szczyt', 'Toubkal', ['toubkal'], [40, 16], 'Dziewiąty dzień. Szczyt i górska panorama o poranku.'],
]

export const moroccoStory = definitions.map(([id, title, placeIds, frames, description], index) => {
  const places = placeIds.map(id => moroccoPlaces.find(place => place.id === id))
  const chapter = places[0].chapter
  return {
    id, title, places, description, number: String(index + 1).padStart(2, '0'),
    chapter, filmPart: chapter.videoId === moroccoGallery.films[0].id ? 1 : 2,
    filmHref: `https://www.youtube.com/watch?v=${chapter.videoId}&t=${chapter.seconds}s`,
    photos: frames.map(number => moroccoGallery.photos.find(photo => photo.src.endsWith(`/maroko-${String(number).padStart(2, '0')}-small.webp`))),
  }
})
export const moroccoStoryForPlace = id => moroccoStory.find(stop => stop.places.some(place => place.id === id))
export const moroccoStoryHash = stop => `#opowiesc-${stop.id}`
