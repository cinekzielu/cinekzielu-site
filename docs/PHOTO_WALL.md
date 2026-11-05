# Studio fotografii

Nowa podstrona `/fotografia/sciana` pozwala wybrać fotografie z istniejącego portfolio Marcina Zielińskiego i ułożyć je w ramkach na wirtualnej ścianie. Wejścia znajdują się w menu Fotografia oraz na stronie portfolio. Strona otrzymuje własne metadane, kanoniczny adres i dokument HTML generowany przez istniejący prerender.

## Zakres

- Biblioteka korzysta z rzeczywistych, już opublikowanych fotografii portfolio; nie dodaje nowych zdjęć ani nie zmienia ich tożsamości w galeriach.
- Gotowe kompozycje oraz ręczne rozmieszczanie ramek pomagają dobrać zestaw. Kolor ściany, kolor ram i passe-partout zmieniają podgląd.
- Formaty oznaczają preferowane wymiary fotografii. Wizualizacja ma charakter poglądowy; nie potwierdza dostępności odbitek ani dopuszczalnego rozmiaru druku dla konkretnego pliku.
- Zapis układu jest lokalny dla przeglądarki. Nie ma kont, serwera zamówień ani synchronizacji między urządzeniami.
- Link odtwarza wyłącznie ustawienia konfiguratora. Identyfikatory fotografii, formaty, kolory, liczba ramek i położenia przechodzą walidację; adresy obrazów i kod HTML z linku nie są przyjmowane.
- Zapytanie przygotowuje wiadomość do rzeczywistego kontaktu autora. Użytkownik sam ją wysyła; kliknięcie nie składa zamówienia.

Nie wprowadzono cen, płatności, koszyka, stanów magazynowych ani obietnic dostępności wydruków. Warunki sprzedaży i przygotowanie plików do druku wymagają osobnego etapu.

## Weryfikacja i publikacja

Przeprowadzone kontrole (5 listopada 2026): `npm run build`, `check-photo-wall.mjs`, `check-photography-refresh.mjs`, `check-browse-memory.mjs`, `check-prerender.mjs`, `check-release.mjs`, `check-photo-film-separation.mjs` oraz `git diff --check` — PASS. Prerender obejmuje 57 stron i 404 widoki udostępniania.

W przeglądarce sprawdzono wybór kolekcji i podmianę fotografii, presety, kolory, format pionowy, dodanie szóstej ramki i limit, blokadę usunięcia ostatniej ramki, przesuwanie wskaźnikiem i strzałkami, odtworzenie zapisu i linku, fallback po błędnym linku, ręczne kopiowanie przy niedostępnym schowku oraz treść zapytania (bez wysyłania wiadomości). Mobilny skrót do podglądu zachowuje ręczne zmiany także po zdarzeniu `popstate` wywołanym przez kotwicę.

Sprawdzono szerokości kontenera 320/390/768/1280 px: brak poziomego przepełnienia dokumentu. Wąskie widoki badano w iframe, a przeciąganie wskaźnikiem myszy; nie wykonano testu na fizycznym ekranie dotykowym ani z czytnikiem ekranu. Odmowę dostępu do localStorage obsługuje `try/catch`; nie wymuszano jej w przeglądarce.

Podgląd HTTP ujawnił istniejące wywołanie `crypto.randomUUID()` zatrzymujące start całej strony poza bezpiecznym kontekstem. Identyfikatory historii otrzymały fallback oraz test regresji. Vite dopuszcza wyłącznie dodatkowy host deweloperski `terminal.local`; konfiguracja hostingu produkcyjnego nie uległa zmianie. Build zgłasza ostrzeżenie o rozmiarze głównego pakietu JavaScript (około 517 kB przed gzip).

Zmiana jest przygotowana do przeglądu na osobnej gałęzi. Publikacja na produkcyjnej domenie pozostaje do zatwierdzenia przez użytkownika zgodnie z wcześniejszym ustaleniem.
