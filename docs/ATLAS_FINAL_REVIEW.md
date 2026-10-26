# Pakiet atlasu do wspólnego przeglądu — 25.10.2026

**Nowszy zakres z26.10:** [opis tekstowy karty i audyt statystyk tras](ROUTE_CARD_DESCRIPTION_REVIEW.md).

**Nowszy zakres z26.10:** [wyjaśnienia i odzyskiwanie błędnego lub ukrytego wyboru trasy](ROUTE_LINK_RECOVERY_REVIEW.md).

**Nowszy zakres z26.10:** [wyszukiwanie po regionie/kraju i obsługa łączników](ATLAS_GEOGRAPHIC_SEARCH_REVIEW.md).

**Kontynuacja z26.10:** [odzyskiwanie pustych wyników w osobnym atlasie Tatr, aktualne testy i ograniczenia](TATRY_EMPTY_RESULTS_REVIEW.md). Poniżej zachowano historyczny raport serii z25.10.

Wynik zapisany w draft PR187, gałąź `codex/atlas-autonomous-quality`. Przygotowanie zakończone; nie scalać ani nie publikować bez osobnej decyzji użytkownika i uzupełnienia UI QA.

## Co przygotowano

- Pomoc „Jak korzystać z atlasu” i trzy gotowe widoki (wcześniejszy dodatek z24.10).
- Przyciski odzyskiwania pustych wyników: wyczyść nazwę, wszystkie lata, miejsca bez materiałów.
- Poprawne opisy miejsc z samym GPX, zamiast „Brak materiałów”.
- Trzy istniejące szwajcarskie zapisy GPX połączone z ich istniejącymi miejscami atlasu: Saxer Lücke, Mürren–Gimmelwald, Zermatt.
- Poprawki błędnych parametrów atlasu oraz kontrole stabilności URL i powiązań GPX; komplet dowodów w raportach historycznych.

## Ostatni dodatek: miejsca niebędące szczytami

Odtworzono aktualny checkout GitHub. Przed zmianą PR187: `565f9576fe539f9198fe362d20104ba4a2dd8f60`; main `6ff7295f9210003787e36adf1e5092bcab191a26`; PR185 `483313fb567c4781cf2716a91a53cddb58e62968`; PR186 `8a43483a35ce3a82db97024f774434fd475a67a8`. Przeczytano PROJECT_RULES i raport poprzedniego audytu, brak AGENTS.md. Poprzednia iteracja zakończona, bez równoczesnych zapisów.

Pięć tras z poprzedniego audytu ma puste `peaks`. Trzy z nich mają jednoznaczne odpowiedniki w `switzerlandPlaces` oraz istniejącą wyprawę `szwajcaria-2025`:

| Miejsce atlasu | Istniejący GPX | Kotwica wyprawy |
| --- | --- | --- |
| saxer-lucke | saxer-lucke-2025 | trasa-saxer-lucke-2025 |
| murren-gimmelwald | murren-2025 | trasa-murren-2025 |
| zermatt | zermatt-2025 | trasa-zermatt-2025 |

Dodano jawne relacje `routeIds` w warstwie treści atlasu. `getAtlasMaterials` łączy je z dotychczasowymi relacjami szczytów, usuwa duplikaty i filtruje rok. Panel MapAtlas dopuszcza trasy jawnie przypisane do miejsca; etykieta sekcji wymienia miejsce zamiast nazywać je szczytem. Trasy pojawiają się także w agregatach Szwajcarii/Alp/Europy/świata. To powiązanie istniejących materiałów, bez nowych GPX, wypraw, geometrii, fotografii ani wpisów w rejestrze zdobytych szczytów.

`lodowy-proba-2024` pozostaje próbą pod szczytem; nie przypisano go do zdobytego Lodowego. `piec-stawow-2024` pozostaje dostępne w katalogu tras bez dopisywania nieistniejącego miejsca atlasu. Nie zmieniano `summitRoutes` ani `summits`.

## Końcowa weryfikacja

- PR187: build PASS — 53 strony +382 warianty, **51/51 kontroli PASS**.
- Połączenie z PR185/186 w izolowanym checkoutcie: build PASS — 56+382, **54/54 kontroli PASS**.
- Aktualny audyt: **438 powiązań GPX /204 zestawienia miejsca i roku /40 unikalnych tras /18 stron wypraw**. Dodatkowe asercje chronią trzy relacje, rok2025, puste2026, zakresy nadrzędne i brak fikcyjnego wejścia.
- `git diff --check` PASS. [Build](qa/atlas-final/build.log), [kontrole](qa/atlas-final/checks.json), [połączony build](qa/atlas-final/combined-build.log), [połączone kontrole](qa/atlas-final/combined-checks.json).

**Połączenie nie jest już bezkonfliktowe.** PR186 i ostatni dodatek modyfikują tę samą sekcję tras w `src/components/MapAtlas.jsx`. W QA zachowano całą wersję sekcji PR186 (regionalne linki, limit, link do strony szczytu), dodając `selected.routeIds?.length` do warunku obok `routeRegion`. Wspólny warunek: `routeRegion || selected.routeIds?.length || selected.kind === 'Szczyt' || (!materials.galleries.length && !materials.films.length)`. Przetestowany merge QA: `ee4c32ad464cc7876c2aee769e51540f37f5c669`, nie wysłany do GitHub. Nie skopiowano PR185/186 do PR187. Przy przyszłym łączeniu trzeba zachować oba dodatki i ponownie zweryfikować wynik.

## Ograniczenia i przegląd przed scaleniem

Nadal brak rzeczywistego browser QA całego pakietu:320/390/1280px, fokus, klawiatura, przepełnienia, konsola, historia Wstecz/Dalej, odświeżenie kadru, ścieżka atlas → szczyt → trasa → fullscreen → powrót. Nowe powiązania sprawdzono przez parsery i HTML, nie przez kliknięcia. Brak nowych zrzutów, Safari/Firefox/fizycznego telefonu/czytnika ekranu i pomiarów wydajności. Wcześniejszej odmowy URL/security policy podglądu nie obchodzono ani nie ponawiano; ochrony Vercel nie zmieniano.

Konkretna kolejność przeglądu po uzyskaniu dozwolonego preview: trzy widoki pomocy; puste wyszukiwanie i powrót fokusu; Staroleśny z samym GPX; Saxer Lücke/Mürren/Zermatt z2025 i2026; pełna ścieżka Gerlach → trasa → fullscreen → powrót oraz Wstecz/Dalej. Testy przy wszystkich trzech szerokościach. Dopiero potem decyzja o scaleniu.

## Pliki do późniejszego połączenia

Ostatnia zmiana: `src/data/atlasContent.js`, `src/components/MapAtlas.jsx`, `scripts/check-summit-atlas.mjs`, ten raport, AUTONOMOUS_ATLAS_REVIEW.md, cztery pliki dowodów w `docs/qa/atlas-final/` i aktualizacja [pełnego manifestu PR187](qa/autonomous-atlas/changed-files.txt). Manifest obejmuje również wcześniejszą pomoc, style, kontrolki i testy.

Main, produkcja, hosting/Vercel, premium galerie, sources/AGENTS, zależności oraz nieopublikowane obszary laptopa bez zmian. Seria zakończona, bez przedłużania ani kolejnych automatyzacji. Następne działanie to wspólny przegląd i brakujące UI QA, nie automatyczna publikacja.
