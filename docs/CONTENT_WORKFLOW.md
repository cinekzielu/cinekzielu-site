# Workflow treści: filmy, wyprawy, galerie, kierunki

Dokument opisuje standardowy proces dodawania i wiązania treści w projekcie.

## Statusy treści
Ujednolicony zestaw statusów:
- **published** — treść publicznie dostępna i gotowa do pokazania użytkownikom.
- **planned** — treść zaplanowana, jeszcze nieprodukowana lub nieprzygotowana do publikacji.
- **in-production** — treść jest w trakcie realizacji (np. montaż filmu, selekcja zdjęć, przygotowanie opisu).
- **archived** — treść historyczna, niepromowana aktywnie, zachowana referencyjnie.

---

## 1) Dodawanie nowego filmu

### Krok po kroku
1. Dodaj wpis filmu w odpowiednim pliku danych w `src/data` (zgodnie z aktualnym modelem danych).
2. Uzupełnij metadane filmu (minimum):
   - `title`,
   - `slug` lub inny stabilny identyfikator,
   - `status`,
   - data/pole kolejności (jeśli używane),
   - opis skrócony.
3. Dodaj miniaturę filmu do `src/assets/thumbnails/films/`.
4. Wpisz ścieżkę do miniatury w rekordzie filmu.
5. Dodaj link YouTube (np. pole `youtubeUrl` lub równoważne w obecnej strukturze).
6. Jeśli film dotyczy wyprawy — powiąż go przez `expeditionId` (lub analogiczne pole relacyjne).

### Weryfikacja
- Film renderuje się poprawnie w odpowiedniej sekcji.
- Miniatura ładuje się bez błędów.
- Link YouTube otwiera właściwy materiał.
- Powiązana wyprawa jest poprawnie rozpoznawana.

---

## 2) Dodawanie nowej wyprawy

### Krok po kroku
1. Dodaj wpis wyprawy w danych `src/data`.
2. Uzupełnij pola wyprawy:
   - `title`,
   - `slug`/`id`,
   - `status`,
   - opis,
   - lokalizacja/region (jeśli używane),
   - `mapNodeId`.
3. Dodaj zdjęcia wyprawy do `src/assets/photos/expeditions/`.
4. Podłącz zdjęcie główne (cover/hero) w rekordzie wyprawy.
5. Powiąż filmy przez listę `filmIds` lub relację odwrotną (zależnie od modelu).

### Weryfikacja
- Wyprawa jest widoczna w sekcjach, które ją wykorzystują.
- `mapNodeId` wskazuje poprawny kierunek/element mapy.
- Powiązane filmy są poprawnie mapowane.

---

## 3) Dodawanie nowej galerii

### Krok po kroku
1. Dodaj wpis galerii w danych `src/data`.
2. Uzupełnij metadane galerii:
   - `title`,
   - `slug`/`id`,
   - `status`,
   - opcjonalny opis.
3. Dodaj zestaw zdjęć do `src/assets/photos/expeditions/` (lub dedykowanego podfolderu galerii, jeśli zostanie wprowadzony).
4. Wpisz listę zdjęć do rekordu galerii (np. tablica `images`).
5. Powiąż galerię z wyprawą przez `expeditionId` (lub listę `galleryIds` po stronie wyprawy).

### Weryfikacja
- Galeria wyświetla właściwą kolejność i komplet zdjęć.
- Powiązanie z wyprawą działa w obu kierunkach (jeśli wspierane).

---

## 4) Dodawanie nowego kierunku na mapie

### Krok po kroku
1. Dodaj/uzupełnij wpis kierunku w danych `src/data`.
2. Upewnij się, że kierunek ma stabilny identyfikator (`id`/`slug`) zgodny z mapą.
3. Powiąż kierunek z mapą przez `mapNodeId`.
4. Jeśli kierunek ma treści powiązane, podłącz:
   - wyprawy (`expeditionIds`),
   - filmy (`filmIds`) — bezpośrednio lub pośrednio przez wyprawy.
5. Jeśli potrzebna jest zmiana SVG, traktuj ją jako oddzielne zadanie z podwyższoną ostrożnością.

### Weryfikacja
- Kliknięcie/aktywacja w atlasie wskazuje właściwy kierunek.
- Kierunek zwraca poprawny zestaw powiązanych treści.

---

## Checklista końcowa dla każdego typu treści
- Uzupełniony `status`: `published` / `planned` / `in-production` / `archived`.
- Poprawne ścieżki do assetów (bez błędów importu).
- Relacje działają (film ↔ wyprawa, wyprawa ↔ mapa, galeria ↔ wyprawa).
- Build przechodzi: `npm run build`.
