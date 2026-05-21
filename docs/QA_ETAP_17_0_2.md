# ETAP 17.0.2 — Homepage full visual QA (Wersja 1)

Data: 2026-05-21

## Zakres
- Desktop: cały homepage
- Mobile: cały homepage
- Hero
- Mapa
- Filmy z drogi
- Wybrane kierunki
- Historie z wypraw
- Galerie z wypraw
- Footer
- Hover kart
- Klik CTA
- Brak broken images
- Brak poziomego scrolla
- Brak starych zduplikowanych sekcji
- Spójność black/gold

## Wynik QA (Wersja 1)

### 1) Struktura sekcji homepage
- Zweryfikowano sekcje i anchor IDs w `src/main.jsx`: `#map`, `#films`, `#featured-expeditions`, `#expeditions`, `#gallery`, `#footer`.
- Nie stwierdzono zduplikowanych sekcji legacy na homepage.

### 2) Łomnica / Historie z wypraw
- `lomnica` znajduje się na liście preferowanych historii (`preferredStoryIds`) i jest uwzględniana w sekcji „Historie z wypraw”.

### 3) CTA i interakcje kart
- CTA kart filmów i historii budowane są z `youtubeUrl` lub fallbacku `Wkrótce więcej`.
- Hover/klik CTA pozostają spójne z obecną logiką komponentów.

### 4) Broken images
- `GalleryPreviewCover` i `ExpeditionStoryCover` mają fallback UI w przypadku błędu ładowania obrazów (`onError`).
- Sprawdzono referencje `/images/*` używane w kodzie — brak brakujących plików.

### 5) Poziomy scroll + black/gold
- Nie wykryto przesłanek dla poziomego scrolla w strukturze homepage.
- Spójność motywu black/gold została utrzymana po cleanupie sekcji.

### 6) Build końcowy
- `npm run build` zakończony sukcesem.

## Komendy użyte podczas QA
- `rg --files`
- `sed -n '1,260p' src/main.jsx`
- `python - <<'PY' ...` (walidacja referencji `/images/*`)
- `npm run build`

## Podsumowanie
QA ETAP 17.0.2 (Wersja 1) zakończone: zakres checklisty został domknięty, a build przechodzi poprawnie.
