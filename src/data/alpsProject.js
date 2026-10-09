// Expedition facts and production scope confirmed by the owner on 2026-10-09.
// No summit coordinates, route details, individual dates or photo assignments inferred.
const summits = [
  { id: 'triglav', name: 'Triglav' },
  { id: 'grossglockner', name: 'Grossglockner' },
  { id: 'zugspitze', name: 'Zugspitze' },
  { id: 'grauspitz', name: 'Grauspitz' },
  { id: 'dufourspitze', name: 'Dufourspitze' },
]

export const alpsProject = {
  id: 'alpy-2026',
  name: 'Across the Alps',
  description: 'Across the Alps — pięć zdobytych szczytów podczas jednej wyprawy w sierpniu 2026. Triglav, Grossglockner, Zugspitze, Grauspitz i Dufourspitze. Teraz powstaje seria filmowa z wyjazdu.',
  expeditionStatus: 'completed',
  productionStatus: 'in-production',
  stats: [
    { label: 'Zdobyte szczyty', value: '5' },
    { label: 'Dystans łącznie', value: '119,98', unit: 'km' },
    { label: 'Przewyższenia łącznie', value: '11 385', unit: 'm' },
    { label: 'Czas aktywności', value: '51', unit: 'godz. 35 min' },
  ],
  summits,
  atlas: { id: 'alpy', year: '2026' },
  // This is the existing pre-expedition teaser, not the forthcoming series trailer.
  // Source: docs/GALLERY_INTEGRATION.md, verified on the author's channel 2026-10-04.
  preTripFilmId: 'l3KltGrKz2U',
  preTripFilmNote: 'Zapowiedź projektu opublikowana 15 lipca 2026, przed wyjazdem. Materiały z sierpniowej wyprawy są w przygotowaniu.',
  // Connect a slot to filmCatalog with a verified filmId only after publication.
  // Null IDs deliberately do not create YouTube links, thumbnails or playable cards.
  films: [
    { id: 'trailer', title: 'Trailer wyprawy', label: 'Zwiastun', filmId: null },
    ...summits.map(summit => ({ id: summit.id, title: summit.name, label: 'Odcinek', filmId: null })),
    { id: 'bonus', title: 'Materiał dodatkowy', label: 'Bonus', filmId: null },
  ],
}
