# Wspólny atlas krajów, obszarów i lat

Etap lokalny z 4 października 2026, wykonany na prośbę użytkownika o oddzielenie geografii od kolejnych wypraw. Zastępuje jednoroczną mapę Szwajcarii oraz statyczny widok kraju Maroko. Świat, Europa i Afryka zachowują dotychczasowy styl i geometrię. Publikacja nadal odłożona.

## Nawigacja

- Świat i kontynenty: autorski przegląd atlasu.
- Kraje: wspólny podkład terenu, przesuwanie, przybliżanie, grupowanie punktów i przełącznik kolorów. Kraje bez materiałów nie stają się automatycznie odwiedzone.
- Regiony, w tym Tatry, Alpy i Atlas Wysoki: osobne obszary, niezależne od granic państw. Tatry zachowują zaakceptowaną listę i wyszukiwarkę szczytów.
- Wybór punktu z mapy kraju lub Alp zachowuje bieżący obszar. Adres `?atlas=saxer-lucke&rok=2025&obszar=alpy` otwiera ten sam punkt w Alpach. Dotychczasowe adresy bez `obszar` zachowują naturalny kraj/region.
- Rok filtruje punkty, listę i panel materiałów. „Wszystkie lata” jest domyślne. Nieznane lata podróży nie są zgadywane na podstawie dat publikacji filmów.

## Powiązania treści

`tripGeography.js` opisuje przynależność wyprawy do krajów i obszarów. Jedna wyprawa może należeć do kilku widoków, bez kopiowania zdjęć i filmów. Filtry galerii, wypraw, filmów i wyszukiwanie korzystają z tych samych powiązań.

Użytkownik potwierdził, że Across the Alps 2026 obejmowało Szwajcarię. Dlatego oba widoki, Szwajcaria oraz Alpy, obejmują:

| Rok | Wyprawa | Filmy | Zdjęcia w galerii |
| --- | --- | --- | --- |
| 2025 | Szwajcaria | 7 | 36 |
| 2026 | Alpy / Across the Alps | 1 zwiastun | 48 |
| Wszystkie | 2 wyprawy | 8 | 84 |

To liczby materiałów z powiązanych wypraw, nie twierdzenie, że każdy kadr wielokrajowej wyprawy wykonano w jednym kraju. Sześć dotychczasowych punktów Szwajcarii pozostaje powiązanych wyłącznie ze swoimi filmami z 2025. Dla Across the Alps nie dodano niepotwierdzonych punktów, szczytów ani śladu GPS; w 2026 widoczny jest podkład kraju i istniejące materiały wyprawy.

`placeGeography.js` łączy istniejące punkty Tatr z Polską/Słowacją, a szczyty graniczne z oboma krajami. Panel kraju uwzględnia filmy i galerie swoich punktów. Globalne zbiory pozostają bez duplikatów: 73 węzły atlasu, 100 wyników indeksu, 28 filmów, 11 galerii i 220 zdjęć.

## Podkład i geometria

