# Maroko — opowieść z podróży

Lokalny prototyp z 11 października 2026, po akceptacji propozycji użytkownika. Podgląd: `/wyprawy/maroko-2025`. Bez publikacji.

## Zawartość

Duży istniejący kadr z Sahary, dziesięć rozdziałów, czternaście istniejących kadrów DJI. Pełny zestaw 40 kadrów i oba filmy pozostają pod opowieścią. Nie ma nowych wypraw, eksportów ani osobnych stron filmów. Pozostałe wyprawy zachowują dotychczasowy układ.

Miejsca, współrzędne i rozdziały pochodzą z `moroccoPlaces.js`; dowody i oryginalne odnośniki opisuje `MOROCCO_ATLAS.md`. Rabat/Fez oraz Warzazat/Ajt Bin Haddu mają wspólne rozdziały, tak jak opis pierwszego filmu. Atlas Wysoki obejmuje Imlil, schronisko i Toubkal. Krótkie opisy nie dodają osobistych przeżyć ani niepotwierdzonej trasy.

Przypisanie kadrów opiera się na obejrzanych wcześniej selekcjach, charakterystycznych widokach i chronologii oryginalnych klipów. Numery istniejących zasobów: miasta 19/04, Azrou 22, Sahara 07/24, Todra 25, Warzazat/Ajt Bin Haddu 11/12, Marrakesz 31, Ouzoud 13, podejście z Imlil 37, schronisko 38, Toubkal 40/16. Kadry z podejścia i okolic miejsc nie oznaczają dokładnego położenia aparatu. Szczegółowe rejestry źródeł pozostają poza repozytorium. Nie czytano nowych folderów źródłowych.

## Zachowanie

- Na komputerze wspólna mapa terenu jest przyklejona obok rozdziałów. Przewijanie wybiera bieżące miejsce, kliknięcie punktu prowadzi do rozdziału. Wszystkie 12 punktów zachowuje istniejące identyfikatory i współrzędne.
- Na małym ekranie mapa jest domyślnie zwinięta i otwiera się nad treścią. Punkty prowadzą do rozdziałów; przy wyborze mapa się zwija. Kafelki są pobierane dopiero po otwarciu mapy.
- Nawigacja rozdziałów używa zwykłych kotwic `#opowiesc-*`. Przewijanie nie dopisuje wpisów historii. `#filmy`, `#kadry` i stare przekierowania pozostają dostępne.
- `TatryTerrainMap` ma opcjonalny tryb `embedded`: nie czyta ani nie zapisuje parametrów atlasu w adresie wyprawy, nie pokazuje kopiowania adresu atlasu; przy zmianie rozdziału ustawia skalę dla kraju/gór. Domyślne zachowanie atlasu pozostaje takie jak wcześniej.
- Mapa wykorzystuje dotychczasowy podkład Top-O-Map / OpenTopoMap, dane OSM/SRTM i obrys Natural Earth z zachowaniem atrybucji. Pokazuje punkty, bez domniemanego śladu GPS. Pozostaje dotychczasowa obsługa błędów kafelków.
- Odtwarzacz otrzymuje istniejące identyfikatory filmu i czas rozdziału. Znane ograniczenie osadzania pierwszego filmu nadal ma przejście do YouTube.

## Weryfikacja

Build, `check-morocco-story`, `check-atlas`, `check-unified-atlas`, `check-photo-film-separation`, `check-related-expeditions`, `check-site-tools`, `check-release` oraz `git diff --check`. Sprawdzenie przeglądarką na komputerze i w emulowanych 390/320 px: rozdziały, mapa przy przewijaniu, punkty, rozwijanie/zwijanie mapy bez przesuwania czytanego rozdziału, powiększenie kadru, przekazanie czasu do odtwarzacza, istniejące odnośniki do materiałów i brak poziomego przepełnienia. Brak testu na fizycznym telefonie. Produkcja pozostaje na PR154.
