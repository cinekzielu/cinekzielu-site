import { galleryData } from './galleryData.js'

// Dates come from reviewed photo metadata; years also match the approved galleries.
// Route wording comes from verified film titles or the owner's description.
const details = {
  'zabi-kon-2026': {
    region: 'Tatry Wysokie', date: '19 września 2026', kind: 'Wyprawa w Tatry',
    description: 'Wrześniowa wyprawa na Żabiego Konia. Fotografie z podejścia i grani oraz film z wejścia.',
  },
  'alpy-2026': {
    region: 'Alpy', date: 'Sierpień 2026', kind: 'Wyprawa alpejska',
    description: 'Fotografie z sierpniowej wyprawy w Alpy.',
  },
  'baranie-rogi-lodowy-szczyt-2026': {
    region: 'Tatry Wysokie', date: 'Lipiec 2026', kind: 'Dwa dni w Tatrach',
    description: 'Letnia wyprawa: pierwszego dnia Baranie Rogi, drugiego Lodowy Szczyt przez Lodową Kopę.',
  },
  'liptowskie-mury-2026': {
    region: 'Tatry', date: '6 czerwca 2026', kind: 'Przejście grani',
    description: 'Liptowskie Mury i Walentkowa Grań.',
  },
  'koscielec-2026': {
    region: 'Tatry', date: '7 marca 2026', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Kościelec przez Żleb Zaruskiego.',
  },
  'konczysta-2026': {
    region: 'Tatry Wysokie', date: '8 lutego 2026', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Kończystą w Tatrach Wysokich.',
  },
  'turbacz-2026': {
    region: 'Gorce', date: '10 stycznia 2026', kind: 'Zimowa wyprawa',
    description: 'Turbacz zimą. Fotografie z lasu, okolic szczytu i drogi powrotnej.',
  },
  'szwajcaria-2025': {
    region: 'Szwajcaria', date: '2025', kind: 'Podróż',
    description: 'Fotografie i siedem filmów z podróży po Szwajcarii.',
  },
  'krywan-2025': {
    region: 'Tatry Wysokie', date: '21 września 2025', kind: 'Wyprawa w Tatry',
    description: 'Wrześniowa wyprawa na Krywań. Panoramy Tatr i fotografie z drogi powrotnej.',
  },
  'szpiglasowy-wierch-2025': {
    region: 'Tatry Wysokie', date: '14 sierpnia 2025', kind: 'Letnia wyprawa',
    description: 'Szpiglasowy Wierch latem. Fotografie z podejścia, szczytu i zejścia.',
  },
  'swinica-2025': {
    region: 'Tatry', date: '19–20 lipca 2025', kind: 'Letnia wyprawa',
    description: 'Fotografie z lipcowego wyjazdu w Tatry i film z wejścia na Świnicę przez Zawrat.',
  },
}

export const expeditionPages = Object.entries(details).map(([id, detail]) => {
  const gallery = galleryData.find(item => item.id === id)
  return { id, ...detail, title: gallery.title, year: gallery.year, gallery }
})

export const expeditionAliases = { 'switzerland-trip': 'szwajcaria-2025', 'koscielec-winter': 'koscielec-2026' }
export const findExpeditionPage = (slug) => expeditionPages.find(item => item.id === (expeditionAliases[slug] || slug))
export const expeditionHref = (expedition) => `/wyprawy/${expedition.id}`
export function filmCount(films) {
  if (films.length === 1 && films[0].label === 'Zwiastun') return 'zwiastun'
  const count = films.length
  return `${count} ${count === 1 ? 'film' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'filmy' : 'filmów'}`
}
