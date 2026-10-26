# Opis tekstowy karty i audyt statystyk tras — 26.10.2026

## Stan i zakres

Świeży checkout w wykonawcy chmurowym, bez laptopa. PR187 przed zmianą: `8c05078913ebf9c2de3c5107d45324ef8468836e`; main `6ff7295f9210003787e36adf1e5092bcab191a26`; PR185 `483313fb567c4781cf2716a91a53cddb58e62968`; PR186 `8a43483a35ce3a82db97024f774434fd475a67a8`. Sprawdzono PROJECT_RULES, historię i poprzednie raporty; brak AGENTS.md. Brak konkurencyjnej aktywnej iteracji. Kontynuacja w autoryzowanej serii z26.10; tylko draft PR187.

## Audyt i zmiana

Wszystkie42 dystanse katalogu są zgodne z pełnym track.distance, a wszystkie42 sumy podejść są zgodne z istniejącym estimateAscent. Nie znaleziono podstaw do zmiany źródłowych statystyk. Istniejące kontrole trzech połączonych wypraw i sześciu dni również przeszły: dystans dzienny zaczyna się od zera, dni nie są ponownie doliczane do sumy, przerwy i wysokości źródłowe pozostają rozdzielone. To potwierdzenie istniejącego zachowania, nie nowa naprawa sumowania.

Potwierdzono natomiast lukę w alternatywie tekstowej karty. Canvas zawiera liczby, lecz jego dotychczasowy aria-label wymieniał jedynie rodzaje informacji, a sąsiedni opis zawierał tylko tytuł i daty. Użytkownik korzystający z tekstu nie otrzymywał wartości karty w tym opisie.

Rozszerzono istniejący akapit opisu o:

- dystans całego zapisu, w tym samym formacie co na PNG;
- sumę podejść jako przybliżenie z GPS;
- nazwę i wysokość najwyższego przypisanego szczytu, z rozróżnieniem od odczytów GPS, albo informację o braku przypisanego szczytu;
- informację o całym zapisie, a przy istniejącym podziale na dni także ich liczbę.

Canvas wskazuje ten akapit przez aria-describedby. Opis używa tych samych danych katalogu i szczytów co karta. Nie nazywa zapisu jednodniowym, jeśli brak metadanych dni. Nie wprowadzono nowego panelu, stylu, fontu, zależności ani zmian PNG, wykresów, GPX i fotografii. Dotychczasowa treść podglądu pozostaje na końcu opisu.

## Weryfikacja

Rozszerzono istniejący check-route-summary-card.mjs. Dla wszystkich42 kart porównuje dane opisu z rzeczywistymi poleceniami fillText wywołanymi przez drawRouteCard. Kontekst testowy tylko zapisuje wywołania tekstowe; nie renderuje obrazu, nie mierzy prawdziwej czcionki i nie służy do oceny przepełnień. Zachowane kontrole geometrii, przerw w nagraniu, agregacji filtrów i deduplikacji aliasów. Dodatkowo sprawdza pełny zakres zapisu, dane szczytu i powiązanie aria-describedby.

- PR187: build53 stron +382 warianty, **52/52 kontroli PASS**.
- Izolowane połączenie z PR185/186: build56+382, **55/55 kontroli PASS**.
- `git diff --check` PASS w obu checkoutach.

[Build](qa/route-card-description/build.log), [kontrole](qa/route-card-description/checks.json), [połączony build](qa/route-card-description/combined-build.log), [połączone kontrole](qa/route-card-description/combined-checks.json).

Baza testowego merge: `cd88f84087f0be37a1fd6cbe521c12e7da5d9838` plus trzy pliki kodu/testu tej iteracji. Wyłącznie znany konflikt MapAtlas, rozwiązany sekcją PR186 z warunkiem selected.routeIds?.length. Nowa zmiana nie dodaje konfliktu. Merge QA nie jest publikowany.

## Ograniczenia i następny krok

Brak browser QA, testu czytnika ekranu, klawiatury/fokusu,320/390/1280px, overflow, konsoli, pobierania PNG w przeglądarce i screenshotów. Nie ponawiano ani nie obchodzono wcześniejszej odmowy URL/security policy. Brak pomiarów wydajności. Kontrola poleceń canvas nie jest testem pikseli ani testem interfejsu.

Następny krok: przegląd semantycznych opisów i stanów ładowania/błędu przy mapach/profilach, z pominięciem nieopublikowanych funkcji zdjęć; tylko potwierdzone luki. Przy dozwolonym UI sprawdzić kartę Dufourspitze, Toubkalu oraz Zermatt, opis pełnego zapisu, przełączanie trasy i odczyt czytnika ekranu. Wszystkie wcześniejsze scenariusze integracyjne pozostają otwarte przed decyzją o scaleniu.

## Manifest iteracji

- src/components/RouteCard.jsx
- src/data/routeCardDescription.js
- scripts/check-route-summary-card.mjs
- docs/ROUTE_CARD_DESCRIPTION_REVIEW.md
- docs/ATLAS_FINAL_REVIEW.md (odnośnik)
- docs/qa/route-card-description/build.log
- docs/qa/route-card-description/checks.json
- docs/qa/route-card-description/combined-build.log
- docs/qa/route-card-description/combined-checks.json
- docs/qa/autonomous-atlas/changed-files.txt

[Pełny manifest PR187](qa/autonomous-atlas/changed-files.txt). Main, produkcja, hosting/Vercel, sources/AGENTS, galerie premium, materiały oraz nieopublikowane obszary laptopa bez zmian.
