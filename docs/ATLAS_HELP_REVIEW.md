# Pomoc atlasu i gotowe widoki

24.10.2026. Dodatek przygotowany w wykonawcy chmurowym po prośbie użytkownika o dalsze dodatki. Kontynuacja istniejącego draft PR187, bez nowego PR, merge do main lub publikacji. Początkowy head: `8eb4bfaaa3067f2c8342745336b1e145556763e7`. Main nadal `6ff7295f9210003787e36adf1e5092bcab191a26`, PR185 `483313fb567c4781cf2716a91a53cddb58e62968`, PR186 `8a43483a35ce3a82db97024f774434fd475a67a8`. Otwarte PR 155/185/186/187. Przeczytano PROJECT_RULES i aktualny raport; brak AGENTS.md.

## Co zobaczy użytkownik

Na `/mapa`, pod wstępem, znajduje się domyślnie zwinięte „Jak korzystać z atlasu”. Natywne `details`/`summary` otwiera cztery krótkie wskazówki: wybór miejsca i roku, przejście do materiałów/GPX, kopiowanie kadru i brak wyników. Na końcu są trzy gotowe widoki: Tatry 2025, Alpy 2026 oraz Gerlach 2025, link do katalogu tras i informacja o istniejącym sterowaniu klawiaturą mapy terenu.

Wcześniej nie było zbiorczej pomocy: podpowiedzi występowały przy pojedynczych kontrolkach. Dodatek gromadzi je przy wejściu do atlasu. Nie dodaje kolejnej strony, dialogu ani kroku wymagającego obsługi. Otwarcie/zamknięcie wskazówek nie zapisuje URL, nie zmienia wybranej mapy i nie ma własnego stanu React. Zwykłe linki przykładów celowo przechodzą do odpowiedniego miejsca/roku.

Ten sam komponent jest w interaktywnej stronie oraz `MapPageOverview`, dzięki czemu początkowy HTML także zawiera pomoc i przykłady. Istniejące mechanizmy ładowania mapy pozostają bez zmian. Pomoc nie zapisuje swojego otwarcia między przejściami ani wymianą fallbacku na mapę.

## Zakres treści i stylu

Instrukcje odnoszą się tylko do funkcji obecnych na main, sprawdzonych w kodzie: `MapAtlas`, `TatryTerrainMap`, `atlasViewState`, `sharePages`, katalog tras. Wskazówki dotyczące klawiatury wyraźnie odnoszą się do mapy terenu. Gwiazda celu pozostaje planem, a brak GPX nie jest sugerowany jako błąd. Nie opisano dodatków z laptopa ani nieopublikowanych galerii.

Bez zależności, fotografii, GPX, nowych miejsc czy wypraw. Natywny element jest domyślnie zamknięty, ma fokus klawiatury i kontrolkę min. 48 px. Wskazówki mają dwie kolumny na szerokim ekranie i jedną poniżej 600 px, linki mogą się zawijać. CSS ograniczony do `.cz-atlas-help`; black/gold, odziedziczone fonty, bez animacji. To opis implementacji CSS, nie wynik pomiaru w przeglądarce.

## Weryfikacja

- `npm ci --ignore-scripts` z istniejącym lockfile, bez zmian zależności.
- Sam PR187: `npm run build` PASS — 53 strony + 382 warianty; **49/49 kontroli PASS**.
- Izolowany lokalny merge z PR185/186: bez konfliktów, build PASS — 56 stron + 382 warianty; **52/52 kontroli PASS**. Merge testowy `18da9fc98b715df673c96f3f83ef553453e6e1bd` nie jest wysyłany.
- Nowy `scripts/check-atlas-help.mjs` sprawdza, czy przykłady zachowują wskazane ID i lata w rzeczywistych parserach, czy mają istniejące materiały, czy katalog ma stronę i publiczne metadane, a zbudowany HTML zawiera pojedyncze domyślnie zamknięte `details`, tematykę, przykłady oraz jeden H1.
- Dotychczasowe kontrole metadanych, zasobów, prerenderu, linków, filtrów i poprzednich regresji przechodzą.
- `git diff --check` PASS.

Dowody: [build](qa/atlas-help/build.log), [build połączony](qa/atlas-help/combined-build.log), [wszystkie kontrole z wynikami](qa/atlas-help/validation.json).

**Ograniczenie:** brak nowego browser QA, screenshotów, pomiarów szybkości, fizycznego telefonu, Safari/Firefox i czytnika ekranu. Wcześniejsza blokada URL/security policy podglądu chmurowego pozostaje opisana w AUTONOMOUS_ATLAS_REVIEW; nie obchodzono jej innym narzędziem ani transportem. Natywna semantyka i analiza HTML nie zastępują testu klawiatury i layoutu. Pełna ścieżka połączonego atlasu nadal nie jest zaliczona jako przetestowana w przeglądarce.

## Manifest i następny krok

Pliki tego dodatku:

- `src/components/AtlasHelp.jsx` — nowy natywny panel.
- `src/data/atlasHelp.js` — tekst i istniejące przykłady.
- `src/atlasHelp.css` — lokalne style pomocy.
- `src/components/MapPage.jsx` — osadzenie panelu.
- `src/components/AtlasOverview.jsx` — osadzenie w początkowym HTML.
- `scripts/check-atlas-help.mjs` — sprawdzenie przykładów i renderu.
- `docs/ATLAS_HELP_REVIEW.md` — ten raport.
- `docs/AUTONOMOUS_ATLAS_REVIEW.md` — odnośnik do dodatku, z zachowaniem historii.
- `docs/qa/atlas-help/build.log`, `combined-build.log`, `validation.json` — dowody.
- `docs/qa/autonomous-atlas/changed-files.txt` — aktualny pełny manifest PR187 od main.

Następny krok: po przywróceniu dozwolonego podglądu sprawdzić rozwijanie pomocy Enter/Space i kolejność Tab, widoki 320/390/1280, przejścia trzech przykładów oraz wcześniejszą ścieżkę atlas → szczyt → trasa → pełny ekran → powrót. Main, produkcja i Vercel pozostają bez zmian. Draft wymaga przeglądu przed ewentualnym scaleniem.