Pozostaje [Top-O-Map](https://top-o-map.com/) z danymi OpenStreetMap, atrybucją OpenTopoMap/SRTM i dotychczasowym mechanizmem kafelków. Oficjalna strona potwierdza globalny zasięg i podaje używany szablon URL. Nie dodano bibliotek, innego dostawcy, pobierania map offline ani wstępnego pobierania kafelków. Ładowany jest widoczny kadr; wcześniej wczytane kafelki pozostają na czas zmiany skali. Dostępna jest obsługa błędu i ponowienie.

Kadry krajów w `terrainCountryBounds.js` pochodzą z Natural Earth Admin 0 1:50m; dla Francji użyto kadru metropolitalnego, dla Norwegii wyłączono Svalbard. To granice kadru, nie obrysy do nawigacji ani dowód odwiedzin. Kadry Alp, Jury i Gorców są poglądowymi prostokątami obszarów. Tylko istniejące punkty ze źródłami mają znaczniki. Oryginalne SVG, tła, lokalizacje i statyczne pliki wcześniejszych map krajów są zachowane; mapy krajów SVG nie są już importowane przez aktywny atlas.

## Kontrola

### Obrys wybranego kraju

Kolejna uwaga użytkownika: przy wyborze Polski, Szwajcarii i pozostałych krajów ich granice mają wyróżniać się na podkładzie. Wszystkie 14 istniejących krajów otrzymało złoty obrys oraz delikatne przyciemnienie terenu poza krajem. Na naturalnym podkładzie linia jest ciemniejsza, z jasną obwódką. Wybór punktu zachowuje obrys bieżącego kraju. Tatry, Alpy i pozostałe regiony pozostają niezależnymi obszarami bez arbitralnego wyróżnienia jednego państwa.

Dane: [Natural Earth Admin 0 Countries 1:10m](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/), domena publiczna, z oficjalnego repozytorium `nvkelso/natural-earth-vector`. Zachowano pierścienie, wyspy i otwory. Francja obejmuje część metropolitalną z Korsyką; Norwegia, zgodnie z dotychczasowym kadrem, nie obejmuje Svalbardu. To zgeneralizowana kartografia do atlasu, a nie dokładny przebieg granicy do nawigacji przy największych powiększeniach.

Osobne pliki `public/assets/maps/country-outlines/*.json` są pobierane tylko dla wybranego kraju i przechowywane w pamięci. Nie powiększają początkowego pakietu JavaScript. `CountryOutline.jsx` używa tej samej projekcji Web Mercator co kafelki i znaczniki; przesuwanie i zoom zmieniają widok SVG bez przeliczania geometrii. Warstwa nie przechwytuje kliknięć. Nieudane pobranie obrysu nie blokuje mapy ani punktów.

Kontrola tego uzupełnienia: build, `check-country-outlines.mjs`, `check-unified-atlas.mjs`, `check-atlas.mjs`, `check-tatry.mjs` i `git diff --check`. Nowy test sprawdza kompletność 14 krajów, domknięcie geometrii, przynależność punktów kontrolnych oraz zgodność współrzędnych po przesuwaniu i przybliżaniu przy różnych rozmiarach ekranu. Przeglądarka: Polska i Szwajcaria na komputerze, Polska na obu podkładach, powiększenie grupy punktów i wybór Kościelca w kontekście Polski, przesuwanie klawiaturą, Słowenia przy 320 px, Szwajcaria przy 390 px i brak obrysu państwa w Alpach. Brak poziomego przepełnienia i zaobserwowanych błędów aplikacji. Wymiary telefonu emulowane.

Build oraz `check-unified-atlas.mjs`, `check-atlas.mjs`, `check-tatry.mjs`, `check-switzerland.mjs`, `check-site-tools.mjs`, `check-release.mjs` (29 stron przez HTTP) i `git diff --check`: poprawne.

Nowe kontrole sprawdzają wszystkie kadry krajów przy trzech szerokościach, filtry 2025/2026, brak niepotwierdzonych punktów 2026, brak duplikatów, przypisanie materiałów punktów do krajów, kontekst adresów oraz wspólne filtry i wyszukiwanie „Szwajcaria 2026”. Dotychczasowe testy Mercatora, gestów, kafelków i rozdziałów Maroka pozostają aktywne.

Przeglądarka: widok komputera oraz emulowane 320/390 px; wejście Europa → Polska i Tatry, Szwajcaria → Alpy, wybór i przeładowanie punktu w kontekście Alp, zmiana roku po wyborze punktu, historia wstecz/dalej, grupowanie, powiększenie/reset, klawiatura, mobilny fokus materiałów i link Rabatu do 05:54. Kafelki poprawnie załadowane; brak zaobserwowanych błędów aplikacji i poziomego przepełnienia. Telefon nie był urządzeniem fizycznym.

Podgląd: http://127.0.0.1:8767/mapa?atlas=switzerland oraz http://127.0.0.1:8767/mapa?atlas=alpy.
