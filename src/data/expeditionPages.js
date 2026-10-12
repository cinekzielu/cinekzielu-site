import { galleryData } from './galleryData.js'

// Dates come from reviewed photo metadata; years also match the approved galleries.
// Route wording comes from verified film titles or the owner's description.
const details = {
  'mieguszowiecki-posrednia-gran-2025': {
    sortDate: '2025-07-05', region: 'Tatry Wysokie', date: '5–6 lipca 2025', kind: 'Dwa dni w Tatrach',
    description: 'Mięguszowiecki Szczyt Wielki i Pośrednia Grań. Dwa lipcowe dni w Tatrach, dwa filmy i kadry z podejść, wspinaczki oraz zejść.',
  },
  'wysoka-ganek-rysy-2026': {
    sortDate: '2026-08-09', region: 'Tatry Wysokie', date: '9 sierpnia 2026', kind: 'Letnia wyprawa',
    description: 'Wysoka, Ganek i Rysy. Zdjęcia z sierpniowej wyprawy: nocne podejście, wspinaczka, ekipa i widoki z grani.',
  },
  'durny-lomnica-2025': {
    sortDate: '2025-06-14', region: 'Tatry Wysokie', date: '14–15 czerwca 2025', kind: 'Letnia wyprawa',
    description: 'Durny Szczyt i Łomnica podczas czerwcowego weekendu w Tatrach. Dwa filmy oraz wybrane kadry z podejścia, grani i zejścia.',
  },
  'rumunia-2024': {
    sortDate: '2024-07-05', region: 'Rumunia · Karpaty', date: '5–14 lipca 2024', kind: 'Wyprawa rowerowa',
    description: 'Rowerowa wyprawa przez Rumunię. Sakwy, biwaki i górskie drogi — zapis wyjazdu z lipca 2024 w zdjęciach z telefonu.',
  },
  'katania-2026': {
    sortDate: '2026-06-15',
    region: 'Sycylia · Włochy', date: '15–19 czerwca 2026', kind: 'Podróż',
    description: 'Katania, wybrzeże Taorminy i wędrówka po zboczach Etny. Architektura, uliczne detale i wulkaniczne krajobrazy w fotografiach z Sycylii.',
  },
  'hungaroring-2026': {
    sortDate: '2026-07-24',
    region: 'Mogyoród · Węgry', date: '24–26 lipca 2026', kind: 'Formuła 1',
    description: 'Weekend na Hungaroringu. Bolidy, trybuny i atmosfera toru — fotografie oraz krótki film z F1, F2, F3 i Porsche Supercup.',
  },
  'baranie-rogi-zima-2025': {
    sortDate: '2025-11-30',
    region: 'Tatry Wysokie', date: '30 listopada 2025', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Baranie Rogi. Kadry z nagrań DJI: podejście, grań i zejście oraz film z wyprawy.',
  },
  'kiezmarski-szczyt-zima-2025': {
    sortDate: '2025-12-01',
    region: 'Tatry Wysokie', date: '1 grudnia 2025', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Kieżmarski Szczyt przez Huncowski Szczyt. Kadry z nagrań DJI i film z wyprawy.',
  },
  'zabi-kon-2026': {
    sortDate: '2026-09-19',
    region: 'Tatry Wysokie', date: '19 września 2026', kind: 'Wyprawa w Tatry',
    description: 'Wrześniowa wyprawa na Żabiego Konia. Fotografie z podejścia i grani oraz film z wejścia.',
  },
  'alpy-2026': {
    sortDate: '2026-08',
    region: 'Alpy', date: 'Sierpień 2026', kind: 'Wyprawa alpejska',
    description: 'Across the Alps: Triglav, Grossglockner, Dufourspitze, Grauspitz i Zugspitze. Pięć zdobytych szczytów pięciu krajów, fotografie i opowieść z sierpniowej wyprawy.',
  },
  'baranie-rogi-lodowy-szczyt-2026': {
    sortDate: '2026-07',
    region: 'Tatry Wysokie', date: 'Lipiec 2026', kind: 'Dwa dni w Tatrach',
    description: 'Letnia wyprawa: pierwszego dnia Baranie Rogi, drugiego Lodowy Szczyt przez Lodową Kopę.',
  },
  'liptowskie-mury-2026': {
    sortDate: '2026-06-06',
    region: 'Tatry', date: '6 czerwca 2026', kind: 'Przejście grani',
    description: 'Liptowskie Mury i Walentkowa Grań.',
  },
  'koscielec-2026': {
    sortDate: '2026-03-07',
    region: 'Tatry', date: '7 marca 2026', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Kościelec przez Żleb Zaruskiego.',
  },
  'konczysta-2026': {
    sortDate: '2026-02-08',
    region: 'Tatry Wysokie', date: '8 lutego 2026', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Kończystą w Tatrach Wysokich.',
  },
  'turbacz-2026': {
    sortDate: '2026-01-10',
    region: 'Gorce', date: '10 stycznia 2026', kind: 'Zimowa wyprawa',
    description: 'Turbacz zimą. Fotografie z lasu, okolic szczytu i drogi powrotnej.',
  },
  'szwajcaria-2025': {
    sortDate: '2025-07-27',
    region: 'Szwajcaria', date: '2025', kind: 'Podróż',
    description: 'Fotografie i siedem filmów z podróży po Szwajcarii.',
  },
  'krywan-2025': {
    sortDate: '2025-09-21',
    region: 'Tatry Wysokie', date: '21 września 2025', kind: 'Wyprawa w Tatry',
    description: 'Wrześniowa wyprawa na Krywań. Panoramy Tatr i fotografie z drogi powrotnej.',
  },
  'szpiglasowy-wierch-2025': {
    sortDate: '2025-08-14',
    region: 'Tatry Wysokie', date: '14 sierpnia 2025', kind: 'Letnia wyprawa',
    description: 'Szpiglasowy Wierch latem. Fotografie z podejścia, szczytu i zejścia.',
  },
  'swinica-2025': {
    sortDate: '2025-07-19',
    region: 'Tatry', date: '19–20 lipca 2025', kind: 'Letnia wyprawa',
    description: 'Fotografie z lipcowego wyjazdu w Tatry i film z wejścia na Świnicę przez Zawrat.',
  },
  'maroko-2025': {
    sortDate: '2025-04-26',
    region: 'Maroko', date: '2025', kind: 'Podróż',
    description: 'Kadry z nagrań DJI oraz dwa filmy z podróży po Maroku i wejścia na Toubkal.',
  },
  'gerlach-zima-2025': {
    sortDate: '2025-01-25',
    region: 'Tatry Wysokie', date: '25 stycznia 2025', kind: 'Zimowa wyprawa',
    description: 'Zimowe wejście na Gerlach. Kadry z nagrań GoPro: podejście, droga na szczyt i zejście.',
  },
}

