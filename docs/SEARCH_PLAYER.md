# Wyszukiwanie i odtwarzacz — etap lokalny

2026-10-04. Użytkownik wybrał wspólne wyszukiwanie oraz oglądanie filmów na stronie. Przygotowanie publikacji zostało wyraźnie odłożone; najpierw mają powstać kolejne mapy. Etap nie został opublikowany.

## Zachowanie

- Przycisk „Szukaj” w nagłówku i Ctrl/Cmd+K otwierają wspólną wyszukiwarkę. Indeks zawiera 100 pozycji z istniejących miejsc, wypraw, galerii i filmów. Obsługuje zapis bez polskich znaków, cztery kategorie, liczby wyników, rozwijanie dalszych wyników i brak dopasowań.
- Powiązania pochodzą z istniejących katalogów. Wyszukanie miejsca z potwierdzonym rozdziałem otwiera film od tego momentu. Dokładne „Toubkal” wybiera szczyt 25:14, a „Refuge du Toubkal” schronisko 14:24.
- Zwykłe kliknięcia filmów na głównej stronie, w bibliotece, wyprawach, galeriach i atlasie otwierają jeden wspólny odtwarzacz. Linki zachowują rzeczywiste adresy YouTube oraz otwieranie w nowej karcie przez zmodyfikowane kliknięcie.
- Odtwarzacz YouTube ładuje się dopiero po kliknięciu, z hosta youtube-nocookie.com, z natywnymi kontrolkami. Zamknięcie usuwa iframe i zatrzymuje film. Dostępne są „Od początku”, powrót do wyników oraz powiązane wyprawy i galerie.
- Dialog blokuje przewijanie tła, obsługuje Escape, przywraca fokus i po przejściu do filmu pokazuje nagłówek od góry. Menu mobilne zamyka się przy otwarciu wyszukiwania.
- Nie dodano bibliotek ani nowych materiałów. Mapy, fotografie i katalog filmów zachowały dotychczasowe dane.

## Weryfikacja

- Build Vite, `check-site-tools.mjs`, `check-atlas.mjs`, `check-tatry.mjs`, `check-release.mjs` i kontrola różnic: poprawne. Metadane wszystkich 29 stron sprawdzone także przez lokalny HTTP.
- Test indeksu sprawdza wszystkie adresy, 12 potwierdzonych rozdziałów, normalizację zapytań oraz ograniczenie odtwarzacza do znanych filmów i prawdziwych domen YouTube.
- Zachowane odciski 14 plików map, katalogów materiałów i zależności; 73 węzły atlasu, 11 galerii, 220 zdjęć i 28 filmów bez zmian.
- Przeglądarka: desktop 1280px i nagłówek 1024px; emulowane szerokości 390px i 320px. Wyszukiwanie, filtry, brak wyników, rozwijanie wyników, przejście do galerii, Escape/fokus, Ctrl+K, menu mobilne, powrót z filmu i zamknięcie odtwarzacza sprawdzone. Brak poziomego przepełnienia w sprawdzonych widokach.
- Rzeczywiste odtwarzanie sprawdzone dla Kościelca (krótki film), Świnicy i Toubkalu. Toubkal startował od 25:14, a „Od początku” uruchamiał intro. Sprawdzono odtwarzanie z wyszukiwarki, galerii i strony głównej oraz komunikat po uruchomieniu filmu z mapy.
- Na świeżo otwartej bibliotece: 28 linków obsługujących dialog, brak iframe i skryptu API YouTube przed kliknięciem. Zamknięcie filmu usuwa iframe. Brak błędów aplikacji w sprawdzonych logach.

## Ograniczenie YouTube

Pierwszy film z Maroka (`McawfrouM_0`, „10 dni w Maroku”) zwrócił kod 150: YouTube blokuje osadzanie. Strona pokazuje wyjaśnienie i działający link z zachowaniem wybranego czasu, np. Rabat 05:54. Ustawień kanału nie zmieniano. Nie sprawdzano osadzania każdego z 28 filmów ani fizycznego telefonu.

Dokumentacja użytego API: https://developers.google.com/youtube/iframe_api_reference oraz https://developers.google.com/youtube/player_parameters.
