# Odzyskiwanie bezpośredniego wyboru trasy — 26.10.2026

## Stan wejściowy

Cloud executor i świeży checkout GitHub potwierdzone. PR187: `aad7dfe9199f690e4647fb0b6e8b8a2911d491da`; main `6ff7295f9210003787e36adf1e5092bcab191a26`; PR185 `483313fb567c4781cf2716a91a53cddb58e62968`; PR186 `8a43483a35ce3a82db97024f774434fd475a67a8`. Przeczytano PROJECT_RULES i raporty atlasu, Tatr i wyszukiwania geograficznego. Brak AGENTS.md, brak konkurencyjnego zapisu. Kontynuacja autoryzowanej serii z26.10; wyłącznie draft PR187, bez publikacji.

## Ustalenie i zmiana

Istniejący parser celowo odrzuca wybór trasy niezgodnej z filtrami. Nie zmieniono tej reguły. Brakowało wyjaśnienia, dlaczego bezpośredni link nie otworzył profilu. Ten sam problem informacyjny dotyczył nieznanego identyfikatora i trasy wykluczonej przez obszar mapy po załadowaniu GPS.

Dodano niewielki komunikat RouteLinkNotice i czysty resolver routeLinkRecovery:

- Nieznany identyfikator: informacja o braku trasy oraz link usuwający błędny wybór, z zachowaniem pozostałych filtrów.
- Istniejąca trasa ukryta przez rok, pasmo, dystans, podejścia lub materiały: nazwa trasy i link „Otwórz tę trasę bez filtrów”. Dopiero użycie linku czyści filtry, wybiera właściwą trasę i kieruje do #profil.
- Ślad nieprzecinający wybranego obszaru: osobne wyjaśnienie, dopiero gdy istniejący mechanizm areaReady potwierdzi gotowość danych. Brak komunikatu o wykluczeniu w trakcie pobierania.
- Zachowane widok listy/mapy, sortowanie, porównywane trasy/dni i poprawny parametr km. Stare aliasy nadal rozwiązują się do obecnych tras.

Przykłady: `/trasy?trasa=missing&pasmo=Tatry&rok=2025`, `/trasy?trasa=dufourspitze&pasmo=Tatry`, `/trasy?trasa=dufourspitze&obszar=19,49,21,50`. Ostatni przypadek sprawdzono z rzeczywistym dufourTrack.json. Obszar0,40,20,50 obejmuje ten sam ślad i nie powoduje komunikatu.

Użyto istniejącego stylu black/gold, natywnego linku i oddzielnego komunikatu role=status. Bez nowego stanu nawigacji, zmiany parsera, zależności, animacji, materiałów ani zdjęć. Nowy komunikat dodano w dwóch liniach integracji RouteCatalog; mechanizmy pobierania PR185 pozostają nietknięte.

## Aktualne testy

- **798 zestawień rzeczywistych tras i pojedynczych filtrów**, w tym442 odrzucone wybory z poprawnym linkiem odzyskiwania.
- Nieznane ID, constructor, __proto__ i tekst podobny do HTML są obsłużone bez wstawiania surowego ID do komunikatu.
- Prawidłowe bezpośrednie linki i stary alias nie otrzymują komunikatu.
- Jednoczesne konflikty kilku filtrów, rok/pasmo, obszar, hash #profil, zachowanie widoku/sortowania/porównania i km. Rzeczywisty GPX wewnątrz i poza obszarem.
- Render statyczny JSX: komunikat status i jeden natywny link; to nie browser QA.
- `npm run build` PR187: PASS,53 strony +382 warianty; **52/52 scripts/check-*.mjs PASS**.
- Izolowane połączenie z PR185/186: build PASS,56+382; **55/55 kontroli PASS**.
- `git diff --check`: PASS w obu checkoutach.

[Build](qa/route-link-recovery/build.log), [kontrole](qa/route-link-recovery/checks.json), [połączony build](qa/route-link-recovery/combined-build.log), [połączone kontrole](qa/route-link-recovery/combined-checks.json).

Baza merge QA `b24d3eea0b09bcf7d9e3bfc904b9dfdc36927422` plus cztery pliki kodu/testu tej iteracji. Wyłącznie wcześniejszy konflikt MapAtlas: zachowano sekcję PR186 i dodano selected.routeIds?.length. Patch RouteCatalog nakłada się na PR185 bez dodatkowego konfliktu. Merge QA nie jest wysyłany.

## Ograniczenia i następny krok

Nie wykonywano browser QA ani screenshotów, nie obchodzono wcześniejszej odmowy URL/security policy, nie zmieniano ochrony Vercel. Nie potwierdzono wizualnie układu320/390/1280px, zachowania fokusu/klawiatury, rzeczywistego Wstecz/Dalej, konsoli, ładowania na wolnym łączu ani komunikatów czytnika ekranu. Brak pomiarów wydajności. Testy parserów, GPX i SSR nie zastępują tych kontroli.

Następny krok: sprawdzić spójność opisu metryk tras i rozróżnienia całej wyprawy od dziennych zapisów w istniejących kartach i metadanych, bez modyfikowania GPX ani nieopublikowanych funkcji zdjęć. Przy dozwolonym UI sprawdzić trzy powyższe linki, powrót z profilu, Wstecz/Dalej i brak przedwczesnego komunikatu podczas ładowania obszaru. Nie powtarzać dzisiejszej matrycy filtrów jako nowego dodatku.

## Manifest iteracji

- src/components/RouteCatalog.jsx
- src/components/RouteLinkNotice.jsx
- src/data/routeLinkRecovery.js
- scripts/check-route-link-recovery.mjs
- docs/ROUTE_LINK_RECOVERY_REVIEW.md
- docs/ATLAS_FINAL_REVIEW.md (odnośnik)
- docs/qa/route-link-recovery/build.log
- docs/qa/route-link-recovery/checks.json
- docs/qa/route-link-recovery/combined-build.log
- docs/qa/route-link-recovery/combined-checks.json
- docs/qa/autonomous-atlas/changed-files.txt

[Pełny manifest PR187](qa/autonomous-atlas/changed-files.txt). Main, produkcja, Vercel, sources/AGENTS, galerie premium i nieopublikowane obszary laptopa bez zmian.
