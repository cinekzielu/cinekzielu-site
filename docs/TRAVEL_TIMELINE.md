# Oś podróży — podgląd lokalny

Adres: `/wyprawy?widok=os`. Dotychczasowa lista pozostaje domyślna; przełącznik pozwala porównać oba widoki. Oś korzysta z tego samego katalogu 17 wypraw i sortowania od najnowszych, grupując 9 wypraw w 2026 i 8 w 2025. Kolejne wpisy automatycznie trafiają do właściwego roku.

Daty prezentacji zachowują dotychczasową precyzję: rok, miesiąc lub zakres dni. Nie dodano nowych dat ani treści. Fotografie prowadzą do wypraw, skróty do galerii lub kadrów oraz do filmów. Fotografie i kadry pozostają oddzielone.

Filtry miejsca i roku zachowują `widok=os`; przełącznik zachowuje filtry. Wstecz synchronizuje oba stany. Skróty lat są zwykłymi kotwicami. Mały ekran ma jedną kolumnę, klawiatura widoczny fokus; ograniczenie animacji jest respektowane.

Sprawdzenia: build, check-photo-film-separation, check-site-tools, check-release (37 stron HTTP), git diff --check. Przeglądarka: oba lata i wszystkie 17 pozycji, filtr Węgry, pusty wynik 2025, reset filtrów, Lista/Oś, Wstecz; desktop, emulowane 390 i 320 px bez poziomego przepełnienia; brak błędów/ostrzeżeń konsoli. Nie testowano fizycznego telefonu.

Etap lokalny do oceny. Bez publikacji.
