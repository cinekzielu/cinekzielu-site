# Afryka i aktualizacja kontaktu

Lokalny etap z 4 października 2026, na wyraźną prośbę użytkownika. Podgląd: http://127.0.0.1:8767/mapa?atlas=africa. Nieopublikowany.

Aktualizacja: kolejny zaakceptowany do lokalnej realizacji etap opisano w [MOROCCO_ATLAS.md](MOROCCO_ATLAS.md). Maroko otwiera teraz własną mapę, a Toubkal zbliżenie Atlasu Wysokiego. Poniższy opis dokumentuje pierwotny etap z 61 węzłami; aktualny atlas ma 73 węzły i bardziej stonowane kolory Afryki.

- Adres w danych autora i odnośniku kontaktowym: `cinekzielu@gmail.com`.
- Kliknięcie Afryki na mapie świata otwiera niezależny widok kontynentu. Maroko jest jedynym oznaczonym kierunkiem; etykieta i obrys otwierają dotychczasowy panel z dwoma zweryfikowanymi wcześniej filmami.
- Zachowane identyfikatory `africa`, `morocco`, `toubkal` i ich hierarchia. Wybór Toubkalu utrzymuje Afrykę jako kontekst. Wspólne przybliżanie, historia przeglądarki, odnośniki bezpośrednie i okruszki nawigacji działają także na stronie głównej.
- Pozostałe obrysy są wyłącznie tłem. Nie dodano fikcyjnych odwiedzonych krajów ani materiałów. Nadal 61 węzłów atlasu, 11 galerii, 220 fotografii i 28 filmów.
- Widok SVG w dotychczasowych kolorach black/gold. Etykieta HTML zachowuje obszar kliknięcia co najmniej 48 px również na telefonie. Bez nowych bibliotek, kluczy, płatnych usług ani zewnętrznych zapytań podczas wyświetlania Afryki.

## Pochodzenie geometrii

Obrysy: [Natural Earth 1:110m Admin 0 countries](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson), [warunki użycia — public domain](https://www.naturalearthdata.com/about/terms-of-use/). Zachowano granice reprezentowane w tym zbiorze, bez ręcznego łączenia terytoriów. Rozdzielczość 1:110m jest mapą poglądową i nie obejmuje wszystkich małych wysp. Oznaczenie Maroka wykorzystuje rekord MAR, a pozycja etykiety współrzędne `LABEL_X/Y` źródła.

Wygenerowane `src/data/africaMapPaths.json` zawiera 51 obrysów z afrykańskiej części zbioru, identyfikatory źródłowe, źródłowy SHA-256 i opis niezależnej projekcji liniowej. Geometria nie korzysta z ręcznych współrzędnych Europy ani Tatr. Prywatny plik źródłowy i kopia przed zmianami pozostają poza repozytorium.

## Weryfikacja

- Produkcyjny build, `check-atlas.mjs`, `check-release.mjs` z HTTP (29 podstron) i `git diff --check`: poprawne.
- Odciski siedmiu istniejących plików SVG, tła świata/Europy, współrzędnych i blokady zależności: niezmienione.
- Desktop 1280 px i emulowany telefon 390 px: brak poziomego przepełnienia; poprawny widok i wybór Maroka. Na telefonie etykieta ma 92 × 48,6 px.
- Sprawdzone: Świat → Afryka klawiaturą, Maroko, Toubkal, historia wstecz/dalej, powiększenie 150% i reset, mobilne przejście do materiałów z przywróceniem fokusu, widok Europy, osadzenie na stronie głównej, adres `mailto:cinekzielu@gmail.com`.
- Brak błędów konsoli podczas sprawdzeń. Stary adres nie występuje w kodzie strony ani gotowym buildzie.

Test mobilny wykonano przez zmianę rozmiaru widoku przeglądarki, bez fizycznego telefonu. Nowe wyprawy pozostają wstrzymane.
