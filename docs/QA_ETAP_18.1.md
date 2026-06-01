# ETAP 18.1 — Tatry atlas background coordinate-safe plan

## Zakres Wersji 1

ETAP 18.1 przygotowuje wyłącznie bezpieczny kontrakt projekcji pod przyszłą wymianę atlasowego tła Tatr. Nie podmienia assetu tła, nie zmienia renderowania mapy, nie zmienia CSS warstwy wizualnej i nie przesuwa ręcznie markerów.

## Zakres geograficzny

Poziom Tatr korzysta z jednego jawnego zakresu geograficznego (`tatryBounds`):

| Oś | Minimum | Maksimum |
| --- | ---: | ---: |
| szerokość geograficzna (`lat`) | 49.12 | 49.29 |
| długość geograficzna (`lng`) | 19.76 | 20.28 |

Markery pozostają wyliczane z `lat` / `lng`: najpierw są normalizowane do wartości procentowych w ramach `tatryBounds`, a następnie przechodzą przez istniejący atlasowy układ stylizowany i istniejące kosmetyczne korekty UI. ETAP 18.1 nie dodaje ręcznych pozycji markerów ani nie zmienia danych szczytów.

## Konfiguracja projekcji

Konfiguracja znajduje się w `src/data/atlasGeo.js` jako `tatryProjectionConfig`. Obejmuje:

- bounds mapy,
- nazwę wspólnej przestrzeni współrzędnych (`tatry-scene-normalized-percent`),
- tryb projekcji (`normalized-bounds-then-stylized-ridge-layout`),
- referencyjne wymiary aktualnego assetu tła: `3208 × 2000 px`,
- proporcję referencyjnego tła: `1.604:1` (`401:250`),
- istniejące parametry atlasowego układu stylizowanego.

## Aktualny sposób renderowania tła

Wersja 1 celowo pozostawia aktualne renderowanie bez zmian. Obecne tło jest wyświetlane jako warstwa dekoracyjna, z istniejącymi insetami oraz responsywnym kadrowaniem CSS. Markery nie są pozycjonowane względem pikseli obrazu: ich pozycje wynikają z projekcji współrzędnych do procentowej przestrzeni sceny Tatr.

## Wymagania dla przyszłego tła

Nowe tło reliefowe Tatr może być obrazem rastrowym albo SVG, ale przed wdrożeniem musi:

1. przedstawiać obszar odpowiadający `tatryBounds`;
2. bazować na proporcji referencyjnej `3208 × 2000 px` (`401:250`, czyli `1.604:1`) albo równoważnym `viewBox` SVG;
3. odwzorowywać istniejący atlasowy `stylizedLayout`, a nie wyłącznie surową prostokątną projekcję GIS;
4. zostać zweryfikowane razem z decyzją o docelowym skalowaniu i kadrowaniu warstwy tła;
5. nie wymagać ręcznych przesunięć pojedynczych markerów.

Surowy relief w zwykłej projekcji geograficznej nie jest bezpośrednim zamiennikiem aktualnego assetu: zakres geograficzny pozostaje źródłem pozycji markerów, ale końcowy widok atlasowy zachowuje stylizację grani. Podmiana assetu i ewentualna zmiana CSS skalowania należą do osobnego etapu wizualnego.

## Punkty kontrolne QA dla przyszłej podmiany tła

Po wejściu `Europa → Tatry` należy zweryfikować co najmniej markery:

- Łomnica,
- Gerlach,
- Rysy,
- Kościelec.

Kontrola przyszłej podmiany tła powinna objąć desktop, mobile oraz brak poziomego scrolla.
