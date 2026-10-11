# Sycylia i Hungaroring — lokalny etap

Dodano dwie wskazane przez autora wyprawy: **Katania i Etna 2026** oraz **Hungaroring 2026**. Obie korzystają z istniejącego układu strony, galerii fotografii, filtrów, wyszukiwarki i atlasu. Nie zmieniano oryginałów zdjęć ani nie publikowano etapu.

## Fotografie i daty

- Katania i Etna: 40 fotografii SONY, wybranych ze 167 obejrzanych eksportów Lightroom. Miasto, Taormina i wybrzeże, zbocza Etny. Daty materiałów z podróży: 15–19 czerwca 2026; wybrana kolekcja zawiera zdjęcia z 16–18 czerwca. Nie wykorzystano osobnego folderu portretowego.
- Hungaroring: 24 fotografie SONY z 24–26 lipca 2026. Przejrzano próbkę co dziesiątego pliku z 2419 JPEG oraz 108 sąsiednich zdjęć do dokładniejszego porównania. To selekcja, nie deklaracja obejrzenia wszystkich fotografii. Zawiera tor, bolidy, trybuny, detale i kilka zdjęć uczestników.
- Wersje WebP: dłuższy bok 2000 i 960 px, miniatura o szerokości 480 px. Oryginalne proporcje, bez dodatkowego kadrowania i twórczej korekcji kolorów. Profile eksportowe konwertowane do sRGB, EXIF usunięty z plików strony. Dane źródeł pozostają w prywatnym rejestrze poza repozytorium.
- `previewPhotoIndices` pozwala wskazać trzy różne tematy w zapowiedzi galerii na stronie wyprawy. Dotychczasowe wyprawy zachowują wcześniejszy wybór.

## Film i geografia

Film [Hungaroring 2026](https://www.youtube.com/watch?v=eWK-80Idong) zweryfikowano na kanale autora i w rozwiniętym opisie 11 października 2026. Publikacja: 30 lipca 2026. Opis potwierdza Sony A6700 oraz F1, F2, F3 i Porsche Supercup. Odtwarzacz pokazuje 1:24; karta kanału zaokrągla do 1:25. Na stronie użyto czasu odtwarzacza. Odtwarzanie osadzone sprawdzono. Do Katanii nie przypisano niezweryfikowanego filmu.

Atlas: Europa → Włochy → Sycylia → Katania / Taormina / Etna; Europa → Węgry → Hungaroring. Punkty pochodzą z OpenStreetMap:

- [Katania](https://www.openstreetmap.org/relation/39230)
- [Taormina](https://www.openstreetmap.org/relation/39384)
- [Etna](https://www.openstreetmap.org/node/58999222)
- [Hungaroring](https://www.openstreetmap.org/relation/3938368)

Punkty wskazują miejsca, nie dokładne pozycje wykonania fotografii. Etna nie jest oznaczona jako zdobyty szczyt. Nie dodano śladu GPS ani połączeń sugerujących przebytą trasę. Obrys Węgier jest piętnastym obrysem państwa, z tego samego zbioru Natural Earth 1:10m (public domain). Sycylia jest osobnym regionem, a mapa Włoch zachowuje obrys kraju. Manualne SVG Europy i świata nie były zmieniane.

## Kontrola

`check-summer-trips.mjs` weryfikuje daty, filtry, 64 unikalne zdjęcia i 192 warianty WebP, cztery adresy stron, obrazy udostępniania, powiązania miejsc i filmu oraz wymagane pola zgodności starego katalogu. Zaktualizowano oczekiwane sumy w istniejących kontrolach, zachowując sprawdzenia wcześniejszych materiałów. Pełny build i pozostałe kontrole nadal są wymagane.

Podglądy: `/wyprawy/katania-2026`, `/wyprawy/hungaroring-2026`, odpowiadające galerie oraz `/mapa?atlas=sicily` i `/mapa?atlas=hungaroring`.
