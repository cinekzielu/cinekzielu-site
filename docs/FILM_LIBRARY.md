# Biblioteka filmów

Etap lokalny z 4 października 2026. Podgląd: `/filmy`.

## Zawartość

- 28 opublikowanych filmów z gór i podróży: Tatry 16, Szwajcaria 7, Alpy 1, Jura 2, Maroko 2.
- Selekcja z pierwszych 30 pozycji kanału. Hungaroring i Runmageddon pominięto, ponieważ ten etap dotyczy wypraw. Nie jest to pełne archiwum 58 filmów kanału.
- Filtry miejsc i wyszukiwanie uwzględniające warianty bez znaków diakrytycznych. Adres zachowuje filtr i zapytanie; Wstecz odtwarza stan.
- Linki do istniejących wypraw i galerii przy 10 powiązanych filmach.
- Wspólna nawigacja Wyprawy / Filmy / Galerie na podstronach.
- Strona główna zachowuje 3 filmy: Łomnica, krótki Kościelec, vlog z Maroka. Rok jest oznaczony jako rok publikacji.
- Długości filmów także na stronach wypraw i przy szwajcarskiej galerii.

## Dane i źródła

`src/data/filmCatalog.js` zawiera wspólny rejestr, a `filmsData.js` przygotowuje jego dane dla strony głównej.

Źródło tytułów, kolejności, długości i miniatur: [kanał autora](https://www.youtube.com/@cinek_zielu/videos), odczyt 2026-10-04. Tytuły na stronie skrócono redakcyjnie bez zmiany miejsca ani rodzaju filmu. Miniatury są ładowane bezpośrednio z YouTube; ich błąd ma czytelny zastępczy przycisk odtwarzania. Nie ma osadzonego odtwarzacza ani automatycznego odtwarzania.

Daty publikacji sprawdzone w rozwiniętych opisach filmów:

- [Łomnica](https://www.youtube.com/watch?v=zb8zqv8gpZk): 2025-07-18, 18:53, wejście przez Łomnicką Przełęcz.
- [Kościelec, krótki film](https://www.youtube.com/watch?v=QRSSYlhRGMM): 2026-03-15, 1:57. Poprzednie 07:04 i 2024 były nieprawidłowe.
- [10 dni w Maroku](https://www.youtube.com/watch?v=McawfrouM_0): 2025-06-22, 1:09:33. Ten film nie jest filmem z wejścia na Toubkal.
- [Toubkal](https://www.youtube.com/watch?v=BiWk6apjJOg): oddzielny film, 39:40.
- [Across the Alps](https://www.youtube.com/watch?v=l3KltGrKz2U): 2026-07-15, 1:34, zwiastun.

Nie wyliczano dat wypraw ani dokładnych dat publikacji z względnych etykiet YouTube. Nie dodano galerii Maroka ani kadrów z DJI. Nie zmieniono oryginałów zdjęć.

## Weryfikacja

- Produkcyjny build zakończony poprawnie; bez nowych zależności.
- 28 unikalnych identyfikatorów, 3 filmy na stronie głównej, wszystkie 10 linków galerii zgodne z rejestrem.
- Wyszukiwanie `lomnica` i `murren`, filtr Szwajcaria (7 wyników), brak wyników, czyszczenie i przywracanie stanu po Wstecz.
- Widok desktop i telefon 390 px; brak poziomego przepełnienia, miniatury poprawnie ładowane.
- Przejście Film → Wyprawa → Galerie → zdjęcie w pełnym ekranie → strona główna.
- Kontrola 258 plików WebP / 129 zdjęć: brak metadanych EXIF, mapy i zależności zgodne z bazą.

## Dalszy etap

Metadane podstron są nadal ustawiane w przeglądarce. Przed publikacją warto przygotować statyczne HTML z metadanymi dla linków społecznościowych, ujednolicić canonical strony głównej (bazowy HTML wciąż wskazuje dawny adres Vercel) i dodać sitemap. Ten etap nie zmienia atlasu ani jego dużego osobnego pliku JS.
