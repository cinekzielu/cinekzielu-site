# Trasa na pełnym ekranie i mobilne etapy — pakiet do przeglądu

Status: gotowe do przeglądu; implementacja i testy w gałęzi `codex/route-viewer-mobile-stages`. **Bez zgody na publikację. Nie scalać automatycznie.**

Baza: aktualny `main` `6ff7295f9210003787e36adf1e5092bcab191a26` (PR184), sprawdzony 23 października 2026. Poprzednie PR183–179 przejrzane pod kątem powrotu, chronologii, tras, porównań i logo. `docs/PROJECT_RULES.md` przeczytany; w repozytorium brak plików `AGENTS.md` (również zapytanie GitHub zwraca 404 dla pliku głównego). Nie czytano źródeł prywatnych ani plików laptopa.

Wynik: [draft PR #185](https://github.com/cinekzielu/cinekzielu-site/pull/185). [Preview Vercel](https://cinekzielu-site-git-codex-route-vie-466568-cinekzielus-projects.vercel.app) powstało automatycznie i ma status Ready/success. Próba otwarcia prowadzi do logowania Vercel; dodatkowego testu pod tym adresem nie wykonano. Ochrona dostępu pozostała bez zmian. Kod przetestowano wcześniej z produkcyjnego builda w wykonawcy chmurowym. Gałąź ma czysty stan scalania z bazą, ale pozostaje draftem bez zgody na publikację.

## Zakres

- Działający w przeglądarce pełnoekranowy dialog trasy: istniejąca mapa, profil i istniejące przypisane materiały. Ten sam egzemplarz mapy/profilu jest przenoszony, więc otwarcie i zamknięcie zachowują punkt profilu, dzień i ustawienie mapy. Brak animacji przejścia.
- Zdjęcia pobierane dopiero po otwarciu podglądu; jeden obraz naraz. Dla Alp: grupy ujednolicone w PR184; dla Baranich Rogów: istniejące dwie grupy dni. Pozostałe powiązania korzystają z istniejącego przypisania wyprawy i są tak opisane. Kadry filmowe są oznaczone jako kadry. Brak geolokalizacji zdjęć względem GPX.
- Mobilny wybór bieżącego etapu, poprzedni/następny etap dla Alp i Maroka. Istniejące hashe i linki pozostają, przewijanie nie zapisuje nowych wpisów historii. Desktop zachowuje dotychczasową nawigację.
- Ograniczenie przedwczesnego ładowania zdjęć rozdziałów Maroka. Hero pozostaje priorytetowe.

## Zachowane ograniczenia

Vercel, produkcja, logo, fonty, styl, układ strony głównej, galerie premium, atlasowe fotografie i katalogi tras pozostają bez zmian. W Alpach nadal jeden zestaw zdjęć pod etapem, bez powtórzenia pod profilem. Brak nowych zależności, wypraw, szczytów, GPX, fotografii lub odtwarzania nieopublikowanych dodatków z laptopa. Rumunia pozostaje poza zakresem.

## Pomiar przed/po

Podgląd chmurowy Chromium, iframe 390 × 844, ta sama strona i pozycja początkowa, bez ograniczania CPU/sieci. Iframe umożliwia sprawdzenie CSS przy wybranej szerokości; nie emuluje urządzenia ani dotyku. Liczby obrazów odnoszą się do `.cz-story-stop img`, nie do hero lub reszty strony.

| Pomiar Maroka | Przed | Po |
| --- | ---: | ---: |
| Obrazy rozdziałów w DOM | 14 | 14 |
| `loading=eager` | 10 | 0 |
| `fetchpriority=high` | 10 | 0 |
| Załadowane obrazy rozdziałów przed przewinięciem | 11 | 3 |

Dziesięć wcześniej wymuszonych miniatur 480 px zajmuje łącznie 259 880 bajtów na dysku. Nie jest to zmierzona oszczędność transferu: część tych obrazów nadal ładuje się w pobliżu ekranu. Brak deklaracji wyniku Lighthouse, LCP ani procentowego przyspieszenia.

## Weryfikacja

Praca wykonana w wykonawcy i przeglądarce chmurowej, bez korzystania z laptopa. Testowano skompilowane pliki `dist`, nie tylko serwer deweloperski.

| Kontrola | Wynik |
| --- | --- |
| `npm run build`, przed i po | PASS; 53 strony + 382 widoki udostępniania |
| Wszystkie `scripts/check-*.mjs` | PASS; 48 istniejących + 1 nowa kontrola przypisań zdjęć |
| `git diff --check` | PASS |
| Desktop 1280 px | Mapa, profil i zdjęcia w jednym dialogu; brak poziomego przepełnienia |
| Szerokości 390 i 320 px | Dialog, Alpy, Maroko; brak poziomego przepełnienia dokumentu i dialogu |
| Klawiatura | Escape, powrót fokusu, Tab/Shift+Tab w obie strony, strzałki mapy, Home, suwak profilu, strzałki zdjęć i wybór grupy |
| Zachowanie stanu | Ustawienie mapy, odległość profilu i dzień pozostają po otwarciu/zamknięciu |
| Baranie Rogi–Lodowy | Dzień 1: 6 zdjęć; dzień 2: 2 zdjęcia; przełączenie dni w dialogu i po wyjściu |
| Atlas | Nowy dialog uruchamia się z wybranej trasy; istniejące fotografie nadal obecne |
| Alpy / PR184 | Brak `.cz-route-photos` pod profilami etapów; istniejące grupy zdjęć pozostają bez zmian |
| Linki i historia | Wybór etapu, poprzedni/następny, zachowany link do mapy pięciu szczytów; Wstecz/Dalej przywracają hashe Alp |
| Konsola aplikacji | Brak zaobserwowanych błędów i ostrzeżeń po uruchomieniu podglądu QA |

Pełna lista kontroli: [check-results.json](qa/route-viewer/check-results.json). Dane pomiaru: [performance.json](qa/route-viewer/performance.json).

Nowa kontrola weryfikuje wszystkie 42 istniejące trasy, pochodzenie materiałów z istniejących katalogów, brak powtórzeń w grupach, kompletność ujednoliconych grup Alp, podział dni Baranich Rogów i przypadek braku materiałów.

## Zrzuty i porównanie zachowania

| Widok | Przed | Po |
| --- | --- | --- |
| Alpy, Dufourspitze, 390 px | [Brak stałego wyboru etapu przy treści](qa/route-viewer/before-alps-390.jpg) | [Bieżący etap i przejście do sąsiednich](qa/route-viewer/after-alps-390.jpg) |
| Maroko, 390 px | [Widok początkowy pomiaru](qa/route-viewer/before-morocco-390.jpg) | [Nawigacja przy Saharze](qa/route-viewer/after-morocco-390.jpg) |
| Maroko, 320 px | — | [Bieżący etap, wybór i mapa](qa/route-viewer/after-morocco-320.jpg) |
| Trasa, desktop 1280 px | Osobne istniejące elementy strony; tylko mapa miała tryb powiększony | [Mapa, profil i zdjęcia razem](qa/route-viewer/viewer-desktop-1280.jpg) |
| Trasa, 320 px | — | [Mapa i profil](qa/route-viewer/viewer-320-map.jpg), [zdjęcia po przewinięciu](qa/route-viewer/viewer-320-photos.jpg) |

Zrzuty Maroka przedstawiają różne pozycje przewinięcia, więc nie są wizualnym pomiarem szybkości. Kontrolowany był rozmiar iframe i początkowa pozycja przy pomiarze obrazów; cache nie był wyczyszczony ani kontrolowany. Wynik 11 → 3 to obserwacja liczby ukończonych obrazów, nie niezależny benchmark transferu lub czasu.

## Ograniczenia i decyzje

- Rozmiary 390/320 px sprawdzono w iframe Chromium. Nie jest to pełna emulacja urządzenia, DPR lub dotyku; nie sprawdzono fizycznego telefonu, Safari/iOS, Firefoksa ani gestu pinch.
- Brak pomiaru Lighthouse, LCP, kontrolowanego zimnego cache i dławienia sieci/CPU. Nie deklarujemy procentowego przyspieszenia.
- Tryb pełnoekranowy wypełnia obszar strony natywnym `dialog`, nie włącza systemowego Fullscreen API. W telefonie elementy są ułożone pionowo w jednym widoku, z zawsze dostępnym zamknięciem.
- Dufourspitze ma istniejącą trasę trzydniową bez podziału GPX na dni. Wybór grupy zdjęć nie filtruje śladu i nie sugeruje geolokalizacji fotografii.
- Pozostałe trasy używają istniejącego przypisania do wyprawy; materiały są opisane jako powiązane z wyprawą. Brak zdjęć ma osobny komunikat.
- Podgląd HTTP w chmurze wymagał tymczasowego shim `crypto.randomUUID`; produkcja używa HTTPS. Shim, adres podglądu, konfiguracja QA i iframe nie wchodzą do PR. Wczesny błąd HTTP przed dodaniem shim oraz logi rozszerzenia przeglądarki nie są zaliczone do błędów aplikacji po konfiguracji QA.
- Zwykły workflow repozytorium może utworzyć preview Vercel po wysłaniu gałęzi. Nie zmieniono konfiguracji wdrożeń ani ochrony dostępu; `main` i produkcja nie są celem publikacji.

## Pliki do późniejszego połączenia z pracą z laptopa

Zmodyfikowane istniejące pliki — główne miejsca możliwych konfliktów:

- `src/components/TripRouteView.jsx` — osadzenie pełnoekranowego widoku, wysokość SVG profilu i zwijane informacje.
- `src/components/AlpsStory.jsx` — nawigacja mobilna i dostępność celu hasha.
- `src/components/MoroccoStory.jsx` — nawigacja mobilna, cel hasha i lazy loading zdjęć rozdziałów.

Nowe pliki aplikacji i kontroli:

- `src/components/RoutePresentation.jsx`
- `src/components/RouteViewerPhotos.jsx`
- `src/components/StoryStageNav.jsx`
- `src/data/routePhotoGroups.js`
- `src/routePresentation.css`
- `src/storyStageNav.css`
- `scripts/check-route-viewer-photos.mjs`

Dokumentacja i dowody:

- `docs/ROUTE_VIEWER_MOBILE_REVIEW.md`
- `docs/qa/route-viewer/check-results.json`
- `docs/qa/route-viewer/performance.json`
- `docs/qa/route-viewer/before-alps-390.jpg`
- `docs/qa/route-viewer/after-alps-390.jpg`
- `docs/qa/route-viewer/before-morocco-390.jpg`
- `docs/qa/route-viewer/after-morocco-390.jpg`
- `docs/qa/route-viewer/after-morocco-320.jpg`
- `docs/qa/route-viewer/viewer-desktop-1280.jpg`
- `docs/qa/route-viewer/viewer-320-map.jpg`
- `docs/qa/route-viewer/viewer-320-photos.jpg`

Nie zmieniono `PhotoViewer`, `PhotoGrid`, mechanizmów Zapisanych, porównywania, miniaturek, paska wyboru ani backupu. Integracja z nieopublikowaną wersją z laptopa nie była możliwa do przetestowania i nie była odtwarzana. Dokument i obrazy są wyłącznie materiałem do przeglądu gałęzi.
