# Zestawy w Zapisanych

Lokalny pakiet: `/zapisane?widok=zestawy`. Własne listy do 40 materiałów, do 20 zestawów na przeglądarkę. Nazwy do 64 znaków. Tworzenie, zmiana nazwy, dodawanie z zakładek lub wyszukiwanie w całym katalogu, usuwanie materiałów z cofnięciem i potwierdzane usunięcie zestawu. Zakładki są niezależne; usunięcie zestawu ich nie usuwa. Katalog zakładek rozszerzono o istniejące filmy, z przyciskiem w bibliotece i działającym odtwarzaczem w Zapisanych.

Zestawy są w oddzielnym localStorage `cz.saved.sets.v1`; dawny `cz.saved.v1` jest zachowany. Zmiany czytają najnowszą listę przed zapisem, a inne karty otrzymują zdarzenia storage. Brak pamięci pozostawia działanie w bieżącym dokumencie z widocznym komunikatem. Ustawienia kont, serwera ani analityki nie są dodawane.

Udostępnienie tworzy wersjonowany snapshot nazwy i identyfikatorów materiałów w fragmencie `#zestaw=...`. Nie zawiera identyfikatora lokalnej listy, historii, własnych adresów, GPX ani metadanych źródłowych. Fragment nie jest przesyłany w żądaniu HTTP. Link jest jawny dla każdego, kto go otrzyma; nie jest zaszyfrowany ani odwoływalny. Edycja listy nie zmienia wcześniejszych linków. Odbiorca przegląda kopię, porównuje wybrane dwie trasy i może zapisać niezależną kopię u siebie. Nieznane identyfikatory są pomijane z komunikatem, uszkodzony link pokazuje błąd. Wszystkie odnośniki i treści poza nazwą pochodzą z katalogu witryny.

Link korzysta z aktualnego hosta. Podgląd localhost jasno wskazuje, że działa na tym komputerze; nie generuje przedwcześnie niedziałającego linku produkcyjnego. Pole ręcznego kopiowania pozostaje dostępne niezależnie od schowka. Zapisane pozostają noindex i poza sitemap; nie powstaje osobny publiczny podgląd społecznościowy dla prywatnej nazwy zestawu. Do odczytania udostępnienia potrzebny jest JavaScript.

Kontrole: `check-saved-sets.mjs`, dotychczasowe `check-saved-items.mjs`, build i kontrole repozytorium. Bez nowych materiałów, wypraw, zależności i publikacji.
## Własny pokaz i kolejność

Zestaw zawierający fotografie ma przycisk pokazu. Odtwarzane są wyłącznie wpisy typu `photo`, w kolejności listy; obraz okładkowy wyprawy ani kadry wideo nie trafiają do pokazu. W edytorze „Zmień kolejność” odkrywa strzałki przesuwające materiał o jedno miejsce. Granice są zablokowane, komunikat ogłasza pozycję, fokus pozostaje przy przestawianym elemencie. Kolejność przechodzi do localStorage oraz snapshotu linku. Odbiorca ma pokaz bez możliwości zmieniania listy nadawcy.

Pokaz zatrzaskuje listę i nazwę z chwili otwarcia, więc edycja w drugiej karcie nie zmienia obrazu w trakcie odtwarzania. Link „Otwórz zdjęcie” prowadzi do konkretnej fotografii w oryginalnej galerii. Jeden obraz można oglądać, a niepotrzebne przyciski odtwarzania są wyłączone. Dotychczasowy pokaz Across the Alps zachowuje tytuł, etapy i odnośnik do wyprawy.


## Gallery selection and photographic set view — 22 October 2026 (local)

Full photograph galleries (including Alps stage views) and the photography portfolio offer an explicit selection mode. Clicking images selects them instead of opening the viewer; leaving this mode restores normal viewing and individual bookmark controls. Selection does not modify individual bookmarks. Changing a gallery or stage resets unsaved selection, stated in the panel.

Choose up to 40 photographs and create a named set or append to an existing one. Gallery order is used. Existing items are skipped; bulk additions exceeding the set capacity are rejected atomically, including when another tab has modified the set. Storage failures are reported and the in-memory result can be opened as a shared snapshot. No backend or account.

Photo-only sets default to a two-column large-image grid (one column at <=600px), with uncropped photographs and an optional list view. Mixed sets retain the list. Editing, ordering, slideshow and immutable share snapshots remain available. Shared photo-only sets use the same grid.

Verified: build; 48 check scripts; focused local HTTP for gallery, portfolio and Saved; browser creation, append, duplicate handling, persistence, list/grid switching, selection limit and cancellation; desktop and 390/320px responsive layout. Five prior bookmarks and two prior sets preserved. Physical phone not tested. No deployment.

## Selection dock and backup — 22 October 2026 (local)

Photo selection and comparison have a floating action bar while their explicit mode is active. It shows the count, opens a native set picker or comparison, and ends selection. The picker preserves the current scroll and selection; Escape restores trigger focus. Normal gallery browsing is unchanged.

Saved lists and sets have a collapsible backup section. A versioned JSON file stores bookmark IDs and named ordered sets, not media or original metadata. Files are read locally with a 1 MB limit. Preview precedes import; existing names and order are retained, new items appended, duplicate IDs and identical copied sets skipped. Unknown catalog items are counted and omitted. More than 20 sets or 40 items in a merged set rejects the whole import without truncation.

The importer rereads storage immediately before writing and refreshes a stale preview. On a failed write it attempts to restore completed writes and reports any rollback failure explicitly. Import dispatches a shared change event to refresh the header, bookmarks and set editor in the same page. No upload, account or automatic cross-device sync.

Validation: build (53 pages + 382 share views), all 50 check scripts, diff check; actual file download and import on a separate localhost storage origin, immediate UI update and persistence after reload; floating set picker and comparison, Escape focus and selection exit; desktop and emulated 390/320 px. No observed console errors or horizontal overflow. Repeated-import deduplication, malformed files and storage failures covered by data tests. Physical phone not tested. Existing user data on 127.0.0.1 preserved. No publication.
