# Autonomiczny audyt atlasu — 24.10.2026

## Audyt 25.10.2026 — powiązania GPX

[Audyt i kontrola regresji](ATLAS_ROUTE_LINKS_REVIEW.md): 408 powiązań w 204 zestawieniach miejsca/roku, 37 tras, 18 celów wypraw. Bez nowego błędu aplikacji. Build i 51/51 kontroli PR187 oraz 54/54 po połączeniu: PASS; browser QA nadal otwarte.


## Poprawka 25.10.2026 — opis materiałów GPX

Lista miejsc uwzględnia teraz GPX zamiast błędnego „Brak materiałów” przy szczytach bez zdjęć/filmów. [Dowód i aktualne wyniki](ATLAS_MATERIAL_LABEL_REVIEW.md): build i 51/51 kontroli PR187 oraz 54/54 po połączeniu z PR185/186. Browser QA nadal otwarte.


## Dodatek 25.10.2026 — puste wyniki

Kontekstowe przyciski odzyskiwania wyników atlasu: [zakres i aktualne testy](ATLAS_EMPTY_RESULTS_REVIEW.md). Build oraz 50/50 kontroli PR187 i 53/53 po połączeniu z PR185/186: PASS. Browser QA pozostaje otwarte. Poniżej historia wcześniejszych prac.


## Dalszy dodatek po zakończeniu audytu

Po nowej prośbie użytkownika dodano domyślnie zwiniętą pomoc atlasu i trzy istniejące widoki z filtrami. [Bieżący zakres, testy i ograniczenia](ATLAS_HELP_REVIEW.md). Build i 49 kontroli samego pakietu oraz build i 52 kontrole po połączeniu z PR185/186: PASS. Wcześniejsza luka browser QA nadal otwarta. Poniżej pozostaje historia poprzednich etapów.

## Stan audytu przed dodaniem pomocy — 24.10.2026

