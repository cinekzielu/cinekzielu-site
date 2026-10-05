# Żabi Koń 2026 — etap lokalny

## Uzupełnienie na prośbę właściciela — 4 października 2026

Galeria ma teraz **13 zdjęć**. Dodano cztery ujęcia: dwójkę uczestników
na podejściu, przygotowanie liny, portret przy skrzynce na szczycie i odpoczynek
w kasku. Dziewięć wcześniejszych zdjęć oraz okładka zachowują swoje pliki.
Nowe kadry wpleciono między krajobrazy. Wszystkie pochodzą z 19 września;
oryginały mają niezmienione sumy kontrolne, a kopie WebP nie zawierają EXIF.

Poniżej dokumentacja pierwotnej selekcji dziewięciu zdjęć.

Galeria dziewięciu zdjęć oraz strona wyprawy z 19 września 2026.
Data jest potwierdzona metadanymi wszystkich wybranych fotografii.

- `/galerie/zabi-kon-2026`
- `/wyprawy/zabi-kon-2026`
- `/mapa?atlas=zabi-kon`
- Istniejący film z Tatr „Żabi Koń · free solo” (`0YhbiEncSmo`, 37:57).

Przejrzano 150 plików JPEG SONY. 112 pochodzi z dnia górskiej wyprawy;
38 zdjęć z wcześniejszych dat pominięto. Folder nie zawiera eksportów Lightroom.
Wybrano krajobrazy z podejścia, grań, wspinaczy pokazujących skalę ściany
i widok szlaku z góry. Nie użyto pozowanych zdjęć grupowych ani podobnych
ujęć z serii. Zachowano wygląd zdjęć z aparatu i pełne proporcje.

18 kopii WebP ma do 960 i 2000 px na dłuższym boku, profil sRGB i brak EXIF.
Powstał również osobny obraz udostępniania. Sumy kontrolne oryginałów
sprawdzono przed i po eksporcie; źródła nie zostały zmienione.
Prywatne ścieżki i rejestr selekcji pozostają poza repozytorium strony.

Film był wcześniej zweryfikowany w katalogu autora i przypisany do szczytu
w atlasie. Powiązano go teraz także ze stroną wyprawy. Nie użyto filmu
„Żabi Koń · Jarzębinka” z Jury. Nie dodano szczegółowych parametrów trasy
ani identyfikacji osób widocznych na zdjęciach.

Wyprawa pojawia się jako najnowsza na liście i w istniejącej selekcji strony
głównej. Nadal obowiązują trzy wpisy w selekcji wypraw oraz trzy wybrane filmy.
Galeria dołącza do filtra Tatry / 2026. Punkt na mapie już istniał;
nie zmieniono geometrii, współrzędnych ani bibliotek.

## Weryfikacja

- Build: poprawny; 23 strony z osobnymi metadanymi.
- `check-release.mjs`: poprawny, również dla lokalnego HTTP.
- `check-atlas.mjs`: poprawny; 9 galerii i 193 zdjęcia, Tatry: 6 galerii
  i 93 zdjęcia, Żabi Koń: 9 zdjęć i jeden film.
- Desktop i widok 390 × 844: galeria, wyprawa i filtrowana lista bez
  przewijania w poziomie; fotografie bez dekoracyjnych podpisów.
- Powiększenie zdjęć: pełny obraz 2000 px, przejście 9 → 1 klawiaturą,
  zamknięcie Escape i przywrócenie fokusu.
- Filtr Tatry / 2026: pięć wypraw, w tym nowy Żabi Koń.
- Mobilny atlas Tatr pokazuje właściwy szczyt, galerię i film; odnośniki
  do stron wyprawy i galerii są poprawne.
- Brak błędów konsoli podczas kontroli.

Zmiana lokalna, bez publikacji na domenie.
