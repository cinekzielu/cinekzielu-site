# Pierwsza wersja do przeglądu — 4 października 2026

## Aktualizacja zatwierdzona do publikacji — 5 października 2026

Użytkownik ponownie zlecił wdrożenie nowych, obejrzanych lokalnie zmian na istniejącą stronę cinekzielu.pl. Ta zgoda zastępuje wcześniejsze odłożenie publikacji opisane w dokumentach poszczególnych etapów.

Pakiet obejmuje 29 stron, 11 galerii z 220 zdjęciami, portfolio fotografii, stronę O mnie z potwierdzonym kontaktem, filtry kolekcji, wspólne wyszukiwanie, odtwarzacz filmów oraz wspólny atlas krajów i obszarów. Atlas ma 73 miejsca, 14 obrysów państw, osobne obszary górskie i materiały z różnych lat. Świat i kontynenty zachowują indywidualny styl.

Build oraz wszystkie siedem kontroli `check-*.mjs` przeszły przed publikacją. Pliki galerii to wyłącznie 660 wariantów 220 zdjęć aktualnego katalogu; wycofane selekcje, oryginały i prywatne manifesty pozostają poza repozytorium. Przed wysłaniem sprawdzono aktualny główny commit `ff1f462bec8fe001b4d92f7a75d7e91de8e28179`. Zależności i dostawca hostingu bez zmian. Po wdrożeniu wymagane sprawdzenie rzeczywistych stron, zasobów, przekierowań i działania obrysów na domenie produkcyjnej.

Poniżej pozostaje historyczna kontrola poprzedniego wdrożenia.

Status: wersja zaakceptowana przez użytkownika wraz z poprawkami miniaturek i odstępów. Publikacja pod cinekzielu.pl została autoryzowana 4 października 2026. Poniżej zapis kontroli poprzedzającej wdrożenie.

## Zakres

- Strona główna, mapa, biblioteka 28 filmów, indeks wypraw, cztery wyprawy, indeks galerii i cztery galerie. Łącznie 13 stron kanonicznych i 129 zdjęć.
- Zaakceptowany terenowy widok Tatr pozostaje aktualnym kierunkiem. Świat i Europa zachowują indywidualną oprawę.
- Główna selekcja obejmuje trzy filmy i trzy kierunki: Tatry, Maroko, Szwajcarię. Liczby materiałów pochodzą ze wspólnego katalogu. Usunięto z tych kart nieaktualne lata i statusy starych szkiców.
- Oryginalne fotografie, galerie, ręczne mapy SVG, projekcje i zależności zachowane.

## Ładowanie zdjęć

Główny portret ma dwa warianty WebP: 105 916 B i 252 026 B, wobec 6 104 762 B oryginału. To około 96–98% mniej danych samego pliku, nie pomiar przyspieszenia całej strony. Trzy miniatury filmów mają warianty 640 i 960 px. Okładki wypraw dobierają rozmiar do ekranu. Duże zdjęcia galerii nadal pobierane są przy otwarciu podglądu.

Oryginałów nie nadpisano. Warianty znajdują się w `public/images/optimized`, obrazy udostępniania w `public/share`. Obrazy udostępniania są eksportami zaakceptowanych zdjęć, bez dodatkowych tytułów i grafik.

## Adresy i udostępnianie

`src/data/siteMetadata.js` jest wspólnym źródłem tytułów, opisów, adresów kanonicznych i obrazów udostępniania. Domyślna domena odpowiada obecnemu zapisowi projektu: `https://www.cinekzielu.pl`.

Podczas zwykłego `npm run build` wtyczka z `vite.config.mjs` uruchamia `scripts/generate-site-pages.mjs`. Powstają osobne pliki HTML z metadanymi dla każdej strony, `sitemap.xml`, `robots.txt`, `404.html` i lokalne aliasy starszych adresów. Treść React jest nadal renderowana w przeglądarce; to generowanie nagłówków, nie pełne renderowanie stron po stronie serwera.

