import { galleryData } from './galleryData.js'

// Dates come from reviewed photo metadata; years also match the approved galleries.
// Route wording comes from verified film titles or the owner's description.
const details = {
  'mieguszowiecki-posrednia-gran-2025': {
    sortDate: '2025-07-05', region: 'Tatry Wysokie', date: '5–6 lipca 2025', kind: 'Dwa dni w Tatrach',
    description: 'Dwa dni w Tatrach: Mięguszowiecki Szczyt Wielki i Pośrednia Grań. Z każdego wejścia jest osobny film.',
  },
  'wysoka-ganek-rysy-2026': {
    sortDate: '2026-08-09', region: 'Tatry Wysokie', date: '9 sierpnia 2026', kind: 'Letnia wyprawa',
    description: 'Zdjęcia i trasa z sierpniowego wejścia na Ganek, Wysoką i Rysy.',
  },
  'durny-lomnica-2025': {
    sortDate: '2025-06-14', region: 'Tatry Wysokie', date: '14–15 czerwca 2025', kind: 'Letnia wyprawa',
    description: 'Weekend w Tatrach: najpierw Durny Szczyt, następnego dnia Łomnica. Oba wejścia są na filmach.',
  },
  'rumunia-2024': {
    sortDate: '2024-07-05', region: 'Rumunia · Karpaty', date: '5–14 lipca 2024', kind: 'Wyprawa rowerowa',
    description: 'Zdjęcia z rowerowej wyprawy po Rumunii w lipcu 2024.',
  },
  'katania-2026': {
    sortDate: '2026-06-15',
    region: 'Sycylia · Włochy', date: '15–19 czerwca 2026', kind: 'Podróż',
    description: 'Kilka dni na Sycylii: Katania, Taormina i wyjście na zbocza Etny.',
  },
  'hungaroring-2026': {
    sortDate: '2026-07-24',
    region: 'Mogyoród · Węgry', date: '24–26 lipca 2026', kind: 'Formuła 1',
    description: 'Zdjęcia i krótki film z weekendu na Hungaroringu. F1, F2, F3 i Porsche Supercup.',
  },
  'baranie-rogi-zima-2025': {
    sortDate: '2025-11-30',
    region: 'Tatry Wysokie', date: '30 listopada 2025', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Baranie Rogi. Film i wybrane kadry z kamery DJI.',
  },
  'kiezmarski-szczyt-zima-2025': {
    sortDate: '2025-12-01',
    region: 'Tatry Wysokie', date: '1 grudnia 2025', kind: 'Zimowe wejście',
    description: 'Zimą na Kieżmarski Szczyt przez Huncowski Szczyt. Film i kadry z nagrań DJI.',
  },
  'zabi-kon-2026': {
    sortDate: '2026-09-19',
    region: 'Tatry Wysokie', date: '19 września 2026', kind: 'Wyprawa w Tatry',
    description: 'Wrześniowe wejście na Żabiego Konia, na zdjęciach i w filmie.',
  },
  'alpy-2026': {
    // Recorded mountain stages, confirmed by GPX and photo metadata; excludes travel days.
    sortDate: '2026-08-18',
    region: 'Alpy', date: '18–28 sierpnia 2026', kind: 'Etapy wyprawy alpejskiej',
    description: 'Across the Alps: Triglav, Grossglockner, Dufourspitze, Grauspitz i Zugspitze. Filmy, fotografie i trasy z wyjazdu w Alpy od 18 do 28 sierpnia 2026.',
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
    description: 'Zdjęcia ze styczniowego wyjścia na Turbacz.',
  },
  'szwajcaria-2025': {
    sortDate: '2025-07-27',
    region: 'Szwajcaria', date: '2025', kind: 'Podróż',
    description: 'Wyjazd do Szwajcarii w 2025 roku. Zdjęcia i siedem filmów z górskich wycieczek.',
  },
  'krywan-2025': {
    sortDate: '2025-09-21',
    region: 'Tatry Wysokie', date: '21 września 2025', kind: 'Wyprawa w Tatry',
    description: 'Zdjęcia z wrześniowego wejścia na Krywań.',
  },
  'szpiglasowy-wierch-2025': {
    sortDate: '2025-08-14',
    region: 'Tatry Wysokie', date: '14 sierpnia 2025', kind: 'Letnia wyprawa',
    description: 'Zdjęcia z letniego wejścia na Szpiglasowy Wierch.',
  },
  'swinica-2025': {
    sortDate: '2025-07-19',
    region: 'Tatry', date: '19–20 lipca 2025', kind: 'Letnia wyprawa',
    description: 'Lipcowy wyjazd na Kasprowy Wierch i Świnicę. Zdjęcia i film z wejścia na Świnicę przez Zawrat.',
  },
  'maroko-2025': {
    sortDate: '2025-04-26',
    region: 'Maroko', date: '2025', kind: 'Podróż',
    description: 'Podróż po Maroku zakończona wejściem na Toubkal. Dwa filmy i kadry z nagrań DJI.',
  },
  'gerlach-zima-2025': {
    sortDate: '2025-01-25',
    region: 'Tatry Wysokie', date: '25 stycznia 2025', kind: 'Zimowa wyprawa',
    description: 'Kadry z zimowego wejścia na Gerlach, nagranego kamerą GoPro.',
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
