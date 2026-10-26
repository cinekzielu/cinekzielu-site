# Porównanie tras: stany, punkt profilu i aktualny link — 26.10.2026

## Stan wejściowy

Świeży checkout w wykonawcy chmurowym, Node24.22.1. PR187: `5c5a1808c15b30a7f9b4c640d5d6f7f01a0327e6`; main `6ff7295f9210003787e36adf1e5092bcab191a26`; PR185 `483313fb567c4781cf2716a91a53cddb58e62968`; PR186 `8a43483a35ce3a82db97024f774434fd475a67a8`. Sprawdzono aktualne PR, historię, PROJECT_RULES i przekazanie poprzedniej iteracji; brak AGENTS.md. Poprzedni wynik był zakończony; nie prowadzono konkurencyjnych zapisów. Zmiany tylko w istniejącym draft PR187.

## Potwierdzone luki i zakres zmian

### Stany pobierania

RouteCatalog znał błąd pobierania, lecz nie przekazywał go do RouteComparison. Dla dwóch wybranych tras i brakujących danych panel zawsze wyświetlał „Wczytywanie profili…”, również po zakończonym niepowodzeniu. Dodatkowo komunikat listy ogłaszał gotowe porównanie już na podstawie dwóch ID. Podsumowanie aktywnego obszaru też nadal mówiło o wczytywaniu po błędzie.

Panel otrzymuje teraz istniejący loadError i callback istniejącego retry. Przy brakujących profilach wyświetla błąd i lokalne „Spróbuj ponownie”; przed ponowieniem kieruje fokus do trwałej sekcji porównania. Przy kompletnych danych błąd innej trasy nie ukrywa gotowego wykresu. Komunikat listy potwierdza wybór dwóch tras, bez przedwczesnej deklaracji gotowości. Komunikaty obszaru rozróżniają trwające pobieranie od niepowodzenia.

Nie zmieniono sposobu pobierania, cache, filtrów, historii ani retry w PR185. Istniejący globalny komunikat pozostaje dostępny również dla błędów dotyczących mapy, a lokalny przycisk pomaga użytkownikowi znajdującemu się przy porównaniu.

### Tekst punktu porównania

Suwak porównania miał aria-valuetext wyłącznie z dystansem. Wysokości A/B i przerwy GPS były w osobnych akapitach. Teraz aria-valuetext zawiera dystans oraz oba odczyty: przybliżoną wysokość, przerwę, koniec zapisu lub brak danych. Wspólna funkcja formatuje opis suwaka i istniejące widoczne odczyty. Bez zmian geometrii, interpolacji, kroku suwaka ani nowych komunikatów aria-live przy każdym ruchu.

### Potwierdzenie kopiowania

Dotychczasowy efekt czyszczenia stanu „Link skopiowany” nie uwzględniał roku, rodzaju materiałów i obszaru, mimo że te parametry znajdują się w adresie porównania. Pole mogło więc zachować poprzedni link po zmianie tych filtrów. Samo poszerzenie zależności efektu nie zabezpieczałoby spóźnionego wyniku asynchronicznego kopiowania.

Wynik kopiowania przechowuje adres, dla którego powstał. Niewielki komponent renderuje istniejący panel wyłącznie wtedy, gdy ten adres odpowiada bieżącemu comparisonShareHref. Efekt czyszczenia i kierowania fokusu również korzysta z tego adresu. Dotyczy to zarówno potwierdzenia schowka, jak i ręcznego kopiowania po jego odmowie. Format URL, zachowanie filtrów i treść panelu pozostają takie same. Nie dotyczy to zestawów Zapisanych ani udostępniania/porównywania zdjęć.

## Audyt pozostałego ładowania

Przejrzano istniejące TatryTerrainMap, TripRoute, RouteLoadBoundary i routeTrackLoader z PR185. Kafelki mapy już rozróżniają ładowanie i błąd oraz mają ponowienie; fullscreen ma osobny komunikat odmowy. PR185 już zapewnia lokalny błąd danych trasy, ponowienie, cache poprawnych pobrań oraz odświeżenie po błędzie modułu. Nie raportujemy tych mechanizmów jako nowych poprawek i nie powielamy ich.

Obecna kontrola PR185 ponownie przeszła: zakres pobierania, wspólne żądania, HTTP503, niepoprawny JSON/dane, timeout i ponowienie, zgodność42 zapisów. To test transportu z kontrolowanymi odpowiedziami Node, nie test awarii sieci w przeglądarce. W tym przeglądzie nie potwierdzono kolejnej luki uzasadniającej zmianę geometrii mapy, obsługi gestów czy fullscreen bez UI QA.

## Aktualna weryfikacja

