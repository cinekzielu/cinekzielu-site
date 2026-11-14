import { routeAtlasHref } from './routeAtlas.js'

export const comparisonPicks = [
  { id: 'baranie-sezony', title: 'Baranie Rogi · lato i zima', description: 'Baranie Rogi latem i zimą. Porównaj długość trasy i podejścia.', compare: ['baranie-rogi-lato-2026', 'baranie-rogi-zima-2025'], compareDays: ['1', 'all'], labels: ['Lato 2026 · dzień 1', 'Zima 2025'] },
  { id: 'baranie-dni', title: 'Baranie Rogi i Lodowy · dwa dni', description: 'Pierwszego dnia Baranie Rogi, drugiego Lodowy Szczyt. Zobacz oba dni obok siebie.', compare: ['baranie-rogi-lato-2026', 'baranie-rogi-lato-2026'], compareDays: ['1', '2'], labels: ['Dzień 1 · Baranie Rogi', 'Dzień 2 · Lodowy Szczyt'] },
  { id: 'alpy-tatry', title: 'Dufourspitze i Ganek–Wysoka–Rysy', description: 'Trzy dni na Dufourspitze i przejście Ganku, Wysokiej oraz Rysów na wspólnym wykresie.', compare: ['dufourspitze', 'ganek-wysoka-rysy'], compareDays: ['all', 'all'], labels: ['Dufourspitze', 'Ganek, Wysoka i Rysy'] },
]
export const comparisonPickHref = (pick, state = {}) => routeAtlasHref({ ...state, compare: pick.compare, compareDays: pick.compareDays }) + '#porownanie'
