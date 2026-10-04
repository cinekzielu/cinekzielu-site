import { galleryData } from './galleryData.js'

// Dates come from reviewed photo metadata; years also match the approved galleries.
// Route wording is limited to the titles of the owner's verified films.
const details = {
  'alpy-2026': {
    region: 'Alpy', date: 'Sierpień 2026', kind: 'Wyprawa alpejska',
    description: 'Fotografie z sierpniowej wyprawy w Alpy.',
  },
  'liptowskie-mury-2026': {
    region: 'Tatry', date: '6 czerwca 2026', kind: 'Przejście grani',
    description: 'Liptowskie Mury i Walentkowa Grań.',
  },
  'konczysta-2026': {
    region: 'Tatry Wysokie', date: '8 lutego 2026', kind: 'Zimowe wejście',
    description: 'Zimowe wejście na Kończystą w Tatrach Wysokich.',
  },
  'szwajcaria-2025': {
    region: 'Szwajcaria', date: '2025', kind: 'Podróż',
    description: 'Fotografie i siedem filmów z podróży po Szwajcarii.',
  },
}

export const expeditionPages = Object.entries(details).map(([id, detail]) => {
  const gallery = galleryData.find(item => item.id === id)
  return { id, ...detail, title: gallery.title, year: gallery.year, gallery }
})

export const expeditionAliases = { 'switzerland-trip': 'szwajcaria-2025' }
export const findExpeditionPage = (slug) => expeditionPages.find(item => item.id === (expeditionAliases[slug] || slug))
export const expeditionHref = (expedition) => `/wyprawy/${expedition.id}`
export function filmCount(films) {
  if (films.length === 1 && films[0].label === 'Zwiastun') return 'zwiastun'
  const count = films.length
  return `${count} ${count === 1 ? 'film' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'filmy' : 'filmów'}`
}
