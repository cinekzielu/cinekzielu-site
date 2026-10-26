# Pobieranie tras i odporność widoków — uzupełnienie PR185

Status: pakiet do przeglądu w `codex/route-viewer-mobile-stages`, bez zgody na scalenie lub publikację. Kontynuacja w chmurze rozpoczęta 23 października 2026 o 15:12 czasu Warszawy, z limitem do 18:12. Praca nie korzystała z laptopa. Nie stosowano sztucznego oczekiwania, aby wypełnić limit.

Baza tego uzupełnienia: `a26b9955d4bdaac9fb444c10d762d1202ebe53de` w draft [PR185](https://github.com/cinekzielu/cinekzielu-site/pull/185). Produkcyjny `main` pozostaje na `6ff7295f9210003787e36adf1e5092bcab191a26` (PR184). Wcześniejszy zakres i dowody: [ROUTE_VIEWER_MOBILE_REVIEW.md](ROUTE_VIEWER_MOBILE_REVIEW.md).

## Stwierdzone problemy i rozwiązanie

1. Atlas na pierwszym ekranie telefonu pobierał wszystkie 42 przebiegi, mimo że mapa była poniżej ekranu. Nawet filtr Alp pobierał wszystkie 42. Teraz mapa rozpoczyna pobieranie w pobliżu widoku (150 px zapasu); ładuje przebiegi zgodne z filtrami. Porównanie dołącza własne trasy także spoza filtra. Filtr obszaru pobiera dane potrzebne do obliczenia wyniku również w widoku listy.
2. HTTP 503 dla danych Baranich Rogów kończyło się pustym `#root` i utratą całej strony wyprawy. Istniejące zapisy są teraz pobierane jako hashowane pliki JSON, z jednym wspólnym pobieraniem dla równoległych odbiorców, pamięcią poprawnych wyników i ponowieniem po błędzie. Timeout wynosi 20 s. Nie zmieniono żadnego zapisu ani współrzędnych.
3. Błąd danych w atlasie nie odrzuca już poprawnie pobranych tras. Lista i filtry pozostają dostępne; ponowienie pobiera brakujące dane. W wyprawie komunikat błędu pozostaje lokalny. Ponowienie klawiaturą zachowuje fokus po kolejnym błędzie, a po powodzeniu przenosi go do sekcji trasy.
4. Niedostępny moduł zdjęć pełnoekranowych również powodował pustą stronę. Osłona błędów ogranicza teraz awarię modułu do panelu zdjęć lub mapy atlasu. Można zamknąć dialog, korzystać z treści/listy albo odświeżyć stronę. Dla odrzuconego modułu JS oferowane jest odświeżenie dokumentu; nie udajemy skutecznego ponawiania modułu zapamiętanego jako odrzucony.
5. Przy opóźnieniu pobierania szybkie użycie „Zdjęcia” trafiało do małego placeholdera, a jego wymiana gubiła fokus i docelowe przewinięcie. Żądany skok jest teraz kończony po pojawieniu się panelu. Tab lub wybór innej części anuluje oczekujący skok. Nie dodano animacji ani nowych wpisów historii.

## Pomiar przed i po

Obie wersje to produkcyjne buildy w tym samym wykonawcy i Chromium w chmurze. Ten sam serwer QA, gzip Node (ustawienia domyślne), `Cache-Control: no-store`, iframe 390 × 844, początek dokumentu, brak awarii i dodatkowego opóźnienia. Klasyczny pasek przewijania zajmuje 15 px: `clientWidth` dokumentu wynosi 375 px, a szerokość iframe 390 px. Pomiary po dojściu do mapy wykonano przez istniejący link „Do wyników”.

Liczby to suma `PerformanceResourceTiming.encodedBodySize` dla wewnętrznych plików **JS + JSON**. Przed zmianą dane tras były modułami JS; po zmianie są JSON. Dzięki wspólnemu zakresowi nie pomijamy danych tylko dlatego, że zmieniły format. Tabela nie obejmuje HTML, CSS, fontów, fotografii ani zewnętrznych kafelków map.

| Widok / moment | Przed, bajty gzip JS + dane | Po, bajty gzip JS + dane | Przebiegi przed → po |
| --- | ---: | ---: | ---: |
| Atlas, pierwszy ekran | 1 428 522 | 202 943 | 42 → 0 |
| Atlas Alp, pierwszy ekran | 1 428 522 | 202 943 | 42 → 0 |
| Atlas Alp, mapa po przewinięciu | 1 428 522 | 470 690 | 42 → 11 |
| Pełny atlas, mapa po przewinięciu | 1 428 522 | 1 439 355 | 42 → 42 |
| Alpy, pierwszy ekran wyprawy | 202 107 | 202 943 | 0 → 0 |
| Maroko, pierwszy ekran wyprawy | 202 107 | 202 943 | 0 → 0 |

Pierwszy ekran atlasu wymaga około 86% mniej kodu i danych tras, a otwarta mapa Alp około 67% mniej. **To oszczędność transferu w opisanym scenariuszu, nie procentowe przyspieszenie strony.** Pełna mapa 42 tras kosztuje około 10,8 kB więcej (+0,76%); wspólny kod na stronach wypraw wzrósł o 836 bajtów gzip. Alpy i Maroko już prawidłowo odkładały pobieranie tras, więc nie wymuszano tam kolejnych zmian. Wcześniejsza poprawka zdjęć Maroka pozostaje.

Surowe zapisy: [przed](qa/route-loading/before.json), [po](qa/route-loading/after.json). Plik „po” zawiera także adresy hashowanych modułów identyfikujące badany build. Czasy DCL/LCP zapisane przez narzędzie są pomocniczą obserwacją pojedynczych przebiegów, nie stabilnym benchmarkiem. Nie wyliczamy z nich poprawy czasu.

## Weryfikacja

- `npm run build`: PASS, 53 strony + 382 widoki udostępniania. Bez nowych zależności.
- Wszystkie 50 `scripts/check-*.mjs`: PASS. [Pełne wyniki](qa/route-loading/check-results.json).
- Nowa kontrola obejmuje zakres żądań w mapie/liście/obszarze/porównaniu, współdzielenie trwającego i zakończonego pobierania, odzyskanie po HTTP 503, błędnym JSON i niepoprawnej strukturze, timeout oraz wszystkie 42 istniejące zapisy.
- Atlas: 0 przebiegów przed dojściem do mapy; po dojściu 42 lub 11 przy filtrze Alp. Lista bez porównania nie pobiera przebiegów. Bezpośrednie porównanie Dufourspitze/Ganek pobiera tylko dwa zapisy i pokazuje wspólny wykres. Wybór Alp nie usuwa porównania z Gankiem; Wstecz przywraca poprzedni URL.
- Filtr obszaru działa po pobraniu mapy. Bezpośredni link z obszarem, Alpami, rokiem 2026 i `#profil` pokazuje 5 wyników i profil Triglavu. Istniejąca walidacja URL nadal odrzuca wybór trasy niezgodny z filtrami listy.
- HTTP 503 danych Baranich Rogów: treść zachowana, powtórny błąd zachowuje fokus przycisku, po usunięciu awarii mapa/profil wracają bez odświeżenia dokumentu. Hash pozostaje. Pełny ekran nadal działa.
- HTTP 503 jednego zapisu Alp: 10 poprawnych pobrań pozostaje w pamięci; po przywróceniu pliku dochodzi jeden nowy udany transfer Triglavu, bez ponowienia poprzednich 10.
- Błąd modułu zdjęć: lokalny komunikat, zachowane zamknięcie/Escape i powrót fokusu. Błąd modułu atlasu: lokalny komunikat, 11 wierszy listy nadal dostępnych; po przywróceniu zasobu odświeżenie przywraca mapę.
- Stałe opóźnienie 400 ms na każde żądanie wewnętrznego zasobu: ponowienie danych i szybki skok do zdjęć sprawdzone na 320 × 568. Po załadowaniu fokus jest w wyborze etapu; strzałki zdjęć mają 44 px i mieszczą się w widoku.
- Sprawdzono układ 1280 × 800, 390 × 844 i 320 × 568; dokument/dialog w sprawdzonych widokach nie mają poziomego przepełnienia. Klawiatura, Escape, powrót fokusu i istniejące hashe pozostają funkcjonalne. Szersza kontrola historii, etapu i 844 × 390 jest opisana w poprzednim raporcie.
- Końcowy przebieg normalnych scenariuszy nie wykazał błędów ani ostrzeżeń aplikacji. Celowe awarie sieci generują oczekiwane błędy konsoli, w tym log React po przechwyconym błędzie modułu. Nie są raportowane jako „brak błędów”. Logi rozszerzenia przeglądarki oddzielono od aplikacji.

## Zrzuty

| Przypadek | Dowód |
| --- | --- |
| Awaria GPX przed zmianą | [Pusta strona](qa/route-loading/before-gpx-error.jpg) |
| Awaria GPX po zmianie | [Treść i lokalne ponowienie](qa/route-loading/after-gpx-error.jpg) |
| Atlas Alp, telefon | [Mapa 11 tras](qa/route-loading/atlas-alps-390.jpg) |
| Atlas Alp, desktop | [Mapa i lista](qa/route-loading/atlas-desktop-1280.jpg) |
| Niedostępny moduł atlasu | [Komunikat i zachowana lista](qa/route-loading/atlas-module-error-390.jpg) |
| Skrót do zdjęć przy opóźnieniu | [Fokus i strzałki na 320 px](qa/route-loading/slow-photo-jump-320.jpg) |

Szare otoczenie i pasek wyboru testu są narzędziem QA, nie elementem strony. Zrzuty pochodzą z rzeczywistych buildów podczas tej sesji; nie były generowane ani przerabiane.

## Ograniczenia

Nie wykonano Lighthouse, kontrolowanego dławienia CPU/pasma, pomiaru na fizycznym telefonie, Safari/iOS, Firefox ani gestów dotykowych. 400 ms jest stałym opóźnieniem serwera QA, nie emulacją 3G. Iframe sprawdza responsywne CSS, nie DPR lub dotyk urządzenia. Timeout sprawdzono automatycznie z krótkim limitem testowym; nie czekano w przeglądarce na pełne 20 s. Nie testowano awarii każdej możliwej zależności ani całkowitej pracy offline.

Preview Vercel powstaje ze zwykłego workflow gałęzi i wymaga istniejącego logowania. Testy wykonano na buildzie w chmurze; nie są testem zalogowanego preview Vercel. Nie zmieniono ochrony, hostingu ani konfiguracji wdrożeń. Tymczasowe narzędzie QA, shim `crypto.randomUUID` dla HTTP, kopia builda „przed” i zmiana komendy dev nie należą do PR.

## Lista plików do połączenia

Zmiany tego uzupełnienia w istniejących plikach:

- `src/components/RouteCatalog.jsx` — zakres/pora pobierania, zachowanie poprawnych wyników, lokalna osłona błędu modułu mapy i fokus ponowienia.
- `src/components/TripRoute.jsx` — lokalny stan pobierania/błędu/ponowienia i fokus.
- `src/components/TripRouteView.jsx` — osłona błędu modułu zdjęć i oznaczenie placeholdera.
- `src/components/RoutePresentation.jsx` — dokończenie żądanego skoku po leniwym załadowaniu panelu.
- `src/data/tripRoutes.js` — zachowany interfejs `load(): Promise<{ default: track }>`, nowy transport danych.
- `src/tripRoute.css` — przyciski błędu 44 px w black/gold.
- `docs/ROUTE_VIEWER_MOBILE_REVIEW.md` — odsyłacz i uzupełnienie listy plików.

Nowe: `src/data/routeTrackLoader.js`, `src/components/RouteLoadBoundary.jsx`, `scripts/check-route-loading.mjs`, ten raport oraz `docs/qa/route-loading/` (dwa zapisy pomiaru, wyniki kontroli i sześć zrzutów).

Pełna wcześniejsza lista jest w głównym raporcie PR185. Nie zmieniono źródeł GPX/JSON, zdjęć, grup PR184, galerii premium, Zapisanych, udostępniania zestawów, miniaturek, paska wyboru, backupu, `sources`, `AGENTS.md`, logo, fontów, Vercel ani zależności. Nie odtwarzano nieopublikowanej wersji laptopa.
