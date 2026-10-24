# Autonomiczny audyt atlasu — 24.10.2026

## Status

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

## Manifest tego pakietu

- `docs/AUTONOMOUS_ATLAS_REVIEW.md`
- `docs/qa/autonomous-atlas/combined-build.log`
- `docs/qa/autonomous-atlas/combined-check-results.json`
- `docs/qa/autonomous-atlas/changed-files.txt`

Manifest dotyczy tylko raportu. Pełne listy kodu PR185/186 pozostają w ich własnych dokumentacjach. **Draft do przeglądu; bez zgody na merge i publikację.**
