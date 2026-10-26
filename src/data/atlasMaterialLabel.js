const countLabel = (count, one, few, many) => `${count} ${count === 1 ? one : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? few : many}`

// GPX recordings are materials too, even without a film or photo expedition.
export function atlasMaterialLabel({ galleries, films, routes }) {
  return [
    galleries.length && countLabel(galleries.length, 'wyprawa', 'wyprawy', 'wypraw'),
    films.length && countLabel(films.length, 'film', 'filmy', 'filmów'),
    routes.length && `${routes.length} GPX`,
  ].filter(Boolean).join(' · ') || 'Brak materiałów'
}
