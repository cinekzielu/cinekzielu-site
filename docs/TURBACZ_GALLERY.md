# Turbacz 2026 — etap lokalny

Galeria 16 zdjęć wybranych spośród 31 eksportów Lightroom. Przed wyborem
przejrzano również 14 eksportów z Krywania; Turbacz ma pełniejszy zestaw
krajobrazów na samodzielną kolekcję. Krywania nie dodano w tym etapie.

- `/galerie/turbacz-2026`
- `/wyprawy/turbacz-2026`
- `/galerie?miejsce=gorce` i `/wyprawy?miejsce=gorce`
- Powiązanie w atlasie: istniejący wpis Polski, bez nowej pinezki i geometrii.

Data 10 stycznia 2026 jest potwierdzona metadanymi wszystkich wybranych zdjęć.
Krótki opis dotyczy wyłącznie widocznych motywów: lasu, okolic szczytu
i drogi powrotnej. Nie dodano szczegółowego przebiegu trasy ani czasów przejścia.

## Selekcja i prezentacja

Zachowano jedną wersję każdego ujęcia. Wyłączono portret, kolaż, alternatywne
obróbki oraz słabsze i powtarzające się kompozycje. Oryginały pozostają
niezmienione; prywatny rejestr selekcji i ścieżki źródłowe są poza repozytorium.

32 kopie WebP mają do 960 i 2000 px na dłuższym boku, profil sRGB i nie zawierają
EXIF. Okładka przedstawia wędrowca na tle gór ponad chmurami. Opcjonalne
`coverPosition` ustawia kadr miniatury przy prawej krawędzi, zachowując postać
także na telefonie. Pełne zdjęcia w galerii nie są kadrowane.

W zweryfikowanym katalogu nie ma filmu przypisanego do tej wyprawy. Komponenty
obsługują teraz kolekcje fotograficzne: pomijają przyciski i sekcję filmów,
nie pokazują „0 filmów”, a metadane nie zapowiadają nieistniejących materiałów.
Obsługa dotychczasowych galerii i wypraw z filmami pozostaje zachowana.

Filtr Gorce korzysta z `collectionRegion`. Jest oddzielny od powiązania
galerii z krajem w atlasie, dzięki czemu Turbacz nie trafia do filtra Tatry.

## Weryfikacja

- Build: poprawny, 21 podstron z osobnymi metadanymi.
- `check-release.mjs`: poprawny, również dla lokalnego HTTP.
- `check-atlas.mjs`: poprawny; 8 galerii i 184 zdjęcia; Polska ma 3 galerie
  i 41 zdjęć, a Tatry zachowują 5 galerii i 84 zdjęcia.
- Przegląd desktopowy i 390 × 844: galeria, wyprawa, miniatury i filtry
  bez przewijania w poziomie.
- Gorce pokazują Turbacz w obu indeksach, również po wybraniu roku 2026;
  filtr Tatry nadal pokazuje pięć właściwych galerii.
- Powiększenie: zdjęcia poziome i pionowe załadowane do 2000 px, przejście
  16 → 1, strzałka w lewo, Escape i przywrócenie fokusu działają.
- Galeria i strona Świnicy nadal pokazują prawidłowy link i sekcję filmu.
- Atlas Polski zawiera odnośniki do wyprawy i galerii Turbacza.
- Brak błędów konsoli. Źródłowe mapy i zależności bez zmian.

Lokalny podgląd; bez publikacji na domenie.
