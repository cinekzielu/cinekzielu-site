# Widok mapy w adresie

Lokalny etap z 6 października 2026. Wspólny komponent mapy terenu zapisuje środek, powiększenie i kolor podkładu w bieżącym adresie. Po powrocie z galerii przyciskiem Wstecz, przeładowaniu strony i przejściu między wpisami historii mapa odtwarza ten widok. Zmiana kraju usuwa poprzedni kadr, a zmiana samego roku go zachowuje.

Przycisk **Kopiuj widok** tworzy adres pełnego atlasu na bieżącej domenie. Link obejmuje kraj/region, wybrane miejsce, kontekst obszaru, rok, filtr „Z materiałami”, środek mapy, zoom i kolor. Na stronie głównej również „Otwórz mapę” zachowuje kadr. Po próbie kopiowania zawsze pojawia się zaznaczone pole z adresem do ręcznego skopiowania, także gdy API schowka zgłosi powodzenie. Pole pozostaje dostępne do zamknięcia.

Parametry:

- `kadr=latitude,longitude,zoom`: szerokość do ±85.0511°, długość do ±180°, zoom 2–16; sześć miejsc po przecinku dla współrzędnych i trzy dla zoomu.
- `podklad=dark|natural`.
- `miejsca=wszystkie`: wyłączony filtr „Z materiałami”; bez parametru filtr jest włączony.
- Dotychczasowe `atlas`, `obszar` i `rok` pozostają zgodne ze starszymi linkami.

Nieprawidłowy kadr jest pomijany. Zapis przez `replaceState` nie dodaje wpisu historii dla każdego przesunięcia; wybór miejsca nadal dodaje wpis. Kadr jest zapisywany po gestach, wyborze miejsca, przed przejściem do linku i z krótkim opóźnieniem podczas ciągłych zmian. Nie ma cookies ani dodatkowego magazynu pozycji użytkownika. Współrzędne opisują oglądany fragment mapy, bez pobierania geolokalizacji urządzenia. Wyszukiwane frazy oraz kadry autorskich map świata i kontynentów nie należą do tego etapu.

## Sprawdzenie

Build, `check-atlas-view-state.mjs`, `check-unified-atlas.mjs`, `check-country-outlines.mjs`, `check-atlas.mjs`, `check-tatry.mjs`, `check-release.mjs` oraz `git diff --check` przechodzą. Sprawdzono 29 stron przez HTTP na lokalnym podglądzie.

W przeglądarce: Szwajcaria z rokiem 2025, wyłączonym filtrem materiałów i naturalnym podkładem; przeładowanie; galeria i powrót Wstecz; Szwajcaria → Maroko → Wstecz → Dalej; Kościelec w Tatrach z przesuniętym kadrem; mapa na stronie głównej → pełny atlas; wybór znacznika i natychmiastowe przeładowanie. Porównanie widoku SVG potwierdziło odtworzenie środka i skali z dokładnością wynikającą z zaokrągleń adresu. Brak zaobserwowanych błędów aplikacji. Widok komputerowy sprawdzony przy 1280 px.

Ograniczenia kontroli: polecenie emulacji 390 px w dostępnej przeglądarce pozostawiło rzeczywistą szerokość 1280 px, również po przeładowaniu. Nowego etapu nie uznaje się za sprawdzony wizualnie na telefonie. API schowka aplikacji zwróciło powodzenie i interfejs pokazał potwierdzenie, ale narzędzie odczytu schowka przeglądarki zwróciło pusty tekst; nie potwierdzono wklejenia ani ręcznego wariantu po odmowie uprawnienia. Budowanie adresu jest objęte testem, a jego odtwarzanie sprawdzono przez rzeczywiste przeładowania i nawigację.

### Kontrola przed zatwierdzoną publikacją, 7 października 2026

Użytkownik zatwierdził publikację obecnego pakietu. Powtórny build oraz wszystkie 12 skryptów `check-*.mjs` przechodzą dla 33 stron. Rzeczywista emulowana szerokość 390 px została potwierdzona odczytem DOM; mapa i pole linku mieszczą się bez poziomego przewijania. Sprawdzono również wygląd przy 320 px. Gotowy adres z pola otwarto w nowej karcie: odtwarza Szwajcarię, rok 2025, ciemny podkład i zapisany kadr. Pole jest tylko do odczytu, zaznaczone w całości i dostępne także po potwierdzeniu automatycznego kopiowania.

Ograniczenia: brak testu na fizycznym telefonie. Odczyt systemowego schowka i wklejenie po automatycznym kopiowaniu nadal nie zostały potwierdzone przez narzędzie; ręczny adres pozostaje dostępnym obejściem. Nie wymuszano odmowy uprawnienia schowka. Powyższa kontrola zastępuje wcześniejszą niedokończoną kontrolę szerokości telefonu.
