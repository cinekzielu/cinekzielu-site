# Wyszukiwanie atlasu po regionie i nazwie — 26.10.2026

## Stan i zakres

Świeży checkout chmurowy, aktualny PR187 `ef35f509f2038af5ddf13b017988c1860cb44b89`. Main `6ff7295f9210003787e36adf1e5092bcab191a26`, PR185 `483313fb567c4781cf2716a91a53cddb58e62968`, PR186 `8a43483a35ce3a82db97024f774434fd475a67a8`. Sprawdzono reguły projektu, historię i raporty wcześniejszych iteracji; brak AGENTS.md. Brak konkurencyjnej aktywnej iteracji. Kontynuacja w ramach zgody na pięciogodzinną serię z26.10; bez publikacji.

## Dwa potwierdzone problemy

1. Wyszukiwarka brała pod uwagę wyłącznie pojedynczy łańcuch rodziców. `Alpy Triglav`, `Alpy Dufourspitze`, `Alpy Zermatt` i `Polska Rysy` zwracały puste listy, choć te miejsca należą do odpowiednich istniejących map. Teraz indeks uwzględnia również istniejące relacje countryPlaceIds i punkty profili terenu. Nie dopisuje powiązań geograficznych ręcznie, materiałów ani miejsc. Indeks powstaje raz, przy pierwszym wyszukiwaniu, po inicjalizacji danych atlasu.
2. Typowe wpisanie nazwy z łącznikiem (`Saxer-Lücke`, `Mürren-Gimmelwald`) również nie dawało wyniku. Normalizacja atlasu zamienia interpunkcję na odstępy zarówno w indeksie, jak i zapytaniu. Zachowuje istniejącą obsługę wielkości liter, polskich liter i diakrytyków. Nie zmieniono wyszukiwarki filmów ani globalnego wyszukiwania.

Pomoc atlasu otrzymała jedno sprawdzone objaśnienie: można połączyć region z nazwą, np. „Alpy Triglav”. Dotychczasowe filtry roku/materiałów pozostają osobnym krokiem i mogą nadal zawęzić wyniki. Wyszukiwanie w widoku Tatr nadal ogranicza się do przekazanej listy tatrzańskiej.

## Weryfikacja

- Wszystkie95 istniejących nazw i zapytania z nazwami przodków pozostają wyszukiwalne.
-99 istniejących relacji kraj/region–miejsce przechodzi zapytania dwuczłonowe.
- Sprawdzono odwróconą kolejność wyrazów, łączniki, dwukropek, diakrytyki i wielkość liter. Negatywne przypadki `Alpy Gerlach` i `Polska Dufourspitze` nie przypisują tych miejsc do błędnej geografii; ograniczona lista Tatr nie zwraca Triglava.
- Dodatkowy audyt100 istniejących par miejsce/rok: atlasHref → readAtlasYear zachowuje rok. Bez nowej niezgodności i bez zmiany nawigacji.
- Audyt serializacji kadru: mechanizm commit mapy ogranicza x/y do0–1 i zoom do zakresu; nie potwierdzono podejrzenia generowania długości geograficznej poza zakresem. Bez zmiany kodu kadru.
- Sam PR187: build53 stron +382 warianty, **51/51 kontroli PASS**.
- Izolowany pakiet PR185/186/187 z tą zmianą: build56+382, **54/54 kontroli PASS**.
- `git diff --check` PASS w obu checkoutach.

[Build](qa/atlas-geographic-search/build.log), [kontrole](qa/atlas-geographic-search/checks.json), [połączony build](qa/atlas-geographic-search/combined-build.log), [połączone kontrole](qa/atlas-geographic-search/combined-checks.json).

Testowa baza merge `c652dd354ccc830f77045858a88d9d7ef866dd45` plus trzy pliki tej zmiany. Wcześniejszy konflikt MapAtlas rozwiązany zgodnie z ATLAS_FINAL_REVIEW.md: sekcja PR186 + selected.routeIds?.length. Nie pojawił się nowy konflikt. Testowy merge nie jest publikowany, PR187 nie kopiuje pozostałych draftów.

## Ograniczenia i następny krok

Brak browser QA, zrzutów i pomiarów wydajności. Nie obchodzono ani nie ponawiano odmowy URL/security policy. Testy danych, Node, prerender i porównania tekstu nie dowodzą działania fokusu, klawiatury, historii, konsoli ani układu przy320/390/1280px. Te testy pozostają konieczne przed scaleniem.

Następny krok: audyt spójności filtrów katalogu tras (rok/pasmo/materiały/obszar) z bezpośrednim wyborem trasy oraz powrotem do atlasu; poprawiać tylko odtworzone przypadki. Przy niezależnie dozwolonym UI sprawdzić też nowe zapytania, wybór wyniku, powrót, filtry roku oraz pełną ścieżkę atlas → szczyt → trasa → fullscreen. Nie powtarzać zakończonych audytów jako nowych dodatków.

## Manifest iteracji

- src/data/atlasContent.js
- src/data/atlasHelp.js
- scripts/check-atlas.mjs
- docs/ATLAS_GEOGRAPHIC_SEARCH_REVIEW.md
- docs/ATLAS_FINAL_REVIEW.md (odnośnik)
- docs/qa/atlas-geographic-search/build.log
- docs/qa/atlas-geographic-search/checks.json
- docs/qa/atlas-geographic-search/combined-build.log
- docs/qa/atlas-geographic-search/combined-checks.json
- docs/qa/autonomous-atlas/changed-files.txt

[Pełny manifest PR187](qa/autonomous-atlas/changed-files.txt). Bez zmian produkcji, main, Vercel, źródeł, oryginalnych materiałów, galerii premium, zależności ani nieopublikowanych funkcji laptopa.
