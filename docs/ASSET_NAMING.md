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
- `src/assets/covers/expeditions/`
- `src/assets/covers/galleries/`
- `src/assets/photos/expeditions/`
- `src/assets/photos/galleries/`
- `src/assets/icons/`
- `src/assets/patterns/`

## Co gdzie wrzucać
- **Miniatury filmów**: `src/assets/thumbnails/films/` (np. `lomnica-thumb.jpg`).
- **Covery wypraw**: `src/assets/covers/expeditions/` (np. `gerlach-winter-cover.jpg`, `morocco-toubkal-cover.jpg`).
- **Covery galerii**: `src/assets/covers/galleries/` (np. `switzerland-gallery-cover.jpg`, `tatry-gallery-cover.jpg`).
- **Pełne zdjęcia do galerii i wpisów**:
  - wyprawy: `src/assets/photos/expeditions/`,
  - galerie: `src/assets/photos/galleries/`.
- **Placeholdery/fallbacki źródłowe**:
  - `src/assets/thumbnails/films/film-placeholder.svg`,
  - `src/assets/covers/expeditions/expedition-placeholder.svg`,
  - `src/assets/covers/galleries/gallery-placeholder.svg`.

## Spójny schemat nazw per typ
- Miniatura filmu: `<slug>-thumb.<ext>`
- Cover wyprawy: `<slug>-cover.<ext>`
- Cover galerii: `<slug>-gallery-cover.<ext>`

Przykłady:
- `lomnica-thumb.jpg`
- `gerlach-winter-cover.jpg`
- `durny-szczyt-cover.jpg`
- `morocco-toubkal-cover.jpg`
- `switzerland-gallery-cover.jpg`
- `tatry-gallery-cover.jpg`

## Dobre praktyki dodatkowe
- Utrzymuj nazwy krótkie, ale jednoznaczne.
- Dodawaj kontekst typu pliku w nazwie, np. `-thumb`, `-cover`, `-icon`, `-overlay`.
- Dla wariantów używaj przewidywalnych suffixów, np. `-dark`, `-light`, `-mobile`.
- Unikaj nazw typu `final`, `new`, `v2` — zamiast tego opieraj wersjonowanie na Git.
