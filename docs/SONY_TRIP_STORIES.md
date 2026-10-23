# Fotografie SONY w historii wypraw

Pakiet zatwierdzony do publikacji, 23 października 2026.

## Zakres

- Across the Alps: 38 dodatkowych fotografii z oryginalnych JPEG-ów SONY. Razem z 48 fotografiami z dotychczasowych etapów tworzą 12 chronologicznych zestawów: przygotowania, pięć wejść, trzy dni Dufourspitze i przerwy między szczytami.
- Baranie Rogi–Lodowy Szczyt: 8 dodatkowych fotografii w sekcji „Dwa dni na zdjęciach”. Sześć zdjęć z 4 lipca i dwa z poranka 5 lipca 2026. Drugi zestaw nie jest pełną dokumentacją drugiego wejścia.
- Galerie fotograficzne pozostają bez zmian: Alpy 48, Baranie/Lodowy 14 fotografii. Nowe zdjęcia są dokumentacyjnym uzupełnieniem stron wypraw.
- Każdy zestaw pokazuje datę i maksymalnie trzy miniatury, rozwinięcie pozostałych zdjęć oraz istniejący podgląd z powiększeniem.

## Przypisanie

Daty wykonania JPEG-ów zestawiono z istniejącymi datami GPX i wcześniejszą relacją autora. Nie wyprowadzano przebiegu trasy ze zdjęć ani nie dodawano nowych punktów mapy. Dla Baranich Rogów/Lodowego przypisano wyłącznie nową selekcję z potwierdzonych dwóch dni; wcześniejszej galerii nie przypisywano ponownie na podstawie niejednoznacznych dat całego folderu.

Przejrzano wizualnie próbkę 270 zdjęć z Alp i 89 z Baranich/Lodowego, a metadane odpowiednio 2843 i 822 JPEG-ów. To selekcja próbkowana, nie wizualny przegląd wszystkich oryginałów. Rejestr źródeł, dat, sum kontrolnych i wykluczeń jest prywatny, poza repozytorium.

## Pliki i prezentacja

`storyPhotoAssets.js` zawiera wyłącznie publiczne odwołania i opisy. `storyPhotoGroups.js` opisuje chronologię. `StoryPhotoGroup` korzysta z istniejącego `PhotoGrid` i podglądu zdjęć. Nie dodano zależności. Mapy i globalny układ pozostają bez zmian.

138 wersji WebP (46 × 3 rozmiary), około 19,2 MB łącznie. Zdjęcia wczytywane leniwie. Oryginały pozostają tylko do odczytu; eksport uwzględnia orientację i profil barwny, bez kadrowania ani kreatywnego retuszu. Wersje strony nie zawierają EXIF/XMP, ścieżek źródłowych ani dokładnego GPS.

## Weryfikacja

- Build: 53 strony oraz 382 widoki udostępniania.
- Wszystkie 48 skryptów wydzielonego pakietu publikacyjnego `check-*.mjs` przeszło; nowy `check-story-photos.mjs` sprawdza daty, unikalność, kompletność eksportów i zachowanie galerii.
- HTTP: dwie strony i 138 nowych zasobów, bez błędów.
- Przeglądarka: komputer 1280 px, emulacja 390 i 320 px; rozwijanie/zwijanie, powiększenie, zamknięcie klawiaturą oraz przejście z nagłówka do osi zdjęć. Bez zaobserwowanych błędów konsoli i poziomego przepełnienia.
- Korekta 23 października: jedna wspólna sekcja zdjęć każdego etapu w opowieści; fotografie pod profilami wyłączone tylko w Across the Alps. Atlas tras zachowuje własne zdjęcia. Wskazane zdjęcie grupowe i kozica z Baranich Rogów zastąpione krajobrazami z tego samego dnia.
- Brak testu fizycznego telefonu. Nowe dokumentacyjne zdjęcia nie są dodawane do katalogu portfolio/Zapisanych ani osobnych podglądów udostępniania.

Podglądy: `/wyprawy/alpy-2026#alpy-triglav` i `/wyprawy/baranie-rogi-lodowy-szczyt-2026#historia-zdjecia`.