// ISO date precision is preserved: YYYY, YYYY-MM or YYYY-MM-DD.
// Swiss/Morocco ordering dates come from their established trip-root labels.
export const sortExpeditionsNewest = items => [...items].sort((a, b) => {
  const key = item => (item.sortDate || String(item.year)).split('-').map(Number)
  const left = key(a), right = key(b)
  return (right[0] - left[0]) || ((right[1] || 0) - (left[1] || 0)) || ((right[2] || 0) - (left[2] || 0))
})
export const expeditionPages = sortExpeditionsNewest( Object.entries(details).map(([id, detail]) => {
  const gallery = galleryData.find(item => item.id === id)
  return { id, ...detail, title: gallery.title, year: gallery.year, gallery }
}))

export const expeditionAliases = { 'switzerland-trip': 'szwajcaria-2025', 'koscielec-winter': 'koscielec-2026' }
export const findExpeditionPage = (slug) => expeditionPages.find(item => item.id === (expeditionAliases[slug] || slug))
export const expeditionHref = (expedition) => `/wyprawy/${expedition.id}`
export function filmCount(films) {
  if (films.length === 1 && films[0].label === 'Zwiastun') return 'zwiastun'
  const count = films.length
  return `${count} ${count === 1 ? 'film' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'filmy' : 'filmów'}`
}
