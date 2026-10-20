import { routeAtlasHref } from './routeAtlas.js'

export const comparisonPicks = [
  { id: 'baranie-sezony', title: 'Baranie Rogi · lato i zima', description: 'Letni pierwszy dzień i zimowe wejście. Porównaj dystans i profil obu zapisów.', compare: ['baranie-rogi-lato-2026', 'baranie-rogi-zima-2025'], compareDays: ['1', 'all'], labels: ['Lato 2026 · dzień 1', 'Zima 2025'] },
  { id: 'baranie-dni', title: 'Baranie Rogi i Lodowy · dwa dni', description: 'Dwa odcinki tej samej wyprawy, każdy z własnym początkiem profilu.', compare: ['baranie-rogi-lato-2026', 'baranie-rogi-lato-2026'], compareDays: ['1', '2'], labels: ['Dzień 1 · Baranie Rogi', 'Dzień 2 · Lodowy Szczyt'] },
  { id: 'alpy-tatry', title: 'Dufourspitze i Ganek–Wysoka–Rysy', description: 'Dwa pełne zapisy: jeden z Alp, drugi z Tatr. Wspólna skala profilu.', compare: ['dufourspitze', 'ganek-wysoka-rysy'], compareDays: ['all', 'all'], labels: ['Dufourspitze', 'Ganek, Wysoka i Rysy'] },
]
export const comparisonPickHref = (pick, state = {}) => routeAtlasHref({ ...state, compare: pick.compare, compareDays: pick.compareDays }) + '#porownanie'
