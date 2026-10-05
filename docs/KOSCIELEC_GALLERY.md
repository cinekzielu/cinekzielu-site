# Kościelec 2026 — etap lokalny

Przygotowano galerię 17 fotografii z 7 marca 2026 oraz stronę wyprawy.
Datę potwierdzają metadane wybranych zdjęć. Selekcja pochodzi z autorskich
eksportów Lightroom: po jednym opracowaniu danego ujęcia, bez zdjęć skałkowych
z następnego dnia. Oryginały pozostały niezmienione.

## Adresy

- `/galerie/koscielec-2026`
- `/wyprawy/koscielec-2026`
- `/mapa?atlas=koscielec` — 17 zdjęć i dwa istniejące filmy
- `/wyprawy/koscielec-winter` — dawny adres prowadzi do nowej strony wyprawy

Oba istniejące filmy Kościelca otrzymały powiązanie ze stroną wyprawy.
Mapa korzysta z istniejącego punktu; geometria, współrzędne i wygląd mapy
nie zostały zmienione. Strona główna nadal pokazuje trzy wybrane filmy,
trzy kierunki i trzy ostatnie wyprawy.

## Pliki zdjęć

34 kopie WebP: dłuższy bok do 960 px w siatce i do 2000 px po otwarciu.
Zachowano proporcje i obróbkę, profile barwne przeliczono do sRGB.
Eksporty nie zawierają EXIF. Podgląd udostępniania używa osobnego poziomego
kadru z tej wyprawy. Ścieżki źródłowe i prywatny rejestr selekcji pozostają
poza repozytorium strony.

## Kontrola

- Produkcyjny build: poprawny, 15 podstron z osobnymi metadanymi.
- `scripts/check-release.mjs`: poprawny, również dla HTML podglądu przez HTTP.
- `scripts/check-atlas.mjs`: poprawny; 5 galerii i 146 zdjęć łącznie,
  w tym 3 galerie i 62 zdjęcia w Tatrach.
- Sprawdzono galerię, powiększanie i klawiaturę, stronę wyprawy oraz powrót
  z mapy do galerii, na komputerze i w widoku telefonu 390 × 844.

To lokalna propozycja do obejrzenia. Ten etap nie został opublikowany.
