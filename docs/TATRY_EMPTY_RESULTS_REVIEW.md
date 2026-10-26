# Atlas Tatr: odzyskiwanie pustych wyników — 26.10.2026

Kontynuacja autoryzowana przez użytkownika 26 października. Jedna zakończona iteracja w chmurze; poprzednia automatyzacja jest wyłączona, jej ostatnia iteracja zakończona. Nie tworzono ani nie wznawiano harmonogramu. Zmiana trafia do istniejącego draft PR187, bez publikacji.

## Stan wejściowy

Świeży checkout z GitHub, potwierdzony cloud executor (Node 24.22.1). Sprawdzono historię, otwarte PR, reguły projektu i raport końcowy. Brak AGENTS.md w repozytorium.

- main: `6ff7295f9210003787e36adf1e5092bcab191a26`.
- PR187 przed zmianą: `b5bf069cad448b4f1d83d60a2b1e29941ac41c56`.
- PR185: `483313fb567c4781cf2716a91a53cddb58e62968`.
- PR186: `8a43483a35ce3a82db97024f774434fd475a67a8`.

## Potwierdzony problem i poprawka

Poprzednie przyciski odzyskiwania pustych wyników obejmowały ogólną listę MapAtlas, ale nie odrębny TatryExplorer. W Tatrach pozostał komunikat „Brak wyników. Zmień nazwę lub wyłącz filtr «Z materiałami»”. To nieskuteczna rada przy aktywnym filtrze roku: warunek listy nadal wymaga materiałów z tego roku, niezależnie od stanu checkboxa.

Sprawdzono rzeczywiste dane dla wyboru `atlas=tatry` i nazw:

| Nazwa | Rok | Z materiałami włączone | Z materiałami wyłączone | Wszystkie lata, ta sama nazwa |
| --- | --- | --- | --- | --- |
| Łomnica | 2024 | 0 wyników | 0 wyników | lomnica |
| Gerlach | 2026 | 0 wyników | 0 wyników | gerlach |
| Staroleśny | 2025 | 0 wyników | 0 wyników | starolesny-szczyt |

Wszystkie trzy lata są prawidłowe dla atlasu Tatr. Wyniki potwierdzono w danych i logice filtrowania, nie w przeglądarce.

TatryExplorer korzysta teraz ze wspólnego `AtlasEmptyResults`. Przy braku dopasowań można wyczyścić nazwę, wybrać wszystkie lata albo (wyłącznie bez aktywnego roku) pokazać miejsca bez materiałów. „Pokaż wszystkie lata” wywołuje istniejący `onSelect(selectedId, 'all')` i zachowuje wpisaną nazwę. Callbacki kierują fokus do pola wyszukiwania z `preventScroll`. Nie zmieniono reguł filtrowania, mechanizmu historii ani geometrii mapy. Wykorzystano istniejący styl i przyciski; bez nowych zależności.

## Weryfikacja tej iteracji

- `npm run build`: PASS, 53 strony +382 warianty. [Log](qa/tatry-empty-results/build.log).
- Wszystkie istniejące `scripts/check-*.mjs`: **51/51 PASS**. [Wyniki](qa/tatry-empty-results/checks.json).
- Rozszerzono istniejący `check-atlas-empty-results.mjs`: zachowane 12 stanów wspólnego komponentu; trzy rzeczywiste wyszukiwania przy dwóch stanach checkboxa; dostępność akcji zmiany roku. Statyczne asercje połączenia z TatryExplorer chronią wywołanie istniejącej nawigacji, zachowanie nazwy i deklarację fokusu. To nie test działania DOM.
- Izolowane połączenie z PR185/186: build PASS, 56 stron +382 warianty; **54/54 PASS**. [Build](qa/tatry-empty-results/combined-build.log), [kontrole](qa/tatry-empty-results/combined-checks.json).
- `git diff --check`: PASS w obu checkoutach.

Połączenie nadal wymaga rozwiązania jednego wcześniejszego konfliktu MapAtlas. Zgodnie z [raportem z25.10](ATLAS_FINAL_REVIEW.md) zachowano sekcję PR186 i dodano `selected.routeIds?.length` do warunku. Dzisiejsza zmiana TatryExplorer nakłada się bez dodatkowego konfliktu. Testowa baza po połączeniu: `01679d0a0225ac922af83f3b7b1971cbddb48257`, na nią nałożono dwa dzisiejsze pliki kodu/testu. Merge testowy nie jest wysyłany do GitHub.

## Ograniczenia i następny krok

Nadal brak dozwolonego browser QA połączonego pakietu. Nie ponawiano ani nie obchodzono wcześniejszej odmowy URL/security policy, nie zmieniano ochrony Vercel. Nie wykonano zrzutów, pomiarów wydajności, kontroli rzeczywistego fokusu/klawiatury, Wstecz/Dalej, overflow i konsoli, Safari/Firefox ani testu fizycznego telefonu. Node i build nie zastępują tych testów.

Konkretny następny krok po uzyskaniu dozwolonego dostępu: przy 320/390/1280 px otworzyć `/mapa?atlas=tatry&rok=2024`, wpisać „Łomnica”, wybrać „Pokaż wszystkie lata”, sprawdzić zachowanie tekstu i fokus pola oraz przejście do materiałów. Powtórzyć dla Gerlacha/2026 i Staroleśnego/2025, wykonać Wstecz/Dalej oraz pełną ścieżkę atlas → szczyt → trasa → fullscreen → powrót. Nie uznawać pakietu za gotowy do publikacji przed tym przeglądem.

## Manifest tej iteracji

- `src/components/TatryExplorer.jsx`
- `scripts/check-atlas-empty-results.mjs`
- `docs/TATRY_EMPTY_RESULTS_REVIEW.md`
- `docs/ATLAS_FINAL_REVIEW.md` (odnośnik do kontynuacji)
- `docs/qa/tatry-empty-results/build.log`
- `docs/qa/tatry-empty-results/checks.json`
- `docs/qa/tatry-empty-results/combined-build.log`
- `docs/qa/tatry-empty-results/combined-checks.json`
- `docs/qa/autonomous-atlas/changed-files.txt`

[Pełny manifest PR187](qa/autonomous-atlas/changed-files.txt). Main, produkcja, hosting, sources/AGENTS, galerie premium, oryginalne materiały i nieopublikowane obszary laptopa bez zmian.
