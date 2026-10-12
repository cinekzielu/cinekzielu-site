# Photo viewer

Local, unpublished follow-up to PR158, alongside the accepted film-library filters.

The shared viewer supports fit, 2x and 3x display scaling, double-click toggle, mouse drag and native touch scrolling while enlarged. Arrow keys pan at zoom and navigate photos at fit. Explicit previous/next controls remain available at every scale; switching photo resets zoom and the shared-link field. Escape closes the dialog and restores page scrolling and the original button focus. Existing web-size images are used; no camera originals are exposed.

Gallery pages and photography/collection pages enable links with a stable asset-based zdjecie query parameter. Links retain other query parameters such as kolekcja. Unknown ids are ignored. Direct links open the chosen photo; navigating updates an existing photo parameter, and closing removes it. Normal photo opening does not add browser history entries. The copy action always exposes a selected read-only field, even when clipboard access fails. Embedded story/frame grids retain zoom but do not compete for deep-link handling.

Validation: build, all 19 check scripts, 37 local HTTP pages; desktop 1280px and emulated 390/320px. Mouse drag, keyboard pan, zoom limits/reset/double-click, gallery and portfolio links, selected copy field, Escape/scroll/focus and embedded Morocco frames checked. Physical touch gestures and system clipboard paste were not independently verified. No observed console errors.

## Photo inquiries

A discreet Zapytaj o zdjęcie mailto link is available for photographs in the existing photo galleries, including portfolio and story selections. Source gallery lookup provides a canonical production URL with stable photo id, independent of current portfolio filters/local preview. Recipient uses author.email. Video frames have no inquiry link. No prices, commerce, outgoing messages or form service added. Build, all-photo link checks and desktop/320px responsive checks passed; mail application not launched and no email sent.