Pakiet pozostaje w [draft PR187](https://github.com/cinekzielu/cinekzielu-site/pull/187). Zawiera dwie odtworzone i poprawione usterki odczytu URL atlasu (odziedziczone ID oraz rozbieżna walidacja obszaru/roku), rozszerzenia trzech istniejących kontroli i dokumentację. Nie zmienia wyglądu ani treści strony. Nie scalać ani nie publikować bez osobnej decyzji użytkownika i uzupełnienia UI QA.

### Ostatni audyt i nowa kontrola

Ponownie sklonowano GitHub do wykonawcy chmurowego. Sprawdzone heady: main `6ff7295f9210003787e36adf1e5092bcab191a26`, PR185 `483313fb567c4781cf2716a91a53cddb58e62968`, PR186 `8a43483a35ce3a82db97024f774434fd475a67a8`, PR187 przed tą iteracją `4754ca071db801e5225c9899f011ab69debc1bd2`. Otwarte PR: 155, 185, 186, 187. Przeczytano aktualne zasady i raport; brak AGENTS.md.

Rozszerzono `scripts/check-atlas-view-state.mjs` o 3 scenariusze × 25 kolejnych odczytów/zapisów linku. Kontrola łączy parser kadru z parserami wyboru miejsca, roku i obszaru. Weryfikuje stabilny adres bez dryfu, zachowanie podkładu i filtrów, także dla odrzuconego obszaru. Uszkodzony kadr jest odrzucany bez usuwania poprawnego miejsca, obszaru, roku i filtra miejsc. Nie stwierdzono nowej usterki aplikacji; w tej iteracji zmieniono wyłącznie kontrolę i raport.

To 75 cykli funkcji serializacji URL, **nie** 75 operacji Wstecz/Dalej, odświeżeń w przeglądarce ani testów na telefonie. Przegląd kodu potwierdził ograniczenie x/y kadru do 0–1 przed zapisem w `TatryTerrainMap`; nie dodano niepotrzebnej poprawki dla hipotetycznej długości geograficznej poza zakresem.

| Końcowa kontrola | Wynik |
| --- | --- |
| PR187 na main: build | PASS — 53 strony + 382 warianty |
| PR187 na main: istniejące kontrole | 48/48 PASS |
| PR187 + PR185 + PR186: merge tylko w izolowanym checkoutcie | Bez konfliktów |
| Połączony build | PASS — 56 stron + 382 warianty |
| Połączone istniejące kontrole | 51/51 PASS |
| Stabilność adresu z kadrem i filtrami | 75/75 cykli PASS |
| Uszkodzony kadr i poprawne filtry | PASS |
| `git diff --check` | PASS |

[Build PR187](qa/autonomous-atlas/final-quality-build.log) · [Build połączony](qa/autonomous-atlas/final-combined-build.log) · [Kody zakończenia i wyniki](qa/autonomous-atlas/final-validation.json). Lokalny merge testowy `0c965908fd243786afaf7e077d9e4e504c268d6a` nie został wysłany.

### Przekazanie do przeglądu

Pełny [manifest](qa/autonomous-atlas/changed-files.txt) obejmuje wszystkie zmiany od main. Kod aplikacji: tylko `src/data/atlasContent.js`. Kontrole: `scripts/check-atlas.mjs`, `scripts/check-unified-atlas.mjs`, `scripts/check-atlas-view-state.mjs`. Reszta to raport i dowody. Nie kopiowano zmian PR185/186 do PR187. Nie dotykano sources, zdjęć/GPX, galerii premium, Zapisanych, dodatków laptopa, hostingu ani produkcji.

**Pakiet nie ma pełnego zatwierdzenia UI.** Nadal brakuje przeglądarkowego atlas → szczyt → trasa → pełny ekran → powrót przy 320/390/1280 px, fokusu/klawiatury, historii, overflow, konsoli i odświeżenia kadru. Wcześniejsza odmowa URL/security policy jest zapisana poniżej. Nie próbowano jej obejść; nie ma nowych screenshotów ani pomiarów wydajności. Kontrole geometrii w Node nie są testami przeglądarki.

Konkretny następny krok po przywróceniu dozwolonego podglądu: odtworzyć aktualne SHA, połączyć trzy drafty wyłącznie w QA i wykonać wskazaną ścieżkę na trzech szerokościach, następnie przypadki błędnego ID/obszaru/roku i kopię linku z kadrem. Dopiero wynik tych testów pozwala ocenić gotowość do scalenia. Pomoc „Jak korzystać z atlasu” nie powstała — poprzedzająca ją luka QA pozostała otwarta. Nie zaplanowano dodatkowych prac ani dalszej automatycznej publikacji.

## Wynik iteracji 3 — zgodny odczyt obszaru i roku

24.10.2026. Odtworzono checkout z GitHub. Początkowy head PR187: `fa86a4e9ee25f85ab905077f8aae7e7196c344a5`; main `6ff7295f9210003787e36adf1e5092bcab191a26`, PR185 `483313fb567c4781cf2716a91a53cddb58e62968`, PR186 `8a43483a35ce3a82db97024f774434fd475a67a8` bez zmian. PR187 nadal open/draft. Przeczytano aktualne PROJECT_RULES i raport; brak AGENTS.md. Wyłącznie wykonawca chmurowy, bez prób obejścia wcześniejszej blokady przeglądarki.

**Potwierdzona rozbieżność:** `?atlas=gerlach&rok=2024&obszar=morocco` dawało kontekst mapy `null`, ale rok `all`; bez błędnego obszaru rok wynosił `2024`. Dla `?atlas=etna&rok=2025&obszar=tatry` filtr akceptował 2025 mimo odrzucenia tatrzańskiego kontekstu przez mapę i braku tego roku w docelowej Sycylii. To odtworzenie przez rzeczywiste funkcje aplikacji w Node, nie obserwacja UI.

`readAtlasYear` używa teraz istniejącego `readAtlasContext`, czyli tej samej walidacji obszaru co mapa. Nie ma drugiego, rozbieżnego zestawu reguł geograficznych. Błędny obszar nie wpływa na rok; poprawne konteksty Dufourspitze/Alpy, Saxer Lücke/Alpy i Kościelec/Polska zachowują wskazany rok. Nie zmieniono adresów ani mechanizmów zapisu historii.

Rozszerzony istniejący `scripts/check-unified-atlas.mjs`: 3 przypadki odrzuconego obszaru i 3 poprawne konteksty. [FAIL przed zmianą](qa/autonomous-atlas/context-before.log), PASS po. Dodatkowo sprawdzono 3105 kombinacji odrzuconego kontekstu dla 95 miejsc, lat 2024/2025/2026/undated/invalid i obszarów morocco/tatry/alpy/poland/sicily/unknown/constructor: wynik roku był zawsze taki sam jak bez nieprawidłowego obszaru.

- Sam PR187: [build PASS](qa/autonomous-atlas/context-build.log), 53 strony + 382 warianty; 48/48 kontroli PASS.
- Lokalny merge z PR185 i PR186 `9ba650555018602e62c11db3f4c0108f24a3d968`: bez konfliktów, [build PASS](qa/autonomous-atlas/context-combined-build.log), 56 stron + 382 warianty; 51/51 kontroli PASS. Merge testowy nie jest wysyłany do GitHub.
- [Kody zakończenia wszystkich kontroli i parametry dodatkowego audytu](qa/autonomous-atlas/context-validation.json). Kontrole działają w Node; komunikaty istniejącego testu o szerokościach dotyczą obliczeń geometrii, nie nowego browser QA.
- `git diff --check` PASS. Manifest całego PR: [changed-files.txt](qa/autonomous-atlas/changed-files.txt). W tej iteracji kod zmieniono tylko w `src/data/atlasContent.js` i `scripts/check-unified-atlas.mjs`; pozostałe zmiany to dokumentacja.

**Niewykonane i dalszy krok:** wspólny UI test 320/390/1280, historia Wstecz/Dalej, klawiatura, fokus, overflow, konsola i odświeżenie kadru nadal wymagają działającego dozwolonego podglądu chmurowego. Nie ma nowych zrzutów ani pomiarów szybkości. Następny test powinien uwzględnić także powyższe błędne parametry i poprawne linki regionalne. Nie dodano pomocy atlasu, ponieważ wcześniejsza luka UI nie jest domknięta. Bez zmian main, produkcji, Vercel, materiałów, premium galerii i dodatków laptopa.

## Wynik iteracji 2 — poprawka nieprawidłowych linków

24.10.2026. Ponownie sklonowano repozytorium z GitHub do wykonawcy chmurowego. Main, PR185 i PR186 mają nadal SHA zapisane poniżej; początkowy head PR187: `cc4dc6a184f21ae3de89b620b1170527ec1671c2`. Otwarte PR: 155, 185, 186, 187. Przeczytano aktualne zasady i raport; brak AGENTS.md. Nie rozpoczęto kolejnych prób obejścia wcześniej zgłoszonej blokady przeglądarki.

### Potwierdzony błąd i zmiana

Adres `/mapa?atlas=constructor&rok=2025` był traktowany jako istniejące miejsce, ponieważ sprawdzenie `atlasNodeById[id]` znajdowało odziedziczoną właściwość Object.prototype. Wywołanie rzeczywistego łańcucha `readAtlasSelection` → `readAtlasYear` → `getAtlasMaterials` kończyło się wyjątkiem `(countryPlaceIds[id] || []) is not iterable`. Tak samo zachowywały się `__proto__`, `toString` i `hasOwnProperty`. Odtworzenie wykonano w Node na kodzie aplikacji; nie twierdzimy, że widziano awarię w przeglądarce.

Walidacja korzysta teraz z `Object.hasOwn(atlasNodeById, id)`. Nieznane identyfikatory wracają do `world`, rok do `all`, tak jak zwykły błędny identyfikator. Istniejące miejsca, adresy, historia i interfejs nie zostały zmienione. Jedna linia kodu aplikacji, bez zależności.

Rozszerzono istniejący `scripts/check-atlas.mjs` o wszystkie nazwy własnych właściwości Object.prototype, z trzema wariantami parametrów: sam atlas, rok 2025 oraz błędny rok/obszar. Każdy przypadek sprawdza wybór świata, wszystkie lata i poprawne materiały. Test faktycznie FAIL przed zmianą i PASS po zmianie: [dowód przed](qa/autonomous-atlas/invalid-id-before.log). Dotychczasowa pętla nadal weryfikuje wszystkie 95 prawidłowych miejsc.

### Weryfikacja iteracji 2

- Baza main + PR187 z poprawką: `npm run build` PASS (53 strony + 382 warianty), **48/48 kontroli PASS**. [Build](qa/autonomous-atlas/quality-build.log), [kontrole](qa/autonomous-atlas/quality-check-results.json).
- Izolowany lokalny merge z PR185 i PR186: bez konfliktów; `npm run build` PASS (56 stron + 382 warianty), **51/51 kontroli PASS**. [Build](qa/autonomous-atlas/combined-fixed-build.log), [kontrole](qa/autonomous-atlas/combined-fixed-check-results.json). Lokalny merge `6c5a88efd0e8db841603490c87ca64bf9b074850` nie został wysłany.
- Dodatkowy audyt 18 połączeń trzech stron szczytów dla lat all/2024/2025/2026/unknown: kotwice materiałów istnieją w odpowiednim pliku HTML builda; linki GPX przez `routeLink` poprawnie wracają przez `readRouteAtlas` do identycznego ID. [Wyniki](qa/autonomous-atlas/summit-link-audit.json). Nie znaleziono dodatkowego błędu.
- Istniejące kontrole metadanych, prerenderu, dat, zasobów, aliasów i filtrów również przeszły. `git diff --check` PASS.

**Nadal niewykonane:** UI 320/390/1280, klawiatura, fokus, overflow, konsola aplikacji, historia Wstecz/Dalej i odświeżanie kadru w przeglądarce. Raporty Node nie zastępują tych testów. Nie ma nowych screenshotów ani pomiaru wydajności. Pełny test połączonego interfejsu pozostaje następnym krokiem po przywróceniu dozwolonego dostępu do podglądu. Nie dodano pomocy atlasu ani nowych funkcji.

Pełny manifest pakietu: [changed-files.txt](qa/autonomous-atlas/changed-files.txt). Do połączenia z laptopem doszły wyłącznie `src/data/atlasContent.js` i `scripts/check-atlas.mjs`; pozostałe pliki to dowody audytu. Kod PR185/186 nie jest kopiowany do tego PR. Produkcja, Vercel i main bez zmian.

## Historia: status iteracji 1

Częściowy wynik: ponownie odtworzono i zbudowano połączone PR185 + PR186 w izolowanej gałęzi chmurowej. **Browser QA nadal NIE wykonane.** Nie potwierdzono nowej usterki aplikacji; nie wprowadzono spekulacyjnej poprawki ani pomocy atlasu. Ten draft zawiera wyłącznie raport i rzeczywiste logi, bez duplikowania kodu PR185/186.

## Sprawdzone wersje i zakres

- main: `6ff7295f9210003787e36adf1e5092bcab191a26`.
- PR185: `483313fb567c4781cf2716a91a53cddb58e62968`, draft/open.
- PR186: `8a43483a35ce3a82db97024f774434fd475a67a8`, draft/open.
- Lokalny, niewysłany merge testowy: `57346d3` (PR185 + merge PR186). Połączenie bez konfliktów. Nie przenosić tego merge na main.
- Nowa gałąź raportu `codex/atlas-autonomous-quality` wychodzi bezpośrednio z main. W chwili rozpoczęcia nie istniała; otwarte PR: 155, 185, 186. Brak innej widocznej gałęzi/PR tego audytu. Nie uruchamiano równoległych zapisów.
- Przeczytano `docs/PROJECT_RULES.md`, raporty obu pakietów; brak AGENTS.md w checkoutcie. Nie czytano sources ani dysków laptopa.

## Faktycznie wykonane kontrole

| Kontrola | Wynik |
| --- | --- |
| Klon repozytorium i Node/npm w chmurze | PASS |
| `npm ci --ignore-scripts` z istniejącym lockfile | PASS; bez zmian zależności |
| Próbny merge PR185 + PR186 | PASS, bez konfliktów |
| `npm run build` połączonego kodu | PASS; 56 stron + 382 warianty |
| Wszystkie `node scripts/check-*.mjs` | PASS, 51/51 |
| Ponowne sprawdzenie zdalnych SHA przed raportem | Wszystkie trzy niezmienione |

Logi: [build](qa/autonomous-atlas/combined-build.log), [51 kontroli z pełnym wyjściem](qa/autonomous-atlas/combined-check-results.json).

Istniejący `check-summit-pages.mjs` sprawdził już błędne identyfikatory i lata, mapowanie unknown/undated, brak materiałów Dufourspitze 2025, zachowanie dat wejść, filtry roku materiałów/GPX i brak hasha nieistniejącego wiersza listy. Nie dublowano tych kontroli. To walidacja danych i funkcji, nie dowód zachowania przeglądarki.

## Konkretna blokada UI

Tymczasowy serwer QA miał serwować skompilowane dist, z osobnym iframe 320/390/1280 i shim crypto.randomUUID dla HTTP (tak jak wcześniejsze QA). Serwer i shim nie są częścią repozytorium ani zmian aplikacji.

Pierwszy start `sites-preview` nie przeszedł healthchecka, ponieważ serwer QA nie odczytywał argumentu --port. Naprawiono wyłącznie tymczasowy serwer. CLI następnie zgłosiło działający podgląd `http://terminal.local:4173/`. Pierwsze otwarcie w chmurowym Chrome zwróciło `net::ERR_EMPTY_RESPONSE`; status podglądu był zatrzymany. Kolejna próba po dodaniu diagnostyki została odrzucona przez narzędzie przeglądarki: **browser security policy / URL policy gate did not grant access**. Zatrzymano próby zgodnie z komunikatem; nie obchodzono blokady alternatywną przeglądarką, transportem ani zmienianiem zabezpieczeń.

Nie jest to potwierdzona usterka aplikacji ani dowód niedostępności publicznej strony. Nie próbowano logowania do Vercel i nie zmieniano ochrony preview. Brak zrzutów, ponieważ aplikacja nie została skutecznie otwarta w przeglądarce tej sesji.

## Niewykonane i następny krok

Najwyższy priorytet pozostaje bez zmian: po odzyskaniu dozwolonego podglądu chmurowego wykonać rzeczywiste UI QA połączonych wersji. Najpierw ponownie sprawdzić SHA i otwarte PR; użyć tego samego draftu audytu.

1. 320×568, 390×844, 1280×800: atlas → szczyt → trasa → pełny ekran → zamknięcie → powrót, klawiatura/Tab/Escape, fokus, overflow i konsola.
2. Bezpośrednie linki, błędny rok/ID, pusty wynik, odświeżenie URL z kadrem mapy oraz wielokrotne Wstecz/Dalej. Testy funkcji już przechodzą, UI pozostaje niezweryfikowane.
3. Dopiero potwierdzona usterka uzasadnia zmianę kodu. Nie uznawać poprzednich zrzutów pojedynczych PR za test wersji połączonej.

Nie wykonano pomiaru szybkości, Safari/Firefox, fizycznego telefonu ani testów czytnika ekranu. Nie deklarujemy poprawy wydajności. Nie zmieniono produkcji, main, Vercel, zdjęć, GPX, galerii premium, Zapisanych ani dodatków laptopa. Nie ma nowego publicznego podglądu połączonej aplikacji.

## Historyczny manifest iteracji 1

- `docs/AUTONOMOUS_ATLAS_REVIEW.md`
- `docs/qa/autonomous-atlas/combined-build.log`
- `docs/qa/autonomous-atlas/combined-check-results.json`
- `docs/qa/autonomous-atlas/changed-files.txt`

Powyższy historyczny manifest dotyczy tylko raportu iteracji 1; aktualna pełna lista jest w changed-files.txt. Pełne listy kodu PR185/186 pozostają w ich własnych dokumentacjach. **Draft do przeglądu; bez zgody na merge i publikację.**
