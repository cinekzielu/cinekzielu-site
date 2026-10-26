# Audyt atlas → GPX → wyprawa

25.10.2026. Początkowy PR187 `f8e35cf0a8bc23714db136c53732a2a603a6ae74`, main `6ff7295f9210003787e36adf1e5092bcab191a26`, PR185 `483313fb567c4781cf2716a91a53cddb58e62968`, PR186 `8a43483a35ce3a82db97024f774434fd475a67a8` potwierdzone w nowym checkoutcie GitHub w chmurze. Otwarte PR155/185/186/187. Przeczytano PROJECT_RULES i poprzednie przekazanie; brak AGENTS.md. Poprzednia iteracja zakończona według odczytu zadania, bez konkurencyjnego zapisu.

## Wynik

Nie stwierdzono nowej usterki w zbadanych powiązaniach. Rozszerzono istniejący `scripts/check-summit-atlas.mjs`, bez zmian kodu aplikacji lub danych.

Kontrola obejmuje 204 kombinacje miejsca/roku (95 miejsc, wszystkie lata oraz lata dostępne dla miejsca), 408 powiązań GPX, 37 unikalnych tras oraz 18 zbudowanych stron wypraw. Sprawdza:

- brak duplikatów trasy w obrębie miejsca/roku;
- link `routeLink` prowadzi do `/trasy`, ma `#profil` i wybiera ten sam identyfikator przez rzeczywisty `readRouteAtlas`;
- rok zapisu jest zgodny z filtrem atlasu; dopisanie tego roku do linku nie usuwa wybranej trasy;
- nazwa i daty trasy w materiałach odpowiadają `tripRoutes`;
- `routeHref` prowadzi do istniejącej kotwicy w HTML wyprawy lub wybiera tę samą trasę z `#profil`.

To kontrola danych, parserów i plików HTML, nie klikanie linków w przeglądarce. Nie weryfikuje momentu przewinięcia do dynamicznego profilu, fokusu, historii ani przywrócenia kadru.

Atlas poprzez istniejące powiązania szczytów obejmuje 37 z 42 tras katalogu. Pozostałe ID: `zermatt-2025`, `murren-2025`, `saxer-lucke-2025`, `lodowy-proba-2024`, `piec-stawow-2024`. Nie dopisano im automatycznie relacji ani nie uznano samej nieobecności w tym indeksie za błąd. Aktualna kontrola dotyczy poprawności istniejących powiązań, a nie kompletności geograficznego przypisania wszystkich tras. Istniejący `check-route-catalog.mjs` nadal sprawdza wszystkie42 wpisy katalogu i ich cele.

## Weryfikacja

- PR187: `npm run build` PASS — 53 strony +382 warianty; **51/51 kontroli PASS**.
- Izolowany merge PR185/186/187 bez konfliktów, commit QA `2625124bf67b663d8a3e6e8bac50ce2bc3de2df6` (nie wysłany): build PASS — 56+382; **54/54 kontroli PASS**.
- Rozszerzona kontrola daje identyczne liczniki408/204/37/18 w obu konfiguracjach.
- `git diff --check` PASS.

Dowody: [build](qa/atlas-route-links/build.log), [kontrole](qa/atlas-route-links/checks.json), [build połączony](qa/atlas-route-links/combined-build.log), [kontrole połączone](qa/atlas-route-links/combined-checks.json).

Nadal niewykonane: przeglądarkowy atlas → szczyt → trasa → fullscreen → powrót przy320/390/1280, klawiatura/fokus, historia, overflow, konsola, Safari/Firefox/telefon/czytnik ekranu i pomiary wydajności. Wcześniejszej blokady URL/security policy nie obchodzono ani nie ponawiano. Brak nowych screenshotów.

## Manifest i następny krok

Zmiany: `scripts/check-summit-atlas.mjs`, ten raport, AUTONOMOUS_ATLAS_REVIEW.md, cztery pliki dowodów w `docs/qa/atlas-route-links/` i [pełny manifest PR187](qa/autonomous-atlas/changed-files.txt). Bez zmian strony, premium galerii, materiałów, Zapisanych, laptopa, main, hostingu i produkcji.

Następny krok: sprawdzić, czy istniejące dane pozwalają jednoznacznie powiązać którąś z pięciu tras spoza indeksu z istniejącym miejscem — bez zgadywania zdobycia szczytu i bez dodawania materiałów. Jeśli nie, pozostawić stan i przygotować zbiorcze przekazanie pakietu. Najważniejsza otwarta kontrola przed scaleniem pozostaje rzeczywistym browser QA połączonych draftów po uzyskaniu dozwolonego podglądu.
