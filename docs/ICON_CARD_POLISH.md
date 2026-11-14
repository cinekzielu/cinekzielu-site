# Ikony i karty wypraw / tras

Reviewed package, 14 November 2026. Based on published PR195 (`5991ca17926f34d824e73a02374f0af8617467b8`). The owner approved publication after inspecting the local preview.

## Scope

- A shared set of eight lightweight SVG icons: photographs, films, route distance, summit, ascent, comparison, map and outgoing direction. Square ends and diagonals follow the CZ visual style. Icons are decorative and accompany readable labels or existing accessible button names.
- Expedition cards have a clear region/date line, title, material counts and "Zobacz wyprawę" link. The bookmark stays a separate button. The homepage uses the same cards; timeline and related trips share the material counters.
- Route cards in both map and list views group distance, estimated GPS ascent and official summit height separately. Comparison, bookmark and map/trip actions remain distinct. A route without a summit does not get a summit-height field.
- Responsive layouts preserve long titles and wrap controls on small screens. No page-order changes, animations, new dependencies or material selection.

## Preserved behavior

Trip dates, covers, counts, sort order, route data, official summit heights and links are unchanged. Existing filters, selected routes, comparison URLs, browser history and saved-item handlers remain in place. The route-catalog check now finds its class among multiple article classes, retaining the expected 42-card assertion.

## Validation

- Build: 57 canonical pages and 404 sharing views. Existing bundle-size warning remains.
- Passed: check-prerender, check-release, check-route-browsing, check-route-catalog, check-related-expeditions, check-saved-items and check-watch-comparison-picks.
- Local HTTP check: all 57 page heads, sharing metadata, sitemap and existing aliases.
- Browser: desktop and emulated widths down to 320 px; expedition cards, route list and map panel have no observed horizontal overflow. Timeline, related cards and homepage counters checked as well.
- Two-route selection, disabled third comparison choice, bookmark toggle/restoration, keyboard route selection, map switch, browser Back and shortest-distance sorting checked. No observed page errors.
- Phone sizes are emulated; no physical-device test.

Preview: `/wyprawy`, `/trasy?widok=lista`, `/trasy`.

Earlier unpublished work and deferred Romania remain in their existing separate checkouts and are excluded from this release.
