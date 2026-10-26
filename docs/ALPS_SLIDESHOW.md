# Pokaz fotografii Across the Alps

Lokalny prototyp w galerii `/galerie/alpy-2026`. Przycisk „Pokaz fotografii” nad siatką otwiera osobny dialog na czarnym tle. Wszystkie 48 zatwierdzonych fotografii lub bieżący etap, bez nowych materiałów i bez zmiany istniejącego powiększenia zdjęć.

Pełne zdjęcia z `object-fit: contain`, bez kadrowania, animacji i efektów. Ręczna nawigacja przyciskami, strzałkami i przesunięciem; automat uruchamiany świadomie, tempo 5/8/12 sekund. Odliczanie rozpoczyna się po załadowaniu zdjęcia. Automat zatrzymuje się po ostatnim zdjęciu, po ręcznej nawigacji, po ukryciu karty i po błędzie obrazu. Przy ostatnim zdjęciu „Od początku” uruchamia pokaz ponownie. Wstępnie ładowane jest tylko następne zdjęcie.

Natywny dialog izoluje fokus, Escape zamyka pokaz, a fokus i możliwość przewijania wracają do galerii. Link prowadzi do istniejącej wyprawy. Opcjonalne Fullscreen API; jeśli przeglądarka je blokuje, pozostaje pełny widok wewnątrz okna i komunikat. Bez kont, nowych zależności i publikacji. Lokalne zestawy w Zapisanych zachowane.


## Photograph comparison and thumbnail navigation — local, 22 October 2026

Full photograph galleries and the photography portfolio offer a separate two-photo selection mode. The first selected image is A, the second B; a third is disabled until one is deselected. Comparison does not change bookmarks or sets. Opening loads the two full photographs, uncropped, side by side above 700px; narrower screens display one with A/B buttons and left/right keyboard shortcuts. Native dialog contains focus, Escape closes it and restores the opening control and body scrolling. Failed images have a retry action.

The slideshow has a Miniatury toggle, initially closed. Thumbnails mount only while expanded, use responsive small images and lazy loading, and scroll horizontally. Current image is marked and kept visible. Clicking a thumbnail pauses autoplay and changes the photograph. Alps shows also expose a stage select built from existing metadata; stage matching uses photograph identity in the current show, not global image indices. Filtered single-stage shows and saved-set shows keep their own order without irrelevant chapter choices. No transitions added.

Build and 49 check scripts pass, including chapter coverage for all 48 Alps images and filtered/reordered subsets. UI checked on desktop, 390/320px and 844x390 landscape: selection limits, A/B, keyboard, Escape/focus restoration, initial collapse, chapter jump, autoplay pause, thumbnail jump, filtered six-photo show and no overflow. Local HTTP gallery/portfolio/Saved passed. No observed console errors. Physical phone and native fullscreen not tested in this package. No publication.
