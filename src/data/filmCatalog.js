import { filmMatchesRegion } from './tripGeography.js'

// Verified on the author's YouTube channel, 2026-10-04. Order follows the channel.
// Publication dates are present only when confirmed in the expanded video description.
const video = (youtubeId, title, duration, region, format = 'Film', extra = {}) => ({
  id: youtubeId, youtubeId, title, duration, region, format,
  youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
  thumbnail: `https://i.ytimg.com/vi/${youtubeId}/hq720.jpg`,
  status: 'published', ...extra,
})

export const filmCatalog = [
  video('0YhbiEncSmo', 'Żabi Koń · free solo', '37:57', 'tatry', 'Film', { expeditionId: 'zabi-kon-2026' }),
  video('eB5BItG2tfk', 'Lodowy Szczyt przez Lodową Kopę', '44:08', 'tatry', 'Film', { expeditionId: 'baranie-rogi-lodowy-szczyt-2026', searchTerms: 'lato' }),
  video('l3KltGrKz2U', 'Across the Alps', '1:34', 'alpy', 'Zwiastun', { expeditionId: 'alpy-2026', publishedAt: '2026-07-15' }),
  video('85Up2O2uc50', 'Baranie Rogi', '21:31', 'tatry', 'Film', { expeditionId: 'baranie-rogi-lodowy-szczyt-2026', searchTerms: 'lato' }),
  video('ITjvjmavnNs', 'Liptowskie Mury i Walentkowa Grań', '50:37', 'tatry', 'Film', { expeditionId: 'liptowskie-mury-2026', searchTerms: 'Szpiglasowy Wierch Walentkowy Wierch Świnica Gładka Przełęcz Walentkowa Przełęcz 17 godzin' }),
  video('gvqi4hp7jvU', 'Żabi Koń · Jarzębinka', '19:23', 'jura', 'Film', { searchTerms: 'Dolina Kobylańska wspinaczka' }),
  video('6mrnhsbePJo', 'Dolina Kobylańska', '1:14', 'jura', 'Krótki film', { searchTerms: 'wspinaczka' }),
  video('rs4zN-7f60Q', 'Kościelec zimą · Żleb Zaruskiego', '24:12', 'tatry', 'Film', { expeditionId: 'koscielec-2026' }),
  video('QRSSYlhRGMM', 'Kościelec zimą', '1:57', 'tatry', 'Krótki film', { id: 'film-koscielec', expeditionId: 'koscielec-2026', publishedAt: '2026-03-15', homepageOrder: 2, homepageThumbnail: '/images/optimized/koscielec-thumb-960.webp', shortDescription: 'Krótki film z zimowego wejścia przez Żleb Zaruskiego.' }),
  video('7x1YlCGZvtI', 'Kończysta zimą', '24:59', 'tatry', 'Film', { expeditionId: 'konczysta-2026' }),
  video('IxTLYy6bOKo', 'Kieżmarski Szczyt zimą', '28:21', 'tatry', 'Film', { searchTerms: 'Huncowski Szczyt', expeditionId: 'kiezmarski-szczyt-zima-2025' }),
  video('0AtU5c83Y0M', 'Baranie Rogi zimą', '26:39', 'tatry', 'Film', { expeditionId: 'baranie-rogi-zima-2025' }),
  video('sRjEFylb_b8', 'Szatan zimą', '23:23', 'tatry'),
  video('ksi5aauYYBo', 'Bettmerhorn · Aletschgletscher', '14:57', 'szwajcaria', 'Film', { expeditionId: 'szwajcaria-2025', series: 'Szwajcaria · 06' }),
  video('nt6Upyoop1g', 'Zermatt · Szlak Pięciu Jezior', '16:04', 'szwajcaria', 'Film', { expeditionId: 'szwajcaria-2025', series: 'Szwajcaria · 05', searchTerms: 'Matterhorn 5 jezior' }),
  video('qOHEK1qbjIU', 'Via ferrata Mürren–Gimmelwald', '24:15', 'szwajcaria', 'Film', { expeditionId: 'szwajcaria-2025', series: 'Szwajcaria · 04' }),
  video('1b1K6CUmHMI', 'Augstmatthorn', '19:02', 'szwajcaria', 'Film', { expeditionId: 'szwajcaria-2025', series: 'Szwajcaria · 03' }),
  video('KuZoxTnOmLs', 'Fronalpstock', '22:13', 'szwajcaria', 'Film', { expeditionId: 'szwajcaria-2025', series: 'Szwajcaria · 02' }),
  video('BZOKvQHvtCk', 'Saxer Lücke', '15:37', 'szwajcaria', 'Film', { expeditionId: 'szwajcaria-2025', series: 'Szwajcaria · 01' }),
  video('lLCsa85MWzU', 'Switzerland Peace', '3:03', 'szwajcaria', 'Krótki film', { id: 'film-switzerland-cinematic', expeditionId: 'szwajcaria-2025' }),
  video('BJC4tc71d50', 'Świnica przez Zawrat', '16:44', 'tatry', 'Film', { expeditionId: 'swinica-2025' }),
  video('04seL_yl4f0', 'Pośrednia Grań', '29:53', 'tatry'),
  video('PWbLPcNAh34', 'Mięguszowiecki Szczyt Wielki', '37:07', 'tatry'),
  video('zb8zqv8gpZk', 'Łomnica', '18:53', 'tatry', 'Film', { id: 'film-lomnica', publishedAt: '2025-07-18', homepageOrder: 1, homepageThumbnail: '/assets/thumbnails/films/lomnica-thumb.jpg', shortDescription: 'Wejście przez Łomnicką Przełęcz.', searchTerms: 'Łomnicka Przełęcz Lomnický štít' }),
  video('WGqn-Kley2w', 'Durny Szczyt', '17:40', 'tatry', 'Film', { id: 'film-durny-szczyt' }),
  video('BiWk6apjJOg', 'Toubkal', '39:40', 'maroko', 'Film', { id: 'film-morocco-toubkal', expeditionId: 'maroko-2025', series: 'Maroko · 02', searchTerms: 'Atlas' }),
  video('McawfrouM_0', '10 dni w Maroku', '1:09:33', 'maroko', 'Film', { id: 'film-morocco-vlog', expeditionId: 'maroko-2025', series: 'Maroko · 01', publishedAt: '2025-06-22', homepageOrder: 3, homepageThumbnail: '/images/optimized/maroko-thumb-960.webp', shortDescription: 'Rabat, Fez, Sahara i Marrakesz. Pierwsza część podróży.', searchTerms: 'Sahara Rabat Fez Marrakesz Marakesz' }),
  video('jTsfNdsWHxg', 'Wysoka zimą', '12:52', 'tatry'),
]

export const filmRegions = [
  { id: 'wszystkie', label: 'Wszystkie' }, { id: 'tatry', label: 'Tatry' },
  { id: 'szwajcaria', label: 'Szwajcaria' }, { id: 'alpy', label: 'Alpy' },
  { id: 'jura', label: 'Jura' }, { id: 'maroko', label: 'Maroko' },
]
export const filmRegionLabel = (id) => filmRegions.find(region => region.id === id)?.label || ''
export const findFilm = (id) => filmCatalog.find(film => film.youtubeId === id || film.id === id)
export const normalizeFilmSearch = (value) => value.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l')
export const filterFilms = (region, query) => {
  const terms = normalizeFilmSearch(query).trim().split(/\s+/).filter(Boolean)
  return filmCatalog.filter(film => (region === 'wszystkie' || filmMatchesRegion(film, region)) && terms.every(term => normalizeFilmSearch(`${film.title} ${filmRegionLabel(film.region)} ${film.format} ${film.series || ''} ${film.searchTerms || ''}`).includes(term)))
}
