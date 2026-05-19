# Nazewnictwo assetów i struktura plików

## Zasady nazw plików
- Używaj **małych liter**.
- Nie używaj **polskich znaków**.
- Nie używaj **spacji**.
- Stosuj **myślniki** (`-`) jako separator.

## Przykłady poprawnych nazw
- `lomnica-thumb.jpg`
- `koscielec-winter-thumb.jpg`
- `morocco-toubkal-cover.jpg`
- `europe-country-overlays.svg`
- `tatry-route-line.svg`

## Przykłady niepoprawnych nazw
- `Kościelec zima final 2.jpg`
- `zdjęcie piękne góry.JPG`
- `Mapa Europy nowa.svg`

## Zalecana struktura katalogów
- `src/assets/maps/`
- `src/assets/thumbnails/films/`
- `src/assets/photos/expeditions/`
- `src/assets/icons/`
- `src/assets/patterns/`

## Dobre praktyki dodatkowe
- Utrzymuj nazwy krótkie, ale jednoznaczne.
- Dodawaj kontekst typu pliku w nazwie, np. `-thumb`, `-cover`, `-icon`, `-overlay`.
- Dla wariantów używaj przewidywalnych suffixów, np. `-dark`, `-light`, `-mobile`.
- Unikaj nazw typu `final`, `new`, `v2` — zamiast tego opieraj wersjonowanie na Git.
