# Wyprawy — osobne podstrony

Etap zastępuje trzy zapowiedzi w sekcji „Wyprawy” na homepage działającymi wejściami do gotowych materiałów. Pełna lista pod adresem `/wyprawy` obejmuje Alpy 2026, Liptowskie Mury 2026, Kończystą 2026 i Szwajcarię 2025, w tej kolejności.

Każda wyprawa ma osobny adres `/wyprawy/<slug>`, duże zdjęcie, krótki opis, termin i region, pełną listę filmów, podgląd zdjęć, wejście do galerii i istniejącego atlasu. Galerie mają odnośnik „O wyprawie”. Nawigacja między wyprawami jest stała. Zwiastun Alp pozostaje oznaczony jako zwiastun.

`src/data/expeditionPages.js` zawiera jedynie informacje redakcyjne i powiązania. Listy zdjęć oraz filmów pochodzą z tego samego katalogu co galerie. Nie powielono eksportów ani danych filmowych. Nie dodano bibliotek i nie zmieniono map.

## Potwierdzone informacje

- Alpy: sierpień 2026; sprawdzono EXIF wszystkich 48 wybranych zdjęć. Wykonano je między 18 a 28 sierpnia. Podstrona podaje miesiąc, bez sugerowania pełnych dat początku i końca wyprawy.
- Kończysta: 8 lutego 2026, potwierdzone w 24 wybranych zdjęciach. Zimowy charakter potwierdza też zweryfikowany film.
- Liptowskie Mury: 6 czerwca 2026, potwierdzone w 21 wybranych zdjęciach. Nazwy Liptowskich Murów i Walentkowej Grani pochodzą z tytułu filmu właściciela.
- Szwajcaria: 2025, zgodnie z zaakceptowaną galerią i rokiem wskazanym przez właściciela. Nie podano niepotwierdzonych dat całej podróży.

Źródła filmów zapisano w `GALLERY_INTEGRATION.md`. Nie dodano opisów osobistych przeżyć, parametrów tras, trudności ani wysokości na podstawie przypuszczeń. Maroko i kadry DJI pozostają odłożone.

## Zgodność adresów

`/wyprawy/switzerland-trip` otwiera nową Szwajcarię 2025 i wskazuje jej kanoniczny adres. Pozostałe istniejące wcześniej podstrony wypraw zachowują dotychczasową obsługę. Nieznany adres pokazuje komunikat, powrót do listy oraz `noindex`. Vercel obsługuje zarówno `/wyprawy`, jak i `/wyprawy/:slug`.

Nowa sekcja na homepage zawiera trzy wyprawy. Nadal są tam również dokładnie trzy wybrane filmy, trzy kierunki i trzy okładki galerii. Pozostałe sekcje i istniejące dane filmów na homepage nie były częścią tego etapu.

## Weryfikacja — 4 października 2026

- `npm run build` — poprawna kompilacja; pozostaje znane ostrzeżenie o dużym, osobno ładowanym pakiecie atlasu.
- Kontrola eksportów galerii: 129 zdjęć, 258 plików, bez EXIF/GPS; mapy, współrzędne i zależności bez zmian.
- Lista oraz wszystkie cztery podstrony zostały otwarte w przeglądarce; sprawdzono zdjęcia, liczbę filmów, odnośniki, daty i brak przewijania poziomego.
- Sprawdzono komputer, tablet 768 px i telefon 390 px, w tym menu mobilne i wejście z homepage.
- Sprawdzono przejście wyprawa → galeria → wyprawa, kolejną wyprawę, stary adres Szwajcarii, odświeżenie z `#filmy`, nieznany adres oraz historię wstecz/dalej.
- Brak błędów w konsoli przeglądarki.

Gotowy etap jest dostępny w lokalnym podglądzie. Domena publiczna nie została zmieniona.
