# Mapa wypraw — spójny widok miejsc i materiałów

Lokalny etap z 4 października 2026. Podgląd: `/mapa`. Ten sam atlas działa w sekcji mapy na stronie głównej.

## Korekta po opinii użytkownika — 4 października 2026

Obowiązujący opis Tatr znajduje się w [TATRY_ATLAS.md](TATRY_ATLAS.md). Zastępuje poniższe informacje o 21 punktach, starej projekcji, zoomie Tatr i wybieraniu najbliższej pinezki. Pozostała część dokumentu opisuje poprzedni etap.

Nazwy krajów są mniejsze na komputerze i mają odrębny rozmiar na telefonie. Tatry oraz Alpy mają wspólny boczny panel przy mapie Europy. Stara duża plakietka Tatr została usunięta.

## Działanie

- Stały wybór miejsca po kliknięciu; hover zmienia tylko podświetlenie.
- Szybki wybór Tatr, Szwajcarii, Alp, Maroka i Jury. Kontynenty nadal można otwierać z rysunku świata.
- Wyszukiwarka 54 miejsc, także bez polskich znaków. Lista ma filtr dostępnych materiałów.
- Panel pokazuje rzeczywistą liczbę galerii, filmów i zdjęć. Wyprawa, galeria i film mają osobne, bezpośrednie linki.
- 21 dotychczasowych punktów Tatr zachowuje pozycje. Dodatkowe miejsca, które nie mają sprawdzonych współrzędnych, są dostępne przez wyszukiwanie i listę, bez wymyślonych pinezek.
- Powiększenie 100–250%, przewijanie powiększonej mapy i reset. Wybrany szczyt pozostaje w kadrze podczas przybliżania.
- Większe pola dotykowe. W gęstych grupach kliknięcie wybiera najbliższy punkt, a etykiety nie przesuwają samych znaczników.
- Etykiety układają się według rzeczywistych wymiarów mapy. Na małym ekranie mniej stałych nazw; wybrana nazwa jest zawsze pokazana.
- Przyciski, punkty i kontynenty obsługują klawiaturę; zmiana miejsca jest ogłaszana czytnikowi ekranu. Na telefonie przycisk „Materiały” przewija do panelu i przenosi tam fokus.
- Wybór zapisuje się w `?atlas=…`; odświeżenie i Wstecz przywracają miejsce. Starsze odnośniki `/?atlas=…#map` pozostają obsługiwane.
- Nawigacja podstron zawiera Mapę. Galerie i wyprawy odsyłają do właściwego miejsca; trzy kierunki na stronie głównej prowadzą bezpośrednio do Łomnicy, Tatr i Maroka.

## Źródła i dalsza rozbudowa

`src/data/atlasContent.js` łączy istniejący rejestr filmów oraz galerie z miejscami. Liczby materiałów wynikają z tych danych. Nowy film dodany do istniejącego regionu trafia do jego podsumowania; powiązanie z konkretnym szczytem dopisuje się do `summitFilms`. Nowa galeria korzysta z `atlasNodeIds` lub powiązania filmu z wyprawą. Nowe miejsce wymaga stabilnego ID i rodzica.

Nie zmieniono źródłowych SVG, teł, danych współrzędnych ani projekcji. Nie przeniesiono do interfejsu dawnych technicznych opisów, fikcyjnych zapowiedzi czy określeń typu „premium dark atlas”. Brak materiałów oznacza ich faktyczny brak w obecnej bibliotece.

## Lżejsze ładowanie

Źródłowy plik `world-continent-overlays.svg` miał 3 567 727 bajtów, głównie przez osadzony obraz referencyjny, którego dotychczasowy parser nie wyświetlał. `scripts/prepare_atlas_overlays.py` eksportuje dokładne ciągi ścieżek i viewBox do `worldOverlayPaths.json` (3127 bajtów), pozostawiając oryginał bez zmian. Plik JS mapy zmalał z około 3,63 MB do około 63 kB; zniknęło ostrzeżenie dużego pakietu.

Po ręcznej edycji światowego SVG uruchomić:

```
python scripts/prepare_atlas_overlays.py
node scripts/check-atlas.mjs
npm run build
```

Walidacja sprawdza odcisk SHA-256 oryginalnego SVG, powiązania filmów, 54 miejsca, wyszukiwanie, adresy i oczekiwane liczby materiałów. Nie dodano bibliotek. Reguły Vercel obejmują `/mapa` oraz wcześniej brakującą `/filmy`.

## Sprawdzone

- Produkcyjny build; kontrola danych atlasu; kontrola 258 WebP, metadanych zdjęć i niezmienności źródłowych map/projekcji/zależności.
- Desktop, tablet 768 px i telefon 390 px: brak poziomego przepełnienia.
- Wyszukiwanie Kończystej bez polskich znaków, pusty wynik i wyłączenie filtra dla Gerlacha.
- Kościelec: dwa właściwe filmy; Szwajcaria: 7 filmów i 36 zdjęć; Kończysta: 1 film i 24 zdjęcia; Maroko: dwa filmy bez dopisywania galerii.
- Kliknięcie w gęstej grupie wskazało Lodowy Szczyt; Enter na Durnym otworzył właściwy film w panelu. Klawiaturowy wybór Afryki działa.
- Zoom, reset, utrzymanie wybranego szczytu w widoku, dopasowanie etykiet do małego ekranu.
- Powrót Wstecz, link ze strony głównej do pełnej mapy, przejście do galerii oraz odnośnik galerii z powrotem na mapę.

To mapa poglądowa do przeglądania materiałów, bez wyznaczania tras. Nowy etap jest przygotowany lokalnie do obejrzenia, bez publikacji na domenie.
