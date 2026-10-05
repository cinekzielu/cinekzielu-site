# Portfolio, autor i poprawki mobilne

Etap lokalny z 4 października 2026, wybrany przez użytkownika jako jeden pakiet. Podgląd: http://127.0.0.1:8767/. Nieopublikowany.

## Zakres

- `/fotografia`: 18 wybranych fotografii z istniejących galerii, duże zdjęcie otwierające i układ zachowujący proporcje. Bez dekoracyjnych podpisów i nazw plików. Powiększenie zawiera odnośnik do galerii źródłowej.
- `/o-mnie`: krótki opis oparty na dotychczasowych treściach, istniejący portret, adres `cinekzielu@gmail.com` oraz dotychczasowe profile społecznościowe. Bez formularza i wymyślonych informacji biograficznych. Odnośnik `#kontakt` przewija po wyrenderowaniu strony.
- Wspólne składane menu na telefonie, obsługa klawiaturą i przywracanie fokusu. Obie nowe strony dostępne z nawigacji strony głównej i podstron.
- Powiększanie zdjęć we wszystkich galeriach i portfolio: przeciągnięcie w poziomie, przyciski, strzałki klawiatury, Escape, przywrócenie fokusu i przewijania strony, ponowienie nieudanego wczytania zdjęcia. Gest nie przełącza zdjęcia przy aktywnym powiększeniu ekranu.
- 220 dodatkowych wariantów WebP o szerokości do 480 px, `srcset` i dopasowane `sizes`. Pełne zdjęcia zachowane; portfolio może wybrać duży wariant dla większych ekranów. Powiększony podgląd korzysta z pełnego pliku.

Selekcja portfolio odwołuje się do aktualnych rekordów galerii zamiast utrzymywać niezależne kopie wpisów. Usunięcie zdjęcia z galerii usuwa je również z portfolio. Dotychczasowe wykluczenia zdjęć pozostają zachowane. Nie dodano wypraw: nadal 11 galerii i 220 fotografii, a portfolio pokazuje ponownie 18 z nich. Oryginały na dyskach nie były otwierane ani zmieniane w tym etapie. Bez nowych bibliotek i zmian geometrii map.

## Rozmiary zdjęć

Porównanie tego samego zestawu 220 miniaturek: dotychczasowe pliki 18 960 066 B, nowe warianty 5 811 442 B, czyli 69,3% mniej. To porównanie wielkości plików, nie pomiar czasu ładowania strony. Przeglądarka wybiera rozmiar według szerokości obrazu, gęstości ekranu i pamięci podręcznej.

## Weryfikacja

- Produkcyjny build: poprawny. 29 unikalnych stron z metadanymi, sitemapą i obrazami udostępniania.
- `scripts/check-release.mjs` z podglądem HTTP: poprawny, 29 stron i 11 wcześniejszych aliasów.
- `scripts/check-atlas.mjs`: poprawny, 61 miejsc i zachowany odcisk źródłowego SVG.
- `git diff --check`: poprawny.
- Podgląd desktop 1280 px: portfolio, autor, menu strony głównej, trzy filmy i trzy kierunki.
- Wąskie widoki: 390 px portfolio/autor/menu/kontakt i powiększenia, 320 px istniejąca galeria Krywań, 768 px portfolio. Brak poziomego przepełnienia w sprawdzanych widokach.
- Przeciągnięcie przełącza zdjęcie 01 → 02 na desktopie i przy szerokości 390 px. Zawijanie 18 → 01 w portfolio i 08 → 01 w galerii; Escape i przywrócenie fokusu; zamykanie menu przez Escape; bezpośredni kontakt z menu głównego: poprawne.
- Galeria na 320 px rzeczywiście wybiera nowy plik `-480.webp`. Brak błędów w konsoli przeglądarki podczas sprawdzeń.

Testy mobilne wykonano w przeglądarce z emulowanym rozmiarem widoku. Fizyczny telefon, dotyk wielopunktowy i rzeczywiste warunki sieci komórkowej nie były testowane.

Nowe wyprawy pozostają wstrzymane. Ten etap oczekuje oceny lokalnego podglądu; nie wykonano publikacji.
