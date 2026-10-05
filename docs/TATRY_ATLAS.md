# Tatry — przesuwana mapa terenu

Aktualizacja: mapa ma obecnie 26 punktów szczytów i dwa przejścia grani.
Nowe miejsca i źródła opisuje `ATLAS_ADDITIONAL_PLACES.md`.
Poniższe liczby odnoszą się do pierwotnego etapu wdrożenia mapy.

Bieżący etap lokalny z 4 października 2026. Podgląd: `/mapa?atlas=tatry`. Użytkownik odrzucił wcześniejszy schemat z siatką i liczbowymi grupami, wybierając: „Mapa terenu oglądana z góry, z przesuwaniem i przybliżaniem”. Ten dokument zastępuje opis tamtego wariantu. Nie opublikowano na domenie.

## Działanie

- Rzeczywisty podkład topograficzny z rzeźbą terenu, poziomicami i nazwami geograficznymi. Naturalne kolory domyślnie; opcjonalna ciemna paleta. Złote znaczniki i kontrolki zachowują styl strony.
- Przeciąganie myszą lub jednym palcem, przybliżanie dwoma palcami, przyciski +/−, dwuklik oraz Ctrl/Cmd + kółko. Zwykłe kółko nadal przewija stronę.
- Powrót „Całe Tatry”, skala w metrach/kilometrach oraz natywny pełny ekran, gdy przeglądarka go obsługuje. Escape obsługuje przeglądarka. Brak osobnego systemu okien modalnych.
- Dostęp z klawiatury: strzałki przesuwają, +/− zmieniają skalę, Home pokazuje całe Tatry. Przycisk grupy po przybliżeniu oddaje fokus na mapę. Niepełne znaczniki na krawędzi nie wchodzą do kolejności Tab.
- 22 szczyty ze źródłowymi współrzędnymi OSM. Bliskie punkty mają dyskretny znak warstw zamiast liczby. Kliknięcie przybliża teren aż do rozdzielenia szczytów. Każdy obecny szczyt daje się wybrać osobno przy maksymalnej skali. Dla przyszłych pokrywających się punktów istnieje dodatkowy wybór nazwy.
- Dodatkowa etykieta pojawia się tylko dla wskazanego lub wybranego miejsca. Jej szerokość dopasowuje się do nazwy; nie rozpycha innych etykiet. Nazwy na samym podkładzie pozostają częścią kartografii dostawcy.
- Wyszukiwarka bez polskich znaków, filtr „Z materiałami” i alfabetyczna lista działają niezależnie od kadru mapy. Wybór szczytu z listy pokazuje go i przenosi fokus na mapę; wybór przejścia grani pokazuje panel materiałów.
- Liptowskie Mury są przejściem grani na liście, bez wymyślonej pinezki lub trasy. Dane pozostają: 23 miejsca, 14 z materiałami, 16 filmów, 2 galerie i 45 zdjęć.
- Wybór miejsca zachowuje adres `?atlas=...`, historię Wstecz i bezpośrednie linki do galerii/wypraw/filmów. Ten sam komponent jest używany na `/mapa` i stronie głównej.

## Podkład i dane

Podkład: [Top-O-Map](https://top-o-map.com/), którego oficjalna strona podaje integrację `https://tile.top-o-map.com/{z}/{x}/{y}.png`. Kartografia OpenTopoMap, dane OpenStreetMap/SRTM. Widoczne na mapie linki atrybucji: OpenStreetMap, SRTM, OpenTopoMap (CC BY-SA), Top-O-Map.

`src/data/tatryAtlas.js` zawiera współrzędne 22 szczytów i URL konkretnego węzła OpenStreetMap. Dane © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright). Zweryfikowano 2026-10-04 publicznym Nominatim, z ograniczeniem do Tatr i odstępem ponad sekundę między zapytaniami. Surowe odpowiedzi: `work/private/tatry-osm-verification.json`. Spośród niejednoznacznych wyników wybrano szczyty, a nie ściany: Rysy — wierzchołek graniczny Polski; Świnica — główny wierzchołek; Wysoka — południowo-wschodni wierzchołek, nie Mała Wysoka. Dotychczasowe dane Wikidata zachowano w kopii poprzedniego etapu.

## Implementacja i zachowanie przy słabym połączeniu

`TatryTerrainMap.jsx` korzysta z React, Pointer Events, ResizeObserver i wspólnej projekcji Web Mercator dla obrazu oraz znaczników. Obliczenia są w `terrainMap.js`. Nie dodano bibliotek, kluczy ani płatnych kont. Zależności i oryginalne SVG/projekcje pozostają niezmienione.

Pobierane są wyłącznie kafelki bieżącego okna. Poziom rastra jest najbliższy aktualnej skali, żeby ograniczyć rozmycie. Zwykła pamięć podręczna przeglądarki respektuje nagłówki serwera. Podczas zmiany skali poprzednio wczytany fragment jest przeliczany pod nową kamerę do czasu załadowania nowego poziomu; nie pobieramy mapy na zapas ani do trybu offline. Widoczne są stan ładowania, informacja o błędzie i przycisk ponowienia. Lista i materiały pozostają dostępne, gdy podkład nie działa.

Podkład wymaga połączenia z zewnętrznym serwerem kafelków. Nie przesyłamy galerii, danych prywatnych ani lokalizacji urządzenia. Nie dodano geolokalizacji ani fikcyjnego przebiegu wypraw. To przegląd materiałów z podróży, bez funkcji planowania tras.

## Walidacja

- `node scripts/check-tatry.mjs`: kompletność 22 szczytów, odwracalność projekcji, zgodność kafelków z markerami, pokrycie okna, zoom wokół kursora, zachowanie punktu pod przesuwanym środkiem gestu, limity skali i dostępność każdego szczytu przy 4 szerokościach.
- `node scripts/check-atlas.mjs`: rejestr 54 miejsc, linki materiałów, wyszukiwanie i odcisk oryginalnego SVG.
- `npm run build` oraz kontrola galerii: 4 galerie, 129 zdjęć, 258 WebP; oryginały map i zależności zachowane.
- Przeglądarka: przeciąganie przesuwało markery dokładnie o wykonany ruch; przybliżanie, rozwijanie bliskich szczytów przez Enter, wybór Kończystej/Łomnicy/Żabiego Konia, wyszukiwanie „zabi”, film, historia Wstecz i pełny ekran działały.
- Responsywność 390 i 320 px: brak poziomego przepełnienia, 44-pikselowe przyciski sterowania, zaznaczenie szczytu i przejście do materiałów. Wielodotyk zweryfikowano na poziomie geometrii gestu; fizyczny telefon nie był dostępny.

## Dalszy rozwój

Nowy szczyt wymaga wpisu w rejestrze treści i zweryfikowanych współrzędnych w `tatryAtlas.js`. Materiały i lista aktualizują się z rejestru. Nie dopisywać statusu „odwiedzone” ani rysować trasy na podstawie samej nazwy folderu. Oryginalny format sprzed tej zmiany zachowano w `work/private/milestones/tatry-clusters-reviewed`.
