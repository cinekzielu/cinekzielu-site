# Galerie wypraw — etap integracji

Galerie zastępują nieaktywne zapowiedzi na stronie głównej. Trzy okładki prowadzą do gotowych podstron; przycisk „Wszystkie galerie” otwiera komplet czterech wypraw. Galeria zawiera miejsce, rok, liczbę zdjęć, powiększanie i przejście do następnej wyprawy. Zdjęcia nie mają widocznych podpisów ani nazw plików; zachowują opisy alternatywne.

| Adres | Zdjęcia | Powiązanie z atlasem |
| --- | ---: | --- |
| `/galerie/szwajcaria-2025` | 36 | Szwajcaria |
| `/galerie/alpy-2026` | 48 | Europa (widok regionalny) |
| `/galerie/konczysta-2026` | 24 | Kończysta |
| `/galerie/liptowskie-mury-2026` | 21 | Tatry (widok regionalny) |

Alpy i Liptowskie Mury korzystają z istniejących widoków regionalnych. Nie dodano fikcyjnych markerów. Pliki map, współrzędne i identyfikatory pozostały bez zmian. Wybór szczytu pozostawia mapę Tatr widoczną. Panel wybranego miejsca prowadzi do odpowiednich galerii i filmów.

Galeria Maroka i wyciąganie kadrów z DJI są odłożone zgodnie z decyzją właściciela. Nie dodano nowych materiałów z Maroka.

## Filmy

Adresy zweryfikowano 4 października 2026 na publicznym [kanale Cinek Zielu](https://www.youtube.com/@cinek_zielu/videos). Etykiety linków są skróconymi, rzeczowymi nazwami materiałów.

- Szwajcaria: [Switzerland Peace](https://www.youtube.com/watch?v=lLCsa85MWzU) oraz odcinki [1](https://www.youtube.com/watch?v=BZOKvQHvtCk), [2](https://www.youtube.com/watch?v=KuZoxTnOmLs), [3](https://www.youtube.com/watch?v=1b1K6CUmHMI), [4](https://www.youtube.com/watch?v=qOHEK1qbjIU), [5](https://www.youtube.com/watch?v=nt6Upyoop1g), [6](https://www.youtube.com/watch?v=ksi5aauYYBo).
- Alpy: [Across the Alps](https://www.youtube.com/watch?v=l3KltGrKz2U), wyraźnie oznaczony jako zwiastun. Opis i data publikacji 15 lipca 2026 zostały sprawdzone na stronie filmu; zapowiada planowaną wyprawę.
- Kończysta: [Kończysta zimą](https://www.youtube.com/watch?v=7x1YlCGZvtI).
- Liptowskie Mury: [Liptowskie Mury i Walentkowa Grań](https://www.youtube.com/watch?v=ITjvjmavnNs).

## Materiały i utrzymanie

`src/data/galleryData.js` przechowuje wyłącznie publiczne metadane i listy gotowych eksportów. Pliki WebP znajdują się w `public/assets/photos/galleries/`. Wersje siatki mają do 960 px, powiększenia do 2000 px. Wszystkie 258 plików są pozbawione EXIF/GPS. Oryginały i prywatne manifesty selekcji nie są częścią projektu.

Strona główna nadal zawiera trzy wybrane filmy i trzy wybrane kierunki. Nie dodano bibliotek ani zmian w pliku blokady zależności. Atlas ładuje się osobno, dzięki czemu wejście bezpośrednio do galerii nie pobiera jego dużych danych SVG. Nadal istnieje ostrzeżenie kompilatora dotyczące rozmiaru pakietu atlasu; wymaga osobnego etapu optymalizacji mapy.

Nowe adresy obsługuje konfiguracja przekierowań Vercel. Metadane galerii aktualizują się w przeglądarce; pełne statyczne metadane dla robotów społecznościowych pozostają osobnym etapem, tak jak w dotychczasowej aplikacji SPA.

## Weryfikacja

- Instalacja z istniejącego pliku blokady: `npm ci --no-audit --no-fund`.
- Produkcyjna kompilacja: `npm run build` — poprawna.
- Kontrola wszystkich 129 zdjęć, 258 plików, wymiarów eksportów, braku EXIF, obecności w paczce wynikowej oraz braku prywatnych ścieżek w kodzie.
- Porównanie plików map i danych współrzędnych z bazą `57a9e855ca96637a86aaf2851edfe98992eaad92` — identyczne.
- Sprawdzenie siatki i nawigacji przy 1280, 768 i 390 px, pełnego ekranu, strzałek, zapętlania, Escape oraz powrotu fokusu do wybranego zdjęcia.
- Sprawdzenie galerii Szwajcarii i Kończystej z powrotem do właściwych miejsc atlasu.

Etap przygotowany lokalnie. Nie został jeszcze opublikowany na domenie produkcyjnej.
