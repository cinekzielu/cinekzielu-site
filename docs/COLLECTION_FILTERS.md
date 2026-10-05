# Filtry galerii i wypraw — etap lokalny

Na `/galerie` i `/wyprawy` można łączyć miejsce z rokiem wyjazdu.
Filtry mają wspólny komponent i korzystają z istniejących danych kolekcji.
Widoczne są tylko miejsca i lata, dla których istnieją materiały.
Kolejność wypraw i galerii pozostaje zgodna z dotychczasową selekcją.

- `miejsce=tatry`, `miejsce=alpy`, `miejsce=szwajcaria` wybiera miejsce.
- `rok=2025` lub `rok=2026` wybiera rok; opcje lat powstają z danych.
- Parametry można łączyć, np. `/galerie?miejsce=tatry&rok=2025`.
- Odświeżenie i historia przeglądarki odtwarzają wybór.
- „Wszystkie” resetuje miejsce; „Wyczyść filtry” resetuje oba kryteria.
- Nieznane wartości adresu są traktowane jako brak danego filtra.
- Pusty wynik ma krótką informację i możliwość wyczyszczenia filtrów.

Liczba wyników jest ogłaszana czytnikom ekranu. Przyciski sygnalizują wybór
przez `aria-pressed`, rok korzysta z natywnego pola wyboru. Po wyczyszczeniu
filtrów fokus trafia na przycisk „Wszystkie”. Kontrolki mają co najmniej 44 px
wysokości; na małym ekranie miejsca zajmują dwie kolumny.

## Weryfikacja

- Build: poprawny, 19 stron z osobnymi metadanymi.
- Kontrole `check-release.mjs` (także lokalne HTTP) i `check-atlas.mjs`: poprawne.
- Galerie: Tatry daje 5 wyników, Tatry + 2025 daje Świnicę, Szwajcaria + 2026
  daje pusty wynik. Reset przywraca 7 galerii i fokus.
- Cofanie, przechodzenie naprzód, odświeżenie i powrót z galerii odtwarzają
  wybrany zestaw filtrów.
- Wyprawy: Tatry + 2026 daje 4 wyniki; Tatry + 2025 daje 1 wynik.
- Widok 390 × 844: oba indeksy bez przewijania w poziomie, czytelne kontrolki.
- Świnica: 8 zdjęć, poprawne przejście z ostatniego do pierwszego,
  załadowane zdjęcie 2000 px, zamknięcie Escape i przywrócenie fokusu.
- Brak błędów konsoli w przeglądarce podczas tych kontroli.

Zmiana lokalna. Bez nowych bibliotek, publikacji i zmian w mapach.
