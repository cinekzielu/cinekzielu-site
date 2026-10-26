# Atlas — GPX jest materiałem

25.10.2026. Start PR187: `6a6ecfba76c080fd2058891c02527d7b0f9fcf23`. Main `6ff7295f9210003787e36adf1e5092bcab191a26`, PR185 `483313fb567c4781cf2716a91a53cddb58e62968`, PR186 `8a43483a35ce3a82db97024f774434fd475a67a8` zweryfikowane z GitHub. Otwarte PR155/185/186/187. Nowy cloud checkout; PROJECT_RULES i poprzedni raport przeczytane, brak AGENTS.md. Poprzednia iteracja zakończona, bieżąca jedyna aktywna według odczytu zadania.

## Potwierdzony problem i poprawka

Wybór miejsca w MapAtlas pokazywał „Brak materiałów”, gdy miejsce miało trasy GPX, ale nie miało filmu ani galerii. Filtr „Z materiałami” prawidłowo uwzględniał takie miejsca, a ich panel pokazywał trasy. Opis listy był więc sprzeczny z zawartością.

Odtworzono w Node na wyrażeniu pobranym z poprzedniego commita MapAtlas: `starolesny-szczyt` ma trasę `bradavica-2024`, lecz etykieta wynosiła „Brak materiałów”. [Dowód z nieudaną asercją przed poprawką](qa/atlas-material-label/before.log). To odtworzenie kodu, nie obserwacja w przeglądarce.

Nowy `atlasMaterialLabel` uwzględnia wyprawy, filmy i liczbę GPX. Przykład powyżej daje teraz „1 GPX”. Dla mieszanych materiałów liczba GPX jest dopisana po pozostałych rodzajach. Prawdziwie puste miejsca nadal mają „Brak materiałów”; planowany szczyt zachowuje „W planach”. Istniejące odmiany liczebników zachowane. Osobna lista TatryExplorer już uwzględniała GPX i nie wymagała poprawki.

Nie dodano danych, materiałów, zależności, CSS ani nowych kontrolek. Filtry, historia, hashe i istniejące linki bez zmian.

## Walidacja

- Nowa kontrola: sześć rzeczywistych szczytów mających tylko GPX (Staroleśny, Baraniec, Grześ, Rakoń, Mały Lodowy, Sławkowski), 204 kombinacje miejsca/roku oraz odmiana liczby filmów.
- PR187: build PASS (53 strony +382 warianty), **51/51 kontroli PASS**.
- Izolowane połączenie z PR185/186 bez konfliktów, QA commit `ece63749c37626951f7e513f3fc2acddccb7a1c5` (nie jest wysyłany): build PASS (56+382), **54/54 kontroli PASS**.
- `git diff --check`: PASS. Dowody: [build](qa/atlas-material-label/build.log), [kontrole](qa/atlas-material-label/checks.json), [połączony build](qa/atlas-material-label/combined-build.log), [połączone kontrole](qa/atlas-material-label/combined-checks.json).

Nadal niewykonane: browser QA320/390/1280, historia, fokus, klawiatura, overflow, konsola, Safari/Firefox/telefon/czytnik ekranu. Wcześniejszej blokady podglądu URL/security policy nie obchodzono ani nie ponawiano. Nie ma nowych screenshotów ani pomiarów wydajności. Kontrole Node nie są testami UI.

## Manifest i następny krok

Kod: `src/data/atlasMaterialLabel.js`, `src/components/MapAtlas.jsx`; test: `scripts/check-atlas-material-label.mjs`. Dokumentacja: ten raport, AUTONOMOUS_ATLAS_REVIEW.md, pięć plików dowodów w `docs/qa/atlas-material-label/` oraz aktualizacja [pełnego manifestu](qa/autonomous-atlas/changed-files.txt).

Po odzyskaniu dozwolonego podglądu: wyszukać Staroleśny w atlasie i sprawdzić opis GPX oraz przejście do profilu, następnie wcześniejsze akcje pustych wyników i pełny powrót ze szczytu/trasy. Kolejny niezależny audyt może sprawdzić zgodność wszystkich linków GPX atlasu z parserem katalogu, rokiem i istniejącym celem profilu. Nie dopisywać nowych materiałów, aby wypełniać puste miejsca. Produkcja/main/Vercel, galerie premium i dodatki laptopa bez zmian; całość pozostaje draftem do przeglądu.
