# Atlas — powrót z pustych wyników

25.10.2026. Cloud checkout odtworzony z GitHub. PR187 przed zmianą: `a078faa299f8670e6ebba2c988738c51574c751d`. Main: `6ff7295f9210003787e36adf1e5092bcab191a26`; PR185: `483313fb567c4781cf2716a91a53cddb58e62968`; PR186: `8a43483a35ce3a82db97024f774434fd475a67a8`. Otwarte PR155/185/186/187. Przeczytano PROJECT_RULES i wcześniejsze raporty; brak AGENTS.md. Odczyt zadania wskazał bieżącą iterację i zakończony poprzedni wynik, bez innej aktywnej iteracji.

## Dodatek

Przy pustej liście „Wybierz miejsce” atlas miał tylko tekstową poradę. Teraz pokazuje kontekstowe przyciski:

- „Wyczyść wyszukiwanie” przy niepustej nazwie; zmienia wyłącznie zapytanie.
- „Pokaż wszystkie lata” przy wybranym roku; używa istniejącego wyboru miejsca/roku, który również czyści zapytanie i zapisuje historię.
- „Pokaż także miejsca bez materiałów” tylko przy aktywnym filtrze materiałów i wszystkich latach. Przy wybranym roku samo wyłączenie tego filtra nie poszerza wyników, więc nie oferujemy nieskutecznej akcji.

Po akcji kod kieruje fokus do istniejącego pola wyszukiwania (bez przewijania), aby usuwany przycisk nie pozostawiał fokusu bez celu. Komunikat statusu jest oddzielony od przycisków. Dla wpisanej nazwy mówi o nazwie i filtrach, zamiast przypisywać brak wyników wyłącznie rokowi.

Dotyczy istniejącego panelu wyszukiwania MapAtlas poza widokiem Tatry; nie zmienia osobnej wyszukiwarki TatryExplorer. Nie dodaje danych, zależności ani własnego mechanizmu historii. Black/gold, dziedziczone fonty, zawijane przyciski min.44px, bez animacji. Nowy CSS w osobnym pliku: początkowy dopisek w atlasExplorer.css kolidował z PR186, więc usunięto go przed finalną walidacją. Finalny pakiet łączy się automatycznie.

## Testy

- `npm run build`: PASS, 53 strony +382 warianty.
- Wszystkie `scripts/check-*.mjs`: **50/50 PASS**.
- Izolowane połączenie PR185/186/187: bez konfliktów, commit QA `d070e615b35c7c6f0f062aad5d567b089870fc92` (nie wysyłany).
- Połączony build: PASS, 56 stron +382 warianty; **53/53 kontroli PASS**.
- Nowa kontrola renderuje rzeczywisty komponent JSX i wywołuje przekazane callbacks dla 12 kombinacji nazwy/roku/filtra. Sprawdza dostępność odpowiednich akcji, natywne przyciski i osobny status. Nie symuluje przeglądarki, fokusu ani historii.
- `git diff --check`: PASS. Dowody: [build](qa/atlas-empty-results/build.log), [kontrole](qa/atlas-empty-results/checks.json), [połączony build](qa/atlas-empty-results/combined-build.log), [połączone kontrole](qa/atlas-empty-results/combined-checks.json).

**Niewykonane:** UI przy320/390/1280px, klawiatura, rzeczywisty powrót fokusu, historia, overflow, konsola przeglądarki, Safari/Firefox/telefon/czytnik ekranu. Wcześniejsza blokada URL/security policy nie była obchodzona ani ponawiana; brak nowych zrzutów i pomiarów wydajności. Wyniki Node nie zastępują browser QA.

## Manifest i przekazanie

Kod: `src/components/AtlasEmptyResults.jsx`, `src/atlasEmptyResults.css`, `src/components/MapAtlas.jsx`. Kontrola: `scripts/check-atlas-empty-results.mjs`. Dokumentacja: ten raport, aktualizacja AUTONOMOUS_ATLAS_REVIEW.md, cztery pliki dowodów powyżej i pełny [manifest PR187](qa/autonomous-atlas/changed-files.txt).

Następny krok: przy dozwolonym podglądzie wpisać nieistniejącą nazwę w atlasie, sprawdzić trzy akcje i fokus przy320/390/1280px, następnie Wstecz po zmianie roku oraz wcześniejszą ścieżkę atlas → szczyt → trasa → fullscreen → powrót. Bez UI można niezależnie przeanalizować spójność informacji o braku GPX w istniejących materiałach, bez dublowania tej pomocy. Produkcja/main/Vercel, galerie premium, Zapisane, materiały źródłowe i laptop bez zmian. Draft do przeglądu.
