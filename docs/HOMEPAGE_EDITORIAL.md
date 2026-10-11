# Homepage: contained Alps feature

The earlier broad homepage redesign was rejected by the user and replaced.

The original homepage from production HEAD is restored: author portrait hero, map, selected films, directions, newest trips, photography collections and footer. A single compact Across the Alps card sits between map and films, with an existing photograph, expedition link and trailer link. No new materials or dependencies.

Implementation: src/components/AlpsHomeFeature.jsx and src/alpsHomeFeature.css; src/main.jsx adds only an import and one component call. Earlier local Alps atlas changes are preserved. The rejected optional homepage trip limit was removed.

Validation: build, 37 HTTP page checks, desktop 1280px and emulated 390/320px without overflow; expedition CTA and trailer dialog. YouTube refused embedding in local test; existing YouTube fallback works. Physical phone not tested. Local preview only; not published.

User follow-up: the photography heading is now "Wybrane fotografie". The shared atlas trip list shows three entries initially, with expand/collapse and reset on location/year/context change. The Alps feature below the map is accepted. Build and desktop/mobile 390px interaction checks passed; publication not requested.
