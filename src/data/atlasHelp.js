// Examples use existing atlas locations and years; no new journey data.
export const atlasHelpViews = [
  { label: 'Tatry · 2025', href: '/mapa?atlas=tatry&rok=2025' },
  { label: 'Alpy · 2026', href: '/mapa?atlas=alpy&rok=2026' },
  { label: 'Gerlach · 2025', href: '/mapa?atlas=gerlach&rok=2025' },
]

export const atlasHelpTopics = [
  {
    title: 'Wybierz miejsce i rok',
    text: 'Zacznij od kraju lub pasma, potem wybierz miejsce na mapie albo wyszukaj je po nazwie. Możesz połączyć region z nazwą, np. „Alpy Triglav”. Pole „Rok wyprawy” zawęża materiały. „Wszystkie lata” przywraca pełny wybór.',
  },
  {
    title: 'Otwórz materiały lub trasę',
    text: 'Panel wybranego miejsca prowadzi do wypraw, fotografii, filmów i dostępnych zapisów GPX. W katalogu tras możesz wybrać przejście i obejrzeć jego profil wysokości.',
    link: { label: 'Przejdź do katalogu tras', href: '/trasy' },
  },
  {
    title: 'Zachowaj kadr mapy',
    text: 'Na mapie terenu ustaw przybliżenie i podkład, a następnie wybierz „Kopiuj widok”. Link zachowuje miejsce, rok, filtry oraz kadr. Gdy kopiowanie jest niedostępne, skopiuj link z wyświetlonego pola.',
  },
  {
    title: 'Gdy nie widzisz materiałów',
    text: 'Wybierz wszystkie lata lub wyłącz filtr „Z materiałami”, jeśli jest widoczny. Nie każde miejsce ma zapis GPX. Gwiazda z opisem „w planach” oznacza cel, a nie zrealizowane wejście.',
  },
]
