# Podobne przejścia i GPS przy szczytach

Lokalny pakiet do oceny, 18 października 2026. Bez nowych materiałów i zmian danych źródłowych.

## Podobne przejścia

Po wybraniu trasy w atlasie, przed profilem, pojawiają się trzy propozycje i linki do porównania. Skrót pod mapą prowadzi do sekcji `#podobne`. Działa też w widoku listy. Odnośniki do szczytów otwierają odpowiednie wyniki na `/szczyty`.

Ranking: 3 punkty za to samo pasmo, do 2 za względną bliskość dystansu, do 2 za względną bliskość sumy podejść, 1 za wspólny potwierdzony sezon. Różnica względna to `abs(a-b)/max(a,b,1)`. Etykiety zbliżonych parametrów wymagają różnicy najwyżej 25%. Remisy rozstrzyga data, następnie identyfikator. Brak własnej trasy i duplikatów; aliasy prowadzą do połączonych zapisów. Ranking dotyczy geografii i liczb, nie trudności technicznej ani warunków. Nie zmienia filtrów w poprzednim widoku; odnośniki otwierają świeże porównanie całych zapisów.

## Przejścia z GPS

Wiersze szczytów mają rozwijany panel z powiązanymi zapisami, datą GPX, dystansem, sumą podejść, opisanym sezonem oraz linkami do atlasu i wyprawy. Zdjęcia i filmy pozostają przy odpowiednich opisanych wejściach powyżej. Panel jest od razu otwarty dla maksymalnie trzech wyników wyszukiwania. Filtry roku i sezonu obejmują także te zapisy.

Powiązanie wymaga jawnego identyfikatora szczytu w istniejącym `tripRoutes.peaks`; jedyny dodatkowy wpis to Turbacz 2026, potwierdzony istniejącą wyprawą i rejestrem wejść (bez dodawania punktu GPS). Łącznie 30 z 31 szczytów i 37 relacji. Walentkowy Wierch nie dostaje trasy wyłącznie na podstawie wspólnej wyprawy. Matterhorn pozostaje planem.

Sezon pochodzi wyłącznie z istniejącego wejścia na dany szczyt i powiązanej wyprawy. Brak sezonu pozostaje opisany jako nieznany. Daty zapisów nie uzupełniają lat nieustalonych wejść Szatana/Wysokiej. Sam miesiąc nie dowodzi charakteru letniego lub zimowego.

Przy dwóch zapisach dostępny jest przycisk porównania. Dla tras wielodniowych wybiera istniejący dzień danego szczytu: Baranie 1, Lodowa Kopa/Lodowy 2, Świnica 2, Toubkal 2. Jawne mapowanie jest kontrolowane względem `track.days.peakIds`. Nie tworzy nowych odcinków.

## Kontrole

Build i 37 skryptów kontrolnych przeszły. Nowy `check-related-routes.mjs` sprawdza ranking, brak duplikatów, aliasy, linki porównań, sezony, filtrowanie, brak domyślania relacji i prawidłowy wybór dnia. Źródłowe katalogi, rejestr wejść i ślady pozostają niezmienione.

Przeglądarka: 1280, 390 i 320 px; Baranie lato/zima i dzień 1 w porównaniu, filtr zimowy, podobne trasy, porównanie z karty, Wstecz, odnośniki do szczytów. Brak zaobserwowanych błędów konsoli i poziomego przepełnienia. Telefon emulowany, nie fizyczny.
