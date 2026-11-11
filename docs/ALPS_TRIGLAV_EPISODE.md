# Across the Alps — Triglav, odcinek 1/5

Dodano pierwszy pełny odcinek serii do istniejącej wyprawy, biblioteki filmów,
galerii, Triglavu na mapie i w spisie szczytów oraz wyróżnienia Alp na stronie
głównej. Zwiastun pozostaje dostępny; pozostałe cztery odcinki pozostają
w przygotowaniu.

## Zweryfikowane źródło

- Film autora: https://www.youtube.com/watch?v=C8weHwRNLiE
- Tytuł na YouTube: „Triglav 2864 m | Across the Alps 1/5”.
- Długość: 39:33. Publikacja: 11 listopada 2026.
- Kanał, tytuł, długość, data i rozdziały sprawdzone w rozwiniętym opisie
  filmu 11 listopada 2026. Data publikacji nie zastępuje daty wejścia:
  istniejące zdjęcia i GPX nadal wskazują 18 sierpnia 2026.

| Czas | Rozdział |
| --- | --- |
| 00:00 | Intro |
| 00:57 | Podróż do Słowenii |
| 03:27 | Biwak przed Triglavem |
| 10:15 | Atak szczytowy |
| 24:38 | Triglav |
| 38:02 | Droga pod Grossglockner |

## Powiązania

`alpsEpisodes.js` jest wspólnym źródłem metadanych odcinka. Film odsyła do
rozdziału Triglav, zdjęć tego etapu i jego zapisu GPX. Jest widoczny dla
Słowenii, Alp i Europy, bez automatycznego przypisywania do pozostałych
państw i szczytów całej wyprawy. Wyszukiwanie i odtwarzacz używają tych
samych powiązań. Mapa Triglavu otwiera rozdział od 24:38.

Nie zmieniono geometrii map, materiałów fotograficznych, dat wejść ani
układu strony głównej. Liczba fotografii na stronie wyprawy jest pobierana
z galerii (52) zamiast wcześniejszej stałej wartości 48.

## Kontrola

- Build: 57 stron i 404 warianty udostępniania.
- 61 kontroli danych i integracji przeszło. Trzy starsze kontrole liczby
  stron uwzględniają teraz stronę studia fotografii dodaną wcześniej w PR190.
- Kontrola filmu w bibliotece, zdjęć etapu, mapy, wyszukiwania i zakresu
  geograficznego; pozostałe filmy i zwiastun zachowane.
- Przeglądarka: komputer 1280 px i emulowane 390/320 px. Sprawdzono
  rzeczywiste odtwarzanie osadzonego filmu, start od 24:38, powrót do
  początku oraz przejście do galerii Triglavu. Brak zaobserwowanych błędów
  aplikacji i poziomego przepełnienia.
- Nie sprawdzano fizycznego telefonu ani Safari/Firefox.

Pakiet powstał z aktualnego main po PR190, bez nieopublikowanych dodatków
innego lokalnego podglądu (szczyty, atlas i sezony).
