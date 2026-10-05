# Maroko, Afryka i obrysy kontynentów

Aktualizacja: Maroko korzysta teraz ze wspólnej mapy terenu krajów. Punkty i czasy rozdziałów pozostały zachowane. Aktualne zachowanie opisuje [UNIFIED_ATLAS.md](UNIFIED_ATLAS.md); poniżej dokumentacja poprzedniego etapu i źródeł.

Lokalny etap z 4 października 2026. Podgląd: http://127.0.0.1:8767/mapa?atlas=morocco. Bez publikacji.

## Zachowanie

- Świat → Afryka → Maroko otwiera trzy osobne widoki. Odnośnik do kraju działa też z szybkiego wyboru i wyszukiwarki.
- Maroko pokazuje dziewięć ikon miejsc i grupę Atlas Wysoki. Grupa otwiera mapę terenu z Imlil, schroniskiem i Toubkalem. Łącznie 12 miejsc z opisów filmów.
- Wybranie miejsca zmienia panel materiałów. Link YouTube prowadzi do potwierdzonego rozdziału filmu, którego czas jest widoczny w panelu. Rabat i Fez współdzielą rozdział; podobnie Warzazat i Ajt Bin Haddu.
- Ikony mają pola dotyku 44 px. Odsunięte ikony łączą się cienką linią z punktem geograficznym. Azrou i Merzouga oznaczają miejscowości/okolice; opis filmu nie wskazuje dokładnego leśnego przystanku ani obozowiska.
- Atlas Wysoki korzysta z istniejącego mechanizmu mapy terenu, z przesuwaniem, przybliżaniem, wyborem kolorów i obsługą niedostępnego podkładu. Domyślna konfiguracja Tatr pozostaje zachowana. Nie narysowano domniemanej trasy GPS.
- Afryka i Maroko mają wspólne ciemne tło oraz stonowane kolory brązu i złota. Natural Earth jest statycznym SVG; dopiero zbliżenie gór pobiera widoczne kafelki terenu.

## Dowody odwiedzin i rozdziały

Opisy i rozdziały sprawdzone na kanale autora 4 października 2026:

| Miejsce | Film / czas |
| --- | --- |
| Rabat, Fez | [Maroko #1, 05:54](https://www.youtube.com/watch?v=McawfrouM_0&t=354s) |
| Azrou — okolice lasu cedrowego | [11:29](https://www.youtube.com/watch?v=McawfrouM_0&t=689s) |
| Merzouga — Sahara | [22:06](https://www.youtube.com/watch?v=McawfrouM_0&t=1326s) |
| Wąwóz Todra | [37:40](https://www.youtube.com/watch?v=McawfrouM_0&t=2260s) |
| Warzazat, Ajt Bin Haddu | [50:32](https://www.youtube.com/watch?v=McawfrouM_0&t=3032s) |
| Marrakesz | [1:00:29](https://www.youtube.com/watch?v=McawfrouM_0&t=3629s) |
| Wodospad Ouzoud | [1:02:06](https://www.youtube.com/watch?v=McawfrouM_0&t=3726s) |
| Imlil | [Toubkal / Maroko #2, 00:59](https://www.youtube.com/watch?v=BiWk6apjJOg&t=59s) |
| Refuge du Toubkal | [14:24](https://www.youtube.com/watch?v=BiWk6apjJOg&t=864s) |
| Toubkal | [25:14](https://www.youtube.com/watch?v=BiWk6apjJOg&t=1514s) |

Nie utożsamiono daty publikacji filmu z datą wyprawy. Nie dodano nowych galerii, wypraw ani filmów; stan treści to 11 galerii, 220 zdjęć, 28 filmów, 29 podstron i 73 węzły atlasu.

## Geometria i współrzędne

- Maroko: [Natural Earth Admin 0 1:50m](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson), public domain. Oddzielny plik `moroccoMapPaths.json`, projekcja zapisana w danych. Kadr obejmuje miejsca podróży na północy kraju. Afryka zachowuje poprzednią geometrię 1:110m.
- Pozycje miejsc: [GeoNames, CC BY](https://www.geonames.org/), źródła per miejsce w `moroccoPlaces.js`; Merzouga i Todra dodatkowo zweryfikowane na stronach opisujących te miejsca. Ouzoud: [Geopark M'Goun](https://geoparcmgoun.ma/discover/geosite-5).
- Zbliżenie gór: OpenStreetMap contributors, ODbL; [Imlil](https://www.openstreetmap.org/node/87828616), [Refuge CAF du Toubkal](https://www.openstreetmap.org/way/307322838), [Toubkal](https://www.openstreetmap.org/node/87828608). To współrzędne punktów geograficznych, nie ślad przejścia autora. Podkład i atrybucja takie jak w Tatrach: Top-O-Map / OpenTopoMap, OSM i SRTM.
- Kontynenty: nowe obszary nawigacji `worldRefinedPaths.json` w natywnych pikselach dotychczasowego podkładu 1672 × 941, z jego odciskiem SHA-256. Osobne wyspy i dokładniejszy przebieg przy wybrzeżach. Granica Europa–Azja ma charakter poglądowy. Ręczne pliki SVG i stare dane nakładki nie zostały zastąpione.
- Zachowane identyfikatory, pierwotne tła świata i Europy, ręczne SVG, współrzędne Tatr i blokada zależności. Brak nowych bibliotek.

## Kontrola

Build, `check-release.mjs` (29 stron przez HTTP), `check-atlas.mjs`, `check-tatry.mjs` i `git diff --check`. Kontrole atlasu obejmują spójność 12 czasów rozdziałów, powiązania filmów, węzły i nawigację, konwersję współrzędnych gór oraz punkty lądu i oceanu dla nowych obrysów świata.

Sprawdzenie przeglądarką: desktop, emulowane szerokości 320/390 px, obszary ikon, odnośniki rozdziałów, klawiatura, historia wstecz/dalej, powrót z Atlasu do Maroka, przybliżenie/reset mapy, załadowanie kafelków i mobilne przejście do materiałów. Telefon testowany przez emulację rozmiaru okna, nie na urządzeniu fizycznym.