- Sam PR187: `npm run build` PASS, **53 strony +382 warianty; 53/53 kontroli PASS**.
- Rzeczywiste izolowane połączenie z PR185/186: build PASS, **56+382; 56/56 kontroli PASS**.
- `git diff --check` i `git diff --cached --check`: PASS.
- Nowy check-route-feedback.mjs:210 opisów rzeczywistych punktów42 tras; syntetyczna przerwa, punkt poza zapisem i brak danych; SSR braku wyboru, jednej trasy, pobierania, częściowych danych, błędu, powrotu do pobierania i gotowego porównania; dwa dni Toubkalu; panel linku dla11 zmian stanu oraz przesunięcia kursora.
- SSR sprawdza także wynik kopiowania z poprzednim adresem dostarczony po zmianie widoku. Nie wywołuje prawdziwego schowka ani nie symuluje harmonogramu efektów React w DOM. Podobnie przejście błąd → ponowienie → gotowe sprawdzane jest przez kolejne wejściowe props, bez klikania przycisku.

[Build PR187](qa/route-feedback/build.log), [kontrole PR187](qa/route-feedback/checks.json), [build połączenia](qa/route-feedback/combined-build.log), [kontrole połączenia](qa/route-feedback/combined-checks.json).

Testowany kod PR187: tymczasowy lokalny commit `ba843c4a9e9b5ed23f84e8b04260478cec58adfa`, drzewo `5774fded4ad06044d7975d13ed586bab84dd3aef`. Raporty i logi dołączono po testach; zawartość kodu pozostała identyczna. Końcowy testowy merge: `a714ec95a79a6f4f3a9f6549bcbd43a2073c581f`. Żaden z tych commitów QA ani merge nie jest publikowany. Zapis gałęzi używa rodzica sprawdzonego na GitHub i oczekiwanego SHA; drzewo API musi odpowiadać lokalnemu stagingowi, z zachowaniem bajtów logów.

## Łączenie: teraz dwa konflikty

1. **RouteCatalog.jsx z PR185**: sąsiadują istniejący ogólny komunikat błędu PR185 i nowe props panelu. Zachować ogólny blok PR185 z warunkiem `loadError && (view === 'list' || ready)` i jego fokusem do `porownanie`. W następnej linii zachować nowe `<RouteComparison loadError={loadError} onRetry={() => setRetry(value => value + 1)} ... />` oraz pozostałe props. Żadnej wersji całego pliku nie zastępować drugą. Pozostałe zmiany tej iteracji łączą się automatycznie.
2. **MapAtlas.jsx z PR186**, wcześniejszy konflikt: zachować całą sekcję GPX PR186 i dodać selected.routeIds?.length. Warunek: `routeRegion || selected.routeIds?.length || selected.kind === 'Szczyt' || (!materials.galleries.length && !materials.films.length)`.

Powyższe rozwiązania przeszły pełny build i56 kontroli w odizolowanym checkoutcie. PR187 nie zawiera skopiowanych zmian PR185/186.

## Ograniczenia i konkretny następny krok

Nadal brak dozwolonego browser QA. Nie ponawiano ani nie obchodzono odmowy URL/security policy, nie zmieniano ochrony Vercel. Niewykonane:320/390/1280px, realny fokus i klawiatura, czytnik ekranu, clipboard API, przepełnienia, konsola, Wstecz/Dalej, odświeżenie kadru, fullscreen i przejście atlas → szczyt → trasa → powrót. Bez nowych zrzutów, pomiarów wydajności, Safari/Firefox i fizycznego telefonu. Node/SSR nie są testami UI.

Następny krok końcowej iteracji serii: ponownie sprawdzić SHA i zebrać przekazanie całego pakietu z26.10 z aktualnym manifestem oraz oboma konfliktami; nie powtarzać napraw już zapisanych. Najwyższy priorytet po uzyskaniu dozwolonego preview: porównanie Dufourspitze/Ganek z wymuszoną awarią jednego GPX i ponowieniem; odczyt suwaka przed/za końcem krótszej trasy; skopiowanie linku, zmiana roku/materiałów/obszaru i spóźnione zakończenie kopiowania; dwa dni Toubkalu. Następnie pełna wcześniejsza macierz UI. Bez zgody na publikację.

## Manifest iteracji

- src/components/RouteCatalog.jsx
- src/components/RouteComparison.jsx
- src/components/RouteComparisonShare.jsx
- src/data/routePointDescription.js
- scripts/check-route-feedback.mjs
- docs/ROUTE_FEEDBACK_REVIEW.md
- docs/ATLAS_FINAL_REVIEW.md
- docs/qa/route-feedback/build.log
- docs/qa/route-feedback/checks.json
- docs/qa/route-feedback/combined-build.log
- docs/qa/route-feedback/combined-checks.json
- docs/qa/autonomous-atlas/changed-files.txt

[Pełny manifest PR187](qa/autonomous-atlas/changed-files.txt). Produkcja, main, hosting/Vercel, sources/AGENTS, fotografie/GPX, premium galerie, zależności i nieopublikowane obszary laptopa bez zmian.
