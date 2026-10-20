# Kierunki i powrót do przeglądania — lokalny pakiet

## Kierunki

`/kierunki` łączy sześć miejsc: Tatry, Alpy, Szwajcarię, Maroko, Włochy i Węgry. Tatry i Alpy zachowują dotychczasowe strony. Nowe strony krajów mają adresy `/kierunki/szwajcaria`, `/kierunki/maroko`, `/kierunki/wlochy`, `/kierunki/wegry`. Dostęp przez menu Wyprawy, listę wypraw i wspólne wyszukiwanie.

Materiały pochodzą z istniejących katalogów. Przynależność wypraw wykorzystuje dotychczasowe filtry geograficzne; GPX w stronach krajów wybierane są według kraju samego śladu. Szwajcaria obejmuje siedem tras, w tym Dufourspitze, bez Triglavu, Grossglocknera, Grauspitzu i Zugspitze. Galeria i zwiastun Across the Alps obejmują całą podróż — strona mówi o tym wprost. Liczby materiałów są wyliczane, filmy nie są dublowane.

Maroko ma dwa filmy, Toubkal oraz odnośnik do 40 kadrów DJI przy wyprawie. Okładka jest oznaczona jako kadr z filmu; nie powstaje galeria fotografii. Włochy i Węgry nie pokazują pustych sekcji GPX. Rumunia pozostaje odłożona. Nie dodano nowych zdjęć, filmów, GPX ani wypraw.

Nowe strony mają statyczny HTML, metadane, podglądy wykorzystujące istniejące obrazy oraz wpisy sitemap. Łącznie 53 strony kanoniczne i jedna prywatna strona Zapisane; liczba 382 wariantów udostępniania bez zmian.

## Powrót

`browseMemory.js` zachowuje pozycję, pełny lokalny adres (filtry, widok i fragment) oraz odnośnik do wybranej karty. Historia ma oddzielne identyfikatory wpisów; istniejące pola history.state pozostają zachowane. Wstecz i odświeżenie przywracają miejsce po uruchomieniu filtrów; link „Wróć do…” odtwarza także kontekst wcześniejszego powrotu, np. oś → wyprawa → galeria → wyprawa → oś.

Przy zmianie szerokości pozycja odtwarzana jest względem wybranej karty. Przywracanie czeka do dwóch sekund na układ i ładowane sekcje, bez płynnej animacji; ruch użytkownika przerywa je natychmiast. Nowe wejście w adres z fragmentem zachowuje zwykłe przejście do sekcji. Linki zewnętrzne, pobrania i otwieranie w nowej karcie nie przekazują kontekstu.

Dane są wyłącznie w sessionStorage karty, do 50 pozycji, z sześciogodzinnym terminem ważności. Nie są wysyłane ani dodawane do publicznych URL lub HTML. Przy zablokowanym magazynie pozostaje natywna historia przeglądarki. Powrót nie odtwarza nieadresowanych stanów, np. zoomu zdjęcia, otwartego odtwarzacza czy dowolnych rozwiniętych sekcji.

## Kontrole

Build i istniejące kontrole; `check-directions-browse.mjs` sprawdza powiązania, rozdzielenie mediów i bezpieczne adresy. `check-browse-memory.mjs` sprawdza osobne wpisy historii, zachowanie stanu, łańcuch powrotów, modyfikatory, zewnętrzne linki oraz brak sessionStorage. Przeglądarka: oś z rokiem/miejscem, zwykłe Wstecz, galerie z filtrami, szczyt → trasa, kierunek → GPX; komputer oraz emulacja 390/320 px. Telefon fizyczny nie był dostępny.

To pakiet lokalny do oceny. Produkcja PR182 pozostaje bez zmian.
