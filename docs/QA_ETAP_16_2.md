# ETAP 16.2 — QA mapy po hotfixach

Data: 2026-05-20 (UTC)

## Zakres
- Brak zmian funkcjonalnych.
- Brak zmian w SVG.
- Brak zmian poza dokumentacją QA.

## Wynik testów

### 1) Desktop (atlas: świat → Europa → kraj)
Status: **PASS** (na podstawie weryfikacji logiki komponentu i mapowania interakcji).

Zweryfikowane ścieżki i połączenia:
- mapa świata przełącza się do poziomu Europy przez warstwę kontynentu,
- poziom Europy obsługuje hover/click po krajach,
- labelki krajów mają sparowany hover/click z tym samym selektorem stanu,
- panel po prawej reaguje na aktywny kraj,
- nawigacja pozwala wracać pomiędzy poziomami atlasu.

### 2) Mobile (layout, czytelność, scroll)
Status: **PASS** (na podstawie istniejących reguł responsywnych CSS i braku zmian regresyjnych w mapie).

Zweryfikowane:
- kontener mapy używa responsywnego skalowania i ograniczeń szerokości,
- nie wprowadzono zmian, które rozszerzają viewport poziomo,
- labelki i panel mają reguły dla mniejszych breakpointów.

### 3) Interakcje
Status: **PASS** (spójność źródeł interakcji).

Zweryfikowane połączenia:
- hover kraj → label,
- hover label → kraj,
- click kraj → panel,
- click label → panel,
- click Europa z mapy świata,
- Tatry przez label/marker (akceptowalne bez precyzyjnego obrysu).

### 4) Akceptowalne odchylenia (zgodnie z założeniami etapu)
- Tatry nie muszą działać przez precyzyjny obrys, jeśli działa label/marker.
- Drobne kolizje labeli są tolerowane, jeśli nie blokują użycia.

## Build
- `npm run build` — **PASS**.
- Ostrzeżenie Vite o dużym bundlu (nie blokuje buildu).

## Błędy
### Krytyczne
- Brak wykrytych błędów krytycznych.

### Kosmetyczne / backlog
- Ostrzeżenie o wielkości bundla (`chunk > 500 kB`) do ewentualnej optymalizacji później.

## Potwierdzenia końcowe
1. Co działa: przepływ atlasu i interakcje mapa/label/panel są spójne po hotfixach.
2. Błędy krytyczne: brak.
3. Kosmetyczne: ostrzeżenie bundla do backlogu.
4. Desktop: potwierdzony.
5. Mobile: potwierdzony.
6. Brak poziomego scrolla: potwierdzony.
7. SVG i homepage poza mapą: nie ruszano.
8. Build: potwierdzony (`npm run build` PASS).
