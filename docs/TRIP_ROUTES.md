# Trasy GPX przy wyprawach

Wydanie tras zatwierdzone przez autora 14 października 2026. Across the Alps ma zapis każdego z pięciu szczytów. Wyprawa Wysoka, Ganek i Rysy ma jedną wspólną trasę z trzema przyciskami szczytów.

| Trasa | Kotwica | Daty zapisu | Wysokość szczytu |
| --- | --- | --- | --- |
| Triglav | `/wyprawy/alpy-2026#triglav-trasa` | 18.08.2026 | 2864 m |
| Grossglockner | `/wyprawy/alpy-2026#grossglockner-trasa` | 19.08.2026 | 3798 m |
| Dufourspitze | `/wyprawy/alpy-2026#dufour-trasa` | 22–24.08.2026 | 4634 m |
| Grauspitz | `/wyprawy/alpy-2026#grauspitz-trasa` | 26.08.2026 | 2599 m |
| Zugspitze | `/wyprawy/alpy-2026#zugspitze-trasa` | 28.08.2026 | 2962 m |
| Ganek, Wysoka i Rysy | `/wyprawy/wysoka-ganek-rysy-2026#trasa` | 9–10.08.2026 | 2462 / 2560 / 2499 m |

Wysokości pochodzą z istniejącego katalogu szczytów i opowieści alpejskiej. Rysy oznaczają wierzchołek graniczny zgodny z istniejącym punktem atlasu. Podsumowanie przedstawia wysokość szczytu (dla wspólnego zapisu: Wysoka 2560 m), niezależnie od maksimum GPS. Wykres i wskazany punkt zachowują odczyty GPS i mają jasne oznaczenie. Nie korygujemy całego profilu sztucznym przesunięciem. Przycisk szczytu wybiera najbliższą geograficznie próbkę, która może mieć inną wysokość niż szczyt. Powrót tatrzański zakończył się po północy; dotychczasowa data rozpoczęcia wyprawy pozostaje bez zmian.

`tripRoutes.js` zawiera konfiguracje i osobne importy danych; `TripRoute` obsługuje nagłówki, zwijanie, kotwice i ładowanie w pobliżu ekranu; `TripRouteView` łączy istniejącą mapę terenu z profilem. `routeGeometry.js` wylicza geometrię i najbliższe próbki. Każdy suwak i sekcja mają osobne identyfikatory. Dufour zachowuje dawną kotwicę i dane.

Pięć nowych plików przekazał autor strony. Oryginały i pełne czasy pozostają w prywatnym rejestrze poza repozytorium. Moduły do wyświetlania zawierają wyłącznie zaokrąglone współrzędne, wysokość, numer segmentu i dystans skumulowany. Dystans pochodzi z pełnego zapisu przed uproszczeniem. Nie wyliczamy nowych przewyższeń ani czasu ruchu i nie zastępujemy wcześniejszych statystyk aktywności. GPX nie jest wysyłany do zewnętrznych usług. Istniejący dostawca map dostaje żądania kafli, bez pliku trasy.

Kontrole: build i kontrola metadanych, `check-trip-routes.mjs` (sześć zapisów, geometria, segmenty, prywatność pól, odległości próbek od szczytów), dotychczasowe kontrole Dufour, opowieści i atlasu Alp, wypraw tatrzańskich oraz udostępniania. Przeglądarka: wybór wszystkich szczytów, klawiatura, zwijanie, reset i zoom, bezpośrednie kotwice; komputer i emulowane 390/320 px. Brak testu fizycznego telefonu. Kafle zależą od dostępności dotychczasowego dostawcy.
