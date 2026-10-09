# Alpy 2026 — Across the Alps

Zmiana przygotowana 9 października 2026 na bazie `d42ed2ccacf524d867b71b49ac8a0a703316c9f2` (PR #154).

## Stan zastany i zakres

`/wyprawy/alpy-2026` i galeria 48 fotografii istniały już w `main`.
Katalog widoczny pod `/wyprawy` korzysta z `expeditionPages.js`; starszy
`expeditionsData.js` nie zawierał tego projektu. Rozbudowano istniejącą stronę
i dodano powiązany wpis do starszego katalogu, zachowując adres i jedną pozycję
w liście wypraw. Nie powstała druga strona Alp.

Strona zawiera teraz nazwę Across the Alps, podsumowanie wyprawy, pięć szczytów,
plan serii filmowej, istniejącą zapowiedź sprzed wyjazdu oraz dotychczasowe
fotografie. Zachowuje czarno-złotą stylistykę i wspólny szablon stron wypraw.
Nazwy wszystkich pięciu szczytów prowadzą w wyszukiwarce do projektu.

## Potwierdzone dane i materiały

- Dane przekazane przez właściciela w zadaniu z 9 października 2026:
  sierpień 2026; Triglav, Grossglockner, Zugspitze, Grauspitz i Dufourspitze;
  119,98 km, 11 385 m przewyższeń, 51 godzin 35 minut aktywności.
- Statystyki dotyczą całej wyprawy. Nie przypisano ich poszczególnym szczytom
  ani jednemu ciągłemu przejściu.
- Wykorzystano istniejące 48 zdjęć i responsywne eksporty z
  `public/assets/photos/galleries/alpy-2026/`. Zachowano opisy alternatywne,
  okładkę i kolejność. Nie przypisano zdjęć do szczytów na podstawie domysłów.
- Nowe materiały: trailer, pięć odcinków i bonus — w przygotowaniu.
  Brak dat premier, identyfikatorów YouTube, miniatur i aktywnych odtwarzaczy.
- Istniejący `l3KltGrKz2U` to **zapowiedź sprzed wyprawy**, datowana na
  15 lipca 2026. Jej wcześniejszą weryfikację na kanale właściciela dokumentuje
  [GALLERY_INTEGRATION.md](GALLERY_INTEGRATION.md). Zachowano istniejący link,
  oddzielając go od powstającej serii. Nie utożsamiono go z nowym trailerem.
  Dostępność YouTube nie została ponownie potwierdzona w tej sesji.

## Atlas, adresy i dalsza publikacja

Wspólne dane projektu znajdują się w `src/data/alpsProject.js`.
Status opublikowanej strony jest niezależny od zakończonej wyprawy i montażu
filmów. Odnośniki projektu otwierają `/mapa?atlas=alpy&rok=2026`; istniejący
panel atlasu prowadzi z powrotem do projektu i galerii. Nie zmieniono geometrii,
markerów, współrzędnych, śladów tras ani funkcji kopiowania widoku atlasu.

Każde miejsce na przyszły materiał ma stabilne `id` i puste `filmId`.
Po publikacji zweryfikuj film i dodaj go do istniejącego `filmCatalog.js`
z `expeditionId: 'alpy-2026'`. Następnie przypisz jego `filmId` do właściwej
pozycji `alpsProject.films` i dodaj go do `galleryData.js`, aby był dostępny
także w galerii. Projekt pokaże link tylko dla opublikowanego filmu
przypisanego do tej wyprawy. Uaktualnij tekst o postępie montażu, gdy zmieni
się stan całej serii. Nie dodawaj oczekujących odcinków do katalogu
opublikowanych filmów.

## Weryfikacja

- `npm run build` — poprawna kompilacja i statyczne metadane 33 stron.
- `node scripts/check-alps-project.mjs` — jedna pozycja projektu w katalogach,
  powiązanie 48 zdjęć, wyszukiwanie nazw pięciu szczytów, atlas z rokiem 2026,
  kanoniczny adres, brak odtwarzaczy dla siedmiu oczekujących materiałów,
  obsługa przyszłych zweryfikowanych linków i render wszystkich 15 stron wypraw.
- Istniejące kontrole: `check-atlas.mjs`, `check-atlas-view-state.mjs`,
  `check-unified-atlas.mjs`, `check-site-tools.mjs`,
  `check-photo-film-separation.mjs`, `check-release.mjs` — poprawne.
- `git diff --check` — poprawny.

Test renderowania używa React po stronie Node z prostą atrapą `matchMedia`
dla istniejącej siatki zdjęć; nie jest testem przeglądarkowym. Przed scaleniem
warto obejrzeć stronę na komputerze i telefonie, zwłaszcza szerokości 320,
390 i 768 px, oraz przejścia projekt → atlas/galeria → projekt i kotwice serii.
W tej sesji narzędzie do przeglądarkowego podglądu nie było dostępne.

Nie zmieniono zależności ani ustawień hostingu. Zmiana jest przeznaczona do
przeglądu w osobnym pull requeście; nie została scalona ani wdrożona przez agenta.
