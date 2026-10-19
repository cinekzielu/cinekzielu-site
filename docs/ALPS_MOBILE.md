# Alpy i mobilne filtry tras

Pakiet zaakceptowany do publikacji 19 października 2026. Baza: produkcyjny PR175.

## Kierunek Alpy

`/kierunki/alpy` łączy istniejące materiały Szwajcarii 2025 i Across the Alps 2026. Przełącznik `?rok=2025` / `?rok=2026` obejmuje wyprawy, fotografie, filmy, zdobyte szczyty i trasy. Zdjęcie otwierające również odpowiada wybranemu rokowi. W menu Wyprawy, na liście wypraw i w wyszukiwarce dodano odnośnik.

Wspólny widok: 2 wyprawy, 84 fotografie w galeriach (6 wybranych podglądów), 8 filmów i zwiastunów, 8 zdobytych szczytów, 11 tras. Rok 2025: 36 fotografii, 7 filmów, 3 szczyty i 6 tras. Rok 2026: 48 fotografii, 1 zwiastun, 5 szczytów i 5 tras. Dane pochodzą ze wspólnych istniejących katalogów. Matterhorn pozostaje planem, nie zdobytym szczytem. Nie dodano nowych materiałów ani lokalizacji.

## Telefon

Do 600 px zaawansowane filtry atlasu tras rozwija przycisk Filtry. Aktywne ustawienia pozostają widoczne jako usuwalne etykiety, także obszar mapy. Usunięcie pojedynczego filtra zachowuje pozostałe ustawienia i porównanie dni. Przycisk Do wyników prowadzi do mapy albo listy zgodnie z wybranym widokiem. Nagłówek Trasy i licznik mają osobne wiersze. Na komputerze filtry nadal są stale dostępne.

## Sprawdzenie

- Build, 40 kontroli danych/stron, kontrola zmian i HTTP 48 lokalnych stron: poprawne.
- Przeglądarka: 1280, 390 i 320 px; brak poziomego przepełnienia w sprawdzonych widokach.
- Oba lata i powrót do wszystkich materiałów, właściwe liczby i odnośniki, powiększenie fotografii, osadzenie odtwarzacza, menu na komputerze i telefonie.
- Rozwinięcie/zwiniecie filtrów, usuwanie roku i obszaru, zachowanie porównania dwóch dni, przejście do wyników i historia. Powrót do szerokiego ekranu pokazuje panel niezależnie od jego mobilnego stanu.
- Nie zaobserwowano błędów konsoli. Telefon sprawdzony przez emulację, nie na fizycznym urządzeniu.

Użytkownik zaakceptował publikację pakietu po lokalnym przeglądzie. Pakiet nie zmienia układu strony głównej ani map atlasu. CSS kierunku ma osobny prefiks `cz-destination-alps`, aby nie ingerować w istniejącą relację Across the Alps.