`vercel.json` używa czystych adresów, jawnych stałych przekierowań starszych wypraw oraz standardowej strony 404. Usunięto przepisywanie wszystkich adresów na wspólny `index.html`, które nadpisywałoby indywidualne metadane. Nieznany adres pokazuje komunikat i linki do dalszego przeglądania, z dyrektywą `noindex`.

## Kontrola jakości

- Produkcyjny build: PASS.
- `node scripts/check-release.mjs`: PASS — 13 różnych nagłówków, pełne adresy obrazów, JSON-LD, sitemap, robots, 404, 11 aliasów, powiązania filmów i galerii, limity rozmiaru portretu.
- Ten sam test z `RELEASE_PREVIEW_URL=http://127.0.0.1:8766`: PASS — wszystkie 13 stron zwracają właściwe metadane w początkowym HTML, bez uruchamiania JavaScript.
- `node scripts/check-atlas.mjs`, `node scripts/check-tatry.mjs`: PASS.
- Kontrola zachowania galerii: 129 zdjęć, 258 WebP, brak EXIF, nienaruszone mapy i zablokowane pliki zależności.
- Przeglądarka: wszystkie 13 stron przy 1280 px; typy stron także przy 320, 390 i 768 px. Brak poziomego przewijania, błędnych linków wewnętrznych, brakujących opisów obrazów i zaobserwowanych uszkodzonych obrazów. Konsola bez błędów i ostrzeżeń.
- Menu mobilne: przejście do sekcji, zamknięcie, Escape, zawijanie fokusu i przywrócenie przewijania.
- Galeria: otwarcie, strzałki, licznik, Escape, powrót fokusu i szybkie zamknięcie/ponowne otwarcie.
- Mapa Tatr → Kończysta → wyprawa → film; wyprawa → galeria; filtrowanie filmów, wyszukiwanie bez znaków diakrytycznych, brak wyników i wyczyszczenie filtrów.
- Starszy adres Szwajcarii prowadzi do aktualnej wyprawy; nieznany adres pokazuje stronę błędu.

## Przy publikacji

1. Wdrożenie zostało uzgodnione z użytkownikiem. Po wdrożeniu sprawdzić faktyczne przekierowania HTTP, status 404, domenę kanoniczną i podglądy w zewnętrznych serwisach. Vite Preview nie odtwarza wszystkich zachowań hostingu Vercel, w szczególności statusów nieznanych adresów.
2. Sprawdzono ponownie 4 października 2026: [Top-O-Map](https://top-o-map.com/) jawnie udostępnia użyty adres kafelków do integracji we własnych stronach i aplikacjach, także profesjonalnych. Zachowano tego dostawcę i widoczne oznaczenia źródeł; nie ma jednak jasno podanych limitów ruchu ani SLA. W razie niedostępności podkładu pozostają lista miejsc i materiały; nie pobieramy kafelków na zapas. Licencja danych OSM i oznaczenie autorstwa mapy nie stanowią gwarancji hostingu. Widoczna atrybucja została zachowana; szczegóły w `TATRY_ATLAS.md`.
3. Nie publikować prywatnych manifestów, ścieżek dysków, kopii oryginałów ani materiałów niezaakceptowanych do strony. Nowe galerie, Maroko i kadry z DJI pozostają osobnymi etapami.

## Poprawka po przeglądzie użytkownika

Miniatury filmów na stronie głównej wróciły do pełnego kadru 16:9. Ramka ustala proporcje, a obraz dopasowuje się do niej bez kadrowania; wysokość HTML nie wymusza już 540 px. Usunięto także wymuszanie pełnej wysokości okna w pierwszej sekcji, zmniejszono dolny odstęp do 56 px na desktopie i przyspieszono ujawnianie kolejnych sekcji przy przewijaniu. Build przeszedł; wygląd i proporcje sprawdzono przy 1920×1440 i 390×844.
