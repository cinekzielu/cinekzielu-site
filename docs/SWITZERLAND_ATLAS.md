# Mapa Szwajcarii

Aktualizacja: widok kraju został zastąpiony wspólną mapą terenu obejmującą różne lata. Aktualne zachowanie opisuje [UNIFIED_ATLAS.md](UNIFIED_ATLAS.md). Poniżej zachowano dokumentację poprzedniego etapu i źródeł sześciu punktów.

Lokalny etap z 4 października 2026. Podgląd: http://127.0.0.1:8767/mapa?atlas=switzerland. Publikacja i przygotowanie publikacji pozostają odłożone przez użytkownika.

## Zachowanie

- Europa → Szwajcaria otwiera osobną mapę kraju. Działa też szybki wybór, wyszukiwarka i dotychczasowe adresy sześciu miejsc.
- Saxer Lücke, Fronalpstock, Augstmatthorn, Mürren–Gimmelwald, Zermatt i Bettmerhorn mają ikony, własne filmy oraz odnośnik do istniejącej galerii Szwajcaria 2025.
- Widok kraju obejmuje 7 filmów i galerię 36 zdjęć. Panel miejsca pokazuje jego film, a galerię podpisuje „Zdjęcia z całej podróży”. Nie przypisujemy wszystkich zdjęć do każdego szczytu.
- Przyciski mają pola dotyku 44 px. Na małym ekranie podpisy są rozsunięte; cienkie linie prowadzą od przycisków do rzeczywistych punktów geograficznych. Te linie nie oznaczają trasy.
- Działa wspólne powiększanie, przewijanie powiększonej mapy, powrót do Europy, historia przeglądarki i klawiatura. Na telefonie przycisk „Materiały” przenosi fokus do panelu miejsca.
- Zachowano ciemną paletę atlasu, identyfikatory i wszystkie wcześniejsze mapy. Bez nowych bibliotek, wypraw, galerii ani zdjęć.

## Materiały i źródła

Powiązania opierają się na istniejącym katalogu. Tytuły i autorstwo 7 filmów zostały ponownie sprawdzone przez oficjalny YouTube oEmbed:

| Miejsce | Film |
| --- | --- |
| Saxer Lücke | [Szwajcaria #1](https://www.youtube.com/watch?v=BZOKvQHvtCk) |
| Fronalpstock | [Szwajcaria #2](https://www.youtube.com/watch?v=KuZoxTnOmLs) |
| Augstmatthorn | [Szwajcaria #3](https://www.youtube.com/watch?v=1b1K6CUmHMI) |
| Mürren–Gimmelwald | [Szwajcaria #4](https://www.youtube.com/watch?v=qOHEK1qbjIU) |
| Zermatt | [Szwajcaria #5](https://www.youtube.com/watch?v=nt6Upyoop1g) |
| Bettmerhorn | [Szwajcaria #6](https://www.youtube.com/watch?v=ksi5aauYYBo) |
| Cała podróż | [Switzerland Peace](https://www.youtube.com/watch?v=lLCsa85MWzU) |

Granice: Natural Earth Admin 0 1:50m. Wybrane większe jeziora: Natural Earth 1:10m. Dane public domain, zapisane jako statyczne ścieżki SVG w `switzerlandMapPaths.json`. Nie jest to pełna mapa jezior ani mapa nawigacyjna. Projekcja i jej parametry znajdują się w tym samym pliku; test sprawdza zgodność przeliczenia pozycji miejsc.

Punkty nazw geograficznych: [swisstopo swissNAMES3D](https://www.swisstopo.admin.ch/en/landscape-model-swissnames3d), przez [SearchServer geo.admin.ch](https://docs.geo.admin.ch/). Źródło zapytania i identyfikator rekordu są zapisane przy każdym miejscu w `switzerlandPlaces.js`. Fronalpstock zweryfikowany jako szczyt koło Morschach w Schwyz, nie szczyt o tej samej nazwie w Glarus.

Mürren i Zermatt są punktami miejscowości, nie dokładnym wejściem na via ferratę ani początkiem Szlaku Pięciu Jezior. Nie rekonstruowano śladu GPS, dat dziennych ani dodatkowych odwiedzin. Surowe odpowiedzi źródeł i kopie przed zmianami przechowywane są poza publicznym repozytorium.

## Sprawdzenie

Build oraz kontrole `check-switzerland.mjs`, `check-atlas.mjs`, `check-site-tools.mjs`, `check-tatry.mjs`, `check-release.mjs` (29 stron przez HTTP) i `git diff --check`: poprawne.

Testy Szwajcarii obejmują zachowanie sześciu ID, rodziców, odnośników, wyników wyszukiwania, właściwych filmów, projekcji i rozdzielonych pól dotyku przy sześciu szerokościach. Odciski 15 chronionych plików poprzednich map, katalogów, odtwarzacza i zależności pozostały bez zmian.

Przeglądarka: komputer, emulowane 320 i 390 px, wybór miejsc, brak poziomego przepełnienia, powiększenie/reset, wejście z Europy i powrót, historia wstecz/dalej, wybór klawiaturą i mobilne przejście do materiałów. Film Zermatt odtworzony z mapy i zamknięty z przywróceniem fokusu. Brak zaobserwowanych błędów konsoli aplikacji. Nie testowano odtwarzania wszystkich 7 filmów ani fizycznego telefonu.
